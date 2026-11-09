# V1 / 1.3.20 — Product Category Grid + Category details

**Delta đã duyệt về hướng — 2026-11-09:** [plan061](061_VER_1_3_20_CATEGORY_GRID_DESCRIPTION_ACTION_CONTROLS_PLAN.md) cụ thể hóa Full plain-text description/Excerpt, desc alignment và Action width/alignment/radius px/placement/gap. Human giao planning chi tiết, chưa coding delta; nằm trong current1.3.20, không version mới. Những chỗ dưới nói card luôn hiển thị excerpt là baseline **Excerpt**, không áp Full. Native description/storage/save contract và toàn bộ CG/DS acceptance giữ; thêm CGD-* và runbook riêng. Không suy approval này thành full054 Sidebar hoặc runtime PASS.

Human transition2026-11-07: **current V1 /1.3.20 — Product Category Grid + Category details + Woo Archive M1**, bắt đầu theo lệnh human.1.3.19 DEFERRED_WITH_CARRY_OVER, full acceptance/evidence tại history và current carry register; không completed/PASS. Các current1.3.19/chưa-chuyển-mốc phía dưới là checkpoint lịch sử. Metadata sync development1.3.20, không release/deploy/git remote push. Card ảnh1:1, ratio controls next scope và Blog/ArchiveM2 chưa start.

Ngày: 2026-11-04. **PLANNED, chưa start/coding.** Current là 1.3.19, agent Sol đang triển khai Sidebar theo 048. Human yêu cầu lập plan song song; không phải lệnh chuyển current. Version 1.3.20 đã chốt, không hỏi lại.

## 1. Mức độc lập và nguồn quyết định

Category Grid độc lập về block, query taxonomy, card renderer và dữ liệu WooCommerce; không cần Carousel runtime hoặc Hero 1.3.21. Planning/data contract/fixtures làm song song được. Integration Design phụ thuộc shell/selection/control contract của 1.3.19; chưa thể gọi toàn bộ milestone hoàn toàn độc lập hoặc nghiệm thu sidebar trước nền đó.

Nguồn: `docs/ideations/category-grid-spec.md` D01–D12 và CG-*; `docs/artifacts/editor-ui/category-grid-picker-prototype.html` + companion `.md` (design lock 2026-10-28); MILESTONES §1.3.20; plan048 (Sidebar); plan047 (identity/independence). Tài liệu này cụ thể hóa công việc, không đổi decision đã chốt hoặc tự coi các đề xuất §6 đã được duyệt.

Đã chốt: Product trước, Post Category riêng version TBD; Grid không carousel; chọn thủ công có thứ tự; không tự chọn con; archive mặc định/custom URL local; thumbnail và description lưu native Woo dùng chung; placeholder Woo; category rỗng vẫn chọn/lưu nhưng ẩn frontend; Save category riêng hoặc Save/Update trang; native notices, partial failures giữ draft; không autosave blur/close. Không taxonomy manager/filter/archive builder, focal point, Floating media, SEO scoring hoặc Post Category trong đợt này.

Plugin có styling/runtime riêng, không yêu cầu WindPress/theme SKVN để grid hoạt động. Theme integration/token override phải có fallback. Source tiếp tục prefix/namespace hiện hành tới migration1.4.0; tên sản phẩm Marine Blocks không đồng nghĩa rename namespace ngay.

## 2. Baseline và dependency contract

Audit source 2026-11-04:

- `src/index.ts` hiện đăng ký Product/Post Collection, chưa thấy Product Category Grid. Đề xuất module riêng `src/product-category-grid/` và `modules/category-grid/`, không ép category thành product hoặc sao chép Product Card rồi ẩn giá/attributes.
- `modules/collection-render/query-products.php` query sản phẩm có limit và order. Không dùng kết quả giới hạn này để suy category count/hide-empty; taxonomy resolver là owner riêng.
- Prototype companion ghi rõ drag desktop chưa có source dù hành vi đã duyệt. Giữ Add dialog/search/hierarchy/Apply/Cancel, selected list/details/dirty/notices baseline; thực hiện desktop handle drag + keyboard Up/Down, touch Move up/down. Không coi HTML mock là implementation Gutenberg.
- Chưa có evidence phiên bản WP/Woo onsite, API thumbnail/category writes hoặc page-save integration được kiểm. P0 xác minh nguồn đúng version; không chọn endpoint từ giả định latest. Không sửa mã external Woo/GeneratePress.

