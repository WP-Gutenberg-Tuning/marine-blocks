# Prompt — Island width / phản biện chuẩn Elementor (research, 1.3.20)

> Tạo 2026-11-12. Đây là **prompt chuyển giao research**, không phải approval coding.
> Human sẽ giao cho một agent **có khả năng đọc ảnh**. Agent đó phải tự đo/đọc hai ảnh
> evidence, không được kế thừa số đo bằng lời.
>
> Trạng thái bàn giao (đọc trước khi copy prompt):
>
> - Current vẫn **V1 / 1.3.20 — Product Category Grid + Category details + Woo Archive M1**. Không bump, không transition. Research này không có code delta được duyệt.
> - Đã ghi, để agent đọc rồi phản biện: recipe 2 bước (`docs/testing/group-island-width-1.3.20.md` §3), phản biện Elementor (§4), decision gate A/B (§7.1), contract Container Nesting, module theme, MILESTONES entry `Island Elementor rebuttal2026-11-12`. §4 là đối tượng phản biện, không phải premise.
> - Local WP runtime lúc bàn giao không phản hồi (`wp` CLI treo, `curl` HTTP 000). Không chạy được browser/WP thì chỉ kết luận từ ảnh + source và ghi phần chưa xác minh. Command treo hoặc timeout: dừng ngay, không retry, không poll.
> - Mọi số trong lời (§1: 760px / 1200px, gap 12px, ảnh 1903×927, scale 1:1, màu nền) chưa được chứng minh. Agent nhận bản copy không được kế thừa chúng.
> - `git status --short` lúc 2026-11-12 đã trả (lệnh chậm). Không commit, không `git add`, không reset, không clean.
>
> Docs chưa commit — untracked:
>
> - `docs/testing/group-island-width-1.3.20.md`
> - `docs/workflows/prompts/group-island-elementor-rebuttal-agent-handoff.md` (file này)
>
> Docs chưa commit — modified. Chỉ đụng file mà OUTPUT của prompt cho phép; file còn lại giữ nguyên:
>
> - `docs/standards/css-layout-safety-contract.md`
> - `docs/standards/gutenberg-block-extension-css-contract.md`
> - `docs/testing/category-grid-description-actions-1.3.20.md`
> - `docs/testing/onsite-button-hover-1.3.7.md`
> - `docs/testing/onsite-slider-flank-controls-1.3.6.md`
> - `docs/testing/single-post-hero-layout-review-1.3.6.md`
> - `docs/testing/typography-scope-isolation-1.3.6.md`
> - `docs/workflows/agent-ui-layout-collaboration-method.md`
> - `docs/workflows/ideation-end-user-deep-customization.md`
> - `docs/artifacts/init-prompt-v1-1.3.8-core-button-hover-fix.md`
> - `docs/decisions/feature-showcase-1.2.3.md`
> - `docs/decisions/single-post-layout-and-mobile-surfaces.md`
> - `docs/decisions/slider-completion-spec-1.3.0.md`
> - `docs/decisions/slider-navigation-and-pagination-controls.md`
> - `docs/decisions/typography-scope-and-font-loading.md`
> - `docs/decisions/reports/typography-and-gp-exit-report.md`
> - `docs/decisions/archives/blog-sidebar-content-settings.md`
> - `docs/decisions/archives/loading-screen-settings-1.3.13.md`
> - `docs/decisions/archives/post-heading-numbering-1.3.14.md`
> - `docs/decisions/archives/skvn-1.3.x-architecture-and-decisions.md`
>
> Context cũng đang modified (không phải docs). Được phép ghi theo OUTPUT: `.context/MILESTONES.md` (tối đa 1 entry). Được đọc: `.context/modules/THEME_SKVN_MARINE.md`. **Cấm sửa nội dung DP-07** trong `.context/PITFALLS.md`. Không đụng các path `.context/` còn lại trong status, gồm `CONVENTION.md`, `README.md`, `PLUGIN_SKVN_MARINE_BLOCKS.md`, planning 026/037/040/041/042/059/061 và `planning/archives/*`.
>
> Working tree còn source theme/plugin modified. Research này không duyệt chúng và không được sửa hoặc commit:
>
> - `wp-content/themes/skvn-marine/single.php`
> - `wp-content/plugins/skvn-marine-blocks/package.json`
> - `wp-content/plugins/skvn-marine-blocks/package-lock.json`
> - `wp-content/plugins/skvn-marine-blocks/src/collection/controls.tsx`
> - `wp-content/plugins/skvn-marine-blocks/src/slider/edit.tsx`
> - `wp-content/plugins/skvn-marine-blocks/src/slider/style.css`
> - `wp-content/plugins/skvn-marine-blocks/src/product-category-grid/*` (block.json, constants, design, details, edit, preview, style.css, types)
> - `wp-content/plugins/skvn-marine-blocks/src/core-controls/*` và `src/design-sidebar/navigation.tsx`
> - `wp-content/plugins/skvn-marine-blocks/modules/category-grid/*`, `modules/core-control/*`, `modules/sidebar-blog-content/sidebar-blog-content.php`
>
> Cấm sửa `themes/generatepress/**`. Cấm sửa nội dung DP-07.

