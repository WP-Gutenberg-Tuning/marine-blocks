# V1 / 1.3.22 — Product Page Basic Design Controls

2026-11-12. **Current từ 2026-11-13** — human “Đã xong toàn phần 1.3.21” + “Chuyển sang 1.3.22 ngay” đã mở khoá plan này. Đây là execution plan PDP-TRACE-01; implementation **Chưa làm**, chưa có runtime evidence.

**2026-11-13:** §12–20 là hợp đồng implement cho agent cửa sổ ngắn. §1–11 giữ quyết định. Khi hai chỗ lệch, làm theo §12–20.

Đọc trước khi code: AGENTS → MILESTONES §1.3.22 → plan này, đúng một gói §16–20 → `docs/standards/css-layout-safety-contract.md` và `docs/standards/security-guidelines.md` nếu gói đụng CSS hoặc option/meta. Không mở Post 1.3.23, archive builder, woo-catalog 1.5.0, Sidebar 054. Không `npm run build`, không lint, không commit trừ khi human yêu cầu.

## 1. Đã có — giữ, không viết lại

| Việc 1.3.5 | Source hiện tại | 1.3.22 làm gì |
|---|---|---|
| Gallery trái, summary phải, tab full width | `style.css:3505–3525` grid `1fr 1fr`, gap `3rem` / `2.5rem`, max-width `--skvn-wide-width` | Chỉ thêm class body để đổi cột/tỷ lệ. Không tạo wrapper thứ hai. |
| Mobile một cột | `style.css:4365` `@media (max-width: 900px)` | Mọi ratio/preset phải thua query này. Không thêm breakpoint mới. |
| Ẩn sidebar GP, content full width | `style.css:3527–3545` | Không đụng. |
| Gallery/summary bỏ float Woo | `style.css:3547–3563` | Giữ. Rule `.product-images-summary-wrap:3566` không có PHP tạo wrap — đừng dựa vào class đó. |
| CTA báo giá thay add to cart | `inc/woocommerce.php:93–147` `skvn_marine_woocommerce_replace_single_product_cta` / `skvn_marine_woocommerce_single_quote_cta` | Giữ URL `skvn_marine_get_product_quote_url`. Tắt CTA chỉ không render khối, không đổi hàm URL. |
| Reviews gỡ, 4 tab SKVN | `inc/woocommerce.php:155` | Tắt tabs = không in `.woocommerce-tabs`, không trả lại tab Reviews. |
| Placeholder, trust | placeholder filter + trust trong CTA zone | Tắt trust chỉ ẩn `.skvn-product-trust`. |
| Tiêu đề không vỡ cột | `style.css:3727` `clamp(1.25rem, 3vw, 1.75rem)` | `titleScale=current` giữ nguyên rule này. |

Checklist 1.3.5 giữ nguyên, không đánh dấu completed.

## 2. Owner

| Dữ liệu | Nơi lưu | Ai ghi | Ai đọc lúc render |
|---|---|---|---|
| Mặc định cả site | option `skvn_product_design` | Plugin, nhóm Theme Design `product`, capability `manage_options` | Theme |
| Override một sản phẩm | post meta `_skvn_product_design` | Plugin, panel editor sản phẩm, capability `edit_post` | Theme |
| Palette / heading / fonts | option `skvn_typography` và theme_mod font, như hiện tại | Không ghi từ nhóm product | Không đổi |

Không nhét product vào `skvn_typography`. `skvn_marine_blocks_sanitize_typography()` chỉ biết palette/heading.

Page Save của sản phẩm ghi meta. Save group Theme Design ghi option. Hai request không gọi nhau. Save một tầng lỗi thì tầng kia giữ giá trị cũ.

Thiếu option, meta rỗng, JSON hỏng, hoặc WooCommerce không có: dùng bảng default §3. Không fatal.

## 3. Schema — một shape cho cả hai tầng

Mọi key luôn có sau sanitize. Giá trị lạ về default của key đó, không hủy cả mảng.

| Key | Allowlist | Default = trang hiện tại |
|---|---|---|
| `columns` | `gallery-left`, `gallery-right`, `stacked` | `gallery-left` |
| `ratio` | `1-1`, `3-2`, `2-3` | `1-1`. Bỏ qua khi `columns=stacked` |
| `width` | `wide`, `content` | `wide` → `var(--skvn-wide-width)`. `content` → `var(--skvn-content-width)` (`style.css:71–72`, 1200px / 760px) |
| `showGallery` `showPrice` `showExcerpt` `showMeta` `showTabs` `showTrust` `showContact` `showQuote` | bool | `true` |
| `titleScale` | `current`, `h2`, `h3`, `h4` | `current`. Khác current thì `font-size/weight: var(--skvn-h2-size)` và cặp weight, biến đã in ở `inc/typography.php:109` |
| `summaryGap` | `current`, `tight`, `loose` | `current` = column-gap `3rem`. `tight` = `1.5rem`. `loose` = `4rem`. Không nhận px tự gõ |
| `specs` | `default`, `compact` | `default` |
| `ctaStyle` | `current`, `primary` | `current`. Chi tiết class ở §6 và §17 |

