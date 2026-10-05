# Knowledge Ingestion Policy

## Goal

Capture reusable project intelligence without confusing original evidence with AI-generated interpretation.

## Knowledge record layers

### Source layer

Stores provenance:
- source system
- source identifier
- source repository/file/thread
- timestamp when available
- author/actor when appropriate
- original excerpt or approved source artifact reference
- content hash
- ingestion timestamp

### Derived layer

Stores:
- summary
- topics
- project/domain
- entities
- decisions
- implementation rules
- dependencies
- supersedes / conflicts-with relationships
- retrieval tags

Derived content must never be presented as a word-for-word source when it is not.

## Classification

Allowed product domains:
- product
- website
- design
- engineering
- integration
- infrastructure
- deployment
- marketing-system
- business-system
- prompt
- agent-instruction
- project-history

While this repository is public, private/sensitive categories are blocked from commit.

## Mixed conversations

Do not ingest an entire mixed conversation just because part of it concerns a project.

Segment source material first, then retain only the product-relevant portion for this repository.

## Conflict handling

When two historical statements conflict:
- keep both provenance records when useful,
- mark the current decision,
- record the date/reason for supersession,
- never silently rewrite history.

## Future ingestion sources

Potential approved sources:
- ChatGPT exports/history
- repository docs/issues/PRs/commits
- Google Drive project documents
- GitBook
- project emails when explicitly approved and non-sensitive
- exported Lovable project specifications
- deployment runbooks
- infrastructure documentation

## Security

Credentials and secrets are never knowledge content. Store only the name/purpose of a secret and where it is managed securely.
