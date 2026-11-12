# PITFALLS.md — SKVN Marine

> Bộ sưu tập lỗi thực tế đã xảy ra trong quá trình phát triển.
> Mục đích: agent và dev đều đọc trước khi làm việc liên quan để tránh lặp lại.
> Không xóa entry — chỉ thêm `Fixed:` khi đã có giải pháp kiến trúc lâu dài.

---

## Agent Pitfalls (lỗi quy trình của AI agent)



### AP-13 — Kiểm DOM sau compile rồi bỏ sót CSS cache của first response

- **Case2026-11-09:** header Home đẹp sau tải nhưng co/thiếu lúc đầu trên desktop. Agent trước đó chỉ xem computed DOM sau WindPress compiler:27212ký tự CSS có menu. Raw HTML thực trả cache21218ký tự, thiếu companion và utilities header; VFS `/mhf-header.css` đã mới.
- **Rule:** với lỗi first-load, so raw response/CSS cache với settled DOM; file đã Save hoặc style ID có chữ cached không chứng minh response cache đã chứa source mới. Browser compiler có thể bổ sung/ghi đè style cùng ID.
- **Repair direction:** Generate CSS Cache từ nguồn mới, purge HTML/CDN và kiểm cold paint; không đoán chung là browser cache, không thêm preloader/delay để che. `cache_dir:[]` của public metadata không tự là evidence cache thiếu.
- **Evidence:** runbook `docs/testing/mega-menu-gutenberg-tailwind-prototype.md` MM-LOAD01–03, raw/JSON ở `.local/header-first-load-2026-11-09*`; cache rebuild/first-paint runtime chưa được nghiệm thu.

### AP-12 — Giao prototype có JS nhưng không nối runtime đang dùng

- **Case2026-11-08:** agent giao Gutenberg markup/CSS/controller rời, rồi sửa CSS và nói cập nhật stylesheet. Human làm đúng nhưng Home390px vẫn cao246px, không hamburger vì controller chưa được nạp. CSS từng bọc `@layer components` cũng bị theme unlayered ghi đè; preview không có theme rules nên che lỗi.
- **Sai:** coi file tồn tại hoặc bản preview chạy là một tính năng đã dùng được trong WordPress; lặp lại yêu cầu human tự ghép assets sau khi đã chốt mobile drawer.
- **Đúng:** nối markup → stylesheet → runtime enqueue → breakpoint/interaction. Chỉ rõ source/deploy/runtime evidence riêng; kiểm script tags + toggle/dialog/ready state. Dùng shared runtime hiện có, không bị reveal/reduced-motion early return chặn menu. CSS companion phải chịu được theme cascade, preview dùng cùng source CSS.
- **Evidence/repair:** `docs/testing/mega-menu-gutenberg-tailwind-prototype.md`; shared animations.js + enqueue.php đã có source và9VM model testsPASS, PHP lint/deploy/native browser pending. Không nói onsite đã sửa chỉ vì source đã nối.

### AP-11 — Nâng toolbar đúng hàng nhưng dùng sai hệ cột

**Xảy ra:** 2026-11-07, hotfix archive heading plan059§11; human gửi screenshot result count bị đẩy vào giữa.
**Lỗi của agent:** Chỉ chuyển count/sort ngang H1 rồi dùng hai flex items co giãn độc lập; không ràng buộc heading row với sidebar/product tracks phía dưới. Requirement đúng hàng đã có nhưng implementation thiếu trục ngang của design. Đây là lỗi layout của agent, không phải cache hoặc human thiếu thông tin.
**Evidence:** Audit trang thật `https://minhhaifishery.com/product-category/grouper/`, logged-out, viewport1280×720: heading/sidebar x72.5; product/card x344.5; count x536.5, lệch +192px. Sorting/grid cùng right1192.5. Computed header `flex:1 1 224px`, toolbar `flex:1 1 448px`; body sidebar240px + gap32px. Source `wp-content/themes/skvn-marine/style.css`, selectors `.skvn-archive-heading-row` và `.skvn-archive-layout`. Plan059§12 giữ evidence/repair; §13 giữ UX mobile riêng.
**Tránh:** Với các hàng cần thẳng trục, dùng chung track sizing, gap, width owner và container breakpoint. Acceptance phải đo cả left/right delta giữa hàng heading/toolbar và body grid, không chỉ cùng hàng hoặc không overflow. Kiểm desktop, breakpoint±1px, narrow/title dài; baseline và horizontal alignment là hai điều kiện riêng. Không dùng offset/margin âm để bù một kết quả flex sai. Không coi source/model PASS là visual PASS.
**Fixed (source2026-11-07, chưa runtime PASS):** Human cho thực hiện059§12–13. Một outer grid chung sidebar240/gap32/container1120 cho header/nav/toolbar/results; bỏ flex-basis độc lập. PHP shell giữ native callbacks và một nav đúng mobile reading order; disclosure CSS-owned mode/focus/no-JS có5VM modelPASS. Chờ human lint/onsite geometry≤1CSSpx và native Woo/fallback; no-overflow cũ không làm alignment PASS.

### AP-08 — Guard chỉ tồn tại ở Copy/root, Paste và descendants đi vòng

