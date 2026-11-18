# Marine Blocks

Marine Block is a WordPress source repository for a B2B seafood/export website.

This repository contains the custom child theme, custom Gutenberg block plugin,
AI context files, and development documentation used to build the site.

This repository is **not** a full WordPress runtime installation.

Build with Codex, Grok Build and Claude using [context-mapping](https://github.com/WhySchools/context-mapping)

---

## What This Repo Contains

```text
wp-content/themes/skvn-marine/
wp-content/plugins/skvn-marine-blocks/
.context/
docs/
tests/
tools/
AGENTS.md
```

- `wp-content/themes/skvn-marine/` is the custom GeneratePress child theme.
- `wp-content/plugins/skvn-marine-blocks/` is the custom Gutenberg block plugin.
- `.context/` is active AI working memory for milestones, tensions, modules, and planning.
- `docs/` contains human-readable decisions, standards, workflows, tests, and review artifacts.
- `AGENTS.md` is the mandatory protocol for AI agents.

---

## What This Repo Does Not Contain

Do not commit WordPress runtime files here.

This repo must not contain:

- WordPress core
- External WordPress plugins
- Uploads
- Runtime cache
- Local credentials
- Local database dumps
- Machine-local environment files

External plugins belong in the local/test WordPress runtime, not in this source repo.

Examples of external plugins that must not be committed here:

- WooCommerce
- Contact Form 7
- CFDB7
- Rank Math
- WindPress
- Out of the Block: OpenStreetMap
- Antispam Bee
- Polylang

---

## Architecture

- Parent theme: GeneratePress
- Child theme: `skvn-marine`
- Custom blocks plugin: `skvn-marine-blocks`
- Product model: WooCommerce native products, categories, and attributes
- Quote flow: Contact Form 7 + CFDB7 + n8n
- Map engine: Out of the Block: OpenStreetMap
- Styling: child theme CSS, WindPress/Tailwind, Gutenberg patterns
- Custom block architecture: block-centric feature modules with minimal shared services

Core rule:

```text
If changing the theme would make a feature disappear, the feature belongs in the plugin.
```

---

## Current Milestone

The current milestone is tracked in:

```text
.context/MILESTONES.md
```

Do not assume the milestone from this README. Read the milestone file.

---

## Local Runtime

The WordPress runtime is separate from this source repo.

Machine-local runtime details live in:

```text
.local/ENVIRONMENT.md
```

That file is ignored by git and may contain credentials. Do not commit it.

Before running WP-CLI, activating plugins, starting a local server, or testing inside WordPress, read `.local/ENVIRONMENT.md` and confirm the runtime root.

---

## Development Workflow

For human developers:

1. Work on source code in this repo.
2. Test inside the separate local WordPress runtime.
3. Keep external plugins in the runtime only.
4. Keep custom theme and plugin code in this repo.
5. Run relevant checks before submitting changes.

For AI agents:

1. Read `AGENTS.md` before doing any work.
2. Follow the context loading protocol exactly.
3. Use TDD when the task has testable behavior.
4. Do not edit the GeneratePress parent theme.
5. Do not install external plugins into this repo.
6. Do not treat `.context/proposals/` as active protocol.

---

## Common Checks

Theme PHP syntax:

```bash
php -l wp-content/themes/skvn-marine/functions.php
```

Plugin build:

```bash
cd wp-content/plugins/skvn-marine-blocks
npm run build
```

Context consistency:

```bash
context-gen check-consistency .
```

If a task changes WordPress runtime behavior, also run a runtime smoke test in the local WordPress site.

---

## Documentation Map

```text
docs/decisions/   Approved or working project decisions (start at docs/decisions/README.md)
  |- reports/     Technical references and implementation logs (not decision scope)
  |- archives/    Superseded / implemented-and-closed decisions (not loaded by default)
docs/standards/   Coding, AI, and security standards
docs/workflows/   Development, deployment, QA, and context workflows
docs/testing/     Test plans and verification notes
docs/explain/     Simplified explanations for review
docs/artifacts/   Visual/static artifacts for review
```

The active AI context map lives in:

```text
.context/
```

Important context files:

- `.context/GLOBAL.md`
- `.context/MILESTONES.md`
- `.context/TENSIONS_OPEN.md`
- `.context/TENSIONS_ACTIVE.md`
- `.context/modules/`
- `.context/planning/`

`.context/proposals/` is for local review drafts only and is ignored by git.

---

## AI Agent PR Requirements

Every AI-generated PR must explain the work clearly enough that a non-technical reviewer can understand it.

Before opening a PR, the agent must confirm:

- It read `AGENTS.md`.
- It understood the current milestone in `.context/MILESTONES.md`.
- It checked `.context/TENSIONS_OPEN.md` and `.context/TENSIONS_ACTIVE.md`.
- It changed only files related to the requested scope.
- It did not edit GeneratePress parent theme files.
- It did not commit credentials, runtime files, uploads, WordPress core, or external plugins.
- It updated `.context/` only if the work introduced or changed a project decision.

Use this PR description format:

```markdown
## What This PR Solves

Explain the problem in plain language.

Example:
This PR fixes the page layout so homepage sections can stretch across the screen instead of being squeezed into a narrow column.

## What Changed

List the important changes.

Example:
- Added a full-width page template.
- Updated layout CSS for full-width sections.
- Kept the normal site header and footer.

## Scope Check

Explain what was intentionally not changed.

Example:
This PR only changes the child theme layout. It does not change WooCommerce, external plugins, GeneratePress parent theme, or product data.

## Context Update

Choose one:

- No context update needed because this only implements an existing decision.
- Updated `.context/...` because this changes a project decision.
- Added a tension because the request conflicts with an existing rule.

## Checks Run

List the checks that were run.

Example:
- `php -l wp-content/themes/skvn-marine/functions.php`
- `context-gen check-consistency .`

## Explain Like I Am Five

Explain the PR in very simple words.

Example:
The website had a small box for big page sections. This PR makes the box wide enough so the design can breathe, while keeping the top and bottom of the website the same.
```

Do not open a PR with vague descriptions.

Bad PR descriptions:

- "Updated files"
- "Fixed issue"
- "Improved layout"
- "Made changes"
- "Refactor"
- "WIP"

A valid PR must say:

- What problem it solves
- What areas it changed
- What it deliberately did not change
- Whether `.context/` was updated
- What checks were run
- A simple explanation a non-technical person can understand

---

## Safety Rules

- Do not edit `themes/generatepress/`.
- Do not commit credentials.
- Do not commit external plugins.
- Do not commit WordPress core.
- Do not overwrite manual image ALT text.
- Do not custom-code the quote form handler in V1.
- Do not rename project namespaces, prefixes, slugs, or text domains.
- Do not treat local proposal drafts as active project protocol.

---

## License

See `LICENSE`.
