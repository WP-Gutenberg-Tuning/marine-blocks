# Product page design controls — 1.3.22

**URL:** human điền  
**Theme / plugin version:** human điền sau build

## Fixtures

| ID | Mô tả |
|---|---|
| P-A | Có ảnh + attribute |
| P-B | Không ảnh |
| P-C | Title dài (> 80 ký tự) |
| P-D | Không attribute |
| P-E | Không bật per-product override |

## Preconditions

- WooCommerce active, theme `skvn-marine`, plugin `skvn-marine-blocks` built.
- Một admin có `manage_options`, một editor chỉ `edit_post` (không manage_options).

## Steps

1. Ghi version theme/plugin và URL site test.
2. Site default để nguyên. Sản phẩm P-E trông như trước milestone: gallery trái, hai cột 1:1, wide, CTA quote + contact + trust, bốn tab SKVN, không reviews.
3. Theme Design → Product page: gallery right, ratio 3:2, width content → Save group. P-E reload frontend đổi theo; sản phẩm override bật không đổi.
4. Desktop > 900px với gallery right + 3:2: summary cột lớn trái, ảnh cột nhỏ phải (order).
5. Viewport < 900px: một cột, gallery rồi summary, `order: 0`.
6. Per-product override: tắt quote → không link `/request-a-quote/?product_id=`. Bật lại → href có đúng `product_id`.
7. Tắt gallery (override): summary full width, ảnh ẩn (CSS); Media Library vẫn giữ ảnh.
8. Use site default + Update product → frontend theo option site.
9. Theme Design Product: không có input hex/number px.
10. User không `manage_options`: save group Product → 403, draft giữ. Ghi role đã thử.

## Evidence to report

- Screenshot desktop + mobile (< 900px).
- Đoạn HTML href quote CTA.
- `skvn_product_design` option và `_skvn_product_design` meta sau save (WP-CLI hoặc DB).

## Build / lint (human)

```bash
source /home/shinkuro/.nvm/nvm.sh && nvm use 20 && cd /mnt/d/Github/skvn-marine/wp-content/plugins/skvn-marine-blocks && npm run build && find modules/ -name "*.php" -exec php -l {} \;
php -l wp-content/themes/skvn-marine/inc/product-design.php
php -l wp-content/themes/skvn-marine/inc/woocommerce.php
```
