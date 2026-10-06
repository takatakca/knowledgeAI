# Client Independence, Managed Services and Transfer Architecture

## Core business requirement

TAKATAK builds and operates client websites/applications during a managed contract, commonly with a long service horizon such as five years. The client platform must nevertheless remain a real, separable software product that can be transferred at the end of the applicable agreement.

The architecture must therefore satisfy both goals:

1. **Independent client platform** — the client can ultimately receive the agreed application/code/assets/data package and run it without being forced to keep TAKATAK.
2. **TAKATAK managed engine** — during the contract, TAKATAK can supply identity federation, AI, advertising, lead generation, social, analytics, automation, messaging, billing, integrations and operational services through explicit interfaces.

A client application is not a disposable frontend for TAKATAK. It is an independent product with optional/contracted TAKATAK services attached.

## Non-negotiable separation

Every transferable client platform should have, where technically appropriate:

- its own repository or clearly separable repository boundary;
- its own domain(s);
- its own environment configuration;
- its own deployment manifest/runbook;
- its own database/schema or exportable isolated tenant boundary;
- its own application/business logic;
- its own static/media assets that are part of the transfer package;
- tests and release process;
- an inventory of external dependencies;
- an explicit TAKATAK adapter boundary.

TAKATAK services must be consumed through versioned APIs, events, OAuth/federation, webhooks, SDK/adapters or documented connector contracts.

Do not make a client platform depend on reading TAKATAK's production database directly.

Do not make client applications call sibling client databases directly.

## Independence test

A platform is transfer-ready only when an engineer can answer:

> If the TAKATAK-managed connectors are disabled and the agreed replacement services are configured, can this application still be deployed, authenticated, operated and maintained as an independent product?

If the answer is no, there is an architectural coupling defect to document.

## Identity model — federated, not captive

During the managed contract, TAKATAK Auth may be the preferred login/identity provider. However, a transferable client application must not make its own continued existence impossible when the TAKATAK identity service is removed.

Recommended model:

```
Client local subject / user ID
        ↕ optional federation mapping
TAKATAK master identity ID
```

Store a stable local application identifier and, when connected, an optional immutable TAKATAK identity mapping.

A transferable client app may use one of these patterns:

- local auth plus TAKATAK account linking;
- TAKATAK Auth as OIDC/OAuth identity provider with a documented replacement path;
- dual/federated identity with migration/export tooling.

Never store passwords in redirect URLs. Never require direct browser access to TAKATAK databases.

## Data classes

Data transfer cannot be decided by one vague "customers belong to X" flag. Model provenance and rights explicitly.

### CLIENT_PLATFORM_DATA

Application configuration, client content, catalog/menu, operational records and other data created inside the client's own software.

Transfer treatment: governed by the contract and applicable law; normally part of the platform/offboarding package when it is the client's business data.

### CLIENT_FIRST_PARTY_DATA

Customer/account/order/request data collected directly by the client platform from the client's own users/customers.

Transfer treatment: must be handled according to the contract, privacy notices, consent, applicable law and processor/controller roles. Do not silently classify first-party customer records as TAKATAK property merely because TAKATAK operated the software.

### TAKATAK_AGENCY_DATA

Examples:

- TAKATAK-owned lead marketplace inventory;
- agency prospecting lists;
- cross-client campaign intelligence;
- TAKATAK model/routing performance;
- proprietary scoring;
- internal optimization signals;
- TAKATAK network audience/placement data;
- internal prompts/workflows not sold as client deliverables;
- provider cost/margin information;
- internal operational analytics.

Transfer treatment: excluded from a client software transfer when the contract and data/privacy basis permit. The client may receive results/deliverables without receiving the proprietary engine or cross-client dataset.

### TAKATAK_ORIGINATED_LEADS

Leads supplied by the TAKATAK network/agency rather than organically created as the client's own first-party records must retain provenance.

Required fields should include:

- `lead_source`
- `source_network`
- `source_campaign_id`
- `source_owner`
- `client_license_scope`
- `created_at`
- `consent_basis` where applicable
- `transfer_class`

At offboarding, transferability follows the contract, user consent/privacy obligations and the lead-source agreement. Do not use hidden copying or undisclosed extraction.

### SHARED_DERIVED_DATA

Reports/scores/segments derived from both client and TAKATAK data.

