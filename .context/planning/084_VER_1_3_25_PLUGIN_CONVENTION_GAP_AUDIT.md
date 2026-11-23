# V1 / 1.3.25 — Plugin convention gap audit

Created: **2026-11-19**.  
Status: **PLANNED — current từ 2026-11-23; chưa start.**  
Current: **V1 / 1.3.25 — Plugin convention gap**.  
Human **2026-11-19:** lấy current lúc đó + 1 → **1.3.25**. Human **2026-11-23:** chuyển current sang 1.3.25 và gán thêm WP6 (plan 089, AP-16). Không implement, không bump metadata, không start 1.4.0 rename, không đụng file Step Slider.

**PATCH rationale:** hardening CSS/width/chrome/enqueue/Inspector theo DP-12, A9, A5.11 — không thêm block hay product surface. Không tăng MINOR.

---

## Context

Audit `wp-content/plugins/skvn-marine-blocks` đối chiếu convention chung (đọc theo chỉ mục, không đọc hết file) + hợp đồng dự án. Current pointer AGENTS/MILESTONES: **V1 / 1.3.24 Fullscreen Step Slider — PLANNED**. Human đang sửa Step Slider nên **loại trừ** toàn bộ surface đó. Naming `skvn-*` hiện hành **không** là violation (migration 1.4.0 chưa start).

Plugin phải đứng khi chỉ cài plugin: chrome + hộp width đi cùng zip. Theme canvas `body.skvn-full-width-canvas` **không** đủ cho độc lập plugin (GLOBAL A13, DP-12, A9.1–A9.3).

## Goal

Một ledger gap có evidence `file:line` để milestone kế tiếp sửa theo gói nhỏ (3–5 file). Không code trong lượt này.

## Files allowed later (khi human start milestone này)

Plugin: `src/*` (trừ step-slider/step-slide), `modules/*` (trừ step-slider-render), `assets/css/*`, `skvn-marine-blocks.php`, `block.json` liên quan. Theme **chỉ** khi human chọn chuyển chrome từ theme sang plugin (WP2) — không sửa GeneratePress.

## Files forbidden

- `themes/generatepress/**`
- `src/step-slider/**`, `src/step-slide/**`, `modules/step-slider-render/**`, CSS/tests Step Slider
- Global replace `skvn` / identity 1.4.0
- Implement 1.3.24 Step Slider

## Method

Phân loại: **Kiểm tra độc lập theme–plugin / width / deploy** + **CSS frontend** + **attribute undefined / SelectControl** + **sửa block đã phát hành** + **setting màu** + **C3 output** + **C1 bootstrap**.

Đã đọc (mẫu chỉ mục):

```text
Đã đọc: L0 (Chỉ mục + 0.1–0.5), A1, A2, A3, A5.2, A5.4, A5.5, A5.10, A5.11, A6, A9, A9.1, A9.2, A9.3, C1, C3
Phân loại task: Kiểm tra độc lập theme–plugin, width và deploy + CSS frontend/responsive + Self-check attribute undefined + Sửa block đã phát hành + Setting màu
Tín hiệu mở rộng: A9.1/A3 (CSS block trong theme); A9.3/A2 (alignfull); A5.11 (optional attr + wp.components); C3 (PHP output)
Recipe: Phụ lục 4, Recipe 15 (tham chiếu; không chạy gate code vì đây là planning)
Gate đã chạy: không — planning only, không giao source
```

Hợp đồng dự án: `docs/standards/css-layout-safety-contract.md`, `gutenberg-block-extension-css-contract.md`, `block-ui-editor-ux-technical-review-contract.md`, `security-guidelines.md`. Pitfall **DP-12** (width/zip) và **DP-06 [CORRECTED]** (tên `wp.components` runtime, không quy nhầm `undefined`).

Sampled (không dump tree): bootstrap `skvn-marine-blocks.php`; `src/{slider,collection,product-collection,post-collection,product-category-grid,feature-showcase,card,card-grid,accordion,responsive-spacer,core-controls,design-sidebar,pdp-related,product-design}`; `modules/{slider-render,collection-render,category-grid,feature-showcase-render,core-control,typography-settings,pdp-related-settings}`; theme `style.css` chỉ làm evidence leakage.

---

## Findings

Severity: **HIGH** = sai khi chỉ cài plugin hoặc width `alignfull`/`alignwide` GP bleed. **MEDIUM** = convention MUST lệch, sửa được theo gói. **LOW** = SHOULD / hygiene. Nhãn: quan sát / suy luận / chưa biết.

