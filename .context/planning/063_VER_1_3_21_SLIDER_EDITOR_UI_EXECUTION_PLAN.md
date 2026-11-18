# V1 /1.3.21 — Slider Editor UI: execution plan theo Concept01

2026-11-09. **Human xác nhận P1 “Đã test, đúng UX”; P2/layout và P3 controls/states đã có source, full UI Chờ kiểm chứng.** P1 opt-in harness đã được thay atomic bằng Concept01 mặc định; không còn cờ URL/bootstrap. Current vẫn **V1 /1.3.20**, không transition/bump. Execution P1§12 giữ lịch sử; current source/evidence§13. Chưa agent build/lint/deploy/commit, không full milestone PASS.

## 1. Thứ tự đọc và phạm vi được chốt

AGENTS/context → [044§10](044_HERO_SLIDER_CONTRAST_AND_FLICKER_REPAIR_PLAN.md) → [062 fidelity contract](062_VER_1_3_21_SLIDER_EDITOR_ARTIFACT_IMPLEMENTATION_CONTRACT.md) → [canonical HTML](../../docs/artifacts/editor-ui/slider-editor-redesign-prototype.html) + [notes](../../docs/artifacts/editor-ui/slider-editor-redesign-prototype.md) → file này.062 giữ layout/AF01–10;063 cụ thể hóa source architecture, states, work packages và verification. Không sửa canonical HTML trong implementation.

Concept01 SHA-256: `5B938946C253E36E9F73D35C817C2FBF1F5F9F65375DE9A7D4A04853E2C352EF`.

Đã chốt: frame/nền/label; desktop rail trái có thumbnail/số/title và cuộn riêng; một editing stage phải; footer Arrow sample–Add–Pagination sample với `Label: Value`; sample navigation tĩnh; narrow dùng selector. Triển khai editor của Hero, Product Showcase, Card Carousel và default Slider, không biến mọi nội dung thành Hero. Step Slider ở1.3.24; Collection Carousel/query/Theme Design/Sidebar054 không mở thêm scope.

Không schema/saved UI attrs mới, không đổi serialized content/frontend renderer/motion/limits để làm UI. Code arrays trong demo chỉ là fixture; **không có slide store hoặc contenteditable engine thứ hai**. Bảo toàn các core blocks đang có, kể cả nội dung lồng phức tạp không có trong demo.

## 2. Baseline source và API evidence gate

Các source paths dưới đây tương đối `wp-content/plugins/skvn-marine-blocks/`.

| Baseline | Evidence hiện tại | Hệ quả cho implementation |
|---|---|---|
| `src/slider/edit.tsx` | Count bằng core/block-editor; createBlock/insertBlock/selectBlock; một InnerBlocks trong editor-stack; top Add toolbar và static arrows/pagination riêng | Tái sử dụng native operations; thay layout/chrome atomic, không thêm InnerBlocks thứ hai |
| `src/slide/edit.tsx` | Slide tự render useBlockProps + media + native InnerBlocks; parent settings shortcut; background permission/UI riêng | Thêm editor-only visibility/context vào owner thích hợp; giữ nội dung và Inspector mounts |
| `src/slider/variations.ts` | Hero có nội dung Hero; Showcase/Card dùng core/image và bố cục khác; Hero/Showcase limit5 trong edit | Rail metadata phải đọc đúng image/title thực theo variation; không tạo thumbnail screenshot của toàn slide |
| `src/slider/style.css` | Shared frontend/editor, Inter import, stack/border và static nav editor rules; HERO carrier/CTA repair đã có | Không bỏ shared rules/frontend; chuyển/replace riêng editor chrome có kiểm soát, giữ contrast |
| `skvn-marine-blocks.php` | Slider CSS handle `skvn-marine-slider-view` từ build/style-view.ts.css dùng cả hai surfaces | New editor chrome dùng dedicated editor style handle; không suy CSS extraction sẽ enqueue đúng |
| `src/slider/save.tsx`, slide/save, deprecated, block.json | Saved attrs/content native; context preset hiện hữu | Không sửa save/deprecated/schema/context serialized để nhớ active slide |
| package.json | @wordpress/scripts **^30.6.0**, Swiper **^11.1.15**; WP APIs externalized qua WordPress | Build tool major không xác định version WP/Gutenberg runtime; không đổi deps để giải quyết UI |

**P0 phải pin actual onsite WP version, Gutenberg plugin nếu active, editor iframe mode và installed build-tool version/lockfile.** Local repo không có wp-includes/version.php và chưa có versioned block-editor package source được xác minh. Không viện Handbook latest như bằng chứng API có trên site. Trước khi chốt cách visibility/focus phải đối chiếu nguồn **đúng WP/Gutenberg tag** và ghi URL/tag/symbol trong ledger§11.

