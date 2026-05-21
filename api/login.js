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

module.exports = async function handler(request, response) {
  try {
    if (request.method !== "POST") return json(response, 405, { ok: false });
    const body = JSON.parse(await readBody(request) || "{}");
    const password = process.env.ADMIN_PASSWORD;
    const token = process.env.ADMIN_TOKEN;
    if (!password || !token) return json(response, 500, { ok: false, message: "Admin nao configurado" });
    if (body.password !== password) return json(response, 401, { ok: false });
    json(response, 200, { ok: true, token });
  } catch {
    json(response, 400, { ok: false });
  }
};
