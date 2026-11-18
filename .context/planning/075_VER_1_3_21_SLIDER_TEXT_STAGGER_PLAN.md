# V1 / 1.3.21 — Slider text stagger

2026-11-13. Human muốn heading vào trước, rồi paragraph, rồi buttons. Research [074](074_VER_1_3_21_SLIDER_TEXT_ANIMATION_RESEARCH.md) gọi đây là hướng **B**. Human đã lệnh tiến hành trong cùng ngày; source có ở §8, trạng thái chi tiết ở dòng **Status** (chưa build, chưa STA/FAD).

Current vẫn **1.3.21**. Không bump, không chuyển mốc, không đụng Step Slider 1.3.24.

## 1. Việc cần làm

| # | Việc | Xong khi |
|---|---|---|
| 1 | Attribute `contentMotion`: `off` \| `stagger`, mặc định `off` | Block cũ không đổi behavior |
| 2 | Control **Text motion** trong Presentation, tiếng Anh, chỉ khi một slide hiện | Editor không chạy animation |
| 3 | Ghi attr qua `save.tsx` và PHP `data-skvn-slider` | Frontend đọc được cùng một giá trị |
| 4 | Class `skvn-slider--content-stagger` chỉ trên frontend đã init, một slide/view, không reduced-motion | No-JS và editor vẫn đọc được chữ |
| 5 | CSS: heading 0 ms, paragraph 100 ms, buttons 200 ms, duration lấy `--skvn-slider-transition-duration` | Đúng thứ tự human mô tả |
| 6 | Wipe và Zoom out nhường phần chữ khi class stagger có mặt; clip/zoom của ảnh giữ nguyên | Không hai transform chữ cùng lúc |
| 7 | Runbook STA-01–08 | Có bước human kiểm frontend |

## 2. Hành vi

Template slide là con trực tiếp của `.skvn-slide__content`: `core/heading`, `core/paragraph`, `core/buttons`.

Khi **Text motion = Stagger** và slider đang chuyển:

1. Mọi heading trực tiếp vào cùng một nhịp (delay 0).
2. Mọi paragraph trực tiếp vào nhịp sau (100 ms).
3. Cả block buttons vào nhịp cuối (200 ms). Hai nút trong cùng block không tách nhau.

Hướng vào: `translateY(0.75rem)` → `none`, kèm `opacity` 0 → 1. Không đảo theo next/previous. Không scale. Không cắt từng chữ.

**Off** (mặc định): Directional wipe giữ stagger ngang sẵn có (0 / 100 / 200, `translateX`). Fade và Slide không animate chữ. Zoom out vẫn fade cả khối `.skvn-slide__content`.

Stagger chạy với cả bốn transition (wipe, fade, slide, zoom out). Nó thay phần chữ của wipe và zoom out, không cộng thêm.

## 3. Ngoài đợt Stagger

Stagger đã có source. Các việc human chốt thêm nằm ở §8, không bị mục này loại.

Ngoài plan:

- Timeline, scene In/Out, loop, millisecond và easing tự nhập.
- Parallax trên chữ. Swiper 11.2.10 chỉ có `data-swiper-parallax-duration` để đuổi progress, không có delay bắt đầu. Quyết định parallax chỉ trên nền vẫn giữ cho đến khi có lệnh riêng.
- Cắt `core/heading` thành từng ký tự. Đánh chữ dùng block chữ thuần, §8.
- Từng nút bên trong một block buttons. Cả block là một cụm.
- Card carousel, một slide, editor, reduced-motion, slider chưa init: không chạy entrance.
- Step Slider, GeneratePress, dependency mới.

## 4. Source

Cùng kiểu `parallaxBlur`: attr phải có ở block.json, save, PHP config, và view. Thiếu một phía thì frontend mất giá trị.

| File | Việc |
|---|---|
| `src/slider/block.json` | `"contentMotion": { "type": "string", "default": "off" }` |
| `src/slider/edit.tsx` | `SelectControl` trong Presentation, cạnh Transition. Ẩn khi `hasMultiViewTransition`. Options: Off, Stagger. Help: heading, then the paragraph, then the buttons. No effect in the editor. Direct children only. |
| `src/slider/save.tsx` | Đưa `contentMotion` vào JSON `data-skvn-slider` |
| `modules/slider-render/slider-render.php` | Normalize `off` \| `stagger`, default `off`, ghi vào `$config` |
| `src/slider/view.ts` | Normalize cùng enum. Sau khi đã biết `reducedMotion` và `slidesPerView === 1` và `slideCount > 1`: thêm class nếu giá trị là `stagger`. Không thêm khi reduced-motion hoặc nhiều slide một view |
| `src/slider/style.css` | Rules ở mục 5 |
| `docs/testing/slider-text-stagger-1.3.21.md` | Runbook STA-* |

