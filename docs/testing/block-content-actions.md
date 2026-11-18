# Block Content Actions — source status + onsite acceptance

Evidence update2026-11-06 — human cung cấp output `node tools/tests/block-content-copy.test.mjs` sau repair `8ee4a3f`: **18/18 PASS**,0 fail/skipped, Node24.16.0/npm11.13.0, duration473.370251ms. Đây là model/DOM logic evidence do human báo; không phải agent rerun, build/lint hoặc Gutenberg runtime PASS. `ExperimentalWarning: stripTypeScriptTypes` xuất hiện nhưng suite exit summary không có test fail. Yêu cầu rerun model ở checkpoint bên dưới đã được đáp ứng. Controller11/11 trước đó vẫn giữ phạm vi mock riêng; không cộng thành một suite runtime. Build/lint, real serialize/parse, menu, clipboard permissions, Undo/Redo, Save/reopen/frontend vẫn Chờ kiểm chứng.

Status2026-11-05: **CÓ SOURCE — CHƯA RUNTIME PASS**. Human duyệt plan057 §11–14 và cho coding+commit trong current V1 / 1.3.19 như scope bổ sung, không bump; approval §17. Source/unit tests đã có; build/lint, menu/clipboard, Undo/Redo và Save/reopen vẫn **Chờ kiểm chứng**. File này không phải evidence PASS và không thay release approval.

Repair update sau review `0a53a2d`: human cho thực hiện plan, R1–R4 đã có source sửa;057§25 là execution ledger mới nhất. `node tools/tests/block-content-controller.test.mjs` **11/11 PASS** (WP store/parser/clipboard mock, DOMParser JSDOM thật), TypeScript syntax check PASS; chưa build/lint/typecheck/runtime. Model suite cần human chạy lại `node tools/tests/block-content-copy.test.mjs` (Node24); không claim toàn bộ suite PASS. Các đoạn “chưa sửa”/span rejection phía dưới là evidence baseline trước repair, không phải trạng thái mới.

Sau build: chạy thêm R01–R06 theo057§22. Text limit1048576 đo UTF-16 code units; span font/color/class được unwrap, semantic text/link/br giữ; benign omitted closing inline tag được browser canonicalize, unsupported meaningful node/comments/head content/bound markers reject. Browser/CSP không cho DOMParser thì fail closed. Không dùng mock parser test làm evidence real serialize/parse.

## 1. P0 — runtime/API/version evidence (local)

Ghi lại trước khi dùng API, theo plan057 §10.1 và §17:

| Hạng mục | Giá trị đã kiểm |
|---|---|
| WordPress | `7.1` (`D:\Github\minhhaifish\wp-includes\version.php:19`) |
| Gutenberg plugin | **Không cài** (`wp-content/plugins/` chỉ có antispam-bee, contact-form-7, contact-form-cfdb7, ootb-openstreetmap, seo-by-rank-math, skvn-marine-blocks, windpress, woocommerce) |
| `@wordpress/scripts` | `^30.6.0` trong `package.json` — build tooling, **không phải** editor runtime version |
| `BlockSettingsMenuControls` | export `wp-includes/js/dist/block-editor.js:6928`; slot/fill `58294–58390`; fill props thực tế gồm `canEdit`, `selectedBlocks` (names), `selectedClientIds`, `onClose`, `count`, `firstBlockClientId` |
| Slot lồng MenuGroup | `58344` — core đã bọc fills trong `MenuGroup`; `MenuGroup` label render `aria-hidden` nhưng vẫn là `role="group" aria-labelledby` (`components.js:45205`) |
| `updateBlockAttributes` | action `block-editor.js:16305`, reducer merge từng key `8500–8560`, `uniqueByBlock` map theo clientId; không replace/reset |
| `canEditBlock` | `block-editor.js:15126` — `! isPreviewMode && ! lock.edit` |
| `getBlockEditingMode` / `areInnerBlocksControlled` / `getBlockParents` | exports `block-editor.js:10049–10080` |
| `parse` / `serialize` | `blocks.js:5051` / `3764`; unknown block → `core/missing` + `originalName` (`5721–5782`); serialize bỏ attribute bằng default và attribute có `source` (`3652`, `3742`) |
| Core schema | đọc trực tiếp `wp-includes/blocks/{heading,paragraph,button,buttons,image,columns,column,group}/block.json` |

