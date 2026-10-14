# Ingestion — public catalog and future private retrieval

## Available now: static, public, deterministic search

Run the Python standard-library catalog builder from the repository root:

    python3 ingest/build_catalog.py
    python3 -m unittest discover -s ingest/tests -v
    python3 ingest/build_catalog.py --check

Commit the regenerated knowledge-catalog.json with every public Markdown
change. GitHub Actions checks unit tests, drift and recognizable credential
patterns. The search corpus is sourced **only** from approved public Markdown
in root README/BRAND/AGENTS and docs/, projects/, prompts/. It does **not**
ingest private files, users, customer data, or local machine exports.

The website reads public JSON directly and links to the original GitHub files.
This is not an authenticated retrieval API and must not be used for client secrets.

## Future ingestion pipeline (NOT YET IMPLEMENTED)

    approved source → classification → segmentation → deduplication
    → source IDs / content hashes → normalized records → scoped indexes
    → authenticated retrieval API

Required before ingesting anything private:
- explicit source approval, classification, and confidentiality controls;
- source/derived record separation, immutable provenance and conflict history;
- idempotency, deduplication, proper tenant and product access checks;
- encryption, audit, deletion and client offboarding controls;
- server-side authorization tests for every retrieval path.

See docs/03-INGESTION-POLICY.md and schemas/knowledge-record.schema.json.

Each indexed record carries a deterministic GitHub `source_id` and SHA-256 hash of its public source Markdown bytes. Treat these as provenance, not as authentication or encryption.
