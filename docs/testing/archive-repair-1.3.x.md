# Archive repair — evidence intake / future onsite runbook

Status2026-11-06: **Planning, chưa implementation/start/SemVer**. Spec059§7. Không publish fixture, đổi settings hoặc ghi dữ liệu production trong bước read-only.

Execution2026-11-06: human cho Woo M1 chung1.3.20; source theme inc/woocommerce.php/style.css,16mock model checks chuẩn bị. Status intake dưới giữ lịch sử. Current1.3.19/metadata chưa chuyển, Blog/M2 chưa start. PHP không có trong shell, Woo/GP runtime không có trong checkout; không chạy build/lint hoặc đánh runtime PASS.

## Human commands và kiểm sau source

### Shared card060 — approved/source2026-11-07, ảnh1:1

Second harness repair2026-11-07: human run qua grouped Carousel summary rồi fail assertion `Carousel saved media preset preserved`. Source truyền floating style vào `wc_placeholder_img`; mock trước chỉ trả `<img>` cố định, bỏ `$attributes['style']`. Sửa mock giữ/escape attributes và giữ nguyên assertion class+offset (không nới expected hoặc sửa production). Combined target vẫn37; cần rerun shared-card script, hook10 chỉ chạy nếu chưa có output. Không rebuild vì test-only.

Latest test repair2026-11-07: human run combined suite đạt16baseline+4shared data cases rồi fatal `is_singular()` do thiếu WP routing mocks trong harness. **Combined chưa PASS**, hook10 chưa có output. Đã bổ sung routing mocks và5source URL assertions, giữ real helper/production không đổi. Expected rerun **37checks combined +10hook/template**; các target32 bên dưới là checkpoint trước bổ sung5cases, không còn target cuối. Chỉ rerun2PHP scripts sau, không rebuild/lint production vì test-only repair:

```bash
cd /mnt/d/Github/skvn-marine
php tools/tests/archive-shared-product-card.test.php
php tools/tests/archive-card-hooks.test.php
```

Human duyệt shared Product Carousel card, sửa ratio1:1 trước implementation; controls đổi ratio deferred scope kế tiếp, không có trong patch. Enhanced archive giờ grouped visible specs/product tags/MOQ, fallback native5rows cũng1:1. Full values default vì detail page chưa verified; không yêu cầu rerun16baseline riêng khi combined suite đã chứa nó.

Source checks: **7/7CSS selector/cascade modelPASS** sau final asset dependency change (`node tools/tests/product-card-css.test.mjs`, Node24.20.0). Không phải browser/Woo/editor loaded-asset PASS. PHP renderer combined32 và hook/template10 **chưa chạy**;16baseline humanPASS ở section sau vẫn có giá trị phạm vi cũ.

Human chạy build/lint theo AGENTS (agent không chạy):

```bash
source /home/shinkuro/.nvm/nvm.sh && nvm use 20 && cd /mnt/d/Github/skvn-marine/wp-content/plugins/skvn-marine-blocks && npm run build && find modules/ -name "*.php" -exec php -l {} \;
```

Sau đó từ repo root:

```bash
cd /mnt/d/Github/skvn-marine
php -l wp-content/themes/skvn-marine/functions.php
php -l wp-content/themes/skvn-marine/inc/woocommerce.php
php -l wp-content/themes/skvn-marine/inc/templates/archive-product-card.php
php tools/tests/archive-shared-product-card.test.php
php tools/tests/archive-card-hooks.test.php
```

Model32 =16baseline+16shared checks, không32integration cases. Hook/template10 dùng fake registry, không actual WP hook runtime. Chỉ chạy lại CSS model nếu source/cascade thay đổi, không cần thêm reruns để đạt một con số.

AC acceptance sau build/delivery:

1. Ghi WP/Woo/GP versions/active overrides/build/URLs, so **cùng product, cùng build** Home Carousel và Shop/Grouper. Kiểm product_tag/attributes/meta thật, không lấy sample claims làm expected.
2. Network/Styles: shared handle `skvn-marine-product-card` tải đúng `assets/css/product-card.css` version; Collection/editor handles depend nó. Không còn card base compiled trong rebuilt CSS. Archive-only không tải Swiper/editor JS vì card. Trang có Collection cùng archive không thêm stylesheet duplicate.
3. DOM một li native product + một article shared, một quote/một View details; không native link/spec/CTA lặp hoặc nested anchors. Count/order/page IDs/private visibility giữ. Third-party Woo extensions vẫn chạy5actions nhưng markup quanh article; kiểm extension nào phụ thuộc anchor nesting cũ, không tự coi mọi plugin compatible.
4. Ảnh thật/placeholder **1:1** ở enhanced và plugin-off fallback; native CSS không để margin20px lọt vào shared image. Card static, no hover lift/zoom. Ratio control chưa có, không ghi lỗi “thiếu setting” cho gói hiện tại.
5. Grouped attributes giữ0/duplicates/extra visible fields; hidden không leak;MOQ chỉ stats, attr ưu tiênmeta. Default hiển thị **tất cả values**. Chỉ opt-in filter `skvn_marine_blocks_archive_full_specs_available` khi human đã kiểm detail page đủ, rồi kiểm3/+N đúng số và View details tới đủ values. No data neutral line.
6. Tags0/1/many/long: spans sibling image link, ít/short overlay;>3/long hoặc card≤320px strip dưới ảnh. Keyboard/touch/zoom200% và full labels; không che hết ảnh hoặc giả filter. Cert/leadtime defaultoff, chỉ opt-in `skvn_marine_blocks_archive_verified_catalog_meta` sau xác thực; không PDF.
7. Sidebar/grid/toolbar/pagination desktop/tablet/mobile theo AL; measure actual image/card/container rect + scrollWidth. CTA alignment theo từng hàng, long title/chips không clip; không khẳng định height/performance từ model.
8. Plugin-off/API/CSS/adapter missing trong test environment được phép: native fallback/no fatal, quote và product IDs đúng. Existing custom theme/extension content-product override hoặc WC template-debug giữ template cũ; ghi trường hợp này nếu không thấy shared card, không quy cache. Existing Grid flat, Carousel grouped/+N/media saved options, Post/shortcodes/single/related/theme khác và editor save/reopen không regression. Không tắt production plugin chỉ để test nếu chưa được phép.

Gửi build/lint + PHP outputs, actual environment versions và screenshots/Network/DOM cần thiết theo AC-* của060. Nếu deploy/package, kiểm zip presenter/CSS/adapter theo deploy workflow và nhắc chụp Editor UI. Không coi source hiện tại đã deploy hoặc AC PASS.

### Evidence 2026-11-07 — human-reported model PASS

Human gửi output `tools/tests/woo-archive-m1.test.php`: **16/16 checks PASS**, kết thúc `16 checks passed (mocked model only).` Phạm vi: archive/shortcode guards, visible/hidden attributes, taxonomy names/error fallback, missing values, Pack mapping, MOQ fallback/precedence, category current/ancestor/escaping/cycle và native placeholder. Không phải agent tự chạy. PHP version, exact command/build/commit và output hai lệnh lint chưa được gửi; không suy lint PASS từ model test.

Model test đã đáp ứng, không yêu cầu chạy lại nếu source không đổi. Woo/GeneratePress integration, responsive/geometry, query/pagination, keyboard và quote submission vẫn **Chờ kiểm chứng** theo steps bên dưới. Không mark AM1/AL/AR runtime PASS hoặc milestone complete từ16checks.

### Commands tham chiếu

Từ repo root trong terminal có PHP:

```bash
php -l wp-content/themes/skvn-marine/functions.php
php -l wp-content/themes/skvn-marine/inc/woocommerce.php
php tools/tests/woo-archive-m1.test.php
```

1. Ghi WP/Woo/GP versions, loaded archive template/overrides, source build. Shop URL từ config và Grouper target; model checks không thay integration.
2. Shop/Grouper/empty category/tag: một nav, current/ancestor/All products đúng. Empty vẫn navigation/no-results/sales. Đổi category về page1/default sort; refresh/back đúng. Sidebar không sticky/filter.
3. Đo ở320/390/768/1024/1280/1440 viewport CSSpx, desktop scrollbar/zoom200%; quanh container620/1120/1180±1px. Expected sidebar từ1120px container,3col từ1180, nav trên khi hẹp hơn1120,1col dưới620. Gửi ancestor/card rect khi GP padding làm card hẹp; scrollWidth≤clientWidth.
4. Nhiều/deep/long categories: wrap không nav trùng, tab order đúng; mobile disclosure chưa có. Chụp chiều cao navigation trước grid để quyết follow-up.
5. Ảnh4:3/native fallback,5specs đúng visible source; missing “—”, không sample MOQ. Image/title/details đúng product, quote đúng product_id và không AJAX add-to-cart. Keyboard/focus đủ rõ.
6. Count/default/latest/page1/2/last đúng product IDs; logged-in/out visibility; native subcategory display mode. Embedded shortcode/single/related/Blog giữ layout cũ. Không suy pagination PASS từ2items.
7. Quote/generic sales dùng CF7 hiện có; đúng context, required/invalid/submitting/failure giữ input/success. CFDB7/mail evidence riêng; không submit dữ liệu thật nếu chưa được phép.

