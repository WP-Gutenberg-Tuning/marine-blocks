# Prompt — Slider agent điều tra ảnh nền Step Slider

Copy từ dòng `Bạn làm việc` đến hết. Chỉ điều tra. Không sửa source.

```text
Bạn làm việc trong D:\Github\skvn-marine.

Nhiệm vụ: điều tra ảnh nền của Step Slide so với Slider. Human nêu hướng: ảnh nên có một bao ngoài, và người dùng chọn được focus point. Chỉ đọc và ghi nhận. Không sửa CSS, JS, TS, PHP, block.json, plan, hay decision. Không commit.

## Đọc

1. wp-content/plugins/skvn-marine-blocks/src/slide/edit.tsx — `SlideBackgroundPreview`, `FocalPointPicker`.
2. wp-content/plugins/skvn-marine-blocks/src/slide/save.tsx — cây media / bao ảnh / overlay.
3. wp-content/plugins/skvn-marine-blocks/src/slide/focal.ts — hàm đang có.
4. wp-content/plugins/skvn-marine-blocks/src/slider/style.css — `.skvn-slide__bg` và `object-position`.
5. wp-content/plugins/skvn-marine-blocks/src/step-slide/edit.tsx và save.tsx.
6. modules/step-slider-render/step-slider-render.php — chỗ ghi `--skvn-slide-bg-pos-x` / `--skvn-slide-bg-pos-y`.
7. src/step-slider/style.css — rule `object-position` của `.skvn-step-slide__image`.
8. src/step-slide/block.json — attribute `backgroundImageFocalPoint` có default không.

## Việc cần trả lời

- Slider bọc ảnh bằng những lớp nào, focus point lưu ở attribute nào, biến CSS nào ăn `object-position`.
- Step Slide hiện thiếu lớp nào so với cây đó. Ảnh có phải con trực tiếp của `.skvn-step-slide__media` không.
- Attribute focal của Step đã có chưa. Editor có `FocalPointPicker` không. PHP và CSS đã dùng giá trị đó chưa. Mặc định khi người dùng chưa chọn là gì.
- Bao ngoài có việc gì mà để ảnh trần không làm được: cover, object-position, overlay có bị kẹp trong ảnh không.
- Plan 079 cấm Inspector cho focal. Ghi đó là khóa cũ. Human 2026-11-17 muốn điều tra hướng bao ngoài + chọn focus point, chưa lệnh code.

## Ghi

Thêm một mục ở cuối docs/testing/step-slider-frontend-visual-delta.md:

## [ngày giờ] | slider

Nội dung: cây Slider, cây Step, chỗ focal đã nối và chỗ chưa nối, một câu về việc bao ngoài có cần hay không dựa trên source. Không đề xuất patch. Không kết luận PASS.

Không đụng chiều cao `100svh`, header, GeneratePress, autoplay, tab, mũi tên.
```
