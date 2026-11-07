# 060 — Archive Product Card: tái sử dụng thiết kế Product Carousel

Created: **2026-11-07**. Status: **APPROVED FOR IMPLEMENTATION — source in progress, runtime chưa kiểm chứng**.

Human approval2026-11-07: “Tiến hành bám vào plan để làm”, sửa **ảnh1:1**; thay đổi tỉ lệ ảnh để **scope kế tiếp**, chưa chọn version/control surface cho follow-up đó. Approval§10 với amendment này supersedes các đoạn chờ-duyệt bên dưới. Cập nhật plan trước runtime edits;1.3.20 giữ, current không tự chuyển/bump. Không thêm ratio control/schema/setting trong lượt này.

## 1. Mục tiêu / phạm vi / authority

Human nhận xét card archive M1 đơn điệu, muốn xem xét dùng thiết kế Product Carousel đã có tags và thông tin chi tiết; yêu cầu lập plan để duyệt, **chưa code thay card**. Đề xuất là delta của Woo Archive M1 **1.3.20** đã được human chọn trong plan059, không thêm version hoặc chuyển current1.3.19. Giữ Category Grid/Category details CG/DS, Blog và Archive M2 ngoài delta này. Metadata đang có thay đổi trong working tree không được coi là quyết định chuyển current hoặc là phần sửa của plan này.

Kết quả mong muốn: Home/Carousel và Shop/category có card cùng ngôn ngữ thiết kế; archive vẫn là native Woo grid + category sidebar desktop/navigation trên tablet + native count/sort/pagination. Không mount Product Collection block hoặc chạy lại query để lấy danh sách sản phẩm.

Approval cần riêng cho: bỏ five-row layout cố định; kiến trúc shared presenter; cách hiển thị giá trị dài/nhiều; media ratio và các phần catalogue optional. Plan059§9–10/source hiện hữu vẫn là baseline cho đến khi human duyệt delta. Không coi yêu cầu viết plan là approve delta/start mới.

## 2. Evidence source / khác biệt thực tế

| Nguồn | Điều quan sát được / tác động |
|---|---|
| Plugin `modules/collection-render/cards.php:181` | Renderer card đọc WC_Product và attributes, không tự query danh sách tại entry này; nhưng nhiều presentation options gắn với Collection. Không gọi renderer bằng cách giả layout=carousel cho native archive. |
| Cùng file:413–447 | Product tags nằm trên media; grouped specs chỉ ở nhánh Carousel; Product Grid hiện giữ flat chips. Reuse sai entry có thể lấy nhầm flat layout hoặc đổi Grid ngoài scope. |
| Cùng file:402–503 | Catalogue slots đã có `_skvn_certifications`, `_skvn_moq`, `_skvn_lead_time`, PDF và CTA. Có reader không đồng nghĩa dữ liệu onsite đã verified hoặc tất cả thuộc Archive M1. |
| Cùng file:832/877/1004 | Default3values/group; chỉ visible attributes; taxonomy names/custom options. `+N` là span thông tin + screen-reader text, không click/expand. Reader giữ giá trị0; không tự deduplicate values theo policy cũ. |
| Plugin `src/collection/style.css:258–286,579–641` | Badges nền nhạt/viền, overlay top-left; spec label uppercase, chip wrap, `+N` viền dashed. Style này đang nằm trong CSS Collection rộng hơn card. |
| Theme `inc/woocommerce.php:576–635` và `style.css:4877+` | Archive mới có own5rows, missing “—”, view details/quote và image4:3. Không có Product Tag badges hoặc grouped chip presentation như Carousel. |
| Plan059§10 / runbook archive | Human16/16mock model PASS ngày2026-11-07; chưa actual Woo/GP/layout PASS. Thay presenter phải giữ taxonomy/scope/MOQ safety, không dùng16checks cũ để nghiệm thu UI mới. |

Các line numbers là checkpoint đọc source; implementation đối chiếu symbol nếu file thay đổi. Không có screenshot mới của Carousel/Shop cùng build để xác nhận pixel parity; G0 phải thu baseline. Không khẳng định tooltip/popover hiện có cho `+N`.

