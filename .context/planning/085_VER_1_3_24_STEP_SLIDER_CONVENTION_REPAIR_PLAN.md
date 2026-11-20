# V1 / 1.3.24 — Step Slider: lệch convention + palette bị bỏ + text animation RevSlider chưa vào source

Created: **2026-11-19**.  
Updated: **2026-11-19** — bổ sung Gói F (text animation) từ quyết định RevSlider.  
Status: **PLANNING — chưa lệnh code.** Current pointer giữ **V1 / 1.3.24 — Fullscreen Step Slider**.  
Không bump metadata, không zip/deploy, không gộp vào [084](084_VER_1_3_25_PLUGIN_CONVENTION_GAP_AUDIT.md) (1.3.25 **loại trừ** Step Slider).

Nguồn lệch: rà soát convention 2026-11-19 trên `src/step-slider/**`, `src/step-slide/**`, `modules/step-slider-render/step-slider-render.php`.  
Nguồn palette: human 2026-11-18 (SS-DS-01), pitfall **AP-15**, plan [083](083_VER_1_3_24_STEP_SLIDER_SETTINGS_PARITY_PLAN.md) §13. Không mở lại bản slug-only đã rút.  
Nguồn text animation: human 2026-11-19, reverse-engineer Slider Revolution “From Soil to Harvest”; decision [`docs/decisions/sliders/step-slider/step-slider-text-animation-1.3.24.md`](../../docs/decisions/sliders/step-slider/step-slider-text-animation-1.3.24.md). File gốc: `C:\Users\VPF-Champion\Downloads\step-slider-text-animation-decision.md`.

---

## Context

Step Slider đã có source chrome/runtime (081) và Inspector Phase A (083). Audit convention thấy lệch Editor UI, media, CSS mobile-first, i18n, DRY. Riêng màu progress: audit dễ đọc nhầm `ColorPalette` là vi phạm A6.2 (tách `iconColor` / `customIconColor`). **Đó không phải hướng sửa.** Human đã chốt một attribute `progressColor` = slug **hoặc** hex. Việc bị bỏ khi code là **UI palette WordPress**, không phải schema.

Text animation: 079 §8 khóa một cascade `translateY(0.75rem)` / 400 ms / delay 0–100–200–300, **không** control. Source làm đúng khóa đó. Human 2026-11-19 chốt **hai preset** (`slide` / `rise`) từ mẫu RevSlider — **chưa** có attribute, Inspector, hay CSS khớp số đo. Việc bị bỏ là **cả spec sản phẩm**, không chỉ convention.

## Goal

Một ledger lệch + spec sửa theo gói (≤5 file/gói). Agent sau implement đúng gói khi human nói `CODE_NOW` / `làm A` / `làm F` / `implement`. Không tự start.

## Files allowed (khi lệnh code)

- `wp-content/plugins/skvn-marine-blocks/src/step-slider/edit.tsx`
- `wp-content/plugins/skvn-marine-blocks/src/step-slider/style.css`
- `wp-content/plugins/skvn-marine-blocks/src/step-slider/editor.css`
- `wp-content/plugins/skvn-marine-blocks/src/step-slider/block.json` (Gói F: thêm `textAnimation`)
- `wp-content/plugins/skvn-marine-blocks/src/step-slider/frontend.ts` (Gói F chỉ nếu last-wins CSS không đủ)
- `wp-content/plugins/skvn-marine-blocks/src/step-slide/edit.tsx`
- `wp-content/plugins/skvn-marine-blocks/src/step-slide/save.tsx`
- `wp-content/plugins/skvn-marine-blocks/modules/step-slider-render/step-slider-render.php`

Một gói không sửa hết list. `block.json` chỉ khi gói ghi rõ; không đổi tên attribute đã phát hành. `textAnimation` là attribute **mới** (A5.10: default `slide`, không migrate).

## Files forbidden

- `themes/generatepress/**`
- `src/slider/**`, `src/slide/fill.ts`, `src/slide/focal.ts` (gọi, không sửa — tension OPEN 2026-11-18 DRY lần 3)
- `theme.json` (`color.custom` giữ `false`)
- Đổi tên / migrate `progressColor`; đổi default `#7ec8e3`
- Plan 084 / block khác của 1.3.25
- Agent `npm run build` / lint / deploy / git push

---

## 1. Yêu cầu color palette của human — đã chốt, bị bỏ một phần khi code

### 1.1 Lời human (không diễn giải lại thành slug-only)

| Khi | Nguồn | Nội dung giữ nguyên nghĩa |
|---|---|---|
| 2026-11-18 23:28 | [chat Step Slider settings](e1efc568-e698-4370-bc8f-790e41d692bf) | “slug + custom (không phụ thuộc vào theme), không cần migrate.” |
| Cùng ngày, muộn | 083 bảng Human decisions / SS-DS-01 | UI = **palette + color picker**, không ô gõ hex. Picker custom **của riêng control progress** bỏ qua `theme.json` `color.custom: false`. Giữ tên `progressColor`, default `#7ec8e3`. |
| Cùng ngày | AP-15 (`.context/PITFALLS.md`) | “không theo cách thiết kế WP — marketing không nên gõ hoặc chỉ lấy mã hex; **phải bám palette `theme.json` và pattern Inspector giống core/plugin chỗ khác**.” |
| 083 §13.1 | Spec code | “Hàng màu palette theme + color picker cho màu đặc.” Editor: `useSetting( 'color.palette' )`. Cho phép `ColorPalette` / `PanelColorSettings` **hoặc tương đương đúng version Gutenberg**. Cấm: `ColorControl` + ô gõ hex là đủ. |
| 083 §13.1 | Fill | Fill bước giữ `PanelColorGradientSettings`, **không** ghi đè `color.custom`. |

