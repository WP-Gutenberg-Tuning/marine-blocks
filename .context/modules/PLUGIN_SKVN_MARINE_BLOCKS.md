# PLUGIN — skvn-marine-blocks

## [manual] Role

Deploy/marketplace reminder2026-11-06: SP-02 Organized Editor UI được human chọn vì khung làm việc có thứ tự giúp hạn chế nhầm lẫn. Khi deploy agent nhắc human chụp Editor UI (khung/nhãn block, nhóm công việc/sidebar) trên build thực tế; checklist deploy workflow, brief register§5. Chưa tạo listing/claim usability đo lường; Inserter056 còn scope riêng.

Marketplace positioning2026-11-06: human xác nhận Content Actions là sale point; lưu feature brief và evidence ở `docs/product/marketplace-selling-points.md` SP-01, tổng hợp dần trước khi trình bày vào giai đoạn marketplace. Không tự xuất bản copy, hứa compatibility hoặc đổi public-launch gate. Technical spec vẫn057, acceptance ở runbook.

Custom Gutenberg blocks with logic, and future plugin-owned editor/admin tooling.

Human decision 2026-11-04: product đích **Marine Blocks** (`marine-blocks`, PHP `marine_blocks_`); bộ block chuyên dụng và patterns để dựng/chỉnh sửa/bàn giao website nhanh, không full-FSE supercharger. Plugin ship styling/runtime độc lập WindPress/theme; website dùng WindPress enhance core blocks/patterns. Migration target **1.4.0**, SemVer đã xác nhận, chưa start; source giữ naming hiện tại tới migration. Theme identity giữ nguyên. Xem `.context/planning/047_VER_1_4_0_MARINE_BLOCKS_MIGRATION_PLANNING.md` cho mapping, compatibility và acceptance.

## [manual] Product Language

Repair follow-up2026-11-05: human approved plan051 G0–G4 for current1.3.19. Source adds post-editor context/API guard + Inspector design fallback, structured session expiry/manual nonce recovery preserving draft/base, export draft text and lazy ThemeDesign read. Tests/runbook and execution ledger in plan051; no runtime/release approval. Existing owner locks/storage/permissions and Category persistence policy unchanged. Working-tree repair pending human build/lint/onsite evidence.

Plugin product UI and frontend default copy use English as the source language. Keep user-facing strings translatable with the `skvn-marine-blocks` text domain where applicable; do not translate stored attribute/option keys or enum values. Vietnamese localization follows in a separately scoped phase. Internal documentation may remain in Vietnamese. See `AGENTS.md` §Product language.

## [manual] Architecture

Content Actions evidence2026-11-06: human model suite18/18 PASS trên Node24.16.0/npm11.13.0 sau repair8ee4a3f;057§26/runbook. Model rerun đã có evidence, supersedes pending rerun bên dưới. Controller11 mocked tests giữ riêng; build/lint/Gutenberg runtime/Undo/Save vẫn chờ, current1.3.19 không đổi.

Content Actions repair2026-11-05: human start057§19–24; R1–R4 có source repair `validation.ts`, `editor-guard.ts`, `inline-html.ts` và transport/planner/controller wiring. Raw binding/validity/limits kiểm trước projection; full tree mode/ownership và identity recheck sau await; browser HTML parser giữ semantic styled spans, bỏ scanner. Execution057§25 + AP-08–10:11 controller tests PASS phạm vi mock WP APIs + JSDOM HTML thật; model rerun/build/lint/onsite chưa PASS. Current1.3.19/no bump; các đoạn pending bên dưới là checkpoint trước implementation.

Content Actions2026-11-05: human duyệt plan057§11–14 và start coding+commit `feature patch:` trong current1.3.19 như scope addition, không bump/chuyển milestone. Product/Post Collections + Slider/Slide; menu ⋮ từng block, native projection clipboard/allowlist, exact type/shape, giữ style đích, query là content, empty ghi đè, atomic Undo/revalidation. API/version preflight và source/runtime acceptance chưa làm. Handoff `docs/workflows/prompts/block-content-actions-agent-handoff.md`; approval057§17 ưu tiên hơn các dòng pending lịch sử. Right-click058 Deferred sau2.0, không mở namespace migration hoặc query ownership.

Responsive Spacer2026-11-05: human cho plan055 implementation+commit trong current1.3.19. Static `skvn-marine/responsive-spacer`, native Inspector, optional responsive overrides/reset, frontend CSS-only tại `assets/css/responsive-spacer.css`; editor mint frame và padding cap200 chỉ minh họa. Source `src/responsive-spacer/`, PHP/JS registration; không require/include hoặc storage mới. 13 Node tests PASS phạm vi5 Spacer +8 frame mô phỏng, build/lint/onsite chưa chạy. Spec `planning/055_VER_1_3_19_RESPONSIVE_SPACER_PLAN.md`, runbook `docs/testing/responsive-spacer-1.3.19.md`. Px inputs là ngoại lệ hẹp cho utility đã human duyệt, không đổi preset spacing của các block khác.

