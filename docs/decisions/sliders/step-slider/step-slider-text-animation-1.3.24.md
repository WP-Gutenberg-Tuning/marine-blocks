# Step Slider text animation — 1.3.24

Date: 2026-11-19
Status: ACTIVE
Milestone: V1 / 1.3.24
Lifecycle: active
Notes: Reverse-engineered from Slider Revolution sample "From Soil to Harvest". Promoted from `C:\Users\VPF-Champion\Downloads\step-slider-text-animation-decision.md`. Implementation contract: plan [085](../../../../.context/planning/085_VER_1_3_24_STEP_SLIDER_CONVENTION_REPAIR_PLAN.md) Gói F. Source implement 2026-11-19 (`textAnimation`, `data-text-animation`); chưa build/runtime PASS. Fade 800 ms + wipe 800 ms vẫn khóa (079 §8). Ken Burns vẫn deferred.

## Quyết định

Giữ **cả hai preset** làm preset chuyển đổi được trong cùng một block, không loại preset nào:

| Preset | Giá trị attribute | Tên hiển thị Inspector (English, AGENTS product language) | Tính chất |
|---|---|---|---|
| A | `slide` | Slide | Gần mẫu gốc nhất, cảm giác "bước tiếp theo" rõ |
| B | `rise` | Fade + Rise | An toàn nhất cho nội dung B2B, chữ dài và mobile |

Preset mặc định là `slide` (preset A). Đổi mặc định sang `rise` chỉ cần đổi một giá trị mặc định của attribute, không đổi cấu trúc nào khác.

Nhãn trong file quyết định gốc (tiếng Việt: "Hiệu ứng chữ" / "Trượt ngang") là tài liệu nội bộ. UI plugin dùng tiếng Anh.

## Cơ sở từ mẫu gốc

Quan sát trực tiếp demo gốc ngày 19/11/2026, khoảng 50 ảnh chụp trong 6 phút, bắt được 2 frame giữa transition, đều là autoplay. Những gì 2 frame đó cho thấy:

- Text trượt ngang từ phải sang trái vào vị trí cuối: frame đầu lệch phải khoảng +130 px, frame cuối còn khoảng +25 px.
- Trong 2 frame đó text hoàn toàn rõ nét, không fade, không blur, không scale, và không di chuyển theo chiều dọc.
- Ký tự cuối ở mép phải bị cắt hoặc vắng mặt trong cả 2 frame.
- Ba phần tử xuất hiện gần như cùng lúc, stagger rất nhỏ, không phải cascade lớn.
- Text của slide cũ đã biến mất hoàn toàn trong cả 2 frame; nền của slide mới đã lấp đầy viewport trong khi text vẫn đang dịch vào, tức text chuyển động độc lập với nền.

Giới hạn của bằng chứng: không bắt được frame giữa transition khi click tab và khi vòng lặp quay từ slide 4 về slide 1, nên thời lượng và easing của mẫu gốc không đo được. Hai preset dưới đây là thông số thiết kế cho plugin, không phải thông số đo được từ mẫu gốc.

## Preset A — `slide` (trượt ngang)

| Phần tử | Trạng thái đầu | Trạng thái cuối | Thời lượng | Delay |
|---|---|---|---:|---:|
| Heading (và kicker) | `opacity: 0; translateX(56px)` | `opacity: 1; translateX(0)` | 600 ms | 0 ms |
| Đoạn văn | `opacity: 0; translateX(56px)` | `opacity: 1; translateX(0)` | 600 ms | 90 ms |
| Nút bấm | `opacity: 0; translateX(56px)` | `opacity: 1; translateX(0)` | 600 ms | 180 ms |

Easing chung: `cubic-bezier(0.22, 1, 0.36, 1)`.