## 3. Decision Memo — kiến trúc reuse để human duyệt

1. **Vấn đề:** archive đang lặp một card ít thông tin, trong khi card Carousel có presentation phong phú nhưng chưa có public integration contract cho native Woo archive.
2. **Phương án:** A — copy markup/CSS sang theme: ít refactor trước mắt, nhưng hai bản sẽ drift và phải sửa hai nơi. B — tách shared card presenter/assets trong plugin, theme dùng qua public API có fallback: đầu tư refactor có kiểm soát, giữ một presentation owner và dependency rõ. C — thay archive bằng Collection block: nhanh lấy giao diện nhưng đổi query owner/native loop, không phù hợp boundary hiện hành, không đề xuất triển khai.
3. **Khuyến nghị:** **B**. Shared presenter chỉ render một product được caller đưa vào; không nhận trách nhiệm archive query, Swiper hoặc sidebar. Plugin vẫn chạy độc lập theme; theme có native fallback khi plugin/API không khả dụng.
4. **Bằng chứng:** các entry points/grouped-vs-flat/CSS ownership trong§2; archive renderer hiện hữu ở theme; plan059§3 giữ native query boundary. Đây là local source evidence, không kết luận behavior Woo phiên bản onsite.
5. **Tự kiểm chứng ≤8phút:** mở cards.php symbols renderer/spec_groups/render_spec_groups (3phút), style.css badge/spec rules (2phút), so theme archive_specs và plan059§10 (3phút). Human có thể kiểm screenshot cùng một product ở Carousel/Shop sau G0; không cần tin mô tả parity bằng lời.
6. **Đảo ngược:** hai chiều ở source: archive adapter có thể quay về card native; không thay DB/schema/saved blocks. Refactor shared renderer vẫn phải giữ baseline regression snapshots để rollback an toàn.
7. **Default trước khi sửa runtime:** giữ source hiện hữu, **chờ human duyệt**. Không tự chọn B hoặc sửa Carousel trong lượt planning.

## 4. Card anatomy đề xuất

```text
┌────────────────────────────────────┐
│ [Product tag] [Product tag]         │ ← data-backed, display-only
│                                    │
│           PRODUCT IMAGE            │ ← archive1:1, no animation
│                                    │
├────────────────────────────────────┤
│ Product name — full title          │ ← link to product
│                                    │
│ FORM                               │
│ [Fillet] [Whole]                    │
│ SIZE                               │
│ [value] [value] [value] [+N]         │ ← +N information only
│ FREEZING                           │
│ [IQF]                              │
│ PACKAGING                          │
│ [value] [value]                     │
│ Other visible attribute groups…    │ ← no arbitrary field loss
│                                    │
│ Verified certification labels…     │ ← optional, only if real data
│ MOQ              Lead time         │ ← optional real values
│ value            value             │
│                                    │
│ [       Request a quote          ] │
│            View details →          │
└────────────────────────────────────┘
```

Đây là anatomy/data mẫu để review, không nội dung production. Tên sản phẩm và values không line-clamp/font shrinking; chips tự wrap. Không bắt mọi card cao bằng card dài nhất toàn page: stretch theo hàng Grid, CTA dùng layout bottom alignment trong hàng, không fixed-height cắt thông tin. Khi có thêm grouped rows, row cao hơn là hợp lệ.

## 5. Content contract — các thay đổi cần duyệt

### 5.1. Grouped attributes thay five-row table

