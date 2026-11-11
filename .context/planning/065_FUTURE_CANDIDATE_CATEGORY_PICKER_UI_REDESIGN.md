# 065 — Future Candidate — Category Picker UI Redesign (trước publish plugin)

**Status:** Future Candidate — human ghi nhận 2026-11-11. **Chưa có SemVer, chưa gán vào stack M1–M6, chưa start, chưa coding.**
**Timing human đề xuất:** "sau khi làm xong 1.4.x thì nên làm để publish plugin luôn" — tức sau khi wave 1.4.x (1.4.0 Marine Blocks Migration, 1.4.1 Setup UI, 1.4.2 Layout/Quote Validation) hoàn tất, nằm trong cửa sổ chuẩn bị publish. Publish gate hiện hành: **Marine Blocks Public Launch (Post 1.5.x, version riêng cần xác nhận)**. Khi duyệt triển khai phải qua protocol stack→SemVer (AGENTS.md) và lập detailed planning riêng.

## 1. Vấn đề

Giao diện **lựa chọn danh sách Category trong Category Grid** (picker + danh sách đã chọn) hiện là mức functional MVP theo design lock 2026-10-28 — dùng được nhưng chưa đạt chất lượng giao diện để bán/publish plugin. Human yêu cầu làm lại trước publish.

## 2. Current state (evidence)

- `wp-content/plugins/skvn-marine-blocks/src/product-category-grid/picker.tsx` — `CategoryPicker`: Modal + `SearchControl` (debounced) + hierarchy + `CheckboxControl` chọn tay, bộ lọc "only with products", pagination 50/page, **draft selection** (không ghi vào block đến khi Apply/Cancel). Header comment ghi design lock 2026-10-28.
- `wp-content/plugins/skvn-marine-blocks/src/product-category-grid/selected-list.tsx` — `SelectedCategoryList`: danh sách có thứ tự — desktop drag handle, keyboard Up/Down, touch Move up/Move down; per-item expand mở `details.tsx` (per-category details); destination controls.
- Tất cả components đang dùng là core chuẩn (Button/CheckboxControl/Modal/SearchControl/Spinner/SelectControl/TextControl) — picker hoạt động ổn tại runtime (không dính vấn đề export DP-06).
- Selection lưu trong attribute `categories` (ordered term IDs + per-item config) — do block sở hữu, không đụng term data.

## 3. Hướng scope dự kiến (chưa duyệt chi tiết — chỉ liệt kê để nhớ)

- Redesign UX picker: duyệt cây hierarchy trực quan hơn, search, chọn nhanh/bulk, trạng thái selected rõ ràng hơn, empty/loading/error states chỉn chu, visual polish theo hướng editor UX chuẩn của plugin.
- Danh sách đã chọn: cân nhắc hình thức gọn hơn (chips? cards?), giữ nguyên contract thứ tự = render order và các đường mở details/destination.
- Cân nhắc đồng bộ pattern với picker/selection UI của Collection blocks (Product/Post) để có một pattern chọn-nội dung chung trước publish — human quyết scope.
- A11y: keyboard reordering, focus management modal, screen reader announce — giữ/bắt buộc như hiện trạng.

## 4. Constraints & câu hỏi mở

- **Design lock 2026-10-28** sẽ bị supersede một phần — artifact mới (mockup/spec) phải human duyệt trước khi coding; không tự đổi contract draft-Apply nếu chưa có quyết định.
- Backward compat: attribute `categories` và per-item config đã lưu phải giữ nguyên nghĩa; redesign là UI-layer, không rewrite saved content.
- Đặt trong plan publish riêng hay nhét vào mốc kế 1.4.x? — human quyết khi duyệt; đề xuất là milestone riêng để không kéo dài wave 1.4.x.
- Acceptance IDs đề xuất tiền tố khi duyệt (vd `CPI-*` — Category Picker Interface).

## 5. Quan hệ roadmap

Phục vụ trực tiếp gate **Marine Blocks Public Launch (Post 1.5.x)** — một trong các item "cần xong trước khi publish". Pointer đã ghi trong roadmap 039 (dated 2026-11-11).
