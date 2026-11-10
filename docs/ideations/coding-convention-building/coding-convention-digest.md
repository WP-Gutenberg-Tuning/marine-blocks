# Coding Convention — SKVN Marine (DIGEST / DRAFT)

> **Lưu ý:** File này là **digest/tóm tắt** từ `.context/PITFALLS.md` (Agent Pitfalls + Dev / Code Pitfalls) và các invariant trong `AGENTS.md`.
> Nó **chưa phải coding convention chính thức**. Chưa được human review, chưa chốt làm chuẩn, chưa áp dụng bắt buộc.
> Đặt tại `docs/ideations/coding-convention-building/` để nhóm thảo luận, bổ sung và chốt sau.
>
> Nếu human đồng ý đưa vào effect, file này sẽ được move vào `.context/coding-convention.md` và đính kèm vào AGENTS.md / PITFALLS.md.

---

## 1. Mục đích

- Tránh lặp lại các lỗi đã ghi trong `PITFALLS.md`.
- Đảm bảo source code đồng bộ giữa các layer: `block.json`, `edit.tsx`, `save.tsx`, PHP render, `view.ts`, CSS.
- Chuẩn bị cho milestone đổi tên block plugin (1.4.0 Marine Blocks Migration): không global replace tên/prefix ngoài migration đã duyệt, không rename namespace/prefix tự ý.

---

## 2. Phạm vi áp dụng

Áp dụng cho mọi task sửa:

- `wp-content/plugins/skvn-marine-blocks/src/**` (block registration, edit, save, view, CSS)
- `wp-content/plugins/skvn-marine-blocks/modules/**` (PHP render, dynamic blocks)
- `wp-content/themes/skvn-marine/**` (theme CSS, PHP, block styles)
- `wp-content/plugins/skvn-marine-blocks/build/**` (build artifact, sync với `src/`)

Không áp dụng cho `themes/generatepress/` (bất kỳ file nào — invariant cấm sửa).

---

## 3. Quy tắc cốt lõi

### CC-01 — Không global replace tên/prefix ngoài migration đã duyệt

- KHÔNG dùng global replace `skvn` → `marine` (hoặc ngược lại) trong repo/DB mà không có quyết định human rõ ràng về migration 1.4.0.
- Hàm nội bộ có thể đổi đồng bộ; wrapper chỉ cần cho consumer chưa chuyển.
- Saved blocks/markup, option/meta keys phải có compatibility hoặc migration riêng.
- Theme giữ identity `skvn-marine`, PHP `skvn_marine_`, CSS/tokens theme. Plugin giữ `skvn-marine-blocks`, `skvn_marine_blocks_`, `skvn-` cho đến khi human xác nhận start migration.

**Liên quan PITFALLS:** AGENTS.md invariant "Theme identity giữ nguyên; plugin chỉ rename theo plan 047 Marine Blocks 1.4.0 khi human xác nhận start; không global replace shared `skvn-`."

---

### CC-02 — Synchronize attribute trên toàn chain block

Khi thêm/thay đổi 1 attribute ảnh hưởng appearance/behavior, phải đi qua đầy đủ:

1. `block.json` — thêm attribute definition (trong khối `"attributes"`, trước dấu đóng).
2. `edit.tsx` — thêm vào type TS + gán class/control UI vào `blockProps.className` (hoặc Inspector control).
3. `save.tsx` — thêm vào type TS + gán class/markup/data-attribute vào `useBlockProps.save()` (check từng output).
4. Nếu dynamic block → PHP render: thêm vào `$classes[]` hoặc attribute truyền xuống view.
5. `view.ts` (nếu có) — verify attribute được đọc từ `data-*` JSON emit bởi `save.tsx`.

**Không được:** chỉ thêm vào `edit.tsx` hoặc chỉ vào `block.json` mà quên `save.tsx`/`PHP render`.

**Liên quan PITFALLS:** DP-01, DP-02, DP-03 (align), PP-02.

---

### CC-03 — CSS class gán vào element mục tiêu, không lan sang wrapper

- Class layout/size (`max-height`, `aspect-ratio`, `width`, `alignwide`, `ratio-*`, …) dành cho element con phải gán vào `blockProps` của chính element đó, không phải `blockProps` của wrapper block cha.
- Trong editor, wrapper block cha (`.skvn-slider--editor-focus`, `.block-editor-block-list__block`) chứa toàn bộ chrome (rail, stage, footer, navigation preview…). Rule áp lên wrapper sẽ hỏng layout editor và đẩy các block khác trong block list xuống dưới.
- Phải kiểm tra trong editor DevTools: class xuất hiện trên element đúng, không lan sang các element cha.

