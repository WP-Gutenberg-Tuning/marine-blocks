# V1 / 1.3.24 — Fullscreen Step Slider execution plan

Ngày: **2026-11-16**. Human chọn phương án A, rồi chỉnh hai điểm: lượt này gồm fade, wipe và text cascade; Ken Burns deferred. Autoplay và loop mặc định bật, manual vẫn có, chia hai giai đoạn dev.

Status: **giai đoạn 1 có source, §9a đã sửa. Fork giai đoạn 2 khóa ở §10a. Chưa PASS runtime, chưa lệnh code giai đoạn 2.** Plan này là tài liệu để code. Contract sản phẩm nằm ở [plan018](018_VERSION_1_3_10_FULLSCREEN_STEP_SLIDER_PLANNING.md). Decision: `docs/decisions/sliders/step-slider/fullscreen-step-slider-1.3.10.md`.

Chưa phải lệnh bump, build hay release. Lệnh code giai đoạn 1 là prompt `docs/workflows/prompts/step-slider-1.3.24-phase1-ink-handoff.md`. Prototype HTML, technical report và `docs/demo-prep/05-step-slider-mvp-cut.md` không phải nguồn implement. Bốn draft trong `docs/ideations/step-slider-phase1/` là phiếu review, không phải nguồn code.

Agent giai đoạn 1 làm §7, §8, §8a, §9 và §9a. Agent giai đoạn 2 chỉ làm §10 và §10a sau lệnh human. Không mở plan018 §5–§14, không đọc prototype, không chọn lại fork §8a, không đổi số §8, không đổi tên file. Thiếu file trong danh sách đọc, hoặc cần một hành vi không có trong §2, §8 và §8a: dừng và hỏi human.

## 1. Hai giai đoạn

Cùng milestone 1.3.24. Giai đoạn 2 bắt đầu sau khi giai đoạn 1 có source và được kiểm manual.

| Giai đoạn | Có | Chưa có |
|---|---|---|
| 1 — Manual | Block parent/child, editor xếp dọc, tab, mũi tên dừng ở hai đầu, fade, wipe, text cascade, reduced motion | Runtime autoplay, loop, progress, pause/play |
| 2 — Autoplay và loop | `autoplay` mặc định On, `loop` mặc định On, dwell 5/8/10 mặc định 8, progress, focus/hover/hidden/offscreen | Ken Burns, O08-E, Content Actions, deep-link từng bước |

Manual sau giai đoạn 2 là tắt autoplay. Tab và mũi tên vẫn đổi bước. Loop On thì mũi tên và autoplay quay vòng. Loop Off thì dừng ở hai đầu và autoplay dừng sau bước cuối.

## 2. Hành vi đã chốt

- Block `skvn-marine/step-slider` và `skvn-marine/step-slide`. `save` giữ `InnerBlocks.Content`. PHP render động trên foundation Slider 1.3.0. Một Swiper. Không `slides` array, không timer autoplay thứ hai.
- Editor không chạy Swiper. Child xếp dọc. `tabLabel` sửa inline, một attribute.
- Insert luôn ra 4 bước. Ba hoặc năm bước là kết quả thêm hoặc xóa child, không phải variation. Thêm, xóa, sắp xếp bằng Gutenberg. Tối đa 8 bước mới. Child chỉ heading, paragraph, list, buttons. CTA có thể bỏ.
- Chiều cao là tối thiểu. Bước dài nở và cuộn cùng trang. Đổi bước không tự cuộn trang. Ảnh cover có điểm lấy nét, overlay theo vùng chữ, surface đỡ chữ tùy chọn. Thiếu ảnh vẫn đọc được chữ và controls.
- Không swipe để đổi bước. Thanh step trên mobile cuộn ngang, nhãn đọc được. Cuộn thanh không đổi bước.
- Đổi bước gồm fade và wipe cùng lúc. Text cascade trên bước đang mở, theo thứ tự heading, paragraph, list, buttons. Cascade không sở hữu thời lượng bước. Reduced motion đổi bước tức thì và hiện chữ ngay.
- In đủ bước theo thứ tự, bỏ controls và motion. Anchor chỉ cho cả block.
- Khi người xem cuộn bước dài, dwell vẫn chạy.
- UI plugin tiếng Anh, text domain `skvn-marine-blocks`.