| Boundary | Contract cho 1.3.20 |
|---|---|
| Sidebar shell từ1.3.19 | Target clientId + block type, open group/back, unsupported/delete/undo lifecycle; Category adapter chỉ được đăng ký khi có consumer |
| Inspector Category | Picker/list/order, Category details và local destination; rõ target term ID + hierarchy path |
| Selected block Design | Layout/media/typography/color/border/radius/shadow controls có consumer; attrs thuộc block, reuse groups đã kiểm nếu phù hợp |
| Category entity editing | Draft/status theo term ID, chia sẻ giữa các block trong phiên; do module Category sở hữu, không đặt vào global Theme Design store |
| Theme Design1.3.19 | Save riêng, Page Save không ghi; không thay đổi bởi Category save coordinator |
| Category details1.3.20 | Save riêng hoặc explicit Page Save/Update/Publish theo contract §4; không periodic autosave; preview dùng draft đã ghi nhãn, frontend dùng dữ liệu persisted |

Không tạo Sidebar thứ hai để tránh dependency. Trong coding tương lai, data/render có thể tiến trước integration nhưng trước khi đưa consumer lên build phải kiểm shell contract. Không sửa source/shared files đang do Sol triển khai trong lượt planning này.

## 3. Data/render contract đề xuất

| Dữ liệu | Owner | Invariants |
|---|---|---|
| Ordered selected terms | Block attributes: danh sách item có termId và destination local | ID hợp lệ, thứ tự ổn định, không snapshot tên/ảnh/description/count |
| Display/layout/design | Block attributes | Validate bounded values; defaults §6 chưa phải approval; Page Save/Undo sở hữu |
| Thumbnail/description | Native category entity | Không store override trong block; gỡ thumbnail không xóa attachment |
| Editing draft | Session state keyed by termId, field dirty/revision/base value/status | Cùng term dùng chung draft; bỏ item/đổi block không âm thầm publish hoặc mất draft |
| Archive/name/count | Resolver từ catalog/taxonomy hiện tại | Rename/slug change phản ánh ở lần resolve; missing term giữ warning/editor selection, frontend bỏ qua |

Resolver dùng cùng định nghĩa eligibility cho count và hide-empty (§6 Q1). Bảo toàn thứ tự đã chọn sau lọc. Toàn bộ empty/Woo unavailable có trạng thái editor rõ, frontend không fatal. Thiếu ảnh không có nghĩa empty. Custom URL không bỏ qua eligibility.

Render động; không chạy Swiper cho grid. Đọc metadata/ảnh theo batch/cache có đo baseline, không query count từng card hoặc tải toàn bộ catalog vào browser mặc định. Product xuất hiện ở nhiều descendants chỉ tính một lần trong count parent. Không thêm persistent cache trước khi định nghĩa invalidation cho product visibility/stock/term relationship/category edit. Trong P0 benchmark với catalog thực hoặc fixture lớn, ghi request/query count; không hứa hiệu năng khi chưa đo.

## 4. Save coordination và concurrency

1. Edit thumbnail/description tạo dirty revision của term và update editor preview; Page attrs/URL/design vẫn là luồng riêng. Không ghi entity chỉ vì đổi selection/blur/đóng panel.
2. Save category gửi snapshot các fields dirty, termId, base values/revision. Response chỉ clean đúng revision đã gửi; gõ tiếp trong lúc pending giữ dirty mới. Không gửi hai bản cùng term mâu thuẫn từ hai block.
3. Explicit Save draft/Update/Publish trang đề xuất cùng flush Category details dirty theo spec; **autosave/background save không flush**. P0 cần chứng minh public integration phân biệt intent này trên WP/Gutenberg thực tế; không monkey-patch DOM nút Save hoặc chỉ nhìn `isSavingPost` rồi suy manual save.
4. Page và terms không atomic. Ghi nhận page outcome và từng term; không hiện “all saved” khi thiếu kết quả. Page fail/term success hoặc ngược lại đều có thông báo chính xác; không rollback dữ liệu đã lưu thành công. Retry chỉ phần lỗi, tránh request trùng nếu Save category đang pending.
5. Đề xuất optimistic conflict check: field đang sửa chỉ được ghi nếu persisted value còn khớp base đã đọc; conflict giữ draft, báo current vs draft và cho Reload/Review, không silent last-write-wins. API có precondition/version phù hợp thì reuse; nếu không có, P0 phải đặc tả server check và giới hạn race thực tế, không gọi so-sánh client là bảo đảm concurrency.
6. Server kiểm term/taxonomy capability và media permission riêng; validate attachment type/id, URL và description; sanitize + escape theo context. Page editor thiếu quyền term được xem nhưng không write. Không dùng duy nhất quyền edit page để sửa taxonomy.
7. Native notices tổng hợp, lỗi bền ở item; dismiss không xóa draft. Session có dirty/pending được cảnh báo khi rời trang. Page Undo không rollback entity đã publish; nhãn shared-scope giải thích rõ.
8. Sau save invalidate/refetch entity dùng chung, giữ draft revision mới nếu đang gõ tiếp. Image remove quay lại Woo placeholder sau persisted save. Không auto retry vô hạn.

