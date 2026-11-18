# Gutenberg/Tailwind header menu prototype — test

2026-11-08. Artifact-only; no production header replacement or install. Files `docs/examples/mega-menu-gutenberg-tailwind/`. Source ideation panel3cột Products/Food Service/Capabilities. Test site/template URL/pageID/build/WP/WindPress/Tailwind/builder versions **TBD do human ghi trước test**; không mặc định test page screenshot trước là cùng template.

## Setup và steps

1. Target nhanh: mở `D:/Github/skvn-marine/docs/examples/mega-menu-gutenberg-tailwind/preview.html` cùng thư mục với `mobile-drawer.js`. Target integration: draft/test Header template URL **TBD human ghi**. Mở Code editor, paste header.gutenberg.html rồi chuyển Visual. WindPress phải có stylesheet cùng lớp utils/companionCSS và nạp trong iframe/frontend; frontend nạp mobile-drawer.js một lần qua asset loader, không paste script vào content. Không publish Entire Site.
2. List View: Site Title, Group, Details Products, ba nhóm Heading/links và CTA phải editable riêng. Mở Products rồi sửa một label/link; Save draft/reopen. Expected: không invalid-block/recovery, label/link giữ, site title lấy WP identity. Parser static28blocks không thay test này.
3. Preview frontend ở desktop1440/1024px có scrollbar và tablet768/mobile767/390/320px; mở/đóng Products. Desktop panel nằm dưới header và trong viewport. Mobile hiện Menu, nav/CTA chỉ xuất hiện khi mở drawer. Drawer bên phải, tối đa420px/chừa24px ở viewport nhỏ; ba nhóm xếp dọc, nội dung dài cuộn tới CTA được. Parent builder không clip desktop panel. Ghi rect/header/parent và scrollWidth/clientWidth trước mở, khi mở ổn định và sau đóng: không tràn ngang. Font/heading/link/CTA đọc được, focus outline không bị che.
4. Desktop: Tab đến Products, Enter/Space mở/đóng, Tab qua links/CTA. Mobile: Tab đến Menu → Enter; focus ở Close, Tab/Shift+Tab nằm trong modal, nội dung nền không tương tác. Close/Escape/chạm backdrop/chọn link phải đóng, aria-expanded=false và focus về Menu. Chạm khoảng trống bên trong drawer không đóng. Desktop Escape/outside-click/hover intent vẫn ngoài scope.
5. Thay mọi #replace-* URL trong link-checklist.md bằng URL thật trước publish; kiểm search/quote CTA không giả định đã nối dữ liệu. Không bật sticky/search/modal trong prototype.
6. Mobile: quan sát mở trượt từ phải240ms, đóng180ms, backdrop fade. Đóng ngay trong lúc mở/nhấn Close nhiều lần không nhảy về trạng thái mở hoặc kẹt overlay. Bật reduced motion trong OS/DevTools: mở/đóng tức thì; đổi setting khi đang chuyển động không để modal kẹt.
7. Khi drawer mở, resize qua768px: nav và CTA về desktop, overlay/scroll lock gỡ. Resize về mobile: nav thu vào drawer đóng; nếu đang focus một link desktop, focus chuyển về Menu. Lặp mở/đóng/resize: không duplicate menu/IDs, không khóa cuộn sau đóng, inline overflowY trước mở được khôi phục. Cuộn trang tới header trước mở để xác minh đóng không nhảy trang bất thường.
8. Tắt JS/reload: nav gốc vẫn dùng được trong flow; không có nút Menu chết. Editor: không xuất hiện dialog hay node menu bị chuyển khỏi block tree; edit/save/reopen vẫn hoạt động.
9. Nếu thử plugin menu: dùng menu-panel.gutenberg.html18blocks trong block-based dropdown template của plugin. Không giữ wrapper/position rules hoặc nạp mobile-drawer.js của native Details demo; test keyboard/Escape/outside click/mobile/condition persistence theo plugin thật. Không suy header/footer builder tự cung cấp menu engine.

## Pass/fail và report

