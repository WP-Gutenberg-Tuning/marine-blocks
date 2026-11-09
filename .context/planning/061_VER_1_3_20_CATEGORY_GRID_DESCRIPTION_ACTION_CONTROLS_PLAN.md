# V1 / 1.3.20 — Category Grid: Description và Action controls

Ngày: **2026-11-09**. Status: **hướng UX được human duyệt; planning chi tiết, chưa coding delta này**.

## 1. Quyền thực hiện, scope và rationale

Human yêu cầu bổ sung Full description, căn chữ, chiều rộng button theo card, bo góc button bằng px và khoảng cách button với nội dung. Sau phản biện, human nói “Đồng ý với đề xuất, triển khai planning chi tiết cho các phần liên quan”. File này cụ thể hóa hướng đã duyệt, không xin lại quyết định đó và không coi yêu cầu planning là lệnh coding.

Đặt delta trong **current V1 / 1.3.20 — Product Category Grid + Category details + Woo Archive M1**, cùng consumer Category của plan049; không tạo version mới hoặc thay scope Hero1.3.21. Đây là bổ sung planning cho consumer đang làm; quy tắc numbering hiện hành không thay đổi. Không bump metadata, build/lint/deploy, rewrite dữ liệu hoặc kết luận runtime PASS trong lượt này.

Trước coding, nhắc human chạy deferred baseline Category/Archive và carry Sidebar/Spacer/Carousel liên quan theo MILESTONES.md. Chạy trên build đã biết để phân biệt regression cũ với delta mới; phần chưa kiểm phải giữ status.

Phạm vi: tất cả cards của **một Product Category Grid block**, chung mọi độ rộng. Plugin own controls/attrs/presentation/default CSS; không cần WindPress hoặc theme SKVN. Không per-category design override, không responsive controls mới, không ratio control, không làm Product/Post Collections hoặc Woo archive nhận các controls này. Giữ category selection/query/count/eligibility/destination và native term persistence.

Các px inputs ở đây là **ngoại lệ hẹp được duyệt cho Action của Category**; không mở raw CSS, arbitrary units hoặc thay preset governance toàn plugin. Plan054 vẫn chưa duyệt Q1–Q3; delta này không tự start toàn bộ visual Sidebar redesign.

## 2. Evidence source và điểm cần sửa

Các đường dẫn source dưới đây tương đối với `wp-content/plugins/skvn-marine-blocks/`.

| Source | Hiện trạng được xác minh | Hệ quả |
|---|---|---|
| `modules/category-grid/resolver.php`, `skvn_marine_blocks_category_grid_description_excerpt()` | Plain text, trim 24 words; resolver chỉ đưa raw description ở context edit có quyền term | Full phải có dữ liệu đầy đủ ở frontend và ở editor không có quyền sửa term; không dùng raw field để né permission |
| `modules/category-grid/rest.php`, `skvn_marine_blocks_category_grid_term_payload()` | `descriptionExcerpt` có trong read payload; raw `description` chỉ khi withDetails và canEdit | Cần presentation field riêng, giữ nguyên permission/raw round-trip |
| `modules/category-grid/render.php` | Description trong `<p>` được escape; toàn card một `<a>`, CTA là `<span>` | Full là plain text; không nested links/button/tab stop |
| `src/product-category-grid/style.css:234–301` | Body flex column/gap0.4rem; description clamp3; CTA align-start/radius999px/margin-top:auto | Bỏ clamp thôi chưa Full; gap cần một owner, tránh cộng gap + margin/padding ngoài ý muốn |
| `src/product-category-grid/preview.tsx`, `data.ts` | Preview lấy `descriptionExcerpt` từ records fetched; card editor là div, không link live | Cần full field và cùng presentation rules; không giả preview draft chưa lưu là persisted |
| `src/product-category-grid/edit.tsx`, `design.tsx`, `details.tsx` | Hai toggle “Show description excerpt”; help trong details luôn nói excerpt | Đổi wording và nối cùng attrs, không tạo controls cạnh tranh |
| `src/design-sidebar/navigation.tsx` | Reset theo allowlist từng block/group | Thêm reset keys Category; không reset selection/content hoặc Collection |

User screenshot Grouper là evidence nhu cầu UX, không chứng minh mọi card/runtime state. Audit ở đây là source review, chưa chạy lại browser hoặc WordPress.

## 3. Contract UI và controls

### 3.1. Display / Content

