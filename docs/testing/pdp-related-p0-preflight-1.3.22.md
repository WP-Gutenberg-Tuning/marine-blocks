# P0 preflight — PDP Related Card Profile (plan076 §10 — gate trước P4)

Target: local `http://localhost:8080` (runtime `D:\Github\minhhaifish`). Onsite chỉ khi human muốn; nếu onsite Woo version khác → map phải redo cho version đó.

Prereq: build + lint P3 PASS (lệnh cuối file). Test doc này là gate — FAIL bất kỳ gate → decision memo 7 mục, không mở P4.

---

## GATE A — Hook/template map (Woo 10.7.0 installed)

Agent đã map từ installed source (`D:\Github\minhhaifish\wp-content\plugins\woocommerce`):

**Args filter:** `woocommerce_output_related_products_args` — `wc-template-functions.php:2338` → `woocommerce_related_products( $args )` (query related theo cats/tags/attrs; `posts_per_page`, `columns` được dùng ở đây).

**Related loop** — `templates/single-product/related.php` @10.3.0:
- Heading filter `woocommerce_product_related_products_heading`
- `woocommerce_product_loop_start()` / `woocommerce_product_loop_end()`
- Per item: `wc_get_template_part( 'content', 'product' )` → filter `wc_get_template_part` — **target template swap flag-scoped của P4** (không copy template vào theme, sẽ global-replace mọi loop)
- `wp_reset_postdata()` cuối

**Item hooks** — `templates/content-product.php` @9.4.0 (suppress/restore inventory P4):

| Hook | Callback core | Priority |
|---|---|---|
| `woocommerce_before_shop_loop_item` | `woocommerce_template_loop_product_link_open` | 10 |
| `woocommerce_before_shop_loop_item_title` | `woocommerce_show_product_loop_sale_flash`, `woocommerce_template_loop_product_thumbnail` | 10, 10 |
| `woocommerce_shop_loop_item_title` | `woocommerce_template_loop_product_title` | 10 |
| `woocommerce_after_shop_loop_item_title` | `woocommerce_template_loop_rating`, `woocommerce_template_loop_price` | 5, 10 |
| `woocommerce_after_shop_loop_item` | `woocommerce_template_loop_product_link_close`, `woocommerce_template_loop_add_to_cart` | 5, 10 |

**Theme override:** không có thư mục `woocommerce/` trong theme (local runtime + source repo đã kiểm 2026-11-14).

### Human steps (A)

1. Ghi version: WP, Woo, GeneratePress, `skvn-marine-blocks` (wp-admin → Plugins). **Woo ≠ 10.7.x → STOP, báo agent** (map redo theo version đó).
2. Confirm onsite/runtime không có `wp-content/themes/skvn-marine/woocommerce/`.
3. Extension hooks: tạo `wp-content/mu-plugins/skvn-hook-inventory.php` (tạm, XÓA SAU) với snippet dưới, mở 1 trang sản phẩm có section Related, chụp/dán output, xóa file.

```php
<?php
// TEMPORARY hook inventory — DELETE AFTER P0. Admin-only, single product page only.
add_action( 'wp', function () {
	if ( ! is_product() || ! current_user_can( 'administrator' ) ) {
		return;
	}
	$hooks = array(
		'woocommerce_output_related_products_args',
		'wc_get_template_part',
		'woocommerce_before_shop_loop_item',
		'woocommerce_before_shop_loop_item_title',
		'woocommerce_shop_loop_item_title',
		'woocommerce_after_shop_loop_item_title',
		'woocommerce_after_shop_loop_item',
	);
	echo '<pre style="position:fixed;bottom:0;left:0;z-index:99999;background:#fff;color:#000;padding:8px;max-height:45vh;overflow:auto">';
	foreach ( $hooks as $hook ) {
		echo esc_html( $hook ) . ":\n";
		$wp_hook = $GLOBALS['wp_filter'][ $hook ] ?? null;
		foreach ( ( $wp_hook ? $wp_hook->callbacks : array() ) as $pri => $cbs ) {
			foreach ( $cbs as $id => $cb ) {
				echo '  pri ' . esc_html( $pri ) . ' — ' . esc_html( $id ) . "\n";
			}
		}
	}
	echo '</pre>';
} );
```

