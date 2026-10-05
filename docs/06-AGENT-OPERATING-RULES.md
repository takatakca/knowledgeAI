# AI Agent Operating Rules

## Roles in the TAKATAK workflow

Preferred tool division:

- GitHub: engineering source of truth
- ChatGPT / Codex: architecture, implementation planning and code-oriented execution
- Cursor: local/native execution and debugging
- Claude: independent review, large-context inspection and secondary analysis
- Lovable: exportable web UI and rapid visual/product implementation

Production ownership remains with TAKATAK-controlled GitHub repositories, databases, domains and infrastructure.

## Required agent behavior

Before building:
1. discover existing implementation,
2. reuse existing contracts/components where appropriate,
3. standardize cross-project patterns,
4. identify approval/security gates,
5. then build.

Reusable sequence:

**DISCOVER → REUSE → STANDARDIZE → APPROVE → BUILD**

Agents must not:
- fabricate integrations,
- treat mock data as live,
- disclose secrets,
- bypass authorization boundaries,
- silently duplicate existing systems,
- overwrite a current architecture with an older historical decision without noting the conflict.
