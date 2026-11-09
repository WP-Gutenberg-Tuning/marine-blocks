# THEME — skvn-marine

## [manual] Role

Current transition2026-11-07: human bắt đầu **1.3.20 — Product Category Grid + Category details + Woo Archive M1**.1.3.19 DEFERRED_WITH_CARRY_OVER; acceptance chưa nghiệm thu giữ current carry register/history, không completed/PASS. Metadata development1.3.20, không release/deploy.049/059/060 là scope; ảnh1:1, ratio controls next scope, Blog/M2 chưa start. Checkpoint current1.3.19 bên dưới là lịch sử. Nhắc chạy deferred tests trước follow-up runtime khác.

GeneratePress child theme for SKVN Marine visual system.

Human decision 2026-11-04: theme giữ identity SKVN Marine. Website được dùng WindPress enhance core blocks/patterns; plugin Marine Blocks ship styling/runtime riêng. Trong migration 1.4.0 (SemVer đã xác nhận, chưa start), có thể sửa điểm gọi API plugin hoặc dùng compatibility wrapper, không rename prefix/tokens theme. Quy tắc surface presets độc lập WindPress vẫn áp riêng cho presets. Xem plan `.context/planning/047_VER_1_4_0_MARINE_BLOCKS_MIGRATION_PLANNING.md`.

## [manual] Responsibilities

Header menu responsive repair2026-11-08: user chốt hamburger+drawer toàn menu rồi report Home thiếu responsive.390px onsite header246px/toggle0/dialog0; CSS mới đã nạp nhưng JS companion chưa tích hợp. Existing assets/js/animations.js nay có controller scoped `.marine-menu-demo`, độc lập reveal early-return, native dialog/focus/scroll/resize/reduced-motion; inc/enqueue.php thêm wp-i18n/theme domain translations, giữ handle/filemtime.9Node VM model testsPASS; PHP lint/native browser/site deploy pending. CSS owner vẫn WindPress companion unlayered; example mirror sync từ shared runtime. Không sửa plugin/header GP, không bump/chuyển milestone. Runbook `docs/testing/mega-menu-gutenberg-tailwind-prototype.md`, artifact README có2files cần deploy.

Archive hotfix059§12–13 start2026-11-07: human duyệt “Thực hiện”; outer grid header/nav/toolbar/results chung240px+32px/container1120, narrow DOM H1→Categories→count/sort→cards. Một nav/disclosure theme-only archive-categories.js, CSS mode owner/ResizeObserver/no animation/no-JS open/focus-safe resize.5Node VM state testsPASS, geometry/native Woo/PHP lint pending; AP-11/runbook giữ evidence. Supersede flex§11; không đổi plugin/query/card1:1/version hoặc claim runtime PASS.

Archive heading hotfix2026-11-07 — plan059§11 human duyệt/source: native H1 + result count/sort cùng heading row bằng public Woo header hook và guarded native dispatchers; sidebar giữ, narrow wrap/stack, no query/JS/plugin bundle changes. Old/custom-header/shortcode fallback giữ controls. HF-HDR-* source/onsite status tại runbook archive, chưa runtime PASS hoặc bump/commit/deploy.

Archive shared-card060 update2026-11-07: human duyệt1:1, source optional public plugin presenter/card-only CSS + native template-part adapter. Theme giữ category shell/query-native integration/fallback;5loop actions preserved với known callbacks suppress/restore mỗi item. Missing API/CSS/template fallback5rows cũng1:1.060§11/runbook cho evidence; actual UI/Woo/GP/build chưa kiểm, no ratio setting cho tới scope kế tiếp được chốt.

Archive M1 update2026-11-06: human cho coding chung1.3.20; source inc/woocommerce.php + style.css, không thêm runtime include. Shop/product category/tag: category sidebar desktop/tablet top navigation,5specs/read existing attributes+MOQ meta, native quote/details, empty shell, native Woo placeholder chỉ archive. Query/order/pagination không thay. Current1.3.19 không chuyển/bump; Blog/M2 chưa start. Plan059§10/runbook là execution/evidence mới, supersede checkpoint discussion bên dưới; runtime chưa kiểm chứng.

