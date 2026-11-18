# WooCommerce Archive + Blog Archive — discussion / repair planning

Human transition2026-11-07: **current V1 /1.3.20 — Product Category Grid + Category details + Woo Archive M1**, bắt đầu theo lệnh human.1.3.19 DEFERRED_WITH_CARRY_OVER, full acceptance/evidence tại history và current carry register; không completed/PASS. Các current1.3.19/chưa-chuyển-mốc phía dưới là checkpoint lịch sử. Metadata sync development1.3.20, không release/deploy/git remote push. Card ảnh1:1, ratio controls next scope và Blog/ArchiveM2 chưa start.

Created: **2026-11-06**. Status: **PLANNED — discussion, chưa start implementation**.

Latest2026-11-06: human “Thực hiện”, chọn **chung1.3.20**. Woo Archive M1 được coding source trong1.3.20; execution§10 supersedes checkpoint chưa-start/SemVer/sau1.3.23 bên dưới cho Woo M1. Blog và Archive M2 chưa start. Current1.3.19 giữ theo precedent Category source ngoài current; không tự chuyển mốc/bump metadata.

Human yêu cầu sửa hai archive trong **1.3.x**, làm sau một scope hiện có; tạo file trước để tiếp tục thảo luận. Current vẫn **V1 / 1.3.19 — Plugin Design Sidebar Foundation**. Chưa chốt SemVer cụ thể/start; không bump, chuyển mốc hoặc code runtime trong lượt này.

## 1. Scheduling register

Design digest2026-11-06: human yêu cầu tổng hợp Archive M1/làm trước và M2/kế tiếp sau khi đồng ý cần category navigation + quote journey đầy đủ + pagination/data states. [Consolidated plan](../../docs/ideations/archive/ARCHIVE_B2B_M1_M2_CONSOLIDATED_PLAN.md) chứa AM1/AM2 checklist, demo gaps, form-source reconciliation và open decisions. Bản bàn giao/HTML là reference, không production/start authority; các đoạn intake§7–8 giữ checkpoint lịch sử. Không tự làm mới form backend/schema: nguồn short CF7 hiện gộp quantity trong message, structured quantity/unit là proposal. Blog không lấy design Woo áp ngầm; current1.3.19/version scheduling giữ nguyên.

- Đề xuất xếp **sau 1.3.23 — Post Page Basic Design Controls**, sau chuỗi đã có 1.3.19 Sidebar → 1.3.20 Category → 1.3.21 Hero → 1.3.22 Product Page → 1.3.23 Post Page. Lý do: audit lại archive sau khi các trang chi tiết và nền controls có hợp đồng rõ; tránh xen ngang current và đè version đã dùng.
- Đây là **đề xuất thứ tự**, không phải human đã chốt predecessor. Không tự gán1.3.24. Trước coding phải xác nhận scope/PATCH rationale, số chưa dùng và lệnh start theo AGENTS. Nếu thêm hệ controls/archive builder mới thay vì repair, phải đánh giá lại SemVer, không coi ý muốn1.3.x là ngoại lệ tự động cho feature mới.
- Có thể triển khai chung một milestone repair, chia hai work packages Woo và Blog; chỉ tách version nếu audit cho thấy phạm vi/dependency khác đáng kể và human duyệt. Không làm mất acceptance cũ1.3.5 hoặc chốt DONE lại từ đầu.

## 2. Problem intake và bằng chứng hiện có

Checkpoint tạo file: chưa có URL/lỗi cụ thể. **Update2026-11-06:** human đã gửi URL Grouper và báo cáo agent browser tại§7; Blog vẫn chưa có URL/evidence. Bảng dưới là source inventory, không phải kết luận mọi surface đều FAIL.

| Surface / evidence | Hiện trạng biết được | Cần audit tiếp |
|---|---|---|
| Theme `archive.php` | Template Style C Hybrid: banner, tách post đầu của global query thành featured, phần còn lại grid, sidebar | Routes thực dùng template này; featured trên page2+, item counts, empty state, title/description/HTML semantics, sidebar/mobile |
| Blog index | Chưa thấy `home.php` trong inventory child theme | Reading settings: posts page hay latest posts; parent fallback/template thực chạy; có chênh giao diện với category/tag không |
| Theme `inc/woocommerce.php` | Native Woo style giữ; hook loop CTA sang Request a Quote, shared product quote URL; single-product hooks cùng file | Template/hooks thực cho Shop và product category/tag; CTA/filter scope; Woo version/override status; plugin catalog interactions |
| Existing plan025 / artifact | `.context/planning/archives/025_VER_1_3_5_POST_PRODUCT_ARCHIVE_IMPROVEMENTS.md`, `docs/artifacts/post-archive-style-C-hybrid.html` ghi hướng cũ | So source + onsite với decision cũ; giữ rationale/acceptance, không coi artifact là design mới đã approve |
| Controls / layout | Theme owns visuals; GeneratePress parent read-only, Woo/WP own native queries | Inventory enqueue/CSS specificity/page-display controls và1.3.22–23 ownership trước chọn implementation |

## 3. Scope dự kiến để thảo luận

**WooCommerce:** Shop/product archive và product category/tag sử dụng native archive route. Audit banner/title/description, breadcrumb nếu đang có, grid/card image-title-data/CTA, result count/order/pagination, sidebar/filter hiện hữu, responsive và empty/no-image/long-title. Không tự thêm filters/facets/search backend; phải xác định surface nào site đang expose trước khi chốt.

**Blog:** posts index (Reading settings) và category/tag trước; author/date là regression nếu dùng chung template, không tự redesign mọi CPT/search. Audit banner/intro, featured policy (first page only hay mỗi page — chưa chốt), card metadata/excerpt/thumbnail, categories/sidebar, pagination và empty state. Không nhân bản query để giả archive nếu native main query đã đủ.

**Ranh giới:** theme `skvn-marine` sở hữu layout/tokens/visual hook adapters; WooCommerce/WordPress giữ routing/main query/order/pagination/canonical data. Plugin Collections vẫn owner query của các block riêng theo decision đã có; không thay native archive bằng Product/Post Collection block để lách template. Nếu cần tool/behavior plugin mới, lập decision riêng. Không sửa GeneratePress/Woo/external plugins, không custom SQL, không mở archive builder/faceted filtering deferred2.x hoặc đổi quote flow/giá/catalog policy ngầm.

Checkpoint ban đầu chưa chọn layout; human đã cập nhật hướng Woo desktop/tablet tại§9. Màu/typography chi tiết và controls UI vẫn là proposal; không áp mint Spacer/editor frame lên frontend archive. Dùng tokens/design hiện hữu làm baseline. Không thêm animation trong scope repair nếu chưa có yêu cầu riêng.