| ID | Area | Violation | Cite | Evidence | Label | Sev | Fix direction | Exclude-if-step-slider |
|---|---|---|---|---|---|---|---|---|
| PCA-01 | Slider | PHP luôn gắn `alignfull`; `block.json` default `wide`; plugin CSS **không** có reset GP `(0,3,1)` | A9.1, A9.3, DP-12, css-layout-safety | `modules/slider-render/slider-render.php:403`; `src/slider/block.json:73-76`; `src/slider/style.css:3-11` (`width:100%` trên `.skvn-slider`, không selector `.entry-content …alignfull`) | quan sát | HIGH | Reset plugin giống pattern Step Slider: `.entry-content .wp-block-skvn-marine-slider…alignfull { width:100%; margin:0 }` ≥ `(0,3,1)` + comment GP. Không đòi `body.skvn-full-width-canvas`. Chốt: theo `align` đã lưu vs luôn full — **đụng A5.10** nếu đổi class frontend | Không (Hero Slider, không Step) |
| PCA-02 | Product/Post Collection | `contentWidth===full` → class `alignfull`; không reset GP trong plugin CSS | A9.3, DP-12 inventory | `src/collection/controls.tsx:141`; `modules/collection-render/cards.php:995-1011`; `src/collection/style.css:4-7` (`width:100%` hộp, không reset alignfull) | quan sát | HIGH | Cùng pattern reset trên wrapper collection khi có `.alignfull` (và `.alignwide` nếu GP wide cùng math) | Không |
| PCA-03 | Feature Showcase | `supports.align` wide/full; CSS plugin không reset GP | A9.3, DP-12 | `src/feature-showcase/block.json:129-133`; `src/feature-showcase/style.css:1-17` | quan sát | HIGH | Reset khi block mang `.alignfull` / `.alignwide` | Không |
| PCA-04 | Card / Card Grid | Chrome layout **chỉ** theme `style.css`; `src/card-grid/` không có `style.css` | A9.1, A3, DP-12 Card Grid row | Theme `style.css:1772+` `.skvn-card-grid` / `.wp-block-skvn-marine-card`; glob plugin `src/**/style.css` không có card | quan sát | HIGH | Chuyển chrome cần để đúng hình vào plugin CSS enqueue/`block.json` `style`. Theme có thể giữ enhance SKVN, không được là owner duy nhất | Không |
| PCA-05 | Accordion | Chrome tone/spacing/width **chỉ** theme | A9.1 | Theme `style.css:236-296` `.skvn-accordion*`; accordion không có `src/accordion/style.css` | quan sát | HIGH | Ship CSS accordion trong plugin zip | Không |
| PCA-06 | Category Grid | Default `align` `wide`; DP-12: GP `.alignwide` cùng −40/+80; plugin CSS không reset | A9.3, DP-12 | `src/product-category-grid/block.json:12-15`; `src/product-category-grid/style.css:1-13` (cấm negative margin, không reset GP) | quan sát | MED | Reset plugin cho `.alignwide`/`.alignfull` của block này; đo GP wide trên runtime trước khi copy selector | Không |
| PCA-07 | Collection carousel | `overflow-x: hidden` khi Swiper ready | A9.3 NEVER overflow-x che tràn; A2.4 cuộn có kiểm soát | `src/collection/style.css:246-249` | suy luận | MED | Xác nhận đây là clip track Swiper hay che bleed trang. Nếu bleed: sửa hộp + reset align. Nếu track: ghi lý do tại chỗ, không dùng overflow trên tổ tiên page | Không |
| PCA-08 | Slider | `@import` Google Fonts Inter trong CSS plugin | A1 NEVER nạp font ngoài. **Conflict:** TENSIONS_OPEN 2026-06-12 Slider Inter, conservative Slider-only Inter | `src/slider/style.css:1` | quan sát | MED | Không xóa im lặng. Self-host trong plugin **hoặc** giữ tension tới 1.6.0. Zip plugin hiện phụ thuộc mạng Google | Không |
| PCA-09 | Core Control heading numbers | Frontend in `<style>` qua `wp_head`, không `wp_enqueue_style` | A3 MUST enqueue | `modules/core-control/features/post-heading-numbers.php:23,84-95` (editor đã enqueue `:116-117`) | quan sát | MED | Đăng ký handle rỗng + `wp_add_inline_style` như button-hover.php | Không |
| PCA-10 | PDP / Product design panels | `PluginDocumentSettingPanel` import từ `@wordpress/components` | A5.11 / DP-06 [CORRECTED]: kiểm tên trên runtime `wp.components` WP 7.1; thứ tự chẩn đoán component trước attribute | `src/pdp-related/panel.tsx:1`; `src/product-design/panel.tsx:1`. Design sidebar dùng `PluginSidebar` từ `@wordpress/edit-post` (`design-sidebar/index.tsx:3`) | suy luận | MED | Runtime: `typeof wp.components.PluginDocumentSettingPanel`. Nếu undefined: import `@wordpress/editor` hoặc `@wordpress/edit-post` như sidebar | Không |
| PCA-11 | Collection / Category / Spacer | Attribute optional **không** `default` | A5.2 MUST default khi rỗng hợp lệ; A5.11 liệt kê từng attr | `contentWidth` product+post `block.json` không default; `actionGapPx` category `block.json:152-154` (actionWidthPercent **đã** default 50); spacer `tabletHeight`/`mobileHeight` `responsive-spacer/block.json:17-21` | quan sát | MED | Giữ optional có chủ đích thì ghi danh sách + ternary/Select fallback (category design.tsx đã BoundedNumberControl). `contentWidth` thêm default `"normal"` **cần A5.10** nếu ý nghĩa saved content đổi | Không |
| PCA-12 | Accordion, Slider, Card Grid, Collection | `SelectControl` `value={attributes.*}` không fallback option list | A5.11 NEVER truyền `undefined`/ngoài list | `src/accordion/edit.tsx:65-83`; `src/slider/edit.tsx:128-137`; `src/card-grid/edit.tsx:99-128`; một phần collection đã `\|\| 'normal'` (`controls.tsx:423`) | quan sát | MED | Helper: value in options else default. Không đổi schema | Không |
| PCA-13 | Design sidebar | Bootstrap chỉ khi stylesheet `skvn-marine` + theme contract | A9.1 plugin đứng một mình; GLOBAL A13 theme enhance OK | `modules/typography-settings/typography-settings.php:23-32` | quan sát | MED | Không bắt Theme Design chạy trên mọi theme. Ghi debt: block chrome/width **không** được cùng gate này. Sidebar tắt trên theme khác là chấp nhận được nếu block frontend vẫn đúng | Không |
| PCA-14 | Slider CSS | `width: 100% !important` trên slide pre-init | A3 NEVER `!important` trừ đè bên thứ ba + comment | `src/slider/style.css:21-23` (không comment đè Swiper) | quan sát | MED | Comment: đè inline Swiper; hoặc specificity đủ thì bỏ `!important` | Không |
| PCA-15 | Plugin packaging | Header thiếu `Tested up to`; không có `readme.txt` | 0.4 MUST cho phát hành; C1.1 | `skvn-marine-blocks.php:2-10` | quan sát | MED | Thêm khi chuẩn bị zip marketplace; không chặn V1 local | Không |
| PCA-16 | Plugin CSS | `left`/`right` vật lý nhiều nơi | A3 MUST logical properties | `assets/css/product-card.css:90`; `src/slider/style.css:270+`; `assets/css/design-sidebar.css:70` | quan sát | LOW | RTL pass: `inset-inline-start` trừ vị trí vật lý có lý do | Không |
| PCA-17 | Collection | Eyebrow color hex cứng `#0D9488` | A6.2/A1 SHOULD token; A13 token debt accepted | `src/collection/style.css:32` | quan sát | LOW | `var(--skvn-…, #0D9488)` fallback trong plugin | Không |
| PCA-18 | Accordion Inspector | Heading vừa `TextControl` sidebar vừa `RichText` canvas | A5.3 sidebar không phải chỗ nội dung chính (canvas đã có RichText) | `src/accordion/edit.tsx:57-61` vs `:95-101` | quan sát | LOW | Bỏ TextControl trùng | Không |
| PCA-19 | Card Grid | `RangeControl` không `allowReset` | A5.5 RangeControl luôn `allowReset` | `src/card-grid/edit.tsx:90-97` | quan sát | LOW | Thêm allowReset; default từ block.json | Không |
| PCA-20 | Core Button Hover | Màu hover lưu hex/gradient string, không tách slug/custom | A6.2 MUST slug + custom tách. **Exception:** core extension, không phải màu block wrapper; PHP sanitize `button-hover.php:71+` | `src/core-controls/button-hover/index.tsx:48-116`; editor CSS selector đúng BlockListBlock (`.has-skvn-button-hover .wp-block-button …`, `style.css:12-15`) | quan sát | LOW | Không bắt migrate hex đã lưu. Follow-up: palette slug nếu human muốn Global Styles | Không |
| PCA-21 | Bootstrap | Không `uninstall.php`; cấu trúc `modules/` không phải `inc/` C1 | C1.1 SHOULD uninstall; C1 plugin nhỏ file-load OK | glob plugin root: không uninstall.php; `skvn-marine-blocks.php:16-28` require modules | quan sát | LOW | uninstall khi có policy xóa option; **không** refactor PSR-4 trong milestone này | Không |