Meta sản phẩm thêm một key:

| Key | Ý nghĩa |
|---|---|
| `override` | `false` hoặc meta không tồn tại: bỏ mọi key còn lại, dùng option site. `true`: dùng bản sanitize của meta, key thiếu lấy default §3 chứ không lấy từng key từ site |

Use default và Reset đều ghi `{ "override": false }`. Không `delete_post_meta` từ UI, để Save/Undo của editor còn thấy giá trị.

## 4. Resolve

`skvn_marine_get_product_design( $product_id )` trong theme `inc/product-design.php`:

1. Đọc option, sanitize thành `$site`.
2. Nếu không có product ID hoặc meta không phải array hoặc `override` không phải true: trả `$site`.
3. Nếu override: sanitize meta. Key thiếu dùng default §3, không fallback từng key sang `$site`.

Plugin có bản sanitize cùng allowlist. Comment “keep in sync” ở cả hai, giống `skvn_marine_blocks_get_default_typography()` và `skvn_marine_get_default_typography()`.

Gắn class trên `body` chỉ khi `is_product()`:

```text
skvn-pdp
skvn-pdp-columns-{columns}
skvn-pdp-ratio-{ratio}
skvn-pdp-width-{width}
skvn-pdp-title-{titleScale}
skvn-pdp-gap-{summaryGap}
skvn-pdp-specs-{specs}
skvn-pdp-hide-gallery|price|excerpt|meta|tabs|trust|contact|quote
```

Chỉ in class `hide-*` khi bool là false. `skvn-pdp-cta-primary` khi `showQuote` và cần style primary — xem §6.

## 5. CSS — sửa rule đang có, không layout mới

File: `wp-content/themes/skvn-marine/style.css`, cạnh block 3505. Width owner vẫn là `.woocommerce div.product`. Không `100vw`, không margin âm, không `overflow-x` để che tràn.

Desktop, sau rule 1fr 1fr hiện tại:

- `.skvn-pdp-ratio-3-2` → `grid-template-columns: minmax(0,3fr) minmax(0,2fr)`
- `.skvn-pdp-ratio-2-3` → `minmax(0,2fr) minmax(0,3fr)`
- `.skvn-pdp-columns-gallery-right` → `.images { order: 2 }`, `.summary { order: 1 }`. Cột ratio không đảo số, vì order đã đổi phía mắt.
- `.skvn-pdp-columns-stacked` → `grid-template-columns: minmax(0,1fr)`
- `.skvn-pdp-width-content` → `max-width: var(--skvn-content-width)`
- `.skvn-pdp-gap-tight` / `loose` đổi `column-gap` của `.woocommerce div.product`
- `.skvn-pdp-hide-gallery .images`, hide-price `.price`, hide-excerpt `.woocommerce-product-details__short-description`, hide-meta `.product_meta`, hide-tabs `.woocommerce-tabs`, hide-trust `.skvn-product-trust`, hide-contact `.skvn-product-cta-secondary`, hide-quote `.skvn-product-cta-primary` và `.skvn-product-cta-note`: `display: none`
- Hide gallery thì grid về `minmax(0,1fr)` để summary không nằm nửa cột trống
- `.skvn-pdp-title-h2 .product_title` dùng biến heading; tương tự h3/h4. `current` không có rule mới
- `.skvn-pdp-specs-compact .skvn-tab-product-info__specs table td/th`: padding nhỏ hơn rule table đang có. Không đổi nội dung `wc_display_product_attributes`

Trong `@media (max-width: 900px)` đã có ở 4365, viết lại một lần:

- `.woocommerce div.product` vẫn `1fr`, kể cả ratio 3-2 / 2-3 / gallery-right
- `order` của images và summary về `0` để mobile luôn gallery rồi summary
- Trust grid 3 cột nếu chật thì `1fr` dưới 600px, rule hiện có nếu đã vậy thì giữ

`prefers-reduced-motion` của CTA giữ nguyên.

## 6. PHP render

`inc/woocommerce.php` không đổi chữ CTA, không đổi tab callback, không đổi quote URL.

- `showQuote` false: `skvn_marine_woocommerce_single_quote_cta` không in primary + note. Hàm URL không gọi cũng được.
- `showContact` false: không in secondary. Có thể vẫn in zone nếu trust hoặc quote bật.
- `showTrust` false: không in `.skvn-product-trust`.
- Cả ba tắt: không in `.skvn-product-cta-zone`.
- `titleScale` không đụng copy tiêu đề. CSS lo.
- Tabs: filter `woocommerce_product_tabs` khi `showTabs` false trả `array()` sau các unset hiện có. Không add lại reviews.