## 4. Execution outline khi được duyệt start

| Phase | Công việc | Exit artifact |
|---|---|---|
| A0 — intake | Thu URLs Shop/category/tag, posts index/category/tag; WP/Woo/GP/theme/plugin versions, Reading/permalink settings, ảnh desktop/mobile và mô tả lỗi mong đợi | Route → template/hook → query → stylesheet owner map; defect IDs có expected/actual |
| A1 — baseline | Đọc plan025/decisions liên quan,1.3.22–23 và CSS safety; inspect DOM/computed styles/rect/query page1/page2+ | Tách lỗi source, runtime, dữ liệu và design proposal; không quy lỗi bằng screenshot một surface |
| A2 — direction | So 2–3 phương án khi có lựa chọn kiến trúc/layout; ưu tiên sửa hooks/template child hiện hữu, không thay query owner | Mockup Woo + Blog ở desktop/mobile, quyết định sidebar/featured/card/content states; SemVer/predecessor/start được human xác nhận |
| A3 — Woo repair | Sửa lát cắt scoped theo defects duyệt, giữ Woo query/order/links/quote contract | Source + runbook Woo; URL params/page2/no-results/native hooks kiểm được |
| A4 — Blog repair | Sửa template/style/enqueue scope và posts-index parity nếu cần; giữ native query/pagination | Source + runbook Blog; featured không mất/trùng item, đúng page counts |
| A5 — regression / handoff | Human build/lint cần thiết và onsite; geometry/a11y/performance/basic routing regression, save settings nếu có controls | Evidence theo từng ID; không tự publish/deploy/mark milestone PASS |

Đến A0 tạo `docs/testing/archive-repair-1.3.x.md` với exact URLs, setup/data fixtures, steps/expected/pass-fail/evidence; rename theo version sau khi được chốt. Chưa cần human chạy test trên spec chưa có implementation. Không yêu cầu cung cấp credentials trong docs.

## 5. Acceptance draft — chưa implementation / chưa runtime evidence

| ID | Nhóm | Hành vi mong đợi / states | Cách kiểm / evidence |
|---|---|---|---|
| AR-WOO-UI01 | Block UI | Shop và taxonomy hierarchy rõ; cards/CTA nhất quán; long title/no image/empty không vỡ | URL/build, desktop/mobile screenshots, CTA destination/product id |
| AR-BLOG-UI01 | Block UI | Posts index và category/tag theo design duyệt; featured/sidebar/mobile rõ; empty/1/many posts | Route fixtures + mockup đối chiếu; ảnh page1/page2+ |
| AR-UI02 | Block UI | Không tràn ngang, width một owner, ảnh ổn định, keyboard/focus/heading/link labels dùng được | Scrollbar desktop,390px/zoom200%, rect/scrollWidth, keyboard video; accessibility theo surface |
| AR-ED01 | Editor UX | Nếu có existing archive controls: label/owner/default rõ và preview/save phản ánh đúng. Nếu không có editor surface thì N/A có rationale | Settings/Customizer inventory → change/save/reopen/frontend; không hứa Gutenberg canvas edit native archive |
| AR-TECH01 | Technical | Native queries/routes/order/page totals đúng, không missing/duplicate do featured split, không reset taxonomy/filter params | Ghi IDs/query/page params page1/page2/last/empty; pagination links và refreshed URL |
| AR-TECH02 | Technical | Woo quote CTA/product identity đúng; không đổi single/cart/account/quote flow ngoài scope | Native Woo archive + quote smoke, regression single product/post và controls1.3.22–23 |
| AR-TECH03 | Technical | CSS/enqueue scoped, sanitize/escape/i18n phù hợp; không thêm query/JS/assets toàn site vô cớ | Diff/loaded handles/network/console; inspect no-archive pages, baseline performance rồi mới kết luận |

Mọi ID **Chưa làm**. Content & States và Acceptance & Evidence áp riêng Woo/Blog; không coi source hay design approval là PASS. Mốc implementation không tự đóng carry acceptance1.3.5 hoặc các milestone khác.

## 6. Open discussion log

| Date | Topic | Decision / status |
|---|---|---|
| 2026-11-06 | Human yêu cầu hai archive repair trong1.3.x, tạo file thảo luận trước | Đã lưu; chưa code/start/version |
| 2026-11-06 | Predecessor | Đề xuất sau1.3.23; human chưa chốt |
| — | URLs + pain points; Woo routes thực dùng; Blog posts-index mapping | Chưa có |
| — | Giữ Style C Hybrid hay đổi layout; featured policy; sidebar/filter scope | Chưa chọn, research theo evidence A0–A2 |
| — | SemVer / start / acceptance cuối | Chưa chốt, phải xác nhận trước coding |

Các thảo luận tiếp theo bổ sung vào file059 này; cập nhật rationale và superseded decisions thay vì chỉ ghi kết luận rời khỏi context.

## 7. Grouper intake — báo cáo browser do human cung cấp (2026-11-06)

Target: **https://minhhaifishery.com/product-category/grouper/** (bỏ dấu phẩy cuối link chat). Nguồn: file đính kèm `Pasted text.txt` trong chat2026-11-06; agent có điều khiển browser, báo viewport1920×998 và đã reload. Không có ảnh/DOM/computed-style dump/build/version đi kèm báo cáo; nhận là **external agent-reported onsite evidence**, không phải root-agent tự tái hiện. Web fetch của root không truy cập được URL, không suy site down từ lỗi công cụ.

| ID / nhóm | Expected → reported actual | Phân loại / follow-up |
|---|---|---|
| AR-GR01 / Block UI + Technical | Grid/card có bề rộng đọc được → hai card khoảng35px trong content khoảng1185px; tên/CTA gãy dọc; còn lỗi sau reload | FAIL theo agent report, ưu tiên cao nhất; root cần DOM/rect/cascade để chốt nguyên nhân trước sửa |
| AR-GR02 / Block UI | Header sticky đọc rõ, nội dung không xuyên chữ → sản phẩm nhìn xuyên header khi scroll | Reported FAIL, shared header scope riêng; không gộp vào product repair nếu chưa duyệt |
| AR-GR03 / Editor/config UX | Navigation production rõ →13 links gồm test/cart/account và trùng Home | Config/content report; không tự sửa menu production hoặc suy thiếu cart icon là bug của catalogue B2B |
| AR-GR04 / Block UI + data | Fallback image rõ/đúng policy → placeholder navy chữ mờ, không ảnh thật | Tách missing media khỏi layout. Không giá và quote-only không tự là bug; policy phải dựa quyết định catalogue |
| AR-GR05 / Block UI | Footer headings đọc được → báo hidden dù có DOM | Shared footer style report, ngoài product focus; nội dung/footer branding do human xử lý theo trao đổi đính kèm |
| AR-GR06 / Content | Category description hữu ích nếu có dữ liệu → không mô tả dướiH1 | Chưa biết dữ liệu trống hay renderer ẩn; không bịa nội dung, không coi empty dữ liệu là source failure |

