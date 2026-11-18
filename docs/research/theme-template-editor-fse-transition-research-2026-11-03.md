# Product/Post Template Editor — nghiên cứu và định hướng chuyển sang FSE

Ngày ghi nhận: **2026-11-03**. Phạm vi: kiến trúc theme, template Product/Post và trải nghiệm biên tập.

**Mapping human đã chốt sau nghiên cứu:** 1.3.22 — Product Page Basic Design Controls; 1.3.23 — Post (thứ tự nghiệp vụ). **Cập nhật 2026-11-16:** Post **defer → 1.4.x stockpile** pending plan [078](../../.context/planning/078_FUTURE_CANDIDATE_THEME_BLOCK_TEMPLATE_SURFACE_BOUNDARY_PLANNING.md). Scope/acceptance ở [MILESTONES.md](../../.context/MILESTONES.md). Child theme + template PHP; không FSE migration 1.3.x.

**Trạng thái: human đã chấp nhận hướng planning; chưa phê duyệt bắt đầu implementation.** Báo cáo này là điểm tiếp nối cho thảo luận sau, không phải bằng chứng runtime PASS hoặc lệnh chuyển milestone.

> **Quyết định đã đính chính cần đọc trước:** giai đoạn theme còn là child của GeneratePress giữ cách chỉnh giao diện có giới hạn. **2.0 bắt đầu từng bước migrate khỏi GeneratePress**, hướng tới theme FSE độc lập; các bước trung gian có thể vẫn phụ thuộc parent theme. Độc lập hoàn toàn là đích đến, không phải điều kiện đã đạt ngay khi bắt đầu 2.0. Mốc hoàn tất chưa được xác nhận trong quyết định mới nhất.

**Dấu vết đính chính — 2026-11-03:** bản đầu của báo cáo đã diễn giải sai “bắt đầu độc lập” thành “đã độc lập từ nền tảng 2.x”. Human sửa rõ: “2.0 sẽ bắt đầu độc lập khỏi genpress, không phải là đã độc lập mà bắt đầu từng bước migrate khỏi theme gốc”. Báo cáo đã sửa theo nghĩa này. [Planning 013](../../.context/planning/013_VERSION_2_0_0_TO_3_0_0_STANDALONE_BLOCK_THEME_PLANNING.md) cũng mô tả 2.0 là điểm bắt đầu migration; mốc 3.0 hoàn tất trong file đó là planning lịch sử, không được coi là vừa được human xác nhận lại. Không có quyết định thay thế nguyên tắc migration từng bước.

Human dùng nhãn **1.0.x** để diễn đạt giai đoạn child theme trong cuộc thảo luận. Báo cáo hiểu đây là nhãn giai đoạn kiến trúc, **không phải yêu cầu hạ version hiện tại 1.3.18 về 1.0.x**. Chưa chọn patch release, ngày chuyển hoặc thay đổi current milestone. Các file milestone/metadata không được sửa trong lượt lưu báo cáo này.

## 1. Câu hỏi và kết luận

Câu hỏi cần giải quyết:

> Có thể thiết kế template Single Product và Single Post bằng editor trực quan, áp dụng chung cho nhiều nội dung, trong khi vẫn giữ dữ liệu native WordPress/WooCommerce không? Các theme FSE, Elementor, Flatsome và hệ sinh thái WPBakery làm điều đó thế nào?

Câu trả lời nghiên cứu: **có**. Cần đồng thời có nơi lưu template, thành phần lấy dữ liệu động, cơ chế chọn/render template và editor chỉnh template. Thêm một sidebar style không tự cung cấp đủ bốn phần này.

Hướng SKVN được chấp nhận:

- **Giai đoạn child theme:** đầu tư dữ liệu, thành phần có thể tái sử dụng và visual system; chỉnh template qua controls/preset có giới hạn. Không xây một hệ thống template builder riêng đầy đủ để rồi thay bỏ khi sang FSE.
- **Giai đoạn 2.x:** bắt đầu migration từng bước từ 2.0, giảm dần phụ thuộc GeneratePress và chuyển các surface phù hợp sang nền tảng block templates, template parts, Site Editor native. Theme FSE độc lập là đích đến; thời điểm hoàn tất và thứ tự các bước chưa được chốt.
- Native blocks phù hợp được ưu tiên; plugin bổ sung logic B2B còn thiếu. Không thay đổi quyết định ownership query của Product/Post Collection hiện có.