## 3. Schema

Giai đoạn 1, child: `backgroundImageId` (number, default 0), `backgroundImageUrl` (string), `backgroundImageAlt` (string), `backgroundImageFocalPoint` (object, default `{ "x": 0.5, "y": 0.5 }`), `overlayPreset` (`light` / `medium` / `strong`, default `medium`), `textSurface` (boolean, default false), `tabLabel` (string, default `Step`), `textPosition` (`left` / `center` / `right`, default `left`).

Giai đoạn 2, parent: `autoplay` boolean mặc định `true`, `dwellPreset` `5` / `8` / `10` mặc định `8`, `loop` boolean mặc định `true`.

Không có attribute Ken Burns, video, `tabPosition`, height preset viewport/tall/medium, hay control chọn fade/wipe/cascade. Không có input raw ms, raw màu, raw class.

## 4. Việc agent không được quyết

Số thời lượng nằm ở §8. Agent dùng đúng các số đó. Không spike và không copy prototype.

Giai đoạn 2, trước khi vẽ progress: nếu không có sự kiện Swiper nào cho biết dwell bắt đầu sau transition, dừng và báo human. Không thêm `setInterval`.

O08-E chưa có ngưỡng và câu chữ. Không làm.

## 5. Requirement record

| ID | Nhóm | Hành vi mong đợi | Hiện trạng | Việc cần sửa | Cách kiểm | Evidence |
|---|---|---|---|---|---|---|
| SS-UI-01 | Block UI | Chiều cao tối thiểu; bước dài nở theo trang; đổi bước không tự cuộn trang; thiếu ảnh vẫn đọc được | Chưa làm | Shell, media, fallback | Fixture bước ngắn, bước dài, ảnh thiếu; đo geometry có scrollbar | Screenshot + rect trên build ghi rõ |
| SS-UI-02 | Block UI | Tab đúng thứ tự và bước active; mobile cuộn nhãn; cuộn thanh không đổi bước; không swipe | Chưa làm | Tab bar + mũi tên | Chuột, touch, bàn phím; vuốt slide không đổi bước | DOM `aria-current`, ghi chú swipe |
| SS-UI-03 | Block UI | Đổi bước có fade và wipe; chữ cascade đúng thứ tự; reduced motion thì tức thì và chữ hiện ngay | Chưa làm | Motion giai đoạn 1 | Manual next/prev/tab, rồi bật reduced motion | Quan sát + class/CSS trên build |
| SS-UI-04 | Block UI | Giai đoạn 2: autoplay và loop mặc định On; progress chỉ là dwell sau transition; focus cần Play để chạy lại; hover/ẩn/offscreen pause tạm; tắt autoplay còn manual | Chưa làm | Playback giai đoạn 2 | Default insert, tắt autoplay, tắt loop, focus, hover | Video hoặc log state trên build |
| SS-ED-01 | Editor UX | Preview xếp dọc, không Swiper; label inline một owner; save/reopen không invalid | Chưa làm | Editor parent/child | Insert, sửa label, save, reopen | Ảnh editor + markup lưu |
| SS-ED-02 | Editor UX | Template 4 bước; thêm đến 8; không tự xóa child cũ vượt 8; allowlist content | Chưa làm | Template + InnerBlocks | 3/4/5, thêm bước thứ 9, content ngoài allowlist để nguyên nếu đã có | Markup trước/sau |
| SS-TECH-01 | Technical | PHP render + `InnerBlocks.Content`; một Swiper; asset có điều kiện; sanitize/escape | Chưa làm | Render + view script | Save/reopen, xem HTML, tắt JS vẫn đọc được các bước | HTML frontend + `php -l` |
| SS-TECH-02 | Technical | Giai đoạn 1 dùng số khóa ở §8. Giai đoạn 2 chỉ tiếp tục progress khi `autoplayTimeLeft` bắt đầu sau transition | Chưa làm | Không tự chọn số; dừng nếu sự kiện Swiper không khớp | Manual jump và loop, xem thời điểm progress bắt đầu | Ghi quan sát, không bịa số |
| SS-TRACE-01 | Technical | Ken Burns, O08-E, Content Actions adapter, deep-link từng bước không vào source hai giai đoạn | Deferred | Giữ ID, không code | Diff không có các control này | Plan này |
| SS-QA-01 | Block UI | Runbook `docs/testing/` trước onsite: URL, setup, bước, pass/fail, evidence | Chưa làm | Viết runbook khi có build | Human chạy onsite | File runbook + kết quả human |

