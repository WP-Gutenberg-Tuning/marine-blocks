# Block Inserter — SVG icons và grouping

Ngày: **2026-11-05**. Status: **PLANNED — chưa triển khai**.
Human yêu cầu ghi kế hoạch sau khi trực tiếp dùng Inserter: “tui làm ra mà hay bấm nhầm vì không có svg phù hợp cũng như cái grouping phù hợp”.

## 1. Lịch và scope đã chốt

- Đưa vào **1.4.x, sau các scope 1.4.x đã có**: 1.4.0 Marine Blocks Migration → 1.4.1 Setup UI → 1.4.2 Layout/Quote Validation → 1.4.3 Interactive Illustrated Map → **Inserter SVG & Organization**.
- SemVer cụ thể **TBD**, chưa tự gán1.4.4; human đã chốt khoảng version/thứ tự, chưa chốt số patch hoặc lệnh start. Đối chiếu ledger và Version Naming Rule trước implementation.
- Current giữ **V1 / 1.3.19**. Không làm ngay trong current, không bump metadata/archive acceptance hoặc đổi public launch gate.
- Đây là scope **Block Inserter** (danh sách chọn block), riêng với visual controls trong Design Sidebar plan054 và khung preview plan053/055. Không tự dời hoặc hủy acceptance các plan đó.

## 2. Vấn đề và evidence

Screenshot human2026-11-05 cho thấy các item nằm chung category SKVN MARINE: Responsive Spacer, Accordion, Hero Slider, Product Showcase, Card Carousel/Grid/Card, Feature Showcase, Post Collection/Grid/Carousel, Product Collection/Grid/Carousel và Product Category Grid. Nhiều icon giống hoặc gần giống nhau; tên dài xuống dòng, khó quét nhanh và chọn đúng loại. Human report đã bấm nhầm nhiều lần, nên đây là usability issue, không chỉ làm đẹp icon.

Nguồn ảnh trong chat: `codex-clipboard-b7aa85a3-a672-4e20-8540-4997562f4ae3.png`. Ảnh temp không phải repo artifact bền; khi mở implementation cần fixture screenshot mới, ghi WP/build/version sau migration.

Source inventory ban đầu:

- `src/product-collection/variations.ts`: Product Grid/Carousel đều scope inserter, không icon riêng trong variation hiện tại.
- `src/post-collection/variations.ts`: Post Grid/Carousel cùng family, cần audit tương tự.
- `src/slider/variations.ts`: Hero/Showcase/Carousel variations; cần phân biệt với Collection Carousel và Feature Showcase.
- `src/*/block.json`, `src/index.ts`, PHP category registration: audit base blocks + variations + inner blocks để biết từng item xuất hiện vì sao.

Không kết luận tất cả item giống nhau là dư thừa. Collection base entry, variations và block cha/con cần kiểm riêng trước khi quyết item nào nên hiện trong Inserter.

## 3. Scope thiết kế cần làm khi tới lượt

1. **Inventory đầy đủ:** item title, namespace/block, variation, attributes mặc định, icon, category, keywords, inserter scope, parent/ancestor và khả năng chèn độc lập.
2. **Bộ SVG có ý nghĩa:** cùng viewBox/nét/tỷ lệ, nhìn rõ ở kích thước icon Inserter; phân biệt Grid bằng ma trận, Carousel bằng dãy card/navigation, Hero bằng slide lớn, Category bằng nhóm taxonomy, Spacer bằng khoảng trống dọc. Nhãn chữ luôn đi cùng icon; không dùng màu làm dấu hiệu duy nhất. SVG/code-native, không cần bitmap/dependency icon library mới.
3. **Grouping theo công việc:** proposal ban đầu gồm Collections (Product/Post/Category), Sliders & Showcases, Layout & Utilities (Card/Grid/Accordion/Spacer). Tên nhóm và vị trí Accordion/Card còn cần review bằng mockup; chưa phải category taxonomy đã duyệt.
4. **Giảm item dễ nhầm:** đánh giá giữ base Collection entry hay ưu tiên Grid/Carousel variants; phân biệt rõ Product Showcase/Card Carousel của Slider với Product/Post Collection. Nếu ẩn một entry khỏi Inserter phải giữ registration và compatibility saved content.
5. **Tên và tìm kiếm:** sau migration dùng identity Marine Blocks theo plan047; title ngắn, nhất quán và mô tả công dụng; keywords giúp tìm Product/Post/Grid/Carousel/Spacer. Không rename namespace/attribute/variation IDs chỉ vì đổi nhãn UI.
6. **Dùng Gutenberg APIs công khai:** audit khả năng category/variation/icon theo WP version thực tế; không giả định có subgroup lồng tùy ý trong native Inserter. Không patch private DOM/core hoặc xây Inserter riêng trong baseline.
7. **Mockup trước source:** đặt các icon/titles thành một bảng Inserter thực tế, gồm sidebar hẹp và search results. Human thử tìm/chèn block trước khi khóa grouping. Không chỉ duyệt icon tách rời mà không kiểm tổng thể.

## 4. Acceptance draft

| ID | Nhóm | Hành vi mong đợi | Hiện trạng | Việc cần làm | Cách kiểm | Evidence |
|---|---|---|---|---|---|---|
| IO-UX-01 | Editor UX | Icon giúp phân biệt đúng các block/variations dễ nhầm | Chưa làm | SVG inventory + family system | Chọn đúng Product Grid/Carousel, Post, Category, Hero, Spacer từ Inserter và search | Bảng icon + screenshot + human thử chọn |
| IO-UX-02 | Editor UX | Grouping/name giảm quét nhầm và không giấu block cần dùng | Chưa làm | Category/label/search proposal | Tìm/chèn theo nhiệm vụ; empty search và keywords; sidebar hẹp | Mockup + recording onsite |
| IO-UX-03 | Editor UX | Keyboard/focus và text labels dùng được | Chưa làm | Accessible icons + native navigation | Tab/arrow/Enter theo native behavior, zoom200%, màu hạn chế | Video + screenshot |
| IO-TECH-01 | Technical | Ít entry trùng nhưng saved content/variation defaults giữ đúng | Chưa làm | Audit inserter scopes/registration | Trang cũ mở/save lại; chèn từng variation kiểm attrs; không invalid block | Inventory + content diff + console |
| IO-TECH-02 | Technical | APIs/identity/asset scope phù hợp plugin sau migration | Chưa làm | Kiểm WP runtime/package versions và public APIs | Audit category/icon registration; build/lint human; SVG không JS/external resource | Source refs + output + loaded assets |

Block UI frontend: **N/A cho baseline icon/grouping/nhãn editor**. Vẫn phải regression frontend khi thay registration/defaults vì có thể ảnh hưởng nội dung được chèn. Không dùng N/A để bỏ IO-TECH-01.

## 5. Bước mở task sau này

Khi tới sau1.4.3: xác nhận SemVer/start theo ledger mới nhất; inventory lại sau migration/map; bổ sung mockup, chọn grouping và base-entry policy bằng evidence. Tạo runbook dưới `docs/testing/` có URL/setup/steps/expected/pass-fail trước onsite. Hiện chỉ ghi kế hoạch; không sửa source, không coi screenshot hay source audit ban đầu là acceptance PASS.
