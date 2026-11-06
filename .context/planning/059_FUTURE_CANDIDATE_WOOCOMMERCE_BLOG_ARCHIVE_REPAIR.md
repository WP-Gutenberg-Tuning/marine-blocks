# WooCommerce Archive + Blog Archive — discussion / repair planning

Created: **2026-11-06**. Status: **PLANNED — discussion, chưa start implementation**.

Human yêu cầu sửa hai archive trong **1.3.x**, làm sau một scope hiện có; tạo file trước để tiếp tục thảo luận. Current vẫn **V1 / 1.3.19 — Plugin Design Sidebar Foundation**. Chưa chốt SemVer cụ thể/start; không bump, chuyển mốc hoặc code runtime trong lượt này.

## 1. Scheduling register

- Đề xuất xếp **sau 1.3.23 — Post Page Basic Design Controls**, sau chuỗi đã có 1.3.19 Sidebar → 1.3.20 Category → 1.3.21 Hero → 1.3.22 Product Page → 1.3.23 Post Page. Lý do: audit lại archive sau khi các trang chi tiết và nền controls có hợp đồng rõ; tránh xen ngang current và đè version đã dùng.
- Đây là **đề xuất thứ tự**, không phải human đã chốt predecessor. Không tự gán1.3.24. Trước coding phải xác nhận scope/PATCH rationale, số chưa dùng và lệnh start theo AGENTS. Nếu thêm hệ controls/archive builder mới thay vì repair, phải đánh giá lại SemVer, không coi ý muốn1.3.x là ngoại lệ tự động cho feature mới.
- Có thể triển khai chung một milestone repair, chia hai work packages Woo và Blog; chỉ tách version nếu audit cho thấy phạm vi/dependency khác đáng kể và human duyệt. Không làm mất acceptance cũ1.3.5 hoặc chốt DONE lại từ đầu.

## 2. Problem intake và bằng chứng hiện có

Human muốn cải thiện WooCommerce Archive và Blog Archive; **chưa cung cấp lỗi cụ thể, URL, screenshot archive hoặc design mới**. Vì vậy bảng dưới là inventory/source observation và câu hỏi, không phải kết luận hai trang đang FAIL mọi mặt.

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

Chưa chọn màu/layout mới hoặc controls UI; không áp mint Spacer/editor frame lên frontend archive. Dùng tokens/design hiện hữu làm baseline, trình mockup theo dữ liệu thật trước thay hướng. Không thêm animation trong scope repair nếu chưa có yêu cầu riêng.

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