Hệ quả: menu dùng `BlockSettingsMenuControls` (không `PluginMoreMenuItem`, không header riêng, không contextmenu). `uniqueByBlock` có thật trên runtime này; **một Undo** vẫn phải kiểm thực tế, không suy từ API.

## 2. Source đã làm (P1–P3)

| File | Nội dung |
|---|---|
| `src/core-controls/block-content/types.ts` | type dùng chung, không import runtime |
| `src/core-controls/block-content/fields.ts` | allowlist content theo block, enum/range/URL/slug validator, inline rich-text policy, `itemLimit` |
| `src/core-controls/block-content/plan.ts` | projection content-only, shape check theo path, patch theo child index, empty overwrite, signature content, limit 1 MiB / 200 node / depth 20 |
| `src/core-controls/block-content/transport.ts` | `serialize`/`parse` Gutenberg thuần, `defaultsFor` từ schema, reject `core/missing`/freeform/invalid |
| `src/core-controls/block-content/clipboard.ts` | chỉ đọc clipboard khi click Paste, chỉ ghi khi click Copy |
| `src/core-controls/block-content/taxonomy.ts` | validate `categories`/`tags` (slug) theo taxonomy của site trước khi ghi |
| `src/core-controls/block-content/controller.ts` | guard quyền/mode/controlled/binding, revalidate sau await, một dispatch `updateBlockAttributes(..., { uniqueByBlock: true })`, notices |
| `src/core-controls/block-content/index.tsx` | Fill `BlockSettingsMenuControls` + `MenuGroup` "Content actions" với `Copy content` / `Paste content only`, busy guard |
| `src/core-controls/index.ts` | import một lần `./block-content` |
| `modules/core-control/registry.php` | chỉ mở rộng description của `block_clipboard`; label/option/default giữ nguyên |

Behavior đã cài theo plan:

- Chỉ hiện group khi chọn **đúng một** root thuộc Product Collection, Post Collection, Slider, Slide và gate `block_clipboard` bật; multi-select/block khác không có group.
- Copy chỉ serialize **projection** content-only; style/layout/preset/overlay/media presentation/behavior không đi theo. Query (`categories`, `tags`, `relation`, `orderMode`, `itemsToShow`, CTA/URL/label, `readMoreLabel`) là content.
- Empty (`''`, `[]`) ghi đè thật; default bị serializer bỏ được resolve theo schema đích.
- Exact block name + exact tree shape theo path; Grid ↔ Carousel cùng Collection được phép và giữ `layout` đích; lệch số node/thứ tự/tên node hoặc unknown node → từ chối nguyên thao tác.
- Inline rich text chỉ giữ `strong,b,em,i,sup,sub,code,mark,br,a` (+`href/target/rel` an toàn); tag/attr khác bị reject, không strip âm thầm. Heading bị flatten vì PHP render bằng `esc_html` (`modules/collection-render/cards.php:627`), `intro` giữ inline HTML vì PHP dùng `wp_kses_post` (`:630`).
- `itemsToShow` validate theo layout đích (product 20; post carousel 10; post grid 9), reject chứ không clamp.
- Không sửa utility whole-block `block-clipboard`, không thêm option/storage/dependency/CSS/frontend asset/endpoint, không đổi theme/GeneratePress/query engine/Swiper.

## 3. Test đã chạy (logic, không phải runtime)

```bash
node --test tools/tests/block-content-copy.test.mjs
```

Kết quả 2026-11-05: **16/16 pass** (Node 24.20.0, `stripTypeScriptTypes` + `vm`, ghép `types.ts` → `fields.ts` → `plan.ts`). Nội dung kiểm:

- allowlist projection: không lộ `layout`, `contentWidth`, `style`, `titleColor`, `mediaWidthPercent`, `productActionMode`, `appendQuoteContext`, `sizeSlug`, `linkDestination`, `overlayOpacity`, `preset`;
- structural wrapper không copy attribute; Slider root không copy behavior;
- empty `''`/`[]` ghi đè; identical content → 0 patch; style-only diff → 0 patch và signature không đổi;
- Grid ↔ Carousel cùng Collection giữ `layout` đích;
- lệch root type, lệch số/thứ tự/tên node, unknown child → reject;
- rich text giữ `strong/em/br/a`; reject `span`, `div`, tag lệch, comment; URL `javascript:`/`data:`/`ftp:` reject; `_blank` thêm `noopener noreferrer`;
- `itemsToShow` theo limit layout đích, không clamp;
- heading flatten;
- node/depth limit.

