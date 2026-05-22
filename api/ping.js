module.exports = function handler(request, response) {
  response.writeHead(200, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });

  response.end(JSON.stringify({
    ok: true,
    message: "api online",
    timestamp: "2026-05-21T21:05:00-03:00",
    hasSupabaseUrl: Boolean(process.env.SUPABASE_URL),
    hasSupabaseKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY),
    hasAdminPassword: Boolean(process.env.ADMIN_PASSWORD),
    hasAdminToken: Boolean(process.env.ADMIN_TOKEN)
  }));
};
