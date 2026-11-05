# PITFALLS.md — SKVN Marine

> Bộ sưu tập lỗi thực tế đã xảy ra trong quá trình phát triển.
> Mục đích: agent và dev đều đọc trước khi làm việc liên quan để tránh lặp lại.
> Không xóa entry — chỉ thêm `Fixed:` khi đã có giải pháp kiến trúc lâu dài.

---

## Agent Pitfalls (lỗi quy trình của AI agent)

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

---

## Patterns cần chú ý (không phải lỗi, nhưng dễ bỏ sót)

### PP-01 — Re-save block sau khi sửa `save.tsx`

Khi `save.tsx` thay đổi output (thêm class, thêm attribute), block đã lưu trong DB có markup cũ. WordPress sẽ báo "block validation failed" và offer recovery.
**Workflow:** Sau khi build plugin, vào editor của mọi trang có block đó → re-save để regenerate markup. Cần làm cho tất cả blocks bị ảnh hưởng.

---

### PP-02 — `view.ts` đọc config từ `data-skvn-*` JSON — attribute phải được thêm vào JSON trong `save.tsx`

Xem DP-01. Nếu `view.ts` cần đọc 1 attribute, attribute đó phải có trong `data-skvn-slider` (hoặc equivalent) JSON được emit bởi `save.tsx`. Chỉ thêm vào `SliderAttributes` type thôi chưa đủ — phải thêm vào object trong `JSON.stringify({...})`.