Editor đã có class `skvn-slider--editor` và không chạy Swiper. Không thêm class stagger trong `edit.tsx`.

## 5. CSS

Selector gốc:

```text
.skvn-slider--initialized.skvn-slider--content-stagger:not(.skvn-slider--editor):not(.skvn-slider--reduced-motion)
```

- Con trực tiếp `.skvn-slide__content > *`: `transition-property: opacity, transform`; `transition-duration: var(--skvn-slider-transition-duration, 800ms)`; `transition-timing-function: ease-out`.
- Slide không active: `opacity: 0`; `transform: translateY(0.75rem)`; `transition-delay: 0ms`.
- Slide active, mọi con: `opacity: 1`; `transform: none`.
- Delay chỉ trên slide active:
  - `:where(h1, h2, h3, h4, h5, h6, .wp-block-heading)` → `0ms`
  - `:where(p, .wp-block-paragraph)` → `100ms`
  - `:where(.wp-block-buttons, .wp-block-button)` → `200ms`
- Block khác (group, image, list): cùng nhịp buttons, delay 200 ms, vì không có slot riêng. Không stagger bên trong group.

Wipe hôm nay đặt `translateX` lên cùng các con này (`style.css` khoảng dòng 852–884). Zoom out đặt transform lên cả `.skvn-slide__content` (khoảng 890–898). Khi có `--content-stagger`:

- Giữ clip-path / mask của wipe trên `.skvn-slide__media`.
- Giữ `transform: scale` của zoom out trên `.skvn-slide__media`.
- Rule chữ của wipe và rule opacity/transform chữ của zoom out thêm `:not(.skvn-slider--content-stagger)`.

`@media (prefers-reduced-motion: reduce)` đã buộc content về `opacity: 1` và `transform: none`. Giữ nguyên. Class `--reduced-motion` là lớp chặn thứ hai, khớp nhánh `view.ts` đang đổi transition sang fade.

Không `visibility: hidden` và không `aria-hidden` thêm. Wipe hiện chỉ dùng opacity. Swiper vẫn sở hữu ẩn slide không active. STA-08 kiểm tab có rơi vào nút của slide không active hay không; nếu có, ghi riêng, không núp bằng visibility trong đợt này.

Trước init, slider không có `--initialized` (và một slide dùng `--static`). Chữ hiện. Không `opacity: 0` trên canvas editor.

## 6. Acceptance

| ID | Nhóm | Mong đợi |
|---|---|---|
| STA-01 | Editor UX | Presentation có Text motion: Off / Stagger. Card carousel và slides per view > 1 không hiện control. Editor không làm chữ mờ hay trượt. |
| STA-02 | Block UI | Off, Fade hoặc Slide: chữ không có entrance riêng. Off + Directional wipe: stagger ngang cũ vẫn còn. |
| STA-03 | Block UI | Stagger, template mặc định, bất kỳ transition: heading vào trước, paragraph sau, buttons cuối. Ảnh không scale vì control này. |
| STA-04 | Block UI | Hai heading trực tiếp vào cùng lúc. Hai nút trong một block buttons vào cùng lúc. |
| STA-05 | Block UI | `core/group` bọc heading: group vào như một khối, heading bên trong không có nhịp riêng. |
| STA-06 | Technical | `data-skvn-slider` có `"contentMotion":"stagger"`. Root frontend có `skvn-slider--content-stagger` sau init. Editor root không có class đó. |
| STA-07 | Technical | `prefers-reduced-motion: reduce`: không class stagger, chữ hiện, không transform. Một slide và carousel nhiều card: không class stagger. |
| STA-08 | Technical | Tab qua slider: nút slide không active không lấy focus, hoặc ghi lại nếu Swiper chưa chặn. Không thêm `aria-hidden` trong đợt này. |

Có source không phải PASS. STA cần frontend sau build.

## 7. Quyết định trong plan

1. Vấn đề: muốn heading, rồi paragraph, rồi buttons vào lần lượt khi đổi slide.
2. Phương án: Off giữ nguyên; Stagger là một preset CSS (074 B). Không timeline (Revolution), không parallax chữ (074 C).
3. Khuyến nghị: làm bảng mục 1 khi human nói code. Default Off.
4. Bằng chứng: wipe đã delay 0 / 100 / 200 trong `style.css`; Fade/Slide không có rule chữ; `view.ts` chỉ thêm class transition sau init; editor luôn có `skvn-slider--editor`.
5. Tự kiểm: chọn Stagger, xem slide active trong DevTools — heading `transition-delay: 0ms`, paragraph `100ms`, `.wp-block-buttons` `200ms`.
6. Đảo ngược: xóa attr và class, trả rule chữ wipe/zoom out. Slider đã lưu `stagger` coi như `off` nếu enum không còn. Không migration nội dung.
7. Chưa có lệnh code. Tới khi human nói implement: không sửa runtime. Default nếu không quyết: giữ Off, tức source hiện tại.

