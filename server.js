const http = require("http");
const fs = require("fs/promises");
const path = require("path");

const PORT = Number(process.env.PORT || 4182);
const HOST = process.env.HOST || "0.0.0.0";
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, "data");
const STATE_FILE = path.join(DATA_DIR, "state.json");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "vida2026";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "local-admin-token";

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp"
};

async function readBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

async function sendState(response) {
  try {
    const data = await fs.readFile(STATE_FILE, "utf8");
    response.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    });
    response.end(data);
  } catch {
    response.writeHead(204, { "Cache-Control": "no-store" });
    response.end();
  }
}

async function saveState(request, response) {
  const address = request.socket.remoteAddress || "";
  const local = address === "127.0.0.1" || address === "::1" || address.endsWith(":127.0.0.1");
  const token = (request.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!local && token !== ADMIN_TOKEN) {
    response.writeHead(403, { "Content-Type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ ok: false }));
    return;
  }
  const body = await readBody(request);
  JSON.parse(body);
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(STATE_FILE, body, "utf8");
  response.writeHead(200, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify({ ok: true }));
}

async function loginAdmin(request, response) {
  const body = JSON.parse(await readBody(request) || "{}");
  if (body.password !== ADMIN_PASSWORD) {
    response.writeHead(401, { "Content-Type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ ok: false }));
    return;
  }
  response.writeHead(200, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify({ ok: true, token: ADMIN_TOKEN }));
}

async function sendFile(request, response) {
  const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);
  const requestedPath = url.pathname === "/" ? "index.html" : decodeURIComponent(url.pathname.slice(1));
  const filePath = path.normalize(path.join(ROOT, requestedPath));
  if (!filePath.startsWith(ROOT)) throw new Error("blocked");
  if (filePath.startsWith(DATA_DIR)) throw new Error("blocked");
  const data = await fs.readFile(filePath);
  response.writeHead(200, {
    "Content-Type": types[path.extname(filePath).toLowerCase()] || "application/octet-stream",
    "Cache-Control": "no-store"
  });
  response.end(data);
}

const server = http.createServer(async (request, response) => {
  try {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (request.method === "OPTIONS") {
      response.writeHead(204);
      response.end();
      return;
    }
    if (request.url.startsWith("/api/state") && request.method === "GET") return sendState(response);
    if (request.url.startsWith("/api/state") && request.method === "POST") return saveState(request, response);
    if (request.url.startsWith("/api/login") && request.method === "POST") return loginAdmin(request, response);
    if (request.method !== "GET") {
      response.writeHead(405);
      response.end("Method not allowed");
      return;
    }
    await sendFile(request, response);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Vidministerio aberto em http://localhost:${PORT}`);
});
