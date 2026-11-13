# V1 / 1.3.22 — Product Page Basic Design Controls

2026-11-12. **Current từ 2026-11-13** — human “Đã xong toàn phần 1.3.21” + “Chuyển sang 1.3.22 ngay” đã mở khoá plan này. Đây là execution plan PDP-TRACE-01; implementation **Chưa làm**, chưa có runtime evidence.

Đọc trước khi code: AGENTS → MILESTONES §1.3.22 → plan này → `docs/standards/css-layout-safety-contract.md` → `inc/woocommerce.php` và `style.css` mục Product page. Không mở Post 1.3.23, archive builder, woo-catalog 1.5.0, Sidebar 054.

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

Sửa nhóm Theme Design đang có, không sidebar mới.

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
