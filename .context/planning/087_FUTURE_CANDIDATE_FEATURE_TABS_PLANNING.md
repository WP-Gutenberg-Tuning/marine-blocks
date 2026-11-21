# Feature tabs — future candidate

Ngày: 2026-11-20.
Milestone: `none`. Chưa gán SemVer, chưa start, không phải scope của 1.3.24.
Current giữ **V1 / 1.3.24 — Fullscreen Step Slider**. File này không bump, không chuyển current, không sửa source.

Human 2026-11-20: note để làm sau. Không phải lệnh implement.

## Việc này là gì

Feature tour trên web: một hàng tab, mỗi tab một nhãn và một panel (ảnh, video hoặc mô tả), vạch dưới tab đầy theo thời gian rồi chuyển tab. Mẫu tham khảo: [Feature tabs](https://hairlineui.com/ui/feature-tabs). Đối chiếu đủ các dạng nằm ở [slide-vs-step-slide.md](../../docs/decisions/reports/slide-vs-step-slide.md).

Block `skvn-marine/feature-showcase` hiện có là panel ảnh ngang hoặc dọc, không phải feature tabs này.

## Chưa chốt

Có dùng lại `step-slide` hay không. Dữ liệu từng mục (nhãn, một panel, thời gian đứng) gần hợp đồng đó, nhưng bố cục là tour sản phẩm, không phải Step Slider toàn màn. Không nới `parent` của `step-slide` và không thêm variation trước khi human gán version và chọn hướng.

## Khi chưa có lệnh

Agent dựng demo không tạo block feature tabs, không biến Feature Showcase thành feature tabs, và không dùng Step Slider để đóng vai tour này. Demo "cách làm việc / từng bước" dùng hướng dẫn [step-slider-demo-usage.md](../../docs/workflows/step-slider-demo-usage.md).
