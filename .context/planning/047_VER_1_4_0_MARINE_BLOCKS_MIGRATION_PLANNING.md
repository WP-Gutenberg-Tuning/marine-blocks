# Marine Blocks — Migration 1.4.0

Status: PLANNED — Chưa làm
Date: 2026-11-04 (Asia/Bangkok)
Target: V1 / 1.4.0; SemVer đã xác nhận, chưa start
Current: V1 / 1.3.18 — giữ nguyên

## Quyết định và giới hạn

Human chốt **Marine Blocks**, slug `marine-blocks` (thay tên số ít `marine-block`). Định vị: bộ block chuyên dụng và patterns giúp dựng, chỉnh sửa, bàn giao website nhanh; không theo đuổi supercharge toàn bộ FSE. Plugin có styling/runtime riêng, không phụ thuộc WindPress/theme SKVN. Website dùng WindPress enhance core blocks/patterns. Custom block dành cho dữ liệu, tương tác hoặc UX biên tập chuyên dụng; không tự mở lại quyết định Collection query ownership.

Theme giữ tên/slug/text domain `skvn-marine`, PHP `skvn_marine_`, CSS/tokens theme. Có thể sửa điểm gọi plugin trong theme khi migration, không đổi thương hiệu theme.

Human xác nhận 2026-11-04: **V1 / 1.4.0 — Marine Blocks Identity & Compatibility Migration**. Setup UI cũ 1.4.0 → 1.4.1; Layout/Quote Validation cũ 1.4.1 → 1.4.2, giữ acceptance PENDING. MINOR 1.4.0 vì scope chuyển identity/compatibility sản phẩm, không chỉ PATCH đổi nhãn. Version đã chốt; chưa start. Không chuyển current 1.3.18, bump metadata hoặc archive tensions. Trước implementation cần xác nhận start, không hỏi lại version.

Identity GU Supercharger và timing migration namespace chỉ tại public launch bị thay thế. Gate public launch sau 1.5.x giữ tới quyết định riêng; migration không tự reset metadata về 0.0.1. Không hủy acceptance/milestone FSE/theme cũ, review scope riêng theo hướng mới.

## Mapping đích

