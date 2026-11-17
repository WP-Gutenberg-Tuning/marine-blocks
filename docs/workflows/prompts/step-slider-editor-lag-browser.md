# Prompt — browser chẩn đoán Step Slider lag editor

Copy từ dòng `Bạn làm việc` đến hết. Có browser. Không sửa source plugin, theme, hay plan.

```text
Bạn làm việc trong D:\Github\skvn-marine.

Nhiệm vụ: kiểm editor WordPress khi trang có Step Slider, rồi ghi kết quả vào đúng một file:

docs/testing/step-slider-editor-lag-ledger.md

Thêm một mục mới ở cuối file, tiêu đề:

## [ngày giờ] | browser

Không sửa các mục đã có. Không commit. Không đổi CSS, JS, PHP.

Editor local: http://localhost:8080/wp-admin/
Nếu human đang mở một post editor khác, dùng tab đó và ghi đúng URL.

## Đọc trước

docs/testing/step-slider-editor-lag-ledger.md — bảng Code facts. Đó là premise, không kiểm lại bằng cách đọc thêm source trừ khi một test dưới đây mâu thuẫn fact.

## Test

Làm đúng thứ tự. Dừng và ghi lại nếu không vào được editor.

1. Mở post editor có block Step Slider. Nếu chưa có, tạo page nháp, chèn một Step Slider, đợi editor đứng yên. Ghi URL.
2. Ngay sau khi trang load, trước khi bấm gì: Firefox đã hiện `prevented this site from opening a pop-up` chưa. Bấm biểu tượng chặn popup, chép nguyên URL bị chặn. Không có thanh này thì ghi “không có lúc load”.
3. Chọn block Step Slider. Ghi editor có đứng lâu không: ước lượng giây từ lúc click đến khi gõ được vào ô Tab label.
4. Gõ một chữ vào Tab label của bước 1, rồi một chữ vào heading. Ghi mỗi lần có đứng không.
5. Bấm Choose background image một lần. Ghi: modal thư viện mở trong trang, hay thanh popup Firefox hiện thêm. Nếu có thanh mới, chép URL bị chặn. Đóng modal, không chọn ảnh.
6. Không bấm Preview trừ khi các bước trên không làm hiện thanh popup. Nếu phải bấm, bấm một lần và chép URL.
7. Trong document editor và trong iframe canvas, chạy và ghi nguyên kết quả:

document.querySelectorAll('script[src*="frontend.ts.js"]').length
document.querySelectorAll('link[href*="style-frontend.ts.css"], link[href*="frontend.ts.css"]').length

Trong iframe canvas:

document.querySelectorAll('.skvn-step-slider').length
[...document.querySelectorAll('.skvn-step-slider')].map(el => el.className)
document.querySelectorAll('.skvn-step-slider .swiper').length
getComputedStyle(document.querySelector('.skvn-step-slide__content')).minHeight

8. Console: có lỗi lặp lại không. Ghi message đầu tiên và số lần thấy trong khoảng 10 giây sau khi chọn block. Không copy cả stack nếu dài hơn 15 dòng.

## Ghi vào ledger

Mục mới gồm:

- URL editor
- Popup lúc load: có/không, URL bị chặn
- Lag: load / chọn block / gõ tab / gõ heading, mỗi cái một câu
- Choose background image: modal hay popup, URL nếu bị chặn
- Bốn số và className, minHeight
- Console: không lỗi, hoặc message + số lần
- Một câu: khớp fact nào, fact nào sai

Không kết luận PASS. Không đề xuất sửa code trong file ledger.
```
