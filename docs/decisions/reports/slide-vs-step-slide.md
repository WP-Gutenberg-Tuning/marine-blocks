# Slide và Step Slide — đối chiếu claim Hero Slider

Ngày: 2026-11-20
Loại: báo cáo đối chiếu source. Không phải decision, không mở scope, không đổi block.

## Kết luận

Claim đúng, với một điểm cần gọi đúng tên.

**Hero Slider không phải block riêng.** Nó là variation `skvn-hero-slider` của block `skvn-marine/slider`, attribute `preset: "hero"`, và mỗi khung bên trong là `skvn-marine/slide`. Nguồn: `src/slider/variations.ts`.

**`slide` và `step-slide` bị khóa vào hai cha khác nhau, khóa hai chiều:**

| Chiều khóa | `slide` | `step-slide` |
|---|---|---|
| Con chỉ được nằm trong (`parent`) | `skvn-marine/slider` | `skvn-marine/step-slider` |
| Cha chỉ nhận (`allowedBlocks`) | `skvn-marine/slide` | `skvn-marine/step-slide` |

Nguồn: `src/slide/block.json`, `src/slider/block.json`, `src/step-slide/block.json`, `src/step-slider/block.json`.

Vì vậy Hero Slider không nhận `step-slide`. Gutenberg từ chối cả hai hướng: cha Hero không có `step-slide` trong `allowedBlocks`, và `step-slide` không khai `slider` trong `parent`.

**Hợp đồng dữ liệu không giống nhau.** Hai block chia một nhóm field ảnh và fill, rồi lệch ở overlay, nhãn bước, vị trí chữ, context cha truyền xuống, danh sách block con được phép, và PHP render. Dán nội dung chéo nhau cũng bị từ chối: `src/core-controls/block-content/fields.ts` (`ALLOWED_CHILDREN`).

Phần dùng chung hiện có là helper, không phải block: `step-slide` import focal/fill từ `src/slide/focal.ts` và `src/slide/fill.ts`. PHP dùng cùng hàm chuẩn hoá focal và fill mode. Helper dùng chung không biến hai block thành một hợp đồng.

## Vì sao có hai con

Không phải mỗi dạng slider một block con.

Slider thường đã có một con duy nhất, `skvn-marine/slide`. Hero, Product Showcase và Card Carousel đều là variation của cùng cha `skvn-marine/slider`. Chúng khác nhau ở attribute `preset` của cha và ở template nội dung lúc chèn. Cùng một block `slide` phục vụ cả ba. Nguồn: `src/slider/variations.ts`.

Step Slider được chốt là một họ block khác, không phải variation thứ tư của slider. Plan 018 ghi lý do: thanh tab dưới đáy đọc `tabLabel` từng bước, tiến trình theo thời gian đứng, kể chuyện tuần tự. Có một thứ nằm dưới đáy chưa đủ để dùng lại họ này. Hero đã có chấm và có thể đặt mũi tên ở dưới, mà vẫn là `slider` + `slide`. Những thứ đó cần dữ liệu trên từng bước (`tabLabel`, vị trí chữ, fill theo index) mà `slide` không có, và cha `slider` không đọc. Nhét các field đó vào `slide` thì mọi Hero, Showcase và Card đều mang attribute của bước. Tách `step-slide` giữ bài viết cũ của slider không đổi schema.

Quy tắc đang chạy trong repo:

- Cùng cha, khác cách trình bày → variation + `preset`. Giữ nguyên con.
- Từng khung cần field và render mà con hiện tại không có, và cha phải đọc field đó → con mới, khóa `parent` vào cha mới.
- Ảnh, focal, fill dùng lại bằng hàm chung. Không cần block con chung cho việc đó.

## Ai dùng `step-slide`

Đối chiếu source đang đăng ký và planning đã có tên block. Ngày 2026-11-20 chỉ có một cha: `skvn-marine/step-slider`. Block đó không có variation. Autoplay bật hay tắt là attribute của cùng cha, vẫn là `step-slide`.

| Dạng | Con | Ghi chú |
|---|---|---|
| Fullscreen Step Slider | `step-slide` | Họ duy nhất. Nguồn: `src/step-slider/block.json` |
| Hero, Product Showcase, Card Carousel | `slide` | Ba variation của `skvn-marine/slider`. `src/slider/variations.ts` |
| Feature Showcase | không có slide | Block `skvn-marine/feature-showcase`, panel ảnh riêng |
| Product / Post Carousel | không có slide | Variation của collection, query sản phẩm hoặc bài viết |
| Seafood Store | đề xuất `seafood-slide` | Nghiên cứu, chưa đăng ký. `docs/ideations/sliders/INDEX.md` xếp ngoài Step Slider và ghi block riêng `skvn-marine/seafood-slider` / `seafood-slide` |