Report ghi breadcrumb/H1 đúng; count2 results; chọn latest đổi `?orderby=date`, order sản phẩm và label; desktop không overflow. Ghi là **reported working trong fixture2items**, không tổng quát PASS pagination/filter/mobile. Không có pagination với2items không tự là lỗi. Mobile390px **chưa kiểm**. Report cũng thấy preloader teal/spinner mỗi navigation; không kết luận performance hoặc sửa loader trong archive scope.

Source đối chiếu: theme `style.css:4297–4310` đặt `.woocommerce ul.products` thành grid4columns, nhưng rule `li.product` tại đó chưa reset native width/margins/float. Checkpoint ban đầu là giả thuyết legacy Woo widths/margins hoặc pseudo-elements; **width conflict đã được human xác nhận bằng computed evidence tại§8**, còn pseudo-elements chưa kiểm. Scope selector hiện khá rộng, cần regression related-products/single trước sửa.

## 8. Human computed-style evidence — grid width conflict (2026-11-06)

Human gửi DOM3cards (544private,545/546publish) và hai ảnh DevTools. Card rect≈38.1333×730.85px, content≈36.1333px sau border, float:left, margin-right≈50.864px. Parent `ul.products.columns-4` rect740×797.717px, display:grid từ theme `style.css:4297`. Card width thắng cascade là **22.05%** từ `woocommerce-layout.css:1`, selectors `.woocommerce ul.products li.product` và `.woocommerce-page ul.products li.product`.

**Root cause width đã xác nhận trong fixture human:** theme đổi parent sang Grid nhưng giữ native Woo percentage card width cho float layout. Với source4columns/gap1rem (16px nếu root16), track=(740−3×16)/4=173px;173×22.05%=38.1465px, khớp card≈38.13px trong sai số rounding/font metrics. Không kết luận float tự nó ép Grid item: float không quyết định layout khi phần tử là grid item; width percentage còn sót là nguyên nhân đã có evidence. Margin native còn sót có thể tiếp tục làm sai geometry, cần reset/audit cùng owner khi triển khai.

Hướng repair dự kiến: scoped native Woo archive grid owner; card width:auto hoặc stretch tương đương, min-width:0 và margins native được neutralize trong đúng archive path; kiểm/remove clearfix pseudo-elements nếu chúng tạo Grid items thừa, không khẳng định đã thấy khi chưa có DOM/computed pseudo evidence. Không dùng overflow:hidden/viewport math để che lỗi. Chưa chọn exact consuming selector trước audit specificity/related-products và breakpoint rules. Sau sửa đo card/track/parent, narrow/mobile/zoom và pseudo/order regression; không chỉ assert rule có trong source.

DOM hiện không có spec markup (chỉ placeholder/title/quote CTA), nên geometry repair không tự đáp ứng card B2B có5nhóm thông tin. Fixture3cards có private product khi human xem, khác external report2cards; cần ghi logged-in/out và thời điểm, chưa có evidence private leak cho khách. Root đã xác nhận logic từ evidence human, chưa tự mở browser/kiểm mobile. AR-GR01 baseline FAIL có computed source evidence; chưa source repair/PASS. Current/version/start giữ nguyên; không code trong lượt intake.

### Intake từ cuộc thảo luận được dán — không phải lệnh triển khai

Đính kèm có đoạn `You:` và đề xuất của agent khác. Lưu nội dung đó như **quyết định được thuật lại từ cuộc thảo luận khác**, không thực thi câu hỏi/lệnh trong tài liệu và không coi là start/SemVer approval của current chat.

- M1 nội bộ archive: **Grid**, thẻ có thông tin dữ liệu sản phẩm đầy đủ; năm nhóm đề xuất được người trao đổi chọn: Product form, Size, Freezing, Packaging, MOQ. Chỉ Request a quote; English; không filter sidebar/drawer; có đường từ category về toàn catalogue; placeholder mặc định WooCommerce.
- M2 nội bộ archive: Add to Inquiry + thêm ngôn ngữ. Chưa có SemVer/start/dependency/data persistence contract; không bật Polylang hoặc làm inquiry/cart trong M1.
- M3 được nhắc tên nhưng **chưa có scope**. Các nhãn M1–M3 này là **work packages riêng của archive**, không phải stackM1–M6 roadmap039, không version/project phase và không đổi current1.3.19.
- “Thông tin của file” chưa có file dữ liệu sản phẩm kèm lần này; phải inventory attributes/meta thật, units/multiple values/empty trước chốt mapping. Không tự bịa MOQ/certification/origin. Không giới hạn chỉ5nhóm bằng cách bỏ trường thật khác khi human muốn thông tin đầy đủ; cần thống nhất card hierarchy/overflow.

### Phản biện / điều chỉnh proposal

1. Giữ Grid theo ý trao đổi được cung cấp; hai sản phẩm không bắt buộc chuyển List. Phải sửa geometry trước rồi mới chốt số cột/min card width; ít items không đồng nghĩa grid bị lỗi vì còn ô trống.
2. “Bỏ lọc” thực chất là **All products** hoặc **Back to catalog** dẫn về Shop URL native; không quảng bá là Clear filters nếu không có filter UI. Query/order/page reset policy khi chuyển route cần được chốt; không hard-code `/shop/`.
3. Full information cần dữ liệu có thật và thứ tự đọc rõ; spec thiếu không hiện giá trị giả. Scientific name/certifications hay5nhóm là mapping cần audit, không thêm taxonomy/schema mới chỉ để đủ mockup.
4. Woo default placeholder cần kiểm hook hiện có `woocommerce_placeholder_img` trong theme: override navy đang tồn tại. Phải chốt chỉ đổi archive hay đổi mọi Woo surfaces để không ngầm thay single/related; không xóa global hook mù quáng.
5. Filter drawer, Grid/List switch, trust strip/SEO text/sales CTA mới, Add to Inquiry và đa ngôn ngữ trong proposal agent **không tự nằm trong M1**. Không chuyển các gợi ý này thành acceptance được duyệt.

