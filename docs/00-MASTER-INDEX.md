## NEWBUY — timeout amont uniforme sur le chemin partagé — 2026-11-23 13:25 EST

**AVANT :** relecture fraîche de `main` (`0b98ab2240424954cb30c19c4f6b7386185afab9`), `AGENTS.md`, `WORKLOG.md`, PR #243, Actions, tableau #105, maîtres GitHub/Drive, journal, dossier NEWBUY/Add-ons et nouveaux messages du fil Gmail quotidien. Aucun nouveau claim ni demande directe add-ons; le redémarrage VPS1 reste signalé comme non effectué, bloqué par le Turnstile Contabo.

**PENDANT / APRÈS VÉRIFICATION :** deux passages indépendants à 13:25 EST ont tous renvoyé HTTP 503 avec le même corps texte de 91 octets, `upstream connect error ... connection timeout`, sur `takatak.ca/api/health/ready`, l'apex, `on2go.ca` et `r2nette.ca`. Le sous-domaine V1 répond aussi HTTP 503 avec `remote connection failure` (98 octets). Ce nouvel état uniforme remplace les réponses intermittentes `000`, la page proxy HTML de 3 492 octets et les reprises 200 observées plus tôt; il resserre le diagnostic vers un chemin amont partagé indisponible. Aucun en-tête de release, aucun déploiement servi et aucun paiement vérifiés. Aucun code, secret, DNS, activation ou configuration modifié; aucun identifiant Coolify réessayé.

**BLOCAGE / PROCHAIN GESTE :** smoke `/transfert → Lead Inbox` et activations add-ons toujours suspendus. Le propriétaire/opérateur doit franchir manuellement le Turnstile Contabo, effectuer le geste VPS autorisé, puis produire une série durable de HTTP 200 avec `database: ok` et release cohérente avant toute reprise.

— NEWBUY

## NEWBUY — panne partagée confirmée; r2nette rétabli — 2026-11-23 12:20 EST

**AVANT :** relecture fraîche de `main` (`7eb344c57e1cd91f1fc28ea843d0d387f6bd3261`), `AGENTS.md`, `WORKLOG.md`, PR #243, Actions, tableau #105, maîtres GitHub/Drive, journal, dossier NEWBUY/Add-ons et nouveaux messages du fil Gmail quotidien. Aucun nouveau claim ni demande directe add-ons; aucun code repris.

**PENDANT / APRÈS VÉRIFICATION :** deux passages indépendants à 12:19–12:20 EST confirment `takatak.ca/api/health/ready` et l'apex en HTTP 503 avec la page proxy `Site not available` de 3 492 octets, sans release; le sous-domaine V1 répond aussi 503 avec échec de connexion amont. Le rayon partagé est instable: `on2go.ca` a donné `000` par expiration puis HTTP 503 `connection timeout`, tandis que `r2nette.ca` a déjà répondu HTTP 200 avec 87 372 octets sur les deux passages, corrigeant le signal précédent qui les donnait tous deux 503. `main` n'a pas bougé depuis le commit documentaire 11:25; aucun run Actions associé. Aucun code, secret, paiement, DNS, déploiement, activation ou configuration modifié; aucun identifiant Coolify réessayé.

**BLOCAGE / PROCHAIN GESTE :** le smoke authentifié `/transfert → Lead Inbox` et les activations add-ons restent suspendus. L'opérateur infrastructure doit stabiliser le chemin partagé et fournir une série durable de HTTP 200 avec `database: ok` et release cohérente sur TAKATAK; Website Monitoring doit continuer à distinguer panne, timeout et reprise par domaine avant toute activation.

— NEWBUY

## NEWBUY — oscillation V1 confirmée, reprise non durable — 2026-11-23 11:24 EST

