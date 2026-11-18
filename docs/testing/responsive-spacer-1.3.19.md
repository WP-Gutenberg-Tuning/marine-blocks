# Responsive Spacer — onsite test plan

## Width follow-up — RS-W01–03 (2026-11-07, current1.3.20)

Execution2026-11-07: human cho sửa. Source root bây giờ `alignwide` (editor-only), editorCSS không còn max-width:none/margin-inline:0. H60 vẫn padding30px mỗi phía, save/frontend/schema unchanged.5/5 model/viewport/runtimeCSS tests + TSX/CSS parse PASS; không geometry/browser PASS. **Source ready, chờ human build + onsite RS-W01–03**; đoạn planning phía dưới là baseline cũ. Expected DOM sau build: cùng root có alignwide và frame-spacer, không alignfull. Kiểm stylesheet loaded đúng iframe; không chỉ grep local build.

Human DOM evidence: selected root của `skvn-marine/responsive-spacer` có cả `alignfull` và `skvn-editor-preview-frame--spacer`; indicator H60 dùng padding30px mỗi phía, Desktop60/Tablet60 inherited/Mobile10. Root alignment đã xác nhận; parent/computed/rect và URL/build chưa có. Dùng fixture này khi so trước/sau, không đổi height để làm khung có vẻ gọn hơn.

Planning only; source repair chưa thực hiện. Plan055 đầu file ghi repair nhỏ. Trước follow-up, giữ/chạy các RS carry-over bên dưới, không thay toàn bộ acceptance bằng width check.

- **Target/setup:** trang editor trong screenshot human ngày2026-11-07; URL/pageID/build/WP/browser và iframe mode TBD, ghi trước kiểm. Trên draft test được phép, có Spacer và Carousel hoặc Category Grid Wide trong cùng parent; không so hai block có parent/alignment khác. Có normal parent, Group và Columns hẹp; không chỉnh live site tự động.
- **Steps:** ghi baseline DOM classes/computed width/max-width/margins/padding/box-sizing + rect Spacer/reference/parent; phân biệt rộng hết canvas với tràn document. Sau human build/deploy đúng assets, lặp desktop có scrollbar,768/390/320px và Inspector mở/đóng. So Wide reference trong cùng parent, thử nested/Columns; nhập H0/60/400, unset overrides rồi Save/reopen và kiểm frontend.
- **Expected/PASS:** Spacer cùng mép Wide reference trong cùng parent (sai số rounding<=1px), co trong parent hẹp, rect không ra ngoài parent và scrollWidth<=clientWidth. Mint frame/labels/focus không mất; chiều cao/inheritance/cap200/preview tier giữ nguyên. Frontend height/save/schema không đổi, không lưu alignment/chrome editor. Nếu vẫn rộng khác, ghi matched rule/selector; không thêm overflow hidden/clip hoặc đoán cache.
- **Evidence:** trước/sau screenshot cùng build, URL/pageID/version, root/parent/reference rect và computed styles, stylesheet URL/version + frame selector trong registered CSS/iframe (CASE-008), saved attrs/console. FAIL ghi expected/actual theo RS-W01/02/03; chưa đo là Chờ kiểm chứng, không PASS từ source.

Ngày 2026-11-05. Status: **Đã có source / Chờ kiểm chứng onsite**. Human cho implementation+commit trong **V1 / 1.3.19**; không ghi runtime PASS/deferred acceptance.
Spec: `.context/planning/055_VER_1_3_19_RESPONSIVE_SPACER_PLAN.md` (RS-*).

Source self-check: 13/13 Node tests PASS (5 Spacer +8 shared frame), model/viewport/CSS-contract và geometry mô phỏng, không phải WordPress/browser evidence. Build/lint/onsite chưa chạy.

## Target và preconditions

- Target: một draft test Page onsite, URL/post ID **TBD do human cung cấp trước runtime test**. Không giả định screenshot thuộc `/home/` hoặc `/test-page-2/`.
- Không tự sửa trang live. Human tạo draft/preview fixture sau khi source/build triển khai ở môi trường test được chỉ định.
- Ghi WordPress/plugin version, commit/build, browser, editor iframe mode, theme và WindPress state.
- Có ít nhất một desktop viewport với scrollbar dọc. Chuẩn bị normal parent gap0, Group gap24, Columns hẹp; block nội dung trước/sau có margin0 để đo baseline.
- Fixture A Desktop30 / Tablet20 / Mobile12; B Desktop400 / Tablet200 / Mobile0; C Desktop30 và hai override unset. Thêm Spacer adjacent Collection/Category và hai Spacer liên tiếp.

## Steps, expected và criteria

