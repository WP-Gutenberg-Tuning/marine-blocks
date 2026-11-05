# AGENTS.md — SKVN Marine

> Đọc file này TRƯỚC KHI làm bất kỳ task nào.
> Đây là protocol bắt buộc cho mọi AI agent làm việc trong project này.

---

## 0. Milestone hiện tại

Current milestone: **V1 / 1.3.19 — Plugin Design Sidebar Foundation**

Scope addition2026-11-05 — Content Actions: human duyệt toàn gói plan057 §11–14 (Product/Post Collections + Slider/Slide), bổ sung current1.3.19, không bump metadata/chuyển milestone; cho agent coding và commit prefix `feature patch:`. Menu ⋮ từng block, giữ style đích, exact type/shape, query là content, empty ghi đè; API/runtime preflight và acceptance vẫn phải kiểm. Right-click plan058 Deferred sau2.0. Handoff `docs/workflows/prompts/block-content-actions-agent-handoff.md`; không hỏi lại scope/version/start đã duyệt, không coi approval là runtime PASS.

Scope addition2026-11-05: human duyệt Responsive Spacer plan055, cho implementation và commit `feature patch:` trong current1.3.19; không chuyển milestone/bump metadata. Source/acceptance riêng RS-*; build/lint/onsite chưa nghiệm thu. Spec `.context/planning/055_VER_1_3_19_RESPONSIVE_SPACER_PLAN.md`.

Human start 2026-11-04: giao agent Sol coding theo plan 048, Q1=A/Q2=A. 1.3.18 được chuyển ưu tiên, **DEFERRED_WITH_CARRY_OVER**, không phải toàn bộ PASS; checklist/evidence giữ trong MILESTONES_HISTORY và carry register 1.3.19. Loading/navigation 046 vẫn thuộc 1.3.18, source/test/debt riêng, chưa nghiệm thu. Các đoạn checkpoint dưới là lịch sử trước lệnh start này. Metadata 1.3.19 là milestone development build, không phải release approval.

Milestone source of truth: `.context/MILESTONES.md`.

Human chuyển current 2026-10-19 sau khi approve 1.3.17 onsite. 1.3.17 → `MILESTONES_HISTORY.md` với `DONE_WITH_CARRY_OVER`: gói A (width) và B (grouped attributes + `+N`) PASS; gói C PASS về chức năng nhưng **bản sửa regression state owner ngày 2026-10-19 chưa kiểm chứng lại**; gói D skeleton **có source, chưa test**. Sáu mục carry sang 1.3.18: xác minh lại C, test D, Post visual riêng, controls hide/disabled, G-MEDIA, editor preview 040 §13. Editor preview chưa được code dù milestone đã mở. Plan `045_VER_1_3_18_CAROUSEL_EDITOR_UX_TECHNICAL_EXECUTION_PLAN.md` đã tồn tại; §9–13 cập nhật planning chi tiết ngày 2026-10-20. Human yêu cầu không sửa skeleton trong đợt này; không triển khai skeleton toàn trang, giữ debt D và hiện tượng chớp chưa giải quyết. Arrow centering đã có source riêng, chờ onsite. Lượt planning không bump metadata hoặc bắt đầu implementation Editor UX.

### Cập nhật thứ tự 2026-11-04 — Sidebar / Hero swap

Human hoán đổi hai scope: **1.3.19 — Plugin Design Sidebar Foundation → 1.3.20 — Product Category Grid + Category details → 1.3.21 — Hero Slider Contrast Repair**. Thay thứ tự Category trước Sidebar ngày 2026-10-28. Sidebar nhận phần acceptance Carousel 1.3.18 chưa hoàn tất/thiếu evidence; register tại MILESTONES.md §1.3.19, giữ IDs/PASS/gaps và kiểm runtime riêng với DS-01–07. Carousel cơ bản dùng được theo human onsite report; không suy toàn bộ Technical PASS. Category tích hợp nền sidebar khi triển khai 1.3.20; không xây Category trong milestone nền. Hero giữ source/acceptance, hotfix ngoài current. **Current vẫn 1.3.18; chưa start Sidebar hoặc bump/archive/đóng milestone.**

### Milestone stack → SemVer — bắt buộc trước khi triển khai

Human decision (2026-10-13): roadmap 039 là **milestone stack**. Các nhãn M1–M6 chỉ định danh scope trong stack, không phải version và không thay current milestone.

- Audit, review và planning được dùng nhãn stack khi mục còn chưa có version.
- Trước khi đưa một mục vào triển khai, agent phải xác định scope, đề xuất SemVer cụ thể theo Version Naming Rule, nêu lý do chọn MAJOR/MINOR/PATCH, đối chiếu version hiện tại và các version đã dùng/đã dự kiến trong MILESTONES.md. Không tái dùng hoặc đè scope của một version khác nếu chưa có quyết định human rõ ràng.
- Human phải xác nhận SemVer và việc bắt đầu/chuyển milestone trước implementation. Nếu đã xác nhận trong session hoặc tài liệu quyết định thì dùng quyết định đó, không hỏi lại. Chọn ưu tiên/scope trong stack không tự là phê duyệt version hay chuyển mốc.
- Chưa có SemVer được xác nhận: tiếp tục audit/planning; không implement mục mới, đổi current milestone, bump metadata hoặc archive milestone/tension.
- Khi được xác nhận, ghi mapping nhãn stack → SemVer vào roadmap 039, đồng bộ current milestone trong AGENTS.md và MILESTONES.md theo Transition Rule. Định dạng current: `V<phase> / <MAJOR.MINOR.PATCH> — <tên scope>`; M1–M6 chỉ được ghi thêm như tham chiếu stack.
- Prompt handoff triển khai phải có version đã xác nhận, scope/acceptance và tham chiếu stack. Không ghi `Current: M1` hoặc dùng M1 thay cho `1.3.x`. Nếu mapping và current milestone không khớp, dừng implementation và báo chênh lệch.
- Sync metadata chỉ sau khi bắt đầu milestone đã được human xác nhận; milestone development build vẫn khác release approved. Chat chỉ planning/Markdown không chạy bump/build.

Quy tắc này không chọn version cho mục nào và không chuyển current milestone hiện tại.

### Chuyển ưu tiên (defer/reprioritize) — chỉ human quyết

- Phân biệt **hoàn thành milestone bình thường** (đủ acceptance DONE + smoke test + human approve theo Transition Rule) với **human quyết định hoãn/thay ưu tiên** khi milestone hiện tại chưa bắt đầu hoặc chưa hoàn thành.
- Khi human xác nhận chuyển ưu tiên, milestone cũ có thể ở trạng thái deferred dù checklist chưa DONE: giữ nguyên checklist, acceptance chưa giải quyết và mọi truy vết planning/decision; không bao giờ đánh dấu completed cho milestone bị dời và không làm mất acceptance nào.
- SemVer của scope mới và lệnh bắt đầu/chuyển mốc có thể được human xác nhận cùng lúc; nếu đã xác nhận trong session hoặc tài liệu quyết định thì dùng quyết định đó, không hỏi lại.
- Lượt chỉ sửa quy tắc không đổi Current, không archive milestone/tension, không bump metadata.

