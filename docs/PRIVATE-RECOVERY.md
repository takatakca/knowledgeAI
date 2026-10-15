# KnowledgeAI — private PostgreSQL recovery

Status: **synthetic PostgreSQL restore rehearsal verified in CI (2026-10-15)**.
**No production backup storage, encryption keys, remote retention or RPO/RTO are configured.**

## What is actually tested

Private Knowledge Security CI uses PostgreSQL 17 with synthetic two-tenant fixtures.
After the authenticated API tests, the workflow generates a custom-format archive
with `pg_dump -Fc`, restores it into a second disposable database with `pg_restore --no-owner --exit-on-error`,
then executes `private-knowledge/tests/restore.sql` as the schema owner and
tenant-scoped queries as the restricted application role.

The restore regression verifies:

- Five private tables retain FORCE RLS, with runtime access limited by workspace.
- Existing tenant A and tenant B records are restored in their own scope.
- Previously deleted source revisions do not reappear after recovery.
- Revoked JWTs, disabled entitlements and audit events remain present.
- PostgreSQL tenant-scoped runtime grants still operate after recovery.
- The temporary archive is deleted and is never committed or uploaded.

## Still required for production

1. Approve an independent confidential PostgreSQL database and authorized backup operator.
2. Configure encrypted offsite copies, independently protected keys and WAL/PITR.
3. Approve recovery-point, recovery-time, retention, deletion and legal-hold policies.
4. Repeat a real restoration drill in an isolated private environment with proper
   migration owner/runtime role separation, TLS and cross-company denial checks.
5. Document restoration evidence privately (archive identity, date, migrations,
   measured RPO/RTO, integrity evidence) without exposing customer data in GitHub.
6. Ensure deleted customer data ages out of snapshots according to approved policy.

## Local disposable CI equivalent

```sh
pg_dump -U postgres -d knowledgeci -Fc > knowledge-private-rehearsal.dump
createdb -U postgres knowledge_restore_ci
pg_restore -U postgres -d knowledge_restore_ci --no-owner --exit-on-error < knowledge-private-rehearsal.dump
psql -v ON_ERROR_STOP=1 -U postgres -d knowledge_restore_ci -f private-knowledge/tests/restore.sql
```

These commands operate on **synthetic fixtures only**. They are NOT a production
backup recipe: they lack encryption, offsite replication, scheduler, retention
and recovery-authority controls.
