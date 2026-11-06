# SKVN Marine — Global Context Map

> AI working memory. Không phải docs. Không phải changelog.
> Load file này đầu tiên trước mọi task.

---

<!-- AUTO_START -->
[auto] Stack Overview

- WordPress + GeneratePress (parent) + `skvn-marine` (child theme)
- WooCommerce — native products, categories, attributes
- WindPress — được dùng enhance core blocks/patterns website; plugin ship styling/runtime độc lập (human 2026-11-04, plan 047).
- Plugin: `skvn-marine-blocks` — custom Gutenberg blocks (TypeScript, @wordpress/scripts)
- Page display/sidebar controls completed in 0.5.1; Quote UI completed in 0.6.0; basic CF7/CFDB7 source/docs contract in 0.7.0; quote-flow runtime verification/handoff in 0.7.1; SKVN Editor Controls in 0.8.0; Footer Page Settings in 0.9.0; onsite UI/test debt closed in 0.10.0; CF7 data-flow and map block/display testing deferred to 1.1.2; n8n after 1.0.0
- Rank Math — SEO, schema
- Polylang — multilingual (standby V1, activate later)
- Antispam Bee — comment spam. CF7 honeypot + optional Turnstile — form spam
- OpenStreetMap iframe embed — map/contact section, wrapped by theme CSS
- Swiper — slider block frontend runtime
- IntersectionObserver — scroll reveal
- Shared animation runtime (`assets/js/animations.js`) — fade/parallax/magnetic

[auto] Module Index

| Module | Path | Layer | Ghi chú |
|---|---|---|---|
| Theme root | `skvn-marine/` | Theme | style.css, functions.php, theme.json |
| Theme setup | `inc/setup.php` | Theme | register_nav_menus, add_theme_support |
| Theme enqueue | `inc/enqueue.php` | Theme | wp_enqueue + filemtime versioning |
| Block styles | `inc/block-styles.php` | Theme | register_block_style() |
| Media helpers | `inc/media.php` | Theme | ALT auto-fill từ attachment title |
| WooCommerce overrides | `inc/woocommerce.php` | Theme | Visual override, KHÔNG logic |
| WindPress config | `inc/windpress.php` | Theme | WindPress integration hooks |
| Animation runtime | `assets/js/animations.js` | Theme | Shared — KHÔNG tách per-block |
| Patterns | `patterns/*.php` | Theme | Block patterns |
| Plugin root | `skvn-marine-blocks/` | Plugin | skvn-marine-blocks.php |
| Slider block | `src/slider/` + `src/slide/` | Plugin | Swiper frontend, stacked editor preview |
| Accordion block | `src/accordion/` | Plugin | Keyboard nav bắt buộc |
| Product Collection block | `src/product-collection/` | Plugin | Planned 1.3.3 dynamic WooCommerce grid/carousel |
| Post Collection block | `src/post-collection/` | Plugin | Planned 1.3.3 dynamic post grid/carousel |
<!-- AUTO_END -->

---

<!-- MANUAL_START -->
[manual] Context Map Layout

Active context module files live in `.context/modules/`.

Current module context files:

- `.context/modules/THEME_SKVN_MARINE.md`
- `.context/modules/PLUGIN_SKVN_MARINE_BLOCKS.md`
- `.context/modules/QUOTE_FLOW.md`

Planning snapshots live in `.context/planning/` and use a three-digit ordering prefix, starting at `000_`. Implemented or completed plans move to `.context/planning/archives/` (prefix giữ nguyên) — index: `.context/planning/archives/README.md`.

Active planning (root — load when task liên quan):

Deploy reminder2026-11-06: human yêu cầu khi deploy phải nhắc chụp Editor UI, phục vụ SP-02 Organized Editor UI (khung làm việc có thứ tự, hạn chế nhầm lẫn). Checklist `docs/workflows/deploy-artifact-workflow.md` + register `docs/product/marketplace-selling-points.md`§5. Thu ảnh trên build deploy/editor load đúng assets, lưu metadata/evidence; tổng hợp nội bộ trước, trình bày marketplace sau. Không suy Inserter056 đã sửa hoặc tự deploy.

Marketplace sale points — human2026-11-06: tổng hợp tại `docs/product/marketplace-selling-points.md`; SP-01 Content Actions đã được human chọn là sale point, brief/value/scope/evidence đã ghi, chưa viết listing hoặc trình bày marketing. Khi chuẩn bị marketplace/public launch phải đọc register, tổng hợp và trình human sau; không tự chọn marketplace/version/date hoặc đổi launch gate.

