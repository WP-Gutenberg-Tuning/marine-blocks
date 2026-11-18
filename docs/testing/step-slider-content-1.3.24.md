# Step slider — test copy (1.3.24)

Lưu 2026-11-16. Bản copy để dán vào trang step slider khi editor dùng được. Chưa gắn vào block, chưa phải runtime PASS. Milestone 1.3.24 vẫn PLANNED.

Nguồn sự thật do human xác nhận cùng ngày: nhà máy có FDA, HACCP, ISO 22000. Certificate of analysis của từng lô xuất khẩu ghi wild hoặc nuôi.

Trên trang ghi **FDA-registered facility** (đăng ký cơ sở). Không ghi NOAA certified, không ghi số chứng nhận còn trống, không ghi −18 °C, tỷ lệ mạ băng, MOQ, lead time.

Mỗi bước của slider: nhãn tab, một heading, một đoạn, một list. Nút chỉ ở bước 4.

## Step 1 — Sourcing

- H2: *Traceable from harvest to shipment*
- P: Grouper and mahi-mahi leave our plant with a clear origin. The certificate of analysis for each export lot states whether that lot is wild or farmed. For the United States, we prepare the harvest and chain-of-custody records your importer files under NOAA's Seafood Import Monitoring Program.
- List: Wild or farmed, stated on each lot · Harvest records for US entry · Chain of custody through our plant · Health and catch certificates when your market requires them

## Step 2 — Processing

- H2: *Prepared to your specification*
- P: Each order is cut and portioned to spec, then coded before it is frozen. Processing runs under HACCP and ISO 22000, in an FDA-registered facility. Boneless, unless you ask otherwise.
- List: HACCP · ISO 22000 · FDA-registered facility · Portioned to your order · Lot code before freezing

## Step 3 — IQF freezing

- H2: *Frozen piece by piece*
- P: Portions are frozen individually, not in a block, and packed to your specification. The weight you pay for is net weight. Any glaze is declared separately, and the lot certificate stays with that lot.
- List: Individually quick frozen · Net weight · Glaze declared separately, when used · Pack format to your specification

## Step 4 — Export & QC

- H2: *Documented and ready to ship*
- P: Every shipment includes its lot file. The certificate of analysis states whether the lot is wild or farmed. Our facility is FDA-registered and operates under HACCP and ISO 22000. For grouper and mahi-mahi into the United States, we prepare the harvest records your importer needs.
- List: FDA-registered facility · HACCP · ISO 22000 · Certificate of analysis per lot, wild or farmed · US harvest records for grouper and mahi-mahi
- CTA: **Request a quote** → `/request-a-quote/`

## Paste (Code editor)

Dán khối dưới vào trang test Step Slider (Code editor). Tab labels và copy theo mục trên; không ảnh (dùng gradient mặc định sau sơn 081).

```html
<!-- wp:skvn-marine/step-slider {"align":"full"} -->
<div class="wp-block-skvn-marine-step-slider alignfull skvn-step-slider">
<!-- wp:skvn-marine/step-slide {"tabLabel":"Sourcing"} -->
<div class="wp-block-skvn-marine-step-slide skvn-step-slide swiper-slide"><div class="skvn-step-slide__media"></div><div class="skvn-step-slide__content">
<!-- wp:heading -->
<h2 class="wp-block-heading">Traceable from harvest to shipment</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Grouper and mahi-mahi leave our plant with a clear origin. The certificate of analysis for each export lot states whether that lot is wild or farmed. For the United States, we prepare the harvest and chain-of-custody records your importer files under NOAA's Seafood Import Monitoring Program.</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul class="wp-block-list"><li>Wild or farmed, stated on each lot</li><li>Harvest records for US entry</li><li>Chain of custody through our plant</li><li>Health and catch certificates when your market requires them</li></ul>
<!-- /wp:list -->
</div></div>
<!-- /wp:skvn-marine/step-slide -->

<!-- wp:skvn-marine/step-slide {"tabLabel":"Processing"} -->
<div class="wp-block-skvn-marine-step-slide skvn-step-slide swiper-slide"><div class="skvn-step-slide__media"></div><div class="skvn-step-slide__content">
<!-- wp:heading -->
<h2 class="wp-block-heading">Prepared to your specification</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Each order is cut and portioned to spec, then coded before it is frozen. Processing runs under HACCP and ISO 22000, in an FDA-registered facility. Boneless, unless you ask otherwise.</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul class="wp-block-list"><li>HACCP</li><li>ISO 22000</li><li>FDA-registered facility</li><li>Portioned to your order</li><li>Lot code before freezing</li></ul>
<!-- /wp:list -->
</div></div>
<!-- /wp:skvn-marine/step-slide -->

<!-- wp:skvn-marine/step-slide {"tabLabel":"IQF freezing"} -->
<div class="wp-block-skvn-marine-step-slide skvn-step-slide swiper-slide"><div class="skvn-step-slide__media"></div><div class="skvn-step-slide__content">
<!-- wp:heading -->
<h2 class="wp-block-heading">Frozen piece by piece</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Portions are frozen individually, not in a block, and packed to your specification. The weight you pay for is net weight. Any glaze is declared separately, and the lot certificate stays with that lot.</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul class="wp-block-list"><li>Individually quick frozen</li><li>Net weight</li><li>Glaze declared separately, when used</li><li>Pack format to your specification</li></ul>
<!-- /wp:list -->
</div></div>
<!-- /wp:skvn-marine/step-slide -->

<!-- wp:skvn-marine/step-slide {"tabLabel":"Export \u0026 QC"} -->
<div class="wp-block-skvn-marine-step-slide skvn-step-slide swiper-slide"><div class="skvn-step-slide__media"></div><div class="skvn-step-slide__content">
<!-- wp:heading -->
<h2 class="wp-block-heading">Documented and ready to ship</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Every shipment includes its lot file. The certificate of analysis states whether the lot is wild or farmed. Our facility is FDA-registered and operates under HACCP and ISO 22000. For grouper and mahi-mahi into the United States, we prepare the harvest records your importer needs.</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul class="wp-block-list"><li>FDA-registered facility</li><li>HACCP</li><li>ISO 22000</li><li>Certificate of analysis per lot, wild or farmed</li><li>US harvest records for grouper and mahi-mahi</li></ul>
<!-- /wp:list -->

<!-- wp:buttons -->
<div class="wp-block-buttons">
<!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="/request-a-quote/">Request a quote</a></div>
<!-- /wp:button -->
</div>
<!-- /wp:buttons -->
</div></div>
<!-- /wp:skvn-marine/step-slide -->
</div>
<!-- /wp:skvn-marine/step-slider -->
```

Lưu ý: markup paste có thể cần chỉnh wrapper sau lần save đầu (WordPress thường làm sạch `skvn-step-slide__media` / `__content`). Cách chắc: insert Step Slider, dán từng bước hoặc dùng menu ⋮ **Copy content** giữa hai `step-slide` cùng loại.