CTA style: default giữ class `skvn-product-cta-primary`. Giá trị thêm trong schema là không có — milestone nói style CTA theo token. Làm đúng một bước: khi site hoặc override chọn `ctaStyle=primary` (thêm key này vào §3, allowlist `current|primary`, default `current`), thêm class `skvn-button skvn-button--primary` cạnh class cũ. `style.css:182` đã style `.skvn-button--primary:not(.wp-block-button)`. Không viết màu hex mới.

`ctaStyle` là key thứ 14. Default `current`.

Enqueue: không JS frontend. Không CSS file mới.

WooCommerce class không tồn tại: không add body class, không gọi template Woo.

## 7. Plugin — mặc định site

Sửa nhóm Theme Design đang có, không sidebar mới. **Không** thêm `'product'` vào allowlist rồi để `skvn_marine_blocks_design_save_group()` ghi vào `skvn_typography`. Hàm đó đang gán mọi group khác `fonts` vào option typography và gọi `skvn_marine_blocks_sanitize_typography()`. Làm đúng nhánh ở §14 và §18.

| File | Việc |
|---|---|
| `modules/typography-settings/typography-settings.php` | Allowlist group thêm `product` tại check save ~202. Snapshot thêm group, value từ option `skvn_product_design`, revision bằng `skvn_marine_blocks_design_revision()`. Capability `manage_options`. Save chỉ merge group `product`, so revision như palette. Không ghi `skvn_typography`. |
| `src/design-sidebar/theme-design.tsx` | `Group` thêm `'product'`. Panel select/toggle cho đủ key §3 + `ctaStyle`. Label tiếng Anh. Không ô hex, không number px. |
| `inc/customizer.php` `skvn_marine_design_sidebar_contract()` | Thêm capability `product`. Giữ `version => 1` vì check plugin là “có đủ capability”, `array_diff` sẽ fail cho đến khi theme kèm capability — hai file cùng lượt. |

Nếu contract chưa có `product`, group hiện “không save được với theme này”, draft giữ, palette/heading/fonts vẫn save. Không chặn cả Theme Design.

Conflict revision và Discard giữ UI đang có trong `theme-design.tsx`.

## 8. Plugin — từng sản phẩm

Sản phẩm Woo không phải block SKVN. Không nhét control này vào Selected block của collection.

| File | Việc |
|---|---|
| Module PHP mới `modules/product-design/product-design.php`, require từ file plugin chính đã require các module | `register_post_meta( 'product', '_skvn_product_design', show_in_rest, auth_callback edit_post, single, type object )`. Schema REST khớp §3 cộng `override`. Sanitize lúc đăng ký. |
| `src/product-design/panel.tsx`, đăng ký từ `src/index.ts` | `PluginDocumentSettingPanel` chỉ `post type === product`. `useEntityProp` meta. Toggle Override. Tắt override thì control còn lại disabled và ghi chú “Using the site default”. Nút Use site default đặt `override: false`. Không nút save riêng: dirty đi theo Save/Update của sản phẩm, Undo của editor. |
| Classic editor, `use_block_editor_for_post_type( 'product' )` false | Một meta box, cùng field, cùng meta key, nonce + `edit_post`. Không REST. |

Sidebar hẹp: control xếp dọc, không grid cố định width. Keyboard: control native của `@wordpress/components`.

Save sản phẩm lỗi: meta trong editor giữ draft, option site không bị request này đụng.

## 9. Gói làm

| Gói | File | Xong khi |
|---|---|---|
| P1 | `inc/product-design.php`, require từ `functions.php` theme | Unit không có ở repo thì tự kiểm bằng đọc: input rác ra default; override false bỏ meta; override true không kéo key site. Body class đúng trên `is_product` |
| P2 | `style.css` + nhánh ẩn trong `woocommerce.php` | Trang không có class mới trông như hiện tại. Class ratio/right/stacked/hide đổi đúng selector §5. 900px vẫn một cột |
| P3 | typography-settings.php + theme-design.tsx + contract | Save group product ra option riêng. Revision lệch không ghi. Palette không đổi khi save product |
| P4 | product-design module + panel | Đổi override, save sản phẩm, reopen còn meta. Reset về override false. Sản phẩm không override đổi theo option site sau reload frontend |
| P5 | `docs/testing/product-page-design-1.3.22.md` | URL sản phẩm có ảnh, sản phẩm không ảnh, title dài, không attribute. Bước desktop/mobile, save lỗi giả không bắt buộc mô phỏng được thì ghi “chưa có cách gây lỗi save”. Human chạy build/lint |

Không commit trong các gói trừ khi human yêu cầu.

## 10. Acceptance