“Không phụ thuộc theme” (human) **chỉ** nghĩa: picker custom của progress không đọc `color.custom: false`. Slug vẫn xuất `var(--wp--preset--color--…)`. Không sửa `theme.json`. Không hex parent nền không ảnh (COL-02 B).

### 1.2 Precedent trong repo (AP-15 bảo bám cái này)

Slider fill và Core Button Hover:

```ts
__experimentalPanelColorGradientSettings as PanelColorGradientSettings
```

từ `@wordpress/block-editor` — `src/slide/edit.tsx:6`, `src/core-controls/button-hover/index.tsx:3`. Đó là tên **có thật** trên WP 7.1 (A5.11 / DP-06). Tên không tiền tố `PanelColorGradientSettings` **không** phải API đã kiểm trên runtime đích.

### 1.3 Code Phase A đã làm / đã bỏ

Source: `src/step-slider/edit.tsx` (progress), `src/step-slide/edit.tsx` (fill).

| Yêu cầu human / 083 / AP-15 | Source hiện tại | Bỏ / lệch |
|---|---|---|
| Bỏ `TextControl` hex | Đã bỏ | Đạt |
| Palette theme + picker; `disableCustomColors={false}` chỉ progress | `ColorPalette` từ `@wordpress/components` trong `PanelBody` “Progress bar” (tab Settings) | **Không** dùng pattern Inspector của Slider (`__experimentalPanelColorGradientSettings`). Không `group="color"`. Không `PanelColorSettings`. |
| Palette qua `useSetting( 'color.palette' )` | Năm `useSetting` (theme / default / custom / defaultPalette / merged) + walker `progressPaletteFromSettings` | Spec một hook; walker tự chế, dễ lệch origin so core |
| Pattern Inspector giống core / plugin khác | Progress = `BaseControl` + `ColorPalette` trần | A6.2: `ColorPalette` trần chỉ chấp nhận trong control lớn hơn; A5.6: màu tự chế vào `group="color"` |
| Một attribute slug **hoặc** hex; không migrate; default `#7ec8e3` | `progressColor` một string; PHP nhận cả hai | **Đạt — giữ.** Không “sửa convention” bằng `progressColor` + `customProgressColor` |
| Clear về default sản phẩm | `onChange` rỗng → `#7ec8e3` | Khớp SS-DS-01; **không** clear về `undefined` (A6.4) — tension thắng |
| Fill: `PanelColorGradientSettings`, tuân `color.custom` | `step-slide/edit.tsx` import **`PanelColorGradientSettings` không `__experimental`** | **Bỏ precedent Slider / DP-06.** Cùng component fill có thể gãy trên WP 7.1 |
| PHP slug → `var(--wp--preset--color--{slug},#7ec8e3)` | `skvn_marine_blocks_step_slider_progress_color_css()` | Đạt (source; chưa runtime PASS) |

Kết luận sửa màu: **đổi component + chỗ gắn Inspector + nguồn palette**, không đổi schema.

### 1.4 Yêu cầu text animation — đã chốt 2026-11-19, chưa vào source

SoT: [`step-slider-text-animation-1.3.24.md`](../../docs/decisions/sliders/step-slider/step-slider-text-animation-1.3.24.md). Bản gốc agent tổng hợp từ RevSlider: `C:\Users\VPF-Champion\Downloads\step-slider-text-animation-decision.md`.

#### Lời human / quyết định (giữ nguyên nghĩa)

Giữ **cả hai preset** trong cùng một block, chuyển được, không loại cái nào. Default **`slide`**. Đổi default sang `rise` chỉ đổi một giá trị mặc định.

| Preset | Attribute | Inspector (English) | Chiều / cảm giác |
|---|---|---|---|
| A | `slide` | Slide | Trượt ngang phải → trái; gần mẫu gốc |
| B | `rise` | Fade + Rise | `translateY`; an toàn B2B / chữ dài / mobile |

Bằng chứng mẫu gốc (autoplay, 2 frame giữa transition, 2026-11-19):

- Text vào từ phải: ~+130 px rồi còn ~+25 px; **không** fade/blur/scale/dọc trong 2 frame bắt được.
- Ký tự mép phải bị cắt ở biên độ gốc → plugin **giảm còn 56 px** và **thêm fade**.
- Stagger nhỏ, không cascade lớn; text cũ đã mất hết khi text mới đang vào; nền mới đã đầy viewport — **text độc lập nền**.
- Không đo được duration/easing gốc (thiếu frame click-tab và loop 4→1). Số dưới đây là **thông số thiết kế plugin**.

#### Preset A — `slide`

| Phần tử | From | To | Duration | Delay |
|---|---|---|---:|---:|
| Heading + kicker | `opacity: 0; translateX(56px)` | `opacity: 1; translateX(0)` | 600 ms | 0 ms |
| Đoạn văn (+ list) | cùng from/to | cùng | 600 ms | 90 ms |
| Nút bấm | cùng from/to | cùng | 600 ms | 180 ms |

Easing: `cubic-bezier(0.22, 1, 0.36, 1)` cho **cả** opacity và transform.

#### Preset B — `rise`

| Phần tử | From | To | Duration | Delay |
|---|---|---|---:|---:|
| Heading + kicker | `opacity: 0; translateY(24px)` | `opacity: 1; translateY(0)` | 550 ms | 0 ms |
| Đoạn văn (+ list) | cùng from/to | cùng | 550 ms | 100 ms |
| Nút bấm | cùng from/to | cùng | 550 ms | 200 ms |

Cùng easing. List không có hàng riêng trong quyết định: **cùng nhóm đoạn văn** (không thêm bậc stagger thứ tư).

