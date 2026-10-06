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

## Provenance rule

Source files remain authoritative evidence. Curated Markdown files summarize implementation-relevant knowledge for agents and should link back to source names/dates. When exact source archives are later imported into a private retrieval system, source IDs/hashes should replace filename-only references.


### TAKATAK child-app master standard
- source: Library `Pasted text(3).txt`
- purpose: reusable GROUPE TAKATAK / TAKATAK Auth / TAKATAK Dashboard standard for future child sites/apps
- curated destination: `prompts/MASTER-TAKATAK-CHILD-APP-STANDARD.md`

### Ecosystem integration map
- source: owner instructions in Claude Code session (2026-10-06) + read-only inspection of takatak-v1 (`8adfa23`), Facturations, takatak-automate, takatak, takatakbackend, child-app integration docs, and live `takatak.ca` endpoints
- reference date: 2026-10-06
- curated destination: `docs/10-ECOSYSTEM-INTEGRATION-MAP.md`