| Test / IDs | Exact steps | Expected / PASS |
|---|---|---|
| T1 RS-UI-01 | Frontend fixture A ở width767,768,1023,1024; thêm767.5/1023.5 nếu devtools hỗ trợ | Height lần lượt12,20,20,30; fractional widths không hở rule; đo wrapper, không đo tổng section gap |
| T2 RS-UX-02 | Trong editor set lần lượt0,1,20,30,199,200,201,400; inspect vùng indicator | Padding mỗi phía0,0.5,10,15,99.5,100,100,100; số thật giữ nguyên; cap note chỉ ở201/400 |
| T3 RS-UI-01/UX-02 | Save fixture B, reopen editor rồi frontend các tiers | Editor400 cap ở100+100; frontend Desktop400/Tablet200/Mobile0, không cap frontend |
| T4 RS-UX-03 | Native preview Desktop/Tablet/Mobile, resize canvas; lặp Spacer trong Columns | Tier/indicator theo viewport canvas; không đổi tier vì cột hẹp hoặc sidebar rộng; ghi actual width khi native label khác tier |
| T5 RS-UX-04/05 | Fixture C đổi Desktop60; set Tablet20; Mobile0; reset Mobile, reset Tablet; Undo/Redo | T/M kế thừa đúng; zero giữ riêng; reset bỏ override, không ghi zero; Undo/Redo từng thao tác |
| T6 RS-UX-04 | Keyboard nhập âm, số lẻ, clear rồi blur, paste text/Infinity vào input phù hợp | Không lưu invalid/NaN; clear không thành0; lỗi/help đọc được, focus không mất |
| T7 RS-UX-01/05 | Tab chọn/đổi values, duplicate/reorder/delete/Undo, multi-select, switch sang Collection | Controls target đúng; không hiện style cũ; frame0 vẫn chọn được, native focus rõ |
| T8 RS-UX-01/TECH-03 | Selected/unselected tại canvas320px, zoom200%; xem Spacer cạnh Grid/Carousel/Category | Mint frame đúng plan, text wrap không overflow; một frame; không đổi palette/geometry consumers cũ |
| T9 RS-UI-02/03 | Tắt JS frontend, thử parent gap0 rồi24; inspect empty wrapper, xem hai Spacer liền nhau | H vẫn đúng; không chrome/color/tab stop; gap parent được ghi riêng; không margin âm che gap |
| T10 RS-UI-02/TECH-02 | Test theme khác/no WindPress nếu test env cho phép; xem loaded CSS editor/frontend và page không Spacer | Spacing không phụ thuộc theme; editor CSS thực sự loaded; không runtime JS/API mới cho Spacer; asset scope ghi thực tế |
| T11 RS-TECH-01/04 | Save/reopen/copy-paste fixture; human chạy build/lint, kiểm artifact khi packaging áp dụng | Không invalid-block; input types/effective values giữ đúng; output build/lint và zip inventory đủ |

FAIL khi bất kỳ expected liên quan không đạt; thiếu môi trường/evidence ghi **Chờ kiểm chứng**, không đánh PASS. Test chỉ áp dụng sau khi controls/default/breakpoint baseline đã được chốt theo spec.

## Human terminal commands

Build metadata trước khi mở Inserter. Generated build đang chưa chứa block mới; không upload source-only commit như artifact đã build.

```bash
source /home/shinkuro/.nvm/nvm.sh && nvm use 20 && cd /mnt/d/Github/skvn-marine/wp-content/plugins/skvn-marine-blocks && npm run build && find modules/ -name "*.php" -exec php -l {} \;
php -l /mnt/d/Github/skvn-marine/wp-content/plugins/skvn-marine-blocks/skvn-marine-blocks.php
grep -r "registerBlockType" /mnt/d/Github/skvn-marine/wp-content/plugins/skvn-marine-blocks/src/
```

Sau build, kiểm `build/responsive-spacer/block.json`, selector `.skvn-editor-preview-frame--spacer` trong registered `build/style-index.ts.css`; onsite inspect stylesheet thực tế trong canvas. Nếu đóng gói, dùng workflow deploy hiện hành và verify zip có `assets/css/responsive-spacer.css` và `build/responsive-spacer/block.json`. Không có PHP require/include mới; không cần module runtime mới.

## Evidence human gửi lại

Follow-up2026-11-06 — preview chrome (055§13), source chưa nghiệm thu: dùng draft Home trong screenshot human; ghi exact edit URL/build/WP/browser khi test. Sau build/reload kiểm frame mở theo root canvas như khung Category, margin trên/dưới10px, không dính Slider/Heading; nhãn 🖥️/📟/📱, screen reader chỉ đọc text. Đo computed margins/frame-parent rect/scrollWidth-clientWidth tại desktop có scrollbar,390px,zoom200%; frame không vượt parent. Kiểm Group/Columns hẹp, hai Spacer, parent gap0/24 (có thể cộng thêm, không hứa tổng10px). Switch device/đổiH0/60/200/400, Undo/save/reopen: indicator/cap giữ đúng, frontend H/saved markup không đổi, không invalid-block. Gửi ảnh trước/sau + rect/styles/console. Editor lag chưa chẩn đoán, không dùng lượt này claim đã fix lag.

- URL/post ID, build/commit, WP/browser/theme, viewport actual widths.
- Screenshot frame mint Desktop/Tablet/Mobile, H0/200/400, canvas320px và selected focus.
- Video ngắn inheritance/reset/Undo/save-reopen; console notes và lỗi invalid-block nếu có.
- Computed indicator paddingTop/paddingBottom; frontend wrapper rect.height/computed height; document scrollWidth/clientWidth; section gap riêng ở parent0/24.
- Contrast ratios text/indicator/chip trên actual backgrounds; asset handles/network hoặc computed styles chứng minh editor CSS loaded.
- Output build/lint do human chạy. Submission ID/CFDB7/email: N/A, block không có form/query.

Sau evidence, agent đối chiếu RS-* và sửa source khi được giao; không yêu cầu human lặp lại fixture đã có. Nếu human hoãn test sau khi milestone được chọn, cập nhật status Deferred + target milestone trong MILESTONES.md theo protocol; hiện chưa có quyết định hoãn.
