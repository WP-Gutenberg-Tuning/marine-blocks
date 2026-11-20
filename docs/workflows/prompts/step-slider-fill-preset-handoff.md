# Prompt — Step Slider fill preset (SS-SET-07)

Ngày: **2026-11-19**. Contract đã chốt. Copy khối `text` sang agent coding.

Human giao prompt này = **CODE_NOW**. Không hỏi lại “có implement không?”, không viết plan mới, không đổi decision. Không bump metadata, không zip/deploy, không git push, không `npm run build` / lint, không commit trừ khi human lệnh. Không kết luận runtime PASS.

```text
Bạn làm việc trong D:\Github\skvn-marine.

Nhiệm vụ: CODE_NOW implement SS-SET-07, đúng decision, không sáng tác thêm. Không đụng chrome slider (chiều cao, header, vạch tab, nút play, mask, offset). Những thứ đó đang nằm cùng file; chỉ vá đúng đường preset.

Source of truth, đọc trước khi sửa:
docs/decisions/sliders/step-slider/step-slider-fill-preset-1.3.24.md

Chỉ mục ngắn trong plan, không đọc lại cả plan để đổi scope:
.context/planning/083_VER_1_3_24_STEP_SLIDER_SETTINGS_PARITY_PLAN.md — hàng SS-SET-07

Đọc AGENTS.md trước; load GLOBAL → MILESTONES → toàn TENSIONS_OPEN → TENSIONS_ACTIVE. Convention: L0 + hàng “Thêm setting màu” (A5.4, A5.5, A6) + B1 (option) + C3 (ajax/capability/sanitize). Ghi khối "Đã đọc" khi giao code. Không đọc hết CONVENTION.md.

Current: V1 / 1.3.24. Giữ current và metadata. Không archive tension. Không sửa themes/generatepress/**. Không sửa theme.json.

## Đã khóa

- Deep Marine: slug deep-marine, bốn chuỗi radial hiện có. Không thêm màu thứ 5–8. Không đổi chuỗi. Không ghi Deep Marine vào option.
- Bốn chuỗi chỉ sống ở hai chỗ đã có: skvn_marine_blocks_get_step_default_fill_gradient() và src/step-slide/default-fills.ts. Cấm bản sao thứ ba.
- Preset khách: option skvn_marine_blocks_step_fill_presets, autoload false. Mỗi preset: slug, tên, mảng slot 1–8. Slot là chuỗi fill hoặc rỗng. Danh sách không có fill nào thì không lưu.
- Không nén ô trống. L = số slot đã lưu. Slide index (0-based) lấy slot index % L. Slot có fill thì dùng fill. Slot rỗng thì Deep Marine tại index % 4. Không dùng rgba(4, 12, 20, 0.62) làm nền step.
- Slider cha chỉ lưu attribute fillPreset (string slug). Thiếu attribute, slug lạ, preset đã xóa, option hỏng: Deep Marine. Không ghi CSS đã giải vào attribute step, không ghi vào save.tsx.
- Step có ảnh: ảnh trên step, tab không nhận fill preset (SS-SET-06). backgroundFillMode custom: fill của step, đi theo step khi sắp xếp. transparent: không lớp fill.
- Cấm “5 slide lấy 5 màu đầu”. Cấm hex nền một màu cho cả slider (COL-02). Cấm attribute preset của Slider hero/card. Cấm đụng overlayPreset. Cấm nhập gradient theme.json skvn-navy-deep / skvn-ocean / skvn-midnight.
- UI tiếng Anh, text domain skvn-marine-blocks.

Bảng khóa, resolver phải ra đúng các dòng này:

Deep Marine, L = 4. Slide 0..4 → radial 0, 1, 2, 3, 0.
Preset khách ["#111111", "", "#333333"], L = 3.
- slide 0 → #111111
- slide 1 → Deep Marine radial 1 (1 % 4)
- slide 2 → #333333
- slide 3 → #111111
- slide 4 → Deep Marine radial 0 (4 % 4)
Slide có ảnh → không inline fill từ preset trên tab.
Slide custom → fill của step, bỏ qua preset.
Slide transparent, không ảnh → không lớp fill.

## Việc làm, đúng thứ tự

1. Một hàm PHP và một hàm TS cùng quy tắc bảng trên. PHP gọi skvn_marine_blocks_sanitize_slide_fill_background() cho fill khách (modules/slider-render/slider-render.php). TS không bịa sanitizer thứ hai cho editor; chuỗi đã lưu chỉ để vẽ. Sanitize tại lúc ghi option.
2. Gắn vào hai chỗ render đang gọi gradient gốc: skvn_marine_blocks_step_tab_fill_background() và nền step trong step-slider-render.php (khoảng dòng gọi get_step_default_fill_gradient). Parent truyền fillPreset. Child dynamic nhận qua block context, không dùng global, không đi tìm parent trong DOM.
3. block.json parent: attribute fillPreset default "deep-marine", providesContext sang step-slide. step-slide block.json usesContext. edit.tsx của step-slide đổi chỗ đang lấy STEP_DEFAULT_FILLS[index] sang resolver + context. Thiếu context thì Deep Marine. Không sửa save.tsx.
4. Module PHP mới modules/step-fill-presets/step-fill-presets.php, require một dòng trong skvn-marine-blocks.php. register_setting, autoload false, sanitize_callback. AJAX riêng, không nhét vào action skvn_marine_design_settings. Nonce riêng. Đọc: user sửa được post/page. Ghi/xóa: manage_options, kiểm lại trên server. Slug = sanitize_title, unique, cấm trùng deep-marine. Xóa preset không viết lại nội dung trang.
5. Sidebar hiện có src/design-sidebar/index.tsx, PluginSidebar name "design". Không tạo PluginSidebar thứ hai.
   - Tab Plugin: thư viện. Deep Marine hiện, không sửa, không xóa. Khách thêm / đổi tên / sửa slot / xóa. User không có manage_options thì danh sách chỉ đọc.
   - Tab Selected block: khi block chọn là skvn-marine/step-slider, hoặc step-slide thì ghi lên cha, một SelectControl chọn preset. Không nhét form thư viện vào tab này.
   Nhãn: "Step fill presets", "Deep Marine", "Add preset", "Preset name", "Fill preset". Help select: "Steps without an image cycle through this preset. Steps with an image keep the dark tab."

## File được sửa

- skvn-marine-blocks.php (một require)
- modules/step-fill-presets/step-fill-presets.php (mới)
- modules/step-slider-render/step-slider-render.php (chỉ đường resolver và context)
- src/step-slider/block.json
- src/step-slide/block.json
- src/step-slide/edit.tsx (chỉ chỗ resolve fill default)
- src/step-slide/fill-preset.ts (mới, hàm thuần; import STEP_DEFAULT_FILLS, không copy chuỗi)
- src/design-sidebar/index.tsx
- src/design-sidebar/step-fill-presets.tsx (mới)

Cấm: style.css trừ khi một selector hiện có che inline background (nếu gặp thì dừng và nói selector), save.tsx, deprecated.tsx, src/slider/**, src/slide/fill.ts, theme, GeneratePress, plan 083 ngoài một dòng “đã có source” nếu human không cấm docs. Không revert showPlayButton, --skvn-step-slider-offset, border/mask tab, hay thanh tối của step có ảnh.

## Dừng và hỏi khi

- save.tsx hoặc deprecated bắt buộc đổi thì block đã lưu sẽ invalid.
- Cần file ngoài list.
- Hai hàm resolver không ra đúng bảng khóa.
- Muốn nén ô trống, cắt N màu đầu, hoặc đổ xám tab cho step không ảnh.

Không dừng để hỏi lại: tên option, slug deep-marine, autoload false, attribute fillPreset, hai tab sidebar, tiếng Anh, không hex parent.

## Xong thì báo

- File đã sửa.
- Đi từng dòng bảng khóa và ghi hàm nào trả giá trị đó.
- Source only. Không PASS runtime.
- Lệnh để human tự chạy, nguyên văn, agent không chạy:

source /home/shinkuro/.nvm/nvm.sh && nvm use 20 && cd /mnt/d/Github/skvn-marine/wp-content/plugins/skvn-marine-blocks && npm run build && find modules/ -name "*.php" -exec php -l {} \;

File PHP mới nằm trong modules/ nên zip plugin phải chứa nó. Agent không tự zip.
```
