# V1 / 1.3.24 — Step Slider editor UI

Ngày: **2026-11-16**. Human: editor hiện tại là chồng thẻ cơ bản. Plan này chỉ mô tả khung soạn thảo. Không code, không đụng CSS frontend.

Độc lập với [081](081_VER_1_3_24_STEP_SLIDER_FRONTEND_VISUAL_PLAN.md). Làm trước hay sau đều được.

Mẫu khung lấy từ editor Slider: header, rail trái, stage một slide, panel Playback. Không copy Navigation, Pagination, Presentation, Motion. Những panel đó không thuộc Step Slider.

## Hiện tại

Mỗi `step-slide` là một thẻ đầy đủ: chữ `TAB`, ô nhãn nét đứt, dải xám `Choose background image`, heading và đoạn copy. Bốn bước thành một trang dài. Không có số bước, thumbnail, hay bước đang chọn. Ba control Autoplay, Dwell, Loop nằm trần trong sidebar.

## Khung mới

Khi chọn block, canvas là chrome tĩnh. Không Swiper, không fade, không autoplay.

Header một hàng: nhãn `STEP SLIDER`, số bước, badge đọc attribute (`Autoplay on` hoặc `Manual`).

Rail khoảng 210px, cuộn khi danh sách dài. Mỗi dòng: thumbnail ảnh hoặc ô trống, `Step 2`, tên tab tối đa hai dòng, dòng đang chọn có nền và viền. Bấm dòng chọn đúng block `step-slide`. Nút thêm nằm cuối rail và mất khi đủ 8 bước. Xóa và sắp xếp vẫn là thao tác Gutenberg trên block đang chọn.

Stage chỉ vẽ bước đang chọn, trong khung bo góc, không cao `100svh`:

- ô `Tab label` thay cho chữ `TAB`
- vùng ảnh cao hơn dải xám hiện tại, nút chọn / thay / xóa ảnh nằm trên ảnh
- phía dưới là heading, paragraph, list, buttons của bước đó

Các bước khác chỉ còn trên rail. Chúng vẫn là InnerBlocks, không thành một danh sách dữ liệu thứ hai.

Chân khung là hàng pill tĩnh lấy từ tab label. Pill của bước đang chọn đậm hơn. Bấm pill cũng chỉ chọn bước. Một dòng trạng thái: `Autoplay on · 8 seconds · Loop on`.

Sidebar một panel `Playback`: Autoplay, Dwell (5/8/10 seconds), Loop. Không Play, không focal, overlay, text surface, text position. Fade, wipe, cascade và 800 ms không thành control.

## O04

Contract O04 nói preview tĩnh và các child xếp dọc. Plan này giữ preview tĩnh, không Swiper, và một owner `tabLabel`. Phần xếp dọc toàn bộ được thay bằng rail cộng một stage. Human đã yêu cầu hướng này ngày 2026-11-16. Không hỏi lại hướng. Không đụng các câu O04 còn lại.

## Khi được lệnh code

- `wp-content/plugins/skvn-marine-blocks/src/step-slider/edit.tsx`
- `wp-content/plugins/skvn-marine-blocks/src/step-slide/edit.tsx`
- `wp-content/plugins/skvn-marine-blocks/src/step-slider/editor.css`

CSS editor tiếp tục đi vào `build/index.ts.css` và handle `skvn-marine-step-slider-editor`. Không import `style.css` vào editor. Không sửa `frontend.ts`, `style.css`, PHP render, `block.json`.

## Xong khi

Insert ra 4 bước. Rail có 4 dòng, stage một bước. Chọn bước khác, sửa tab label, ảnh và heading, save, reopen, block không invalid. Bước thứ 9 không thêm được từ rail. Editor không chạy Swiper.