**Gate kỹ thuật P0:** native API/read/write/permissions, explicit save intent, concurrency là việc agent audit, chưa phải feature API đã chứng minh. Nếu public Page Save integration không đạt, trình evidence/memo riêng trước đổi behavior; không tự phát hành “chỉ Save category” và đánh dấu CG-UX-03 PASS.

## 5. Gói thực hiện sau khi được start

| Gói | Công việc | Deliverable/gate |
|---|---|---|
| C0 — Audit | Phiên bản WP/Woo, API/media/permissions, count truth table, save intent/concurrency, reusable Sidebar source sau048 | Source references đúng version; schema/owner matrix; fixture và capability matrix; xử lý Q1–Q3 trước phần phụ thuộc |
| C1 — Contract và artifact bổ sung | Giữ nguyên picker design lock; bổ sung card defaults/all-empty, description representation, save races/conflict states ngoài phạm vi HTML cũ | Artifact companion mới; không ghi đè baseline đã khóa; human duyệt phần thực sự mới |
| C2 — Dynamic read/render | Block registration/schema, category resolver, eligible counts/placeholder, grid/card/link | CG-UI-01–04, CG-TECH-03/04; fixture empty→visible và rename/delete; schema không chứa entity snapshot |
| C3 — Picker và block editing | Apply/Cancel, hierarchy/search, pagination/loading/error nếu catalog lớn, order/remove/keyboard/touch, display/local links | CG-UX-01; draft selection chỉ commit khi Apply; selected order không đổi do search/pagination |
| C4 — Shared Category details | Native thumbnail/description writes, shared draft/revision/conflict, per-term Save, page coordinator/native notices | CG-UX-02/03 và TECH-01/02; thử failures/races/quyền trước global integration |
| C5 — Sidebar integration | Category adapter vào shell048, Design groups, back/target/undo, conditional controls | DS-01–07 áp cho Category; không lẫn entity dirty và Theme Design settings; Product/Post regression |
| C6 — Onsite/release evidence | Human build/lint; packaging audit nếu PHP require/include mới, complete cases/fixture matrix | Evidence CG-* + DS có URL/build/role; human approval trước completion |

C2/C3 có thể tách data/UI để review, nhưng không tự start coding chỉ vì đã có plan. Khi coding giữ phạm vi file local tối đa; shared extraction chỉ khi có consumers thật, không tạo universal taxonomy framework. Đọc CSS safety và block review contracts trước implement geometry.

Acceptance gốc giữ nguyên tại spec §10, không đổi IDs hoặc suy PASS từ artifact:

| IDs / Nhóm | Hành vi mong đợi | Hiện trạng | Việc cần sửa | Cách kiểm | Evidence |
|---|---|---|---|---|---|
| CG-UI-01/02 — Block UI | Grid responsive + nội dung đầy đủ/ảnh fallback, không cắt entity description | Chưa làm | C2/C3 card/layout | 1/5/10 terms; long title/HTML desc/no image; narrow/mobile | Paired shots, rect, persisted description |
| CG-UI-03/04 — Block UI | Empty/count đúng; archive/custom và focus đúng | Chưa làm | C2 eligibility/link | Parent/child, visibility/stock, slug change, all empty, keyboard | Fixture counts, href/DOM/focus |
| CG-UX-01 — Editor UX | Picker/order/details đúng target | Chưa làm | C3 | Trùng tên/parent, Apply/Cancel, drag cancel, keyboard, touch | Video + selection attrs |
| CG-UX-02/03 — Editor UX | Shared/local rõ; dirty/save/retry không mất draft | Chưa làm | C4 | Hai blocks cùng term; save riêng/page; partial failures | Video + requests + persisted values |
| CG-TECH-01/02 — Technical | Native data, đúng quyền; chống stale/duplicate/conflict | Chưa làm | C0/C4 | Role thiếu quyền/media; typing while saving; hai tab | Request order + server values/error evidence |
| CG-TECH-03/04 — Technical | Saved attrs an toàn; dependency/assets graceful | Chưa làm | C2–C4 | Reopen/Undo/duplicate; delete term/image; Woo inactive test env | Serialized diff, network/console |
| CG-TECH-05 + DS-01–07 — Cả ba nhóm | Shared controls không regression, target/save/lifecycle đúng | Chưa làm | C5/C6 | Old Product/Post Grid/Carousel + Category; theme fallback, style edits/tab switch | Before/after images, attrs, network/cleanup |

Trước onsite tạo `docs/testing/product-category-grid-1.3.20.md`: URL editor/frontend cần human/executor cung cấp; WP/Woo/theme/plugin version/build/source; fixtures direct/child-only/duplicate descendants/hidden/draft/private/out-of-stock/empty/deleted, valid/missing images, same term in two blocks, two editor sessions. Expected/actual + status/evidence cho từng ID. Chỉ đổi Woo/theme hoặc inject failure trên test environment được phép. Build/lint do human chạy theo AGENTS; planning này không build.

## 6. Decision register — human duyệt 2026-11-04

Sau khi giải thích rationale của card defaults và ý nghĩa 3/2/1, human xác nhận “Ok chốt các đề xuất”: **Q1=A, Q2=A, Q3=B**. Các memo bên dưới giữ phương án/rationale; approval này thay các gate chờ chọn Q1–Q3 và các ghi chú “còn đề xuất/chưa duyệt” tương ứng trong §1–5. Không hỏi lại ba lựa chọn này. Chưa start/coding 1.3.20, chưa runtime PASS.

3/2/1 là default số cột ở vùng chứa rộng/vừa/hẹp, số hàng tự sinh theo toàn bộ category đủ điều kiện; không giới hạn tổng category. Có controls chỉnh số cột từng mức. Container hẹp trên desktop vẫn giảm số cột; breakpoint/min card width cụ thể phải đo trong C1, không suy đã duyệt một bộ pixel thresholds. Defaults chỉ áp block mới. Image/name bật, description/count/CTA tắt ban đầu nhưng vẫn hỗ trợ đầy đủ qua toggles; không loại chức năng hoặc đổi picker/details design lock.

### Q1 — Count và hide-empty: APPROVED A

1. Vấn đề: “có sản phẩm” chưa định nghĩa với descendants/catalog visibility/stock.
2. A: sản phẩm publish được phép hiện catalog, gồm descendants, stock theo store; count và hide-empty dùng cùng tập. Chính xác theo khách thấy nhưng query/cache phức tạp hơn. B: count gán trực tiếp/term count native; đơn giản hơn nhưng parent có thể bị ẩn dù con có hàng và count khác catalog.
3. Khuyến nghị A; deduplicate product IDs ở parent. Custom URL không bypass hide-empty; tất cả rỗng thì ẩn section frontend, editor giải thích.
4. Evidence: spec §7 còn mở semantics; `modules/collection-render/query-products.php:17–63` là product listing có limit, không phải category eligibility resolver.
5. Tự kiểm ≤5 phút: đọc §7, tạo/quan sát category cha chỉ có sản phẩm ở con trên test catalog; so count/archive trước chọn thuật toán.
6. Đảo ngược: đổi resolver được, nhưng thay nghĩa count có thể đổi category hiển thị; giữ fixture để kiểm regression.
7. Quyết định: human duyệt A ngày 2026-11-04; C0/C2 chứng minh resolver theo truth table, không dùng raw count khác semantics thay cho requirement đã chốt.

### Q2 — Card defaults và links: APPROVED A

