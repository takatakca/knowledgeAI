# KnowledgeAI public agent search API

**Status:** deployed through Git-connected Vercel; GitHub Actions production HTTP smoke checks passed on 2026-10-14. The API is **PUBLIC** and contains only curated Markdown already published in this public repository.

## Routes

```http
GET https://knowledgeai-nu.vercel.app/api/health
GET https://knowledgeai-nu.vercel.app/api/search?q=TAKATAK&section=project&limit=5&offset=0
```

`GET /api/health` reports `status`, `component`, `catalog_version` and `records`. HTTP 200 means the deployed function loaded its public corpus; 503 means catalog data is missing/invalid.

`GET /api/search` accepts:

| Parameter | Meaning | Constraints |
| --- | --- | --- |
| `q` | Search terms (all must match) | optional; max 120 characters and 12 words; accent-insensitive |
| `section` | Source category | `all` (default), `guide`, `standard`, `project`, `prompt` |
| `limit` | Results per page | integer 1–50; default 20 |
| `offset` | Pagination offset | integer 0–999999; default 0 |

HTTP 200 response contains `version: 1`, `visibility: "public"`, `source`, `query`, `section`, `total`, `limit`, `offset` and `results`. Each result includes `title`, `summary`, `section`, `path`, `source_id`, `source_sha256`, `source_url` and a bounded `excerpt`.

`source_sha256` is SHA-256 over the original public Markdown file's **UTF-8 bytes**, used to detect content changes; it does not prove signing, access permissions or confidentiality.

Bad query parameters yield HTTP 400. Write methods yield HTTP 405; this API does not accept or store uploads or private text. No cross-origin credential sharing is enabled.

## Examples

```sh
curl -fsS 'https://knowledgeai-nu.vercel.app/api/search?q=ON2GO&section=project&limit=3'
curl -fsS 'https://knowledgeai-nu.vercel.app/api/health'
```

Search results are only evidence pointers to *public curated documents*. Before executing consequential changes, an agent must read original GitHub source and current product repository state.

## Confidential material — forbidden here

Do not send private source documents, customer data, authorization tokens or API keys to these public URLs. TAKATAK Auth, tenant/product entitlements, durable private storage, per-agent permissions and audit must be implemented and tested in a separate authenticated service before any private ingestion is enabled. See [ingestion policy](./03-INGESTION-POLICY.md) and [task queue](./TASK_QUEUE.md).

## CI

Run `node --test tests/public-api.test.cjs` and `python3 -m unittest discover -s ingest/tests -v`; on `main`, `Knowledge Catalog CI` refreshes the catalog and checks live production HTTP endpoints. The production run must be **success** before claiming a verified release.
