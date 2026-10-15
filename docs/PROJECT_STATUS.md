# Project status — knowledgeAI

Last audit: **2026-10-15**. Repository: `takatakca/knowledgeAI`, default branch `main`, **public**.

## Production surfaces

| Surface | Verified evidence | State |
| --- | --- | --- |
| Static public portal | GitHub-connected Vercel project `knowledgeai` and production alias `knowledgeai-nu.vercel.app` | Vercel READY and external GitHub runner HTTP smoke passed on 2026-10-14 |
| Public catalog | Deterministic `ingest/build_catalog.py`, 62 indexed Markdown records as of latest verified release on 2026-10-14 | Implemented; auto-regenerated through GitHub Actions |
| Browser search | `assets/knowledge-search.js` and `index.html` | Implemented; uses public JSON only |
| Agent public search API | `api/search.js` and `api/health.js` | Implemented; 7 Node API tests green and HTTP endpoints passed remote GitHub runner smoke |
| Private ingestion / client retrieval | Isolated private-knowledge/ service, migrations, RLS and integration tests | **IMPLEMENTED IN CODE AND TESTED, NOT DEPLOYED** — trusted issuer/private DB not configured |
| AI Studio (LibreChat/Open WebUI) | `deploy/ai-studio` installation kit | Kit present; real credentials, server/DNS and paid-provider usage unverified |

## Non-negotiable boundaries

- No personal, legal, medical, financial, client-lead or credential data in this public Git repository.
- Public search is not TAKATAK Auth and does not assert tenant entitlements.
- Independent client applications remain transferable and tenant-isolated.
- No claim of live AI model or payment integration absent tested production evidence.

See `docs/TASK_QUEUE.md` and `docs/AGENT_HANDOFF.md`.

Private TAKATAK authentication discovery: verified existing Supabase/session/workspace guards, but no production-ready KnowledgeAI service federation contract. See [private authentication contract](./PRIVATE-AUTH-CONTRACT.md).

## Private knowledge phase (2026-10-14)

The private-knowledge/ package contains JWT-verified tenant backend, SQL schema, audit/replay prevention, a locked dependency tree, and tests against a real disposable PostgreSQL database using a restricted runtime role. Private Knowledge Security CI run 38627614637 passed all jobs, including npm ci and production dependency audit. This is code and ephemeral CI proof, NOT a live private service: no dedicated approved database, identity issuer, operational secrets or hardened deployment are configured. Public Vercel routes remain unchanged.

## Lifecycle/security extension (2026-10-14)

The separate private backend now supports tenant-only source inventory and all-version deletion, requires knowledge:delete for destructive operations, writes search/list/delete audit events, and sets a transaction-local SQL statement timeout. The first complete private CI for this extension: run 38629828659 SUCCESS (Node security tests, real PostgreSQL 17 RLS/deletion isolation, audit-owner checks, npm CI and dependency audit). **Not deployed:** there is no approved dedicated private database, trusted TAKATAK token issuer, production gateway, or backup/retention service. Public Vercel remains unchanged.

## Scoped export milestone (2026-10-14)

Versioned source export from `/v1/knowledge/export` implemented in the isolated backend with separate `knowledge:export` permission, SQL pagination, audit event and tenant-isolation regression tests. Private Knowledge Security CI run `38630318645` **SUCCESS**. This is **not deployed**; the only Vercel production surface remains public documents and public read-only search.

## Full source inventory pagination (2026-10-14)

The private inventory now accepts `limit` and `offset` and returns only SQL-bounded tenant-scoped pages. Private CI run `38630925562` passed authorization, tenant pagination on PostgreSQL 17, audit and dependency checks. This is **isolated code, not a production private service**.

## 2026-10-15 — private authorization hardening

- Added migration `004_workspace_access.sql` with admin-controlled, deny-by-default `workspace_entitlements` and workspace-bound `revoked_tokens`. Each database operation now verifies both a cryptographically signed scope and live access-control rows before reading/writing tenant data.
- Added RLS tests proving that an ordinary private runtime cannot grant itself access; disabled/unknown companies and revoked JTIs are denied. Synthetic PostgreSQL CI remains the only integration environment.
- Added startup preflight for distinct non-owner login, all required FORCE RLS tables, least-privilege SQL grants and TLS. Local CI deliberately verifies a plaintext database fails the production TLS check.
- Fixed HTTP source-list pagination to forward `offset`. No new private data service is deployed; the public Vercel portal remains independent.