**Không ghi thành violation**

- Prefix/namespace `skvn-marine*` — 1.4.0 chưa start.
- `--skvn-*` token consume — GLOBAL A13 accepted debt.
- Step Slider reset đã vào plugin (`src/step-slider/style.css:7-14`) — **ngoài scope**.
- Theme canvas `body.skvn-full-width-canvas .site-content .entry-content .alignfull` (`style.css:1006-1020`) — **giữ** (A9.1 dual-layer). Không xóa; không coi là đủ cho plugin.
- PDP related Woo swap trong theme — OPEN tension 1.4.0 / DP-11; không gộp vào milestone convention gap.
- Collection `showImage !== false` + PHP `collection_bool` `array_key_exists` — khớp A5.11 boolean.
- Button hover: `BlockEdit` Inspector + `BlockListBlock` wrapperProps — khớp gutenberg-block-extension-css-contract.
- Category `BoundedNumberControl` dùng `TextControl` — đúng hướng DP-06 (không `NumberControl` không tồn tại).
- AGENTS: không Composer/PHPCS V1 — không flag thiếu phpcs.

---

## Work packages (1.3.25)

Mỗi gói ≤ ~5 file. SemVer: **1.3.25 PATCH**. Current đã là 1.3.25 (2026-11-23). Start code và bump metadata cần lệnh human riêng.

