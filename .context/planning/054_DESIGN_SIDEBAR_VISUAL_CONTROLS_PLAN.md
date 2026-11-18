# Design Sidebar — visual controls implementation plan

**Scope clarification2026-11-09:** human duyệt riêng hướng mở rộng Category description/Action controls; detailed spec tại [061](061_VER_1_3_20_CATEGORY_GRID_DESCRIPTION_ACTION_CONTROLS_PLAN.md), current1.3.20. Inventory “existing-only” bên dưới là snapshot trước delta061; các controls mới của061 là ngoại lệ có chủ đích, chưa coding. Không coi đây là approval Q1–Q3/toàn bộ visual tile redesign054 hoặc thêm controls sang Product/Post. Giữ owner/reset của061 khi triển khai consumer Category.

2026-11-05. **Planning / chờ chốt Q1–Q3, chưa triển khai visual controls.** Current V1 / 1.3.19; đây là đề xuất cải thiện presentation của Design Sidebar hiện có, không đổi milestone/metadata hoặc nghiệm thu1.3.20. User yêu cầu agent commit tồn đọng và tài liệu planning, không phải coding Sidebar trong lượt này.

## 1. Mục tiêu và quyết định đã có

Chọn thiết kế bằng hình mẫu phù hợp với thứ người dùng đang chỉnh, giảm các dropdown khó hình dung. Giữ shell048/051, block attrs/Page Save/Undo và Theme Design storage/session recovery riêng.

Human đã đồng ý hướng SVG cho kiểu bố cục ảnh; hình mẫu thống nhất màu/kích thước/nội dung, luôn có label chữ. Category Grid được tái dùng cách trình bày control nếu có consumer, không mặc nhiên có mọi feature của Product Collection. Khung/màu canvas thuộc plan053, không phải nội dung của plan này.

| Loại control | Biểu diễn đề xuất | Invariant |
|---|---|---|
| Flush/Padded/Floating | Inline SVG sơ đồ thumbnail + label | Biểu diễn quan hệ image/card; không ảnh chụp gây nhiễu |
| Contain/Cover | Một hình vector mẫu bất đối xứng khác aspect ratio khung, rendered như image với CSS object-fit thật | Hai lựa chọn dùng cùng asset, nhìn thấy crop; không tải ảnh remote/user media |
| Radius/padding/shadow preset | CSS specimen dùng giá trị preset thật + label | Không giả vờ có preset nếu source chỉ có numeric input |
| Palette | Swatch + tên màu, Default/Inherit riêng | Lưu slug cũ, không ghi resolved hex, không thêm arbitrary colors |
| Font/size | Text specimen dùng font/token sẵn có | Không download font chỉ để preview; chưa load font thì ghi fallback |
| Numeric fine-tuning | Number/range hiện có với nhãn/unit | Giữ min/max/step/default hiện hành; không biến thành hàng chục thumbnails |

SVG có thể dùng chung source/vector; tile artwork decorative (`aria-hidden`), tên nằm ở label. Không cần imagegen/raster artwork. Kích thước thumbnail không được bị hiểu là kích thước card frontend.

## 2. Inventory source và boundary

| Consumer | Source hiện có | Phạm vi có thể làm mà không thêm feature |
|---|---|---|
| Product Collection Grid/Carousel | `src/collection/controls.tsx:278–304` chứa legacy ratio, Media layout và Card style ở Block settings; Design controls ở cuối file | SVG cho preset hiện có; màu/typography/fine-tuning đã có; relocation là Q2 |
| Product Category Grid | `src/product-category-grid/design.tsx` + constants.ts:24–48 | Visual fit, card background/radius/padding/shadow và role colors/fonts/sizes; không có mediaLayout Flush/Padded/Floating |
| Post Collection | Dùng chung Collection controls, Post không nhận Product mediaLayout | Role color/typography consumers đã có; không gắn Product image presets vào Post |
| Shell/fallback | `src/design-sidebar/index.tsx` hiện group SelectControl; `navigation.tsx` fallback và reset lists | Cùng group/control components ở cả sidebar và Inspector fallback; giữ guard/context/selection checks |
| Global Theme Design | `src/design-sidebar/theme-design.tsx` | Không đổi UI/save/permission/conflict/session semantics trong baseline này |

Quan trọng: Product explicit Flush/Padded/Floating dùng contain trong CSS; legacy frame có ratio/cover khác. Không thêm fit switch vào Product nếu chưa có consumer. Category card padding không đồng nghĩa Product media padding; chỉ tái dùng tile rendering, không map enum/attrs giữa hai block.

Giữ giá trị cũ/không nhận diện: hiển thị “Unavailable saved value” với trạng thái chưa map, không tự chọn thumbnail đầu và ghi đè. Product mediaLayout rỗng là Legacy, không được highlight Flush rồi âm thầm normalize data.

## 3. UX dự kiến

