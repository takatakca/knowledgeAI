# Ordered task queue — knowledgeAI

Statuses: DONE = implemented with evidence; PENDING = executable next; BLOCKED = external dependency.

| Priority | Workstream | Status | Acceptance criteria |
| --- | --- | --- | --- |
| P0 | Public knowledge index + browser portal | DONE | Deterministic public catalog, searchable interface, 62 sources indexed, CI green |
| P0 | Public read-only agent API | DONE | GET `/api/search`, GET `/api/health`; bounded queries and provenance URLs; CI tests and deployed HTTP verification |
| P0 | Project continuity | DONE after files published | Five status/queue/handoff/deploy/decision files updated with next action |
| P1 | Public API E2E | DONE | External HTTP 200, JSON, safe input validation and production SHA evidence |
| P1 | Restricted backend architectural contract | PARTIAL — verified isolation code | Versioned TAKATAK OIDC token verification (issuer/audience/JWKS), org/product entitlement checks, audit and rate limits before query |
| P1 | Scoped durable knowledge storage | SCHEMA, RLS AND APP QUERIES TESTED; production BLOCKED | Approved private infrastructure/DB, migrations, RLS policy, backup and access controls; no fake production database |
| P1 | Private source ingestion | INGEST/SEARCH/LIST/DELETE and audit TESTED; production BLOCKED | Explicit source approvals, safe classification, normalization, idempotency, provenance and conflict tracking; prevent cross-tenant leakage |
| P2 | Authenticated retrieval for agents | BLOCKED | Real TAKATAK Auth integration, tenant-scoped tests, meaningful denial responses, API versioning |
| P2 | AI Studio production go-live | BLOCKED | Verified VPS/domain DNS, provider keys kept outside GitHub, account access and message/credit test |
| P2 | Existing PR #3/#4/#5 | PENDING coordination | Review original branches and possible conflicts; merge only validated changes without clobbering other agents |

**Do not** ingest private source material merely because a build succeeds.

Further production gates: implement approved export/data portability; defined retention for audit/receipts/backups; authoritative token revocation and membership checks; private runtime observability, backup/restore and separate hosting. The source lifecycle code and migration 002 are tested but **not live**.

Private version export: **code and synthetic CI integration DONE**, production BLOCKED. New `knowledge:export` scope, SQL-bound 10-version pagination, audit event, and tenant isolation. Requires migration 003 and a real approved trusted issuer before deployment. Remaining high-priority gaps: authoritative revocation, retention/deletion of backups and audit, secure private runtime and live end-to-end tests.

Private inventory paging: DONE IN CODE/CI (limit 1–50, offset max 999999, verified cross-tenant pagination in `38630925562`). Operations remain BLOCKED IN PRODUCTION until actual TAKATAK identity/entitlement issuer and confidential PostgreSQL are verified.

### 2026-10-15 private authorization checklist

- DONE IN CODE: deny-by-default workspace grants, JTI revocation, scoped SQL RLS, TLS/role/schema startup preflight, source-list HTTP offset regression and CI coverage.
- BLOCKED IN PRODUCTION: TAKATAK authority must provide verified membership/product entitlements and a trusted RS256 token issuer/JWKS, and must govern writes to the admin access-control tables.
- BLOCKED IN PRODUCTION: separate approved private PostgreSQL, TLS trust configuration, migration-owner + restricted runtime login, backups/recovery, access revocation operations, retention and live smoke tests.
- DO NOT interpret synthetic CI identities, hard-coded test fixture entitlements or a Vercel READY status as evidence of active confidential production ingestion.