- Đổi nhãn toggle thành **Show description** ở Inspector và shortcut Details hiện có; cùng `showDescription`, mặc định false giữ nguyên.
- Khi bật, thêm **Description display**: `Excerpt` / `Full text`. Owner chính ở Inspector Display; không tạo dropdown mode thứ hai trong Design.
- Excerpt giữ 24 words và clamp tối đa3 dòng như cũ; không thêm word/line sliders đợt này.
- Full text hiển thị toàn bộ plain text từ mô tả native, không word trim/line clamp/fixed-height/ellipsis. Chuẩn hóa khoảng trắng để đọc như một đoạn; không hứa giữ paragraph/list/formatting HTML. Desc rỗng không render paragraph trống.
- Không sửa native description khi đổi mode. Một term có thể Full trong block A và Excerpt trong B.
- Help: `Full text shows the entire description without formatting. Longer descriptions make the row taller.` Cập nhật details help để phân biệt dữ liệu term và cách card hiển thị; không nói mô tả luôn là excerpt.

### 3.2. Design → Details

- **Description alignment**: Left / Center / Right / Justify; chỉ áp đoạn description, không ảnh/name/count/path/CTA. Mặc định Left (physical left/right theo nhãn; không tự mở RTL policy mới).
- Nếu showDescription=false: control disabled, giải thích `Enable the description to adjust its alignment.`; giữ giá trị để bật lại, không tự reset.
- Justify căn hai lề, dòng cuối theo hành vi text mặc định; không thêm letter-spacing hoặc force justify dòng cuối. Đây là lựa chọn có chủ ý; card hẹp có thể giãn khoảng trắng, không tự đổi sang Left trên mobile.

### 3.3. Design → Action

Giữ toggle Show action label và colors hiện có. UI gọi “Button” cho kích thước/hình dạng, help tiếp tục nói card là một link, label không phải control tương tác độc lập. Khi showCta=false, ẩn các controls phụ và giữ attrs đã chọn.

| Control | Lựa chọn / hiệu lực | Conditional state |
|---|---|---|
| Button width | Auto / Full / Custom | Custom hiện Number nhập `%` cùng dòng; Auto theo nội dung nhưng không vượt body; Full100% body |
| Button alignment | Left / Center / Right | Full disabled + help `Full-width buttons fill the content area.`; giữ lựa chọn, không reset |
| Button corners | Pill / Custom | Custom hiện Number `px`, độc lập Card corner radius |
| Button placement | Follow content / Align to bottom | Help phân biệt chính xác vs tối thiểu |
| Spacing above button | Default / Custom | Custom hiện Number `px`; Default dùng existing body gap0.4rem, không đóng băng sang một số px giả |

Width phần trăm tính theo **body content box sau padding**, gồm padding/border button trong kích thước khai báo (`border-box`), không theo viewport/ảnh/mép ngoài card. Custom100% có cùng geometry Full nhưng vẫn giữ mode và alignment đã chọn; có thể disable alignment khi effective width=100%.

Button text luôn căn giữa trong nền button. Đây khác Button alignment là vị trí cả button. Nhãn dài được wrap; unbroken token được break trong button, không bị ellipsis/clip. Custom% là chiều rộng yêu cầu, không tự nới quá body để giữ label một dòng. Không áp min-width:max-content gây overflow.

Numeric controls có label/unit hiển thị, keyboard steppers, number input; không chỉ có slider. Các giới hạn kỹ thuật dự kiến: percent integer1–100 (seed50 khi lần đầu chọn Custom), radius integer0–100px (seed12), gap integer0–128px (seed8). Đây là bounded implementation defaults của plan, chưa là số đo browser PASS. Pill vẫn là999px; custom radius lớn được CSS giới hạn theo geometry bình thường,0 là vuông. Không nhận đơn vị tùy ý, số âm, NaN/Infinity hoặc CSS strings.

## 4. Attribute, validation và compatibility contract

Tên keys là thiết kế kỹ thuật cho implementation; enum values không dịch theo UI.

| Key | Type / allowed | Default khi thiếu hoặc enum không hợp lệ | Lưu khi inactive |
|---|---|---|---|
| `descriptionDisplay` | string `excerpt/full` | `excerpt` | Giữ khi showDescription off |
| `descriptionAlign` | string `left/center/right/justify` | `left` | Giữ khi description off |
| `actionWidthMode` | string `auto/full/custom` | `auto` | Giữ khi CTA off |
| `actionWidthPercent` | number integer1–100 | 50 khi Custom cần fallback | Giữ khi Auto/Full |
| `actionAlign` | string `left/center/right` | `left` | Giữ khi Full/CTA off |
| `actionRadiusMode` | string `pill/custom` | `pill` | Giữ khi CTA off |
| `actionRadiusPx` | number integer0–100 | 12 khi Custom cần fallback | Giữ khi Pill |
| `actionPlacement` | string `flow/bottom` | `bottom` | Giữ khi CTA off |
| `actionGapPx` | optional number integer0–128 | **absent = Default0.4rem**, không schema default8 | Giữ khi CTA off; chọn Default xóa attr |