Content & States dùng cho SS-UI-01–04: 4 bước mặc định, 1 bước, 8 bước, bước không ảnh, bước chữ dài, autoplay On/Off, loop On/Off, reduced motion.

## 6. Ngoài lượt code

Ken Burns, video nền, Content Actions riêng, deep-link từng bước, ngưỡng O08-E, và luật “cuộn thì dừng đến khi bấm Play”.

Palette/mockup editor vẫn cần human xem khi làm SS-ED-01. Chưa có mockup không chặn schema đã chốt.

## 7. Đọc trước khi sửa, rồi dừng

Đọc đúng các file này. Không tìm thêm block để “tham khảo”.

1. `docs/standards/css-layout-safety-contract.md`
2. `docs/standards/security-guidelines.md`
3. `wp-content/plugins/skvn-marine-blocks/src/index.ts`
4. `wp-content/plugins/skvn-marine-blocks/src/slider/block.json`
5. `wp-content/plugins/skvn-marine-blocks/src/slider/save.tsx`
6. `wp-content/plugins/skvn-marine-blocks/src/slide/block.json`
7. `wp-content/plugins/skvn-marine-blocks/src/slide/save.tsx`
8. `wp-content/plugins/skvn-marine-blocks/src/slide/focal.ts`
9. `wp-content/plugins/skvn-marine-blocks/modules/slider-render/slider-render.php` — chỉ hàm `skvn_marine_blocks_render_slider_inner_blocks`, `skvn_marine_blocks_render_slide`, `skvn_marine_blocks_normalize_slide_background_focal_point`
10. `wp-content/plugins/skvn-marine-blocks/skvn-marine-blocks.php` — đoạn `require_once` slider-render; đoạn đăng ký script `skvn-marine-slider-view` và hai style `skvn-marine-slider-core` / `skvn-marine-slider-view`; trong vòng `foreach` block, các nhánh `editor_style_handles`, `view_script`, `render_callback`, `style_handles` của slider/slide
11. `wp-content/plugins/skvn-marine-blocks/package.json` — hai script `build` và `start`
12. `wp-content/plugins/skvn-marine-blocks/src/slide/edit.tsx` — chỉ đoạn `MediaUpload` lưu `backgroundImageId`, `backgroundImageUrl`, `backgroundImageAlt`
13. `wp-content/plugins/skvn-marine-blocks/src/shared/motion.ts` — chỉ export `prefersReducedMotion`

Không đọc `src/slider/view.ts`. Danh sách import CSS đã khóa ở §9 bước 9. Không sửa file Slider/Slide hiện có. Không sửa `themes/generatepress/`. Không thêm dependency.

## 8. Khóa để agent không chọn

