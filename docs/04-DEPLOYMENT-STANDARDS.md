# Deployment Standards

## Principle

Build in CI, deploy artifacts, health-check, and preserve rollback.

Avoid doing heavyweight dependency installation or builds on constrained production hosting unless the target architecture explicitly requires it.

## Current TAKATAK direction

Primary central-platform target:

```
GitHub
 → CI quality gates
 → approved branch
 → Coolify
 → Docker build/deploy
 → health checks
```

TAKATAK staging is organized under the Coolify TAKATAK environment. Production secrets must be copied from their authoritative secure stores, never regenerated casually and never written into knowledge files.

## Required CI gates

Typical release gates:
- typecheck
- lint
- tests
- production build
- security checks
- artifact verification
- migration checks when database changes exist

A failed release gate means no production promotion.

## Versioned release pattern for shared hosting

For Node apps deployed to constrained cPanel/MochaHost environments:

```
releases/<commit-sha>/
CURRENT
PREVIOUS
shared/
```

CI builds on Linux, uploads the production artifact, atomically switches the active release, performs a health check and rolls back when validation fails.

## Static/Vite pattern

For client-only apps:
- build in CI or trusted development environment,
- deploy the generated client artifact only,
- never publish source secrets, .env files, node_modules or server-only code to the public document root.

## Health endpoints

Every deployable backend should expose a lightweight health endpoint such as `/healthz` that can be checked during promotion and rollback.