Đồng bộ block.json, TS type, frontend PHP normalization và editor presentation. Number thật, finite, nguyên, đúng range mới hợp lệ; numeric strings/floats/ngoài range trong saved payload dùng fallback, không echo ra CSS. Input đang trống/invalid là local editing state: chưa setAttributes; blur về giá trị hợp lệ trước đó; explicit Default/Reset mới xóa. `0` radius/gap hợp lệ, không dùng `value || default` làm mất0. Không sanitize bằng absint để âm thành dương.

Block cũ thiếu toàn bộ keys → Excerpt, Left, Auto/Left, Pill, Bottom, gapDefault0.4rem. Không resave/rewrite content hoặc term. Dynamic block không cần deprecation chỉ vì attrs thêm; vẫn kiểm save/parse/invalid-block thay vì suy tự động PASS.

Tất cả attrs mới lưu cùng page, native Undo/Redo, duplicate/copy block giữ config. Không ghi option/theme_mod/term chỉ vì chỉnh design. Content Actions Category chưa là scope được duyệt; không thêm hỗ trợ mới. Khi audit clipboard/projection hiện hành, bảo đảm không vô tình đưa full text snapshots hoặc style attrs thành shared term content.

Reset Details thêm `descriptionAlign`, không đổi showDescription/descriptionDisplay hoặc native desc. Reset Action thêm width/modes/percent/alignment/radius/placement/gap cùng color keys hiện hành; đưa về defaults bảng trên trong một update, không đụng CTA label/showCta/destination/categories. Default gap reset về absent. Inspector fallback dùng đúng cùng components/reset semantics.

## 5. Data, render và layout execution contract

### 5.1. Full text từ native data

Thêm presentation field **`descriptionText`** đầy đủ vào resolved term frontend và REST payload dùng cho canvas. Dùng một PHP helper Category-local để lấy plain text/normalize whitespace từ native stored description; escape output theo context. Chuỗi entity/Unicode phải cho kết quả nhìn thấy nhất quán, không double-escape, không biến HTML thành DOM được thực thi. Excerpt cũ giữ đường xử lý/giới hạn để tránh đổi baseline ngoài yêu cầu.

Full field chỉ cần khi withDetails cho canvas trong REST hiện có; picker không cần tải toàn bộ descriptions. Đường server-render lấy trực tiếp dữ liệu native đầy đủ, không dựa context edit/canEdit. Read permission của route giữ nguyên; người được sửa page nhưng không sửa term vẫn xem Full **plain text**, còn raw `description`/canEdit/write permission giữ policy cũ. Không endpoint/per-card query mới hoặc nâng quyền term.

Types/API adapter nối `descriptionText`; response thiếu field không được giả Excerpt là Full. Trạng thái stale assets/API phải thông báo preview chưa đủ dữ liệu hoặc refetch theo lifecycle sẵn có; không request loop. Sau Save category/Page Save, existing invalidation refetch presentation field mới. Failure/conflict không thay thế native description bằng plain text.

Preview hiện là fetched persisted records; đổi style/mode áp ngay vào records đó. Đợt này không tự mở live preview draft chưa lưu. Khi đang có draft term chưa save, hiển thị note rõ preview dùng saved category details và refresh sau save; giữ toàn bộ CG-UX save/conflict tests. Không thay đổi draft coordinator chỉ để phục vụ style controls.

### 5.2. Layout có một owner cho gap