| Khóa | Giá trị |
|---|---|
| Thời lượng fade và wipe | 800 ms. Đây là default `transitionDuration` của Slider hiện có. Không phải control. |
| Swiper giai đoạn 1 | `effect: 'fade'`, `fadeEffect: { crossFade: true }`, `speed: 800`, `loop: false`, `autoplay: false`, `allowTouchMove: false`, `simulateTouch: false`, `keyboard: { enabled: true, onlyInViewport: true }` |
| Wipe | Trên `.skvn-step-slide__media` của slide active: `clip-path` từ `inset(0 100% 0 0)` tới `inset(0 0 0 0)` trong 800 ms. Fade do Swiper. Cả hai luôn chạy. |
| Text cascade | Heading 0 ms, paragraph 100 ms, list 200 ms, buttons 300 ms. Duration 400 ms. `translateY(0.75rem)` và opacity 0 → 1. |
| Reduced motion | `speed: 0`, không animation wipe, không cascade, chữ opacity 1. |
| Cao | `min-height: 100svh` trên viewport và từng bước. `width: 100%`. Không `100vw`, không `margin` âm, không `overflow-x` trên shell. Thanh tab được `overflow-x: auto`. |
| Module Swiper giai đoạn 1 | `A11y`, `EffectFade`, `Keyboard`, `Navigation`. Không import `Autoplay`. |
| Tên file frontend | `src/step-slider/frontend.ts`. Cấm tên `view.ts` vì `package.json` đang xuất `src/slider/view.ts` thành `build/view.ts.js`. |
| Hai lớp opacity | Opacity chữ = opacity `.swiper-slide` × opacity cascade. Giữ cả hai. Không bỏ opacity của cascade. Không tắt fade của content. Không đổi số 800 / 400 / 0 / 100 / 200 / 300. |
| Cao khi chạy | `autoHeight: true`. Slide `height: auto`. `min-height: 100svh` giữ nguyên. Sau build, nếu wrapper không nở theo bước đang active: dừng và báo human. Không đổi sang chiều cao cố định 100svh. |

## 8a. Khóa sau review bốn draft (2026-11-16)

Nguồn: `inkling-2-small-free.md` và `glm-5.3-flash-free.md`, đối chiếu `src/slider/view.ts` (import `swiper/css` + `./style.css`) và `skvn-marine-blocks.php` (hai handle style, `style_handles`, `editor_style_handles`). `flint-40b.md` và `longcat25.md` cùng hướng fork, không thêm khóa. Không mở lại bảng này.

| Fork | Khóa | Đã loại |
|---|---|---|
| F1 | `navigation.prevEl` / `nextEl` trỏ hai button PHP. Module Navigation tự gắn click. | Click riêng gọi `slidePrev` / `slideNext`. Làm cả hai sẽ nhảy hai lần. |
| F2 | Fade cả slide và cascade giữ opacity §8. Hai lớp nhân nhau trong 800 ms. Reduced motion: `speed: 0`, không cascade, chữ opacity 1. | Cascade chỉ `translateY`. CSS tắt opacity fade của `.skvn-step-slide__content` — opacity của `.swiper-slide` không hủy được từ con. |
| F3 | `autoHeight: true`, slide `height: auto`, `min-height: 100svh`. | Chiều cao cố định 100svh và cuộn trong bước. |
| F4 | Một `src/step-slider/editor.css`, import từ cả hai `edit.tsx`. | Hai file editor.css. Không đưa CSS editor vào `frontend.ts`. |
| F5 | Xem §9 bước 9. Script `build/frontend.ts.js`. Style riêng `build/style-frontend.ts.css` chỉ khi nguồn là `./style.css`. CSS Swiper là `build/frontend.ts.css`. | Tên nguồn `frontend.css`. Một handle style duy nhất. |
| F6 | `renderAppender={ false }` khi `getBlockCount( clientId )` ≥ 8. Child đã lưu nhiều hơn 8 giữ nguyên. | `templateLock`, ẩn appender bằng CSS, xóa child vượt 8. |
| F7 | Chưa có `.is-ready`: CSS ẩn tab và hai mũi tên; các bước xếp dọc, opacity 1, đọc được. PHP vẫn đặt `aria-current="true"` trên tab 0. | Bỏ `aria-current` khỏi PHP. Hiện tab khi chưa có JS. |

