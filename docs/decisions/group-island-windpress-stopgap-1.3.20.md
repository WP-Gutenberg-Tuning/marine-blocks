# Group island — WindPress chữa cháy đến khi có island group

**Date:** 2026-11-12

Status: ACTIVE
Milestone: V1 / 1.3.20
Lifecycle: active
Notes: Quyết định chat 2026-11-12. Chưa viết utility, chưa compile WindPress, chưa tạo island group. Island group vẫn deferred 1.4.x, chưa start, chưa gán SemVer riêng. Update 2026-11-12: prototype CSS + diagnostic + test cases tại `docs/testing/group-island-windpress-class-1.3.20.md` (chưa nạp site, tên class mới là đề xuất).
Update 2026-11-12 (2): human **tạm không dùng Group** ⇒ bản chữa cháy **DORMANT**. Không cần thao tác WindPress; **T2 (tiếp tục stopgap class) không còn được theo đuổi**. Decision giữ ACTIVE vì luật một box + giới hạn vẫn còn hiệu lực cho mọi đợt sau; phần stopgap coi như tạm hoãn, gỡ khi island block tồn tại. Kết luận/đánh giá đã gom thành nền cho block tương lai: `.context/planning/066_FUTURE_CANDIDATE_GROUP_ISLAND_BLOCK.md`. `.skvn-island-group` là **tên prototype lịch sử**, không phải tên block tương lai (`.skvn-island` đã thuộc sidebar card theme).

---

## Luật UX

Category Grid nằm trong Group thì đó là một box.

- Node trong lấy bề rộng của node ngoài.
- Node ngoài phủ hết node trong. Nền của Group bao trọn grid.
- Ảnh 2026-11-12 (frontend, scale 1, viewport 1903 CSS px) cho thấy nền `#00C950` đúng box Group: 760px hoặc 1200px, canh giữa. Grid nhô phải 80px. Đó là Group không bao trọn con, không phải lỗi thao tác align của human.

## Quyết định

WindPress là bản chữa cháy trên site, có thời hạn, cho đến khi island group trở thành chủ của box đó.

- Chỉ gắn lên những Group đang dùng làm island tạm, bằng một class riêng. Class chưa đặt tên. Khi island group có mặt, gỡ đúng class và utility của nó.
- Core Group còn lại giữ hành vi FSE hiện tại. Không sửa mọi `core/group`.
- Utility của class khóa luật trên: con trực tiếp lấy width của Group, nền của Group phủ hết con.
- Không dùng `overflow: hidden` hoặc `overflow: clip` để cắt phần card nhô ra.
- Stylesheet WindPress của site giữ bản này. Không đưa vào runtime Marine Blocks, không sửa `inc/windpress.php` cho mục này, không thêm CSS theme để propagate width xuống cháu.
- CSS phải có trong editor iframe và frontend. Thấy hiệu lực sau khi compile lại cache WindPress.
- Island group xong thì xóa class và utility, để một box chỉ còn một chủ width.

## Giới hạn của bản chữa cháy

80px **đã có chủ và đã chỉ đúng rule** (đo onsite 2026-11-12, `docs/testing/group-island-windpress-class-1.3.20.md` §4.2–§4.2.2).

Computed style: wrapper `.skvn-category-grid` = 1280 trong Group 1200, `left` khít 351.5, `max-width: calc(100% + 80px)`, margin 0/0, `position: static`. Delta là `max-width` của chính block — không phải align Wide, không phải container query, không phải `<ul>`/card.

Nguồn khai báo: **GeneratePress dynamic inline CSS** (`<style id="generate-style-inline-css">`), rule `.entry-content .alignwide, body:not(.no-sidebar) .entry-content .alignfull { margin-left:-40px; width:calc(100% + 80px); max-width:calc(100% + 80px) }` specificity `(0,2,0)`. GP giả định content padding 40px; canvas SKVN đã zero padding, còn core layout ép `margin-left/right: auto !important` → mất phần bù trái, chỉ còn +80 phải. Ở page level theme clamp `style.css:994-1013` thắng GP; block nested trong Group thì clamp không áp.