**AVANT :** relecture fraîche de `main` (`908f6fc6ed9e7302df91e0b357e99231ea16ad68`), `AGENTS.md`, `WORKLOG.md`, PR #243, Actions, tableau #105, maîtres GitHub/Drive, journal, dossier NEWBUY/Add-ons et fil Gmail quotidien. Aucun nouveau claim ni demande directe add-ons; aucune reprise de code.

**PENDANT / APRÈS VÉRIFICATION :** le fil a fourni des preuves contradictoires mais horodatées d'une oscillation rapide: santé applicative HTTP 200 avec `database: ok` et release `216c7baf73975920759f02efd147092c87ed3277`, puis réponses vides `000`, parfois avec l'apex indisponible alors que la santé répondait encore 200. La sonde indépendante de 11:24 EST a ensuite retrouvé HTTP 503 sur `/api/health/ready` et l'apex (page proxy `Site not available`, 3 492 octets, sans en-tête de release), ainsi que HTTP 503 sur le sous-domaine V1 avec `upstream connect error ... remote connection failure`. La fenêtre 200 n'est donc pas une preuve de rétablissement durable. Aucun code, secret, paiement, DNS, déploiement, activation ou configuration modifié; aucun identifiant Coolify réessayé.

**BLOCAGE / PROCHAIN GESTE :** le smoke authentifié `/transfert → Lead Inbox` et les activations add-ons restent suspendus. L'opérateur infrastructure doit stabiliser application/conteneur, proxy, réseau et base, puis fournir une série durable de réponses HTTP 200 avec `database: ok` et release cohérente. Website Monitoring reste fermé jusqu'aux preuves worker/alertes/SMTP/watchdog/Stripe.

— NEWBUY

## NEWBUY — panne V1 persistante au proxy — 2026-11-23 10:18 EST

**AVANT :** `main`, `AGENTS.md`, `WORKLOG.md`, PR #243, état Actions disponible, tableau de coordination, maîtres GitHub/Drive, journal, dossier NEWBUY/Add-ons et fil Gmail quotidien relus. Aucun chantier actif repris; aucun nouveau claim add-ons.

**PENDANT / APRÈS VÉRIFICATION :** deux sondes indépendantes de `https://takatak.ca/api/health/ready` et deux sondes de l’apex ont toutes répondu HTTP 503 avec la page HTML proxy `Site not available` de 3 492 octets, sans `X-Takatak-Release`. Le sous-domaine `takatak-v1.takatak.ca/api/health/ready` a aussi répondu HTTP 503 avec `upstream connect error ... remote connection failure`. Ce défaut se situe avant l’application et s’ajoute à la réponse applicative `database: unavailable` vérifiée à 09:23. `main` est `edf120847719b69dab1e52a3739637a7c1cb11c5`, commit documentaire seulement; aucun run Actions associé à ce commit. Aucun code, secret, paiement, DNS, déploiement, activation ou configuration modifié; aucun identifiant Coolify réessayé.

**BLOCAGE / PROCHAIN GESTE :** V1 reste impropre au smoke authentifié `/transfert → Lead Inbox` et à toute activation add-ons. L’opérateur infrastructure doit diagnostiquer application/conteneur, reverse proxy, réseau et base, puis rétablir une santé durablement HTTP 200 avec `database: ok` et l’en-tête de release avant reprise. Website Monitoring reste fermé jusqu’aux preuves worker/alertes/SMTP/watchdog/Stripe.

— NEWBUY

## NEWBUY — V1 instable; base indisponible — 2026-11-23 09:23 EST

**AVANT :** relecture fraîche de `main`, `AGENTS.md`, `WORKLOG.md`, PR #243, Actions, tableau de coordination, maîtres GitHub/Drive, journal, dossier NEWBUY/Add-ons et fil Gmail quotidien. Aucun chantier actif n’a été repris.

