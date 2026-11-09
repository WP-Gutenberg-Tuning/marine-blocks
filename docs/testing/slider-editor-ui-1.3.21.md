# Slider Editor UI1.3.21 — native implementation/fidelity runbook

2026-11-09. **Human P1 UX accepted; Concept01 P2/P3 có source, full UI/runtime Chờ kiểm chứng.** Current source/gate063§13; P1 flag/harness§2 bên dưới là lịch sử, không cần bật lại.19selection/Add tests PASS; human presentation10/10 PASS (64421.461315ms). Specs: [063 execution](../../.context/planning/063_VER_1_3_21_SLIDER_EDITOR_UI_EXECUTION_PLAN.md), [062 fidelity](../../.context/planning/062_VER_1_3_21_SLIDER_EDITOR_ARTIFACT_IMPLEMENTATION_CONTRACT.md), [044 scope/contrast](../../.context/planning/044_HERO_SLIDER_CONTRAST_AND_FLICKER_REPAIR_PLAN.md).

## 0. Current handoff — Concept01 sau human xác nhận P1

Human: “Đã test, đúng UX” sau screenshot/checklist. Ghi UX acceptance cho flow đã test, không suy3/10Slide/multi/reorder/lock/performance hoặc exact build/iframe chưa báo. Tiếp tục source frame/rail/footer theo063; final layout phải recheck native flow và U01–09.

1. Human chạy build/lint§4, cập nhật cùng phiên bản plugin bootstrap + build/ + assets/css/slider-editor.css. Agent chưa build/deploy; không sửa bundle bằng tay. Current metadata1.3.20 giữ.
2. Mở `https://minhhaifishery.com/wp-admin/post.php?post=22&action=edit` để xem existing Home; chỉ edit fixture trên approved draft/test copy. **Không cần `skvn-slider-editor-proof`**: gate tạm và PHP bootstrap đã bỏ. P1 notice/switcher cũ phải được thay bằng outer frame lavender + rail/stage + footer theo Concept01.
3. Chụp actual editor rộng và hẹp cùng available width với canonical artifact; ghi build/hash/viewport/root width, iframe, active type/variation. Kiểm background/viền/label/count, native content, bounded rail và captions. Không coi screenshot prototype là actual evidence. Nhắc lưu ảnh editor cho SP-02 theo deploy workflow, chưa dùng như marketing PASS.
4. Re-run switch/IME/List View/Undo/save và U01–09;10default/Card rail capped, Hero/Showcase Add disable5, empty/off/legacy/locks, resize Sidebar/Columns/narrow selector không mất focus. Đối chiếu canvas.scrollWidth/clientWidth và root/rail/stage/footer rect, actual gap có scrollbar dọc. Native content có thể cao hơn artifact do actual typography; không clip để ép chiều cao.
5. **Human presentation result2026-11-09:10tests/10PASS/0FAIL/0skipped/0cancelled,64421.461315ms (~64.42s).** Command theo handoff: `node --test --test-isolation=none tools/tests/slider-editor-presentation.test.mjs`; target suite có10test cases. Supersedes pending sau agent stop10s không output; không cần chạy lại nếu source không đổi. Phạm vi actual production modules/React SSR với WP/store/rich-text API mocks và JSDOM; không actual Gutenberg/native mounts/IME/history hoặc CSS geometry. Human terminal/runtime version/build chưa kèm output; không tự điền.19selection/action và syntax10files giữ riêng; build/lint/CSS/native/paired screenshots vẫn pending.
6. Nếu layout không xuất hiện, [diagnostic](slider-editor-proof-diagnostic.js) hiện kiểm **jsHasConcept01**; marker bootstrapRequested/jsHasP1 cũ đã retire. Report script URL/status/markers + screenshot/console. Không kết luận cache/deploy từ source local. No native/runtime PASS từ source hoặc SSR tests.

## 1. Target / preconditions

