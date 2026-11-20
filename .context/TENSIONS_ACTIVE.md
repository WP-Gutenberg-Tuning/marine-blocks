# Tensions — Active

## [2026-11-17 15:43] | slider, theme
Tension:    Đo chiều cao header để trừ viewport hiện chỉ Slider thường có (`syncViewportHeight`, preset Viewport below header). Lần thứ hai cần tính năng tương tự phải báo human trước khi code.
Context:    Human 2026-11-17 chốt Step Slider giữ `100svh` (O02-H). Đánh giá tách hàm dùng chung: chưa có lần lặp, selector `#masthead` buộc GeneratePress, tách shared lúc này là sớm.
Constraint: O02-H: đồng bộ header với Step làm sau khi theme tách khỏi GeneratePress. Không sửa `themes/generatepress/`.
Severity:   high
Tags:       slider, theme, agent
Milestone:  V1 / 1.3.24
Evidence:   `src/slider/view.ts` `syncViewportHeight`. Step slider `frontend.ts` `syncShellOffset` đo `getBoundingClientRect().top + scrollY` của chính block, ghi `--skvn-step-slider-offset`.
Default:    DỪNG nếu task sửa `.site-header` để phủ hero, hoặc copy `syncViewportHeight` / selector GeneratePress sang Step Slider.
Status:     RESOLVED_ACTIVE
Resolved:   2026-11-19
Decision:   Human 2026-11-19: header là của cả site và còn GeneratePress, không phủ lên hero. Hero nằm dưới header trắng. Step slider tự đo offset của chính nó. Không copy hàm Slider, không selector `#masthead` / `.site-header`.

## [2026-11-18 13:36] | slider, editor-governance
Tension:    Step Slider cần hex cho màu progress và màu nền không ảnh, trong khi editor control cấm raw hex cho người dùng marketing.
Context:    Human 2026-11-18: mỗi trang một palette. Giữ 4 palette cố định từ artifact. Hai màu kia chỉnh hex cho nhanh.
Constraint: AGENTS.md SKVN Editor Controls: không bắt người dùng nhập raw hex/rgb/hsl. Plan 081 từng ghi không thêm màu raw.
Severity:   low
Tags:       slider, editor-governance, blocks
Milestone:  V1 / 1.3.24
Evidence:   Plan 081 mục màu 2026-11-18. Artifact bốn nền đã đo ở delta, mục brave 23:29.
Default:    DỪNG nếu task mở hex parent cho nền không ảnh, mở hex/custom cho màu ngoài progress, đổi default `#7ec8e3`, đổi tên hoặc migrate `progressColor`, hay gỡ custom picker của progress vì `color.custom: false`.
Status:     RESOLVED_ACTIVE
Resolved:   2026-11-18
Decision:   Human 2026-11-18 sáng: hex tùy chọn trên progress và nền không ảnh; bốn palette cố định; sanitize; không mở raw hex cho màu khác.
            Amended 2026-11-18 muộn — plan 083 §13, SS-DS-01. Phần còn hiệu lực:
            - Progress: giữ quyền màu tùy chọn. UI là palette slug + color picker, không TextControl “Hex only”. Attribute giữ tên `progressColor`, default `#7ec8e3`. Giá trị là slug palette hoặc hex `#RGB` / `#RRGGBB`. Picker custom của riêng control này bỏ qua `theme.json` `color.custom: false`. Không đổi tên attribute, không migrate bài đã lưu, không đổi default sang slug.
            - Nền không ảnh: không còn ngoại lệ hex trên slider cha. COL-02 (B) đóng hex parent. Nền không ảnh chỉ per-step (4 gradient default + custom fill trên step-slide). Không mở lại ô hex nền cha từ tension này.
            - Không supersede tension này thành “cấm hex progress”. Không áp bypass `color.custom` cho fill, overlay, hay màu khác.

> Chỉ chứa `Status: RESOLVED_ACTIVE` entries của milestone hiện tại.
> Agent đọc file này mỗi task, nhưng dùng tag filter để tập trung vào entries liên quan.
> Move sang `TENSIONS_HISTORY.md` chỉ khi human approve milestone transition.

---
## [2026-06-16] | theme, plugin
Tension:    Header Actions ĐÃ render (không còn orphan) — theme `inc/header-actions.php` tồn tại và hook vào `generate_after_header_content`, nhưng cả theme và plugin đều định nghĩa bộ 3 hàm data TRÙNG LẶP cho cùng option `skvn_header_actions`: default/sanitize/getter. Theme render gọi getter của THEME, không gọi getter của plugin — nên plugin getter `skvn_marine_blocks_get_header_actions()` trở thành dead code. Hai hàm sanitize có thể drift riêng lẻ từ nhau, phá vỡ A2 (Logic/data → plugin).
Context:    Verified 2026-07-14 qua source: Theme `inc/header-actions.php`:25-26 `skvn_marine_get_default_header_actions()`, :47-60 `skvn_marine_sanitize_header_actions()`, :90-107 `skvn_marine_get_header_actions()` + render hook line 13 `generate_after_header_content` priority 20. Plugin `modules/header-settings/header-settings.php`:87-98 `skvn_marine_blocks_get_default_header_actions()`, :109-132 `skvn_marine_blocks_sanitize_header_actions()`, :152-168 `skvn_marine_blocks_get_header_actions()` nhưng gọi từ đâu cũng không có. Data flow plugin→option→theme chạy nhưng theme không dùng plugin getter. Hướng thực tế: GP header shell giữ, SKVN actions inject — nhẹ hơn Cấp A gốc (full custom header shell) mà vẫn đạt mục đích.
Proposal:   De-duplication: Khi milestone 1.4.0 bắt đầu, xóa 3 hàm data trùng trong theme `inc/header-actions.php`, giữ lại render + search/CTA logic, cho theme gọi plugin getter `skvn_marine_blocks_get_header_actions()` với `function_exists()` guard + fallback graceful. KHÔNG làm trong giai đoạn demo (mức ưu tiên thấp, technique debt). KHÔNG dùng Cấp A toàn bộ custom header shell (scope không cần thiết, tiêu tốn resource QA).
Constraint: A2: "Visual/layout → theme. Logic/data → plugin." — plugin phải sở hữu default/sanitize/getter độc lập.
            AGENTS.md invariant: "KHÔNG BAO GIỜ sửa file trong themes/generatepress/"
            AGENTS.md: "Mobile: CTA (Request a Quote) luôn visible"
