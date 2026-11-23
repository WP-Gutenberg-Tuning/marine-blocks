# Audit inventory — Hover marker (editor vs PHP) + Gradient panel handler

**Status:** OPEN (living register — agents append rows; không xóa row FIXED, đổi Status)  
**Origin:** Step Slider `skvn-cta` + `core/button` Hover Colors, 2026-11-23 (DP-18)  
**Related:** `.context/PITFALLS.md` DP-18 · `src/core-controls/button-hover/style.css` (editor DOM) · `modules/core-control/features/button-hover.php` (frontend DOM)
**2026-11-23 audit session:** HMGP-001/002/003/004/005 verified FIXED; HMGP-006/007/008 re-confirmed N/A; new finding HMGP-009 OPEN (theme preset hover vs plugin marker hover tie).  
**2026-11-23 pass 2:** 001–008 re-confirmed. HMGP-009 refined (editor tie stands; frontend PHP `(0,5,0)` beats non-`!important` theme `(0,4,0)`). New HMGP-010/011 OPEN; HMGP-012–017 N/A. No source edit.  
**2026-11-23 plan:** sửa 009/010/011 theo [089](../../.context/planning/089_VER_1_3_25_HOVER_MARKER_PRESET_CASCADE_REPAIR_PLAN.md) hướng A, gán **1.3.25 WP6**. Chưa lệnh code. Status các hàng OPEN giữ đến khi source đổi.

Mục đích: **một file duy nhất** để các agent grep/rà và **ghi kết quả** sau mỗi lượt audit. Audit khác (security, milestone) không thay file này.

---

## Pattern A — Marker / class chỉ giống frontend, không giống editor

### Định nghĩa (tương tự, không cần y chang selector)

Hai surface gắn cùng một “marker” UX (class hoặc CSS var) **ở chỗ khác nhau**:

| Surface | Vị trí marker thường gặp |
|---|---|
| **Frontend (PHP `render_block_*`, saved HTML)** | Trên element target (ví dụ `.wp-block-button`) |
| **Editor (`editor.BlockListBlock`, `wrapperProps`)** | Trên **ancestor** list-block wrapper, không trên element target |

**Mắc pattern khi:**

- CSS scoped preset (block theme, CTA, hero, slider content) dùng `.target.marker` hoặc `.target:not(.marker)` **trên cùng element** với class marketing (`skvn-cta`, …).
- Rule scoped specificity **cao hơn** rule global `.marker .target` trong `core-controls/*/style.css`.
- Kết quả: attribute + vars đã set, **editor preview sai**; frontend có thể đúng hoặc cũng sai tùy selector.

**Repair pattern (đã chứng minh Step Slider):**

```css
/* Preset — specificity thấp hơn custom */
.context .wp-block-button.preset … :hover { … }

/* Custom — cả ancestor (editor) và self (PHP) */
.context .has-marker .wp-block-button.preset … :hover,
.context .wp-block-button.preset.has-marker … :hover {
  … var(--css-var) …
}
```

**Grep seeds (plugin):**

```text
has-skvn-btn-hover
has-skvn-button-hover
BlockListBlock
wrapperProps
\.wp-block-button\.[a-z0-9-]+:not\(\.has-
\.[a-z0-9-]+\.has-skvn
```

**Grep seeds (toàn repo — marker khác hover):**

```text
editor\.BlockListBlock
wrapperProps.*className
render_block_core/
:has(
```

---

## Pattern B — `PanelColorGradientSettings` xóa attribute khi handler nhận `undefined`

### Định nghĩa

Solid và gradient lưu **hai attribute**. Panel gọi `onColorChange` / `onGradientChange` với `undefined` khi mount, chuyển tab solid ↔ gradient, hoặc đóng popover — **không phải** user clear.

**Mắc pattern khi handler:**

```ts
onColorChange: (value) =>
  setAttributes({ colorAttr: value || '', gradientAttr: '' });
```

`undefined` → ghi `''` và **luôn xóa** kênh đối lập → mất giá trị vừa chọn; UI không giữ state khi chuyển loại.

**Repair pattern:**

```ts
onColorChange: (value: string | undefined) => {
  if (value === undefined) return;
  setAttributes({
    colorAttr: value,
    ...(value ? { gradientAttr: '' } : {}),
  });
};
```

