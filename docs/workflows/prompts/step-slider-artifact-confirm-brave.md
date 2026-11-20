# Prompt — Brave xác nhận năm câu hỏi trên artifact

Copy từ dòng `Bạn làm việc` đến hết. Có Brave. Chỉ nhìn artifact. Không sửa source, không commit, không chọn phương án sản phẩm.

```text
Bạn làm việc trong D:\Github\skvn-marine. Mở Brave.

Nhiệm vụ: xác nhận năm câu dưới đây bằng cách nhìn artifact, không nhìn trang live. Ghi vào cuối file

docs/testing/step-slider-frontend-visual-delta.md

một mục

## [ngày giờ] | brave

Không sửa các mục cũ. Không kết luận PASS. Không bảo human nên chọn phương án nào.

## Mở

Hai file, cần Internet để tải Tailwind và Swiper:

docs/ideations/sliders/from-soil-to-harvest/artifacts/step-slider-prototype.html
docs/ideations/sliders/from-soil-to-harvest/artifacts/step-slider-prototype-manual.html

Nếu file:// chặn CDN, phục vụ thư mục artifacts bằng một server tĩnh local rồi mở URL đó. Ghi URL đã mở. CDN lỗi thì ghi lỗi và mô tả phần chrome vẫn thấy.

Xem desktop khoảng 1200px trở lên, rồi kéo còn khoảng 390px. Mũi tên chỉ có ở bản manual.

## Xác nhận từng câu

Với mỗi câu: đúng như mô tả, hay artifact khác. Một câu chứng cứ (thấy gì trên màn).

1. Thanh bước. Kỳ vọng artifact: một thanh liền sát đáy, mỗi bước một cột bằng nhau, hai dòng gồm số 01 và nhãn. Không phải các pill rời.
2. Mũi tên lúc rộng khoảng 390px, bản manual. Kỳ vọng: cả hai nút lên góc trên trái, không còn một nút giữa mép trái và một nút giữa mép phải. Desktop của bản manual: hai nút giữa hai cạnh.
3. Nét mũi tên, bản manual. Kỳ vọng: nét SVG (chevron), không phải ký tự ‹ › và không phải font swiper-icons.
4. Cột chữ, cả hai bản. Kỳ vọng: cột hẹp bên trái, không trải hết chiều ngang khối, không có nút chuyển trái / giữa / phải.
5. Nền khi không có ảnh, và lớp phủ. Artifact không dùng ảnh thật. Kỳ vọng: nền là gradient khác nhau từng bước, có vân noise. Lớp phủ tối từ trái và từ đáy, không phải một màu rgba phủ kín. Ghi màu progress nếu thấy, nhưng không đề nghị lấy màu đó làm màu sản phẩm.

## Ghi vào mục mới

- URL hai bản, chiều ngang desktop và chiều ngang hẹp đã dùng
- Năm dòng, mỗi dòng: câu số, khớp hoặc lệch, một câu nhìn thấy
- Ảnh đã chụp: nói tên file nếu lưu ngoài repo, không nhúng

Không sửa CSS, JS, PHP. Không mở wp-admin.
```
