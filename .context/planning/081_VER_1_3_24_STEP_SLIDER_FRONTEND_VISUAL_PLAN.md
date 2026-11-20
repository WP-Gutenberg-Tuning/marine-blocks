# V1 / 1.3.24 — Step Slider frontend visual

Ngày mở: **2026-11-16**. Khóa sản phẩm: **2026-11-18**. **Sửa 2026-11-19 (human):** `heightMode: content` phải đều giữa các tab — xem §9. Câu cũ “cao theo chữ, bước dài nở” không còn nghĩa nhảy height khi đổi tab.

Đây là spec để code lần sơn. Chat không phải spec. Plan [079](079_VER_1_3_24_FULLSCREEN_STEP_SLIDER_EXECUTION_PLAN.md) khóa runtime giai đoạn 1 và 2. Plan này khóa mặt vẽ và control đi kèm mặt vẽ. Hai file chồng câu thì **file này thắng** cho những việc liệt kê ở mục Việc. [082](082_VER_1_3_24_STEP_SLIDER_EDITOR_UI_PLAN.md) là khung editor rail/stage, **không làm trong lần này**.

Chưa tự coi là lệnh code. Khi human nói làm, làm đúng mục Việc và dừng ở mục Cấm.

## Cấm

Làm một việc dưới đây là làm sai, dù đọc được một câu cũ trong 079, 081 bản trước, hoặc trong artifact.

1. Chỉ sửa `style.css` rồi dừng. Lần sơn cần cả markup PHP, attribute, và editor. Bản cũ của file này nói “chỉ style.css” là hết hiệu lực.
2. Thêm counter `01/04` góc phải. Artifact bản manual có. Human không chọn.
3. Lấy `#3ddc84` làm màu progress duy nhất. Đó là màu trong file mẫu, không phải màu sản phẩm.
4. Hiện nút Play suốt, hoặc đổi nhãn thành `Tạm dừng`. O09: chữ `Play`, tiếng Anh, `hidden` đến khi focus dừng autoplay.
5. Ép bốn tab một hàng rồi cắt nhãn bằng ellipsis. O10: nhãn dài thì thanh cuộn ngang. Cuộn thanh không đổi bước.
6. Trừ chiều cao header. Không `viewport-below-header`. Không copy `syncViewportHeight`. Không sửa `themes/generatepress/`.
7. Thêm lớp `.skvn-step-slide__bg` để bắt chước parallax Slider. Bao cover là `.skvn-step-slide__media`.
8. Tách `focal.ts`, fill, hoặc picker sang `src/shared/` trong lần này. Slider và Step là hai lần dùng. Block thứ ba mới được tách. Tension `.context/TENSIONS_OPEN.md` 2026-11-18 14:48.
9. Xóa attribute `textPosition` hoặc `overlayPreset`. Mặt vẽ lần này không dùng chúng để căn cột hay phủ một màu rgba. Attribute vẫn còn.
10. Mở Ken Burns, O08-E, text surface, text position, plan 082.
11. Đổi số motion 800 / 400 / 0 / 100 / 200 / 300. Không đọc prototype để lấy speed khác.
12. Nhận chuỗi CSS tự do vào ô hex. Hex chỉ `#RGB` hoặc `#RRGGBB` sau sanitize. Gradient tự nhập đi ô gradient, không đi ô hex.
13. Bịa palette thứ năm. Bước 5–8 lặp bốn nền gốc.
14. Coi `pauseOnHover` là việc của lần sơn. Control đó đã có trong source. Đừng viết lại, đừng tắt mặc định.

## Đọc trước khi sửa

1. File này, hết mục Cấm và mục Việc.
2. [018](018_VERSION_1_3_10_FULLSCREEN_STEP_SLIDER_PLANNING.md) hàng O02-C, O02-H, O03, O09, O10.
3. `src/slide/focal.ts`, `src/slide/fill.ts`, `src/slide/edit.tsx` phần Fill và FocalPointPicker. Dùng lại. Không viết bản thứ hai của hàm normalize.
4. `modules/slider-render/slider-render.php` hàm `skvn_marine_blocks_normalize_slide_background_focal_point`, `skvn_marine_blocks_normalize_slide_fill_mode`, `skvn_marine_blocks_sanitize_slide_fill_background`. Gọi hàm đó. Không dán thân hàm sang step-slider-render.
5. Artifact chỉ để đối chiếu ảnh. Giá trị gradient và overlay đã chép ở mục Nền. Không mở prototype để thêm chi tiết ngoài mục Việc.

## Việc

### 1. Thanh bước

