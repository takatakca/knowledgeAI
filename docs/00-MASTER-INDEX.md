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


NEWBUY checkpoint — 2026-11-04 03:21 HNE: main advanced to `65a3e2573cf25d2455e0b719d5098dfd725b8359` through PR #247. [CI 41796297923](https://github.com/takatakca/takatak-v1/actions/runs/41796297923) passed including Monitoring database safeguards, build and clean startup; [artifact validation 41797550725](https://github.com/takatakca/takatak-v1/actions/runs/41797550725) passed. Staging `41797703239` built/activated nothing (`missing-migration-approval`), despite green summary. Production `41797550722` skipped. No deployment/activation/payment proof. Preserve Claude's PR #248 security work; next is valid authorized release access and served SHA/Monitoring flow proof, with worker/email/watchdog/Stripe operational verification before paid activation. Signed: **NEWBUY**.


NEWBUY checkpoint — 2026-11-04 04:21 HNE: main `b853bb6b5ac2261d284f38cf83fc005ff100330b` merged PR #248 security. [CI 41806218575](https://github.com/takatakca/takatak-v1/actions/runs/41806218575) in progress at inspection; Monitoring unit and ephemeral-DB safeguards passed, no overall success asserted yet. [Production-migration workflow 41806218947](https://github.com/takatakca/takatak-v1/actions/runs/41806218947) is green but its actual audit/reconcile step skipped because required private database configuration is unavailable; no production schema audit or migration execution proven. Follow existing authorized release process and first-manual-acceptance gate before auto-deploy configuration; no release/activation/payment performed. Next: CI result, approved schema preflight and valid promotion access with served SHA/Monitoring proof. Signed: **NEWBUY**.


