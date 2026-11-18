# V1 / 1.3.21 — Research: animation chữ trong Slider

2026-11-13. Human hỏi các cách animate text trong slider hiện có. **Chỉ research. Chưa sửa runtime, chưa gán version cho feature mới.**

Hướng B (heading → paragraph → buttons) có plan thực hiện: [075](075_VER_1_3_21_SLIDER_TEXT_STAGGER_PLAN.md). Status plan: PLANNING, chưa code.

Slider ở đây là `skvn-marine/slider` + child `skvn-marine/slide`. Step Slider (`1.3.24`) là block khác; text cascade của nó đang Deferred theo plan 018 O11.

## 1. Chữ đang nằm ở đâu

`src/slide/save.tsx` render ba lớp:

```text
.skvn-slide
  .skvn-slide__media
    .skvn-slide__bg > img
    .skvn-slide__overlay
  .skvn-slide__content
    InnerBlocks
```

Template mặc định (`src/slide/edit.tsx`): `core/heading`, `core/paragraph`, `core/buttons`. Chữ là block con trực tiếp của `.skvn-slide__content`, không phải field riêng của Slide.

Parallax ảnh chỉ gắn `data-swiper-parallax-*` lên `.skvn-slide__bg` (`src/slider/view.ts`). Quyết định `docs/decisions/slider-parallax-both-1.3.8.md` giữ parallax trên nền. Plan 026 từng phác content `-10%`; production không làm vậy.

## 2. Đã có trong source

Thời lượng chuyển slide là `transitionDuration` (default 800). `view.ts` ghi `--skvn-slider-transition-duration`. CSS chữ đọc biến đó.

| Transition | Swiper effect | Chữ |
|---|---|---|
| Slide | `slide` | Cả slide trượt. Chữ không có motion riêng. |
| Fade | `fade` + `crossFade` | Cả slide mờ. Chữ không có motion riêng. |
| Directional wipe | `slide` + class `skvn-slider--transition-directional-wipe` | Con trực tiếp của `.skvn-slide__content`: inactive `opacity: 0` + `translateX(1.5rem)` (đảo khi previous). Active: về 0, delay heading 0 / paragraph 100ms / buttons 200ms. |
| Zoom out | `fade` + class `skvn-slider--transition-zoom-out` | Cả khối `.skvn-slide__content` inactive: `opacity: 0` + `translateY(0.75rem)`. Không tách dòng. |

`prefers-reduced-motion: reduce` trong `style.css` buộc `.skvn-slide__content` và con trực tiếp về `opacity: 1`, `transform: none`, `transition: none`.

Editor không chạy Swiper. Rule project: editor không được giấu nội dung bằng `opacity: 0` nếu không có fallback. Motion chữ phải là frontend.

Theme `assets/js/animations.js` có `[data-skvn-reveal]` + `IntersectionObserver`, bắn một lần khi vào viewport rồi `unobserve`. Không replay khi đổi slide. Không có CSS `is-skvn-revealed` trong theme tại thời điểm research. Không dùng làm engine chữ của slider.

## 3. Swiper 11.2.10 có thể làm gì với chữ

`node_modules/swiper/modules/parallax.mjs` (lock `11.2.10`). Module chỉ chạy khi `parallax: true`. Runtime hiện bật khi parallax ảnh bật, `slidesPerView === 1`, và không reduced-motion.

Attribute trên một element:

| Attr | Lúc slide đang xem (`progress` 0) | Lúc ra khỏi khung (`progress` ±1) |
|---|---|---|
| `data-swiper-parallax-x` / `-y` | `translate 0` | đúng giá trị attr |
| `data-swiper-parallax-opacity` | opacity 1 | đúng giá trị attr. Công thức giống scale: `opacity - (opacity - 1) * (1 - abs(progress))` |
| `data-swiper-parallax-scale` | scale 1 | đúng giá trị attr |
| `data-swiper-parallax-rotate` | 0 | `rotate * progress * -1` deg. Có trong module, không có trong docs ngắn của Swiper mà project đang cite cho ảnh |

Motion này bám **progress của lần chuyển slide**, cùng nhịp với ảnh. Không có delay từng dòng sau khi slide đã đứng yên. Gắn scale lên chữ sẽ zoom chữ — cùng họ vấn đề plan 072 vừa tách khỏi Translate only.