Giai đoạn 1 không thêm control Inspector cho focal, `overlayPreset`, `textSurface`, `textPosition`. Attribute và default §3 vẫn có. Save và PHP vẫn gắn class từ giá trị đã lưu. Palette editor thuộc §6, không chặn schema.

## 9. Giai đoạn 1 — làm đúng thứ tự

Mỗi bước xong thì sang bước sau. Không làm giai đoạn 2 trong cùng lượt.

1. Tạo `src/step-slider/block.json` và `src/step-slide/block.json`. Tên `skvn-marine/step-slider`, `skvn-marine/step-slide`. `apiVersion` 3, category `skvn-marine`, textdomain `skvn-marine-blocks`, `supports.html` false. Child có `"parent": ["skvn-marine/step-slider"]`. Attribute đúng §3. Title tiếng Anh: `Step Slider`, `Step Slide`.
2. Tạo `src/step-slider/save.tsx`. `useBlockProps.save` với class `skvn-step-slider`. Bên trong chỉ `InnerBlocks.Content`.
3. Tạo `src/step-slide/save.tsx`. Class `skvn-step-slide swiper-slide`. Có ảnh thì thêm `skvn-step-slide--has-background`. Cấu trúc: `skvn-step-slide__media` (img + `skvn-step-slide__overlay`) rồi `skvn-step-slide__content` chứa `InnerBlocks.Content`. Focal dùng hàm trong `src/slide/focal.ts`, không viết hàm focal mới. `textPosition` thành class `is-position-left|center|right`. `textSurface` true thì thêm `skvn-step-slide__content--surface`. `overlayPreset` thành class `is-overlay-light|medium|strong`.
4. Tạo `src/step-slider/edit.tsx`. Không import Swiper. Template đúng bốn `skvn-marine/step-slide`. Không variation và không picker 3/5. `allowedBlocks` của parent chỉ `skvn-marine/step-slide`. Đếm child bằng `getBlockCount( clientId )` của store `core/block-editor`. Từ 8 child trở lên thì `InnerBlocks` nhận `renderAppender={ false }`. Dưới 8 thì appender mặc định. Không `templateLock`. Không xóa child khi đã nhiều hơn 8. Không ẩn appender bằng CSS.
5. Tạo `src/step-slide/edit.tsx`. Preview xếp dọc. `RichText` gắn `tabLabel` trên header của child. InnerBlocks của content chỉ cho `core/heading`, `core/paragraph`, `core/list`, `core/buttons`. Media dùng `MediaUpload` cho `backgroundImageId`, `backgroundImageUrl`, `backgroundImageAlt`, cùng cách lưu với đoạn đã đọc trong `src/slide/edit.tsx`. Không thêm control Inspector cho focal, `overlayPreset`, `textSurface`, `textPosition`. Không chạy animation.
6. Đăng ký hai block trong `src/index.ts`, cùng kiểu import metadata/edit/save của Slider. Không đăng ký variation.
7. Tạo `modules/step-slider-render/step-slider-render.php`. Hàm `skvn_marine_blocks_render_step_slider` và `skvn_marine_blocks_render_step_slide`. `require_once` file này cạnh require slider-render. Gọi `skvn_marine_blocks_render_slider_inner_blocks`, không nhân bản vòng lặp. Sanitize lúc đọc attribute. Escape URL, alt, label. Shell: root `.skvn-step-slider`; bên trong là viewport `.swiper` chỉ chứa `.swiper-wrapper` và các step-slide; tab và hai mũi tên là anh em của viewport, không nằm trong `.swiper`. Tab là `<button>` với `data-skvn-step-index` bắt đầu từ 0 và `aria-current="true"` trên index 0. Mũi tên là hai `<button>` `data-skvn-step-dir="prev"` và `"next"`.
8. Trong `skvn-marine-blocks.php`, thêm `step-slider` và `step-slide` vào mảng block. Nhánh `step-slider`: `render_callback` là `skvn_marine_blocks_render_step_slider`, `skip_inner_blocks` true, `view_script` là `skvn-marine-step-slider-view` khi script đã registered. Nhánh `step-slide`: `render_callback` là `skvn_marine_blocks_render_step_slide`, `skip_inner_blocks` true. Cả hai nhận `editor_style_handles` gồm `skvn-marine-blocks-editor` khi style đó đã registered, và `style_handles` là `skvn-marine-step-slider-view` khi style đó đã registered. Không sửa nhánh slider/slide hiện có.
9. Thêm `src/step-slider/frontend.ts` vào cả `build` và `start` trong `package.json`. `frontend.ts` import đúng ba dòng: `swiper/css`, `swiper/css/effect-fade`, `./style.css`. File style là `src/step-slider/style.css`, không đặt tên `frontend.css`. Đăng ký script `skvn-marine-step-slider-view` từ `build/frontend.ts.js`. Đăng ký style core `skvn-marine-step-slider-core` từ `build/frontend.ts.css`. Đăng ký style `skvn-marine-step-slider-view` từ `build/style-frontend.ts.css`, dependency là core khi core đã registered. Mẫu `file_exists` + `filemtime` của slider view. Không import CSS frontend trong `edit.tsx`. Sau khi human build, nếu một trong ba file `frontend.ts.js`, `frontend.ts.css`, `style-frontend.ts.css` không có trong `build/`: dừng và báo tên file thực, không đổi tên nguồn.
10. `frontend.ts` tìm từng `.skvn-step-slider`, khởi tạo Swiper trên viewport `.swiper` bên trong. Swiper theo §8, thêm `autoHeight: true`. Module chỉ `A11y`, `EffectFade`, `Keyboard`, `Navigation`. `navigation.prevEl` và `navigation.nextEl` trỏ vào hai button PHP. Không gắn click riêng. Không để Swiper tạo thêm nút. Tab gọi `slideTo(index)`. Sau `slideChange` và lúc init: prev disabled khi `isBeginning`, next disabled khi `isEnd`, tab active theo `realIndex`. Thêm class `is-ready` lên root sau khi `new Swiper` thành công. `prefersReducedMotion` lấy từ export trong `src/shared/motion.ts`. Reduced motion thì `speed: 0`. File không chứa chữ `Autoplay`.
11. `src/step-slider/style.css`: chưa có `.is-ready` thì các bước là block xếp dọc, `opacity: 1`, đọc được khi không có JS; tab và hai mũi tên bị ẩn. Sau `.is-ready`, Swiper quản lý slide active. Wipe trên `.skvn-step-slide__media` của slide active, đúng §8. Cascade đúng §8, kể cả opacity; không bỏ lớp fade của slide. `@media print`: ẩn tab và mũi tên, hiện mọi bước, không animation. `@media (prefers-reduced-motion: reduce)` tắt wipe và cascade, chữ opacity 1.
12. Một file `src/step-slider/editor.css`, import từ cả `src/step-slider/edit.tsx` và `src/step-slide/edit.tsx`. Các child xếp dọc, không `opacity: 0`. Không import file này từ `frontend.ts`.