#### Luật chung (cả hai)

- Chỉ animate `transform` + `opacity`. Cấm `width`/`height`/`top`/`left`/`filter`/blur/scale/xoay.
- Text ra: fade **200 ms** hoặc biến mất ngay trước khi text mới vào.
- Tab click nhanh: **last-wins** — hủy animation đang chạy, chạy lại từ đầu slide mới; không queue.
- `prefers-reduced-motion: reduce`: tắt chuyển động; text hiện ngay hoặc fade 150 ms; thanh progress tab không chạy.
- Nhãn tab **không** animate.
- Cấm tách ký tự, typewriter, blur-in, stagger > 300 ms giữa phần tử.

#### Ánh xạ block

- Cha `skvn-marine/step-slider`, attribute `textAnimation`: enum `slide` \| `rise`, default `slide`.
- Inspector Select **Text animation** — options **Slide** / **Fade + Rise**. Tài liệu gốc ghi “Hiệu ứng chữ” / “Trượt ngang” (tiếng Việt nội bộ); **UI plugin English-first**.
- Editor xếp tĩnh: không chạy animation; đổi select chỉ đổi `data-text-animation` / class trên root.
- Frontend: cùng HTML slide; CSS theo attribute. Kicker = paragraph `:first-child` **cùng delay heading** (0 ms).

#### Vì sao bị bỏ khi code

| Khi | Nguồn | Việc đã làm |
|---|---|---|
| 2026-11-16 | 018 O11, 079 §8 | Human đưa fade+wipe+**text cascade** vào 1.3.24; **khóa số** 400 ms / `translateY(0.75rem)` / delay 0–100–200–300; **không** control chọn cascade |
| 2026-11-18 | 083 Presentation | “transition/cascade **khóa số**, không thành control” |
| Coding 081/079 | `style.css` `:402–448` | Một `@keyframes skvn-step-cascade`; không `textAnimation`; `block.json` mô tả “text cascade” |
| 2026-11-19 | Decision RevSlider | Human chốt hai preset + chiều + số đo mới — **không** merge vào source hay bản 085 đầu |

Kết luận: agent coding **đúng khóa 079**, nên **bỏ qua** quyết định 19/11 (file Downloads, ngoài repo). Không phải convention A6; là **lệch product spec**. 079 §8 text-cascade **bị supersede**; fade 800 + wipe 800 **giữ**.

#### Source hiện tại vs quyết định

| Yêu cầu 19/11 | Source | Lệch |
|---|---|---|
| `textAnimation` `slide` \| `rise`, default `slide` | Không có attribute | **Bỏ** |
| Inspector Select | Không có | **Bỏ** |
| A: `translateX(56px)`, 600 ms, delay 0/90/180 | `translateY(0.75rem)`, 400 ms, delay 0/100/200/300 | Sai chiều **và** số |
| B: `translateY(24px)`, 550 ms, delay 0/100/200 | Không preset thứ hai | **Bỏ** |
| Easing `cubic-bezier(0.22, 1, 0.36, 1)` | `ease` | Lệch |
| Text ra 200 ms / biến mất ngay; độc lập nền | Opacity cascade × fade Swiper 800 ms (079 F2 giữ hai lớp) | Text ra theo fade slide, không 200 ms |
| Last-wins | CSS chỉ trên `.swiper-slide-active` — gần đúng; chưa chứng minh restart khi spam tab | **note** — CSS-first, JS reflow nếu fail |
| Reduced motion tắt text + progress | Đã có `@media (prefers-reduced-motion: reduce)` | Đạt khung; cần áp **cả hai** preset |
| Tab label không animate | Tab không dùng cascade | Đạt |
| Cấm split-char / typewriter / blur | Không có | Đạt (giữ cấm) |

---

## 2. Ledger lệch convention (Step Slider only)

Cột **Sửa?** `yes` = gói dưới. `keep` = ngoại lệ đã chốt, không đụng. `note` = ghi nợ, không chặn gói P0.

### 2.1 Palette / Editor màu — P0

| ID | Luật | Lệch | Sửa? |
|---|---|---|---|
| SS-CR-COL-01 | AP-15, 083 §13, A5.6, A6.2 (UI only) | Progress dùng `ColorPalette` trần, tab Settings, không `__experimentalPanelColorGradientSettings` | **yes — Gói A** |
| SS-CR-COL-02 | 083 §13.1 | Palette không đi một `useSetting( 'color.palette' )` | **yes — Gói A** |
| SS-CR-COL-03 | A5.11 / DP-06 | Fill import tên không `__experimental` | **yes — Gói B** |
| SS-CR-COL-04 | A6.2 MUST tách slug/custom thành hai attribute | `progressColor` một field | **keep** SS-DS-01 |
| SS-CR-COL-05 | A6.4 clear → `undefined` / theo theme | Clear → `#7ec8e3` | **keep** SS-DS-01 |

### 2.2 Inspector khác

| ID | Luật | Lệch | Sửa? |
|---|---|---|---|
| SS-CR-ED-01 | A5.5 / A5.6 `RangeControl` luôn `allowReset` | `tabHeight`, `overlayOpacity` không reset | **yes — A + B** |
| SS-CR-ED-02 | A5.11 `SelectControl` luôn fallback | `dwellPreset` `value={ dwellPreset }` | **yes — A** |
| SS-CR-ED-03 | A5.11 boolean `!== false` vs `=== true` | Editor `checked={ pauseOnHover }`; PHP thiếu key = bật | **yes — A** (editor theo PHP: `pauseOnHover !== false`) |
| SS-CR-ED-04 | A5.2 ~20 attrs; overlayPreset chết | `overlayPreset` normalize PHP, không UI | **note** — 083 SS-SET-02 đã chốt giữ attr, không UI |