```text
Marine Blocks
[ Selected block ] [ Plugin ]
Product Carousel · Featured products
This block only · Saved with the page

[ Image ] [ Title ] [ Details ] [ Action ]

Image layout
┌──────────┐ ┌──────────┐ ┌──────────┐
│ SVG      │ │ SVG      │ │ SVG      │
│ Flush    │ │ Padded ✓ │ │ Floating │
└──────────┘ └──────────┘ └──────────┘
Legacy (saved ratio) — chỉ khi giá trị hiện có là Legacy

Image adjustments
Frame padding       [ existing number/unit ]
…chỉ controls phù hợp preset…

[ Reset this component ]   Back to block settings
```

Tranh là proposal, group navigation còn Q3. Category dùng Fit/Surface specimens ở Image group như contract hiện hành, chưa thêm tab Card riêng. Không thêm mode chưa có vào Category bằng tile disabled gây hiểu lầm. Giữ scope Selected block/Plugin rõ ràng; không áp visual prototype lên global settings bất ngờ.

Controls single-select có named group + selected state, keyboard arrows/Tab theo semantic được chọn sau audit API đang cài, focus ring, label/help/disabled reason và target đủ lớn. Selected border + checkmark + text, không chỉ màu. Màu Default/Inherit cần ký hiệu/text riêng để không lẫn white. Nút Reset nằm ngoài lựa chọn, không xóa nội dung/query/visibility ngoài phạm vi đã chốt.

## 4. Quyết định cần chốt — recommendation chưa phải approval

### Q1 — Category scope

1. Vấn đề: dùng chung UI dễ bị hiểu là phải thêm media modes Category chưa có.
2. A: baseline chỉ visual hóa controls có consumer; Category có Fit/Surface, chưa Flush/Padded/Floating. Ít regression, rollout nhanh. B: thêm Category mediaLayout cùng lượt, cần schema/render/preview/reset/compatibility mới, mở lại phần Floating deferred049.
3. Khuyến nghị **A**, giữ reuse UI mà không trộn với tính năng mới. Thiết kế modes Category sau scope riêng nếu human muốn.
4. Evidence: Category `design.tsx` Image group + constants.ts:24–48 có mediaFit/radius/padding/shadow; types.ts không có mediaLayout; plan049 Q2 không mở Floating.
5. Tự kiểm <=5phút: so Category design.tsx và Collection controls.tsx:289; tìm mediaLayout trong hai block schemas. Không premise external library.
6. Đảo ngược: A hai chiều; B thêm persisted attrs nên chi phí compatibility cao hơn.
7. Default trước khi coding: chỉ inventory A; chưa implement cho tới human giao coding/chốt scope. Không tự mở Floating.

### Q2 — Một owner cho Media layout và reset

1. Vấn đề: preset hiện ở Block settings nhưng adjustments nằm Design; visual picker sẽ bị chia hai chỗ.
2. A: chuyển Product Media layout sang Design/Image, Block settings giữ shortcut; Show image/legacy ratio/query/layout vẫn ở Block settings. B: giữ preset ở Inspector và chỉ đổi thành SVG tại chỗ, Design tiếp tục adjustments; ít dịch chuyển nhưng flow còn tách.
3. Khuyến nghị **A**. Sidebar và Inspector fallback dùng chung picker, không render hai picker độc lập cùng lúc. Thêm preset vào Image reset: reset mediaLayout về trạng thái unset/undefined (schema không có default, giữ legacy khi attribute vắng), các adjustments về defaults; không reset imageRatio, showImage hoặc query. Existing explicit empty string vẫn được giữ nếu user không chọn/reset; không normalize tự động. Đổi tên/help cho reset nếu cần để người dùng hiểu phạm vi.
4. Evidence: Collection controls.tsx:289 preset owner hiện tại; navigation.tsx:resetDesign chưa có mediaLayout trong image keys và index.tsx hiện vô hiệu Reset khi Flush/Legacy.
5. Tự kiểm <=5phút: mở ba source trên, so controls/display/resetdisabled. Schema `product-collection/block.json:220–222` chỉ khai báo type:string, không có default; kiểm reset→Undo→save/reopen giữ attribute absent/legacy, không suy Legacy=explicit Flush hoặc default empty string.
6. Đảo ngược: UI relocation hai chiều; reset persisted values là thao tác user chủ động, phải Undo được và preserve defaults/legacy.
7. Default trước coding nếu chưa chốt: giữ owner/reset cũ; không tạo preset duplicate. Q2 mở không chặn viết shared tile primitive/planning, nhưng chặn relocation/reset change.

### Q3 — Điều hướng nhóm