Runbook/evidence intake: `docs/testing/archive-repair-1.3.x.md`. Next: audit DOM cascade/route/assets + product field mapping, sau đó mockup Grid theo dữ liệu thật; vẫn planning, predecessor sau1.3.23 chỉ là đề xuất, SemVer/start chưa chốt. Blog giữ work package riêng, chưa có evidence từ trang sản phẩm để suy lỗi Blog.

## 9. Woo layout decision và execution planning — 2026-11-06

### 9.1. Decision / authority

Human sửa bản terminal: **desktop dùng sidebar category bên trái**, bố cục category navigation phía trên grid phù hợp **tablet**. Human yêu cầu lưu và planning chi tiết. Proposal desktop horizontal cũ bị superseded: nó chưa tách layout desktop/tablet và dành toàn chiều ngang cho grid.

- Áp native Shop và product category; product tag cần audit route thực dùng. Blog giữ work package/design riêng.
- Sidebar chỉ điều hướng category bằng links, không attribute filters/facets. Intake§8 “không filter sidebar” không cấm category sidebar vừa được chọn.
- M1 quote-only, M2 inquiry/second language giữ riêng. Lượt này chỉ docs, không start archive/current1.3.19, không gán1.3.24/bump/deploy.
- Chốt cấu trúc desktop/tablet; widths, breakpoints, columns, mobile disclosure, exact colors/type và sticky sidebar vẫn là proposal, không coi lời đề xuất của agent là human approval.

### 9.2. Anatomy và constraints

```text
DESKTOP
Header → Breadcrumb → H1 + introduction
[ Category sidebar trái ] [ Result count + native sort ]
[ All products / tree   ] [ Product grid → pagination  ]
Approved long copy (optional) → Contact sales → Footer

TABLET
Breadcrumb → H1 + introduction
Category navigation trên grid → toolbar → grid → pagination
Optional copy → Contact sales → Footer

MOBILE — proposal chờ duyệt
Category disclosure + current category → stacked toolbar
One-column grid → pagination → sales → footer
```

Mockup starting values: theme wide token (fallback1200px), sidebar220–240px/gutter32px, gap card24px, padding20px/radius8px; desktop3/tablet2/mobile1columns. Đây chưa là final rules. Ví dụ1200−240−32=928px cho main;3tracks/gap24 cho card≈293px. Đối chiếu title/spec/CTA thật rồi chọn ngưỡng, không ép card hẹp để giữ sidebar. Container mode transitions và column transitions xét riêng; không sao chép breakpoint768/1024 của Spacer ngầm. Ít items/count-based columns còn chốt.

Theme canvas owns outer width, archive shell owns sidebar/main split, product list owns tracks. Không100vw/margin âm/overflow-x hidden để che lỗi. Main/card shrink được; legacy Woo22.05% không được còn điều khiển card grid. Sidebar không sticky trong baseline proposal; sticky chỉ làm khi có yêu cầu và kiểm header/footer/focus.

### 9.3. Task breakdown / dependencies / evidence

W01–W10 **Chưa làm** về implementation; cấu trúc§9.1 đã được human chọn. Mỗi task giữ Content & States và Acceptance & Evidence dưới đây.

| ID / Nhóm | Công việc / states | Đầu ra / cách kiểm |
|---|---|---|
| W01 / Technical | Audit Shop URL/settings, taxonomy routes/template/hooks, existing GP sidebar/widgets, cascade/breakpoints/versions/container | Route→owner→hook→asset map, strongest selectors; không duplicate sidebar hoặc tắt sidebar toàn site. Dùng lại computed evidence§8, không bắt human thu lại cùng rule. |
| W02 / Editor UX + Technical | Inventory category tree/order/empty/count, five spec keys/units/multi-values, descriptions và CF7 mappings | Field→owner→display policy; dữ liệu thật, không tạo schema cho giống mẫu. Native product/category editors giữ ownership; không thêm archive Gutenberg editor. |
| W03 / Block UI | Cập nhật HTML demo theo desktop sidebar/tablet top nav/mobile proposal; fixtures ít/nhiều/nhóm con/tên dài | Mockup1440/1280,1024/768,390/320; đây là test widths, không tự là breakpoints. Chốt mobile interaction, taxonomy/column/count policies trước production. |
| W04 / Block UI + Technical | Implement archive shell; neutralize Woo width/margins đúng scope; inspect clearfix pseudo-elements/min-width/responsive rules | Card stretch đúng track; rect/cascade trước–sau, pseudo evidence, scrollbar geometry. Không áp archive grid lên single/related/cart/account. |
| W05 / Block UI + Technical | Native category links/All products lấy Shop API; active/current/ancestor; hierarchy/empty/long names | Named navigation landmark, aria-current cho current link, ancestor khác current. Chuyển category reset page; ghi policy giữ/reset order trước coding, không mang params vô hiệu. Không custom query/filter JS. |
| W06 / Block UI + Technical | Responsive di chuyển cùng navigation; tablet wrap/overflow và mobile interaction theo mockup duyệt | Không duplicate focusable lists. Nếu disclosure: button, aria-expanded/controls, Enter/Space; focus hợp lệ khi resize. Normal nav links, không role=menu. Nhiều category không đẩy grid xuống quá xa. |
| W07 / Block UI | Card image4:3/five specs/title/quote/details; count/sort/pagination/intro/empty/sales |0/1/2/3/4/5/many/page2 fixtures; no image/spec, long/multiple values. Không bịa MOQ, không cắt title/spec để ép chiều cao. Native query/count/pages đúng. |
| W08 / Block UI + Technical | Apply theme color/type tokens, scoped hover/current/focus/disabled khi có | Palette/type mockup và contrast trên resolved values; zoom200%, current/focus không chỉ dựa màu; không global heading/button override, font CDN hoặc animation mới. |
| W09 / Block UI + Technical | Quote CTA/general enquiry tái dùng CF7/CFDB7; invalid context/form/failure/success | ID/URL validated, failure giữ input; general quote không mang product cũ. Submission/storage/mail evidence riêng. Structured quantity/unit/port chỉ sau schema decision; không tự modal/backend mới. |
| W10 / cả ba nhóm | Review source; human build/lint nếu cần và onsite runbook; regression/evidence | Giữ AM1/AR/AL IDs; screenshots/rect/query IDs/keyboard/quote theo build. Source/build không tự là runtime PASS; resolve FAIL trước human nghiệm thu. |