- **Đề xuất:** bỏ việc luôn render năm hàng Form/Size/Freezing/Packaging/MOQ kể cả trống. Dùng nhóm visible attributes như Carousel; các nhóm Form/Size/Freezing/Packaging có dữ liệu lên trước, các nhóm còn lại giữ source order. Không tự bỏ scientific name hoặc attribute thật khác vì không nằm trong alias5groups.
- Nhãn lấy taxonomy label/custom name đã sanitize; alias chỉ giúp ưu tiên thứ tự, không đổi dữ liệu hoặc tạo schema mới. Trường không visible không được lộ ở archive. Không gộp các nhóm khác nhau chỉ vì label/value giống nhau; giữ0 và policy duplicate của Carousel.
- Mặc định3values/group như shared reader hiện có. `+N` chỉ hiện khi thực sự rút bớt; không giả button/focus/hover interaction. View details luôn rõ để xem phần đầy đủ. G0 phải xác nhận trang chi tiết hiện đủ values; nếu chưa, **archive hiển thị toàn bộ values** cho đến khi có đường xem đầy đủ, không ship đoạn thông tin bị giấu mà không truy cập được.
- Không thêm popover/expand của riêng archive vào gói này. Nếu human muốn xem hết ngay trên grid, chọn full-values thay3/+N; đổi sang interaction là proposal riêng.
- Không có group data: omit grouped section, một dòng neutral “Specifications available on request” (i18n), không bịa MOQ. Đây là thay đổi so placeholder5rows, cần human duyệt.

### 5.2. Product tags khác spec chips

- Badges trên ảnh đọc `product_tag` thật; spec chips là giá trị attribute, không tự biến thành tag/link filter.
- Đề xuất archive badge display-only như span, không click chuyển taxonomy; View details/product image là link riêng. Overlay phải là sibling của image link khi cần, **không nested anchors**. Không sửa saved badgeBehavior của Carousel.
- Thiếu tags thì không render empty overlay. Nhiều/tên dài wrap, không che gần hết ảnh: mockup phải có fixture nhiều tag; nếu overlay quá lớn, chuyển toàn bộ badges xuống vùng ngay dưới ảnh ở card hẹp, không tự cắt mất tag hoặc thêm +N tags mà chưa contract.
- Màu/border/shape lấy card baseline, không semantic color mapping tự động cho chứng nhận/loài hoặc claim verified từ tên tag.

### 5.3. MOQ / lead time / certifications / PDF

- MOQ chỉ hiện một nơi trong stats, tránh một group MOQ và một stats MOQ trùng nhau. Ưu tiên visible MOQ attribute nếu có, fallback `_skvn_moq`; mapping thống nhất ở adapter, không đổi reader Carousel cũ ngầm. Nếu nhiều values giữ đầy đủ và label/units nguồn.
- Lead time/certification slots optional nếu có dữ liệu đã được human xác thực; không seed sample/copy static trust text. Empty omit, không bắt chúng mới PASS card layout. Không nhân bản cùng chứng nhận ở badge lẫn stats mà không rõ ý nghĩa.
- **PDF chưa thêm vào archive**: plan M1 không có download scope, không tự bật vì renderer Carousel có hỗ trợ. Origin/plant/buyer claims khác cũng không tự bổ sung.

### 5.4. Media / CTA / style

- Archive dùng ảnh **1:1** theo amendment human2026-11-07, cả enhanced và native fallback; native Woo placeholder giữ. Carousel giữ existing media preset/ratio/contain theo từng block. Dùng presenter với context rõ, không giả layout=carousel. UI chọn ratio để scope kế tiếp, chưa gán version và không thêm control/schema bây giờ.
- Quote primary + View details secondary; giữ native quote product_id contract và bỏ AJAX-cart interception ở archive. Không Add to Inquiry/price/rating/cart.
- Tái sử dụng badge/spec styles baseline§2. Nền card trắng, bo8px; navy titles và blue CTA dùng semantic theme tokens khi tích hợp, plugin có fallback độc lập. Không chép inline style của một Carousel instance hoặc để đổi style block trên Home tự đổi toàn Shop.
- Shared card typography theo existing UI/body token; labels uppercase/spec chip như Carousel, title full. Đo readability ở card hẹp/zoom200%; font delivery/preset toàn site không đổi. Không thêm animation/shadow motion mới để làm card nổi bật.

## 6. Architecture / file contract dự kiến

