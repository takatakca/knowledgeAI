-- Private ingestion provenance. Only a trusted TAKATAK authorization operator
-- may create/change approvals; normal service login has SELECT only.
BEGIN;
CREATE TABLE IF NOT EXISTS knowledge_private.source_approvals (
  workspace_id text NOT NULL CHECK (workspace_id ~ '^[A-Za-z0-9_-]{8,64}$'),
  source_id text NOT NULL CHECK (length(source_id) BETWEEN 1 AND 240),
  source_url text NOT NULL CHECK (length(source_url) BETWEEN 1 AND 2048 AND source_url LIKE 'https://%'),
  classification text NOT NULL CHECK (classification IN ('public','internal','restricted')),
  approved boolean NOT NULL DEFAULT false,
  approved_by text NOT NULL,
  approved_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  PRIMARY KEY(workspace_id, source_id),
  CONSTRAINT source_approval_expiry CHECK (expires_at > approved_at)
);
CREATE INDEX IF NOT EXISTS knowledge_source_approval_expiry_idx
  ON knowledge_private.source_approvals (expires_at);
ALTER TABLE knowledge_private.source_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_private.source_approvals FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS source_approval_current_workspace ON knowledge_private.source_approvals;
CREATE POLICY source_approval_current_workspace
  ON knowledge_private.source_approvals FOR SELECT
  USING (workspace_id = current_setting('knowledge_private.workspace_id',true));
-- No INSERT/UPDATE/DELETE policy. No grants to PUBLIC or app role.
COMMIT;
