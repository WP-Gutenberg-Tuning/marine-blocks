# Tensions — History

> Chỉ chứa `Status: ARCHIVED` entries.
> KHÔNG load mặc định — chỉ đọc khi human yêu cầu audit hoặc task cần quyết định từ milestone cũ.
> Chỉ move entries vào đây khi human approve milestone transition.

---

## [2025-01-01 00:00] | product-grid / product-list
Tension:    V1 nên dùng WooCommerce native blocks hay custom blocks ngay cho product grid/list?
Context:    Planning phase — chưa bắt đầu implement product section
Proposal:   Tạo custom `skvn-marine/product-grid` và `skvn-marine/product-list` block ngay từ đầu
Constraint: Master context khuyến nghị "Start with WooCommerce-native blocks/patterns where possible. Custom product grid/list blocks can be added after the homepage is working."
Severity:   high
Tags:       woocommerce, blocks
Milestone:  V1 / 0.4.0
Status:     ARCHIVED
Resolved:   2026-05-18
Decision:   V1 dùng WooCommerce native blocks/patterns cho product grid/list. Custom Product Grid/List hoặc style blocks liên quan để V2.

---

## [2026-05-26] | quote-flow
Tension:    CF7 ↔ n8n integration method: CF7 webhook trực tiếp hay CF7 send email → n8n catch email?
Context:    Human changed scope again: 0.5.1 focused on page display/sidebar controls; quote UI moved to 0.6.0; CF7 moved after 0.6.0; n8n moved after version 1.0.0.
Proposal:   Do not implement CF7, CFDB7 workflow, or n8n automation in 0.5.1.
Constraint: n8n webhook must remain protected and must not be exposed; no custom-code quote form handler.
Severity:   high
Tags:       quote-flow, php, milestone
Milestone:  V1 / 0.5.1
Status:     ARCHIVED
Resolved:   2026-05-26
Decision:   0.5.1 scope was page display/sidebar controls. Quote UI/editor controls moved to 0.6.0. CF7/CFDB7 deferred until after 0.6.0; n8n automation deferred until after version 1.0.0.

---

## [2026-05-26] | spam-protection
Tension:    Cloudflare Turnstile cho CF7: add ngay V1 hay delay?
Context:    CF7 implementation moved out of 0.5.1.
Proposal:   Do not add Turnstile or CF7 spam configuration in 0.5.1.
Constraint: CF7 form should use dedicated protection when CF7 returns to scope.
Severity:   low
Tags:       quote-flow, spam-protection
Milestone:  V1 / 0.5.1
Status:     ARCHIVED
Resolved:   2026-05-26
Decision:   Delay CF7 spam-layer decision until CF7 returns to scope. No Turnstile dependency in 0.5.1.

---

## [2026-06-02] | quote-flow
Tension:    n8n automation timing during basic CF7/CFDB7 quote form work.
Context:    Human approved moving from tested 0.6.0 to 0.7.0.
Proposal:   Implement only the basic same-site CF7/CFDB7 quote form in 0.7.0.
Constraint: n8n webhook must remain protected and must not be exposed; no custom-code quote form handler.
Severity:   high
Tags:       quote-flow, php, milestone
Milestone:  V1 / 0.7.0
Status:     ARCHIVED
Resolved:   2026-06-02
Decision:   0.7.0 scope is basic CF7/CFDB7 quote form. n8n automation remains deferred until after version 1.0.0.

---

## [2025-01-01 00:00] | slider
Tension:    Slider editor UX: stacked / selected-slide-preview / lightweight carousel?
Context:    Planning phase — slider block chưa implement
Proposal:   Stacked (slides xếp chồng trong editor, Swiper chỉ chạy frontend)
Constraint: "Not fully decided yet. V1 editor view should likely render slides stacked or in a simplified preview."
Severity:   low
Tags:       blocks, slider
Milestone:  V1 / 0.8.0
Status:     ARCHIVED
Resolved:   2026-06-03
Decision:   Use stacked/simplified slider preview in the editor. Do not run Swiper autoplay in the editor. Slider sidebar behavior controls may persist as saved attributes, but frontend Swiper runtime remains frontend-only and must respect prefers-reduced-motion.