Gửi command output, URLs/versions/template, ảnh desktop/tablet/mobile, rect/cascade và console notes; agent tiếp tục từ FAIL. Khi deploy sau này nhắc chụp Editor UI theo selling-point checklist; chưa deploy trong lượt source.

## Target / preconditions

Layout update2026-11-06: human chọn desktop category sidebar trái, tablet navigation trên grid. Detailed work/AL-01–06 acceptance tại plan059§9; mobile disclosure/widths/breakpoints/colors/type vẫn proposal, chưa runtime source/PASS. Sau implementation kiểm Shop + Grouper ở320/390/768/1024/1280/1440 CSSpx và quanh breakpoint đã chọn±1px; desktop có scrollbar và zoom200%. Ghi current/ancestor links, page/order policy, nav tab order/focus khi resize; không tự coi mobile disclosure đã được duyệt. Giữ AR/AM1 evidence riêng, không thay bằng AL IDs.

- Product category: https://minhhaifishery.com/product-category/grouper/
- Shop URL lấy từ cấu hình native khi audit; Blog posts-index/category/tag URLs chưa có.
- Ghi WP/Woo/GeneratePress/theme/plugin/browser versions, build/commit, logged-in/out, zoom, viewport CSS pixels. Agent ngoài báo1920×998 và2products; actual versions/build chưa có.
- Fixtures bổ sung khi được phép: 0/1/2/many products, long title, no image, thiếu/đa giá trị spec, page2+. Không tạo/sửa sản phẩm production chỉ để test.

## Baseline do human chuyển tiếp

Agent browser report: cardwidth≈35px/content≈1185px, tên/CTA gãy dọc, vẫn lỗi sau reload. Count/breadcrumb/H1/latest sort hoạt động, không desktop overflow. Sticky header xuyên chữ và footer headings hidden là report shared surfaces, chưa vào product repair. Không ảnh/DOM measurements gốc kèm theo; root không tái hiện (web fetch inaccessible), không đánh independent PASS. Mobile chưa kiểm. Lưu report theo059§7, không tự nhận toàn bộ design proposal là approval.

## Steps / expected / evidence

Human evidence bổ sung2026-11-06: parent740px display:grid từ theme4297; card38.1333px do width22.05% thắng từ Woo `woocommerce-layout.css:1`. Width conflict đã xác nhận theo059§8, không cần yêu cầu human gửi lại rule này. Còn kiểm pseudo-elements, mobile, logged-in/out và regression sau implementation; chưa sửa source. DOM3items gồm private544 khác report2publicitems, không tự suy query/security bug.

1. Mở target ở1920×998,390px và zoom200%; chụp full grid + card/CTA. Đo content/ul.products/li.product/image/CTA rect; computed display/grid-template-columns/width/min-width/margins/float, matched-rules source/specificity và ul ::before/::after. Expected: card đọc được, không chữ gãy dọc hoặc CTA bị clip; xác định rule gây35px thay vì đoán.
2. So page load/reload và default/latest order; ghi URL/query/count/product IDs. Expected: đúng category và order, không mất/trùng item. Page2+ chỉ PASS khi fixture đủ dữ liệu, không suy từ2results.
3. Kiểm attributes/meta có thật của2Grouper: Product form/Size/Freezing/Packaging/MOQ và các trường khác. Ghi field key/display label/units/array/empty/source owner; không đưa dữ liệu bí mật vào evidence. Expected: không bịa spec, mapping đủ trước mockup.
4. Khi implementation được duyệt: kiểm Grid/placeholders/quote product ID và URL; All products về native Shop, không pretend có filters. Empty/long title/missing spec/narrow widths ổn định; keyboard/focus/links và heading hierarchy dùng được. Native sort/pagination giữ semantics.
5. Regression single/related-products và quote flow vì CSS/hook Woo có scope rộng; frontend không thêm card animation nếu chưa duyệt. Shared header/footer reports ghi riêng, không tự sửa menu/brand content.

PASS từng requirement cần URL/build/viewport, expected/actual và ảnh/DOM/video phù hợp. Baseline lỗi grid là **FAIL theo external report**, sau sửa còn Chờ kiểm chứng; không claim mobile/performance PASS. Human gửi ảnh/rect/cascade, version/URL và console notes; root tiếp tục từ evidence đó. Build/lint chỉ yêu cầu khi có source change theo AGENTS; lượt intake không chạy build/test.