Liên hệ nghiên cứu trước: [B2B Seafood Product Page Research](b2b-seafood-product-page-research-2026-11-03.md). Báo cáo trước xác định nội dung trang B2B và RFQ; báo cáo này xác định ai quản lý cấu trúc trang và người biên tập chỉnh nó ở đâu.

## 2. Phương pháp và giới hạn bằng chứng

- Đọc tài liệu chính thức WordPress, WooCommerce, Elementor, UX Themes và WPBakery; đối chiếu source cùng tài liệu dự án.
- Nguồn web được truy cập ngày 2026-11-03. Không cài hoặc thử các builder; không có visual/interaction audit sản phẩm đối chiếu.
- WPBakery Template Library: lần mở trực tiếp không có text đọc được; nội dung dùng từ search index của chính trang tài liệu đó. Không lấy nguồn bên thứ ba làm bằng chứng khả năng theme builder.
- Chưa xác nhận phiên bản WordPress/WooCommerce thực tế onsite. Tài liệu hiện hành chứng minh khả năng của nền tảng, chưa chứng minh build dự án hỗ trợ mọi block/API được nêu.
- Source finding chỉ xác nhận mã có trong checkout, không xác nhận bản deploy hoặc hành vi onsite. Không chạy build, lint, migration hoặc sửa source trong nghiên cứu này.
- Các bảng acceptance bên dưới là tiêu chí cho khảo sát/triển khai tương lai, không phải checklist đã nghiệm thu.

## 3. Phân biệt dữ liệu, template và thiết kế

| Lớp | Câu hỏi | Owner dự kiến |
|---|---|---|
| Dữ liệu | Sản phẩm/bài viết này có nội dung gì? | WordPress/WooCommerce native; plugin giữ logic dữ liệu B2B bổ sung |
| Template | Ảnh, tiêu đề, nội dung, thông số nằm ở đâu? | Theme; hiện tại PHP/hooks, từ 2.0 chuyển từng phần hướng tới block templates |
| Thiết kế | Font, màu, độ rộng, khoảng cách và responsive thế nào? | Theme visual system; controls native hoặc plugin chỉ bổ sung phần cần thiết |
| Hành vi | RFQ lấy đúng sản phẩm nào, carousel hoạt động thế nào? | Plugin/luồng nghiệp vụ tương ứng; không phụ thuộc GeneratePress |

Sửa mô tả một sản phẩm không được đổi mô tả sản phẩm khác. Sửa template dùng chung có thể đổi bố cục tất cả sản phẩm sử dụng nó. Editor phải thể hiện rõ hai phạm vi này.

**Design Sidebar ≠ Template Editor:** sidebar sửa thuộc tính của thành phần hoặc thiết lập chung; template editor cho phép sắp xếp cấu trúc dùng chung và quản lý template. Sidebar đã thảo luận không tự trở thành một theme builder.

**Template ≠ nội dung mẫu:** sao chép một bố cục vào từng bài dễ tạo nhiều bản khác nhau. Template dùng block dữ liệu động để cùng cấu trúc hiển thị nội dung của bài/sản phẩm đang xem.

## 4. Hiện trạng SKVN từ source

Đường dẫn dưới đây tính từ repository root; số dòng ghi nhận tại ngày nghiên cứu, có thể dịch chuyển sau chỉnh sửa.

| Evidence | Phát hiện | Giới hạn kết luận |
|---|---|---|
| `wp-content/themes/skvn-marine/style.css:3` | `Template: generatepress` xác định parent theme | Không phải theme FSE độc lập hiện tại |
| `wp-content/themes/skvn-marine/single.php:98`, `:121`, `:150`, `:204` | Bố cục Post, tiêu đề, vùng nội dung và sidebar được dựng trong PHP | Sửa nội dung bài không tự sửa toàn bộ bố cục PHP |
| `wp-content/themes/skvn-marine/inc/woocommerce.php:13`, `:94`, `:95` | Theme điều chỉnh product tabs và thay add-to-cart bằng quote CTA qua hooks | Chưa chứng minh các hook sẽ chạy khi đổi đường render sang block template |
| `wp-content/themes/skvn-marine/inc/setup.php:21` | Setup có theme supports và editor styles | Không được suy ra toàn bộ Site Editor đã được bật |
| `wp-content/themes/skvn-marine/theme.json:3`, `:146` | Đã có settings và styles, gồm layout/palette | Có `theme.json` không đồng nghĩa là block theme [S1] |
| `wp-content/plugins/skvn-marine-blocks/modules/collection-render/cards.php:392` | Có readers cho certifications, MOQ, lead time, spec sheet | Meta reader không chứng minh form nhập/lưu hoặc block PDP đã hoàn chỉnh |

