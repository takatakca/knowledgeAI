# Project status — knowledgeAI

Last audit: **2026-10-14**. Repository: `takatakca/knowledgeAI`, default branch `main`, **public**.

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