Content Actions evidence2026-11-06: human model suite18/18 PASS trên Node24.16.0/npm11.13.0 sau repair8ee4a3f; đã đáp ứng rerun model được yêu cầu bên dưới. Plan057§26/runbook ghi evidence; controller11 mocked tests giữ riêng, build/lint và Gutenberg runtime vẫn chờ.

Content Actions repair2026-11-05: human đã cho thực hiện057§19–24; R1–R4 có source repair (raw clipboard bindings, descendant permissions/modes/ownership, Paste limits, browser HTML parser/styled spans). Execution057§25: controller tests11/11 PASS phạm vi WP store/parser/clipboard mock + JSDOM HTML thật; model suite cần human chạy lại, build/lint/onsite chưa PASS. Đọc `.context/PITFALLS.md` AP-08–10 và runbook R01–R06; giữ current1.3.19/no bump, right-click058 Deferred.

- `.context/planning/058_FUTURE_CANDIDATE_EDITOR_CONTEXT_MENU_AFTER_2_0.md` — human2026-11-05 tách right-click khỏi057, deferred sau khi qua2.0. Khi đó agent tổng hợp các tính năng đề xuất, trình human chốt mốc/SemVer/thứ tự; không tự gán2.0.1 hoặc implement. Giữ CCP-TECH03 Deferred.

- `.context/planning/057_FUTURE_CANDIDATE_BLOCK_CONTENT_COPY_PASTE.md` — human2026-11-05 duyệt gói§11–14 và start coding+commit `feature patch:` trong current1.3.19 như scope addition, không bump; approval§17. Product/Post Collections + Slider/Slide; menu ⋮ từng block, exact type/shape, query/content/empty policies, giữ style, native projection clipboard, async revalidation/Undo. P0 API/version evidence và source/runtime acceptance chưa làm; không hỏi lại approval. Right-click058 Deferred sau2.0. Handoff `docs/workflows/prompts/block-content-actions-agent-handoff.md`, runbook `docs/testing/block-content-actions.md`.


- `.context/planning/055_VER_1_3_19_RESPONSIVE_SPACER_PLAN.md` — human2026-11-05 duyệt implementation+commit trong current1.3.19. Responsive Spacer static có source: mint frame, centered indicator padding=min(H,200)/2, frontend H không cap; breakpoint768/1024, default30, inherit/reset/zero. 13 Node tests PASS (5 Spacer +8 frame mô phỏng), chưa human build/lint/onsite; runbook `docs/testing/responsive-spacer-1.3.19.md`.

UI asset pitfall bắt buộc tham khảo khi đổi visual owner/bundle: `.context/PITFALLS.md` AP-06/AP-07 và `docs/debug-casebook/gutenberg/008_EDITOR_FRAME_CSS_EXTRACTED_NOT_ENQUEUED.md`; CSS tồn tại trong build không chứng minh editor đã nạp. Root frame053 từng mất màu/viền vì extraction/enqueue mismatch, source fix có nhưng onsite chưa xác nhận.

- `.context/planning/054_DESIGN_SIDEBAR_VISUAL_CONTROLS_PLAN.md` — visual SVG/CSS/palette/type controls, per-block capability inventory; đề xuất Q1=A Category existing-only, Q2=A Media layout owner Design/Image + explicit reset semantics, Q3=A group navigation. Chờ human chốt, chưa code visual Sidebar; Theme Design persistence/frame053 riêng.