Archive repair discussion2026-11-06: human yêu cầu WooCommerce + Blog archive trong1.3.x; plan059 là nơi ghi thảo luận, đề xuất sau1.3.23, predecessor/SemVer/start chưa chốt. Audit Shop/product taxonomy và posts-index/category/tag routes/template thực trước design/code; theme owns visuals, WP/Woo giữ native query/routing, không mở archive builder hoặc đổi plugin Collection ownership. Source baseline archive.php/inc/woocommerce.php + plan025; chưa có archive URLs/defect screenshots, AR-* Chưa làm. Current1.3.19 giữ nguyên.

- Theme styles and tokens.
- GeneratePress child customization.
- Page templates and full-width layout surfaces.
- Block styles.
- Patterns.
- Woo visual overrides.
- Media ALT helper.
- Frontend animation runtime.

## [manual] Design Direction

- Use a blue-first system for V1 visual direction.
- Primary CTA remains blue, not mint or gold.
- Soft mint is the main support accent for freshness, hygiene, cold-chain, factory/process, trust strip icons, support cards, and form support surfaces.
- Bright gold is only a limited premium cue for certification, premium species badges, buyer-value highlights, or top-grade labels.
- Do not use gold as a dominant background.

Current token intent:

- Deep navy: `#073b5a`
- Trust blue: `#0f5c8c`
- Primary blue: `#1e79be`
- Fresh sky: `#eaf7ff`
- Support mint: `#ddfaf4`
- Premium gold: `#e9c766`
- Text slate: `#0f172a`

0.5.1 visual hotfix:

- Translated artifact heroes should use fresh sky/white surfaces instead of full navy backgrounds by default.
- Deep navy remains available for text, footer, and trust surfaces.
- Brand profile/sidebar color controls remain deferred to V1 / 0.7.0; do not add a new token UI in 0.5.1.

## [manual] Layout Direction

- 0.5.0 introduces a reusable page layout named `SKVN Full Width`.
- The layout is not landing-page specific. It is the general canvas for homepage, product overview, campaign, and UI test pages that need full-width Gutenberg sections.
- Keep GeneratePress header/footer intact.
- Remove or bypass the narrow default content wrapper only for pages explicitly using this template/layout.
- `alignfull` sections should reach viewport width.
- Inner content must stay constrained by SKVN design widths.
- Do not fix this by editing GeneratePress parent files.
- Do not create a custom block for this layout in V1.

## [manual] Grid Layout Ownership

- Gutenberg-native dynamic grids should treat the editor Columns setting as source of truth when the block exposes a clear column count in saved markup.
- If a Gutenberg-native grid is set to 3 columns, item 4 and item 5 should wrap to the next row rather than being auto-fit into more columns on wide screens.
- Fixed theme presets such as stat grids, semantic hero/split grids, footer grids, or process layouts are theme-controlled. Their column-count controls should be hidden, disabled, or replaced with a label such as `Theme layout controls this grid`.
- `SKVN Adaptive Grid` is the planned SKVN-owned auto-responsive grid contract. It should use SKVN presets such as min item width/density instead of exposing a raw column count.
- `SKVN Adaptive Grid` contract documentation belongs to milestone `0.7.1`; custom block/editor control implementation remains deferred to `0.8.0` unless human explicitly changes scope.

## [manual] Gutenberg Width And Canvas Contract

`SKVN Full Width Canvas` opens the GeneratePress page shell; it must not make
every top-level Gutenberg block full width.

Required frontend width semantics:

```text
Top-level block without alignment -> --skvn-content-width
Top-level .alignwide             -> --skvn-wide-width
Top-level .alignfull             -> full page canvas
```

Implementation rules:

- Mandatory agent standard:
  `docs/standards/css-layout-safety-contract.md`.
- Approved GeneratePress compatibility and standalone migration decision:
  `docs/decisions/canvas-alignment-and-generatepress-exit.md`.
- Layout width must have one owner. Do not let Gutenberg, GeneratePress, an
  SKVN page template, and a component class independently calculate the same
  full width.
- `.skvn-full-width-canvas` may remove GeneratePress shell width, margin,
  padding, and sidebar constraints.
- Do not apply `max-width: none` to every `.entry-content > *`.
- When the owning SKVN canvas is already full width, direct `.alignfull`
  children use `width: 100%`, not scrollbar-inclusive `100vw` plus negative
  viewport margins.