**Owner:** plugin sở hữu reusable card rendering/assets/data presentation; theme sở hữu archive adapter/shell/tokens. Native Woo sở hữu query/loop/product classes/routes. Không require file nội bộ plugin từ theme, không đọc thư mục plugin bằng đường dẫn hard-code.

- Plugin public entry (tên dự kiến, chốt source trước code): `skvn_marine_blocks_render_product_card($product, $options, $context)` và asset-enqueue helper card-only. Context archive/carousel/grid explicit, không nhận query, không tạo Swiper hoặc output li/swiper-slide/container. Theme đưa current WC_Product của native loop; presenter trả escaped article markup.
- Tách presenter từ existing renderer theo bước nhỏ; existing entry trở thành wrapper giữ defaults/attributes/output semantics. Product Grid flat chips, Carousel grouped specs, action/media options cũ giữ behavior. Không đổi block.json/Content Actions schema/saved content hoặc mở thêm Inspector controls.
- Tách **card-only CSS handle** từ collection CSS; shared rules một owner, Collection imports/dependency vào cùng nguồn. Scope/context modifiers rõ; không enqueue toàn editor/Collection/Swiper JS chỉ để có card trên archive. Audit extraction/enqueue frontend+editor theo pitfall AP-06/07, không suy build output là loaded assets.
- Theme integration candidate: một archive-only template-part adapter bọc `li` native product classes + shared article. Chốt hook/template route **sau kiểm Woo/GP version/template thực**; không giả định plugin runtime có sẵn trong checkout. Có thể dùng scoped template-part resolution nếu API/version được xác minh; không global replace content-product.php cho single/shortcodes/related.
- Adapter phải không render native image/title/spec/quote một lần nữa. Audit required Woo loop hooks và extension consumers trước thay; ghi rõ hooks retained/suppressed, prove không double markup/nested links. Nếu không giữ compatibility thiết yếu của site, dừng bước adapter để chọn integration khác, không bỏ hook âm thầm.
- API/plugin không sẵn: dùng native archive card baseline hiện có, giữ five-spec fallback/quote và category shell, không fatal/missing product. Asset fallback không phụ thuộc plugin stylesheet; plugin active/inactive không đổi product IDs/query.
- Nếu thêm PHP include/module/template/asset, cập nhật registration và deploy packaging audit; file phải có trong theme/plugin zip. Chuẩn bị compatibility entry/wrapper cho consumer theme khi migration1.4.0, không rename namespace trong gói này.

## 7. Execution packages sau khi duyệt

| Package | Việc làm / dependencies | Output / gate |
|---|---|---|
| P0 — baseline/preflight | Installed WP/Woo/GP/plugin versions; same-product Home/Shop screenshots, DOM/styles/loaded assets; current query IDs; template/hook map; real attrs/tags/meta; confirm detail page exposes remaining values | Source/runtime map + fixtures; không dùng screenshot khác build chứng minh parity. Exact API docs phải đúng installed version trước làm premise hook. |
| P1 — mockup/contract | Cùng một product ở Carousel/archive rộng/hẹp;0/1/many tags, no image/spec, long title/chips; final +N/MOQ/default choices | Human duyệt mockup và§10; plan059 five-row yêu cầu giữ cho fallback, enhanced card được supersede riêng. |
| P2 — shared presenter | Small extraction + public API/options; preserve existing entry/flat Grid/grouped Carousel; no query/saved attrs changes | Renderer tests và baseline output regression, explicit context variants. |
| P3 — asset split | Card stylesheet shared owner/conditional handles, media/spec/badge geometry; editor preservation | Loaded handles/source map; no Swiper/editor JS on archive; prevent double CSS/cascade drift. |
| P4 — archive adapter | Native WC_Product→presenter, li/classes/hooks, fallback, quote identity, scoped CSS old rules neutralization | Shop/category/tag/enhanced and plugin-off fallback; no duplicate specs/buttons or accidental Woo shortcode override. |
| P5 — tests/docs | Model/integration tests + onsite runbook additions; field mapping; update059/CG linkage/marketplace only if relevant human decision | Human commands, per-ID status/evidence, no unrelated product claims. |
| P6 — human verification | Build/lint/artifact when source changes, desktop/tablet/mobile/keyboard/query/quote, Carousel+Grid regression | Evidence AC IDs; failures fixed, human approval required before runtime PASS/release. |