---

## [2026-06-08 12:15] | blocks
Tension:    Add Feature Showcase block during 1.2.1 even though milestone scope names exactly three Slider presets.
Context:    Human approved naming artifact-inspired expanding accordion/gallery as "Feature Showcase" and wants the mobile split state used intentionally.
Proposal:   Implement a conservative `skvn-marine/feature-showcase` block that reuses plugin-owned CSS, no Tailwind CDN, no new dependency, and leaves existing Accordion unchanged.
Constraint: 1.2.1 planning says "Implement exactly three inserter-facing presets in 1.2.1" and non-scope excludes extra slider experiences.
Severity:   low
Tags:       blocks, slider, editor-governance
Milestone:  V1 / 1.2.1
Status:     ARCHIVED
Resolved:   2026-06-08
Decision:   Park Feature Showcase source for V1 / 1.2.3. During 1.2.1, keep the source unregistered, keep it out of the inserter, and document the future milestone before activation.

---

## [2026-11-10] | blocks, editor-governance, planning
Tension:    Shared design sidebar chỉ hiển thị một nhóm qua dropdown "Design component" (Image/Title/Details/Action) — editor phải đoán rồi chọn nhóm mới thấy control; human (chính người làm plugin) mất thời gian "mò cả buổi". Plan061 §6 định thêm P2 controls (Description alignment + Action geometry) vào đúng skeleton đó, nên pain point sẽ nở ra trước khi code.
Context:    Human test Category Grid sau P1 (Full data + mode, chưa build) và phản ánh UX gây sốc; P2 — Action + alignment bị giữ chờ placement decision từ cuối session 2026-11-10 trước đó.
Proposal:   A: thay dropdown bằng PanelBody accordions phẳng trong block Inspector; B: accordion groups trong shared plugin sidebar; C: hybrid (per-block design ở Inspector, tab plugin giữ theme tokens). Human quyết hướng khác: không restructure, chỉ thêm settings còn thiếu vào nhóm hiện có.
Constraint: AGENTS.md SKVN Editor Controls: "Controls should be grouped into Content, Style, Layout, and Advanced sections"; sidebar controls cho marketing users, không raw class input. Plan061 §6 sketch viết theo shared sidebar skeleton hiện hành.
Severity:   high
Tags:       blocks, editor-governance, planning
Milestone:  V1 / 1.3.20
Evidence:   `src/design-sidebar/navigation.tsx:14-19` (designGroups dropdown), `:37-44` (DesignFallback select + reset), `src/design-sidebar/index.tsx` (shared sidebar), `src/product-category-grid/design.tsx:136-213` (Details/Action groups hiện chỉ có toggles + colors), plan061 §7 (P2 chưa start). Tự kiểm chứng ≤5 phút: mở block Category trong editor, đổi "Design component" và đếm control hiện hữu; đối chiếu plan061 §6.
Status:     ARCHIVED
Resolved:   2026-11-10
Decision:   Human quyết trong session 2026-11-10: **không restructure** — đề xuất A/B/C loại khỏi scope đợt này; giữ dropdown nhóm hiện hành và thêm settings còn thiếu vào Details/Action. P2 triển khai trên skeleton current. Terminology **Scheme A**: group "Call to action", controls "Button …", toggle "Show call to action"; chỉ đổi labels i18n — attribute keys, class CSS, giá trị group `'action'`, DesignGroup type không đổi; rename global gồm Collection `controls.tsx` + shared `navigation.tsx` (labels only). Giữ **Button corners + Button placement** trong P2. Description alignment dùng icon ToggleGroupControl + native icons + hover title. Control-UX standard ("design system cho controls") là follow-up planning riêng — Plan 062 candidate, chưa duyệt version, không coding trong 1.3.20. Chi tiết: plan061 §3.2/§3.3/§6/§9 ledger.

