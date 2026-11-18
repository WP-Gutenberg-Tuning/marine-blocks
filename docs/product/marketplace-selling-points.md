# Marine Blocks — Marketplace selling points register

Ngày bắt đầu: **2026-11-06**. Trạng thái: **Tổng hợp nội bộ; chưa trình bày marketing hoặc xuất bản**.

Human xác nhận Content Actions là một sale point và yêu cầu ghi lại trước, tổng hợp dần; đến giai đoạn đưa lên marketplace mới chọn cách trình bày. Tài liệu này lưu lợi ích, use case, giới hạn và evidence của từng tính năng. Không phải listing, cam kết bán hàng, release approval hoặc spec kỹ thuật thay thế planning.

## 1. Cách dùng register

- Khi human chỉ định một tính năng là sale point, thêm ID ổn định và brief có source/evidence. Không tự gán mọi feature đang phát triển là điểm bán đã duyệt.
- Tách **giá trị dự kiến**, **source đã có**, **test trong phạm vi cụ thể**, **runtime đã nghiệm thu**, **được dùng làm public claim**. Human duyệt giá trị không tự chứng minh runtime hoặc tính khác biệt so với đối thủ.
- Cập nhật evidence khi có test/feedback; không nâng claim dựa trên số tests hoặc một commit. Không tự hứa thời gian tiết kiệm, hiệu năng, độ tương thích hay tính độc quyền khi chưa đo/research.
- Khi chuẩn bị marketplace submission/public launch: đọc register, audit lại current source/namespace và QA, tổng hợp các điểm đủ evidence, rồi trình human chọn thứ tự/cách kể chuyện/demo/visual. Sau đó mới viết public copy tiếng Anh theo product-language rule.
- Chưa chốt marketplace cụ thể, giá, edition/free/pro, ngày phát hành hoặc bộ assets. Không tự gán milestone/SemVer cho việc trình bày marketing.

Gate launch hiện hành vẫn theo [quyết định public launch](../decisions/gu-supercharger-launch-post-1.5x.md), amendment Marine Blocks2026-11-04 và [migration047](../../.context/planning/047_VER_1_4_0_MARINE_BLOCKS_MIGRATION_PLANNING.md). Register này không đổi gate sau1.5.x hoặc tự cho launch sau khi hoàn thành một feature.

## 2. Danh mục đang tổng hợp

| ID | Tính năng | Giá trị human đã chọn | Source / evidence hiện có | Trình bày marketplace |
|---|---|---|---|---|
| SP-01 | Content Actions — Copy content / Paste content only | Tái sử dụng nội dung giữa các block cùng loại/cùng cấu trúc, giữ thiết kế block đích, giảm nhập lại khi dựng lại section | Source `0a53a2d`, repair `8ee4a3f`;18/18 model tests human báo2026-11-06;11/11 controller tests với WP APIs mock. Build/lint/onsite chưa nghiệm thu | Đã xác nhận là sale point; lưu brief, chưa viết listing/demo bán hàng |
| SP-02 | Organized Editor UI — khung làm việc có thứ tự | Phân biệt rõ các block và nhóm công việc, giúp người biên tập định hướng và hạn chế nhầm lẫn | Human chọn2026-11-06; evidence UI cần chụp sau deploy, acceptance của từng surface vẫn riêng | Tổng hợp nội bộ; agent nhắc chụp ảnh lúc deploy, trình bày khi chuẩn bị marketplace |

## 3. SP-01 — Content Actions

### Vấn đề và lợi ích

Khi dựng một section mới hoặc chỉnh thiết kế, người biên tập muốn dùng lại tiêu đề, đoạn văn, ảnh, liên kết hoặc lựa chọn dữ liệu của section cũ. Copy nguyên block có thể mang theo thiết kế nguồn; nhập lại từng trường tốn thao tác và dễ bỏ sót nội dung.