**Chưa được chứng minh bởi unit test:** round-trip `serialize`/`parse` thật, vì `@wordpress/blocks` không có trong `node_modules` local và không cài Gutenberg plugin. Đây là lý do T02/T09/T11 phải kiểm onsite.

## 4. Environment và setup

- Target site do human cung cấp khi test; URL site đã có trong context: `https://minhhaifishery.com/`. Tạo private/draft fixture page, ghi exact edit URL + preview URL và page ID vào evidence; không tự sửa/publish trang public `/home/`.
- Ghi WP version, Gutenberg plugin version hoặc inactive, browser/OS, plugin build/source commit, user capabilities. P0 ở trên là local; onsite phải ghi lại version thật.
- Human build/lint plugin theo plan057 §14 rồi upload bằng workflow của project. Bật existing Core Control `Block Copy/Paste` khi test; lưu giá trị cũ để phục hồi. Clipboard cần HTTPS/secure context và browser hỗ trợ.
- Fixtures: hai Product Collections cùng loại khác layout/styles/content; Post Collection; hai Slider/Hero có cùng số Slide và cùng cây core nodes nhưng text/ảnh/link/style/overlay/preset khác; hai Slide; thêm Slider khác số Slide và unknown child. Đảm bảo nguồn/đích dễ phân biệt, có rich text bold/link/inline color, empty fields và CTA ẩn.
- Chuẩn bị ảnh nguồn có quyền sử dụng trong cùng site. Không di chuyển/copy media library hoặc taxonomy từ site khác.

## 5. Cases

| Case / IDs | Exact steps | Expected / pass criterion | Evidence |
|---|---|---|---|
| T01 CCP-UX01/04/05 | Gate off reload editor mở menu ⋮ block; gate on reload mở lại; thử mouse, Tab/Enter/Escape và touch/narrow viewport | Off không group; on đúng 2 action trong menu block, không menu riêng, không duplicate; focus usable, không quảng bá right-click | Menu screenshots/video, version và gate state |
| T02 CCP-TECH01/04 | Snapshot attrs cả cây nguồn/đích; Copy content nguồn → Paste content only đích cùng loại | Chỉ allowlist content đổi; style/support/inherit/anchor/preset/overlay/layout nguyên; source nguyên; không insert/delete/reorder node | Attr diff (kể cả key absent vs unset), video |
| T03 CCP-UX02 | Product→Post; Slider→Slide; text clipboard không markup, multiple roots, unsupported child | Error cụ thể, không mutation/history/partial write | Notice, before/after attrs và undo state |
| T04 CCP-TECH05 | Slider 2 slides→3 slides; cùng count nhưng child name khác; entity/binding/invalid node trong cây | Reject nguyên thao tác, không paste phần hợp lệ trước | Video + zero attr diff |
| T05 CCP-UX03/TECH06 | Gõ sửa đích rồi blur; paste nhiều Slide; Undo 1 lần, Redo 1 lần; Undo paste rồi Undo lần nữa | Undo đầu hồi toàn paste, giữ edit trước; Undo tiếp mới hồi edit trước; Redo toàn paste; no-op không thêm history | Continuous video + attrs/history evidence |
| T06 CCP-UX06 | Copy empty heading/image/CTA vào content filled; paste query missing ref và item count vượt giới hạn target | Empty xóa có chủ ý; missing ref/invalid limit reject không silently normalize; CTA visibility/action mode giữ | Attr diff/notice, query fixture |
| T07 CCP-TECH06 | Chặn clipboard permission; double click action; trong read pending đổi selection/xóa/sửa content đích; lặp với chỉ đổi style | Failure/race không mutation; busy chống lặp; style-only change được giữ nếu paste còn hợp lệ, không stale overwrite | Browser permission UI, video, console không clipboard payload |
| T08 CCP-TECH05/06 | Disabled editing/locked content; move-only lock; multi-select; List View mở menu khi selection khác | Respect content permissions exact runtime, không suy move-lock=readonly; multi-select không group; target menu đúng block hoặc abort | Video + attrs, version/API note |
| T09 CCP-TECH04 | Nguồn bold/link và inline font/color/class; dùng Copy content rồi native whole block Copy; dán qua action content-only | Semantic rich text theo policy được giữ; inline source styles không đi theo; native Copy cũng chỉ lấy allowlist; unsupported rich text reject rõ | Before/after rendered text + attr/payload fixture test |
| T10 CCP-TECH07 | Chạy Copy selected block(s)/Paste block(s) utility cũ; theo dõi Save/network/storage | Utility cũ vẫn insert/full copy; content action không ghi theme/options/category/product/shared entities, không autosave/publish qua action | Request/storage audit (không lộ tokens), screenshot |
| T11 CCP-UI01/02 | Save draft → reopen → preview desktop/mobile, đối chiếu source/target | Content/media/link đúng; layout/overlay/style đích giữ, không invalid block/recovery prompt, không JS error | Page ID, edit/preview URLs, screenshots, console/build |

