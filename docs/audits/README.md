# Audits

Security, architecture, and milestone review artifacts for SKVN Marine.

These documents are human-fill questionnaires and audit reports. They complement normative rules in `docs/standards/` and approved decisions in `docs/decisions/`. They are not onsite test checklists (`docs/testing/`).

## Purpose

- Capture blind spots before implementation or release.
- Record code-review findings with file references.
- Collect human decisions in structured tables.
- Serve as source material for a future internal wiki (docs + FAQ).

## Index

| Document | Scope | Status |
|---|---|---|
| [milestone-security-questionnaire-v1-3.6-to-1.7.md](./milestone-security-questionnaire-v1-3.6-to-1.7.md) | V1.3.6 through 1.7.0 + 1.x Element CPT; pre-2.0.0 boundary | OPEN — awaiting human answers |
| [hover-marker-gradient-panel-pattern-inventory.md](./hover-marker-gradient-panel-pattern-inventory.md) | Living register: editor vs PHP marker DOM + PanelColorGradientSettings handlers (DP-18) | OPEN — agents append HMGP-* rows |

## Conventions

- Filename: `<topic>-<scope>-<version-range>.md` or `<topic>-audit-<YYYY-MM>.md`.
- Each audit links to `docs/standards/security-guidelines.md` and `.context/MILESTONES.md` when relevant.
- Findings use IDs (`S-OK-*`, `S-RISK-*`, `X-*`, milestone IDs) for cross-reference in decisions and tensions.
- When an audit is closed, summarize outcomes in `docs/decisions/` and archive the filled audit here.