Architecture: **Block-centric feature modules with minimal shared services**.

Each block owns feature-specific logic:

- `block.json` — block metadata and attributes
- `edit.tsx` — editor UI
- `save.tsx` — saved markup
- `view.ts` — frontend runtime only when needed
- `types.ts` — block-local TypeScript types when useful

Shared services are allowed only for cross-block invariants/utilities:

- `src/shared/motion.ts` — `prefers-reduced-motion` helpers
- `src/shared/a11y.ts` — keyboard/ARIA helpers
- `src/shared/dom.ts` — safe DOM/config parsing helpers
- `src/shared/types.ts` — truly shared TypeScript types

Do not move block-specific behavior into `shared/`.

Rule: put logic in `shared/` only when it has at least 2 consumers, or when it enforces a project invariant such as reduced motion, keyboard accessibility, or safe JSON parsing.

## [manual] Architecture Decision Rationale

Decision type: architecture/design-pattern decision.
Status: accepted.
Pattern: **Block-centric feature modules with minimal shared services**.

Why:

- Gutenberg block plugin naturally uses block as the primary unit, not MVC controller/view.
- V1 has interactive blocks (`slider`, `accordion`) that need consistent frontend runtime rules.
- Shared services prevent duplication for project invariants: reduced motion, keyboard accessibility, safe DOM/config parsing.
- Keeping feature logic inside each block avoids over-abstracting early.

Rejected patterns:

- **MVC**: rejected because Gutenberg blocks already define their own editor/save/frontend lifecycle. For this plugin, MVC would add artificial layers without clear benefit.
- **Service-heavy architecture**: rejected for V1 because the plugin is small and block-focused.
- **All logic inside each block with no shared layer**: rejected because accessibility, motion, and config parsing would be duplicated and drift between blocks.

Rules:

- Block-specific behavior stays in the block folder.
- Shared code must be cross-block utility or project invariant.
- Do not create shared abstractions for a single consumer unless it enforces a mandatory invariant.

## [manual] Folder Convention

```text
src/
  index.ts
  shared/
    a11y.ts
    dom.ts
    motion.ts
    types.ts
  slider/
    block.json
    edit.tsx
    save.tsx
    view.ts
    types.ts
  slide/
    block.json
    edit.tsx
    save.tsx
    types.ts
  accordion/
    block.json
    edit.tsx
    save.tsx
    view.ts
    types.ts
```

## [manual] Planned Blocks

- `skvn-marine/slider`
- `skvn-marine/slide`
- `skvn-marine/accordion`
- `skvn-marine/product-collection` — planned V1 / 1.3.3 dynamic product grid/carousel foundation
- `skvn-marine/post-collection` — planned V1 / 1.3.3 dynamic post grid/carousel foundation

## [manual] Product And Post Collections

Design visual-controls planning 2026-11-05: plan054 lưu SVG layout tiles, CSS fit/surface specimens, swatches/type preview theo controls có consumer. Q1(Category existing-only vs modes mới), Q2(Media layout owner/reset), Q3(group navigation) đang đề xuất, chưa human approve/coding. Không coi Category cardPadding là Product mediaPadding, không expose fit trên Product nếu chưa consumer, giữ Legacy/unknown values; Theme Design/session và frame053 không đổi scope.

Execution053 2026-11-05: human cho implementation+agent commit. Collection Product/Post Grid/Carousel và Category Grid đã có source shared editor frame/label/palette/spacing correction; Collection heading/intro cùng frame, query/sample/states giữ và Post note cap5. EF/CP onsite chưa PASS. Shared helper `src/shared/editor-preview-frame.ts` + CSS chỉ editor; không thêm schema/DB/query. Slider source được audit, palette/mockup pending; không có Step Slider registration/runtime trong inventory hiện tại, giữ deferred mapping. Runbook `docs/testing/editor-preview-frames-1.3.19.md`.

Editor preview direction 2026-11-05: plan052 Product Carousel có source card trái/summary-query phải, giữ sample-vs-real/query limitation, onsite CP01–05 chưa PASS. Human duyệt khung chung gồm heading/intro + nhãn loại, Carousel xám xanh/Grid xanh biển nhạt, khoảng hở dọc tối thiểu10px không double parent gap. Đọc `docs/standards/editor-preview-frame-contract.md` và plan053 khi làm preview Collection/Category/Slider/Step Slider. Rollout P1/P2 đã có source theo execution053 ở trên; Slider/Step palette/mockup còn mở. Không áp margin global/core block, không thay frontend hoặc tự mở milestone Slider/Step.

