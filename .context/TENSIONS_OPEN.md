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

## [2026-11-15 15:34] | theme, woocommerce
Tension:    PDP related: panel/option/presenter thuộc plugin, nhưng swap Woo related loop (`wc_get_template_part` + adapter template) thuộc theme — cập nhật plugin không hiện SKVN card; conflict identity Marine Blocks (plugin độc lập theme).
Context:    Human onsite related không đổi sau khi bật Override + Use SKVN related cards. Human chốt pitfall = không cập nhật theme. Yêu cầu lưu phân tích và tension; làm chi tiết sau đổi tên 1.4.0. Không implement lúc ghi.
Proposal:   1.3.22 giữ theme adapter. Khi start 1.4.0: đọc ideation rồi lập execution plan chuyển hook Woo + adapter vào plugin (B) hoặc hybrid plugin-default + theme override (C). Inventory archive card 060 cùng pattern; không tự gộp nếu human chưa chọn.
Constraint: Plan 047: "Plugin có styling/runtime riêng, không phụ thuộc WindPress/theme SKVN". MB-06: plugin độc lập theme. A2: Visual/layout → theme. Logic/data → plugin. Plan076 P4 đặt swap trong theme.
Severity:   low
Tags:       theme, woocommerce, blocks, planning
Milestone:  V1 / 1.4.0
Evidence:   Theme `functions.php` require `inc/pdp-related.php`; `add_filter('wc_get_template_part', 'skvn_marine_related_template_part')` chỉ theme. Plugin `pdp-related-settings.php` + `cards.php` không hook Woo related. Human 2026-11-15: không cập nhật theme. Ideation `docs/ideations/pdp-related-theme-plugin-independence.md`. DP-11 / Pitfall 12.
Default:    Conservative 1.3.22: không chuyển hook; deploy theme+plugin cùng gói. 1.4.0 start: lập plan chi tiết trước code; chưa chọn B vs C thì DỪNG.
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

## [2026-11-18 14:48] | slider, blocks
Tension:    Step Slider dùng lại focal, biến CSS và hàm PHP của Slider. Lần dùng lại tiếp theo phải tách phần đó vào chỗ dùng chung, không copy thêm.
Context:    Human 2026-11-18. O03 cho Step Slide dùng `FocalPointPicker` và `src/slide/focal.ts`. Đó là lần dùng thứ hai. Chưa tách trong lượt này.
Proposal:   Giữ nguyên cho Slider và Step Slider. Block thứ ba cần cùng một mảnh thì tách mảnh đó vào `src/shared/` (TS) hoặc một hàm PHP một chỗ, rồi cả ba gọi. Không dán bản sao thứ ba.
Constraint: Human: những gì dùng lại từ Slider, nếu còn dùng lại một lần nữa thì tách theo DRY.
Severity:   high
Tags:       slider, blocks, agent
Milestone:  V1 / 1.3.24
Evidence:   `src/slide/focal.ts` được `slide/*` và `step-slide/edit.tsx`, `step-slide/save.tsx` import. `skvn_marine_blocks_normalize_slide_background_focal_point()` định nghĩa ở `modules/slider-render/slider-render.php`, Step gọi ở `step-slider-render.php`. Biến `--skvn-slide-bg-pos-x/y` lặp trong `src/slider/style.css` và `src/step-slider/style.css`. UI `FocalPointPicker` hiện chỉ ở `src/slide/edit.tsx` và `apply-background-modal.tsx`; Step Slide sẽ là bản UI thứ hai khi làm O03. Human 2026-11-18 thêm vào danh sách dùng lại: `src/slide/fill.ts` (`default` / `custom` / `transparent`), `backgroundFillMode`, `backgroundFillColor`, `backgroundFillGradient`, `overlayOpacity`, và PHP `skvn_marine_blocks_sanitize_slide_fill_background()` cùng `skvn_marine_blocks_normalize_slide_fill_mode()`. Nền gradient gốc của plugin là bốn radial của artifact, ghi ở plan 081. `transparent` là không có lớp nền, giống nhãn Slider “Transparent (no fill layer)”. Overlay của Step dùng lớp tối trái và đáy của artifact; control bật độ phủ dùng lại `overlayOpacity`.
Default:    DỪNG copy thứ ba. Tách mảnh bị dùng lại vào chỗ chung trong cùng task, rồi gọi.
Status:     OPEN
Resolved:
Decision:   OPEN

## [2026-11-19] | theme, blocks, slider
Tension:    css-layout-safety “one width owner” vs plugin tự neutralize GeneratePress `.alignfull` (Marine Blocks độc lập theme).
Context:    Human 2026-11-19: plugin phải chạy không cần SKVN; overflow Step Slider do GP inline `-40px` / `calc(100% + 80px)`; reset từng chỉ nằm theme `style.css` nên zip plugin không chữa. Human chốt chuyển reset vào plugin, giữ canvas theme, cập nhật luật/convention/pitfall.
Proposal:   Dual-layer đã document: theme = canvas SKVN cho mọi `.alignfull`; plugin = used width của block khi chọn `alignfull` (`width:100%; margin:0; max-width:none`, specificity ≥ GP `(0,3,1)`), không `body.skvn-full-width-canvas`. Cùng geometry, không hai phép tính viewport. Lượt này chỉ Step Slider; Slider/Collection/Category/Showcase list, không chuyển hàng loạt.
Constraint: `docs/standards/css-layout-safety-contract.md` one owner; `docs/decisions/canvas-alignment-and-generatepress-exit.md` “do not add component-specific fixes”; GLOBAL A13 / MB-06 plugin độc lập theme; AGENTS.md không sửa `themes/generatepress/`.
Severity:   low
Tags:       theme, blocks, slider
Milestone:  V1 / 1.3.24
Evidence:   Onsite `test-page-2` theme `?ver=1794791780` vs plugin `?ver=1795023969`; GP inline thắng; `x=-40` width=1985. Source: `src/step-slider/style.css` `.entry-content .wp-block-skvn-marine-step-slider.skvn-step-slider.alignfull`; theme canvas `style.css` ~1014. DP-12 / Pitfall 13.
Default:    Giữ dual-layer. Không xóa theme canvas adapter. Không dời canvas vào plugin. Không chuyển Slider/Collection trong lượt này.
Status:     OPEN
Resolved:
Decision:   OPEN