`data-swiper-parallax-duration` có trên ảnh (`view.ts` ghi bằng `transitionDuration`). Research này không đo duration riêng cho content; nếu làm hướng C phải kiểm module có đọc duration per element trước khi hứa stagger.

## 4. Phương án

| | Cách | Khi nào đẹp | Giá |
|---|---|---|---|
| **A — Giữ như hiện tại** | Wipe đã stagger 3 loại block. Zoom out fade cả khối. Slide/Fade không đụng chữ. | Đủ nếu chỉ cần chữ “vào” lúc wipe/zoom. | Không thêm control. Slide/Fade vẫn phẳng. |
| **B — Preset CSS theo slide active** | Slider-level: Off / Fade up / Stagger (heading → paragraph → buttons). Class trên root, CSS giống wipe nhưng không gắn với wipe. Duration dùng `--skvn-slider-transition-duration`. | Muốn chữ vào sau khi nền đã (hoặc đang) đổi, kể cả Fade và Slide. | Một attribute governed. Selector đang là con trực tiếp: `core/group` bọc heading sẽ không stagger từng dòng. Editor vẫn hiện chữ tĩnh. |
| **C — Parallax depth trên `.skvn-slide__content`** | Nền giữ attr hiện tại. Content nhận translate nhỏ hơn (plan 026: nền `-30%`, chữ `-10%`) và/hoặc opacity 0 ở mép. Chỉ khi parallax ảnh đang bật. | Chữ trôi chậm hơn ảnh trong lúc kéo slide. Không phải entrance sau khi đứng yên. | Đụng quyết định “parallax chỉ trên bg”. Phải sửa decision trong cùng đợt nếu làm. Không scale chữ. Tắt theo reduced-motion và `slidesPerView > 1` như ảnh. |
| **D — Attribute từng slide / từng block** | Mỗi heading tự chọn hướng, delay, khoảng cách. | Biên tập từng câu. | Trái governed presets (plan 026). Dễ lệch giữa các slide. Ngoài scope research này. |
| **E — Tách từng chữ / từng từ** | JS split text node của heading. | Hiệu ứng ticker. | Không cắt `core/heading`. Khi cần: block heading chữ thuần riêng. Ghi ở plan [075](075_VER_1_3_21_SLIDER_TEXT_STAGGER_PLAN.md) §8. Chưa code. |
| **F — Thư viện motion mới** | GSAP hoặc tương đương. | Timeline phức tạp. | Thêm dependency. Shared runtime theme không replay theo slide. Không khuyến nghị. |
| **G — Step Slider cascade** | Block `step-slider`, plan 018 O11. | Kể chuyện từng bước. | Deferred `1.3.24`. Không nhét vào slider hero. |

## 5. Ràng buộc nếu làm tiếp

- Frontend only. Editor stacked, chữ đọc được, không `opacity: 0` trên canvas.
- `prefers-reduced-motion`: chữ ở trạng thái cuối, không transform.
- Không gắn `data-swiper-parallax-scale` lên chữ.
- Preset ở **slider**, không raw class, không hex, không delay tự nhập. Delay stagger nếu có thì là bội số cố định của transition duration (wipe đang hard-code 0/100/200).
- InnerBlocks lạ hơn heading/paragraph/buttons: stagger chỉ an toàn trên con trực tiếp, hoặc phải giới hạn allowlist.
- Card carousel (`slidesPerView` > 1) không nhận parallax chữ. Preset CSS B vẫn có thể chạy trên slide active nếu human muốn; mặc định nên Off vì nhiều card cùng lúc.
- A11y: chữ inactive có thể `opacity: 0` lúc chuyển. Không `aria-hidden` cả slide đang chuyển nếu nút vẫn focusable — kiểm focus trong slide không active trước khi ẩn hẳn bằng `visibility`.
- Không đụng `themes/generatepress/`. Không mở scope Step Slider.

## 6. Khuyến nghị khi được lệnh làm

Làm **B** nếu mục tiêu là “chữ hiện đẹp khi sang slide”, độc lập với parallax ảnh. Control một preset, mặc định Off để slider cũ không đổi.

Chỉ xét **C** khi mục tiêu là lớp chữ trôi cùng lúc kéo nền. Đó là sửa decision parallax-only-bg, không thay B.

A đã đủ cho Directional wipe. Không cần E/F/G cho hero slider này.

## 7. Slider không FSE làm chữ thế nào

