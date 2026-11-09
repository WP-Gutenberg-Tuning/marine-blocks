# Version 2.0.0 to 3.0.0 Planning — Standalone SKVN Theme And Block Add-ons

Status: planning
Target: V2 / 2.0.0 migration start -> V3 / 3.0.0 completion
Scope owners: `skvn-marine` theme, `skvn-marine-blocks` plugin

## Direction

Human direction:

- `2.0.0`: start migrating away from GeneratePress.
- `3.0.0`: complete the migration and run SKVN as a standalone/custom theme.

WordPress-aligned interpretation:

- Do not move away from Gutenberg as the WordPress editor/content model.
- Move away from GeneratePress/classic-theme dependency.
- Make the SKVN theme own site structure, templates, global styles, patterns, and visual contracts.
- Keep custom blocks as optional add-ons for governed editing where core blocks are too fragile.

## Why

Current V1 works because GeneratePress supplies a stable classic-theme shell. The tradeoff is editor/frontend parity debt:

- Frontend uses GeneratePress wrappers, hooks, and layout controls.
- Gutenberg editor previews only content inside an iframe/canvas.
- Some controls live in GeneratePress panels while SKVN Page Display owns related behavior.
- Reusable header/footer/page surfaces need SKVN-owned governance before GeneratePress disappears.

The long-term target is a cleaner ownership model:

```text
SKVN theme
  -> templates
  -> global styles / theme.json
  -> patterns
  -> header/footer/page chrome
  -> visual CSS contract

SKVN blocks plugin
  -> optional custom blocks
  -> editor controls
  -> structured add-ons
  -> portability layer for future plugin/product direction
```

## Medium-Term Plan

### Carry-in 2026-11-04 — GP Content Container dependency (GP-LAYOUT-01)

Human yêu cầu lưu để xử lý khi **bắt đầu tách GeneratePress ở 2.0.0**, hướng tới bộ layout SKVN có contract rõ ràng hơn. Đây là follow-up được lên lịch, không yêu cầu vá CSS hiện tại, không chuyển milestone hoặc bắt đầu migration.

**Human-reported behavior:** nếu GeneratePress Layout → Content Container không chọn **Contained**, content tràn ra ngoài; bật hay tắt **SKVN Page Display → Full width canvas** đều không giải quyết. Chưa có số đo để phân biệt tràn ngang viewport, vượt content wrapper hay mất constraint của inner content. Không tự coi đây là cùng root cause với lỗi negative-margin alignfull trước đây.

Evidence đã lưu: [editor settings](../../docs/testing/evidence/gp-content-container-2026-11-04/editor-contained.png), [frontend reference](../../docs/testing/evidence/gp-content-container-2026-11-04/frontend-reference.png). Ảnh settings: SKVN Landing Canvas, hide title on, Full width canvas on, No Sidebars, Content Container Contained. Ảnh frontend là reference layout, không đủ để chứng minh trạng thái lỗi khi chọn option khác. Page candidate từ chat: `https://minhhaifishery.com/home/`; cần xác nhận hai ảnh thuộc đúng page trước khi tái hiện.

| ID | Nhóm | Hành vi mong đợi | Hiện trạng | Việc cần làm khi 2.0.0 bắt đầu | Cách kiểm | Evidence |
|---|---|---|---|---|---|---|
| GP-LAYOUT-01A | Block UI | Normal/wide/full có width owner rõ; full-bleed background không làm inner content tràn; header/footer và carousel giữ đúng container | Deferred; human report, chưa đo runtime | Audit GP container + SKVN canvas + block alignment, thiết kế layout presets/fixtures chuẩn; không dùng overflow-x để che sai geometry | Cùng page/content, đổi từng control; desktop có scrollbar, tablet/mobile; normal/wide/full/nested fixtures | Matrix, computed styles/boxes/clientWidth/scrollWidth, screenshots |
| GP-LAYOUT-01B | Editor UX | Một bộ control SKVN diễn đạt rõ page canvas/content width/alignment; editor không cần biết phải chọn GP Contained để tránh vỡ layout | Deferred | Inventory hai panel, xác định precedence/applicability và mapping setting cũ; không thêm control cạnh tranh hoặc đổi saved data ngầm | Toggle/save/reopen, editor↔frontend, old content và preset/custom state | Settings/meta snapshots, mapping, screenshots |
| GP-LAYOUT-01C | Technical | 2.x có adapter rõ ràng; 3.0.0 layout hoạt động khi GP/adapter không còn | Deferred | Trace hook/meta/template/CSS owner; migration contract cho GP container meta, theme.json content/wide sizes; giữ plugin portable | Reuse matrix trên GP adapter rồi standalone templates không GP; regression header/footer/content | DOM/CSS ownership, before/after geometry, runtime evidence |

