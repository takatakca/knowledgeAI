-- Scope-protected version export audit event, after migration 002.
BEGIN;
ALTER TABLE knowledge_private.audit DROP CONSTRAINT IF EXISTS audit_operation_valid;
ALTER TABLE knowledge_private.audit
  ADD CONSTRAINT audit_operation_valid CHECK (operation IN ('ingest','search','list','delete','export'));
COMMIT;
