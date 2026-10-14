-- PRIVATE PostgreSQL only. Application role must not own tables or have BYPASSRLS.
BEGIN;
CREATE SCHEMA IF NOT EXISTS knowledge_private;
REVOKE ALL ON SCHEMA knowledge_private FROM PUBLIC;
CREATE TABLE IF NOT EXISTS knowledge_private.documents (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  workspace_id text NOT NULL CHECK(length(workspace_id) BETWEEN 8 AND 64),
  source_id text NOT NULL CHECK(length(source_id) BETWEEN 1 AND 240),
  title text NOT NULL,
  body text NOT NULL,
  source_url text NOT NULL,
  sha256 text NOT NULL CHECK(sha256 ~ '^[0-9a-f]{64}$'),
  created_by text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(workspace_id,source_id,sha256)
);
CREATE INDEX IF NOT EXISTS knowledge_doc_search_idx
  ON knowledge_private.documents USING gin(to_tsvector('simple',title || ' ' || body));
CREATE INDEX IF NOT EXISTS knowledge_doc_tenant_idx
  ON knowledge_private.documents(workspace_id,source_id,created_at DESC);
CREATE TABLE IF NOT EXISTS knowledge_private.write_receipts (
  workspace_id text NOT NULL, jti text NOT NULL, actor_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(workspace_id,jti)
);
CREATE TABLE IF NOT EXISTS knowledge_private.audit (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  workspace_id text NOT NULL, actor_id text NOT NULL, source_id text NOT NULL,
  operation text NOT NULL CHECK(operation IN ('ingest')),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE knowledge_private.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_private.documents FORCE ROW LEVEL SECURITY;
ALTER TABLE knowledge_private.write_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_private.write_receipts FORCE ROW LEVEL SECURITY;
ALTER TABLE knowledge_private.audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_private.audit FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_documents ON knowledge_private.documents;
CREATE POLICY tenant_documents ON knowledge_private.documents
  USING(workspace_id = current_setting('knowledge_private.workspace_id',true))
  WITH CHECK(workspace_id = current_setting('knowledge_private.workspace_id',true));
DROP POLICY IF EXISTS tenant_receipts ON knowledge_private.write_receipts;
CREATE POLICY tenant_receipts ON knowledge_private.write_receipts
  USING(workspace_id = current_setting('knowledge_private.workspace_id',true))
  WITH CHECK(workspace_id = current_setting('knowledge_private.workspace_id',true));
DROP POLICY IF EXISTS tenant_audit ON knowledge_private.audit;
CREATE POLICY tenant_audit ON knowledge_private.audit
  USING(workspace_id = current_setting('knowledge_private.workspace_id',true))
  WITH CHECK(workspace_id = current_setting('knowledge_private.workspace_id',true));
-- No grants to PUBLIC/anon/authenticated. Provision separate non-owner login.
COMMIT;
