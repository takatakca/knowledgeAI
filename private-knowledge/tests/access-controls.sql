\set ON_ERROR_STOP on
-- Synthetic test control-plane state, written by migration owner only.
INSERT INTO knowledge_private.workspace_entitlements
  (workspace_id,enabled,allow_read,allow_write,allow_delete,allow_export)
VALUES
  ('tenant-aaaa',true,true,true,true,true),
  ('tenant-bbbb',true,true,true,true,true),
  ('tenant-cccc',false,true,true,true,true),
  ('tenant-dddd',true,true,false,false,false);
INSERT INTO knowledge_private.revoked_tokens(workspace_id,jti,expires_at)
VALUES('tenant-aaaa','ci-revoked-credential-000001',now()+interval '1 hour');