Gợi ý thứ tự: T01 → T02 → T04 → T05 (history/Undo) → T03/T06 (reject/empty) → T07/T08 (permission/race) → T09/T10 → T11 (Save/reopen/frontend).

## 6. Evidence ledger

Review `0a53a2d` ngày2026-11-05 tìm thấy bốn **FAIL source**, repair chưa làm: clipboard source binding bypass, descendant mode/controlled guard thiếu, Paste bypass limits, styled span bị reject trái spec. Chi tiết/regression R01–R06: [plan057 §19–24](../../.context/planning/057_FUTURE_CANDIDATE_BLOCK_CONTENT_COPY_PASTE.md#19-review-repair-plan--2026-11-05-baseline-0a53a2d). Phải chạy thêm matrix này cùng T01–T11 sau repair. Bảng source/16 tests và các mô tả behavior phía trên là checkpoint trước review; không phải evidence các guard đã đủ hoặc span rejection là policy được duyệt.

| Repair | Hiện trạng | Evidence cần bổ sung |
|---|---|---|
| CCP-R1 / R01 | FAIL source; chưa sửa | Production transport/controller reject bound source, zero mutation |
| CCP-R2 / R02 | FAIL source; chưa sửa | Ancestor/descendant mode/ownership và after-await guard, actual runtime API |
| CCP-R3 / R03 | FAIL source; chưa sửa | Boundary limits ở cả Copy/Paste, fail trước lookup/mutation |
| CCP-R4 / R04 | FAIL source; chưa sửa | Styled spans giữ semantic text, bỏ presentation; real parser round-trip |
| R05/R06 | Chờ kiểm chứng | Undo/no-op/empty/style latest, Save/reopen/desktop/mobile |

Phiên review: test runner bị `spawn EPERM`; hai fixture model độc lập chứng minh bound source vẫn tạo patch và202-node Paste bypass. Không gộp kết quả này với report16/16 phiên coding hoặc gọi là clipboard/runtime PASS. Target onsite vẫn là private/draft fixture trên site human chọn theo §4; chưa có edit/preview URLs, không thao tác public homepage.

| Ngày | Hạng mục | Kết quả | Ghi chú |
|---|---|---|---|
| 2026-11-05 | Source P1–P3 | Đã có source | Chưa build/lint; human chạy lệnh §7 |
| 2026-11-05 | Unit logic (`node --test tools/tests/block-content-copy.test.mjs`) | 16/16 pass | Chỉ pure modules; không phải runtime/menu/clipboard/Undo |
| — | T01–T11 onsite | Chờ kiểm chứng | Cần human chạy sau build/lint |

Mỗi case onsite ghi ngày, environment/build, expected/actual, PASS/FAIL/Chờ kiểm chứng và đường dẫn screenshot/video/attr diff. Unit/mocked API không thay browser clipboard/history evidence. Nếu human hoãn onsite, ghi Deferred + target milestone đã được human xác nhận trong MILESTONES; không tự chọn milestone.

## 7. Build/lint human chạy (plan057 §14)

```bash
source /home/shinkuro/.nvm/nvm.sh && nvm use 20 && cd /mnt/d/Github/skvn-marine/wp-content/plugins/skvn-marine-blocks && npm run build && find modules/ -name "*.php" -exec php -l {} \;
```

Registry PHP đã đổi description nên lệnh lint trên bao phủ `modules/core-control/registry.php`. Command treo/timeout thì dừng ngay, không retry/poll.

Human gửi lại: build/lint output, exact versions/URLs, T01/T02/T05/T11 video/ảnh trước sau, cases fail và console notes. Agent tiếp tục debug từ evidence, không yêu cầu làm lại toàn bộ cases đã có evidence đủ.

## 8. Menu placement / style follow-up — CCP-MENU01–05

Spec/decision: plan057§28–30 (2026-11-06). **Đã có source alignment/style**, chưa build/onsite: bỏ MenuGroup lồng, dùng labelled group không thêm padding ngang; heading Marine Blocks có style editor-only qua handle `skvn-block-content-actions-editor` khi gate bật. Vị trí vẫn ở Slot native sau Visibility/Hide trên local WP7.1; CCP-MENU02 chưa đạt, không coi đây là fallback đã human duyệt. Screenshot ban đầu là baseline FAIL, chưa có ảnh sau sửa. Target dùng draft/private edit URL của§4; chưa có URL cụ thể, human cung cấp khi onsite, không publish fixture.

Preconditions: ghi build/commit + WP/Gutenberg/browser/OS versions; build/lint thành công, assets đúng build. Gate on; fixture có Product/Post Collections và Slider/Slide. Kiểm gate off sau cùng; không đổi production settings ngoài fixture được cho phép.

1. Mở ⋮ từng root hỗ trợ: một nhóm giữa nhóm nội dung (sau Add note nếu có) và Group/nhóm cấu trúc; heading `Marine Blocks`, đúng hai action. Nếu insertion point khác target thì CCP-MENU02 FAIL, dù style đúng. Chụp toàn menu và ghi native items đang ẩn.
2. So với Copy/Group native: hai custom actions cùng cột chữ và hit area, không thêm inset như submenu. Ghi computed padding/margin + bounding rect khi debug; ảnh trước/sau cùng viewport. Heading nền#F0F9FF/chữ#075985,12px/600 trong normal mode; native item hover/focus/disabled không bị recolor.
3. Dùng keyboard mở/di chuyển/activate/đóng menu (Tab/arrows/Enter/Escape theo native menu), rồi mouse và touch viewport390px: heading không nhận focus/click; focus order trùng thứ tự nhìn thấy, Escape trả focus đúng trigger, không mất/cắt focus ring. Kiểm zoom200% và forced-colors: chữ đọc được, không overflow, separators/label vẫn phân biệt nhóm.
4. Kiểm List View/menu target, unsupported block, multi-select, disabled/locked mode và gate off/reload: không thao tác nhầm global selection, không duplicate items/heading hoặc separator rỗng. Menu native và plugin khác vẫn dùng được.
5. Smoke T02/T05: paste giữ style, empty overwrite, no-op không history, một Undo/Redo cho paste. Không có shortcut hint mới; thử Ctrl+C/V khi nhập text vẫn native. Shortcut content actions Deferred, không test một phím chưa triển khai như tính năng đã có.

Evidence: edit URL riêng tư + build/versions/viewport, full-menu screenshots (normal/narrow/forced-colors), keyboard video, DOM/style notes nếu inset còn, notices/console và kết quả mỗi CCP-MENU ID. PASS khi đạt expected trong đúng environment; thiếu evidence ghi Chờ kiểm chứng, không bỏ FAIL vị trí bằng workaround thị giác. G0 API feasibility thuộc agent research trước source repair, không yêu cầu human chứng minh API.

Source check2026-11-06: TSX transpile syntax PASS, không full typecheck/build. PHP/CSS chưa lint/browser. Không đổi handlers/guards/controller nên không rerun model/controller chỉ vì wrapper/style. Gate off/reload phải không có inline style handle trên editor; gate on handle phải nằm trong chrome document. So ancestor native `.components-menu-group` (local padding8px) với custom group (không thêm inset); native/custom buttons cần cùng x/width. Kiểm group đứng đầu/cuối/giữa native/plugin items để không có separator trùng; border nội bộ chỉ khi có sibling tương ứng, outer group giữ separator native.
