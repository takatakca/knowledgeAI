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