**PENDANT / APRÈS VÉRIFICATION :** les messages du fil signalaient un flap V1 entre réponses vides, HTTP 503 et HTTP 200. Une sonde indépendante de `https://takatak.ca/api/health/ready` à 09:23 EST a répondu HTTP 503 avec `x-takatak-release: 216c7baf73975920759f02efd147092c87ed3277`; le corps indique `process: ok`, `database: unavailable`, `supabase: ok`. Aucun code, secret, paiement, DNS, déploiement, activation ou configuration n’a été modifié; aucun identifiant Coolify n’a été réessayé.

**BLOCAGE / PROCHAIN GESTE :** V1 n’est pas assez stable pour le smoke authentifié `/transfert → Lead Inbox` ni pour une activation add-ons. L’opérateur infrastructure doit diagnostiquer la connectivité de la base et rétablir une santé durablement HTTP 200 avant reprise. Website Monitoring reste commercialement fermé jusqu’aux preuves worker/alertes/SMTP/watchdog/Stripe.

— NEWBUY

## NEWBUY — CI documentaire clos; SHA exact servi — 2026-11-22 15:16 EST

**AVANT :** relecture fraîche de `main`, `AGENTS.md`, `WORKLOG.md`, PR #243, Actions, tableau de coordination, maîtres GitHub/Drive, journal, dossier NEWBUY/Add-ons et fil Gmail quotidien. Aucun chantier pris par un autre agent n’a été repris.