1. Vấn đề: prototype khóa picker, chưa khóa card defaults (companion ghi rõ).
2. A: baseline gọn: desktop/tablet/mobile 3/2/1 cột, gap preset medium, image/name bật, description/count/CTA tắt mặc định; frame1:1 Contain, lựa chọn Cover; tên đầy đủ, description plain-text excerpt tối đa3 dòng khi bật; CTA “Explore category”; một link semantic cho card/CTA cùng đích, cùng tab; mỗi term chỉ một lần/block. Dễ scan, cần bật thêm chi tiết. B: mặc định bật description/count/CTA như canvas minh họa, thông tin nhiều hơn nhưng card dài/rối hơn.
3. Khuyến nghị A. Cột là desired columns, co lại theo container/min card width đo ở C1, không hardcode viewport khiến tràn. Empty description không sinh marketing copy giả. Không mở new-tab/focal/Floating trong baseline; nếu cần khác hãy chốt trong C1.
4. Evidence: spec §3/§11 và prototype companion “Giới hạn” nói defaults/media chưa khóa; HTML `render()` chỉ minh họa tất cả fields, không product requirement.
5. Tự kiểm ≤5 phút: mở prototype + companion, so 5 categories tên dài trên container hẹp; C1 cung cấp ảnh A/B để chốt số/geometry trước code.
6. Đảo ngược: defaults chỉ áp block mới, không ép rewrite content cũ; đổi toggle local dễ đảo.
7. Quyết định: human duyệt A ngày 2026-11-04 sau giải thích trade-offs và 3/2/1. C1 kiểm geometry/edge cases và cụ thể hóa ngưỡng container; không mở lại defaults hoặc tự chuyển sang B. Chỉ implement khi milestone được start.

### Q3 — Description đã có HTML: APPROVED B

1. Vấn đề: textarea prototype không định nghĩa cách sửa description native có HTML mà không phá nội dung đang dùng ở archive.
2. A: editor text plain cho nội dung mới; nếu existing HTML thì giữ nguyên và chuyển tới native editor để chỉnh, tránh chuyển đổi ngầm nhưng phải rời flow. B: hỗ trợ tập rich text an toàn phù hợp native field, bảo toàn nội dung không chỉnh; card dùng excerpt text riêng ở render. Đáp ứng onsite editing tốt hơn nhưng tăng sanitize/roundtrip QA.
3. Khuyến nghị B, giới hạn formatting thực sự được native API cho phép sau audit; không full page builder trong description. Chỉ chỉnh description khi field dirty, thay thumbnail không được normalize/rewrite description.
4. Evidence: spec §3.2 còn mở plain/rich, §5 yêu cầu shared native description; prototype `showDetails()` dùng textarea/fixture text nên chưa chứng minh HTML roundtrip.
5. Tự kiểm ≤5 phút: xem source prototype showDetails và một category description có paragraphs/link trên test site; so giá trị raw trước/sau save thumbnail-only.
6. Đảo ngược: UI có thể đổi, dữ liệu bị strip là khó khôi phục; bắt buộc fixture/backups và không auto convert.
7. Quyết định: human duyệt B ngày 2026-11-04; C0 audit native formatting/API và C4 bảo toàn dữ liệu, không write description bằng excerpt đã strip hoặc tự coi textarea đủ acceptance.

Save draft/Update/Publish đều flush shared terms là đề xuất làm rõ phạm vi explicit save, cần xác nhận trong C1 cùng cảnh báo tác động toàn site ngay cả trang chưa publish. Không hỏi lại Save category + Page Save đã chốt; nếu muốn loại Save draft/Publish, ghi rõ ngoại lệ. Concurrency/API/permissions là audit kỹ thuật của agent; chỉ hỏi thay đổi hành vi sau khi có bằng chứng giới hạn.

## 7. Completion và handoff

Không chỉ hoàn thành renderer: cần CG-UI-01–04, CG-UX-01–03, CG-TECH-01–05 và DS áp Category đủ evidence hoặc human defer rõ ID/đích. Block UI, editor và technical là ba nhóm riêng; approval mockup không phải runtime PASS. Giữ standalone plugin fallback, legacy Product/Post không regression, term data không snapshot và Page Undo không hứa rollback shared changes.

Chỉ start sau human yêu cầu triển khai1.3.20; thực hiện transition/metadata lúc đó. Không lấy việc lập plan song song làm quyền đổi current hoặc sửa source của1.3.19. Prefix migration1.4.0 sẽ inventory block mới nếu đã có source; không rename sớm trong1.3.20.