Quy tắc quản lý tension theo milestone:

- Trong cùng milestone hiện tại, tension đã `RESOLVED_ACTIVE` nằm trong `.context/TENSIONS_ACTIVE.md` để agent thấy decision liên quan khi làm task V1.
- Chỉ khi human tuyên bố chuyển sang milestone/version mới (ví dụ V1 → V2), agent mới move các tensions đã `RESOLVED_ACTIVE` của milestone cũ sang `.context/TENSIONS_HISTORY.md` và đổi `Status: ARCHIVED`.
- Khi human bắt đầu milestone mới, agent được sync WordPress theme/plugin working metadata sang version milestone bằng `node tools/bump-project-version.mjs <version>` rồi rebuild plugin assets nếu plugin/package metadata đổi. Đây là **milestone development build**, chưa phải release approved.
- Khi chuyển milestone, agent phải update cả `AGENTS.md` và `.context/MILESTONES.md`, đồng thời move milestone cũ sang `.context/MILESTONES_HISTORY.md`. Nếu đó là release/deploy boundary, verify WordPress theme/plugin release metadata đã sync bằng `node tools/bump-project-version.mjs <version>` theo `docs/workflows/versioning-release-workflow.md`. Nếu milestone thêm hoặc đổi PHP runtime `require`/`include`, phải audit deploy artifact theo `docs/workflows/deploy-artifact-workflow.md` trước khi zip/upload.
- `.context/TENSIONS_HISTORY.md` không load mặc định, chỉ đọc khi cần audit quyết định cũ hoặc human yêu cầu.

---

## 1. Đọc trước — Bắt buộc

Mỗi task bắt đầu bằng 4 bước này, không có ngoại lệ:

```
1. Đọc .context/GLOBAL.md       → hiểu stack, module index, invariants
2. Đọc .context/MILESTONES.md   → biết milestone hiện tại và checklist liên quan
3. Đọc .context/TENSIONS_OPEN.md     → check toàn bộ OPEN tensions
4. Đọc .context/TENSIONS_ACTIVE.md   → check RESOLVED_ACTIVE tensions của milestone hiện tại, dùng tag filter
5. Đọc .context/modules/<module>.md  → load context của module sắp sửa
```

Nếu `.context/modules/<module>.md` chưa tồn tại → load `GLOBAL.md` + hỏi lại trước khi tạo file mới.

Nếu `[manual]` section trong module file còn template placeholder (`<!-- Viết tại đây -->`) → **DỪNG, báo lại**, không tự điền assumption.

### Context load rules

- `.context/planning/*.md` chỉ đọc khi task liên quan scope, UX direction, layout strategy, version planning, hoặc quyết định future block boundary.
- `.context/proposals/` là local review/discussion artifact, không phải active protocol. Không load mặc định và không treat như source of truth.
- `.context/MILESTONES_HISTORY.md` không load mặc định. Chỉ đọc khi audit milestone cũ, migrate milestone, hoặc human yêu cầu.
- `.context/TENSIONS_HISTORY.md` không load mặc định. Chỉ đọc khi audit quyết định cũ, migrate tension, hoặc human yêu cầu.
- Folder structure giúp human đọc đỡ rối; startup protocol trong `AGENTS.md` mới là source of truth cho agent load order.

### Encoding rules

- Context, docs, PHP, CSS, JS/TS, JSON, and HTML files must remain UTF-8.
- Do not save text files through a tool path that turns Vietnamese or punctuation into mojibake.
- In PowerShell, read/write text explicitly as UTF-8 when touching context/docs, for example `Get-Content -Encoding UTF8` and .NET `UTF8Encoding(false)` for bulk rewrites.
- If mojibake appears after reading a file, stop and fix encoding before making semantic edits.

### CSS layout safety — Bắt buộc

Trước mọi task thêm/sửa CSS layout (`width`, alignment, margin âm, viewport
unit, overflow, grid/flex, absolute positioning, header/footer), agent PHẢI đọc:

`docs/standards/css-layout-safety-contract.md`

### CSS block extension safety — Bắt buộc

Trước mọi task viết CSS cho **Gutenberg block extension** (PHP filter `render_block_*`
+ `editor.BlockEdit` / `editor.BlockListBlock`), agent PHẢI đọc:

`docs/standards/gutenberg-block-extension-css-contract.md`

Quy tắc tóm tắt (không thay thế việc đọc doc):

- **Specificity trước, CSS sau**: check theme rule mạnh nhất cho element trước khi viết
  consuming rule. Plugin rule phải ≥ specificity đó — dùng scoped class trên wrapper.
- **Editor DOM ≠ Frontend DOM**: `editor.BlockListBlock` inject class vào outer wrapper,
  không phải vào `.wp-block-button`. Selector editor CSS phải dùng cấu trúc
  `.has-scoped-class .wp-block-button .link:hover`, không phải `.wp-block-button.has-scoped-class`.
- **Bundle boundary**: không enqueue plugin bundle cho feature CSS nhỏ — dùng
  `wp_add_inline_style` với handle riêng có dependency vào theme stylesheet.
- **`editor.BlockEdit` ≠ `editor.BlockListBlock`**: `BlockEdit` chỉ inject Inspector panel;
  `wrapperStyle` build trong `BlockEdit` là dead code — gắn vars qua `BlockListBlock`.
- **Pivot phải atomic**: bỏ cơ chế specificity cũ phải kèm replacement trong cùng commit.

Quy tắc tóm tắt:

- Layout width phải có đúng một owner: page canvas, content wrapper, hoặc component.
- Nếu SKVN canvas đã full width, `.alignfull` dùng `width: 100%`; không tự tạo
  thêm full-bleed bằng `100vw` và margin `50vw`.
- Không dùng `overflow-x: hidden/clip` để che geometry đang tràn.
- Mọi viewport-width rule mới phải có rationale và được prove bằng
  `getBoundingClientRect()` khi scrollbar dọc đang hiện.
- Trước submit phải audit `100vw`, `50vw`, viewport units, và `overflow-x`
  trong layout path bị ảnh hưởng.

---

## 2. Architecture — Biết rõ trước khi code

### Boundary rules

| Thuộc về | Layer | Ví dụ |
|---|---|---|
| `skvn-marine/` | Theme | Visual system, design tokens, block styles, patterns, WooCommerce visual override, animation runtime, media helpers |
| `skvn-marine-blocks/` | Plugin | Custom Gutenberg blocks có logic: slider, accordion, product-collection, post-collection |
| External plugins | Không touch | WooCommerce, CF7, CFDB7, Rank Math, Polylang, n8n |
| GeneratePress | Không touch tuyệt đối | `themes/generatepress/**` |