**Liên quan PITFALLS:** DP-05.

---

### CC-04 — CSS scope: không set visual property trên `body.skvn-*`

- `body.skvn-*` class chỉ được set CSS custom properties (variables) hoặc layout properties ảnh hưởng toàn trang (overflow, scroll behavior).
- KHÔNG set `background`, `color`, hay visual properties thuộc về component con trên `body.skvn-*`.

**Liên quan PITFALLS:** DP-03.

---

### CC-05 — Kiểm tra `overflow` ancestor trước khi position ngoài container

- Trước khi position element ra ngoài container (negative inset, `transform: translate` ra ngoài bounds), phải kiểm tra `overflow` của container và mọi ancestor.
- Swiper wrapper luôn cần `overflow: hidden` → arrows phải nằm ngoài wrapper div, hoặc dùng padding + negative margin trick trên parent.
- KHÔNG dùng `overflow-x: hidden/clip` để che geometry đang tràn.

**Liên quan PITFALLS:** DP-04.

---

### CC-06 — `block.json` JSON structure

- Mọi attribute mới phải nằm **trong** khối `"attributes"`, trước dấu `}` đóng, cách nhau bởi dấu phẩy.
- KHÔNG để attribute nằm sau khối `"attributes"` hoặc sau `"supports"`.
- KHÔNG trailing comma sau attribute cuối cùng.
- Trước commit/build phải chạy: `node -e "JSON.parse(require('fs').readFileSync('...block.json','utf8')); console.log('JSON OK')"` cho cả `src/*.block.json` và `build/*.block.json`.
- Nếu edit `src/block.json`, phải sync lại `build/block.json` trước khi onsite.

**Liên quan PITFALLS:** AP-04.

---

### CC-07 — CSS editing: không overwrite toàn bộ rule

- Khi thêm property vào CSS rule đã có, phải copy toàn bộ rule cũ vào `old_string`, chỉ thêm dòng mới, không bao giờ xóa dòng cũ nếu không được yêu cầu.
- KHÔNG dùng `!important` trừ khi có lý do rõ ràng và ghi chú.

**Liên quan PITFALLS:** AP-03.

---

### CC-08 — Test và guard phải đi qua entry point thật

- Với mỗi guard, phải có test gọi entry point thật mà user dùng, bắt guard fail và assert không mutation/lookup ngoài ý muốn.
- Tách pure model, mocked controller, actual parser/serializer và onsite/history evidence.
- KHÔNG dùng số tests hoặc transpile syntax làm bằng chứng coverage.
- Viết expected từ spec/fixture người dùng, không từ code vừa viết.
- Phân biệt span trình bày (unwrap, giữ text/semantic children) với construct không hỗ trợ (reject toàn thao tác).

**Liên quan PITFALLS:** AP-08, AP-09, AP-10.

---

### CC-09 — Commit nhóm theo logic, không dùng `&&` trong PowerShell

- Chạy `git add` và `git commit` thành 2 lệnh riêng biệt (không dùng `&&`).
- Mỗi commit 1 nhóm logic (docs / feature patch / chore / build artifact).
- Không commit hơn 3–5 file per AI task trừ khi có lý do rõ ràng (AGENTS.md invariant).

**Liên quan PITFALLS:** AP-05.

---

### CC-10 — Verify sau build trước khi onsite

- Syntax PASS / VM tests PASS không chứng minh màu/viền xuất hiện trong editor.
- Phải kiểm output thực tế sau human build: DOM class, stylesheet URL/version/Network, computed style/rect trong đúng editor document/iframe.
- Nếu thiếu runtime evidence phải ghi "source có, visual chưa kiểm", không nói đã nghiệm thu.

**Liên quan PITFALLS:** AP-06, AP-07.

---

## 4. Bảng tổng hợp lỗi và cách sửa theo nhóm

Bảng dưới tổng hợp từ `.context/PITFALLS.md` (Agent Pitfalls + Dev / Code Pitfalls) và các invariant trong `AGENTS.md`. Mỗi nhóm có cột: **Lỗi gì | Sai gì | Sửa như thế nào**.

### 4.1 Agent Pitfalls

