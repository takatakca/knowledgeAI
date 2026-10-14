"use strict";
const http = require("node:http");
const { createVerifier, AccessError } = require("./auth.cjs");
const { createService } = require("./service.cjs");

function settings(env = process.env) {
  const required = ["PRIVATE_DATABASE_URL","KNOWLEDGE_JWT_ISSUER",
    "KNOWLEDGE_JWT_AUDIENCE","KNOWLEDGE_JWKS_URL"];
  if (required.some(key => !env[key])) throw new Error("Private KnowledgeAI configuration missing");
  const port = Number(env.PRIVATE_PORT || 8301);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("Invalid port");
  const jwksUrl = new URL(env.KNOWLEDGE_JWKS_URL);
  if (jwksUrl.protocol !== "https:") throw new Error("JWKS requires HTTPS");
  return {
    connectionString: env.PRIVATE_DATABASE_URL,
    issuer: env.KNOWLEDGE_JWT_ISSUER,
    audience: env.KNOWLEDGE_JWT_AUDIENCE,
    jwksUrl: jwksUrl.toString(),
    port
  };
}
function send(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    "Content-Type":"application/json; charset=utf-8", "Content-Length":Buffer.byteLength(body),
    "X-Content-Type-Options":"nosniff","Cache-Control":"no-store",
    "Cross-Origin-Resource-Policy":"same-origin"
  });
  res.end(body);
}
async function parseBody(req) {
  const contentType = req.headers["content-type"] || "";
  if (!/^application\/json(?:\s*;|$)/i.test(contentType)) {
    const err = new Error("JSON content type required"); err.status = 415; throw err;
  }
  let total = 0; const chunks = [];
  for await (const piece of req) {
    total += piece.length;
    if (total > 72000) {
      const err = new Error("Request exceeds 72KB"); err.status = 413; throw err;
    }
    chunks.push(piece);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")); }
  catch { const err = new Error("Malformed JSON"); err.status = 400; throw err; }
}
function createServer(service, pool) {
  const server = http.createServer(async (req,res) => {
    try {
      const url = new URL(req.url || "/", "http://localhost");
      if (url.pathname === "/healthz" && req.method === "GET") {
        await pool.query("SELECT 1");
        return send(res,200,{status:"ok",service:"knowledge-private"});
      }
      if (url.pathname === "/healthz") return send(res,405,{error:"Method not allowed"});
      const auth = req.headers.authorization || "";
      const match = /^Bearer ([A-Za-z0-9._-]+)$/.exec(auth);
      if (!match) return send(res,401,{error:"Unauthorized"});
      if (url.pathname === "/v1/knowledge/documents" && req.method === "POST") {
        const body = await parseBody(req);
        return send(res,200,await service.ingest(match[1],body));
      }
      if (url.pathname === "/v1/knowledge/search" && req.method === "GET") {
        if (url.searchParams.getAll("q").length > 1 ||
            url.searchParams.getAll("limit").length > 1) {
          return send(res,400,{error:"Duplicate query parameter"});
        }
        return send(res,200,await service.search(match[1],{
          q:url.searchParams.get("q") || "",limit:url.searchParams.get("limit") || "20",
          offset:url.searchParams.get("offset") || "0"
        }));
      }
      if (url.pathname === "/v1/knowledge/sources" && req.method === "GET") {
        if (url.searchParams.getAll("limit").length > 1 ||
            url.searchParams.getAll("offset").length > 1 ||
            url.searchParams.has("source_id")) {
          return send(res,400,{error:"Invalid query parameters"});
        }
        return send(res,200,await service.listSources(match[1],{
          limit:url.searchParams.get("limit") || "20"
        }));
      }
      if (url.pathname === "/v1/knowledge/sources" && req.method === "DELETE") {
        if (url.searchParams.getAll("source_id").length !== 1 ||
            url.searchParams.has("limit")) {
          return send(res,400,{error:"Invalid source identifier"});
        }
        return send(res,200,await service.deleteSource(match[1],
          url.searchParams.get("source_id")));
      }
      if (url.pathname === "/v1/knowledge/export" && req.method === "GET") {
        if (url.searchParams.getAll("source_id").length !== 1 ||
            url.searchParams.getAll("limit").length > 1 ||
            url.searchParams.getAll("offset").length > 1) {
          return send(res,400,{error:"Invalid export parameters"});
        }
        return send(res,200,await service.exportSource(match[1],
          url.searchParams.get("source_id"),{
            limit:url.searchParams.get("limit") || "10",
            offset:url.searchParams.get("offset") || "0"
          }));
      }
      return send(res,404,{error:"Not found"});
    } catch (error) {
      const code = Number.isInteger(error.status) && error.status >= 400 &&
        error.status < 500 ? error.status : 503;
      // Never return database messages, tokens, source bodies or stack traces.
      return send(res,code,{error: code === 503 ? "Service unavailable" :
        (error instanceof AccessError ? error.message : "Invalid request")});
    }
  });
  server.requestTimeout = 15000;
  server.headersTimeout = 10000;
  server.keepAliveTimeout = 5000;
  server.maxRequestsPerSocket = 100;
  return server;
}
async function boot() {
  const config = settings();
  const { Pool } = require("pg");
  const pool = new Pool({
    connectionString:config.connectionString,ssl:{rejectUnauthorized:true},max:10,
    connectionTimeoutMillis:5000, idleTimeoutMillis:20000
  });
  // Refuse privileged pool users: database RLS requires a distinct non-owner login.
  const state = await pool.query("SELECT rolsuper,rolbypassrls FROM pg_roles WHERE rolname = current_user");
  if (state.rows.length !== 1 || state.rows[0].rolsuper || state.rows[0].rolbypassrls) {
    await pool.end(); throw new Error("Private database runtime role is privileged");
  }
  const verify = createVerifier({issuer:config.issuer,audience:config.audience,
    jwksUrl:config.jwksUrl});
  const server = createServer(createService(pool,verify),pool);
  server.listen(config.port,"127.0.0.1");
  const shutdown = () => server.close(() => { pool.end().catch(()=>{}); });
  process.once("SIGTERM",shutdown); process.once("SIGINT",shutdown);
}
if (require.main === module) boot().catch(() => {
  // Configuration failures must never leak DSNs, tokens or other env values.
  process.stderr.write("Private knowledge service failed to start safely\n");
  process.exitCode = 1;
});
module.exports = { createServer, parseBody, settings };
