# Source Manifest

This file tracks source material used to build curated Knowledge TakaTak records.

## Verified source snapshots

### TAKATAK Social Core
- source: `social-core-current-state-2026-08-02.txt`
- source date: 2026-08-02
- purpose: verified Social Core architecture/current state
- precedence: newer than older social context snapshots unless newer production/code evidence supersedes it
- curated destination: `projects/SOCIAL-CORE.md`

### Contabo / Coolify master plan
- source: `GROUPE TAKATAK — Plan maître Contabo VPS - Coolify - Migration A→Z.md`
- reference date: 2026-09-30
- purpose: central infrastructure, deployment and migration architecture
- curated destination: `docs/04-DEPLOYMENT-STANDARDS.md`

### TAKATAK child-app master standard
- source: Library `Pasted text(3).txt`
- purpose: earlier reusable GROUPE TAKATAK / TAKATAK Auth / TAKATAK Dashboard standard
- curated destination: `prompts/MASTER-TAKATAK-CHILD-APP-STANDARD.md`
- status note: the later independent-client transfer architecture supersedes any interpretation that makes a client platform permanently captive to TAKATAK identity/backend.

### Portfolio reconciliation — 2026-10-06
- source: connected `takatakca` GitHub organization repository inventory
- source: current repository READMEs/docs/code excerpts where inspected
- source: professional TAKATAK Gmail evidence for MochaHost invoices, renewals, migration/account messages and managed-domain activity
- source: approved professional project context
- purpose: annual cleanup baseline for repos/domains/projects
- curated destinations:
  - `docs/09-KNOWN-PROJECTS-AND-REPOS.md`
  - `docs/10-PORTFOLIO-DOMAINS-REPOS-2026-10-06.md`
  - project dossiers created/updated on 2026-10-06
- security rule: no credentials, payment-card data, private personal messages or customer lead contents were copied into the knowledge repository.

### Client independence / transfer architecture — 2026-10-06
- source: owner clarification that client platforms must remain independent and transferable after the applicable long-term service agreement while TAKATAK-managed services remain separable
- purpose: correct the older "child app = permanently dependent on TAKATAK master identity/backend" interpretation
- curated destinations:
  - `docs/11-CLIENT-INDEPENDENCE-TRANSFER-ARCHITECTURE.md`
  - `docs/05-IDENTITY-AND-MULTISITE.md`
  - `prompts/MASTER-TAKATAK-AI-NEXUS-INDEPENDENT-CLIENTS.md`

## Provenance rule

Source files/evidence remain authoritative evidence. Curated Markdown files summarize implementation-relevant knowledge for agents and should link back to source names/dates.

When exact source archives are later imported into a private retrieval system, source IDs/hashes should replace filename-only references.

When current production behavior, source code, hosting evidence or signed contract terms conflict with a summary, record the conflict and update the curated layer; do not silently erase the underlying evidence.
