# Hero slide background image focal point — test runbook (1.3.21)

Plan: `.context/planning/069_VER_1_3_21_HERO_SLIDE_BACKGROUND_IMAGE_FOCAL_POINT_PLAN.md`  
Acceptance: **HSF-***

## Preconditions

- Plugin build sau khi feature implement.
- Trang có **Hero** slider, ≥2 slide, mỗi slide có ảnh nền **rộng** (crop rõ khi đổi focal).
- Biết URL trang local/onsite.

## Fixtures

| ID | Mô tả |
|---|---|
| HSF-F1 | Slide 1: ảnh người/sản phẩm lệch — focal kéo vào vùc quan trọng |
| HSF-F2 | Slide 2: ảnh khác, focal center (default) |
| HSF-F3 | Slider Hero **parallax bật** (nếu có) |

## Cases

### HSF-UI-01 — Editor ≈ frontend

1. Chọn slide F1, mở **Background** → chỉnh focal (ví dụ góc phải trên).
2. Save, reload editor: focal giữ.
3. Frontend cùng slide: vùng ảnh hiển thị khớp editor (cùng width desktop).

**Pass:** chủ thể quan trọng không bị cắt mất so với editor preview.

### HSF-UI-02 — Legacy / reset

1. Slide không từng chỉnh focal (content cũ): frontend = crop center.
2. **Reset to center** sau khi chỉnh: về center.

### HSF-UX-01 — Image lifecycle

1. Replace image trên slide đã có focal: theo spec human đã chốt (giữ hoặc reset) — ghi kết quả.
2. Remove image: control focal ẩn; thêm lại ảnh — focal theo spec.

### HSF-UX-02 — Apply modal (human: cả hai kênh)

1. **Image focal point** only (checkbox): F1 → F2, ảnh F2 không đổi, `object-position` giống F1.
2. **Background image** on: url + **focal bắt buộc kèm** + overlay (nếu tick overlay).

### HSF-TECH-01 — Parallax

1. HSF-F3: đổi slide, scroll nếu cần; focal không “nhảy” anchor khi chuyển slide.

### HSF-TECH-02 — Regression

1. Product Showcase / Card Carousel: không slide bg — không control focal, layout không đổi.

## Evidence human report

- Screenshot editor + frontend cùng slide (HSF-UI-01).
- Ghi rõ Apply case (HSF-UX-02).
- Console lỗi: không.
