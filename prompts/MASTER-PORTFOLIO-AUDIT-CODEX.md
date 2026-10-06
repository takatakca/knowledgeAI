# MASTER PORTFOLIO AUDIT PROMPT — CODEX / CLAUDE CODE

## Objective

Perform the 2026 TAKATAK portfolio cleanup across all professional repositories and domains without deleting, merging, redirecting, expiring or modifying production assets merely because they appear stale or duplicated.

Start with:
- `docs/10-PORTFOLIO-DOMAINS-REPOS-2026-10-06.md`
- `registry/portfolio-registry-2026-10-06.json`
- `docs/11-CLIENT-INDEPENDENCE-TRANSFER-ARCHITECTURE.md`
- `docs/12-ANNUAL-PORTFOLIO-CLEANUP-PLAN.md`
- `docs/09-KNOWN-PROJECTS-AND-REPOS.md`

## Mandatory architecture

Each client platform is independently transferable. TAKATAK managed services attach through adapters/APIs and may be removed/replaced at transfer.

Do not redesign the portfolio around a permanent TAKATAK dependency.

Do not infer data ownership from technical hosting. Data transfer/exclusion follows explicit contract/data class.

## Audit scope

Audit every repository currently visible in the `takatakca` organization, not only the well-known projects.

For each repo determine:
- project/client/brand;
- canonical domain;
- framework/runtime;
- default branch;
- build command;
- test command;
- deployment target;
- database/storage;
- auth implementation;
- environment variable inventory by NAME ONLY;
- CI/CD;
- health checks;
- current/legacy/experimental classification;
- TAKATAK adapters/integrations;
- transferability blockers;
- secrets committed by mistake;
- README/runbook quality;
- unresolved TODOs and production risks.

Never print or copy secret values.

## Domain reconciliation

The registry contains an observed/historical domain floor, not the final list.

When live registrar/cPanel/Cloudflare evidence is available, reconcile:
- domain;
- registrar;
- expiry;
- authoritative DNS;
- A/AAAA/CNAME/MX;
- SSL;
- document root/application;
- repository;
- client/business;
- canonical redirect;
- email dependency;
- current status.

Do not assume a domain is disposable because no GitHub repo matches it.

## Required outputs

Update `knowledgeAI` with:
1. per-repository audit records;
2. domain ↔ project ↔ repo ↔ deployment mappings;
3. conflicts/duplicates;
4. transferability gaps;
5. security issues;
6. production risks;
7. 90-day prioritized cleanup plan.

Create machine-readable updates in the registry in addition to Markdown summaries.

## Priority classification

P0:
- exposed secret;
- broken production;
- expiring domain/email risk;
- data-loss risk;
- cross-client data leak;
- payment/security issue.

P1:
- production without reliable deploy/rollback/backup;
- transferability blocker;
- identity coupling that prevents client separation;
- missing contract/data provenance boundary.

P2:
- legacy duplication;
- incomplete docs;
- inconsistent domain/brand naming;
- staging cleanup.

P3:
- visual/product polish.

## Execution discipline

Audit first.
Make no destructive production changes without explicit approval.
Do not archive a repo until domain/deployment/database dependencies are proven absent or migrated.
Do not commit credentials.
Do not copy personal/family/legal-private material into the professional knowledge repository.
Record uncertainty as uncertainty.
