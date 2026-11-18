# V1 / 1.3.21 — Màu lớp overlay của slide

2026-11-13. Human muốn control đổi màu overlay. Lớp hiện tại là `#073b5a` cứng trong CSS, chỉ có **Overlay opacity** 0–80. **Planning only** — chưa sửa tới lệnh **Tiến hành**.

Gradient kiểu artifact (`linear-gradient` 105°) không nằm trong plan này. Control này là một màu đặc.

## 1. Hiện trạng

`.skvn-slide__overlay` trong `src/slider/style.css` có `background: #073b5a`. Opacity lấy từ attr `overlayOpacity`, gắn inline `opacity` ở editor, `save.tsx` và `slider-render.php`. Không có attr màu.

Control opacity chỉ hiện khi slide đã có ảnh, trên mọi preset có ảnh nền. Hero Apply modal copy opacity khi tick **Overlay opacity**, và tick đó chỉ bật được khi **Background image** được chọn.

## 2. Mục tiêu

- Mỗi slide chọn được màu overlay. Slide cũ không có attr vẫn là `#073b5a`.
- Opacity giữ nguyên, nhân với màu đã chọn.
- Editor và frontend cùng màu.
- Không đổi markup đã lưu khi user chưa chọn màu, để block cũ không invalid.

## 3. Data

Attr trên `skvn-marine/slide`:

| Attribute | Type | Default |
|---|---|---|
| `overlayColor` | string | `""` |

`""` nghĩa là dùng `#073b5a` trong CSS. Có giá trị thì inline `background` trên `.skvn-slide__overlay`.

PHP chỉ nhận hex qua `sanitize_hex_color`. Giá trị khác bỏ, rơi về CSS. Không nhận `rgb()`, gradient, hay `var()`.

## 4. UI

Trong panel **Background**, cạnh **Overlay opacity**, khi slide có ảnh:

- Color control, nhãn **Overlay color**.
- Nút **Use default navy** xóa attr về `""`.

Preset không có ảnh nền không hiện control, giống opacity.

Apply modal: tick **Overlay opacity** copy cả `overlayOpacity` và `overlayColor`. Không thêm checkbox mới. Không copy màu khi tick đó tắt.

## 5. Việc sửa khi được lệnh

1. `src/slide/block.json` — attr `overlayColor`.
2. `src/slide/edit.tsx` — color control, inline `background` khi có màu.
3. `src/slide/save.tsx` — cùng quy tắc inline. Attr rỗng thì style chỉ còn opacity, khớp markup cũ.
4. `modules/slider-render/slider-render.php` — `background` hex đã sanitize trên span overlay.
5. `src/slide/apply-background-modal.tsx` — copy màu cùng tick overlay.
6. CSS `#073b5a` giữ làm default. Không xóa rule đó.

Content Actions không thêm `overlayColor` vào allowlist. Đó là style, cùng nhóm với `overlayOpacity` đang bị loại khỏi copy nội dung.

## 6. Acceptance

| ID | Mong đợi |
|---|---|
| OVL-01 | Slide cũ, chưa chọn màu: overlay vẫn `#073b5a`. Mở editor không báo invalid block. |
| OVL-02 | Chọn màu khác, save, reload: editor và frontend cùng màu. Opacity vẫn chi phối độ đậm. |
| OVL-03 | Use default navy: mất inline background, về `#073b5a`. |
| OVL-04 | Apply với Overlay opacity bật: đích nhận cả opacity và màu. Tắt tick: đích giữ màu cũ. |
| OVL-05 | Hex lạ trong markup đã lưu: PHP bỏ, không fatal, về navy CSS. |

## 7. Ngoài phạm vi

- Gradient overlay của mockup parallax.
- Gắn parallax cho lớp chữ. Việc đó không sửa bằng control hiện có. Xem trả lời kèm plan.

**Status:** PLANNING — chờ **Tiến hành**.