Execution053 update 2026-11-05: human đã cho triển khai + agent commit. Collection Product/Post Carousel/Grid và Category Grid có source frame/palette/labels/spacing adapter; runbook `docs/testing/editor-preview-frames-1.3.19.md`, geometry/onsite pending. 8VM spacing tests PASS (simulated DOM). Slider/Step vẫn audit/design pending, chưa màu/source mới.
- `.context/planning/053_EDITOR_PREVIEW_FRAMES_ROLLOUT.md` — human approved 2026-11-05: khung editor gồm heading/intro, nhãn loại, màu theo Carousel/Grid, gap dọc tối thiểu10px không cộng parent gap. P1/P2 có source; geometry/onsite pending. Slider/Step Slider còn audit/mockup/palette. Contract `docs/standards/editor-preview-frame-contract.md`.
- `.context/planning/052_PRODUCT_CAROUSEL_CANVAS_PRESENTATION.md` — human approved 2026-11-05: card trái, Content summary + Query preview phải, responsive stacking và giữ thông tin cũ; đã có source, screenshot human đã cung cấp nhưng chưa đủ CP01–05/PASS. Khung bao heading/intro follow-up theo053.
- `.context/planning/051_VER_1_3_19_SECOND_REVIEW_REPAIR_PLAN.md` — human approved G0–G4 ngày2026-11-05; source editor guard/Inspector fallback, session refresh/export và lazy ThemeDesign read. Repair source sau e13fa2c; 12 VM tests PASS, chưa human build/lint/onsite hoặc release approval. Execution record§10/runbook/handoff giữ giới hạn.
- `.context/planning/050_VER_1_3_19_REVIEW_REPAIR_PLAN.md` — human approve A/F0–F5 ngày2026-11-05, cho coding+commit source1.3.19; conditional owner writes/conflict recovery, Post attr và focus repair. Chưa runtime/release approval. Prompt độc lập: docs/testing/plugin-design-sidebar-1.3.19-review-handoff.md.
- `.context/planning/049_VER_1_3_20_PRODUCT_CATEGORY_GRID_EXECUTION_PLAN.md` — Category1.3.20: C0–C6, native category data/shared drafts/Page Save, CG-* + DS integration. Human duyệt 2026-11-04 Q1=A count/catalog+descendants, Q2=A card gọn 3/2/1 theo container (image/name bật, description/count/CTA tùy bật), Q3=B rich text native an toàn/excerpt riêng. Picker design lock giữ. Source Category có trong 7ef45ff; follow-up number controls/Wide default đã có source, chưa nghiệm thu và chưa đổi current khỏi 1.3.19.
- `.context/planning/048_VER_1_3_19_PLUGIN_DESIGN_SIDEBAR_EXECUTION_PLAN.md` — Sidebar 1.3.19: P0–P6, mapping controls, Theme Design hai storage owners, DS/TD + Carousel carry-over. Human duyệt 2026-11-04 Q1=A: Fonts chỉnh trực tiếp, tái dùng theme_mod/presets; Q2=A: draft + Save riêng theo nhóm, áp dụng sau lưu, giữ draft khi chuyển tab/lỗi, chưa live preview. Đã start 2026-11-04; current 1.3.19 IN PROGRESS, runtime/release approval pending.
- `.context/planning/046_VER_1_3_18_SITE_LOADING_NAVIGATION_UX_HOTFIX_PLAN.md` — loading/logo + navigation fade trong current 1.3.18, baseline b9332d3. Human start 2026-11-04: §11 execution record có source homepage curtain/readiness/Hero pre-init/autoplay gate/ms inputs; 8 lifecycle VM tests PASS, onsite/build chưa kiểm chứng. `/home/` main Hero đã có DOM evidence; Smooth onsite đang off, human bật khi test. Không sửa skeleton/commit/version. Giữ UXHF-01–10 và LDR-01–09/runbook; decoration/geometry/deploy evidence còn thiếu.
- `.context/planning/045_VER_1_3_18_CAROUSEL_EDITOR_UX_TECHNICAL_EXECUTION_PLAN.md` — §9–13 planning chi tiết 2026-10-20: 7 hệ thống preview/query/Inspector/colors/typography/media/technical, gói P0–P6 và evidence. Current 1.3.18 đã mở ngày 19/10; implementation Editor UX chưa bắt đầu. Không sửa skeleton đợt này; giữ carry-in chưa nghiệm thu. Các dòng lịch sử 040/039 bên dưới không thay current trong MILESTONES.md.
- `.context/planning/040_VER_1_3_17_CAROUSEL_UI_UX_TECHNICAL_PLANNING.md` — planning tích lũy; §11 split human 2026-10-14: 1.3.17 Block UI & Visual QA IN PROGRESS; 1.3.18 Editor UX & Technical PLANNED chưa start. §10 rationale, §11 mapping acceptance/setting inventory; chưa thiết kế UX/technical, chưa PASS.