Transfer treatment: define in the contract and metadata. Where practical, distinguish transferable client-facing output from TAKATAK's reusable methodology/model.

### CREDENTIALS_AND_SECRETS

API keys, service-role keys, private signing keys, internal tokens and other secrets.

Transfer treatment: never copy TAKATAK-owned provider credentials into a transfer. Client-owned credentials may be rotated/reissued to the client through a secure process.

### THIRD_PARTY_DATA

Data governed by Meta, Google, Stripe, Twilio, Clover, delivery platforms, social networks, AI providers, etc.

Transfer treatment: subject to the third party's terms and account ownership. Build reconnect/reauthorize paths rather than assuming credentials can be transferred.

## Managed-service boundary

Client application:

```
CLIENT APP
  ├─ own UX
  ├─ own domain
  ├─ own business rules
  ├─ own data boundary
  ├─ own build/deploy package
  └─ TAKATAK adapters
          ↓
      versioned APIs/events
          ↓
TAKATAK MANAGED SERVICES
  ├─ Auth/federation
  ├─ CRM/agency operations
  ├─ Leads
  ├─ Ads
  ├─ Social
  ├─ AI Nexus
  ├─ Automations
  ├─ Messaging
  ├─ Analytics
  ├─ Billing where contracted
  └─ Connector Vault / third-party integrations
```

The client app receives only the capabilities/data its contract and authorization allow.

## Commercial entitlement and suspension

Do not implement destructive "hostage" mechanics, secret kill switches or data deletion as payment enforcement.

Use explicit, auditable commercial states:

- `TRIAL`
- `ACTIVE_MANAGED`
- `PAYMENT_ATTENTION`
- `SUSPENDED_BY_CONTRACT`
- `TRANSFER_PENDING`
- `TRANSFER_READY`
- `TRANSFERRED`
- `TERMINATED`

If the agreement permits suspension for non-payment, suspend managed services/access in a documented, reversible way. Preserve data according to retention obligations. Never corrupt code or destroy client records as leverage.

## Five-year / end-of-contract transfer package

Where the contract provides for transfer, prepare a reproducible handoff containing the agreed scope:

- source repository snapshot or transferred repo;
- tagged release and commit SHA;
- build instructions;
- environment variable template with no secrets;
- database/schema migrations;
- agreed client-data export;
- media/assets in scope;
- third-party dependency inventory;
- DNS/domain handoff instructions where applicable;
- deployment runbook;
- backup/restore runbook;
- tests and known limitations;
- admin/user documentation;
- replacement instructions for TAKATAK-managed connectors;
- list of services/features that will stop when TAKATAK is disconnected;
- credential rotation checklist;
- final acceptance record.

TAKATAK proprietary platform code, cross-client datasets, internal AI/routing systems and agency-owned lead inventory are not included unless the contract explicitly includes them.

## Client adapter rule

Every TAKATAK integration should have a narrow interface, for example:

```
IdentityAdapter
LeadProviderAdapter
AiGenerationAdapter
SocialPublishingAdapter
AdsAdapter
MessagingAdapter
AnalyticsAdapter
BillingAdapter
ReviewAdapter
CommerceConnectorAdapter
```

The client-specific application calls the interface; the TAKATAK implementation can later be replaced.

## Repository rule

A client repository may contain:

- adapter contracts;
- local domain logic;
- UI;
- tests;
- mock/test implementations;
- environment variable names;
- migration/export tools.

It must not contain:

- TAKATAK master API secrets;
- reusable cross-client lead databases;
- private agency intelligence;
- unrestricted service-role credentials;
- secrets belonging to another client.

## Audit requirement

For every client platform, add a `TRANSFERABILITY.md` or equivalent document answering:

- What does the client receive?
- What remains TAKATAK intellectual property/service?
- Which data classes exist?
- Which domains/accounts are client-owned vs TAKATAK-managed?
- Which third-party accounts must be reauthorized?
- Which features fail when TAKATAK is disconnected?
- What replacement adapters are required?
- What is the current transfer-readiness status?

## Contract alignment warning

Technical metadata should represent the signed agreement; it must not silently invent ownership rights. Any ambiguous customer/lead ownership, privacy role, retention right, or transfer exclusion must be marked `LEGAL/CONTRACT REVIEW REQUIRED` rather than guessed by code or AI.
