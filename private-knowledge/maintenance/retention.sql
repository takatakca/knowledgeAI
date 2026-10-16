\set ON_ERROR_STOP on
-- PRIVILEGED OPERATOR ONLY. Never use a private HTTP runtime login.
-- Preview is default. Apply needs BOTH -v apply=true -v approved=true.
-- Fixed synthetic-safe lower bounds: quota 48h, receipt 24h, revoked >24h after expiration.
-- Audit, documents and active entitlements are NEVER touched by this script.
\if :{?apply}
\else
  \set apply false
\endif
\if :{?approved}
\else
  \set approved false
\endif

BEGIN;
SET LOCAL row_security = off;
SET LOCAL lock_timeout = '3s';
SET LOCAL statement_timeout = '30s';

DO $guard$
DECLARE who text;
BEGIN
  SELECT current_user INTO who;
  IF NOT EXISTS (
    SELECT 1 FROM pg_roles WHERE rolname=who AND (rolsuper OR rolbypassrls)
  ) THEN
    RAISE EXCEPTION 'Retention requires independently authorized operator role with RLS bypass';
  END IF;
  IF NOT pg_try_advisory_xact_lock(69201, 501) THEN
    RAISE EXCEPTION 'A private retention maintenance operation is already running';
  END IF;
END;
$guard$;

SELECT 'request_windows' AS artifact, count(*) AS eligible
  FROM knowledge_private.request_windows
  WHERE bucket_minute < CURRENT_TIMESTAMP - INTERVAL '48 hours'
UNION ALL
SELECT 'write_receipts', count(*)
  FROM knowledge_private.write_receipts
  WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '24 hours'
UNION ALL
SELECT 'revoked_tokens', count(*)
  FROM knowledge_private.revoked_tokens
  WHERE expires_at < CURRENT_TIMESTAMP - INTERVAL '24 hours';

\if :apply
  \if :approved
    \echo 'EXPLICIT APPROVAL RECEIVED: applying bounded retention batch'
    WITH chosen AS (
      SELECT ctid FROM knowledge_private.request_windows
       WHERE bucket_minute < CURRENT_TIMESTAMP - INTERVAL '48 hours'
       LIMIT 500 FOR UPDATE SKIP LOCKED
    ), deleted AS (
      DELETE FROM knowledge_private.request_windows t USING chosen c
       WHERE t.ctid=c.ctid RETURNING 1
    ) SELECT 'request_windows' AS artifact,count(*) AS removed FROM deleted;

    WITH chosen AS (
      SELECT ctid FROM knowledge_private.write_receipts
       WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '24 hours'
       LIMIT 500 FOR UPDATE SKIP LOCKED
    ), deleted AS (
      DELETE FROM knowledge_private.write_receipts t USING chosen c
       WHERE t.ctid=c.ctid RETURNING 1
    ) SELECT 'write_receipts' AS artifact,count(*) AS removed FROM deleted;

    WITH chosen AS (
      SELECT ctid FROM knowledge_private.revoked_tokens
       WHERE expires_at < CURRENT_TIMESTAMP - INTERVAL '24 hours'
       LIMIT 500 FOR UPDATE SKIP LOCKED
    ), deleted AS (
      DELETE FROM knowledge_private.revoked_tokens t USING chosen c
       WHERE t.ctid=c.ctid RETURNING 1
    ) SELECT 'revoked_tokens' AS artifact,count(*) AS removed FROM deleted;
  \else
    \echo 'DENIED: apply=true requires separate approved=true flag'
    \quit 3
  \endif
\else
  \echo 'DRY RUN ONLY: no rows deleted'
\endif

COMMIT;
