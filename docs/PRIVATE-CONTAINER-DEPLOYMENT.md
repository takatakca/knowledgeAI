# KnowledgeAI confidential backend — container preparation (not live)

**State as of 2026-10-16:** The rootless Docker image is reproducible and
was built successfully in GitHub Actions. This does NOT mean a private
service, database, TAKATAK signer or public DNS route has been deployed.

## What the image contains

- Node.js 22 Alpine, production-only npm dependencies and `src/`.
- No migration scripts, CI fixtures, secret keys, knowledge documents,
  source exports, backup archives, administrative scripts or public portal.
- `node:node` unprivileged user (verified from built image metadata in CI).
- `GET /healthz` checks PostgreSQL connectivity; probes therefore fail
  when confidential database access is unavailable.
- Default HTTP listener is `127.0.0.1:8301`; this **cannot** be routed
  from a separate proxy container without explicit protected-network
  configuration. The image fails startup if required secrets are absent.

## Build without activation

From repository root:

```sh
docker build --pull -t knowledge-private:review -f private-knowledge/Dockerfile private-knowledge
docker image inspect knowledge-private:review --format '{{.Config.User}}'
docker run --rm knowledge-private:review
```

The expected last result is a **nonzero exit** and sanitized startup
failure because no private DB/JWKS credentials are supplied. Do not mistake
this refusal for a broken image. A CI job validates the same behavior.

## Protected Coolify / Contabo deployment gate

Before creating/enabling a real service, the operator must:

1. Approve a dedicated non-public runtime and network segment, protected
   proxy/TLS termination, DNS/access policies, and per-service ingress
   restrictions. **Never expose port 8301 directly on a public interface.**
2. Provision independent confidential PostgreSQL with trusted TLS, seven
   FORCE RLS tables (migrations 001–006), separately scoped runtime and
   migration roles, sealed backups, approved retention and recovery drills.
3. Reconcile TAKATAK PRs #194 and #195 into ONE identity, client/product
   entitlement and JWKS signing contract. Approve the merge, provision
   real signing secrets in a secret manager and validate live key rotation.
4. Configure these runtime variables via Coolify protected environment
   configuration, not GitHub, plaintext files or image layers:
   `PRIVATE_DATABASE_URL`, `KNOWLEDGE_JWT_ISSUER`,
   `KNOWLEDGE_JWT_AUDIENCE`, `KNOWLEDGE_JWKS_URL`,
   and optionally `PRIVATE_PORT`.
5. **Only if a private container gateway is approved and protected by
   network rules**, set both `PRIVATE_BIND_HOST=0.0.0.0` and
   `PRIVATE_ALLOW_CONTAINER_BIND=1`. Either value alone is insufficient.
   Keep default loopback binding for direct machine-local deployments.
6. Ensure the TLS verifier trusts only the intended database and HTTPS
   issuer. Do not disable TLS peer verification or bypass startup preflight.
7. Run end-to-end issuer/JWKS/health, tenant A vs. tenant B, revoked JWT,
   denied source, export/delete permission, rate-limit and restore checks
   against approved staging identities **before** enabling production.
8. Pin the verified container build to a reviewed commit digest, capture
   controlled rollout/rollback evidence and keep the public Vercel catalog
   independent from the private workload.

## Verified evidence

- GitHub Actions Private Knowledge Security CI #38942617058: container
  build and fail-closed startup, Node JWT tests, PostgreSQL isolation,
  restore and locked-dependency audit — SUCCESS.
- Public Knowledge Catalog CI #38942617237: SUCCESS with HTTP smoke.
- TAKATAK master PR #195 latest full CI #38941386144: SUCCESS,
  although the PR is still draft/unmerged and cannot be activated.

**Not yet verified:** a published/retained private image digest,
real Coolify deployment, secrets/issuer, independent tenant database,
offsite backup and cross-company staging/production checks.