- While GeneratePress remains active, the SKVN canvas adapter must also
  neutralize negative viewport margins on nested legacy `.alignfull` blocks,
  because GeneratePress applies its rule to all descendants.
- New SKVN patterns should still prefer one alignment owner per layout level;
  nested compatibility is not a recommendation to generate nested
  `.alignfull`.
- `overflow-x: hidden` or `overflow-x: clip` may intentionally clip decoration,
  but must not hide incorrect layout geometry.
- A full-width marketing pattern should use an outer `alignfull` Group with
  `layout: default`.
- The outer Group owns surface background and section padding.
- A named inner grid owns `max-width: var(--skvn-wide-width)`, `width: 100%`,
  and `margin-inline: auto`.
- Do not increase global `theme.json` `contentSize` to repair one pattern.
- Do not depend on generated `wp-container-*` classes.
- Do not use `!important` to defeat Gutenberg constrained layout.

Agent debugging checklist:

1. Inspect the saved Gutenberg comment markup and the rendered frontend HTML.
2. Record the block's `align` and `layout.type`.
3. Inspect ancestor classes: `body`, `.site`, `.site-content`,
   `.entry-content`, and direct block wrapper.
4. Compare computed `width`, `max-width`, and horizontal margins at each
   ancestor.
5. Search theme CSS for `.entry-content > *`, `.alignwide`, `.alignfull`,
   `contentSize`, and `wideSize` before changing component CSS.
6. Fix the owning layout layer instead of forcing width inside the custom
   block.
7. For any viewport-unit or overflow rule, run the geometry check from
   `docs/standards/css-layout-safety-contract.md` with a visible vertical
   scrollbar.
8. If the source is a GeneratePress selector, fix it in the scoped SKVN
   compatibility adapter. Do not copy the GeneratePress negative-margin
   algorithm into future standalone theme CSS.

## [manual] Typography Scope

Typography có hai lớp — **không gộp**:

| Lớp | Admin UI | Theme file | Plugin file |
|---|---|---|---|
| Palette + heading scale | SKVN Marine → Typography | `inc/typography.php` | `modules/typography-settings/` |
| Font preset + Google Fonts | Appearance → Customize → Typography (SKVN) | `inc/customizer.php` | — |

**Scope contract (bắt buộc):** `docs/decisions/typography-scope-and-font-loading.md`

- Frontend: `body:not(.wp-admin)` — full SKVN tokens + fonts.
- Block editor canvas: `.editor-styles-wrapper` — preview khớp frontend.
- wp-admin chrome (menu, list tables, SKVN settings pages): **không** inject theme font/color tokens.
- Cấm `:root` font/palette inject từ `enqueue_block_editor_assets`.
- Google Fonts: CSS2 API, Vietnamese-capable presets; không dùng `subset=vietnamese` (API v1 legacy).
- Plugin typography-settings **không** enqueue CSS — chỉ save option.

Planning implement: `.context/planning/archives/029_VER_1_3_6_TYPOGRAPHY_SCOPE_ISOLATION_PLANNING.md`

## [manual] Page Display Controls

- 0.5.1 introduces page-level controls for marketing-owned pages that need alternate chrome.
- Required controls: Hide site header, Hide site footer.
- Store per-page values in post meta using `_skvn_` meta keys.
- The frontend must apply controls without editing GeneratePress parent files.
- Prefer editor/admin UI controls over raw class names.
- Do not add a header/footer builder plugin by default.
- Page preset `SKVN Landing Canvas` groups the standard marketing-page setup into one editor action: hide page title and enable the full-width/no-sidebar SKVN canvas.
- Page preset `SKVN Request Quote Page` groups the 0.6 quote-page setup into one editor action: hide page title and enable the full-width/no-sidebar SKVN canvas.
- The preset is stored in `_skvn_page_display_preset`; direct toggles remain available for overrides and debugging.
- Do not blindly write GeneratePress layout metabox meta. Use SKVN meta/classes and safe GeneratePress filters where audited.
- Design debt for V1 / 0.8.0: frontend title visibility must be separated from editor title identity. A hidden frontend title should not make the Gutenberg title field/identity surface disappear while editing.