Execution 2026-11-04: current **V1 / 1.3.19 — Plugin Design Sidebar Foundation**, human giao Sol coding plan048. Source shell tại `src/design-sidebar/`, local style controls dùng attrs/Undo/Page Save; Theme Design authenticated adapter trong module typography hiện có, Q1=A/Q2=A, option/theme_mod owners giữ riêng. Contract theme tại `inc/customizer.php`, active child + caps server-gated. Native preview limitations phải hiển thị; không query endpoint mới. Legacy missing mediaLayout không migrate. Runbook/inventory `docs/testing/plugin-design-sidebar-1.3.19*.md`; DS/TD và Carousel carry register chưa runtime PASS. 1.3.18 checkpoint deferred/history; loading046 vẫn scope riêng. Đoạn current cũ bên dưới là baseline lịch sử.

Current collection follow-up: **V1 / 1.3.17 — Product/Post Carousel Block UI & Visual QA**; **1.3.18 Editor UX & Technical PLANNED, chưa start** (human split 2026-10-14, stack M1). 040 §11 owns version mapping; full UX/TECH Deferred to 1.3.18, current only visual plus minimum UI regression. Settings are inventory only; detailed UX/architecture later. Load `.context/planning/040_VER_1_3_17_CAROUSEL_UI_UX_TECHNICAL_PLANNING.md` for Block UI / Editor UX / Technical baseline, full QA mapping and human decisions/rationale (§10, 2026-10-14). Apply `docs/standards/block-ui-editor-ux-technical-review-contract.md`. Product square/contain/full title/mobile arrows are design decisions, not proof of source or onsite PASS; legacy ratio mechanism and Post visual remain separate. No new advanced settings architecture is approved by this plan.

Earlier V1 product surfaces used WooCommerce native blocks/patterns first. That
0.4.0 deferral is superseded for the human-approved future milestone
V1 / 1.3.3.

V1 / 1.3.3 planned direction:

- Decision: `docs/decisions/skvn-dynamic-collections-1.3.3.md`.
- Planning: `.context/planning/archives/024_VERSION_1_3_3_DYNAMIC_COLLECTIONS_PLANNING.md`.
- Testing: `docs/testing/onsite-dynamic-collections-1.3.3.md`.
- Build two custom dynamic SKVN blocks:
  `skvn-marine/product-collection` and `skvn-marine/post-collection`.
- Expose four inserter choices: Product Grid, Product Carousel, Post Grid, and
  Post Carousel.
- Store query/layout/action attributes only; do not store product/post card
  snapshots in saved content.
- Product collection uses WooCommerce/native APIs under the hood. Post
  collection uses WordPress native APIs.
- Do not use direct custom SQL.
- Do not depend on WooCommerce experimental Product Collection extension APIs as
  the SKVN source of truth in V1.
- Grid and Carousel are layout modes. Product/Post remain the query owners.
- Grid must not load carousel runtime. Carousel may reuse the Slider/Swiper
  adapter, pause policy, document visibility behavior, and reduced-motion guard.
- Product/Post cards must not be forced into `skvn-marine/slide` InnerBlocks.
- Product Taxonomy Collections admin, attribute/tag thumbnails, grouped taxonomy
  navigation, product attribute query, faceted filters, archive builder, and
  universal CPT collection remain deferred to 2.x.x or later unless human
  explicitly changes scope.
- Carousel engine decision (2026-10-07): keep Swiper 11 for collection carousel
  (`docs/decisions/collection-carousel-engine-keep-swiper.md`); scroll-snap (B)
  and hybrid (C) stay under deliberation in the ideation workflow and open only
  on onsite measurement.

## [manual] Future Layout Blocks

V1.x / 1.1.0 planned layout blocks:

- Planning file: `.context/planning/003_VERSION_1_1_0_LAYOUT_BLOCKS_PLANNING.md`.
- Source proposal: `.context/proposals/proposal-layout-blocks.md`.
- Candidate blocks: `skvn-marine/card-grid`, `skvn-marine/card`, and later `skvn-marine/quote` / `skvn-marine/hashtag-list`.
- Purpose: repeated artifact sections where core blocks plus raw class names are too fragile for editors.
- `card-grid` and `card` are the first implementation candidates; `quote` and `hashtag-list` are evaluation-only until card-grid/card are validated, unless repeated real artifacts prove earlier editor pain.
- `hashtag-list` must include style controls if implemented: preset-based style, tone, prefix, gap, and wrap. Do not expose raw classes, raw CSS, arbitrary colors, or require manual `#` typing from editors.
- Theme owns visual CSS, decorative presentation, editor/frontend parity, and `skvn-*` classes.
- Plugin owns block registration, attributes, editor UI, saved markup, and any real interaction runtime.
- Not current 0.8.0 scope unless human explicitly changes milestone priority.

## [manual] Future Admin Tooling

HTML-2-Gutenberg tooling belongs to this plugin, not the theme.

Plugin responsibilities for HTML-2-Gutenberg:

- HTML artifact intake.
- Translation workflow/tooling.
- Gutenberg markup validation.
- Brand scan/report output: `brand_source_scan`, `brand_mapping`, `brand_mismatch`, and `token_changes_needed`.
- Future admin publisher/create-page flow.
- Custom blocks only when core Gutenberg blocks plus theme patterns are insufficient.

Theme `skvn-marine` still owns the visual output contract:

- `skvn-*` classes.
- Theme CSS.
- Design tokens.
- Patterns.
- Editor/frontend CSS parity.
- Shared theme-level animation runtime for core blocks, page sections, and theme decoration.

Do not implement the HTML-2-Gutenberg admin tool in the theme.

Do not make this plugin own the primary SKVN visual system.

## [manual] Core Control

- Decision source: `docs/decisions/core-control-core-button-hover.md`.
- `Core Control` is a submenu under the existing `SKVN Marine` admin menu and
  is the shared registry/settings surface for optional WordPress core-block
  enhancements.
- The first planned enhancement is `Core Button Hover Colors`; it defaults to
  disabled to avoid conflicts with plugins that provide similar behavior.
- V1 / 1.3.4 also adopts the existing editor-only `Block Copy/Paste` utility as
  a second registry feature. It defaults to disabled and adds no saved
  attributes, frontend assets, PHP render adapter, or custom clipboard format.
- Block Copy/Paste uses public Gutenberg serialization, parsing, insertion,
  plugin/SlotFill, and notice APIs only. It must not override native clipboard
  events or depend on private editor DOM/UI.
- Content-only actions (plan057, source in 1.3.19): `Copy content` /
  `Paste content only` are a `BlockSettingsMenuControls` fill inside the
  per-block ⋮ menu, gated by the same `block_clipboard` option (default false).
  They support Product/Post Collection and Slider/Slide roots, copy only the
  documented content allowlist, keep destination style/layout/preset/overlay,
  require exact block name plus exact tree shape (Grid↔Carousel of one
  Collection allowed), validate query slugs/URLs/rich text before writing, and
  dispatch one public `updateBlockAttributes(..., { uniqueByBlock: true })`.
  Transport is ordinary Gutenberg plain-text serialize/parse of a projection
  tree; no custom JSON/MIME/envelope, storage, endpoint, CSS or frontend asset.
  The older whole-block Copy/Paste utility keeps its behavior unchanged.
  Pure tests: `tools/tests/block-content-copy.test.mjs`. Build/lint, menu,
  clipboard permission, Undo/Redo and Save/reopen evidence remain pending.
- The toggle controls editor UI and frontend styling, but compatibility data
  must remain registered so disabling the feature cannot invalidate blocks or
  discard saved hover values.
- Extend `core/button` through namespaced plugin attributes and scoped CSS.
  Do not modify WordPress core, GeneratePress, or Gutenberg private panel UI.
- This is a decided future direction only. Do not implement until human assigns
  it to a milestone.
- Planning:
  `.context/planning/archives/023_VERSION_1_3_4_CORE_CONTROL_PLANNING.md`.

## [manual] Portable Plugin Animation Boundary

Decision doc: `docs/decisions/block-animation-strategy.md`.

This boundary is active for V1 / 1.2.0.

Marine Blocks migration trong 1.4.0 thay identity Gutenberg Supercharger; plugin-owned behavior và styling phải portable (plan 047).

Mandatory rule:

- If any animation behavior is exposed by a `skvn-marine-blocks` custom block, the plugin must ship the required behavior without depending on the `skvn-marine` theme.
- Required behavior includes attributes, editor controls, frontend JS, CSS classes, keyframes, transitions, reduced-motion fallback, device targeting, and no-JS visible fallback.
- Theme CSS/JS may skin or override plugin motion, but must not be required for plugin block animation to work.
- Theme animation remains acceptable for core blocks, page sections, and theme decoration that are not plugin-owned block behavior.
- Tailwind/WindPress được dùng enhance core blocks/patterns trên website; không là dependency animation/styling bắt buộc của plugin-owned blocks.

Implemented V1 / 1.2.0:

- `src/shared/motion.ts` owns reduced-motion, device-targeting, and one-shot viewport observer invariants.
- `src/accordion/view.ts` progressively enhances saved Accordion markup with an accessible trigger, ARIA state, real-height animation, and keyboard navigation.
- `src/card/view.ts` is the first governed block motion surface.
- Card presets are limited to Fade up, Fade in, and Hover lift.
- Fade presets support On scroll or Always; Hover lift uses On hover automatically.
- Desktop, Tablet, and Mobile are independent toggles.
- `src/motion.css` and the motion frontend entry are plugin-owned and do not depend on the SKVN theme.
- Remaining onsite verification contract deferred to V1 / 1.3.2:
  `docs/testing/onsite-slider-motion-1.3.2.md`.

## [manual] Footer Settings Module And Future Gutenberg Supercharger Boundary

0.9.0 footer page settings must be implemented as a migration-ready module inside the current `skvn-marine-blocks` plugin.