Content Actions cho phép chuyển phần content được hỗ trợ vào block đích tương thích, trong khi giữ layout và style của block đích. Giá trị sản phẩm là tách việc tái sử dụng nội dung khỏi việc thay thiết kế. Đây là tiện ích biên tập; không phải cơ chế khôi phục dữ liệu bị mất hoặc bảo đảm mọi update plugin không cần migration.

Đối tượng/use case dự kiến: người dựng website, agency và người biên tập lặp lại các section. Chưa có nghiên cứu người dùng hoặc số đo tiết kiệm thời gian; không dùng con số/ROI trong public claim.

### Luồng tính năng để lưu mô tả

1. Có một block nguồn và một block đích cùng loại, cùng cấu trúc con; đích đã được thiết kế theo nhu cầu.
2. Trong menu **⋮ của block nguồn**, chọn **Copy content**.
3. Trong menu **⋮ của block đích**, chọn **Paste content only**.
4. Content hợp lệ ghi đè các trường content tương ứng; style/layout/behavior của đích được giữ. Empty hợp lệ cũng ghi đè, không được xem là “bỏ qua”.
5. Khác loại/cấu trúc hoặc content/quyền không phù hợp thì từ chối toàn thao tác và thông báo. Page Save vẫn do người biên tập thực hiện; action không tự publish.

Luồng trên mô tả contract sản phẩm đã duyệt, không phải xác nhận menu/clipboard/Undo đã runtime PASS. Feature hiện dùng gate Core Control `block_clipboard`, default false; không quảng cáo là luôn bật sẵn ở mọi installation.

### Phạm vi phải giữ khi trình bày

| Hạng mục | Contract / giới hạn |
|---|---|
| Root hỗ trợ | Product Collection, Post Collection, Slider, Slide; một root mỗi thao tác |
| Tương thích | Exact block type và tree shape; cùng Collection Grid↔Carousel được phép nếu các giá trị hợp lệ với layout đích |
| Content | Các trường được allowlist: text, media/link và query selections được duyệt; không phải mọi attribute hoặc mọi core block độc lập |
| Thiết kế đích | Giữ layout, typography/style, overlay và behavior ngoài allowlist; inline presentation nguồn được loại, semantic formatting được giữ theo policy |
| An toàn thao tác | Reject khác loại/shape, bound/entity/invalid/unsupported nodes, editing mode/permission không phù hợp, payload quá giới hạn; revalidate sau await |
| History | Contract một Undo/Redo cho toàn Paste, no-op không thêm history; actual WordPress history còn chờ kiểm chứng |
| Ngữ cảnh | Site/page/post editor theo scope057; browser clipboard permissions vẫn áp dụng |
| Ngoài phạm vi | Chuyển dữ liệu cross-site/media-ID mapping, copy giữa mọi loại block, automatic migration/recovery, paste riêng một phần cây khác cấu trúc |
| Right-click | Chưa có; plan058 Deferred sau2.0. Không đưa hình/menu chuột phải vào demo của feature hiện tại |

Không dùng câu “copy mọi nội dung sang bất kỳ thiết kế nào”, “update không mất dữ liệu”, “hoạt động trên mọi theme/browser/WordPress version” hoặc “nhanh hơn X%” khi scope/evidence chưa hỗ trợ.

### Evidence và việc cần có trước public claim

| Mục | Trạng thái2026-11-06 |
|---|---|
| Human chọn là sale point | Đã xác nhận trong chat2026-11-06 |
| Source | `0a53a2d` implementation, `8ee4a3f` repair |
| Model tests |18/18 PASS; human output Node24.16.0/npm11.13.0 |
| Controller tests |11/11 PASS với WP store/parser/clipboard mock, HTML DOMParser JSDOM thật |
| Build/lint và actual Gutenberg round-trip | Chờ evidence |
| Menu/gate/keyboard/touch, clipboard permissions, mismatch/binding/race | Chờ onsite evidence theo runbook |
| Undo/Redo/no-op và Save/reopen/frontend | Chờ onsite evidence |
| Compatibility khi Marine Blocks migration1.4.0 | Cần audit/test lại trên namespace và artifact thực tế trước marketplace |
| Public claim, screenshot/video, listing copy | Chưa làm; trình human ở giai đoạn marketplace |