**Rule quyết định nhanh**: nếu thay theme mà feature bị mất → feature thuộc plugin.

### Marine Blocks — human decision 2026-11-04

- Định vị: bộ block chuyên dụng và patterns giúp dựng, chỉnh sửa, bàn giao website nhanh; không hướng tới supercharge toàn bộ FSE. Ưu tiên core blocks/patterns, custom block khi cần dữ liệu/tương tác/UX biên tập chuyên dụng. Không tự mở lại query ownership của Collection.
- Plugin có styling/runtime riêng, hoạt động độc lập với WindPress và theme SKVN. Website được dùng WindPress/Tailwind enhance core blocks/patterns; không coi đây là hai lựa chọn loại trừ nhau. Layout/style trên mỗi surface phải có owner rõ ràng.
- Identity đích: Marine Blocks; slug/text domain `marine-blocks`, block namespace `marine-blocks/*`, PHP functions `marine_blocks_*`, constants `MARINE_BLOCKS_*`, plugin CSS `marine-blocks-*`, variables `--marine-blocks-*`.
- Theme giữ identity `skvn-marine`, PHP `skvn_marine_`, CSS/tokens theme. Có thể cập nhật điểm gọi API plugin khi migrate, không đổi thương hiệu theme.
- Human xác nhận 2026-11-04: **1.4.0 — Marine Blocks Migration**; Setup UI cũ 1.4.0 → 1.4.1, Layout/Quote Validation cũ 1.4.1 → 1.4.2, giữ acceptance. Version đã chốt, chưa start; current vẫn 1.3.18. Trước migration giữ naming source hiện hành.
- Replace hàng loạt chỉ theo inventory plugin/theme/shared. Hàm nội bộ có thể đổi đồng bộ; wrapper chỉ cần cho consumer chưa chuyển. Saved blocks/markup, option/meta keys phải có compatibility hoặc migration riêng; không global replace `skvn` trong repo/DB.
- Identity GU Supercharger và mục tiêu full-FSE bị thay thế. Migration sớm hơn không tự thay public-launch gate sau 1.5.x, reset version về 0.0.1, hoặc hủy acceptance/milestone cũ.
- Source of truth: `.context/planning/047_VER_1_4_0_MARINE_BLOCKS_MIGRATION_PLANNING.md`.

### Naming — source hiện hành trước migration 1.4.0

```
Theme slug:         skvn-marine
Plugin slug:        skvn-marine-blocks
Block namespace:    skvn-marine
Theme text domain:  skvn-marine
Plugin text domain: skvn-marine-blocks
Theme PHP prefix:   skvn_marine_
Plugin PHP prefix:  skvn_marine_blocks_
CSS prefix:         skvn-
```

### Product language — Plugin English first

- Giao diện sản phẩm của plugin (tên block, Inspector, admin/settings, nút, nhãn, mô tả, trạng thái, thông báo và văn bản mặc định hiển thị ở frontend) dùng **tiếng Anh** làm ngôn ngữ gốc.
- Không đưa tiếng Việt vào UI mới như bản dịch tạm hoặc trộn hai ngôn ngữ trong cùng một luồng. Tài liệu nội bộ và trao đổi với human vẫn có thể viết tiếng Việt.
- Chuỗi hiển thị phải sẵn sàng cho i18n bằng API dịch WordPress và text domain `skvn-marine-blocks` ở nơi áp dụng; khóa attribute, enum, option và dữ liệu đã lưu không dịch theo ngôn ngữ hiển thị.
- Tiếng Việt là giai đoạn bản địa hóa sau, triển khai bằng bản dịch khi có scope và nghiệm thu riêng; quy tắc này không tự kích hoạt Polylang hoặc đổi milestone hiện tại.

### PHP security — Không thương lượng

```php
// Input — luôn sanitize
$product_id = isset($_GET['product_id']) ? absint($_GET['product_id']) : 0;
$sku        = isset($_GET['sku']) ? sanitize_text_field(wp_unslash($_GET['sku'])) : '';

// Output — luôn escape
echo esc_html($title);
echo esc_attr($value);
echo esc_url($url);
echo wp_kses_post($content);
```

---

## 3. Workflow — Mỗi Task

```
1. Load context (GLOBAL → MILESTONES → TENSIONS_OPEN → TENSIONS_ACTIVE → module)
2. Đọc [manual] của module — hiểu constraints và invariants
3. Nếu [manual] còn placeholder → DỪNG, hỏi lại
4. Detect tensions (xem Section 4)
5. Nếu tension HIGH → generate `TENSIONS_OPEN.md` entry → DỪNG, chờ quyết định
6. Nếu tension LOW hoặc không có → tiếp tục
7. Route response (xem **Agent response routing** bên dưới) — code ngay, hỏi kiến trúc, hoặc giải thích khi human yêu cầu
8. Implement — follow coding standards bên dưới (plan chi tiết chỉ bắt buộc khi routing = `ASK_ARCHITECTURE` hoặc human chưa chọn hướng)
9. Self-check (xem checklist cuối file)
10. Update .context/ nếu có quyết định mới
11. Chỉ khi human chuyển version/milestone mới, update `AGENTS.md` + `.context/MILESTONES.md`, move milestone cũ sang `.context/MILESTONES_HISTORY.md`, và move tension `RESOLVED_ACTIVE` của milestone cũ khỏi `.context/TENSIONS_ACTIVE.md` sang `.context/TENSIONS_HISTORY.md` với `Status: ARCHIVED`
12. Nếu task thêm/đổi PHP runtime `require`/`include`, update deploy artifact packaging và verify zip chứa file/folder runtime tương ứng
```

### Sau khi implement xong

```bash
# Theme PHP syntax check
php -l wp-content/themes/skvn-marine/functions.php

# Plugin build + PHP lint (combined — chạy sau mỗi lượt làm việc có thay đổi plugin)
source /home/shinkuro/.nvm/nvm.sh && nvm use 20 && cd /mnt/d/Github/skvn-marine/wp-content/plugins/skvn-marine-blocks && npm run build && find modules/ -name "*.php" -exec php -l {} \;

# Kiểm tra block nếu thay đổi block registration
grep -r "registerBlockType" wp-content/plugins/skvn-marine-blocks/src/

# Nếu thay đổi runtime PHP require/include hoặc thêm module plugin
node tools/build-deploy-artifact.mjs
bash tools/package-plugin-zip.sh
unzip -l build/skvn-marine-blocks.zip | grep 'skvn-marine-blocks/modules/'
```

> Cuối mỗi lượt làm việc có thay đổi plugin, agent phải **output lệnh trên dưới dạng text** để user tự copy và chạy. Agent không được tự chạy lệnh build hoặc lint qua tool.

### Command responsiveness — Bắt buộc

- Nếu một command không trả output, không kết thúc trong thời gian quan sát hợp
  lý, hoặc bị tool timeout, agent phải **DỪNG ngay**.
