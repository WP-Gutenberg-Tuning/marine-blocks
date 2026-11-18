# Hero Slider — contrast repair và kiểm chứng fade

**Detailed native editor suite2026-11-09:** [slider-editor-ui-1.3.21.md](slider-editor-ui-1.3.21.md) expands SED/AF cases into P1 feasibility N01–03 and full UI U01–09 from plan063. Use it for redesign; keep HERO-* contrast/flicker fixtures/results here. No new implementation/tests executed. Official API inventory must be pinned to actual WP/Gutenberg runtime before native proof.

**Scope update2026-11-09:**1.3.21 là **Hero Slider Contrast Repair + Slider Editor UI Redesign**, current1.3.20. Contrast source có/runtime pending; redesign mới nhận scope, chưa mockup/coding/start. Implementation/version TBD dưới đây là checkpoint cũ; HERO-* và SED-* phải có evidence riêng, chưa PASS.

Ngày: 2026-10-19 (cập nhật sau audit source). Status: **Chưa chạy — test plan**, implementation/version TBD; không phải PASS hoặc test đã được human defer.

Plan: `.context/planning/044_HERO_SLIDER_CONTRAST_AND_FLICKER_REPAIR_PLAN.md` (đã sửa 2026-10-19 sau audit: specificity thật của rule theme, cơ chế `!important` của WP preset, và hướng sửa mới "carrier + inherit" thay cho "gán trắng trực tiếp").

## Target và preconditions

- Report URL: https://minhhaifishery.com/test-product-carousel/ — Hero bên dưới Featured products. Không chỉnh production/content tại URL này khi chưa được human cho phép.
- Fixture bổ sung cần tạo trên staging hoặc page được human cho phép; ghi URL thật trước khi chạy. Local thiếu page không phải source failure.
- Ghi commit/build, plugin/theme version, URL asset/version query, browser/version, OS, viewport/DPR, login/cache, reduced-motion state và thời điểm. Đảm bảo asset đúng bản, không dùng chỉ version header để suy ra CSS đã cập nhật.
- Human đã chạy build/lint và có output. Kiểm trước sửa trước khi deploy repair; sau sửa giữ nguyên content/settings để so.
- Editor phải là stacked preview, không Swiper/autoplay.

## Fixtures tối thiểu

| ID | Dữ liệu/trạng thái |
|---|---|
| F1 | Hero hai slide, không ảnh, gradient mặc định, heading/paragraph/CTA không custom color |
| F2 | Hero có ảnh nền/overlay; text mặc định |
| F3 | Heading/paragraph palette color; custom inline color; rich-text span có màu |
| F4 | Group có text color chứa heading/paragraph, kể cả block con không tự set màu |
| F5 | CTA không custom; text-only custom; background-only custom; cả hai; gradient; custom hover từng kênh |
| F6 | Hero saved content cũ, mở lại và save; một Hero mới từ inserter |
| F7 | Product Showcase, Card Carousel; core button ngoài Hero; một Product/Post Collection smoke dùng chung bundle |

Không cần nhân mọi tổ hợp. F1/F5 kiểm full states; F2/F3/F4/F6 kiểm màu và parity; F7 regression nhỏ.

## Các bước và pass/fail

Nguồn thiết kế và đối chiếu source: `.context/planning/044_HERO_SLIDER_CONTRAST_AND_FLICKER_REPAIR_PLAN.md` §4.2–§4.3. Cơ chế được kỳ vọng sau patch:

- Hero đặt `color: #fff` trên `.skvn-slide__content` (carrier).
- Heading/paragraph/link trong Hero được đặt `color: inherit` ở specificity cao hơn rule theme, nên chúng **kế thừa** thay vì bị gán thẳng.
- Hệ quả bắt buộc phải kiểm: màu của Group chứa heading phải tới được heading; palette color phải thắng; reset phải trả về trắng.