## [manual] HTML-2-Gutenberg Boundary

Theme owns the visual output contract for HTML-2-Gutenberg, not the translator tool.

Theme responsibilities:

- `skvn-*` class styling.
- Design tokens.
- Block styles.
- Patterns.
- Editor/frontend CSS parity.
- Background/decorative animation and shared animation runtime.

Plugin `skvn-marine-blocks` owns the HTML-2-Gutenberg tool itself:

- HTML artifact intake.
- Translation workflow/tooling.
- Validation.
- Future admin publisher/create-page flow.

Do not implement HTML-2-Gutenberg admin/tooling logic in the theme.

## [manual] HTML-2-Gutenberg CSS Families

HTML-2-Gutenberg output must reuse implemented theme CSS families before inventing new `skvn-*` classes.

Implemented translated-layout families in `wp-content/themes/skvn-marine/style.css`:

- `skvn-translated-page`
- `skvn-translated-hero`
- `skvn-translated-hero__grid`
- `skvn-translated-hero__content`
- `skvn-translated-hero__media`
- `skvn-translated-hero__eyebrow`
- `skvn-translated-hero__heading`
- `skvn-translated-hero__lead`
- `skvn-translated-hero__actions`
- `skvn-translated-hero__image`
- `skvn-kpi-strip`
- `skvn-kpi-strip__grid`
- `skvn-kpi-strip__item`
- `skvn-translated-split`
- `skvn-translated-split__grid`
- `skvn-placeholder-media`
- `skvn-section__eyebrow`
- `skvn-section__heading`
- `skvn-section__lead`
- `skvn-card`
- `skvn-button`
- `skvn-button--primary`
- `skvn-button--secondary`
- registered button style `is-style-skvn-primary`

Reference pattern:

- `wp-content/themes/skvn-marine/patterns/artifact-exporter-test.php`

Translator rule:

- Reuse `skvn-translated-*`, `skvn-kpi-strip*`, `skvn-section__*`, `skvn-placeholder-media`, `skvn-card`, and `is-style-skvn-*` when translating generic HTML artifacts.
- Do not create new layout-critical families like `skvn-hero__*`, `skvn-card-grid`, `skvn-logo-grid`, or `skvn-testimonial-grid` unless their theme CSS is implemented in the same task or they are explicitly listed in `missing_theme_classes`.
- If exact artifact layout requires classes not yet implemented, output native Gutenberg structure first and record the CSS contract separately.

## [manual] Site Branding Governance

Brand customization is allowed, but brand variables and assets must be managed through the registry in `docs/standards/site-branding-guideline.md`.

Before coding any branding, visual token, theme screenshot, pattern identity, or editor visual parity change, update or verify `docs/standards/site-branding-guideline.md` first. Do not implement scattered branding changes until the docs state which file owns the variable, class, or asset.

V1 / 0.7.0 brand profile source of truth:

- `docs/decisions/brand-profile-theme-tokens.md`

This document defines semantic profile aliases, current token mapping, `theme.json` / `style.css` sync pairs, editor/frontend contract, HTML-2-Gutenberg brand report mapping, and external implementation references. Runtime token changes must follow it.

V1.x / 1.6.0 planned SKVN surface presets:

- Planning file: `.context/planning/009_VERSION_1_6_0_SKVN_SURFACE_PRESETS_PLANNING.md`.
- Theme owns `skvn-surface--flat`, `skvn-surface--soft`, `skvn-surface--glass`, `skvn-surface--elevated`, and `skvn-surface--outlined` if implemented.
- Surface preset CSS must use SKVN tokens/classes and must not depend on WindPress/Tailwind utilities in production output.
- Glass must have a readable non-blur fallback and must not be used for long article body content by default.
- Plugin/editor controls may select presets later, but the visual implementation stays theme-owned for SKVN-local hardening.

Theme-owned brand sources:

- CSS tokens and component styles: `wp-content/themes/skvn-marine/style.css`.
- Gutenberg presets: `wp-content/themes/skvn-marine/theme.json`.
- Editor style loading: `wp-content/themes/skvn-marine/inc/setup.php`.
- Patterns: `wp-content/themes/skvn-marine/patterns/*.php`.
- Theme screenshot: `wp-content/themes/skvn-marine/screenshot.png`.