Runbook: [gp-content-container-layout-migration.md](../../docs/testing/gp-content-container-layout-migration.md). **Trigger:** khi 2.0.0 trở thành current, nhắc human chạy baseline GP-LAYOUT-01 trước follow-up layout không liên quan. Không đánh dấu PASS từ ảnh hoặc source. 2.0.0 giải quyết audit/contract/bridge; 3.0.0 phải chứng minh không còn dependency vào GP Content Container. Kế hoạch chưa chốt tên/số lượng preset, không tự mở implementation.

**Mục tiêu migration bổ sung — human 2026-11-04:** không phải chỉnh sửa thủ công toàn site khi chuyển khỏi GeneratePress. Layout mới phải có đường tương thích cho content, block markup, patterns, page presets và layout settings đã lưu; không lấy việc mở/sửa/save lại từng page/post làm prerequisite để hiển thị đúng. Trước triển khai phải inventory dependencies và lập mapping GP/SKVN settings cũ → layout contract mới. Ưu tiên adapter/default tương thích; nếu dữ liệu cần chuyển đổi, chuẩn bị migration có kiểm soát, chạy lại an toàn, có dry-run/report và rollback/backup. Không global replace hoặc rewrite DB khi chưa audit và được human cho phép.

Acceptance bổ sung **GP-LAYOUT-02**: trên staging clone có inventory các loại trang/template đang dùng, đổi sang nền theme mới và chạy migration được duyệt; các trang đại diện và toàn bộ URL trong inventory được kiểm tra mà không sửa/save lại từng trang. Giữ content, links, media, block validity, page-level overrides và layout intent normal/wide/full; so sánh screenshot/geometry trước-sau theo fixtures. Nếu có ngoại lệ không tự chuyển được, báo danh sách URL, lý do, ảnh hưởng và cách xử lý trước cutover để human quyết định; không âm thầm chuyển gánh nặng sang chỉnh toàn site hoặc coi ngoại lệ là PASS. Mục tiêu này giữ hiệu lực qua 2.x tới gate standalone 3.0.0; chưa chọn công cụ hoặc tự cho phép chạy migration.

### Phase 1 — V1.x Hardening Before Migration

Goal:

- Reduce editor/frontend parity debt without changing the theme foundation.

Actions:

- Keep GeneratePress parent untouched.
- Keep `add_editor_style( 'style.css' )` as the baseline editor style path.
- Add only small editor-only CSS where the editor canvas differs from frontend wrappers.
- Add a visual parity test fixture/checklist for reusable SKVN classes.
- Keep page display controls SKVN-owned and avoid requiring GeneratePress panel knowledge.
- Keep custom blocks deferred until repeated editor pain is proven.

Acceptance:

- [ ] Editor/frontend CSS parity checklist exists.
- [ ] Key classes are tested: `skvn-translated-hero`, `skvn-quote-context-card`, `skvn-hashtag-list`, `skvn-quote-form`, `skvn-site-footer`.
- [ ] No large duplicated editor stylesheet is created.
- [ ] No GeneratePress parent files are edited.

### Phase 2 — 2.0.0 Migration Start

**Nhắc human khi bắt đầu — quyết định 2026-11-09:** trước khi chốt kế hoạch header/footer trong đợt tách GeneratePress, agent phải trình [digest Header/Footer và Mega Menu](../../docs/ideations/megamenu/README.md) để thảo luận sâu và xin human chốt scope, thứ tự, SemVer/milestone cụ thể. Đọc cả digest, câu hỏi §6 và acceptance HF-*; làm rõ host theme, plugin component/assets vs theme placement, storage/menu source, CTA mobile, templates/conditions/wave và migration/fallback. Theo dõi checklist tại MILESTONES.md §“Nhắc thảo luận khi bắt đầu tách GeneratePress”.

Trigger này là **thảo luận khi bắt đầu migration**, còn module vẫn chỉ triển khai **sau khi theme độc lập khỏi GeneratePress** theo định hướng đã lưu. Không tự gán module vào 2.0.0/3.0.0 hoặc bắt đầu coding; nếu human chưa quyết milestone, giữ trạng thái chờ và ghi các câu hỏi chưa chốt.

Goal:

- Start replacing GeneratePress-dependent behavior with SKVN-owned adapters and contracts.

Theme actions:

- Audit all GeneratePress-specific hooks, filters, wrappers, and assumptions.
- Isolate GeneratePress alignment overrides as an explicit compatibility
  adapter following
  `docs/decisions/canvas-alignment-and-generatepress-exit.md`.
- Create SKVN-owned page display controls for layout/chrome currently split across GeneratePress panels.
- Start moving reusable header/footer assumptions into SKVN-owned render contracts.
- Treat GeneratePress adapters as temporary compatibility shims.
- Move more global values into `theme.json` where WordPress can share them across editor/frontend.

Plugin actions:

- Keep blocks additive, not required for core page rendering.
- Start with custom blocks only where core blocks + classes are repeatedly fragile.
- Candidate blocks remain governed by planning: `card-grid`, `card`, later `quote`, `hashtag-list`.
- Blocks expose preset controls, not raw classes/colors/CSS.

Acceptance:

- [ ] GeneratePress dependency audit is complete.
- [ ] SKVN Page Display can represent required page chrome/layout behavior without editor reliance on GeneratePress panels.
- [ ] Footer/header migration path is documented.
- [ ] Theme render adapters still work while GeneratePress is present.
- [ ] No feature is moved into plugin if the feature should remain theme-owned visual/site structure.

### Phase 3 — 2.x Compatibility Window

Goal:

- Run with both worlds while removing dependency pressure.

Actions:

- Keep GeneratePress compatibility only behind explicit adapter functions/classes.
- Keep the negative-margin `.alignfull` reset in the GeneratePress
  compatibility layer; do not treat it as the standalone alignment engine.
- Build standalone normal/wide/full fixtures from SKVN templates and
  `theme.json`, then verify them with the compatibility layer disabled.
- Avoid adding new GeneratePress-specific implementation unless it is a temporary migration bridge.
- Convert commonly used page surfaces into SKVN patterns/templates.
- Expand `theme.json` gradually for typography, palette, spacing, layout widths, and block style defaults.
- Evaluate whether SKVN should become:
  - a classic standalone theme with Gutenberg support, or
  - a block theme / hybrid block theme with template parts.

Decision gates:

- [ ] Human approves block theme vs classic standalone direction.
- [ ] Header/footer ownership model is confirmed.
- [ ] WooCommerce template impact is audited.
- [ ] Editor/frontend parity target is redefined for V3.

## Long-Term Plan

### Phase 4 — 3.0.0 Standalone Theme Completion

Goal:

- SKVN no longer depends on GeneratePress.

Theme actions:

- Own the complete theme shell: header, footer, template hierarchy, page chrome, content wrappers.
- Replace `generate_*` hooks and GeneratePress filters with SKVN-owned render/template APIs.
- Remove the GeneratePress canvas/alignment adapter and confirm no SKVN core
  layout uses `100vw` plus negative viewport margins.
- Keep Gutenberg as the content editing model.
- Use `theme.json`, patterns, template parts, and block styles as the primary WP-aligned visual system.
- Keep classic PHP template fallback only where needed for WooCommerce or compatibility.

Plugin actions:

- Blocks remain add-ons:
  - useful when editors need governed controls,
  - not required for every layout,
  - portable enough to work beyond the SKVN theme when planned.
- Plugin blocks should not own the primary visual identity.
- Plugin blocks may expose style presets only after the theme or plugin ships the matching CSS contract.

Acceptance:

- [ ] GeneratePress is no longer required for SKVN theme activation.
- [ ] No code path depends on GeneratePress parent files, hooks, filters, or layout meta.
- [ ] No active layout CSS depends on GeneratePress `.no-sidebar`,
  `.inside-article`, `.grid-container`, or negative-margin `.alignfull`
  behavior.
- [ ] Standalone normal, wide, full, and nested legacy alignment fixtures pass
  with `scrollWidth <= clientWidth`.
- [ ] Header/footer/page templates are SKVN-owned.
- [ ] Gutenberg editor remains the primary content editor.
- [ ] `theme.json` and SKVN patterns define the baseline visual system.
- [ ] Custom blocks are optional add-ons, not a replacement for the theme.

## Architecture Principles

- Theme owns site structure and visual system.
- Plugin owns optional structured editing features.
- Core Gutenberg blocks are the first choice for normal content.
- Custom blocks are justified only when editor governance, repeatability, or structured controls matter.
- `theme.json` is preferred for tokens that must exist in both editor and frontend.
- Raw class input, raw CSS, arbitrary colors, and inline styles should not be required from marketing editors.
- GeneratePress-specific behavior must not leak into V3 contracts.

## Risks

- Moving too early to a full block theme may increase WooCommerce/template work.
- Keeping too many GeneratePress adapters in 2.x can make 3.0.0 harder.
- Building too many custom blocks can recreate a page-builder dependency.
- Relying only on core blocks plus classes can remain fragile for non-technical editors.

Mitigation:

- Use 2.0.0 as migration-start, not migration-complete.
- Audit before replacing.
- Convert repeated proven patterns into governed blocks gradually.
- Keep visual parity tests and fixture pages.
- Keep the plugin additive and the theme authoritative.

## Related Planning

- `.context/planning/005_VERSION_2_0_0_FOOTER_BUILDER_PLANNING.md`
- `.context/planning/012_VERSION_3_0_0_PAGE_DISPLAY_DECOUPLING_PLANNING.md`
- `.context/planning/003_VERSION_1_1_0_LAYOUT_BLOCKS_PLANNING.md`