Nguồn ownership nội bộ: [.context/modules/THEME_SKVN_MARINE.md](../../.context/modules/THEME_SKVN_MARINE.md), [.context/modules/PLUGIN_SKVN_MARINE_BLOCKS.md](../../.context/modules/PLUGIN_SKVN_MARINE_BLOCKS.md).

Không sửa GeneratePress parent. Không coi cấu trúc carousel card là template PDP hoàn chỉnh: thông số trên card có thể rút gọn bằng `+N`, còn thông tin thiết yếu ở trang chi tiết phải có đường xem đầy đủ.

## 5. FSE thực hiện chỉnh template như thế nào?

Block theme mô tả cấu trúc bằng block markup trong template. Classic theme vẫn có thể sử dụng `theme.json`; riêng việc có file đó không chuyển PHP layout sang block layout. WordPress phân biệt classic theme và block theme theo cấu trúc template [S1].

Ví dụ khái niệm cho Post, không phải source triển khai:

```text
Header template part
Group / Columns
  Post Title
  Featured Image
  Post Content
Footer template part
```

Template cung cấp vị trí; các block động cung cấp nội dung của đối tượng đang xem. Đối với WooCommerce, Single Product template chứa các block như gallery, title, summary và meta; có thể bố trí lại chúng trong Site Editor. Nội dung riêng của sản phẩm vẫn được sửa tại sản phẩm [S4, S5].

Theme cung cấp template file gốc. Khi người dùng chỉnh template hoặc template part trong editor, WordPress lưu bản tùy chỉnh bằng `wp_template` hoặc `wp_template_part`; file gốc được giữ lại. Vì thế deploy file theme và thay đổi template trong database là hai lớp cần quản lý [S2].

Hệ quả cho SKVN (suy luận kiến trúc): phải kiểm tra trường hợp template đã bị tùy chỉnh khi cập nhật theme; không hứa sửa file template sẽ tự thay toàn bộ thiết kế đang dùng. Cần hướng dẫn reset, export/migrate và xác định nguồn template hiệu lực.

### Classic Template Editor không phải toàn bộ Site Editor

WordPress cho phép classic theme bật Template Editor và truy cập từ editor Post/Page. Block theme còn cho truy cập qua Site Editor [S3]. Điều này chứng minh không bắt buộc FSE để có mọi hình thức chỉnh template bằng block, nhưng **không chứng minh** GeneratePress + WooCommerce của SKVN chỉ cần bật một flag là hỗ trợ đầy đủ Single Product.

Sau quyết định chia giai đoạn, classic Template Editor chỉ là khả năng đã nghiên cứu, không phải hạng mục tự động đưa vào giai đoạn child theme. Nếu phát sinh nhu cầu thật, khảo sát một phạm vi nhỏ trước; không mở builder song song với nền tảng FSE tương lai.

## 6. Đối chiếu các builder

| Hệ thống | Điều tài liệu xác nhận | Bài học áp dụng / giới hạn |
|---|---|---|
| WordPress FSE + WooCommerce | Template dùng chung, block dữ liệu động, chỉnh bằng Site Editor; có template riêng cho sản phẩm [S2–S5] | Nền tảng phù hợp cho 2.x; không mặc định tương thích mọi hook PHP cũ |
| Elementor Theme Builder | Quản lý Single Product template và điều kiện include/exclude cho site parts [S6, S7] | Tách thiết kế khỏi đối tượng áp dụng; không cần sao chép toàn bộ hệ điều kiện của Elementor |
| Flatsome UX Builder | Tạo block làm product layout, gán global/category/single product, chỉnh bằng UX Builder [S8] | Luồng “Edit product layout” dễ hiểu; UX Block này không phải Gutenberg block |
| WPBakery | Template Library cung cấp bố cục có thể tải/chèn; API cho theme thêm predefined template [S9, S10] | Chưa đủ bằng chứng để gán khả năng thay toàn bộ Single Product với display conditions cho WPBakery độc lập; phải xác định theme/add-on cụ thể |

