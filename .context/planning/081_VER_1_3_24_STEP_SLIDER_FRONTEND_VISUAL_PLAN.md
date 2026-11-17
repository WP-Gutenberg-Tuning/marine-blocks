# V1 / 1.3.24 — Step Slider frontend visual

Ngày: **2026-11-16**. Human: mặt đang thấy vừa lệch vừa xấu so với giao diện đã thống nhất. Plan này chỉ mô tả việc sơn lại. Không code, không đụng editor.

Độc lập với [082](082_VER_1_3_24_STEP_SLIDER_EDITOR_UI_PLAN.md). Làm trước hay sau đều được.

## Giao diện đã thống nhất

Contract [018](018_VERSION_1_3_10_FULLSCREEN_STEP_SLIDER_PLANNING.md) và khóa [079](079_VER_1_3_24_FULLSCREEN_STEP_SLIDER_EXECUTION_PLAN.md) §8, §9a, §10a.

Human 2026-11-17: soi mặt trang web lấy artifact làm trung tâm. Delta đã ghi tại `docs/testing/step-slider-frontend-visual-delta.md`. O09, O10, mũi tên và số §8 vẫn khóa — không kéo source về đúng từng dòng artifact. Cùng ngày, O02-H: chiều cao giữ `100svh`. Không sơn trừ header. Việc đó chờ theme tách khỏi GeneratePress.

Bản đó là một bước fullscreen: ảnh cover, chữ đọc được khi thiếu ảnh, tab ở đáy khối, progress chỉ trên tab đang mở, mũi tên hai bên, Play chỉ sau khi focus dừng autoplay. Fade, wipe, cascade và các số 800 / 400 / 0 / 100 / 200 / 300 giữ nguyên.

`src/step-slider/style.css` hiện là sơn khởi đầu, chưa được duyệt. Màu navy `#101f30`, pill trắng, nút tròn và chữ `‹ ›` không nằm trong contract.

## Lệch

| Chỗ | Contract | Đang vẽ |
|---|---|---|
| Progress | Phần trăm dwell của tab đang mở, đọc được | Gạch 2px dưới chữ trong pill |
| Play | Nút có nhãn `Play`, ẩn đến khi focus dừng | Hình tròn 2.75rem, chữ 0.8rem, góc phải trên, cùng cỡ mũi tên |
| Tab | Nhãn đọc được, cuộn ngang, không đổi bước khi cuộn | Pill kính mờ, chưa có kiểu step/timeline |
| Ảnh và chữ | Cover, overlay theo vùng chữ, thiếu ảnh vẫn đọc được | Nền đặc một màu, chữ căn giữa, overlay chỉ là lớp rgba |
| Tab khi bước dài | Ở cuối khối bước, không dính viewport | Đúng §9a. Không được “sửa lệch” bằng `fixed`, `100vw` hay margin âm |

## Xấu

- Một màu nền cho khối không ảnh, pill, mũi tên và Play. Không lấy từ token theme hay mặt Slider đang dùng.
- Chữ `Play` không nằm gọn trong vòng tròn.
- Tab active đảo nền sáng, progress dùng `currentColor` nên vạch chìm vào pill.
- Mũi tên là ký tự `‹ ›`, không cùng ngôn ngữ với nút Slider.

## Khi được lệnh code

Chỉ `wp-content/plugins/skvn-marine-blocks/src/step-slider/style.css`.

Nút Play được đổi hình trong `modules/step-slider-render/step-slider-render.php` nếu nhãn không còn nằm trong control. Vẫn là `<button>` anh em của `.swiper`, vẫn `hidden`, nhãn `Play`. Không đổi `frontend.ts`.

Không sửa editor, `block.json`, số §8, vị trí tab §9a, schema, Inspector. Không thêm màu raw cho người dùng. Không mở Ken Burns, O08-E, focal, overlay, text surface, text position.

Trước khi sửa màu, human chọn một ảnh Slider frontend đang có làm họ hàng sơn. Không lấy prototype. Không tự đặt bảng màu mới trong plan này.

## Ngoài plan

Hai lỗi hành vi đã thấy khi review code, không sửa bằng CSS:

- Loop bật mà tab gọi `slideTo(index)` thay vì `slideToLoop`.
- Click Play bằng chuột bị hover của root `pause()` ngay trong cùng lượt.

## Xong khi

Ảnh desktop và mobile, có ảnh và không ảnh: tab đọc được, progress thấy trên tab đang mở, Play đọc được nhãn, mũi tên không đè tab, không tràn ngang. Print vẫn ẩn tab, mũi tên và Play. Human nhìn still và chấp nhận trước khi coi là sơn chuẩn.