| Lỗi gì | Sai gì | Sửa như thế nào |
|--------|--------|-----------------|
| AP-13 Kiểm DOM sau compile rồi bỏ sót CSS cache | Chỉ xem computed DOM sau WindPress compiler; coi file Saved hoặc style ID có chữ cached là evidence cache đã chứa source mới | So raw response/CSS cache với settled DOM; purge HTML/CDN và kiểm cold paint; không đoán chung là browser cache |
| AP-12 Giao prototype có JS nhưng không nối runtime | Coi file tồn tại hoặc bản preview chạy là tính năng đã dùng được; yêu cầu human tự ghép assets sau khi đã chốt | Nối markup → stylesheet → runtime enqueue → breakpoint/interaction; kiểm script tags + toggle/dialog/ready state |
| AP-11 Nâng toolbar đúng hàng nhưng dùng sai hệ cột | Chỉ chuyển count/sort ngang H1 rồi dùng hai flex items co giãn độc lập; không ràng buộc heading row với sidebar/product tracks | Dùng chung track sizing, gap, width owner và container breakpoint; đo left/right delta giữa hàng heading/toolbar và body grid |
| AP-08 Guard chỉ tồn tại ở Copy/root, Paste và descendants đi vòng | Có helper kiểm bindings/limits nhưng không nối vào mọi ingress/node: native clipboard Paste bỏ qua binding nguồn | Lập bảng invariant × ingress × root/ancestor/descendant × trước/sau await; validate raw ingress; guard quyền dùng đúng semantic selectors |
| AP-09 Test xanh vì không đi qua đường thực thi có lỗi | 16 pure tests trước đó không bao phủ transport/controller; test limit chỉ đi Copy | Với mỗi guard, phải có test gọi entry point thật, bắt guard fail và assert không mutation |
| AP-10 Đổi spec bằng cách viết test cho behavior sai; tự viết HTML sanitizer | Test assert span phải reject, nhưng spec yêu cầu unwrap giữ semantic content | Viết expected từ spec/fixture người dùng; phân biệt span trình bày (unwrap) và construct không hỗ trợ (reject toàn thao tác) |
| AP-06 Bỏ visual cũ trước khi chứng minh replacement được nạp | Bỏ nền/viền body cũ khi replacement mới chỉ tồn tại trong source | Nối replacement tới bundle/handle được nạp trong cùng thay đổi; kiểm output thực tế sau human build |
| AP-07 Đoán cache/deploy khi chưa có bằng chứng onsite | Có selector trong CSS local mới không chứng minh site đang nhận đúng asset, selector match DOM hay rule thắng cascade | Tách ba trạng thái: source defect đã chứng minh / local artifact đã kiểm / onsite delivery chưa kiểm |
| AP-01 Edit tool yêu cầu Read trước | Gọi Edit tool mà chưa Read file | Read trước rồi mới Edit |
| AP-02 Incomplete diff khi reorder JSX | Chỉ di chuyển opening tag, quên di chuyển `<BlockEdit {...props} />` xuống sau | Đọc lại toàn bộ hàm/component và viết mental diff hoàn chỉnh; gộp lại thành 1 lần edit |
| AP-03 Thêm property mà không kiểm tra existing display rule | Thêm `width: 100%` nhưng vô tình xóa `display: flex; align-items: flex-end` | Copy toàn bộ rule cũ vào `old_string`, chỉ thêm dòng mới, không xóa dòng cũ |
| AP-04 block.json attribute đặt ngoài khối `"attributes"` | Các key attribute bị đặt sau dấu `}` đóng khối `"attributes"` → JSON không hợp lệ | Đảm bảo mọi attribute mới nằm **trước** dấu đóng, cách nhau bằng dấu phẩy, không trailing comma |
| AP-05 PowerShell không hỗ trợ `&&` | Chạy `git add ... && git commit -m "..."` | Chạy `git add` và `git commit` thành 2 lệnh riêng biệt |

### 4.2 Dev / Code Pitfalls

