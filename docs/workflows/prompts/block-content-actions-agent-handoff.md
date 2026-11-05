# Prompt — Block Content Actions / plan057

Copy phần dưới sang agent coding. **Human đã duyệt scope/start/current1.3.19 và source commit ngày2026-11-05**, xem057§17. Thực hiện CODE_NOW sau technical preflight, không hỏi lại approval.

```text
Bạn làm việc trong D:\Github\skvn-marine. Research/plan source of truth:
.context/planning/057_FUTURE_CANDIDATE_BLOCK_CONTENT_COPY_PASTE.md, đặc biệt §10–16.

Đọc AGENTS.md trước; load GLOBAL → MILESTONES → toàn TENSIONS_OPEN → relevant ACTIVE → PLUGIN_SKVN_MARINE_BLOCKS module và review contract theo protocol. Đọc plan058 chỉ để giữ right-click Deferred sau2.0, không triển khai nó.

AUTHORIZATION PREFLIGHT:
- Current lúc viết prompt: V1 /1.3.19 — Plugin Design Sidebar Foundation.
- Human đã chốt menu ⋮ CỦA TỪNG BLOCK như screenshot, giữ style đích, khác loại báo lỗi, tách right-click sau2.0.
- Human2026-11-05 đã duyệt nguyên gói057 §11–14: Product/Post Collections + Slider/Slide, query là content, empty hợp lệ ghi đè, exact block type/tree shape, giữ style đích. Cho coding ngay trong1.3.19 như scope bổ sung, KHÔNG BUMP, cho source commit prefix feature patch:. Approval source of truth057§17; memo§15 là lịch sử, không hỏi lại version/start hoặc chọn1.8.0.
- Stack ref: scope addition của current M1 follow-up, không tạo milestone stack mới. Giữ current1.3.19, metadata, carry acceptance và lịch sử; không chuyển/đóng milestone hoặc archive tension. Technical P0 vẫn cần evidence runtime API, không phải product approval gate.

THỰC HIỆN — CODE_NOW:
Thực hiện P0–P5, không viết lại plan dài rồi hỏi duyệt từng bước. Trước tiên ghi exact WP/Gutenberg/runtime public API và core schema version. @wordpress/scripts không phải runtime version. Thiếu API thì báo đúng dependency; không hack private DOM, không đổi vị trí sang menu toàn editor/header riêng.

Scope đã duyệt: Product/Post Collection + Slider/Slide; mỗi lần một root; core heading/paragraph/button/image và structural wrappers chỉ trong nested adapter. Không ship chỉ Collections rồi coi Slider xong. Kiểm exact block name và exact tree shape; Grid↔Carousel cùng Collection giữ layout đích; khác shape/unknown node từ chối nguyên thao tác. Theo allowlist, empty/default, query/media/rich text policy §11; không tự mở rộng hỗ trợ mọi block hoặc cross-site migration.

Dùng public BlockSettingsMenuControls đúng runtime, nhóm Content actions với Copy content/Paste content only trong menu ⋮ có sẵn. Reuse block_clipboard gate default false; không đổi utility Copy/Paste whole blocks cũ, không thêm setting/storage/dependency/frontend asset/endpoint. Đọc clipboard chỉ khi click Paste, không hover/menu open; không override Ctrl+C/V hoặc thêm contextmenu handler. English+i18n.

Transport native Gutenberg plain-text serialize/parse của projection tree content-only; không serialize full attrs nguồn, không custom JSON/MIME/envelope. Parser defaults và inline HTML style cũng phải được audit. Validate toàn payload/shape/schema/refs/permissions/bindings/entities trước ghi. Async revalidate đúng target/selection/content revision; style-only updates giữ giá trị mới. Một public multi-block attribute mutation, không replace/insert/reset tree; one Undo/Redo và no-op được kiểm thực tế. Không private undo/persistence flags, không partial paste.

Files dự kiến src/core-controls/block-content/*, core-controls/index.ts, optional registry description, tools/tests/block-content-copy.test.mjs, docs/testing/block-content-actions.md, plan057 và context cần thiết. Không sửa theme/GeneratePress/Swiper/query engine/loading/skeleton/namespace. Kiểm working tree trước và sau; giữ nguyên source/build của người khác. Không git add . / không reset/clean/discard.

Agent được chạy test logic có ý nghĩa, không được chạy build/lint theo AGENTS. Cuối lượt output command human build/lint trong057 §14. Command treo/timeout dừng ngay, không retry/poll. Trước onsite cập nhật runbook URLs/setup/cases. Report source tests tách runtime/menu/clipboard/history/Save evidence, không tự PASS hoặc release.

Khi source xong, self-review allowlist/no-style/atomicity/version compatibility; cập nhật IDs. Human đã cho source commit: commit đúng files với feature patch: add block content actions, không commit build người khác. Final gồm commit/files, tests đã chạy, build/onsite còn chờ và evidence human cần gửi. Không tự deploy hoặc claim runtime PASS.
```