W01–W03 là audit/design chuẩn bị. W04–W10 chỉ làm sau exact SemVer/start approval; W04–W06 layout/navigation baseline đi trước polish W07–W08. W09 không mở rộng backend để chặn geometry repair. Blog cần intake/mockup riêng. Không yêu cầu duyệt lại desktop sidebar/tablet direction đã chọn.

### 9.4. Visual specification — proposal chưa duyệt cuối

Source màu: theme.json presets → style.css bridge → Customizer overrides. Hex dưới là fallback source hiện có; kiểm resolved values, không lấy mã manual lịch sử làm source duy nhất.

| Thành phần | Đề xuất |
|---|---|
| Page/card | White, border nhạt đề xuất#E2E8F0 (map token/scoped role sau audit), radius8px, không bóng đậm |
| H1/product names | Navy blue950#082F49 |
| Body/spec values | Slate700#334155 |
| Primary CTA | Blue700#0369A1 + white; hover blue900#0C4A6E; không mint/gold CTA chính |
| Category current | Sky50#F0F9FF, navy/blue text, leading marker + semibold. Normal white/slate; hover phân biệt current |
| Sales support | Mint100#DDFAF4 + navy; gold chỉ verified premium/certification |
| Focus | Visible outline/offset, contrast đủ với màu thực, không clip, không animation mới |
| Font | H1 theo theme heading/Customizer; product names/spec/UI đề xuất body/UI sans token; không import Barlow/CDN hoặc đổi font toàn site |
| Type sizes | H1 desktop40/mobile30; product name20/18 semibold; intro17/16 line-height1.6; spec label13 medium/value14; controls14–15. Mockup targets cần readability/zoom check |

Category desktop là danh sách chữ, không dãy card/nút lớn. Nhóm con indentation vừa phải; hierarchy sâu phải vẫn tới được route. Không tự thêm count badges/collapse tree khi policy chưa chốt.

### 9.5. Acceptance bổ sung và decisions còn mở

| ID / Nhóm | Expected | Steps / evidence |
|---|---|---|
| AL-01 / Block UI | Desktop sidebar trái, tablet nav trên; grid đọc được | Shop/Grouper screenshots và container/sidebar/card rect, đối chiếu mockup duyệt |
| AL-02 / Block UI + Technical | Current/ancestor/All products đúng, tree/empty/long names dùng được | Native URL + taxonomy fixtures, keyboard/aria-current; page/order reset policy được ghi và kiểm |
| AL-03 / Block UI + Technical | Resize/zoom giữ access/focus, không nav trùng | Breakpoint đã chọn±1px, zoom200%, Tab/Enter/Space và mở/đóng nếu disclosure được chọn |
| AL-04 / Block UI + Technical | Không overflow/clip; cards/count/order/page2/CTA đúng |320/390/768/1024/1280/1440 samples + desktop scrollbar; scrollWidth≤clientWidth, rect/title/spec/CTA; IDs/pages/quote URLs |
| AL-05 / Editor UX | Native category/product edits phản ánh đúng, không chỉnh layout mỗi item | Edit→save→frontend trong test environment được phép; không tự mở new editor controls |
| AL-06 / Technical | Không regression single/related/Blog/header/footer hoặc tải JS toàn site vô cớ | Before/after route matrix, handles/network/console, quote smoke và logged-in/out visibility |

AL-01–06 **Chưa làm / chưa kiểm chứng**; bổ sung AM1-02 và AR-WOO-UI01/AR-UI02/AR-TECH01–03, không thay acceptance gốc.

Còn chọn qua mockup: container thresholds/columns/count basis, tablet overflow/mobile interaction, category depth/order/empty/count, ancestor/current presentation, sort policy khi đổi category, missing-spec wording, placeholder scope, palette/type cuối. Exact SemVer/predecessor/start vẫn phải xác nhận trước production implementation; current1.3.19 không đổi.

## 10. Execution — Woo Archive M1 chung1.3.20

Shared-card update2026-11-07: human duyệt060, sửa ảnh **1:1** trước code; ratio controls để scope kế tiếp060§12. Presenter/card-only assets/native theme adapter có source; grouped specs/tags/MOQ/quote, fallback5rows cũng1:1. Full values default, claims opt-in verified.060§11/runbook ghi7CSS modelPASS; PHP/integration/build chưa kiểm. Supersede enhanced five-row/4:3 checkpoints bên dưới, không xóa query/scope/fallback acceptance.

Design delta proposal2026-11-07: human muốn reuse thiết kế Product Carousel vì archive card đơn điệu, yêu cầu **plan để duyệt**, chưa code delta. [Plan060](060_VER_1_3_20_ARCHIVE_PRODUCT_CARD_REUSE_PLAN.md) có evidence grouped specs/tags/+N, shared presenter/assets + theme adapter/fallback, content changes/acceptance/approval bundle. Five-row source§10 giữ baseline tới khi duyệt;16model PASS không nghiệm thu card mới. Scope đề xuất vẫn1.3.20/current1.3.19 không tự chuyển.

Human2026-11-06 yêu cầu thực hiện và trả lời version “chung với1.3.20”. Bổ sung scope vào version Category đang có, không chiếm version mới; giữ ngoại lệ numbering1.3.20, không đổi SemVer rule. Current1.3.19 chưa được human đóng/chuyển, source addition ngoài current theo precedent Category commit7ef45ff; metadata không bump. Blog/M2 chưa start.

### Source / defaults cần visual review

- `inc/woocommerce.php`: native before/after shop loop và empty branch tạo nav/results shell. Woo giữ template/query/count/order/pagination/notices. Shop URL/term links native; đổi category reset page/order về default, không carry params. Một taxonomy query, tree grouped trong bộ nhớ; alphabetical, giữ empty categories, không counts/collapse/sticky. Current aria-current, ancestor class; lỗi terms không phá trang.
- Spec5rows từ visible attributes, aliases form/product-form, size, freezing, packaging/pack/packing, moq; taxonomy term names/custom options. Giữ toàn bộ values/deduplicate/escape. MOQ fallback `_skvn_moq` theo source hiện hành. Thiếu hiện “—”/accessible Not specified; aliases filter phục vụ mapping sau audit thật, không thêm schema. Spec priority7 sau native link-close5, trước CTA10; details20 có product name accessible. Archive quote bỏ AJAX-cart classes để Woo không chặn navigation.
- Native Woo placeholder chỉ archive, global single/related fallback không đổi. Price/rating chỉ ẩn trong direct native archive grid, không gỡ hooks toàn request.
- `style.css`: body + shell scoped; reset legacy width/margins/float/min-width và clearfix tại owner; ảnh4:3,5specs, blue CTA, focus, no new animation. Không thêm runtime include/require/dependency/JS/font; packaging hiện copy toàn theme.
- Container implementation defaults: site-main inline container; dưới620px1col, từ620px2col, từ1120px sidebar240px/gap32, từ1180px3col. Dùng container thực, không viewport/device name; theme wide token. Unsupported container queries fallback stacked/one-column. Kiểm GP padding/site main width trước kết luận desktop threshold đúng.
- Mobile/tablet dùng một navigation thật, wrap/nested tree visible. **Chưa thêm mobile disclosure** do interaction chưa được chọn; nhiều/deep category cần human visual review, không tự PASS nav chiều cao lớn.
- Introduction/description/breadcrumb/header giữ native; chưa tự split long description xuống dưới hoặc thêm copy/trust giả. Generic sales CTA tới quote page có sẵn; không đổi CF7 schema/handler/backend.

