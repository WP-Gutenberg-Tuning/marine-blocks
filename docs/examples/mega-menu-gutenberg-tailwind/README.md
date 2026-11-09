# Gutenberg + Tailwind mega-menu prototype

2026-11-08. User yêu cầu làm thử từ ideation để đưa vào header/footer builder. Core-block composition thử nghiệm, không plugin feature hoặc milestone builder mới. Sau onsite report thiếu responsive, controller đã tích hợp vào runtime hiện có của child theme; source integration khác với đã deploy/PASS trên site. Chỉ Header/menu; không tự thêm thiết kế Footer chưa yêu cầu. Blueprint lấy ba nhóm Products / Food Service / Capabilities từ `docs/ideations/bao-cao-fse-mega-menu.md`§5, dùng tên sản phẩm minh họa của site thay vì copy brand/link của Trident.

## Bản SKVN đã nối runtime — cập nhật2026-11-08

Site Home390px hiện có CSS mới nhưng không có JS drawer: toggle0/dialog0, header cao246px. User report đúng; chỉ cập nhật CSS chưa đủ responsive theo thiết kế đã chọn.

Source đã sửa để không cần gắn script rời trên SKVN:

- `wp-content/themes/skvn-marine/assets/js/animations.js`: shared runtime đã được theme nạp; thêm drawer controller riêng bên ngoài IIFE reveal để không bị chặn bởi reduced-motion/thiếu IntersectionObserver/không có reveal items. Chỉ root `.marine-menu-demo` kích hoạt; editor không chuyển block tree.
- `wp-content/themes/skvn-marine/inc/enqueue.php`: dependency `wp-i18n` và translations domain `skvn-marine` cho Menu/Close labels; giữ handle hiện có và filemtime cache version. Không thêm PHP include, plugin bundle hoặc thay header GeneratePress.
- `mobile-drawer.js` ở artifact là bản mirror lấy từ shared runtime bằng `sync-preview.mjs`, phục vụ preview hoặc môi trường khác. **Trên SKVN không cần enqueue thêm file này** hay paste JS/PHP vào Gutenberg. Init guard vẫn chống duplicate khi có bản nạp cũ.

**Để site nhận bản này:** deploy hai file child theme trên theo workflow hiện có, giữ CSS menu mới trong WindPress, refresh page/CDN cache. Không cần build plugin hoặc paste lại block. PHP check human chạy trước deploy:

```powershell
php -l wp-content/themes/skvn-marine/inc/enqueue.php
```

Sau deploy, ở viewport390px phải có `.marine-menu-demo[data-drawer-ready="true"]`, nút Menu và dialog đóng. Bấm Menu mở toàn bộ links/CTA; Escape/Close/backdrop đóng; resize lên768px trả nav về desktop. Existing static check/9Node VM model tests PASS không thay native browser focus/geometry/motion evidence. Site chưa được agent deploy.

## Dùng thử

**First-load desktop2026-11-09:** Home sau tải đã ổn và runtime đã có, nhưng raw HTML vẫn trả WindPress cache cũ21218ký tự không có menu styles/header utilities. Nguồn VFS `/mhf-header.css` đã mới; compiler browser bù CSS thành27212ký tự sau đó, gây header thiếu/co lúc đầu. Cần **Generate/Build lại CSS cache WindPress**, rồi purge HTML/CDN cache; Save stylesheet/nhìn DOM sau compile không chứng minh first response đã đúng. Không cần thay tiếp CSS hoặc kéo dài preloader để che. Chi tiết MM-LOAD01–03 và số đo trong runbook; lượt này audit-only, cache onsite chưa được agent đổi.

Mở `preview.html` để xem nhanh: standalone HTML dùng trực tiếp `menu.css`, không CDN; title là placeholder và Products mở sẵn. Viewer cố ý đặt các rule kiểu GP/core **sau** menu CSS để lộ conflict cascade. File tự nạp `mobile-drawer.js` cùng thư mục. Desktop mở panel Products; dưới768px, nút Menu mở drawer trượt từ phải cho toàn bộ menu và CTA. Đây không phải runtime WordPress, không dùng thay Gutenberg file và không chứng minh giao diện WordPress/WindPress.

### CSS repair đã triển khai source2026-11-08

Human duyệt repair sau Home audit. `menu.css` là source CSS chuẩn; `windpress.css` được đồng bộ từ phần companion của file này. Không còn `@layer components` hay `@apply` trong companion; các overrides dùng CSS thường ở top level. Group heading dùng `.marine-menu-panel .wp-block-heading.marine-menu-heading` (0,3,0), thắng rule heading SKVN (0,2,1) sau khi bỏ layer conflict. Margin0/link navy/no underline/CTA primary và typography UI được scope vào menu; không sửa GeneratePress hoặc block content.