| Lỗi gì | Sai gì | Sửa như thế nào |
|--------|--------|-----------------|
| DP-01 Block attribute thêm vào `block.json` + `edit.tsx` nhưng quên `save.tsx` | `heightPreset` có trong `block.json` và `edit.tsx`, nhưng `save.tsx` có type riêng không bao gồm nó | Thêm vào `save.tsx` type + className/markup/data-attribute; verify `view.ts` đọc từ `data-*` JSON |
| DP-02 Block attribute maps to CSS class nhưng PHP render không thêm class | `imageRatio` định nghĩa trong `block.json` và CSS đầy đủ, nhưng PHP render không thêm `skvn-collection--ratio-*` vào `$classes` | Thêm vào `$classes[]` hoặc attribute truyền xuống view; `grep` PHP render để confirm class được emit |
| DP-03 CSS scope sai: component property đặt ở `body` level | `body.skvn-has-footer-page { background: ... }` paint toàn bộ `<body>` bằng màu footer | `body.skvn-*` chỉ nên set CSS custom properties hoặc layout properties ảnh hưởng toàn trang (overflow, scroll) |
| DP-04 Carousel arrows đặt ngoài `overflow: hidden` container | Arrows đặt ra ngoài container, nhưng container có `overflow: hidden` → arrows bị clip | Thêm outer wrapper (position: relative, no overflow: hidden); arrows nằm ngoài wrapper div |
| DP-05 Class CSS editor gán vào wrapper ngoài cùng thay vì element mục tiêu | Class `skvn-slide--hero-max-height` gán vào `blockProps` của wrapper `.skvn-slider--editor-focus`, không phải element slide `.skvn-slide--editor` | Gán class vào `blockProps` của chính element mục tiêu, không phải wrapper block cha |

### 4.3 Patterns cần chú ý (không phải lỗi, nhưng dễ bỏ sót)

| Lỗi gì | Sai gì | Sửa như thế nào |
|--------|--------|-----------------|
| PP-01 Re-save block sau khi sửa `save.tsx` | Block đã lưu trong DB có markup cũ sau khi `save.tsx` thay đổi output | Sau build, vào editor của mọi trang có block đó → re-save để regenerate markup |
| PP-02 `view.ts` đọc config từ `data-skvn-*` JSON | Chỉ thêm vào `SliderAttributes` type thôi chưa đủ | Thuộc tính phải có trong `JSON.stringify({...})` được emit bởi `save.tsx` |

---

## 5. Checklist trước khi commit/build

```
[ ] block.json parse JSON thành công (src + build)
[ ] Attribute mới đã đi qua toàn chain: block.json → edit.tsx → save.tsx → PHP render (nếu dynamic) → view.ts (nếu có)
[ ] CSS class gán vào element mục tiêu, không lan sang wrapper block cha
[ ] Kiểm tra trong editor DevTools: class xuất hiện trên element đúng
[ ] Không set visual property trên body.skvn-*
[ ] Kiểm tra overflow ancestor trước khi position ngoài container
[ ] Không dùng 100vw / 50vw / margin âm để lan rộng width
[ ] Không dùng overflow-x: hidden/clip để che geometry tràn
[ ] Commit nhóm theo logic, không dùng && trong PowerShell
[ ] PHP lint: find modules/ -name "*.php" -exec php -l {} \;
[ ] Nếu sửa src/block.json, đã sync build/block.json
[ ] PITFALLS.md updated nếu có conflict mới phát sinh
```

---

## 5. Mapping với PITFALLS.md

| Convention | PITFALLS entry |
|------------|----------------|
| CC-01 | AGENTS.md invariant (theme identity, no global replace skvn) |
| CC-02 | DP-01, DP-02, DP-03 (align), PP-02 |
| CC-03 | DP-05 |
| CC-04 | DP-03 |
| CC-05 | DP-04 |
| CC-06 | AP-04 |
| CC-07 | AP-03 |
| CC-08 | AP-08, AP-09, AP-10 |
| CC-09 | AP-05 |
| CC-10 | AP-06, AP-07 |

---

## 6. Lưu ý khi migration đổi tên block plugin (1.4.0)

Theo plan 047 Marine Blocks Migration:

- Chỉ bắt đầu khi human xác nhận SemVer và start milestone. Current vẫn là 1.3.20, chưa start 1.4.0.
- Không rename namespace/prefix, plugin slug, text domain, option keys, build entrypoints, activation path cho đến khi human duyệt.
- Hàm nội bộ có thể đổi đồng bộ; wrapper chỉ cần cho consumer chưa chuyển.
- Saved blocks/markup, option/meta keys phải có compatibility hoặc migration riêng.
- Không global replace `skvn` trong repo/DB.
- Convention này sẽ được cập nhật sau khi human xác nhận start migration 1.4.0.

---

## 7. Cập nhật convention

Khi phát hiện lỗi mới không có trong danh sách trên, agent phải:
1. Ghi vào `.context/PITFALLS.md` theo format hiện có.
2. Thêm mục CC- mới vào file này nếu lỗi g'origine từ thiếu convention.
3. Cập nhật mapping section 5.