- Không tự retry command đó.
- Không chạy thêm bản command thứ hai.
- Không poll process, `sleep` rồi kiểm tra lặp lại, hoặc tiếp tục chờ vô hạn.
- Agent phải báo human ngay và đưa nguyên command chính xác để human chạy thủ
  công.
- Rule này áp dụng cho mọi command, đặc biệt là command giao tiếp với WSL,
  `npm run build`, WP-CLI, server, database, packaging, và deploy tooling.
- Với WSL: nếu command không phản hồi hoặc timeout một lần, ưu tiên bàn giao cho
  human vì human thao tác terminal trực tiếp nhanh và đáng tin cậy hơn.
- Agent chỉ được chạy lại sau khi human cung cấp output hoặc yêu cầu rõ ràng
  agent thử lại.

### Agent response routing — Bắt buộc

Sau khi load context, agent **không** mặc định viết plan dài rồi chờ approve. Chọn
một trong ba mode:

| Mode | Khi nào | Agent làm gì |
|---|---|---|
| **`CODE_NOW`** | Human chỉ đường implement rõ (`theo E`, `làm T-1 A+C1`, `fix`, `implement`, đã chọn phương án A/B/C) | Đọc context → sửa source ngay → self-check → báo human chạy build/test. Plan trong response **ngắn** (files + mục tiêu), không chặn bằng “chờ approve”. |
| **`ASK_ARCHITECTURE`** | Nhiều hướng hợp lệ, boundary theme/plugin chưa rõ, HIGH tension, hoặc human hỏi *nên làm thế nào / so sánh* | Chỉ hỏi hoặc trình bày trade-off **kiến trúc & phạm vi** — **không** sửa file. Chờ human chọn hướng rồi chuyển `CODE_NOW`. |
| **`EXPLAIN`** | Human hỏi *giải thích kỹ*, *tại sao*, *T2 là gì*, audit/review only | Giải thích đủ sâu; **không** code trừ khi human nói tiếp “làm luôn” / chọn phương án. |

**Quy tắc nhanh:**

- Có **một** hướng đã được human chọn → `CODE_NOW` (không hỏi lại “bạn có muốn implement không?”).
- Human hỏi **so sánh phương án** (ví dụ `B vs A+C`) → `ASK_ARCHITECTURE` hoặc `EXPLAIN`; chưa code.
- Human giao **audit / đọc codebase** → báo cáo compact theo domain; chỉ code khi human giao fix cụ thể hoặc milestone checklist.
- Human giao **ghi milestone / standard / protocol** → cập nhật `.context/` hoặc `docs/standards/` ngay (`CODE_NOW` cho docs).
- `[manual]` còn placeholder, tension HIGH, hoặc đụng `themes/generatepress/` → **DỪNG** (không thuộc ba mode trên).

`CLAUDE.md` Work Plan Rule: coi là đã satisfy khi (a) human đã approve hướng trong cùng thread, hoặc (b) routing = `CODE_NOW` với chỉ thị implement rõ. Plan dài + chờ approve chỉ khi routing = `ASK_ARCHITECTURE` hoặc scope còn mơ hồ.

### Block/UI review — ba nhóm và hai lớp xuyên suốt

Human chốt phương pháp 2026-10-14. Trước audit/review/planning hoặc implementation block/UI liên quan frontend, editor hoặc runtime, đọc:

`docs/standards/block-ui-editor-ux-technical-review-contract.md`

- Xem xét riêng **Block UI (frontend UI/UX), Editor UX, Technical**.
- Mỗi yêu cầu có **Content & States** (dữ liệu/trạng thái) và **Acceptance & Evidence** (cách kiểm/bằng chứng). Accessibility, responsive, performance áp vào từng nhóm/surface liên quan.
- Ghi theo mẫu: `ID → Nhóm → Hành vi mong đợi → Hiện trạng → Việc cần sửa → Cách kiểm → Evidence`.
- Trạng thái yêu cầu: **Chưa làm / Đã có source / Chờ kiểm chứng / PASS / FAIL / Deferred**. Có source hoặc design approval không đồng nghĩa runtime PASS; không dùng DONE chung cho triển khai và nghiệm thu.
- Task hẹp được ghi ngắn, nhóm không liên quan ghi N/A kèm lý do; không mở scope mới chỉ để đủ bảng. Không bỏ acceptance cũ vì đổi format.
- Khi lưu planning/giải thích cho human, giữ rationale, giới hạn, proposal còn mở/superseded để tài liệu tự đọc được, không phụ thuộc chat.
- Transition Rule giữ hiệu lực: acceptance DONE phải có kiểm chứng/approval cần thiết, smoke và human approve chuyển mốc; không tự thay status lịch sử hoặc taxonomy tensions.
### Agent + Human collaboration — Bắt buộc

- Workflow của project này là **agent phối hợp với human**, không phải agent tự
  làm mọi thứ bằng mọi giá.
- Agent chịu trách nhiệm đọc context, phân tích, sửa source, chuẩn bị test,
  kiểm tra phần có thể kiểm tra nhanh và đưa hướng dẫn/lệnh chính xác.
- Human có thể chạy terminal/WSL, thao tác WordPress onsite, quan sát UI, cung
  cấp screenshot/log/output, hoặc thực hiện bước nào human làm nhanh và đáng
  tin cậy hơn.
- Khi nhận ra human có thể hoàn thành một bước nhanh hơn, agent phải bàn giao
  sớm với command hoặc checklist rõ ràng; không kéo dài bằng retry, polling,
  automation phức tạp, hoặc tự debug môi trường vô hạn.
- Nhờ human thực hiện một bước phù hợp là workflow bình thường, không phải task
  failure hay phương án cuối cùng.
- Sau khi human trả output/evidence, agent tiếp tục từ kết quả đó; không bắt
  human lặp lại context hoặc công việc đã hoàn thành.
- Agent phải nói rõ:
  - agent đã làm gì;
  - human cần chạy/check gì;
  - output/evidence nào cần gửi lại;
  - agent sẽ tiếp tục phần nào sau khi nhận kết quả.
- Các bước cần credential, quyết định sản phẩm, onsite visual judgment, hoặc
  terminal tương tác ưu tiên phối hợp với human thay vì agent tự suy đoán.

### Decision Memo — Bắt buộc khi xin human quyết định

Human quyết định trên bằng chứng, không quyết trên lời khai. Mọi lần agent cần human
quyết (tension, `ASK_ARCHITECTURE`, milestone approval, scope change, dependency mới),
agent phải trình theo format 7 mục — bản đầy đủ + ví dụ:
`docs/standards/decision-memo-format.md`.

```text
1. Vấn đề (1 câu)
2. Phương án (2–3, mỗi cái kèm trade-off)
3. Khuyến nghị + lý do
4. Bằng chứng (artifact nhìn được: commit/file:line/screenshot/số đo)
5. Tự kiểm chứng (nguồn + file + xem gì — human research độc lập ≤10 phút)
6. Đảo ngược (2 chiều → quyết nhanh | 1 chiều → cần evidence dày)
7. Default nếu human không quyết trước [mốc] (conservative; quyết định chặn/HIGH → DỪNG)
```