### Evidence / gaps

Official source inspected: https://woocommerce.github.io/code-reference/files/woocommerce-templates-archive-product.html (template version8.6.0, reference generated2026-10-09). before_shop_loop→native loop→after_shop_loop hoặc no_products_found; count/order/pagination vẫn native. Đây không phải xác nhận Woo major onsite: checkout không có Woo/GeneratePress runtime. Cần ghi installed versions/overrides trước integration acceptance, không dùng reference làm installed-version premise.

`tools/tests/woo-archive-m1.test.php` chuẩn bị16mock checks: scope/shortcode guard, visible values/taxonomy/errors/MOQ precedence, current/ancestor/escaping/cycle và native placeholder. **Chưa chạy**: shell không tìm thấy PHP; không retry WSL/build/lint. Mock không prove actual hooks/DOM/GP/geometry. Human commands trong runbook; agent không chạy build/lint theo AGENTS.

Evidence update2026-11-07 (supersedes model pending trên): human đã gửi **16/16 mock checks PASS**, đúng các case suite và dòng kết `16 checks passed (mocked model only).` Ghi human-reported, không agent-run. Không có PHP version/exact build/commit hoặc lint output; lint và actual Woo/GP/geometry/query/quote vẫn Chờ kiểm chứng. Không cần model rerun nếu source không đổi. Runbook lưu scope/evidence; chưa PASS AM1/AL/AR integration hoặc đóng1.3.20.

Audit W01/W02 một phần: functions.php đã include Woo module, không thêm template override; page-display-controls baseline chỉ force no-sidebar single/pagecanvas, nay archive filter50 riêng. Legacy grid source4297 + human native22.05% đã xác nhận. Source W04–W08 đã thêm; W09 chỉ reuse quote navigation; W10 onsite chưa làm. Không đánh toàn bộ W01–W10/AM1/AL/AR PASS.

Còn kiểm/làm tiếp theo evidence: real taxonomy/spec mapping/empty/many/page2, mobile nav height/disclosure decision, below-grid long-copy split nếu human chọn, actual sort options, loaded CSS/GP geometry, full quote states/submission evidence. Chưa deploy/commit; Blog/M2 không thay.

## 11. Hotfix — heading cùng hàng result count / sorting (2026-11-07)

**Audit correction2026-11-07:** implementation flex bên dưới không đạt horizontal alignment: count lệch +192px so với product column. HF-HDR-01 **FAIL** về trục ngang; không đánh cả gói PASS từ việc controls đã được nâng lên. Repair riêng tại§12; UX mobile proposal riêng tại§13. Giữ phần execution lịch sử bên dưới để truy vết.

**Human đã xác nhận layout và cho triển khai trong current1.3.20**, yêu cầu ghi mục trong plan cũ, không tạo file plan mới. Screenshot Grouper2026-11-07 cho thấy H1 đứng một hàng riêng, result count/sort ở hàng dưới bên trên grid, tạo khoảng trống không cần thiết. Mục tiêu là nâng **Showing all results + Default sorting** ngang H1 Grouper; sidebar Categories vẫn bên trái, không chuyển sidebar lên heading hoặc redesign card.

```text
Grouper          Showing all 3 results                 [Default sorting ▾]

Categories       [Product card] [Product card] [Product card]
```

### Công việc / owner

1. Theme `inc/woocommerce.php`: bọc native Woo archive header bằng một heading row qua public `woocommerce_shop_loop_header`; giữ native H1/title filters/descriptions. Render native result-count/ordering trong row đó. Chỉ chuyển callbacks thực sự đang đăng ký, không ép hiện control mà site đã tắt.
2. Thay hai anonymous toolbar wrappers bằng named helpers. Dùng guarded dispatchers để không render toolbar/count/sort lần nữa ở before_shop_loop sau khi heading row đã render; embedded shortcodes và non-archive contexts vẫn gọi native callbacks như cũ.
3. Nếu native header hook/callback không có hoặc custom template không gọi header hook, giữ toolbar vị trí cũ làm fallback, không làm biến mất controls. Empty archive không hiện toolbar giả; notices/native query/pagination/form GET semantics giữ.
4. Theme `style.css`: heading row theo width owner hiện có, normal flow/flex wrap; title/count/sort cùng baseline khi đủ chỗ. Card grid không còn margin dành cho toolbar cũ, sidebar giữ. H1 dài/description thật và mobile có thể xuống dòng; không fixed height/cắt chữ, margin âm, absolute positioning, viewport math hoặc overflow mask. Không JS/bundle mới.
5. Bổ sung steps/evidence vào runbook archive hiện có; không thêm file plan/test mới cho hotfix hẹp. Review source/diff nhanh; PHP lint và onsite geometry do human theo AGENTS. Không build/lint qua agent, không bump version/commit/deploy tự động.

### Acceptance / evidence

| ID / Nhóm | Expected / states | Hiện trạng / cách kiểm |
|---|---|---|
| HF-HDR-01 / Block UI | Desktop Grouper H1 + count + sort cùng hàng, cards bắt đầu cao hơn do bỏ hàng toolbar riêng; Categories vẫn trái | Baseline screenshot FAIL về spacing; sau sửa so cùng viewport và image/grid rect; phải thấy đúng một count/form |
| HF-HDR-02 / Block UI | Long H1/description, narrow320/390/tablet/zoom200% wrap tự nhiên, không tràn hoặc che chữ/controls | Kiểm heading/control/card rect + scrollWidth≤clientWidth; descriptions không mất, focus/labels dùng được |
| HF-HDR-03 / Technical | Count/order/page/query/selected option/hidden fields/notices giữ native; empty/custom-template/shortcode fallback không mất controls hoặc duplicate | So URLs/IDs/count/order/page2, one GET form, default/latest; native hook support source guard và onsite versions ghi rõ |
| HF-HDR-04 / Editor UX | N/A new editor UI; native category title/description edits vẫn phản ánh heading | Không thêm control/settings; nếu có data edits trong test env, save→frontend đúng |

