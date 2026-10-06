# Identity and Multi-Site Standard

## Core rule

TAKATAK may provide the preferred master identity/federation layer during a managed contract, but client websites/applications are independently transferable products.

Identity integration must therefore be **federated and replaceable**, not captive.

## Recommended relationship during TAKATAK-managed operation

```
person
 → client-local subject/user ID
 → optional TAKATAK master identity mapping
 → organization/workspace relationship
 → product/client entitlement
 → client application
```

A client application should retain a stable local identity/reference for its own domain records even when login is federated through TAKATAK.

Recommended mapping:

```
client_local_user_id
        ↕
optional takatak_master_identity_id
```

The TAKATAK mapping can support cross-service operations, CRM, agency workflows and shared login while the client-local identifier protects transferability.

## Allowed identity patterns

Depending on the client/product and contract:

1. **Local auth + TAKATAK account linking**
2. **TAKATAK as OIDC/OAuth identity provider** with documented replacement/migration path
3. **Dual/federated identity**
4. **TAKATAK-only operational auth during contract**, only if the transfer package includes a tested path to replace it

Do not claim an application is transfer-ready if removing TAKATAK Auth makes all customer/admin access impossible and no replacement path exists.

## Cross-product rule

Client applications must not:
- access the TAKATAK database directly from browser code;
- rely on sibling client databases;
- send passwords, private credentials or raw secrets in redirect URLs;
- silently merge one client's identities/customer records into another client's data;
- assume identity federation grants authorization to every TAKATAK or sibling resource.

Use versioned server-side APIs/contracts, signed handoffs and explicit scopes.

## Identity ≠ authorization

A shared identity means only that the same person can be resolved across authorized systems.

It does not automatically grant:
- access to another client;
- access to another business/location;
- access to TAKATAK internal data;
- cross-client customer/lead visibility;
- administrative permissions.

Authorization remains resource-, organization-, business- and product-scoped.

## Telecom handoff model

For TAKATAK ↔ MIMT, known shared identifiers may include:

- `global_user_id`
- `workspace_id`
- `business_id`
- `telecom_account_id`
- `service_subscription_id`
- `phone_number_id`

The MIMT application must still preserve its own transferable operational records and a documented replacement/auth path.

## Entitlements and managed-service lifecycle

Product/service access can be driven by server-side entitlement state during the contract.

Recommended lifecycle:
- `ACTIVE_MANAGED`
- `PAYMENT_ATTENTION`
- `SUSPENDED_BY_CONTRACT`
- `TRANSFER_PENDING`
- `TRANSFER_READY`
- `TRANSFERRED`
- `TERMINATED`

Suspension must be auditable and reversible when the contract permits it. Do not destroy data or corrupt the client application as leverage.

## Transfer/offboarding identity requirements

A transfer plan must identify:
- client-local identities;
- TAKATAK identity mappings;
- account export/migration rules;
- password reset or new identity-provider migration path;
- client-owned vs TAKATAK-managed OAuth applications;
- third-party reauthorization requirements;
- session/token revocation;
- credential rotation.

For the broader transfer architecture, see `docs/11-CLIENT-INDEPENDENCE-TRANSFER-ARCHITECTURE.md`.
