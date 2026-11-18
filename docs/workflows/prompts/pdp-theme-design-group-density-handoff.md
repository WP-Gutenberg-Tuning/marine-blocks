# Handoff — Theme Design group “Product page” bớt khít

**Mode:** CODE_NOW. Human đã chọn hướng trong plan này. Không hỏi lại scope. Không bump version. Không sửa frontend sản phẩm.

**Milestone:** V1 / 1.3.22. Gắn evidence vào PDP-UX-01 (sidebar hẹp dùng được). Không thêm acceptance ID. Không đụng REL-* / plan076 ngoài việc class chung vô tình áp lên group `related`.

## Việc cần làm

Nhóm **Product page** trong sidebar **Marine Blocks → Plugin → Theme Design** là một danh sách phẳng: 7 select, 8 toggle, 2 nút, 1 dòng trạng thái. Trong sidebar hẹp (~280px) các control dính vào nhau. Sửa **cấu trúc nhìn** và **khoảng cách editor chrome**. Giữ nguyên key, thứ tự control, label, help, save/discard, dirty, conflict.

## Vì sao khít (đừng chẩn đoán lại)

Nguồn: `src/design-sidebar/theme-design.tsx`.

1. Mỗi group là một `PanelBody` title “Product page”, bên trong `<fieldset style={{ border: 0, padding: 0, margin: 0 }}>` và `<legend>` lặp lại đúng chuỗi đó. Legend đang hiện, nên tên nhóm xuất hiện hai lần.
2. 14 control là con trực tiếp của fieldset. Rule giãn cách của block inspector **không** áp vào `PluginSidebar`. Bộ component 40px (`is-next-40px-default-size` trên HTML human gửi) để `.components-base-control` gần như không có margin dưới. Tám `ToggleControl` thành một khối.
3. Label select viết hoa (COLUMNS, WIDTH) là CSS core `.components-input-control__label`, không phải chuỗi PHP/JS. Chuỗi nguồn vẫn là “Columns”. **Không** sửa `text-transform` của core.
4. Nút Save / Discard nằm trong fieldset, sát select cuối. `<p role="status">` nằm ngay sau fieldset.
5. Ảnh human: sidebar Marine Blocks, panel Product page đang mở, toggle xanh dính, select dính, “Unsaved site design draft” sát nút.

## Ngoài phạm vi

- Không đổi option, meta, sanitize, AJAX, contract `product`.
- Không thêm/bớt/đổi thứ tự control so với plan067 §19.
- Không CSS frontend `style.css`, không template Woo, không GeneratePress.
- Không đụng `src/product-design/panel.tsx` (panel từng sản phẩm trong document sidebar). Lượt này chỉ Theme Design trong PluginSidebar.
- Không hạ label select về sentence case. Không grid cột cố định (plan067: xếp dọc, sidebar hẹp).
- Không `overflow-x`, không `100vw`, không width cố định trên form.
- Không enqueue CSS này qua `editorStyle` / `build/style-index.ts.css`. Editor iframe không chứa PluginSidebar. CSS block style sẽ không tới panel này.

## Markup

File: `src/design-sidebar/theme-design.tsx`, fieldset khoảng dòng 305.

Mọi group (`palette`, `heading`, `fonts`, `product`, `related`):

- Thêm class `skvn-theme-design` lên `fieldset`.
- Bỏ inline `style` border/padding/margin. Đưa reset đó vào CSS class.
- Giữ `disabled={ ... }` y nguyên. Nút Save/Discard **ở trong** fieldset để còn bị disable cùng control.
- Legend giữ nguyên text `labels[group]`. CSS giấu mắt, không `display: none` (fieldset vẫn cần legend cho accessible name).

Chỉ group `product`, bọc control hiện có bằng ba `div`, **không đổi thứ tự**:

| Section `h3` | Controls |
|---|---|
| Layout | Columns, Column ratio (+ help hiện có), Width |
| Visibility | 8 toggle Show gallery → Show quote button |
| Type | Title size, Column gap, Specifications, Quote button style |

