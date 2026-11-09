# Slider Editor width / alignment — 1.3.21 editor runbook

Date: 2026-11-09. **Planned tests; feature delta not implemented or executed.**
Spec: [plan063](../../.context/planning/063_VER_1_3_21_SLIDER_EDITOR_UI_EXECUTION_PLAN.md) §10 Slider Editor UI Redesign.
Baseline: Slider editor Concept01 source (`src/slider/edit.tsx`, `assets/css/slider-editor.css`).

## 1. Target and setup

- Target editor: page containing a SKVN Slider block (Hero, Product Showcase, Card Carousel or default). Record actual editor URL/build, WP/Woo/plugin/theme versions, browser, role, and loaded asset URLs.
- Human builds/deploys before testing; purge relevant caches and confirm editor loads the intended CSS.
- Prepare at least one saved slider block per preset variant (hero, product-showcase, card-carousel, default).
- Roles: admin and page editor. Record capabilities rather than assuming a role name implies them.
- Check desktop with vertical scrollbar, tablet/mobile, and narrow parent. Suggested viewports 1440/820/390px, but record actual wrapper widths; these are test widths, not new breakpoints.
- Deferred baseline: run Slider editor existing cases first as applicable. A pre-existing failure stays separately recorded; do not label it a new regression without before/after evidence.

## 2. Root cause and fix direction

**Root cause:** Slider `edit.tsx` does not pass any alignment class (`alignwide`/`alignfull`) into `useBlockProps({ className })`, and `SliderAttributes` has no `align` attribute. WordPress Gutenberg default rule therefore applies `max-width: 760px` + `margin: auto` to the block, making the editor slider narrower than Responsive Spacer (which hardcodes `alignwide`) and narrower than Product Category Grid (which uses `align` attribute + `useBlockProps`).

**Fix direction:** Apply alignment like Product Category Grid (not hardcoded like Spacer):
1. `block.json`: declare `supports.align`.
2. `edit.tsx`: add `align` to `SliderAttributes` type and map it into `blockProps.className` via `useBlockProps`.
3. `save.tsx`: no change — alignment is editor-only and must not alter saved frontend markup.

## 3. Exact cases and pass/fail

| Case / IDs | Steps | Expected / PASS criteria | Evidence to return |
|---|---|---|---|
| T01 / SED-WIDTH-01 | Open a saved Hero slider block in editor. Inspect outer wrapper `.skvn-slider--editor-focus`. | Wrapper has class `alignwide` (default wide) or class matching saved `align` attribute. Default `align` behaves as `wide` matching Category Grid default. | DOM class list, saved attribute |
| T02 / SED-WIDTH-02 | In Inspector Layout → Content width, switch Normal → Wide → Full width, then save/reopen. | Each mode applies corresponding Gutenberg alignment class (`alignwide`, `alignfull`) or no class for Normal; choice persists after reload. Normal explicitly saves empty alignment string. | Inspector screenshot, saved attrs, before/after DOM |
| T03 / SED-WIDTH-03 | In narrow Group/Columns parent with slider set Wide/Full. | Slider stays within parent width; no horizontal overflow; wrapper `getBoundingClientRect()` inside parent. | Parent/wrapper rects, `scrollWidth <= clientWidth` |
| T04 / SED-WIDTH-04 | Desktop/tablet/mobile with vertical scrollbar; test all presets. | No overflow; frontend and editor width behavior consistent per preset; no `100vw`/`50vw` negative-margin tricks added. | Paired screenshots, `document.documentElement.scrollWidth <= clientWidth` |
| T05 / SED-WIDTH-05 | Legacy saved slider without alignment attribute reopens. | Defaults to wide (`alignwide`) matching current Category Grid behavior; no invalid-block recovery. | Saved markup diff, editor notice absence |
| T06 / SED-TECH-01 | `save.tsx` untouched; frontend rendered slider HTML unchanged after edit changes. | No saved-class changes, no data-attribute changes, no block validation failed on existing content. | Frontend HTML diff, save.tsx unchanged |

## 4. Commands — human runs after implementation

```bash
php -l wp-content/plugins/skvn-marine-blocks/skvn-marine-blocks.php
node -e "JSON.parse(require('fs').readFileSync('wp-content/plugins/skvn-marine-blocks/src/slider/block.json','utf8')); console.log('JSON OK')"
```

Node within WSL:
```bash
source /home/shinkuro/.nvm/nvm.sh && nvm use 20 && cd /mnt/d/Github/skvn-marine/wp-content/plugins/skvn-marine-blocks && npm run build
```

Status: **source planned, no runtime PASS yet.** Build/geometry evidence pending.