Files likely: plugin `modules/collection-render/cards.php`, dedicated shared presenter/registration as needed, `src/collection/style.css` and card-only CSS source; theme `inc/woocommerce.php`, archive adapter template if chosen, scoped `style.css`; tests + `docs/testing/archive-repair-1.3.x.md`. No unrelated generated/build files or user metadata edits swept into commit. Existing git dirty tree must be checked before implementation/commit.

## 8. Acceptance & Evidence — tất cả Chưa làm

| ID / Nhóm | Expected / Content & States | Hiện trạng → việc sửa | Cách kiểm / evidence |
|---|---|---|---|
| AC-UI01 / Block UI | Same-product tags/spec chips/type/CTA cùng design family Home/Shop, ảnh archive1:1 | Archive five-row đơn giản → shared presentation | Same-build screenshots desktop/card hẹp/zoom200%, color/type comparison; measure image rect1:1 cả enhanced/fallback |
| AC-UI02 / Block UI | Tags thật, long/many/empty không nested links hoặc che ảnh | Archive chưa overlay → siblings/placement | DOM link validation, fixtures0/1/many/long; keyboard/touch; no invented badges |
| AC-UI03 / Block UI + Technical | Visible groups/0/multiple values đủ; +N đúng và có đường xem full | Existing +N informational → archive display policy§5 | Tests remaining counts/empty/hidden and real detail page values; reject inaccessible hidden data |
| AC-UI04 / Block UI | Missing data neutral, MOQ một nơi, verified optional slots | Fixed5rows/meta fallback → enhanced context | Real values mapping/screenshots empty/attribute+meta conflicts; no fake claims/PDF |
| AC-UI05 / Block UI | Sidebar/grid/page rhythm giữ; title/chips/CTA không clip/overflow | New shared markup chưa integration → scoped geometry |320/390/tablet/desktop+scrollbar, container±1px/zoom200%; rect/scrollWidth; CTAs align per grid row |
| AC-ED01 / Editor UX | Product/category/tag edits native phản ánh frontend; Carousel controls/save/reopen không regression | Shared renderer extraction chưa làm → preserve interfaces | Controlled test-data edit/save/frontend + existing Carousel tag/media/spec/CTA controls; no new archive editor promised |
| AC-TECH01 / Technical | Native count/order/pagination/IDs/private visibility giữ | Adapter chưa có → no collection query | Compare page1/2/last IDs/native URL params logged-in/out; no duplicated/lost items |
| AC-TECH02 / Technical | Plugin unavailable fallback hoạt động, no fatal/duplicate CTA | Theme baseline có → conditional public API | Active/off/API missing fixture; template/hooks/HTML; quote identity and AJAX-network smoke |
| AC-TECH03 / Technical | Carousel/Grid/Post/shortcodes/related behavior preserved | Grouped/flat split và media presets đang có → isolated extraction | Same fixture before/after, saved/reopened block, flat Grid preserved, no extra cards/changed query/hidden field leak |
| AC-TECH04 / Technical | Card-only conditional assets, correct editor+frontend, no extra carousel runtime | Card CSS currently collection bundle → split owner | Handles/network/CSS coverage source/loaded confirmation; compare request/query baseline, no perf PASS by guess |
| AC-TECH05 / Technical | Escaping/i18n/valid links/hook balance/deploy includes | Needs integration → defensive presenter/adapter | Malicious term/attr fixtures, markup check, target-version API evidence, PHP/build human output and zip inventory |

AC bổ sung AM1/AL/AR, không thay acceptance cũ.16model checks ngày2026-11-07 chỉ PASS baseline logic; giữ taxonomy/escape/visibility tests, update assertions chỉ khi contract mới duyệt, không sửa test để che regression. Cần renderer/context/asset integration tests có ý nghĩa; không coi transpile/static checks là Woo runtime PASS.