**Pass A:** versions khớp map (Woo 10.7.x), callbacks = core inventory trên + callback lạ được trace đúng plugin (Rank Math/WindPress v.v. nếu có). Callback lạ phải ghi rõ tên plugin — P4 phải restore cả chúng sau swap.
**Fail A:** Woo version khác / có template override / callback lạ không trace được → decision memo.

---

## GATE B — Grouped specs: PDP expose đủ attribute values (060 §5.1)

Fixtures — sản phẩm THẬT, same build:

| # | Fixture | Mục đích |
|---|---|---|
| F1 | ảnh + ≥2 group attributes, một group có >3 values | `+N` informational: card 3 values + `+N`, PDP phải hiện đủ phần bị rút |
| F2 | không attributes | neutral "Specifications available on request", không bịa MOQ |
| F3 | tags: 0 / 1 / nhiều / tên dài | chip hai lớp tag: cap `displayTagLimit` 3 + `+N`, không che ảnh |
| F4 | có product_cat terms | category chip (render mới, chỉ nhánh related — kiểm render sau P4; P0 thu dữ liệu) |
| F5 | có ≥4 related (share cat/tag/attr) | `relatedCount` 4 → clamp columns 4 |
| F6 | chỉ 1–2 related | columns 4 với ít items — ghi nhận visual có chấp nhận được |

### Human steps (B)

1. **F1:** mở PDP → chụp specs đầy đủ; mở trang Archive/Carousel đang render card cùng sản phẩm → so: card 3 values + `+N`. **PDP KHÔNG hiện đủ values mà +N rút gọn → FAIL** (060 §5.1: đến khi có đường xem đầy đủ, hiển thị toàn bộ values).
2. **F2:** card không specs → không có placeholder/MOQ bịa.
3. **F3/F4:** ghi danh sách tags + cats thật của mỗi fixture (text là đủ).
4. **F5:** mở PDP → ghi số related items Woo native hiện tại + columns native.
5. **F6:** mở PDP → ghi số items + ảnh chụp grid native.
6. Chụp mỗi fixture: PDP specs section + hiện trạng card native.

**Evidence B:** URL từng fixture, screenshot PDP specs, số related items, tags/cats list.
**Pass B:** PDP hiện đủ values cho mọi group bị +N rút gọn; fixtures đủ 6 dạng.
**Fail B:** thiếu values trên PDP / không có fixture đạt F1/F5 → decision memo (chọn full-values thay 3/+N, hoặc tạo fixture).

---

## GATE C — P2/P3 editor smoke (data layer phải chạy trước khi P4 dựng lên trên)

Prereq: build + lint PASS (lệnh cuối).

### Human steps (C)

1. **Theme Design → panel "Related products"**: group render; owner off → mọi control disabled trừ owner toggle.
2. Owner on → đổi 2 values (ví dụ `mediaLayout` = Padded, `relatedCount` = 5) → **Save group** → reload editor → values còn.
3. **Copy action**: chọn page có Product Collection block → Copy → notice "Copied. Not linked to the source block."; sửa block trên page đó → PDP default **KHÔNG** đổi (not linked, one-shot).
4. **Product editor (block)**: panel "Related products" → Override on → đổi `imageRatio` + `relatedCount` → **Update** → reopen → values còn → **Use site default** → "Using the site default." + meta trở `{override:false}` (không delete).
5. **Classic product edit** (nếu site dùng): meta box cùng field/label → save → values còn. Block editor không gửi nonce → save handler bỏ qua.
6. Post type ≠ product → không có panel.
7. Kiểm meta bằng WP-CLI (optional, 2 fixture): `wp post meta get <product_id> _skvn_pdp_related`.

**Pass C:** mọi bước đúng; meta sau save là `override` + 15 key (sanitize), `{override:false}` sau Use site default.
**Fail C:** panel không render / meta không lưu / giá trị méo sau reopen → sửa P2/P3 trước, không mở P4.

---

## Build/lint (human chạy trước GATE C)

```bash
source /home/shinkuro/.nvm/nvm.sh && nvm use 20 && cd /mnt/d/Github/skvn-marine/wp-content/plugins/skvn-marine-blocks && npm run build && find modules/ -name "*.php" -exec php -l {} \;
```

## Thứ tự

GATE C trước (nhanh, chỉ editor) → GATE A (snippet 5 phút) → GATE B (fixtures). Cả 3 PASS + human nói tiếp → mở P4 (related loop integration + template-part + presenter nhánh `related`).