Flatsome còn hướng dẫn thêm Product Hooks element nếu plugin phụ thuộc Woo hooks [S8]. Đây là ví dụ cụ thể cho rủi ro compatibility khi đổi layout engine, không phải bằng chứng rằng Woo block templates có cùng cơ chế với Flatsome.

## 7. Giai đoạn child theme — hướng đã được chấp nhận

Mục tiêu: có trang Product/Post dùng được và có thể chỉnh các phần cần thiết mà không xây thêm một hệ thống theme builder.

| Nhóm | Phạm vi định hướng | Rationale |
|---|---|---|
| Block UI | Bố cục mặc định tốt; một số biến thể/preset khi có nhu cầu; xử lý thiếu dữ liệu và responsive | Giữ số tổ hợp kiểm thử có thể quản lý |
| Editor UX | Controls cho typography, màu, spacing, bật/tắt section, chọn preset trong phạm vi hỗ trợ | Người biên tập biết control làm gì và ảnh hưởng ở đâu |
| Technical | PHP/hooks tiếp tục sở hữu cấu trúc; native data; tách adapter GeneratePress và logic B2B khỏi layout | Giảm phần phải viết lại khi chuyển theme |

Các control trên là phạm vi định hướng, chưa phải danh sách setting đã triển khai hoặc thiết kế được khóa. Ví dụ tỷ lệ cột, width, heading style hoặc related section phải được đối chiếu nhu cầu và data model trước khi chốt UI.

Nếu cần vùng nội dung tự do, cho biên tập Gutenberg trong vùng đã xác định; giải thích rõ ranh giới chỉnh sửa. Không hứa drag-and-drop toàn template trong khi phần lớn cấu trúc vẫn nằm trong PHP.

Chuẩn bị tái sử dụng:

1. Giữ dữ liệu Product/Post native; không sao chép facts vào từng template.
2. Thành phần B2B có logic như Specifications, Documents, Request a Quote thuộc plugin; chỉ tạo block khi có scope và native chưa đáp ứng.
3. Giữ token thiết kế nhất quán; dùng `theme.json` ở phần phù hợp, không tạo một bảng font/palette khác chỉ cho builder.
4. Gom phụ thuộc hooks/wrappers GeneratePress thành adapter có thể tháo bỏ.
5. Mọi control phải kiểm đủ thay đổi → lưu → mở lại → frontend; không chỉ preview đẹp.

Không làm mặc định trong giai đoạn này: template CPT riêng, rule engine áp dụng template, editor canvas riêng hoặc cơ chế lưu template song song với WordPress.

## 8. Giai đoạn 2.x — migration từng bước hướng tới theme FSE độc lập

**2.0 là điểm bắt đầu migration.** Những phần chưa chuyển có thể tiếp tục dùng GeneratePress/PHP/hooks trong các bước trung gian. Cần xác định rõ owner và đường render của từng surface, giữ fallback và kiểm regression sau mỗi bước. Không coi việc mở version 2.0 là bằng chứng đã chuyển thành block theme hoặc đã có Site Editor đầy đủ.

Theme render độc lập không cần GeneratePress là tiêu chí của **đích đến hoàn tất migration**. Mốc đạt đích này chưa được chốt; không tự gán 2.0 hoặc xác nhận lại 3.0. Các nội dung FSE bên dưới mô tả trạng thái mục tiêu, được đưa vào từng bước khi đủ điều kiện kỹ thuật.

| Nhóm | Phạm vi định hướng | Điều cần bảo đảm |
|---|---|---|
| Block UI | Chuyển lần lượt Product/Post, header/footer và các trang nền tảng tới bộ template/patterns mục tiêu | Surface đã chuyển và chưa chuyển đều dùng được; không buộc người dùng tự ráp lại trang |
| Editor UX | Mở controls theo khả năng từng bước; đích đến là Site Editor sửa template, Inspector/Design Sidebar chỉnh thành phần, Global Styles quản lý thiết kế chung | Không hiện khả năng chưa hỗ trợ; không tạo hai nơi cùng điều khiển một giá trị mà thiếu thứ tự ưu tiên |
| Technical | Audit/tách adapter, chuyển render từng phần; đích đến dùng block templates/template parts native và plugin B2B | Context đúng, fallback rõ; giảm dần phụ thuộc GeneratePress, chỉ tuyên bố độc lập sau khi kiểm chứng |