**Status: đã duyệt hướng, chưa source/onsite tại thời điểm viết plan.** Source approval không runtime PASS. Pha này chỉ hotfix header/toolbar; giữ AC/AM1/AL/AR/carry acceptance, card1:1 và ratio follow-up riêng.

Execution2026-11-07: đã thêm source theme PHP/CSS theo mục trên; không tạo file mới. Setup phát hiện priority native `woocommerce_product_taxonomy_archive_header`, bọc header ở priority−1/+1, chỉ chuyển count/ordering callbacks có sẵn; guard dispatchers giữ shortcode/custom-template fallback. Native header/descriptions vẫn render chính nó, không clone H1/form hoặc rewrite template. Heading row flex baseline/wrap; dưới619px container xếp dọc, title/description/controls không fixed height. HF-HDR-01–03 **Đã có source / Chờ kiểm chứng**; HF-HDR-04 N/A new Editor UI. Source reference official Woo archive-product.php + loop/header.php template8.6.0 (https://github.com/woocommerce/woocommerce/tree/trunk/plugins/woocommerce/templates), không xác nhận installed Woo version. Không chạy PHP lint/build hoặc onsite, không commit/deploy/bump. Human lint functions.php/inc/woocommerce.php và test runbook; screenshot baseline là evidence UX request, không PASS tất cả archive features.

## 12. Hotfix riêng — sửa trục heading / toolbar (2026-11-07)

Status: **Human duyệt thực hiện2026-11-07; Đã có source / Chờ kiểm chứng** trong current1.3.20, không bump/file plan mới. Lệnh “Thực hiện” sau proposal áp dụng cả repair§12 và mobile§13.

### Evidence / State Delta

Audit agent trang thật https://minhhaifishery.com/product-category/grouper/, logged-out2026-11-07; tọa độ CSSpx, không suy installed versions/release commit từ URL.

| Viewport | Evidence |
|---|---|
|1280×720 | H1/sidebar left72.5; products/first card left344.5; count left536.5: **delta+192px**. Sorting/grid right1192.5. Header width432; computed flex header1 1 224px, toolbar1 1 448px. Body sidebar240px+gap32px. |
|1024 wide | Count left408.5 vs products left40; categories đã chuyển thành top navigation. Không áp sidebar track xuống mode này. |
|390 wide | Count/card left30; H1→count→sort→categories→cards.11categories chiếm4hàng/216.5px; card đầu top600.48 trong snapshot. |

clientWidth=scrollWidth lần lượt1265/1009/375: không tràn ngang không đồng nghĩa đúng alignment. Desktop sidebar/card top cùng338.02. Vertical lifting hoạt động, horizontal tracks sai. Ảnh1:1/grouped specs/CTA chưa thấy regression trong audit hẹp. Public2products vs screenshot logged-in3 là private visibility, không chứng minh query lỗi. **HF-HDR-01 FAIL về trục ngang**; acceptance khác chưa được suy PASS.

### Repair / owner / thứ tự

1. Audit scoped cascade; sửa theme `style.css`. Sidebar width240px và gap32px có chung variables/owner; heading row và body grid cùng consume, cùng width/max-width/box-sizing và cùng container threshold1120px. Không thêm viewport width owner.
2. Desktop sidebar mode: heading grid `240px minmax(0,1fr)` qua shared variables, header cột1/toolbar cột2. Bỏ flex-basis14rem/28rem trong cùng patch. Toolbar nội bộ count-left/sort-right, wrap được. Không margin âm/offset/absolute/transform hoặc overflow mask.
3. Dưới sidebar threshold: H1/description full-width hàng riêng, toolbar full-width hàng kế. Khi đủ chỗ count-left/sort-right; narrow wrap/stack. Đây là responsive repair đề xuất; không ngầm giữ desktop sidebar space. Không đổi product-column thresholds620/1180 chỉ để sửa toolbar.
4. Giữ native H1/description/count/order/form và guarded hook/fallback§11; không rewrite PHP đang nâng toolbar đúng nếu chưa có hook defect evidence. Tên dài/description wrap tự nhiên, không fixed height/ellipsis. Không đổi plugin, query, visibility, category routes, quote, card1:1 hoặc skeleton; không JS cho alignment.
5. Update runbook, self-review diff; human kiểm đúng delivered stylesheet/geometry. CSS-only hotfix không cần plugin rebuild. Nếu phát sinh PHP, human lint theo AGENTS. Không tự commit/deploy/bump, không claim source là runtime PASS.

| ID → Nhóm | Expected / states | Hiện trạng → Kiểm / evidence |
|---|---|---|
| HF-AX-01 → Block UI | Count.left=firstCard.left; sort.right=grid.right; H1.left=sidebar.left, tolerance≤1CSSpx | FAIL+192px → rects1280/1440 cùng frame, screenshots/CSS URL/version. |
| HF-AX-02 → Block UI | Header/body cùng sidebar mode; below threshold H1 rồi full-width toolbar; không clip/overflow | Chưa làm → actual container1119/1120/1121px,320/390/768/1024, long title/description, zoom200%; không nhầm viewport/container. |
| HF-AX-03 → Technical | Một count/form, native sort/query/GET fields/fallback giữ | Chờ kiểm chứng → Shop/category/tag/empty/custom-header/shortcode theo HF-HDR-03. |
| HF-AX-04 → Editor UX | N/A new controls | Native data editing giữ; không đổi plugin EditorUI. |

Giữ HF-HDR-02/03 và AL/AM1/AR/AC cũ. Pitfall AP-11 ghi lỗi agent. Rollback chỉ track-sizing patch, không tháo card/API/native hook khác.

## 13. UX mobile/tablet — category disclosure proposal

Status: **Human duyệt thực hiện2026-11-07; Đã có source / Chờ kiểm chứng**, acceptance riêng với§12. Current1.3.20. Memo/default bên dưới giữ lịch sử proposal; lệnh start supersede default chờ duyệt.

### Decision Memo

1. **Vấn đề:** List category luôn mở chiếm216.5px ở390px và đẩy sản phẩm xuống sâu.
2. **Phương án:** A giữ wrap: đơn giản nhưng nhiều hàng. B disclosure normal-flow: gọn lúc đóng, thêm thao tác mở. C horizontal scroller: một hàng nhưng khó khám phá mục ngoài màn hình, hierarchy/tên dài khó đọc.
3. **Khuyến nghị:** B ở mobile/tablet không có sidebar; desktop giữ list mở. Một navigation/data tree, không duplicate focusable lists; không drawer/modal/facets.
4. **Bằng chứng:** Audit§12:11categories/4hàng/216.5px, first card y600.48; screenshot human; source `inc/woocommerce.php` và `.skvn-archive-categories`. y tuyệt đối còn phụ thuộc site chrome, không target y cứng.
5. **Tự kiểm chứng:** Mở Grouper390px, chụp category/card đầu rồi1024px; xem scoped nav CSS và số đo§12, khoảng5phút. Không dựa premise Woo API major chưa xác nhận.
6. **Đảo ngược:** Hai chiều; không đổi taxonomy/product/saved blocks. Bỏ enhancement sẽ trở về list mở.
7. **Default:** Trước khi human duyệt mobile, giữ nav hiện tại. Duyệt alignment không tự duyệt disclosure.

```text
Home / Grouper
Grouper
[ Categories: Grouper                         ▾ ]
Showing all 2 results
[ Default sorting                            ▾ ]
[ Product card                               ]
```

### Interaction / visual contract đề xuất

- Thứ tự đề xuất: breadcrumb→H1/description→category trigger/list→count/sort→cards. Khác toolbar-before-nav hiện tại: cần duyệt riêng DOM order; không CSS order làm visual/keyboard khác nhau. Alignment§12 không phụ thuộc thay đổi này.
- Trigger English/i18n `Categories: Grouper`; Shop `Categories: All products`; product-tag archive `Categories: All categories` để không giả category đang chọn. Tên dài wrap; link hiện tại vẫn aria-current=page; ancestor indentation và All products native giữ.
- Dưới sidebar threshold default đóng; mở list đẩy content xuống trong normal flow, không overlay/animation/nested scroll area. Desktop list luôn mở. Không sticky/header drawer mới.
- Progressive enhancement: HTML ban đầu list mở; trigger chỉ hiện khi JS sẵn sàng. No-JS mọi link vẫn truy cập được. Button aria-expanded/aria-controls; Enter/Space toggle. Đóng từ button; nếu hỗ trợ Escape trong list thì trả focus về trigger. Resize không giấu focused subtree hoặc để focus vào trigger bị ẩn.
- Nếu duyệt B, audit theme script handle trước, dùng archive-only theme enhancement nhỏ; không plugin/Swiper/dependency mới. Đồng bộ container mode với CSS layout, không coi viewport1024 là breakpoint thật. Cách sync state/container/focus phải review trước code; không observer mỗi item.
- Trigger white, navy text, border nhạt theo archive token, radius8px, padding12px16px, min-height44px, width100%, visible focus; chevron decorative. Current link sky/leading marker/semibold giữ; không màu mới. Tablet count-left/sort-right khi đủ chỗ, mobile count rồi full-width select.

### Công việc / acceptance nếu duyệt B

1. Audit hooks/DOM để một nav nằm trước toolbar ở non-sidebar và giữ reading order hợp lý ở desktop/fallback; không clone nav/count/form. Fixture long/nested/current/no categories/tag archive.
2. Theme PHP accessible/i18n/sanitize/escape, scoped CSS, conditional JS/no-JS fallback. Không đổi query/sort/category-reset policy. Không đổi shared card/plugin.
3. MN-01 / Block UI: closed/open/current/hierarchy/long labels,320/390/768/1024 và actual sidebar threshold±1px. MN-02 / Technical: keyboard/focus/no-JS/resize, một nav, không console error. MN-03 / Block UI: collapsed list không chiếm chiều cao; cùng viewport first card lên tương ứng phần list đóng, không target y tuyệt đối. MN-04 / Editor UX: N/A controls mới.
4. Human PHP lint và onsite screenshots closed/open, keyboard/resize notes, native links/order/count/quote smoke. Source/model không thay runtime evidence. Ghi vào runbook hiện có, không tạo plan khác.

### Execution§12–13 — 2026-11-07

- Theme PHP giữ native guarded header/count/order callbacks; thêm `.skvn-archive-shell` bao native header và loop. Category helper render đúng một nav trước toolbar: DOM H1/description→nav→toolbar→results. Thay shell PHP để đáp ứng mobile reading order đã duyệt, không kết luận native hook có defect. Custom-header fallback vẫn nav trước toolbar trong results; empty archive giữ nav/results, không toolbar giả. Không đổi query/visibility/card/plugin.
- Một outer grid chung track240px+gap32px/container1120 cho header/nav/toolbar/results. Hai div trung gian heading-row/layout dùng display:contents trong shell; semantic header/nav giữ box. Desktop header/toolbar row1, nav/results row2; narrow auto placement đúng DOM. Giữ fallback layout grid/product thresholds620/1180. Bỏ flex14rem/28rem atomically. Desktop row gap32/narrow20px; không offset/viewport units/overflow mask.
- `assets/js/archive-categories.js`, theme handle `skvn-marine-archive-categories` chỉ native archives, filemtime, không dependency mới. Một ResizeObserver trên site-main đọc mode custom-property do CSS container query sở hữu; không observer per item/viewport breakpoint khác. Resize cùng mode không reset mở/đóng. Focused link giữ list mở khi chuyển mobile; trigger đang focus chuyển desktop trả focus link. Escape đóng/trả focus. No-JS/không ResizeObserver: list mở, trigger ẩn. Không animation/overlay/nested scrolling.
- English/i18n/escaped labels theo Shop/Category/Tag, unique aria-controls. Trigger white/navy/surface/primary tokens và border rgba archive hiện có;8px radius/44px target. Registry theme sở hữu, không palette mới.
- **5/5 Node VM state/focus model PASS** bằng `node tools/tests/archive-categories.test.mjs`, Node24.20.0. Initial `node --test` không chạy cases do sandbox spawn EPERM; direct runner không tạo child chạy thành công. Không PHP/browser/CSS/Woo integration PASS. Agent không chạy build/lint/WSL/deploy/commit.
- HF-AX-01/02 và MN-01/03: Đã có source/Chờ onsite geometry. HF-AX-03/MN-02: Chờ human PHP lint + native Woo/browser keyboard/no-JS/focus checks;5VM tests chỉ model state. HF-AX-04/MN-04 N/A Editor controls. HF-HDR-01 FAIL bản trước giữ evidence; chỉ cập nhật PASS khi có rects bản mới.
