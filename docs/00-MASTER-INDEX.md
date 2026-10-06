# Knowledge TakaTak — Master Index

## Mission

Build a durable, searchable, provenance-aware brain for TAKATAK product creation. The repository captures what has already been decided across websites, apps, integrations and infrastructure so future AI agents do not restart from zero.

## Operating model

1. Preserve approved source context.
2. Separate source facts from derived summaries.
3. Organize knowledge by project and cross-project standard.
4. Keep reusable decisions in central architecture documents.
5. Link project-specific exceptions back to the standard.
6. Later expose the repository through a scoped backend retrieval API.

## Cross-project standards

- [Architecture](./02-ARCHITECTURE.md)
- [Ingestion policy](./03-INGESTION-POLICY.md)
- [Deployment standards](./04-DEPLOYMENT-STANDARDS.md)
- [Identity and multi-site standard](./05-IDENTITY-AND-MULTISITE.md)
- [Agent operating rules](./06-AGENT-OPERATING-RULES.md)
- [Ecosystem integration map](./10-ECOSYSTEM-INTEGRATION-MAP.md) — live state, Layer A/B vision, contracts, build order (2026-10-06)
- [Developer backlog](./11-DEV-BACKLOG.md) — numbered issue list (TK-xxx) for the dev team, kept current

## Project dossiers

- [TAKATAK Core](../projects/TAKATAK-CORE.md)
- [TAKATAK Social](../projects/SOCIAL-CORE.md)
- [MIMT](../projects/MIMT.md)
- [ON2GO](../projects/ON2GO.md)
- [TAKATAK Accounting Control Tower](../projects/ACCOUNTING-CONTROL-TOWER.md)
- [AHMV / AHM Verdun](../projects/AHMV.md)
- [R2NETTE](../projects/R2NETTE.md)
- [Rentauto](../projects/RENTAUTO.md)
- [1LV](../projects/1LV.md)
- [Ocarina Spa](../projects/OCARINA-SPA.md)
- [TAKATAK FoodHub](../projects/FOODHUB.md)
- [FESTI-ICE / Ticketing](../projects/FESTI-ICE.md)
- [QMAPS](../projects/QMAPS.md)
- [TAKATAK Ads](../projects/TAKATAK-ADS.md)

## Repository principle

A project dossier describes the current known architecture and decisions. It is not a replacement for the corresponding source repository.

When facts conflict, prefer:
1. current production behavior,
2. current repository code/schema,
3. approved architecture documents,
4. older conversation summaries.

Record conflicts explicitly instead of silently merging incompatible versions.
