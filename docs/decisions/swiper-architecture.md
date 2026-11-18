# Decision — Swiper Architecture

**Version:** 1.0  

Status: ACTIVE
Milestone: none
Lifecycle: active
Notes: source of truth cho Swiper runtime usage map (2 consumer), shared layer, và loopFix invariant.
**Date:** 2026-07-02  

---

## Usage Map

Toàn plugin có **2 runtime consumer** của `new Swiper()`:

| File | Block | Modules đăng ký | Đặc điểm |
|---|---|---|---|
| `src/slider/view.ts` | Hero Slider | A11y, Autoplay, EffectFade, Keyboard, Navigation, Pagination, Parallax | `slidesPerView=1`, parallax injection, fade/zoom/wipe effects, timed-fraction/timed-segments pagination, viewport-height sync, MutationObserver cho editor re-render |
| `src/collection-view.ts` | Product/Post Carousel | A11y, Autoplay, Navigation, Pagination | `slidesPerView` 1–4, breakpoints (640/1024), `spaceBetween`, pause button UI, DOMContentLoaded init |

`src/feature-showcase/view.ts` dùng `shared/autoplay` + `shared/motion` nhưng **không** dùng Swiper — nó là tab/step component CSS riêng.

---

## Shared Layer (đúng kiến trúc, đang hoạt động)

Phần **thực sự dùng chung** giữa 3 block đã được extract vào `src/shared/`:

| File | Export | Consumers |
|---|---|---|
| `shared/autoplay.ts` | `createAutoplayPauseCoordinator` | slider, collection-view, feature-showcase |
| `shared/motion.ts` | `prefersReducedMotion` | slider, collection-view, feature-showcase |
| `shared/governed-time.ts` | `normalizeGovernedTime` | slider |

**Rule áp dụng:** extract vào `shared/` khi có ≥2 call-site thật trong code, không extract sớm cho consumer giả định.

---

## Parallax Timing Contract (Rev 1.3 — 2026-07-20)

Liên quan: `src/slider/view.ts`, `modules/slider-render/slider-render.php`, `docs/decisions/slider-parallax-both-1.3.8.md`, `docs/demo-prep/04-parallax-debug-protocol.md`.

**Swiper version:** `^11.1.15` (package.json). Từ Swiper 9+, **loop mode không tạo DOM clones** — dùng slide rearrangement / `loopFix`. Premise “inject sau init để clone nhận attrs” (Rev 1.2) **sai cho major này** và đã bị thay.

### Bug còn lại sau Rev 1.2 hotfixes (`ba03f08`, `406d42d`)

- **B1 — “scale/phình khi load”:** `--skvn-parallax-inset` set bằng JS **sau first paint** → box `inset` nhảy `0%` → `-N%` → `object-fit: cover` trông như zoom. Không phải (hoặc không chỉ) Swiper `scale` attr.
- **B2 — stutter slide 2/3:** transition parallax lệch pha `speed` / `loopFix` (thiếu `data-swiper-parallax-duration`), cộng inset lớn + will-change toàn cục.

### Fix Rev 1.3 (ranked F1–F3)

```
PHP first paint:
  class skvn-slider--parallax + style="--skvn-parallax-inset:-N%"
  (N từ preset/advanced; 0 khi depth=scale-only hoặc parallax off)

JS (view.ts), trước new Swiper():
  data-swiper-parallax-{x|y}, data-swiper-parallax-scale
  data-swiper-parallax-duration = transitionDuration (ms)
  clear generic data-swiper-parallax
  legacy fallback: set inset var only if PHP did not paint it
  reduced-motion: remove inset var + class; parallax: false

CSS:
  @media (prefers-reduced-motion: reduce) { --skvn-parallax-inset: 0% !important }
  will-change: transform only under .skvn-slider--parallax
```

### Invariant

> **`--skvn-parallax-inset` is server-owned (PHP inline style) for first paint.**  
> **Superseded for the inset value by plan 070 (2026-11-13):** PHP and JS leave the inset at 0. Do not paint a negative inset to cover travel. Cover travel with `data-swiper-parallax-scale` (`S >= 1 + 2 * translate / 100`). The still image must match the editor crop.  
> **`data-swiper-parallax-*` are injected in JS before `new Swiper()` on Swiper 11.**  
> **Do not reintroduce post-init inject + `swiper.update()` solely for “loop clones” — that premise is invalid on this major.**  
> **Set `data-swiper-parallax-duration` to match `speed` / `transitionDuration`.**

---

## Rejected: `src/shared/swiper-adapter.ts`

**Đề xuất:** tạo wrapper thống nhất `new Swiper()` cho slider + collection.

**Reject vì:**

1. **Hai consumer phân kỳ hoàn toàn** ở phần init còn lại:
   - Slider cần: Parallax module, EffectFade, Keyboard, timed pagination custom render, MutationObserver, viewport-height sync.
   - Collection cần: breakpoints, `spaceBetween`, pause button UI, `renderBullet`, DOMContentLoaded init.
   - Một adapter bao cả hai = nhận config object rồi pass thẳng vào `new Swiper()` — đó không phải abstraction, là wrapper rỗng (abstraction theater).

2. **Phần dùng chung đã được extract đúng** vào `shared/autoplay` + `shared/motion`. Không còn logic nào đủ điều kiện để extract thêm.

3. **API bị lock sai thời điểm:** nếu extract trước khi consumer #2 thật xuất hiện, API có thể sai khi consumer #2 thực sự implement → nợ mới.

---

## Scope mở rộng tương lai

Nếu có block thứ 3 dùng Swiper (ví dụ: gallery, testimonials):

1. Xem xét liệu init options có trùng đủ để extract không (≥2 call-site thật, không giả định).
2. Nếu có, extract concern cụ thể (ví dụ: lazy-init bằng IntersectionObserver nếu ≥2 block cần) vào `shared/`, **không** wrap toàn bộ `new Swiper()`.
3. Không tạo `swiper-adapter.ts` chỉ để "chuẩn bị nền tảng".

---

## Related

- `docs/decisions/slider-parallax-both-1.3.8.md` — parallax attribute contract (Rev 1.1 Advanced controls)
- `docs/tasks/slider-parallax-timing-fix-1.3.8-patch.md` — task plan + rejected approaches chi tiết
- `src/shared/autoplay.ts` — pause coordinator (3 consumers)
- `src/shared/motion.ts` — reduced-motion helper (3 consumers)