Do not move the primary brand system into the plugin. Plugin assets may follow the brand, but do not define it.

## [manual] Footer Page Rendering

0.9.0 source:

- Theme render module: `wp-content/themes/skvn-marine/inc/footer.php`.
- Theme bootstrap: `wp-content/themes/skvn-marine/functions.php`.
- Option key read by the theme: `skvn_footer_page_id`.
- The theme replaces GeneratePress footer callbacks only when the option points to a published WordPress page.
- Fallback remains the default GeneratePress footer when no valid footer page is selected.
- Do not edit GeneratePress parent theme.
- Do not add a custom CPT or display-rules system for footer rendering in 0.9.0.

0.11.0 planned footer appearance setting:

- Decision contract: `docs/decisions/footer-appearance-settings-0.11.0.md`.
- Plugin stores `skvn_footer_background_preset`; theme maps approved presets to CSS variables/tokens.
- The selected footer background must apply to `.skvn-footer-page`.
- The selected footer background must also apply to the outermost Gutenberg block `.skvn-site-footer` when the footer page content starts with:

```html
<!-- wp:group {"className":"skvn-site-footer","layout":{"type":"default"}} -->
<div class="wp-block-group skvn-site-footer">
```

- Viewport space below the custom footer should use the same footer background, while `.site` keeps the normal page background.
- Do not require marketing editors to type raw classes, raw CSS, or raw color values for this setting in 0.11.0.

## [manual] Header Actions And B2B Search

0.12.0 planned direction:

- Decision contract: `docs/decisions/header-actions-search-0.12.0.md`.
- Use Header Actions, not a full Header Builder, for the first phase.
- GeneratePress header remains the shell; do not replace it with a Gutenberg header template in phase 1.
- Theme owns GeneratePress hook integration, header action visual layout, responsive CSS, and `skvn-*` classes.
- Header actions may include product search, post/site search, contact CTA, and optional Request Quote CTA.
- Search results should be visually governed for B2B and separate Products from Related articles.
- Search visual output belongs to theme CSS; search query/settings ownership stays outside theme.

0.12.0 implemented source:

- Header action render module: `wp-content/themes/skvn-marine/inc/header-actions.php`.
- Theme bootstrap: `wp-content/themes/skvn-marine/functions.php`.
- Search results template: `wp-content/themes/skvn-marine/search.php`.
- Theme reads option `skvn_header_actions`, sanitizes defensively, and renders actions through `generate_after_header_content`.
- Search results use governed sections for Products and Related articles, with taxonomy-first and title-first native `WP_Query` passes before content fallback.
- Header action CSS and search result CSS live in `wp-content/themes/skvn-marine/style.css`.

HTML-2-Gutenberg brand-mapping contract for 0.5.1:

- Translator output must report `brand_source_scan`, `brand_mapping`, `brand_mismatch`, and `token_changes_needed`.
- Artifact colors, Tailwind color utilities, fonts, radius, shadows, and spacing cues are input hints only.
- Production output must map those cues to SKVN theme tokens, existing `skvn-*` classes, Gutenberg presets, or block styles.
- If the current theme token set cannot represent an artifact cue, record it in `token_changes_needed`; do not put raw hex/rgb/hsl values or Tailwind color utilities into Gutenberg content as the production contract.
- Theme token implementation and brand profile work remain parked until V1 / 0.7.0. Do not code a brand profile UI or new token system during 0.5.1.

0.5.1 Tailwind artifact CSS hardening decision:

- `docs/decisions/reports/style-css-change-log.md` records human-approved CSS hardening discovered while generating test data from real Tailwind web artifacts.
- This is allowed inside 0.5.1 only as visual contract hardening for existing theme CSS/classes; it does not move HTML-2-Gutenberg tooling, publisher UI, brand profile, or token-system implementation into the theme.
- Before marking a class as missing or adding CSS, scan `wp-content/themes/skvn-marine/style.css` first and reuse existing `skvn-*` families.

## [manual] Forbidden

- Do not edit parent GeneratePress.
- Do not register complex custom Gutenberg blocks here.
- Do not handle quote form submissions manually in V1.
