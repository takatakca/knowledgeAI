# knowledgeAI — Knowledge TakaTak

Knowledge TakaTak is the dedicated knowledge repository for the TAKATAK ecosystem and its AI agents.

## What belongs here

- Websites, applications and product specifications
- UI/UX, visual systems, branding and reusable design rules
- Engineering architecture and implementation decisions
- APIs, integrations, OAuth/provider rules and data contracts
- Deployment, hosting, CI/CD and infrastructure decisions
- Business systems that directly support TAKATAK products
- Project histories, decisions, migrations and reusable implementation knowledge
- Reusable prompts, agent instructions and operating standards

## Important security status

**This repository is currently PUBLIC.**

Until its GitHub visibility is changed to **Private**, do not commit:
- family or personal-life material
- lawyer/client communications
- court files or legal evidence
- health information
- credentials, API keys, secrets or tokens
- private financial/account data
- private messages unrelated to product work

The repository can still be fully useful to Claude and other coding agents with the non-sensitive TAKATAK/project corpus already stored here.

## Core architecture

The knowledge base is separate from `takatak-v1` and other production source-code repositories.

Future flow:

```
approved sources
      ↓
classifier / ingestion pipeline
      ↓
raw provenance layer
      ↓
normalized knowledge records
      ↓
project/domain indexes
      ↓
retrieval API
      ↓
TAKATAK / Claude / Codex / other authorized agents
```

GitHub is the human-reviewable source of truth for curated knowledge. A backend retrieval service can later index this repository into PostgreSQL/pgvector or another search layer without making Git the runtime database.

Start with `docs/00-MASTER-INDEX.md`.