Một dải liền, `left: 0; right: 0; bottom: 0`, không padding làm pill nổi. Mỗi bước một cột `flex: 1 1 0`, hai dòng: số `01` và nhãn `tabLabel`. Số không ghi vào attribute `tabLabel`. Số là thứ tự render, đệm hai chữ số.

Nhãn dài hơn bề ngang cột thì thanh `overflow-x: auto`. Cuộn không gọi `slideTo`. Không `text-overflow: ellipsis` làm cách duy nhất để giấu chữ.

Progress là gạch cao 2px trên mép trên của bước đang mở, full ngang cột đó. `frontend.ts` đã ghi `style.width` theo phần trăm dwell. Giữ cơ chế width. Đổi vị trí và màu bằng CSS. Màu lấy từ màu progress của block, không hard-code `#3ddc84`, không dùng `currentColor` trên nền trắng.

### 2. Mũi tên

Desktop: `top: 50%`, `translateY(-50%)`, prev `left: 1rem`, next `right: 1rem`, khoảng 46px.

`max-width: 640px`: cả hai nút `top: 1rem`, bỏ translate. Prev `left: 0.5rem`. Next `left: 2.85rem`, `right: auto`. Khoảng 36px. Không để một nút giữa mép trái và một nút giữa mép phải.

Nét là SVG chevron trong nút, `viewBox="0 0 24 24"`, stroke, không ký tự `‹ ›`, không font `swiper-icons`. PHP render thay nội dung hai `<button>`. `aria-label` giữ Previous step / Next step.

### 3. Play

Vẫn `<button class="skvn-step-slider__play" hidden>` anh em của `.swiper`. Nhãn `Play`. Hình pill, chữ đọc được, không vòng 2.75rem. Vẫn ẩn đến khi focus dừng autoplay. Không đụng logic focus trong `frontend.ts` trừ khi nút không còn là button hidden.

### 4. Cột chữ

`.skvn-step-slide__content`: `max-width: 46rem`, `margin-right: auto`, padding đáy đủ để khỏi đè thanh bước (artifact dùng `clamp(6.5rem, 17vh, 9.5rem)` cho đáy). Không trải full ngang. Không thêm control trái / giữa / phải.

### 5. Nền gradient gốc

Đây là `default` khi bước không có ảnh. Bước 1, 5 dùng nền 1. Bước 2, 6 dùng nền 2. Cứ thế. Không bịa màu khác.

```css
radial-gradient(110% 80% at 18% 8%,  #2a7f9e 0%, #0f4266 42%, #071c33 100%)
radial-gradient(110% 80% at 82% 12%, #2f8f83 0%, #14524b 46%, #0a2422 100%)
radial-gradient(110% 80% at 20% 85%, #b97a2a 0%, #5c3a17 45%, #1d130a 100%)
radial-gradient(110% 80% at 80% 88%, #5b5bd6 0%, #2c2c6e 48%, #101024 100%)
```

Index lấy từ thứ tự step trong slider, bắt đầu 0. `index % 4`.

### 6. Fill, dùng lại Slider

Ba mức, cùng tên Slider:

| Mode | Nghĩa |
|---|---|
| `default` | Bốn gradient mục 5 khi không có ảnh. Có ảnh thì ảnh cover, gradient không thay ảnh. |
| `custom` | Hex nền hoặc gradient người dùng nhập, chỉ áp khi không có ảnh. |
| `transparent` | Không có lớp nền. Giống nhãn Slider “Transparent (no fill layer)”. |

Gọi `skvn_marine_blocks_normalize_slide_fill_mode` và `skvn_marine_blocks_sanitize_slide_fill_background`. Hex nền chỉ `#RGB` / `#RRGGBB`. Gradient chỉ các dạng hàm PHP đang cho phép. Attribute để trên **step-slide**, vì mỗi bước một nền. Thiếu attribute thì `default`.

### 7. Overlay

Mặc định là hai lớp của artifact, luôn là anh em của ảnh, không nằm trong `<img>`:

```css
linear-gradient(0deg, rgba(4,12,20,.60) 0%, rgba(4,12,20,0) 26%),
linear-gradient(90deg, rgba(4,12,20,.84) 0%, rgba(4,12,20,.42) 44%, rgba(4,12,20,0) 70%)
```

Độ phủ dùng lại `overlayOpacity` của Slider, default 100 với lớp này vì bản mẫu đã có alpha trong gradient. Control là số 0–100. 0 thì không thấy overlay. Không dùng ba preset `light` / `medium` / `strong` để vẽ rgba phẳng trong lần này. Attribute `overlayPreset` không xóa.

Có ảnh hay không ảnh, overlay vẫn là lớp này khi opacity khác 0. Ảnh không bị overlay nuốt vì overlay là lớp trên ảnh, không phải nền thay ảnh.