Allowed current structure:

```text
wp-content/plugins/skvn-marine-blocks/
  modules/
    footer-settings/
```

or:

```text
wp-content/plugins/skvn-marine-blocks/
  includes/
    modules/
      footer-settings/
```

Current 0.9.0 rules:

- Keep plugin slug `skvn-marine-blocks`.
- Keep plugin text domain `skvn-marine-blocks`.
- Keep option key `skvn_footer_page_id`.
- Keep bootstrap and build paths compatible with the current plugin.
- Do not create a `gutenberg-supercharger` or `gutenberg-turbo` plugin in V1.
- Do not rename namespaces, option keys, plugin headers, or activation path.
- Do not add a custom CPT or display-rules system for footer settings.

Implemented 0.9.0 source:

- Module path: `wp-content/plugins/skvn-marine-blocks/modules/footer-settings/footer-settings.php`.
- Bootstrap path: `wp-content/plugins/skvn-marine-blocks/skvn-marine-blocks.php`.
- Admin surface: `Settings → SKVN Footer`.
- The selector only stores a published WordPress page ID or `0`.
- Human chose online/onsite smoke testing instead of local runtime testing for 0.9.0.
- Runtime PHP modules under `modules/` are production files, not dev-only source.
- Deploy artifacts and plugin zips must include any plugin folder loaded by `require`, `require_once`, `include`, or `include_once`.
- When a future milestone adds a runtime folder such as `modules/`, `includes/`, or runtime `assets/`, update `tools/build-deploy-artifact.mjs` and `docs/workflows/deploy-artifact-workflow.md` in the same task.
- After packaging, verify the zip contains the required runtime module paths before onsite upload.

Planned 0.11.0 admin menu refinement:

- Move SKVN Footer out of `Settings`.
- Create a top-level `SKVN Marine` admin menu in the current `skvn-marine-blocks` plugin.
- Put footer settings under the `SKVN Marine` admin menu as a tab/page.
- Keep option key `skvn_footer_page_id` and existing render behavior unchanged.
- Add footer background preset option `skvn_footer_background_preset`.
- Sanitize footer background to approved presets only: `default`, `deep-navy`, `trust-blue`, `white`, `fresh-sky`.
- Do not expose raw hex/rgb/hsl color input for the footer background in 0.11.0.
- The background preset only applies when `skvn_footer_page_id` points to a valid published page.
- Do not hardcode advanced menu ordering in SKVN code; onsite menu repositioning belongs to the external ASE plugin.

0.11.0 decision contract:

- `docs/decisions/footer-appearance-settings-0.11.0.md`

Planned 0.12.0 header actions and B2B search:

- Decision contract: `docs/decisions/header-actions-search-0.12.0.md`.
- Add a future `SKVN Marine → Header` admin surface.
- Store and sanitize header action settings for product search, post/site search, contact CTA, and optional Request Quote CTA.
- Product search and post/site search may ship together but must keep explicit search targets: products, articles, or all site.
- Phase 1 search should use native WordPress/WooCommerce queries with taxonomy/title-first matching.
- Do not add Elastic/OpenSearch in phase 1.
- Do not add custom search query cache, custom SQL cache table, or transient registry in phase 1; rely on native queries and available object cache.

Implemented 0.12.0 source:

- Module path: `wp-content/plugins/skvn-marine-blocks/modules/header-settings/header-settings.php`.
- Bootstrap path: `wp-content/plugins/skvn-marine-blocks/skvn-marine-blocks.php`.
- Admin surface: `SKVN Marine -> Header`.
- Option key: `skvn_header_actions`.
- Stored settings are sanitized to booleans, approved search targets (`products`, `articles`, `all`), approved layouts (`compact`, `full`), text labels, and URLs.
- Header actions are disabled by default for safe deploy; human enables them onsite for testing.

Planned V1.x SKVN Element CPT foundation:

- Planning file: `.context/planning/014_VERSION_1_X_SKVN_ELEMENT_CPT_PLANNING.md`.
- Register plugin-owned CPT `skvn_element` for reusable site elements such as `site_header` and `site_footer`.
- The CPT must be admin/editable but not public: no public single URL, no archive, excluded from search, hidden from nav menus, and excluded from sitemap exposure.
- This is the SEO-safe successor to using normal WordPress Pages for reusable header/footer content.
- Theme owns rendering selected elements into header/footer surfaces and any GeneratePress adapter during the 2.0.0 migration window.
- Keep existing `skvn_footer_page_id` bridge working until an explicit migration step is approved.

Future direction:

- `Gutenberg Supercharger` is a possible V4 / 4.0.0 umbrella-plugin direction and standard/core product name.
- `Gutenberg Supercharger Stage 2` is the pro/commercial stage name.
- `Gutenberg Remap` is retained only as an alternate/redirect candidate.
- Tagline: `Remap Gutenberg. Turbocharge your site.`
- Community tagline: `Make your site feel more "Á đù VTEC".`
- Planning file: `.context/planning/008_FUTURE_CANDIDATE_GUTENBERG_TURBO_PLANNING.md`.
- When future migration is approved, modules such as `footer-settings/`, `article-templates/`, and `layout-controls/` may move under `gutenberg-supercharger/modules/`.
- Until that future milestone is explicitly approved, only use the migration-ready module shape inside the current plugin.

## [manual] SKVN Editor Controls

0.8.0 editor-control contract:

- Contract doc: `docs/decisions/skvn-editor-controls-0.8.0.md`
- Onsite test checklist: `docs/testing/onsite-editor-controls-0.8.0.md`

Plugin responsibilities:

- Sidebar UI for supported SKVN-owned blocks/surfaces.
- Block attributes.
- Saved markup.
- Interactive behavior.

Theme responsibilities remain visual:

- Tokens.
- `skvn-*` classes.
- Width, spacing, radius, shadow, and tone presets.
- Editor/frontend CSS parity.

Do not require raw class input, raw color values, arbitrary inline spacing, custom CSS, or custom JavaScript for normal marketing-editor use.

Governed time control contract:

- All governed time choices in SKVN block inspectors use one shared magnetic
  time control instead of dropdowns or arbitrary numeric inputs.
- The shared control owns rendering, equal-spaced index mapping, keyboard
  stepping, accessible value text, and normalization.
- Each consuming block owns an ordered configuration containing its allowed
  numeric values, human-readable labels, and one default value.
- Store the real numeric value in milliseconds. Do not expose milliseconds as
  an editable input when the editor-facing labels use seconds.
- The default value must exist in the block-owned allowed values.
- Missing, malformed, or disallowed values normalize to the block-owned
  default in both the editor and frontend.
- Blocks may share the control and normalization utility, but must not share
  one allowed-time constant unless their accepted values are intentionally
  identical.
- Use the magnetic time control for ordered duration choices. Keep dropdowns
  for semantic choices that are not an ordered time scale.
- Legacy governed-time values are not preserved by this control contract.

V1.x / 1.6.0 planned SKVN surface presets:

- Planning file: `.context/planning/009_VERSION_1_6_0_SKVN_SURFACE_PRESETS_PLANNING.md`.
- Plugin/editor controls may expose a safe `surfaceStyle` attribute after the theme owns the visual classes.
- Allowed values should stay preset-based: `flat`, `soft`, `glass`, `elevated`, `outlined`.
- Do not save Tailwind/WindPress utility classes as the production contract.
- Do not expose arbitrary blur, shadow, color, or raw CSS inputs for normal editors.

Slider editor UX decision for V1 / 1.2.0:

- Active Slider source of truth:
  `docs/decisions/slider-completion-spec-1.3.0.md`.
- Editor chrome contract (appender, toolbar, useSelect typing path):
  `docs/decisions/gutenberg-editor-chrome-contract.md`.
- Editor arrow preview (CSS cascade, no Swiper hook on preview, contrast bar):
  `docs/decisions/slider-editor-arrow-preview-1.3.6.md` — CASE-006.
- Proven editor failures: CASE-004 (Add slide hit-test), CASE-005 (IME re-render),
  CASE-006 (arrow preview cascade) in `docs/debug-casebook/INDEX.md`.
- V1 / 1.3.0 completes dynamic rendering, compatibility, accessibility, and
  baseline geometry before expanded carousel/showcase UX.
- Do not run Swiper/autoplay inside Gutenberg.
- Hero uses the Slide background-image control; Product Showcase and Card
  Carousel do not expose or render that background treatment.

Future carousel/showcase direction retained for a later human-approved
milestone:

- Historical decision and planning files are linked from the active Slider
  source of truth through their `/archives/` paths.
- Slider navigation and pagination controls are specified in
  `docs/decisions/slider-navigation-and-pagination-controls.md` for V1 / 1.3.1.
  The approved direction uses independent arrow/pagination attributes,
  conditional same-position clustering, Swiper-owned timed pagination, one
  Slider-level governed delay, and no per-Slide duration. It must be built only
  after the failed 1.3.0 media, width, pagination geometry, and memory behavior
  is corrected.
- Carousel/showcase presets may later use a non-moving editor grid. Hero may
  retain a vertically readable editor surface.
- Carousel/showcase editor preview is a non-moving grid with a maximum 5 columns
  by 2 rows and a hard maximum of 10 Slides.
- Keep Gutenberg InnerBlocks and native List View; add visible card management
  without creating a proprietary slide manager.
- Carousel/showcase Slides use one content image and do not expose the Hero
  background-image control.
- General card content is Image, Heading, optional Subheading, Body, Meta, and
  Button. Image and Heading remain visible.
