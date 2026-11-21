# Step Slider editor — stage 16:9

2026-11-20. Review artifact cho editor Step Slider, milestone **1.3.24**. Human chốt bố cục cùng ngày. **Không phải Gutenberg implementation và không phải runtime acceptance.**

Mở [interactive prototype](step-slider-editor-stage-prototype.html). CSS nằm ở [step-slider-editor-stage-prototype.css](step-slider-editor-stage-prototype.css).

Decision: [step-slider-editor-stage-1.3.24.md](../../decisions/sliders/step-slider/step-slider-editor-stage-1.3.24.md).

Plan thực hiện: [086](../../../.context/planning/086_VER_1_3_24_STEP_SLIDER_EDITOR_STAGE_EXECUTION_PLAN.md).

## Xem gì

- Canvas: header `STEP SLIDER`, một khung 16:9, dải step ngay dưới khung. Không có rail trái.
- Khung 16:9 là sân biên tập. Nền và Heading, Paragraph, list, button nằm cùng một mặt. Sửa chữ ngay trên nền. Chữ giữ lại khi đổi bước, cho đến khi tải lại trang.
- Khung không phải preview front-end. Front-end vẫn cao theo viewport hoặc content, cột chữ căn giữa. Heading trong artifact dùng `clamp(26px, 5cqi, 40px)` theo bề ngang khung, không dùng `vw`.
- Chưa có ảnh: nút `Choose image`. Có ảnh: `Replace image` và `Remove image`. Ảnh là `<img>` phủ khung. Fill của bước vẫn nằm dưới ảnh. Ô step bên dưới vẫn giữ fill preset.
- Scrim là một gradient đáy của artifact. Không phải hai lớp overlay của trang.
- Bấm một ô step để mở bước đó. Dải là `tablist`: mũi tên trái/phải đổi ô khi focus ở ô, và không đổi ô khi đang sửa nhãn. Sửa nhãn trên ô đang chọn.
- `Add` thêm một bước và chọn nó. Hết 8 bước thì nút mất. Câu `Add a step to start editing.` có trong khung cho trạng thái 0 bước; prototype này mở sẵn 4 bước và không có nút xóa.
- Cột `Playback` rộng 230px là bản vẽ sidebar. Năm control: Autoplay, Dwell, Loop, Pause on hover, Show play button. Badge và dòng trạng thái chỉ đổi theo Autoplay, Dwell, Loop. Không chạy autoplay. Human 2026-11-20: làm cột này sau 1.4.x. Plan 086 không dựng cột trong canvas; năm control ở Inspector. Bố cục ghi ở plan 086 mục 9.

## Giới hạn

Không có WordPress, InnerBlocks, lịch sử undo, lưu trang, Swiper, hay ảnh mạng. Dữ liệu trong trang chỉ để bấm thử bố cục. `max-width: 1180px` là khổ trang review, không phải chiều ngang của block. Xóa và sắp xếp bước không có trong artifact này; khi code thì vẫn là thao tác Gutenberg trên block đang chọn. Focal, Text position và Text surface không có trên khung này.
