# Engineering decisions — knowledgeAI

## 2026-10-14 — public catalog vs private knowledge

**Decision:** Keep GitHub and Vercel catalogs strictly PUBLIC, based solely on allowlisted Markdown already in this public repository. Use a read-only search API and explicit \`visibility: public\` response metadata.

**Reason:** This repo is publicly visible; public static assets and serverless code cannot be a confidential cross-tenant knowledge store. A privileged search endpoint without verified TAKATAK Auth could expose customer records.

**Consequence:** Real private ingestion and retrieval require a separate authorized backend with durable storage, secrets off-Git, tenant and product claims enforced server-side, provenance and audit controls.

## 2026-10-14 — runtime and release chain

**Decision:** Keep the existing Vercel project and static portal; add minimal JavaScript serverless API routes with no runtime dependencies. Python standard library remains responsible for the deterministic index. Node's built-in test runner validates APIs in CI.

**Reason:** Reuse an existing deployment, avoid unnecessary framework migration, and preserve fast static navigation.

## Earlier documented decisions (still valid)

- TAKATAK shared identity is federated; independent clients retain transferable local domain data: \`docs/05-IDENTITY-AND-MULTISITE.md\`.
- Deployment security gates are mandatory; broken CI must not knowingly be promoted: \`docs/04-DEPLOYMENT-STANDARDS.md\`.
- The public GitHub corpus cannot contain confidential personal/professional messages or keys: \`README.md\`, \`docs/03-INGESTION-POLICY.md\`.
- Agent and provider integrations must not be presented as live without actual production evidence: \`docs/06-AGENT-OPERATING-RULES.md\`.

When production evidence contradicts this log, record the conflict and do not silently overwrite earlier history.
