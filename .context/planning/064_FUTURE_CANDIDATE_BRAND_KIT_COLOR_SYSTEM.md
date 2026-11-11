# 064 — Future Candidate — Brand Kit & Color System cho đa site B2B

**Status:** Future Candidate — human ghi nhận 2026-11-11. **Chưa có SemVer, chưa gán vào stack M1–M6, chưa start, chưa coding.** File này là note định hướng, không phải execution plan; khi human duyệt triển khai phải qua protocol stack→SemVer (AGENTS.md §"Milestone stack → SemVer") và lập detailed planning riêng.

**Nguồn:** human note 2026-11-11 — "bảng màu hiện tại khá ít, không phù hợp cho làm việc liên quan đến site B2B, kể cả không có màu custom, màu thương hiệu, brand kits — note để sắp tới xây dựng bộ brandkit".

## 1. Vấn đề

Hệ thống màu hiện hành chỉ có một palette tĩnh phục vụ site SKVN minh họa. Khi áp bộ blocks/theme cho **nhiều website B2B khác nhau** (mục tiêu roadmap 039), mỗi site cần màu thương hiệu riêng — hiện không có bất kỳ cơ chế nào trong 3 lớp: màu custom, màu thương hiệu (brand colors), brand kits.

## 2. Current state (evidence)

- `wp-content/plugins/skvn-marine-blocks/src/collection/constants.ts:132-144` — `COLOR_PALETTE_OPTIONS`: `Inherit` + **10 màu SKVN tĩnh** (Blue 950/900/700, Mint 100, Gold 300, Teal 600, Sky 50, Slate 700/900, White); giá trị render thành `var(--wp--preset--color--{slug})`; comment tại chỗ ghi rõ "Không thêm bảng màu riêng."
- Toàn bộ color control hiện hành (Category Grid Details/Action, Collection, …) là `SelectControl` chọn trong palette này.
- Không có custom color picker (hex), không có slot brand color, không có brand kit management (plugin settings hay chỗ khác).
- Theme định nghĩa preset tokens `skvn-*` tương ứng (chưa audit đầy đủ số token theme khi lập kế hoạch).

## 3. Hướng scope dự kiến (chưa duyệt chi tiết — chỉ liệt kê để nhớ)

- **Brand colors**: slot màu thương hiệu site (primary/secondary?) ưu tiên nổi lên trong controls, thay hay mở rộng palette tĩnh.
- **Custom colors**: cho phép màu tùy chỉnh (hex/rgb) có kiểm soát — sanitize-at-read ở mọi output path (block attr → CSS var), cân nhắc a11y contrast khi brand color tùy ý.
- **Brand kits**: bộ định danh màu (và có thể typography sau) theo site — nơi quản lý (plugin settings page?), hình thức lưu (option vs theme.json/global styles), quan hệ với WP preset tokens; bám định hướng Marine Blocks "plugin độc lập theme".
- **Áp lan**: các color controls hiện có chuyển sang control mới; **backward compat attrs đã lưu** — giá trị slug cũ (`skvn-blue-950`, …) phải resolve tiếp, không rewrite saved content; fallback khi brand color chưa set = palette cũ.

## 4. Câu hỏi mở (giải khi lập kế hoạch, không quyết ở đây)

- Dùng/extends WP global styles + `theme.json` preset tokens hay tự quản registry màu trong plugin?
- Ảnh hưởng CSS cache/WindPress và inline style vars hiện hành (`--skvn-category-grid-*` v.v.) khi thêm brand vars.
- Scope tối thiểu cho milestone đầu (vd: chỉ brand primary/secondary trước, custom hex sau?) — human quyết khi duyệt.
- Đặt tên acceptance IDs (đề xuất tiền tố `BK-*`) khi milestone được duyệt.

## 5. Quan hệ roadmap

Phục vụ trực tiếp mục tiêu roadmap 039 §1: "Bộ công cụ cho **nhiều website B2B**". Không gán vào M1–M6 ở thời điểm ghi; pointer đã ghi trong 039 (dated 2026-11-11).
