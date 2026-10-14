"use strict";
const { createHash } = require("node:crypto");
const { AccessError } = require("./auth.cjs");
class InputError extends Error {
  constructor(message) { super(message); this.status = 400; }
}
function textField(value, name, max) {
  if (typeof value !== "string" || !value.trim() ||
      Buffer.byteLength(value, "utf8") > max || value.includes("\0")) {
    throw new InputError("Invalid " + name);
  }
  return value.trim();
}
function validateDocument(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new InputError("Invalid document");
  }
  const sourceId = textField(body.source_id, "source_id", 240);
  const title = textField(body.title, "title", 250);
  const content = textField(body.content, "content", 65536);
  const sourceUrl = textField(body.source_url, "source_url", 2048);
  let parsed;
  try { parsed = new URL(sourceUrl); } catch { throw new InputError("Invalid source_url"); }
  if (parsed.protocol !== "https:" || parsed.username || parsed.password ||
      parsed.hash || !parsed.hostname) throw new InputError("Invalid source_url");
  return { sourceId, title, content, sourceUrl,
    hash: createHash("sha256").update(content, "utf8").digest("hex") };
}
function validateSearch(query) {
  if (!query || typeof query.q !== "string" || query.q.length > 120 ||
      typeof query.limit !== "string" || !/^(?:[1-9]|[1-4]\d|50)$/.test(query.limit)) {
    throw new InputError("Invalid search parameters");
  }
  return { q: query.q.trim(), limit: Number(query.limit) };
}
async function withTenant(pool, principal, action) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // Transaction local: connections returned to the pool cannot leak tenant state.
    await client.query("SELECT set_config('knowledge_private.workspace_id', $1, true)",
      [principal.workspace]);
    await client.query("SELECT set_config('statement_timeout', '5000', true)");
    const result = await action(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    try { await client.query("ROLLBACK"); } catch { /* preserve original error */ }
    throw error;
  } finally { client.release(); }
}
function createService(pool, verify) {
  if (!pool || typeof pool.connect !== "function" || typeof verify !== "function") {
    throw new Error("Private knowledge dependencies are unavailable");
  }
  return {
    async ingest(token, body) {
      const principal = await verify(token, "knowledge:write");
      const doc = validateDocument(body);
      return withTenant(pool, principal, async client => {
        const receipt = await client.query(
          "INSERT INTO knowledge_private.write_receipts (workspace_id,jti,actor_id) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING RETURNING jti",
          [principal.workspace,principal.jti,principal.actor]);
        if (receipt.rowCount !== 1) throw new AccessError("Write credential already used", 409);
        const inserted = await client.query(
          "INSERT INTO knowledge_private.documents (workspace_id,source_id,title,body,source_url,sha256,created_by) VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (workspace_id,source_id,sha256) DO NOTHING RETURNING id",
          [principal.workspace,doc.sourceId,doc.title,doc.content,doc.sourceUrl,doc.hash,principal.actor]);
        await client.query(
          "INSERT INTO knowledge_private.audit (workspace_id,actor_id,operation,source_id) VALUES ($1,$2,'ingest',$3)",
          [principal.workspace,principal.actor,doc.sourceId]);
        return { inserted: inserted.rowCount === 1, source_id: doc.sourceId, sha256: doc.hash };
      });
    },
    async search(token, query) {
      const principal = await verify(token, "knowledge:read");
      const input = validateSearch(query);
      return withTenant(pool, principal, async client => {
        const statement = [
          "WITH latest AS (",
          "SELECT DISTINCT ON (source_id) source_id,title,body,source_url,sha256,created_at,id",
          "FROM knowledge_private.documents ORDER BY source_id,created_at DESC,id DESC",
          ") SELECT source_id,title,left(body,500) AS excerpt,source_url,sha256,created_at",
          "FROM latest WHERE ($1 = '' OR",
          "to_tsvector('simple',title || ' ' || body) @@ websearch_to_tsquery('simple',$1))",
          "ORDER BY created_at DESC,source_id LIMIT $2"
        ].join(" ");
        const found = await client.query(statement, [input.q,input.limit]);
        await client.query(
          "INSERT INTO knowledge_private.audit (workspace_id,actor_id,operation,source_id) VALUES ($1,$2,'search','__search__')",
          [principal.workspace,principal.actor]);
        return { visibility: "private", results: found.rows };
      });
    },
    async listSources(token, query) {
      const principal = await verify(token, "knowledge:read");
      const limit = validateSearch({q:"",limit:query.limit}).limit;
      return withTenant(pool, principal, async client => {
        const found = await client.query([
          "WITH latest AS (SELECT DISTINCT ON (source_id)",
          "source_id,title,source_url,sha256,created_at,id",
          "FROM knowledge_private.documents ORDER BY source_id,created_at DESC,id DESC)",
          "SELECT source_id,title,source_url,sha256,created_at",
          "FROM latest ORDER BY source_id LIMIT $1"
        ].join(" "),[limit]);
        await client.query(
          "INSERT INTO knowledge_private.audit (workspace_id,actor_id,operation,source_id) VALUES ($1,$2,'list','__listing__')",
          [principal.workspace,principal.actor]);
        return { visibility:"private", results:found.rows };
      });
    },
    async deleteSource(token, sourceId) {
      const principal = await verify(token, "knowledge:delete");
      const source = textField(sourceId, "source_id", 240);
      return withTenant(pool, principal, async client => {
        const receipt = await client.query(
          "INSERT INTO knowledge_private.write_receipts (workspace_id,jti,actor_id) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING RETURNING jti",
          [principal.workspace,principal.jti,principal.actor]);
        if(receipt.rowCount !== 1) throw new AccessError("Write credential already used",409);
        const deleted = await client.query(
          "DELETE FROM knowledge_private.documents WHERE source_id = $1",
          [source]);
        await client.query(
          "INSERT INTO knowledge_private.audit (workspace_id,actor_id,operation,source_id) VALUES ($1,$2,'delete',$3)",
          [principal.workspace,principal.actor,source]);
        return { deleted:deleted.rowCount, source_id:source };
      });
    }
  };
}
module.exports = { createService, validateDocument, validateSearch, InputError };