### 2.3 Media / ảnh

| ID | Luật | Lệch | Sửa? |
|---|---|---|---|
| SS-CR-MED-01 | A7.3 `MediaPlaceholder` khi chưa có media | Chỉ `Button` + `MediaUpload` | **yes — B** |
| SS-CR-MED-02 | A7.3 cho sửa ALT cấp block | Chỉ copy `image.alt` lúc chọn | **yes — B** |
| SS-CR-MED-03 | A7.3 / A2.5 `wp_get_attachment_image()`, `srcset`, `width`/`height` | PHP `sprintf` `<img src>` | **yes — C** |

### 2.4 CSS / a11y / i18n

| ID | Luật | Lệch | Sửa? |
|---|---|---|---|
| SS-CR-CSS-01 | A2.1 mobile-first; NEVER `max-width` vá desktop | `@media (max-width: 640px)` đảo mũi tên | **yes — D** (cùng hình 390/desktop, đảo cascade) |
| SS-CR-CSS-02 | A2.3 vùng chạm 44px nên đạt | Arrow mobile `2.25rem` (~36px) | **note** — 081 khóa hình artifact; không phóng nút trừ human |
| SS-CR-CSS-03 | A2.4 tab tràn: cuộn + mờ mép | `overflow-x: auto` + `nowrap`, chưa mờ mép / nhãn vùng cuộn | **yes — D** (aria-label; mờ mép nếu không đổi geometry tab) |
| SS-CR-CSS-04 | A3 trần specificity; `!important` | Heading `body:not(.wp-admin)`; `!important` reduced-motion/print | **note** — heading đã có comment thắng theme; `!important` motion/print: thêm comment, không bỏ |
| SS-CR-CSS-05 | A3 logical properties | `left`/`right` mũi tên, `text-align: left` | **note** — enum sản phẩm left/center/right; không RTL pass trong gói này |
| SS-CR-I18N-01 | A1 `__()` mọi chuỗi UI | PHP fallback tab `'Step'` | **yes — C** |

### 2.5 DRY / save

| ID | Luật | Lệch | Sửa? |
|---|---|---|---|
| SS-CR-DRY-01 | D2 copy lần 3 | `STEP_DEFAULT_FILLS` ở edit + save + PHP | **yes — E** trong **step-***, không `src/shared/` |
| SS-CR-DRY-02 | D2 overlay 3 nơi | edit + save inline + `style.css` | **yes — E** CSS owns overlay; bỏ inline trùng |
| SS-CR-SAVE-01 | A5.7 editor/frontend; dynamic PHP thắng | `save.tsx` luôn fill `[0]`; editor/PHP dùng `index % 4` | **yes — E** save không sơn default fill (PHP render) |
| SS-CR-A91 | A9.1–A9.3 alignfull plugin | Reset đã trong plugin CSS + comment GP | **keep** — không đụng gói này |

Độc lập theme/width (A9) **không** vào plan sửa này.

### 2.6 Text animation (product spec 2026-11-19; không phải lệch A6)

| ID | Luật / quyết định | Lệch | Sửa? |
|---|---|---|---|
| SS-CR-ANIM-01 | Decision 1.3.24: attribute `textAnimation` | Không có | **yes — F** |
| SS-CR-ANIM-02 | Decision: Select Inspector English | Không có | **yes — F** |
| SS-CR-ANIM-03 | Decision preset A `translateX(56px)` 600/0/90/180 | Cascade Y 400/0/100/200/300 | **yes — F** |
| SS-CR-ANIM-04 | Decision preset B `rise` | Không có | **yes — F** |
| SS-CR-ANIM-05 | Decision: chỉ transform+opacity; cấm blur/scale/split | Cascade hiện tại chỉ Y+opacity — hướng đúng, số/chiều sai | **yes — F** (đổi keyframes; không thêm blur) |
| SS-CR-ANIM-06 | Decision: text ra 200 ms, độc lập nền | 079 F2 hai lớp opacity × fade 800 | **yes — F** text ra; **không** đổi fade/wipe 800 |
| SS-CR-ANIM-07 | A3 / AGENTS: `prefers-reduced-motion` | Đã có; phải cover cả hai preset | **yes — F** |
| SS-CR-ANIM-08 | 079 §8 / 083 khóa cascade, không control | Khóa cũ vs human 19/11 | **keep human 19/11** — supersede khóa text |
| SS-CR-ANIM-09 | `docs/decisions/block-animation-strategy.md` | Motion thuộc plugin block, không theme `animations.js` | **keep** — CSS/attr trong plugin |

---

## 3. Kế hoạch sửa theo gói

Thứ tự: **A → B → C**; **F không song song A** (cùng `edit.tsx`) **và không song song D** (cùng `style.css`). F sau A, hoặc F trước A nếu human lệnh `làm F` trước. D và E độc lập sau A nếu không đụng cùng hunk `style.css`.  
Trần 3–5 file/gói. Không trộn 084.

### Gói A — Progress palette đúng Inspector WP (P0) + hygiene parent

**Files:** `src/step-slider/edit.tsx` (bắt buộc). `src/step-slider/editor.css` chỉ nếu panel `group="color"` cần khoảng cách.

**Không sửa:** `block.json` `progressColor`, PHP sanitizer (đã nhận slug+hex), `theme.json`, fill của step-slide.

#### A1. Component progress

1. Xóa import `ColorPalette`, `BaseControl` (nếu không còn dùng).
2. Import giống Slider:

```ts
__experimentalPanelColorGradientSettings as PanelColorGradientSettings
```