Quy tắc kèm theo:

- Không điền được mục 4–5 = chưa đủ tư cách hỏi; quay lại research.
- Khẳng định về behavior thư viện ngoài phải cite docs/changelog **đúng major version**
  trong `package.json`; kiến thức tổng quát không đủ điều kiện làm premise cho
  invariant/decision doc.
- Fix nào lật đổ premise trong decision doc thì update doc đó **trong cùng đợt fix** —
  docs sai dẫn đường sai cho mọi agent load context sau.

### Onsite-first UX/runtime testing

Current operational rule:

- Local runtime may not contain the same editor-created pages/content as the onsite WordPress site.
- If a page exists onsite but not local, do not treat the local missing page as source failure.
- For UX, page-content, CF7, CFDB7, and onsite runtime checks, agent must create or update a test `.md` file under `docs/testing/`.
- Test `.md` must state:
  - target URL/page
  - setup/preconditions
  - exact test steps
  - expected UX/visual behavior
  - pass/fail criteria
  - evidence human should report back: screenshots, submission ID/time, CFDB7 row, email status, console/log notes
- Agent should use human onsite feedback to debug source/theme/plugin issues.
- If human defers onsite tests because of schedule, agent must mark the test file as deferred and add the target milestone to `.context/MILESTONES.md`.
- When the target milestone becomes current, agent must remind human to run the deferred tests before implementing unrelated follow-up work.
- Agent must not assume onsite credentials or make production changes unless human explicitly requests it.
- n8n remains deferred/unexposed and should be reviewed only at the V1 → V2 boundary unless human explicitly moves it into scope earlier.

---

## 4. Tension Detection

Ghi tension khi phát hiện conflict giữa task yêu cầu và constraint đã có trong `[manual]`.

### Format ghi vào `.context/TENSIONS_OPEN.md`

```markdown
## [YYYY-MM-DD HH:MM] | [module]
Tension:    Mô tả conflict ngắn gọn
Context:    Đang làm task gì
Proposal:   Agent muốn làm gì
Constraint: [manual] rule nào conflict (quote lại)
Severity:   low | high
Tags:       tag-one, tag-two
Milestone:  V1 / 0.x.0
Evidence:   [artifact nhìn được chứng minh tension có thật — optional nhưng nên có]
Default:    [severity low: phương án conservative + mốc nếu human không quyết. Severity high: luôn ghi "DỪNG chờ human"]
Status:     OPEN
Resolved:
Decision:   OPEN
```

Agent không được parse `Decision` để suy ra state. Chỉ dùng `Status`.
`Evidence` và `Default` là field mở rộng (2026-07-12, theo Decision Memo format —
`docs/standards/decision-memo-format.md`); entry cũ thiếu 2 field này vẫn hợp lệ.

Allowed `Status`: `OPEN`, `RESOLVED_ACTIVE`, `ARCHIVED`.

Allowed `Severity`: `low`, `high`.

Tag taxonomy hiện tại:

```text
agent
a11y
blocks
editor-governance
map
milestone
multilingual
patterns
php
planning
product-data
quote-flow
schema
slider
spam-protection
tailwind
theme
woocommerce
```

Khi cần tag mới, update taxonomy trong file này trước khi dùng.

### Routing

```
Severity LOW  → ghi tension → tiếp tục theo hướng conservative → báo human review sau
Severity HIGH → ghi tension → DỪNG task → chờ human fill Decision
```

### Tension files và archive

`.context/TENSIONS_OPEN.md` chỉ chứa `Status: OPEN`.

`.context/TENSIONS_ACTIVE.md` chỉ chứa `Status: RESOLVED_ACTIVE` của milestone hiện tại.

`.context/TENSIONS_HISTORY.md` chỉ chứa `Status: ARCHIVED`.

Khi human resolve một OPEN tension, agent move entry từ `TENSIONS_OPEN.md` sang `TENSIONS_ACTIVE.md`, set `Status: RESOLVED_ACTIVE`, set `Resolved: YYYY-MM-DD`, và ghi decision.

Khi human tuyên bố chuyển sang version/milestone mới, agent phải move các entry `Status: RESOLVED_ACTIVE` của milestone cũ sang `.context/TENSIONS_HISTORY.md`, đổi `Status: ARCHIVED`.

Không load `.context/TENSIONS_HISTORY.md` mặc định khi bắt đầu task. Chỉ đọc history khi cần audit quyết định cũ hoặc human yêu cầu.

`Status: OPEN` luôn đọc đầy đủ, không filter theo tag. `TENSIONS_ACTIVE.md` được đọc với tag filter: entries match task tag đọc đầy đủ; entries không match chỉ đọc title/status/tags. Nếu không chắc, đọc đầy đủ.

Milestone checklist và trigger chuyển mốc được quản lý trong `.context/MILESTONES.md`. Khi chuyển milestone, milestone cũ phải được archive sang `.context/MILESTONES_HISTORY.md`.

### Ví dụ triggers tension

| Situation | Severity |
|---|---|
| Task yêu cầu sửa file trong `themes/generatepress/` | HIGH |
| Task muốn custom-code quote form handler thay CF7 | HIGH |
| Task muốn thêm animation logic riêng trong block, bỏ qua shared runtime | LOW |
| Task muốn đặt custom block trong theme folder | HIGH |
| Task muốn rename prefix/namespace ngoài migration đã duyệt | HIGH |
| Task muốn add dependency không có rationale | LOW |
| Không chắc feature thuộc theme hay plugin | LOW |

---

## 5. Coding Standards

### PHP (Theme)

- WordPress Coding Standards mindset
- Sanitize input, escape output — luôn luôn
- Prefix mọi function: `skvn_marine_`
- Không dùng `@` để suppress errors
- `filemtime()` cho asset versioning
- Không dùng Composer/PHPCS trong V1 nếu làm chậm dev

### TypeScript / JavaScript (Plugin blocks)

- TypeScript cho tất cả block logic
- @wordpress/scripts build pipeline
- ESLint/Prettier optional V1, expected V2
- Shared animation runtime — KHÔNG tạo animation logic riêng per block
- Swiper chỉ dùng cho slider block
- IntersectionObserver cho scroll reveal

### Gutenberg / Block

- Block attributes định nghĩa rõ trong `block.json`
- Sidebar controls thay vì raw class input cho marketing users (V3 goal)
- Editor view KHÔNG set `opacity: 0` cho reveal elements nếu không có safe fallback
- Slider editor: stacked preview hoặc simplified — KHÔNG run Swiper autoplay trong editor
- Keyboard navigation bắt buộc cho accordion và slider

### Animation

- Tất cả animation phải check `prefers-reduced-motion`:

```javascript
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReduced) { /* run animation */ }
```

---

## 6. Module-Specific Rules

### Theme: `inc/media.php`

- `skvn_marine_auto_set_image_alt_from_title()` — chỉ fill khi ALT empty
- KHÔNG overwrite ALT đã có
- KHÔNG auto-generate caption trong V1

### Theme: `inc/enqueue.php`

- Dùng `filemtime()` cho versioning
- Conditional load: Swiper chỉ load khi có slider block trên page
- Block assets: load via block.json `viewScript`, không global

### Plugin: Slider / Slide

- Swiper config qua block attributes (autoplay, delay, loop, arrows, dots, effect, slidesPerView)
- Editor: render slides stacked (không run Swiper carousel trong editor)
- Keyboard nav: Swiper `keyboard: { enabled: true }`
- Pause on hover: `autoplay.pauseOnMouseEnter: true`

### Plugin: Product Grid / Product List

- Dùng WooCommerce native query — KHÔNG custom SQL trực tiếp
- V1 / 1.3.3: human-approved dynamic collections milestone replaces the old
  V2-only deferral for custom product/post collection surfaces.
- Build custom dynamic SKVN blocks as `skvn-marine/product-collection` and
  `skvn-marine/post-collection`, with editor-facing variations Product Grid,
  Product Carousel, Post Grid, and Post Carousel.
- Product collection uses WooCommerce/native APIs under the hood; Post
  collection uses WordPress native APIs.
- Store query/layout/action attributes only; do not store product/post card
  snapshots in saved content.
- Grid and Carousel are layout modes. Product/Post remain the query owners.
- Carousel may reuse Slider/Swiper adapter and shared pause/reduced-motion
  policy. Grid must not load carousel runtime.
- Do not depend on WooCommerce experimental Product Collection extension APIs as
  the SKVN source of truth in V1.
- Product attribute query, Product Taxonomy Collections admin, grouped taxonomy
  navigation, faceted filters, archive builder, and universal CPT collection are
  deferred to 2.x.x or later unless human explicitly changes scope.
- Mobile: CTA (Request a Quote) luôn visible, KHÔNG chỉ hiện khi hover

### Page Display / Sidebar Controls

- Completed in 0.5.1: page-level controls for hiding site header/footer and other safe editor/sidebar controls for marketing-owned pages.
- Header/footer visibility belongs to the theme layer because it controls GeneratePress visual/layout output.
- Prefer page-level editor/sidebar toggles over raw class input.
- Do not add a header/footer builder plugin in V1 unless human explicitly changes dependency policy.
- Do not edit GeneratePress parent theme.

### SKVN Editor Controls

- 0.8.0 scope: token-governed sidebar controls for SKVN-owned Gutenberg blocks and translated layout surfaces.
- Theme owns tone, spacing, width, radius, shadow, and visual classes.
- Plugin owns block sidebar UI, block attributes, saved markup, and interactive block behavior.
- Controls should be grouped into Content, Style, Layout, and Advanced sections.
- No raw class input, raw hex/rgb/hsl values, or arbitrary inline spacing values should be required for marketing editors.
- Resolve the OPEN slider editor UX tension before implementing slider-specific controls.

### Footer Page Settings

- 0.9.0 scope: plugin settings page stores `skvn_footer_page_id`; theme renders the selected footer page through GeneratePress' `generate_footer` surface.
- Implement 0.9.0 footer settings as a migration-ready module inside the current `skvn-marine-blocks` plugin until the **post-1.5.x product launch**.
- **Human updated 2026-11-04:** identity Marine Blocks; migration planned 1.4.0 (SemVer đã xác nhận, chưa start), source giữ tên cũ tới migration. Public launch sau 1.5.x là gate riêng; xem plan 047 và launch decision đã chú thích supersession.
- GU/Gutenberg Supercharger và Remap là hướng tên lịch sử bị Marine Blocks thay thế; chưa chốt tên commercial stage riêng.
- Footer settings may use a module-shaped folder such as `modules/footer-settings/` or `includes/modules/footer-settings/` inside `wp-content/plugins/skvn-marine-blocks/`.
- Keep current plugin slug, text domain, and option key: `skvn-marine-blocks`, `skvn-marine-blocks`, and `skvn_footer_page_id`.
- Do not rename namespaces, option keys, plugin headers, build entrypoints, or activation path for 0.9.0.
- Theme render code belongs in `wp-content/themes/skvn-marine/inc/footer.php`.
- Fallback to the default GeneratePress footer when no valid footer page is selected.
- Do not introduce a custom CPT.
- Do not introduce display rules.
- Do not remove or replace GeneratePress.

### Quote Flow / Quote UI

- URL pattern: `/request-a-quote/?product_id=123`
- Quote UI/page surface completed in V1 / 0.6.0.
- 0.7.0 scope: basic same-site CF7/CFDB7 quote form source/docs contract.
- 0.7.1 prepared runtime/admin handoff testing.
- Remaining quote data-flow checks are deferred to V1 / 1.1.2 because the CF7 interface is visually OK, but form submission, CFDB7 storage, hidden/context data, product-page/block origin, and success/thank-you behavior still need testing.
- n8n automation remains deferred/unexposed and should be reviewed only at the V1 → V2 boundary unless human explicitly moves it into scope earlier.
- Do not custom-code quote form handling; use CF7 and CFDB7.
- CF7 markup must use class `skvn-form`, `skvn-quote-form`, `skvn-button`, `skvn-button--primary`.
- Hidden fields: `product_id`, `product_sku`, `product_name`, `product_url`, `source_url`, UTM fields.
- Future n8n webhook: hard-to-guess URL + optional shared secret header. KHÔNG expose unprotected.

---

## 7. AI Task Format

Mỗi task đưa cho AI nên có đủ 6 phần:

```markdown
## Context
[Load từ .context/ hoặc mô tả ngắn]

## Goal
[1-2 câu: làm gì]

## Files allowed to change
[List cụ thể]

## Files forbidden to change
[Luôn include: themes/generatepress/**]

## Acceptance checklist
- [ ] PHP syntax ok
- [ ] No fatal errors
- [ ] Sanitize/escape đầy đủ
- [ ] Prefix đúng
- [ ] .context/ updated nếu có decision mới

## Tensions / Conflicts
[Ghi nếu biết trước có conflict, để agent xử lý đúng]
```

---

## 8. Self-Check Trước Khi Submit

