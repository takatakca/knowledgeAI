# TAKATAK Architecture Standard

## Central authority

GROUPE TAKATAK is the central platform authority.

The reusable platform pattern is:

```
TAKATAK Identity/Auth
      ↓
TAKATAK Dashboard / Control Plane
      ↓
shared services and APIs
      ↓
independent product applications
```

Child products keep their own domain UX and domain data. They should not create a second master identity system and should not directly couple to sibling applications.

## Shared central services

Reusable TAKATAK platform capabilities include:

- Identity / authentication / OTP
- organizations, workspaces, brands and locations
- roles, permissions and entitlements
- billing and subscription services
- notifications
- SMS / voice / email
- social account connections
- reviews / reputation
- content / blog / CMS
- analytics
- integrations and connector vault
- webhooks
- agent / automation services

## Data-access rules

- Server-side authorization is authoritative.
- Browser clients do not receive privileged database credentials.
- Prisma/database access remains server-side.
- Product authorization must not rely on editable user metadata.
- Audit important writes.
- Verify webhook signatures.
- Use idempotency for externally-triggered state changes.
- Never log secrets/tokens.

## Product isolation

A product may reuse TAKATAK services without exposing unrelated product data.

Recommended hierarchy:

```
Platform
 └─ Workspace
     └─ Client / Organization
         └─ Brand
             └─ Location
                 └─ External accounts / domain records
```

## Source-of-truth rule

GitHub repositories are the engineering source of truth. Knowledge TakaTak stores the decisions, contracts and project memory needed to understand and evolve them.