Biên độ 56 px là giá trị đã giảm so với khoảng 130 px quan sát ở mẫu gốc. Biên độ gốc lớn dễ làm ký tự cuối bị cắt ở mép phải, đúng hiện tượng đã thấy trong 2 frame bắt được. Preset A giữ hướng chuyển động và cảm giác của mẫu gốc, nhưng cộng thêm fade và giảm biên độ để text không bị cắt.

## Preset B — `rise` (fade + rise)

| Phần tử | Trạng thái đầu | Trạng thái cuối | Thời lượng | Delay |
|---|---|---|---:|---:|
| Heading (và kicker) | `opacity: 0; translateY(24px)` | `opacity: 1; translateY(0)` | 550 ms | 0 ms |
| Đoạn văn | `opacity: 0; translateY(24px)` | `opacity: 1; translateY(0)` | 550 ms | 100 ms |
| Nút bấm | `opacity: 0; translateY(24px)` | `opacity: 1; translateY(0)` | 550 ms | 200 ms |

Easing chung: `cubic-bezier(0.22, 1, 0.36, 1)`, giống preset A.

Preset B không phụ thuộc vào hướng trượt của nền, không bị cắt ở mép phải và đọc tốt trên màn hình nhỏ. Đây là preset nên chọn khi nội dung là B2B, heading hoặc đoạn văn dài, hoặc khi slider chạy trên mobile là chính. Đánh đổi: cảm giác "bước" yếu hơn preset A.

## Quy tắc dùng chung cho cả hai preset

- Chỉ animate `transform` và `opacity`. Không animate `width`, `height`, `top`, `left`, `filter`, blur, scale hay xoay, vì các thuộc tính đó tốn raster và làm chữ mờ trong lúc chuyển, đặc biệt trên Firefox.
- Text ra: fade trong 200 ms, hoặc biến mất ngay trước khi text mới vào, khớp với quan sát ở mẫu gốc là text cũ đã biến mất hoàn toàn khi text mới đang dịch vào.
- Click tab nhanh liên tục: last-wins. Animation đang chạy bị hủy ngay và animation của slide cuối cùng được chọn chạy lại từ đầu; không xếp hàng đợi.
- `prefers-reduced-motion: reduce`: cả hai preset đều tắt chuyển động, text hiện ngay hoặc chỉ fade 150 ms. Thanh tiến trình trên tab cũng không chạy trong chế độ này.
- Nhãn trên tab không animate. Tab là điều hướng, không phải nội dung; chỉ thanh tiến trình của tab đang active chạy.
- Không dùng tách chữ từng ký tự, typewriter, blur-in hay stagger lớn hơn 300 ms giữa các phần tử, vì các kiểu đó làm chậm việc đọc và xung đột với autoplay.

## Ánh xạ vào block

Attribute trên block cha `skvn-marine/step-slider`:

- Tên: `textAnimation`
- Kiểu: chuỗi, chỉ nhận hai giá trị `slide` và `rise`
- Mặc định: `slide`

Trong Editor, Inspector có một Select **Text animation** với hai lựa chọn **Slide** và **Fade + Rise**. Các slide trong Editor xếp tĩnh nên không chạy animation; đổi lựa chọn chỉ đổi class / `data-text-animation` trên phần tử gốc của block. Ở frontend, attribute đó chọn bộ quy tắc CSS của preset tương ứng, còn cấu trúc HTML của slide không đổi giữa hai preset.

Trong prototype, kicker đứng cùng nhóm delay với heading: kicker và heading dùng delay của heading (0 ms ở cả hai preset), đoạn văn và nút bấm dùng delay riêng. Nhóm này giữ nguyên khi đưa vào block.

## Supersession

Quyết định này **thắng** plan 079 §8 (cascade khóa `translateY(0.75rem)` / 400 ms / delay 0–100–200–300, không control) và plan 083 “transition/cascade khóa số, không thành control” — **chỉ phần text**. Fade slide 800 ms và wipe media 800 ms **không** đổi. Ken Burns vẫn deferred.