từ `@wordpress/block-editor`. **NEVER** import tên không tiền tố. Trước commit: đối chiếu `wp.blockEditor` trên WP 7.1 (A5.11). Không dùng `ColorGradientSettingsDropdown` trừ khi runtime đích có đúng tên đó.

3. Progress **chỉ màu đặc** (083: custom ≠ gradient). Một setting: `colorValue` / `onColorChange`; **không** `onGradientChange`. Không bật gradient trên control này.

4. `disableCustomColors={ false }` **chỉ** control này (prop panel/setting đúng version đang dùng). Fill không copy prop này.

5. Gắn:

```tsx
<InspectorControls group="color">
  <PanelColorGradientSettings
    title={ __( 'Progress bar', 'skvn-marine-blocks' ) }
    settings={ [ { label, colorValue, onColorChange, /* no gradient */ } ] }
  />
</InspectorControls>
```

`group="color"` = A5.6 + AP-15 “giống core”. Help giữ câu 083: “A theme color follows the palette. A custom color stays as chosen.”

6. Xóa `PanelBody` “Progress bar” ở tab Settings.

#### A2. Palette source

- Một lần: `useSetting( 'color.palette' )` (083 §13.1).
- Bỏ `progressPaletteFromSettings` / năm hook origin, trừ khi `useSetting( 'color.palette' )` trả rỗng — lúc đó fallback mảng rỗng + default hex, không hard-code slug theme.
- Map onChange:
  - rỗng / clear → `progressColor: '#7ec8e3'` (không `undefined`)
  - màu khớp swatch palette → **slug**
  - còn lại → hex `#RGB`/`#RRGGBB` qua `toProgressHex` hiện có
- Preview wrapper: giữ `progressColorCss()` cùng quy tắc PHP (slug → `var(--wp--preset--color--{slug},#7ec8e3)`).

#### A3. Hygiene cùng file

- `dwellPreset`: `value={ ['5','8','10'].includes(dwellPreset) ? dwellPreset : '8' }`.
- `pauseOnHover`: `checked={ pauseOnHover !== false }` (khớp PHP `! isset \|\| ! empty`).
- `tabHeight` `RangeControl`: thêm `allowReset`; reset → `54`. `onChange` đã `clampTabHeight`; khi `undefined` từ reset → 54.

**Acceptance A**

- [ ] Sidebar: màu progress nằm nhóm Color (Styles), không còn ô swatch trần dưới Layout/Autoplay.
- [ ] Chọn swatch theme → attribute là slug; frontend CSS `var(--wp--preset--color--…)`.
- [ ] Custom picker hiện dù `color.custom: false`; lưu hex; default `#7ec8e3` khi clear.
- [ ] Không `progressColorSlug`; không migrate bài cũ.
- [ ] Dwell lạ/`undefined` không làm `SelectControl` trống.
- [ ] Block thiếu `pauseOnHover` trong markup: toggle **bật**.
- [ ] Reset tab height về 54.

### Gói B — Step-slide Inspector: DP-06 fill + media editor + overlay reset

**Files:** `src/step-slide/edit.tsx`. Không sửa `fill.ts`.

1. Đổi import fill panel thành `__experimentalPanelColorGradientSettings as PanelColorGradientSettings` giống `slide/edit.tsx`. Không `disableCustomColors={false}` trên fill.
2. `overlayOpacity` `RangeControl`: `allowReset`; reset → `100`.
3. Khi `! hasImage`: `MediaPlaceholder` (`allowedTypes: ['image']`) thay nút “Choose background image”. Giữ `MediaUploadCheck`. Khi đã có ảnh: nút Replace/Remove như hiện tại (A7.3: placeholder lúc trống; thay thế sau khi có media).
4. Inspector: `TextareaControl` hoặc `TextControl` **ALT**. `onChange` ghi `backgroundImageAlt`. Không gọi helper theme auto-alt. Placeholder: alt attachment. Không tự bịa caption (AGENTS V1).
5. Ảnh editor: `alt={ attributes.backgroundImageAlt }`.

**Acceptance B**

- [ ] Fill custom: panel mở trên WP 7.1 (`typeof` experimental name).
- [ ] Overlay reset = 100.
- [ ] Chưa có ảnh: UI placeholder core, không chỉ Button.
- [ ] Sửa ALT trong sidebar → lưu attribute; frontend PHP đọc cùng key (Gói C).

### Gói C — PHP ảnh + i18n

**Files:** `modules/step-slider-render/step-slider-render.php`

1. Thay `sprintf( '<img … src>' )` bằng `wp_get_attachment_image( $image_id, 'full', false, array( 'class' => 'skvn-step-slide__image', 'alt' => $image_alt ) )` khi `$image_id > 0`.
2. Fallback URL legacy chỉ khi không có ID (083/A7.3: URL suy ra). Markup fallback vẫn `esc_url` + `esc_attr( alt )`; thêm `width`/`height` nếu lấy được từ attachment; không bịa.
3. Slide có ảnh (đặc biệt bước đầu): không `loading="lazy"` trên ảnh hero bước 1 (`$step_index === 0`). Bước sau `loading="lazy"` nếu `wp_get_attachment_image` cho phép qua attr.
4. Tab fallback: `__( 'Step', 'skvn-marine-blocks' )` thay `'Step'`.
5. Không đổi sanitizer `progressColor` / `tabHeight`.

**Acceptance C**

- [ ] HTML ảnh từ ID có `srcset`/`sizes` hoặc `width`+`height`.
- [ ] ALT block thắng; không overwrite bằng title.
- [ ] Chuỗi Step đi qua text domain.

### Gói D — CSS mobile-first mũi tên; tab cuộn