Copy phần dưới sang agent research.

```text
Bạn là agent research có khả năng đọc ảnh, làm việc trong D:\Github\skvn-marine.

MỤC TIÊU
Phản biện độc lập kết luận hiện có về hiện tượng "nền (background) của island chỉ bao đúng
width của nó, không bao hoàn toàn content", dùng chuẩn UX của Elementor làm tham chiếu. Phải
trả lời dứt điểm ba câu:
(a) Đây là bug paint, mismatch width-owner, hay đúng model Gutenberg?
(b) Recipe 2 bước (Group Full + measure cho con) đã đạt parity UX với Elementor chưa?
(c) Nếu chưa, primitive nào cần, và có thể làm zero-CSS bằng core pattern không?
Đây là research/docs ONLY. Không implement phương án nào; chỉ spec nếu cần.

BẮT BUỘC ĐỌC, THEO THỨ TỰ
1. AGENTS.md — protocol, encoding, command responsiveness, response routing, review contract.
2. .context/GLOBAL.md; .context/MILESTONES.md (current 1.3.20, entry island 2026-11-11/12);
   .context/TENSIONS_OPEN.md đầy đủ; .context/TENSIONS_ACTIVE.md filter tag
   theme/blocks/editor-governance; .context/modules/THEME_SKVN_MARINE.md mục
   [manual] Gutenberg Width And Canvas Contract.
3. docs/standards/css-layout-safety-contract.md (Gutenberg Width Contract, Container Nesting,
   Alignment Ownership, Required Geometry Check);
   docs/standards/block-ui-editor-ux-technical-review-contract.md.
4. docs/testing/group-island-width-1.3.20.md — TOÀN BỘ. Đặc biệt §1 (số đo cũ), §2 root
   cause, §3 recipe, §3.3 gap theme, §4 phản biện Elementor hiện có, §7.1 decision gate.
   §4 là kết luận cần bị phản biện lại, không phải chân lý.
5. .context/PITFALLS.md DP-07 — chỉ đọc. Không sửa nội dung.
6. Source (đọc, không sửa):
   - wp-content/themes/skvn-marine/style.css: 959-1013 (width system + clamp),
     117-121 (editor padding-left 64px), 130-157 (.skvn-section island).
   - wp-content/themes/skvn-marine/theme.json (contentSize 760px, wideSize 1200px, palette),
     inc/block-styles.php, inc/page-display-controls.php (_skvn_full_width_canvas).
   - wp-content/plugins/skvn-marine-blocks/src/collection/controls.tsx:410-424 (contentWidth),
     modules/collection-render/cards.php:900-909 (width class mapper).
   - WP core: wp-includes/block-supports/layout.php:325-389;
     wp-includes/class-wp-theme-json.php:4217-4233 (global content/wide size custom props).
     Dùng runtime thật trong D:\Github\minhhaifish nếu đọc được; nếu không, ghi rõ nguồn.

EVIDENCE ẢNH — TỰ MỞ FILE, KHÔNG KẾ THỪA SỐ ĐO BẰNG LỜI
- .local/Lỗi/Marine Blocks with core block (1).png
- .local/Lỗi/Marine Blocks with core block (2).png
Cấm kế thừa số đo ảnh từ lời. 760, 1200, gap 12, 1903x927, scale 1:1, màu hex và số cột trong §1 hoặc trong prompt này chưa phải số đo của ảnh. Tự đọc pixel của file rồi đo. Token trong theme.json hoặc CSS chỉ được nêu sau khi đọc đúng file:line, và không được gán sẵn cho bbox trong ảnh.

Nếu PowerShell đọc path có dấu bị lỗi encoding, dùng wildcard:
  Get-ChildItem 'D:\Github\skvn-marine\.local\*\Marine Blocks with core block*.png'
Đọc và ghi text bằng UTF-8 tường minh. Mojibake thì dừng và sửa encoding trước khi viết kết luận.

Với mỗi ảnh, báo bằng số đo từ chính ảnh:
- Frontend, Preview, hay editor iframe? Có browser chrome hoặc toolbar trong ảnh không?
- Kích thước pixel của file ảnh.
- Viewport CSS px, khác với pixel ảnh. Nêu cách suy ra scale, DPR và zoom.
- Bbox nền: trái, phải, trên, dưới — theo pixel ảnh và theo CSS px sau khi chia scale.
- Màu nền (hex) và màu hoặc độ sáng của vùng ngoài bbox.
- Số cột, số gap, độ rộng mỗi card. Text bên trong có bị cắt hoặc hẹp bất thường không.
- Có scrollbar dọc không. Mép trái và mép phải của nền có chạm biên cửa sổ không.
- Ảnh (1) và ảnh (2) khác nhau ở đúng biến nào: box width, content width, hay cả hai.

Lời human chưa kiểm, chỉ là giả thuyết: trang test local post=71; Group chứa Heading 1, SKVN Product Category Grid và một Group rỗng; group được tô màu để thấy vùng paint. Nếu ảnh khác lời, ghi cái nhìn thấy trên ảnh.

CÂU HỎI NGHIÊN CỨU — trả lời từng câu, mỗi câu có evidence
R1. Đo lại hai ảnh như trên. Nếu scale ≠ 1, tính lại: 760/1200 trong §1 chỉ đúng khi scale=1;
    nêu rõ con số đúng là bao nhiêu CSS px và kết luận cũ bị ảnh hưởng thế nào.
R2. Hiện tượng "nền chỉ bao đúng width" là gì? Chứng minh bằng ảnh + CSS + core source:
    background paint theo box nào; box đó do owner nào quyết định (theme clamp? alignment?
    constrained layout?); có bằng chứng nào cho thấy paint sai (tràn/thiếu so với box) không.
R3. Elementor reference: Boxed vs Full Width thực sự làm gì. Bắt buộc cite tài liệu chính thức
    (elementor.com/help/container-layout-tab-settings/, .../section-overview/) và source SCSS
    (assets/dev/scss/frontend/_container.scss: --width, .e-con-inner max-width,
    --container-max-width default 1140px). Lập bảng map: từng ảnh tương ứng mode nào của
    Elementor; mode nào cho "nền tràn + content boxed". Ghi ngày đọc và phạm vi version.
R4. Recipe 2 bước có đạt parity không? Liệt kê residual delta cụ thể (default khác nhau, số
    bước thao tác, measure 760 đọc chữ vs ~1140 layout, editor lệch 64px, canvas precondition)
    và cái nào là gap thật, cái nào chỉ là thiếu hiểu biết thao tác.
R5. Nếu cần primitive: spec zero-CSS. Kiểm lại khả năng pattern `alignfull` +
    `layout.constrained` + `contentSize` riêng (core layout.php), chọn measure nào (1200 hay
    token riêng), dùng palette slug nào, tên pattern, inserter category, theme hay plugin layer
    theo boundary AGENTS. Chứng minh "không CSS" bằng source + saved markup mẫu; nêu rủi ro khi
    contentSize khác theme.json (wide/full, nested, container query 760/880).
R6. Rủi ro/regression: nested alignfull, container query lật layout im lặng, editor iframe,
    canvas OFF, mobile/RTL, saved markup cũ, UX pattern (locked/edited content), i18n.
R7. Phản biện lại chính §4: chỉ ra chỗ overclaim, thiếu nguồn, hoặc sai. Nếu kết luận cũ sai
    thì ghi rõ "superseded" và sửa tài liệu; nếu đúng thì bổ sung evidence còn thiếu. Không
    được rubber-stamp.

RÀNG BUỘC
- Không sửa theme/plugin source, theme.json, block.json, build artifact, package metadata.
- Không chạy npm run build / lint / deploy / package. Không git commit/push/add/reset/clean.
- Không bump version, không chuyển milestone; current giữ V1 / 1.3.20.
- Không sửa nội dung PITFALLS DP-07. Không đụng themes/generatepress/**.
- Không claim runtime PASS. Ảnh là evidence tại thời điểm chụp, không phải benchmark.
- Không dùng kiến thức chung về Elementor/WordPress làm premise: mỗi khẳng định phải có
  docs URL hoặc file:line. Không kiểm được thì ghi "chưa xác minh".
- Command treo/timeout/không output: dừng ngay, không retry, không poll; bàn giao lại human.
- Tất cả file UTF-8; PowerShell đọc/ghi UTF-8 tường minh; mojibake thì dừng và sửa encoding.

OUTPUT
1. Cập nhật docs/testing/group-island-width-1.3.20.md: thêm §8 "Research ảnh + phản biện độc
   lập" (số đo mới, bảng Elementor, verdict). Giữ §4 làm lịch sử; nếu §4 sai thì đánh dấu
   superseded thay vì xóa.
2. Nếu cần chỗ cho bảng đo/nghiên cứu dài: tạo
   docs/research/island-width-elementor-reference-2026-11-12.md và link từ §8.
3. Chỉ sửa docs/standards/css-layout-safety-contract.md nếu rule thực sự đổi.
4. .context/MILESTONES.md: tối đa 1 entry ngắn ghi kết quả research + decision còn mở.
5. Báo cáo cuối:
   - bảng verdict: claim | Elementor reference | evidence | đúng / sai / chưa xác minh;
   - số đo ảnh (pixel + CSS px, kèm scale);
   - khuyến nghị A (giữ recipe) / B (island pattern zero-CSS trong 1.3.20) / C khác, kèm lý do;
   - việc human phải quyết và evidence runtime còn thiếu.
Không tự chọn A/B thay human. Không tự start implementation.
```