Đánh riêng Block UI (responsive/geometry/focus), Editor UX (paste/edit/save/reopen) và Technical (CSS thật được nạp, không external request mới, no script/content injection). PASS chỉ trong environment/build có evidence, không phải approval dùng production. Gửi screenshots desktop/mobile/editor, template/test URL, versions, actual/expected, console/network/styles và rect. Nếu invalid-block hoặc CSS không hiện, giữ draft và gửi lỗi/matched styles, không Convert to HTML rồi coi đã sửa.

Static checks đã có: core parser28/18blocks, no freeform/script/style handlers trong Gutenberg markup và CSS syntaxPASS. Chưa Tailwindcompile/browser/runtime/SEO condition checks. Không sửa Milestones/current hoặc source plugin/theme trong task này.

| ID | Nhóm | Expected / cách kiểm | Hiện trạng / Evidence |
|---|---|---|---|
| MM-M01 | Block UI | Drawer toàn menu, motion/reduced motion, không tràn ngang; steps3/6 | Đã có source CSS/JS; chờ screenshot/video/rect từ browser |
| MM-M02 | Block UI / Technical | Keyboard/modal focus, đóng/mở nhanh, resize, scroll restore; steps4/7 | Đã có source controller; chờ native browser evidence |
| MM-E01 | Editor UX | Core blocks editable, save/reopen không invalid; steps2/8 | Saved markup giữ nguyên; chờ WordPress test |
| MM-T01 | Technical | Assets frontend-only, no-JS fallback, panel-only không tranh controller; steps1/8/9 | Đã có source và hướng dẫn; chờ WindPress/builder integration |

Browser automation hiện chặn URL file://; không có runtime PASS từ tool. Human gửi viewport/browser, screenshot drawer mở/đóng, video motion ngắn nếu lỗi, console errors và URL template test. Các acceptance đang **Chờ kiểm chứng**, không Deferred hoặc chuyển milestone chỉ vì chưa chạy onsite.

## Onsite defect evidence2026-11-08 — trước nạp companion assets

Target human cung cấp: `https://minhhaifishery.com/uthf_header/mhf-menu/`. Browser IAB, public/non-authenticated view, desktop1280×720/clientWidth1265 và mobile390×844/clientWidth375. Không ghi build/WindPress/builder version khi chưa xác minh. Page body có `error404 ... uthf_header_builder`, title “Page not found – Minh Hai Fishery”; custom header vẫn được inject cùng masthead của GeneratePress. Không kết luận nguyên nhân404 là lỗi block.

- Markup: `.marine-menu-demo`, Site Title, core Details/Group/Paragraph/CTA đều hiện. Block rendering có evidence; save/reopen/invalid-block vẫn chưa test. Trường hợp này không phải copy thiếu comments.
- CSS defect: toàn bộ `document.styleSheets` truy cập được, recursive CSS rules tìm `marine-menu-` trả0, inline styles cũng không chứa companion selector. WindPress utility `display:flex/grid` vẫn hoạt động. Root `position:static`, shell `max-width:none`, panel `position:static;padding:0px`. Khi mở Products, panel desktop rộng562.46875px/cao411.796875px và đẩy header cao lên thay vì overlay dưới header.
- JS defect: script[src] không có `mobile-drawer.js`; ở mobile không có `data-drawer-ready`, toggleCount0/dialogCount0. Không có khả năng mở drawer nên MM-M01/MM-M02 hiện **FAIL onsite — assets chưa được tích hợp**, không phải PASS do source tồn tại.
- Integration defect: custom `.ultihefo-header` và theme `#masthead` cùng render. Cần kiểm display/replacement trong builder, không hide bằng CSS. URL public test page chưa được human xác định; không tự sửa điều kiện Entire Site.

Nguồn sửa bàn giao: `menu.css` standalone và `enqueue-example.php` trong cùng thư mục artifact; README có đường copy/nạp cụ thể. Đây là **đã có source hướng dẫn**, chưa áp dụng lên theme/site. Cần human nạp assets theo README và gửi public test page URL để agent kiểm tiếp desktop/mobile. CSS/JS runtime sau nạp và header replacement vẫn **Chờ kiểm chứng**. Không tự đóng acceptance cũ.