- Candidate frontend URLs from existing reports: `https://minhhaifishery.com/test-product-carousel/` (historical Hero report), `https://minhhaifishery.com/home/` (current site context). Confirm which still contains applicable Slider; record actual edit URL. No invented page IDs/URLs. Use an approved draft/test copy/staging for fixture edits and permission/plugin-toggle cases; no automatic production changes.
- Fill before runtime: WP version, active Gutenberg plugin/version or none, plugin/theme build/commit, editor iframe yes/no, browser/OS/version/DPR, role/caps, exact page/edit URLs, viewport and available frame/container width, cache state and stylesheet URLs. Match versioned API sources in plan063 ledger.
- Human runs deferred Category/Archive and applicable Sidebar/Slider baseline first, then human build/deploy editor implementation when authorized; compare same content before/after and keep old failures separate.
- Canonical artifact hash from062 must match; keep HTML unchanged. Open artifact and real editor side-by-side at matched available widths and comparable content/font. Never use HTML prototype screenshot as actual Gutenberg evidence.
- Fixtures: Hero3slide, Showcase3slide, Card/default10slide,0/1slide via native operations, old saved Slider, two Slider instances, deep heading/paragraph/buttons/Columns/Image in a Slide, no/missing image, long title/text/unbroken token, navigation off, saved legacy values, locked/template-restricted block as permitted. Back up test page content; do not remove production slides to create states.

## 2. P1 feasibility gate — run before full rollout

| Case | Exact steps | Expected / pass-fail | Evidence |
|---|---|---|---|
| N01 / AF04, SED-ED03 |3native Slide blocks; select deep heading in Slide2 via List View; type Vietnamese with IME, add bold/link native formatting; select Slide1 from rail then return to2 | Stage reveals correct descendant target; complete composed text/formatting retained, no clone/reset/unmount loss. Native content still editable; hidden slides have no tabbable canvas subtree/ghost space. | Video, DOM/block-tree/clientIds, content snapshot, focused node |
| N02 / AF04 | Move between Slider parent, Slide and nested block; select another Slider then return; keyboard Tab and Inspector settings | Active target per root remains valid; no effect loop/focus stealing; caption/Inspector target correct; inactive Slide selection reveals before focus | Selected IDs/parents/focus log + video |
| N03 / SED-ED03 | Undo/Redo text, native reorder/delete/duplicate, native multi-select copy/delete/Undo, Save/reopen, toggle visual/code editor where supported | Order/content/history/capabilities match native baseline; no invalid blocks or extra saved UI attrs; multi-selection not silently cleared by active-state effect | Saved markup diff, video, API/version info + console |

**Gate:** if N01–03 fail, do not roll P2/P3 across all variants. Record actual tagged API/wrapper behavior and repair/propose based on evidence. Do not silently return to stacked final UI or embed prototype. Missing runtime access = pending, not model PASS. No need to reapprove the accepted visual reference for a conforming native implementation.

### 2.1. Chạy P1 source hiện tại

Environment checkpoint: human xác nhận **WordPress7.1.4**. Gutenberg plugin active/version và iframe mode chưa xác minh. Helper suite chạy **Node24.20.0**; `stripTypeScriptTypes`/test-isolation là tooling test mới, không yêu cầu đổi Node20 build workflow của plugin.

P1 là numbered switcher tối thiểu, **chưa phải giao diện rail/footer Concept01**. N01 dùng switcher này thay rail; kiểm rail/thumb/footer ở U01–09 sau gate.

