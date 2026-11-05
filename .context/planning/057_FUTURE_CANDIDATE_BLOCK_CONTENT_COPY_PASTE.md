# 057 — Block Content Actions trong menu ⋮

Ngày tạo: **2026-11-05**. Status: **Approved for implementation trong V1 /1.3.19 — chưa có source**. Human duyệt toàn gói §11–14 và start coding trong current1.3.19, không bump; cho agent coding và commit `feature patch:`. Bản chi tiết tại §10–16 cùng approval§17 ưu tiên hơn proposal lịch sử nếu có khác biệt.

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