Xong giai đoạn 1 khi các câu sau đều đúng:

- Insert ra 4 step. Save, reopen, block không invalid. Markup lưu có `InnerBlocks.Content` của từng step.
- Mũi tên đầu disabled ở bước 1, mũi tên cuối disabled ở bước cuối.
- Vuốt trên slide không đổi bước. Cuộn ngang thanh tab không đổi bước.
- Đổi bước bằng tab hoặc mũi tên thì fade và wipe cùng chạy; chữ vào đúng thứ tự heading, paragraph, list, buttons.
- Reduced motion: bước đổi không animation, chữ hiện ngay.
- Tắt JS: bốn bước đọc được từ trên xuống.
- `frontend.ts` không chứa chữ `Autoplay`.
- `npm run build` do human chạy. Agent chỉ đưa lệnh, không tự chạy:

```bash
source /home/shinkuro/.nvm/nvm.sh && nvm use 20 && cd /mnt/d/Github/skvn-marine/wp-content/plugins/skvn-marine-blocks && npm run build && find modules/ -name "*.php" -exec php -l {} \;
```

## 9a. Sửa sau review source (2026-11-16)

Human: lập plan rồi sửa. Ba điểm dưới đây khóa cho source hiện tại. Không mở lại §8a.

1. **CSS editor.** `editor.css` không mang tên `style.css`, nên wp-scripts xuất `build/index.ts.css`. Handle `skvn-marine-blocks-editor` chỉ nạp `build/style-index.ts.css`. Đăng ký handle `skvn-marine-step-slider-editor` từ `build/index.ts.css` và gắn vào `editor_style_handles` của `step-slider` và `step-slide`. Giữ tên file `editor.css`. Không import file đó từ `frontend.ts`.
2. **Thanh tab.** Tab vẫn là anh em của `.swiper`. `position: absolute; inset-inline: 0; bottom: 0` trong `.skvn-step-slider`, `overflow-x: auto`, `max-width: 100%`. Không `100vw`, không margin âm, không `overflow-x` trên shell. Chữ có padding đáy thêm `4.5rem` để khỏi nằm dưới thanh tab. Print trả padding đáy về `1.5rem`. Bước cao hơn viewport: thanh tab nằm ở cuối bước đó.
3. **Căn Full.** Parent có attribute `align` default `full`. Bề ngang dùng rule theme sẵn có `.skvn-full-width-canvas .entry-content .alignfull` (`width: 100%`). Không thêm rule width mới. Block đã lưu trước sửa này mà thiếu class `alignfull` có thể invalid cho đến khi recover.