- Category wrapper/card/body tiếp tục sở hữu width theo CSS hiện hành; button ở trong body, `max-width:100%`, `min-width:0`, border-box. Không viewport math, negative margin hoặc overflow mask.
- Tách content group (head/path/description) và action slot nếu cần để có một owner cho khoảng cách giữa chúng. Content group giữ gap cũ; slot không cộng thêm body gap + margin + padding ngoài thông số.
- Follow content: sau nội dung cuối cùng, khoảng hở = resolved gap; không đẩy button xuống đáy, không làm thấp hàng/card một cách riêng lẻ. Cards vẫn stretch theo hàng như hiện tại.
- Align to bottom: free space đẩy slot xuống đáy **body**; khoảng hở >= resolved gap. Tương ứng button cùng hàng có đáy cùng mức nếu padding giống nhau; không hứa align giữa các hàng khác nhau.
- Không có nội dung phía trên (name/count/path/description đều không render): không tạo phantom gap; flow ở đầu body, bottom ở cuối body nếu có free space. showCta off: không slot/gap rỗng.
- Editor-only hidden/missing notices không được thành “text phía trên button” hoặc chiếm slot đo geometry; tách notice khỏi content/CTA layout. Giữ status/selection behavior, không lấy notice vào frontend.
- Description Full chỉ tăng chiều cao tự nhiên; không equal-height bằng JS/fixed height/clamp. Ảnh1:1/fit, card padding/radius/shadow, head name/count giữ nguyên.
- Plugin CSS scoped Category; numeric vars chỉ tạo từ validated numbers/allowlisted enums, gắn lên owner wrapper phù hợp cả editor/frontend. Không sửa theme/GeneratePress, không CSS rule toàn cục cho mọi button/p/span. Audit specificity thực tế trước khi viết consuming rule.

Baseline missing attrs phải so screenshot/geometry với bản trước. Nếu phải đổi DOM để có content group, kiểm spacing/head/path/description/CTA và selectors hiện có trong cùng commit; không bỏ cơ chế cũ trước replacement.

## 6. Trình bày Sidebar dự kiến

```text
Display
  Show description       [On]
  Description display    [Excerpt | Full text]

Design / Details
  Description alignment  [Left | Center | Right | Justify]
  Details color / size   [existing controls]

Design / Action
  Show action label      [On]
  Button width           [Auto | Full | Custom]
  Width                  [50] %          (Custom only)
  Button alignment       [Left | Center | Right]
  Button corners         [Pill | Custom]
  Corner radius          [12] px         (Custom only)
  Button placement       [Follow content | Align to bottom]
  Spacing above button   [Default | Custom]
  Spacing                [8] px          (Custom only)
  [existing colors]
  [Reset this component]
```

Tất cả strings tiếng Anh/i18n domain hiện hành. Dùng controls native đang có; không custom SVG/tile engine hoặc dependency mới. Conditional changes không làm mất focus/giá trị, sidebar hẹp không tràn. Nhãn content mode, text alignment và button alignment độc lập, không dùng một “Alignment” mơ hồ.

## 7. Work packages và file map

| Gói | Files dự kiến | Kết quả review được |
|---|---|---|
| P0 — Baseline | Plan049/runbook Category; source audit | Ghi build/fixture và pending cũ; xác minh defaults/loaded CSS/permission; không đánh PASS từ source |
| P1 — Full data + mode | `modules/category-grid/resolver.php`, `rest.php`, `render.php`; `src/product-category-grid/types.ts`, `block.json`, `preview.tsx`, `edit.tsx`, `details.tsx` | `descriptionText`, Full/Excerpt, labels/help, parity và read-only role; không ghi native data khi đổi mode |
| P2 — Action + alignment xuyên suốt | `block.json`, `types.ts`, `constants.ts` hoặc helper Category-local; `design.tsx`, `preview.tsx`, `style.css`, `modules/category-grid/render.php` | Attr→controls→preview→frontend, full text alignment, width/radius/placement/gap; không broad shared abstraction |
| P3 — Reset/validation/regression | `src/design-sidebar/navigation.tsx`; tests Category hiện có hoặc fixture phù hợp; docs testing | Reset allowlist, invalid/zero cases, compatibility/Undo/fallback và data boundary |
| P4 — Human build/onsite | Runbooks + execution ledger trong plan này | Build/lint do human; screenshots/rect/permission/save-reopen; từng acceptance có evidence hoặc giữ pending |

P1/P2 phải hoàn thành lát cắt đủ surfaces trước commit tính năng; không commit chỉ có controls chết hoặc bỏ CSS owner cũ. Commit source tách theo feature khi thực sự được giao coding/commit, docs tracking cập nhật cùng thay đổi. Không thêm require/include/module runtime mới; nếu implementation đổi giả định này phải cập nhật packaging theo workflow trước deploy.

## 8. Acceptance register

Tất cả delta dưới đây: **Chưa làm**, không lấy PASS của baseline hoặc approval này thay evidence. Runbook: [category-grid-description-actions-1.3.20.md](../../docs/testing/category-grid-description-actions-1.3.20.md).