- `.context/planning/039_ROADMAP_C_B2B_TOOLKIT_CAROUSEL_FIRST_PLANNING.md` — Roadmap C milestone stack; M1 → 1.3.17 Block UI & Visual QA IN PROGRESS + 1.3.18 Editor UX & Technical PLANNED (split 2026-10-14). 1.3.10 deferred sang M5; mapping mở vẫn cần review từng mục.

- `.context/planning/003_VERSION_1_1_0_LAYOUT_BLOCKS_PLANNING.md` — layout blocks validation pending 1.4.2.

- `.context/planning/026_VER_1_3_6_BLOCK_EDITOR_UX_AND_SLIDER_PARALLAX_PLANNING.md` — umbrella 1.3.6; Trục A carry-in → 1.3.7.
- `.context/planning/028_VER_1_3_7_COLLECTION_UI_CARD_STYLES_PLANNING.md` — collection UI + card styles (implemented; visual lock follow-up = 038).
- `.context/planning/038_VER_1_3_7_COLLECTION_CAROUSEL_VISUAL_LOCK_PLANNING.md` — Product/Post Collection carousel visual lock: Path B Swiper + Path C scroll-snap plan-B. Carousel scope activated as V1 / 1.3.17 on 2026-10-13; use roadmap 039 and POC-03 for current acceptance.
- `.context/planning/032_VER_1_3_8_SLIDER_PARALLAX_IMPLEMENTATION_PLANNING.md` — Slider Parallax (1.3.8 PENDING).
- `.context/planning/018_VERSION_1_3_10_FULLSCREEN_STEP_SLIDER_PLANNING.md` — Step Slider (1.3.10 DEFERRED → stack M5; not completed).
- `.context/planning/027_VERSION_1_5_0_WOO_CATALOG_PLUGIN_PLANNING.md` — woo-catalog brainstorm (1.5.0).
- `.context/planning/037_VER_1_5_3_TOC_BLOCK_AND_SHORTCODE_PLANNING.md` — native TOC + heading convergence (1.5.3 PLANNED).
- `.context/planning/009_VERSION_1_6_0_SKVN_SURFACE_PRESETS_PLANNING.md` — surface presets (1.6.0).
- `.context/planning/010_VERSION_1_7_0_FRONT_PAGE_TRANG_CHUYEN_DOI_SO_PLANNING.md` — front page Chuyển đổi số (1.7.0).
- `.context/planning/008_FUTURE_CANDIDATE_GUTENBERG_TURBO_PLANNING.md` — GU Supercharger product direction (post-1.5.x).
- `.context/planning/022_FUTURE_CANDIDATE_SLIDER_EXTENSION_API_PLANNING.md` — 2.x Slider Extension API.
- `docs/decisions/slider-completion-spec-1.3.0.md` — active Slider source of truth. V1 / 1.3.0 completes dynamic rendering, compatibility, accessibility, and geometry; expanded carousel/showcase UX remains a later human-approved milestone.
- `docs/decisions/slider-navigation-and-pagination-controls.md` — approved V1 / 1.3.1 direction for independent arrow/pagination style and position controls, conditional bottom clustering, Swiper-owned timed pagination, governed `5/7/9/12s` duration, and responsive/accessibility fallbacks after the failed 1.3.0 media, width, pagination, and memory behavior is corrected.
- `.context/planning/013_VERSION_2_0_0_TO_3_0_0_STANDALONE_BLOCK_THEME_PLANNING.md` — medium/long-term plan: 2.0.0 starts migration away from GeneratePress; 3.0.0 completes standalone SKVN theme direction. Gutenberg remains the WP content/editor model; custom blocks become additive governed site enhancements.
- `.context/planning/014_VERSION_1_X_SKVN_ELEMENT_CPT_PLANNING.md` — 1.x foundation plan for SEO-safe reusable site elements (`skvn_element`) before 2.0.0 migration. Header/footer reusable content should move away from normal Pages toward non-public CPT elements.

Proposal files under `.context/proposals/` are not active protocol and are ignored by git. Do not load them unless the human explicitly asks to review a proposal.

Project docs under `docs/` are grouped by reading purpose:

- `docs/decisions/` — approved or working decisions that should be easy to audit. Index + quy ước: `docs/decisions/README.md`. Tài liệu tham chiếu kỹ thuật ở `docs/decisions/reports/`, decision đã superseded/closed ở `docs/decisions/archives/` (không load mặc định).
- `docs/standards/` — coding, AI, and security standards for human-readable reference.
- `docs/workflows/` — development and context-management workflows.
- `docs/testing/` — test methods, test prompts, manual verification notes.
- `docs/explain/` — simplified explanations for human review.
- `docs/artifacts/` — visual/static artifacts such as HTML mockups; useful for review, not source of truth.
- `docs/curriculum/` — giáo trình tự học cho human: xây plugin blocks tương tự từ chính code dự án (index: `docs/curriculum/README.md`). Không phải agent protocol; agent không cần load khi làm task.

Current active docs:

- `docs/testing/commit-tracking-2026-11-05.md` — feature-separated backlog commits, source/build parity caveat, test evidence và follow-up Category responsive/Carousel canvas; không release approval.

- `docs/ideations/svg-maps/README.md` — V1 / 1.4.3 Interactive Illustrated Map, human chốt 2026-11-04; PLANNED chưa start, sau 1.4.2 trước 1.5.0. Hai bảng, nội dung trong điểm; sidebar plugin, Apply changes/Save map, lưu nguyên khối. Acceptance MAP-* ở MILESTONES.md; current vẫn 1.3.18.
- `docs/standards/block-ui-editor-ux-technical-review-contract.md` — protocol ba nhóm + Content & States / Acceptance & Evidence, áp dụng theo AGENTS cho block/UI review/planning/implementation.

- `docs/decisions/project-goals-and-roadmap-reset.md` — bản ghi planning tiếp tục: mục tiêu toolkit B2B, ưu tiên Product/Post Carousel, hướng settings cơ bản trong Block và nâng cao ở sidebar riêng. Cập nhật cùng file khi human yêu cầu; M1 → 1.3.17 đã được human kích hoạt 2026-10-13; carousel stability hiện là ưu tiên, 1.3.10 deferred.

- `docs/decisions/README.md` — index + quy ước của toàn bộ decision tree (Status/Milestone/Lifecycle, đường dẫn `reports/`, `archives/`). Nạp file này thay vì đọc tuần tự thư mục.

Hot-path decisions (đọc trực tiếp khi task chạm domain):

- `docs/decisions/architecture.md`
- `docs/decisions/design-direction.md`
- `docs/decisions/caching-strategy.md`
- `docs/decisions/product-data-model.md`
- `docs/decisions/quote-flow.md`
- `docs/decisions/footer-page-settings-0.9.0.md`
- `docs/decisions/footer-appearance-settings-0.11.0.md`
- `docs/decisions/header-actions-search-0.12.0.md`
- `docs/decisions/core-control-core-button-hover.md`
- `docs/decisions/skvn-dynamic-collections-1.3.3.md`
- `docs/decisions/product-card-grid-layout-contract.md`
- `docs/decisions/block-animation-strategy.md`
- `docs/decisions/skvn-editor-controls-0.8.0.md`
- `docs/decisions/feature-showcase-1.2.3.md`

Technical reports (không phải decision scope):