1. Chụp F1 ở rest cả hai slide trước/sau; DevTools ghi computed color của heading/paragraph và CTA text/background, kèm selector/declaration/file thắng. Sau repair default text phải sáng (`#fff` hoặc giá trị tương đương), CTA default theo visual đã duyệt; không trắng chữ trên nền trắng. FAIL nếu vẫn rơi về `#082f49` / `#334155` trên gradient tối.
2. Chạy F2: có ảnh và tháo ảnh trên fixture được phép. Default text không phụ thuộc việc có class ảnh. Kiểm `.skvn-slide--has-background` tiếp tục phản ánh ảnh thực tế; không mất media/layer. Ghi rõ class có/không trước và sau khi thêm ảnh.
3. Chạy F3/F4: chọn màu, save, reload frontend; mở lại editor; reset về Default. Explicit values phải giữ, reset trả về hero fallback. **F4 là điểm dễ FAIL nhất**: Group có text color phải làm heading bên trong đổi theo màu Group, không bị ép trắng. FAIL nếu heading vẫn bị theme chặn hoặc Group color bị ép trắng.
4. Với từng CTA F5, kiểm normal/hover/Tab focus; custom hover text và background riêng. Palette/gradient và core style variants phải giữ; fallback không phủ gradient, focus indicator còn thấy. Trường hợp background custom nhưng không text custom: kiểm core/theme behavior hiện có, không tự coi navy text là default bắt buộc. Ghi riêng kết luận về rule GeneratePress mà bug report suy luận (`a.wp-block-button__link:not(.has-background)`) — đây là điều kiện quyết định có đổi nền CTA hay không.
5. Kiểm link in-container trong Hero (nếu có): sau patch link kế thừa màu Hero. Ghi lại ảnh để human quyết định có giữ hay không.
6. F6 mở/save/reopen: không invalid-block warning, không mất attrs, không cần migrate nội dung cũ để có default. So editor với frontend của cùng content.
7. Kiểm F1 và CTA chính ở desktop, tablet và mobile; ghi viewport thực tế. Không đổi wrap/geometry so baseline, không phát sinh overflow. Tab tới controls/CTA và kích hoạt keyboard, kiểm trạng thái focus và link vẫn hoạt động.
8. F7: màu/presentation không đổi ngoài Hero; navigation/link còn chạy, không lỗi console mới liên quan repair.
9. Bật reduced motion ở OS/browser rồi reload: ghi behavior thực tế, không có motion mới do patch; editor vẫn static. Tắt lại để kiểm fade thường.

## Fade và hiện tượng chớp — outcome riêng

1. Trên F1 sau contrast fix, ghi config/effect/speed, dùng arrows, keyboard, pagination qua ít nhất ba transition và hai slide. Autoplay kiểm riêng, tránh để focus/visibility/hover làm sai điều kiện; ghi nguyên nhân nếu không kiểm được.
2. Lưu clip hoặc frames có timestamp trước/giữa/sau transition; không chỉ ảnh sau fade.
3. Nếu tái hiện trắng ↔ tối: dùng DevTools/browser có thực thi JS để buffer samples rAF cho cùng node, định danh ổn định theo slide identity thay vì DOM order. Thu timestamp, class/inline style, computed color/opacity của heading/paragraph/CTA, slide và ancestor opacity, background, transition events/indices nếu truy cập được.
4. Không log per frame ra console. Lưu JSON sau phiên đo, cùng clip và stylesheet/cascade tại frame lỗi. Không đổi effect/duration trong phép so trước/sau repair.
5. Nếu màu computed đổi, tìm declaration/mutation tương ứng. Nếu màu không đổi nhưng vẫn thấy artifact, ghi nhận và thu trace trước khi quy cho compositing/text-shadow.

Outcome được phép: **PASS/FAIL contrast**, và riêng **chớp tái hiện / không tái hiện trong môi trường đã ghi / chưa kiểm được**. Không kết luận engine đã sửa chỉ vì ba transition không thấy chớp.

## Evidence human gửi lại

- Build/lint output, build/commit/asset identity và môi trường.
- Ảnh frontend/editor F1, F3/F4, CTA states; file ảnh đính kèm trực tiếp hoặc đường dẫn truy cập được trong chat này, tránh sandbox link của phiên khác.
- Computed values + winning rule source, xác nhận save/reopen/reset và invalid-block/console status.
- Clip fade, JSON khi tái hiện; nếu thiếu DevTools/JS ghi giới hạn rõ.
- Bảng kết quả theo HERO-UI-01/02/03, HERO-UX-01, HERO-TECH-01/02/03 của plan, giữ mục chưa kiểm ở trạng thái Chờ kiểm chứng.

