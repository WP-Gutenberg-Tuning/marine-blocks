# Step Slider fill preset — 1.3.24

Date: 2026-11-19
Status: ACTIVE
Milestone: V1 / 1.3.24
Lifecycle: active
Notes: Human chốt 2026-11-19 sau khi đánh giá sidebar Marine Blocks và bác quy tắc “cắt N màu đầu theo số slide”. Không bump metadata, không đổi current. ID trong plan 083: SS-SET-07. COL-02 (B) vẫn cấm một màu hex phẳng trên slider cha; decision này không mở lại hex đó. Human 2026-11-20 bác phần “step có ảnh thì tab giữ thanh tối” của SS-SET-06: ảnh ở trên slide, tab vẫn nhận preset.

## Quyết định

Preset nền của Step Slider là một danh sách màu có thứ tự, gán theo vòng `index % số màu`. Preset gốc tên **Deep Marine**, bốn radial hiện có trong `skvn_marine_blocks_get_step_default_fill_gradient()`. Không vẽ thêm màu thứ 5–8 cho Deep Marine.

Năm slide với Deep Marine dùng màu 1, 2, 3, 4, rồi 1. Quy tắc “5 slide lấy 5 màu đầu” bị bác.

## Hai bề mặt trong sidebar Marine Blocks

Sidebar là `PluginSidebar` `skvn-marine-design/design`.

| Tab | Việc |
|---|---|
| Plugin | Thư viện preset. Deep Marine hiện để xem, không sửa, không xóa, không ghi vào option. Khách thêm, đặt tên, sửa, xóa preset của họ. |
| Selected block | Khi block đang chọn là `skvn-marine/step-slider`, chỉ chọn preset cho block đó. Step slide chọn thì control nằm trên slider cha. |

Tab Selected block hôm nay chỉ nhận product collection, post collection và product category grid (`src/design-sidebar/index.tsx`). Step Slider rơi vào câu không có design control. Decision này thêm đúng control chọn preset, không đưa cả thư viện sang tab đó.

Nhãn UI tiếng Anh. Tên Deep Marine và tên khách đặt là dữ liệu hiển thị.

## Deep Marine

- Slug cố định: `deep-marine`.
- Bốn radial giữ nguyên chuỗi trong `modules/step-slider-render/step-slider-render.php` và bản editor `src/step-slide/default-fills.ts`. Hai bản phải giống nhau.
- Sống trong code. Không có hàng tương ứng trong option.
- Slider thiếu attribute, slug lạ, hoặc preset khách đã bị xóa: render Deep Marine.

## Preset của khách

Lưu một option toàn site (B1 bước 1: cấu hình ít, dùng chung, không có vòng đời bài viết).

- Tên option: `skvn_marine_blocks_step_fill_presets`.
- `autoload` = `false`. Chỉ đọc khi render Step Slider hoặc khi mở sidebar.
- Mỗi preset: slug ổn định, tên hiển thị, danh sách fill có thứ tự.
- Mỗi fill là màu hoặc gradient, cùng kiểu sanitize với custom fill của `step-slide`.
- Độ dài danh sách từ 1 đến 8. Trần 8 bằng `MAX_STEPS` trong `src/step-slider/edit.tsx`.
- Danh sách rỗng không được lưu. Nếu lọt vào option, coi như không có preset và slider dùng Deep Marine.
- Ô khách cố ý để trống vẫn là một slot trong danh sách. Không nén ô trống. Slide `index` lấy slot `index % L`. Slot trống lấy Deep Marine tại `index % 4`, không lưu màu xám.
- Ba gradient `theme.json` (`skvn-navy-deep`, `skvn-ocean`, `skvn-midnight`) không nhập vào thư viện.

Sửa hoặc xóa preset đổi mọi trang đang trỏ slug đó. Slug đã lưu trên trang không tự viết lại thành bốn chuỗi CSS.

## Gán màu

`index` là thứ tự step, bắt đầu từ 0. Danh sách lưu đủ slot, kể cả ô trống. Không nén ô trống trước khi chia. `L` là số slot đã lưu (1–8). Deep Marine có `L = 4` và không có ô trống.

Slide `index` lấy slot `index % L`.

| Trường hợp | Nền step và tab |
|---|---|
| Step có ảnh | Ảnh trên step. Tab vẫn nhận fill theo hàng bên dưới (preset, custom, hoặc transparent). Human 2026-11-20: không giữ thanh tối chỉ vì step có ảnh. |
| `backgroundFillMode` = `custom` | Fill trên chính step-slide. Đổi thứ tự step thì fill đi theo step. |
| `backgroundFillMode` = `transparent` | Không lớp fill, như hiện tại. |
| `backgroundFillMode` = `default`, slot có fill | Fill của slot `index % L`. |
| `backgroundFillMode` = `default`, slot trống | Deep Marine tại `index % 4`. Không dùng xám của thanh tab. |
| Preset không có fill nào, slug lạ, hoặc option hỏng | Cả slider dùng Deep Marine. |

Màu theo `index % n` đổi khi chèn, xóa hoặc sắp xếp lại step đang dùng default. Đó là hệ quả đã chấp nhận. Fill custom không bị kéo theo vì nó nằm trên step.

Xám của thanh tab không dùng làm nền step thiếu màu. Ảnh phân biệt step ở mặt slide, không phải ở màu tab.

## Attribute

Trên `skvn-marine/step-slider`:

- Tên: `fillPreset`
- Kiểu: chuỗi slug
- Mặc định khi thiếu: `deep-marine`

Không tái dùng attribute `preset` của Slider (hero/card). Hàng đó trong plan 083 vẫn Reject.

Không thêm attribute hex nền cho cả slider. COL-02 (B) giữ phần đó.

`overlayPreset` vẫn legacy, không UI (SS-SET-02).

## Trạng thái

Source implement 2026-11-19: option `skvn_marine_blocks_step_fill_presets`, module `modules/step-fill-presets/`, attribute `fillPreset`, context `skvn-marine/stepFillPreset`, thư viện và control ở sidebar Marine Blocks. Chưa build/runtime PASS; acceptance runtime chưa mở trong checklist 1.3.24 ngoài dòng trỏ tới decision này.