| Loại | Hiện tại | Đích / xử lý |
|---|---|---|
| Plugin name | SKVN Marine Blocks | Marine Blocks |
| Folder/bootstrap/ZIP | skvn-marine-blocks | marine-blocks / marine-blocks.php / marine-blocks.zip |
| Text domain/package | skvn-marine-blocks | marine-blocks |
| Block namespace | skvn-marine/* | marine-blocks/*; migrate/hỗ trợ tên cũ |
| PHP functions/constants | skvn_marine_blocks_ / SKVN_MARINE_BLOCKS_ | marine_blocks_ / MARINE_BLOCKS_ |
| Plugin CSS/data/handles | skvn-* và skvn-marine-* | map ownership; đích marine-blocks-* |
| Plugin CSS variables | --skvn-* shared/theme | --marine-blocks-* có defaults, bridge theme khi cần |
| Option/meta/attributes | keys hiện hữu | giữ hoặc migrate theo map, không đổi mù |

PHP dùng gạch dưới, slug/CSS dùng gạch ngang. Không global replace `skvn` trong repo/DB. Không sửa business data hoặc lịch sử chỉ vì chứa tên cũ.

## Evidence baseline — source, chưa runtime PASS

- Plugin bootstrap `wp-content/plugins/skvn-marine-blocks/skvn-marine-blocks.php`: header/category/registration/handles.
- `src/*/block.json`: 8 block slider, slide, accordion, card-grid, card, feature-showcase, product-collection, post-collection.
- Theme `inc/typography.php`, `inc/preloader.php` gọi PHP plugin prefix cũ.
- Plugin `modules/*-settings/`, `modules/core-control/`: persisted settings.
- `tools/bump-project-version.mjs`, `build-deploy-artifact.mjs`, `package-plugin-zip.sh`, `release-artifact.sh`: hardcoded paths/version coupling.
- DB onsite chưa inventory; source search không chứng minh nội dung/sites đã migrate. Refresh evidence theo HEAD/site khi start.

## Các gói thực hiện dự kiến

### P0 — Inventory/checkpoint

Phân loại plugin/theme/shared/persisted; inventory PHP hooks/functions/constants, JS identifiers, CSS/data/vars, handles, snippets và consumers ngoài repo. Kiểm posts/pages, wp_block, templates/template parts có dùng block. Ghi policy revisions để restore revision không làm sống lại tên cũ ngoài dự kiến. Liệt kê options/meta và serialization. Backup DB + code/plugin/theme artifact, chụp baseline đủ 8 block và settings.

### P1 — Source/packaging

Replace có preview/diff theo nhóm; rename file/folder riêng. Cập nhật PHP/TS/block.json, parent/allowed blocks, variations/transforms, patterns, i18n, tests/docs/tools và deploy. Human chạy build/lint theo AGENTS, không sửa bundle bằng tay. Không activate hai plugin gây duplicate registration/functions. Version tooling cần rõ: không tự bump theme/reset version vì rename.

### P2 — Compatibility/data

Consumer chuyển đồng bộ thì wrapper PHP không bắt buộc; consumer ngoài repo/chuyển muộn cần wrapper có gate gỡ. Block migration parse/serialize kiểm nested; không coi Gutenberg deprecation tự giải quyết namespace rename. Kiểm static saved HTML/class validation và dynamic render. Migration có dry-run, counts, log IDs, batch/failure handling, idempotence. Option/meta dùng API/tool hiểu serialized data, không global SQL replace. Ghi key giữ/migrate, precedence, legacy CSS/data support và rollback; không xóa dữ liệu cũ trước gate phục hồi.

### P3 — Styling độc lập

Plugin có defaults/runtime đủ dùng khi WindPress tắt và đổi theme. Theme skin qua contract rõ. Inventory/giải quyết token dependency để đạt acceptance, không kéo redesign toàn trang vào rename. Phần core chủ động dùng utilities không bị yêu cầu giữ styling khi WindPress tắt.

**Debt ghi 2026-11-15 — PDP related Woo adapter:** swap `wc_get_template_part` + `inc/templates/related-product-card.php` đang thuộc theme SKVN; panel/presenter thuộc plugin. Human: pitfall onsite = không cập nhật theme; làm chi tiết khi start 1.4.0 (tension OPEN, ideation `docs/ideations/pdp-related-theme-plugin-independence.md`). Chưa chọn B (hook vào plugin) vs C (hybrid). Không code trong 1.3.22. Archive card 060 cùng pattern — inventory, không tự gộp.

**IA ghi 2026-11-16 — Related global Promote/admin:** plan [077](077_VER_1_3_22_PDP_RELATED_GLOBAL_PROMOTE_AND_ADMIN_PLAN.md) (1.3.22, chưa start). Top-level menu đổi label source sang Marine Blocks trong 1.4.0; không option rename trong plugin (ASE onsite). Không gộp 077 vào adapter B/C.

### P4 — Staging/pilot/rollout

Audit ZIP/activation path. Rehearsal staging: backup → dry-run → chuyển code/data theo thứ tự đã kiểm chứng → cache → editor/frontend anonymous. Không giả định block cũ được hỗ trợ trong cửa sổ chuyển. Pilot ít nhất một site đại diện; rollout từng site có ledger, production cần human giao rõ site/scope. Rollback restore DB và code/theme cùng checkpoint, không chỉ cài lại ZIP cũ. Kiểm soát ghi trong cửa sổ chuyển để restore không mất edit mới.

## Acceptance & evidence

Tất cả **Chưa làm**. States: nội dung cũ/mới, nested, empty, Woo inactive, WindPress on/off, theme SKVN/khác, admin/anonymous.

| ID | Nhóm | Hành vi mong đợi / việc cần làm | Cách kiểm / evidence |
|---|---|---|---|
| MB-01 | Editor UX | Naming mới nhất quán; 8 block cũ/mới mở/sửa/save/reload không invalid/unsupported | Nested fixtures, screenshots, console |
| MB-02 | Block UI | Không regression visual/interaction | Baseline desktop/mobile, DOM, keyboard/reduced-motion/no-JS liên quan |
| MB-03 | Technical | Query/render giữ kết quả, Woo inactive không fatal | Product/Post fixtures, logs, anonymous frontend |
| MB-04 | Technical | Settings giữ giá trị, theme đọc được | Option snapshots; footer/header/typography/preloader/core-control |
| MB-05 | Technical | Migration nested/serialized an toàn, idempotent, revision policy rõ | Dry-run counts, lần chạy 2, errors/skips |
| MB-06 | Block UI + Technical | Plugin độc lập WindPress/theme, core enhancement đúng khi bật WindPress | Matrix on/off và theme khác, screenshots/assets |
| MB-07 | Technical | ZIP đủ runtime, activation đúng, không duplicate | Manifest, metadata/logs, tooling không đổi nhầm theme |
| MB-08 | Technical | Rollback phục hồi code/data đúng checkpoint | Rehearsal staging, counts/artifact IDs |
| MB-09 | Editor UX + Technical | Workflow biên tập và i18n domain mới đúng | Insert/edit/save, strings/domain, pilot feedback |

Trước runtime tạo `docs/testing/marine-blocks-migration-1-4-x.md` có URL/site thật, setup, exact steps, expected/pass-fail và evidence human báo lại. Không tạo URL giả trong planning. PASS phải gắn build/site; source-có không phải nghiệm thu.

## Còn mở trước execution

Start, inventory sites/consumers, compatibility duration, persisted key map, migration tooling và public version line. Không hỏi lại tên/product direction đã chốt. Tham chiếu launch gate còn hiệu lực: `docs/decisions/gu-supercharger-launch-post-1.5x.md`; phần identity cũ trong đó chỉ là lịch sử.