Agent tiếp tục từ evidence để chỉnh cascade hoặc mở điều tra chớp cụ thể; không bắt human chạy lại fixtures đã đủ bằng chứng nếu source mới không ảnh hưởng chúng.

## Slider Editor UI Redesign — tests bổ sung (planned2026-11-09)

Spec044§10/053. Chưa có mockup/implementation mới để chạy. Sau chốt thiết kế phải bổ sung exact labels/control locations/expected geometry; các cases sau chưa phải approval một kiểu preview cụ thể.

Target: xác nhận edit URL report page trên và test copy/staging cho Hero/Showcase/Card Carousel/default; không tự sửa production. Setup: human-built assets đúng commit, old/new saved content, empty/one/many/limit/missing media/long text, desktop/narrow canvas/sidebar, giữ frontend settings để so trước/sau.

| IDs | Steps sau approved design | Expected/PASS | Evidence |
|---|---|---|---|
| SED-ED01/02 | So canvas/Inspector với mockup từng variation; chọn parent/child rồi đổi setting, thu hẹp editor/sidebar | Không mất content/controls, đúng target, hierarchy/labels/help theo design; không horizontal overflow | Mockup/decision, screenshots/attrs/rect |
| SED-ED03 | Add/select/reorder/remove/duplicate, native List View, RichText/IME, Undo/Redo, Save/reopen, đạt limit | Content/order/focus đúng, không mất chữ/invalid-block; limit5 Hero/Showcase giữ; không store song song | Video/saved content/console/focused element |
| SED-ED04 | Empty/1/many/limit/missing/long, selected/unselected, blocks kề nhau/narrow parent | Frame/label/palette theo design, spacing053, notices rõ; preview static không giả autoplay | Shots/gap/boxes/clientWidth/scrollWidth |
| SED-TECH01 | Editor cold load, network/stylesheets, reopen old content, kiểm không Swiper/autoplay editor | CSS thực sự enqueue đúng handle, không chỉ có trong build; saved schema giữ, không leak/init thừa | Assets/network/DOM/saved diff/console |
| SED-UI01 | Frontend smoke mọi variation cùng content/settings trước/sau; HERO-* bị ảnh hưởng | Layout/navigation/motion giữ baseline, contrast/custom colors đúng; chớp outcome riêng | Paired shots/video/build identity/HERO và SED results |

Tất cả Chưa làm/not run. Human gửi URL/build/browser/width/role và expected-vs-actual mỗi ID; agent tiếp tục từ evidence. Một screenshot hoặc model test không PASS toàn redesign. Step Slider ở1.3.24, ngoài bộ này.

## Artifact fidelity gate — Concept01 (2026-11-09)

Required reference: [contract062](../../.context/planning/062_VER_1_3_21_SLIDER_EDITOR_ARTIFACT_IMPLEMENTATION_CONTRACT.md), [canonical HTML](../artifacts/editor-ui/slider-editor-redesign-prototype.html) and [notes](../artifacts/editor-ui/slider-editor-redesign-prototype.md). Human accepted the layout as implementation reference; this is not Gutenberg runtime PASS. Match source hash before comparison; do not modify the artifact to hide implementation drift.

For AF01–10, record actual source file:symbol, status, screenshot/DOM evidence and deviations. Open reference and real Gutenberg editor with matched content/available canvas width/font and selected slide. Capture wide, narrow (including Sidebar open/nested parent),10-slide list where allowed, Hero limit5, selected/unselected and long-content/missing/empty states. Side-by-side screenshots must identify which is reference vs actual, build/URL/browser/viewport/root width and hash. Use root/rail/stage/footer rectangles, list scrollTop/active row bounds and loaded stylesheet URLs to explain differences; raw viewport alone is insufficient.

PASS requires the AF checklist plus native SED/HERO tests; matching detached HTML is insufficient. Fail the fidelity gate if frame/background/left-list/right-stage/Arrow–Add–Pagination captions disappear, samples become editor navigation, or layout is changed without a recorded human decision. Capture differences in062 deviation register before pivot. Native toolbar/List View/accessibility adaptations must be explicit, not silently dropped to match a picture. Missing evidence remains pending. No screenshot/geometry evidence has been generated in this docs-only lock task.