Luồng mục tiêu khi surface tương ứng đã được chuyển sang nền tảng FSE đủ điều kiện, không phải toàn bộ luồng có sẵn ngay đầu 2.0:

```text
Sửa facts của một sản phẩm → Product editor
Sửa nội dung bài viết → Post editor
Sửa cấu trúc chung trang chi tiết → Site Editor → template tương ứng
Sửa style thành phần → controls của block / Design Sidebar bổ sung
Sửa thiết kế chung → Global Styles và tích hợp thương hiệu đã xác định ownership
```

Các thành phần nền tảng cần đưa vào migration plan: một template Product mặc định, một template Post mặc định, các trang nền tảng, header/footer, dữ liệu thật để preview, style chung, reset về mặc định và quy trình chuyển đổi. Thứ tự chuyển từng phần và phạm vi riêng của 2.0 chưa được chốt. Gallery/specs/documents/CTA phải dùng dữ liệu đối tượng đang xem.

Để sau khi có nhu cầu: nhiều layout theo category/tag, rule ưu tiên phức tạp, điều kiện thời gian/role và template ngoại lệ hàng loạt. Woo có khả năng template riêng từng sản phẩm [S4, S5], nhưng khả năng nền tảng không tự trở thành scope SKVN.

## 9. Ranh giới và quản lý chuyển đổi

| Thành phần | Child theme hiện tại | Migration từ 2.0 | Đích FSE độc lập |
|---|---|---|---|
| Product/Post data | WordPress/WooCommerce | Giữ nguồn dữ liệu, kiểm mapping/context | Giữ nguyên nguồn dữ liệu |
| Logic B2B | Plugin / flow nghiệp vụ | Tái sử dụng, kiểm từng render path | Plugin độc lập với GeneratePress |
| Cấu trúc chi tiết | PHP/hooks | Chuyển từng surface, giữ fallback phù hợp | Block templates |
| Header/footer | GeneratePress + SKVN integration | Tách adapter, thay từng phần theo plan | SKVN template parts |
| Visual system | Token/preset và controls có giới hạn | Đồng bộ token, chuyển controls theo khả năng | Theme styles + Global Styles; controls bổ sung cần thiết |
| Plugin Design Sidebar | Bổ sung design controls | Chỉ expose capability thực tế | Tiếp tục bổ sung, không nhân đôi Site Editor |

Các vấn đề chưa được quyết định chi tiết:

- Phạm vi bước đầu 2.0, thứ tự chuyển từng surface và mốc hoàn tất độc lập; tiêu chí giữ/bỏ adapter ở mỗi bước.
- Theme slug/đóng gói khi thoát child theme; giữ hay đổi identity; không tự rename namespace/plugin.
- Mapping options typography/colors/page-display cũ sang cấu hình FSE; xử lý setting không còn tương đương.
- Migration template tùy chỉnh trong database, header/footer đang lưu dưới dạng nội dung, menu và widgets/sidebar.
- Danh sách hook Woo hiện có cần giữ, thay bằng block hoặc loại bỏ có chủ ý; tránh CTA/tabs render hai lần.
- Quyền sửa template và quyền sửa nội dung; thông báo phạm vi ảnh hưởng khi lưu.
- Template reset, backup/export, staging và rollback. Đổi theme lại không tự đảo ngược mọi thay đổi database hoặc dữ liệu đã lưu.
- Chính sách nâng cấp template file khi người dùng có bản tùy chỉnh; tránh ghi đè tùy chỉnh âm thầm.
- Rank Math/schema/canonical, quote context và liên kết phải được kiểm lại; không suy ra đổi theme sẽ giữ nguyên toàn bộ output.

Preset/controls có thể đảo ngược tương đối dễ khi giữ nguồn dữ liệu và fallback. Migration theme + option/template data có chi phí đảo ngược cao hơn; phải có snapshot và diễn tập phục hồi trước production. Đây là yêu cầu chuẩn bị, không phải migration đang diễn ra.

## 10. Review matrix cho khảo sát và triển khai sau

Taxonomy theo [review contract](../standards/block-ui-editor-ux-technical-review-contract.md). “Chưa làm” bên dưới chỉ áp dụng yêu cầu mới trong báo cáo; không phủ định tính năng hiện có của dự án.