## Home CSS audit2026-11-08 — companion đã nạp, thua cascade layer

Human yêu cầu kiểm riêng CSS header mới và **bỏ qua header GeneratePress trùng**. Target đã xác định: `https://minhhaifishery.com/home/`. IAB public view1280×720, clientWidth1265 có scrollbar. Audit/read-only; không sửa theme, WindPress stylesheet, builder conditions hoặc CSS prototype. Mở Products để đo, đóng lại sau kiểm. Không kết luận geometry của panel Details đang đóng; rect trước mở không đại diện panel đang hiển thị.

Delta so với lần kiểm CPT ở trên: `windpress-cached-inline-css` hiện chứa đầy đủ companion selectors trong **layer components**. Không còn đúng nếu nói Home thiếu toàn bộ CSS menu. Frontend chưa có menu controller trong script src/inline và chưa có drawer-ready; JS chưa tích hợp là issue riêng, không dùng để giải thích desktop CSS lệch.

| ID | Nhóm | Expected / source | Actual / evidence | Trạng thái / hướng sửa chưa triển khai |
|---|---|---|---|---|
| MM-CSS01 | Block UI / Technical | Brand/top links/card links margin0 theo companion | GP `p {margin-bottom:1.5em}` unlayered thắng components: brand27px, top link21px, card link25.5px. Header mới cao106px; panel mở cao591.296875px. | FAIL onsite. Menu cần override ngoài named layer, scope vào wrapper; không reset p toàn site. |
| MM-CSS02 | Block UI / Technical | Group heading12px/700, line-height~18px, tracking.1em, margin-bottom16px theo fixture | Actual29px/400, line-height34.8px, margin-bottom20px. GP h3 và global/theme heading rules unlayered thắng menu trong components. | FAIL onsite. Ngoài layer vẫn cần scoped selector đủ specificity cho theme `body:not(.wp-admin) .wp-block-heading` (0,2,1); ví dụ wrapper+panel+heading(0,3,0). Chưa sửa source. |
| MM-CSS03 | Block UI / Technical | Links inherit menu navy, không underline; CTA primary/14px/600/padding12px20px | About/Contact và panel links #1e73be + underline từ GP `a` unlayered; CTA #55555e/17px/400/padding10px20px từ GP/core button rules. Primary token hiện resolve #024f77. | FAIL onsite. Cần xử lý layer trước specificity; không thêm !important hàng loạt. |
| MM-CSS04 | Block UI / Technical | Header width/desktop dropdown positioning đúng owner | Root relative, shell width/max-width1200; panel mở width1200/x32.5/y105, offsetParent là root, Details/ancestors static. Positioning đã hoạt động trong scope này. | Có evidence desktop baseline, không phải nguyên nhân chính CSS lệch. Không suy mobile/editor hoặc toàn bộ geometry PASS. |
| MM-E02 | Editor UX | CSS parity sau repair trong editor iframe | Không mở editor, chưa edit/save/reopen; scope hiện là frontend audit | Chờ kiểm chứng. Không suy editor PASS từ frontend. |