## 9. Rollback / risks / ngoài scope

Rollback archive adapter về native fallback mà không đổi DB. Shared refactor rollback độc lập qua source commit; không disable toàn plugin để che lỗi một card. Kiểm theme khác/plugin-off/editor stylesheet sau asset split. Risks chính: shared CSS specificity, Carousel media/style regressions, native hook compatibility, nhiều groups làm card cao, data/detail page không đủ để dùng +N. P0–P1 giải quyết trước production; không tự chứng nhận dữ liệu.

Không thêm filters, inquiry, multilingual, Blog card, PDF flow, animation, global card settings hoặc redesign Home Carousel. Không sửa skeleton/parallax debt, đổi query ownership, rename Marine Blocks hoặc promote partial source thành milestone completion.

## 10. Gói đề nghị human duyệt

1. **Kiến trúc B:** shared plugin presenter/card-only assets + theme native archive adapter + native fallback. Scope tiếp tục1.3.20, current không tự chuyển.
2. **Nội dung:** enhanced card thay fixed5rows bằng visible grouped attributes; ưu tiên4groups quen thuộc rồi giữ các nhóm khác. MOQ riêng một nơi, optional verified lead-time/certifications, không PDF. Không dữ liệu dùng một neutral line. Native fallback vẫn giữ baseline5rows.
3. **Overflow:** default3values/+N informational + View details, chỉ truncate khi product details thực có full values; nếu không dùng full-values. Không thêm expand/popover hoặc đổi Carousel behavior.
4. **Visual:** ảnh1:1 archive (human amendment), reuse card/tag/spec/CTA design; tags display-only, title/chips wrap; no new animation/Carousel controls; archive style không lấy từ một Home block instance.

Human đã duyệt§10 với amendment1:1 nêu đầu file; triển khai trong1.3.20, không hỏi lại version/start. Ratio customization deferred scope kế tiếp; không tự gán milestone/SemVer hoặc mở full archive builder.

## 11. Execution ledger — 2026-11-07

Plan sửa1:1 trước runtime edits. Approval đầu file/§10 supersedes các checkpoint proposed/chờ duyệt§1–9. Source trong1.3.20, chưa runtime PASS/commit/deploy; current không chuyển/bump, metadata dirty trước lượt này không sửa.

- Plugin `cards.php`: existing Collection entry thành wrapper của public `skvn_marine_blocks_render_product_card`, explicit archive/carousel/grid context. Archive fixed1:1/flush, grouped visible attrs, priority groups rồi source order, MOQ một nơi; attr ưu tiên/meta fallback; giữ0/duplicates. Existing Grid flat, Carousel grouped/media/CTA saved options giữ.
- Archive full-values mặc định. Server filter `skvn_marine_blocks_archive_full_specs_available` chỉ opt-in3/+N sau khi human xác nhận detail page đầy đủ. Native fallback vẫn5rows. Product tags spans sibling image link; ít/short overlay, hơn3tag/label>30bytes hoặc card≤320px strip dưới ảnh, không truncate; thresholds cần visual review. Optional cert/lead-time chỉ opt-in qua `skvn_marine_blocks_archive_verified_catalog_meta` sau verify, defaultfalse. PDF không render.
- `assets/css/product-card.css`:114root card-only rules tách nguyên declarations,5ratio image rules đi cùng để flush vẫn thắng legacy ratio. Editor/Collection style handles depend vào cùng `skvn-marine-product-card` handle; không compile/import lại vào bundles, nên mixed archive/Collection page không tải hai bản card CSS. Contextual Carousel/Grid/editor rules giữ trong bundle. Public enqueue helper/card registration dùng filemtime, không Swiper/editor JS. Archive static/no animation. Source import ban đầu được đổi sang dependency trước hoàn tất và rerun7CSS testsPASS (Node24.20.0).
- Theme readiness gate/API/CSS; `wc_get_template_part` chỉ content/product/native main archive/in-loop tới `inc/templates/archive-product-card.php`; không thay theme/extension template override có sẵn hoặc WC template-debug mode. Native li/classes/is_visible/current WC_Product, không query. Thiếu API/CSS/template → fallback native. Ảnh fallback sửa1:1. Không require plugin internals từ theme.
- Giữ5Woo loop actions, suppress chỉ known core/fallback presentation callbacks trong từng item, restore priorities qua try/finally. Extension markup quanh shared article; không claim pixel compatibility với extension phụ thuộc anchor nesting cũ. Actual template/hook inventory onsite còn chờ.
- Artifact builder assert presenter/CSS/theme adapter; existing modules/assets/theme copy đủ. Workflow bổ sung zip inventory. Chưa build/package/verify zip vì script gọi build.