1. Human chạy build/lint bên dưới, đưa matching assets và `assets/css/slider-editor.css` cùng bootstrap lên **môi trường test được phép**. Agent chưa build/deploy. Ghi commit/build, WP version, Gutenberg plugin active/version hay none, browser và iframe mode. Local source7.1; frontend snapshot onsite7.1.4 chỉ evidence tham khảo, chưa pin editor runtime.
2. Mở approved draft/test-copy có Slider3Slide và nội dung native heading/paragraph/buttons/Columns; ghi edit URL thật. Không sửa nội dung Home production để tạo fixture. Chụp baseline không flag, lúc này vẫn stacked UI.
3. Thêm **`&skvn-slider-editor-proof=1`** vào edit URL đang có query (hoặc `?skvn-slider-editor-proof=1` nếu chưa có), trước fragment `#` nếu có. Reload. Phải thấy notice `Native editing check` và numbered Slide buttons. Không có notice → ghi URL/build/console, chưa kết luận test PASS.
4. Chạy N01–03 ở trên. Chọn nested content qua native List View và qua switcher; gõ tiếng Việt, bold/link, đổi Slide rồi quay lại; Undo/Redo/delete/reorder/duplicate/multi-select/save/reopen. Kiểm3native Slide wrappers vẫn mounted, chỉ active có geometry; inactive không tabbable/ghost space. Hai Slider giữ active riêng. Native selection không bị effect thay hoặc focus bị giật.
5. Thử `Edit as HTML` cho một Slide: harness phải báo unavailable và giữ native presentation, không mất data; trở lại visual thì tiếp tục focused proof. Bỏ flag/reload phải trở lại baseline; flag không nằm trong saved markup/attrs.
6. Gửi versions/iframe/build/edit URL + video N01–03, console errors nếu có, saved markup diff/clientIds/DOM visibility và focus observation. Có FAIL thì gửi bước ngắn tái hiện; không cần dựng lại mockup. Chưa evidence đủ thì gate pending, không rollout P2/P3.

Source ledger:063§12. Helpers/actions **14/14 PASS** bằng `node --test --test-isolation=none tools/tests/slider-editor-selection.test.mjs`; không chứng minh actual Gutenberg/IME/Undo. Runner thường bị sandbox spawn EPERM; không phải product test FAIL. Syntax transpile5files PASS, build/PHP lint chưa chạy. Source packaging đã copy assets/ nhưng loaded stylesheet/zip inventory chưa kiểm.

### 2.2. Onsite entry report — 2026-11-09

Human mở `https://minhhaifishery.com/wp-admin/post.php?post=22&action=edit&skvn-slider-editor-proof=1` và báo “không ra cái gì”. URL đúng editor + opt-in flag; **P1 entry chưa đạt**, không coi N01–03 đã chạy/PASS. Không kết luận sai URL, cache hoặc chưa build.

Agent source inspection: local build/index.ts.js đã đổi và chứa proof flag/notice/wrapper; chỉ chứng minh local output, chưa chứng minh onsite đang nhận file đó. Phiên IAB của agent mở exact URL bị chuyển `https://minhhaifishery.com/not_found`; không có editor DOM/console để chẩn đoán. HTTP public-asset request qua shell bị proxy127.0.0.1:9 từ chối; không phải plugin failure.

Đã gửi read-only Console diagnostic cho human: actual script URL/body có P1 markers, native block types và selected type. Dựa output mới phân biệt missing deployed code, block type khác skvn-marine/slider, hoặc activation/render/JS exception. Không sửa query/iframe gate hoặc enqueue bằng phỏng đoán; native entry và full AF evidence vẫn pending.

### 2.3. Human evidence + activation repair — 2026-11-09

Human Console output: script `build/index.ts.js?ver=ef08fdab29aba198d592`, **jsHasP1=false**; native tree có skvn-marine/slider/slide; selected core/heading. Current URL `post.php?post=22&action=edit` **không còn flag**. Fetched response không có đủ P1 markers; không chứng minh do upload thiếu, server cache hay cơ chế trung gian nào. Local P1 build trước repair có asset version `648052dad7b6745ffdc6`, JS SHA256 `314FC70FAADDBD804DF031972631C47E1420F170C517DAAEDC7B629F2F848CD2`; đây là checkpoint **trước repair**, không expected hash cho build tiếp theo.

Local WP7.1 edit-post.js:10520–10525 tạo canonical URL chỉ post/action[/revision]; :10572–10589 replaceState lúc init. Điều kiện P1 cũ đọc location.search trong render không bền khi query bị core bỏ. Source repair: bootstrap PHP capture GET strict string1 (sanitize/wp_unslash, admin only) → inline `window.skvnMarineSliderEditorProof={requested: boolean}` trước editor script → Edit đọc boolean bootstrap, không re-read URL. Đây là request config tạm, không option/UI state/saved attr. Không bật default toàn site. Actual WP7.1.4 event trace chưa thu; source repair loại bỏ dependency URL mutable đã thấy trong output.