### 8. Màu progress

Một màu cho cả slider, attribute trên **step-slider**. Default một hex đọc được trên thanh tối. Không phải `#3ddc84` trừ khi người dùng nhập đúng mã đó. Ô hex sanitize `#RGB` hoặc `#RRGGBB`. Giá trị hỏng thì bỏ, dùng default. Không `style` từ chuỗi người dùng dán vào.

### 9. Chiều cao

**Sửa 2026-11-19 (human, supersede giữa các tab):** “phải đều giữa các tab chứ”. Câu cũ “cao theo chữ, bước dài nở” chỉ còn nghĩa *khối content không phải 100svh*; **không** có nghĩa mỗi tab một chiều cao riêng. Swiper `autoHeight: true` co theo slide đang mở **không** phải spec sản phẩm — đó là gap so với spec này.

Attribute `heightMode` trên step-slider. Hai giá trị.

| Giá trị | Hành vi |
|---|---|
| `viewport` | Default. `min-height: 100svh` trên **div bọc cả slide/nền và thanh step** (`.skvn-step-slider`), không chỉ `.swiper`/background. Tab nằm trong hộp đó (in-flow). Stage ảnh = `100svh − tab height`. **Không** trừ header (Cấm 6). |
| `content` | Không `min-height: 100svh`. Cao theo nội dung các bước, rồi **mọi tab dùng chung một chiều cao** = bước cao nhất (hoặc cơ chế san đều tương đương). Đổi tab **không** được đổi chiều cao hộp slider. Không `overflow: auto` bên trong bước. Tab vẫn `bottom: 0` của khối bước, không `fixed`. |

Thanh tab (setting **Step tab height**, default 54px) là control riêng, không phải cơ chế san đều chiều cao slider.

Khối cũ không có attribute thì `viewport`. Không Medium, không Tall, không ô pixel, không trừ header. Source: `autoHeight: false`; content mode san đều `min-height` theo bước cao nhất (`frontend.ts` `equalizeContentHeights`). Chưa runtime PASS.

### 10. Focus point

Attribute `backgroundImageFocalPoint` đã có, default `{ "x": 0.5, "y": 0.5 }`. PHP đã ghi `--skvn-slide-bg-pos-x/y`. CSS ảnh đã `object-position` hai biến đó.

Việc còn thiếu: `FocalPointPicker` trong `src/step-slide/edit.tsx` khi bước đã có ảnh, cạnh Replace / Remove. Nhãn `Background image focal point`, nút `Reset to center`, dòng `Position: …`. Gọi `normalizeFocalPoint` từ `src/slide/focal.ts`. Không viết hàm focal mới.

Ảnh vẫn là con của `.skvn-step-slide__media`. Không bọc thêm `__bg`.

## File được sửa khi có lệnh code

- `src/step-slider/style.css`
- `src/step-slider/block.json` — `heightMode`, màu progress
- `src/step-slider/edit.tsx` — chiều cao, hex progress
- `src/step-slide/block.json` — fill mode, fill color, fill gradient, overlayOpacity nếu chưa có
- `src/step-slide/edit.tsx` — picker, fill, overlay
- `src/step-slide/save.tsx` — cây overlay vẫn anh em của ảnh
- `modules/step-slider-render/step-slider-render.php` — số bước, SVG mũi tên, data height, màu progress, nền, overlay

Không sửa `frontend.ts` trừ khi progress không còn đọc được width của span hiện có. Không sửa `src/slider/**`, `src/slide/focal.ts`, `src/slide/fill.ts`. Gọi, không sửa file gốc của Slider trong lần này.

## Xong khi

Desktop và khoảng 390px, có ảnh và không ảnh:

- Thanh là một dải, có số và nhãn, không pill.
- Progress nằm mép trên bước đang mở và chạy theo dwell.
- Mũi tên desktop giữa hai cạnh. Màn hẹp cả cặp góc trên trái, nét chevron.
- Play là pill chữ `Play`, ẩn trước khi focus.
- Cột chữ không rộng quá 46rem.
- Bước không ảnh dùng đúng bốn gradient, bước 5 giống bước 1.
- `transparent` bỏ lớp nền. Hex sai không thành CSS.
- Kéo focus point đổi vùng ảnh nhìn thấy sau khi save và mở lại.
- `heightMode=content` không còn cao tối thiểu một khung nhìn; mọi tab cùng một chiều cao (bước cao nhất). Đổi tab không đổi chiều cao hộp.
- Print ẩn tab, mũi tên, Play.
- Không tràn ngang bằng `100vw` hay margin âm.

Human nhìn still và chấp nhận trước khi coi là sơn xong.
