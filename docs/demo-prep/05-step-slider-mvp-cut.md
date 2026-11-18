# 05 — Step Slider 1.3.10: MVP cut cho demo

> **Lịch sử demo, không phải handoff code.** Human 2026-11-16: nguồn implement là `.context/planning/079_VER_1_3_24_FULLSCREEN_STEP_SLIDER_EXECUTION_PLAN.md`. Delay 5/7/9/12 giây và lựa chọn slide hoặc fade trong file này không còn hiệu lực.

> Full contract trong `.context/planning/018_VERSION_1_3_10_FULLSCREEN_STEP_SLIDER_PLANNING.md`.
> File này là đường cắt demo cũ.

---

## Bookkeeping phải sửa TRƯỚC khi code (từ critique C4)

- [x] Rename `docs/decisions/fullscreen-step-slider-1.5.0.md` → `fullscreen-step-slider-1.3.10.md` — **xong 2026-10-13** (cleanup tài liệu đã human phê duyệt; header cũng đã đổi `Milestone: V1 / 1.5.0` → `V1 / 1.3.10`)
- [ ] Sửa header planning 018: "V1 / 1.5.0" → "V1 / 1.3.10"; xoá dòng stale "Current milestone remains: V1 / 1.2.1"

## IN — MVP demo (ước lượng 4–6 ngày, 3 slice)

### Slice S1 — Skeleton (1–1.5 ngày)
- Blocks `skvn-marine/step-slider` + `skvn-marine/step-slide`, `block.json` metadata.
- InnerBlocks: parent chứa step-slide; step-slide chứa content InnerBlocks (heading/paragraph/buttons).
- PHP dynamic render trên foundation 1.3.0: fullscreen shell, media layer + overlay preset, content layer.
- Attributes tối thiểu — parent: `autoplay`, `delay` (governed 5/7/9/12s như Slider), `loop`,
  `heightPreset` (viewport/tall). Child: `backgroundImageId/Url/Alt`, `overlayPreset`, `tabLabel`, `textPosition`.
- Editor: stacked preview (không chạy Swiper) — theo rule slider hiện có.
- **Gate:** build + `php -l` + insert/duplicate/reorder qua List View OK.

### Slice S2 — Tabs + Swiper (1.5–2 ngày)
- Bottom tab bar render từ metadata child slides: number (`01`) + `tabLabel`.
- Swiper wiring (view script riêng, tái dùng `shared/autoplay` + `shared/motion` — không fork runtime).
- Tab click → `slideToLoop`; Swiper events → tab active state (`aria-current`).
- Mobile: tabs scroll ngang, không wrap vỡ.
- **Gate:** Dev verify local — tab sync 2 chiều đúng.

### Slice S3 — Progress + a11y (1–1.5 ngày)
- Progress bar trên active tab: CSS animation restart theo `autoplayTimeLeft`/slide change;
  pause khi hover/focus/document hidden (dùng pause coordinator sẵn có).
- Keyboard: arrows đổi slide, Tab tới tab buttons hoạt động.
- `prefers-reduced-motion`: không autoplay, không progress animation, chuyển slide tức thời.
- No-JS: mọi slide content đọc được (stacked fallback).
- **Gate:** Dev verify local + a11y quick pass (keyboard + reduced-motion).

## OUT — sau demo (không code, không control UI)

| Item | Lý do dời |
|---|---|
| Wipe transition + text cascade presets | polish, không chặn demo narrative |
| Ken Burns | motion phụ |
| Video background | policy chưa approve (planning §11) |
| Tab positions ngoài bottom | một layout đủ demo |
| Parallax inheritance từ 1.3.8 | chờ parallax ổn định đã (P0) |
| Icon picker, tab style variants | governed controls mở rộng |

Transition giữa slides trong MVP: dùng Swiper mặc định (slide) hoặc fade — chọn 1,
không xây preset system.

## Ràng buộc giữ nguyên từ planning 018

- Không `slides: array` / SlideRepeater — InnerBlocks only.
- Không autoplay timer thứ hai ngoài Swiper.
- Không raw color/px/ms input — preset only.
- Không chạy Swiper trong editor.
- Deploy: nếu thêm PHP runtime module mới → chạy deploy artifact audit trước zip.

## Rủi ro & phòng bị

- **Rủi ro lớn nhất:** S2 tab sync với loop mode (loopFix làm index nhảy). Phòng bị: dùng
  `realIndex` cho tab state (Slider 1.3.1 đã giải bài này — tái dùng cách đếm real slides).
- Nếu cuối tuần 2 S3 chưa xong: demo với autoplay off + tab click thủ công vẫn kể được chuyện.