**Build/deploy handoff:** human rebuild sau repair, đồng bộ **cùng một lượt build**: `skvn-marine-blocks.php`, `build/` (đặc biệt index.ts.js + index.ts.asset.php), và `assets/css/slider-editor.css` vào plugin active. TS source riêng không được browser chạy. Không dùng version648052 trước repair làm hash target; lấy version từ asset.php sau build. Chưa agent build/lint/deploy.

Sau đồng bộ, mở lại exact opt-in edit URL ở§2.2. Core có thể bỏ flag khỏi thanh địa chỉ sau load; bootstrapRequested phải vẫn true, notice P1/switcher phải hiện. Không flag trong request mới → bootstrapRequested=false/native stack. Chạy [diagnostic mới](slider-editor-proof-diagnostic.js): expected assetStatus200, jsHasBootstrapFix=true, bootstrapRequested=true và Slider trong tree. jsHasP1 diagnostic cũ tìm query literal đã bị bỏ khỏi JS sau repair; **không dùng diagnostic cũ để đánh giá bundle mới**. Fetched markers không chứng minh executed bytes/native PASS; notice/DOM và N01–03 vẫn bắt buộc.

Regression production helper suite **16/16 PASS** (Node24.20.0): strict config, malformed/missing bootstrap stays off, requested true giữ khi URL canonicalized, query đơn lẻ không bật khi bootstrap cũ. Syntax5files PASS; PHP lint/build và onsite entry/native tests pending. Không rollout P2/P3 hoặc đổi artifact.

### 2.4. P1 entry screenshot — human2026-11-09 22:31

Human gửi `Screenshot 2026-11-09 at 22-31-23 Edit Page “Home” ‹ Minh Hai Fishery — WordPress.png` (Downloads). Ảnh thấy notice Native editing check,2buttons Slide1/Slide2, Slide1 active và nội dung Hero; old static navigation strip còn bên dưới như P1 baseline. **Entry visibility PASS trong lần chụp này**; ảnh không chứng minh bootstrap còn true sau URL normalization/re-render, số mounted native hosts, selection propagation, IME, Undo hay save/reopen. Build/hash/browser/iframe chưa kèm trong ảnh. Không coi full Concept01 hoặc N01–03 PASS; P2/P3 vẫn chờ native feasibility evidence. Fixture hiện2Slide, N01 full gate vẫn cần approved draft/test copy3Slide theo§2.

## 3. Full UI / states / controls

Phần này kiểm sau N01–03; P1 chưa cung cấp full Concept01.