- Desktop card layout is Side by side or Stacked; mobile is always Stacked.
- Approved motion modes are Custom Carousel, Product Showcase Marquee, and
  Centered Carousel, all using the existing Swiper runtime.
- Preset-controlled settings stay visible but are semantically disabled, gray,
  and explained.
- Each Slide uses native Gutenberg LinkControl; the Slider owns the shared
  open-in-new-tab setting.
- Visual styles and backgrounds use governed presets with previews.
- Responsive spacing uses tokens and linked sides, not raw pixels, negative
  margins, or arbitrary CSS.
- Do not implement this expanded UX during 1.3.0.
- Future frontend markup must use the V1 / 1.3.0 dynamic Slider rendering
  foundation.

V1 / 1.2.1 Slider preset and inserter decision:

- Register one `SKVN Marine` Block Inserter category for all SKVN-owned blocks.
- Expose Hero Slider, Product Showcase, and Card Carousel as add-and-see presets.
- Reuse the existing Slider/Slide block slugs and one Swiper runtime.
- Use Gutenberg variations/templates rather than separate duplicated Slider blocks.
- Do not build a custom slide manager, selected-slide canvas, or setup modal.
- Keep native Gutenberg List View and block actions for navigation, reorder, duplicate, and remove.
- Remaining onsite QA for 1.2.0, 1.2.1, 1.3.0, and 1.3.1 is consolidated in V1 / 1.3.2
  after the 1.3.0 dynamic rendering migration.

Implemented V1 / 1.2.1:

- `block_categories_all` registers one plugin-owned `SKVN Marine` category.
- Slider, Slide, Accordion, Card Grid, and Card metadata use category slug `skvn-marine`.
- `src/slider/variations.ts` registers Hero Slider, Product Showcase, and Card Carousel with inserter scope and editable InnerBlocks templates.
- Hero is the default Slider variation so the inserter does not add a fourth generic Slider choice.
- Product Showcase uses flow-based Columns/Image/content blocks.
- Card Carousel saves one responsive preset flag and maps it to Swiper 3/2/1 breakpoints without changing the runtime dependency.
- Existing Slider serialization remains unchanged when the new preset attributes are absent/default.

Implemented V1 / 1.2.3 Feature Showcase:

- Planning file: `.context/planning/archives/016_VERSION_1_2_3_FEATURE_SHOWCASE_PLANNING.md`.
- Decision doc: `docs/decisions/feature-showcase-1.2.3.md`.
- Human-approved name: `SKVN Feature Showcase`.
- Block slug: `skvn-marine/feature-showcase`.
- Source is active under `wp-content/plugins/skvn-marine-blocks/src/feature-showcase/`.
- Metadata is `block.json` and the block is registered from `src/index.ts`.
- Build output includes `build/feature-showcase/block.json`.
- Do not overload the existing `SKVN Accordion`; Feature Showcase is a separate editorial image-panel block.
- The block owns only the image-panel group. The B2B intro/copy/meta text stack belongs to a separate Gutenberg pattern.
- Editors can add, remove, reorder, and edit panels; choose horizontal or vertical desktop layout; choose the initially open panel; and hide or use disclosure on mobile.
- Saved markup uses native `details`/`summary` so mobile tap and keyboard interaction remain available without JavaScript.
- `src/feature-showcase/view.ts` progressively enhances that markup to keep exactly one panel active, close siblings when another panel opens, and prevent the active/only panel from collapsing into an empty surface.
- On fine-pointer devices, panel hover activates the corresponding `details`; on touch/coarse-pointer devices, summary tap remains the activation path.
- Enhanced summary clicks prevent the native details toggle before activating the target, avoiding a transient all-closed flash.
- Feature Showcase gradient choices are governed contrast packages: Ocean,
  Deep navy, Marine teal, and Fresh sky. A package controls the panel, rail,
  overlay, text, label, index, and border colors together.
- Fresh sky uses dark text and a light image overlay; editors do not enter raw
  colors or gradients.
- The first activated static markup is preserved through a Gutenberg deprecation and legacy CSS until old content is resaved.

Completed V1 / 1.3.2 Feature Showcase autoplay and panel links:

- Planning file:
  `.context/planning/archives/020_VERSION_1_3_2_FEATURE_SHOWCASE_AUTOPLAY_AND_LINKS_PLANNING.md`.
- Implemented after V1 / 1.3.0 dynamic rendering and the human-approved
  V1 / 1.3.1 Slider controls milestone. Human approved transition on
  2026-06-13; any newly discovered defects are follow-up fixes.
- Feature Showcase adds governed `hover` and `autoplay` interaction modes.
- Autoplay delay uses the shared magnetic time control with the Feature
  Showcase-owned `3`, `5`, `7`, and `9` second configuration and a `5` second
  default; no arbitrary timing input.
- Each panel may use Gutenberg LinkControl for an optional CTA destination.
  The CTA belongs inside panel content; do not turn `details`, `summary`, or the
  whole interactive panel into a navigation link.