- `docs/decisions/reports/typography-and-gp-exit-report.md` — typography token architecture, Settings API pattern, GP coupling audit, WooCommerce layer, 2.0.0 exit plan. LƯU Ý: header gốc ghi milestone `1.5.0 — Typography Settings` nhưng `1.5.0` hiện là Woo Catalog Plugin; contract hiệu hành là `docs/decisions/typography-scope-and-font-loading.md`.
- `docs/decisions/reports/collection-card-system-1.3.7.md`
- `docs/decisions/reports/style-css-change-log.md`
- `docs/standards/ai-rules.md`
- `docs/standards/security-guidelines.md`
- `docs/standards/memory-leak-prevention-rules.md` — quy tắc phòng chống memory leak cho Gutenberg plugin (event listener cleanup, observer teardown, block edit lifecycle).
- `docs/testing/frontpage-testing.md`
- `docs/testing/onsite-test-debt-checklist.md`
- `docs/testing/onsite-map-block-1.1.2.md`
- `docs/testing/footer-page-settings-0.9.0.md`
- `docs/testing/footer-appearance-settings-0.11.0.md`
- `docs/testing/header-actions-search-0.12.0.md`
- `docs/testing/onsite-0.11-0.12-completion-checklist.md`
- `docs/testing/onsite-editor-controls-0.8.0.md`
- `docs/testing/onsite-dynamic-collections-1.3.3.md`
- `docs/testing/onsite-slider-motion-1.3.2.md`
- `docs/testing/testing-checklist.md`
- `docs/workflows/context-map-workflow.md`
- `docs/workflows/ideation-chom-revslider-theme-tra-phi-to-gutenberg.md`
- `docs/workflows/ideation-plugin-design-sidebar.md` — human 2026-11-04 hoán đổi: **1.3.19 Plugin Design Sidebar Foundation → 1.3.20 Category Grid → 1.3.21 Hero contrast**. Sidebar nhận acceptance Carousel còn thiếu từ 1.3.18; register tại MILESTONES.md. Carousel tích hợp trước, Category tích hợp trong 1.3.20. Giữ Selected block / Plugin, Theme Design; nền cho consumers sau. Sidebar 1.3.19 IN PROGRESS theo execution override; chưa runtime/release approval.
- `docs/ideations/category-grid-spec.md` — Product Category Grid + Category details giữ 1.3.20, sau Sidebar 1.3.19 theo human 2026-11-04; Hero contrast dời 1.3.21. Post Category riêng, version TBD. Thumbnail/description native Woo, placeholder, manual selection/archive/custom URL/hide-empty/native notices; acceptance CG-* giữ nguyên, chưa start.
- `docs/workflows/deploy-artifact-workflow.md`
- `docs/workflows/layout-translator-workflow.md`
- `docs/workflows/onsite-qa-checklist.md`
- `docs/workflows/theme-development-workflow.md`
- `docs/workflows/versioning-release-workflow.md`
- `docs/explain/explain-for-5-years-old.md`
- `docs/artifacts/init-prompt-v1-1.0.0-launch-ready.md`
- `docs/artifacts/init-prompt-v1-1.3.0-slider-dynamic-rendering.md`
- `docs/artifacts/init-prompt-v1-1.3.1-slider-controls.md`
- `docs/artifacts/init-prompt-v1-1.3.3-dynamic-collections.md`
- `docs/artifacts/init-prompt-v1-1.3.4-core-control.md`
- `docs/workflows/start-v1-1.3.0-slider-repair.md` — reusable repair prompt for the failed 1.3.0 build, including State Delta diagnostics, target code architecture, geometry/RAM gates, and the targeted human smoke-test boundary before 1.3.1.
- `docs/artifacts/brand-palette-options.html`
- `docs/debug-casebook/gutenberg-plugin-memory-leak-guide.md` — hướng dẫn debug và reproduce memory leak trong Gutenberg plugin blocks.

---

### Marine Blocks — human decision 2026-11-04

- Định vị: bộ block chuyên dụng và patterns giúp dựng, chỉnh sửa, bàn giao website nhanh; không hướng tới supercharge toàn bộ FSE. Ưu tiên core blocks/patterns, custom block khi cần dữ liệu/tương tác/UX biên tập chuyên dụng. Không tự mở lại query ownership của Collection.
- Plugin có styling/runtime riêng, hoạt động độc lập với WindPress và theme SKVN. Website được dùng WindPress/Tailwind enhance core blocks/patterns; không coi đây là hai lựa chọn loại trừ nhau. Layout/style trên mỗi surface phải có owner rõ ràng.
- Identity đích: Marine Blocks; slug/text domain `marine-blocks`, block namespace `marine-blocks/*`, PHP functions `marine_blocks_*`, constants `MARINE_BLOCKS_*`, plugin CSS `marine-blocks-*`, variables `--marine-blocks-*`.
- Theme giữ identity `skvn-marine`, PHP `skvn_marine_`, CSS/tokens theme. Có thể cập nhật điểm gọi API plugin khi migrate, không đổi thương hiệu theme.
- Human xác nhận 2026-11-04: **1.4.0 — Marine Blocks Migration**; Setup UI cũ 1.4.0 → 1.4.1, Layout/Quote Validation cũ 1.4.1 → 1.4.2, giữ acceptance. Version đã chốt, chưa start; current vẫn 1.3.18. Trước migration giữ naming source hiện hành.
- Replace hàng loạt chỉ theo inventory plugin/theme/shared. Hàm nội bộ có thể đổi đồng bộ; wrapper chỉ cần cho consumer chưa chuyển. Saved blocks/markup, option/meta keys phải có compatibility hoặc migration riêng; không global replace `skvn` trong repo/DB.
- Identity GU Supercharger và mục tiêu full-FSE bị thay thế. Migration sớm hơn không tự thay public-launch gate sau 1.5.x, reset version về 0.0.1, hoặc hủy acceptance/milestone cũ.
- Source of truth: `.context/planning/047_VER_1_4_0_MARINE_BLOCKS_MIGRATION_PLANNING.md`.

