# Prompt — Block Content Actions / plan057

Copy phần dưới sang agent coding. Prompt có gate do SemVer/start và execution policy chưa được duyệt tại lúc viết. Không xóa gate hoặc điền approval thay human.

```text
Bạn làm việc trong D:\Github\skvn-marine. Research/plan source of truth:
.context/planning/057_FUTURE_CANDIDATE_BLOCK_CONTENT_COPY_PASTE.md, đặc biệt §10–16.

Đọc AGENTS.md trước; load GLOBAL → MILESTONES → toàn TENSIONS_OPEN → relevant ACTIVE → PLUGIN_SKVN_MARINE_BLOCKS module và review contract theo protocol. Đọc plan058 chỉ để giữ right-click Deferred sau2.0, không triển khai nó.

AUTHORIZATION PREFLIGHT:
- Current lúc viết prompt: V1 /1.3.19 — Plugin Design Sidebar Foundation.
- Human đã chốt menu ⋮ CỦA TỪNG BLOCK như screenshot, giữ style đích, khác loại báo lỗi, tách right-click sau2.0; đã yêu cầu research/plan và commit docs.
- Chưa xác nhận execution policies §11–14, SemVer/start của057. Trước code kiểm decision mới trong session/repo. Nếu đã được human duyệt thì dùng decision đó, không hỏi lại. Nếu chưa, chỉ làm P0/read-only audit, trình đúng các gate còn thiếu theo memo §15 và chờ; không code, bump, hoặc tự cộng scope1.3.19. Không coi user dán prompt này tự động xác nhận một version chưa ghi.
- Khi human xác nhận, ghi rõ version/scope/start/stackref (candidate riêng, chưa có stack mapping), sync các docs theo AGENTS; nếu bổ sung current1.3.19 thì giữ current và không bump như human quyết định. Không đóng milestone/carry acceptance cũ.

SAU KHI GATES ĐỦ:
Thực hiện P0–P5, không viết lại plan dài rồi hỏi duyệt từng bước. Trước tiên ghi exact WP/Gutenberg/runtime public API và core schema version. @wordpress/scripts không phải runtime version. Thiếu API thì báo đúng dependency; không hack private DOM, không đổi vị trí sang menu toàn editor/header riêng.

Scope proposal: Product/Post Collection + Slider/Slide; mỗi lần một root; core heading/paragraph/button/image và structural wrappers chỉ trong nested adapter. Không ship chỉ Collections rồi coi Slider xong. Kiểm exact block name và exact tree shape; Grid↔Carousel cùng Collection giữ layout đích; khác shape/unknown node từ chối nguyên thao tác. Theo allowlist, empty/default, query/media/rich text policy §11; không tự mở rộng hỗ trợ mọi block hoặc cross-site migration.

Dùng public BlockSettingsMenuControls đúng runtime, nhóm Content actions với Copy content/Paste content only trong menu ⋮ có sẵn. Reuse block_clipboard gate default false; không đổi utility Copy/Paste whole blocks cũ, không thêm setting/storage/dependency/frontend asset/endpoint. Đọc clipboard chỉ khi click Paste, không hover/menu open; không override Ctrl+C/V hoặc thêm contextmenu handler. English+i18n.

Transport native Gutenberg plain-text serialize/parse của projection tree content-only; không serialize full attrs nguồn, không custom JSON/MIME/envelope. Parser defaults và inline HTML style cũng phải được audit. Validate toàn payload/shape/schema/refs/permissions/bindings/entities trước ghi. Async revalidate đúng target/selection/content revision; style-only updates giữ giá trị mới. Một public multi-block attribute mutation, không replace/insert/reset tree; one Undo/Redo và no-op được kiểm thực tế. Không private undo/persistence flags, không partial paste.

Files dự kiến src/core-controls/block-content/*, core-controls/index.ts, optional registry description, tools/tests/block-content-copy.test.mjs, docs/testing/block-content-actions.md, plan057 và context cần thiết. Không sửa theme/GeneratePress/Swiper/query engine/loading/skeleton/namespace. Kiểm working tree trước và sau; giữ nguyên source/build của người khác. Không git add . / không reset/clean/discard.

Agent được chạy test logic có ý nghĩa, không được chạy build/lint theo AGENTS. Cuối lượt output command human build/lint trong057 §14. Command treo/timeout dừng ngay, không retry/poll. Trước onsite cập nhật runbook URLs/setup/cases. Report source tests tách runtime/menu/clipboard/history/Save evidence, không tự PASS hoặc release.

Khi source xong, self-review allowlist/no-style/atomicity/version compatibility; cập nhật IDs. Nếu human đã cho phép source commit trong lệnh start thì commit đúng files với feature patch: add block content actions (hoặc tên human chỉ định), không commit build người khác. Nếu chỉ được docs commit thì không suy quyền source commit. Final gồm commit/files, tests đã chạy, build/onsite còn chờ và evidence human cần gửi.
```