**Status:** SOURCE 2026-11-13. Stagger và Fade theo cụm đều có source. Chưa build, chưa STA, chưa FAD. Runbook `docs/testing/slider-text-stagger-1.3.21.md`. Đánh chữ §8.2 chưa làm.

## 8. Fade theo cụm và đánh chữ

2026-11-13. Human: những mục này thuộc plan, không nằm ở danh sách loại trừ. Fade theo cụm đã có source cùng ngày. Stagger giữ nguyên nhịp. Đánh chữ vẫn chờ nhu cầu.

### 8.1 Fade theo cụm — SOURCE 2026-11-13

Thêm giá trị `fade` vào `contentMotion` (`off` | `stagger` | `fade`). Control **Text motion** thêm **Fade**. Không thêm setting hướng. Không ô nhập delay.

Chữ vào theo từng block con trực tiếp của `.skvn-slide__content`, theo thứ tự trong slide. Bước **200 ms**. Heading, heading, paragraph, buttons: 0, 200, 400, 600 ms. Tối đa 8 cụm. Cụm thứ 8 trở đi cùng delay 1400 ms.

Hướng lấy `data-skvn-direction` sẵn có, cùng wipe:

- `next` hoặc chưa có cờ: từ phải, `translateX(1.5rem)` về `none`, kèm opacity 0 → 1.
- `previous`: từ trái, `translateX(-1.5rem)`.

Slide đang xem lúc tải hiện sẵn, không entrance. `core/group` là một cụm. Nút trong cùng block buttons không tách.

Stagger giữ nguyên: mọi heading cùng 0 ms, paragraph 100 ms, buttons 200 ms, luôn từ dưới lên.

| File | Việc |
|---|---|
| `src/slider/block.json` | Thêm `fade` vào enum `contentMotion` |
| `src/slider/edit.tsx` | Option Fade. Help: each block in order, 0.2s apart, from the side the slide is moving. No effect in the editor. |
| `src/slider/save.tsx` | Giá trị mới đi cùng JSON hiện có |
| `modules/slider-render/slider-render.php` | Normalize thêm `fade` |
| `src/slider/view.ts` | Class `skvn-slider--content-fade` cùng điều kiện với stagger: đã init, một slide mỗi view, không reduced-motion, hơn một slide. Hai class không cùng lúc |
| `src/slider/style.css` | Rule fade bên dưới. Wipe và zoom out thêm `:not(.skvn-slider--content-fade)` ở các rule chữ đã có `:not(.skvn-slider--content-stagger)` |
| `docs/testing/slider-text-stagger-1.3.21.md` | Thêm FAD-01–07 |

CSS chỉ khi có class fade, đã init, không editor, không reduced-motion. Con không active: opacity 0, translate theo hướng, delay 0. Con của slide active: opacity 1, transform none, `transition-delay` theo `:nth-child(1)` … `:nth-child(8)`. Duration dùng `--skvn-slider-transition-duration`.

| ID | Mong đợi |
|---|---|
| FAD-01 | Text motion có Off, Stagger, Fade. Không có control hướng. Editor không animate. |
| FAD-02 | Fade, bấm next: cụm 1 từ phải, cụm 2 sau 200 ms. Hai heading thẳng trong slide không vào cùng lúc. |
| FAD-03 | Bấm previous: các cụm từ trái, cùng bước 200 ms. |
| FAD-04 | Group là một bước. Cả block buttons là một bước. |
| FAD-05 | Stagger vẫn mọi heading cùng nhịp, từ dưới lên. |
| FAD-06 | Reduced-motion, một slide, carousel: không class `skvn-slider--content-fade`. |
| FAD-07 | `data-skvn-slider` ghi `"contentMotion":"fade"`. |

### 8.2 Đánh chữ từng ký tự — khi có nhu cầu

Chưa có block, chưa có preset, chưa có version. Không cắt `core/heading`.

Làm bằng block heading trong plugin: một chuỗi chữ thuần và mức h1–h6. Frontend tách cụm ký tự, tiếng Việt giữ dấu trong một cụm, `aria-label` cả câu trên heading, `aria-hidden` trên từng `span`. Editor không cắt.