[manual] Architecture Decisions — Project-Wide

**A1. Child theme, không fork GeneratePress**
Lý do: giảm PHP maintenance, tránh AI sửa parent theme, dễ upstream update.
Invariant: KHÔNG BAO GIỜ sửa file trong `themes/generatepress/`.

**A2. Theme vs Plugin boundary**
Rule: nếu thay theme mà feature bị mất → feature thuộc plugin, không thuộc theme.
Visual/layout → theme. Logic/data → plugin.
Invariant: custom blocks KHÔNG được đặt trong theme.

**A3. Không custom CPT cho product ở V1**
Dùng WooCommerce native products. Custom fields (ACF/Meta Box) chỉ thêm khi WC attributes không đủ.

**A4. Quote path phased by milestone**
0.5.1 completed page-level display/sidebar controls. 0.6.0 completed Quote UI, same-site request quote page surface, and CTA polish. 0.7.0 prepares the basic CF7/CFDB7 source/docs contract. 0.7.1 verifies runtime/admin setup and closes the immediate handoff gap. 0.10.0 closed onsite UI evidence for footer and CF7 interface. Remaining CF7 data-flow evidence is deferred to V1 / 1.1.2 because it depends on product/page block origin, hidden/context fields, CFDB7 storage, and thank-you behavior. n8n automation dời sau version 1.0.0. KHÔNG custom-code form handler. KHÔNG popup/modal làm primary flow.
URL pattern giữ: `/request-a-quote/?product_id=123`

**A10. Page display controls**
Page-level controls such as Hide site header and Hide site footer belong to the `skvn-marine` child theme. Use safe editor/admin controls and page meta; do not require marketing users to type raw classes. Do not add a header/footer builder plugin by default.

**A11. SKVN Editor Controls**
0.8.0 adds token-governed sidebar controls for SKVN-owned Gutenberg blocks and translated layout surfaces. Theme owns tone, spacing, width, radius, shadow, and visual classes. Plugin owns block sidebar UI, attributes, saved markup, and interactive behavior. Editors should not need raw class input, raw colors, or arbitrary inline spacing values.

**A12. Footer Page Settings**
0.9.0 adds a plugin settings page for `skvn_footer_page_id`. The theme renders the selected footer page through GeneratePress' `generate_footer` surface, with GeneratePress default footer as fallback. No custom CPT, no display rules system, and no GeneratePress replacement. Implement footer settings as a migration-ready module inside the current `skvn-marine-blocks` plugin; do not create or rename to `gutenberg-supercharger` or `gutenberg-turbo` in V1.

**A13. Plugin CSS independence — token cascade**
Plugin `skvn-marine-blocks` phải có khả năng hoạt động độc lập, không phụ thuộc hoàn toàn vào theme.
Sự phụ thuộc hiện tại (plugin dùng `--skvn-*` tokens từ theme) là **technical debt được chấp nhận có chủ ý** để phát triển nhanh.
CSS token cascade đúng: Plugin CSS (define defaults/fallback) → Theme style.css (override `--skvn-*`) → GP Customizer (future).
Invariant: KHÔNG tạo thêm dependency ngầm từ plugin → theme mà không ghi nhận. Nếu buộc dùng theme token, ghi chú technical debt rõ ràng tại chỗ.
Roadmap: Dần move tokens cần thiết vào plugin block CSS với fallback values, để sau này tách hoàn toàn.

**A5. Animation runtime dùng chung**
`assets/js/animations.js` là single runtime. KHÔNG tạo animation logic riêng per block trừ khi bắt buộc.
Invariant: tất cả animation phải respect `prefers-reduced-motion`.

**A6. Editor opacity rule**
Reveal animations KHÔNG được set `opacity: 0` trong editor nếu không có safe fallback.
Editor phải match frontend ~80%. Animations có thể chạy trong editor nhưng KHÔNG làm editing painful.

**A7. Image ALT automation**
Auto-fill từ attachment title khi ALT empty. KHÔNG overwrite manual ALT. KHÔNG auto-generate caption ở V1.
File: `inc/media.php`, prefix: `skvn_marine_auto_set_image_alt_from_title()`.