```
[ ] Không sửa themes/generatepress/
[ ] Không rename namespace/prefix ngoài migration đã duyệt; theme identity giữ nguyên
[ ] Không đặt block logic trong theme
[ ] Input sanitized, output escaped
[ ] Đã đọc `docs/standards/security-guidelines.md` nếu task chạm output path (option, block attr, URL, inline CSS, tools IO)
[ ] `get_option()` / block attributes trên output path có sanitize-at-read (không chỉ lúc save)
[ ] Block public href/src/inline style dùng PHP `render_callback` hoặc escape filter đã document
[ ] Không dùng `$_SERVER['HTTP_HOST']` cho trusted URL (quote context, redirect, canonical)
[ ] Animation có prefers-reduced-motion guard
[ ] Editor không hide content với opacity: 0
[ ] CSS layout task đã đọc `docs/standards/css-layout-safety-contract.md`
[ ] Layout width có một owner; không duplicate GP/Gutenberg/SKVN full-width calculation
[ ] Viewport units/margin âm mới có rationale và geometry test với scrollbar dọc
[ ] `overflow-x` không được dùng để che bounding box sai
[ ] Block extension CSS task đã đọc `docs/standards/gutenberg-block-extension-css-contract.md`
[ ] Specificity plugin rule ≥ theme rule mạnh nhất cho element target (check DevTools trước khi viết)
[ ] Scoped class thêm đúng element (PHP: cùng element với vars; Editor: outer wrapper)
[ ] Editor CSS selector dùng `.has-class .wp-block-* .link` (không phải `.wp-block-*.has-class`)
[ ] Feature CSS dùng handle riêng + `wp_add_inline_style`, không enqueue bundle chung
[ ] `editor.BlockListBlock` cho wrapperProps — không build wrapperStyle trong `editor.BlockEdit`
[ ] Test block extension: mockRenderFunction assert HTML output, không chỉ grep PHP source
[ ] Image ALT: chỉ fill khi empty, không overwrite
[ ] Dependency mới có rationale
[ ] Files sửa ≤ 5 (hoặc có lý do nếu hơn)
[ ] TENSIONS_OPEN.md updated nếu có conflict phát sinh
[ ] TENSIONS_ACTIVE.md updated nếu human resolve tension trong milestone hiện tại
[ ] context-gen check-consistency . passed
[ ] MILESTONES.md updated nếu milestone checklist/status thay đổi
[ ] Chỉ archive resolved tensions khi human chuyển version/milestone mới
[ ] .context/modules/<module>.md updated nếu có decision mới
```

---

## 9. Versioning Milestones (để biết scope hiện tại)

| Version | Scope |
|---|---|
| 0.1.0 | Child theme skeleton |
| 0.2.0 | Design system, block styles, patterns |
| 0.3.0 | Slider/Slide block |
| 0.4.0 | Woo product grid/list |
| 0.5.0 | SKVN Full Width layout |
| 0.5.1 | Page display and sidebar controls |
| 0.6.0 | Quote UI and editor controls |
| 0.7.0 | Basic CF7/CFDB7 quote form |
| 0.7.1 | Quote Flow runtime verification and handoff |
| 0.8.0 | SKVN Editor Controls |
| 0.9.0 | Footer Page Settings |
| 0.10.0 | Onsite test debt resolution |
| 0.11.0 | SKVN Marine Admin Menu |
| 1.0.0 | V1 launch-ready |
| 1.1.0 | Layout Blocks |
| 1.1.2 | Product Quote Flow & Map Block Testing |
| 1.2.0 | Slider Editor & Motion |
| 1.2.1 | SKVN Slider Presets & Inserter |
| 1.2.3 | SKVN Feature Showcase |
| 1.2.9 | Slider & Motion Onsite QA |
| 1.3.0 | Slider Dynamic Rendering Architecture |
| 1.3.1 | Slider Navigation & Pagination Controls UX |
| 1.3.2 | Feature Showcase Autoplay And Panel Links |
| 1.3.3 | Dynamic Product And Post Collections |
| 1.3.4 | Core Control Foundation & Core Button Hover |
| 1.3.5 | Post, Product & Archive Page Improvements |
| 1.3.7 | Collection Block UI & Card Styles |
| 1.3.8 | Slider Parallax |
| 1.3.9 | Custom Icon Upload |
| 1.3.10 | Fullscreen Step Slider |
| 1.3.11 | Comprehensive Onsite QA (Slider, Collections & Controls) |
| 1.3.12 | SKVN Team Credits Easter Egg |
| 1.3.16 | Comprehensive Testing (1.3.x Feature QA) |
| 1.4.1 | SKVN Theme Init Setup UI |
| 1.4.2 | Layout Blocks Validation & Quote Evaluation |
| 1.5.0 | Woo Catalog Plugin |
| 1.6.0 | SKVN Surface Presets |
| 1.7.0 | Front page trang Chuyển đổi số |
| 1.4.0 | Marine Blocks Migration — planned, chưa start |
| Post 1.5.x | Marine Blocks Public Launch — version riêng cần xác nhận |

### Version naming rules

- Version dùng SemVer: `MAJOR.MINOR.PATCH`.
- `MAJOR` tăng khi đổi phase lớn hoặc đổi kiến trúc/phạm vi sản phẩm lớn, ví dụ `1.x.x` → `2.0.0`.
- `MINOR` tăng khi thêm feature/scope mới nhưng vẫn cùng major, ví dụ `1.0.0` → `1.1.0`.
- `PATCH` tăng khi fix, hardening, hoặc integration nhỏ trong cùng minor, ví dụ `0.5.0` → `0.5.1`.
- Version launch-ready của một major là `MAJOR.0.0`, ví dụ `1.0.0` là V1 launch-ready, `2.0.0` là V2 launch-ready.
- Không dùng nhãn kiểu `1.0.0 Prep` cho feature mới. Nếu là prep trước launch, nó phải nằm trong milestone trước launch hoặc ghi `Future Candidate`.
- Future planning phải ghi đúng target version dự kiến. Nếu chưa chắc version, ghi `Future Candidate` thay vì tự gán version.
- Tên file planning phải khớp version chính trong nội dung. Ví dụ planning cho `1.1.0` dùng dạng `001_VERSION_1_1_0_<TOPIC>_PLANNING.md`; planning cho `2.0.0` dùng dạng `002_VERSION_2_0_0_<TOPIC>_PLANNING.md`.
- Không đổi tên planning file hoặc milestone version nếu chưa có human xác nhận.
- Khi đổi version/milestone thật, phải update đồng bộ `AGENTS.md`, `.context/MILESTONES.md`, và file planning/docs liên quan.
- `.context/MILESTONES.md` là planning/scope source of truth, không tự động bump WordPress theme/plugin release headers.
- Khi human bắt đầu milestone mới, có thể chạy `node tools/bump-project-version.mjs <version>` rồi rebuild plugin assets để working build hiển thị đúng milestone version trong WordPress admin.
- Trước khi package/deploy milestone release, verify lại bằng `node tools/bump-project-version.mjs <version>` rồi rebuild plugin assets.
- Nếu milestone thêm/đổi PHP runtime `require`/`include`, chạy deploy artifact runtime file audit trước khi zip/upload.
- Release version sync phải cập nhật theme `style.css`, plugin main header, plugin `package.json` / `package-lock.json`, và block metadata versions.

---

## 10. Không thuộc phạm vi V1

