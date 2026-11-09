# Category Grid description / action controls — 1.3.20 onsite runbook

Date: 2026-11-09. **Planned tests; feature delta not implemented or executed.**
Spec: [plan061](../../.context/planning/061_VER_1_3_20_CATEGORY_GRID_DESCRIPTION_ACTION_CONTROLS_PLAN.md).
Baseline: [Category Grid](product-category-grid-1.3.20.md), including its linked review regressions.

## 1. Target and setup

- Candidate frontend: `https://minhhaifishery.com/home/`, the page containing the reported Category Grid. Confirm the actual test page and record its edit URL; use an approved test copy/staging for fixture edits, role tests and plugin toggles. No automatic production writes.
- Record tested commit/build, WP/Woo/plugin/theme versions, browser, role, exact frontend/editor URLs and loaded asset URLs. Human builds/deploys before testing; purge relevant caches and confirm editor/frontend load the intended CSS.
- Run deferred Category/Archive/Sidebar baseline first as applicable. A pre-existing failure stays separately recorded; do not label it a new regression without before/after evidence.
- Prepare 3 eligible categories: short description; >100-word description with recognizable final words, Unicode/entities and permitted bold/link markup; empty description. Give one a long unbroken name. Back up raw descriptions, thumbnail IDs and page content before edits.
- Place two Category Grid blocks using the same categories but different modes/styles; keep one legacy block with no new attributes in serialized content. Keep Product/Post Collections and Woo archive reference URLs for regression.
- Roles: admin and page editor that can read categories but cannot edit those terms. Record capabilities rather than assuming a role name implies them.
- Check desktop with vertical scrollbar, tablet/mobile, and a narrow Group/Columns parent. Suggested viewports1440/820/390px, but record actual card/body widths; these are test widths, not new breakpoints.

## 2. Exact cases and pass/fail

| Case / IDs | Steps | Expected / PASS criteria | Evidence to return |
|---|---|---|---|
| T01 / CGD-UI01, TECH02 | Load legacy block before resaving; compare baseline. In block A enable description, select Excerpt then Full. In B keep Excerpt. | Legacy24-word/3-line behavior preserved; Full includes recognizable final words without clamp/ellipsis; B unaffected. Empty term has no empty paragraph. | Screenshots, saved attrs, description textContent vs normalized source |
| T02 / CGD-UI02 | In Details select each alignment, then narrow parent/mobile; use long token. | Only description alignment changes; title/count/path/button unaffected. No text overflow; Justify remains chosen, not silently switched on mobile. | Computed text-align + screenshots + boxes |
| T03 / CGD-UI03 | With CTA on, choose Auto/Full/Custom; Custom1/50/100%. Repeat card padding none/md/lg, long label. | Width follows body content box, Full100%; long label wraps without clipping/overflow. Alignment disabled when effective width100%; prior choice returns after Auto/50%. | Body/button rectangles + padding/box-sizing + video |
| T04 / CGD-UI03 | Select Pill, Custom0/12/100px; change Card radius independently. |0 is square; Custom changes only button; Pill restored on switch. Card radius independent, no style leaks. | Computed border radii + screenshots |
| T05 / CGD-UI04 | Use mixed-length descriptions in one row; choose Follow content then Bottom, gap Custom0/16/128px and Default. Toggle description off, then all upper content off, then CTA off. | Flow has exact selected gap within1CSSpx measurement tolerance; Bottom at least that gap and aligned bottoms within1CSSpx for equal-padding same-row cards. Default uses inherited0.4rem. No upper content means no phantom gap; CTA off leaves no slot/gap. | Content/button rect deltas, row grouping, computed gap and paired shots |
| T06 / CGD-ED01 | Keyboard through narrow sidebar and Inspector fallback; toggle description/CTA/modes off and on; clear numeric field then type valid value, blur invalid/negative/decimal/over-limit values. | Units/labels readable, no sidebar overflow; hidden/disabled controls explained; inactive values retained; incomplete/invalid input does not overwrite valid attrs;0 radius/gap survives. | Video, input/attrs before-after, console |
| T07 / CGD-ED02 | Save/reopen; Undo/Redo design edits; duplicate block. Reset Details, then Action. | Settings persist per block; reset Details changes only Details style including alignment, not display mode/term. Action resets new geometry/style keys, keeps label/show/destination/selection. Other blocks unaffected. | Serialized attrs before-after + video |
| T08 / CGD-ED03, TECH01 | As admin edit term draft, observe preview note, Save category and wait for refetch. Repeat one save failure/conflict using baseline runbook. As restricted page editor read Full, try term edit. | Preview accurately identifies saved details before save; after success Full refreshes; newer draft/conflict preserved. Restricted editor sees full plain text but no raw field/write capability. | GET/POST responses redacted, note screenshot, saved term/state |
| T09 / CGD-TECH01 | Compare raw description/thumbnail before-after style/mode/reset-only edits. Inspect frontend DOM for category whose description contains HTML/link. Tab through cards. | No term mutation or details POST caused by styling; text escaped, no injected HTML/nested anchors; one link/tab stop per card, visible focus; CTA is span. | Raw equality + network writes + DOM/keyboard evidence |
| T10 / CGD-TECH02 | On approved test content use missing attrs, invalid enum, numeric string/fraction/negative/out-of-range attributes; test0 radius/gap. | Documented safe fallbacks match editor/frontend; no CSS injection/NaN/invalid-block;0 retained. No auto rewrite term/legacy content. | Fixture payload, output, editor notices/console |
| T11 / CGD-TECH03/04 | Switch panels/modes repeatedly; test representative widths and nested parent; inspect network. Compare other consumer references. Test without WindPress only on approved isolated fixture. | No per-card fetch/term-query increase attributable to controls, refetch storm or new JS layout engine; styles present in both surfaces; other blocks/archive unchanged; plugin defaults usable independently. | Network list/request counts vs baseline, asset URLs, screenshots |

T05 geometry uses rendered content-box bounds; hidden/missing editor notices are not text above CTA. Record text font/line-height and inherited gap because px inference from a screenshot is insufficient. Long descriptions making a whole row taller is expected, not a failure; missing final words in Full is FAIL.

For T03/T11 also return `document.documentElement.clientWidth`, `scrollWidth`, and parent/grid/card/body/button `getBoundingClientRect()`; `scrollWidth <= clientWidth` and button bounds inside body are required. Do not use overflow hiding as proof.

## 3. Commands — human runs after implementation

```bash
php -l wp-content/themes/skvn-marine/functions.php
source /home/shinkuro/.nvm/nvm.sh && nvm use 20 && cd /mnt/d/Github/skvn-marine/wp-content/plugins/skvn-marine-blocks && npm run build && find modules/ -name "*.php" -exec php -l {} \;
```

Add the actual focused test command when tests exist; do not invent a green result or test file. Packaging audit applies if runtime require/include scope changes; plan currently requires none.

## 4. Report format

For every case: ID, PASS/FAIL/blocked or not run, build/URL/role/width, exact expected vs actual, screenshot/video/DOM/network evidence and console notes. Return raw-data comparison for T09 and geometry for T03/T05/T11. Redact cookies/nonces/personal data. Agent then maps evidence to CGD-* and continues source repair if needed. Source/model-only evidence cannot close browser geometry/keyboard/onsite acceptance.

Initial status: **all cases not run; awaiting implementation and human build/onsite evidence**. Keep baseline pending tests and carry IDs intact.
