# Step Slider editor stage — 1.3.24

Date: 2026-11-20
Status: ACTIVE
Milestone: V1 / 1.3.24
Lifecycle: active
Notes: Human chốt trên bản vẽ terminal cùng ngày. Thay phần rail trái của plan 082 (2026-11-16). Không code editor Gutenberg, không bump metadata, không đổi current. Khóa thêm sau review plan 086 cùng ngày: khung 16:9 là sân biên tập theo artifact, không phải preview front-end; ảnh trong khung là img; scrim editor là gradient một lớp của artifact. Khóa R1–R5 cùng ngày, phân tích ở plan 086 mục 8: type editor có `align` và `fillPreset`; default `full` mang `alignfull`, toolbar đổi được `wide`; guard sai thì stage bỏ `aspect-ratio` và `overflow: hidden`; `role="tab"` trên button số, RichText nhãn là sibling; layout stage dùng `grid-template-rows: minmax(0, 1fr)`; `editor.css` bỏ `* { opacity: 1 }` và padding/gap cũ của content. Cùng ngày: cột Playback 230px trong artifact là thiết kế sidebar để làm sau 1.4.x; plan 086 mục 9 giữ bố cục. Lần editor stage không vẽ cột đó.

## Quyết định

Khi được lệnh làm editor Step Slider, canvas là chrome tĩnh. Không Swiper, không fade, không autoplay trong editor.

1. Không có rail trái. Dải step nằm dưới stage. Mỗi ô là một bước. Bấm ô thì stage mở đúng bước đó.
2. Stage là khung biên tập tỉ lệ 16:9 theo artifact. Ảnh, hoặc fill khi bước chưa có ảnh, và nội dung Heading, Paragraph, list, buttons nằm chung trong khung đó. Khung này không phải bản sao pixel của slide front-end.
3. Nhãn bước sửa trên ô của dải step. Dải này cùng vai với tab step trên trang: số thứ tự và tab label. `role="tab"` nằm trên button số. RichText nhãn là phần tử cạnh button trong cùng ô. Ô vẫn nhận fill preset kể cả khi bước có ảnh. Ảnh chỉ hiện trong khung 16:9.
4. Nút Add nằm cuối dải và mất khi đủ 8 bước. Xóa và sắp xếp vẫn là thao tác Gutenberg trên block đang chọn.
5. Header một hàng: `STEP SLIDER`, số bước, badge `Autoplay on` hoặc `Manual`. Một dòng trạng thái đọc attribute, ví dụ `Autoplay on · 8 seconds · Loop on`.
6. Panel `Playback` giữ năm control đang có, theo thứ tự Autoplay, Dwell (5/8/10 seconds), Loop, Pause on hover, Show play button. Badge và dòng trạng thái chỉ đọc Autoplay, Dwell, Loop. Layout, Motion và progress color ở panel riêng. Không copy Navigation, Pagination, Presentation của Hero Slider. Cột thẻ Playback rộng 230px cạnh canvas trong artifact là thiết kế để làm sau 1.4.x. Lần này năm control ở Inspector, không thành một cột tự vẽ.

Các bước khác vẫn là InnerBlocks. Dải step không thành một danh sách dữ liệu thứ hai.

Plan thực hiện, từng bước cho agent: [.context/planning/086_VER_1_3_24_STEP_SLIDER_EDITOR_STAGE_EXECUTION_PLAN.md](../../../../.context/planning/086_VER_1_3_24_STEP_SLIDER_EDITOR_STAGE_EXECUTION_PLAN.md).

## Artifact thử

Bản HTML này chỉ để xem bố cục. Không phải implementation Gutenberg và không phải acceptance.

- [step-slider-editor-stage-prototype.html](../../../artifacts/editor-ui/step-slider-editor-stage-prototype.html)
- [step-slider-editor-stage-prototype.css](../../../artifacts/editor-ui/step-slider-editor-stage-prototype.css)
- [Ghi chú](../../../artifacts/editor-ui/step-slider-editor-stage-prototype.md)

## Thay cho

Plan 082 ngày 2026-11-16 mô tả rail trái khoảng 210px, ô `Tab label` riêng, vùng ảnh riêng, nội dung nằm dưới ảnh, và một hàng pill thứ hai. Human 2026-11-20 bỏ rail và hàng pill. Dải step dưới stage đảm nhiệm việc chọn bước. Khung 16:9 đảm nhiệm nền và nội dung.
