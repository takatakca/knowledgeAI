-- Private source lifecycle, auditable reads and deletions. Apply AFTER 001.
BEGIN;
ALTER TABLE knowledge_private.audit DROP CONSTRAINT IF EXISTS audit_operation_check;
ALTER TABLE knowledge_private.audit DROP CONSTRAINT IF EXISTS audit_operation_valid;
ALTER TABLE knowledge_private.audit
  ADD CONSTRAINT audit_operation_valid CHECK (operation IN ('ingest','search','list','delete'));
COMMIT;
