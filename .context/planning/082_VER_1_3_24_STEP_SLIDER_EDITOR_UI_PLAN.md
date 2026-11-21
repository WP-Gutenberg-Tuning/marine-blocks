# V1 / 1.3.24 — Step Slider editor UI

Ngày: **2026-11-16**. Human: editor hiện tại là chồng thẻ cơ bản. Plan này chỉ mô tả khung soạn thảo. Không code, không đụng CSS frontend.

Độc lập với [081](081_VER_1_3_24_STEP_SLIDER_FRONTEND_VISUAL_PLAN.md). Làm trước hay sau đều được.

Khung ngày 2026-11-16 lấy mẫu từ editor Slider: header, rail trái, stage một slide, panel Playback. **Human 2026-11-20 bỏ rail trái.** Khung hiện hành: header, một stage 16:9, dải step phía dưới, panel Playback. Không copy Navigation, Pagination, Presentation, Motion. Những panel đó không thuộc Step Slider.

Decision: [step-slider-editor-stage-1.3.24.md](../../docs/decisions/sliders/step-slider/step-slider-editor-stage-1.3.24.md). Artifact thử: [step-slider-editor-stage-prototype.html](../../docs/artifacts/editor-ui/step-slider-editor-stage-prototype.html).

## Hiện tại

Mỗi `step-slide` là một thẻ đầy đủ: chữ `TAB`, ô nhãn nét đứt, dải xám `Choose background image`, heading và đoạn copy. Bốn bước thành một trang dài. Không có số bước, thumbnail, hay bước đang chọn. Ba control Autoplay, Dwell, Loop nằm trần trong sidebar.

## Khung mới

Khi chọn block, canvas là chrome tĩnh. Không Swiper, không fade, không autoplay. Human 2026-11-20.

Header một hàng: nhãn `STEP SLIDER`, số bước, badge đọc attribute (`Autoplay on` hoặc `Manual`).

Stage là một khung tỉ lệ 16:9, chỉ vẽ bước đang chọn, không cao `100svh`. Ảnh nền, hoặc fill khi bước chưa có ảnh, và Heading, Paragraph, list, buttons nằm chung trong khung đó, đúng vị trí trên slide. Nút chọn, thay và xóa ảnh nằm trên khung. Người soạn sửa chữ ngay trên nền.

Dải step nằm dưới stage. Mỗi ô là một bước: số thứ tự và tab label, nhận fill preset kể cả khi bước có ảnh. Bấm ô chọn đúng block `step-slide`. Nhãn bước sửa trên ô đó. Nút thêm nằm cuối dải và mất khi đủ 8 bước. Xóa và sắp xếp vẫn là thao tác Gutenberg trên block đang chọn.

Các bước khác chỉ còn trên dải step. Chúng vẫn là InnerBlocks, không thành một danh sách dữ liệu thứ hai. Không có rail trái. Không có hàng pill thứ hai.

Một dòng trạng thái: `Autoplay on · 8 seconds · Loop on`.

Sidebar một panel `Playback`: Autoplay, Dwell (5/8/10 seconds), Loop. Không Play, không focal, overlay, text surface, text position. Fade, wipe, cascade và 800 ms không thành control.

## O04

Contract O04 nói preview tĩnh và các child xếp dọc. Plan này giữ preview tĩnh, không Swiper, và một owner `tabLabel`. Human 2026-11-16 bỏ chồng thẻ. Human 2026-11-20 thay rail trái bằng một stage 16:9 và dải step phía dưới. Không hỏi lại hướng. Không đụng các câu O04 còn lại.

## Khi được lệnh code

Làm theo [086](086_VER_1_3_24_STEP_SLIDER_EDITOR_STAGE_EXECUTION_PLAN.md). Artifact HTML trong plan đó là hợp đồng nhìn. Không dựng rail trái.

- `wp-content/plugins/skvn-marine-blocks/src/step-slider/edit.tsx`
- `wp-content/plugins/skvn-marine-blocks/src/step-slide/edit.tsx`
- `wp-content/plugins/skvn-marine-blocks/src/step-slider/editor.css`
- `wp-content/plugins/skvn-marine-blocks/src/step-slider/editor-focus.tsx`

CSS editor tiếp tục đi vào `build/index.ts.css` và handle `skvn-marine-step-slider-editor`. Không import `style.css` vào editor. Không sửa `frontend.ts`, `style.css`, PHP render, `block.json`.

## Xong khi

Insert ra 4 bước. Dải step có 4 ô. Stage là một khung 16:9 của bước đang chọn, nền và heading cùng một mặt. Chọn bước khác, sửa tab label trên ô step, sửa heading trên nền, save, reopen, block không invalid. Bước thứ 9 không thêm được. Editor không chạy Swiper.
