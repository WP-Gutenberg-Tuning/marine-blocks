# Agent & Layout Pitfalls — SKVN Marine

> Tổng hợp lỗi layout/UI đã gặp, cách tránh, và checklist bắt buộc trước khi
> agent sửa CSS/JS slider hoặc surface tương tự.
>
> Case chi tiết: xem `INDEX.md`. Phương pháp điều tra: `.agents/skills/ui-debug/SKILL.md`.

---

## Bảng nhanh

Lỗi quy trình/validation của Content Actions (review `0a53a2d`, 2026-11-05): xem [Agent pitfalls AP-08–10](../../.context/PITFALLS.md#ap-08--guard-chỉ-tồn-tại-ở-copyroot-paste-và-descendants-đi-vòng) và [repair plan057 §19–25](../../.context/planning/057_FUTURE_CANDIDATE_BLOCK_CONTENT_COPY_PASTE.md#19-review-repair-plan--2026-11-05-baseline-0a53a2d). Clipboard ingress/descendant guards bị bỏ sót, pure tests thiếu actual call path, styled-span policy bị đổi bằng test sai. Repair có source và11 mocked controller tests PASS; runtime/onsite chưa PASS.

| Pitfall | Triệu chứng | Layer sở hữu | Case |
|---|---|---|---|
| Swiper JS không kèm core CSS | Slider trắng / slide xếp dọc sau init | WordPress enqueue | [CASE-001](slider/001_SWIPER_JS_WITHOUT_CORE_CSS.md) |
| Viewport height chỉ `min-height` trên slide | Container đủ cao, ảnh nền không full height | Plugin CSS + Swiper chain | [CASE-002](slider/002_VIEWPORT_BELOW_HEADER_IMAGE_NOT_FULL_HEIGHT.md) |
| Nhầm `text-align` với block center | Canh giữa trong editor, frontend vẫn lệch trái | Plugin CSS (hero preset) | [CASE-003](slider/003_HERO_TEXT_ALIGN_VS_BLOCK_CENTER.md) |
| Agent đọc code, không đo geometry | Fix “đúng spec” nhưng UI vẫn sai | Workflow / QA | § Agent anti-patterns |
| Tắt appender WP, custom nút trong frontend overlay | Add slide không click được; picker trúng `core/buttons` trong slide | Plugin editor + CSS | [CASE-004](slider/004_SLIDER_EDITOR_ADD_SLIDE_HIT_TEST_FAILURE.md) |
| `useSelect` return object mới mỗi keystroke | IME lag, caret nhảy `triênr→tr→triển` khi gõ slide heading | Plugin `slide/edit.tsx` | [CASE-005](slider/005_SLIDER_EDITOR_IME_TYPING_RERENDER_CASCADE.md) |
| Editor preview arrow reuse Swiper hook + CSS yếu | Circle “rỗng”, chevron xanh to/lệch; `aria-controls` trên preview button | Plugin editor CSS + `view.ts` selector | [CASE-006](slider/006_SLIDER_EDITOR_ARROW_PREVIEW_CSS_CASCADE.md) |
| CSS vars build nhưng không emit define rule | Có `<style>` + `var(--x, inherit)`; hover không đổi; `--x` rỗng trên wrapper | PHP render_block adapter | [CASE-007](core-control/007_BUTTON_HOVER_CSS_VARS_BUILT_NOT_EMITTED.md) |
| CSS frame extract sang file chưa enqueue | Root class/label hiện nhưng mất khung và màu nền | Editor asset graph + agent verification | [CASE-008](gutenberg/008_EDITOR_FRAME_CSS_EXTRACTED_NOT_ENQUEUED.md) |
| Hero editor sửa một rule chiều cao | Stage Hero vẫn thấp sau khi đổi 356px hoặc 480px | `assets/css/slider-editor.css` thắng `style.css` | Pitfall 9, [AP-14](../../.context/PITFALLS.md#ap-14--sửa-chiều-cao-hero-editor-ở-rule-thua-cascade) |
| Slider đổi size sau fade load/chuyển trang | Khung và tỉ lệ nhích khi fade xong | Offset CSS `5rem` rồi JS ghi header + admin bar; scrollbar | Pitfall 10 |
| Marine Blocks không có trong sidebar editor | Page / SKVN Page Display / GeneratePress còn; Preferences → Panels chỉ WindPress | `wp_localize_script` ép boolean thành `"1"` | Pitfall 11, [DP-10](../../.context/PITFALLS.md#dp-10--wp_localize_script-biến-boolean-thành-1-sidebar-marine-blocks-không-mount-2026-11-14) |

---

## Pitfall 1 — Swiper runtime thiếu core CSS

> Xem thêm Pitfall 8 / CASE-008 cho CSS có output nhưng không thuộc stylesheet editor đã đăng ký.

**Triệu chứng:** Trước init thấy slide; sau init slider trắng hoặc slide xếp dọc.

**Nguyên nhân:** `view.ts.js` chạy nhưng `view.ts.css` (Swiper core) không được enqueue.

**Cách tránh:**

- Verify slider như **asset graph** (JS + Swiper CSS + SKVN CSS), không chỉ một file.
- Regression: `tests/slider-block.test.mjs` assert `build/view.ts.css` trong PHP bootstrap.

**Không làm:** Tăng opacity, retry Swiper init, hoặc che bằng `overflow: hidden` khi chưa có geometry đúng.

---

## Pitfall 2 — `Viewport below header` + ảnh không full height

**Triệu chứng:** Slider cao đúng viewport dưới header, nhưng `object-fit: cover` chỉ phủ một dải mỏng (theo chiều cao content).

**State Delta:**

```text
State A (ổn hơn):  Preset Medium/Tall — min-height cố định, gap nhỏ
State B (lỗi):      Viewport below header — min-height rất lớn (100dvh)
Delta:              Swiper .swiper-slide { height: 100% } cần parent có height xác định
```

**Nguyên nhân:** Chỉ set `min-height` trên `.skvn-slide`. Swiper wrapper/slide dùng `height: 100%` trong khi `.skvn-slider` không có `height` explicit → media absolute (`inset: 0`) fill theo box thực tế nhỏ hơn.

**Cách tránh:**

1. Viewport preset **own height** trên `.skvn-slider`, propagate `height: 100%` xuống wrapper + slide + `__media`.
2. Sau Swiper init, gọi lại `syncViewportHeight()` + `updateSize()` khi offset header/admin bar đổi.
3. **Đo geometry**, không chỉ đọc CSS:

```javascript
const slide = document.querySelector('.skvn-slide');
const media = slide?.querySelector('.skvn-slide__media');
const img = slide?.querySelector('.skvn-slide__background-image');
console.table({
  slide: slide?.getBoundingClientRect().height,
  media: media?.getBoundingClientRect().height,
  image: img?.getBoundingClientRect().height,
});
```

**PASS:** Ba giá trị gần bằng nhau và ≈ `innerHeight - headerOffset`.

**Acceptance tách biệt:**

- [ ] Container fill viewport below header
- [ ] Background media fill **100% computed slide box** (sau Swiper init)

**Không làm:** Chỉ thêm `min-height` lớn hơn mà không sửa height chain.

---

## Pitfall 3 — Hero “canh giữa” nhưng copy vẫn lệch trái

**Triệu chứng:** Editor set alignment Center; frontend copy block nằm lệch trái so với slide.

**Hai tầng alignment (không trộn):**

| Tầng | Cơ chế Gutenberg/CSS | Điều khiển gì |
|---|---|---|
| Glyph | `has-text-align-center` → `text-align: center` | Chữ trong block |
| Block | `margin-inline: auto`, `align-items: center` | Vị trí cột copy trong slide |

**Nguyên nhân:** Hero preset có `max-width: 48rem` + `align-items: flex-start` trên flex slide, **không** có `margin-inline: auto` trên children → cột 48rem dính trái. `text-align: center` chỉ canh chữ trong cột đó.

**Cách tránh:**

1. Hero copy column: `margin-inline: auto` trên `.skvn-slide__content > *`.
2. Slide flex: `align-items: center` (không `flex-start`) khi layout mặc định là hero center.
3. Tôn trọng override editor: `has-text-align-left/right`, `is-content-justification-left/right` trên `.wp-block-buttons`.
4. Verify optical center:

```javascript
const slide = document.querySelector('.skvn-slide');
const heading = slide?.querySelector('.wp-block-heading');
const slideCenter = slide.getBoundingClientRect().left + slide.offsetWidth / 2;
const blockCenter = heading.getBoundingClientRect().left + heading.offsetWidth / 2;
console.log('offset from slide center (px):', Math.round(blockCenter - slideCenter));
```

**PASS:** `|offset| < 8px` khi user chọn center.

**Không làm:** Chỉ thêm `text-align: center` khi bug là **block position**, không phải glyph alignment.

---

## Pitfall 4 — Custom editor chrome reuse frontend overlay

**Triệu chứng:** Nút “Add slide” có `onClick` trong source nhưng không thêm slide; DevTools
picker trúng `core/buttons` (“Explore solutions”) thay vì `button.skvn-slider__add-slide`.

**State Delta:**

```text
State A: Click Add slide → insertBlock('skvn-marine/slide')
State B: Click vùng user nghĩ là Add slide → hit slide InnerBlocks
Delta: renderAppender={() => null} + nút trong .skvn-slider__controls (frontend overlay)
```

**Nguyên nhân:** Agent thay appender Gutenberg vì “khó thấy” nhưng không tách editor toolbar
và không verify hit-target. `pointer-events: auto` trên nút **không đủ** nếu pixel click
không thuộc nút.

**Cách tránh:**

1. Đọc `docs/decisions/gutenberg-editor-chrome-contract.md` trước khi sửa editor slider.
2. Giữ `ButtonBlockAppender` hoặc appender mặc định — custom nút chỉ là shortcut.
3. Class editor riêng (`.skvn-slider__editor-toolbar`), không reuse `.skvn-slider__controls`.
4. **Bắt buộc:** Ctrl+Shift+C click label control → đúng node trước khi merge.

**Không làm:** `renderAppender={() => null}` + một Button trong shell frontend overlay.

---

## Pitfall 5 — `useSelect` unstable object khi user đang gõ

**Triệu chứng:** Gõ heading trong slide lag; IME caret nhảy giữa composition phases.

**Nguyên nhân:** `slide/edit.tsx` `useSelect` return `{ clientId, preset }` mới mỗi store
tick → mọi slide re-render mỗi keystroke.

**Cách tránh:**

1. Dùng `usesContext` / `providesContext` cho `preset` (đã khai báo trong `block.json`).
2. `useSelect` chỉ trả primitive; không return object/array literal.
3. `React.memo()` + tách preview ảnh nền khỏi typing path.

**Verify:** React Highlight updates — chỉ slide đang edit flash, không cả stack.

---

## Pitfall 6 — Editor arrow preview: CSS cascade + Swiper hook class

**Triệu chứng:** Thumbnail/preview arrow trong editor: vòng tròn mỏng, chevron xanh
to và lệch; có thể thấy `aria-controls="swiper-wrapper-…"` trên preview button.

**State Delta (đã PROVEN bằng DevTools):**

```text
Spec SKVN:     padding 0 · color #fff · glyph 1rem · fill navy
Computed thực: padding 10px 20px · color rgb(0,122,255) · width/height 44px
Visual:        fill gần nền preview #073b5a → chỉ thấy viền
Geometry:      44px box − 40px padding ngang → glyph ::after bị ép/tràn
```

**Nguyên nhân (3 lớp, không đoán một mình):**

1. `.editor-styles-wrapper button` thắng `.skvn-slider__arrow { padding: 0 }`.
2. Swiper theme color thắng `color: #fff` (stylesheet load sau / cùng specificity).
3. Preview bar và fill circle cùng tông navy → camouflage.
4. (Bonus) Class `swiper-button-prev` trên editor preview → `view.ts` có thể bind Swiper.

**Cách tránh:**

1. Đọc `docs/decisions/gutenberg-editor-chrome-contract.md` §2.5–§2.6 và
   `docs/decisions/slider-editor-arrow-preview-1.3.6.md` (CASE-006 chi tiết).
2. Editor preview **không** dùng hook selector runtime (`swiper-button-*`) trừ khi
   đã guard `view.ts` skip `.skvn-slider--editor`.
3. CSS editor control: specificity ≥ `.editor-styles-wrapper button`; verify computed
   trong iframe, không chỉ frontend.
4. Preview contrast: fill/viền/glyph phải đọc được trên `#073b5a`.
5. Geometry check: `padding === 0` trước khi đóng task visual.

**Không làm:** Chỉ chỉnh `font-size` glyph khi computed `padding` vẫn là `10px 20px`.

---

## Pitfall 7 — CSS custom properties: build array ≠ emit define rule

**Triệu chứng:** Frontend có scoped `<style>` và rule `:hover` dùng
`var(--token, inherit)`, nhưng hover không đổi màu; `getComputedStyle(wrapper)`
trả `--token` rỗng.

**State Delta:**

```text
State A (editor):  wrapperStyle / inline style define --token trên element
State B (frontend): PHP chỉ emit :hover { color: var(--token, inherit) }
Delta:             thiếu selector { --token: <value> } trên cùng scope class
```

**Nguyên nhân:** Code populate `$css_vars` / mảng token nhưng `sprintf()` /
string build chỉ ghi consumer rules. `var(..., inherit)` vẫn là CSS hợp lệ →
bug im lặng.

**Cách tránh:**

1. Mọi scoped inline style từ PHP phải có **hai lớp**: define vars trên scope,
   consume trong `:hover` / `:focus-visible`.
2. View-source proof: tìm cả `--skvn-*:` assignment **và** `var(--skvn-*)`
   reference.
3. DevTools: `getPropertyValue('--token')` trên wrapper trước khi close task.
4. Regression assert trong test đọc source PHP (CASE-007).

**Không làm:** Coi “đã có `<style>` block” hoặc “attrs đã sanitize” là đủ; không
debug thêm khi thiếu define rule.

---

## Agent anti-patterns (vì sao lỗi “ngớ ngẩn” lặp lại)

### 1. Đọc rule local, bỏ qua integration contract

Markup layer (`__media`, `__content`) đúng spec 1.3.0 **không đủ** nếu thiếu contract với Swiper (`height: 100%` chain) hoặc hero flex alignment.

**Tránh:** Trước khi close task layout, liệt kê **owners**: Gutenberg → PHP render → plugin CSS → Swiper JS → theme canvas.

### 2. Pattern-match từ preset khác

`min-height` hoạt động “ổn” với Medium/Tall **không chứng minh** hoạt động với `100dvh` + Swiper init.

**Tránh:** State Delta phải ghi **preset / mode** gây lỗi, không chỉ “slider sai”.

### 3. Nhầm editor state với visual state

`has-text-align-center` trong block attributes ≠ block nằm giữa hero frame.

**Tránh:** Hỏi “center **chữ** hay center **cột**?” khi task liên quan hero/marketing copy.

### 4. Không có measurement loop

Agent không có retina; code “trông đúng” dễ được coi là done.

**Tránh:** Mọi layout fix phải kèm **một lệnh DevTools** hoặc checklist onsite trong `docs/testing/`; human gửi evidence trước khi archive case.

### 5. Acceptance mơ hồ

“Slider fills viewport” dễ pass khi chỉ container cao đúng, ảnh vẫn hở.

**Tránh:** Tách criteria: container geometry vs media fill vs copy alignment.

### 6. Sửa sớm trước State Delta

Nhảy vào `!important`, `overflow: hidden`, hoặc tăng `min-height` khi chưa isolate layer.

**Tránh:** Bắt buộc ISOLATE → DIFF → PROVE (ui-debug skill) cho mọi UI bug.

### 7. “Có onClick là xong” (editor chrome)

Thấy `<Button onClick={addSlide}>` trong `edit.tsx` coi là đủ — không chạy picker,
không giữ appender Gutenberg.

**Tránh:** Hit-target proof + `gutenberg-editor-chrome-contract.md` (CASE-004).

### 8. Subscribe store trên toàn slider khi user gõ

`useSelect` walk parent / return object trong block có RichText con.

**Tránh:** Context + memo (CASE-005).

---

## Checklist agent — trước khi submit slider layout fix

```text
[ ] Đã xác định State A (đúng) và State B (sai) + Delta
[ ] Đã kiểm tra Swiper asset graph (CASE-001) nếu chạm view.ts / enqueue
[ ] Viewport preset: height chain trên .skvn-slider, không chỉ min-height slide
[ ] Hero alignment: block center (margin/flex) tách khỏi text-align
[ ] Đã đưa lệnh getBoundingClientRect() cho human verify
[ ] Regression guard trong tests/slider-block.test.mjs nếu thêm rule mới
[ ] Không dùng overflow-x/100vw để che geometry (css-layout-safety-contract)
```

## Checklist agent — trước khi submit slider **editor** fix

```text
[ ] Đã đọc gutenberg-editor-chrome-contract.md
[ ] Không tắt InnerBlocks appender mà không có replacement đã picker-verify
[ ] Editor toolbar tách class khỏi frontend .skvn-slider__controls
[ ] useSelect không return object literal; preset qua context nếu có
[ ] IME typing: Highlight updates không flash cả slide stack
[ ] CASE-004 / CASE-005 verification steps nếu chạm add-slide hoặc slide/edit.tsx
[ ] Hero stage: đừng sửa riêng 356px hoặc riêng max-height 480px. Pitfall 9. Rail list giữ 356px
```

---

## Regression guards hiện có

| Guard | File |
|---|---|
| Swiper core CSS enqueue | `tests/slider-block.test.mjs`, `skvn-marine-blocks.php` |
| Viewport height chain | `tests/slider-block.test.mjs` → `style.css`, `view.ts` |
| Hero block centering | `tests/slider-block.test.mjs` → `style.css` |
| Button hover CSS var define + consume | `tests/core-control-button-hover.test.mjs` → `button-hover.php` |

Sau `npm run build`, human onsite verify để promote case sang `ONSITE_VERIFIED`.

---

## Pitfall 8 — Root frame có class nhưng CSS bị extract sang file chưa enqueue

**Xảy ra 2026-11-05:** di chuyển khung preview Product Carousel ra root, gỡ màu/viền body; shared CSS lại xuất thành `index.ts.css` trong khi WordPress chỉ đăng ký `style-index.ts.css`. Human thấy mất cả khung và nền đã duyệt. Source correction `c70c4ce`; onsite visual vẫn chưa xác nhận. Chi tiết/evidence: [CASE-008](gutenberg/008_EDITOR_FRAME_CSS_EXTRACTED_NOT_ENQUEUED.md).

**Lỗi agent:** thực hiện phần bỏ style cũ nhưng không hoàn tất/verify đường replacement; kiểm syntax và VM spacing rồi báo triển khai quá sớm. Không thể dùng “đã có source” hoặc “human chưa test” để biện minh cho integration gap.

**Tránh:** kiểm đầy đủ DOM class → selector → import → build output thực tế → registered/enqueued handle → editor document/iframe → matched/computed style. Search đúng file CSS được đăng ký, không chỉ thấy selector ở một nơi bất kỳ trong build. Chuyển owner phải atomic, không xóa cơ chế cũ khi replacement chưa nối đủ; runtime evidence chưa có thì ghi đúng giới hạn. Không đoán cache hoặc thêm `!important` khi chưa biết CSS có được tải không. Existing parse/VM tests không phải asset-loading regression guard.

---

## Pitfall 9 — Agent không nâng stage Hero editor

**Xảy ra 2026-11-13.** Human gửi ảnh Slider Editor: heading Hero, paragraph và nút nằm sát trong stage. Yêu cầu tăng chiều cao, thảo luận trước. Không thấy log một lượt sửa mỗi một rule rồi thất bại.

Agent trước không làm được vì nhiệm vụ đang mở là bám Concept01. Plan 062/063 khóa sàn `356px` và đòi human duyệt trước khi đổi tỷ lệ. “Content được cao hơn, không cắt” đọc như ô thấp đã đúng. DP-05 thì ghi lần đặt `max-height: 480px` lên wrapper đã làm vỡ cả editor, và cách sửa là giữ trần trên slide. Lần này làm được sau khi human chọn phương án A, tức delta mà plan đang đòi. CSS chỉ là bước sau quyết định đó.

**Cơ chế nếu đã quyết nâng mà sửa nhầm file:**

- `assets/css/slider-editor.css`: `.skvn-slider.skvn-slider--editor-focus .skvn-slide--editor` có `min-height: 356px`. Đây là sàn stage ngắn của Concept01, specificity 0,3,0. File này enqueue handle `skvn-marine-slider-editor`, phụ thuộc `style-view`, version `filemtime`.
- `src/slider/style.css`: `.skvn-slide--hero-max-height` có `max-height: 480px` và `min-height: 0`. Class chỉ thêm trong `slide/edit.tsx` khi preset là Hero. Specificity 0,1,0.

Sửa `480px` trong `style.css` không nâng stage: rule 356px vẫn thắng `min-height`. Nâng 356px lên 36rem mà không gỡ trần trên selector mạnh hơn thì `max-height: 480px` vẫn kẹp hộp. Frontend `.skvn-slider--hero .skvn-slide` dùng `clamp(30rem, 68vh, 48rem)` nhưng thua rule editor.

**Human chọn A.** Chỉ Hero trong editor: `min-height: 36rem`, `max-height: none`, selector `.skvn-slider.skvn-slider--editor-focus .skvn-slide--editor.skvn-slide--hero-max-height`. Danh sách slide giữ `max-height: 356px`. Slide không phải Hero giữ sàn 356px. Không đổi frontend.

**Tránh:** Khi stage editor thấp, đo computed `min-height` và `max-height` trên `.skvn-slide--editor`, rồi tìm cả hai file. Rule mới phải thắng cả sàn 356px và trần 480px. Đừng kéo rail lên theo stage. Đừng dùng `68vh` trong post editor.

**Chưa đo lại.** Source có. Human reload editor và đo chiều cao ô xanh khoảng 576px.

## Pitfall 10 — Slider đổi size nhẹ sau fade load đầu

**Xảy ra 2026-11-13.** Human: chuyển loading sang trang còn gượng; fade xong slider đổi size và tỉ lệ nhẹ. Đo sau khi trang đã đứng yên, đang đăng nhập:

```text
w 1903, h 407, ratio 4.676, initialized true, offset 120px, inlineH rỗng, scrollbar 17
```

**Human 2026-11-13:** phần nhảy lớn khi đăng nhập là admin bar; lần load đầu vẫn nhích nhẹ; tạm bỏ qua, không sửa trong mốc này.

**State delta:**

```text
State A: trong fade — ảnh chụp View Transition, offset CSS fallback 5rem (80px)
State B: fade xong — trang thật, offset JS 120px, scrollbar 17px
Delta:   cao hơn khoảng 40px trong ảnh chụp; rộng hơn 17px
```

Chiều cao settled là `100dvh − 120px = 407`, nên viewport lúc đo khoảng 527px (cửa sổ thấp hoặc DevTools mở). `inlineH` rỗng: Swiper không ghi pixel height. Class preset là `viewport-below-header`. `view.ts` `syncViewportHeight()` chỉ chạy với preset này: đo `#masthead, .site-header` + `#wpadminbar`, ghi `--skvn-slider-viewport-offset`, rồi `updateSize()`.

Ba chẩn đoán, chỉ số 2 được số đo chốt:

1. Fade chuyển trang trong `inc/preloader.php` chỉ đổi `::view-transition-old(root)` và `::view-transition-new(root)`. `::view-transition-group(root)` vẫn nội suy width/height. Ảnh chụp được lấy trước khi script slider chạy. Plan 046 yêu cầu chỉ fade, không morph. Đây là cảm giác gượng.
2. Fallback trong `src/slider/style.css` là `var(--skvn-slider-viewport-offset, 5rem)`. Sau script thành `120px`. 120px = admin bar 32px (chỉ khi đăng nhập) + header khoảng 88px. Khách không có 32px đó. Phần header so với 80px còn khoảng 8px.
3. Scrollbar 17px xuất hiện khi ảnh chụp bị gỡ. Cao theo `dvh` gần như giữ, rộng giảm, `object-fit: cover` crop lại. Có với mọi người. Cùng kiểu trên overlay cũ: `html.skvn-preloading { overflow: hidden }` trong `inc/preloader.php`, class bị gỡ lúc fade overlay kết thúc.

**Nếu sửa sau:** giữ hộp settled (offset thật, kể cả admin bar khi có). Đưa offset cuối vào trước ảnh chụp: cao header đã biết cộng `html.admin-bar` 32px, thay cho đoán `5rem`. Ổn scrollbar (`scrollbar-gutter: stable`) để rộng không đổi lúc fade xong. Tắt morph của `::view-transition-group(root)` nếu muốn fade không kéo size. Đừng gỡ admin bar khỏi phép đo — 120px là chiều cao đúng khi đang đăng nhập.

**Đừng làm:** coi Swiper inline height là thủ phạm khi `style.height` trống. Đừng sửa preset Hero `clamp(30rem, 68vh, 48rem)` cho case này; rule viewport (0,3,0) thắng rule Hero (0,2,0).

## Pitfall 11 — Sidebar Marine Blocks không mount vì boolean thành `"1"`

**Xảy ra 2026-11-14.** Human mở page editor, không thấy Marine Blocks. Preferences → Panels chỉ có WindPress. Plugin đã build và upload.

**State delta:**

```text
State A (kỳ vọng): postEditor === true (boolean) → PluginSidebar mount
State B (lỗi):     postEditor === "1" (string) → DesignSidebar trả null
Delta:             wp_localize_script ép (string) true thành "1"
```

Chi tiết, consumer `woocommerceAvailable === false`, và fix: [DP-10](../../.context/PITFALLS.md#dp-10--wp_localize_script-biến-boolean-thành-1-sidebar-marine-blocks-không-mount-2026-11-14).

**Đừng làm:** đổ cho bundle cũ khi `skvnMarineDesign` đã có trên trang và lệch file chỉ khoảng trăm byte. Đừng tìm Marine Blocks trong Preferences → Panels. Đừng nới `=== true` thành truthy rồi giữ `wp_localize_script`.

## Related

- `.agents/skills/ui-debug/SKILL.md` — State Delta framework
- `docs/standards/css-layout-safety-contract.md` — width/overflow owners
- `docs/decisions/slider-completion-spec-1.3.0.md` — layer contract markup
- `docs/decisions/gutenberg-editor-chrome-contract.md` — editor chrome vs frontend overlay
- `docs/testing/onsite-slider-motion-1.3.2.md` — viewport below header QA steps
