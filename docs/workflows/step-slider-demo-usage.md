# Hướng dẫn dựng demo — How it works / process spotlight

Dành cho agent khi dựng trang demo. Không phải acceptance, không phải lệnh sửa block.

Ngày: 2026-11-20. Human: mục **How it works / process spotlight** trên demo dùng Step Slider đã có.

## Khi nào dùng

Section kể một quy trình ngắn, khách xem từng bước một. Dấu hiệu trên mẫu hoặc ảnh:

- Khoảng 3 đến 6 bước có tên (Sourcing, Processing, Packing).
- Một khung lớn. Bước đang chọn chiếm khung. Các bước khác không nằm cạnh nhau thành hàng thẻ.
- Dưới hoặc trên khung là nhãn từng bước, có thể kèm số và vạch chạy hết thời gian đứng rồi sang bước sau.

Block: `skvn-marine/step-slider`. Mỗi bước: `skvn-marine/step-slide`.

Mẫu web cùng hợp đồng: [Process Spotlight](https://reactframe.com/components/process-spotlight), [Process Section](https://www.framer.com/marketplace/components/process-section/). Bảng các dạng khác: [slide-vs-step-slide.md](../decisions/reports/slide-vs-step-slide.md).

## Cách dựng

1. Chèn Step Slider. Giữ autoplay bật nếu demo cần tự chạy. Thời gian đứng mặc định là 8 giây. Trần editor là 8 bước. Demo nên dừng ở 4 đến 6 bước.
2. Mỗi bước điền `tabLabel` bằng tên khách đọc trên thanh bước. Chuỗi giao diện để tiếng Anh.
3. Trong bước chỉ dùng heading, paragraph, list, buttons. Ảnh của bước là ảnh nền của `step-slide`, không phải block `core/image`.
4. Không chèn columns, group, form, hay một slider khác vào trong bước.

## Không dùng block này cho

| Việc trên demo | Dùng |
|---|---|
| Banner, chiến dịch, một thông điệp và nút | Hero Slider (`skvn-marine/slider`, preset `hero`) |
| Hàng thẻ sản phẩm hoặc ảnh | Card Carousel, hoặc collection carousel |
| Panel ảnh mở ngang hoặc dọc | Feature Showcase |
| Tour tính năng: tab nhãn, panel ảnh hoặc video, vạch chạy | Chưa có block. Ghi ở [087](../../.context/planning/087_FUTURE_CANDIDATE_FEATURE_TABS_PLANNING.md). Không lấy Step Slider tạm thay |
| Form nhiều bước, thanh toán | Không dựng bằng slider |

Không tạo block mới để khớp pixel của một prototype process. Step Slider là block của mục này.
