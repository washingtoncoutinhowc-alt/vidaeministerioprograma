function json(response, status, data) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(data));
}

async function readBody(request) {
  if (request.body && typeof request.body === "object" && !Buffer.isBuffer(request.body)) {
    return request.body;
  }

  if (typeof request.body === "string") {
    return request.body;
  }

  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

function parseBody(rawBody) {
  if (!rawBody) return {};
  if (typeof rawBody === "object") return rawBody;
  try {
    return JSON.parse(rawBody);
  } catch {
    return {};
  }
}

module.exports = async function handler(request, response) {
  try {
    const password = String(process.env.ADMIN_PASSWORD || "").trim();
    const token = String(process.env.ADMIN_TOKEN || "").trim();

    if (request.method === "GET") {
      return json(response, 200, {
        ok: true,
        message: "login online",
        hasAdminPassword: Boolean(password),
        hasAdminToken: Boolean(token),
        passwordLength: password.length
      });
    }

    if (request.method !== "POST") {
      return json(response, 405, { ok: false, message: "Metodo nao permitido" });
    }

    const body = parseBody(await readBody(request));
    const typedPassword = String(body.password || "").trim();

    if (!password || !token) {
      return json(response, 200, { ok: false, message: "Admin nao configurado" });
    }

    if (typedPassword !== password) {
      return json(response, 200, {
        ok: false,
        message: "Senha incorreta",
        receivedLength: typedPassword.length,
        expectedLength: password.length
      });
    }

    return json(response, 200, { ok: true, token });
  } catch (error) {
    return json(response, 200, {
      ok: false,
      message: error && error.message ? error.message : String(error)
    });
  }
};
