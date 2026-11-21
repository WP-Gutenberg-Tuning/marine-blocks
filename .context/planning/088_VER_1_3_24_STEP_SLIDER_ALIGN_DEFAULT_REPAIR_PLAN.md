# V1 / 1.3.24 — Step Slider: trả default align về full

Ngày: **2026-11-21**.
Status: **SOURCE DONE — bài đã lưu chờ human**.
Current pointer giữ **V1 / 1.3.24 — Fullscreen Step Slider**.
Không bump metadata. Không commit trừ khi human lệnh.

Human 2026-11-21 chọn **hướng 2** trong ba hướng sửa width trang chính.

## Context

Commit `b80df40` đặt `align.default` là `"full"`. Ngày 2026-11-20, lúc làm chrome editor, default bị đổi thành `"wide"` để thẻ editor cùng bề ngang Hero Slider. Đổi đó chưa commit. Bản build trên minhhaifishery.com đã có `"default": "wide"`.

Trang https://minhhaifishery.com/test-page-2/ render `class="skvn-step-slider alignwide"`, rộng 1200px, `x = 0`, trên hàng nội dung 1905px.

Ba rule cùng lúc:

| Việc | Owner |
|---|---|
| Class `alignwide` | `block.json` default, rồi `get_block_wrapper_attributes()` |
| `max-width: 1200px` | Theme `.skvn-full-width-canvas .entry-content > .alignwide` (`--skvn-wide-width`) |
| `margin-left: 0` | GeneratePress `.full-width-content .entry-content .alignwide` |

Rule full-bleed của plugin chỉ khớp `.alignfull`. Wide là token 1200px của theme. Đổi default không phải lỗi GeneratePress. GeneratePress chỉ làm khối 1200px dính trái.

## Hướng đã chọn

Default `align` trả về `"full"`. Bài đã lưu `align: wide` trong lúc default sai được đặt lại Full trên toolbar rồi Update.

`align` giữ một nghĩa: content, wide 1200px, full bằng canvas. CSS plugin không ép Step Slider full hàng khi attribute là wide. Chiều ngang thẻ editor vẫn là padding của `.skvn-step-slider--editor`, không ghi vào attribute `align`.

Hai hướng kia không làm:

- Chỉ trả default, không sửa bài đã lưu: bài đã Update lúc default là `wide` tiếp tục 1200px.
- Giữ `wide` và viết CSS full hàng: toolbar Wide và Full hết tác dụng. Rule đó còn sau khi bỏ GeneratePress.

## Source đã sửa

| File | Việc |
|---|---|
| `src/step-slider/block.json` | `"default": "full"` |
| `086_VER_1_3_24_STEP_SLIDER_EDITOR_STAGE_EXECUTION_PLAN.md` | Bỏ câu default `wide`; trỏ về plan này |

Không sửa `save.tsx`, `style.css`, `editor.css`, PHP render. `save` không đổi nên không thêm `deprecated`. Block đã lưu `align: "full"` hoặc `align: "wide"` giữ đúng giá trị đó. Block không có khóa `align` dùng default `full` sau khi bản build mới được nạp.

## Bài đã lưu — human

Sau khi build và đưa plugin lên site:

1. Mở editor của https://minhhaifishery.com/test-page-2/.
2. Chọn Step Slider. Toolbar đang Wide thì chọn **Full width**, rồi Update.
3. Bài khác đã lưu trong lúc bản build còn `"default": "wide"` làm cùng một bước nếu toolbar đang Wide và người sửa không cố ý chọn Wide.

Block không có khóa `align` trong nội dung đã lưu tự về full sau bản build mới, không cần Update.

## Kiểm

- `src/step-slider/block.json` và `build/step-slider/block.json` trên site đều `"default": "full"`.
- test-page-2: root Step Slider có `alignfull`, rộng bằng hàng nội dung, `margin-left` và `margin-right` là 0.
- Một block cố ý để Wide vẫn 1200px. Full và Wide vẫn khác nhau.