**Xảy ra:** 2026-11-05, review Content Actions commit `0a53a2d`.
**Lỗi của coding agent:** Có helper kiểm bindings/limits và có permission check nhưng không nối vào mọi ingress/node: native clipboard Paste bỏ qua binding nguồn; buildPatches bỏ limits; descendant chỉ canEditBlock, thiếu mode/controlled ownership. Đây là lỗi thực hiện requirement đã có, không phải human thiếu spec hoặc runtime test chưa chạy.
**Evidence:** `src/core-controls/block-content/transport.ts:117–123`, `controller.ts:170–213`, `plan.ts:284–309` (plugin-relative, baseline trên). Review fixture bound paragraph vẫn trả content patch; Slide +201 paragraphs Copy=false nhưng Paste=true/201 patches. Local WP7.1 canEditBlock chỉ kiểm preview/lock.edit, không tổng hợp editing mode. Chi tiết [plan057 §19–24](planning/057_FUTURE_CANDIDATE_BLOCK_CONTENT_COPY_PASTE.md#19-review-repair-plan--2026-11-05-baseline-0a53a2d).
**Tránh:** Lập bảng mỗi invariant × ingress (Copy editor/native Copy/Paste) × root/ancestor/descendant × trước/sau await. Validate raw metadata trước projection loại bỏ nó; một owner limits áp cả planner/transport. Guard quyền phải dùng đúng semantic selectors ở từng node, kiểm lại ngay trước mutation. Test forbidden payload qua production controller/transport và assert zero writes, không chỉ gọi helper đúng input.
**Fixed:** Human start repair2026-11-05; validation raw ingress/planner và guard root/ancestor/descendant đã có source (`validation.ts`, `editor-guard.ts`); controller tests11/11 PASS phạm vi mocked WP APIs. Model rerun/onsite chưa PASS; plan057§25 giữ baseline evidence và giới hạn.

### AP-09 — Test xanh vì không đi qua đường thực thi có lỗi

**Xảy ra:** Cùng review `0a53a2d`; 16 pure tests trước đó không bao phủ transport/controller. Test limit chỉ đi Copy nên không phát hiện Paste bỏ limits; bindings/ownership không đi qua actual ingress.
**Lỗi của agent:** Dừng self-review ở các module riêng, thiếu đối chiếu end-to-end source path. Report đã trung thực chưa runtime PASS, nhưng ghi P5 source xong khi invariant ở source vẫn chưa đủ. Thiếu runtime evidence không giải thích được lỗi integration có thể phát hiện bằng source/call-path tests.
**Tránh:** Với mỗi guard, phải có test gọi entry point thật mà user dùng, bắt guard fail và assert không mutation/lookup ngoài ý muốn. Tách pure model, mocked controller, actual parser/serializer và onsite/history evidence. Không dùng số tests hoặc transpile syntax làm bằng chứng coverage. Ghi riêng tool `spawn EPERM` và không gọi đó là product test FAIL/PASS.
**Fixed:** Đã thêm `tools/tests/block-content-controller.test.mjs`,11/11 PASS trên production call path với store/clipboard/Gutenberg parser mocked, HTML parser JSDOM thật. Không thay actual parser/Undo/onsite evidence; model suite cần human chạy lại theo057§25.

### AP-10 — Đổi spec bằng cách viết test cho behavior sai; tự viết HTML sanitizer

**Xảy ra:** `fields.ts` trong `0a53a2d` reject mọi span, test cũng assert span phải reject, trong khi057§11.3 yêu cầu loại font/color presentation và giữ semantic content. HTML scanner/regex tự viết còn trái ràng buộc dùng public API đã audit.
**Hậu quả:** Nội dung Gutenberg thông thường có inline color/font không copy được; test xanh đang khóa lỗi vào implementation. Đây là sai policy của agent, không phải unsupported meaningful content được human đồng ý bỏ.
**Tránh:** Viết expected từ spec/fixture người dùng, không từ code vừa viết. Phân biệt span trình bày (unwrap, giữ text/semantic children) với construct có nghĩa không hỗ trợ (reject toàn thao tác). Audit public rich-text/HTML parser theo runtime, kiểm entity/link/escaping và actual serialize/parse; không regex strip HTML hoặc mutate registry toàn editor. Thiếu API evidence thì báo technical blocker, không âm thầm thu hẹp requirement.
**Fixed:** `inline-html.ts` thay scanner bằng public browser DOMParser + dựng cây allowlist mới; tests giữ styled span text/semantic/link và decoded URL, không source styles. Public browser API rationale/benign HTML canonicalization ghi057§25; actual Gutenberg round-trip và frontend chờ human, không coi tests mock là runtime PASS.

### AP-06 — Bỏ visual cũ trước khi chứng minh replacement được nạp

**Xảy ra:** 2026-11-05, chuyển khung Product Carousel từ body preview ra root để bao heading/intro (plan053).
**Triệu chứng:** Human thấy mất cả viền và nền đã duyệt; label/heading/card/query vẫn hiện.
**Lỗi của agent:** Tôi bỏ nền/viền body cũ khi replacement mới chỉ tồn tại trong source; không kiểm đầy đủ CSS extraction → registered handle → editor document/iframe. Tôi báo “đã triển khai khung” dựa trên syntax/VM tests mà chưa có bằng chứng giao diện. Thực tế sửa import ở commit sau, khiến replacement không atomic với việc bỏ cơ chế cũ. Đây là lỗi implementation/integration của agent, không phải human đổi ý hoặc thiếu thông tin.
**Evidence:** `b4dba14` đổi frame boundary; snapshot được lưu trong `05b9cef` có frame CSS ở `build/index.ts.css` trong khi bootstrap chỉ đăng ký `build/style-index.ts.css`. Source correction `c70c4ce`; [CASE-008](../docs/debug-casebook/gutenberg/008_EDITOR_FRAME_CSS_EXTRACTED_NOT_ENQUEUED.md).
**Tránh:** Chuyển visual owner phải nối replacement tới bundle/handle được nạp trong cùng thay đổi; kiểm output thực tế sau human build và computed style/rect trong editor. Syntax PASS/VM spacing PASS không chứng minh màu/viền xuất hiện. Nếu thiếu runtime evidence phải ghi “source có, visual chưa kiểm”, không nói khung đã hiển thị đúng hoặc coi đã nghiệm thu.
**Fixed:** Source import/extraction correction đã có; onsite visual chưa xác nhận. Không xóa entry vì đã sửa source.

### AP-07 — Đoán cache/deploy khi chưa có bằng chứng onsite

**Xảy ra:** 2026-11-05, human gửi screenshot khung preview bị mất.
**Nguy cơ đã nhận diện:** Có selector trong CSS local hoặc build local mới không chứng minh site đang nhận đúng asset, selector match DOM hay rule thắng cascade. Không quy lỗi cho cache hoặc yêu cầu human build/reload lặp lại rồi coi đó là diagnosis.
**Tránh:** Tách ba trạng thái: source defect đã chứng minh; local artifact đã kiểm; onsite delivery/computed chưa kiểm. Với UI lỗi, yêu cầu bằng chứng tối thiểu đúng layer: DOM class, stylesheet URL/version/Network và computed background/border/padding ở đúng editor document/iframe. Chỉ nói cache stale khi evidence chứng minh. Chỉ giao human bước cần thiết, kèm expected result; không đổ trách nhiệm kiểm integration cho human.
**Related:** CASE-008 và `docs/testing/editor-preview-frames-1.3.19.md`.

---

### AP-01 — Edit tool yêu cầu Read trước

**Xảy ra:** 2026-06-17, session sửa `.skvn-post-hero` trong `style.css`.
**Triệu chứng:** Agent gọi Edit tool mà chưa Read file → tool báo lỗi "file not read".
**Nguyên nhân:** Agent quên rằng Edit tool enforce điều kiện đọc trước khi viết.
**Tránh:** Với bất kỳ file nào chưa đọc trong session hiện tại, Read trước rồi mới Edit.

---

### AP-02 — Incomplete diff khi reorder JSX

**Xảy ra:** 2026-06-17, reorder `InspectorControls` và `<BlockEdit>` trong `button-hover/index.tsx`.
**Triệu chứng:** Edit đầu chỉ di chuyển opening tag của `InspectorControls` lên trước, nhưng quên di chuyển `<BlockEdit {...props} />` xuống sau → cấu trúc JSX sai, cần edit lần 2.
**Nguyên nhân:** Lên kế hoạch edit từng phần thay vì hình dung toàn bộ diff trước.
**Tránh:** Trước khi reorder code blocks, đọc lại toàn bộ hàm/component và viết mental diff hoàn chỉnh. Nếu cần 2+ edits trên cùng một block JSX, gộp lại thành 1 lần.

---

### AP-03 — Thêm property mà không kiểm tra existing display rule

**Xảy ra:** 2026-06-17, thêm `width: 100%` vào `.skvn-post-hero` trong `style.css`.
**Triệu chứng:** Agent sửa rule thành `display: block` (xóa mất `display: flex; align-items: flex-end`) khi chỉ cần thêm `width: 100%`. Phải sửa lại ngay.
**Nguyên nhân:** Khi thêm 1 property vào CSS rule, agent không giữ nguyên toàn bộ rule cũ mà vô tình overwrote.
**Tránh:** Khi thêm property vào CSS rule đã có, luôn copy toàn bộ rule cũ vào `old_string` và `new_string` — chỉ thêm dòng mới, không bao giờ xóa dòng cũ nếu không được yêu cầu.

---

### AP-04 — block.json attribute đặt ngoài khối `"attributes"` (lỗi JSON)

**Xảy ra:** 2026-10-21, session sửa `src/product-collection/block.json` và `build/product-collection/block.json` (gap CTA hover + chip màu).
**Triệu chứng:** `npm run build` thất bại:
```
Module parse failed: Cannot parse JSON: Unexpected non-whitespace character after JSON at position 4905
```
**Nguyên nhân:** Khi thêm attribute mới (`mediaLayout`, `mediaWidthPercent`, …, `mediaPaddingUnit`), các key bị đặt **ngoài** khối `"attributes"` — tức sau dấu `}` đóng `"attributes"`. JSON có hai cấp `"attributes"` cùng cấp → không hợp lệ → webpack parse thất bại.
**Cách phát hiện (trước khi build):**
```bash
node -e "JSON.parse(require('fs').readFileSync('wp-content/plugins/skvn-marine-blocks/src/product-collection/block.json','utf8')); console.log('JSON OK')"
```
Áp cả cho `build/product-collection/block.json`.
**Cách khắc phục:** Mở file `block.json`, tìm dấu `}` đóng khối `"attributes"`; đảm bảo mọi attribute mới nằm **trước** dấu đóng đó, cách nhau bởi dấu phẩy. Không để attribute nằm sau khối `"attributes"` hoặc sau `"supports"`; không trailing comma sau attribute cuối cùng.
**Check trước commit/build:** `src/*.block.json` và `build/*.block.json` phải parse JSON thành công. Nếu edit `src/block.json`, phải sync lại `build/block.json` trước khi onsite.

---

### AP-05 — PowerShell không hỗ trợ `&&`

**Xảy ra:** 2026-10-21, session commit nhiều nhóm file liên tiếp.
**Triệu chứng:** Lệnh `git add ... && git commit -m "..."` bị lỗi `The token '&&' is not a valid statement separator`.
**Tránh:** Chạy `git add` và `git commit` thành hai lệnh riêng biệt (không dùng `&&`).

---

## Dev / Code Pitfalls (lỗi kiến trúc và code)

### DP-01 — Block attribute thêm vào `block.json` + `edit.tsx` nhưng quên `save.tsx`

**File liên quan:** `src/slider/save.tsx`, `src/slider/block.json`, `src/slider/edit.tsx`
**Xảy ra:** 2026-06-17, attribute `heightPreset` tồn tại trong block.json và edit.tsx type/className, nhưng `save.tsx` có `SliderAttributes` type riêng (maintained manually) không bao gồm `heightPreset`.
**Hậu quả:**
- Frontend HTML không bao giờ nhận class `skvn-slider--height-viewport-below-header`
- CSS height rule không áp dụng
- `view.ts` đọc `heightPreset` từ `data-skvn-slider` JSON nhưng JSON cũng thiếu field này → luôn fallback về `'default'`
- `syncViewportHeight()` bị skip hoàn toàn

**Pattern gốc:** `save.tsx` dùng type riêng thay vì import từ shared types, nên diverge khỏi `edit.tsx`.

**Checklist khi thêm attribute mới vào block:**
1. `block.json` — thêm attribute definition
2. `edit.tsx` — thêm vào type + control UI
3. `save.tsx` — thêm vào type + className/markup/data-attribute (check từng output)
4. Nếu dynamic block → PHP render: thêm vào `$classes` hay attribute truyền xuống view
5. `view.ts` (nếu có) — verify attribute được đọc từ `data-*` JSON

---

### DP-02 — Block attribute maps to CSS class nhưng PHP render không thêm class

**File liên quan:** `modules/collection-render/product-collection.php`, `modules/collection-render/post-collection.php`, `src/collection/style.css`
**Xảy ra:** 2026-06-17, attribute `imageRatio` định nghĩa trong block.json (`default: "4:3"`), CSS có đầy đủ rules `.skvn-collection--ratio-4-3`, `.skvn-collection--ratio-3-2`... nhưng PHP render không bao giờ thêm `skvn-collection--ratio-{value}` vào `$classes`.
**Hậu quả:** User thay đổi ratio trong editor → không có tác dụng gì trên frontend.

**Fixed:** 2026-06-18 — Thêm `$ratio = 'skvn-collection--ratio-' . str_replace( ':', '-', $attributes['imageRatio'] )` vào cả 2 PHP render files và include trong `array_filter( $classes )`.

**Pattern gốc:** CSS rules được viết sẵn cho feature chưa được wire đầy đủ.

**Checklist cho dynamic block (PHP render):**
- Mỗi attribute ảnh hưởng đến appearance phải có đường đi rõ ràng: `$attributes[key]` → `$classes[]` hoặc inline style hoặc data attribute
- Sau khi thêm CSS class rule mới, grep PHP render để confirm class đó được emit

---

### DP-03 — CSS scope sai: component property đặt ở `body` level

**File liên quan:** `wp-content/themes/skvn-marine/style.css`
**Xảy ra:** 2026-06-17, rule `body.skvn-has-footer-page { background: var(--skvn-footer-bg); }` paint toàn bộ `<body>` bằng màu footer.
**Hậu quả:** Mọi trang có footer page đều có nền navy — content area, sidebar, header background đều bị ảnh hưởng.
**Fix:** Xóa rule này. Footer element tự có `background` riêng qua `.skvn-footer-page` và `.skvn-site-footer`.

**Rule chung:** `body.skvn-*` class chỉ nên set CSS custom properties (variables) hoặc layout properties ảnh hưởng toàn trang (overflow, scroll behavior). Không set `background`, `color`, hay visual properties thuộc về component con.

---

### DP-04 — Carousel arrows đặt ngoài `overflow: hidden` container

**File liên quan:** `src/collection/style.css`, `modules/collection-render/cards.php`
**Xảy ra:** Phát hiện 2026-06-17 trong code review.
**Triệu chứng:** `.skvn-collection__arrow--prev { left: -1.25rem; }` và `--next { right: -1.25rem; }` đặt arrows ra ngoài container, nhưng `.skvn-collection__carousel` có `overflow: hidden` (Swiper yêu cầu) → arrows bị clip, không bao giờ hiển thị.

**Fixed:** 2026-06-18 — Thêm outer wrapper `.skvn-collection__carousel-outer` (position: relative, no overflow: hidden). Arrows và `data-skvn-collection-carousel` chuyển sang outer wrapper. Swiper init (`new Swiper(swiperEl, ...)`) chỉ target inner `.skvn-collection__carousel`. Arrows được outer wrapper contain → không bị clip.

**Rule chung:** Trước khi position element ra ngoài container (negative inset, `transform: translate` ra ngoài bounds), kiểm tra `overflow` của container và mọi ancestor. Swiper wrapper luôn cần `overflow: hidden` → arrows phải nằm ngoài wrapper div, hoặc dùng padding + negative margin trick trên parent.

### DP-05 — Class CSS editor gán vào wrapper ngoài cùng thay vì element mục tiêu

**File liên quan:** `src/slider/edit.tsx`, `src/slide/edit.tsx`

**Xảy ra:** Class `skvn-slide--hero-max-height` (và tương tự các class layout/size) được thêm vào `blockProps.className` của wrapper ngoài cùng (`.skvn-slider--editor-focus`) trong `slider/edit.tsx`, thay vì gán vào element slide (`.skvn-slide--editor`) trong `slide/edit.tsx`.

**Hậu quả:** Rule CSS `max-height` + `overflow: hidden` áp lên toàn bộ container slider (bao gồm rail, stage, footer, navigation preview…), không chỉ slide. Làm hỏng layout editor và đẩy các block khác trong block list xuống dưới.

**Pattern gốc:** `blockProps` của block cha chứa toàn bộ editor chrome. Class dùng cho element con phải được gán vào `blockProps` của chính element đó, không phải wrapper block cha.

**Checklist khi thêm class layout/size cho block trong editor:**
1. Xác định chính xác element nào nhận rule CSS (wrapper hay element con).
2. Nếu class dùng cho slide/element con, gán vào `blockProps` của element đó, không phải wrapper block cha.
3. Kiểm tra trong editor DevTools xem class xuất hiện trên element đúng, không lan sang các element cha.
4. Rule `max-height`/`overflow` chỉ áp trên element slide, không áp lên container block.

### DP-06 — React Error #130 (`args[]=undefined`) khi mở Category Grid Details: tên component không tồn tại trong runtime `wp.components` [CORRECTED 2026-11-10]

**File liên quan:** `src/product-category-grid/design.tsx`, `build/index.ts.js`, `wp-includes/js/dist/components.js` (WP runtime)

**Xảy ra:** 2026-11-10 — sau khi P2 thêm `ToggleGroupControl`/`ToggleGroupControlOption` vào Details group, mở Details trong design sidebar → `Minified React error #130; args[]=undefined`. Editor crash khi mở Details; frontend không ảnh hưởng (render path editor-only).

#### Root cause đúng (verify bằng runtime dist)

React #130 = **JSX element type `undefined`** — lỗi đến từ định danh component trong JSX, không bao giờ từ giá trị prop.

1. `design.tsx` import tên plain (`ToggleGroupControl`, `ToggleGroupControlOption`) — npm typings v34 đã ổn định tên này nên build pass.
2. `dependency-extraction-webpack-plugin` externalize `@wordpress/components` → `wp.components` (bundle chỉ chứa property access, không kèm code component).
3. Core dist WP 7.1 chỉ export `__experimentalToggleGroupControl`, `__experimentalToggleGroupControlOption`, `__experimentalToggleGroupControlOptionIcon` — **không có tên plain**.
4. Runtime `wp.components.ToggleGroupControlOption` = `undefined` → `<ToggleGroupControl />` render ở `design.tsx:243` khi mở Details → #130.

Bằng chứng: grep export map trong `wp-includes/js/dist/components.js` (WP 7.1 local, cùng major production 7.1.4); `build/index.ts.js` có đúng 1 property access `ToggleGroupControlOption`; crash chỉ xảy ra ở render path duy nhất dùng identifier đó (Details group).

#### Fix — human xác nhận Option B (2026-11-10)

Thay bằng `BaseControl` + `ButtonGroup` + `Button` (`isPressed`, `icon`, `label` + `showTooltip`, `variant="secondary"`, `disabled` theo `showDescription`) — API stable nhiều năm, precedent sẵn trong `slider/edit.tsx:316-331`. Behavior giữ nguyên: help khi description off, prior value kept, tooltip 4 icon. Delta so §3.2 plan061 (spec `ToggleGroupControl`) đã human duyệt — ledger plan061 2026-11-10. Không bundle `@wordpress/components`.

Option A (dùng tên `__experimental*`) bị loại vì để lại technical debt: tên experimental có thể bị xóa khi core lật sang tên plain → crash #130 tái phát sau một core update, không automated test nào bắt được.

**Trạng thái: human xác nhận onsite 2026-11-11 — build/deploy xong, "các setting đã ổn", crash #130 không còn ở Details.** Code P1+P2+fix+P3 (reset keys, 2026-11-11) vẫn uncommitted (câu "đã fix và commit vào codebase" ở cuối bản ghi cũ là sai — chưa commit tới thời điểm này).

#### Checklist tránh lặp lại

1. Import từ `@wordpress/components`: verify tên export tồn tại trong `wp-includes/js/dist/components.js` của core runtime đang target — build-time typings ≠ runtime dist.
2. Ưu tiên API stable; `__experimental*` chỉ dùng khi chấp nhận rủi ro core update và có kế hoạch fallback.
3. React #130 → debug bắt đầu bằng "định danh nào trong JSX nhánh này undefined", không phải "prop nào undefined".
4. Không bundle `@wordpress/components` (nặng, trái convention).

#### Lần hai — `NumberControl` (cùng pattern, 2026-11-11)

Production report: Action group crash #130 khi chọn Custom width / Custom corners (rời Pill) / Custom spacing — đúng lúc `BoundedNumberControl` (conditional) render lần đầu. Verified bằng runtime dist với **lookbehind grep**: core WP 7.1 chỉ có `__experimentalNumberControl`, không có `NumberControl` plain (`NumberControl : 0`); `RangeControl`/`TextControl`/`SelectControl`/`ToggleControl`/`BaseControl`/`ButtonGroup` đều có plain export — giữ nguyên. Cross-check nhất quán: `ColumnNumberControl` trong `edit.tsx` (code cũ ở HEAD, chạy onsite ổn) wrap `TextControl type="number"`, không phải `NumberControl`.

Fix (cùng chuẩn stable-API Option B): 4 chỗ JSX — `design.tsx` `BoundedNumberControl` + `collection/controls.tsx` (shadow offset X/Y, frame padding) — chuyển sang `<TextControl type="number" min max step>`. `resolveMedia*` nhận `value: unknown` nên onChange string chạy nguyên logic; `BoundedNumberControl` giữ draft-gating (onChange chỉ set khi finite/integer/in-range, onBlur reset về giá trị hợp lệ).

Bài học thêm: grep export map phải dùng **lookbehind** — pattern không anchored làm `NumberControl` "khớp 1 lần" vì là chuỗi con của `__experimentalNumberControl`, dễ kết luận ngược rằng plain export tồn tại.

**Onsite:** human build/deploy và xác nhận "các setting đã ổn" (2026-11-11) — Custom inputs mở không #130. Gate riêng cho Collection shadow/padding nếu chưa test thì kiểm trong đợt T-test chính thức (runbook).

#### Bản ghi đầu tiên (SUPERSEDED — sai premise, sai cơ chế, "fix" là no-op)

#### Mô tả lỗi

Khi mở block **SKVN Product Category Grid** trong WordPress Editor và tương tác với các控制 (toggle "Show description", chọn "Description display" Excerpt/Full text), console hiển thị:

```
Minified React error #130;
args[]=undefined;
```

Lỗi này khiến block preview không thể hiển thị (không render được), nhưng block vẫn hoạt động ở frontend sau khi publish.

#### Nguyên nhân

Lỗi do **`attributes.descriptionDisplay` có thể là `undefined`** khi block load đầu tiên, và code không có fallback phù hợp cho hai trường hợp sau:

> Nguyên nhân chính - Thiếu pattern handling undefined values trong Gutenberg block

##### 1. `SelectControl` value prop (edit.tsx)

**Trước (gây lỗi):**
```tsx
<SelectControl
  label={__( 'Description display', 'skvn-marine-blocks' )}
  onChange={...}
  options={[
    { label: __('Excerpt', ...), value: 'excerpt' },
    { label: __('Full text', ...), value: 'full' },
  ]}
  value={ attributes.descriptionDisplay === 'full' ? 'full' : 'excerpt' }  // <-- Khi undefined -> 'excerpt' nhưng có thể gây React error
/>
```

Khi `attributes.descriptionDisplay` là `undefined`, biểu thức `undefined === 'full'` trả về `false`, nên value rơi về `'excerpt'`. Tuy nhiên, trong một số trường hợp React khi value thay đổi từ `undefined` sang `'excerpt'` có thể trigger re-render với props undefined, gây lỗi #130.

##### 2. `descriptionDisplay()` helper function (preview.tsx)

**Trước (gây lỗ):**
```tsx
function descriptionDisplay( attributes ): 'excerpt' | 'full' {
  return attributes.descriptionDisplay === 'full' ? 'full' : 'excerpt';
}
```

Cũng có cùng vấn đề: khi `attributes.descriptionDisplay` là `undefined`, function trả về `'excerpt'` nhưng có thể không xử lý đúng trong logic downstream.

#### Chi tiết kỹ thuật

##### Flow gây ra lỗi:

1. Block load đầu tiên -> `attributes.descriptionDisplay` chưa được set (undefined)
2. Sử dụng `SelectControl` với value tính toán trên
3. React detect change props -> re-render component
4. `descriptionDisplay()` function gọi với `undefined` value
5. `PreviewCard` component render với `descriptionText` là `record.descriptionText ?? ''` nhưng `descriptionDisplay` kết quả có thể gây inconsistency
6. React DevTools/minified code báo lỗi #130 về undefined value

##### Root cause analysis:

- **Missing default value**: `descriptionDisplay` attribute mặc định trong `block.json` là `"excerpt"`, nhưng khi block export/import hoặc load từ saved content, value có thể bị mất hoặc undefined.
- **No null/undefined check**: Code không có guard explicit cho trường hợp undefined.
- **React prop inconsistency**: Value prop thay đổi giữa undefined -> 'excerpt' trong render cycle.

#### Giải pháp đã áp dụng

##### Sửa đổi `wp-content/plugins/skvn-marine-blocks/src/product-category-grid/edit.tsx`

```tsx
// Trước:
value={ attributes.descriptionDisplay === 'full' ? 'full' : 'excerpt' }

// Sau:
value={
  attributes.descriptionDisplay === 'full'
    ? 'full'
    : attributes.descriptionDisplay === 'excerpt'
    ? 'excerpt'
    : 'excerpt'  // Fallback explicit cho undefined/case khác
}
```

##### Sửa đổi `wp-content/plugins/skvn-marine-blocks/src/product-category-grid/preview.tsx`

```tsx
// Trước:
function descriptionDisplay( attributes ): 'excerpt' | 'full' {
  return attributes.descriptionDisplay === 'full' ? 'full' : 'excerpt';
}

// Sau:
function descriptionDisplay( attributes ): 'excerpt' | 'full' {
  const display = attributes.descriptionDisplay;
  return display === 'full'
    ? 'full'
    : display === 'excerpt'
    ? 'excerpt'
    : 'excerpt'; // Fallback mặc định cho undefined/case khác
}
```

#### Ngăn chặn tương lai

##### 1. Luôn có fallback explicit

```ts
// Luôn kiểm tra đủ 3 trường hợp:
value === 'full' ? 'full' : value === 'excerpt' ? 'excerpt' : 'excerpt'
```

##### 2. Kiểm tra attribute defaults trong block.json

Đảm bảo `descriptionDisplay` có default rõ ràng:
```json
"descriptionDisplay": {
  "type": "string",
  "default": "excerpt"
}
```

##### 3. Sử dụng utility function

Có thể tạo helper function reusable:

```ts
function safeDescriptionDisplay(attributes): 'excerpt' | 'full' {
  const display = attributes.descriptionDisplay;
  if (display === 'full') return 'full';
  if (display === 'excerpt') return 'excerpt';
  return 'excerpt'; // default
}
```

##### 4. Test case

Thêm test case cho:
- Block load với saved content có `descriptionDisplay: "full"`
- Block load với saved content có `descriptionDisplay: "excerpt"`  
- Block load với saved content `descriptionDisplay` bị remove/missing (undefined)

#### Bình luận

Lỗi này là một ví dụ điển hình về importance của **handling undefined values** trong Gutenberg block development, đặc biệt khi làm việc với attributes có default value nhưng có thể bị mất khi block được export/import hoặc cậpgrade.

Cẩn thận với pattern:
- `attr === 'value1' ? 'value1' : 'value2'` - Khi attr là undefined, pattern này vẫn chạy nhưng có thể gây side effect
- Luôn có explicit `else` clause hoặc normalize value trước khi dùng

---
*Lưu ý [CORRECTED 2026-11-10]: câu "đã fix và commit vào codebase" ở bản đầu là sai — toàn bộ thay đổi đang uncommitted; "fix" ternary trong `edit.tsx`/`preview.tsx` là no-op (giữ như defensive style, human review khi commit); root cause đúng và fix Option B xem phần đầu DP-06.*
---


## Patterns cần chú ý (không phải lỗi, nhưng dễ bỏ sót)

### PP-01 — Re-save block sau khi sửa `save.tsx`

Khi `save.tsx` thay đổi output (thêm class, thêm attribute), block đã lưu trong DB có markup cũ. WordPress sẽ báo "block validation failed" và offer recovery.
**Workflow:** Sau khi build plugin, vào editor của mọi trang có block đó → re-save để regenerate markup. Cần làm cho tất cả blocks bị ảnh hưởng.

---

### PP-02 — `view.ts` đọc config từ `data-skvn-*` JSON — attribute phải được thêm vào JSON trong `save.tsx`

Xem DP-01. Nếu `view.ts` cần đọc 1 attribute, attribute đó phải có trong `data-skvn-slider` (hoặc equivalent) JSON được emit bởi `save.tsx`. Chỉ thêm vào `SliderAttributes` type thôi chưa đủ — phải thêm vào object trong `JSON.stringify({...})`.

### DP-03 — Block attribute `align` không được wire vào `edit.tsx` khiến editor kén `max-width: 760px`

**File liên quan:** `src/slider/block.json`, `src/slider/edit.tsx`
**Xảy ra:** Slider block không có class `alignwide`/`alignfull` và không có attribute `align`, nên rule mặc định của Gutenberg `.block-editor-block-list__layout.is-root-container > :where(...)` áp `max-width: 760px` và `margin: auto`.
**Hậu quả:** Slider trong editor hẹp 760px, không tận dụng canvas rộng, khác hành vi với Responsive Spacer (hardcode `alignwide`) và Product Category Grid (attribute `align` + `useBlockProps`).
**Pattern gốc:** Gần DP-01 — chỉ thêm CSS class vào `edit.tsx` mà không đồng bộ attribute `align` vào `block.json`/`SliderAttributes`; hoặc ngược lại, có attribute mà không gán class vào `blockProps`.
**Checklist khi thêm alignment cho block:**
1. `block.json` — khai báo `supports.align`
2. `edit.tsx` — thêm `align` vào type TS + gán class alignment vào `useBlockProps({ className })`
3. `save.tsx` — không thêm (alignment là editor-only, không lưu vào markup frontend)
4. Kiểm class alignment xuất hiện trong editor DevTools, không gây block validation failed.

### DP-07 — Bọc block plugin trong Group container: width contract cần 2 bước, container query lật layout âm thầm

- **Case2026-11-11:** human thử island = Group (background palette) chứa Product Collection Grid preset 4-2-1; grid rơi từ 4 cột desktop về 2 cột tablet.
- **Root cause:** theme clamp chỉ áp con trực tiếp — `style.css:994-1004` `.skvn-full-width-canvas .entry-content > *` → `--skvn-content-width` 760px, `> .alignwide` → 1200px. Group thường (không align) thành con trực tiếp → bị clamp 760px; block plugin bên trong (`width:100%`) theo parent. Container query (`@container (max-width: 760px)` collection, `(min-width: 880px)` category-grid) lật sang layout tablet mà không có cảnh báo. Gutenberg constrained layout chỉ truyền width contract cho con CÓ align (`> .alignwide`).
- **Sai (đã loại bỏ):** viết theme CSS "propagate" width xuống grandchildren — nhân bản layout engine constrained của Gutenberg, vi phạm contract một owner (`docs/standards/css-layout-safety-contract.md` Alignment Ownership).
- **Đúng recipe (2 bước, thiếu 1 vẫn kẹt 760px):** (1) Group → align Wide/Full trên toolbar; (2) block bên trong → Collection: `Layout → Content width: Wide/Full` (attr `contentWidth`, control `src/collection/controls.tsx:410-424`, mapper `modules/collection-render/cards.php:900-909`) hoặc Category Grid/Slider/Feature Showcase: nút align toolbar (`supports.align`).
- **Tránh:** container query breakpoint (760/880px) lật layout im lặng khi parent đổi width — test block trong container/nested parent, không chỉ top-level. Pipeline width có thể đã tồn tại: audit control/attr/renderer TRƯỚC khi đề xuất code fix mới.
- **Product hóa:** island pattern bake 2 bước — human defer 1.4.x (2026-11-11), ăn palette slug không hardcode hex (nối 064 Brand Kit).
- **Evidence:** `docs/testing/group-island-width-1.3.20.md` (recipe + T-ISLAND-01–03); human xác nhận hiện tượng 4→2 (2026-11-11); recipe runtime chưa verify onsite.

#### DP-07.1 — Grid nhô +80px **chỉ bên phải** trong Group: GeneratePress `.alignwide` math, không phải block [2026-11-12]

- **Case:** sau khi đặt đúng align Wide (Group 1200) grid vẫn 1280, mép trái khít Group, mép phải vượt 80px; card chia +20/cột (4 cột) hoặc +40/cột (2 cột).
- **Root cause (đo onsite, `getComputedStyle`):** GeneratePress phát dynamic inline CSS
  `.entry-content .alignwide, body:not(.no-sidebar) .entry-content .alignfull { margin-left:-40px; width:calc(100% + 80px); max-width:calc(100% + 80px); }`
  (specificity `(0,2,0)`). Rule này giả định GP content padding 40px; canvas SKVN đã zero padding đó (`.skvn-full-width-canvas .entry-content { padding: 0 }`).
  Margin `-40px` bị core layout đè bằng `margin-left/right: auto !important` (`.is-layout-constrained`), nên chỉ còn `width/max-width: 100% + 80px` → **tràn phải 80px, trái khít 0**.
- **Vì sao chỉ lộ trong Group:** ở page level, theme clamp `style.css:994-1013` (`.entry-content > .alignwide` 1200) thắng GP vì load sau; block **nested trong Group** không phải con trực tiếp của `.entry-content` → clamp không áp → GP thắng `max-width`, và `100%` resolve theo Group.
- **Không phải:** lỗi Category Grid/Collection, `calc(100% + 80px)` trong plugin, container query, hay Additional CSS (`wp-custom-css` = false).
- **Hệ quả:** mọi `.alignwide` nằm trong container có width (Group/Columns/block) trên canvas full-width đều +80px phải — không riêng grid.
- **Chống tái diễn:** khi một block nested bị rộng hơn parent đúng một hằng số, đọc `max-width`/`width` computed **trước**, rồi quét `document.styleSheets` tìm rule khai báo (snippet §4.3-B trong `docs/testing/group-island-windpress-class-1.3.20.md`); đừng suy từ ảnh hay từ source plugin. GP dynamic CSS không nằm trong file nào → grep repo/runtime luôn ra 0 kết quả, không có nghĩa là "không tồn tại".
- **Evidence:** `docs/testing/group-island-windpress-class-1.3.20.md` §4.2 (số đo) + §4.3 (probe: inject rule `max-width:100% !important` → 1280 ⇒ 1200, delta 80 ⇒ 0; scan B chỉ đúng `inline-sheet#27` = GP).