### WP1 — Alignfull/wide plugin reset (P0 width)

- Files: `src/slider/style.css`, `modules/slider-render/slider-render.php`, `src/collection/style.css`, `src/feature-showcase/style.css` (+ category `src/product-category-grid/style.css` nếu còn chỗ).
- Làm: copy pattern comment+selector Step Slider (không sửa Step). Slider: thôi hard-code `alignfull` nếu `align` saved là wide — **migrate/deprecated** nếu markup đổi (A5.10).
- Acceptance: plugin-only (theme SKVN off / không class canvas): Slider/Collection-full/Showcase-full không `margin-left:-40px` GP. Đo `getComputedStyle`.

### WP2 — Chrome Accordion + Card Grid vào plugin

- Files: `src/accordion/style.css` (mới), `src/card-grid/style.css` (mới) hoặc `assets/css/`, `src/index.ts` import, `block.json` `style` nếu tách handle, **không** xóa theme rules trong cùng PR trừ khi human chọn (tránh regress SKVN).
- Tension: duplicate theme+plugin cho tới khi human chốt owner.

### WP3 — A5.11 SelectControl + optional attrs

- Files: `src/accordion/edit.tsx`, `src/slider/edit.tsx`, `src/card-grid/edit.tsx`, `src/collection/controls.tsx` (bổ sung chỗ còn thiếu), optional `src/shared/select-value.ts`.
- Không đổi tên attribute. `contentWidth` default chỉ khi human chấp nhận A5.10.

### WP4 — Enqueue + runtime component names

- Files: `post-heading-numbers.php`; `src/pdp-related/panel.tsx`; `src/product-design/panel.tsx`.
- Human: một lệnh Console trên WP 7.1 `wp.components.PluginDocumentSettingPanel`.

### WP5 — Hygiene phát hành (có thể defer marketplace)

- `skvn-marine-blocks.php` header `Tested up to`; `readme.txt` tối thiểu; PCA-14 comment `!important`; PCA-16 RTL không bắt buộc cùng mốc.

### WP6 — Hover marker cascade + luật AP-16 (2026-11-23)

Human gán cùng 1.3.25. Spec: [089](089_VER_1_3_25_HOVER_MARKER_PRESET_CASCADE_REPAIR_PLAN.md). Chưa code.

- Việc: hướng A trong plan 089 (selector marker editor + frontend, `!important` chỉ trên `color` / `background` của rule marker). Sửa câu sai ở contract Quy tắc 2 (iframe có theme `style.css`; `(0,2,1)` không đủ). Ghi năm luật AP-16 vào contract đó khi code. Không digest cả pitfall sang `CONVENTION.md` trong lượt gán scope.
- Files: `src/core-controls/button-hover/style.css`, `modules/core-control/features/button-hover.php`, `docs/standards/gutenberg-block-extension-css-contract.md`, bullet DP-18, inventory HMGP-009/010/011.
- PCA-20 nói selector editor button-hover “đúng contract”. WP6 thay câu đó: selector hiện `(0,4,0)` hòa preset theme trong iframe. Không migrate hex hover (phần PCA-20 còn lại giữ).
- Acceptance: HMGP-009, 010, 011 source FIXED, chưa runtime PASS. Nút chưa có marker giữ preset. Step CTA không sửa file Step Slider.