**Files:** `src/step-slider/style.css`

1. **A2.1:** style gốc = layout hẹp (mũi tên cụm trên trái, size `2.25rem` như rule 640 hiện tại). `@media (min-width: 641px)` = giữa stage, `2.875rem`, `top: calc((100% - var(--skvn-step-slider-tab-height, 54px)) / 2)` cho viewport mode. Xóa `@media (max-width: 640px)` cùng việc đó.
2. Đo lại: 390 và ~1920 **cùng hình** artifact/081 (prev/next trái trên mobile; giữa stage desktop). Không đổi 640 thành 782 trừ khi human chốt.
3. `.skvn-step-slider__tabs`: `aria-label` xuất ở PHP (Gói C nếu cùng lượt, không thì attr tĩnh trong render tabs wrapper) + CSS. Mờ mép: `mask-image` / pseudo chỉ khi không đổi `min-height` tab và không `overflow-x: hidden` trên tổ tiên (A9.3).
4. Không đụng reset `.alignfull`. Không `100vw`. Không trừ header.
5. Reduced-motion / print `!important`: comment “đè animation/visibility của chính block, không đè theme inline”.

**Acceptance D**

- [ ] Không còn `max-width: 640px` cho mũi tên.
- [ ] getBoundingClientRect 390 vs desktop: vị trí mũi tên không đổi so bản trước Gói D.
- [ ] Tab dài vẫn cuộn ngang, không xuống hai hàng (081 Cấm).

### Gói E — DRY fill/overlay trong Step; save khớp PHP

**Files:** `src/step-slide/save.tsx`, `src/step-slide/edit.tsx` (hunk fill/overlay), `modules/step-slider-render/step-slider-render.php` (chỉ nếu cần export comment nguồn). **Không** `src/shared/`. **Không** sửa `src/slide/fill.ts`.

1. Một hằng fill bốn radial: giữ **PHP** `skvn_marine_blocks_get_step_default_fill_gradient()` là nguồn frontend. Editor: import một module **trong** `src/step-slide/` (ví dụ `default-fills.ts`) copy **đúng** bốn chuỗi PHP — lần 2 (edit). Xóa mảng trong `save.tsx`.
2. `save.tsx`: không set `background: STEP_DEFAULT_FILLS[0]`. Dynamic `render_callback` + `skip_inner_blocks` sơn theo index. Save chỉ wrapper + InnerBlocks + overlay class; không fill default.
3. Overlay: chỉ CSS `.skvn-step-slide__overlay`. Xóa `STEP_OVERLAY_BACKGROUND` inline ở edit và save. Editor preview nhờ `editor.css` import/trùng rule overlay từ `style.css` (đã có class).
4. Tension OPEN 2026-11-18: đây **không** phải consumer thứ 3 của `fill.ts`. Không tách shared.

**Acceptance E**

- [ ] Chỉ còn ≤2 bản bốn radial (PHP + `default-fills.ts`).
- [ ] Overlay một nơi CSS.
- [ ] Frontend bước 2–4 không ảnh vẫn đúng gradient index (không fill[0]).
- [ ] Không invalid block: `save` đổi → kiểm bài đã lưu; dynamic PHP nên không recovery. Nếu Editor báo invalid: dừng, `deprecated` A5.10, không sửa câm `save`.

### Gói F — Text animation: hai preset `slide` / `rise` (product spec 2026-11-19)

**Files:** `src/step-slider/block.json`, `src/step-slider/edit.tsx` (Select + class/data), `src/step-slider/style.css` (keyframes), `modules/step-slider-render/step-slider-render.php` (sanitize + `data-text-animation`). `frontend.ts` **chỉ** nếu last-wins CSS fail onsite.

**Không sửa:** fade Swiper 800 ms, wipe 800 ms, Ken Burns, tab label motion, `src/slide/**`, theme `animations.js`.

Spec đầy đủ: §1.4 và [`step-slider-text-animation-1.3.24.md`](../../docs/decisions/sliders/step-slider/step-slider-text-animation-1.3.24.md).

#### F1. Attribute

`block.json` trên `skvn-marine/step-slider`:

```json
"textAnimation": {
  "type": "string",
  "enum": ["slide", "rise"],
  "default": "slide"
}
```

A5.10: attribute mới + default → bài cũ không attr nhận `slide`. Không migrate. Không đổi `save` child.

PHP: `skvn_marine_blocks_normalize_step_text_animation( $value )` → `'rise'` chỉ khi đúng chuỗi `rise`, còn lại `'slide'`. Gắn `data-text-animation` trên wrapper (`get_block_wrapper_attributes`). Có thể thêm class `skvn-step-slider--text-slide` / `--text-rise` nếu selector class rõ hơn attribute; **một** nguồn đủ (ưu tiên `data-text-animation`, khớp prototype preset B).

#### F2. Inspector (English)

Trong `InspectorControls` tab Settings, `PanelBody` **Motion** (hoặc hàng trong Layout — không `group="color"`):

```tsx
<SelectControl
  label={ __( 'Text animation', 'skvn-marine-blocks' ) }
  help={ __(
    'Slide moves copy in from the right. Fade + Rise is safer for long copy and small screens.',
    'skvn-marine-blocks'
  ) }
  options={ [
    { value: 'slide', label: __( 'Slide', 'skvn-marine-blocks' ) },
    { value: 'rise', label: __( 'Fade + Rise', 'skvn-marine-blocks' ) },
  ] }
  value={ ['slide', 'rise'].includes( textAnimation ) ? textAnimation : 'slide' }
  onChange={ ( value ) =>
    setAttributes( { textAnimation: value === 'rise' ? 'rise' : 'slide' } )
  }
/>
```