Không có dạng slider thứ hai trong repo được giao dùng `step-slide`. Dạng gần nhất về ý "từng bước" là Seafood Store, và kế hoạch của nó không nhận con này.

## Đối chiếu với dạng trên web

Ngày 2026-11-20. Các nguồn dưới phân loại theo việc điều hướng có cần nhãn từng mục hay không. Thư viện web thường lưu một mảng `{ nhãn, nội dung, ảnh }`, không tách hai block Gutenberg. Cột "hợp đồng" ở đây chỉ nói dữ liệu từng khung có giống `step-slide` hay không.

Baymard tách bốn việc hay bị vẽ giống nhau: page control (chấm, vị trí trong chuỗi vuốt), tabs (nhãn, nhảy giữa các mục), progress stepper (bước có tên trong một quy trình), pagination (trang kết quả). Chấm không nói mục đó là gì. Khi người xem cần biết từng mục chứa gì, họ khuyên stepper có nhãn, không dùng chấm. [Page control UI](https://baymard.com/blog/page-control-ui).

NN/g: tab gồm nhãn ngắn và một panel. Vài nhóm thì dùng tab. Nhiều tab thì thanh tab biến thành carousel và mục bị khuất khó tìm. [Tabs, Used Right](https://www.nngroup.com/articles/tabs-used-right/).

| Dạng gặp trên web | Chrome | Hợp đồng gần `step-slide`? |
|---|---|---|
| How-it-works / process spotlight: 3–6 bước, mỗi bước một nhãn, một panel, vạch chạy rồi sang bước | Tab + progress theo thời gian đứng | Có, và là cách dựng demo. Hướng dẫn: [step-slider-demo-usage.md](../../workflows/step-slider-demo-usage.md). Ví dụ [Process Spotlight](https://reactframe.com/components/process-spotlight), [Process Section](https://www.framer.com/marketplace/components/process-section/) |
| Feature tabs tự chạy: mỗi tab một nhãn và một panel (ảnh, video, mô tả), vạch đầy thì chuyển | Tab + progress | Gần hợp đồng, để làm sau. Chưa SemVer, chưa chốt có dùng `step-slide`. [087](../../../.context/planning/087_FUTURE_CANDIDATE_FEATURE_TABS_PLANNING.md). [Feature tabs](https://hairlineui.com/ui/feature-tabs) |
| Hero, testimonial một câu, banner chiến dịch | Chấm, mũi tên | Không. Đúng họ `slide` |
| Carousel nhiều thẻ: sản phẩm, portfolio | Vuốt, thấy nhiều mục | Không. Card Carousel |
| Gallery ảnh, trước/sau kéo tay | Chấm hoặc tay cầm kéo | Không. Không có nhãn bước cho cha đọc |
| Wizard thanh toán, form nhiều bước | Stepper theo mức hoàn thành | Không. Đó là trạng thái form, không phải khung nội dung tự chạy |
| Process accordion dọc, ảnh một bên | Mọi bước vẫn nhìn thấy một phần | Không. Bố cục khác, không phải một `step-slide` chiếm stage |
| Tabs danh mục, không thứ tự, không tự chạy | Nhãn tab | Chỉ trùng `tabLabel`. Thiếu tiến trình, thời gian đứng, kể tuần tự |

Step Slider trong repo nằm ở hàng đầu: nhãn từng bước, một stage, vạch theo dwell. Feature tour có nhãn và vạch là hàng thứ hai trên web. Trong repo, Feature Showcase là block panel riêng, không dùng `step-slide`. Wizard và accordion dọc không dùng con này dù trên hình cũng có số bước.

## Hero Slider đang mang gì

Variation `skvn-hero-slider` (`src/slider/variations.ts`):

- Cha: `skvn-marine/slider`, `preset: "hero"`, `effect: "fade"`, `slidesPerView: 1`, autoplay 7000ms, loop, mũi tên circle, chấm dots.
- Hai con khởi tạo, mỗi con là `skvn-marine/slide` với `overlayOpacity: 40`, bên trong là heading, paragraph, buttons.
- Editor giới hạn Hero (và Product Showcase) ở 5 slide: `hasSlideLimit()` trong `src/slider/editor/selection.ts`. Step Slider giới hạn 8 bước trong `src/step-slider/edit.tsx`.

Hành vi Hero nằm ở cha `slider` khi `preset === "hero"` và ở con `slide` khi context `skvn-marine/sliderPreset` là `hero`. Không có block tên hero-slide.

## Khác nhau giữa `slide` và `step-slide`

### Khóa và context

| | `skvn-marine/slide` | `skvn-marine/step-slide` |
|---|---|---|
| Cha hợp lệ | `skvn-marine/slider` | `skvn-marine/step-slider` |
| Context nhận | `skvn-marine/sliderPreset` ← attribute `preset` của slider | `skvn-marine/stepFillPreset` ← attribute `fillPreset` của step-slider |
| Context dùng để | Bật/tắt nền và lớp fill Hero; showcase/card-carousel tắt nền | Chọn màu fill mặc định theo preset + thứ tự bước |
| Editor focus | `SliderEditorFocusContext` | `StepSliderEditorFocusContext` |

Thiếu context thì slide coi preset rỗng (không vào nhánh Hero fill). Step-slide thiếu `stepFillPreset` thì PHP lấy `deep-marine`.

### Attribute trên chính block con

Cùng tên, cùng ý nghĩa ảnh nền:

- `backgroundImageId`, `backgroundImageUrl`, `backgroundImageAlt`, `backgroundImageFocalPoint`
- `backgroundFillMode`, `backgroundFillColor`, `backgroundFillGradient`

Lệch:

| Field | `slide` | `step-slide` |
|---|---|---|
| `overlayOpacity` | default `35`. PHP kẹp 0–80, bước 5 | default `100`. PHP kẹp 0–100, bước 1. Overlay vẫn vẽ khi chưa có ảnh |
| `overlayPreset` | không có | còn trong `block.json` (`light` / `medium` / `strong`). Save và render hiện tại không đọc. Chỉ markup cũ trong `src/step-slide/deprecated.tsx` |
| `tabLabel` | không có. Cha không đọc nhãn từ con; chấm do Swiper | default `"Step"`. Cha đọc để dựng thanh bước |
| `textPosition` | không có. Nội dung không có class vị trí | `left` / `center` / `right`, default `left` |
| `textSurface` | không có | boolean, default `false`, class `skvn-step-slide__content--surface` |
| Fill mặc định khi không ảnh, không custom | Chỉ preset Hero mới gắn class fill. Showcase và card-carousel tắt hẳn ảnh nền | Không ảnh và fill mode thường: nền = preset cha + index bước |

Content Actions chỉ copy field nội dung, không copy style. Danh sách copy của slide không có `tabLabel`. Danh sách của step-slide có `tabLabel` (`fields.ts`). Overlay, fill, vị trí chữ không đi theo lệnh copy nội dung.

### Nội dung bên trong

| | `slide` | `step-slide` |
|---|---|---|
| Template editor | heading, paragraph, buttons | heading, paragraph |
| Inserter | `InnerBlocks` không khai `allowedBlocks` — editor không chặn họ block con ở đây | chỉ `core/heading`, `core/paragraph`, `core/list`, `core/buttons` |
| Cho phép khi dán nội dung | heading, paragraph, buttons, image, columns, group | heading, paragraph, list, buttons |

Hero variation nhét heading + paragraph + button vào `slide`. Step-slide không nhận `core/image`, `core/columns`, `core/group` trong bảng dán. Ảnh nền của cả hai là attribute của khung, không phải block `core/image` bên trong.

### Cha sở hữu hành vi nào

Slider (`preset` hero nằm ở đây), không nằm trên `slide`:

- autoplay, delay, loop, effect / transition, thời lượng, content motion
- mũi tên, pagination, slides per view, responsive slides
- parallax
- chiều cao `heightPreset`

Step Slider, không nằm trên `step-slide`:

- autoplay, pause on hover, nút play, dwell `5` / `8` / `10`
- loop, `heightMode` viewport hoặc content, chiều cao tab, màu progress
- `textAnimation` `slide` hoặc `rise`
- `fillPreset` (context xuống con)
- thanh tab lắp từ `tabLabel` của từng con

Đổi con mà không đổi cha là đổi cả lớp điều khiển: Hero không có dwell, tab, progress color, text animation. Step Slider không có parallax, pagination style, arrow style, slides per view.

### Render

Cả hai đều dynamic. `skvn-marine-blocks.php` gắn `render_callback`. PHP bỏ HTML đã lưu (`unset( $content )`) rồi dựng lại.

| | `render_slide` | `render_step_slide` |
|---|---|---|
| File | `modules/slider-render/slider-render.php` | `modules/step-slider-render/step-slider-render.php` |
| Class gốc | `skvn-slide swiper-slide` | `skvn-step-slide swiper-slide` |
| Ảnh | URL từ attachment id, fallback URL cũ. Bọc trong `.skvn-slide__bg` | `wp_get_attachment_image`. Bước 0 `fetchpriority=high`, bước sau `loading=lazy`. Class `skvn-step-slide__image` |
| Overlay | Chỉ khi có ảnh | Khi opacity > 0, kể cả chưa có ảnh |
| Index bước | không có | `$GLOBALS['skvn_marine_blocks_step_slide_index']` do cha đặt trước khi render từng con. Dùng cho fill mặc định và thứ tự tải ảnh |
| Nội dung | `.skvn-slide__content` | `.skvn-step-slide__content.is-position-*` |

`save.tsx` vẫn ghi markup vào bài viết để editor và bản deprecated đối chiếu. Frontend không dùng chuỗi đó.

## Lưu ý nếu một slider mới muốn dùng một trong hai

Slider mới ở đây nghĩa là một block cha hoặc một variation mới. Hai con hiện tại không phải khung trung tính.

### Dùng `slide`

Chỉ đứng được khi cha là `skvn-marine/slider`, hoặc khi sửa `parent` của `slide` và `allowedBlocks` của cha mới trong cùng một đợt. Sửa `parent` của block đã có trong bài viết là đổi block đã phát hành: bài cũ vẫn lưu tên con cũ trong cha cũ; cha mới không tự nhận markup cũ.

Hệ quả đi kèm nếu nhận `slide` như Hero đang nhận:

- Phải cung cấp context `skvn-marine/sliderPreset`. Giá trị `product-showcase` hoặc `card-carousel` làm PHP tắt ảnh nền. Giá trị khác `hero` thì không gắn lớp fill Hero.
- Overlay bị kẹp 0–80, bước 5, default 35. Giá trị 100 của step-slide không sống được trên hợp đồng này.
- Không có `tabLabel`, `textPosition`, `textSurface`. Thanh bước và căn chữ phải làm ở chỗ khác, hoặc không có.
- Editor Hero/Showcase ngừng thêm slide ở 5. Variation mới chỉ dính trần này nếu `hasSlideLimit()` được mở rộng cho preset đó.
- Inserter của `slide` đang mở. Bảng dán nội dung thì hẹp hơn inserter. Slider mới đừng giả định hai cửa này cùng một danh sách.
- Copy nội dung giữa các slide không mang overlay và fill.

### Dùng `step-slide`

Chỉ đứng được khi cha là `skvn-marine/step-slider`, hoặc nới `parent` + `allowedBlocks` như trên.

Hệ quả đi kèm:

- Cha phải phát context `skvn-marine/stepFillPreset`. Thiếu thì mọi bước không ảnh rơi về Deep Marine.
- Cha phải đọc `tabLabel` nếu muốn thanh bước. Block con không tự vẽ thanh đó.
- Render con phụ thuộc index global do cha `step-slider` gán. Cha khác không gán index thì mọi bước bị xử lý như bước 0: fill index 0, ảnh không lazy.
- Trần editor hiện tại là 8 bước, nằm trong edit của step-slider, không nằm trong `block.json` của con.
- Nội dung con bị khóa heading, paragraph, list, buttons. Layout cột, ảnh trong nội dung, group của Hero không vào được.
- `overlayPreset` còn trong schema nhưng không còn là lớp overlay đang chạy. Đừng xây UI mới trên field đó.
- `overlayOpacity` default 100 và vẽ cả khi chưa có ảnh. Mang nguyên số 35 của Hero sang sẽ ra một lớp phủ khác hợp đồng slider.

### Không ghép hai con vào một cha

Một cha nhận cả `slide` và `step-slide` phải sửa bốn chỗ khóa (`parent` hai con, `allowedBlocks` hai cha hoặc cha mới) và bảng `ALLOWED_CHILDREN`. Sau đó render vẫn là hai hàm, hai class, hai thang overlay. Attribute không map 1:1: thiếu `tabLabel` khi đi từ slide sang step-slide; mất ý nghĩa tab khi đi ngược lại; opacity 40 của Hero bị đổi nghĩa trên thang 0–100 của step.

Cách đang có trong repo là giữ mỗi con một cha, và chỉ chia sẻ helper focal/fill. Slider mới nên chọn một con và chấp nhận hợp đồng của cha hiện tại của con đó, hoặc tạo con mới nếu cần field mà cả hai hợp đồng đều không có. Tạo con mới nằm ngoài báo cáo này.

## Nguồn đã đọc

- `src/slider/variations.ts` — variation `skvn-hero-slider`
- `src/slider/block.json`, `src/slide/block.json`
- `src/step-slider/block.json`, `src/step-slide/block.json`
- `src/slide/edit.tsx`, `src/slide/save.tsx`
- `src/step-slide/edit.tsx`, `src/step-slide/save.tsx`, `src/step-slide/deprecated.tsx`
- `src/slider/editor/selection.ts`, `src/slider/editor/canvas.tsx`
- `src/step-slider/edit.tsx` (`MAX_STEPS`)
- `src/core-controls/block-content/fields.ts`
- `modules/slider-render/slider-render.php` (`skvn_marine_blocks_render_slide`)
- `modules/step-slider-render/step-slider-render.php` (`skvn_marine_blocks_render_step_slide`, `skvn_marine_blocks_render_step_slider_slides`)
- `skvn-marine-blocks.php` — `render_callback` của bốn block