- Quote cart, multi-product quote table
- Advanced product filtering
- Popup/modal làm primary quote flow
- Polylang activation (chỉ prepare)
- Composer/PHPCS strict enforcement
- Redis / CDN
- GitHub Actions CI/CD
- Technical Product Card với specs table
- Custom CPT cho product

---

## 11. Dev Repo vs WordPress Runtime — Không được nhầm

Repo này (`D:\Github\skvn-marine`) là **source repo để dev**, KHÔNG phải WordPress runtime root.

WordPress runtime root nghĩa là **thư mục cài WordPress đầy đủ để chạy/test website**, ví dụ thư mục có `wp-admin/`, `wp-includes/`, `wp-content/`, `wp-config.php`. Với người không quen technical wording, có thể hiểu đơn giản là: **thư mục chứa toàn bộ bộ cài WordPress của site local/test**.

Nếu có file `.local/ENVIRONMENT.md`, agent phải đọc file đó để biết path môi trường local của máy hiện tại.

Nếu chưa có `.local/ENVIRONMENT.md` và task cần thao tác với WordPress runtime (cài/activate plugin, test theme/plugin, chạy WP-CLI trên site), agent PHẢI hỏi human cung cấp WordPress runtime root trước. Khi hỏi, nói rõ đây là **đường dẫn tới thư mục cài WordPress đầy đủ của site local/test**, không phải source repo theme/plugin. Sau khi human cung cấp path, agent PHẢI tạo `.local/ENVIRONMENT.md` và ghi lại:

```text
WP_RUNTIME_ROOT_WINDOWS=...
WP_RUNTIME_ROOT_WSL=...
```

File `.local/ENVIRONMENT.md` là machine-local, đã được git ignore, KHÔNG commit.

### Local dev runtime — máy hiện tại

Thông tin chi tiết của máy hiện tại nằm trong `.local/ENVIRONMENT.md`. File này local-only, có thể chứa credential, KHÔNG commit.

Agent phải đọc `.local/ENVIRONMENT.md` trước khi chạy WP-CLI, bật server, hoặc chạy build local.

Local hiện tại:

```text
Source repo Windows: D:\Github\skvn-marine
WP runtime Windows:  D:\Github\minhhaifish
WP runtime WSL:      /mnt/d/Github/minhhaifish
WSL distro:          Debian
WSL user:            shinkuro
WP URL:              http://localhost:8080
WP admin:            http://localhost:8080/wp-admin/
```

Toolchain đã cài trong WSL Debian:

```text
PHP:      /usr/bin/php — 8.4.21
WP-CLI:   /usr/local/bin/wp — 2.12.0
MariaDB:  /usr/bin/mariadb — 11.8.6
nvm:      /home/shinkuro/.nvm
Node.js:  20.20.2
npm:      10.8.2
```

Không cài Node/toolchain vào source repo. Không tạo `.local/toolchains/` trong repo.

Bật local WP dev server:

```bash
wsl -d Debian -- bash -lc "cd /mnt/d/Github/minhhaifish && setsid -f wp server --host=0.0.0.0 --port=8080 --allow-root"
```

Kiểm tra server:

```bash
curl -I http://localhost:8080/wp-login.php
```

Chạy plugin build + PHP lint (combined) bằng Node trong WSL:

```bash
source /home/shinkuro/.nvm/nvm.sh && nvm use 20 && cd /mnt/d/Github/skvn-marine/wp-content/plugins/skvn-marine-blocks && npm run build && find modules/ -name "*.php" -exec php -l {} \;
```

Nếu command WSL không trả output, không kết thúc, hoặc timeout: áp dụng
`Command responsiveness` ở Section 3. Agent phải dừng và đưa command cho human;
không retry, không poll process, và không chờ tiếp.

### Source repo chỉ chứa

- Theme custom: `wp-content/themes/skvn-marine/`
- Plugin custom: `wp-content/plugins/skvn-marine-blocks/`
- Context/docs/dev files: `.context/`, `docs/`, `AGENTS.md`, `README.md`

### Source repo KHÔNG được chứa

Không cài, copy, vendor, commit external WordPress plugins vào repo này:

- `wp-content/plugins/woocommerce/`
- `wp-content/plugins/contact-form-7/`
- `wp-content/plugins/contact-form-cfdb7/`
- `wp-content/plugins/seo-by-rank-math/`
- `wp-content/plugins/rank-math/`
- `wp-content/plugins/antispam-bee/`
- `wp-content/plugins/windpress/`
- `wp-content/plugins/polylang/`
- `wp-content/plugins/akismet/`
- `wp-content/plugins/hello.php`

External plugins thuộc **WordPress runtime site**, không thuộc source repo dev.

### Trước khi cài plugin bằng WP-CLI

Bắt buộc xác định rõ WordPress root thật. WordPress root phải có:

```text
wp-config.php
wp-admin/
wp-includes/
wp-content/
```

Local hiện tại phải được khai báo trong `.local/ENVIRONMENT.md`, ví dụ:

```text
WP_RUNTIME_ROOT_WINDOWS=D:\Github\minhhaifish
WP_RUNTIME_ROOT_WSL=/mnt/d/Github/minhhaifish
```

Nếu task yêu cầu "cài plugin", "activate plugin", "setup môi trường WordPress", agent PHẢI hỏi hoặc xác nhận path runtime root trước.

Không được chạy:

```bash
wp plugin install ...
```

trong source repo này nếu repo không có `wp-config.php`, `wp-admin/`, `wp-includes/`.

### Cách đúng để test theme/plugin

1. Human tạo hoặc cung cấp một WordPress runtime root riêng.
2. Agent cài external plugins vào runtime root bằng WP-CLI:

```bash
wp plugin install woocommerce contact-form-7 contact-form-cfdb7 seo-by-rank-math antispam-bee windpress --activate --path=/path/to/wp-root
```

3. Agent deploy custom code từ source repo sang runtime root bằng copy hoặc symlink:

```text
source repo/wp-content/themes/skvn-marine
-> runtime root/wp-content/themes/skvn-marine

source repo/wp-content/plugins/skvn-marine-blocks
-> runtime root/wp-content/plugins/skvn-marine-blocks
```

4. Agent activate custom theme/plugin trong runtime root:

```bash
wp theme activate skvn-marine --path=/path/to/wp-root
wp plugin activate skvn-marine-blocks --path=/path/to/wp-root
```

### Nếu lỡ copy external plugins vào source repo

DỪNG ngay và báo human.

Chỉ được xóa các thư mục external plugin nếu chắc chắn chúng là untracked/generated và không phải code custom của project. Sau khi xóa, kiểm tra:

```bash
git status --short wp-content/plugins
```

Kết quả mong muốn: chỉ còn `skvn-marine-blocks/` là plugin custom của repo.

### Tension trigger

Nếu không chắc một thư mục/plugin thuộc source repo hay runtime site → ghi LOW tension và hỏi lại trước khi cài/copy/xóa.