- Feature Showcase keeps native `details`/`summary` and a block-local timer; it
  must not initialize Swiper.
- After Slider stability is verified, Slider and Feature Showcase may share
  reduced-motion, delay normalization/marks, pointer/focus pause-resume, and
  document visibility policy.
- Slider keeps Swiper as its only movement controller. Feature Showcase keeps
  ownership of sibling-details synchronization and panel activation.
- Existing Slider and Feature Showcase saved content must remain compatible
  before editor controls are restricted to shared presets.

0.5.1 brand-mapping contract:

- Treat artifact colors and Tailwind classes as source hints, not production contracts.
- Map visual cues to theme-owned SKVN tokens/classes when producing Gutenberg output.
- If a required token/class does not exist, report it in `token_changes_needed` or `missing_theme_classes`; do not inject raw color CSS into content.
- Leave brand profile/theme token implementation for V1 / 0.7.0.

## [manual] Collection Carousel Runtime State Contract

Áp dụng cho `src/collection-view.ts` + `src/collection/style.css` + `modules/collection-render/`.

**State owner duy nhất:** phần tử `<section class="skvn-collection …">`. JS **không** được gắn `skvn-is-initializing` / `skvn-is-ready` / `skvn-is-fallback` vào `.skvn-collection__carousel-outer`.

DOM thực tế:

```text
<section class="skvn-collection skvn-collection--{product|post} skvn-collection--{grid|carousel} …">   ← state owner
  <header> … .skvn-collection__arrow--prev/next (NGOÀI carousel-outer) … </header>
  <div class="skvn-collection__carousel-outer" data-skvn-collection-carousel>   ← JS đọc dataset ở đây
    <div class="skvn-collection__carousel swiper">
      <div class="swiper-wrapper">…real slides…</div>
      <div class="skvn-collection__skeleton" aria-hidden="true">…</div>          ← nằm trong carousel
    </div>
  </div>
</section>
```

**Bài học đã mắc 1 lần (regression scrollbar ngang, 1.3.17 gói C/D, 2026-10-19):**
CSS state selector và JS class mutation **phải trỏ cùng một phần tử**. Đã có class trong source, hoặc build thành công, **không** chứng minh selector match DOM runtime.

Triệu chứng: carousel vẫn cuộn ngang sau khi Swiper init, arrows luôn ẩn, skeleton không bao giờ hiện. Nguyên nhân: JS gắn class vào `carousel-outer` trong khi CSS viết `.skvn-collection--carousel.skvn-is-ready` (class nằm trên `section`) → `:not(.skvn-is-ready)` luôn đúng → `overflow-x: auto` + gap fallback **luôn bật** ở Ready; rule `visibility:hidden` cho arrows/skeleton cũng không bao giờ match.

Vì sao self-review bỏ sót: đã đọc lại từng hunk JS và CSS riêng lẻ và thấy "đúng cú pháp", nhưng **không** đối chiếu phần tử mà mỗi bên nhắm tới; cũng không có bước nào bắt buộc kiểm selector có match DOM thật trước khi coi là xong.

**Check bắt buộc trước khi coi là xong (áp cho mọi thay đổi lifecycle):**

1. Xác định state owner bằng `grep` ra chỗ render class ở PHP, viết ra `file:line`, rồi viết selector CSS cùng phần tử đó.
2. Đối chiếu DOM thật: state class phải nằm trên **một** phần tử; không selector nào dựa trên việc class "chắc là sẽ match".
3. Kiểm đủ 4 state trên **cùng một build**: SSR (không JS), `initializing`, `ready`, `fallback`/destroy.
4. Element nào bị `visibility: hidden` chỉ được chứa nội dung thật — không được nuốt skeleton/con trợ giúp nằm chung.
5. Evidence bắt buộc khi nghiệm thu: class list **của section** + class list của `carousel-outer` (phải sạch state class), computed `overflow-x` và `gap`, rect carousel so với page, screenshot.
6. Phân biệt overflow nội bộ của track dài (bình thường ở SSR/fallback) với tràn ngang toàn trang (lỗi). Không dùng `overflow: hidden` ở body/page để che.

**Sửa test đã từng sai:** `docs/testing/carousel-skeleton-loading-1.3.17.md` case D-01 ban đầu yêu cầu chặn `collection-view.ts` rồi kỳ vọng skeleton hiện — mâu thuẫn với chính cơ chế (runtime chạy mới gắn `initializing`). Đã đổi D-01 thành kiểm SSR/fallback và thêm D-04 mô phỏng có kiểm soát bằng cách ép class `skvn-is-initializing`, ghi rõ là mô phỏng chứ không phải cold-load thật. Không thêm delay production chỉ để nhìn thấy skeleton.

## [manual] Rules

- Use TypeScript.
- Use `block.json`.
- Use `skvn-marine` block namespace.
- Do not depend on GeneratePress-specific markup.