| ID | Việc trong gói | Kiểm |
|---|---|---|
| PDP-UI-01 | P2 | Hai sản phẩm: title dài, có/không ảnh, có/không attribute. Desktop ratio và mobile một cột. CTA còn chữ, href còn `product_id` khi quote bật. Tắt quote thì không còn link đó |
| PDP-UX-01 | P3 P4 | Đổi site default, sản phẩm không override đổi theo. Sản phẩm override không đổi khi sửa site. Reset rồi reload frontend về site. Ô control không nhận hex |
| PDP-TECH-01 | P1 | Xem option và meta sau save. Role không `manage_options` không save group. Woo tắt: theme không fatal. Gallery cũ và quote URL không đổi khi mọi toggle để default |
| PDP-TRACE-01 | Plan này | 1.3.5 không bị tick. Archive không nằm trong file P1–P4 |

## 11. Không làm

- Sửa `themes/generatepress/**`.
- Template drag/drop, điều kiện theo category, Post page.
- Đổi query sản phẩm, xóa attribute, xóa ảnh khi tắt gallery.
- JS đo chiều rộng, Swiper, font loader.
- Bump version hoặc archive ngoài1.3.22 khi milestone đó được human bắt đầu. Không đánh dấu milestone xong sau khi có source.

## 12. Agent cửa sổ ngắn

Một phiên = một gói P1–P5. Đọc §12–15, rồi chỉ đọc mục gói đó. Không đọc slider, category grid, archive, Post 1.3.23.

Xong một gói khi checklist cuối mục gói đúng. Dừng. Không bắt gói sau trong cùng phiên trừ khi human nói tiếp.

Không đổi key, default, hay “override là cả bộ”. Không thêm control px/hex. Không đánh dấu PDP-* là PASS.

## 13. File được sửa

| Gói | Sửa | Cấm |
|---|---|---|
| P1 | `wp-content/themes/skvn-marine/inc/product-design.php` (mới), `functions.php` (thêm một dòng include) | `style.css`, plugin, `woocommerce.php` |
| P2 | `style.css` cạnh block 3505 và trong `@media (max-width: 900px)` đang có ở 4365; `inc/woocommerce.php` chỉ hai hàm CTA và tabs | Plugin, `functions.php` |
| P3 | `modules/typography-settings/typography-settings.php`, `src/design-sidebar/theme-design.tsx`, `inc/customizer.php` | Panel sản phẩm, `style.css` |
| P4 | `modules/product-design/product-design.php` (mới), `skvn-marine-blocks.php` (một `require_once`), `src/product-design/panel.tsx` (mới), `src/index.ts` (một import) | Theme Design save, `style.css` |
| P5 | `docs/testing/product-page-design-1.3.22.md` (mới) | PHP, CSS, TS |

`themes/generatepress/**` không đụng ở mọi gói.

## 14. Schema và sanitize — chép đúng

Thứ tự key cố định. Site option và giá trị Theme Design có đúng 14 key, không có `override`. Meta có 15 key khi override bật.

Default, dùng cùng thứ tự ở theme và plugin:

```php
array(
	'columns'     => 'gallery-left',
	'ratio'       => '1-1',
	'width'       => 'wide',
	'showGallery' => true,
	'showPrice'   => true,
	'showExcerpt' => true,
	'showMeta'    => true,
	'showTabs'    => true,
	'showTrust'   => true,
	'showContact' => true,
	'showQuote'   => true,
	'titleScale'  => 'current',
	'summaryGap'  => 'current',
	'specs'       => 'default',
	'ctaStyle'    => 'current',
)
```

Allowlist:

- `columns`: `gallery-left`, `gallery-right`, `stacked`
- `ratio`: `1-1`, `3-2`, `2-3`
- `width`: `wide`, `content`
- `titleScale`: `current`, `h2`, `h3`, `h4`
- `summaryGap`: `current`, `tight`, `loose`
- `specs`: `default`, `compact`
- `ctaStyle`: `current`, `primary`
- tám key `show*`: bool

Hàm sanitize nhận một giá trị. Không phải array thì trả default đầy đủ.

Với từng key trong default:

- Enum: `isset` và `is_string` và `in_array( ..., true )`. Sai hoặc thiếu thì default của key đó.
- Bool: chỉ `true` hoặc `1` thành `true`. Mọi thứ khác, kể cả chuỗi `'false'`, `'true'`, `''`, thành `false`. Không ép `(bool)` lên chuỗi.

Key lạ bị bỏ. Không hủy cả mảng vì một key sai.

`skvn_marine_blocks_sanitize_product_design()` trong plugin và `skvn_marine_sanitize_product_design()` trong theme cùng luật, comment `keep in sync with` trỏ sang nhau.

Meta, hàm riêng `skvn_marine_blocks_sanitize_product_design_meta()`:

- Không phải array, hoặc `override` không phải `true` và không phải `1`: trả `array( 'override' => false )`. Bỏ mọi key khác.
- `override` đúng: trả `array( 'override' => true )` cộng 14 key đã sanitize. Key thiếu lấy default §14, không lấy từng key từ option site.

Resolve, chỉ plugin đọc DB:

```text
skvn_marine_blocks_get_product_design( $product_id ):
  $site = sanitize( get_option( 'skvn_product_design', array() ) )
  $product_id = absint
  nếu $product_id < 1: return $site
  $meta = get_post_meta( $product_id, '_skvn_product_design', true )
  nếu meta không phải array hoặc override không phải true/1: return $site
  return sanitize( $meta )   // 14 key, không kèm override
```

Theme `skvn_marine_get_product_design( $product_id )`:

- Nếu `function_exists( 'skvn_marine_blocks_get_product_design' )`: trả về hàm plugin.
- Plugin không có: trả default §14. Không `get_option`, không `get_post_meta`. Security guideline: không đọc option khi không có getter đã sanitize.

Body class, theme, filter `body_class`, tên `skvn_marine_product_design_body_class`:

- Không `class_exists( 'WooCommerce' )`, hoặc không `function_exists( 'is_product' )`, hoặc không `is_product()`: trả `$classes` nguyên.
- `$design = skvn_marine_get_product_design( get_queried_object_id() )`.
- Luôn thêm, qua `sanitize_html_class`: `skvn-pdp`, `skvn-pdp-columns-{columns}`, `skvn-pdp-ratio-{ratio}`, `skvn-pdp-width-{width}`, `skvn-pdp-title-{titleScale}`, `skvn-pdp-gap-{summaryGap}`, `skvn-pdp-specs-{specs}`.
- `ctaStyle === primary`: thêm `skvn-pdp-cta-primary`.
- Mỗi `show*` là `false`: thêm đúng một class `skvn-pdp-hide-gallery|price|excerpt|meta|tabs|trust|contact|quote`. Không thêm class hide khi `true`.
- Không echo. Chỉ đẩy vào mảng class.

## 15. Bẫy đã thấy trong source

1. `skvn_marine_blocks_design_save_group()` dòng owner: group khác `fonts` ghi vào `skvn_typography`. Product phải dùng option `skvn_product_design`, giá trị option là chính mảng 14 key, không bọc trong `skvn_typography['product']`.
2. `skvn_marine_blocks_design_theme_supported()` chỉ bắt buộc `palette`, `heading`, `fonts`. Giữ vậy. Capability `product` thiếu thì chỉ group product không vào snapshot và save product trả 403. Palette/heading/fonts vẫn save.
3. AJAX validate palette bằng hex. Product cần nhánh riêng. Đừng đếm key rồi chạy vòng hex.
4. Rule desktop mới phải thắng `.woocommerce div.product` ở `style.css:3506` (specificity 0,2,1). Dùng `body.skvn-pdp-* .woocommerce div.product`.
5. Trong `@media (max-width: 900px)`, rule hiện tại chỉ có specificity 0,2,1 nên thua rule desktop 0,3,1. Reset mobile phải là `body.skvn-pdp .woocommerce div.product` và nằm sau rule desktop trong file.
6. `.product-images-summary-wrap` ở `style.css:3566` không có PHP tạo class. Không viết CSS dựa vào class đó.
7. Ẩn gallery/price/excerpt/meta bằng CSS. Không `remove_action` các hook Woo đó.
8. Quote/contact/trust/tabs tắt bằng cách không in. Không chỉ `display:none` cho bốn cái này.
9. `skvn_marine_get_product_quote_url()` giữ nguyên. Tắt quote thì không gọi hàm trong nhánh đã tắt.
10. Width owner vẫn là `.woocommerce div.product`. Không `100vw`, không margin âm, không `overflow-x` mới.

## 16. P1 — đọc và class

Tạo `inc/product-design.php`. Prefix `skvn_marine_`. `ABSPATH` guard.

Trong `functions.php`, thêm `'inc/product-design.php'` vào `$skvn_marine_includes` ngay sau `'inc/woocommerce.php'`.

File chứa default, `skvn_marine_sanitize_product_design()`, `skvn_marine_get_product_design()` theo §14, và filter body class. Không hook Woo, không CSS.

Tự đọc lại bằng ví dụ, không cần PHPUnit:

| Input | Output |
|---|---|
| `null`, `'{}'`, `array()` | đủ 14 default |
| `array( 'columns' => 'nope', 'showQuote' => 'false' )` | `columns=gallery-left`, `showQuote=false`, key khác default |
| `array( 'ratio' => '3-2', 'extra' => 1 )` | `ratio=3-2`, không còn `extra` |
| product id 0 | bằng site đã sanitize |
| meta `array( 'override' => false, 'width' => 'content' )` | bỏ meta, trả site |
| meta `array( 'override' => true )` | 14 default, không lấy `width` từ site |
| meta `array( 'override' => true, 'width' => 'content' )` | `width=content`, key khác default |
| không có class `WooCommerce` | body class không thêm `skvn-pdp` |

Checklist P1: include có trong `functions.php`; getter không gọi `get_option` khi plugin chưa có; class hide chỉ khi false; `columns=stacked` vẫn in class ratio (CSS bỏ qua).

## 17. P2 — CSS và chỗ không in

