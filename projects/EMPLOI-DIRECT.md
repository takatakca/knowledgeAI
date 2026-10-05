# EMPLOI DIRECT

## Product boundary

EMPLOI DIRECT is an employment vertical inside the GROUPE TAKATAK architecture. It owns employment operations, not master identity.

## TAKATAK owns

- master identity
- customer/company/merchant identity
- authentication
- signup/login/OTP
- roles and central permissions
- identity resolution and duplicate resolution
- central CRM relationships
- central analytics/integrations/marketing/billing/admin

## EMPLOI DIRECT owns

- candidate profile
- employment history
- availability
- work preferences
- employment documents
- job interests
- opportunities
- employment messages
- work orders
- matching/dispatch
- assignments
- recruiter operations

## Identity flow

```
candidate
  ↓
EMPLOI DIRECT
  ↓
TAKATAK Auth
  ↓
TAKATAK master identity
  ↓
authorized identity/session context
  ↓
EMPLOI DIRECT local employment relationship
```

EMPLOI DIRECT must retain both:
- its local candidate ID
- an immutable TAKATAK master-identity reference

Email and phone cannot be the permanent cross-system key because they can change.

## Relationship model

Conceptual relationship:

```
master_identity_id
source_vertical = EMPLOIDIRECT
source_record_id = local candidate
relationship_type = candidate
```

## Identity is not authorization

Recognizing the same person across verticals does not grant every child application access to the person's data in other verticals.

Each product receives only its authorized projection.

## Integration boundary

Keep TAKATAK adapter logic in a dedicated server-side boundary such as `src/lib/takatak/`, not scattered through UI components.

A useful boundary may include:
- auth
- identity
- client
- types
- mapping
- events
- outbox
- permissions
- config

Never invent a live production API that does not exist. Use an explicit configuration-required state until a real adapter is connected.

## Event relay

Use secure outbox/event patterns for authorized identity synchronization.

Never send passwords, auth secrets, raw OTPs, card data, unrelated private documents or child-app-private notes through identity events.

## Source

Curated from the EMPLOIDIRECT critical-architecture prompt/library source that defines TAKATAK master identity and authorized child-application data relay.
