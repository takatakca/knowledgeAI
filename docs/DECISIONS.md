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

## 2026-10-14 — production HTTP evidence

**Decision:** Require an independent GitHub-hosted HTTP smoke check after publishing the catalog. This verifies real HTTPS for the portal, JSON catalog, health probe and read-only agent search, beyond Vercel's READY indicator. Successful evidence: GitHub run `38623184283`. Keep production SHA checks separate because Vercel can automatically deploy before a CI job completes.

## 2026-10-14 — no false OIDC/JWKS integration

The accessible TAKATAK core code uses Supabase sessions and database-backed workspace permission checks. Its publicly found `/.well-known/jwks.json` is a **Bluesky provider key**, not a TAKATAK identity federation contract. KnowledgeAI must obtain a real approved signed service token or secure server-to-server authority before private data access. See `docs/PRIVATE-AUTH-CONTRACT.md`.

## 2026-10-14 — safe concurrent catalog generation

Multiple agents may change `main` while GitHub Actions generates its public search index. The bot must not publish a stale snapshot or force-overwrite another agent. It re-fetches the current `main`, regenerates the index from that version, and uses bounded retries for a regular Git push. A rejected race is reported rather than bypassed.

## 2026-10-14 — isolated private-service code, no public data plane

Implemented a standalone private-knowledge service and RLS schema behind a dedicated RS256 JWT contract with audience, issuer, product, workspace and explicit read/write scopes. No private credentials or tenant data are held in this public repository. The service is not deployed while the TAKATAK issuer, separate PostgreSQL instance and operational controls are unverified. CI uses synthetic identities and a disposable PostgreSQL 17 container.

## 2026-10-14 — reproducibility and private integration proof

Use pinned pg dependency plus committed package-lock.json and npm ci; fail CI on npm audit findings at high severity or above. Test the private app, not just its SQL migration, against a disposable PostgreSQL 17 with restricted runtime login. The tests prove implementation behavior but do not grant approval to load confidential source material or deploy without real TAKATAK authorization.

## 2026-10-14 — tenant-only deletion with audit-preserving lifecycle

Permit knowledge:read to list only current source metadata; require a separate knowledge:delete authorization for irreversible deletion of all source versions. Both operations resolve workspace from verified signed claims and use database RLS. Keep audit metadata and anti-replay receipts outside deletion until a documented retention/offboarding policy is approved. Limit list results at the database and reject repeated or missing source IDs. Private CI proves cross-tenant isolation and audits as the migration owner without granting audit read privileges to the runtime login.

## 2026-10-14 — explicit private source portability scope

Provide full original source revisions only with a separate signed `knowledge:export` scope; never elevate a standard `knowledge:read` token to bulk export. Enforce workspace filtering through PostgreSQL RLS, SQL pagination capped at ten revisions, no cache and metadata-only audit. All related operations remain in the undeployed private service pending a verified TAKATAK identity/entitlement authority.

## 2026-10-14 — tenant pagination before export

Support deterministic ordered, bounded source inventory pages with SQL LIMIT/OFFSET and explicit validated maximums. Workspace comes exclusively from validated signed identity and PostgreSQL RLS, not a request parameter. This makes source version export complete without broadening the public catalog or exposing cross-tenant source names.

## 2026-10-15 — refuse stale or self-assigned private access

Require an independent database authorization row on **every** private operation, in addition to verifying the RSA-signed token and operation scope. New workspaces default disabled and permissions default false; JWTs can be revoked by `workspace_id` + `jti`. The app role receives SELECT-only access to these tables and cannot issue/revoke credentials or change workspace entitlements. The trusted TAKATAK master remains the sole source of identity, membership and product authorization. Do not invent a second login authority in KnowledgeAI.

## 2026-10-15 — private startup fail-closed

Before binding a private HTTP listener, verify runtime SQL login is not a superuser/BYPASSRLS/table owner; require every expected table to FORCE RLS, forbid runtime mutation of access controls, forbid runtime audit reads, and require PostgreSQL TLS. CI may bypass TLS **only** in a disposable local test of the preflight; production code does not expose such an override.

## 2026-10-15 — no TLS downgrade through database URL

Reject PostgreSQL DSN query options that could replace the pinned Node TLS peer-verification object. Keep strict certificate verification and require approved private trust configuration. Production private DB bootstrap must fail when connection encryption or authorization constraints are inadequate.
