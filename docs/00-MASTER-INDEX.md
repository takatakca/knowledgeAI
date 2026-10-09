# Knowledge TakaTak — Master Index

## Mission

Build a durable, searchable, provenance-aware professional brain for TAKATAK product creation and operations. The repository captures what has already been decided across websites, client applications, integrations, campaigns and infrastructure so future AI agents do not restart from zero.

## Operating model

1. Preserve approved source context.
2. Separate source facts from derived summaries.
3. Organize knowledge by project and cross-project standard.
4. Keep reusable decisions in central architecture documents.
5. Link project-specific exceptions back to the standard.
6. Preserve client/product independence and transferability.
7. Later expose the repository through a scoped backend retrieval API.

## Cross-project standards

- [Architecture](./02-ARCHITECTURE.md)
- [Ingestion policy](./03-INGESTION-POLICY.md)
- [Deployment standards](./04-DEPLOYMENT-STANDARDS.md)
- [Identity and multi-site standard](./05-IDENTITY-AND-MULTISITE.md)
- [Agent operating rules](./06-AGENT-OPERATING-RULES.md)
- [Design system preferences](./07-DESIGN-SYSTEM-PREFERENCES.md)
- [Integration standards](./08-INTEGRATION-STANDARDS.md)
- [Known projects and repositories](./09-KNOWN-PROJECTS-AND-REPOS.md)
- [Portfolio domains/repos snapshot — 2026-10-06](./10-PORTFOLIO-DOMAINS-REPOS-2026-10-06.md)
- [Client independence and transfer architecture](./11-CLIENT-INDEPENDENCE-TRANSFER-ARCHITECTURE.md)
- [Annual portfolio cleanup plan](./12-ANNUAL-PORTFOLIO-CLEANUP-PLAN.md)
- [Machine-readable portfolio registry](../registry/portfolio-registry-2026-10-06.json)

## Core TAKATAK dossiers

- [TAKATAK Core](../projects/TAKATAK-CORE.md)
- [TAKATAK AI Nexus](../projects/TAKATAK-AI-NEXUS.md)
- [TAKATAK Social](../projects/SOCIAL-CORE.md)
- [TAKATAK Ads](../projects/TAKATAK-ADS.md)
- [TAKATAK Accounting Control Tower](../projects/ACCOUNTING-CONTROL-TOWER.md)
- [TAKATAK FoodHub](../projects/FOODHUB.md) · now [ON2GO Hub](../projects/ON2GO-HUB.md)
- [Facturations](../projects/FACTURATIONS.md)

## Product / marketplace dossiers

- [MIMT](../projects/MIMT.md) · [regulatory brief](../projects/MIMT-REGULATORY.md) · [stack and costs](../projects/MIMT-STACK.md) · [MVP plan](../projects/MIMT-MVP.md)
- [ON2GO](../projects/ON2GO.md) · [ON2GO Hub (merchant platform)](../projects/ON2GO-HUB.md)
- [QMAPS](../projects/QMAPS.md)
- [R2NETTE](../projects/R2NETTE.md)
- [R2F](../projects/R2F.md)
- [FLEX'S](../projects/FLEX.md)
- [RentAuto](../projects/RENTAUTO.md)
- [1LV](../projects/1LV.md)
- [EMPLOI DIRECT](../projects/EMPLOI-DIRECT.md)
- [Haste Mart / Liquidation Hub](../projects/HASTE-MART.md)
- [Canada/Cuba Token](../projects/CANADA-CUBA-TOKEN.md)

## Client / vertical dossiers

- [AHMV / AHM Verdun](../projects/AHMV.md)
- [ALKAO](../projects/ALKAO.md)
- [FESTI-ICE](../projects/FESTI-ICE.md)
- [Havana](../projects/HAVANA.md)
- [Ocarina Spa](../projects/OCARINA-SPA.md)
- [DRONE AIR](../projects/DRONE-AIR.md)
- [CO WORK.CA](../projects/CO-WORK.md)
- [MIELAISSA](../projects/MIELAISSA.md)
- [Taxi Chambly](../projects/TAXI-CHAMBLY.md)
- [Restaurant / Food Client Network](../projects/RESTAURANT-NETWORK.md)
- [Legal lead-generation properties](../projects/LEGAL-LEAD-GEN.md)
- [Unmapped / historical domain queue](../projects/UNMAPPED-DOMAINS.md)

## Canada–Cuba / social-impact dossiers

- [CUBAFOOD.CA](../projects/CUBAFOOD.md)
- [CCC — Canada Connexion Cuba](../projects/CCC-CANADA-CONNEXION-CUBA.md)
- [REVERS CANADA](../projects/REVERS-CANADA.md)
- [REVpère](../projects/REVPERE.md)

## Reusable coding prompts

- [TAKATAK child-app standard](../prompts/MASTER-TAKATAK-CHILD-APP-STANDARD.md)
- [TAKATAK AI Nexus + independent client platforms](../prompts/MASTER-TAKATAK-AI-NEXUS-INDEPENDENT-CLIENTS.md)
- [Master portfolio audit — Codex / Claude Code](../prompts/MASTER-PORTFOLIO-AUDIT-CODEX.md)

## Repository principle

A project dossier describes the current known architecture and decisions. It is not a replacement for the corresponding source repository.

When facts conflict, prefer:
1. current verified production behavior,
2. current repository code/schema,
3. current hosting/registrar/deployment evidence,
4. approved architecture documents,
5. older conversation summaries.

Record conflicts explicitly instead of silently merging incompatible versions.

## Client-independence rule

Client websites and applications must be designed as independently transferable products. TAKATAK-managed services attach through explicit contracts/adapters and must not silently turn the client application into an inseparable shell.

See `docs/11-CLIENT-INDEPENDENCE-TRANSFER-ARCHITECTURE.md`.