NEWBUY checkpoint — 2026-11-04 05:21 HNE: main `b853bb6` unchanged; [CI 41806218575](https://github.com/takatakca/takatak-v1/actions/runs/41806218575) now passed, including Monitoring and security-screen ephemeral-DB safeguards, build and clean artifact startup. [Artifact validation 41807608725](https://github.com/takatakca/takatak-v1/actions/runs/41807608725) passed. Staging `41807751160` built/activated nothing (`missing-migration-approval`); production `41807608671` skipped. Production audit `41806218947` remains unexecuted because private DB configuration is unavailable; ephemeral tests do not prove the live schema. No deployment/activation/payment. Next: authorized production schema preflight, valid release access and served SHA/Monitoring operational proof. Signed: **NEWBUY**.


2026-11-05 01:31 HNE — NEWBUY — checkpoint exact main et correction PR #249
AVANT : main/AGENTS/WORKLOG/00, PR #243, PR #249, Actions, maître GitHub, maître/journal/dossier NEWBUY Drive, board et fil quotidien 2026-11-05 relus. Aucun code entrepris; travail Claude PR #250 respecté.
PENDANT / APRÈS : main e7e1c8bd54e11123998c7adc5c12dd1f8d6ee4ea = fusion PR #250, modification documentaire WORKLOG seulement. CI exacte 41979341768 SUCCÈS (job linux-quality-and-artifact vert). Validation artefact 41980433363 SUCCÈS. Reconcile staging 41980433380 SUCCÈS au résumé, mais approbation humaine d’application SKIPPED. Release staging 41980564348 SUCCÈS au résumé mais aucun artefact construit ni activé; journal exact : missing-migration-approval. Déploiement Coolify 41980433544 SKIPPED. Aucun nouvel audit production exécuté ni SHA servi prouvé. PR #249 reste ouverte sur 14e2d554. Commentaire PR #249 6646044179 corrigé : le run 41807751160 avait STAGING_APP_URL et STAGING_ANON_KEY vides, donc configuration build absente en plus de l’approbation migration absente. Aucun secret, code applicatif, migration, déploiement, activation ou paiement; aucun réessai Coolify. Prochain geste : revue propriétaire PR #249, configuration privée TAKATAK_PRODUCTION_DATABASE_URL puis audit lecture seule, handoff de release et preuves SHA servi/Monitoring/worker/SMTP/watchdog/Stripe avant activation payante. — NEWBUY


2026-11-05 02:24 HNE — NEWBUY — diagnostic lecture seule ON2GO demandé par coordination
Nouveau mandat lu dans le fil quotidien 02:10 : diagnostiquer le run ON2GO échoué, sans relance ni code. Main on2goca 0ed02d401c6727a880ea3f8a8c0e492c7b50be3f inchangé. Run 41981989166 : étape typecheck/tests échouée; typecheck passe, Vitest 82/86 tests passent, 4 échecs dans tests/site.test.ts. Cause vérifiée : scripts/fetch-directory.mjs remplace data/directory.json par le flux Food Hub avant les tests; le flux actuel donne NDG 16:00–03:00 alors que les assertions figées attendent 16:30–03:15, et l’emplacement testé ne contient pas le lien direct platform on2go attendu (0 reçu, 1 attendu). Même signature dans le run 41935282459 : échec déterministe, non transitoire; une relance seule est inutile. Build statique et déploiement skipped; aucun déploiement. Prochain geste propriétaire on2goca : rendre les tests indépendants du flux live via fixture stable ou assertions d’invariants, puis revalider; aucune modification, relance, secret ou action production par NEWBUY. — NEWBUY


2026-11-05 06:24 HNE — NEWBUY — facturation permanente, état vérifié sans reprise de chantier
Main takatak-v1 c6a637129d7e8b5cf6ae5b824a9303e8aaf2f708 = fusion PR #251, correctif d’interface des cartes sociales uniquement. CI exacte 42009659848 SUCCÈS. Reconcile staging 42010977170 SUCCÈS en mode audit : 0 migration approuvée en attente et aucune mutation; la migration 20261104080000_security_checks reste explicitement hors de ce gate. Validation artefact 42010977159 a exécuté ses contrôles et écrit que l’artefact exact est valide sans connexion/upload/activation/migration production, mais la conclusion globale du run est CANCELLED; le doublon 42011008625 est SKIPPED. Releases staging 42011131900 CANCELLED et 42011133324 SKIPPED; aucun déploiement ni SHA servi prouvé.
Directive propriétaire permanente repérée dans l’issue takatak-v1 #252, ouverte et sans assigné/PR : créer des workspaces internes billingExempt, contrôlés par owner et valables pour tous les services, avec audit, révocation et tests anti-charge/anti-héritage. État réel de main : SOCIAL_CONNECTION_SETUP_CLIENT_IDS reste un allowlist temporaire limité au démarrage des connexions sociales; ce n’est pas une exemption globale et permanente. Aucun code repris par NEWBUY pour éviter un conflit avec le handoff GPT-6 déjà ouvert; PR #249 reste ouverte. Prochain geste : claim explicite de #252, migration/schema + résolveur unifié + protections Stripe/webhooks/add-ons et tests, puis CI/déploiement/proof avant de sélectionner un workspace cible. Aucun secret, paiement, activation, migration ou réessai Coolify. — NEWBUY


2026-11-05 07:21 HNE — NEWBUY — PR #253 fusionnée, CI finale verte, exemption non déployée et portée partielle
Main takatak-v1 aec34858ef2652160323f1b33a37b54ce6ed3a01 = fusion PR #253 « Permanent workspace billing exemption via SOCIAL_CONNECTION_SETUP_CLIENT_IDS ». Vérification du diff : correspondance UUID exacte, serveur seulement; l’exemption est appliquée aux droits Social, Growth et Website Monitoring, supprime leurs appels d’upgrade et refuse les nouveaux checkouts Social/Growth/Monitoring. Les autres workspaces du même profil restent séparés. CI exacte main 42021926068 SUCCÈS, y compris Workspace billing exemption isolation. Validation artefact 42023190602 SUCCÈS et indique explicitement qu’aucune connexion/upload/activation/migration/DNS/provider production n’a été effectuée. Coolify 42023190187 SKIPPED.
Le run reconcile staging 42023190182 est vert mais en mode audit : 0 migration approuvée en attente, aucune mutation. Le run staging 42023333808 est vert au résumé mais aucun artefact n’a été construit : approbation migration absente, STAGING_APP_URL et STAGING_ANON_KEY vides, build/upload/activation SKIPPED. Donc aucun déploiement ni UUID live vérifié.
Écart concret avec l’issue #252 : PR #253 utilise l’environnement, sans désignation durable DB ni audit acteur/raison/révocation; son QA direct vérifie surtout match UUID et séparation de deux workspaces. Les domaines distincts (achats domaine/hébergement/physiques, factures Stripe client, crédits IA, SMS/voix, dépenses publicitaires, hockey et coûts tiers) ne sont pas exonérés; les abonnements Stripe/Upmind existants ne sont pas arrêtés automatiquement. #252 reste ouverte; NEWBUY prend le suivi de vérification/gaps, sans nouvelle branche concurrente. Prochain geste : revue propriétaire du périmètre, tests checkout/webhook/révocation/anti-héritage, inventaire des contrats existants, puis déploiement autorisé et preuve activeClientId = UUID exact avant toute déclaration « billing exempt » en production. Aucun secret, paiement, activation, migration ou réessai Coolify. — NEWBUY


### NEWBUY — PR #254 post-fusion checkpoint — 2026-11-05 09:20 HNE

Main takatak-v1 est maintenant `48f29da46590ee09fdeef4eb03328851e01b8b01`, fusion exacte de PR #254 depuis la tête `ed49458f7e818a213bf14a630561e962f6a879ff`. CI main [42035904068](https://github.com/takatakca/takatak-v1/actions/runs/42035904068) et validation d’artefact [42037356235](https://github.com/takatakca/takatak-v1/actions/runs/42037356235) ont réussi, y compris capture de leads, isolation billing-exempt et garde-fous Monitoring. Reconcile staging [42037356790](https://github.com/takatakca/takatak-v1/actions/runs/42037356790) a réussi en audit avec 0 migration approuvée en attente et aucune mutation. La release staging [42037511644](https://github.com/takatakca/takatak-v1/actions/runs/42037511644) est verte au résumé mais n’a construit, téléversé ni activé aucun artefact : approbation de migration absente et configuration de build indisponible. Coolify production [42037356442](https://github.com/takatakca/takatak-v1/actions/runs/42037356442) est SKIPPED. Aucun SHA servi, lead réel /transfert, déploiement, DNS, transfert client ou paiement n’est prouvé. La supervision ne trouve aucune revue propriétaire consignée avant la fusion. Prochain geste : confirmation/revue propriétaire, validation privée de WEBSITE_LEADS_ENABLED et du workspace d’intake, test contrôlé jusqu’à l’inbox TAKATAK, puis seulement décision de rollout réversible; l’issue #252 reste ouverte pour les écarts d’exemption. — **NEWBUY**


### NEWBUY — PR #255 CI exacte verte, activation non effectuée — 2026-11-05 10:20 HNE

Main takatak-v1 reste `48f29da46590ee09fdeef4eb03328851e01b8b01`. La PR [#255](https://github.com/takatakca/takatak-v1/pull/255) est ouverte, fusionnable, tête `203469139ace0e38bd3fb9255d773c7a874a6c3e`. Sa CI exacte [42049003697](https://github.com/takatakca/takatak-v1/actions/runs/42049003697) a réussi intégralement : typecheck, isolation de l’exemption, garde-fous TAKATAK ADS et Monitoring, lint, tests DB éphémères, build, audit et démarrage propre de l’artefact. Le code proposé donne au workspace UUID exactement allowlisté un minimum de 50 marques et contourne seulement le contrôle d’abonnement interne TAKATAK ADS; les protections de propriété, création approuvée, placement et budget restent. Ce n’est pas une autorisation de dépense publicitaire, d’achat tiers, de débit Stripe/Upmind ou d’activation de paiement. Aucun merge, déploiement, SHA servi, test production exempt/non-exempt ni paiement réel n’est prouvé. La revue Claude est absente faute de crédits. L’issue #252 reste ouverte : désignation durable DB, audit acteur/raison/révocation, résistance webhooks, no-charge et couverture de tous les domaines de paiement ne sont pas fournis par #255. Prochain geste : revue coordinateur/propriétaire, fusion autorisée, vérification privée de l’UUID Client dans le runtime, déploiement prouvé et double smoke test; activation des paiements standards reste une décision séparée après preuves. — **NEWBUY**


### NEWBUY — PR #255 fusionnée, CI post-merge vérifiée, aucun déploiement — 2026-11-05 11:23 HNE

L’ordre propriétaire « merge to main » est maintenant explicite; au contrôle, la fusion avait déjà été effectuée extérieurement. NEWBUY n’a pas touché `main`. La PR [#255](https://github.com/takatakca/takatak-v1/pull/255) est fusionnée dans `main` au commit `728e16f1cf72a33795a291d2f40dde53badb3182`, depuis la tête exacte `203469139ace0e38bd3fb9255d773c7a874a6c3e`. La CI post-merge [42054124319](https://github.com/takatakca/takatak-v1/actions/runs/42054124319) a réussi intégralement, y compris typecheck, isolation billing-exempt, garde-fous TAKATAK ADS et Website Monitoring, tests DB éphémères, build, audit et démarrage propre de l’artefact. La validation de l’artefact exact [42055776409](https://github.com/takatakca/takatak-v1/actions/runs/42055776409) a réussi et déclare qu’aucune connexion, téléversement, activation, migration, modification DNS ou fournisseur de production n’a été effectuée. Le reconcile staging [42055776162](https://github.com/takatakca/takatak-v1/actions/runs/42055776162) a réussi en audit : 0 migration approuvée en attente, aucune mutation. La release staging [42055935021](https://github.com/takatakca/takatak-v1/actions/runs/42055935021) est verte au résumé mais aucun artefact n’a été construit : approbation de migration absente; build, upload et activation ont été ignorés. Coolify production [42055776526](https://github.com/takatakca/takatak-v1/actions/runs/42055776526) est SKIPPED. Aucun paiement ni dépense publicitaire n’a été activé ou vérifié. L’issue #252 reste ouverte. Prochain geste : vérifier en privé l’UUID Client actif dans le runtime, obtenir un SHA réellement servi, puis smoke tests exempt/non-exempt; toute activation de paiements standards reste séparée. — **NEWBUY**


### NEWBUY — ON2GO parity audit : site disponible, release périmée — 2026-11-05 13:17 HNE

Mandat de supervision 13:10 traité en lecture seule. Le run [42081241807](https://github.com/takatakca/on2goca/actions/runs/42081241807), workflow « ON2GO hosting, Food Hub and deployment parity audit », échoue volontairement à l’étape de preuve de migration/déploiement. Le code `main` reste `0ed02d401c6727a880ea3f8a8c0e492c7b50be3f`, tandis que `on2go.ca`, `www.on2go.ca` et `preview.on2go.ca` répondent HTTPS 200 sur `31.220.96.134` mais publient le marqueur `345047acb59726a91d3c385359fa5bf6ac6c0571`, donc pas le SHA exact de `main`. `foodhub.on2go.ca` répond également 200 et son contrôle public a réussi. Le workflow signale : migration production non complète, aucun déploiement webhook Coolify réussi correspondant au `main` actuel, et aucun jeton API Coolify en lecture seule configuré pour corroborer une release native. Ce n’est pas l’échec Vitest déterministe du run 41981989166 : ici DNS et HTTPS passent; la preuve de parité de release échoue. Aucune relance, modification, migration, connexion Coolify, dépense ou mise en production effectuée. Prochain geste : le propriétaire/release coordinator doit établir la voie de promotion autorisée, déployer le SHA exact ou documenter la release attendue, puis relancer l’audit; ne pas masquer le contrôle ni réessayer d’anciens identifiants. — **NEWBUY**


### NEWBUY — Website Monitoring : contrôle public, route absente du déploiement servi — 2026-11-05 14:18 HNE

AVANT : main/AGENTS/WORKLOG/00, PR #243, Actions, maître GitHub, maître/journal/dossier NEWBUY Drive, board et fil quotidien relus. Main reste `728e16f1cf72a33795a291d2f40dde53badb3182`; aucune nouvelle demande NEWBUY et aucun code entrepris.

PENDANT / APRÈS : contrôle public en lecture seule. `https://takatak.ca/api/health` répond et retourne `{"status":"ok","app":"TAKATAK User Official Dashboard V1","alive":true}`. Les routes privées `/dashboard/web-hosting/monitoring` et `/dashboard/monitoring` existent et redirigent vers `/login?next=...`. En revanche, la page publique attendue `/monitoring` retourne la page TAKATAK 404 « This page does not exist »; `/release.txt` retourne la même 404, donc aucun SHA servi ne peut être prouvé par ce marqueur. Ce constat est compatible avec les workflows précédents : CI/artefact verts ne prouvent pas que le build courant est déployé. Aucun déploiement, migration, activation, paiement, secret ou essai Coolify effectué. Prochain geste : responsable de release — identifier le SHA réellement servi, promouvoir la révision autorisée contenant la route publique Monitoring, puis vérifier `/monitoring`, le marqueur de release, le parcours authentifié, le worker/SMTP/watchdog et Stripe avant activation payante. — **NEWBUY**


### NEWBUY — diagnostic CI public distinct : Promo Havana / Miel Aissa — 2026-11-05 22:20 HNE

Diagnostic en lecture seule des exécutions courtes signalées. Promo Havana, run `42106630773`, n’est pas une panne générique : API et boutique autorisée répondent 200, mais le contrôle de préparation reste volontairement **NOT READY (4/10)**. Le build public servi (`305e87ca512d`) est en retard sur `main` (`39099adc1b9b`); la campagne attendue est 404, aucun événement approuvé n’est publié/en vente, le catalogue adulte/enfant est indisponible et la racine billetterie n’est pas encore alignée avec la boutique directe. Les commandes historiques doivent être préservées avant toute redirection.

Miel Aissa, run [42099234138](https://github.com/takatakca/MIELAISSA.CA/actions/runs/42099234138), exécute seulement `scripts/public-health.sh` contre la page d’accueil publique : les trois tentatives retournent HTTP 500 et le même signal existe dans des runs antérieurs, donc la panne est persistante côté application/serveur, pas un incident du runner. Aucun code, relance, déploiement, migration, paiement, secret ou essai Coolify effectué. Prochain geste : propriétaire Promo Havana — publier la révision exacte et le catalogue/événement approuvé après préservation des commandes; propriétaire Miel Aissa — examiner les journaux serveur/PHP/base de données et rétablir la page d’accueil en 200 avant relance. — **NEWBUY**
