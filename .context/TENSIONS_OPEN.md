# Tensions — OPEN

> Chỉ chứa `Status: OPEN` entries.
> Agent luôn đọc toàn bộ file này trước mỗi task.
> OPEN entries không được filter theo tag.
> Khi human resolve → move sang `TENSIONS_ACTIVE.md`, đổi `Status: RESOLVED_ACTIVE`.

---
## [2025-01-01 00:00] | multilingual
Tension:    Polylang activate ngay V1 hay chỉ prepare (text domain + no hardcoded strings)?
Context:    Planning phase
Proposal:   Chỉ prepare: dùng text domain đúng, tránh hardcode Vietnamese strings trong theme/plugin UI
Constraint: Master context: "If the first site can launch in English only — prepare for multilingual, delay multilingual complexity until needed."
Severity:   low
Tags:       multilingual, theme
Milestone:  V1 / 1.0.0
Status:     OPEN
Resolved:
Decision:   Lean toward: chỉ prepare, KHÔNG activate Polylang V1.

## [2026-06-12 11:23] | slider
Tension:    Slider cần dùng Inter trong 1.3.1 nhưng typography base và font delivery toàn site thuộc theme governance, với preset/delivery UI dự kiến ở 1.6.0.
Context:    Làm typography Slider nhỏ gọn theo ảnh tham chiếu mà không đổi font toàn website.
Proposal:   Scope Inter vào asset của Slider với system fallback; không đổi theme typography tokens hoặc thêm font settings UI.
Constraint: Site branding guideline: "Typography base" do theme `style.css` và `theme.json` sở hữu; milestone 1.6.0 dự kiến governance font delivery toàn site.
Severity:   low
Tags:       slider, theme
Milestone:  V1 / 1.3.1
Status:     OPEN
Resolved:
Decision:   Conservative implementation: Slider-only Inter; human review whether to retain, self-host, or promote it into the 1.6.0 typography system.

## [2026-07-12] | slider, milestone
Tension:    (T-DEMO-1) 1.3.8 mang Status DONE (approved 2026-07-01) nhưng toàn bộ acceptance checklist chưa tick, và 2 bug parallax (stutter slide 2/3, ảnh scale khi load) vẫn còn sau 2 hotfix ngoài-milestone (ba03f08, 406d42d) — human confirm 2026-07-12.
Context:    Demo prep review. Công việc stabilize parallax không có milestone chứa nên fix phải đi dạng hotfix ngoài sổ; MILESTONES.md đang nói dối người đọc.
Proposal:   Mở milestone 1.3.15 — Parallax Stabilization (patch scope) chứa debug theo docs/demo-prep/04-parallax-debug-protocol.md + fix + Dev onsite verify. 1.3.8 giữ DONE cho phần implementation, ghi chú rõ "stabilization → 1.3.15". Chi tiết: docs/demo-prep/06-expanded-perspective.md §P1.
Constraint: MILESTONES.md Transition Rule: "Chỉ chuyển milestone khi tất cả acceptance checklist của milestone hiện tại đã DONE" — 1.3.8 được đóng khi checklist chưa tick.
Severity:   low
Tags:       slider, milestone
Milestone:  V1 / 1.3.x demo prep
Evidence:   MILESTONES.md §1.3.8: Status DONE nhưng acceptance toàn [ ]; git log: ba03f08 + 406d42d không thuộc milestone nào; human confirm bug còn 2026-07-12. Tự kiểm chứng ≤3 phút: mở MILESTONES.md §1.3.8 + `git log --oneline -5`.
Default:    Nếu chưa quyết trước khi bắt đầu fix parallax: track công việc fix trong docs/demo-prep/ (không đổi MILESTONES.md), fix vẫn tiến hành — không chờ.
Status:     OPEN
Resolved:
Decision:   OPEN

## [2026-07-12] | milestone, planning
Tension:    (T-DEMO-2) 1.3.11 (Comprehensive Onsite QA) và 1.3.16 (Comprehensive Testing 1.3.x) có scope gần trùng nhau — cùng cover 1.3.7 collection UI, 1.3.8 parallax, 1.3.10 step slider, button hover, console/memory. Hai checklist song song = không cái nào là source of truth.
Context:    Demo prep review; cần một QA gate duy nhất trước demo.
Proposal:   Merge thành một Pre-Demo QA Gate giữ số 1.3.11 (absorb nội dung 1.3.16, đánh dấu 1.3.16 merged/ARCHIVED); item ngoài demo scope tách thành section post-demo trong cùng file. Chi tiết: docs/demo-prep/02-milestone-critique.md §C2, 06-expanded-perspective.md §P2.
Constraint: MILESTONES.md là "planning/scope source of truth" — hai milestone trùng scope phá vỡ tính source-of-truth.
Severity:   low
Tags:       milestone, planning
Milestone:  V1 / 1.3.x demo prep
Evidence:   So sánh MILESTONES.md §1.3.11 vs §1.3.16: cùng cover 1.3.7/1.3.8/1.3.10/button-hover/console-memory. Tự kiểm chứng ≤5 phút: mở 2 section cạnh nhau, đếm item trùng.
Default:    Nếu chưa quyết trước tuần 2 demo plan: không sửa MILESTONES.md; QA chạy theo checklist trong docs/demo-prep/ (gate doc); 1.3.11/1.3.16 giữ nguyên chờ human.
Status:     OPEN
Resolved:
Decision:   OPEN

## [2026-11-15] | woocommerce, planning
Tension:    Plan076 §7 đặt template-swap related vào `woocommerce_before_related_products` / `woocommerce_after_related_products`, nhưng Woo 10.7.0 installed không đăng ký hai hook đó.
Context:    P4 related loop adapter; P0 GATE A đã map `woocommerce_output_related_products_args`, `single-product/related.php` @10.3.0, `wc_get_template_part`, và `wc_set_loop_prop( 'name', 'related' )`.
Proposal:   Scope swap bằng `wc_get_loop_prop( 'name' ) === 'related'` cộng flag `woocommerce_before_template_part` / `woocommerce_after_template_part` cho `single-product/related.php`. Upsells (`up-sells`) giữ native.
Constraint: Plan076 §7: "woocommerce_before_related_products bật flag → … → woocommerce_after_related_products gỡ flag (try/finally)".
Severity:   low
Tags:       woocommerce, planning, theme
Milestone:  V1 / 1.3.22
Evidence:   `woocommerce/includes/wc-template-functions.php` related/upsell (`wc_set_loop_prop` name related / up-sells); grep runtime Woo 10.7 không có `woocommerce_before_related_products`.
Default:    Conservative: dùng loop name + template_part flag; không copy related.php vào theme.
Status:     OPEN
Resolved:
Decision:   OPEN

## [2026-06-12 15:30] | editor-governance
Tension:    Tiện ích copy/paste block là editor-governance dùng chung, trong khi milestone hiện tại tập trung vào Feature Showcase autoplay và panel links.
Context:    Human yêu cầu hai nút copy block và paste block để giữ nguyên Gutenberg block markup khi chuyển nội dung giữa các trang.
Proposal:   Thêm một editor utility độc lập dùng public Gutenberg APIs; không override clipboard handler, parser, UI DOM, hoặc WordPress core.
Constraint: Current milestone: "V1 / 1.3.2 — Feature Showcase Autoplay And Panel Links".
Severity:   low
Tags:       editor-governance, blocks, milestone
Milestone:  V1 / 1.3.2
Status:     OPEN
Resolved:
Decision:   Conservative implementation: one isolated editor entry with removable public-API SlotFill actions; no settings, persistence, core patch, or custom clipboard format.
