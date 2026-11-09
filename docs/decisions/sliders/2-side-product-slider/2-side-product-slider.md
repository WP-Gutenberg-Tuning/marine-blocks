# 2-side Product Slider — product decisions

Date: 2026-11-09
Status: product direction approved; block slug, milestone, implementation and runtime acceptance not approved.
Source: [research and option ledger](../../../ideations/sliders/seafood-store/2_SIDE_PRODUCT_SLIDER_RESEARCH_OPTIONS_2026_11_08.md) (local, Git ignored). This tracked file records the human decisions so they do not depend on the local ideation folder. The research file retains alternatives and references.

## Decisions

| ID | Human decision | Implementation boundary / follow-up |
|---|---|---|
| RS01 | Two states of **one product**: Introduction → Details/inside. | Not a before/after divider or two products side by side. |
| RS02 | Details panel opens from the split seam and covers the frame (A). | About 60% in the reference is not a locked ratio. |
| RS03 | Manual navigation; PREV/NEXT wraps; switching product closes Details. | Autoplay and slide swipe were not approved. |
| RS04 | Keep the split composition on mobile, as in the Slider Revolution reference; hide Details text until opened. | Mockup and test narrow width, zoom and open state. Do not copy a fixed 38/62 ratio. |
| RS05 | Main product image required before Publish/Update; background and detail images optional. | Allow saving work in progress; do not automatically turn an existing public page into Draft. Broken/deleted public images still need readable content and an access path to Details. |
| RS06 | Parent/child Gutenberg blocks; editorial content through core blocks, specs through `core/list` (A). | Validate nested structure and save/reopen before locking schema. |
| RS07 | Main product image triggers Details; no separate visible button. | The image region still needs semantic control, accessible name, Enter/Space and expanded state. Missing/broken public image fallback needs mockup. |
| RS08 | First delivery uses a panel transition. | Wave, drift, shimmer, Ken Burns and two-image transformations stay in the research backlog for follow-up review; no milestone or PASS yet. |
| RS09 | Start with 3 products; maximum 10 new products. | Native add/remove/reorder. Preserve and flag imported/legacy content above 10; never truncate silently. |
| RS10 | PHP renders complete Introduction and Details. | No-JS/failed-JS content remains readable; print shows all content. Runtime verification pending. |

## Superseded premises and unresolved design

- The earlier research option RS05 made every image optional; human changed this for the **main product image** after choosing image-only activation in RS07. The final decision permits saving work in progress but gates Publish/Update. A broad `lockPostSaving` would also block Save Draft; the selective editor mechanism requires a proof of concept on the onsite WordPress version. See the research ledger §RS07-X and the [WordPress editor data API](https://developer.wordpress.org/block-editor/reference-guides/data/data-core-editor/).
- The earlier mobile recommendation stacked content in one column; RS04 supersedes it. Responsive geometry is still unverified.
- The Seafood research plan proposed 3–8 items and a `seafood-*` block name. RS09 supersedes the count. No production slug has been approved.
- When a public main image breaks after publication, the frontend must still expose Details without silently adding the separate visible button excluded by RS07. Exact fallback interaction remains open.

This is a decision record, not a source implementation or evidence of Block UI, Editor UX or Technical PASS. Current milestone remains V1 / 1.3.20.