**Áp dụng cho Home đang dùng WindPress:**

1. Trong stylesheet WindPress đang chứa menu, thay **toàn bộ đoạn CSS menu cũ** bằng nội dung `windpress.css` mới. Giữ CSS khác của site. Dán ở top level, **ngoài mọi named `@layer`**; không giữ lại wrapper `@layer components` cũ bao quanh đoạn mới.
2. Compile/refresh cache theo WindPress rồi tải lại `/home/`. Không cần paste lại Gutenberg hoặc build Marine Blocks plugin.
3. Nếu đã chọn đường nạp file CSS thường bằng snippet, thay `assets/menu-prototype/menu.css` bằng file mới thay vì nạp thêm companion qua WindPress. Chỉ một đường style owner.
4. Kiểm Products: heading12px/700, card paragraph margin-bottom0, links không underline, CTA primary token/14px/600/padding12px20px. Retest mobile/editor theo runbook; JS drawer chưa được tự deploy trong lượt sửa CSS này.

Để đồng bộ sau khi sửa source, chạy `node docs/examples/mega-menu-gutenberg-tailwind/sync-preview.mjs`. Lệnh chỉ refresh hai file ví dụ, không build/lint plugin, không deploy. Không sửa `windpress.css` hoặc copy CSS thủ công vào preview rồi bỏ quên source `menu.css`.

**Human decision2026-11-08:** mobile dùng **hamburger + drawer toàn menu**. Bản trước chỉ xếp panel Products thành một cột, chưa có luồng mở/đóng mobile. Ideation không có evidence mobile Trident đã test; drawer này là thiết kế prototype được human chọn, không tuyên bố tái tạo chính xác animation của site tham chiếu.

### Kết quả kiểm tra site2026-11-08 và đường áp dụng cụ thể

Human báo không dùng được tại `https://minhhaifishery.com/uthf_header/mhf-menu/`. Browser xác nhận **markup đã vào WordPress đúng cấu trúc**, có Site Title/Details/Group/links/CTA. Không phải lỗi copy HTML đã render trong trường hợp này. WindPress có utility CSS nhưng không có bất kỳ CSS rule nào chứa `marine-menu-`; companion controller cũng không có trong script tags và không tạo toggle/dialog. Vì vậy bản giao trước chưa đủ để dùng chỉ bằng paste.

Đã chuẩn bị đường dùng **CSS thường + controller** để tránh phải xử lý compile Tailwind trong bước thử này. Chỉ là gói ví dụ trong docs, chưa tự sửa theme/activate/deploy trên site:

1. Giữ markup Gutenberg hiện đã paste. Không cần xóa và paste lại để sửa thiếu assets.
2. Copy `menu.css` và `mobile-drawer.js` vào **child theme đang active**, thư mục `assets/menu-prototype/` (trên site hiện là `wp-content/themes/skvn-marine/assets/menu-prototype/`). `menu.css` đã expand các utilities cần dùng và scope vào menu; không cần WindPress compile để chạy đường này.
3. Mở `enqueue-example.php`: thêm phần code sau `<?php` vào `functions.php` child theme, hoặc copy nguyên file vào child theme và require từ `functions.php`. Không làm cả hai. File nằm trong docs hiện tại **không được WordPress tự nạp**. Không sửa GeneratePress parent hoặc paste PHP vào block.
4. Clear cache liên quan sau khi áp dụng; kiểm Network có `menu.css`, `mobile-drawer.js`, frontend tạo `.marine-menu-toggle` dưới768px. CSS áp dụng cả editor canvas/frontend; JS chỉ frontend. Không nạp đồng thời `menu.css` với companion `windpress.css` để tránh hai chủ sở hữu style.
5. Builder hiện đang hiển thị header mới cùng header GeneratePress. Cần cấu hình replacement/display của builder trên test page; không che header cũ bằng CSS để coi như đã tích hợp. URL CPT header hiện ra nội dung404; dùng một **public test page URL do human chọn** để nghiệm thu header replacement, vì chưa xác minh CPT có được thiết kế public hay không.