## 10. Giai đoạn 2 — chỉ sau khi human bảo giai đoạn 1 xong

Hai draft `docs/ideations/step-slider-phase2/ink.md` và `glm.md` là phiếu review. Bản khóa là §10a. Lệnh code là `docs/workflows/prompts/step-slider-1.3.24-phase2-glm-handoff.md`. Không code theo draft.

Không làm các bước này trong lượt giai đoạn 1.

1. Thêm attribute parent §3 vào `block.json`: `autoplay` default true, `dwellPreset` string enum `5`|`8`|`10` default `8`, `loop` default true.
2. Inspector tiếng Anh: Autoplay, Dwell (5/8/10 seconds), Loop. Hết.
3. PHP đưa ba giá trị vào `data-autoplay`, `data-dwell`, `data-loop` trên root. Escape attribute.
4. `frontend.ts` mới import `Autoplay`. `autoplay` chỉ khi data là `1` và không reduced motion. `delay` là 5000, 8000 hoặc 10000 theo `data-dwell`. Giá trị khác thì dùng 8000. `loop` theo `data-loop`, và tắt loop khi chỉ có một bước. `waitForTransition: true`. `pauseOnMouseEnter: false`.
5. Progress là một phần tử trong tab active, width từ phần trăm dwell. Bắt đầu sau event transition kết thúc. Không dùng `autoplayTimeLeft` cho khoảng đang fade. Nếu không có event nào cho biết dwell bắt đầu sau transition, dừng và hỏi human.
6. Focus vào root: dừng autoplay, hiện nút Play, không tự chạy lại. Hover, `document.hidden`, và root ra khỏi viewport: pause, rồi resume khi điều kiện hết, trừ khi đang dừng vì focus. Reduced motion: không autoplay, không progress.
7. Loop off: tới bước cuối thì autoplay dừng và nút next disabled. Loop on: next từ bước cuối về bước đầu.

Xong giai đoạn 2 khi block mới insert là autoplay on và loop on; tắt autoplay thì tab và mũi tên vẫn đổi bước; tắt loop thì dừng ở hai đầu.

## 10a. Khóa sau review ink và GLM (2026-11-16)