Chèn ngay sau rule `.woocommerce div.product` ở `style.css:3506`. Không sửa rule 3506–3525, không sửa rule ẩn sidebar 3527–3545, không sửa rule float gallery 3547–3563.

```css
body.skvn-pdp-ratio-3-2 .woocommerce div.product,
body.skvn-pdp-ratio-3-2 .skvn-product-layout {
	grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
}
body.skvn-pdp-ratio-2-3 .woocommerce div.product,
body.skvn-pdp-ratio-2-3 .skvn-product-layout {
	grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
}
body.skvn-pdp-columns-gallery-right .woocommerce div.product div.images {
	order: 2;
}
body.skvn-pdp-columns-gallery-right .woocommerce div.product div.summary {
	order: 1;
}
body.skvn-pdp-columns-stacked .woocommerce div.product,
body.skvn-pdp-columns-stacked .skvn-product-layout,
body.skvn-pdp-hide-gallery .woocommerce div.product,
body.skvn-pdp-hide-gallery .skvn-product-layout {
	grid-template-columns: minmax(0, 1fr);
}
body.skvn-pdp-width-content .woocommerce div.product,
body.skvn-pdp-width-content .skvn-product-layout {
	max-width: var(--skvn-content-width);
}
body.skvn-pdp-gap-tight .woocommerce div.product,
body.skvn-pdp-gap-tight .skvn-product-layout {
	column-gap: 1.5rem;
}
body.skvn-pdp-gap-loose .woocommerce div.product,
body.skvn-pdp-gap-loose .skvn-product-layout {
	column-gap: 4rem;
}
body.skvn-pdp-hide-gallery .woocommerce div.product div.images,
body.skvn-pdp-hide-price .woocommerce div.product .price,
body.skvn-pdp-hide-excerpt .woocommerce div.product .woocommerce-product-details__short-description,
body.skvn-pdp-hide-meta .woocommerce div.product .product_meta,
body.skvn-pdp-hide-tabs .woocommerce div.product .woocommerce-tabs,
body.skvn-pdp-hide-trust .skvn-product-trust,
body.skvn-pdp-hide-contact .skvn-product-cta-secondary,
body.skvn-pdp-hide-quote .skvn-product-cta-primary,
body.skvn-pdp-hide-quote .skvn-product-cta-note {
	display: none;
}
body.skvn-pdp-title-h2 .woocommerce div.product .product_title {
	font-size: var(--skvn-h2-size);
	font-weight: var(--skvn-h2-weight);
}
body.skvn-pdp-title-h3 .woocommerce div.product .product_title {
	font-size: var(--skvn-h3-size);
	font-weight: var(--skvn-h3-weight);
}
body.skvn-pdp-title-h4 .woocommerce div.product .product_title {
	font-size: var(--skvn-h4-size);
	font-weight: var(--skvn-h4-weight);
}
body.skvn-pdp-specs-compact .skvn-tab-product-info__specs table.shop_attributes th,
body.skvn-pdp-specs-compact .skvn-tab-product-info__specs table.shop_attributes td {
	padding: 0.375rem 0.5rem;
}
```

`titleScale=current` không có rule mới. Rule title hiện tại `style.css:3727` giữ `clamp(1.25rem, 3vw, 1.75rem)`. Biến heading đã in ở `inc/typography.php:109–112`.

Compact thắng padding `0.625rem 0.75rem` của `.woocommerce table.shop_attributes th/td` ở `style.css:4269` và `4278` vì có thêm body class và `.skvn-tab-product-info__specs`.

Gallery phải + ratio 3-2: grid vẫn `3fr 2fr`. `order` đưa summary sang cột 3fr, ảnh sang cột 2fr. Không đảo số trong `grid-template-columns`.

Trong `@media (max-width: 900px)` đã có ở dòng 4365, thêm vào block đó, không tạo breakpoint mới:

```css
body.skvn-pdp .woocommerce div.product,
body.skvn-pdp .skvn-product-layout {
	grid-template-columns: minmax(0, 1fr);
}
body.skvn-pdp .woocommerce div.product div.images,
body.skvn-pdp .woocommerce div.product div.summary {
	order: 0;
}
```

Block `@media (max-width: 600px)` đã đưa `.skvn-product-trust` về `1fr` ở dòng 4388. Giữ.

`skvn_marine_woocommerce_single_quote_cta()` trong `inc/woocommerce.php`: sau khi có `$product`, lấy design bằng `skvn_marine_get_product_design( $product->get_id() )`.

- `showQuote`, `showContact`, `showTrust` đều false: `return` trước HTML.
- Không thì in `.skvn-product-cta-zone`.
- `showQuote` true: in primary và `.skvn-product-cta-note`. `ctaStyle === primary` thì class anchor là `skvn-product-cta-primary skvn-button skvn-button--primary`. `current` thì chỉ `skvn-product-cta-primary`. Href vẫn `esc_url( skvn_marine_get_product_quote_url() )`. Chữ và SVG giữ nguyên.
- `showQuote` false: không gọi hàm URL, không in primary, không in note.
- `showContact` true: in secondary như hiện tại, href `esc_url( home_url( '/lien-he/' ) )`.
- `showTrust` true: in `.skvn-product-trust` nguyên khối hiện tại.

