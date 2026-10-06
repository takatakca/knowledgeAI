# MASTER CODING PROMPT — TAKATAK AI NEXUS + INDEPENDENT CLIENT PLATFORMS

Use this prompt with Codex, Claude Code, Cursor or another authorized coding agent.

## Mission

Build/extend TAKATAK AI Nexus inside the TAKATAK platform while preserving a strict rule:

**Every client website/application is an independently transferable software product. TAKATAK supplies managed backend capabilities through explicit adapters/APIs during the contract; TAKATAK must not make the client's application technically impossible to operate after an agreed transfer.**

## Source repositories

Primary TAKATAK application:
`takatakca/takatak-v1`

Professional architecture/knowledge:
`takatakca/knowledgeAI`

Before coding, read:
- `docs/00-MASTER-INDEX.md`
- `docs/10-PORTFOLIO-DOMAINS-REPOS-2026-10-06.md`
- `docs/11-CLIENT-INDEPENDENCE-TRANSFER-ARCHITECTURE.md`
- `docs/05-IDENTITY-AND-MULTISITE.md`
- `projects/TAKATAK-AI-NEXUS.md`
- relevant project dossier(s)

## AI Nexus UX

Build one capability-oriented dashboard rather than separate public dashboards for AI companies.

Top-level user intents:
- Create
- Automate
- Analyze
- Research
- Code
- Publish
- Manage

Creation capabilities can include:
- Ad
- Video
- Image
- UGC
- AI spokesperson/avatar
- Social content
- Voiceover
- Dubbing/translation
- Song/music/rap
- Music video
- Document
- Presentation
- Landing page/site/app

Provider choice belongs behind a capability router. Advanced/admin users may inspect or override provider selection.

## Provider architecture

Create provider-independent entities/interfaces such as:

`AiProvider`
`AiProviderConnection`
`AiModel`
`AiCapability`
`AiProviderCapability`
`AiRoutingPolicy`
`AiUsageRecord`
`AiGenerationJob`
`AiGenerationAsset`
`AiWorkflow`
`AiWorkflowStep`

Adapter shape should support capabilities, models, health, estimate, submit, status, cancel and normalized results.

Do not hard-code "video = Runway" or "voice = ElevenLabs".

## Initial provider families

Architect for verified/current or planned providers:
- OpenAI / ChatGPT
- Anthropic / Claude
- Codex
- Cursor
- Runway
- TwelveLabs
- ElevenLabs
- Higgsfield
- HeyGen
- Arcads
- Creatify
- Songer / Suno where integration rights/API allow
- Riven only after the existing product/integration is identified and verified

Never fabricate an API connection.

## Context

Every job must carry explicit:
- organization
- client/business
- brand
- project
- repository
- domain
- campaign
- location where relevant
- knowledge scope
- data-rights scope

No cross-client retrieval by default.

## Independent client architecture

Client applications retain:
- their own repo/boundary;
- own domain;
- own business logic;
- own deployable build;
- own local stable IDs;
- own data/export boundary;
- documented external dependencies.

TAKATAK attaches via interfaces such as:
`IdentityAdapter`
`LeadProviderAdapter`
`AiGenerationAdapter`
`SocialPublishingAdapter`
`AdsAdapter`
`MessagingAdapter`
`AnalyticsAdapter`
`BillingAdapter`
`ReviewAdapter`
`CommerceConnectorAdapter`

No browser-to-TAKATAK-database access.
No sibling-client direct database calls.
No TAKATAK master secrets in client repositories.

## Identity correction

Do NOT assume a client application must permanently depend on TAKATAK Auth.

During the managed contract, federate/link to TAKATAK Auth where useful. Preserve a stable local application identity or a documented replacement path so the agreed platform can operate after transfer.

Model:
`client_local_user_id <-> optional takatak_master_identity_id`

## Data rights

Implement provenance and transfer classes. At minimum distinguish:
- client platform data;
- client first-party customer data;
- TAKATAK agency/internal data;
- TAKATAK-originated leads;
- shared derived data;
- secrets/credentials;
- third-party governed data.

Do not implement hidden extraction or secretly copy one client's data into another client.

TAKATAK-originated lead inventory, cross-client intelligence, proprietary routing/scoring and internal provider economics remain TAKATAK managed assets only where the contract/privacy basis permits.

Ambiguous rights must be marked for contract/legal review rather than guessed.

## Commercial lifecycle

Use explicit, reversible commercial states. Do not implement destructive hostage/kill-switch behavior.

Support states like:
`ACTIVE_MANAGED`
`PAYMENT_ATTENTION`
`SUSPENDED_BY_CONTRACT`
`TRANSFER_PENDING`
`TRANSFER_READY`
`TRANSFERRED`

Suspension must preserve data and auditability.

## Transfer readiness

Each client repository should eventually include a `TRANSFERABILITY.md` documenting:
- transfer package;
- excluded TAKATAK services/IP;
- data classes;
- external accounts;
- replacement adapter requirements;
- credential rotation;
- deploy/build instructions;
- known blockers.

## Infrastructure

Target TAKATAK-managed backend production:
Contabo VPS + Coolify.

Retain external managed services where appropriate (Supabase, Cloudflare, Twilio, Stripe, Meta/Google, etc.).

Do not move a client site just for uniformity. Every migration requires a current-state audit, staging validation, health checks and rollback.

## Execution

1. Audit before modifying.
2. Reuse existing TAKATAK entities and routes.
3. Produce dependency graph.
4. Implement in small reviewable phases.
5. Test business isolation and provider failures.
6. Update `knowledgeAI` with decisions.
7. Do not claim deployment/connection success without runtime evidence.
8. Do not modify unrelated production infrastructure.
9. Never commit credentials.
10. Preserve client transferability in every new dependency.
