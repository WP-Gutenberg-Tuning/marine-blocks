# 057 — Block Content Actions trong menu ⋮

Ngày tạo: **2026-11-05**. Status: **Source đã có trong V1 /1.3.19 — chưa runtime PASS**. Human duyệt toàn gói §11–14 và start coding trong current1.3.19, không bump; cho agent coding và commit `feature patch:`. Bản chi tiết tại §10–16 cùng approval§17 ưu tiên hơn proposal lịch sử nếu có khác biệt; ledger implementation§18.

Đây là tài liệu làm việc cho các thảo luận tiếp theo về copy nội dung giữa các block. Cập nhật quyết định, rationale, câu hỏi và evidence tại đây; không tạo một spec song song từ các lượt chat sau.

**Human decision2026-11-05 — tách hai plan:** 057 chỉ giữ Content actions trong **menu ⋮ sẵn có trên toolbar của từng block**, đúng vị trí screenshot human cung cấp; ưu tiên làm trước. Menu chuột phải chuyển sang [plan058](058_FUTURE_CANDIDATE_EDITOR_CONTEXT_MENU_AFTER_2_0.md), deferred sau2.0. Quyết định này ưu tiên hơn các proposal lịch sử bên dưới; không thêm nút menu riêng trên header plugin hoặc dùng menu ⋮ toàn editor. “Làm trước” xác định thứ tự và vị trí UX, chưa xác nhận SemVer/start cho057; không tự gộp vào1.3.19 hoặc code/commit trong lượt docs.

## 1. Mục tiêu và phạm vi đã trao đổi

Human muốn lấy dữ liệu từ block nguồn sang block mới mà không mang style theo, giảm việc nhập lại khi thay thiết kế hoặc cập nhật block. Human đề xuất thao tác trong menu chuột phải và yêu cầu **chỉ copy/paste cùng loại block; khác loại phải báo lỗi**.

Tách hai nhu cầu: chuyển nội dung sang một thiết kế mới là tiện ích biên tập; mất/không đọc được nội dung sau update plugin là vấn đề compatibility cần điều tra và migration riêng. Chưa có evidence xác định update nào làm mất nội dung; không kết luận nguyên nhân và không dùng tiện ích này thay cho compatibility.

Milestone/SemVer: **TBD, chưa được human xếp lịch hoặc cho implementation**. Không tự gộp vào current **V1 / 1.3.19**, không mặc định cùng lịch 1.4.x của plan056, không bump metadata. Trước implementation cần chốt scope/version/start theo AGENTS.

## 2. Decision register

| ID | Nguồn / trạng thái | Nội dung |
|---|---|---|
| CCP-D01 | Human requirement | Chuyển nội dung, giữ style của block đích. |
| CCP-D02 | Human requirement | Chỉ cùng loại block; khác loại phải báo lỗi và không sửa block đích. |
| CCP-D03 | Human decision — updated2026-11-05 | Content actions vào menu ⋮ từng block trước; right-click tách058, hoãn sau2.0 để tổng hợp đề xuất và chốt mốc. API menu ⋮ trên onsite vẫn cần kiểm chứng. |
| CCP-D04 | Human instruction | Tạo docs trước; các trao đổi tiếp theo cập nhật trong tài liệu này. Chưa phải lệnh code/commit. |
| CCP-P01 | Vị trí đã human chốt; chi tiết còn mở | Hai action đề xuất `Copy content` / `Paste content only` trong menu ⋮ sẵn có của block; grouping/submenu và wording cần audit public API đúng version. Không private DOM hoặc override clipboard events. Proposal menu riêng trên header được superseded. |
| CCP-P02 | Agent proposal — cần xác nhận | Định nghĩa cùng loại bằng registered block name; variation không tự là loại khác. Product Grid và Product Carousel cùng `skvn-marine/product-collection` có thể chuyển nội dung, giữ layout đích. Human chưa xác nhận riêng ngoại lệ variation này. |
| CCP-P03 | Agent proposal — chưa chốt | Paste thay các trường nội dung đã khai báo của block đang chọn, không chèn block mới; Undo toàn bộ trong một bước; chỉ hỗ trợ adapter được audit. |

## 3. Source findings và research

Source đã đọc ngày2026-11-05, chưa chạy onsite:

- `wp-content/plugins/skvn-marine-blocks/src/core-controls/block-clipboard/index.tsx`: `copyBlocks` dùng `serialize(selectedBlocks)` và clipboard text; `pasteBlocks` dùng `parse` + `insertBlocks`. Utility này copy toàn bộ block/attributes/structure rồi chèn block; chưa phải content-only và chưa phải menu chuột phải. Feature có gate `block_clipboard`.
- `src/product-collection/block.json`: nội dung (`heading`, `intro`), query (`categories`, `tags`), presentation (`titleColor`, `mediaLayout`, `layout`) cùng nằm trong attributes. Bỏ mỗi key `style` không đủ để lọc nội dung.
- `src/slide/block.json`: ảnh nguồn (`backgroundImageId/Url/Alt`) và `overlayOpacity` cần phân loại khác nhau dù đều thuộc background treatment. Nội dung slide còn có thể nằm trong InnerBlocks; copy attrs cha chưa đủ.
- Module context: utility cũ thuộc Core Control, dùng public APIs, không custom clipboard format/private DOM. Tính năng mới cần giữ boundary này hoặc trình quyết định thay đổi trước; không âm thầm thay behavior copy toàn block cũ.

Nguồn research chính thức, để đối chiếu khi thiết kế kỹ thuật:

- [WordPress — Attributes](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-attributes/): attributes có thể lưu nội dung và cấu hình trình bày. `role: content` là gợi ý phân loại, không tự tạo mapping cho schema hiện tại hoặc một action content-only.
- [WordPress — Deprecation](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-deprecation/): cơ chế nâng cấp attributes/InnerBlocks của block cũ; tách khỏi tính năng chuyển nội dung theo yêu cầu người dùng.
- [WordPress — Block Editor Data](https://developer.wordpress.org/block-editor/reference-guides/data/data-core-block-editor/): tham chiếu public actions/selectors cho bước thiết kế sau. Chưa chốt API transaction/Undo hoặc context-menu extension.
- [MDN — Clipboard.readText](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/readText): secure context và khả năng bị từ chối quyền đọc; cần failure path rõ.

Giới hạn research: chưa xác minh WordPress/Gutenberg version onsite; package build `@wordpress/scripts` không xác định version editor đang chạy. Nguồn handbook hiện hành là tham chiếu, không phải bằng chứng API có trên onsite. Khi implementation phải đối chiếu đúng version, đặc biệt menu chuột phải, content role và Undo; chưa có runtime PASS.

## 4. Phân loại dữ liệu — đề xuất, chưa là allowlist

| Nhóm | Ví dụ | Hướng đề xuất |
|---|---|---|
| Nội dung | Heading, body, nhãn CTA, URL CTA, accessible label | Chuyển các trường được adapter khai báo. |
| Media | Ảnh và ALT | Chuyển nguồn media, giữ fit/ratio/layout của đích; cross-site cần policy riêng. |
| Style / trình bày | Màu, font, shadow, padding, width, layout, class | Giữ giá trị đích, kể cả trạng thái inherit/unset. |
| Query / tham chiếu dữ liệu | Category/tag filters, IDs | Còn mở: có thuộc “content” không; không copy kết quả query hoặc sửa dữ liệu Woo/Post dùng chung. |
| Hành vi | Autoplay, delay, navigation | Đề xuất giữ của đích, cần audit per-block. |
| Cấu trúc | Slides, Cards, nested blocks | Cần mapping riêng cho số lượng/thứ tự/style từng phần; không thay nguyên cây rồi tuyên bố giữ style đích. |

Allowlist phải theo từng block và schema. “Cùng loại” là điều kiện cần, chưa đủ khi version/structure khác nhau. Trường lạ hoặc chưa hỗ trợ không được tự import bằng cách copy phần attributes còn lại.

## 5. Luồng UX và trạng thái dự kiến

1. Chọn block nguồn → menu ⋮ của block → `Copy content` thuộc Content actions (cách grouping cụ thể chờ API audit).
2. Chọn một block đích → menu ⋮ của block → `Paste content only`.
3. Kiểm dữ liệu clipboard, loại block và adapter/schema trước khi mutation.
4. Nếu hợp lệ, cập nhật nội dung được phép; giữ style đích, báo thành công, hỗ trợ Undo.
5. Khác loại: báo lỗi và không mutation. Clipboard không hợp lệ, browser chặn, block không hỗ trợ hoặc read-only/locked phải có phản hồi rõ, không mất dữ liệu.

Wording đề xuất (English, i18n, chưa chốt): `Content copied.`, `Content pasted.`, `Content cannot be pasted into this block type.`, `No compatible block content found.`

Agent đề xuất fallback ô nhập để người dùng tự Ctrl+V nếu browser chặn đọc clipboard; chưa chọn. Không chiếm Ctrl+C/Ctrl+V thông thường. Nguồn có trường rỗng, multi-selection, destination có nội dung và selection thay đổi khi đang đọc clipboard đều cần policy trước khi code.

## 6. Các điểm cần thảo luận tiếp

- Q1: “Cùng loại” theo registered block name hay phải cùng variation/preset? Ví dụ Product Grid ↔ Product Carousel; Slider chung name nhưng preset khác nhau.
- Q2: Những block nào ở đợt đầu? Nội dung/query/media/action allowlist cụ thể từng block?
- Q3: Nguồn rỗng sẽ xóa trường đích hay bỏ qua? Replace tất cả content hay chỉ các trường có trong nguồn?
- Q4: InnerBlocks và số lượng item khác nhau: từ chối, mapping theo slot, hay có workflow riêng? Giữ style con như thế nào?
- Q5: Chỉ cùng website hay cả tab/site khác? Media/taxonomy IDs không portable giữa các site; không hứa tự chuyển thư viện media.
- Q6: Có thể dùng clipboard Gutenberg hiện tại + lọc khi paste không? Chưa chốt transport/format, tránh vi phạm utility contract cũ hoặc làm người dùng hiểu nhầm `Copy content` mang theo style trong payload.
- Q7: Public extension point cho menu ⋮ từng block trên version onsite là gì? Grouping, keyboard/touch, lỗi quyền clipboard và fallback cần mockup/kiểm chứng. Right-click theo058, không chặn057.
- Q8: Phiên bản block trước/sau migration Marine Blocks1.4.0: có nhận alias/schema cũ không? Không coi block khác name tự động tương thích.

## 7. Acceptance draft — toàn bộ Chưa làm

| ID | Nhóm | Hành vi mong đợi | Hiện trạng | Việc cần sửa | Cách kiểm | Evidence cần có |
|---|---|---|---|---|---|---|
| CCP-UX01 | Editor UX | Tìm và dùng Copy/Paste qua menu ⋮ từng block; keyboard/touch dùng được | Chưa làm | Audit public API + thiết kế grouping | Thử chuột, keyboard, touch/narrow UI trên onsite version | Version, ảnh/video, focus behavior |
| CCP-UX02 | Editor UX | Khác loại báo lỗi, đích nguyên vẹn | Chưa làm | Type/schema validation trước ghi | Paste Product vào Post và clipboard không hợp lệ | Notice + attrs trước/sau |
| CCP-UX03 | Editor UX | Cùng loại cập nhật content, Undo phục hồi cả lần dán | Chưa làm | Allowlist/transaction + chính sách empty | Nguồn/đích có dữ liệu khác nhau; paste/Undo/Redo | Attr diff, video |
| CCP-TECH01 | Technical | Style/layout/inherit đích giữ nguyên; không ghi shared data | Chưa làm | Per-block adapter, validation | So attrs + storage/network trước/sau | Diff/requests không có mutation ngoài scope |
| CCP-TECH02 | Technical | Clipboard failure/selection race/unsupported/locked không gây partial write | Chưa làm | Error paths + target validation | Chặn quyền, đổi selection, malformed payload/schema | Notices, attrs, console |
| CCP-UI01 | Block UI | Nội dung mới hiển thị sau Save/reopen, thiết kế đích giữ nguyên | Chưa làm | Hoàn thiện flow sau khi chốt scope | Preview → Save → reopen → frontend, desktop/mobile | URL/fixture/build và ảnh đối chiếu |

Không thêm frontend UI hoặc runtime mới cho clipboard; Block UI chỉ kiểm output/regression sau mutation nội dung. Trước onsite cần runbook `docs/testing/` với URL/setup/steps/expected/evidence theo scope đã chốt. Docs-only hiện tại không chạy runtime/build/lint.

## 8. Discussion log

- **2026-11-05 — Human:** muốn chuyển dữ liệu sang block mới không mang style; yêu cầu phản biện/research, sau đó nhấn mạnh cùng loại và báo lỗi khi khác loại.
- **2026-11-05 — Agent:** đã research và chỉ ra utility copy toàn block hiện có; đề xuất content allowlist, giữ style đích, Undo, public menu APIs. Các chi tiết agent đề xuất chưa được coi là human approval.
- **2026-11-05 — Human:** yêu cầu tạo docs trước, các trao đổi tiếp theo vào đây. Tạo057 và index GLOBAL; chưa source/commit/version/start.

Khi có quyết định mới: cập nhật decision register và mục liên quan trong cùng lượt, ghi rationale/evidence; giữ proposal cũ dưới trạng thái superseded khi cần giải thích. Không đánh dấu acceptance PASS chỉ vì đã chốt UX.

## 9. Chuột phải và khả năng khám phá — research / proposal 2026-11-05

**Historical / superseded scope:** research dưới đây giữ để truy vết, không phải scope implementation057. Source of truth cho right-click và review sau2.0 là plan058. Đề xuất nút riêng trên header không còn được chọn; human chọn menu ⋮ từng block. CCP-TECH03 chuyển058 ở trạng thái Deferred. CCP-UX04 giữ tại057 nhưng chỉ yêu cầu action labels rõ và keyboard/touch dùng được trong menu ⋮; tooltip/hint là tùy chọn chưa duyệt, không cần giới thiệu right-click. Cách kiểm UX04: mở menu bằng chuột/keyboard/touch, kiểm label/focus và không có lời hứa right-click; status Chưa làm.

**Human report:** chuột phải trong Editor UI hiện mở menu trình duyệt. Human hỏi cách thêm menu riêng và có nên dùng tooltip giới thiệu tính năng bổ sung. Đây là quan sát do human cung cấp, chưa phải agent onsite evidence; chưa xác định vị trí canvas/List View, version hoặc preference đang bật/tắt.

### 9.1. Cơ chế và giới hạn

- JavaScript trong trang không thể thêm tùy ý một item vào menu ngữ cảnh native của trình duyệt. Cách web app thông thường là nhận sự kiện `contextmenu`, gọi `preventDefault()` rồi hiển thị menu UI của ứng dụng. Đây là thay menu tại vùng xử lý, không phải nối thêm item vào menu browser. Tham chiếu [MDN contextmenu](https://developer.mozilla.org/en-US/docs/Web/API/Element/contextmenu_event), mục Canceling the contextmenu event. Chặn sự kiện không tự cung cấp menu, keyboard navigation hoặc focus management.
- [WordPress Preferences overview](https://wordpress.org/documentation/article/preferences-overview/) có tùy chọn `Allow right-click contextual menus` trong General. Phải kiểm tra version, preference và từng surface onsite trước khi kết luận editor không có menu chuột phải. Sự tồn tại của setting không chứng minh có public extension point cho canvas hoặc menu đó trên version đang dùng; không tự bật thay preference của human.
- Nếu phải tự dựng: chỉ cân nhắc vùng header/khung preview plugin sở hữu; không chặn toàn editor, text selection, input/textarea/contenteditable, link hoặc ảnh. Phải xác định đúng block được click kể cả nested block, không mặc định dùng selection cũ. Nếu có native menu tại vùng đó thì không chặn đè hoặc hiện hai menu. Với iframe editor phải xử lý đúng document/coordinate/focus, không tìm private DOM để vá.
- Menu custom cần Escape/click ngoài để đóng, điều hướng bàn phím, trả focus về trigger, giữ menu trong viewport và cleanup khi unmount; không coi chỉ `preventDefault()` là đã hoàn tất. MDN ghi Firefox Shift+right-click có thể mở menu browser không phát sự kiện; không quảng bá shortcut này như cam kết mọi browser.

### 9.2. Decision memo — đề xuất, chưa xin triển khai

1. **Vấn đề:** action content-only cần dễ tìm nhưng right-click hiện chưa có menu plugin và dễ ảnh hưởng thao tác browser/editor.
2. **Phương án:** A — action/menu hiển thị rõ trên khung plugin + mở qua click/focus, dùng native block menu nếu có public API đúng version: dễ tìm/keyboard/touch, thêm một control. B — như A và thêm right-click trên header/khung plugin: nhanh cho người quen nhưng thêm scope focus/iframe/interaction. C — chỉ menu chuột phải: ít control nhưng khó tìm, không đủ đường dùng touch/keyboard; không khuyến nghị.
3. **Khuyến nghị:** A làm đường truy cập chính; B chỉ là shortcut bổ sung sau audit API/runtime, không mặc định xây menu riêng. Không yêu cầu người dùng học right-click mới dùng được Copy/Paste.
4. **Bằng chứng:** human report ở đầu §9; MDN giải thích event/default behavior; WordPress docs có preference native. Chưa có bằng chứng public hook menu trên version onsite.
5. **Tự kiểm chứng (≤10 phút):** mở editor `⋮ → Preferences → General`, tìm setting trên nếu version có; thử riêng List View, header preview plugin và ô nhập text; ghi WP/Gutenberg version + browser và ảnh menu. Đối chiếu hai nguồn trên; khi implementation phải audit API/source đúng version.
6. **Đảo ngược:** hai chiều về UX đề xuất; bỏ shortcut không đổi saved content. Dựng custom menu vẫn có chi phí implementation/QA, không coi là thao tác miễn phí.
7. **Default trước khi chốt menu/implementation:** giữ nguyên browser/editor context menu, chưa thêm handler; giữ đề xuất action hiển thị rõ. Không đổi current milestone hoặc source trong lượt docs này.

### 9.3. Tooltip / hướng dẫn khám phá

Agent đề xuất **có hướng dẫn, nhưng tooltip chỉ hỗ trợ**:

- Có entry dễ thấy, ví dụ menu `Content actions` trên header khung block plugin. Label/accessible name rõ; tooltip khi hover hoặc keyboard focus nếu dùng icon. Vị trí/icon/grouping cần mockup, chưa được duyệt.
- Khi right-click thực sự được hỗ trợ mới giới thiệu: `Copy content without changing the destination block’s design. Open Content actions or right-click the block header.` Không hiện lời hứa right-click ở surface/version không hỗ trợ.
- Có thể dùng một hint có thể dismiss ở lần đầu tính năng khả dụng, không tooltip tự bật mỗi lần chọn block hoặc phủ toàn canvas. “Một lần” cần xác định theo user/site/device và persistence trước code; chưa duyệt thêm storage/settings/onboarding.
- Tooltip không chứa action cần click, không thay thế entry menu/accessible label và không là nguồn hướng dẫn duy nhất cho touch. Success/error notices của Copy/Paste vẫn riêng.

Acceptance bổ sung (đều **Chưa làm**): CCP-UX04 — entry dùng được không cần biết right-click; tooltip có hover/focus, không che nội dung. CCP-TECH03 — nếu có shortcut: chỉ đúng surface/block, không chặn native menu/text edit, đóng/cleanup/focus đúng cả iframe và nested blocks. Evidence: version/browser, video chuột/keyboard/touch, kiểm preference on/off, input/link/image và menu gần mép viewport. Block UI frontend N/A cho menu/hint vì chỉ nằm trong editor; regression content-output vẫn theo CCP-UI01.

Discussion update: human chưa chốt custom menu, tooltip/hint hoặc phương án A/B; các nội dung trên là research và đề xuất để thảo luận tiếp.

**Discussion update mới hơn — human2026-11-05:** tách057/058, ưu tiên Content actions tại menu ⋮ từng block. Screenshot `codex-clipboard-3707c461-d2ef-41aa-bc45-5fc939e811f4.png` cho thấy menu toolbar với Copy/Cut/Duplicate/Lock/Rename/Hide/Delete, dùng làm evidence vị trí mong muốn, không suy ra version/API. Chuột phải đợi sau2.0; khi đó agent tổng hợp các tính năng đề xuất rồi trình human quy định mốc thực hiện. Không tự gán2.0.1 hoặc coi đây là lệnh start scope mới.

## 10. Research bổ sung và giới hạn kiểm chứng — 2026-11-05

### 10.1. Public API đúng surface

1. [BlockSettingsMenuControls README trong Gutenberg](https://raw.githubusercontent.com/WordPress/gutenberg/trunk/packages/block-editor/src/components/block-settings-menu-controls/README.md) mô tả Fill cho menu settings của từng block; render callback nhận `onClose`. [Handbook package](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#blocksettingsmenucontrols) liệt kê export này. Đây là candidate API phù hợp; không dùng `PluginMoreMenuItem` vốn thuộc menu editor hiện có. README có typo import `@wordress`; code thực tế phải import `@wordpress/block-editor`, không copy typo.
2. [MenuGroup](https://developer.wordpress.org/block-editor/reference-guides/components/menu-group/) nhóm các MenuItem có liên quan, có label tùy chọn. Proposal: nhóm phẳng `Content actions`, hai action; không submenu lồng và không thêm nút toolbar. Cần audit slot hiện tại đã có group hay chưa để tránh lồng markup group không hợp lệ. Không dùng CSS/DOM di chuyển action sát Copy/Cut nếu API không hỗ trợ thứ tự đó.
3. [Block Editor Data](https://developer.wordpress.org/block-editor/reference-guides/data/data-core-block-editor/#updateblockattributes) có action cập nhật nhiều clientIds với `uniqueByBlock`; có selectors `canEditBlock`, `getBlockEditingMode`, `areInnerBlocksControlled`. Đây là candidate cho một mutation cập nhật nhiều node. Docs API không chứng minh một Undo trên runtime; phải kiểm history thực tế, không suy từ `registry.batch` hoặc số render.
4. [Blocks package](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-blocks/) là tham chiếu `parse`, `serialize`, `createBlock`, registration/schema. Dùng parser Gutenberg, không tự regex parser HTML. [Core Blocks Reference](https://developer.wordpress.org/block-editor/reference-guides/core-blocks/) chỉ là inventory hiện hành; adapter core node phải đối chiếu block schema/version thực tế.
5. [MDN readText](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/readText) và [writeText](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText): clipboard có secure-context/permission/error paths. Không đọc khi hover/mở menu để thử compatibility; chỉ đọc khi người dùng chọn Paste.

**Version gate:** plugin header hiện `Requires at least: 6.5`; package chỉ pin build tooling `@wordpress/scripts ^30.6.0`, không pin Gutenberg runtime. Không có local `node_modules/@wordpress/block-editor` hoặc onsite version evidence. Fetch source tag6.5/6.8 trong research chưa thành công; không khẳng định callback prop/group/uniqueByBlock tồn tại trên mọi version >=6.5. Trước coding, ghi exact WP version, Gutenberg plugin version nếu active, public exports/signature của version đó; kiểm cả minimum được hỗ trợ hoặc đề xuất compatibility boundary riêng. Không tăng Requires at least âm thầm. Nguồn trunk/handbook không thay version gate này.

### 10.2. Evidence từ repo

| Source | Finding có thể kiểm lại |
|---|---|
| `src/core-controls/block-clipboard/index.tsx` | Utility cũ serialize toàn selection, parse và insertBlocks; menu toàn editor, gate `block_clipboard`. Không sửa thành content-only vì thay behavior đã dùng. |
| `src/core-controls/config.ts`, `modules/core-control/registry.php` | Existing gate default false, label Block Copy/Paste, được admin bật riêng. Proposal reuse gate này cho action mới, không thêm option hoặc auto-enable. |
| `src/slider/block.json`, `src/slide/block.json`, `src/slider/variations.ts` | Slider attrs chủ yếu presentation/behavior; Slide chứa background image, còn heading/body/button nằm trong InnerBlocks. Hero/Showcase/Card templates khác cấu trúc. Không thể chỉ copy attrs Slider rồi báo thành công. |
| `src/product-collection/block.json`, `src/post-collection/block.json`, `src/collection/controls.tsx` | Query và content/style lẫn nhau; item count có giới hạn khác theo content/layout. Không copy cả attrs hoặc normalize một giá trị không hợp lệ để giả thành công. |
| `src/product-category-grid/block.json` | Categories là tham chiếu dữ liệu; chi tiết category có owner dùng chung. Content-only không được ghi category details. |
| `src/design-sidebar/index.tsx` | Có precedent re-check selection/block tồn tại tại event time; cần mở rộng cho async clipboard và nested nodes. |

## 11. Scope và policy đề xuất cho đợt đầu

**Human đã duyệt nguyên gói §11–14 ngày2026-11-05**, cho coding+commit trong current1.3.19, không bump; chi tiết approval§17. Các chữ “proposal” bên dưới giữ rationale thiết kế; không còn chặn approval cho gói này. Những nhánh ghi rõ ngoài scope/chưa hỗ trợ vẫn giữ nguyên; runtime API/evidence chưa được chứng minh bởi approval.

### 11.1. Boundary / supported blocks

- Editor tooling thuộc plugin, không thêm frontend assets, REST endpoint, DB/storage, dependency, CSS hoặc PHP runtime module mới.
- Target đợt đầu: Product Collection, Post Collection, Slider và Slide. Giữ Slider trong scope vì screenshot mục tiêu dùng Slider; không giao một MVP chỉ Collections rồi coi toàn057 hoàn thành.
- Root menu chỉ hiện cho bốn loại trên khi gate bật; không cho core blocks độc lập, multi-select, unknown blocks. Core nodes bên trong Slider/Slide là adapter phụ, không phải root menu mới.
- Product Category Grid, Card/Card Grid, Accordion, Feature Showcase và Responsive Spacer chưa thuộc đợt đầu; chưa có adapter = không hiện action và không báo copy thành công. Đây là scope proposal, chưa phải human quyết định defer những block đó.
- Chỉ page/post editor; Site Editor, widget, template entity editing chưa support. Không dùng runtime object chưa guard để làm crash editor không hỗ trợ.
- Copy/Paste một root tại một thời điểm. Không ghi qua synced pattern/template-part/entity controller hoặc binding. Chặn khi root hoặc bất kỳ ancestor/descendant liên quan có controlled entity, binding, invalid/unregistered node, editing disabled hoặc editing mode chưa audit. Lock move/remove riêng không đồng nghĩa content read-only: dùng API content permissions đúng version, không tự đoán từ `lock`.

### 11.2. Cùng loại và cấu trúc

- Exact registered block name bằng nhau; Product ≠ Post, Slider ≠ Slide. Chưa tự alias namespace trước/sau migration1.4.0. Khi milestone được chốt sau migration phải re-audit names, không global replace.
- Grid ↔ Carousel của cùng Collection được phép, giữ layout đích. Đây là lựa chọn đề xuất cho Q1, cần human duyệt.
- Với Slider/Slide: toàn cây phải có cùng số lượng/thứ tự/tên node tại từng path. Mapping theo vị trí, không đoán theo title/id; không thêm/xóa/reorder child, không tự match slide theo text.
- Hero ↔ Showcase khác shape sẽ từ chối nguyên thao tác; cùng name nhưng khác shape cũng có thể không tương thích. Slider3slides → Slider2slides từ chối, hướng dẫn người dùng chuẩn bị cấu trúc đích tương ứng. Không cắt bớt content hoặc paste một phần.
- Các wrapper `core/group`, `core/columns`, `core/column`, `core/buttons` chỉ được dùng như structural nodes sau audit. Unknown child làm cả tree không hỗ trợ; không bỏ qua để báo thành công.

### 11.3. Allowlist đề xuất — mọi key ngoài danh sách giữ của đích

| Adapter | Copy content fields | Giữ đích / giới hạn |
|---|---|---|
| Product Collection | `eyebrow`, `heading`, `intro`, `accessibleLabel`, `categories`, `tags`, `relation`, `orderMode`, `itemsToShow`, `customActionUrl`, `archiveUrl`, `archiveLabel`, `catalogCtaUrl`, `catalogCtaLabel` | Giữ mọi show*/layout/style/media/behavior; giữ `productActionMode`, `appendQuoteContext`. Query được coi là lựa chọn nội dung, không copy kết quả query/sản phẩm. |
| Post Collection | Như Product, thêm `readMoreLabel` | Giữ `postActionMode`, mọi show*/layout/style/behavior. |
| Slider | Không root content attr; copy cây nội dung các Slide | Không serialize/apply preset, autoplay, effect, navigation, parallax, height, responsive config vào target. |
| Slide | `backgroundImageId`, `backgroundImageUrl`, `backgroundImageAlt`, cùng child content | Giữ overlayOpacity và style/support attrs đích. |
| core/heading, core/paragraph | `content` | Giữ heading level, text alignment, typography, style và support attrs. |
| core/button | `text`, `url`, `linkTarget`, `rel`, `title` nếu exact runtime schema có | Giữ width/type/colors/style. Không tự import thuộc tính ngoài schema. |
| core/image | `id`, `url`, `alt`, `caption`, `href`, `linkTarget`, `rel` nếu schema có | Giữ sizeSlug, ratio, dimensions, crop/style. Audit linkDestination coupling: nếu không thể đổi link data mà giữ presentation nhất quán thì reject case đó, không đoán. |
| Structural core wrappers | Không copy attrs | Chỉ đối chiếu shape; giữ toàn bộ attrs đích. |

Mọi adapter phải có validator từ source type/schema + enum/range runtime. Query references validate theo taxonomy/content type hiện hành trước mutation; unresolved reference báo lỗi, không silently drop. `itemsToShow` vượt giới hạn target layout: reject, không clamp. CTA URL/label vẫn có thể chuyển nhưng CTA ẩn hoặc action mode khác sẽ giữ nguyên; notice/hướng dẫn không hứa mọi content đều đang visible.

**Inline formatting:** `content`/`text` là rich text HTML có thể chứa style nguồn. Proposal giữ semantic formatting (strong/em/a/br với safe link attrs), loại font/color/class/style/data/event attrs của inline elements; reject unsupported meaningful rich-text constructs thay vì làm mất dữ liệu âm thầm. Dùng public rich-text/HTML sanitization APIs đã audit trên version chạy, không regex strip HTML hoặc innerHTML injection. Không đổi sanitizer PHP/renderers để phục vụ tiện ích. Fixture cần có link, bold, font color và span inline style. Nếu không chứng minh policy này bằng tests thì không claim “giữ style đích” cho rich text.

### 11.4. Empty / defaults / site boundary

- Nguồn rỗng hợp lệ (`''`, `[]`, zero media ID) thay nội dung đích bằng rỗng; không dùng truthy fallback hoặc bỏ qua empty. Key content có default nhưng bị serializer omit: resolve theo **schema đã audit** cho adapter, không lấy một default style làm content.
- Snapshot được tạo lúc chọn Copy; không giữ live reference tới attrs nguồn. Destination style luôn lấy tại lúc commit paste, không restore snapshot style cũ sau await.
- Hỗ trợ cùng website qua page/tab với clipboard text. Không đảm bảo cross-site media/taxonomy portability; không upload/copy thư viện, không tự mapping ID theo name. Native Gutenberg text không chứng minh origin site: không claim detect được mọi cross-site paste. Nếu cần hard reject origin khác thì phải duyệt transport/origin envelope riêng, hiện chưa có trong plan.
- Paste cùng nội dung không mutation/history entry, báo `The block already contains this content.`. Không auto-save/publish; Page Save vẫn do user.

## 12. Transport, mutation và UI contract đề xuất

### 12.1. Transport không tạo format riêng

Giữ contract Core Control: plain-text **Gutenberg serialized markup** qua public `serialize`/`parse`; không custom JSON envelope/MIME, không localStorage/in-memory clipboard thay OS clipboard, không override Ctrl+C/V hoặc clipboard events.

Copy tạo một **projection tree mới**, chỉ chứa names/shape và content allowlist đã chuẩn hóa; tuyệt đối không `serialize(sourceBlock)` nguyên attrs. `createBlock` có thể tự thêm default attrs/save markup: phải inspect round-trip payload để bảo đảm không lẫn source styles; nội dung serialization có thể mang default markup của core, không hứa payload là plain text không HTML. Paste luôn extract allowlist mới từ parsed tree, không apply parsed defaults ngoài allowlist. Không yêu cầu marker format mới để nhận clipboard; native Copy/full-block copy cũng được đọc nếu tree/schema hợp lệ, nhưng chỉ content được lấy.

Không mutate source để xóa style trước serialize. Reject freeform/HTML/multiple roots/invalid blocks, unregistered or unknown descendants, bindings/entity controllers. Trước parse: limit đề xuất1MiB text; sau parse: <=200nodes, depth<=20; đo fixtures để điều chỉnh trước release, đây là giới hạn proposal. Không log clipboard/body/URLs ra console. Parse không tự là sanitizer hoặc chứng minh type đúng.

### 12.2. Paste transaction

1. Click action: capture target clientId + exact name + full shape/content revision signature; đánh dấu busy chống double click. Khi runtime cung cấp menu target clientIds thì dùng và đối chiếu selection; không mặc định menu của một block luôn trùng global selection (đặc biệt List View).
2. Read clipboard trong user gesture. Đóng menu theo API, giữ request state ngoài Fill nếu Fill unmount; cleanup/cancel nếu feature/editor unmount.
3. Parse, validate toàn tree, normalize allowlist, prepare pure `MutationPlan` keyed theo **destination clientIds**. Mọi validation/network lookup phải kết thúc trước mutation; không dispatch từng node trong vòng await.
4. Re-read target và subtree/ancestors: còn tồn tại, đúng selection/name/shape, chưa đổi content kể từ action, editable và không bound/controlled. Nếu changed/cancelled: notice không sửa. Style changes trong lúc chờ phải được giữ; không dùng full attrs snapshot để ghi đè.
5. Nếu còn hợp lệ, dispatch public multi-block `updateBlockAttributes(ids, patchesById, { uniqueByBlock: true })` một lần nếu exact runtime hỗ trợ và history được kiểm chứng. Không `replaceBlocks`, `replaceInnerBlocks`, insert/reset tree, không private persistence/undo flags. Nếu thiếu API hoặc không đáp ứng Undo atomic: dừng nhánh nested và báo dependency, không ship partial tree.
6. Thành công báo snackbar; Undo/Redo phải hoàn tác/áp dụng **toàn paste** trong1bước, giữ change user thực hiện trước paste như một bước riêng. Đây là acceptance phải chứng minh, không hứa từ action signature. No-op không tạo history.

### 12.3. Menu / notices

Proposal hiển thị phẳng trong menu ⋮ sẵn có:

```text
… native block actions …
────────────────────────
Content actions
  Copy content
  Paste content only
… native block actions …
```

Một global registered Fill/subscription được guard + feature gate, tránh inject Fill trong mỗi BlockEdit gây trùng action. Render callback/context props phải audit version; không assume prop clientIds có chỉ vì onClose có. Nếu API không cho group label đúng semantics, giữ2MenuItem liên tiếp trong slot group do core quản lý và ghi evidence; không thêm menu riêng hoặc hack DOM.

- Không tooltip onboarding, shortcut mới, quyền clipboard prompt lúc mở menu. Labels English+i18n. Native menu dùng được bằng keyboard/touch; keyboard focus sau đóng/notice kiểm thực tế.
- Unsupported root/multi-select: không có group. Supported tree nhưng chưa hợp lệ: disabled Copy/Paste với lý do accessible, không silently no-op. Paste vào root khác loại vẫn cho action nếu root đó supported, click rồi notice lỗi sau đọc clipboard (không disable dựa vào cached clipboard).
- Success: `Content copied.`, `Content pasted.`; mismatch: `Content cannot be pasted into this block type.`; shape: `The source and destination block structures do not match.`; permission: `Clipboard access was blocked by the browser.`; target race: `The destination changed. Try pasting again.`; unsupported clipboard: `No compatible block content found.`
- Không fallback field/manual dialog đợt đầu; nếu clipboard API bị chặn thì báo lỗi và không thay editor native paste. Proposal fallback cũ chưa duyệt được bỏ khỏi scope đề xuất.

## 13. Work packages, files và exit criteria

| Gói | Việc / files dự kiến | Exit evidence |
|---|---|---|
| P0 — preflight | Đọc AGENTS/context; xác nhận scope/version/start; exact editor/runtime API, feature gate, core schemas; chụp menu và ghi evidence ledger | Chưa đủ version/product approval hoặc API thì chỉ bổ sung research, chưa code; báo đúng dependency, không dựng fallback khác surface. |
| P1 — pure adapters | `src/core-controls/block-content/adapters.ts`, `types.ts`, `model.ts`: tree inventory, validation, content extraction, shape mapping, empty/default/inline formatting policy | Unit fixtures chứng minh allowlist và source/dest immutability; no style leakage. Không sửa block.json chỉ để tiện copy. |
| P2 — transport/controller | `clipboard.ts`, `controller.ts`: projection serialize/parse, bounds, cancellation/busy, revalidation, one mutation plan | Real Gutenberg parser/serializer fixtures; permission/malformed/race/no-op tests. Không copy test parser giả rồi gọi integration PASS. |
| P3 — menu integration | `index.tsx` dùng public BlockSettingsMenuControls/MenuItem, import một lần từ `src/core-controls/index.ts`; reuse block_clipboard gate; có thể sửa registry description cho đúng cả full/content-only, không đổi option/default | Action trong menu block, không menu editor mới; không duplicate, không listener contextmenu, không CSS/PHP module/dependency mới. Utility block-clipboard cũ giữ behavior. |
| P4 — tests/runbook | `tools/tests/block-content-copy.test.mjs`, harness TS phù hợp repo; cập nhật `docs/testing/block-content-actions.md` và057 | Test logic có thể chạy không build; no fake claims; user chạy build/lint, onsite version/menu/Undo/save evidence. |
| P5 — review/handoff | Audit diff chỉ files scope, cập nhật IDs source vs runtime, prompt tự đọc được, commit nguồn theo human authorization sau khi gates đủ | Không stage build/source người khác; report commit + tests + build/onsite pending. Không tự chuyển milestone hoặc release. |

Không chỉnh theme/GeneratePress/Collection query engine/Swiper/loading/skeleton/namespace. Nếu cần PHP require/include mới, đây là thay plan cần rationale + artifact workflow, không tự thêm. Đổi CSS không dự kiến; nếu phát sinh phải đọc2CSS contracts trước và ghi lý do.

## 14. Acceptance mở rộng và verification

Kế thừa CCP-UX01–04, CCP-TECH01–02, CCP-UI01 ở trên. CCP-TECH03 vẫn Deferred058, không trở thành exit057. Mọi ID sau đều **Chưa làm**, docs/test design không phải PASS.

| ID | Nhóm | Hành vi / states | Việc cần làm | Cách kiểm | Evidence |
|---|---|---|---|---|---|
| CCP-UX05 | Editor UX | Menu đúng block, đúng group, gate on/off, keyboard/touch; không trùng native Copy | P3 | Selected root + List View khác selection, multi-select, gate reload | Version/build, screenshot/video + focus |
| CCP-TECH04 | Technical | Projection không chứa source style; parse/full native Copy đều chỉ lấy allowlist | P1/P2 | Source style khác target, unknown keys/defaults/inline spans | Payload inspect trong fixture + attrs diff; không log clipboard onsite |
| CCP-TECH05 | Technical | Tree shape sai/unknown/bound/controlled từ chối toàn bộ | P1/P2 | Slider2→3slides; swap child name; unsupported core node/entity/binding | Zero dispatch/attrs unchanged + error notice |
| CCP-TECH06 | Technical | One mutation/no partial writes; races/no-op/busy/permission failures an toàn | P2 | Delete/reselect/edit target trong clipboard await; change style; double click; deny | Unit action counts + onsite attrs/history/video |
| CCP-UX06 | Editor UX | Empty xóa content có chủ ý; giữ design visibility; query validation lỗi rõ | P1/P3 | Emptyheading/image/CTA, hiddenCTA, query IDs missing, item limit | Before/after fixtures + messages, không clamp/drop âm thầm |
| CCP-TECH07 | Technical | Existing whole-block utility và persisted owners không regression | P3/P4 | Copy/Paste block(s) cũ vẫn insert, settings false default, no option/theme/meta writes | Tests, gitdiff, request/storage audit |
| CCP-UI02 | Block UI | Slider/Slide content/media/link đổi đúng, preset/overlay/child style/inherit không đổi | P4 | Same-shape Hero + Showcase; Save/reopen/frontend desktop/mobile | Fixture URL, screenshots, structural/attr diff |

Test priorities: mismatched root; same root/different shape; matching tree with style differences; empty/default; same Collection Grid→Carousel; invalid query/URL/rich HTML; locked vs disabled; entities/bindings; permission denial; target content changed/style-only changed; full native copy; parser malformed/limits; Undo after earlier typing and Redo; no-op. Tests phải chứng minh behavior, không chỉ grep implementation. Exact runtime API/history/clipboard permissions cần onsite, unit mock không thay thế.

Human build/lint sau implementation (agent không chạy):

```bash
source /home/shinkuro/.nvm/nvm.sh && nvm use 20 && cd /mnt/d/Github/skvn-marine/wp-content/plugins/skvn-marine-blocks && npm run build && find modules/ -name "*.php" -exec php -l {} \;
```

Nếu registry PHP đổi thì lint file đó theo lệnh trên; nếu bootstrap đổi thì thêm `php -l skvn-marine-blocks.php`. Không bump/build trong lượt docs. Command treo/timeout thì dừng ngay, không retry/poll theo AGENTS.

## 15. Decision memo — lịch sử trước approval§17

1. **Vấn đề:** UX menu đã chốt nhưng content policy, implementation scope và SemVer/start chưa được human xác nhận.
2. **Phương án:** A — duyệt gói §11–14, bổ sung current1.3.19 bằng ngoại lệ development-scope như Spacer: làm sớm nhưng tăng scope đang chờ onsite. B — duyệt gói nhưng xếp milestone MINOR mới, candidate1.8.0: đúng feature-version rule nhưng thực hiện sau các1.4–1.7 đã có. Nếu cần mốc khác phải đối chiếu roadmap, không chen đè.
3. **Khuyến nghị:** duyệt kỹ thuật gói §11–14; nếu human cần triển khai ngay thì xác nhận A rõ ràng, không suy từ lệnh commit docs. Candidate1.8.0 chỉ là phương án B, chưa reserve/version approved. Feature tăng khả năng nên MINOR theo rule thông thường;1.3.19 chỉ được dùng nếu human duyệt ngoại lệ như055.
4. **Bằng chứng:** AGENTS §Milestone stack→SemVer; MILESTONES current1.3.19 và scopes1.4.0–1.4.3/1.5.0/1.6.0/1.7.0; schema/source table§10.2 cho thấy nested/query/inline style không thể xử lý bằng copy attrs chung.
5. **Tự kiểm chứng (≤10 phút):** đọc MILESTONES headings và AGENTS rule (2phút), xem slider variations/block.json và utility clipboard cũ (4phút), đối chiếu API sources§10.1 (3phút). Onsite version là evidence còn thiếu, không yêu cầu tin lời agent.
6. **Đảo ngược:** plan/menu implementation có thể gỡ; pasted content đã Save là thay đổi dữ liệu có ý thức của user, cần Undo trước Save/revision sau Save; không hứa rollback plugin tự hoàn nguyên nội dung.
7. **Default trước khi agent coding bắt đầu:** chỉ preflight/research và docs; **không implementation/bump/chuyển milestone** đến khi scope/version/start được human xác nhận. Prompt bàn giao phải giữ gate này, không giả định bản plan commit là code approval.

## 16. Handoff và model recommendation

Prompt: `docs/workflows/prompts/block-content-actions-agent-handoff.md`. Onsite runbook: `docs/testing/block-content-actions.md`. Commit planning không phải runtime PASS hoặc lệnh deploy.

Human làm rõ model là **DeepSeek Flash4.1**, Nemotron chưa rõ variant/provider. Khuyến nghị thực dụng của agent: dùng DeepSeek Flash4.1 cho implementation theo work packages và review độc lập trước merge/release; đây là suy luận cho task, không benchmark đối đầu Nemotron. [DeepSeek V4.1 Flash release](https://api-docs.deepseek.com/news/news260910/) và [1017 update](https://api-docs.deepseek.com/news/news261017/) mô tả agent/coding updates; alias/provider có thể route snapshot khác nên phải ghi exact model ID/snapshot. [NVIDIA model catalog](https://build.nvidia.com/models?q=NeMo) có nhiều biến thể Nemotron, không thể xếp cả họ bằng một tên. Không lấy vendor benchmark làm bằng chứng model sẽ giữ đúng invariant repo này.

Discussion2026-11-05: human yêu cầu research, plan chi tiết, commit docs và prompt cho agent khác thực hiện. Chưa trao quyền code057 ở milestone cụ thể; agent không spawn subagent chỉ để thực hiện commit docs thông thường.

## 17. Approval / execution authorization — human2026-11-05

Human trả lời lựa chọn: **“Duyệt gói, làm trong 1.3.19 như scope bổ sung, không bump; cho agent coding và commit feature patch:”**.

- Duyệt scope và policies §11–14, thực hiện P0–P5 cho Product/Post Collections + Slider/Slide. Exact type và tree shape; giữ style đích; query là content; empty hợp lệ ghi đè; native projection transport/allowlist và atomic Undo theo plan. Không cần hỏi lại các quyết định này.
- Version/start: **V1 /1.3.19 — Plugin Design Sidebar Foundation**, scope addition được human duyệt, bắt đầu implementation theo handoff. Không chuyển current, không bump metadata hoặc archive milestone/tensions. Stack ref: scope addition của current M1 follow-up, không tạo stack milestone mới.
- Feature thông thường tăng MINOR; human chọn ngoại lệ bổ sung development milestone đang mở như055. Phương án candidate1.8.0 trong memo§15 không được chọn và không reserve version đó.
- Cho coding agent commit nguồn đã tự kiểm với **`feature patch: add block content actions`** (prefix bắt buộc `feature patch:`). Không commit build/source của người khác; build/lint do human chạy theo AGENTS.
- P0 vẫn phải xác minh exact runtime/version/public API trước dùng; không hỏi lại product approval vì thiếu API evidence. Nếu technical dependency thực sự chưa có thì báo đúng phần thiếu, không tự đổi scope/menu/transport.
- Right-click058 vẫn Deferred sau2.0. Không deploy, release, nghiệm thu hoặc đánh dấu CCP-* PASS từ approval này. Source/tests/build/onsite evidence vẫn cần ghi riêng.
- Prompt bàn giao đã cập nhật thành lệnh CODE_NOW với authorization này. Agent hiện tại chỉ cập nhật/commit docs để human chuyển agent khác thực hiện; chưa code plugin.

Approval này supersedes mọi câu “chưa cho code/chưa xếp version/start” ở phần lịch sử đầu tài liệu và §15–16. Acceptance implementation vẫn Chưa làm cho đến khi có source/evidence.

## 18. Implementation ledger — agent2026-11-05

**Source: đã có**, commit `feature patch: add block content actions` trong current V1 /1.3.19. Không bump metadata, không chuyển milestone, không archive tension, không deploy/release.

| Gói | Trạng thái | Evidence |
|---|---|---|
| P0 — preflight | Xong | §10.1 + runbook §1: WP 7.1, không Gutenberg plugin, `BlockSettingsMenuControls` (`block-editor.js:6928`, slot `58294–58390` với `canEdit`/`selectedBlocks`/`selectedClientIds`/`onClose`), `updateBlockAttributes` + `uniqueByBlock` (`:16305`, reducer `8500–8560`), `canEditBlock` (`:15126`), parse/serialize behavior (`blocks.js:3652/3764/5721`), core schema trong `wp-includes/blocks/*/block.json` |
| P1 — pure adapters | Đã có source | `src/core-controls/block-content/{types,fields,plan}.ts`; dependency-free để test bằng Node |
| P2 — transport/controller | Đã có source | `transport.ts`, `clipboard.ts`, `taxonomy.ts`, `controller.ts`; một dispatch `updateBlockAttributes(..., { uniqueByBlock: true })`, revalidate sau await |
| P3 — menu integration | Đã có source | `index.tsx` fill `BlockSettingsMenuControls` + `MenuGroup` "Content actions"; import một lần ở `core-controls/index.ts`; registry chỉ mở rộng description `block_clipboard` |
| P4 — tests/runbook | Unit xong, onsite chờ | `tools/tests/block-content-copy.test.mjs` 16/16 pass; runbook `docs/testing/block-content-actions.md` cập nhật |
| P5 — review/handoff | Xong phần source | Diff chỉ file scope; build/lint/onsite để human |

Acceptance IDs (§14) — **trạng thái source, không phải PASS**:

| ID | Trạng thái | Ghi chú |
|---|---|---|
| CCP-UX05 | Chờ kiểm chứng | Menu/group/gate/keyboard/touch cần runtime |
| CCP-TECH04 | Có source + unit | Allowlist/no-style proven ở pure test; round-trip serialize/parse thật chưa chứng minh |
| CCP-TECH05 | Có source + unit | Shape/unknown/root mismatch reject; entity/binding cần runtime |
| CCP-TECH06 | Có source + unit một phần | No-op/zero patch proven; race/busy/permission/Undo cần runtime |
| CCP-UX06 | Có source + unit | Empty overwrite + itemsToShow reject proven; query missing ref cần site thật |
| CCP-TECH07 | Có source + unit gián tiếp | Utility cũ không đổi; settings/option/storage diff audit ở git diff |
| CCP-UI02 | Chờ kiểm chứng | Save/reopen/frontend desktop/mobile |

Không đánh dấu PASS, không nghiệm thu, không release từ ledger này.

## 19. Review repair plan — 2026-11-05, baseline `0a53a2d`

Human yêu cầu lập plan sửa chi tiết và ghi pitfall sau review. Đây là lỗi implementation/test coverage của coding agent, không phải thay đổi yêu cầu hoặc thiếu chỉ dẫn của human. §19–24 ưu tiên hơn nhận định đủ source/P5 xong ở §18 đối với bốn finding bên dưới. **Lượt này chỉ sửa docs; chưa sửa source, chưa commit repair, chưa build/lint hoặc nghiệm thu.** Giữ current V1 /1.3.19, scope addition đã duyệt tại §17, không bump/chuyển milestone. Không hỏi lại scope/version/start của feature; plan này không tự mở right-click058 hoặc đổi transport.

### 19.1 Findings và evidence

Các đường dẫn source trong §19–24 tương đối với `wp-content/plugins/skvn-marine-blocks/`, line là baseline `0a53a2d` (sẽ đổi sau repair).

| ID / mức | Nhóm | Hành vi mong đợi | Hiện trạng | Việc cần sửa | Cách kiểm | Evidence |
|---|---|---|---|---|---|---|
| CCP-R1 / P1 | Technical | Clipboard nguồn có binding/entity/unsupported node phải reject toàn bộ trước projection/mutation | FAIL source | Validate cây nguồn thô, giữ metadata đến khi kiểm xong | Native Copy bound paragraph trong Slide rồi Paste: zero mutation | `transport.ts:117–123` chỉ kiểm registered/isValid; `controller.ts:86–101,150` chỉ kiểm binding của block đọc từ editor. Review fixture `buildPatches()` nhận nguồn bound vẫn trả patch content |
| CCP-R2 / P1 | Technical + Editor UX | Root/ancestor/descendant đều phải có quyền và editing mode/entity ownership hợp lệ ở thời điểm ghi | FAIL source | Guard đầy đủ mọi node liên quan, dùng lại khi availability và sau await | Root default, child disabled/controlled/locked; zero mutation; thay guard trong lúc chờ cũng abort | `controller.ts:170–174` kiểm mode/controlled root; `:196–213` descendant chỉ gọi canEditBlock. Local WP7.1 `D:/Github/minhhaifish/wp-includes/js/dist/block-editor.js:15126` chỉ kiểm preview/lock.edit |
| CCP-R3 / P2 | Technical | Copy lẫn Paste đều áp dụng 200 nodes/depth20 và text limit | FAIL source | Bounded traversal tại ingress và planner, không chỉ Copy | Boundary 200/201 nodes, depth20/21 và text limit | `plan.ts:284–309` không kiểm limits ở buildPatches. Review: 202-node tree Copy=false nhưng Paste=true/201 patches |
| CCP-R4 / P2 | Editor UX + Technical | Rich text có font/color span vẫn copy được text/semantic markup, loại presentation | FAIL source | Thay scanner HTML tự viết bằng public parser/rich-text pipeline đã audit, phân biệt presentation với meaningful constructs | `<span style="color:red">Text <strong>bold</strong></span>` giữ Text/bold, không style; cả Copy content và native Copy | `fields.ts:19–31,355` reject span; test cũ cố định span phải fail, trái §11.3 |

Block UI: không thêm visual/layout scope. CCP-UI02 vẫn phải kiểm content/link/media/style sau Save/reopen/frontend desktop/mobile vì Paste có thể thay dữ liệu được render. Menu grouping, one Undo/Redo, core image link coupling và actual serialize/parse từ plan gốc vẫn chưa được chứng minh; không coi review bốn finding này là chứng nhận phần còn lại.

### 19.2 Mức bằng chứng hiện có

- Hai tái hiện độc lập bằng Node `stripTypeScriptTypes` + VM trên `types/fields/plan.ts`: nguồn có `metadata.bindings.content` vẫn tạo patch; cây Slide +201 paragraphs Copy reject nhưng Paste tạo201 patches. Đây là model/source evidence, không phải clipboard/browser runtime.
- Review runner `node --test tools/tests/block-content-copy.test.mjs` bị `spawn EPERM`; không coi là test logic fail hoặc PASS. Kết quả16/16 trong §18 là report phiên coding trước, không phải lần review chạy lại thành công.
- R2 đã đối chiếu selector implementation local WP7.1; chưa tái hiện thao tác UI onsite. R4 được chứng minh bởi source và test hiện có; chưa có browser rich-text round-trip evidence.

## 20. Thứ tự và thiết kế repair

### G0 — Khóa baseline và tạo regression trước khi sửa

1. Đọc protocol, §11–14/17/19–24 và `.context/PITFALLS.md` AP-08–10. Ghi HEAD/working tree; giữ nguyên build,056,GLOBAL/MILESTONES edits không thuộc repair. Không reset/clean hoặc stage toàn repo.
2. Giữ16 tests cũ trừ expectation span sai phải thay có lý do. Thêm tests gọi đúng Paste controller/transport bằng dependency seams nhỏ, không sao chép logic guard vào test. Mocks chỉ mô phỏng clipboard/store/lookup; gọi production validator/controller thực.
3. Chứng minh tests R1–R4 thất bại trên baseline hoặc lưu actual/expected nếu harness runtime chưa chạy được. Ghi tool/environment blocker chính xác, không retry command treo/timeout và không thay expected để tests xanh.
4. Runtime/API preflight: local WP7.1 là evidence của local, onsite cần exact version riêng; `@wordpress/scripts ^30.6.0` không phải version Gutenberg. Không dùng API private hoặc âm thầm tăng minimum WP6.5. Nếu API public cần dùng thiếu trên runtime mục tiêu, báo dependency và giữ action fail-closed với lý do; không ship đường Paste bỏ guard.

### G1 — Một contract validate source, áp dụng cho mọi ingress (R1)

- Thêm validator cây dùng chung trong module block-content (có thể `validation.ts`), trả discriminated result/code/path; không side effect. Kiểm exact registered names/adapter/parent-child contract, invalid node, bound metadata, entity/controller references và limits trước khi projection bỏ metadata.
- `parseDocument()` phải kiểm trên parsed blocks còn metadata/isValid, rồi mới chuyển sang TreeBlock/projection. Nếu `toTree()` bỏ `isValid`/metadata kiểm tra cần thiết thì đổi contract để validate trước, không cố tái dựng thông tin đã mất. Parser success/registered name không đồng nghĩa source an toàn.
- Dùng contract tương ứng cho Copy từ editor và Paste từ native Copy. Bound node ở bất kỳ depth reject cả root; không strip bindings rồi coi nguồn hợp lệ. Full native Copy hợp lệ vẫn được lấy content allowlist; unknown style keys thông thường không tự làm payload invalid.
- `buildPatches()` không được là bypass: validate cấu trúc/allowlist/limits của input mà nó chấp nhận. Entity ownership từ store chỉ có thể kiểm trên editor state; metadata/entity references từ payload phải kiểm tại transport, không giả lập clipboard có clientId/store ownership.
- Toàn bộ source validation hoàn thành trước taxonomy lookup và trước mọi attribute write. Lỗi trả English+i18n notice phù hợp; không log payload/URL.

### G2 — Guard đầy đủ quyền, mode và ownership (R2)

- Viết hàm guard editor tree riêng, duyệt root, toàn bộ ancestors và descendants liên quan. Kiểm các public selectors đã audit: existence, canEditBlock, getBlockEditingMode, areInnerBlocksControlled; kiểm binding/invalid/registered state liên quan. Parent move/remove lock riêng vẫn cho content edit nếu public content permissions cho phép.
- Policy bảo thủ theo plan gốc: chỉ editing mode đã audit là writable; `disabled` reject, không tự mở contentOnly hoặc bypass controlled entities. Không coi canEditBlock là tổng hợp mọi permission/mode/ownership.
- Dùng guard cho availability và chạy lại sau tất cả await ngay trước mutation; cached enabled state không cho phép ghi. Capture snapshot content/shape và mapping clientIds; nếu target bị thay/xóa/reparent hoặc permission/ownership thay đổi thì abort. Không dùng global selection mù quáng cho menu List View có target khác selection; kiểm menu target đúng hợp đồng runtime.
- Style-only change giữ giá trị mới nhất; content change abort. Không cầm attrs đầy đủ cũ để restore sau await. Copy cũng áp dụng eligibility/ownership policy đã chốt, không biến readSource thành đường vòng qua scope forbidden.
- Zero mutations trên mọi rejection; giữ một public multi-block action cho paste thành công. Không partial write, không private history flags hoặc rollback bằng replaceBlocks.

### G3 — Limits trước mọi recursion không giới hạn (R3)

- Kiểm text limit trước parse; giữ semantics hiện hành của hằng số text limit và ghi rõ byte hay JS string units trong runbook. Không claim byte limit nếu chỉ đo string.length; không đổi threshold âm thầm trong repair.
- Sau parse, chạy iterative hoặc bounded traversal kiểm <=200 nodes và depth<=20 (root depth1), stop ngay ở node201/depth21. Không countNodes/treeDepth/toTree recurse toàn bộ rồi mới reject. Parser nội bộ vẫn có chi phí riêng; guard này không được mô tả là chặn mọi parser DoS.
- Dùng bounded validation trước Copy projection, trước Paste mapping/signature/shape recursion và trong planner public entry. Cùng giá trị giới hạn ở một owner, không duplicate số trong controller/test.
- Chặn source hoặc destination vượt giới hạn trước taxonomy requests và dispatch; trả notice size/limit khác mismatch. Kiểm đầu vào và sau awaited state refresh vì cây đích có thể lớn lên trong thời gian chờ.

### G4 — Rich-text policy đúng spec (R4)

- Bỏ `scanInlineMarkup`/regex attribute parser làm HTML sanitizer. Audit public `@wordpress/rich-text` và HTML APIs thực tế: local `rich-text.js` có create/toHTMLString/removeFormat; sự tồn tại export chưa chứng minh đủ policy hoặc minimum compatibility. Không thêm dependency package để né audit; imports WordPress externals theo pipeline hiện hành.
- Pipeline: parse HTML bằng API public phù hợp → nhận diện supported semantic formats/link và presentation-only wrappers → loại font/color/class/style/data/event presentation → serialize semantic content. Không dùng regex strip HTML/innerHTML injection, không mutate source hoặc registry formats toàn editor.
- Span chỉ mang presentation được unwrap và giữ children/text/order; nested strong/em/link/br phải còn ý nghĩa. Unsupported meaningful nodes như embed/image trong inline, binding semantics hoặc construct không giữ được thì reject toàn payload. Không unwrap mọi unknown node và làm mất dữ liệu âm thầm.
- Kiểm URLs sau HTML entity decoding theo parser; chỉ safe scheme/relative policies đã audit, safe target/rel; giữ ký tự `<`, `&`, dấu nháy, Unicode và line breaks đúng nghĩa. Không double encode hoặc nối words khi flatten heading/br. Không tự thay policy của PHP renderer.
- Với fixture màu/font, cả Copy projection → serialize → parse → Paste và native Copy → Paste đều giữ semantic content, không source style. Nếu API public chưa đủ chứng minh policy, ghi technical blocker cụ thể; không đổi requirement thành reject mọi styled span và coi xong.

### G5 — Review tích hợp và cập nhật evidence

- Test production call path controller/transport + validator, không chỉ helper. Mỗi reject assert mutation count0, taxonomy không chạy nếu payload invalid, target attrs/history không đổi; mỗi success assert chỉ allowlisted diff, đúng target, một mutation.
- Actual Gutenberg parser/serializer fixtures chạy trong môi trường có registered plugin/core block types; test stubs không thay round-trip thật. Core schema defaults/empty overwrite, image link coupling, same type/shape, mixed semantic spans phải kiểm lại.
- Human chạy build/lint theo runbook; agent không chạy qua tool. Onsite T01–T11 + R01–R04 bên dưới, prior edit → paste → Undo/Redo và Save/reopen/frontend. Không deploy/publish hoặc coi source repair là runtime PASS.
- Khi implementation được thực hiện: ghi source commit, tests/environment/limitations theo từng ID; chỉ commit files repair được giao, không build người khác. Lượt lập plan này không commit source và không cấp release approval.

## 21. Files và thứ tự thay đổi dự kiến

| File | Mục tiêu |
|---|---|
| `src/core-controls/block-content/types.ts` | Kết quả validation/code/path, giữ raw metadata/validity cần thiết |
| `src/core-controls/block-content/validation.ts` (nếu tách) | Bounded source/tree validation, adapter/shape contract dùng chung |
| `src/core-controls/block-content/transport.ts` | Raw parsed-node validation trước toTree/projection; actual round-trip |
| `src/core-controls/block-content/plan.ts` | Enforce input contract/limits, không bypass qua buildPatches; giữ empty/no-op/style semantics |
| `src/core-controls/block-content/controller.ts` | Guard root/ancestors/descendants, after-await revalidation trước single dispatch |
| `src/core-controls/block-content/fields.ts` hoặc module rich-text nhỏ | Public parser/rich-text pipeline, bỏ scanner tự viết; span presentation policy |
| `src/core-controls/block-content/index.tsx` | Chỉ sửa nếu cần nối availability/error contract; giữ menu ⋮ và existing gate |
| `tools/tests/block-content-copy.test.mjs` + focused integration harness nếu cần | Regression model + production controller/transport paths, boundary/mixed formatting |
| Runbook / plan057 / module context | Evidence/status đúng từng R-ID và acceptance gốc |

Không đổi attributes/block.json/save markup, query engine, PHP renderers, namespace, options/default gate, frontend assets/CSS, theme hoặc utility clipboard cũ để vá những lỗi trên.

## 22. Regression matrix bắt buộc

| ID | Fixture và thao tác | Expected / evidence |
|---|---|---|
| R01a / CCP-R1 | Native Copy Slide có paragraph bound ở depth>=2; Copy content từ cây này | Cả hai reject trước write; attrs diff rỗng; không mất binding nguồn |
| R01b / CCP-R1 | Entity/unknown/invalid nested node; hợp lệ nhưng source style khác target | Forbidden reject toàn bộ; case valid chỉ content đổi; không false reject vì style |
| R02a / CCP-R2 | Root default + child disabled/controlled; ancestor disabled/controlled; child content lock | Zero mutation cho từng case; kiểm mode/ownership thực trên version onsite |
| R02b / CCP-R2 | Trong clipboard/taxonomy await, đổi child mode/ownership, xóa/thay node hoặc reparent target | Abort và notice; không viết vào node mới; style-only update giữ |
| R02c / CCP-R2 | Chỉ lock move/remove; List View menu target khác global selection | Vẫn edit content nếu API cho phép; đúng menu target hoặc abort rõ |
| R03a / CCP-R3 | Source/dest 200 và201 nodes; depth20 và21; root depth1 | Trong giới hạn hợp lệ; vượt reject trước unbounded traversal/lookup/write; Copy và Paste cùng policy |
| R03b / CCP-R3 | Text đúng limit và vượt1 unit; cây lớn thêm sau await | Size/limit notice, zero write; ghi rõ unit đo; không log clipboard |
| R04a / CCP-R4 | Plain, colored/font spans, nested spans + strong/em/a/br, Unicode/entities | Giữ nghĩa/text/order/link; không font/color/class/style; Copy content lẫn native Copy |
| R04b / CCP-R4 | Unsafe/encoded URL, malformed/unsupported meaningful HTML | Reject toàn root; không source-style leak; không silent data loss |
| R05 / CCP-TECH04/06 | Real serialize/parse; empty/default/zero; content identical; prior edit rồi multi-node paste | Empty overwrite, no-op0mutation/history, một Undo/Redo giữ edit trước, giữ style latest |
| R06 / CCP-UI02 | Save draft/reopen rồi preview desktop/mobile cùng fixture R04 | Text/link/media đúng, layout/style đích giữ, không recovery prompt; screenshot/console evidence |

Harness unit/mock chỉ chứng minh logic/call ordering; R05 history và R06 phải có runtime evidence. Nếu thiếu API/site fixture, ghi Chờ kiểm chứng hoặc blocker, không PASS bằng test source grep.

## 23. Acceptance và tiêu chí đóng repair

- CCP-R1–R4 hiện **FAIL source**, repair **Chưa làm**. Mapping: R1/R2→CCP-TECH05/06; R3→CCP-TECH04/05; R4→CCP-TECH04 và Editor UX; R05/R06 giữ CCP-UX03/06, CCP-UI02. Không xóa hoặc đổi PASS lịch sử của scope khác.
- Đóng source repair khi regression ban đầu fail và sau sửa pass, production ingress/controller path được kiểm, self-review không còn bypass; source commit và evidence ledger được ghi. Vẫn ghi runtime Chờ kiểm chứng nếu human chưa test.
- Nghiệm thu đầy đủ khi human build/lint + onsite evidence đủ theo IDs. Không tự đóng1.3.19 hoặc nghiệm thu toàn Content Actions chỉ vì bốn finding được sửa.

## 24. Pitfall và bàn giao

Agent tiếp theo phải đọc `.context/PITFALLS.md` AP-08–10 trước repair. Không viết lại feature từ đầu theo prompt implementation cũ; sửa baseline `0a53a2d` theo G0→G5, giữ policies057§11–14/17. User request hiện tại là **plan + pitfall**, không phải lệnh sửa source trong lượt docs này. Khi được giao repair, dùng scope/version authorization hiện có, không hỏi lại quyết định sản phẩm đã chốt.

## 25. Repair execution — human start2026-11-05

Human tiếp tục: **“Thực hiện luôn theo plan”**. §19–24 giữ làm spec/history; các câu chỉ docs/chưa sửa source là checkpoint trước start này. Giữ current1.3.19/no bump. Source sửa trên `0a53a2d`, chưa build/lint/onsite/release.

### Source và evidence

| ID | Source repair | Evidence và giới hạn |
|---|---|---|
| CCP-R1 | `validation.ts` kiểm raw bindings/isValid/allowed parent-child/registration trước `toTree`; transport, Copy và planner đều áp dụng contract | Controller test native bound source reject trước lookup/write; vẫn cần native Gutenberg parser fixture onsite |
| CCP-R2 | `editor-guard.ts` kiểm root/ancestors/descendants canEdit/mode/controlled/bound/valid; Copy/Paste cùng guard; snapshot parent chain + child clientIds và content, recheck sau await | Test ancestor/child disabled/controlled/locked, state changes trong cả clipboard/taxonomy await, replacement/reparent abort; style latest được giữ. Runtime selectors/Undo vẫn chờ onsite |
| CCP-R3 | Iterative bounded validation trước projection/mapping/shape recursion; planner kiểm source và target; text guard trước parse | Boundary200/201nodes,depth20/21; cây tăng sau await abort; text1048576 UTF-16 code units, không claim bytes. Không claim bảo vệ chi phí parser nội bộ |
| CCP-R4 | `inline-html.ts` dùng public browser DOMParser + DOM construction/serialization, bỏ scanner/regex HTML; styled span unwrap, semantic/link/br giữ; unknown meaningful nodes/bound markers/comments/head content reject | JSDOM20.0.3 từ dependency tree hiện có: mixed Unicode/entities, encoded unsafe links, Copy/Paste style stripping, heading newline. Không thêm dependency hoặc mutate global WP format registry |

**HTML API rationale:** chọn public browser HTML API thay phụ thuộc global WordPress registered format types; parser không được coi là sanitizer. Code dựng cây mới chỉ chứa semantic tags/text/safe attrs rồi đọc serialization; không insert raw parsed nodes vào editor, không gán innerHTML nguồn. [DOMParser docs](https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString) mô tả separate document, scripts inert nhưng có thể có resource requests và không an toàn nếu chuyển raw nodes vào live document; [innerHTML getter](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) chỉ serialize descendants. Không claim parse không network hoặc tự loại XSS. Missing DOMParser/Trusted Types refusal trả failure. API browser độc lập WordPress major, không bump Requires WP6.5; actual onsite/browser/CSP vẫn cần kiểm.

Browser HTML parser canonicalizes benign omitted inline closing tags (`<strong>open` → `<strong>open</strong>`); không giữ scanner cũ chỉ để bắt unbalanced string. Unsupported meaningful DOM constructs vẫn reject. `<br>` và `<br />` là cùng break; tests kiểm semantics, không khóa spelling serializer cũ. Điều này làm rõ “malformed” R04: không nhận unsafe/unsupported meaning, không tự implement strict HTML grammar validator. Heading flatten dùng decoded text, br→newline, tránh nối words/double encode.

### Tests đã chạy

- G0: thêm regression vào test model, chạy trực tiếp `node tools/tests/block-content-copy.test.mjs`: **15/18 PASS,3 FAIL đúng baseline** (bound source, Paste limits, styled span). Đây là evidence trước repair.
- Lần tiếp theo của model test sau thay parser mất hơn thời gian quan sát không output; agent gửi stop theo protocol, tool trả process đã kết thúc **14/18 PASS,4 FAIL**: root failure code, missing error detail, br spelling, comment ngoài body. Source/test sửa bốn chỗ này; **không retry command này**, bàn giao human chạy lại. Không claim18/18 PASS.
- `node tools/tests/block-content-controller.test.mjs`: **11/11 PASS** sau sửa. Chạy production validator/transport/controller với WP store, Gutenberg parse/serialize và clipboard **mocked**; HTML DOMParser dùng JSDOM thật. Bao gồm raw forbidden source, ancestor/descendant guard, state race/reparent/replacement, bounded limits, one mutation/no-op/empty/multi-node/style latest, styled span semantic/link/entity và RichTextData cases. Không chứng minh browser clipboard, real Gutenberg round-trip hoặc actual Undo.
- TypeScript `transpileModule` syntax check tất cả11 TS/TSX block-content files PASS trước vòng test cuối; không phải full typecheck/build/lint. Không chạy build/lint/WSL.

### Status bàn giao

R1–R4: **Đã có source repair**, regression controller PASS phạm vi mock nêu trên; model suite chạy lại, real Gutenberg round-trip/permissions/Undo/menu/Save-reopen và frontend vẫn **Chờ kiểm chứng**. Baseline FAIL record không xóa; không đổi toàn acceptance thành PASS. G5 source self-review có evidence; runtime acceptance chưa đóng.

Human chạy model test (Node có `stripTypeScriptTypes`, như Node24 phiên coding), build/lint theo runbook, rồi T01–T11 và R01–R06 trên draft/private fixtures. Gửi exact WP/Gutenberg/browser versions, edit/preview URLs, output và attr/video evidence. Không publish/deploy tự động. Commit prefix theo scope authorization057§17: `feature patch: repair block content actions validation`.

Compatibility self-review: local WP7.1 `blocks.js:2040–2057` cho thấy core rich-text attrs là `RichTextData`, không luôn string. Transport dùng public export `RichTextData.toHTMLString()` sau raw validation, không coerce arbitrary objects. Runtime cũ chưa có export giữ đường string; không tăng minimum WP. Regression thứ11 kiểm production transport/controller bằng class mock; actual core schema round-trip và asset dependency wp-rich-text vẫn cần human build/onsite.

## 26. Human model-test evidence — 2026-11-06

Human gửi output chạy model suite sau commit repair `8ee4a3f`: Node **24.16.0**, npm **11.13.0**; **18 tests /18 PASS /0 fail /0 skipped**, duration473.370251ms. Bao gồm ba regression baseline (binding nguồn, Paste limits, styled span) và các assertions root/detail/br/comments đã sửa. `stripTypeScriptTypes` chỉ báo ExperimentalWarning trong output; không có test failure.

Đã đáp ứng phần “human chạy lại model suite” của§25. Đây là human-reported model/JSDOM evidence, agent không rerun và không suy actual clipboard/Gutenberg parser/history behavior từ nó. Controller11/11 mocked evidence vẫn riêng. CCP-R1–R4 giữ Đã có source repair + logic tests PASS trong phạm vi này; build/lint/typecheck, real parser round-trip, menu/permissions/Undo/Redo/Save/reopen và frontend **Chờ kiểm chứng**. Không chuyển milestone, bump metadata hoặc nghiệm thu/release.

## 27. Product documentation / sale point — 2026-11-06

Human xác nhận feature này là một trong các sale points, yêu cầu doc và tổng hợp trước, trình bày sau vào giai đoạn marketplace. Đã lưu brief SP-01 trong [marketplace selling points register](../../docs/product/marketplace-selling-points.md): problem/value, workflow, supported types/shape, scope limits, evidence và các bước còn cần trước public claim. Đây là tổng hợp nội bộ, chưa phải listing/copy/visual marketing hoặc release approval. Technical discussions/spec vẫn cập nhật tại057; register dẫn về đây, không là spec song song. Không đổi current1.3.19 hoặc launch gate sau1.5.x; chưa chọn marketplace/date/public version.

## 28. Menu placement / indentation feedback — 2026-11-06 (docs only)

Human yêu cầu ghi nhận và phản biện, **chưa code**. Screenshot `codex-clipboard-2154b6a1-2735-47d3-b13b-41085e921e07.png` trong chat: heading CONTENT ACTIONS và hai actions thụt vào so với native items; nhóm xuất hiện sau Hide, trước Create pattern. Không suy build/commit hoặc version onsite từ ảnh; phiên bản local bên dưới chỉ là source đối chiếu.

### State delta và evidence

- State A mong muốn: hai action cùng cột chữ, cùng bề rộng vùng tương tác với native items; một nhóm riêng giữa Add note và Group, separator trên/dưới.
- State B quan sát: nhãn/actions có thêm inset, nằm trong đoạn Group / Lock / Rename / Hide. Vị trí này làm yếu liên hệ với nhóm Copy / Cut / Duplicate và có thể bị hiểu là cấp con.
- Plugin `src/core-controls/block-content/index.tsx`, `ContentActionsMenuItems`: trả một `MenuGroup` có label, bên trong Fill `BlockSettingsMenuControls`.
- Local WordPress7.1 `D:/Github/minhhaifish/wp-includes/js/dist/block-editor.js:58344–58380`: Slot đã render một `MenuGroup`, thứ tự ConvertToGroup → Lock → Rename → Visibility → fills → BlockModeToggle. Đây là bằng chứng nested group và vị trí fills trong bản local; **nguyên nhân CSS inset còn cần DOM/computed styles onsite để prove**. Không khẳng định thiếu một prop hoặc đổi priority là chuyển được lên trước Group; source đường hiện tại đặt toàn bộ fills sau Visibility.

### Phản biện đề xuất của human

Đề xuất vị trí sau Add note / trước Group hợp lý về phân nhóm: kết thúc thao tác nội dung rồi mới đến tổ chức/cấu trúc block. Hai separators làm ranh giới dễ đọc và tên Marine Blocks giúp phân biệt với native Copy. Đây là **UX target đề xuất**, chưa phải cam kết khả thi qua public API đang dùng.

Điểm cần cân nhắc:

1. Heading `Content action (Marine blocks)` dài, dễ xuống dòng trong menu hẹp; dùng plural `Content actions` cho hai lệnh, brand viết đúng `Marine Blocks`. Đề xuất heading ngắn `Marine Blocks`, giữ hai action rõ nghĩa bên dưới; phương án đầy đủ `Content actions (Marine Blocks)` chỉ chọn nếu kiểm menu hẹp vẫn gọn.
2. Native Copy đã ở trên; `Copy content` cần phân biệt bằng grouping và phản hồi thành công/error. Không thêm một hàng submenu chỉ để giảm chiều cao: tăng bước thao tác. Heading là nhãn không tương tác, không nhận keyboard focus.
3. Không cố định vị trí bằng CSS order, dịch chuyển DOM, patch core hoặc dựa vào chữ Add note/Group: có thể lệch keyboard order, biến mất theo quyền/mode/version, hoặc lỗi bản dịch. Trước implementation phải nghiên cứu public extension point đúng runtime/versions hỗ trợ. Nếu không có cách an toàn, trình bày giới hạn và phương án giữ insertion point native nhưng sửa alignment; không âm thầm coi đó là đạt target trước Group.
4. Separator/spacing có đúng một owner; tránh lồng thêm MenuGroup chỉ để có label/separator. Sửa alignment phải giữ toàn bộ chiều rộng hit area/focus ring và thứ tự focus theo thứ tự nhìn thấy. Chưa chọn implementation cụ thể trong lượt này.

Đề xuất hình thức (chưa human duyệt):

```text
Add note
────────────────────────────
MARINE BLOCKS                 ← heading, không click
Copy content
Paste content only
────────────────────────────
Group
```

### Acceptance / follow-up

| ID | Nhóm | Mong đợi / hiện trạng / việc tiếp theo | Cách kiểm / evidence | Status |
|---|---|---|---|---|
| CCP-MENU01 | Editor UX | Nhãn và hai actions không inset như cấp con; hiện screenshot lệch | DOM/computed padding của native item và plugin item; ảnh cùng viewport, focus ring/hit area | FAIL theo human screenshot; chưa sửa |
| CCP-MENU02 | Editor UX + Technical | Nhóm độc lập sau nhóm nội dung, trước Group là target; hiện Fill sau Hide | Research extension API theo actual WP/Gutenberg versions; kiểm mode/quyền và native items ẩn; ghi rõ khả thi/giới hạn trước coding | Chưa làm research đầy đủ; chưa duyệt cách triển khai |
| CCP-MENU03 | Editor UX + Technical | Heading ngắn, brand rõ, separators không trùng; keyboard/touch hoạt động | Menu hẹp, Tab/arrows/Enter/Escape, label không focus, order nhìn thấy trùng focus; gate off không để separator rỗng | Đề xuất; chờ chốt wording và runtime kiểm |

Block UI/frontend: N/A vì phản hồi này chỉ liên quan editor menu. Không đổi content policies, clipboard/validation/Undo contract, milestone hoặc evidence logic tests. Không đánh dấu toàn Content Actions PASS; không sửa source/CSS/build, không commit trong lượt ghi nhận này.

## 29. Human decision — menu position/style; shortcut deferred (2026-11-06)

Human yêu cầu lưu quyết định và lên kế hoạch làm, chưa yêu cầu triển khai source. Phần “chưa human duyệt” tại§28 là checkpoint trước quyết định này. Giữ current **V1 /1.3.19**, sửa presentation của Content Actions hiện có; không bump metadata, đổi namespace, mở right-click058 hoặc public launch.

### Quyết định UX được lưu

- Một nhóm độc lập trong menu ⋮ từng block: **sau nhóm thao tác nội dung kết thúc bằng Add note, trước nhóm tổ chức block bắt đầu bằng Group**. Đây là vị trí theo nhóm ngữ nghĩa, không tìm DOM bằng chuỗi tiếng Anh. Nếu Add note/Group không hiện do version/quyền/mode, không tạo native item giả; cần kiểm ranh giới nhóm tương đương qua API.
- Heading **Marine Blocks** (đúng hoa/thường, không ép uppercase), chữ **#075985**, nền **#F0F9FF**, font **12px**, weight **600**. Đây là specification cho normal color mode, không phải màu mới cho toàn plugin.
- Chỉ hàng heading có nền; hai action `Copy content` / `Paste content only` giữ màu, hover, disabled, focus và hit area native. Cùng cột chữ với native menu items; heading không lồng như submenu, không click, không hover, không nhận focus. Không thêm icon chưa có thiết kế, pill, shadow hoặc vạch màu trạng thái chọn.
- Separator trên/dưới nhóm, mỗi ranh giới đúng một separator; padding ngang theo native menu của runtime, không hard-code thêm inset lồng nhau. Giữ chiều rộng menu native; heading cho phép wrap khi zoom/text scaling thay vì truncate/overflow. Trong forced-colors dùng system colors/border nếu cần; nhận diện vẫn dựa vào text và separators, không chỉ màu.
- **Shortcut Deferred**: chưa chọn phím, chưa có target version; giữ menu-only. Không đăng ký hoặc hiển thị `Ctrl+Shift+C/V`, không bắt `keydown`/ghi đè shortcut trình duyệt. Hai tổ hợp bị tranh chấp với Inspect/plain-text paste; cần audit OS/browser/editor và focus scope nếu mở lại. Đây là defer độc lập, không chặn menu repair.

```text
Add note
────────────────────────────
Marine Blocks                ← chữ xanh đậm / nền xanh rất nhạt
Copy content                 ← native item
Paste content only           ← native item
────────────────────────────
Group
```

### Giới hạn kỹ thuật giữ nguyên

Vị trí UX đã chốt không chứng minh API hiện tại hỗ trợ vị trí đó. Local WP7.1 Slot đặt fills sau Visibility (§28). [SlotFill documentation](https://developer.wordpress.org/block-editor/reference-guides/components/slot-fill/) giải thích render vào Slot; tài liệu tổng quát này không là bằng chứng có insertion point trước Group trong mọi version. G0 bên dưới phải đối chiếu actual version/export/source; không dùng priority giữa các fills để suy có thể vượt native items nằm trước Slot.

Không patch WordPress/GeneratePress, private/unstable APIs, monkey patch exports, MutationObserver di chuyển item, CSS order/absolute positioning hoặc dựng lại toàn bộ native menu. Không đổi min WP hoặc thêm dependency chỉ để đạt vị trí. Nếu public API không có chỗ chèn phù hợp, ghi bằng chứng và đề xuất fallback giữ native insertion point; **không tự thay quyết định vị trí hay đánh dấu CCP-MENU02 PASS**. Chỉ phần alignment/style có thể chuẩn bị độc lập; báo rõ phần vị trí còn bị chặn khi bàn giao.

### Kế hoạch triển khai

| Bước | Công việc / file dự kiến | Kết quả cần có / điều kiện đi tiếp |
|---|---|---|
| G0 — preflight | Đọc§28–29; kiểm actual WP/Gutenberg/browser versions, package/tooling và source menu/Slot. Đối chiếu API public đúng phiên bản; kiểm toolbar/List View menu target | Bảng extension point → vị trí thật → version hỗ trợ → props target/onClose → giới hạn. Chốt khả thi trước Group bằng evidence; nếu không khả thi, báo giới hạn và phương án cụ thể trước sửa vị trí |
| G1 — baseline DOM | Draft fixture, gate on, mở menu của Product/Post Collection + Slider/Slide. So native item và custom item: ancestor groups, padding/margin, bounding rect, focus order và computed styles | Chứng minh nguyên nhân inset, không chỉ suy từ screenshot. Lưu screenshot + DOM/style notes, build/URL/versions; không cần tắt plugin/theme production |
| G2 — menu composition | `src/core-controls/block-content/index.tsx`: sửa group/heading composition và nối extension point public nếu G0 chứng minh được; giữ đúng menu target và onClose | Một nhóm, một heading, đúng hai actions; không nested inset, không duplicate Fill, không thêm submenu. Giữ gate/default false, support/selection/availability/busy guards; không sửa clipboard/controller để làm UI |
| G3 — scoped editor style | Tìm editor stylesheet/entry hiện có bằng import graph trước sửa; dùng class `skvn-…` riêng cho heading/group theo identity source hiện hành, CSS chỉ editor | Heading theo màu/type ở trên, native action states giữ; separator/padding một owner, không selector global `.components-menu-group`, không `!important` để che nesting sai. Không enqueue frontend/plugin bundle mới cho feature nhỏ; CSS không phụ thuộc theme/WindPress |
| G4 — kiểm và regression | Review diff/import scope; chạy hai test suites content model/controller khi thay wiring có nguy cơ ảnh hưởng behavior; human chạy build/lint. Theo runbook§8 cho menu, focus, colors, target, gate, clipboard/Undo | Logic PASS trong phạm vi test riêng; runtime PASS chỉ khi có build/URL/version/ảnh/video. Nếu chỉ sửa markup/CSS, không tạo unit tests snapshot màu/padding chỉ để mirror implementation |
| G5 — docs / handoff | Cập nhật CCP-MENU01–05, runbook evidence, module pointer; khi được giao commit chỉ stage file scope này | Báo source đã sửa / vị trí thực tế / còn thiếu evidence. Không đóng milestone/release, không commit build hay056 đang ngoài scope. Prefix dự kiến khi được giao implementation+commit: `feature patch: refine content actions menu` |

Files ngoài scope: `fields.ts`, `plan.ts`, `transport.ts`, `validation.ts`, `controller.ts` và query/render/block.json/save/frontend; chỉ mở lại nếu phát hiện regression riêng có evidence. Không thay projection/allowlist/empty overwrite/exact tree/permissions/atomic Undo contract.

### Acceptance bổ sung và trạng thái

| ID | Nhóm | Hành vi mong đợi | Hiện trạng / việc cần sửa | Cách kiểm / evidence |
|---|---|---|---|---|
| CCP-MENU01 | Editor UX | Hai actions cùng cột chữ/hit area native, không trông như cấp con | FAIL screenshot§28; chưa sửa source | So DOM/computed inset + screenshot trước/sau; focus ring không bị cắt |
| CCP-MENU02 | Editor UX + Technical | Nhóm sau nội dung/trước Group theo quyết định | UX đã duyệt; technical feasibility Chưa làm G0, source chưa sửa | API/version evidence + ảnh thứ tự thật; native item ẩn không làm nhóm trôi hoặc để separator rỗng |
| CCP-MENU03 | Editor UX | Marine Blocks màu/nền/type đã chốt; separator rõ; không có heading tương tác | Design đã duyệt, source Chưa làm | Normal/forced-colors, 200% zoom, viewport390px, mouse/touch/keyboard; không overflow |
| CCP-MENU04 | Technical | Không đổi native actions, menu target, availability, clipboard/Undo; không ảnh hưởng menu plugin khác | Contract giữ; kiểm sau repair | Gate off/reload; unsupported/multi-select; root locked/disabled; List View target khác selection; copy/paste/no-op/Undo smoke |
| CCP-MENU05 | Technical | Shortcut chưa được triển khai hoặc quảng bá | Deferred theo human; không có source mới | Diff không thêm shortcut registration/keydown/menu shortcut hints; Ctrl+C/V và browser shortcuts giữ hành vi hiện có |

Block UI/frontend N/A: không đổi output. Editor UX và Technical cần evidence riêng; không suy menu PASS từ model18/18 hoặc controller11/11. Chỉ lập plan trong lượt này, không chạy build/lint/tests hoặc sửa source.

## 30. Menu repair execution / placement feasibility — 2026-11-06

Human yêu cầu **tiến hành** theo§29, current1.3.19, không bump. Đây là execution mới hơn checkpoint planning cuối§29. Không commit trong lượt này; giữ build artifacts và056 ngoài scope.

### G0 — research và giới hạn

Local source: `D:/Github/minhhaifish/wp-includes/version.php:19` = WP7.1; Gutenberg plugin không có trong inventory trước đó. Actual onsite WP/Gutenberg/browser/build chưa được cung cấp. `package.json` dùng `@wordpress/scripts ^30.6.0`, không pin block-editor runtime; WordPress cung cấp public exports.

| Extension point | Vị trí / props / giới hạn kiểm được |
|---|---|
| `BlockSettingsMenuControls` public | Local `wp-includes/js/dist/block-editor.js:58305–58390`: props `selectedClientIds`, `selectedBlocks`, `onClose`; Slot tạo MenuGroup, render ConvertToGroup → Lock → Rename → Visibility → fills → BlockModeToggle. Không có prop insertion trước Group trong đường này. Giữ menu clientIds binding, Toolbar/List View target vẫn cần runtime kiểm. |
| `PluginBlockSettingsMenuItem` public | Local `wp-includes/js/dist/editor.js:83682–83704`: delegate về cùng `BlockSettingsMenuControls`, không mở insertion point khác. [Official reference](https://developer.wordpress.org/block-editor/reference-guides/slotfills/plugin-block-settings-menu-item/) mô tả More Options, không cam kết trước Group. |
| First-item / note slots | Local source có `__unstable…`/internal slots; không thuộc API public được duyệt. Không dùng để vượt Slot. |
| Fill priority / filters | Priority giữa fills không vượt native items hard-coded trước `fills`. Chưa tìm thấy public insertion/filter cho ranh giới nội dung → Group trong đường local đã kiểm; không suy mọi future WP đều không hỗ trợ. |

[Official export reference](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#blocksettingsmenucontrols) xác nhận API; local WP7.1 source là evidence đúng version cho ordering, không dùng docs HEAD để chứng minh mọi version. Không đổi minWP6.5; runtime các bản hỗ trợ còn chờ kiểm.

### G1–G3 — source delta / implementation

- Screenshot§28 cho thấy thêm inset. Local `components.js:45205–45243` MenuGroup render `.components-menu-group`; `css/dist/components/style.css:1551–1556` áp padding8px mỗi group trong dropdown. Plugin lồng group thứ hai trong Slot group, tạo thêm lớp padding. Đây là source explanation phù hợp ảnh; chưa có computed DOM onsite để chứng minh toàn cascade.
- `src/core-controls/block-content/index.tsx`: bỏ inner MenuGroup, thay div `role=group`, i18n `aria-label=Marine Blocks`; heading noninteractive `aria-hidden` vì group đã có accessible name. Hai MenuItem giữ disabled/info/onClick/handlers, không override action padding/width/focus/hover hoặc target/guards.
- Asset audit: `src/index.ts` → core-controls → block-content. Shared style-index còn chứa block styles, không phải owner chrome-only phù hợp. Dùng scoped `wp_add_inline_style` trong existing editor enqueue callback `modules/core-control/core-control.php`, handle riêng dependency `wp-components`, chỉ gate `block_clipboard` on. Không thêm file/runtime require/include/bundle/frontend asset.
- CSS chỉ `.skvn-block-content-actions…`: không thêm inset ngang; heading#075985/#F0F9FF,12px600, wrap, forced-colors Canvas/CanvasText. Border/spacing nội bộ chỉ khi có sibling tương ứng; outer MenuGroup giữ separator ngoài. Không global override/!important/viewport units/overflow masking/DOM reordering.
- **Không chuyển vị trí**: vẫn Slot native sau Hide/Visibility trên localWP7.1. Giữ behavior hiện hữu trong lúc sửa phần độc lập, không thay quyết định trước Group bằng fallback được coi đã approve.

### G4–G5 — verification / acceptance

TSX `transpileModule` syntax **PASS**; không full typecheck/build. Không chạy build/PHP lint theo AGENTS; human chạy runbook§7. Không thay handlers/controller/guards nên không rerun model/controller suites; không thêm snapshot tests mirror CSS. Runbook§8 có DOM/geometry/focus/normal/forced-colors/zoom/narrow/gate/ListView/separator/clipboard smoke. Chưa URL/DOM/browser evidence sau sửa, không onsite PASS.

| ID | Trạng thái hiện hành |
|---|---|
| CCP-MENU01 | Đã có source sửa nesting/inset; giữ baseline FAIL. Chờ computed styles + x/width native/custom, focus và ảnh sau build. |
| CCP-MENU02 | Chưa đạt vị trí; public Slot localWP7.1 không hỗ trợ target đã chốt. Giữ open, cần human quyết fallback hoặc chờ API phù hợp. |
| CCP-MENU03 | Đã có source heading/style/separators; Chờ normal/forced-colors/390px/200%zoom/keyboard/touch. |
| CCP-MENU04 | Guards/target/controller không sửa; Chờ regression onsite sau wrapper/style/build. |
| CCP-MENU05 | Shortcut Deferred; diff không thêm keydown/registration/hint. |

Block UI N/A (không đổi frontend). Editor UX/Technical chưa nghiệm thu. Human gửi build/lint output, exact versions/edit URL, full menu screenshot và keyboard/DOM evidence theo§8; agent tiếp tục từ failure cụ thể. Không deploy/commit/bump metadata.

### Decision memo — vị trí menu còn mở

1. **Vấn đề:** public extension point đã kiểm trên localWP7.1 không chèn được trước Group theo UX đã duyệt.
2. **Phương án:** A — chấp nhận native sau Visibility với alignment/style đã sửa, đổi lại xa nhóm Copy; B — giữ target trước Group chờ public API, đổi lại acceptance vị trí tiếp tục chưa đạt. Patch/private API/đảo DOM trái constraint§29, không đề xuất.
3. **Khuyến nghị:** A cho khả năng dùng hiện tại; chỉ đổi acceptance khi human chấp nhận rõ ràng.
4. **Bằng chứng:** bảng G0 có source version/Slot và official docs; screenshot baseline§28; chưa ảnh runtime sau sửa.
5. **Tự kiểm chứng:** mở local `block-editor.js:58344` xem Group đứng trước fills (~2phút), `editor.js:83689` xem alternative dùng cùng Slot (~1phút); sau build mở draft kiểm menu (~3phút).
6. **Đảo ngược:** hai chiều; đổi position khi có public API không thay dữ liệu/clipboard/style đích.
7. **Default trước nghiệm thu menu repair:** giữ insertion point hiện hữu, không tuyên bố CCP-MENU02 PASS hoặc thay decision§29; bàn giao alignment/style kiểm độc lập, không mở hack mới.