1. Vấn đề: dropdown Design component ít trực quan, bốn nhóm cố định có thể chọn nhanh hơn.
2. A: hàng Image/Title/Details/Action với selected/focus state rõ; wrap thành2hàng ở sidebar quá hẹp, không horizontal scroll mất nhóm. B: giữ dropdown, chỉ đổi visual controls bên trong; ít thay shell hơn.
3. Khuyến nghị **A**, đồng nhất sidebar/fallback, không thêm group mới hoặc đổi global Theme Design tab.
4. Evidence: index.tsx hiện SelectControl designGroups; navigation.tsx DesignFallback có selector tương tự. Mockup §3 cho thấy cùng4nhóm.
5. Tự kiểm <=5phút: mở shell/fallback, xem labels/group state trong designStore; so sidebar hẹp và multi-selection states theo plan051.
6. Đảo ngược: hai chiều, session group state/attrs không đổi, không DB migration.
7. Default trước coding nếu chưa chốt: giữ dropdown; controls cùng nhóm vẫn reuse, không tự đổi shell navigation.

## 5. Work packages sau khi chốt và giao implementation

- **V0 inventory:** chốt attribute→control→canvas→PHP/CSS consumer→reset cho từng feature, default/legacy/unknown/hidden states. Xác minh API UI package version tại local package lock; chọn native/public primitive khi đủ, không thêm dependency. Không suy UI library behavior từ trí nhớ.
- **V1 components:** `src/design-sidebar/components/` hoặc path rõ tương đương; visual single-choice tile, SVG diagrams, CSS specimens và palette specimen. Chỉ share nơi có2consumer/invariant; không xây generic design-system engine hoặc store mới. CSS phải vào editor bundle được enqueue (bài học shared frame CSS extraction), không chỉ tạo file xuất build chưa nạp.
- **V2 Product pilot:** presets hiện có + Legacy state, parameter controls giữ nguyên, Q2 owner/reset nếu được duyệt; Selected block và fallback dùng cùng implementation. Kiểm Canvas052/053 tương ứng attrs.
- **V3 Category + Post:** Category visual hóa existing fit/surface/color/typography, Post chỉ controls có consumer; giữ visibility và native Category shared data/persistence riêng. Không thêm schema/consumer mới theo Q1A.
- **V4 navigation/palette/type:** Q3 nếu duyệt; swatches giữ slug/unknown; font previews chỉ có asset sẵn, không mở font delivery task. Đảm bảo keyboard/translated long labels/narrow Inspector.
- **V5 verify/handoff:** cập nhật runbook DS/TD/SR2 không xóa carry, thêm visual-control cases; human build/lint, screenshots editor/frontend cùng fixture, save/reopen/Undo, legacy compatibility. Agent commit theo source+docs và build provenance; không gọi approval là runtime PASS.

Không tự code Slider/Step Design, sửa frame053, migration identity1.4.0, Category persistence R01–R12, query endpoint hoặc Theme Design storage trong gói này.

## 6. Acceptance register

| ID | Nhóm | Hành vi mong đợi | Hiện trạng | Việc cần làm | Kiểm / evidence |
|---|---|---|---|---|---|
| VD-01 | Editor UX | Preset nhìn hiểu, text labels/state/keyboard đầy đủ | Chưa làm | SVG tiles + semantics | Mouse/keyboard, long labels, sidebar hẹp; screenshot/focus |
| VD-02 | Technical | Giá trị attrs/enums/defaults/legacy/unknown không bị đổi ngầm | Chưa làm | Adapters typed per block | Existing content before/after, Undo/save/reopen; schema/diff |
| VD-03 | Editor UX | Category/Post chỉ hiện khả năng có thật | Chưa làm | Capability-specific control inventory | Image off, missing media, unsupported value; match canvas/frontend |
| VD-04 | Technical | Một owner preset và reset đúng phạm vi | Q2 mở | Relocation/reset only if approved | Sidebar/fallback, Legacy reset, Undo; query/content untouched |
| VD-05 | Editor UX | Navigation nhóm nhất quán | Q3 mở | Same group selector renderer | Switch target/delete/multi-select/back, narrow widths; giữ051guard |
| VD-06 | Block UI | Frontend giữ behavior cũ khi không đổi setting | Chưa làm | Không sửa runtime/CSS consumer ngoài scope | Same fixture output before/after; changed attr đúng consumer |
| VD-07 | Technical | CSS/SVG/font assets đúng editor boundary | Chưa làm | Bundled/enqueued path audit | Build output+enqueue handle, Network, no remote requests, no frontend bundle tăng ngoài ý định |

A11y/responsive/performance áp vào từng row, không chỉ test cuối: swatch cần text/selected, thumbnail không nhận focus riêng; không auto-animate; không overflow sidebar, không per-tile API/query requests. Runtime tests phải ghi URL/build/WP/browser/fixtures và expected/actual, không xem source là PASS.

## 7. Tracking

Source references là baseline hiện hành ngày2026-11-05; line có thể đổi sau refactor. Đã có plan, chưa có visual controls mới. Q1–Q3 cần human chốt; đề xuất gói **Q1=A / Q2=A / Q3=A**. Chưa hỏi lại version current1.3.19; nếu human chọn mở feature Category mới, phải review scope/version trước implementation, không tự gộp schema vào UI-only repair.