| ID | Nhóm | Hành vi mong đợi | Hiện trạng | Việc cần sửa/làm | Cách kiểm | Evidence cần lưu |
|---|---|---|---|---|---|---|
| TE-01 | Block UI | Product/Post có layout tốt với dữ liệu thật, đủ/thiếu ảnh và title dài | Đã có source PHP; Chờ kiểm chứng phạm vi mới | Chọn fixtures, xác định preset và section cần mở | Desktop/mobile, thiếu thông số/tài liệu, đọc bằng keyboard | URL, build, ảnh, DOM và nhận xét focus/contrast |
| TE-02 | Editor UX | Child theme chỉ hiển thị controls có hiệu lực và scope rõ | Chưa làm đặc tả controls Product/Post trong báo cáo | Chốt global/per-item và preview | Thay đổi, save/reopen, so frontend; editor hẹp và keyboard | Video/ảnh control, dữ liệu lưu, expected/actual |
| TE-03 | Technical | Dữ liệu không bị nhân bản khi đổi layout | Có native data/readers; Chờ kiểm chứng toàn flow | Inventory nguồn dữ liệu, adapters và metadata | Hai sản phẩm khác nhau, thay một facts, kiểm card/PDP | Mapping field, source và kết quả runtime |
| TE-04 | Block UI | Đích hoàn tất migration: FSE độc lập giữ nội dung/CTA và responsive; không phải điều kiện đầu 2.0 | Chưa làm; mốc hoàn tất chưa chốt | Template mặc định, fallback và các bước chuyển được kiểm riêng | Mỗi bước kiểm surface cũ/mới; khi hoàn tất kiểm render không có GeneratePress với dữ liệu thiếu/đủ | Template/DOM, screenshot, không overflow bất thường; ghi rõ bước migration |
| TE-05 | Editor UX | Template chung khác rõ dữ liệu item; preview đúng đối tượng | Chưa làm | Site Editor flow và quyền/nhãn phạm vi | Chọn hai items, save template, kiểm cả hai; reset | Screen recording, template hiệu lực, quyền thử |
| TE-06 | Technical | Quote/hook/template không trùng, không mất context | Source hook cũ tồn tại; Chờ kiểm chứng FSE | Audit render path và adapter | Product A/B, Woo inactive, quote link, cache; không duplicate query/assets vô ích | Source mapping, logs/network, RFQ context |
| TE-07 | Technical + Editor UX | Chuyển theme/reset/upgrade không mất dữ liệu ngoài ý muốn | Chưa làm | Migration và rollback contract | Staging có template tùy chỉnh + options cũ; upgrade/reset/restore | Backup, diff dữ liệu, bước phục hồi, actual |

Các state phải đưa vào fixture khi lập test chi tiết: Product/Post; ảnh có/không; title dài; dữ liệu B2B đủ/thiếu; draft/published; template gốc/tùy chỉnh; lỗi lưu/quyền hạn; Woo inactive. Kiểm responsive, accessibility và performance ở đúng surface, không chỉ một checklist cuối.

Không đặt ngưỡng performance tùy ý trong nghiên cứu. Khi triển khai cần baseline và số đo cho cùng trang/dữ liệu; block không dùng không nên kéo runtime thừa. Plugin UI mới tiếp tục English-first và i18n theo project protocol.

## 11. Điểm bắt đầu cho thảo luận tiếp theo

Thứ tự đề xuất, chưa phải task đã giao implement:

1. Chọn một Product và một Post thật để xác định phần nào cần chỉnh trong giai đoạn child theme.
2. Lập inventory setting: dữ liệu, preset layout, style component, global style; tránh mở control trùng ownership.
3. Xác định thành phần B2B có thể tái sử dụng và phần native WordPress/Woo đã đáp ứng.
4. Chốt bước migration đầu tiên của 2.0: surface nào chuyển trước, phần nào còn GeneratePress, fallback và tiêu chí nghiệm thu; tách khỏi bộ template mục tiêu cuối cùng.
5. Kiểm version WordPress/Woo onsite, tài liệu đúng version và compatibility hooks trước khi thiết kế kỹ thuật.
6. Lập migration plan từng bước khi được yêu cầu bắt đầu 2.0; tham chiếu planning 013 nhưng xác nhận riêng mốc hoàn tất, không tự coi 3.0 trong planning lịch sử là quyết định vừa được duyệt lại.