## [2026-10-19] | slider, milestone, planning
Tension:    Human yêu cầu sửa Hero Slider (contrast) nhưng chưa chỉ định SemVer và chưa quyết cách xử lý current milestone; repair thuộc stack M5 (Slider) trong khi 1.3.17 đang current và thuộc scope Product/Post Carousel.
Context:    Agent audit + hoàn thiện plan 044, chuẩn bị implementation cho Hero Slider contrast.
Proposal:   Gán PATCH trống **V1 / 1.3.19 — Hero Slider Contrast Repair** và để human chọn: (a) chuyển ưu tiên, 1.3.17 → deferred và 1.3.19 → current; (b) chạy 1.3.19 như hotfix ngoài current milestone; (c) gộp vào scope slider M5 hiện có (1.3.11/1.3.16 đang PENDING và trùng scope — T-DEMO-2).
Constraint: AGENTS.md §"Milestone stack → SemVer": "Chưa có SemVer được xác nhận: tiếp tục audit/planning; không implement mục mới, đổi current milestone, bump metadata hoặc archive milestone/tension." MILESTONES.md: 1.3.18 đã dành cho Collection Editor UX & Technical; 1.3.13/1.3.14 đã code dù mapping chưa xác nhận; 1.3.15 mới chỉ là đề xuất trong T-DEMO-1.
Severity:   low
Tags:       slider, milestone, planning
Milestone:  V1 / 1.3.21 (Hero contrast, hotfix ngoài current V1 / 1.3.18)
Scheduling update 2026-11-04: human hoán đổi Hero 1.3.19 → 1.3.21 và Sidebar 1.3.21 → 1.3.19. Proposal/Decision dưới đây giữ version lịch sử tại ngày resolve; implementation hiện hành dùng 1.3.21, giữ acceptance/source và không bump/current/archive.
Status update 2026-11-12: human chuyển current sang **V1 / 1.3.21 — Hero Slider Contrast Repair + Slider Editor UI Redesign**; hình thức “hotfix ngoài current” chấm dứt, phần contrast vào acceptance của mốc hiện hành cùng editor redesign. Decision gốc (white-pill + navy `#073b5a`) không đổi và entry này giữ lại vì thuộc milestone đang current.
Evidence:   `src/slider/style.css:699-713` không khai báo color; theme `style.css:98-115` đặt `color` trực tiếp lên `.wp-block-heading` ở (0,2,1) nên thắng mọi rule Hero; bug report 2026-10-16 R1–R3. Plan 044 §1.1/§4.2/§4.3 và §"Version triển khai" đã ghi đầy đủ ledger và specificity. Tự kiểm chứng ≤5 phút: mở `src/slider/style.css` dòng 699, `wp-content/themes/skvn-marine/style.css` dòng 98-115, `.context/planning/044_*.md`.
Status:     ARCHIVED
Resolved:   2026-10-19
Decision:   Phương án (b). Human xác nhận 2026-10-19: SemVer **V1 / 1.3.19 — Hero Slider Contrast Repair**, chạy dạng **hotfix ngoài current milestone**. Khi quyết định này được ghi, current là V1 / 1.3.17; từ 2026-10-19 current đã chuyển sang V1 / 1.3.18 — 1.3.19 vẫn là hotfix ngoài current, không archive, không bump metadata cho 1.3.19. CTA Hero theo phương án white-pill + navy `#073b5a`. Ghi mapping M5 → 1.3.19 vào roadmap 039 và section milestone không-current trong MILESTONES.md. 1.3.19 chỉ đụng Hero contrast; T-DEMO-1 (1.3.15 parallax) vẫn OPEN và không bị 1.3.19 xử lý. Human resolve 2026-10-19.

Archive note 2026-11-13: 1.3.21 đóng **DONE_WITH_CARRY_OVER** theo lệnh human “Đã xong toàn phần 1.3.21” + “Chuyển sang 1.3.22 ngay”. Hero contrast cùng Slider Editor UI Redesign là acceptance của 1.3.21; quyết định white-pill + navy `#073b5a` vẫn là nền Hero hiện hành. Entry archived theo Transition Rule, không mở lại quyết định.
