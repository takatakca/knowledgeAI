# Deployment Standards

## Source precedence

Primary infrastructure source snapshot:
- `GROUPE TAKATAK — Plan maître Contabo VPS - Coolify - Migration A→Z.md`
- reference date: **2026-09-30**

## Principle

GitHub validates. Coolify deploys.

A server must not become the place where broken builds are repaired manually.

## Central TAKATAK target

The Contabo VPS becomes the central heavy application runtime for TAKATAK while other infrastructure can continue serving responsibilities that fit it.

High-level flow:

```
Developer / Lovable
        ↓
GitHub
        ↓
CI
        ↓
approved branch
        ↓
Coolify
        ↓
Docker build
        ↓
health check
        ↓
release
```

## Required CI gates

Before production:
- typecheck
- lint
- tests
- production build
- security checks
- artifact checks when present
- migration/rebuild validation when applicable

**FAILED CI → NO PRODUCTION DEPLOYMENT**

## Branch/release direction

Preferred flow:

```
feature branch
  ↓
PR
  ↓
CI
  ↓
staging
  ↓
QA
  ↓
main
  ↓
production
```

Never develop directly inside a production container.

## Runtime-isolation target

The platform should not become one giant Node process.

Target runtime responsibilities include:
- `takatak-web`
- `takatak-api`
- `takatak-worker`
- `takatak-social`
- `takatak-webhooks`
- Redis
- `qmaps-api`
- `flexs-api`

These may initially originate from one monorepo. The important objective is runtime isolation, not repository proliferation.

## TAKATAK Web

Responsibilities:
- Dashboard/UI
- SSR/public pages
- auth presentation
- account/billing UI
- marketplace UI
- social UI

## Central API direction

A central TAKATAK API should own shared contracts such as:
- customer/site API
- integration API
- master identity
- QMAPS/FLEXS integration
- orders
- invoices
- services
- permissions
- organizations

Connected TAKATAK sites should speak to the central API rather than directly to each other.

## Workers

Background workers handle:
- analytics sync
- social sync
- email
- notifications
- report generation
- site synchronization
- CRM events
- background imports
- scheduled tasks
- retry jobs

A worker crash must not take down the Dashboard.

## Webhooks

Webhook service requirements:
- signature verification
- idempotency
- timestamp/replay validation
- logging without secrets
- retry handling
- quick HTTP acknowledgement
- heavy work pushed to a queue

## Redis

Redis is for:
- queues
- locks
- rate limiting
- temporary caching
- job coordination

Redis should remain private to the service network unless a specific external need exists.

## Secret handling

Do not commit secrets.

Existing encryption/token keys that protect live data must be copied exactly during migration and never casually regenerated.

Critical infrastructure decryption material must be backed up securely outside the server and never stored in GitHub, chat logs, Slack or ordinary email.

## Shared-hosting release pattern

For Node apps that remain on constrained cPanel/MochaHost environments, use CI-built Linux artifacts and versioned releases:

```
releases/<commit-sha>/
CURRENT
PREVIOUS
shared/
```

Deploy artifact → switch active release → health check → rollback on failure.

## Static/Vite deployments

For client-only apps:
- build in CI or a trusted development environment
- deploy generated client artifacts only
- do not publish `.env`, source secrets, private server code or development-only files to the public document root

## Health endpoints

Every deployable backend should provide a lightweight health endpoint such as `/healthz` for promotion and rollback checks.