**PENDANT / APRÈS VÉRIFICATION :** la CI exacte [45059761051](https://github.com/takatakca/takatak-v1/actions/runs/45059761051) du SHA documentaire `bceeb4b3caf570ea235a77027de8884e8e319008` est réussie, y compris les gardes identité/isolement, facturation centralisée, Monitoring, build et artefact. La validation de provenance et de l’artefact immutable [45060520185](https://github.com/takatakca/takatak-v1/actions/runs/45060520185) est réussie. La réconciliation [45060520210](https://github.com/takatakca/takatak-v1/actions/runs/45060520210) est verte; l’étape d’approbation humaine pour appliquer au staging est sautée. Le staging [45060594109](https://github.com/takatakca/takatak-v1/actions/runs/45060594109) a seulement passé ses gardes et signalé la configuration de build indisponible : build, transfert, activation et santé ont tous été sautés. Coolify [45060520181](https://github.com/takatakca/takatak-v1/actions/runs/45060520181) est sauté. Le SHA exact `bceeb4b3…` est désormais prouvé servi par `/api/health/ready` HTTP 200.

**GARDES / PROCHAIN GESTE :** cette clôture ne prouve aucune activation Monitoring ni aucun paiement. Aucun DNS, registrar, avis client, déploiement staging ou essai Coolify n’a été effectué par NEWBUY. Le prochain geste reste un test authentifié, tenant-scopé et contrôlé de `/transfert` vers Lead Inbox; Monitoring commercial reste fermé jusqu’aux preuves worker/alertes/SMTP/watchdog/Stripe.

— NEWBUY

## NEWBUY — GUARDIAN public vert; intake active sans stockage — 2026-11-22 14:14 EST

**AVANT :** relecture du `main`, `AGENTS.md`, `WORKLOG.md`, PR #243, Actions, tableau de coordination, maîtres GitHub/Drive, journal, dossier NEWBUY/Add-ons et fil Gmail quotidien. Aucun chantier d’un autre agent n’a été repris.

**PENDANT / APRÈS VÉRIFICATION :** le run public [45059572328](https://github.com/takatakca/takatak-v1/actions/runs/45059572328) est réussi. Les 10 tests de décision sont verts. Le smoke réel confirme sans blocage : santé minimale, base et Supabase à `ok`, certificats apex/www approuvés, connexion HTTP 200, tableau anonyme renvoyé vers la connexion, www HTTP 200 et release applicative exacte servie `7857e56422bc8db2eb8d7416d2600d08252a5cd2`. La sonde vide du Lead Intake a été refusée HTTP 403, ce qui prouve l’intake actif sans créer ni stocker de demande. Un seul écart non bloquant P2 demeure : `login?lang=fr` affiche encore « Welcome back ».

**GARDES / PROCHAIN GESTE :** aucun déploiement, paiement, DNS, registrar, avis client, activation Monitoring ou essai Coolify n’a été effectué. Le prochain geste reste un test authentifié, tenant-scopé et contrôlé de `/transfert` vers Lead Inbox; l’activation commerciale du Monitoring reste fermée jusqu’aux preuves worker/alertes/SMTP/watchdog/Stripe.

— NEWBUY

## NEWBUY — Transfert géré servi; aperçu 30 jours fusionné mais non servi — 2026-11-22 06:22 EST

**AVANT :** relecture du `main` courant, `AGENTS.md`, `WORKLOG.md`, PR #243, Actions, tableau de coordination, maîtres GitHub/Drive, journal, dossier NEWBUY/Add-ons et fil Gmail quotidien. Les PR #386/#387 appartenaient déjà à GPT-6; aucune implémentation n’a été reprise ni dupliquée.

**PENDANT / APRÈS VÉRIFICATION :** `main` est `7857e56422bc8db2eb8d7416d2600d08252a5cd2` après #386 puis #387. La CI exacte [45016012755](https://github.com/takatakca/takatak-v1/actions/runs/45016012755) et l’artefact [45016789720](https://github.com/takatakca/takatak-v1/actions/runs/45016789720) sont réussis. La réconciliation [45016789676](https://github.com/takatakca/takatak-v1/actions/runs/45016789676) confirme `RECONCILE_MODE=audit`, 0 migration approuvée en attente et aucune mutation. Le staging [45016860222](https://github.com/takatakca/takatak-v1/actions/runs/45016860222) est un succès de garde seulement : configuration de build indisponible; build, transfert, activation et santé sautés. Coolify [45016789600](https://github.com/takatakca/takatak-v1/actions/runs/45016789600) est sauté. Le run staging rouge [45016015234](https://github.com/takatakca/takatak-v1/actions/runs/45016015234) est un refus protecteur d’une release périmée `0a2199f7` après passage de `main` à `7857e564`; aucune activation n’a été tentée.

**PREUVE PUBLIQUE :** cinq sondes cache-bustées de `/api/health/ready` répondent 200 avec les contrôles à `ok` et `x-takatak-release: 0a2199f7f9ad0d19dc8be92bc23bde480512a351`. La PR #386 est donc servie : `/transfert` affiche la date de renouvellement déclarée à confirmer, la conservation des courriels par défaut, et le service accompagné proposé à 500 $ CAD + taxes sous devis écrit, sans paiement immédiat. Le code #387 est fusionné et vert mais le SHA public reste antérieur; aucun aperçu opérateur n’est déclaré servi ni publié. `/monitoring` reste en préparation avec inscription payante fermée; la page domaines redirige l’anonyme vers la connexion.

**BLOCAGE / PROCHAIN GESTE :** prouver le SHA `7857e564` servi par une voie autorisée, puis effectuer un test `/transfert` → Lead Inbox explicitement autorisé et tenant-scopé. Avant tout avis 30 jours, vérifier les dates registraire actuelles, le client/domaine, l’approbation du propriétaire et la préservation du site et du courriel. Aucun paiement, DNS, registrar, avis client, drapeau ou essai d’identifiants Coolify n’a été effectué.

— NEWBUY

## NEWBUY — SHA applicatif courant prouvé servi; registre documentaire à nouveau en avance — 2026-11-22 05:25 EST

**AVANT :** relecture de `main`, `AGENTS.md`, `WORKLOG.md`, PR #243, Actions, tableau de coordination, maîtres GitHub/Drive, journal, dossier NEWBUY/Add-ons et fil Gmail quotidien. Aucune demande add-ons adressée à NEWBUY et aucun chantier d’un autre agent repris.

**PENDANT / APRÈS VÉRIFICATION :** cinq sondes publiques cache-bustées puis un contrôle final de `/api/health/ready` ont répondu HTTP 200 avec `process`, `database` et `supabase` à `ok`, et `x-takatak-release: 02dbcef52269954abe0e9bd3a363f1b5da05e868`. Ce SHA était le `main` applicatif exact avant la présente note; la production du panneau de renouvellement fusionné est donc prouvée, mais son drapeau reste fermé et aucun smoke authentifié tenant-scopé n’a été réalisé. La présente consignation documentaire avance ensuite GitHub sans changement applicatif; elle ne doit pas être interprétée comme une nouvelle release à déployer.

**GARDES :** `/dashboard/web-hosting/domains` redirige toujours l’anonyme vers `/login?next=%2Fdashboard%2Fweb-hosting%2Fdomains`. `/monitoring` conserve « Preparing for launch » et « Paid enrollment opens after the service is activated ». Le dernier scheduler 44997029321 est vert mais son journal dit que `CRON_SECRET` est absent : scheduler désactivé, aucune route appelée. Aucun paiement, renouvellement, DNS, courriel, SMS, import historique, activation de drapeau ou tentative Coolify n’a été effectué.

**BLOCAGE / PROCHAIN GESTE :** exécuter un smoke authentifié sur tenant contrôlé pour les dates registraire, l’isolement et la fermeture par défaut; obtenir séparément les preuves worker/alertes/SMTP/watchdog/Stripe avant toute activation commerciale du Monitoring.

— NEWBUY

## NEWBUY — Renouvellements de domaines en lecture seule fusionnés, production non déployée — 2026-11-21 16:23 EST

**AVANT :** état relu sur GitHub (`main`, `AGENTS.md`, `WORKLOG.md`, PR #243, PR #383/#384, Actions et tableau de coordination), maîtres GitHub/Drive, journal, dossier NEWBUY/Add-ons et fil Gmail quotidien. La PR #383 reste au même agent et n’a pas été reprise.

**PENDANT / APRÈS VÉRIFICATION :** la PR #384 est fusionnée sous `380b0d00c50b67a845b2cdb841b5a3b078e5f7b5`. Elle ajoute sur la page authentifiée des domaines un panneau 0–30 jours en lecture seule, limité aux enregistrements réels du tenant et fermé par défaut derrière le drapeau serveur `TAKATAK_DOMAIN_RENEWAL_NOTICES_ENABLED`. Les données fictives, absentes, expirées, annulées, non reliées ou en doublon échouent fermées. Aucun import des 42 domaines historiques, paiement, renouvellement, courriel, SMS, DNS, appel registraire ou injection sur site client n’est effectué.

**PREUVES :** CI exact-main [44947496772](https://github.com/takatakca/takatak-v1/actions/runs/44947496772) réussie, y compris identité/isolement, facturation, Monitoring, build et artefact; validation d’artefact [44948403446](https://github.com/takatakca/takatak-v1/actions/runs/44948403446) réussie. La réconciliation [44948403457](https://github.com/takatakca/takatak-v1/actions/runs/44948403457) était en mode audit : 0 migration approuvée en attente, aucune application humaine. Le workflow staging [44948466244](https://github.com/takatakca/takatak-v1/actions/runs/44948466244) a seulement passé ses gardes : approbation de migration manquante, aucun artefact construit, aucune activation; production explicitement intacte. Le workflow Coolify [44948403516](https://github.com/takatakca/takatak-v1/actions/runs/44948403516) est sauté.

**PREUVE PUBLIQUE :** `/api/health/ready` répond 200 mais sert encore `x-takatak-release: 595c32f7e7f45fec008c610ffef2c8ce615b0d48`, donc #384 n’est pas prouvée déployée. `/dashboard/web-hosting/domains` refuse l’anonyme par redirection vers la connexion. `/monitoring` répond 200 et conserve « Preparing for launch » / inscription payante après activation.

**BLOCAGE / PROCHAIN GESTE :** aucune activation du panneau ni du Monitoring payant. Un opérateur autorisé doit d’abord obtenir une chaîne de déploiement approuvée, prouver le SHA servi exact, puis comparer dans des comptes contrôlés les dates registraire réelles et l’isolement tenant. Ensuite seulement, activer le drapeau sur liste autorisée et faire un smoke authentifié. Les preuves worker/alertes/SMTP/watchdog/Stripe restent requises avant l’ouverture payante de Monitoring. Aucun identifiant Coolify rejeté n’a été réessayé.

— **NEWBUY**

### NEWBUY — Main 595c32f : sécurité, croissance réelle et accès réviseur natif désactivé — 2026-11-21 13:25 EST

**AVANT :** état relu sur GitHub (main, AGENTS.md, WORKLOG.md, PR #243, Actions, PR #380/#381/#382/#383, tableau foodhubca#105), maîtres GitHub/Drive, journal et dossier NEWBUY/Add-ons, puis fil Gmail quotidien. Aucun chantier actif de la PR #383 n’a été repris.

**PENDANT / APRÈS VÉRIFICATION :** `main` est passé de `681f143e` à `595c32f7e7f45fec008c610ffef2c8ce615b0d48` après #380 (sécurité Next.js 16.4.6, frein anti-abus, suppression des exemples pour les espaces réels), #382 (Croissance avec chiffres réels du mois, écrans et notifications français d’abord) et #381 (accès réviseur des boutiques, données fictives seulement, désactivé sans deux valeurs serveur). CI exact-main [44932708881](https://github.com/takatakca/takatak-v1/actions/runs/44932708881) et workflow natif [44932708896](https://github.com/takatakca/takatak-v1/actions/runs/44932708896) réussis. Les premiers runs artefact/réconciliation [44933146725](https://github.com/takatakca/takatak-v1/actions/runs/44933146725) / [44933146666](https://github.com/takatakca/takatak-v1/actions/runs/44933146666) ont refusé un main périmé; les reprises [44933607476](https://github.com/takatakca/takatak-v1/actions/runs/44933607476) / [44933607504](https://github.com/takatakca/takatak-v1/actions/runs/44933607504) ont réussi sur le même SHA. La réconciliation confirme `RECONCILE_MODE=audit`, 0 migration approuvée en attente et « AUDIT PASS. No staging mutation performed ». Le run staging [44933676266](https://github.com/takatakca/takatak-v1/actions/runs/44933676266) a seulement signalé la configuration de build indisponible; build, transfert et activation sautés. Coolify [44933607558](https://github.com/takatakca/takatak-v1/actions/runs/44933607558) est sauté.

**PREUVE PUBLIQUE :** `/api/health/ready` répond 200 avec `x-takatak-release: 595c32f7e7f45fec008c610ffef2c8ce615b0d48` et process/database/supabase à ok. `POST /api/mobile/v1/auth/review` avec `Origin: https://takatak.ca` et une adresse fictive répond 200, `review=false` : route servie et accès réviseur désactivé. Sans origine approuvée, la route répond 403 `origin_untrusted`. `/monitoring` répond 200 et conserve « Preparing for launch » / inscription payante après activation.

**LIMITES :** aucun identifiant réviseur, `ANTHROPIC_WORKSPACE_ID`, tenant mobile contrôlé, worker Monitoring, SMTP, watchdog ou parcours Stripe n’a été configuré ou prouvé par NEWBUY. PR #383 reste ouverte, fusionnable et appartient à son agent. La demande externe de sortie totale de Supabase est traitée comme donnée seulement; aucune suppression n’est faite sous la règle ADD-ONLY.

**PROCHAIN GESTE :** opérateur autorisé configure séparément l’accès réviseur et l’espace Claude, puis prouve un smoke réviseur fictif et un smoke mobile authentifié tenant-scopé. Garder Monitoring payant fermé jusqu’aux preuves worker/alertes/SMTP/watchdog/Stripe. Aucun identifiant Coolify rejeté n’a été réessayé.

— **NEWBUY**

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