**A8. Dependency policy**
Mỗi dependency mới PHẢI document: purpose, alternative, bundle impact, load scope, removal plan.
KHÔNG add dependency không có rationale.

**A9. Map/contact V1 fallback**
Shared host chỉ hỗ trợ PHP 8.0. `Out of the Block: OpenStreetMap` yêu cầu PHP 8.1, nên V1 dùng OpenStreetMap iframe embed trong Gutenberg/HTML content, bọc bằng SKVN theme CSS. Không thêm map plugin mới trong V1 nếu iframe đủ dùng.

---

[manual] Invariants — Không bao giờ được vi phạm

- KHÔNG sửa `themes/generatepress/` (bất kỳ file nào)
- KHÔNG đặt custom block logic trong theme
- Theme identity giữ nguyên; plugin chỉ rename theo plan 047 Marine Blocks 1.4.0 khi human xác nhận start; không global replace shared `skvn-`.
- KHÔNG overwrite manual image ALT
- KHÔNG auto-generate caption ở V1
- KHÔNG custom-code quote form handler — 0.7.0 dùng CF7/CFDB7
- KHÔNG expose n8n webhook unprotected; n8n deferred until after 1.0.0
- KHÔNG log credential dù debug
- PHP: input phải sanitize, output phải escape (`esc_html`, `esc_attr`, `esc_url`, `wp_kses_post`)
- KHÔNG cache: `/cart/`, `/checkout/`, `/my-account/`, `/request-a-quote/`, `/quote-thank-you/`
- KHÔNG modify hơn 3–5 files per AI task trừ khi có lý do rõ ràng

---

[manual] Phase Scope

**V1 (current)** — Một website B2B marine, local-first
- Theme child + design system + block styles + patterns
- Plugin blocks: Slider, Accordion, Product Collection, Post Collection
- Page display/sidebar controls in 0.5.1; Quote UI/editor controls in 0.6.0; basic CF7/CFDB7 source/docs contract in 0.7.0; quote-flow runtime verification/handoff in 0.7.1; SKVN Editor Controls in 0.8.0; Footer Page Settings in 0.9.0; onsite UI/test debt closed in 0.10.0; CF7 data-flow and map block/display testing in 1.1.2; n8n after 1.0.0
- English content, prepare cho multilingual nhưng KHÔNG activate Polylang

**V2 (future)**
- Start migration away from GeneratePress; `2.0.0` is the migration-start boundary, not the completion point.
- Staging + Git deploy workflow
- Redis object cache nếu cần
- CDN cho static assets
- Advanced filtering cho product
- Technical Product Card với specs table

**V3 (future)**
- Complete GeneratePress removal; `3.0.0` is the standalone/custom theme completion boundary.
- Child theme support
- Marketing governance layer
- GitHub Actions release zip

---

[manual] Open Decisions (chưa resolve — xem TENSIONS_OPEN.md)

1. V1 product grid/list: WooCommerce native blocks trước hay custom blocks ngay?
2. Exact sidebar/admin control flow for page display options
3. Polylang: activate V1 hay chỉ prepare?
4. Slider editor UX: stacked / selected-slide-preview / carousel preview?
5. CF7 spam layer for 0.7.0 basic quote form
6. V2 hosting/deployment approach cụ thể
7. V3: stay GeneratePress hay custom base theme?

---

[manual] AI Guardrails — Project-Wide

Mọi AI agent làm việc trong project này PHẢI đọc `AGENTS.md` trước.
Xem thêm: `.context/TENSIONS_OPEN.md` trước khi modify bất kỳ module nào.

When using external AI feedback such as MetaAI:

- Treat it as review input, not source of truth.
- Ask it for HTML artifacts, layout specs, QA checklists, copy variants, or critique.
- Do not rely on it as the primary image generation source.
- For image needs, use a dedicated image generation flow or create code/HTML artifacts that can be reviewed and exported.
- Validate all external AI suggestions against `AGENTS.md`, `.context/`, and current repo files before applying.

Những gì AI KHÔNG được làm (summary nhanh):
- Sửa GeneratePress parent
- Thêm dependency không có rationale
- Rename namespace/prefix
- Đặt block logic trong theme
- Overwrite manual image ALT
- Custom-code quote form handler
- Nếu thấy conflict → ghi vào TENSIONS_OPEN.md, DỪNG, hỏi lại
<!-- MANUAL_END -->