A5.11: fallback enum, không `value={ textAnimation }` trần. Không nhãn tiếng Việt trên UI. Editor `useBlockProps` thêm `data-text-animation` cùng PHP; **không** chạy Swiper/animation trong editor (079).

#### F3. CSS — thay `skvn-step-cascade`

Xóa `@keyframes skvn-step-cascade` và bốn rule heading/paragraph/list/buttons 400 ms.

Hai keyframes:

```css
@keyframes skvn-step-text-slide {
	from { opacity: 0; transform: translateX(56px); }
	to   { opacity: 1; transform: translateX(0); }
}
@keyframes skvn-step-text-rise {
	from { opacity: 0; transform: translateY(24px); }
	to   { opacity: 1; transform: translateY(0); }
}
```

Chỉ trên `.skvn-step-slider.is-ready` + `.swiper-slide-active` + `.skvn-step-slide__content > …`. Easing `cubic-bezier(0.22, 1, 0.36, 1)` / `both`.

| Selector (con trực tiếp của `__content`) | `slide` | `rise` |
|---|---|---|
| `.wp-block-heading` và `.wp-block-paragraph:first-child` (kicker) | 600 ms, delay 0 | 550 ms, delay 0 |
| `.wp-block-paragraph` (không phải `:first-child`), `.wp-block-list` | 600 ms, delay 90 | 550 ms, delay 100 |
| `.wp-block-buttons` | 600 ms, delay 180 | 550 ms, delay 200 |

`:first-child` phải **cụ thể hơn** paragraph thường.

Text ra (SS-CR-ANIM-06): khi mất `.swiper-slide-active`, con `__content` về `opacity: 0` trong **200 ms** (`transition: opacity 200ms`) **hoặc** cắt ngay (`opacity: 0` không transition) — default **cắt ngay** (khớp 2 frame gốc: text cũ đã mất). Không `overflow-x: hidden` trên shell/tổ tiên (A9.3). Nếu `translateX(56px)` cắt chữ ở 390px: **giảm biên độ**, không hidden-overflow để che. Wipe media **giữ** `skvn-step-wipe` 800 ms.

Reduced-motion: giữ block hiện tại; áp `animation: none` cho **cả hai** preset; text `opacity: 1`; progress tab `transition: none`. Không bắt buộc fade 150 ms nếu hiện ngay đã đạt decision (“hiện ngay hoặc fade 150 ms”).

Print: giữ `animation: none` hiện có.

#### F4. Last-wins

CSS-first: animation gắn `.swiper-slide-active` — đổi tab đổi class, slide mới chạy từ `from`. Không queue JS. Không thư viện motion.

Nếu onsite spam tab mà animation không restart: `frontend.ts` trên `slideChange` force reflow content active (gỡ/gắn class một frame). Không `setInterval`. Không đụng autoplay stack.

#### F5. Cấm trong gói

- Split-char, typewriter, blur, scale, rotate, stagger > 300 ms
- Control duration/ms thô
- Animate tab label
- Đổi fade/wipe 800; Ken Burns
- Copy motion sang theme
- Nhãn Inspector tiếng Việt

**Acceptance F**

- [ ] Attribute `textAnimation` default `slide`; bài cũ không attr = Slide.
- [ ] Inspector: Text animation = Slide | Fade + Rise; `SelectControl` không trống khi `undefined`.
- [ ] Frontend `data-text-animation="slide"|"rise"` trên root.
- [ ] Preset A: heading/kicker `translateX(56px)` 600 ms delay 0; paragraph/list 90; buttons 180; easing đúng.
- [ ] Preset B: `translateY(24px)` 550 ms; delay 0 / 100 / 200.
- [ ] Chỉ `transform` + `opacity`.
- [ ] Text cũ không còn trên viewport khi text mới vào (cắt ngay hoặc fade ≤200 ms).
- [ ] Spam tab: last-wins, không queue.
- [ ] Reduced motion: chữ hiện, không trượt; progress tab không chạy.
- [ ] Tab label tĩnh. Editor không chạy animation.
- [ ] Fade + wipe 800 ms không đổi.
- [ ] Không invalid block đã lưu.

---

## 4. Decision Memo — chỗ gắn panel màu

Chỉ fork còn mở. Schema màu **không** hỏi lại.

### Decision Memo — Progress nằm Settings hay group="color"

1. Vấn đề: Human muốn palette giống core; A5.6 bắt màu tự chế vào `group="color"`; Phase A đang để swatch ở tab Settings cạnh Autoplay.
2. Phương án:
   - **A:** `InspectorControls group="color"` + `__experimentalPanelColorGradientSettings` (solid, custom bật). Giống Color panel core. Trade-off: marketing tìm màu ở Styles, không còn panel “Progress bar” dưới Layout.
   - **B:** Giữ tab Settings, chỉ đổi `ColorPalette` → cùng experimental panel. Trade-off: dễ thấy cạnh Height/Autoplay; vẫn lệch A5.6 / “giống core”.
   - **C:** Giữ `ColorPalette` trần, chỉ đổi `useSetting('color.palette')`. Trade-off: ít diff; **không** trả AP-15.
3. Khuyến nghị: **A** vì AP-15 + A5.6; SS-DS-01 (slug|hex, default, no migrate) không phụ thuộc vị trí panel.
4. Bằng chứng: AP-15; 083 §13.1; `slide/edit.tsx:6`; `step-slider/edit.tsx` `PanelBody` Progress + `ColorPalette`; A5.6 “Nhét control màu vào tab Settings là lỗi tổ chức”.
5. Tự kiểm chứng: mở Step Slider → Inspector tab Styles/Color vs Settings; so Cover/Button color panel; `theme.json` `color.custom: false` — picker progress vẫn hiện.
6. Đảo ngược: 2 chiều (đổi group không đổi attribute).
7. Default nếu human không quyết trước lệnh Gói A: **A**.

