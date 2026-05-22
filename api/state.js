module.exports = async function handler(request, response) {
  const send = (status, data) => {
    response.writeHead(status, {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    });
    response.end(JSON.stringify(data));
  };

  try {
    const supabaseUrl = String(process.env.SUPABASE_URL || "").replace(/\/$/, "");
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return send(200, {
        ok: false,
        message: "Supabase nao configurado",
        hasSupabaseUrl: Boolean(supabaseUrl),
        hasSupabaseKey: Boolean(supabaseKey)
      });
    }

    const headers = {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json"
    };

    if (request.method === "GET") {
      const url = `${supabaseUrl}/rest/v1/app_state?key=eq.programacao&select=value&limit=1`;
      const result = await fetch(url, { headers });
      const text = await result.text();

      if (!result.ok) {
        return send(200, {
          ok: false,
          message: "Falha ao ler Supabase",
          status: result.status,
          detail: text
        });
      }

      const rows = text ? JSON.parse(text) : [];
      if (!rows.length) return send(200, { ok: true, empty: true });
      return send(200, rows[0].value);
    }

    if (request.method === "POST") {
      const token = String(request.headers.authorization || "").replace(/^Bearer\s+/i, "");
      if (!token || token !== process.env.ADMIN_TOKEN) {
        return send(403, { ok: false, message: "Token de administrador invalido" });
      }

      const value = request.body && typeof request.body === "object"
        ? request.body
        : JSON.parse(request.body || "{}");

      const result = await fetch(`${supabaseUrl}/rest/v1/app_state?key=eq.programacao`, {
        method: "PATCH",
        headers: {
          ...headers,
          Prefer: "return=minimal"
        },
        body: JSON.stringify({ value })
      });

      if (result.status === 204) return send(200, { ok: true });

      const insertResult = await fetch(`${supabaseUrl}/rest/v1/app_state`, {
        method: "POST",
        headers: {
          ...headers,
          Prefer: "return=minimal"
        },
        body: JSON.stringify({ key: "programacao", value })
      });

      if (!insertResult.ok && insertResult.status !== 201) {
        const detail = await insertResult.text();
        return send(200, {
          ok: false,
          message: "Falha ao salvar Supabase",
          status: insertResult.status,
          detail
        });
      }

      return send(200, { ok: true });
    }

    return send(405, { ok: false, message: "Metodo nao permitido" });
  } catch (error) {
    return send(200, {
      ok: false,
      message: error && error.message ? error.message : String(error)
    });
  }
};