Severity:   low
Tags:       theme, php, planning, editor-governance
Milestone:  V1 / 1.4.1
Scheduling update 2026-11-04: Setup UI và de-dup header-settings đi cùng scope cũ được dời 1.4.0 → 1.4.1; 1.4.0 dành cho Marine Blocks migration. Các mốc 1.4.0 trong Proposal/Decision bên dưới là bản quyết định lịch sử; implementation dùng 1.4.1. Không đổi Status/Resolved hoặc nội dung quyết định de-dup.
Status:     RESOLVED_ACTIVE
Resolved:   2026-07-14
Decision:   Phương án A (de-dup). Khi 1.4.0 bắt đầu: xóa 3 hàm data trùng trong theme `inc/header-actions.php`, cho theme render gọi plugin getter `skvn_marine_blocks_get_header_actions()` với `function_exists()` guard + fallback graceful; giữ render + search/CTA logic ở theme. KHÔNG làm trong giai đoạn demo. KHÔNG dùng Cấp A full custom header shell. Human resolve 2026-07-14.

## [2026-07-12] | slider, editor-governance
Tension:    (T-DEMO-3) Đề xuất demo chỉ dùng parallax Preset (Subtle/Medium/Strong), không dùng/không show Advanced controls (depth/direction/translate/scale/inset) — đi ngược decision reversal 2026-07-01 của human (expose Advanced toggle).
Context:    Parallax còn bug chưa có root cause; Advanced controls nhân test matrix ~8× trong khi thời gian QA trước demo có hạn. Người xem demo không cần thấy Advanced.
Proposal:   Mức tối thiểu (zero code): demo pages chỉ config Preset, demo script không mở Advanced panel. Mức chắc hơn (cần approve riêng): constant tạm ẩn Advanced panel, gỡ sau demo. Không thay đổi decision Rev 1.1 cho product — chỉ giới hạn phạm vi demo. Chi tiết: docs/demo-prep/06-expanded-perspective.md §P3b.
Constraint: Human decision 2026-07-01 (memory: parallax Advanced toggle reversal): "exposed via Advanced toggle" — đề xuất này thu hẹp tạm thời điều human đã chọn.
Severity:   low
Tags:       slider, editor-governance
Milestone:  V1 / 1.3.x demo prep
Evidence:   Advanced controls = 5 biến tự do (depth/direction/translate/scale/inset) → test matrix nở ~8× so với 3 preset; bug parallax chưa có root cause (human confirm 2026-07-12). Tự kiểm chứng ≤3 phút: mở Inspector slider bật Advanced, đếm số control; đối chiếu docs/demo-prep/04 §3 test matrix.
Status:     RESOLVED_ACTIVE
Resolved:   2026-07-14
Decision:   Mức 1 (zero code). Demo pages chỉ config parallax Preset (Subtle/Medium/Strong); demo script KHÔNG mở Advanced panel. KHÔNG ẩn Advanced bằng code — quyết định sản phẩm 2026-07-01 (expose Advanced toggle) giữ nguyên, chỉ giới hạn phạm vi demo. Không dùng Mức 2 (constant ẩn panel). Human resolve 2026-07-14.

## [2026-10-05 00:00] | collection-query-ownership
Tension:    Collection theo hướng A (thin display adapter trên Query Loop/Woo native) hay B (full custom dynamic block tự own query như 1.3.3 hiện tại) — chưa chốt
Context:    Rà soát hướng đi sau khi xác định SKA-block chỉ translate Tailwind HTML thành Gutenberg, WindPress đưa Tailwind vào UI; plugin SKVN tập trung slider + product/post carousel
Proposal:   A: Core/Woo own query, SKVN chỉ làm display adapter (card style B2B, CTA/quote URL, Swiper adapter). B: giữ 1.3.3 full custom (product-collection/post-collection tự query + render PHP)
Constraint: MILESTONES.md §1.3.3: "Product collections own WooCommerce product query... Post collections own WordPress post query"; PLUGIN_SKVN_MARINE_BLOCKS.md Product And Post Collections — custom dynamic blocks, không custom SQL, không dựa Woo experimental API
Severity:   high
Tags:       blocks, woocommerce, milestone, planning
Milestone:  V1 / 1.3.3
Evidence:   MILESTONES.md §1.3.3 acceptance còn nhiều ô trống + QA đẩy sang 1.3.11/1.3.16; T-DEMO-2 trùng scope QA; `wc_get_products` là wrapper mỏng từ 3.0.0 (verify trunk 2026-10-06), khác biệt A/B nằm ở gánh maintenance query/render xung quanh chứ không phải DB schema
Status:     RESOLVED_ACTIVE
Resolved:   2026-10-06
Decision:   Phương án B (full custom). Giữ 1.3.3 custom dynamic blocks tự own query + render PHP; chấp nhận maintenance xung quanh query. Human resolve 2026-10-06.
