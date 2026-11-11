# Category Grid description / action controls — 1.3.20 onsite runbook

Date: 2026-11-09. **Planned tests; feature delta not implemented or executed.**
Spec: [plan061](../../.context/planning/061_VER_1_3_20_CATEGORY_GRID_DESCRIPTION_ACTION_CONTROLS_PLAN.md).
Baseline: [Category Grid](product-category-grid-1.3.20.md), including its linked review regressions.

## 1. Target and setup

- Candidate frontend: `https://minhhaifishery.com/home/`, the page containing the reported Category Grid. Confirm the actual test page and record its edit URL; use an approved test copy/staging for fixture edits, role tests and plugin toggles. No automatic production writes.
- Record tested commit/build, WP/Woo/plugin/theme versions, browser, role, exact frontend/editor URLs and loaded asset URLs. Human builds/deploys before testing; purge relevant caches and confirm editor/frontend load the intended CSS.
- Run deferred Category/Archive/Sidebar baseline first as applicable. A pre-existing failure stays separately recorded; do not label it a new regression without before/after evidence.
- Prepare 3 eligible categories: short description; >100-word description with recognizable final words, Unicode/entities and permitted bold/link markup; empty description. Give one a long unbroken name. Back up raw descriptions, thumbnail IDs and page content before edits.
- Place two Category Grid blocks using the same categories but different modes/styles; keep one legacy block with no new attributes in serialized content. Keep Product/Post Collections and Woo archive reference URLs for regression.
- Roles: admin and page editor that can read categories but cannot edit those terms. Record capabilities rather than assuming a role name implies them.
- Check desktop with vertical scrollbar, tablet/mobile, and a narrow Group/Columns parent. Suggested viewports1440/820/390px, but record actual card/body widths; these are test widths, not new breakpoints.

## 2. Exact cases and pass/fail