Đối chiếu 2026-11-13. Nguồn: Slider Revolution help (Timeline, Animation Mode, Essentials In/Out), Smart Slider 3 (layer animation, text animation, timeline), Elementor Pro Slides widget help (cập nhật 2026-09-15). Research nội bộ cũ: `docs/explain/archives/slider-competitive-research-1.2.0.md` — SKVN không thay engine layer/timeline của Slider Revolution.

Ba mức, không phải một cách.

### Slider Revolution — layer + timeline

Chữ không phải block Gutenberg. Mỗi heading, nút, ảnh là một **layer**, thường đặt tuyệt đối trên stage riêng.

Animation là mode riêng, hai tầng:

- **Essentials:** chọn preset. In (lúc slide bắt đầu), Out (lúc slide kết thúc), Additional (one-shot hoặc loop khi layer đang hiện).
- **Advanced:** keyframe. Mỗi keyframe giữ vị trí, scale, xoay, skew, opacity, bóng, màu. Duration tính bằng millisecond, có easing.

Timeline: mỗi layer một track. Kéo thân frame để đổi delay, kéo hai đầu để đổi duration. Có scene tùy chỉnh gắn action, ngoài In/Out mặc định. Nền là track riêng, chỉ liệt kê trong scene In.

Chữ còn tách nhỏ hơn cả layer. Track con gồm dòng, từ, ký tự. Preset In có nhóm Lines, Words, Letter, Kinetic Text, ngoài Basic / Movement / Rotate / Masked / Cinematic.

Hệ quả: chữ vào và ra **độc lập** với hiệu ứng đổi slide. Có thể heading trễ 400 ms, đoạn trễ 700 ms, nút trễ 1 s, rồi Out ngược lại trước khi slide kế hiện. Đó là sản phẩm biên tập timeline, không phải một class CSS.

### Smart Slider 3 Pro — cùng mô hình, có nhánh flow

Cũng layer, không FSE. Pro có timeline millisecond: incoming (xanh), outgoing (xám), loop (lục). Keyframe là các bước offset X/Y so với vị trí nghỉ. Mask: chỉ phần chữ nằm trong ô gốc mới hiện.

Họ tách hai việc:

- **Layer animation:** cả khối (fade, move, reveal bằng tấm màu che).
- **Text animation:** chỉ heading, cắt thành dòng / từ / ký tự. Heading lúc cắt không chứa HTML. Có thể chạy cùng lúc layer animation; nếu lệch giờ, hiệu ứng chữ kết thúc trước khi khối kịp hiện.

Họ khuyên layout flow (normal) cho hầu hết slide; absolute là lớp tự do. Có nút bỏ qua out-animation khi đổi slide, để không phải chờ mọi chữ chạy hết.

### Elementor Slides — preset một lần cho cả khối chữ

Widget Pro, không phải Gutenberg FSE. Mỗi slide có title, description, button — field cố định, không phải InnerBlocks.

`Content Animation` là một dropdown của **cả widget**: None, Down, Up, Right, Left, Zoom. Áp khi slide được hiện. Không timeline, không tách dòng, không out riêng, không cắt từng chữ. Ken Burns là tùy chọn của ảnh nền, tách khỏi chữ.

Đây là bản gần hướng **B** trong §4. Research 1.2.0 đã xếp “content entrance preset: None / Fade / Fade up” vào P1 và “per-layer timeline” vào P2 / chủ đích không làm.

### Việc SKVN không lấy

| Họ có | SKVN không lấy, vì |
|---|---|
| Stage đặt layer tuyệt đối | Vỡ flow Gutenberg, responsive, và dữ liệu riêng không phải block. |
| Timeline ms + easing tự nhập | Trái governed preset. Marketing dễ ra motion không đọc được. |
| Cắt từng chữ / từ | Vỡ heading core, HTML, trình đọc. Research §4 hướng E. |
| In và Out là hai scene | Out làm người chờ trước khi sang slide. Wipe hiện tại chỉ animate lúc vào; reduced-motion về trạng thái cuối. |
| Loop / kinetic text | Attention animation, ngoài hero đọc nội dung. |

Phần đáng học, và đã khớp hướng B: **một preset cho cả khối chữ, chạy khi slide thành active, tách khỏi parallax ảnh.** Revolution cho thấy stagger đẹp vì delay từng layer; SKVN có thể làm bản hẹp bằng delay cố định trên heading / paragraph / buttons, không mở timeline.
