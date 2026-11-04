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

## Agent continuity and verified release

- [Current project status](./PROJECT_STATUS.md)
- [Prioritized task queue](./TASK_QUEUE.md)
- [Agent handoff — read first](./AGENT_HANDOFF.md)
- [Deployment and HTTP checks](./DEPLOYMENT.md)
- [Architecture decisions](./DECISIONS.md)
- [Public read-only search API](./PUBLIC-API.md)
- [Private authentication integration — verified contract discovery](./PRIVATE-AUTH-CONTRACT.md)
- [Isolated private backend implementation and security runbook](../private-knowledge/README.md)

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
- [TAKATAK FoodHub](../projects/FOODHUB.md)
- [Facturations](../projects/FACTURATIONS.md)

## Product / marketplace dossiers

- [MIMT](../projects/MIMT.md) · [regulatory brief](../projects/MIMT-REGULATORY.md) · [stack and costs](../projects/MIMT-STACK.md) · [MVP plan](../projects/MIMT-MVP.md)
- [ON2GO](../projects/ON2GO.md)
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

## NEWBUY — TAKATAK ecosystem add-ons

Owner-assigned agent name: **NEWBUY** (2026-11-02), specializing in add-ons for the TAKATAK ecosystem. Current work: Website Monitoring in [takatak-v1 PR #243](https://github.com/takatakca/takatak-v1/pull/243). Continue that implementation; do not create a duplicate product or replace existing pages/services.

Permanent working method for NEWBUY: read each repository's AGENTS.md, current main, worklog, open PRs, project 00 files and relevant master instructions before acting; leave signed notes before coding, during material steps and after verified completion in GitHub, the project's Drive dossier and the authorized coordination channel. Respect active task claims and preserve existing content. Keep confidential notes and all credentials outside public repositories. Distinguish code, CI, deployment and actual service activation.

TAKATAK owns sign-in, workspace permissions and billing for the add-on; the monitoring worker deploys independently. Latest implementation revision at this checkpoint: `1d9f635634a9c623bca9ca173e3a379f0f56b582`; full application CI and monitoring container CI passed. Production deployment is not yet verified. Read current PR/Actions rather than treating this checkpoint as the latest state.

Private operational links and the requested recurring coordination process are maintained in the project's authorized Drive dossier. User chose hourly follow-up because the available scheduler cannot run every 30 minutes. Signed: **NEWBUY** @ ChatGPT Work, 2026-11-02.

### NEWBUY verified release checkpoint — 2026-11-02

Monitoring PR #243 is merged as `8b75dd05cdedd88622408fef91c71a49f2e14cce`. Current product main including its permanent [00-NEWBUY-ADDONS.md](https://github.com/takatakca/takatak-v1/blob/main/00-NEWBUY-ADDONS.md) is `aee1816106365e38037f1e7d02e450ccc96dddad`. Main CI `41406286385` and production-artifact validation `41407291165` passed. Production-deploy workflow `41407291036` was skipped; the live product page returned 404 at verification. Deployment and paid-service activation are not complete. Exact next step: authorized promotion of the verified revision and public/deployed-SHA checks. Private access blockers and coordination details are in the authorized project dossier. Signed: **NEWBUY**.


### NEWBUY Actions provenance and coordination — 2026-11-02

Read-only job inspection reconciled the artifact reports: [41406887771](https://github.com/takatakca/takatak-v1/actions/runs/41406887771) rejected obsolete RELEASE_SHA `8b75dd05` from CI `41406132512`; distinct successful [41407291165](https://github.com/takatakca/takatak-v1/actions/runs/41407291165) validated `aee1816` from CI `41406286385`. The workflow metadata head_sha alone does not identify the upstream release. Staging reconciliation `41407291194` was audit-only with no mutation; downstream `41407433732` built/deployed nothing because approved apply was absent. These successes do not prove deployment.

At the coordinator's request, PR #240 head `80393b472fe642401c9bd1c42777c46686d4f8f1` was verified against successful [CI 41415961796](https://github.com/takatakca/takatak-v1/actions/runs/41415961796), including Monitoring safeguards. PR remains open; no other agent's code changed. Product main remains `aee1816106365e38037f1e7d02e450ccc96dddad`; latest production workflow `41417113148` is skipped. Deployment and paid activation remain unverified. Next: authorized release through valid existing access, then deployed SHA and public Monitoring checks. Signed: **NEWBUY**.


NEWBUY checkpoint — 2026-11-02: after current instructions/coordination reads, PR #240 remains open and advanced to `a12f067770c645924534cf53baebc3bd2f0699c3`. [CI 41423189184](https://github.com/takatakca/takatak-v1/actions/runs/41423189184) passed (09:54:49 UTC), including Monitoring checkout/tenant isolation/signed-sync database tests, build and clean artifact startup. Earlier 80393b4 remains a historical checkpoint. Product main unchanged `aee1816`; production `41424495800` skipped. No code/release/activation change. Next: authorized promotion through valid access and proof of deployed SHA/Monitoring flow. Signed: **NEWBUY**.


NEWBUY checkpoint — 2026-11-02 06:15 HNE: coordinator's current-head request verified read-only. PR #240 is open at `df07c8e0e25084a108c9183cc7fedcf0f49f416d`; [CI 41431345585](https://github.com/takatakca/takatak-v1/actions/runs/41431345585) passed at 10:52:43 UTC, including Monitoring database safeguards, build and clean artifact startup. Earlier PR-head checkpoints are historical. Main remains `aee1816`; production run `41432293837` skipped. No code, merge, deployment or paid activation. Next: valid authorized release access, served SHA and Monitoring flow proof. Signed: **NEWBUY**.


NEWBUY checkpoint — 2026-11-02 07:18 HNE: current instructions/coordination read; requested PR #240 head `0fe72fd62860d5dc91ab00085d6fedf1fcef59f8` confirmed open with successful [CI 41439145727](https://github.com/takatakca/takatak-v1/actions/runs/41439145727), completed 11:53:23 UTC. Monitoring database safeguards, build and clean artifact startup passed. Earlier head checkpoints remain historical. Main `aee1816` unchanged; production `41440320716` skipped. No code, merge, deployment or paid activation. Next: valid authorized release access, served SHA and Monitoring flow proof. Signed: **NEWBUY**.


NEWBUY checkpoint — 2026-11-02 08:23 HNE: after current instructions/coordination reads, requested PR #240 head `4be0f548f2884d01ebe454508bddf2e3c841a55c` confirmed open; [CI 41448148528](https://github.com/takatakca/takatak-v1/actions/runs/41448148528) passed at 13:01:34 UTC. Monitoring database safeguards, build and clean artifact startup passed. Earlier heads remain historical. Main `aee1816` unchanged; production `41449445678` skipped. No code, merge, deployment or paid activation. Next: valid authorized release access, served SHA and Monitoring flow proof. Signed: **NEWBUY**.


NEWBUY checkpoint — 2026-11-02 09:21 HNE: current instructions/coordination read; requested PR #240 head `36bd653245bcb0362f05dba208af278c9261ddf4` confirmed open. [CI 41458561880](https://github.com/takatakca/takatak-v1/actions/runs/41458561880) passed at 14:13:22 UTC, including Monitoring database safeguards, build and clean artifact startup. Earlier heads remain historical. Main `aee1816` unchanged; production `41459882582` skipped. No code, merge, deployment or paid activation. Next: valid authorized release access, served SHA and Monitoring flow proof. Signed: **NEWBUY**.


### NEWBUY — post-SEO main verification — 2026-11-02 10:24 HNE

Main advanced to `7ef48a853ea9bddf1be2a58de8e6c4823e604034` after SEO PR #244. CI `41461689947` and [exact-main artifact validation 41463178467](https://github.com/takatakca/takatak-v1/actions/runs/41463178467) passed. Migration failure `41463119895` refused stale RELEASE_SHA `a429e391`; subsequent `41463178592` audited `7ef48a8` successfully with no mutation. Staging `41463428673` is green but built/deployed nothing (`missing-migration-approval`); production `41463178503` skipped.

PR #240 head `36bd653` compares 35 ahead / 3 behind current main, merge base `aee1816`. Earlier CI does not verify the combined SEO + PR result. Signed handoff posted on PR #240 asking its owner to integrate main and rerun CI; no forced rebase or branch modification by NEWBUY. Next: updated PR CI, valid authorized deployment access, served SHA and Monitoring flow proof. No deployment or paid activation claimed. Signed: **NEWBUY**.


NEWBUY checkpoint — 2026-11-02 11:17 HNE: PR #240 head `29eadedb240a2ae82b78ee7892f423a4d560c9dd` now includes main `7ef48a8` (37 ahead / 0 behind). Integration handoff completed. [CI 41471927164](https://github.com/takatakca/takatak-v1/actions/runs/41471927164) failed at webpack build in the Google next/font loader for oauth/layout.tsx; Monitoring safeguards and ephemeral-DB checkout/isolation/sync passed. Matches owner's existing Google Montserrat intermittence report. Failed jobs retried once; result pending, no green claim. Signed diagnostic posted to PR owner; no code or branch changes by NEWBUY. Next: exact-head CI success, or owner fixes font dependency if repeated; valid release access and served SHA/Monitoring proof before activation. Signed: **NEWBUY**.


NEWBUY checkpoint — 2026-11-02 12:15 HNE: single retry [41471927164 attempt 2](https://github.com/takatakca/takatak-v1/actions/runs/41471927164) passed for historical head `29eaded` at 16:28:29 UTC. Independently, current open PR #240 head `9d11597a5b99c30dc4048b3deda5a574007cdcc7` has successful [CI 41483276415](https://github.com/takatakca/takatak-v1/actions/runs/41483276415), completed 16:44:21 UTC; Monitoring database safeguards, build and clean artifact startup passed. Google Fonts dependency remains unchanged; no durable fix claimed. Main `7ef48a8` unchanged; production `41484409655` skipped. No merge, deployment or paid activation. Next: PR owner review, valid release access and served SHA/Monitoring proof. Signed: **NEWBUY**.


NEWBUY checkpoint — 2026-11-02 13:21 HNE: requested current PR #240 head `d899f455eeffab98a07c09bb8f6cc92adbdadb91` confirmed open; [CI 41494192679](https://github.com/takatakca/takatak-v1/actions/runs/41494192679) passed at 17:55:23 UTC. Monitoring database safeguards, build and clean artifact startup passed. Earlier heads remain historical. Main `7ef48a8` unchanged; production `41495684741` skipped. No code, merge, deployment or paid activation. Next: owner review, valid release access and served SHA/Monitoring proof. Signed: **NEWBUY**.


NEWBUY checkpoint — 2026-11-02 14:17 HNE: current PR #240 head `35c0d0bb2af993376e97544a91df2f0ae00b038b` confirmed open; [CI 41503475470](https://github.com/takatakca/takatak-v1/actions/runs/41503475470) passed at 18:56:43 UTC. Monitoring database safeguards, build and clean artifact startup passed; d899f45 is historical. Main `7ef48a8` unchanged; production `41505310722` skipped. No code, merge, deployment or paid activation. Next: owner review, valid release access and served SHA/Monitoring proof. Signed: **NEWBUY**.


NEWBUY checkpoint — 2026-11-02 15:19 HNE: requested current PR #240 head `c766b5d5c9806d8ea29d2393fc2cafac8455142a` confirmed open; [CI 41512868631](https://github.com/takatakca/takatak-v1/actions/runs/41512868631) passed at 19:53:53 UTC. Monitoring database safeguards, build and clean artifact startup passed. Main `7ef48a8` unchanged; production `41514183592` skipped. No code, merge, deployment or paid activation. Active daily coordination thread rediscovered after provider fragmentation; no duplicate resend. Next: owner review, valid release access and served SHA/Monitoring proof. Signed: **NEWBUY**.


NEWBUY checkpoint — 2026-11-02 16:15 HNE: requested current PR #240 head `ed496a68eab835fe5a6b5a040ccaf25fb22dfe38` confirmed open; [CI 41521952554](https://github.com/takatakca/takatak-v1/actions/runs/41521952554) passed at 20:52:52 UTC. Monitoring database safeguards, build and clean artifact startup passed. Main `7ef48a8` unchanged; production `41523242771` skipped. No code, merge, deployment or paid activation. Next: owner review, valid release access and served SHA/Monitoring proof. Signed: **NEWBUY**.


NEWBUY checkpoint — 2026-11-02 17:17 HNE: current PR #240 head `22f9ea0db643e079356b25bf245254dfd30d5d66` confirmed open; [CI 41531193217](https://github.com/takatakca/takatak-v1/actions/runs/41531193217) passed at 21:54:48 UTC. Monitoring database safeguards, build and clean artifact startup passed. Main `7ef48a8` unchanged; production `41532629484` skipped. No code, merge, deployment or paid activation. Next: owner review, valid release access and served SHA/Monitoring proof. Signed: **NEWBUY**.


### NEWBUY Monitoring checkpoint — 2026-11-04

After current instructions and coordination reads, product main is `e6f7c400f50d52fb9f212dc5e2de51996cdea206`; PR #240 is merged. [Main CI 41784663782](https://github.com/takatakca/takatak-v1/actions/runs/41784663782) passed, including Monitoring database safeguards, build and clean artifact startup. [Artifact validation 41785463335](https://github.com/takatakca/takatak-v1/actions/runs/41785463335) confirms that RELEASE_SHA and upstream CI. Staging `41785575212` built/activated nothing (`missing-migration-approval`), despite green summary. Production `41785463413` and latest `41788489395` skipped. Public Monitoring read was inaccessible through the available reader; no fresh HTTP status or outage inferred. No deployed SHA, service activation or payment verified. Preserve other agents' active PRs; next is valid authorized promotion and served-SHA/Monitoring-flow proof, plus worker/email/watchdog/billing operational verification before paid activation. Signed: **NEWBUY**.
