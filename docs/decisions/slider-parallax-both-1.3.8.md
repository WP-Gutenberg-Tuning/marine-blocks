# Decision — Slider Parallax (Both Depth) 1.3.8

> **Revision 1.3 (2026-11-13)** — Inspector hiện hành và lý do bỏ/đổi control: mục [Điều khiển Motion](#điều-khiển-motion--vì-sao-đổi-2026-11-13). Sơ đồ Rev 1.1 (Edge guard, trần Scale 1.50, preset 1.06/1.12/1.20) là lịch sử.

> **Revision 1.2 (2026-11-13)** — Plan 070. Resting `--skvn-parallax-inset` stays **0**. A negative inset zoomed the still image (~1.7× at medium) and made the editor focal crop miss the frontend. Edge cover during travel is Swiper scale: `S >= 1 + 2 * (translate / 100)`. Presets: subtle 15% / 1.30, medium 30% / 1.60, strong 50% / 2.00. Advanced Edge guard is removed from the Inspector; saved `parallaxInset` is ignored at runtime. Câu “Translate and Both raise scale” trong revision này bị plan 072 sửa cùng ngày: chỉ **Both** và preset Intensity còn nâng scale. Translate only không gắn scale. Scale-only không nâng. Sections below that prescribe a negative inset or scale ceiling 1.50 are historical.

## Điều khiển Motion — vì sao đổi (2026-11-13)

Panel Motion không bỏ Depth, Direction, Translate, Scale, Intensity hay Advanced. Những mục đó vẫn có. Thay đổi là bỏ một control, đổi số của preset, và thêm một control.

### Đang có trên Inspector

Advanced tắt, parallax bật:

- Enable parallax
- Intensity: Subtle / Medium / Strong
- Advanced
- Edge blur (0–48 px, mặc định 0)

Advanced bật:

- Depth: Both / Translate only / Scale only
- Direction và Translate khi depth không phải Scale only
- Scale khi depth không phải Translate only (1.00–2.00)
- Edge blur khi depth không phải Scale only

### Edge guard (inset) — bỏ khỏi Inspector

Control này là thanh 0–80%, nhãn Edge guard, attr `parallaxInset`. Rev 1.1 dùng nó để phóng khung `.skvn-slide__bg` (`inset` âm) cho ảnh không hở mép khi trượt.

Plan 070 bỏ control vì inset âm phóng ảnh **lúc đứng yên**. Medium `-35%` làm khung nền khoảng 170%. `object-fit: cover` crop khung đó, nên ảnh đang xem đã zoom trước khi chuyển slide, và focal chỉnh trong editor (khung 100%) không khớp frontend. Đó là DP-08.

Attr `parallaxInset` vẫn nằm trong block đã lưu, default 35. Runtime không đọc. Giữ attr để slider cũ không thành block invalid. Trả control này lên Inspector mà không trả inset thì thanh đó không làm gì. Trả cả inset thì ảnh đứng yên zoom lại.

Mép lúc chuyển, với Both và với preset, được che bằng scale của Swiper (`S >= 1 + 2 × translate / 100`), không bằng inset. Scale chạy theo progress: lúc đứng yên là 1, chỉ phóng trong lúc chuyển.

### Trần Scale 1.50 thành 2.00 — control vẫn còn

Strong dịch 50%. Sàn che mép là `1 + 2 × 0.50 = 2.00`. Trần 1.50 cắt mất phần che mép của preset đó. Thanh Scale trong Advanced nâng max lên 2.00. Không bỏ thanh Scale.

### Translate only không còn bị gắn scale

Plan 070 lúc đầu gắn sàn scale cho cả Translate only, nếu không thì hở fill. Human bật Translate only và ảnh vẫn zoom lúc chuyển, vì scale 30% ra 1.60 trong khi thanh Scale bị ẩn nên không tắt được.

Plan 072 bỏ attr `data-swiper-parallax-scale` khi depth là `translate`. Thanh Scale vẫn ẩn ở mode đó, đúng như Rev 1.1 (chỉ hiện khi depth có scale). Việc đổi là runtime, không phải xoá control: Translate only giờ chỉ trượt. Mé có thể lộ màu fill. Both và preset Intensity vẫn nâng scale để che mép.

### Preset Intensity đổi số, không đổi nút

Nút Subtle / Medium / Strong giữ nguyên. Số runtime đổi vì bỏ inset:

| Preset | Trước 070 | Sau 070 |
|---|---|---|
| Subtle | dịch 15%, scale 1.06, inset −20% | dịch 15%, scale 1.30, inset 0 |
| Medium | dịch 30%, scale 1.12, inset −35% | dịch 30%, scale 1.60, inset 0 |
| Strong | dịch 50%, scale 1.20, inset −50% | dịch 50%, scale 2.00, inset 0 |

Help “ảnh đứng yên không zoom” nói frame chưa kéo. Trong lúc chuyển, preset vẫn zoom vì depth preset là Both.

### Edge blur — thêm, không thay một control cũ

Plan 073. Translate only không zoom nên hở fill. Lớp mờ là bản cùng ảnh, đứng yên, `filter: blur`, nằm sau ảnh nét. Ảnh nét không đổi kích thước lúc đứng yên.

Attr `parallaxBlur`, 0–48 px, mặc định **0**. 0 không tạo lớp mờ, slider cũ không đổi. Ẩn khi Scale only vì ảnh không trượt, không có mép để che. Editor không chạy Swiper nên không xem trước được lớp này.

### Không đụng

Transition duration (600–1000 ms) vẫn là control riêng, dùng chung cho chuyển slide và thời lượng parallax. Direction, loop, autoplay, mũi tên, pagination không thuộc đợt này.

**Version:** 1.1  

Status: IMPLEMENTED
Milestone: V1 / 1.3.8
Lifecycle: active
Notes: contract (Rev 1.1) hiệu lực; `new Swiper()` loopFix invariant thuộc `swiper-architecture.md`. Milestone 1.3.8 DONE nhưng 2 bug parallax còn OPEN trong `.context/TENSIONS_OPEN.md` (T-DEMO-1).
**Scope:** V1 / 1.3.8 — Slider Parallax  
**Date:** 2026-06-22 (rev. 2026-07-01)  

> **Revision 1.1 (2026-07-01)** — Reverses the "governed / hidden" stance below.
> Per Dev direction, the underlying depth parameters are now **exposed** behind an
> **Advanced** toggle. The intensity preset (Subtle/Medium/Strong) remains the default
> quick-pick; Advanced reveals raw controls that override it. See **Inspector UX** for
> the current contract. The "Governed Internally — Hidden from UI" section is retained
> for historical context but is **superseded**.

---

## Summary

Implement Slider Parallax using Swiper built-in Parallax Module with **both translate + scale depth**, applied to background image layer only. Governed presets (subtle/medium/strong) per intensity, no auto-disable on zoom-out transition. Default `enableParallax: false`.

---

## Decision

### Engine: Swiper 11 Parallax Module

```ts
// src/slider/view.ts
import { Parallax } from 'swiper/modules';

modules: [..., Parallax],
parallax: enableParallax && !reducedMotion && slidesPerView === 1,
```

- Runtime inject `data-swiper-parallax` + `data-swiper-parallax-scale` attrs on `.skvn-slide__bg`
- Swiper owns single `transform` per element — no competing transforms
- No custom animation engine; `prefers-reduced-motion` disables parallax entirely

### Depth Mechanism: Both (Translate + Scale)

Visual testing confirms both provide meaningful depth:
- **Translate** alone: background "slides" horizontally behind content  
- **Scale** alone: background "zooms" during transition  
- **Both compound**: layered depth effect (1.08 scale × 1.12 parallax = ~1.21 effective scale)

Apply both to `.skvn-slide__bg` simultaneously.

### Intensity Presets (Governed, Not Raw)

| Preset | Translate | Scale | Inset override |
|--------|-----------|-------|-----------------|
| subtle | `-15%` | `1.06` | `-20%` |
| medium | `-30%` | `1.12` | `-35%` |
| strong | `-50%` | `1.20` | `-50%` |

**Inset coupling rule**: `.skvn-slide__bg { inset: var(--skvn-parallax-inset, 0%) }` scales with intensity to prevent edge-reveal (image mismatch at viewport edge during translate). Default `0%` preserves existing layout when parallax is off.

Inspector default: `enableParallax: false`, `parallaxIntensity: medium`.

### No Auto-Disable on Zoom-out Transition

Initial proposal suggested auto-disable parallax when `transition: zoom-out`. **Reject** — code analysis shows clean separation:

- `.skvn-slide__media` (CSS-owned): `scale(1.08)` on non-active slide (zoom-out effect)
- `.skvn-slide__bg` (Swiper-owned): `transform: translate + scale` (parallax)
- `.skvn-slide__content` (CSS-owned): fade + translateY

Each element has one transform owner. Compounding scale is intentional depth layering, not conflict. All three transitions (wipe/fade/zoom-out) remain compatible with parallax.

### Background Layer Only (`__bg`)

Parallax attributes **only** on `.skvn-slide__bg`, not on `__content`.

Rationale:
- Content already has zoom-out transition (fade + translateY on `.skvn-slide__content`)
- Adding parallax translate to content would force Swiper inline transform to override CSS, breaking zoom-out animation
- Image layer parallax provides sufficient depth; content parallax adds risk without proportional UX gain

---

## Markup Contract

### Current PHP render (frontend)

```php
<div class="skvn-slide swiper-slide">
  <div class="skvn-slide__media">
    <img class="skvn-slide__background-image" … />
    <span class="skvn-slide__overlay" … />
  </div>
  <div class="skvn-slide__content">…InnerBlocks…</div>
</div>
```

### Required change: Add `.skvn-slide__bg` wrapper

```php
<div class="skvn-slide swiper-slide">
  <div class="skvn-slide__media">
    <div class="skvn-slide__bg">  <!-- ← NEW wrapper -->
      <img class="skvn-slide__background-image" … />
    </div>
    <span class="skvn-slide__overlay" … />
  </div>
  <div class="skvn-slide__content">…InnerBlocks…</div>
</div>
```

**File ownership:**
- `wp-content/plugins/skvn-marine-blocks/modules/slider-render/slider-render.php` — PHP render (frontend)
- `src/slide/edit.tsx` — sync editor markup
- `src/slide/save.tsx` — sync saved markup (editor validation)

**Editor deprecation:** Because this changes saved markup, `deprecated.tsx` would normally be required. **For 1.3.8 onsite dev site**: skip deprecation, accept that old content may show "invalid block / attempt recovery" on open. **Commercialization note**: when plugin ships to multiple customers with existing content, implement Gutenberg deprecation (ref: Feature Showcase pattern) to auto-migrate old markup on resave.

### CSS changes

```css
.skvn-slide__media {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;  /* Contain parallax scale overspill */
  pointer-events: none;
}

.skvn-slide__bg {
  position: absolute;
  inset: var(--skvn-parallax-inset, 0%);  /* 0% = no-parallax default; view.ts injects negative value when enabled */
  will-change: transform;
}

.skvn-slide__bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}
```

CSS variable injected by `view.ts` on **slider root element** (`.skvn-slider`), not per-slide — intensity is uniform across all slides in one slider:
```ts
const insetMap = { subtle: '-20%', medium: '-35%', strong: '-50%' };
slider.style.setProperty('--skvn-parallax-inset', insetMap[parallaxIntensity]);
```

---

## Inspector UX

### Attributes (Slider `block.json`)

```json
{
  "enableParallax": { "type": "boolean", "default": false },
  "parallaxIntensity": { "type": "string", "enum": ["subtle", "medium", "strong"], "default": "medium" }
}
```

### Editor Panel

- **Toggle**: "Enable Parallax" (boolean)
  - help: *"Background image moves at a different speed than the slide, creating a sense of depth. Has no effect in the editor."*
- **When enabled**, show **Intensity** (3 preset buttons: Subtle / Medium / Strong)
  - help: *"Controls how far the background travels and how much it scales during the transition. Higher intensity = stronger depth effect."*
  - **ButtonGroup not dropdown**: intensity is a tactile feel comparison, not a numeric value — user needs to pick by eye, not from a list.
- **When disabled**, hide intensity control
- **Advanced toggle** (rev 1.1): when on, hides the Intensity preset and reveals raw controls that override it:
  - **Depth mechanism** (Both / Translate only / Scale only)
  - **Direction** (Horizontal / Vertical) — shown when depth includes translate; maps to `data-swiper-parallax-x` / `-y`
  - **Translate** (0–80%), **Edge guard / inset** (0–80%) — shown when depth includes translate
  - **Scale** (1.00–1.50) — shown when depth includes scale
  - Preset (non-advanced) still injects the governed table values below; advanced injects the raw attribute values
- **Badge** when `enableParallax: true`: `"Parallax ON · {intensity}"` (or `"Parallax ON · custom"` in advanced mode)
  - Reason: editor does not run Swiper parallax runtime; badge confirms the setting is active without misleading user into thinking the effect should be visible in editor.
- No parallax runtime in editor — stacked slide preview remains static

### Governed Internally — Hidden from UI  *(SUPERSEDED by rev 1.1 — now exposed via Advanced toggle)*

**Depth mechanism: Both (translate + scale)** is always applied when parallax is enabled. It is **not exposed** as a user control.

Rationale:
- Translate-only lacks z-depth (background "slides" but doesn't recede)
- Scale-only is only visible mid-transition (active slide = `scale(1)`, effect collapses)
- Both compound = strongest perceivable depth layer on `__bg`
- Differentiation between slider personalities comes from **Transition** (wipe / fade / zoom-out), not from depth mechanism — exposing translate vs scale vs both adds complexity without proportional UX value
- Decision confirmed by POC lab (`slider-parallax-zoom-poc.html`) visual testing

Values injected at runtime in `view.ts` per intensity preset (user never sees these):

| Preset | `data-swiper-parallax` | `data-swiper-parallax-scale` |
|--------|------------------------|-------------------------------|
| subtle | `-15%` | `1.06` |
| medium | `-30%` | `1.12` |
| strong | `-50%` | `1.20` |

### Rev 1.1 — Advanced Controls Contract (2026-07-01)

**New attributes in `block.json`:**

```json
{
  "parallaxAdvanced":   { "type": "boolean", "default": false },
  "parallaxDepth":      { "type": "string",  "enum": ["both", "translate", "scale"], "default": "both" },
  "parallaxDirection":  { "type": "string",  "enum": ["horizontal", "vertical"],     "default": "horizontal" },
  "parallaxTranslate":  { "type": "number",  "default": 30 },
  "parallaxScale":      { "type": "number",  "default": 1.12 },
  "parallaxInset":      { "type": "number",  "default": 35 }
}
```

**UI flow (Inspector > Motion panel):**

```
Enable Parallax  [toggle]
│
├─ Advanced OFF (default):
│    Intensity: (Subtle)(Medium)(Strong)     ← preset quick-pick
│    Advanced  [toggle off]
│
└─ Advanced ON:
     Advanced  [toggle on]
     Depth mechanism: [Both ▾]              ← Both / Translate only / Scale only
     │
     ├─ depth !== "scale":
     │    Direction:   [Horizontal ▾]        ← Horizontal / Vertical
     │    Translate:   ───●──  30%           ← 0–80% slider
     │    Edge guard:  ───●──  35%           ← 0–80% slider (prevent edge-reveal)
     │
     └─ depth !== "translate":
          Scale:       ──●───  1.12          ← 1.00–1.50 slider, step 0.01

Badge: "Parallax ON · custom"  (vs "Parallax ON · medium" in preset mode)
```

**Runtime resolution in `view.ts`:**

| Mode | translate value | scale value | inset value | axis |
|------|----------------|-------------|-------------|------|
| Preset — Subtle | `-15%` | `1.06` | `-20%` | horizontal |
| Preset — Medium | `-30%` | `1.12` | `-35%` | horizontal |
| Preset — Strong | `-50%` | `1.20` | `-50%` | horizontal |
| Advanced | `-{parallaxTranslate}%` | `parallaxScale` | `-{parallaxInset}%` | per `parallaxDirection` |

**Key rules:**
- `inset` only applies when depth includes translate (scale-only → inset = 0, edge guard hidden in UI)
- `direction` maps to `data-swiper-parallax-x` (horizontal) or `data-swiper-parallax-y` (vertical)
- Each init removes all existing parallax data attributes before re-setting (prevents stale attributes on toggle change)
- Advanced overrides preset entirely — the two modes are mutually exclusive at runtime

### Auto-disable (no UI)

Parallax disabled when:
- `prefers-reduced-motion: reduce`
- `slidesPerView > 1` (card carousel)

These are automatic guards in `view.ts`, not user-facing controls.

---

## Acceptance Checklist

- [ ] Swiper Parallax Module imported in `view.ts`
- [ ] `.skvn-slide__bg` wrapper added to PHP render, editor markup, saved markup
- [ ] Intensity attributes registered in `block.json`
- [ ] Inspector toggle + 3 intensity buttons render correctly
- [ ] `data-swiper-parallax` + `data-swiper-parallax-scale` injected at runtime per intensity
- [ ] Inset CSS var coupled to intensity (subtle -20%, medium -35%, strong -50%)
- [ ] `prefers-reduced-motion` disables parallax (no inline transform applied)
- [ ] `slidesPerView > 1` disables parallax
- [ ] Editor preview shows badge, no parallax motion
- [ ] Desktop hero slides with parallax work: wipe transition, fade transition, zoom-out transition
- [ ] No edge-reveal (image mismatch) at viewport edges during translate
- [ ] Compounded scale on zoom-out + parallax scale looks intentional, not artifact-y
- [ ] Loop + autoplay + keyboard pairing no regression
- [ ] Old slider content (before parallax added): frontend renders OK, no fatal; editor may show "attempt recovery" warning — acceptable per D6
- [ ] Plugin build pass, PHP syntax check pass
- [ ] Human approves milestone completion

---

## Deferred / Out of Scope 1.3.8

- Per-block `__content` parallax translate (too risky with zoom-out transition)
- ~~Scale-only mode~~ — **now exposed** via Advanced depth control (rev 1.1)
- ~~User-facing "depth mechanism" dropdown~~ — **now exposed** via Advanced toggle (rev 1.1)
- Parallax on step slider frames (1.3.10 inherits foundation; fine-tuning deferred to 1.3.10)
- Content-layer intensity coupling (background layer is the primary depth mechanism)
- Mobile `< 768px` disable guard — parallax runs on mobile when `slidesPerView === 1` and reduced-motion is off. This supersedes 026 §mobile which suggested a breakpoint guard.

---

## Supersedes 026

`026_VER_1_3_6_BLOCK_EDITOR_UX_AND_SLIDER_PARALLAX_PLANNING.md` is the foundation plan. The following 026 items are overridden by 1.3.8 decisions:

| 026 item | 1.3.8 decision |
|----------|----------------|
| Content layer parallax (`__content -10%`) | **Rejected** — `__content` parallax conflicts with zoom-out CSS transition owner (D5) |
| Mobile `< 768px` auto-disable | **Rejected** — no breakpoint guard; only `prefers-reduced-motion` + `slidesPerView > 1` (D4) |
| `--parallax-inset` CSS variable name | **Changed** to `--skvn-parallax-inset` for namespace consistency (D2) |
| Per-slide inset injection | **Changed** to slider root injection — uniform intensity per slider (D3) |

---

## Future: Commercialization Note

If plugin is packaged for sale with multiple customers having pre-1.3.8 content:

1. Implement `src/slide/deprecated.tsx` with old `save()` function
2. Register as `deprecated: [{ attributes, save: oldSave }]` in slide block
3. Gutenberg auto-migrates old markup to new on user resave
4. No "invalid block" warning appears during open/edit

See: `wp-content/plugins/skvn-marine-blocks/src/feature-showcase/deprecated.tsx` pattern for reference.

---

## Related

- `.context/planning/026_VER_1_3_6_BLOCK_EDITOR_UX_AND_SLIDER_PARALLAX_PLANNING.md` — foundation plan
- `docs/artifacts/slider-parallax-swiper-poc.html` — visual pass (translate POC)
- `docs/artifacts/slider-parallax-zoom-poc.html` — lab (both translate + scale, various transitions)