---

## Tensions / conflicts

| Item | Conflict | Phía thắng tạm | Default nếu human không quyết |
|---|---|---|---|
| PCA-08 Inter | A1 NEVER font ngoài vs OPEN tension Slider Inter | Tension OPEN + 0.1 dữ liệu đã lưu | Giữ @import; không xóa font |
| PCA-01 align class | block.json `wide` vs PHP `alignfull` | 0.1 + A5.10 nội dung đã lưu | Reset CSS trước; **không** đổi class PHP cho đến khi human chốt |
| WP2 chrome | A9.1 plugin zip vs GLOBAL A2 visual theme / A13 enhance | Dual-layer: plugin chrome tối thiểu, theme enhance | Copy CSS vào plugin, **không** xóa theme trong gói đầu |
| PCA-07 overflow-x | A9.3 vs Swiper track | Đo: overflow chỉ `.skvn-collection__carousel` hay `document` | Không đụng nếu không tràn page |
| C1 `inc/` vs `modules/` | Convention folder vs kiến trúc plugin đã chốt | Project module map thắng | Không PSR-4 |
| 1.4.0 rename | Identity đích vs source hiện hành | AGENTS: không flag skvn-* | Ngoài scope |
| PDP related theme adapter | A9.1 vs OPEN tension 1.4.0 | Tension | Ngoài scope plan này |

OPEN tensions đã đọc (không filter): Polylang V1; Slider Inter; T-DEMO-1/2; PDP related plugin/theme; Woo related hooks. RESOLVED_ACTIVE liên quan task: collection query B (giữ custom query); header-settings de-dup → 1.4.1; Step Slider hex **không** áp audit này.

---

## Out of scope

- Step Slider / step-slide / step-slider-render / CSS+tests liên quan
- Implement 1.3.24, chuyển current sang 1.3.25, bump metadata, start 1.4.0 Marine Blocks rename
- GeneratePress parent
- PDP Woo loop swap (DP-11)
- Digest cả file PITFALL sang `CONVENTION.md` (WP6 chỉ năm luật AP-16, vào contract CSS extension, khi có lệnh code)
- Agent `npm run build` / lint

---

## Acceptance checklist (future implementer)

- [ ] Mỗi gói ≤ 5 file hoặc có lý do
- [ ] Khối Đã đọc L0 + hàng định tuyến khi **code**
- [ ] Plugin-only proof: Slider + một Collection `full` + Showcase `full` + Accordion/Card Grid chrome không cần theme SKVN
- [ ] Không selector `body.skvn-full-width-canvas` trong CSS plugin mới
- [ ] Không `100vw` / `-50vw` / overflow-x trên tổ tiên để che bleed
- [ ] Đổi `save`/class frontend → `deprecated` A5.10
- [ ] SelectControl có fallback; optional attrs có danh sách
- [ ] Heading-number frontend qua enqueue
- [ ] Runtime check `PluginDocumentSettingPanel`
- [ ] Không sửa GeneratePress; không sửa Step Slider
- [ ] PHP escape output paths; không `HTTP_HOST`
- [ ] Human chạy build/lint (agent không chạy)
- [ ] `context-gen check-consistency` khi đụng `.context/`

---

## Đã đọc (lượt planning này)

```text
Đã đọc: L0 (Chỉ mục + 0.1–0.5), A1, A2, A3, A5.2, A5.4, A5.5, A5.10, A5.11, A6, A9, A9.1, A9.2, A9.3, C1, C3
Phân loại task: Kiểm tra độc lập theme–plugin, width và deploy + CSS frontend/responsive + Self-check attribute undefined + Sửa block đã phát hành + Setting màu, chữ, khoảng cách
Tín hiệu mở rộng: CSS block trong theme (A9.1, A3); alignfull (A9.3, A2, A3); optional attr / wp.components (A5.11); PHP output (C3)
Recipe: Phụ lục 4 Recipe 15 (tham chiếu)
Gate đã chạy: không (planning, không giao code)
```

Cũng đọc: `.context/GLOBAL.md` (A13), `MILESTONES.md` (current 1.3.24 pointer), `TENSIONS_OPEN.md` (full), `TENSIONS_ACTIVE.md` (tags blocks/theme/editor-governance), module `PLUGIN_SKVN_MARINE_BLOCKS.md` [manual], bốn file `docs/standards/` nêu trên, DP-12 + DP-06 [CORRECTED] trong `.context/PITFALLS.md` (không đọc hết file pitfall).