### Checks / giới hạn

`node --test tools/tests/product-card-css.test.mjs` bị child spawn EPERM. Single-process `node tools/tests/product-card-css.test.mjs` trả **7/7PASS**, Node24.20.0: legacy ratio/cover, explicit flush, padded, floating, chip palette, archive square/static, asset boundary. Tool ban đầu yield không output; gửi stop theo responsiveness rule thì nhận process đã hoàn tất exit0, không poll/retry loop. Đây là PostCSS/JSDOM selector/cascade model, không browser layout/loaded-styles proof.

Chuẩn bị `archive-shared-product-card.test.php`16case mới +16baseline=32, và `archive-card-hooks.test.php`10cases suppression/extensions/action sequence/restore-on-error/native-vs-custom template/main-vs-secondary/shortcode. **Chưa chạy PHP** (shell không có interpreter); không gọi WSL/build/lint. Human16PASS baseline trước giữ riêng, không tự suy32PASS. Human commands/runbook là bước tiếp.

Official sources inspected: Woo template content-product.php9.4.0 và wc-core-functions.php (`wc_get_template_part` filter) từ official repo. Không đồng nghĩa installed Woo major onsite. P0 versions/overrides/same-build screenshots/field mappings chưa có; cần human actual runtime trước nghiệm thu. AC-* Đã có source/Chờ kiểm chứng; no UI/query/quote/editor PASS từ model checks.

### Test repair evidence2026-11-07 — harness, không production

Second run: human report grouped Carousel summary PASS, sau đó media preset assertion FAIL. Root cause khác trong harness: mock `wc_placeholder_img` bỏ ảnh attributes/style mà renderer đã truyền, nên offset-20px biến mất khỏi HTML test. Sửa mock serialize/escape attributes đúng contract, giữ assertion và production source. Target vẫn37, chưa có rerunPASS; không đánh runtime FAIL từ lỗi mock này. Rà lại routing/image mocks theo actual helper call path, không guard production để che harness gaps.

Human gửi shared-card output: baseline16PASS +4data casesPASS, rồi fatal undefined `is_singular()` trong real quote-source helper; combined suite chưa hoàn tất/PASS. Root cause test harness thiếu WP routing dependencies, không evidence WordPress frontend thiếu function này. Sửa riêng test: stub đầy đủ singular/search/post-type/taxonomy/request routing; giữ real quote/source helper được gọi, không bypass hoặc thêm guard production che lỗi. Thêm5route assertions category/Shop/singular/search/fallback; combined target nay **37checks** (16baseline+16shared+5routing), hook/template suite10 giữ nguyên. Human cần rerun2PHP suites; chưa có rerun evidence, không chạy lại build chỉ vì thay test.

## 12. Scope kế tiếp — cho thay đổi tỉ lệ ảnh

Human yêu cầu ratio customization ở scope kế tiếp. **Deferred follow-up**: chốt control surface/owner, archive default/override nếu có, ratios/contain-cover/reset/persistence và migration defaults trước implement. Default1:1 phải tương thích, ảnh thật/placeholder cùng geometry, preview/frontend parity riêng. Chưa gán SemVer/start; không tự chèn vào1.3.21 Hero/1.3.22 Product Page hoặc mở full archive builder. Patch này không thêm ratio control/schema.