Nguồn đối chiếu: hai draft trên, rồi sửa theo `modules/autoplay.mjs` của Swiper **11.2.10** đang cài. Không mở lại bảng này. Không thêm control `rewind`. Loop là một cờ: bật thì mũi tên và autoplay từ bước cuối về bước đầu; tắt thì mũi tên dừng ở hai đầu và autoplay không `slideTo(0)`.

| Fork | Khóa | Đã loại |
|---|---|---|
| Đồng hồ progress | Dwell đầu tiên bắt đầu ở `autoplayStart`. Các dwell sau bắt đầu ở `autoplayResume`. `resume()` chỉ chạy sau `transitionend` trên `wrapperEl` (`autoplay.mjs` `onTransitionEnd` → `resume`). Width chỉ cập nhật khi `autoplay.running && !autoplay.paused`. Công thức `(1 - timeLeft / delayTotal)`, clamp 0–100%, span của tab active. | `slideChangeTransitionEnd` cộng CSS `transition: width`. `autoplayTimeLeft` trong lúc `paused` (fade 800 ms vẫn bắn event với delay đầy). `setInterval` riêng. |
| Progress trong tab | PHP render `<span class="skvn-step-slider__tab-progress" aria-hidden="true">` trong mỗi tab. `pointer-events: none`. JS chỉ đổi width. Tab vẫn một click `slideTo`. | JS tạo hoặc xóa span mỗi lần đổi bước. |
| Play | PHP render `<button type="button" class="skvn-step-slider__play" hidden>` là anh em của `.swiper`, nhãn `Play`, text domain `skvn-marine-blocks`. `focusin` trong root thì `autoplay.stop()` và bỏ `hidden`. Click Play thì `autoplay.start()` và gắn lại `hidden`. `focusin` từ chính nút Play không gọi `stop()`. Rời focus không tự chạy lại. | JS tạo nút lúc focus. Play trong Inspector. `focus` chỉ trên element root, vì root không nhận focus. |
| Tương tác | `disableOnInteraction: false` viết tường minh. `pauseOnMouseEnter: false` giữ §10. Với false, `beforeTransitionStart` chỉ `pause(true, true)` rồi `resume` sau transition (`autoplay.mjs` dòng 256–263). | `disableOnInteraction: true`. Click tab sẽ `stop()` và không có nút nào ngoài Play để chạy lại. |
| Pause tạm | Hover (`pointerenter` / `pointerleave`, `pointerType === 'mouse'`), `document.hidden`, và `intersectionRatio === 0` là một chồng điều kiện của mình. `resume` chỉ khi cả ba đã hết và không đang focus-stop. Module luôn gắn `visibilitychange` và `resume()` không xét hover hay offscreen (`autoplay.mjs` dòng 185–195). Nghe `autoplayResume`: nếu một điều kiện tạm vẫn còn thì `pause()` lại ngay. | Để module một mình lo `document.hidden`. Ngưỡng `0.5`. |
| Loop tắt | `stopOnLastSlide: !loop`. `proceed()` khi `isEnd` và cờ này true thì không `slideTo(0)` (`autoplay.mjs` dòng 102–109). Dwell của bước cuối vẫn chạy hết. Hết dwell, progress kẹp ở 100%. Play trên bước cuối chạy lại dwell đó rồi vẫn không sang bước khác. `syncControls`: `prev.disabled = !loop && isBeginning`, `next.disabled = !loop && isEnd`. Một bước thì `loop` false. | `autoplay.stop()` ngay khi `slideChangeTransitionEnd` tới bước cuối. Giữ `isBeginning` / `isEnd` cả khi loop bật. Click `slidePrev` / `slideNext` riêng. |

§10 bước 5 đã có sự kiện: `autoplayResume`. Không dừng lại để hỏi event. Không đổi số §8. Không đổi tab §9a: `max-width: 100%`, không phải `100px`.

Khi được lệnh code, chỉ các file:

- `src/step-slider/block.json`
- `src/step-slider/edit.tsx`
- `src/step-slider/frontend.ts`
- `src/step-slider/style.css`
- `modules/step-slider-render/step-slider-render.php`
