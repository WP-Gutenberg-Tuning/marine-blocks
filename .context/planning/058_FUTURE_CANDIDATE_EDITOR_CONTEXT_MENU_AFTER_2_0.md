# 058 — Editor Context Menu — Deferred sau 2.0

Ngày tạo: **2026-11-05**. Status: **Deferred — human decision**, chưa triển khai.

## 1. Quyết định và ranh giới

Human tách khỏi [plan057](057_FUTURE_CANDIDATE_BLOCK_CONTENT_COPY_PASTE.md): Content actions trong menu ⋮ từng block làm trước. Menu chuột phải đợi **sau khi qua2.0**, lúc đó agent tổng hợp các tính năng đề xuất rồi trình human xác định mốc thực hiện. Đây là trigger review/xếp lịch, không phải SemVer hoặc approval implementation. Không tự xếp ngay2.0.1/2.1.0, không đưa vào current1.3.19.

057 không phụ thuộc058. Không thêm handler contextmenu, không thay menu browser/native editor, không quảng bá right-click trong057. Khi mở058, xem xét tái dùng content actions/adapters của057 nếu đã có và phù hợp; không tạo engine copy/paste cạnh tranh.

## 2. Trigger và việc agent phải làm

Sau khi qua2.0, tổng hợp các tính năng đề xuất đang chờ thành một bản review chung, có058 trong đó. Nếu2.0 chỉ vừa bắt đầu thì chưa đạt trigger này. Với mỗi candidate, ghi nhu cầu còn đúng, giá trị, dependencies, source/acceptance còn thiếu, public API đúng WordPress/Gutenberg version lúc review, accessibility và chi phí QA. Đề xuất scope/SemVer/thứ tự cho human xác nhận trước implementation. Không tự triển khai vì trigger đã tới.

## 3. Research và hướng thiết kế khi mở lại

- Research lịch sử và rationale giữ tại [057 §9](057_FUTURE_CANDIDATE_BLOCK_CONTENT_COPY_PASTE.md#9-chuột-phải-và-khả-năng-khám-phá--research--proposal-2026-11-05); các proposal ở đó chưa phải quyết định triển khai058. Nút menu riêng trên header đã được thay bởi menu ⋮ từng block cho057.
- [MDN contextmenu](https://developer.mozilla.org/en-US/docs/Web/API/Element/contextmenu_event): web app thường chặn default rồi hiển thị menu ứng dụng; không phải thêm item vào native browser menu. Chỉ preventDefault chưa cung cấp menu/focus/keyboard.
- [WordPress Preferences](https://wordpress.org/documentation/article/preferences-overview/) có `Allow right-click contextual menus`; audit preference, canvas/List View và API đúng version trước khi chọn cơ chế. Chưa có evidence public extension point trên onsite.
- Ưu tiên native integration nếu phù hợp; custom menu cần review riêng. Không chặn toàn editor hoặc text selection/input/contenteditable/link/image; xác định block thực sự được click, nested target và iframe document/coordinates. Không private DOM hack.
- Right-click chỉ là đường bổ sung, menu ⋮ vẫn dùng được. Tooltip hover/focus có thể giải thích; hint dismissible là proposal, chưa duyệt storage/onboarding. Chỉ giới thiệu shortcut ở surface/version thực sự hỗ trợ; không hiện tooltip lặp lại mỗi lần chọn block.

## 4. Acceptance và evidence

| ID | Nhóm | Hành vi mong đợi | Hiện trạng | Việc cần làm | Cách kiểm / evidence |
|---|---|---|---|---|---|
| CCP-TECH03 | Technical | Đúng surface/block; không phá browser/native menu hoặc text editing; đóng/focus/cleanup đúng | Deferred — chuyển từ057 theo human2026-11-05 | Audit API, iframe/nested target, keyboard, viewport | Version/browser; video preference on/off, input/link/image, nested blocks, Escape/click ngoài và mép viewport |
| CTX-UX01 | Editor UX | Right-click là đường bổ sung; keyboard/touch dùng menu hiển thị rõ; hướng dẫn đúng khả năng thực tế | Deferred | Review menu/hint/tooltip sau2.0 | Mockup và thử chuột/keyboard/touch, accessible labels, không quảng bá khả năng chưa có |

Block UI frontend N/A cho menu vì chỉ là editor tooling; regression output content vẫn theo057. Chưa source, chưa runtime PASS. Trước onsite cần runbook theo AGENTS; trước implementation cần scope/version/start được human xác nhận.

## 5. Discussion log

- Human2026-11-05 chọn menu ⋮ từng block theo screenshot cho scope đầu; yêu cầu tách plan chuột phải, đợi sau2.0 rồi tổng hợp các tính năng đề xuất để quy định mốc thực hiện.
- Các trao đổi content-only/menu ⋮ cập nhật057; context menu và review sau2.0 cập nhật058. Chưa code/commit/bump hoặc đổi current milestone.
