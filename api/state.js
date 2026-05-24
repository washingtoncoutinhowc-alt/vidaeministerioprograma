const STATE_KEY = "programacao";

function json(response, status, data) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.end(JSON.stringify(data));
}

async function readBody(request) {
  if (request.body && typeof request.body === "object" && !Buffer.isBuffer(request.body)) {
    return JSON.stringify(request.body);
  }

  if (typeof request.body === "string") {
    return request.body;
  }

  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

function supabaseHeaders() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  if (!process.env.SUPABASE_URL || !key) throw new Error("Supabase nao configurado");
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json"
  };
}

async function getState(response) {
  const url = `${process.env.SUPABASE_URL}/rest/v1/app_state?key=eq.${encodeURIComponent(STATE_KEY)}&select=value&limit=1`;
  const result = await fetch(url, { headers: supabaseHeaders() });
  if (!result.ok) {
    const detail = await result.text().catch(() => "");
    throw new Error(`Falha ao ler Supabase: ${result.status} ${detail}`);
  }
  const rows = await result.json();
  if (!rows.length) {
    json(response, 200, { ok: true, empty: true });
    return;
  }
  json(response, 200, rows[0].value);
}

async function saveState(request, response) {
  const token = (request.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!token || token !== process.env.ADMIN_TOKEN) return json(response, 403, { ok: false });

  const body = await readBody(request);
  const value = JSON.parse(body);
  const url = `${process.env.SUPABASE_URL}/rest/v1/app_state?on_conflict=key`;
  const result = await fetch(url, {
    method: "POST",
    headers: {
      ...supabaseHeaders(),
      Prefer: "resolution=merge-duplicates,return=representation"
    },
    body: JSON.stringify({ key: STATE_KEY, value })
  });
  if (!result.ok) {
    const detail = await result.text().catch(() => "");
    throw new Error(`Falha ao salvar Supabase: ${result.status} ${detail}`);
  }
  const savedRows = await result.json().catch(() => []);
  if (!Array.isArray(savedRows) || !savedRows.length) throw new Error("Supabase aceitou, mas nao confirmou a gravacao.");
  json(response, 200, { ok: true, saved: true, key: STATE_KEY });
}

module.exports = async function handler(request, response) {
  try {
    if (request.method === "GET") return getState(response);
    if (request.method === "POST") return saveState(request, response);
    json(response, 405, { ok: false });
  } catch (error) {
    json(response, 500, { ok: false, message: error.message });
  }
};