Demo cần chuẩn bị **khi tới giai đoạn trình bày**: hai block cùng loại/cấu trúc có thiết kế khác nhau; Copy/Paste content và đối chiếu style đích, rồi Undo và Save/reopen. Chọn thêm một mismatch để thể hiện thông báo rõ ràng nếu human thấy phù hợp. Chỉ quay trên build đã nghiệm thu; không dựng video mô phỏng thành bằng chứng runtime.

## 4. Source of truth và cập nhật tiếp

SP-02 brief tại§5; các tính năng được human chọn tiếp theo dùng SP-03,SP-04… Không tái dùng ID đã có.

- Product/technical policies, thảo luận và quyết định tiếp tục ở [plan057](../../.context/planning/057_FUTURE_CANDIDATE_BLOCK_CONTENT_COPY_PASTE.md), không tạo spec song song tại đây.
- Acceptance/evidence: [runbook Content Actions](../testing/block-content-actions.md); giữ CCP-* và R01–R06.
- Right-click riêng: [plan058](../../.context/planning/058_FUTURE_CANDIDATE_EDITOR_CONTEXT_MENU_AFTER_2_0.md).
- Brief này phải cập nhật khi scope hoặc evidence đổi; các sale points mới được human chỉ định tiếp tục thêm ID mới vào cùng register.

## 5. SP-02 — Organized Editor UI

**Human decision2026-11-06:** Editor UI cũng là selling point vì tổ chức bộ khung làm việc theo thứ tự để người dùng đỡ nhầm lẫn. Ghi giá trị này để tổng hợp; chưa phải kết quả đo usability hoặc claim “không bao giờ bấm nhầm”.

Giá trị dự kiến: khung preview, nhãn loại block, nhóm nội dung/query/design và sidebar có tổ chức giúp người biên tập biết đang sửa phần nào, phân biệt phạm vi của các control và định hướng trong page nhiều section. Không mô tả mọi surface đã hoàn tất chỉ vì shared frame hoặc Sidebar có source.

**Trigger cần nhớ:** mỗi lượt deploy liên quan Editor UI, agent nhắc human chụp ảnh; nhắc lại khi human xác nhận đã deploy và editor nạp đúng build nếu chưa có ảnh. Checklist tại [deploy workflow](../workflows/deploy-artifact-workflow.md#post-deploy-reminder--editor-ui-screenshots). Không đặt giờ nhắc khi chưa có ngày deploy và không tự deploy.

Ảnh cần thu: tổng thể editor + block đang chọn, một số khung/nhãn block đại diện và nhóm điều khiển/sidebar; đủ ngữ cảnh để thấy thứ tự công việc. Ghi build/commit, version, URL/page, viewport, trạng thái selection và đường dẫn ảnh để dùng lại khi chuẩn bị marketplace. Thu ảnh nội bộ trước, chọn ảnh/caption/demo và trình human sau.

| Evidence / boundary | Trạng thái |
|---|---|
| Human chọn là selling point | Đã xác nhận2026-11-06 |
| Ảnh Editor UI trên build deploy thực tế | Chờ deploy/human cung cấp; chưa có asset marketplace được chọn |
| Preview frames / Design Sidebar | Tham chiếu plans048/052/053/054 và runbooks tương ứng; giữ trạng thái riêng từng yêu cầu |
| Inserter SVG/grouping | Plan056 future1.4.x riêng; không quảng cáo vấn đề icon/grouping đã giải quyết |
| Chứng minh giảm nhầm lẫn | Giá trị human muốn nhấn mạnh; chưa có đo lường, không công bố tỷ lệ cải thiện |
| Listing/visual marketing/publication | Để giai đoạn marketplace, chưa thực hiện |