`skvn_marine_woocommerce_product_tabs()`: giữ ba `unset` hiện tại. Nếu `function_exists( 'is_product' ) && is_product()` và `showTabs` false: `return array()`. Không add lại reviews. `showTabs` true: bốn tab SKVN như cũ.

Checklist P2: trang không có class `skvn-pdp` không dính rule mới. 900px một cột và `order: 0`. Tắt cả ba CTA thì không còn `.skvn-product-cta-zone`. Tắt tabs trả mảng rỗng sau unset, không có reviews.

## 18. P3 — mặc định site

Option: `skvn_product_design`. Capability save: `manage_options`. Revision: `skvn_marine_blocks_design_revision()` trên mảng 14 key đã sanitize.

`inc/customizer.php` `skvn_marine_design_sidebar_contract()`: thêm `'product'` vào `capabilities`. Giữ `'version' => 1`.

`typography-settings.php`: định nghĩa `skvn_marine_blocks_sanitize_product_design()` trong file này (P4 gọi lại, không viết bản thứ ba). Ngoài hàm đó, chỉ các điểm này:

- `skvn_marine_blocks_design_theme_supported()`: không thêm `product` vào mảng `array_diff`. Palette vẫn là điều kiện theme supported.
- `skvn_marine_blocks_design_save_group()`: owner của `product` là `'skvn_product_design'`. `fonts` vẫn `theme_mods_{stylesheet}`. Group còn lại vẫn `SKVN_MARINE_BLOCKS_TYPOGRAPHY_OPTION`.
- Nhánh ghi: `product` thay cả giá trị option bằng `skvn_marine_blocks_sanitize_product_design( $raw )`. Không `$value['product'] = $raw` trên typography.
- So khớp sau ghi dùng cùng hàm sanitize product, không dùng `skvn_marine_blocks_sanitize_typography()`.
- Capability product dùng `manage_options`, cùng nhánh không phải fonts.
- `skvn_marine_blocks_design_snapshot()`: nếu contract có `product`, thêm `groups.product` = value sanitize của option, revision, `canEdit` = `current_user_can( 'manage_options' )`. Không có capability thì không có key `product` trong `groups`.
- AJAX save allowlist thêm `'product'`.
- Validate product, trước vòng palette: raw là array; đúng 14 key §14; mỗi enum là string trong allowlist; mỗi `show*` là boolean JSON (`true`/`false`), không nhận chuỗi. `count( $raw )` phải bằng 14. Sai thì 400, draft giữ. Không chạy vòng hex cho group này.

`theme-design.tsx`:

- `Group` thêm `'product'`.
- `Values` phải nhận được `boolean` vì toggle. Đừng để type chỉ `string`.
- Thêm `'product'` vào mảng của `hasDraft` (dòng ~92) và vào mảng `.map` panel (dòng ~213). Thiếu một trong hai thì dirty hoặc panel lệch.
- Label group: `Product page`.
- Chỉ render panel product khi `snapshot.groups.product` tồn tại.
- Control, label tiếng Anh, text domain `skvn-marine-blocks`:

| Key | Control | Label | Options |
|---|---|---|---|
| `columns` | Select | Columns | Gallery left, Gallery right, Stacked |
| `ratio` | Select | Column ratio | 1:1, 3:2, 2:3. Help: Ignored when columns are stacked. |
| `width` | Select | Width | Wide, Content |
| `showGallery` | Toggle | Show gallery | |
| `showPrice` | Toggle | Show price | |
| `showExcerpt` | Toggle | Show excerpt | |
| `showMeta` | Toggle | Show product meta | |
| `showTabs` | Toggle | Show tabs | |
| `showTrust` | Toggle | Show trust signals | |
| `showContact` | Toggle | Show contact link | |
| `showQuote` | Toggle | Show quote button | |
| `titleScale` | Select | Title size | Current, Heading 2, Heading 3, Heading 4 |
| `summaryGap` | Select | Column gap | Current, Tight, Loose |
| `specs` | Select | Specifications | Default, Compact |
| `ctaStyle` | Select | Quote button style | Current, Primary |

- Nút sẵn có `Save group` và `Discard draft and reload group` dùng chung. Không nút save thứ hai.
- `ConflictComparison`: với group product, ô bool hiện `On` hoặc `Off`. Enum hiện đúng chuỗi đã lưu. Không dùng `paletteLabels`.

Checklist P3: save product không đổi `skvn_typography`. Revision lệch không ghi. User không `manage_options` nhận lỗi, draft giữ. Contract không có `product` thì ba group cũ vẫn save.

## 19. P4 — từng sản phẩm

