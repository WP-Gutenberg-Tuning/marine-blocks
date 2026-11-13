# Translate only — không zoom lúc chuyển slide (1.3.21)

Plan: `.context/planning/072_VER_1_3_21_PARALLAX_TRANSLATE_ONLY_PLAN.md`

## Target

Slider Hero đã bật parallax, trên frontend sau build plan 072. Trang đang dùng để xem parallax (home hoặc trang test slider).

## Preconditions

- Plugin build từ source có plan 072.
- Advanced bật khi kiểm PTO-01–03 và PTO-05.
- `prefers-reduced-motion` tắt.

## Steps

1. Advanced → Depth **Translate only**, Translate **30**, Direction Horizontal. Reload frontend.
2. Trước khi kéo: DevTools, `.skvn-slide__bg` của slide đang xem.
3. Bấm next một lần, nhìn ảnh trong lúc chuyển.
4. Đổi Depth **Both**, Scale **1.12**, Translate **30**. Reload. Đọc lại attr.
5. Tắt Advanced, Intensity **Medium**. Reload. Đọc lại attr.
6. Advanced → **Scale only**, Scale **1.20**. Reload. Đọc lại attr.

## Expected

| ID | Pass |
|---|---|
| PTO-01 | Translate only: có `data-swiper-parallax-x="-30%"`. Không có `data-swiper-parallax-scale`. |
| PTO-02 | Lúc chuyển slide ảnh trượt và không phóng. Dải màu fill ở mép là đúng. |
| PTO-03 | Both: `data-swiper-parallax-scale="1.60"` và translate `-30%`. |
| PTO-04 | Intensity medium, Advanced tắt: scale `1.60`, translate `-30%`. |
| PTO-05 | Scale only: `data-swiper-parallax-scale="1.20"`, không có attr translate x/y. |

## Evidence

Gửi attr `data-swiper-parallax-*` trên `.skvn-slide__bg` cho ba depth, và một ảnh hoặc mô tả lúc chuyển slide ở Translate only (có/không thấy zoom, có/không thấy dải fill).