- `h3` tiếng Anh, text domain `skvn-marine-blocks`: `Layout`, `Visibility`, `Type`.
- Class: `skvn-theme-design__section` trên mỗi div. Div toggle thêm `skvn-theme-design__toggles`.
- Hai nút bọc trong `<div class="skvn-theme-design__actions">` vẫn **bên trong** fieldset, sau các section.
- `<p role="status">` giữ ngoài fieldset.

Group `related` đã có `h3` “Chip sources (allowlist)” và “Copy card settings”. Class fieldset chung sẽ giãn control. Không viết lại copy UI. Không thêm section Layout/Visibility cho related trong lượt này.

Palette / heading / fonts chỉ nhận class + legend ẩn + khoảng cách control. Không thêm heading mới.

## CSS

File mới: `wp-content/plugins/skvn-marine-blocks/assets/css/design-sidebar.css`.

Enqueue trong `skvn_marine_blocks_design_bootstrap()` (`modules/typography-settings/typography-settings.php`), hook sẵn `enqueue_block_editor_assets` (document editor cha, không iframe):

- Handle `skvn-marine-blocks-design-sidebar`.
- `wp_enqueue_style`, dependency `wp-components`, version `filemtime`.
- Chỉ enqueue khi file tồn tại.
- Không `wp_add_inline_style` cho cả file. Không gắn vào handle `skvn-marine-blocks-editor` (style đó đi theo block / iframe).

Rule, scoped `.skvn-theme-design` (sidebar plugin ~280px):

- Fieldset: `border: 0; padding: 0; margin: 0; min-width: 0`.
- Legend: clip 1px (visually hidden), vẫn đọc được.
- `.components-base-control`: `margin-bottom: 16px`. Control cuối trong section: margin dưới 0.
- `.skvn-theme-design__toggles .components-base-control`: `margin-bottom: 8px` (toggle dày hơn select, nhưng không dính).
- `h3` trong fieldset: 11px, weight 600, uppercase, `margin: 16px 0 8px`. Section đầu: margin-top 0.
- `.skvn-theme-design__actions`: `margin-top: 16px; padding-top: 12px; border-top: 1px solid #dcdcde;` (màu chrome WP admin, không token frontend). Cột dọc, `align-items: flex-start`, `gap: 4px`.
- Help “Ignored when columns are stacked.” giữ component help. Không style lại toàn bộ `.components-base-control__help` của editor.
- Không `!important`. Không đụng `.components-input-control__label`.

## Kiểm

- Save group, discard, dirty “Unsaved site design draft”, conflict table, disabled khi không `canEdit`: hành vi cũ.
- Palette / fonts vẫn save được.
- Sidebar ~280px: không scrollbar ngang, label toggle không tràn ra khỏi panel.
- Legend không thấy; panel header vẫn “Product page”.
- Ba heading Layout / Visibility / Type chỉ ở group product.
- Related vẫn mở, owner toggle và copy vẫn bấm được; chỉ giãn hơn.

Human build vì `theme-design.tsx` đổi (CSS `filemtime` không đủ nếu chưa build JS):

```bash
source /home/shinkuro/.nvm/nvm.sh && nvm use 20 && cd /mnt/d/Github/skvn-marine/wp-content/plugins/skvn-marine-blocks && npm run build && find modules/ -name "*.php" -exec php -l {} \;
```

Agent không tự chạy build/lint. Sau build, upload plugin rồi hard refresh post editor. Evidence: một ảnh panel Product page mở, rộng sidebar mặc định.

## File được sửa

- `src/design-sidebar/theme-design.tsx`
- `modules/typography-settings/typography-settings.php` (enqueue)
- `assets/css/design-sidebar.css` (mới)

Cấm: `themes/generatepress/**`, `style.css` theme, `src/product-design/**`, option/meta keys.
