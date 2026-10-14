\set ON_ERROR_STOP on
DO $test$
BEGIN
  IF (SELECT count(*) FROM knowledge_private.audit WHERE workspace_id='tenant-aaaa' AND operation='search') < 1 THEN
    RAISE EXCEPTION 'Tenant A search must be audited';
  END IF;
  IF (SELECT count(*) FROM knowledge_private.audit WHERE workspace_id='tenant-aaaa' AND operation='list') <> 1 THEN
    RAISE EXCEPTION 'Tenant A listing audit missing';
  END IF;
  IF (SELECT count(*) FROM knowledge_private.audit WHERE workspace_id='tenant-aaaa' AND operation='export') <> 1 THEN
    RAISE EXCEPTION 'Tenant A authorized source export must be audited';
  END IF;
  IF (SELECT count(*) FROM knowledge_private.audit WHERE workspace_id='tenant-aaaa' AND operation='delete') <> 1 THEN
    RAISE EXCEPTION 'Tenant A deletion audit missing';
  END IF;
  IF (SELECT count(*) FROM knowledge_private.audit WHERE workspace_id='tenant-bbbb' AND operation='delete') <> 0 THEN
    RAISE EXCEPTION 'Tenant B deletion audit must not appear';
  END IF;
  IF EXISTS (SELECT 1 FROM knowledge_private.documents WHERE workspace_id='tenant-aaaa' AND source_id='same-source') THEN
    RAISE EXCEPTION 'Tenant A deleted source must have no remaining versions';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM knowledge_private.documents WHERE workspace_id='tenant-aaaa' AND source_id='doc-one') THEN
    RAISE EXCEPTION 'Tenant A unrelated source was deleted';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM knowledge_private.documents WHERE workspace_id='tenant-bbbb') THEN
    RAISE EXCEPTION 'Tenant B source was deleted by another workspace';
  END IF;
END;
$test$;
