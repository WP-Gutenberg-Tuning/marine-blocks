# Editor preview frame contract

Status: **Human approved direction — 2026-11-05**. Implementation theo từng block, không phải toàn plugin đã có source/PASS. Tracking: `.context/planning/053_EDITOR_PREVIEW_FRAMES_ROLLOUT.md`.

## Mục đích và phạm vi

Phân biệt các block trong Gutenberg canvas bằng một khung editor thống nhất, nhãn loại block và màu nhẹ theo họ bố cục. Khung giúp nhận diện ranh giới; không thay thiết kế card hoặc màu website. Áp dụng dần cho Collection Carousel/Grid, Category Grid, Slider và Step Slider sau audit từng surface. Không global style mọi Gutenberg block/core block.

Human đã duyệt: heading và intro thuộc cùng khung với preview; một khung ngoài, tránh khung lồng khung; màu theo layout family; nhãn chữ nhận diện; khoảng cách dọc có kiểm soát. Mẫu canvas Product Carousel chi tiết tiếp tục theo plan052, không mất card/summary/query/states/disclosure/limitation note.

## Anatomy

```text
┌─ PRODUCT CAROUSEL / PRODUCT GRID / … ────────────────────┐
│ Heading (nội dung, chỉnh trực tiếp nếu block hỗ trợ)     │
│ Optional intro (không ép lưu placeholder làm nội dung)  │
│                                                        │
│ Preview đặc thù của block                              │
│ Card / slides / steps + thông tin cần cho biên tập      │
│                                                        │
│ Giới hạn preview / trạng thái khi liên quan              │
└────────────────────────────────────────────────────────┘
```

Tên loại block là chrome editor, không serialize thành heading trên website. Bảo toàn heading/intro toggle, native RichText, selection/toolbar/focus/Undo và nội dung lồng nhau. Bỏ nền/viền khung preview bên trong khi đã có khung ngoài; vẫn giữ border của card/nội dung vì đó là thiết kế thật.

## Màu được duyệt

| Layout family | Background | Border | Consumers dự kiến |
|---|---|---|---|
| Collection Carousel | `#f6f8fa` | `#dce4e9` | Product/Post Collection ở mode Carousel |
| Grid | `#eff8fc` | `#c9e3ef` | Product/Post Collection ở mode Grid và Product Category Grid |
| Utility / Responsive Spacer | `#f0fdfa` | `#99d5ca` | Plan055 human duyệt implementation trong1.3.19 ngày2026-11-05, visual/contrast onsite pending |
| Slider / Step Slider | **Chưa chốt** | **Chưa chốt** | Audit và đưa phương án riêng trước khi gán màu |

Giá trị là baseline đã duyệt, chưa có visual/contrast PASS trên mọi environment; nếu cần đổi palette thì ghi evidence và decision mới. Màu theo family, không theo từng block hoặc nội dung Product/Post; không tự coi mọi block dùng Swiper là Collection Carousel. Màu luôn kèm tên loại block, không là tín hiệu duy nhất. Nền/viền khung không override card typography/image/background tokens.

Khi triển khai nhiều consumer, dùng editor-scoped CSS variables cho các cặp màu, đặt tên theo source naming hiện hành trước migration1.4.0. Không thêm option DB/theme dependency chỉ để chọn màu chrome editor.

## Spacing và width ownership

Responsive Spacer exception: khung label/summary/indicator căn giữa và luôn chọn được kể cả height0. Vùng indicator padding-top/bottom=min(effectiveHeight,200)/2, số hiển thị giữ giá trị thật; >200 có cap note. Không khẳng định tổng khung cao đúng spacing frontend; H frontend không bị cap. Palette text `#134e4a`, secondary `#3f625d`, current device chip nền `#ccfbf1`/text-border `#115e59`; native focus giữ nguyên. CSS editor owner `src/responsive-spacer/editor/style.css`, không serialize frame/chrome xuống frontend. Regression và evidence riêng theo RS-* plan055.

- Ý định “mỗi block margin5px” được duyệt thành **hai khung preview kề nhau có khoảng hở thực tế tối thiểu10px** theo chiều dọc.
- Không áp `margin: 5px` bốn phía và không thay margin mọi Gutenberg block. Giữ alignment Normal/Wide/Full, chiều rộng do canvas/parent sở hữu.
- Khi parent đã tạo gap >=10px, không cộng thêm một lớp gap. Phải đo cả margin/gap/computed block wrapper; không giả định hai margin5px luôn cộng thành10px vì collapse/layout khác nhau.
- Nested block không có thêm khung quanh từng Slide/step nếu đã có khung root; tránh cộng spacing giữa nội dung con và phá bố cục tác giả.
- Khi parent gap <10px hoặc0, adapter editor root mới bổ sung phần thiếu bằng cơ chế kiểm chứng trên WordPress thực tế. Chưa chốt selector/cách tính cho tới audit P0; không dùng selector global hoặc can thiệp private core DOM để đoán.
- Không viewport width math, margin âm hoặc overflow mask. Áp dụng `css-layout-safety-contract.md`; kiểm rect + scrollbar desktop và Group/Columns hẹp.

## Preview trung thực và accessibility

Spacer follow-up human2026-11-06 (055§13): riêng Spacer dùng margin-block10px tĩnh trên/dưới, editor-only alignfull/width100% theo parent canvas và emoji cạnh device text; không animation/spacing geometry observers. Ngoại lệ này thay minimum-gap adapter cho Spacer, không thay consumer khác. Parent gap có thể cộng thêm; không hứa tổng gap10px. Không serialize alignfull/frame margins; frontend vẫn H.

Giữ thông tin và states đã có; phân biệt nội dung minh họa với kết quả query thật. Không chạy autoplay/Swiper trong editor hoặc thêm query/API chỉ để có khung đẹp. Không dùng fixed height cắt nội dung hay giãn dòng để lấp khoảng trống. Tên dài, ảnh off, query empty/error/loading, slide/step rỗng và số item tối đa phải kiểm theo từng consumer.

Nhãn chrome không biến thành heading nội dung không cần thiết; font/contrast đọc được, focus ring và hit targets không bị border/padding che. Khi đổi layout/thu gọn không làm rơi focus. Frontend markup/CSS/runtime/schema/data persistence giữ nguyên trong task khung editor.

## Verification

Mỗi consumer ghi riêng Đã có source / Chờ kiểm chứng / PASS / FAIL, kèm build/environment/URL/fixture. PASS đòi screenshot desktop/hẹp, keyboard selection/RichText/disclosure phù hợp, rect/gap/scrollWidth, save/reopen/Undo và frontend regression. Không suy đã làm tất cả từ hai consumer đầu, screenshot một block hoặc build thành công.