Tương tự `onGradientChange`. Chỉ clear kênh kia khi nhận giá trị truthy mới.

**Grep seeds:**

```text
PanelColorGradientSettings
onGradientChange
onColorChange
skvnHover
backgroundFillGradient
```

---

## Inventory (agents MUST append / update)

Quy tắc cột **Status:** `OPEN` (cần sửa) · `FIXED` (đã merge, ghi commit hoặc ngày) · `N/A` (false positive, 1 dòng lý do) · `DEFERRED` (ghi milestone / human).

| ID | Pattern | File:line (hoặc glob) | Triệu chứng | Status | Fixed / notes |
|---|---|---|---|---|---|
| HMGP-001 | A | `wp-content/plugins/skvn-marine-blocks/src/step-slider/style.css`, `editor.css` (skvn-cta hover) | Editor: Hover Colors không thắng preset `#4cd964` | FIXED | 2026-11-23 — ancestor + self selectors |
| HMGP-002 | B | `wp-content/plugins/skvn-marine-blocks/src/core-controls/button-hover/index.tsx` | Chuyển solid ↔ gradient xóa hover bg | FIXED | 2026-11-23 — guard `undefined` |
| HMGP-003 | B | `wp-content/plugins/skvn-marine-blocks/src/step-slide/edit.tsx` (`backgroundFill*`) | `onColorChange`/`onGradientChange` luôn x kênh đối lập khi `undefined` | FIXED | 2026-11-23 — thêm `if ( value === undefined ) return;` + chỉ clear sibling khi truthy, mirror button-hover |
| HMGP-004 | B | `wp-content/plugins/skvn-marine-blocks/src/slide/edit.tsx` (`backgroundFill*`) | Cùng lỗi step-slide: clear gradient/color khi handler nhận `undefined` | FIXED | 2026-11-23 — thêm `if ( value === undefined ) return;` + chỉ clear sibling khi truthy |
| HMGP-005 | A | `wp-content/plugins/skvn-marine-blocks/src/slider/style.css` (hero CTA) | Chỉ self-marker `.wp-block-button.has-skvn-btn-hover-*`; thiếu ancestor variant cho editor BlockListBlock wrapper | FIXED | 2026-11-23 — bổ sung `.has-skvn-btn-hover-* .wp-block-button` ancestor selector, mirror step-slider dual-selector |
| HMGP-006 | B | `wp-content/plugins/skvn-marine-blocks/src/step-slider/edit.tsx` (`PanelColorGradientSettings` progress bar) | Single `progressColor` attribute, không có cặp solid/gradient chia panel; `onProgressColorChange` có guard `! nextColor` | N/A | Không phải Pattern B (không sibling attribute để clobber) |
| HMGP-007 | A | `wp-content/plugins/skvn-marine-blocks/src/step-slider/style.css` (skvn-cta hover) | Có dual selector: ancestor `.has-skvn-btn-hover-* .wp-block-button` + self `.wp-block-button.skvn-cta.has-skvn-btn-hover-*` | N/A | Đã đúng mẫu repair dual-selector, không cần sửa |
| HMGP-008 | A | `wp-content/plugins/skvn-marine-blocks/src/step-slider/editor.css` (editor-focused stage skvn-cta hover) | Có dual selector trong `.skvn-step-slider-editor__stage--focused`: ancestor + self | N/A | Đã đúng mẫu repair dual-selector, không cần sửa |
| HMGP-009 | A | `wp-content/themes/skvn-marine/style.css` (189–214) + `src/core-controls/button-hover/style.css` (12–20) + `modules/core-control/features/button-hover.php` (50–56) | Editor: theme primary/secondary/`is-style-skvn-primary` hover `(0,4,0)` hòa marker editor `(0,4,0)`. Frontend inline `(0,5,0)` (thêm `.wp-element-button`, dep `skvn-marine-style`) thắng các hover đó | OPEN | 2026-11-23 pass 2: iframe có `add_editor_style( 'style.css' )` (`inc/setup.php`) và `build/style-index.ts.css` qua `editor_style_handles`. Comment style.css “(0,2,1), no theme rules in iframe” sai. Dual-selector không phá tie; chưa đo thứ tự enqueue trong iframe. Chưa sửa. |
| HMGP-010 | A | `wp-content/themes/skvn-marine/style.css` (2361–2409) | `.skvn-button--text` khóa `background: transparent !important` (hover color không `!important`, marker text vẫn thắng). `.skvn-button--white` khóa background + color `!important` ở base và background hover `!important` | OPEN | `!important` thắng marker editor `(0,4,0)` và frontend `(0,5,0)` trên kênh bị khóa. Dual-selector không phá `!important`. Chưa sửa — gỡ `!important` có thể làm preset thua global styles. |
| HMGP-011 | A | `wp-content/themes/skvn-marine/style.css:1436` | Base background `(0,4,0)` `.skvn-newsletter-band .wp-block-button:not(.is-style-skvn-primary) .wp-block-button__link` hòa marker editor `:hover` `(0,4,0)`. Frontend `(0,5,0)` thắng | OPEN | Editor-only, chỉ nút trong band không có `is-style-skvn-primary`. Pattern `patterns/newsletter-band.php` dùng `is-style-skvn-primary` nên nằm ngoài selector này. Chưa sửa. |
| HMGP-012 | A | `wp-content/themes/skvn-marine/style.css:1295–1310` | Product card/grid đặt background link, không có `:hover`, `(0,2,0)` | N/A | Thua marker hover editor `(0,4,0)` và frontend `(0,5,0)`. |
| HMGP-013 | A | `assets/css/product-card.css` (257+), `src/product-category-grid/style.css` (hover token), `modules/collection-render/cards.php` (~436), `src/collection/controls.tsx` (~780) | Class hover token nằm trên chính CTA ở PHP và editor preview | N/A | Không phải marker BlockListBlock (ancestor) lệch element. Không phải `core/button` Hover Colors. |
| HMGP-014 | A+B | `src/feature-showcase/edit.tsx:254`, `src/feature-showcase/style.css` (`.skvn-feature-showcase__cta:hover`) | `SelectControl` `gradientPreset` một attribute; CTA là element riêng | N/A | Không `PanelColorGradientSettings`; không split marker editor/frontend. |
| HMGP-015 | A | `src/core-controls/heading-number/index.tsx` | Class `no-number` ghi vào `className` của heading | N/A | Cùng element, không `wrapperProps` marker. |
| HMGP-016 | A | `src/core-controls/button-hover/index.tsx:145` | Chỉ một `editor.BlockListBlock` trong `src/` | N/A | Không injector marker thứ hai. |
| HMGP-017 | B | `src/slide/edit.tsx:296`, `src/step-slide/edit.tsx:353`, `src/core-controls/button-hover/index.tsx:78`, `src/step-slider/edit.tsx:571` | Đọc lại mọi `PanelColorGradientSettings` | N/A | Guard `undefined` hoặc một attribute (progress). `apply-background-modal.tsx` copy attr nguồn, không nhận `undefined` từ panel. `backgroundFillGradient` trên step-slider chỉ là model đọc fill tab. |

*Thêm dòng mới dưới bảng với ID tiếp theo `HMGP-00N`. Không recycle ID.*

---

## Agent checklist (một lượt audit)

1. Đọc Pattern A + B trên (không cần đọc lại DP-18 đầy đủ trừ khi sửa).
2. Chạy grep seeds; mở từng hit có `setAttributes` + gradient hoặc `:not(.has-` + block scoped CSS.
3. Với mỗi finding: thêm hoặc cập nhật row inventory; nếu FIXED trong cùng session ghi file + tóm tắt ngắn.
4. Không bump version, không commit trừ human lệnh.
5. Nếu sửa code: tối đa 3–5 file / lượt; cập nhật DP-18 chỉ khi có quyết định kiến trúc mới.

---

## Cross-links

- Prompt handoff (copy cho agent khác): `docs/workflows/prompts/agent-audit-hover-marker-gradient-panel.md`
- Pitfall: `.context/PITFALLS.md` → DP-18, AP-16
- Plan sửa 009/010/011 (chưa code): `.context/planning/089_VER_1_3_25_HOVER_MARKER_PRESET_CASCADE_REPAIR_PLAN.md`