Root cause: normal declarations **ngoài named layer** có ưu tiên hơn normal declarations trong named layers, trước khi xét specificity ([W3C CSS Cascade5 §Layer Ordering](https://www.w3.org/TR/css-cascade-5/#layer-order)). Vì vậy selector menu dài hơn vẫn thua `p`, `a`, `h3` ngoài layer. Preview standalone không có GP/core global rules tương đương nên che mất conflict này; thiếu test parity trên theme là lỗi bàn giao prototype của agent.

Hướng sửa: một owner cho companion CSS. Hoặc dùng `menu.css` unlayered (đã chuẩn bị, chưa thấy site nạp), hoặc sửa đường WindPress để companion overrides xuất ngoài `@layer components`; không nạp cả hai. Audit specificity riêng sau khi thống nhất layer. Không thay/hide GeneratePress header, không global reset hay đổi theme settings. Đây là hướng repair, chưa có implementation approval trong lượt audit này.

Retest sau repair: tại cùng viewport, mở Products; đo margin/heading/link/CTA như bảng, so full panel height và root height; test viewport390/768/1280 và editor iframe; ghi matched rules + screenshot before/after. Chỉ mark từng ID PASS sau evidence đúng surface. Onsite production chưa được sửa.

## CSS repair execution2026-11-08 — human duyệt “tiến hành làm”

- Source owner `menu.css`: các overrides vẫn unlayered, root dùng UI font; heading selector `.marine-menu-panel .wp-block-heading.marine-menu-heading` (0,3,0) thay selector2classes, margin0/type12px/700/line1.5/uppercase/tracking.1em/slate. Drawer heading có font-family/weight/transform explicit để không kế thừa heading preset ngoài ý muốn.
- `windpress.css` được refresh thành CSS thường top-level, không `@layer components`/`@apply`. Chỉ giữ `@source inline` cho layout utilities WindPress. Gỡ nguyên companion cũ và thay file mới, không bọc lại trong layer.
- `sync-preview.mjs` đồng bộ companion từ source chuẩn và tạo viewer. Preview nạp trực tiếp `menu.css`, không giữ bản CSS expand thủ công riêng; fixture đặt `p`, `a`, `h3`, theme heading và GP button rules sau menu CSS để dễ nhận ra conflict khi human mở browser.
- Gutenberg/header/panel markup, controller JS, PHP snippet, theme/plugin runtime/metadata và header GeneratePress không đổi. Chưa deploy hoặc viết vào WindPress onsite.
- Static checks PASS: PostCSS parse; normalized companion rules WindPress/source bằng nhau; không layer/apply/important trong companion; không global selector ngoài menu hoặc viewport-width/overflow mask; TXT bằng canonical Gutenberg HTML; viewer có đúng một menu.css và đặt fixture sau CSS. Đây là structural evidence, không browser cascade/geometry PASS.
- MM-CSS01–03: **Đã có source repair, Chờ kiểm chứng** trên Home sau human thay stylesheet/cache. FAIL onsite baseline phía trên giữ nguyên lịch sử. MM-CSS04/editor/mobile vẫn kiểm riêng.

### Giới hạn command/JSDOM

Lệnh diagnostic JSDOM20.0.3 dưới đây không trả output sau10giây. Agent dừng bước chờ, gửi Ctrl+C để chấm dứt session, không chạy lại. Tool sau đó trả exit0 kèm output margin1.5em/heading29px/CTA xám trong fixture dù selector scoped đã mạnh hơn; **không có JSDOM regression PASS**. Không dùng runner này để kết luận browser CSS cascade đúng hoặc sửa selector chỉ để chiều output runner. Browser onsite với matched rules và geometry vẫn là acceptance cần thiết. Không còn command đang được agent chờ/poll.

Nguyên command để human chạy thủ công nếu muốn khảo sát runner; không phải bước bắt buộc để áp dụng CSS:

```powershell
@'
const fs = require('fs');
const {JSDOM} = require('./wp-content/plugins/skvn-marine-blocks/node_modules/jsdom');
const dir='docs/examples/mega-menu-gutenberg-tailwind/';
const css=fs.readFileSync(dir+'menu.css','utf8');
const preview=fs.readFileSync(dir+'preview.html','utf8');
const fixture=preview.match(/<style>([\s\S]*?)<\/style>/)[1];
const body=preview.match(/<body>([\s\S]*?)<\/body>/)[1];
const dom=new JSDOM('<html><head><style>'+css+'</style><style>'+fixture+'</style></head><body>'+body+'</body></html>');
const win=dom.window;
for(const selector of ['.marine-menu-brand','.marine-menu-toplink','.marine-menu-heading','.marine-menu-link','.marine-menu-toplink a','.marine-menu-cta a']){
 const s=win.getComputedStyle(win.document.querySelector(selector));
 console.log(JSON.stringify({selector,marginBottom:s.marginBottom,fontSize:s.fontSize,fontWeight:s.fontWeight,decoration:s.textDecoration,background:s.backgroundColor}));
}
win.close();
'@ | node
```

## Responsive runtime integration2026-11-08 — sau human report “KHÔNG CÓ RESPONSIVE HẢ?”

Target `https://minhhaifishery.com/home/`, public IAB.390×844/clientWidth375: CSS mới thể hiện nav/CTA styles nhưng header mới cao246px; không drawer-ready/toggle/dialog, scripts chỉ có generate-menu.js liên quan menu.768×1024/clientWidth753: header86px, desktop nav vừa hàng, toggle0 (đúng desktop layout hiện tại nhưng chưa có runtime). Đây là missing controller integration đã xác minh, không phải bằng chứng thiết kế hamburger đã hoạt động. Bỏ qua header GeneratePress như human scope.

Source repair:

- Drawer controller đã nối vào **shared `wp-content/themes/skvn-marine/assets/js/animations.js`**, file đã được `inc/enqueue.php` nạp frontend. Phần menu là IIFE riêng, không bị reduced-motion/IntersectionObserver/reveal early return của phần reveal chặn. `.marine-menu-demo` opt-in, editor guard, native modal, focus/scroll/resize/animation policy giữ.
- `inc/enqueue.php`: dependency wp-i18n và `wp_set_script_translations` domain skvn-marine cho labels, giữ handle và filemtime cache. Không thêm PHP require/include, không plugin build, không sửa header GP/CSS owner.
- Script example là mirror từ shared runtime qua `sync-preview.mjs`; SKVN không cần tự enqueue companion JS nữa. Với theme khác, standalone path cũ vẫn là ví dụ cần integration riêng. Source không đồng nghĩa đã deploy.

Validation: `node --test tools/tests/marine-menu-drawer.test.mjs` báo spawn EPERM trong sandbox. Chạy trực tiếp không tạo worker: `node tools/tests/marine-menu-drawer.test.mjs` → **9/9 PASS**, ~37ms. Test thực thi shared runtime bằng Node VM với DOM/dialog/matchMedia/animation model: init không IO/reveal; mobile open/close240/180ms options; focus/scroll restore; Escape/backdrop/inside click; mobile↔desktop trả node gốc; duplicate boot; editor/unsupported dialog fallback; DOMContentLoaded; reduced-motion init và đổi preference giữa close. Không test native focus trap, thực tế animation, geometry hoặc WordPress i18n loading. Các runtime acceptance vẫn Chờ kiểm chứng sau deploy.

Human trước deploy chạy:

```powershell
php -l wp-content/themes/skvn-marine/functions.php
php -l wp-content/themes/skvn-marine/inc/enqueue.php
```

Deploy đúng **hai file theme** `assets/js/animations.js` và `inc/enqueue.php`, giữ stylesheet WindPress đã sửa; refresh HTML/CDN cache để reference filemtime mới. Agent chưa upload/đổi production. Retest Home390/767/768/1024/1280: dưới768px header gọn Site Title+Menu, có ready flag và dialog đóng; mở đủ Products/About/Contact/CTA; kiểm close/focus/scroll/resize/reduced motion theo steps ở đầu runbook. Gửi screenshot mobile drawer đóng/mở, console errors, script src/version; agent tiếp tục từ evidence này. Không paste lại block, không dùng nút hamburger của GP làm evidence menu mới.

## First-load desktop audit2026-11-09 — server cache khác browser-compiled CSS

Human xác nhận UI sau tải ổn, nhưng **toàn bộ header thiếu/co lúc mới vào trang trên desktop/laptop**. Scope EXPLAIN/audit, không sửa source/runtime/config onsite. Target `https://minhhaifishery.com/home/`; public IAB1280px/clientWidth1265. Bản runtime mới hiện đã có trên site: `animations.js?ver=1794187362`, root drawer-ready=true. Khi ổn định header1265×86px, ancestors overflow-visible/opacity1/transform-none; không có evidence persistent clipping. Không dùng kiểm này để mark mobile focus/motion PASS.

Evidence lấy riêng hai trạng thái, không giả định DOM sau JS là HTML server ban đầu:

| State | Evidence |
|---|---|
| HTML gốc từ server, chưa chạy JS | Saved `.local/header-first-load-2026-11-09.html`, title Home. `windpress-cached-inline-css` có21218ký tự; PostCSS parse không tìm thấy bất kỳ selector `marine-menu-`. Chỉ `.flex` có, `.w-full/.mx-auto/.items-center/.justify-between/.px-5/.py-5` đều chưa có. Style nằm trước body, nhưng nội dung cache thiếu header. |
| Nguồn mới trong WindPress VFS của cùng response | `/mhf-header.css`7655ký tự đã có `.marine-menu-demo` và companion mới. Không phải nguồn CSS mới chưa được lưu; cache xuất ra chưa đồng bộ với nguồn. |
| Browser sau compiler | Cùng Home sau tải: style cùng ID dài27212ký tự, có companion selectors và các utilities nêu trên. Observer script `observer-CYI7MXkR.js` đang nạp; console cảnh báo browser compiler được dùng thay vì chỉ cached CSS. |

Root cause có evidence: server trả CSS cache cũ/thiếu, compiler browser bù CSS mới sau đó. Layout đầu thiếu owner rules/utilities nên khác layout sau compile. Không kết luận mọi trang hoặc mọi lần load cùng timing; chưa quay filmstrip/đo CLS chính xác. Công cụ browser chỉ quan sát được settled state, nên kết luận cơ chế dựa trên raw-response vs compiled DOM, không bịa first-frame screenshot.

Raw response được đọc bằng curl public URL, không cookie/admin hay mutation. Sandbox network mặc định không kết nối proxy; read-only escalation được duyệt, request thành công. Local JSON summary `.local/header-first-load-2026-11-09-evidence.json`; không đưa full response vào repo/docs vì dài và không cần cho acceptance. Metadata site WindPress3.2.94, Tailwind4/compiled4.3.3; local WindPress3.2.83 chỉ tham khảo major3, không coi hai patch là cùng build. `cache_dir:[]` trong metadata public **không chứng minh cache không tồn tại**; bằng chứng là nội dung CSS cache thực trả về.

| ID | Nhóm | Expected / cách kiểm | Hiện trạng / việc tiếp |
|---|---|---|---|
| MM-LOAD01 | Block UI / Technical | First response đã có complete header styles/utilities; cold reload desktop không đổi layout sau compile | FAIL source delivery: cache21218ký tự thiếu menu, settled27212có menu. Generate lại WindPress CSS cache từ nguồn mới rồi purge HTML/CDN cache; chưa áp dụng. |
| MM-LOAD02 | Block UI / Technical | Cold visit và reload đều ổn định, không flash/co; first-paint/filmstrip thể hiện đúng | Chờ kiểm chứng sau cache rebuild. Không thêm delay/loading overlay/overflow mask để che. |
| MM-LOAD03 | Editor UX | N/A cho audit response cache frontend; block edit/save không đổi | Không mở editor, không thay acceptance save/reopen cũ. |

Human retest: dùng chức năng Generate/Build CSS Cache của WindPress (không chỉ Save stylesheet), bảo đảm nguồn `/mhf-header.css` hiện tại tham gia build, sau đó purge page/CDN cache. View Source Home: ngay trong `windpress-cached-inline-css` phải có `.marine-menu-demo` và header utilities. Kiểm DevTools Disable cache → reload1280/1440px, quay ngắn đoạn lúc vào trang nếu vẫn lỗi; so first response/style với settled DOM. Gửi kết quả build cache, ảnh/video first-load và matched styles. Agent tiếp tục từ evidence đó; chưa tự tắt compiler/hybrid mode hoặc thay header/block content. Rebuild cache không là PHP/plugin build hoặc milestone transition.
