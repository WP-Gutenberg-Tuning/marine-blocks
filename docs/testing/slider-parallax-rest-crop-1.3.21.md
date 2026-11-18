# Parallax rest crop — 1.3.21

Plan: `.context/planning/070_VER_1_3_21_PARALLAX_REST_CROP_PLAN.md`. Pitfall: DP-08.

Chưa xác nhận onsite. Source 2026-11-13 đã bỏ inset âm. Chạy sau khi build plugin.

## Setup

- Trang có Hero slider, một slide ảnh nền, focal khác tâm (không 50% 50%).
- Ghi URL, viewport, và intensity đang chọn.
- So sánh trước khi kéo slide. Đo lúc đang chuyển là case riêng.

## Cases

| ID | Làm | Pass |
|---|---|---|
| PRC-01 | Tắt parallax, chụp. Bật medium, không kéo. | Hai ảnh đứng yên cùng crop. `.skvn-slide__bg` và `.skvn-slide__media` cùng rect. Inline slider không có `--skvn-parallax-inset` âm. |
| PRC-02 | Đặt focal ở editor, save, xem frontend với parallax medium. | Vùng nhìn đứng yên khớp editor. |
| PRC-03 | Kéo sang slide kế, medium. | Không lộ dải màu fill ở mép ảnh. |
| PRC-04 | Subtle rồi strong, đứng yên rồi kéo một lần. | Đứng yên không zoom. Strong không bị kẹp scale 1.50. |
| PRC-05 | Advanced: translate 30%, scale 1.12. Rồi depth Scale only, scale 1.12. | Both/translate: `data-swiper-parallax-scale` ≥ 1.60. Scale only: đúng 1.12. |
| PRC-06 | `prefers-reduced-motion: reduce`, và một slider nhiều slide cùng lúc. | Không class parallax, không inset âm. |

## Evidence

- Hai screenshot đứng yên (parallax tắt / medium).
- Một screenshot hoặc clip lúc chuyển slide.
- Giá trị `data-swiper-parallax-scale` và style inset trên slider.
