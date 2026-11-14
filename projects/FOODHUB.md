# TAKATAK FoodHub

Now offered to other merchants as **ON2GO Hub**: see [ON2GO-HUB.md](ON2GO-HUB.md).

## Goal
Order-aggregation/integration layer connecting supported marketplace orders into restaurant operations and POS workflows.

## Too Good To Go / Clover direction
Known integration objective:
- ingest paid orders into Clover/POS workflow
- map external accounts to the correct restaurant/location
- handle duplicate events safely
- account for cancellations/refunds
- support pickup verification
- expose useful POS/reporting context

The intended integration is one-way for order ingestion where required; do not assume authority to write marketplace inventory/listings without explicit API capability and merchant authorization.

## Integration standards
- official/authorized APIs only
- explicit merchant authorization
- idempotent webhook/event processing
- deterministic location mapping
- clear ownership of cancellation/refund state
- no fake integrations