| Case / mapping | Steps | Expected / pass criteria | Evidence |
|---|---|---|---|
| U01 / AF01/02/05/10 | Open each variation wide, selected/unselected; compare canonical geometry at same root width | Outer frame/background/label retained; rail left/single native stage right; footer Arrow–Add–Pagination; real content differs naturally by variation, no imposed demo Hero | Paired reference/actual screenshots + root/rail/stage/footer rects, hash/build |
| U02 / AF03 | On default/Card10slides select first/last/deep descendant via List View, rename heading, reorder active, add new; type without changing target | Rail capped, current item visible; list updates plain label/thumb/count, scroll not reset on each input; entire frame not10rows tall; native order/clientId identity preserved | List scrollTop/clientHeight/scrollHeight + active row rects/video |
| U03 / AF06/07 | Change all existing Arrow/Pagination styles and positions, Off/On; test restricted Pill+Side-center option and legacy fixture without normalizing data | Captions exactly Label: Value with correct names; samples static/nonfocusable/no navigation/autoplay; off shows Off/Position em dash; restrictions/attrs preserved; no silent data write | Attr diffs, DOM roles/events/tab order, screenshots |
| U04 / AF08 | Hero3→Add twice; try sixth; repeat Showcase. On default10 add11th; test allowed locked/template-restricted case | Add creates native slide/template, reveals target and safe native focus/history; Hero/Showcase disable at5 with reason; no new cap for default/Card; lock respects core. Existing>5 not deleted | Native IDs/order/content, focused node/disabled reason/video |
| U05 / AF09 | Resize editor by opening Sidebar and placing Slider in narrow parent; compare360/600/800/1100px available root where feasible; switch while rail/selector/content focused | Selector replaces rail when narrow, same active ID; no hidden focused control; content caret not stolen. Footer reflows all labels/Add; text remains visible, no viewport math/overflow mask | Root width vs viewport, screenshots/rect/focus logs |
| U06 / SED-ED04 |0/1slides, empty/long content, missing image, unsupported background image on Showcase/Card, navigation off, unknown legacy attr, multi-selection | Honest states/placeholder, no fake01/00, no silent cleanup/refill from effects, no raw HTML injection. Full native content/unused image controls stay available | State screenshots/raw attrs/content + notices |
| U07 / SED-ED02 | Open every Slider/Slide panel per063 inventory; select core blocks; use Open Slider settings shortcut; change playback/transition/height/motion and background | Correct owner, existing ranges/units/conditional/Advanced behavior; no footer setting duplicate or lost Parallax status; changes survive Save/Undo/reopen; stage stays static | Panel inventory screenshots/attrs and target IDs |
| U08 / SED-TECH01 | Cold editor load with cache checked, inspect loaded CSS handles/URLs; inspect frontend stylesheet requests; repeat add/switch panels/typing with two Slider instances | New dedicated editor CSS actually loaded once as needed, no frontend chrome CSS injection; no Swiper/editor timers, REST storm/tree clones; no console error growth | Network list, DOM/sheet handle, native host counts, console, profile scope |
| U09 / SED-UI01/HERO-* | Frontend before/after with same variants/content/settings; keyboard/nav; run HERO default/custom/Group/CTA and separate flicker outcomes from old runbook | No redesign-induced frontend geometry/motion/schema changes, contrast source not regressed; no invalid-block on old content. Contrast/flicker are separate results | Matched build frontend shots/video + HERO result rows |

At least one desktop pass has vertical scrollbar; record `document.documentElement.clientWidth/scrollWidth` and boxes of canvas parent/frame/rail/stage/footer. Require scrollWidth<=clientWidth and intended component bounds inside parent.1px tolerance applies only rounding, not broad design deviation. Long content may grow stage; do not clip native content/popovers to match a fixed photo. Internal rail scrolling is intentional, not a page overflow workaround.

## 4. Evidence / fidelity review

For each AF01–10: source file:symbol, current status, screenshot/DOM/native behavior evidence, linked case above and deviation if any. Record reference hash/build/available widths, selected ID/content and styles. Inspector images may supplement artifact comparison; screenshot of one variation is insufficient for all. Deviations go to062 register with reason/before-after/impact/human decision before pivot. Frame/labels/layout changes without decision fail the fidelity gate.

Return a compact result table: case/AF/SED/HERO ID → environment/build/URL → expected → actual → PASS/FAIL/not run/blocked → evidence path. Raw content diff should identify UI-only attrs did not serialize; retain links/media/privacy. Redact nonces/cookies/personal data.

## 5. Human commands / scope limits

```bash
php -l wp-content/themes/skvn-marine/functions.php
source /home/shinkuro/.nvm/nvm.sh && nvm use 20 && cd /mnt/d/Github/skvn-marine/wp-content/plugins/skvn-marine-blocks && npm run build && find modules/ -name "*.php" -exec php -l {} \;
```

PHP main registration lint and focused tests must be added to handoff when actual files change; human can run `php -l wp-content/plugins/skvn-marine-blocks/skvn-marine-blocks.php` from repo root. No fake test filenames/outputs. Static CSS packaging inventory/new editor sheet in artifact must be checked before an authorized deploy; no release command/version bump merely to run this suite. Respect command-responsiveness rule: stop after hang/timeout, no retry/poll; hand exact command back.

Initial status: all new editor cases **not run**; native P1 proof missing, implementation/start not performed. Existing contrast source status/evidence remain separate. Tests from HTML prototype cannot close these native checks.
