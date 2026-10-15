-- Run after 001, 002, 003 as a migration owner. Defaults deny every workspace.
-- Only the approved TAKATAK authorization control plane may provision/revoke rows.
BEGIN;
CREATE TABLE IF NOT EXISTS knowledge_private.workspace_entitlements (
  workspace_id text PRIMARY KEY CHECK (workspace_id ~ '^[A-Za-z0-9_-]{8,64}$'),
  enabled boolean NOT NULL DEFAULT false,
  allow_read boolean NOT NULL DEFAULT false,
  allow_write boolean NOT NULL DEFAULT false,
  allow_delete boolean NOT NULL DEFAULT false,
  allow_export boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS knowledge_private.revoked_tokens (
  workspace_id text NOT NULL CHECK (workspace_id ~ '^[A-Za-z0-9_-]{8,64}$'),
  jti text NOT NULL CHECK (jti ~ '^[A-Za-z0-9._:-]{16,128}$'),
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(workspace_id,jti)
);
CREATE INDEX IF NOT EXISTS private_revocation_expiry_idx
  ON knowledge_private.revoked_tokens (expires_at);
ALTER TABLE knowledge_private.workspace_entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_private.workspace_entitlements FORCE ROW LEVEL SECURITY;
ALTER TABLE knowledge_private.revoked_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_private.revoked_tokens FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS access_current_workspace ON knowledge_private.workspace_entitlements;
CREATE POLICY access_current_workspace ON knowledge_private.workspace_entitlements
 FOR SELECT USING (workspace_id = current_setting('knowledge_private.workspace_id',true));
DROP POLICY IF EXISTS revocations_current_workspace ON knowledge_private.revoked_tokens;
CREATE POLICY revocations_current_workspace ON knowledge_private.revoked_tokens
 FOR SELECT USING (workspace_id = current_setting('knowledge_private.workspace_id',true));
-- No public grants. Runtime SELECT grants are applied separately to a non-owner role.
-- Runtime must NEVER get INSERT/UPDATE/DELETE permissions on either control table.
COMMIT;