Primary references (đã đọc2026-11-09, dùng để lập inventory API, không thay version gate): [InnerBlocks](https://developer.wordpress.org/block-editor/how-to-guides/block-tutorial/nested-blocks-inner-blocks/) — một inner-block host mỗi block; [block-editor store](https://developer.wordpress.org/block-editor/reference-guides/data/data-core-block-editor/) — block order, parents, selection, insert/capability APIs; [BlockListBlock filter](https://developer.wordpress.org/block-editor/reference-guides/filters/block-filters/#editor-blocklistblock) — wrapper extension dự phòng. Không dùng private/unstable API hoặc selector core DOM chưa audit làm nền.

## 3. Kiến trúc editor đích

```text
SliderEdit (native block root / frame, current attrs)
├ InspectorControls (same owners/attrs, organized below)
└ SliderEditorContext.Provider (UI-only, per Slider instance)
  ├ Header / count / summary
  ├ Workspace
  │ ├ SlideRail / narrow SelectControl (metadata derived from native tree)
  │ └ Stage / active title / exactly ONE native InnerBlocks host
  │    └ native Slide blocks remain mounted
  │       └ only active Slide presentation visible in stage
  └ Footer: StaticArrowSample | existing Add action | StaticPaginationSample
```

### 3.1. Data ownership và components

- Per-Slider React UI state/context: `activeSlideClientId`, refs cần thiết cho rail/focus, lời thông báo. Không persist active state/scroll vào block attrs/options/global custom store. Map refs chỉ giữ DOM refs, không giữ bản sao content.
- Native tree từ public selectors là source of truth cho thứ tự, clientId, attrs và nested content. `SlideSummary` là projection read-only `{clientId, label, thumbnail, position}`, không write ngược chỉ vì derive/re-render. Query/REST endpoint mới không cần.
- Một subscription cấp Slider derivation metadata/selected ancestry; memo theo thay đổi thực, không polling hoặc subscription mới theo mỗi lần click. Existing core-data media resolver/cache tái dùng; rail không enqueue request/resolve per render cho mọi ảnh.
- `SlideRail`, `EditorNavigationPreview`, hook/state helpers đặt trong `src/slider/editor/`; chỉ helper có consumer/invariant thực mới đưa shared. Không tái cấu trúc toàn plugin hoặc dùng feature-store chung cho một block.

### 3.2. Visibility: starting approach + bắt buộc prove

Giữ một native InnerBlocks host và toàn bộ Slide editors mounted, che **presentation** của inactive Slide qua scoped editor class/style trên owned block wrapper; active ID truyền bằng React context không serialized. Không filter native block tree xuống một phần tử, không return null/unmount inactive InnerBlocks, không render cùng children vào rail.

Ưu tiên own SlideEdit/useBlockProps và outer wrapper thực mà public API trả về. P0/POC phải đo xem wrapper/selection outline/appender còn để khoảng trống hoặc tabbable subtree khi inactive không. Nếu cần `editor.BlockListBlock` wrapperProps filter, chỉ scope exact slide type dưới đúng Slider, preserve existing class/style/ref/props; ghi exact tagged API và DOM evidence theo extension contract. Không DOM surgery, portal/reparent core block nodes, mutation CSS theo block IDs private hoặc broad `.block-editor-*` hiding.

Inactive subtree không keyboard-focusable/đọc trùng bởi screen reader; selected descendant phải được reveal trước focus. Không dùng opacity0, clip hoặc offscreen absolute positioning để giấu một editor vẫn nhận focus. Display/hidden choice cụ thể chốt bằng native proof đúng version; đây là **hypothesis kỹ thuật chưa PASS**, không hứa CSS-only đáp ứng mọi behavior Gutenberg.

Nếu visibility/context làm selection/IME/history lỗi: dừng rollout P2 trở đi, ghi evidence và phương án thay kỹ thuật vẫn giữ062. Không tự pivot sang stacked UI, iframe demo hoặc clone content. Đây là gate nội bộ source/runtime, không yêu cầu human tự đoán implementation trước POC.

## 4. State machine, selection và focus

| Trigger/state | Kết quả active target | Selection/focus policy |
|---|---|---|
| Initial render, có selected descendant trong Slider | Direct Slide ancestor chứa selected block | Reveal slide đó; không dispatch selection lại |
| Initial render, không có descendant selection | First direct Slide | Chỉ UI state; không tự select để giành focus khi page mở |
| Click rail / change narrow selector | Target clientId trong current direct Slide IDs | Sync native selectBlock theo API đúng version; reveal trước focus; rail/selector keyboard vẫn dùng được; không tự đặt caret vào heading mỗi lần click |
| Select deep content/Slide qua List View/breadcrumb/keyboard | Resolve direct Slide child thuộc Slider này | Update UI, không recursive selectBlock loop hoặc kéo focus khỏi content |
| Select Slider parent / Inspector của nó | Giữ last valid active | Không nhảy về slide1, không đổi caret/selection history |
| Select block ngoài Slider hoặc Slider khác | Giữ last valid active của từng instance | Không override global selection, không auto-scroll page |
| Native multi-selection | Giữ native selection, dùng anchor/last valid slide để trình bày | Không clear/normalize selection trong effect. POC kiểm copy/delete/reorder/Undo native; notice ngắn nếu cần để không khiến user tưởng chỉ1slide được chọn |
| Reorder | Giữ active **clientId**, derive index mới | Rail/index/pagination update; không chọn theo số thứ tự cũ |
| Delete active | Target native selection nếu còn thuộc Slider; nếu không nearest surviving neighbor (next at old index, rồi previous) | Chỉ phục hồi focus nếu thao tác làm mất target, không giành focus từ native toolbar/List View;0items show empty state |
| Undo/Redo delete/add/reorder | Theo native selection/IDs mới nhất | Không tự xóa/thêm blocks để “sửa” active; recompute derived state |
| Duplicate Slide/native content paste | Theo core selection; nếu mới chọn thì reveal new ID | Không tự copy attrs/tree bằng custom logic; no duplicate clientId/data |
| Reload/remount | Derive từ native current selection hoặc first | Không yêu cầu nhớ active qua reload, không persisted UI attr |

Focused element trong editor iframe phải lấy từ ownerDocument/ref, không giả `window.document` là canvas. Effects giới hạn theo active target/operation, không focus/scroll ở mỗi keystroke. Native IME composition không bị unmount/reparent, không add debounced setAttributes thay core typing. Rail button tab order bình thường, `aria-pressed` và tên `Edit slide N: title`; không gọi chúng “Previous/Next”. Add có accessible label/disabled reason; announcements chỉ khi target/count thay đổi.

### 4.1. Add action và template/lock

Tái sử dụng createBlock/insertBlock/selectBlock hiện có; một action footer, không thêm action cạnh tranh. Check existing limit và public insert permission/template/content lock trước dispatch. Hero/Showcase max5; Card/default không áp max5 mới. Existing content >limit vẫn giữ/render toàn bộ, không truncate/delete; Add disabled có lý do. Không xem mẫu10 là quyền tăng limitHero.

Giữ template nội dung hiện hành khi chèn/new block, không tạo slide từ HTML fixture. New Slide template children có thể xuất hiện sau mount: focus qua native selection/lifecycle khi child editable đã có, không polling/timer DOM. Empty/uneditable/locked slide chọn root an toàn kèm state phù hợp. Test Add bằng mouse và keyboard: core history đúng, sidebar còn đúng target.

## 5. Rail metadata, states và performance

- Thứ tự = native direct Slide order; index hiển thị1-based. Label ưu tiên native custom block name nếu runtime hỗ trợ/đã có, rồi first descendant core/heading text, rồi `Slide N`; chỉ plain-text conversion qua API đã pin/parser an toàn. Không regex parser/raw HTML injection; tên dài wrap/limit có accessible full label, không làm rail rộng ra.
- Thumb Hero/default: dùng background image hiện có khi variation hỗ trợ; Showcase/Card: first appropriate descendant core/image, qua existing media/core-data. Fallback neutral specimen/icon nếu không ảnh/broken; không remote media từ artifact, không rasterize toàn Slide, không load full-size ảnh chỉ để vẽ rail. `alt=""` cho thumb decorative khi row đã có tên đầy đủ.
- P0 ghi rules cho nested blocks, nhiều ảnh và missing attachment. Không auto-save/rewrite background chưa dùng hoặc media fields vì thay variation; giữ Unused background action trong Slide Inspector.
- Rail cap356px baseline062, ít items fit tự nhiên; scroll chỉ rail. Active row reveal bằng row/container rect, inset nhỏ chống rounding; không `scrollIntoView` làm cả page giật. Không animation cuộn bắt buộc. Typing trong stage không reset scrollTop hoặc rerender/remount toàn list không cần thiết.
- Không Swiper/autoplay/timers/scroll reveal/parallax live trong editor. Fully mounted native tree vẫn có chi phí core blocks/media; không tuyên bố “nhẹ hơn” từ việc bỏ slider runtime. Profile10slides và nhiều Slider, thu render/media request/count trước-sau; nếu cần virtualization phải là scope/architecture riêng, không tự unmount để tiết kiệm.

| Content/state | UI đích |
|---|---|
|0direct slides sau thao tác native | Empty stage + Add nếu được phép; count0; samples không tạo `01/00` hoặc dots giả; không tự refill native template từ effect |
|1slide | Một row/selector option, editable content; samples phản ánh on/off và count1, không fake transition |
|3–5slides Hero/Showcase | Rail/footer rõ, Add limit và đúng template; long content không bị cut |
|10slides default/Card | Rail capped, active cuối list visible, footer không cao theo count; no new count cap |
|Arrows/Pagination off | Giữ footer track/nhãn: `Arrow Style: Off` / `Pagination Indicator: Off`, sample ẩn, Position dùng em dash; giữ attrs khi bật lại |
|Unknown/legacy preset/style | Không normalize/write attrs; rõ fallback/unavailable label và lấy effective presentation theo source audited; ghi case để review, không chọn option đầu rồi overwrite |
|Nested focus/multi-select/lock | Không che focused selected subtree; context/state note ngắn khi cần, native API giữ quyết định quyền |

Off/empty/locked/multi-select là state adaptations bắt buộc của controls hiện hữu, không thay layout Concept01. Ghi screenshots trong deviation register062 để human kiểm; không thêm toolbar custom chỉ vì thiếu trong demo.

## 6. Footer và Inspector mapping

### 6.1. Static preview

Arrow sample là non-interactive element, decorative glyphs và text caption thật; không button focusable nằm trong `aria-hidden`. Pagination sample cũng non-interactive; không dispatch selectBlock/slider navigation. Labels/values English+i18n; maps dùng cùng option definitions như Inspector, enum không đổi.

`Arrow Style: Minimal/Circle/Pill`, `Position: Side center/Bottom left/center/right`; `Pagination Indicator: Dots/Fraction/Timed fraction/Timed segments`, `Position: Bottom left/center/right`. Dots active/fraction có thể minh họa editing index, kèm Static preview để không hứa frontend đang chạy. Timed ring/bar đứng yên, không interval/rAF loop. Nhiều dots/segments wrap trong vùng cho phép, không tăng max-width/overflow toàn frame.

**Source finding cần bảo toàn:** Inspector không cho Pill+Side center; demo review tools lại cho chọn tự do. Plugin giữ existing restriction/effective runtime behavior, không copy combo không hợp lệ từ demo. Nếu saved legacy có combo đó, ghi actual rendering/normalization trước; UI không silent write. Alignment cluster frontend không được engine hóa lại trong editor; footer layout cố định theo artifact, captions mô tả positions.

### 6.2. Inspector inventory và tổ chức dự kiến

Tổ chức rõ cấp owner; không chuyển controls sang global Theme Design hoặc Design Sidebar khác trong đợt này. Không tạo setting mới ở footer; demo Try preview styles không ship.

| Panel/owner | Controls giữ | Conditional/invariant |
|---|---|---|
| Slider → Playback (đổi nhãn Slider settings cho rõ scope) | Autoplay, governed autoplay duration, Loop | Giữ units/ranges/default và behavior hiện tại; duration chung toànSlider; không per-Slide timing |
| Slider → Navigation | Show arrows, Arrow style, Arrow position | Off giữ attrs; Pill/Side-center restriction giữ; currentClientId parent |
| Slider → Pagination | Show pagination, style, position | Off giữ attrs; timed indicators là config frontend, preview tĩnh |
| Slider → Presentation | Transition, governed duration, Height, Slides per view | Multi-view notice/transition availability giữ; governed variations không lộ slidesPerView control đang ẩn; legacy effect fallback giữ |
| Slider → Motion | Enable parallax, Intensity, Advanced, Depth/Direction/Translate/Inset/Scale | Không thu hẹp Advanced đã duyệt, giữ applicability/units/reset/preset behavior; không live motion canvas |
| Slide → Slider settings shortcut | Open Slider settings | Select parent và giữ active slide, không tạo panel settings thứ hai |
| Slide → Background image / Unused background | Choose/Replace/Remove, Overlay opacity, remove unused | Đúng media permission và variation; không xóa data khi unsupported, không normalize description/ảnh ngoài thao tác |
| Nested core blocks | Native text/image/button controls | Giữ toolbar/Inspector/focus/selection, không rebuild bằng custom form |

Parallax ON/custom badge hiện tại giữ thông tin bằng header/status tĩnh, không bỏ lúc dời Add toolbar. Mọi relocation/renaming có mapping old→new trong diff; labels mới chuẩn English/i18n. Saved attrs/enum không dịch hoặc đổi tên. Không thêm Reset toànSlider làm mất attrs mà chưa có scope.

## 7. CSS/asset, responsive và integration

### 7.1. Handle riêng thay vì phụ thuộc extraction ngầm

Đề xuất `assets/css/slider-editor.css` + handle `skvn-marine-slider-editor`, đăng ký trong `skvn_marine_blocks_register_blocks()`, version filemtime, dependency existing slider-view style nếu registered. Thêm vào **editor_style_handles** cho slider/slide, preserve handles/deps khác; **không thêm frontend style_handles** và không enqueue global admin. File static này phải có trong deploy artifact; audit tool copy-assets/zip inventory khi implementation, không chạy packaging/build trong lượt planning.

Đây là CSS feature editor của custom Slider, không theme-specific block extension nhỏ. Không dùng @wordpress/scripts filename guessing để hứa CSS nạp; nếu chọn pipeline khác phải chứng minh actual output→registered handle→editor iframe stylesheet trong P0/P1, giữ một owner rõ. Không tạo theme dependency chỉ để có frame.

Editor chrome names `.skvn-slider--editor-focus` và `skvn-slider-editor__*` là dự kiến (source naming hiện hành trước1.4.0). Style scope root editor, không global button/p/heading/`.wp-block`; hide class scope exact inactive Slide wrapper, không ảnh hưởng nested content ở Slider khác. Inspect actual DOM và mạnh nhất của shared/theme rules trước viết. Các `.skvn-slider--editor .skvn-slide` border và static nav positioning hiện có phải được thay thế/override atomic; không xoá shared frontend contrast/media rules để giảm specificity.

Frame palette/geometry theo062. Giữ root width do Gutenberg canvas/parent sở hữu, không max-width none một cách global. Container query trên owned wrapper dùng available width;900/660 của demo là điểm bắt đầu, ghi actual thresholds đo trong editor. Ẩn/hiện rail vs narrow selector phải quản lý focus khi resize: không giữ focus trong element bị hidden, không nhảy caret của content, selection vẫn là cùng slide. No viewport math/negative margin/body overflow mask.

Không fixed-height clip stage/native toolbar/popovers. Stage min-height chỉ cho empty/short samples theo baseline; content dài grow. Header/footer nằm ngoài rail scroller. Frame spacing theo053/shared helper nếu phù hợp và đã kiểm editor root, không nhân khoảng cách quanh từng Slide. Chủ ý scroll nội bộ chỉ áp rail, không che overflow hình học của toàn frame.

## 8. Work packages / checkpoint / commit boundaries

Không chạy những gói này trong lượt planning. Trước source follow-up, nhắc deferred current1.3.20 baseline; coding/start/transition theo lệnh human, không tự đổi milestone từ việc có plan. Commit boundaries là đề xuất khi human giao commit; không tự stage/push.

| Gói | Files chính (tương đối plugin) | Deliverable / gate | Acceptance |
|---|---|---|---|
| P0 — Runtime baseline/API evidence | Plan ledger + docs/testing | Actual WP/Gutenberg/build versions, tagged API refs, canonical hash, baseline URLs/images/attrs, asset path/packaging audit | SED-ED01/TECH01; chưa implementation |
| P1 — Native focused-editing proof | `src/slider/editor/context.tsx`, `selection.ts`, parent edit, slide edit, minimal scoped CSS/handle |3native slides, deep content, List View/select/IME/Undo/save; one tree mounted. **Không qua native proof thì không rollout P2/P3** | AF04/SED-ED03, technical gate |
| P2 — Layout slice hoàn chỉnh | parent/slide edit; `editor/slide-rail.tsx`, `editor/navigation-preview.tsx`, CSS; PHP editor handle | Frame+rail+stage+footer cùng hoạt động, actual attrs/meta, active scroll, Add/limits, no demo tools | AF01–08/10; paired interim image, source mapping |
| P3 — Inspector/state/responsive hardening | `editor/controls.tsx` nếu tách hợp lý, edit files, CSS/selection helpers | Owner groups + conditional restrictions preserved;0/1/10/off/invalid/lock/multiple sliders; narrow selector/focus/long text | AF06/09, SED-ED02/03/04 |
| P4 — Focused tests + review | Existing test harness/new behavior helpers tests; runbook + AF mapping | Test actual helper/action behavior, old serialized fixture; review no schema/frontend leak/native duplicate store | SED-TECH01 + regressions, pending browser riêng |
| P5 — Human build/onsite/fidelity | Runbook/062 deviation register/plan ledger | Native screenshots/keyboard/IME/geometry/assets + side-by-side artifact/actual; HERO contrast and flicker outcome separate | AF01–10, SED-*, HERO-* đủ evidence hoặc recorded defer |

P1 là lát cắt kỹ thuật trong kiến trúc đã chọn, không final UI; P2 phải có đầy đủ vùng Concept01 trước polish để tránh “chỉ có CSS”. Có thể group source commits P1(native state),P2(frame/rail/footer/assets),P3(controls/states/responsive),P4(tests/docs) khi reviewable. Không merge một commit xóa cơ chế cũ trong khi replacement thuộc commit chưa có. Docs/evidence/status đi cùng feature, không commit green claims khi chưa test.

### 8.1. File map giữ ngoài scope

- Có thể đổi: Slider/Slide editor imports/types/UI; `src/slider/editor/*`; new static editor CSS; main PHP **chỉ register/enqueue editor handle**, không runtime require mới; focused tests, docs.
- Không dự kiến đổi: save.tsx/deprecated, attributes/namespace, frontend view.ts/renderer, shared motion/loading/theme styles/GeneratePress, dependencies. `block.json` description “stacked editor preview” có thể cập nhật wording sau implementation, không attrs/version bump ngoài transition.
- Package asset inventory phải kiểm newCSS; không thêm require/include/PHP module mới. Nếu implementation cần đổi packaging tool, record exact source delta + human-run artifact checks trước handoff/deploy; không patch generated bundles bằng tay.

## 9. Verification / acceptance mapping

Runbook chi tiết: [slider-editor-ui-1.3.21.md](../../docs/testing/slider-editor-ui-1.3.21.md). [Contrast/flicker runbook](../../docs/testing/hero-slider-contrast-and-flicker-repair.md) giữ HERO-* và link sang bộ editor. Tất cả delta hiện **Chưa làm/Chờ kiểm chứng theo scope cũ**, không PASS.

| ID | Nhóm | Hành vi / hiện trạng | Việc làm | Cách kiểm / evidence |
|---|---|---|---|---|
| SED-ED01 | Editor UX | Concept01 accepted; API/controls/variation mapping mới có source audit, chưa runtime | P0 ledger + mapping062 | Tagged versions/refs + AF source map + approved baseline hash |
| SED-ED02 / AF01–03/05/06/09/10 | Editor UX | New layout chưa source | P2/P3 | Actual editor vs artifact wide/narrow, selection/context labels, rect/assets |
| SED-ED03 / AF04/08 | Editor UX / Technical | Focused native tree proof chưa làm | P1 + P3 |3slides edit/IME/List View, lifecycle/limit/permissions, saved data, no duplicate hosts |
| SED-ED04 / AF03/07/09 | Editor UX | Empty/long/off/10/missing states chưa làm | P2/P3 | Fixture states, scroll/focus/static controls, screenshots/video |
| SED-TECH01 | Technical | Handle/visibility/React context và version compatibility chưa proof | P0/P1/P4 | Network/DOM/parse-save/helper tests; no frontend CSS leak/store/REST storm |
| SED-UI01 / HERO-* | Block UI | Contrast source đã có; editor changes chưa có/frontend pending | Bounded smoke P5 | Matched build/content frontend variants, color/reset/CTA, flicker separate |

Automated focused tests khi có implementation: selection resolution từ selected descendant/direct order; active deleted/reordered/Undo input; capability/limit action no unintended dispatch; label/thumb projection and safe text; off/legacy captions; CSS enqueue integration actual registration. Dùng actual production helpers/controller với mock native store rõ ràng; không mock lại implementation rồi assert source strings. Không test low-impact label-only bằng hàng loạt snapshot.

Browser/WordPress bắt buộc cho layout/visibility/native focus/IME/history; JSDOM không chứng minh geometry hoặc core rendering. Benchmark no repeated media/network requests, no content/tree double mount, panel switching/typing ổn định; không invent performance target hoặc tự gán PASS khi không có measurement. Source parse có thể check nhanh; build/PHP lint do human theo AGENTS.

## 10. Rollback, stop conditions và handoff

- Stop trước rollout khi P1 fail native proof, runtime API tag chưa pin hoặc cần private DOM/API. Tiếp tục audit/docs không phụ thuộc gate; không hỏi human quyết kiến trúc thiếu evidence.
- Visual deviation phải vào062 với reference/actual/AF-ID/reason/alternatives và human decision trước pivot. Routine bug fix giữ đúng intent không phải xin duyệt lại layout.
- Không có data migration; rollback bằng revert source commits/asset registration đã xác định và human rebuild/deploy matching assets. Không reset workspace, rewrite DB hoặc delete content để quay về stacked baseline. Chốt stop/rollback khi native content/editability hoặc frontend regression, không giữ UI đẹp nhưng không sửa được.
- Handoff luôn kèm044/062/063, canonical HTML+notes **có trong commit khi được giao commit**, hash, mapping, pending/deviations/test environment. Human build/lint/deploy/onsite theo quy trình, không tự push/deploy. Không coi scope/design approval là lệnh start1.3.21 hoặc close1.3.20.

## 11. Execution / evidence ledger

| Gate | Trạng thái hiện tại | Cần điền khi thực hiện |
|---|---|---|
| Canonical reference | Hash đã đối chiếu2026-11-09; HTML không đổi | Commit chứa HTML/notes/062/063, screenshot baseline cùng available width |
| WP/Gutenberg/versioned API | **Chưa xác minh**; Handbook current chỉ inventory, package tools30/Swiper11 không pin runtime WP | WP/Gutenberg versions, matching tag URLs/symbols, iframe mode |
| P1 mounted context/visibility/focus | **Chưa làm** | Native3slides, DOM/selection/IME/Undo result; exact wrapper/API/strategy |
| Assets/packaging | **Planning** dedicated staticCSS/editor handle | Source path→registered handle→loaded sheet; packaging inventory |
| P2–P4 source/tests | **Chưa làm** | File:symbol / commit / test commands/output + limits |
| P5 fidelity/native/frontend | **Chưa kiểm chứng** | Runbook IDs/evidence,062 deviations, human approvals |

2026-11-09: detailed plan và runbook được soạn; không coding plugin, build/lint/onsite/commit. Không retry các lệnh browser/DOM artifact đã bị dừng từ lượt trước; test prototype standalone không thay P1/P5 native proof.

## 12. Execution checkpoint — human “Tiến hành”, 2026-11-09

Start source1.3.21 ngoài current; không chuyển/đóng1.3.20, bump, build/lint, commit/push/deploy. Checkpoint planning-only§11 là lịch sử. P1 source không là native proof/PASS.

### P0 evidence và giới hạn

- Actual local distribution `D:/Github/minhhaifish/wp-includes/version.php:19` ghi **7.1**. Matching bundled `wp-includes/js/dist/block-editor.js`: selection start/end14370–14375; parents14402–14414; root14399; order14725; mode14780; selectBlock16323; useFocusFirstElement24959–24980 bỏ focus khi initialPosition=null; useBlockProps26227–26349 merge own props/style vào actual API3 wrapper. Slide metadata apiVersion3. Đây là evidence source local7.1, **không** tagged source7.1.4 hoặc runtime PASS.
- Snapshot onsite có sẵn `.local/header-first-load-2026-11-09.html:186/195` ghi WordPress **7.1.4** qua generator và WindPress `_wp_version`; human xác nhận trực tiếp **WP7.1.4** trong lượt này. Gutenberg plugin active/version và iframe mode chưa được xác minh. Web reader không truy cập được Home; exact editor source patch/native evidence pending, P0 onsite mới đạt một phần.
- Installed @wordpress/scripts **30.27.0**, package range^30.6.0; không đổi deps. Canonical hash giữ nguyên `5B938946C253E36E9F73D35C817C2FBF1F5F9F65375DE9A7D4A04853E2C352EF`.
- Packaging source đã copy toàn `assets/` qua tools/build-deploy-artifact.mjs; không sửa/chạy tool. Built files chưa cập nhật.

### P1 source / native feasibility harness

Chỉ bật khi URL editor có **`skvn-slider-editor-proof=1`**. Không flag: native stack/chrome hiện hành giữ nguyên. Đây là harness tối thiểu cho gate062/063, **không final Concept01 hoặc setting sản phẩm**. Không copy demo/store/iframe. Khi P1 đạt, P2 thay harness bằng layout đã duyệt và bỏ gate tạm cùng rollout; không duy trì hai product editors.

| Source / symbol (plugin-relative) | Hành vi / mapping | Status |
|---|---|---|
| `src/slider/editor/selection.ts`: readSlideSelection/resolveActiveSlide/selectProofSlide | Native direct IDs/ancestry; giữ active ID khi reorder, neighbor fallback khi xóa, anchor multi-select; click re-read IDs/mode rồi selectBlock(target,null), không content writes. AF04 P1 | Source;14 mocked-store tests PASS, native pending |
| `src/slider/editor/context.tsx`: SliderEditorFocusContext | Per-root React UI context, không saved context/attrs/store | Source, actual propagation pending |
| `src/slider/editor/native-proof.tsx`: NativeSlideEditingProof | Numbered test switcher, một native children host, không effects dispatch selection/focus; unavailable/multi/empty notices | Source, không final AF01–03/05–10 |
| `src/slider/edit.tsx`: nativeProofRequested/nativeSlides | Opt-in harness; một InnerBlocks host; default stack và existing Add/limits/Inspector/navigation giữ | Source, native pending |
| `src/slide/edit.tsx`: editorFocus/isInactiveInProof/useBlockProps | Chỉ direct child đúng context root có display:none khi inactive; subtree mounted. Không private core DOM selectors/reparent/filter | Hypothesis đã nối source; N01–03 bắt buộc |
| `assets/css/slider-editor.css`; bootstrap `skvn-marine-slider-editor` | Minimal styles, editor_style_handles chỉ Slider/Slide; dep slider-view/filemtime, không frontend handle | Source; loaded sheet/zip pending |

Thiếu public selector, foreign child hoặc Slide HTML mode → context null/giữ native presentation, không hidden/normalize content. Full Code Editor/reload cần N03. Không bật default từ model PASS; old static nav giữ đến atomic replacement P2.

### Verification / gate tiếp

Helper test environment: **Node24.20.0** với stripTypeScriptTypes/test-isolation. Không thay Node20 plugin build workflow. Human đã xác nhận WP7.1.4; Gutenberg plugin active/version/iframe và exact editor source patch còn pending.

- Node test runner mặc định bị sandbox **spawn EPERM**, không product FAIL. `node --test --test-isolation=none tools/tests/slider-editor-selection.test.mjs` → **14/14 PASS**, production helpers/action + mocked native store. Không prove actual core history/selection/focus.
- Transpile syntax5TS/TSX files: PASS, không typecheck/build/PHP lint. `git diff --check` clean (EOL warnings riêng). Không thêm viewport units/overflow masking trong affected path; canonical hash không đổi.
- **Stop trước P2/P3 theo§8/§10:** actual onsite/Gutenberg/iframe baseline và N01–03 chưa có evidence. Human build + draft tests theo runbook§2.1; gửi versions/video/console/saved markup. Sau gate đạt tiếp tục Concept01, không xin duyệt lại design hoặc coi toàn scope xong.
- Block UI: không đổi frontend/save/schema/renderer; frontend smoke pending riêng. Editor UX: P1 source only. Technical: helper/syntax PASS phạm vi trên, asset/native pending. Không commit/push.

Onsite follow-up2026-11-09: human báo P1 không hiện tại exact editor post22 + flag đúng. Local bundle đã chứa P1 markers, không suy onsite deployed. Agent IAB bị redirect /not_found, shell public-asset fetch bị proxy từ chối; chưa có editor/runtime evidence. Đã yêu cầu read-only Console output actual script/body + native block types để isolate asset/type/activation, không đoán cache/iframe hoặc ép bật P2. Runbook ghi entry report; N01–03 chưa PASS.

### Activation repair sau human Console evidence

Human output: native Slider có mặt; fetched editorScript version **ef08fdab29aba198d592**, jsHasP1=false; current URL thiếu flag. Local pre-repair P1 asset version648052dad7b6745ffdc6 khác onsite. Không suy nguyên nhân delivery là cache hay thiếu upload; chưa actual core event trace. Local WP7.1 `edit-post.js:10520–10525/10572–10589` tạo canonical post/action URL rồi replaceState lúc init, chứng minh query có thể bị bỏ và cách đọc location.search trong render không bền.

Đã sửa bootstrap trong existing register_blocks: sanitize request flag/admin → inline request-only config `window.skvnMarineSliderEditorProof` trước bundle. `selection.ts:isSlideProofEnabled` và Slider Edit đọc boolean config; không mutable URL, options, saved attrs hoặc global active-slide state. No flag request = false; query bị canonicalized sau load không tắt proof. No new PHP require/include, schema/deps/frontend changes. Default-off P1 giữ, không mở P2/P3.

16/16 production helper tests PASS trên Node24.20.0, gồm regression URL canonicalization/missing bootstrap/strict booleans; syntax5files PASS. Actual PHP/render/bootstrap timing/entry và N01–03 vẫn pending. Human rebuild + đồng bộ bootstrap, build/JS+asset.php và static editor CSS cùng phiên bản theo runbook§2.3; diagnostic mới kiểm bootstrap name thay query literal (literal không còn trong JS). Build sau repair phải lấy hash mới, không dùng pre-repair648052 làm target. Agent không build/lint/deploy/commit/push.

Human screenshot2026-11-09 22:31: P1 notice + Slide1/Slide2 buttons + active Slide1/Hero visible. **P1 entry visibility PASS riêng lần chụp**, supersedes entry-not-visible report; exact build/hash/iframe và actual N01–03 chưa có. Không suy native edit/IME/history/host identity hoặc full Concept01 PASS từ screenshot; P2/P3 giữ gate. Runbook lưu evidence/2Slide fixture và giới hạn.

## 13. P1 human UX accepted → Concept01 source execution

Human phản hồi **“Đã test, đúng UX”** sau checklist chuyển Slide/sửa tiếng Việt/List View/Undo/Save. Ghi **human UX confirmation** cho flow/fixture đã báo, đủ tiếp tục source layout theo lệnh “Tiến hành”; không tự điền exact build/video/3Slide/10Slide/multi-select/reorder/locks/host identity/performance còn thiếu. Không coi đầy đủ N01–03 Technical PASS. Screenshot trước đó có2Slide, WP7.1.4; plugin Gutenberg/iframe chưa được xác nhận riêng. Các gate source-no-rollout trước human UX confirmation ở§12 là lịch sử; full technical/fidelity acceptance vẫn kiểm P5.

### 13.1. Current architecture và AF source map

P2/P3 dùng trực tiếp trên Slider editor; bỏ `native-proof.tsx`, PHP query bootstrap và activation helpers/tests đã hết consumer. Không còn yêu cầu query flag. Một `SliderEditorCanvas` → native InnerBlocks host; UI-only context/selection logic từ P1 giữ; active wrappers mounted như flow đã test. Native content/save/deprecated/query/attrs/version không đổi. `block.json` chỉ đổi description cho đúng focused editing.

| AF / nhóm | Actual source (plugin-relative) | Hiện trạng / acceptance còn thiếu |
|---|---|---|
| AF01/10 Editor UX | `src/slider/edit.tsx:Edit`, `assets/css/slider-editor.css` | Source root frame fill#f4f5fc/border#d9dcef/radius14; label/count/parallax status. Dedicated editor handle đã nối; actual paired screenshot/sheet/geometry pending |
| AF02/04 Editor UX/Technical | `editor/canvas.tsx:SliderEditorCanvas`, `context.tsx`, `selection.ts`, `slide/edit.tsx` | Source desktop rail + one native editing stage, selected ancestry/per-root active/deletion fallback. P1 human flow accepted; final geometry/unchanged native behavior cần recheck |
| AF03 Editor UX | `editor/metadata.ts:summarizeSlides`, `slide-rail.tsx:SlideRail`, `rail-geometry.ts:revealRailRow` | Native name→heading→Slide N; thumbnail small attachment rendition/core Image theo preset; bounded356px rail/active reveal. Custom memo bỏ rerender rail khi metadata/active không đổi. **U02 human UX PASS 2026-11-12** |
| AF05/06/07 Editor UX | `editor/navigation-options.ts`, `navigation-preview.tsx`, `canvas.tsx` footer | Arrow sample–Add–Pagination; Label: Value, Off/Unavailable/positions, static timed shapes, no sample buttons/timer/Swiper. Inspector và captions dùng cùng option maps, Pill restriction giữ. **U03 human UX PASS 2026-11-12**. AF05 paired screenshot vẫn riêng nếu so artifact |
| AF08 Editor UX/Technical | `selection.ts:slideInsertionReason/appendNativeSlide`, Canvas Add/focusCandidate effect | Recheck root+ancestor modes/permission/controlled/template/insertability, Hero/Showcase max5/defaultCard không cap mới. Native insert+select, hậu template chọn editable heading/paragraph nếu user chưa đổi target. Guard19tests PASS; actual Add/history/focus/limits pending |
| AF09 Editor UX | CSS named container query900/660/370 + Canvas ResizeObserver focus adapter | Source available-container width, narrow native selector; footer Add hàng dưới; focus chỉ chuyển rail↔selector nếu control sắp bị hidden, không kéo caret content. **U05 human UX PASS 2026-11-12** |

Paths `editor/*` ở bảng là `src/slider/editor/*`. CSS min-height356 chỉ preview, actual native typography/custom styling giữ và content có thể grow; không ép chữ/chiều cao giống demo. Padding frame được inner chrome sở hữu để CSS container queries có thể adapt descendants, root vẫn là visual frame. Rail list có inset nội bộ thay margin âm demo để giữ geometry trong parent; bám layout intent, ghi paired comparison P5. Thumbnails thiếu small rendition dùng neutral placeholder; URL-only media reuse source hiện hữu. Không đưa SVG/demo marketing content, review tools hoặc data arrays vào plugin.

### 13.2. Integration / boundaries / controls

- Một root `.skvn-editor-preview-frame` dùng existing spacing helper cho minimum actual10px, không thêm frame quanh từng Slide. Dedicated static CSS vẫn qua `skvn-marine-slider-editor` chỉ editor_style_handles Slider/Slide; main PHP bỏ boot flag, không frontend handle/module/require mới. Existing packaging copies assets/; loaded sheet/zip cần human check.
- Xóa old stacked editor/forced max-width:none/border/static nav CSS cùng replacement. Shared frontend contrast/media/motion rules giữ; only editor rules được bỏ. New preview overrides native slide min-height/padding/overflow riêng editor, background media vẫn clipping trong media layer, không clip content/popovers. Chrome label không dùng p/heading để tránh broad Hero typography rules.
- Inspector old Slider settings→Playback; Navigation/Pagination/Presentation/Motion conditional controls, Advanced ranges/units và Slide Background/Unused background giữ. Slide shortcut chọn nearest parent Slider (hỗ trợ nested roots). No new global settings/Reset/styles storage.
- Multi-selection warning chỉ xuất hiện khi selection chạm root này; không broadcast vào mọi Slider từ selection ngoài. Supported HTML/foreign-child fallback giữ native presentation và notice, không normalize/delete content hoặc force select effect.
- Canonical artifact HTML không sửa, hash `5B938946C253E36E9F73D35C817C2FBF1F5F9F65375DE9A7D4A04853E2C352EF` giữ. AF acceptance chưa full PASS từ source. No bump/current transition/commit/build/lint/deploy.

### 13.3. Verification / handoff

- `node --test --test-isolation=none tools/tests/slider-editor-selection.test.mjs` → **19/19 PASS**, actual projection/row action/Add guard+entry với mocked native store. P1 activation tests được retire cùng removed gate, lịch sử16PASS vẫn§12. Không suy actual WordPress Undo/focus từ mocks.
- Syntax transpile **10TS/TSX files PASS**, không typecheck/build/PHP lint. Diff whitespace clean; new affected paths không viewport units/overflow-x masking. Frontend renderer/save/attributes không đổi.
- `node --test --test-isolation=none tools/tests/slider-editor-presentation.test.mjs`: **human10/10 PASS**,0fail/0skip/0cancelled,64421.461315ms (~64.42s),2026-11-09. Supersedes pending sau agent stop Ctrl-C vì10s không output; không agent retry hoặc cần rerun khi source không đổi. Suite có10cases; actual production modules/React SSR với WP/store/rich-text API mocks + JSDOM, kiểm metadata/thumbnail safety, captions/empty/legacy, rail math, one host/three footer groups/limits/no render mutation. Human output chưa kèm runtime version/build; không suy môi trường. Không prove browser geometry/actual Gutenberg/native mounts/IME/history. P5 actual artifact/onsite evidence còn pending.
- Human build/lint + đồng bộ bootstrap/build/static CSS; mở normal edit URL không flag. Re-run native flow P1 trên final layout và U01–09. **2026-11-12 chủ dự án PASS U02, U03, U05.** Còn U01, U04, U06, U07, U08, U09. Không tự đóng current.
