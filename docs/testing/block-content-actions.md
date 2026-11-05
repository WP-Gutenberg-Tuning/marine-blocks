# Block Content Actions — onsite acceptance draft

Status2026-11-05: **Chưa làm**. Plan057 execution proposal; chưa implementation/version/start. Không coi file này là evidence PASS.

## Environment và setup

- Target site do human cung cấp khi test; URL site đã có trong context: `https://minhhaifishery.com/`. Tạo private/draft fixture page, ghi exact edit URL + preview URL và page ID vào evidence; không tự sửa/publish trang public `/home/`.
- Ghi WP version, Gutenberg plugin version hoặc inactive, browser/OS, plugin build/source commit, user capabilities. Kiểm minimum supported version theo P0 riêng, không suy từ WP hiện hành.
- Human build/lint plugin theo057§14 rồi upload bằng workflow của project. Bật existing Core Control `Block Copy/Paste` khi test; lưu giá trị cũ để phục hồi. Copy permission cần HTTPS và browser hỗ trợ.
- Fixtures: hai Product Collections cùng loại khác layout/styles/content; Post Collection; hai Slider/Hero có cùng sốSlide và cùng câycore nodes nhưng text/ảnh/link/style/overlay/preset khác; hai Slide; thêm Slider khác sốSlide và unknown child. Đảm bảo nguồn/đích dễ phân biệt, có rich text bold/link/inlinecolor, emptyfields và CTA ẩn.
- Chuẩn bị ảnh nguồn có quyền sử dụng trong cùng site. Không di chuyển/copy media library hoặc taxonomy từ site khác.

## Cases

| Case / IDs | Exact steps | Expected / pass criterion | Evidence |
|---|---|---|---|
| T01 CCP-UX01/04/05 | Gate off reload editor mở menu ⋮ block; gate on reload mở lại; thử mouse, Tab/Enter/Escape và touch/narrow viewport | Off không group; on đúng2action trong menu block, không menu riêng, không duplicate; focus usable, không quảng bá right-click | Menu screenshots/video, version và gate state |
| T02 CCP-TECH01/04 | Snapshot attrs cả cây nguồn/đích; Copy content nguồn → Paste content only đích cùng loại | Chỉ allowlist content đổi; style/support/inherit/anchor/preset/overlay/layout nguyên; source nguyên; không insert/delete/reorder node | Attr diff (kể cả key absent vs unset), video |
| T03 CCP-UX02 | Product→Post; Slider→Slide; text clipboard không markup, multiple roots, unsupported child | Error cụ thể, không mutation/history/partial write | Notice, before/after attrs và undo state |
| T04 CCP-TECH05 | Slider2slides→3slides; cùngcount nhưng childname khác; entity/binding/invalid node trong cây | Reject nguyên thao tác, không paste phần hợp lệ trước | Video + zero attr diff |
| T05 CCP-UX03/TECH06 | Gõ sửa đích rồi blur; paste nhiềuSlide; Undo1lần, Redo1lần; Undo paste rồi Undo lần nữa | Undo đầu hồi toànpaste, giữ edit trước; Undo tiếp mới hồi edit trước; Redo toànpaste; no-op không thêmhistory | Continuous video + attrs/history evidence |
| T06 CCP-UX06 | Copy emptyheading/image/CTA vào contentfilled; paste query missingref và itemcount vượt giới hạn target | Empty xóa có chủ ý; missingref/invalidlimit reject không silently normalize; CTA visibility/actionmode giữ | Attr diff/notice, query fixture |
| T07 CCP-TECH06 | Chặn clipboard permission; doubleclick action; trong read pending đổiselection/xóa/sửacontent đích; lặp với chỉ đổi style | Failure/race không mutation; busy chống lặp; style-only change được giữ nếu paste còn hợp lệ, không stale overwrite | Browser permission UI, video, console không clipboard payload |
| T08 CCP-TECH05/06 | Disabled editing/locked content; move-only lock; multi-select; List View mở menu khi selection khác | Respect content permissions exactruntime, không suy move-lock=readonly; multiselect khônggroup; target menu đúng block hoặc abort | Video + attrs, version/API note |
| T09 CCP-TECH04 | Nguồn bold/link và inlinefont/color/class; dùng Copy content rồi native wholeblockCopy; dán qua action content-only | Semantic richtext theo policy được giữ; inline source styles không đi theo; native Copy cũng chỉ lấy allowlist; unsupportedrichtext reject rõ | Before/after rendered text + attr/payload fixture test |
| T10 CCP-TECH07 | Chạy Copy selected block(s)/Paste block(s) utility cũ; theo dõi Save/network/storage | Utility cũ vẫn insert/fullcopy; content action không ghi theme/options/category/product/sharedentities, không autosave/publish qua action | Request/storage audit (không lộ tokens), screenshot |
| T11 CCP-UI01/02 | Save draft → reopen → preview desktop/mobile, đối chiếu source/target | Content/media/link đúng; layout/overlay/style đích giữ, không invalidblock/recovery prompt, không JS error | Page ID, edit/preview URLs, screenshots, console/build |

## Evidence ledger

Chưa có kết quả. Mỗi case ghi ngày, environment/build, expected/actual, PASS/FAIL/Chờ kiểm chứng và đường dẫn screenshot/video/attr diff. Unit/mocked API không thay browser clipboard/history evidence. Nếu human hoãn onsite, ghi Deferred + target milestone đã được human xác nhận trong MILESTONES; không tự chọn milestone.

Human gửi lại: build/lint output, exact versions/URLs, T01/T02/T05/T11 video/ảnh trước sau, cases fail và console notes. Agent tiếp tục debug từ evidence, không yêu cầu làm lại toàn bộ cases đã có evidence đủ.