Sửa lại kết luận trước đó: khai báo này **không phải tàn dư thí nghiệm trên site** và cũng **không phải lỗi Category Grid**. Nó là bug cấp canvas, ảnh hưởng mọi `.alignwide` nằm trong container có width (slider, collection carousel, grid trong Group). Ghi `.context/PITFALLS.md` DP-07.1.

Trạng thái bản chữa cháy:

- Rule prototype **thắng được**: probe inject rule cho 1280 → 1200, delta 80 → 0 (§4.2.1-A). Cơ chế một box đúng.
- Rule **chưa có mặt** trong CSS serve: vắng trong `windpress-cached-inline-css` và trong `windpress:vfs` (§4.2.1) ⇒ lần paste chưa lưu/compile vào project WindPress đang phục vụ trang. Đây là thao tác site, không phải lỗi CSS.
- Bản chữa cháy không chữa slider/collection (không gắn class) — nếu muốn chữa cả canvas thì phải là hướng T1 dưới đây.

- Class kéo card vào nếu chính block grid đang rộng hơn Group.
- Card tràn từ bên trong một grid đã đúng 100% thì utility trên Group không chữa được. Lúc đó bệnh nằm ở Category Grid.

## Chưa quyết

- **Hướng sửa gốc (mới 2026-11-12):** T1 = theme neutralize math `.alignwide` của GP trên canvas (`body.skvn-full-width-canvas .entry-content .alignwide`, ~4 declaration, `(0,3,0)`); T2 = tiếp tục stopgap class WindPress. T1 chữa một lần cho cả canvas nhưng đổi geometry của slider/collection → phải có ảnh trước/sau và human duyệt. T2 giữ đúng quyết định hiện hành, không chạm source, nhưng bỏ sót slider/collection. **Chưa chọn.** Update 2026-11-12: human tạm không dùng Group ⇒ **T2 dormant, không theo đuổi**; T1 trở thành **dependency cứng** của island block (`.context/planning/066_FUTURE_CANDIDATE_GROUP_ISLAND_BLOCK.md` §5.6, §6.3), vẫn **chưa chọn/chưa code**.
- `alignfull` không nằm trong phạm vi đợt này (rule GP cho alignfull chỉ áp khi `body:not(.no-sidebar)`; canvas theme đã có reset riêng) — cần đo riêng nếu muốn đụng.
- Tên class. Đề xuất `.skvn-island-group`: `.skvn-island` đã thuộc card sidebar single post của theme (`style.css:3247`, `archive.php`), hậu tố `-group` nói rõ đây là core/group. Prototype + lý do: `docs/testing/group-island-windpress-class-1.3.20.md` §2. Human chưa chốt, đổi tên chỉ là một chỗ.
- Island group là pattern, style variation, hay block. Chủ width của island là việc của đợt làm island, không phải của bản WindPress này.
- Gate recipe §7.1 (giữ 2 bước, hay pattern zero-CSS `alignfull` + `contentSize` 1200 trong 1.3.20) không được chọn ở quyết định này. Pattern nền tràn viewport là yêu cầu khác với luật một box ở trên.

## Evidence

- Ảnh: `.local/Lỗi/Marine Blocks with core block (1).png`, `(2).png`.
- Ledger đo và recipe: `docs/testing/group-island-width-1.3.20.md`.
- Đo onsite + probe + quét stylesheet: `docs/testing/group-island-windpress-class-1.3.20.md` §4.2, §4.3.
- Rule gốc của GP (dynamic inline, không có trong file nào): `.entry-content .alignwide, body:not(.no-sidebar) .entry-content .alignfull { margin-left:-40px; width:calc(100% + 80px); max-width:calc(100% + 80px) }`.
- Core layout cho con `alignwide`: `wp-includes/block-supports/layout.php` (rule `max-width` wide và `margin: auto !important`).
- Category Grid mặc định `align: wide`: `wp-content/plugins/skvn-marine-blocks/src/product-category-grid/block.json`.
- Nền cho block group island (kết luận + kiến trúc + acceptance + gate): `.context/planning/066_FUTURE_CANDIDATE_GROUP_ISLAND_BLOCK.md`.