| Case / IDs | Steps | Expected / PASS criteria | Evidence to return |
|---|---|---|---|
| T01 / CGD-UI01, TECH02 | Load legacy block before resaving; compare baseline. In block A enable description, select Excerpt then Full. In B keep Excerpt. | Legacy24-word/3-line behavior preserved; Full includes recognizable final words without clamp/ellipsis; B unaffected. Empty term has no empty paragraph. | Screenshots, saved attrs, description textContent vs normalized source |
| T02 / CGD-UI02 | In Design / Details select each alignment via the icon group (hover each icon for its title), then narrow parent/mobile; use long token. | Icon group shows Left/Center/Right/Justify with hover titles and keyboard access. Only description alignment changes; title/count/path/button unaffected. No text overflow; Justify remains chosen, not silently switched on mobile. Disabled with help when description off, prior value kept. Opening Details keeps editor console clean (no React #130 — DP-06 regression gate). | Computed text-align + screenshots + boxes |
| T03 / CGD-UI03 | With CTA on, choose Auto/Full/Custom; Custom1/50/100%. Repeat card padding none/md/lg, long label. | Width follows body content box, Full100%; long label wraps without clipping/overflow. Alignment disabled when effective width100%; prior choice returns after Auto/50%. | Body/button rectangles + padding/box-sizing + video |
| T04 / CGD-UI03 | Select Pill, Custom0/12/100px; change Card radius independently. |0 is square; Custom changes only button; Pill restored on switch. Card radius independent, no style leaks. | Computed border radii + screenshots |
| T05 / CGD-UI04 | Use mixed-length descriptions in one row; choose Follow content then Bottom, gap Custom0/16/128px and Default. Toggle description off, then all upper content off, then CTA off. | Flow has exact selected gap within1CSSpx measurement tolerance; Bottom at least that gap and aligned bottoms within1CSSpx for equal-padding same-row cards. Default uses inherited0.4rem. No upper content means no phantom gap; CTA off leaves no slot/gap. | Content/button rect deltas, row grouping, computed gap and paired shots |
| T06 / CGD-ED01 | Keyboard through narrow sidebar and Inspector fallback; toggle description/CTA/modes off and on; clear numeric field then type valid value, blur invalid/negative/decimal/over-limit values. | Units/labels readable, no sidebar overflow; hidden/disabled controls explained; inactive values retained; incomplete/invalid input does not overwrite valid attrs;0 radius/gap survives. | Video, input/attrs before-after, console |
| T07 / CGD-ED02 | Save/reopen; Undo/Redo design edits; duplicate block. Reset Details, then Call to action (group renamed from "Action"; attribute keys unchanged). | Settings persist per block; reset Details changes only Details style including alignment, not display mode/term. Call-to-action reset covers new geometry/style keys, keeps label/show/destination/selection. Other blocks unaffected. | Serialized attrs before-after + video |
| T08 / CGD-ED03, TECH01 | As admin edit term draft, observe preview note, Save category and wait for refetch. Repeat one save failure/conflict using baseline runbook. As restricted page editor read Full, try term edit. | Preview accurately identifies saved details before save; after success Full refreshes; newer draft/conflict preserved. Restricted editor sees full plain text but no raw field/write capability. | GET/POST responses redacted, note screenshot, saved term/state |
| T09 / CGD-TECH01 | Compare raw description/thumbnail before-after style/mode/reset-only edits. Inspect frontend DOM for category whose description contains HTML/link. Tab through cards. | No term mutation or details POST caused by styling; text escaped, no injected HTML/nested anchors; one link/tab stop per card, visible focus; CTA is span. | Raw equality + network writes + DOM/keyboard evidence |
| T10 / CGD-TECH02 | On approved test content use missing attrs, invalid enum, numeric string/fraction/negative/out-of-range attributes; test0 radius/gap. | Documented safe fallbacks match editor/frontend; no CSS injection/NaN/invalid-block;0 retained. No auto rewrite term/legacy content. | Fixture payload, output, editor notices/console |
| T11 / CGD-TECH03/04 | Switch panels/modes repeatedly; test representative widths and nested parent; inspect network. Compare other consumer references. Test without WindPress only on approved isolated fixture. | No per-card fetch/term-query increase attributable to controls, refetch storm or new JS layout engine; styles present in both surfaces; other blocks/archive unchanged; plugin defaults usable independently. | Network list/request counts vs baseline, asset URLs, screenshots |
| T12 / CGD-ED04 | Open shared design sidebar for Category and Collection; check dropdown "Design component" group label, per-control labels (Show call to action; Button background/text/hover; Button font/size/background/text), DesignShortcut copy. Inspect saved serialized attrs before/after renamed build. | Group reads "Call to action"; Category and Collection controls per plan061 §3.3; "Edit button style" unchanged; attribute keys, CSS classes, group value and data identical before/after; catalog panel "Actions"/"Product action"/"Custom action URL" NOT renamed. | Screenshots both blocks + serialized attr diff |

T05 geometry uses rendered content-box bounds; hidden/missing editor notices are not text above CTA. Record text font/line-height and inherited gap because px inference from a screenshot is insufficient. Long descriptions making a whole row taller is expected, not a failure; missing final words in Full is FAIL.

For T03/T11 also return `document.documentElement.clientWidth`, `scrollWidth`, and parent/grid/card/body/button `getBoundingClientRect()`; `scrollWidth <= clientWidth` and button bounds inside body are required. Do not use overflow hiding as proof.

## 3. Commands — human runs after implementation

```bash
php -l wp-content/themes/skvn-marine/functions.php
source /home/shinkuro/.nvm/nvm.sh && nvm use 20 && cd /mnt/d/Github/skvn-marine/wp-content/plugins/skvn-marine-blocks && npm run build && find modules/ -name "*.php" -exec php -l {} \;
```

Add the actual focused test command when tests exist; do not invent a green result or test file. Packaging audit applies if runtime require/include scope changes; plan currently requires none.

## 4. Report format

For every case: ID, PASS/FAIL/blocked or not run, build/URL/role/width, exact expected vs actual, screenshot/video/DOM/network evidence and console notes. Return raw-data comparison for T09 and geometry for T03/T05/T11. Redact cookies/nonces/personal data. Agent then maps evidence to CGD-* and continues source repair if needed. Source/model-only evidence cannot close browser geometry/keyboard/onsite acceptance.

Status 2026-11-11 EOD: P1 + P2 coded, built, deployed; human onsite confirm ×2 ("các setting đã ổn"; "các thành phần hoạt động đúng mô tả") — crash gates qua. P3 source coded; human duyệt phần reset và xác nhận **"Đã test xong, pass"** — T07 (persistence) + T09 + T10 **PASS theo quyết định human** (formal serialized/video/raw evidence không thu — human là acceptance authority; các case giữ trong runbook để truy vết). **CGD-ED02, CGD-TECH01, CGD-TECH02 → PASS.** T01–T05/T08/T12 có human onsite confirm mức UX trong ngày; T11 (CGD-TECH03/04) chưa chạy formal. Gate Collection shadow/padding input nếu chưa được test riêng thì kiểm khi tiện. Còn lại: commit gộp `feature patch:` (human). Keep baseline pending tests and carry IDs intact.

## 5. Plan coding chi tiết — category grid description/action controls

Plan này là bản cắt nhỏ từ `plan061` để agent (hoặc human) triển khai khi đã có lệnh start coding. **Agent không tự build/lint/deploy/git push; human tự chạy commands ở section 3 và kiểm runtime onsite.**

### 5.1 Mục tiêu và phạm vi

**Mục tiêu:** bổ sung Full description (không clamp), căn chữ, chiều rộng nút theo card, bo góc nút bằng px, vị trí nút và khoảng cách nút với nội dung cho **Product Category Grid** trong milestone **1.3.20**.

**Phạm vi (in scope):**
- Tất cả cards của một block Product Category Grid, chung mọi độ rộng.
- Plugin own controls/attrs/presentation/default CSS. Không cần WindPress hay theme SKVN.
- Không per-category design override, không responsive controls mới, không ratio control.
- Không làm Product/Post Collections hoặc Woo archive nhận các controls này.
- Giữ category selection/query/count/eligibility/destination và native term persistence.

**Ngoài scope (không làm đợt này):**
- Ratio control (để scope kế tiếp).
- Product/Post Collection và Woo archive nhận controls này.
- Thay đổi GeneratePress hoặc theme. Không CSS rule toàn cục cho mọi button/p/span.

**Điều kiện trước khi code:** nhắc human chạy deferred baseline Category/Archive và carry Sidebar/Spacer/Carousel liên quan theo `MILESTONES.md`, trên build đã biết để phân biệt regression cũ với delta mới.

### 5.2 File map theo work package

| Gói | ID liên quan | Files dự kiến | Kết quả review được |
|-----|--------------|---------------|---------------------|
| P0 — Baseline & audit | — | Plan049/runbook Category; source audit | Ghi build/fixture và pending cũ; xác minh defaults/loaded CSS/permission; không đánh PASS từ source |
| P1 — Full data + mode | CGD-UI01, CGD-ED03, CGD-TECH01 | `modules/category-grid/resolver.php`, `rest.php`, `render.php`; `src/product-category-grid/types.ts`, `block.json`, `preview.tsx`, `edit.tsx`, `details.tsx` | `descriptionText`, Full/Excerpt, labels/help, parity và read-only role; không ghi native data khi đổi mode |
| P2 — Action + alignment xuyên suốt | CGD-UI02, CGD-UI03, CGD-UI04, CGD-ED04, CGD-TECH02, CGD-TECH04 | `block.json`, `types.ts`, `constants.ts` hoặc helper Category-local; `design.tsx`, `preview.tsx`, `style.css`, `modules/category-grid/render.php`; + labels-only theo plan061 §3.3: `src/collection/controls.tsx`, `src/design-sidebar/navigation.tsx` | Attr→controls→preview→frontend, full text alignment, width/radius/placement/gap; Scheme A rename labels; không broad shared abstraction |
| P3 — Reset/validation/regression | CGD-ED01, CGD-ED02, CGD-TECH02, CGD-TECH03 | `src/design-sidebar/navigation.tsx`; tests Category hiện có hoặc fixture phù hợp; docs testing | Reset allowlist, invalid/zero cases, compatibility/Undo/fallback và data boundary |
| P4 — Human build/onsite | Tất cả CGD-* | Runbooks + execution ledger | Build/lint do human; screenshots/rect/permission/save-reopen; từng acceptance có evidence hoặc giữ pending |

### 5.3 Chi tiết từng package

#### P0 — Baseline & audit (trước khi code)

| Bước | Hành động | Evidence |
|------|-----------|----------|
| P0-1 | Xác minh block Category Grid đã load trên editor/frontend, CSS file/style.css đang được enqueue đúng version (filemtime). | Asset URL, computed style |
| P0-2 | Ghi defaults hiện hành: Excerpt, 24 words, clamp 3 dòng, CTA pill, gap 0.4rem. | Screenshot/attrs |
| P0-3 | Chuẩn bị 3 category test fixture: mô tả ngắn; >100 từ có ký tự cuối dễ nhận dạng, Unicode/entities, markup bold/link được phép; mô tả trống. Một category có tên dài không ngắt dòng. Backup raw descriptions, thumbnail IDs, page content. | Fixture danh sách |
| P0-4 | Đặt 2 Category Grid block cùng categories khác mode/style; giữ 1 block legacy không có attrs mới. | Block IDs, serialized content |

#### P1 — Full data + mode (CGD-UI01, CGD-ED03, CGD-TECH01)

| Bước | Hành động | Contract |
|------|-----------|----------|
| P1-1 | Thêm attribute `descriptionDisplay` (string `excerpt/full`, default `excerpt`) vào `block.json` và `types.ts` (`CategoryGridAttributes.descriptionDisplay`); field presentation `descriptionText` là data field trên `CategoryRecord`, KHÔNG lưu vào block attributes (plan061 §5.1, plugin rule không snapshot vào saved content). | JSON parse OK; đồng bộ TS/PHP |
| P1-2 | Thêm presentation field `descriptionText` vào `resolver.php` (`skvn_marine_blocks_category_grid_description_excerpt` / helper Category-local) lấy plain text/normalize whitespace từ native stored description. | Full có dữ liệu đầy đủ frontend + editor không có quyền sửa term |
| P1-3 | Thêm `descriptionText` vào REST payload `rest.php` (`skvn_marine_blocks_category_grid_term_payload`); raw `description` chỉ khi `withDetails && canEdit`. | Read permission giữ nguyên; restricted editor xem Full plain text, không raw field/write |
| P1-4 | Cập nhật `render.php`: Full text hiển thị toàn bộ plain text, không word trim/line clamp/fixed-height/ellipsis; desc rỗng không render paragraph trống; escape output theo context, không double-escape, không biến HTML thành DOM thực thi. | Full không cắt; empty không đoạn rỗng; no nested links/button/tab stop |
| P1-5 | Cập nhật `preview.tsx`, `data.ts`: preview lấy `descriptionText` từ records fetched; đổi style/mode áp ngay vào records đó. Không giả preview draft chưa lưu là persisted. | Preview note chính xác cho saved details |
| P1-6 | Cập nhật `edit.tsx`, `details.tsx`: đổi nhãn toggle thành "Show description"; thêm "Description display": Excerpt / Full text; help: `Full text shows the entire description without formatting. Longer descriptions make the row taller.` | Một term Full trong block A và Excerpt trong B; không sửa native desc khi đổi mode |

#### P2 — Action + alignment xuyên suốt (CGD-UI02, CGD-UI03, CGD-UI04, CGD-TECH02, CGD-TECH04)

| Bước | Hành động | Contract |
|------|-----------|----------|
| P2-1 | Thêm attrs vào `block.json` + `types.ts`: `descriptionAlign` (`left/center/right/justify`, default `left`); `actionWidthMode` (`auto/full/custom`, default `auto`); `actionWidthPercent` (int 1–100, seed 50); `actionAlign` (`left/center/right`, default `left`); `actionRadiusMode` (`pill/custom`, default `pill`); `actionRadiusPx` (int 0–100, seed 12); `actionPlacement` (`flow/bottom`, default `bottom`); `actionGapPx` (optional int 0–128, absent = Default 0.4rem). **Source done 2026-11-10.** | JSON parse OK; `0` radius/gap hợp lệ, không mất bằng `value \|\| default` |
| P2-2 | Cập nhật `design.tsx`: hiển thị controls theo bảng plan061 §3.2–3.3 — Description alignment là icon group (`ToggleGroupControl` + native icons `alignLeft/alignCenter/alignRight/alignJustify`, tooltip qua `label` + `showTooltip`). Conditional state: description off → alignment disabled + help; Full width → alignment disabled + help; CTA off → ẩn controls phụ, giữ attrs. Đổi labels theo Scheme A: "Show call to action", "Button background/text color/hover background/hover text". **Source done 2026-11-10 — chưa build/chưa onsite.** Delta 2026-11-10 (DP-06 corrected): alignment control dùng `BaseControl`+`ButtonGroup`+`Button` — core dist WP 7.1 không export tên plain `ToggleGroupControlOption`; human-approved supersede §3.2 spec. | Sidebar hẹp không tràn; conditional không mất focus/giá trị; icon group keyboard-accessible |
| P2-2b | Rename labels-only theo plan061 §3.3: `design.tsx` (Category, xem P2-2); `src/collection/controls.tsx` ("Action font/size/background/text" + 2 hover → "Button …"); `src/design-sidebar/navigation.tsx` (designGroups label "Action" → "Call to action"; DesignShortcut copy "...Details and Call to action styles..."). Không đổi attribute keys, class CSS, giá trị group `'action'`, DesignGroup type, hoặc logic; catalog "Actions"/"Product action" không rename. **Source done 2026-11-10.** | T12 pass: dropdown + controls cả 2 block, serialized attr keys trước/sau identical |
| P2-3 | Cập nhật `style.css`: scoped Category CSS; numeric vars chỉ từ validated numbers/allowlisted enums, gắn lên owner wrapper cả editor/frontend. Button: `max-width:100%`, `min-width:0`, `border-box`, text căn giữa trong nền button; nhãn dài wrap, unbroken token break, không ellipsis/clip. Không viewport math, negative margin, overflow mask. **Source done 2026-11-10: vars `--skvn-category-grid-cta-width/radius/gap` trên wrapper; modifier classes `--cta-width-full/custom`, `--cta-align-center/right`, `--cta-radius-custom`, `--cta-flow`; CTA thêm `text-align:center`, `overflow-wrap:anywhere`, `max-width:100%`, `min-width:0` (baseline-compatible, cần so geometry T04).** | Audit specificity thực tế trước khi viết consuming rule |
| P2-4 | Cập nhật layout: tách content group (head/path/description) và action slot; một owner cho khoảng cách giữa chúng. Follow content: gap = resolved gap sau nội dung cuối. Align to bottom: free space đẩy slot xuống đáy body, khoảng hở >= resolved gap. Không phantom gap khi không có nội dung trên; CTA off → không slot/gap rỗng. **Source done 2026-11-10 — DOM đổi: body gap 0, `<div class="skvn-category-grid__content">` bọc head/path/description (render khi có ít nhất một part), spacing content→button thuộc `__content` margin-bottom (gap var) + CTA `margin-top:auto` (bottom) hoặc `margin-top:0` (flow). Editor status badge margin-top 0.35rem → 0.75rem để giữ spacing cũ (editor-only). Baseline geometry phải so paired screenshots T04.** | Flow/Bottom gap chính xác trong 1 CSS px tolerance |
| P2-5 | Cập nhật `render.php`: gắn class/inline style theo validated attrs; full text alignment áp chỉ đoạn description; action alignment/radius/placement/gap áp nút. **Source done 2026-11-10: validators `bounded_int`/`optional_int` (finite/integer/range, `0` hợp lệ, không absint), `wrapper_style()` chỉ emit khi showCta, content group + description align class trong loop.** | Attr→controls→preview→frontend parity |

#### P3 — Reset/validation/regression (CGD-ED01, CGD-ED02, CGD-TECH02, CGD-TECH03)

| Bước | Hành động | Contract |
|------|-----------|----------|
| P3-1 | Cập nhật `src/design-sidebar/navigation.tsx`: thêm reset keys Category (`descriptionAlign` vào Reset Details; `actionWidthMode/Percent/Align/RadiusMode/RadiusPx/Placement/GapPx` + color keys hiện hành vào Reset Action). Default gap reset về absent. Không đụng `showCta`/label/destination/categories. **Source done 2026-11-11 — reset một update qua `resetDesign`; optional attrs không block.json default → `undefined` = absent (gap về Default 0.4rem, Custom seeds áp lại lần chọn sau); DesignFallback dùng cùng `resetDesign` nên semantics đồng bộ. **Human duyệt phần reset + test pass 2026-11-11.** | Reset đúng group; Undo/Redo/duplicate/reopen giữ config |
| P3-2 | Validation guards: Number thật, finite, nguyên, đúng range mới hợp lệ; numeric strings/floats/ngoài range trong saved payload dùng fallback, không echo ra CSS. Input trống/invalid là local editing state: chưa `setAttributes`; blur về giá trị hợp lệ trước đó; explicit Default/Reset mới xóa. Không sanitize bằng `absint` để âm thành dương. **Có source từ P2 (`BoundedNumberControl` draft-gating + `resolve*` TS + PHP `bounded_int`/`optional_int`) — code-level verified 2026-11-11; runtime proof: human test pass (T09/T10) 2026-11-11.** | T09/T10 pass: missing attrs, invalid enum, numeric string/fraction/negative/out-of-range |
| P3-3 | Block cũ thiếu toàn bộ keys → Excerpt, Left, Auto/Left, Pill, Bottom, gap Default 0.4rem. Không resave/rewrite content hoặc term. **Code-level verified 2026-11-11: block.json defaults + `resolve*` fallback phủ đủ; runtime fixture: human test pass (T10) 2026-11-11.** | Không auto rewrite term/legacy content |
| P3-4 | Kiểm clipboard/projection: không vô tình đưa full text snapshots hoặc style attrs thành shared term content. **Code-level verified 2026-11-11: `details.tsx` chỉ ghi `description` + `thumbnail` vào term (dirty flags), không style keys; runtime audit: human test pass (T09) 2026-11-11.** | Scope isolation |

### 5.4 Attribute contract (tóm tắt từ plan061 §4)

| Key | Type / allowed | Default khi thiếu hoặc enum không hợp lệ | Lưu khi inactive |
|-----|---------------|------------------------------------------|------------------|
| `descriptionDisplay` | string `excerpt/full` | `excerpt` | Giữ khi `showDescription` off |
| `descriptionAlign` | string `left/center/right/justify` | `left` | Giữ khi description off |
| `actionWidthMode` | string `auto/full/custom` | `auto` | Giữ khi CTA off |
| `actionWidthPercent` | number integer 1–100 | 50 khi Custom cần fallback | Giữ khi Auto/Full |
| `actionAlign` | string `left/center/right` | `left` | Giữ khi Full/CTA off |
| `actionRadiusMode` | string `pill/custom` | `pill` | Giữ khi CTA off |
| `actionRadiusPx` | number integer 0–100 | 12 khi Custom cần fallback | Giữ khi Pill |
| `actionPlacement` | string `flow/bottom` | `bottom` | Giữ khi CTA off |
| `actionGapPx` | optional number integer 0–128 | **absent = Default 0.4rem**, không schema default 8 | Giữ khi CTA off; chọn Default xóa attr |

### 5.5 Validation checklist trước khi commit/build

```
[ ] block.json parse JSON thành công (src + build)
[ ] Mọi attribute mới nằm trong khối "attributes", trước dấu đóng, không trailing comma
[ ] Attribute mới đồng bộ toàn chain: block.json → types.ts → edit.tsx/design.tsx → preview.tsx → render.php (PHP) → REST payload
[ ] CSS class/vars gán vào element mục tiêu, không lan sang wrapper block cha
[ ] Không set visual property trên body.skvn-* (nếu có)
[ ] Kiểm tra overflow ancestor trước khi position ngoài container (nếu có)
[ ] Không dùng 100vw / 50vw / margin âm để lan rộng width
[ ] Không dùng overflow-x: hidden/clip để che geometry tràn
[ ] Validation guard: finite, integer, range, 0 hợp lệ, fallback cho invalid, không absint
[ ] Reset allowlist thêm đúng keys Category, không đụng selection/content/Collection
[ ] Labels Scheme A đồng bộ: navigation.tsx (shared group + DesignShortcut copy), design.tsx (Category), controls.tsx (Collection); attribute keys/class CSS/giá trị group không đổi
[ ] Commit nhóm theo logic, không dùng && trong PowerShell
[ ] PHP lint: find modules/ -name "*.php" -exec php -l {} \;
[ ] Nếu sửa src/block.json, đã sync build/block.json
[ ] PITFALLS.md updated nếu có conflict mới phát sinh
```

### 5.6 Commit grouping (khi human giao coding/commit)

Theo quy ước AGENTS.md, commit tách theo nhóm logic, không dùng `&&` trong PowerShell. Ví dụ nhóm đề xuất:

| Nhóm commit | Prefix | Files gợi ý |
|-------------|--------|-------------|
| P1 data + mode | `feature patch:` | `modules/category-grid/resolver.php`, `rest.php`, `render.php`; `src/product-category-grid/types.ts`, `block.json`, `preview.tsx`, `edit.tsx`, `details.tsx` |
| P2 action + alignment (+ rename labels) | `feature patch:` | `block.json`, `types.ts`, `constants.ts`; `design.tsx`, `preview.tsx`, `style.css`, `modules/category-grid/render.php`; `collection/controls.tsx`, `design-sidebar/navigation.tsx` (labels only) |
| P3 reset/validation | `feature patch:` | `src/design-sidebar/navigation.tsx`; tests/fixtures nếu có |
| Docs tracking | `docs:` | `docs/testing/category-grid-description-actions-1.3.20.md` (plan này) |

### 5.7 Mapping CGD-* IDs → files/surface (traceability)

| ID | Nhóm | Files chính | Surface kiểm |
|----|------|-------------|--------------|
| CGD-UI01 | Block UI | `render.php`, `preview.tsx`, `details.tsx`, `edit.tsx` | Full không cắt; empty không đoạn rỗng |
| CGD-UI02 | Block UI | `style.css`, `render.php`, `design.tsx` | Description alignment độc lập; long words không tràn |
| CGD-UI03 | Block UI | `style.css`, `render.php`, `design.tsx`, `block.json` | Auto/Full/Custom% đúng body; nhãn wrap |
| CGD-UI04 | Block UI | `style.css`, `render.php`, `design.tsx`, `block.json` | Flow gap chính xác; Bottom gap/đáy; không phantom gap |
| CGD-ED01 | Editor UX | `design.tsx`, `edit.tsx`, `details.tsx` | Controls rõ/conditional; sidebar không tràn |
| CGD-ED02 | Editor UX | `navigation.tsx`, `edit.tsx`, `details.tsx` | Save/Undo/duplicate/reopen giữ config; reset đúng group |
| CGD-ED03 | Editor UX | `preview.tsx`, `data.ts`, `rest.php`, `resolver.php` | Preview note chính xác; read-only role thấy Full |
| CGD-TECH01 | Technical | `render.php`, `resolver.php`, `rest.php` | Raw term không đổi; one link/card; no HTML injection |
| CGD-TECH02 | Technical | `block.json`, `types.ts`, `edit.tsx`, `design.tsx`, PHP render | Validation tương đương; 0 có hiệu lực; defaults cũ không cần resave |
| CGD-TECH03 | Technical | `style.css`, `preview.tsx`, REST, PHP | Assets đúng editor/frontend; không extra term query/REST storm |
| CGD-TECH04 | Technical | `style.css`, `render.php` | Parent width giữ; không horizontal overflow; không JS equal-height |

### 5.8 Điều kiện hoàn tất

- P1–P3 source hoàn tất, commit tách nhóm logic (khi human giao).
- Human chạy commands section 3 (build + PHP lint), ghi build/version/URL.
- Human chạy onsite theo runbook section 2 (T01–T11), trả evidence screenshots/rect/DOM/network/console.
- Agent map evidence sang CGD-* IDs. Source/model-only evidence **không thể** đóng browser geometry/keyboard/onsite acceptance.
- Không tự tăng milestone, nghiệm thu hoặc release khi chỉ có source.
</parameter>
</function>