---

## 5. Tensions / conflicts

| Item | Conflict | Phía thắng | Default |
|---|---|---|---|
| A6.2 hai attribute vs SS-DS-01 một field | Convention MUST vs human 2026-11-18 | **SS-DS-01** (0.1 dữ liệu đã lưu + tension RESOLVED_ACTIVE) | Không tách `customProgressColor` |
| A6.4 clear undefined vs default hex | Convention vs SS-DS-01 | **SS-DS-01** | Clear → `#7ec8e3` |
| A5.6 group color vs Settings | Xem §4 | Human hoặc default A | Gói A làm A |
| A2.3 44px vs artifact 36px mobile | Convention SHOULD vs 081 khóa hình | **081** | Gói D không phóng nút |
| D2 shared fill.ts | Tension OPEN lần 3 Slider/Step | **Không** `src/shared/` | Gói E local step-slide |
| 100svh / không trừ header | Tension OPEN 15:43 | Giữ | Không copy `syncViewportHeight` |
| 1.3.25 / 084 | Convention gap plugin khác | Step **không** vào 084 | Plan này = 1.3.24 |
| 079 §8 / 083 khóa cascade vs human 2026-11-19 hai preset | Khóa số + không control vs Select + số mới | **Human 19/11** (text only) | Gói F; fade/wipe 800 giữ |
| 079 F2 hai lớp opacity vs text ra 200 ms | Fade slide × cascade vs text độc lập nền | **Human 19/11** cho text ra | Cắt ngay (default) hoặc 200 ms; không đổi `speed: 800` |
| Product English vs quyết định gốc tiếng Việt | AGENTS English-first vs “Hiệu ứng chữ” | **English UI** | Map §1.4 / Gói F2 |

OPEN đã đọc (không filter): Polylang; Slider Inter; T-DEMO-1/2; PDP related; Woo related hooks; header đo viewport; DRY Slider/Step; dual-layer width. RESOLVED_ACTIVE: hex **progress** 13:36 amended SS-DS-01.

---

## 6. Cấm khi implement

- Tách `progressColor` / `progressColorSlug` / `customProgressColor`
- Đổi default sang `skvn-teal-600` hoặc slug bất kỳ
- Migrate hex đã lưu
- Sửa `theme.json` `color.custom`
- `TextControl` hex; `ColorControl` + ô gõ
- `disableCustomColors={false}` trên fill
- `ColorGradientSettingsDropdown` khi runtime 7.1 không có tên đó (DP-06)
- Copy `syncViewportHeight`, `100vw`, overflow-x hidden trên tổ tiên
- Sửa GeneratePress; sửa `src/slide/fill.ts` / `focal.ts`
- Split-char / typewriter / blur-in / scale / rotate trên text Step
- Stagger > 300 ms; raw ms control; animate nhãn tab
- Đổi fade 800 / wipe 800 / mở Ken Burns trong Gói F
- Inspector text animation tiếng Việt

---

## 7. Acceptance tổng (sau các gói human đã lệnh)

- [ ] Gói đã lệnh: checklist gói đó đủ
- [ ] Progress: palette slug hoặc hex; UI Inspector WP; PHP `var()` hoặc hex sanitize
- [ ] Fill experimental alias; ALT sửa được; ảnh ID qua `wp_get_attachment_image`
- [ ] CSS mũi tên mobile-first, hình 390/desktop giữ
- [ ] Text animation: hai preset; default Slide; số đo §1.4; fade/wipe 800 giữ
- [ ] Không invalid content trên bài Step đã lưu
- [ ] Khối Đã đọc khi **code** (mẫu dưới)
- [ ] Human chạy build (agent không chạy)

---

## 8. Out of scope

- 084 PCA-01–21, chrome Accordion/Card Grid, Slider alignfull reset
- Plan 082 editor rail
- Overlay màu / heading control mới (THEME-01 083 đã sơn CSS)
- Tab height visual vs artifact ngoài `allowReset`
- Ken Burns; đổi fade/wipe 800; control raw ms
- Runtime PASS onsite (chờ human)

---

## Đã đọc (lượt planning này)

```text
Đã đọc: L0 (Chỉ mục + 0.1–0.5), A1, A2, A3, A5.2, A5.4, A5.5, A5.6, A5.10, A5.11, A6.2–A6.4, A7.1, A7.3, A8.3, A9.1–A9.3
Phân loại task: CSS frontend/responsive + độc lập theme–plugin (audit) → planning sửa Editor màu / media / CSS / text motion
Tín hiệu mở rộng: alignfull (A9.3, không sửa); attribute Inspector (A5.11); màu phần tử con (A6); media (A7.3); copy lần 3 (D2); DP-06 component runtime; sửa block đã phát hành (A5.10 — attr mới)
Recipe: Phụ lục 4 Recipe 3 (màu) + Recipe 15 (tham chiếu, không gate code)
Gate đã chạy: không — planning only
```

Cũng đọc: `GLOBAL.md` A13; `MILESTONES.md` current 1.3.24 + 1.3.25/084 exclude Step; `TENSIONS_OPEN.md` full; `TENSIONS_ACTIVE.md` 13:36 SS-DS-01; 083 §13; 079 §8 cascade; AP-15; `slide/edit.tsx` import experimental; `step-slider/edit.tsx` ColorPalette; `step-slider/style.css` cascade; `step-slide/edit.tsx` fill; `css-layout-safety-contract.md`; `docs/decisions/block-animation-strategy.md`; decision text animation 1.3.24.