`skvn-marine-blocks.php`: `require_once __DIR__ . '/modules/product-design/product-design.php';` cạnh các require module hiện có.

`modules/product-design/product-design.php`:

- `register_post_meta( 'product', '_skvn_product_design', ... )` trên `init`.
- `single` true, `type` `object`, `auth_callback` trả `current_user_can( 'edit_post', $post_id )`.
- `sanitize_callback` là `skvn_marine_blocks_sanitize_product_design_meta`.
- `show_in_rest.schema`: object, `additionalProperties` false, properties gồm `override` boolean và 14 key §14. Enum ghi trong schema. Bool không có enum chuỗi.
- Sanitize meta gọi `skvn_marine_blocks_sanitize_product_design()` đã có từ P3. Không copy thêm một bản.

`src/product-design/panel.tsx`, tự `registerPlugin`. `src/index.ts` thêm `import './product-design/panel';`. Không thêm entry webpack. Build hiện tại đã build `src/index.ts`.

Panel:

- `PluginDocumentSettingPanel`, name `skvn-product-design`, title `Product page`, icon không bắt buộc.
- Chỉ khi `useSelect` post type là `product`.
- `useEntityProp( 'postType', 'product', 'meta' )`.
- Đọc `meta._skvn_product_design`. Không phải object thì coi `{ override: false }`.
- Toggle `Override this product`. Bật thì ghi `override: true` và 14 default cho key chưa có trong meta. Tắt thì ghi đúng `{ override: false }`.
- `override !== true`: các control kia `disabled`, một dòng `Using the site default.`
- Nút `Use site default` ghi `{ override: false }`.
- Không nút Save riêng. Dirty đi theo Update của sản phẩm.
- Xếp dọc. Không grid có width cố định. Dùng `ToggleControl` và `SelectControl`.

Classic, cùng file PHP:

- `add_meta_boxes`: chỉ khi `function_exists( 'use_block_editor_for_post_type' )` và hàm đó trả false cho `product`.
- Meta box title `Product page`, nonce `skvn_product_design_nonce`.
- Cùng field và label tiếng Anh như panel.
- `save_post_product`: nonce sai, autosave, hoặc không `current_user_can( 'edit_post', $post_id )` thì return. Không đụng option site.
- Có nonce classic thì `update_post_meta` bằng sanitize meta. Block editor không gửi nonce này nên handler return, REST giữ quyền ghi.

Checklist P4: reopen sản phẩm còn meta. Use site default lưu `{ "override": false }`, không `delete_post_meta`. Sản phẩm `override` false đổi frontend khi option site đổi, sau reload. Sản phẩm override không đổi theo option site.

## 20. P5 — runbook

Tạo `docs/testing/product-page-design-1.3.22.md`. Human điền URL và version sau build. Chưa có URL thì ghi `URL: human điền`.

Bốn sản phẩm fixture: có ảnh + attribute; không ảnh; title dài hơn 80 ký tự; không attribute. Một sản phẩm không bật override.

Bước:

1. Ghi version theme/plugin và URL.
2. Site default để nguyên. Sản phẩm không override trông như trước milestone: gallery trái, hai cột đều, wide, CTA quote + contact + trust, bốn tab, không reviews.
3. Đổi site sang gallery phải, ratio 3:2, width content. Sản phẩm không override đổi theo sau reload. Sản phẩm đang override không đổi.
4. Desktop rộng hơn 900px: summary cột lớn bên trái, ảnh cột nhỏ bên phải.
5. Cửa sổ dưới 900px: một cột, gallery rồi summary, kể cả gallery phải.
6. Tắt quote trên override: không còn link `/request-a-quote/?product_id=`. Bật lại: href còn `product_id` của đúng sản phẩm.
7. Tắt gallery: summary full hàng, ảnh không thấy. Ảnh trong Media không bị xóa.
8. Use site default, Update, reload frontend: sản phẩm về option site.
9. Ô Theme Design product không có input hex và không có input number.
10. User không có `manage_options` không save được group. Ghi role đã thử.

Evidence human gửi: ảnh desktop, ảnh dưới 900px, đoạn href quote, giá trị option và meta sau save. Build/lint do human chạy; agent chỉ in lệnh, không chạy:

```bash
source /home/shinkuro/.nvm/nvm.sh && nvm use 20 && cd /mnt/d/Github/skvn-marine/wp-content/plugins/skvn-marine-blocks && npm run build && find modules/ -name "*.php" -exec php -l {} \;
```

PHP theme: `php -l wp-content/themes/skvn-marine/inc/product-design.php` và `php -l wp-content/themes/skvn-marine/inc/woocommerce.php`.

Module PHP mới nằm ngoài `build/` của webpack. Trước zip/upload, human chạy `node tools/build-deploy-artifact.mjs` rồi `bash tools/package-plugin-zip.sh` và kiểm zip có `modules/product-design/product-design.php`. Agent không tự chạy các lệnh đó.
