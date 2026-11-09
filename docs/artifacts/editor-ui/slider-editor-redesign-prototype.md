# Slider Editor UI — Concept 01

2026-11-09. Review artifact for **1.3.21 — Hero Slider Contrast Repair + Slider Editor UI Redesign**. **Accepted layout reference for implementation planning; not a Gutenberg implementation or runtime acceptance.**

Open [interactive prototype](slider-editor-redesign-prototype.html).

## What to review

- Desktop: scrollable slide list on the left, one editable sample on the right; active slide is clearly marked. Default fixture has10 slides and starts at7 to expose the scroll state. Rail height is capped; the entire frame does not grow with item count.
- Footer: static arrow sample, Add slide, static pagination sample; caption rows use `Arrow Style: Circle`, `Position: Side center`, `Pagination Indicator: Dots`, `Position: Bottom center`. These samples do not navigate the editor. Choose slides with the list/mobile picker.
- Add slide appends/selects a sample and focuses its heading. Hero fixture starts with3 slides and respects existing max5; default fixture10 does not imply changing Hero/Showcase limits.
- At narrow widths the list becomes a native select above the canvas; footer reflows, retaining all labels. Type into heading/description/action label, switch slides and return: edits remain in memory until reload.
- Optional “Try preview styles” controls are artifact review tools, not a proposal to duplicate Inspector settings under the production canvas. Position captions show selected settings; the sample strip stays below the canvas by design, not at actual frontend positions.
- Proposed frame palette: pale indigo background#f4f5fc/border#d9dcef. **Concept01 comparison baseline** following human review; changes require a recorded delta decision. Distinct from Grid/Collection palettes; no runtime/theme token change.

## Limits and acceptance

No WordPress APIs, InnerBlocks, native selection/history, persistence, Swiper, autoplay, HTTP calls, libraries, fonts or external media. In-memory slide data and contenteditable simulate interaction for layout review only; they are **not a proposed second slide store for the plugin**. Browser undo/save/IME/real nested blocks need separate Gutenberg proof. There is no reordering/delete/duplicate UI in this first layout sample; native List View integration remains a design/implementation requirement. No confirmation button changes roadmap or marks acceptance PASS.

Plan: [044§10](../../../.context/planning/044_HERO_SLIDER_CONTRAST_AND_FLICKER_REPAIR_PLAN.md), frame scope [053](../../../.context/planning/053_EDITOR_PREVIEW_FRAMES_ROLLOUT.md). Current remains1.3.20, no source/build/deploy/commit or milestone transition implied. Human reviewed the prototype as Good and requested a binding fidelity process. Layout/visual hierarchy now follow contract062; no production implementation/start is inferred. Prototype-only fixtures/settings are not approved product controls.

## Verification ledger

- Source authored2026-11-09. No Gutenberg/runtime PASS.
- Standalone browser attempt returned FAIL for active-row visibility; reveal logic was changed to measured rectangles with an inset and synchronous initial reveal. Browser geometry/responsive screenshots still require revalidation; no PASS inferred from the source correction.
- Browser/DOM commands did not complete within the observation window and were stopped under the repository responsiveness rule. No retry after stopping; standalone interaction/geometry verification remains pending. To check manually from repo root: `node .local/check-slider-editor-artifact.cjs` (Edge headless) and `node .local/check-slider-editor-dom.cjs` (DOM only). Neither command is a plugin build/lint or proof of Gutenberg behavior.

## Canonical reference lock — 2026-11-09

Read [implementation contract062](../../../.context/planning/062_VER_1_3_21_SLIDER_EDITOR_ARTIFACT_IMPLEMENTATION_CONTRACT.md) before coding/review. Concept01 HTML SHA-256: `5B938946C253E36E9F73D35C817C2FBF1F5F9F65375DE9A7D4A04853E2C352EF`. Keep this HTML as the baseline; record source mapping and actual Gutenberg screenshots for AF01–10. Do not rewrite the reference to match a divergent implementation. New approved design changes need revision/hash trace. Git ignore exceptions cover only this HTML and these notes; files still need to be included in a future authorized commit/handoff.