Chỉ dẫn enqueue content CSS dựa trên [WordPress Block Editor Handbook](https://developer.wordpress.org/block-editor/how-to-guides/enqueueing-assets-in-the-editor/): `enqueue_block_assets` dùng cho content frontend và editor iframe từ WP6.3. Builder/editor riêng vẫn phải được kiểm thực tế. Snippet không thay template/display conditions hoặc tự tắt theme header.

PHP syntax check do human chạy nếu dùng snippet: `php -l docs/examples/mega-menu-gutenberg-tailwind/enqueue-example.php`. Gỡ hai hooks/functions ví dụ và hai asset files để đảo ngược; block content không thay đổi.

**Home audit baseline2026-11-08:** tại `https://minhhaifishery.com/home/`, companion CSS **đã có trong WindPress layer components**. GP/core styles ngoài layer thắng menu: heading29px thay12px, paragraph có margin-bottom1.5em, links underline/GP color, CTA xám#55555e. Đây là lỗi cascade của cách viết prototype, không phải paste sai hoặc CSS chưa nạp trong lần kiểm Home này. Preview cũ không chứa các rule theme tương đương nên chưa chứng minh parity. Chi tiết matched rules/số đo và acceptance MM-CSS01–04 tại `docs/testing/mega-menu-gutenberg-tailwind-prototype.md`. Checkpoint audit-only được supersede về source bởi mục CSS repair trên; onsite chưa áp dụng/retest. Header GP trùng vẫn ngoài scope.

### A — Đường WindPress thay thế: cần markup + CSS + JS

**Lưu ý copy:** mở `header.gutenberg.txt` để lấy mã, Ctrl+A → Ctrl+C. Link `.html` mở trong browser sẽ render giao diện và ẩn các block comments; copy giao diện đã render không tương đương copy Gutenberg source. File `.txt` là bản sao UTF-8 của `.html`, phải đồng bộ khi source thay đổi. Đây vẫn chưa là gói chỉ paste là có đủ style/drawer; cần các bước nạp CSS/JS dưới đây.

1. Tạo **Header draft/test template** trong builder có Gutenberg editor. Không paste vào Custom HTML block.
2. Mở Options → Code editor, paste toàn bộ mã từ `header.gutenberg.txt`, chuyển lại Visual editor. Không copy phần đã render của file HTML trong browser. Logo hiện dùng **Site Title** động; thay bằng Site Logo block nếu muốn. Title/logo/site identity do WP sở hữu.
3. Thêm nội dung `windpress.css` vào stylesheet Tailwind hiện có của WindPress ở top level, ngoài named layers. File dùng `@source inline` của Tailwind **v4** để giữ layout utilities; companion styles là CSS thường. Home đã có output v4, nhưng package WindPress version chưa được xác minh. Không paste CSS vào block content hoặc import Tailwind lần nữa. Nếu runtime dùng v3, bỏ dòng @source và đưa các file HTML/class strings vào content scan tương ứng trước compile.
4. Compile/cache CSS theo WindPress và bảo đảm nó nạp vào **cả frontend và editor iframe**. Builder phải cho phép parent overflow visible để desktop panel không bị cắt; kiểm trước khi thay override của theme. Trên SKVN, deploy shared runtime theo mục đầu file; controller tự chạy. Ở theme khác, có thể nạp `mobile-drawer.js` một lần qua asset loader frontend. Không paste script vào Gutenberg content.
5. Mở Products bằng click/Enter/Space, sửa các Heading/Paragraph link trong List View. Bản core Details này là một disclosure có rich content; không phải extension của core Navigation.
6. Thay tất cả URL theo `link-checklist.md`, chọn điều kiện hiển thị trên **test page** của builder rồi Preview. Không publish Entire Site lúc đang dùng placeholder.

### B — Panel cho mega-menu plugin (khuyến nghị thử nghiệm bước kế tiếp)

Copy mã từ `menu-panel.gutenberg.txt` vào Code editor của vùng nội dung dropdown/menu template có hỗ trợ **Gutenberg blocks**, như Ollie Menu Designer. Plugin sở hữu trigger/menu state/mobile/Escape/outside click/positioning; panel chỉ là nội dung3cột. Không bọc panel-only bằng class `marine-menu-demo`, vì rule dropdown trong header demo không nên tranh owner với plugin.

Header/footer replacement plugin chỉ thay nơi render template; không tự biến mọi Group thành mega menu. Max Mega Menu dùng hệ menu/widget/pattern của riêng nó; không khẳng định panel Gutenberg có thể paste vào mọi ô của plugin. Không dùng Elementor cho artifact này.

## Hành vi / giới hạn

- Desktop ≥768px: Products mở panel ngang3cột dưới header; About/Contact và CTA ngoài panel. Native Details dùng click/Enter/Space. Desktop chưa có Escape/outside-click/hover intent/auto edge detection.
- Mobile <768px: hamburger mở native modal `dialog`, toàn bộ menu và CTA nằm trong drawer. Drawer rộng tối đa420px, chừa24px để thấy backdrop ở màn hình nhỏ; phần dài cuộn dọc. Products vẫn là Details, ba nhóm xếp dọc bên trong drawer.
- Mở trượt từ phải240ms, đóng180ms; backdrop fade cùng nhịp. Nút Close, Escape, chạm backdrop hoặc chọn link đều đóng. Native dialog giữ focus trong modal; đóng trả focus về Menu. Resize về desktop đóng modal, trả các node gốc về header và gỡ khóa cuộn. Không clone navigation/IDs. `prefers-reduced-motion: reduce` bỏ chuyển động cả drawer lẫn backdrop.
- Nếu JS hoặc native dialog không hỗ trợ: menu gốc vẫn hiện trong flow, không tạo hamburger chết. Editor không chạy enhancement; vẫn chỉnh các block gốc. Không autoplay/sticky/search engine.
- Tất cả tên/links là blocks editable, không flatten thành Custom HTML; không inline style/script trong saved markup. Site title dynamic không phải ảnh mock/logo client hardcode.
- Tailwind/WindPress được user yêu cầu rõ cho **website prototype**; đây là ngoại lệ output utility classes so với skill translation mặc định. Không biến Tailwind thành dependency của Marine Blocks runtime hoặc đổi theme contract/migration identity. Các class `marine-menu-*` chỉ là namespace artifact, CSS đi kèm phải được nạp, không phải class đã tồn tại trong theme.
- Canvas/editor có thể khác frontend; trong editor panel position static để dễ chỉnh. Details vẫn phải mở trước khi sửa inner content. Chiều rộng lấy host wide-size, co trong parent; không100vw/margin âm/overflow mask.

## Translation contract / evidence

- **project_contract:** core Group/Details/Heading/Paragraph/Buttons/Button/Site Title, target builder dùng Gutenberg, WindPress cho site styling; controller tích hợp shared theme runtime, không sửa source plugin.
- **css_source_scan:** theme đã có tokens navy/primary/fresh-sky và wideSize1200; không có class menu panel tương đương. Shared card/frame classes không phù hợp navigation.
- **implemented_classes / missing_theme_classes:** không dùng class theme chưa có. `marine-menu-*` được định nghĩa trong companion CSS, chưa shipped/enqueued ở site.
- **brand_source_scan / mapping:** text/navy → --skvn-color-blue-950, primary CTA/focus → --skvn-color-primary, hover → --skvn-color-fresh-sky; fallback values giữ preview độc lập. White/border/slate chỉ scaffold Tailwind, chưa thêm token vào theme.
- **brand_mismatch:** không gold/dominant navy background; không copy Trident identity/content. Pattern label names/supplied links là fixture, cần review thật.
- **token_changes_needed:** không đổi source tokens; cần WindPress compile/enqueue. Typography/spacing là prototype presets, chưa production governance.
- **animation_contract:** mobile drawer Web Animations240/180ms trong shared `animations.js`; reduced motion tức thì. Example mirror không phải runtime owner thứ hai. **not_translated:** sticky-on-scroll/search/desktop hover engine/cross-theme conditions/mobile Trident behavior, chưa test site gốc.
- **assets_needed:** shared theme runtime + WindPress CSS; example mirror dùng cho standalone preview/theme khác. Không ảnh/font/CDN mới. Optional Site Logo cần user chọn media. Panel-only không nạp controller này vì menu plugin sở hữu mobile behavior.
- **verification:** block parser/static CSS checks ghi riêng với runtime. Chưa WordPress save validation, Tailwind compile hoặc browser geometry PASS. Không install/deploy/publish.

Static evidence2026-11-08: default block parser lấy từ local WP runtime `D:/Github/minhhaifish/wp-includes/js/dist/block-serialization-default-parser.js` đọc header28blocks và panel18blocks, không freeform markup. Không `<script>`, `<style>` hoặc inline event handler trong Gutenberg files; PostCSS parse stylesheetPASS. Parser này không gọi Gutenberg isValidBlockContent/save validation; chưa khẳng định không có invalid-block khi paste. Runtime checklist: `docs/testing/mega-menu-gutenberg-tailwind-prototype.md`.

Mobile evidence2026-11-08: companion JS và CSS đã có source; preview nạp controller ngoài content. Kiểm tĩnh PASS: JS syntax bằng Node VM, PostCSS parse cả source/preview, preview có đúng một reference controller, không còn @apply/@source chưa expand, không có viewport-width/overflow-x mask. Parser Gutenberg vẫn28/18blocks. Browser tool từ chối mở URL `file://`, nên chưa quan sát animation, focus native dialog hoặc geometry. Human mở file trực tiếp và chạy checklist trước khi kết luận runtime PASS.

Nguồn: [WP Details block](https://wordpress.org/documentation/article/details-block/), [Ollie Menu Designer](https://olliewp.com/docs/design/menu-designer/). Capability plugin là tài liệu vendor, không evidence đã test trong SKVN.
