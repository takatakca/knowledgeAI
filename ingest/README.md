# Ingestion

This directory defines future ingestion behavior. It does not store credentials.

## Pipeline

```
source connector/export
  → source inventory
  → classification
  → segmentation
  → deduplication
  → provenance/hash
  → normalization
  → project/domain routing
  → derived summaries/decisions
  → search/vector indexing
```

## Requirements
- idempotent ingestion
- deterministic source IDs where possible
- provenance on every record
- explicit current/historical/superseded state
- conflict preservation
- no secret ingestion
- project and agent access scoping
- ability to rebuild indexes from source records
- raw source and derived content must remain distinguishable

## Future runtime
A TAKATAK backend service can periodically pull approved repository content, validate it against schemas, index it into PostgreSQL/pgvector/search, and expose a scoped retrieval API to authorized agents.
