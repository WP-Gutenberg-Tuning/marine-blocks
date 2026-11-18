# Hero Slide background fill — test plan 1.3.21

Plan: `.context/planning/068_VER_1_3_21_HERO_SLIDE_BACKGROUND_FILL_AND_COPY_PLAN.md`

Ngày: 2026-11-12. Status: **plan only** — chạy sau khi có source + human build.

## Preconditions

- Hero slider fixture (≥3 slide), plugin build đúng version milestone.
- Biết URL trang test (staging hoặc local); ghi commit/build trong báo cáo.
- Contrast 044 đã deploy hoặc test cùng build — ghi chung build ID.

## Fixtures

| ID | Setup |
|---|---|
| HSB-F1 | Hero 3 slide, không ảnh: slide1 default, slide2 custom solid, slide3 transparent |
| HSB-F2 | Mỗi slide ảnh khác; slide1 custom gradient fill + ảnh |
| HSB-F3 | Apply Fill-only từ slide2 → slide1,3; ảnh slide1,3 không đổi |
| HSB-F4 | Apply Fill+Image từ slide1 → all; warning hiện trước Apply |

## Steps (tóm tắt)

1. **HSB-UI-01:** Mỗi fill mode — screenshot editor + frontend cùng slide; DevTools ghi `background` trên `.skvn-slide`.
2. **HSB-UI-02:** Slide có ảnh — xác nhận fill không che ảnh; overlay vẫn hoạt động.
3. **HSB-UX-01:** Modal channels và target list; Fill-only không đổi `backgroundImage*` trên REST/saved markup.
4. **HSB-UX-02:** Apply → Undo → save → reload → attrs giữ.
5. **HSB-TECH-01:** Mở Hero saved trước patch — không invalid, fill = default.
6. **HSB-UI-03:** Transparent không ảnh — ghi computed text/background; có notice editor nếu spec có.

Pass/fail map tới HSB-* trong plan068 §8.
