# Prompt — Step Slider: Full trên trang chính, thẻ editor không nở

Ngày: **2026-11-21**. Human giao prompt này = điều tra rồi sửa. Không hỏi lại “có implement không?”. Không viết plan mới. Không bump metadata, không zip/deploy, không git push, không `npm run build` / lint, không commit trừ khi human lệnh. Không kết luận runtime PASS.

```text
Bạn làm việc trong D:\Github\skvn-marine.

Nhiệm vụ: Step Slider trên trang chính là full hàng. Thẻ editor giữ nguyên bề ngang lúc block còn Wide. Human vừa chọn Full width trên toolbar thì thẻ editor nở sát hai mép canvas, trong khi Hero Slider bên dưới vẫn thụt ở 1200px. Chrome editor (header, ô 16:9, dải step, footer, nút Add step, màu, bo góc, padding) không được đổi. Human nói rõ: editor không có đổi.

Đọc trước khi sửa:
.context/PITFALLS.md — DP-17
.context/planning/088_VER_1_3_24_STEP_SLIDER_ALIGN_DEFAULT_REPAIR_PLAN.md
.context/planning/086_VER_1_3_24_STEP_SLIDER_EDITOR_STAGE_EXECUTION_PLAN.md — mục Chiều ngang
docs/decisions/canvas-alignment-and-generatepress-exit.md — ba chủ width

Đọc AGENTS.md trước; load GLOBAL → MILESTONES → toàn TENSIONS_OPEN → TENSIONS_ACTIVE. Convention: L0 + hàng “Sửa block đã phát hành” (A5.2, A5.10) + A5.12. Ghi khối "Đã đọc" khi giao code. Không đọc hết CONVENTION.md.

Current: V1 / 1.3.24. Giữ current và metadata. Không sửa themes/generatepress/**. Không sửa theme.json.

## Triệu chứng

Ảnh editor 2026-11-21: card Step Slider sát hai mép canvas. Card Hero phía dưới thụt hai bên. Cùng một trang editor.

Trang chính https://minhhaifishery.com/test-page-2/ trước khi chọn Full: Step Slider class alignwide, rộng 1200px, x = 0, hàng nội dung 1905px. Hero class alignfull, rộng 1905px.

## Đã khóa

- align.default của Step Slider là "full". Commit b80df40 đã đặt full. Lần đổi thành "wide" ngày 2026-11-20 là để co thẻ editor cho bằng Hero. Việc đó làm trang chính còn 1200px. DP-17. Không đổi default lại thành wide. Không setAttributes({ align }) để chỉnh bề ngang thẻ editor.
- Trang chính: alignfull = width 100%, margin 0, max-width none, rule plugin .entry-content .wp-block-skvn-marine-step-slider.skvn-step-slider.alignfull. alignwide = --skvn-wide-width 1200px của theme, cộng GeneratePress margin-left 0 nên dính trái. Không viết CSS ép mọi Step Slider full hàng khi attribute vẫn là wide. Wide và Full phải vẫn khác nhau.
- edit.tsx gắn align${attributes.align} lên root useBlockProps. theme.json: contentSize 760px, wideSize 1200px. alignfull trong canvas editor chiếm hết bề ngang canvas. alignwide dừng ở 1200px. editor.css của card không có max-width; comment đầu file nói card rộng theo hộp align. useEditorPreviewFrame chỉ sửa margin-block-start.
- Chrome editor đã có. Không đổi header, stage 16:9, dải step, footer, nút Add step, palette, border, radius, padding 22px. Không copy canvas Hero. Không chạy Swiper trong editor.

## Việc cần làm

Tách bề ngang thẻ editor khỏi attribute align. Full trên toolbar và trên trang chính vẫn full hàng. Thẻ editor không nở khi attribute là full. Bề ngang thẻ editor bằng lúc block còn wide: cùng loại hộp với Hero đang wide trên ảnh, không sát mép canvas.

Sửa xong, ghi một dòng vào DP-17: Fixed editor width, file nào, chưa runtime PASS.

## Cấm

- Không đổi align.default.
- Không bảo human chọn lại Wide để co editor.
- Không sửa theme.json contentSize / wideSize.
- Không đụng themes/generatepress/**.
- Không thêm max-width 1180px, 760px, 100vw, margin ngang âm.
- Không kết luận xong khi chưa chỉ ra selector nào giữ thẻ editor và selector nào giữ trang chính.
```
