# Coding Convention — SKVN Marine

> Quy tắc viết code cho agent và dev trong project SKVN Marine.
> Đặt tại `.context/coding-convention.md`, đọc trước mỗi task liên quan sửa source/theme/plugin.
> Nguồn suy ra: `.context/PITFALLS.md` (Agent Pitfalls + Dev / Code Pitfalls), `AGENTS.md` invariants, plan 047 Marine Blocks Migration.

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

## 4. Checklist trước khi commit/build

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