Từ báo cáo này không tự suy ra cần Elementor/WPBakery/Flatsome làm dependency, phải bật classic Template Editor ngay, hoặc phải triển khai FSE trong milestone hiện tại.

## 12. Danh mục nguồn và phạm vi dẫn chứng

Nguồn chính thức; truy cập 2026-11-03. Nội dung được diễn giải, không sao chép nguyên bài. URL đầy đủ để người đọc tự kiểm chứng; tài liệu có thể thay đổi sau thời điểm nghiên cứu.

| ID | Tài liệu / URL | Dùng để chứng minh |
|---|---|---|
| S1 | WordPress — [Themes](https://developer.wordpress.org/block-editor/how-to-guides/themes/) | Classic/block theme; `theme.json` không tự biến classic thành FSE |
| S2 | WordPress — [Site Editing Templates](https://developer.wordpress.org/block-editor/explanations/architecture/full-site-editing-templates/) | Template file và bản chỉnh trong `wp_template`/`wp_template_part`; không ghi đè file gốc khi edit |
| S3 | WordPress — [Template Editor](https://wordpress.org/documentation/article/template-editor/) | Classic theme có thể bật Template Editor; đường truy cập khác block theme; quản lý/reset template |
| S4 | WooCommerce — [Customizing Your Product Pages](https://woocommerce.com/document/woocommerce-store-editing/customizing-product-pages/) | Block theme/Site Editor, dynamic product data, shared và product-specific template |
| S5 | WooCommerce — [Customizing Single Product Pages](https://woocommerce.com/document/woocommerce-store-editing/templates/customizing-single-product-pages/) | Các thành phần của Single Product và đường truy cập chỉnh template |
| S6 | Elementor — [Create a single product template](https://elementor.com/help/single-product-site-part/) | Single Product là site part, quản lý tại Theme Builder |
| S7 | Elementor — [Set conditions for site part templates](https://elementor.com/help/conditions/) | Include/exclude và phạm vi áp dụng template |
| S8 | UX Themes — [How to create a custom product page](https://docs.uxthemes.com/article/245-how-to-create-a-custom-product-page) | Global/category/product layout, UX Builder, Product Hooks compatibility |
| S9 | WPBakery — [Template library](https://kb.wpbakery.com/docs/learning-more/template-library/) | Library bố cục để tải và dùng; đọc qua search index, không chứng minh full theme builder |
| S10 | WPBakery — [vc_add_default_templates()](https://kb.wpbakery.com/docs/inner-api/vc_add_default_templates/) | Theme/developer có thể thêm predefined content template; không phải bằng chứng display-condition engine |

Tài liệu nội bộ liên quan:

- [B2B product-page research](b2b-seafood-product-page-research-2026-11-03.md): nhu cầu buyer, nội dung trang và RFQ.
- [Plugin Design Sidebar ideation](../workflows/ideation-plugin-design-sidebar.md): scope sidebar; chưa đồng nghĩa template builder.
- [Planning 013](../../.context/planning/013_VERSION_2_0_0_TO_3_0_0_STANDALONE_BLOCK_THEME_PLANNING.md): planning lịch sử cùng nguyên tắc 2.0 bắt đầu migration; mốc 3.0 hoàn tất trong đó chưa được xác nhận lại bởi quyết định mới nhất.
- [Planning 014 — Element CPT](../../.context/planning/014_VERSION_1_X_SKVN_ELEMENT_CPT_PLANNING.md): hướng reusable site elements đã có; không được tự mở thành builder Product/Post riêng.
- [Theme module](../../.context/modules/THEME_SKVN_MARINE.md), [Plugin module](../../.context/modules/PLUGIN_SKVN_MARINE_BLOCKS.md), [AGENTS](../../AGENTS.md): ownership và quy trình dự án.

## 13. Kết quả của lượt lưu tài liệu

Đã ghi lại nghiên cứu, quyết định planning và giới hạn triển khai để thảo luận sau có nguồn chung; đã đính chính hiểu nhầm về mốc 2.0 theo lời human. Chỉ tạo/cập nhật báo cáo này; không sửa source, current milestone, metadata hoặc các tài liệu đang có thay đổi khác. Chưa có onsite test mới, chưa có acceptance runtime nào được chuyển sang PASS.
