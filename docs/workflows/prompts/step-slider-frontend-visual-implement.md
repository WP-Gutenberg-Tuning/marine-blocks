# Prompt — làm hoàn chỉnh lần sơn Step Slider

Copy từ dòng `Bạn làm việc` đến hết. Đây là lệnh code. Spec là plan 081, không phải chat.

```text
Bạn làm việc trong D:\Github\skvn-marine.

Human đã lệnh làm. Lần này code hết lần sơn Step Slider theo đúng một spec:

.context/planning/081_VER_1_3_24_STEP_SLIDER_FRONTEND_VISUAL_PLAN.md

Đọc hết file đó, mục Cấm trước, rồi mục Việc, rồi danh sách file. Làm đủ mười việc trong mục Việc. Dừng đúng mục Cấm. Không chọn lại màu, chiều cao, focus, hay mặt vẽ.

Nếu plan 079, bản cũ của 081, hoặc artifact HTML nói khác 081: 081 thắng cho những việc trong mục Việc. Không thêm chi tiết từ prototype. Không làm plan 082.

## Trước khi sửa

Đọc:

- 081, hết.
- .context/planning/018_VERSION_1_3_10_FULLSCREEN_STEP_SLIDER_PLANNING.md hàng O02-C, O02-H, O03, O09, O10.
- src/slide/focal.ts
- src/slide/fill.ts
- src/slide/edit.tsx phần Fill và FocalPointPicker
- modules/slider-render/slider-render.php các hàm normalize/sanitize focal và fill. Gọi chúng. Không copy thân hàm.

pauseOnHover đã có. Không viết lại, không đổi default.

## Làm

Theo đúng thứ tự mục Việc của 081: thanh bước, mũi tên, Play, cột chữ, bốn gradient gốc, fill default/custom/transparent, overlay, màu progress, heightMode, FocalPointPicker.

File chỉ được nằm trong danh sách “File được sửa khi có lệnh code” của 081. Không sửa src/slider/**, src/slide/focal.ts, src/slide/fill.ts, themes/generatepress/**. Không tách sang src/shared/.

Hex chỉ #RGB hoặc #RRGGBB sau sanitize. Gradient tự nhập đi đường sanitize sẵn của Slider. Giá trị hỏng thì bỏ, dùng default.

Nhãn editor tiếng Anh, text domain skvn-marine-blocks.

## Xong

Tự đối chiếu mục “Xong khi” của 081. Việc nào chưa làm thì làm tiếp, không báo xong khi còn thiếu.

Cuối reply, đưa nguyên lệnh này để human tự chạy. Không tự chạy build hay lint:

source /home/shinkuro/.nvm/nvm.sh && nvm use 20 && cd /mnt/d/Github/skvn-marine/wp-content/plugins/skvn-marine-blocks && npm run build && find modules/ -name "*.php" -exec php -l {} \;

Không commit trừ khi human bảo commit.
```