| ID | Nhóm | Hành vi mong đợi | Hiện trạng | Việc cần làm | Cách kiểm | Evidence |
|---|---|---|---|---|---|---|
| CGD-UI01 | Block UI | Excerpt baseline; Full không cắt, empty không đoạn rỗng | Chưa làm; hiện24words/3lines | Data + mode + CSS | >100words, HTML/entities/Unicode, text rỗng | Saved text, DOM textContent, paired shots pending |
| CGD-UI02 | Block UI | Desc4alignment độc lập head/count/CTA; long words không tràn | Chưa làm | Scoped alignment/wrap | Left/Center/Right/Justify trên card hẹp | Computed styles/rect/shots pending |
| CGD-UI03 | Block UI | Auto/Full/Custom% đúng body, nhãn wrap; Pill/custom0px riêng card | Chưa làm | Action width/radius | Padding0/md/lg, width1/50/100, long label | Body/button boxes/radius pending |
| CGD-UI04 | Block UI | Flow gap chính xác; Bottom gap tối thiểu/đáy cùng hàng; không phantom gap | Chưa làm | Content/slot/gap owner | Cards nhiều/ít/không text, CTA off, gap0/16/128 | Vertical rect deltas + paired shots pending |
| CGD-ED01 | Editor UX | Controls rõ/conditional, show off giữ state; không input tràn sidebar | Chưa làm | Display/Details/Action/help | Sidebar/fallback narrow, keyboard, toggle modes | Video/attrs pending |
| CGD-ED02 | Editor UX | Page Save/Undo/duplicate/reopen giữ config; reset đúng group | Chưa làm | Attrs/reset | Hai blocks cùng term khác config; reset từng group | Serialized attr diff/video pending |
| CGD-ED03 | Editor UX | Persisted preview/source-data note chính xác; role không edit_term vẫn thấy Full | Chưa làm | Full presentation field + note | Draft/save/error/conflict và read-only term role | Network/preview/permission evidence pending |
| CGD-TECH01 | Technical | Raw term không đổi bởi mode/style/reset; one link/card, không HTML injection | Chưa làm | PHP/React text output, no new writes | HTML/link fixture, before/after raw, network write audit | Raw comparison + DOM/link count pending |
| CGD-TECH02 | Technical | Validation TS/PHP tương đương,0 có hiệu lực, defaults cũ không cần resave | Chưa làm | Finite/range/enum/default guards | Missing/invalid/floats/string/NaN và zero tests | Named test output + legacy shots pending |
| CGD-TECH03 | Technical | Assets đúng editor/frontend; không extra term query/REST storm, không consumer khác đổi | Chưa làm | Scoped CSS/data lifecycle | Network, frontend khi WindPress off trên fixture an toàn; Product/Post/archive baseline | Network/console/before-after pending |
| CGD-TECH04 | Technical / Block UI | Parent width giữ, không horizontal overflow hoặc JS equal-height | Chưa làm | Geometry audit | Desktop scrollbar, tablet/mobile, narrow nested parent | clientWidth/scrollWidth + boxes pending |

Giữ CG-UI/UX/TECH và DS cũ, R01–R12 review regressions, carry acceptance; đây là IDs bổ sung. Runbook baseline “description max3lines” áp **Excerpt**, không còn áp Full. Không biến baseline pending thành PASS hoặc đổi milestone completion.

## 9. Verification và điều kiện hoàn tất

Test code cần đánh vào rủi ro: full plain-text payload cho reader không edit_term, rendered Full không truncate/nested link, raw không bị write, missing attrs/invalid CSS/zero/reset, scope isolation; tận dụng harness có sẵn nếu đủ, không tạo hàng loạt tests chỉ mirror constants. Geometry/focus/wrap/height phải kiểm browser thật; mock CSS/string test không thay proof đó.

Build/lint human chạy theo AGENTS; commands trong runbook. Agent không tự build/lint/deploy. Chốt evidence theo UI/Editor/Technical riêng, ghi URL/build/role/viewports/expected/actual. Không tự tăng milestone, nghiệm thu hoặc release khi mới có source. Thay đổi thiết kế/runtime mới nếu phát hiện phải cập nhật plan và rationale cùng đợt sửa; không âm thầm chuyển Full sang rich HTML hoặc bỏ Bottom để làm gap dễ hơn.

### Execution ledger

- 2026-11-09: human duyệt hướng; source audit và detailed planning hoàn tất. **Chưa coding, chưa build/lint/onsite; mọi CGD-* chưa PASS.** Numeric ranges/seeds là defaults triển khai dự kiến; không phải evidence đã đo.
