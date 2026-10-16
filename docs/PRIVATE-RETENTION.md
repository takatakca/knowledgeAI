# Private KnowledgeAI — operational retention preview

**Status (2026-10-15): tested only with synthetic PostgreSQL 17 fixtures. Not scheduled or approved for live data.**

## Boundaries

This operational maintenance command is not an HTTP route, is not available to clients
and must never use the normal KnowledgeAI service role. It requires a separately
approved privileged database operator and manual sign-off.

The maintenance policy in the script supplies conservative **test thresholds**,
which must be reviewed against actual legal, business and contractual retention
rules before any production use:

- Quota request windows: older than 48 hours.
- Write anti-replay receipts: older than 24 hours (service JWTs expire within 5 minutes).
- Revoked JWT records: more than 24 hours **after token expiration**.
- Audit trail, documents, entitlements and backup archives: **never deleted by this command**.

Each successful invocation deletes at most 500 eligible rows **per table**.
It refuses concurrent execution through a transaction advisory lock.

## Preview-first operation

Review privileged roles, retention policy and backups before use. The normal
preview is non-destructive:

```sh
psql -v ON_ERROR_STOP=1 -f private-knowledge/maintenance/retention.sql
```

Applying a bounded batch requires both opt-in flags and an authorized DB operator:

```sh
psql -v ON_ERROR_STOP=1 -v apply=true -v approved=true -f private-knowledge/maintenance/retention.sql
```

The flags are procedural safeguards, **not authentication or legal approval**.
Database privileges determine which operators may run it. A failed invocation
rolls back and must be investigated rather than bypassed.

## Evidence and non-goals

Private Knowledge Security CI run `38839681826` verified default preview,
explicit rejection without approval, deletion of only aged synthetic rows,
and preservation of recent receipts/revocations, tenant documents, audit and
entitlements. These are test fixtures rather than actual customer records.

This command does **not** clean audit records, run on a schedule, implement
right-to-erasure, manage legal holds, delete backups or guarantee offsite
recovery. An independent approved operations workflow and private audit of
each run are still required before deployment.
