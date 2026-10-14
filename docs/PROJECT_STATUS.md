# Project status — knowledgeAI

Last audit: **2026-10-14**. Repository: \`takatakca/knowledgeAI\`, default branch \`main\`, **public**.

## Production surfaces

| Surface | Verified evidence | State |
| --- | --- | --- |
| Static public portal | GitHub-connected Vercel project \`knowledgeai\` and production alias \`knowledgeai-nu.vercel.app\` | Vercel READY and external GitHub runner HTTP smoke passed on 2026-10-14 |
| Public catalog | Deterministic \`ingest/build_catalog.py\`, 62 indexed Markdown records as of latest verified release on 2026-10-14 | Implemented; auto-regenerated through GitHub Actions |
| Browser search | \`assets/knowledge-search.js\` and \`index.html\` | Implemented; uses public JSON only |
| Agent public search API | \`api/search.js\` and \`api/health.js\` | Implemented; 7 Node API tests green and HTTP endpoints passed remote GitHub runner smoke |
| Private ingestion / client retrieval | Future dedicated service | **NOT IMPLEMENTED** — never send private data to public endpoints |
| AI Studio (LibreChat/Open WebUI) | \`deploy/ai-studio\` installation kit | Kit present; real credentials, server/DNS and paid-provider usage unverified |

## Non-negotiable boundaries

- No personal, legal, medical, financial, client-lead or credential data in this public Git repository.
- Public search is not TAKATAK Auth and does not assert tenant entitlements.
- Independent client applications remain transferable and tenant-isolated.
- No claim of live AI model or payment integration absent tested production evidence.

See \`docs/TASK_QUEUE.md\` and \`docs/AGENT_HANDOFF.md\`.

Private TAKATAK authentication discovery: verified existing Supabase/session/workspace guards, but no production-ready KnowledgeAI service federation contract. See [private authentication contract](./PRIVATE-AUTH-CONTRACT.md).
