# 044 — Hero Slider: plan sửa tương phản và kiểm chứng hiện tượng chớp

**Concept01 source update:** human P1 “Đã test, đúng UX”; P2/P3 frame/rail/native stage/footer/Inspector states có source, default UI sau human build, P1 gate/harness đã retire. Current source map/gates **063§13/runbook§0** supersede planning-only/chờ P1 entries bên dưới.19selection/Add tests + syntax10files PASS; presentation suite human10/10 PASS (64.42s, SSR/WP mocks), actual AF/native/HERO/fidelity/geometry vẫn pending riêng. Không chuyển current1.3.20/bump/build/lint/deploy/commit.

**Source start2026-11-09:** human “Tiến hành” theo063; P1 QA harness default-off có source,14 mocked selection/action tests và syntax5files PASS. N01–03/onsite version+iframe/assets pending; P2/P3 giữ gate, chưa final Concept01.063§12 và native runbook§2.1 là checkpoint mới, supersede planning-only/start wording bên dưới. Current1.3.20/metadata giữ; không build/lint/commit/deploy.

**Execution plan063 — 2026-11-09:** [063](063_VER_1_3_21_SLIDER_EDITOR_UI_EXECUTION_PLAN.md) cụ thể hóa§10/062 thành P0 versioned API evidence, P1 native editing proof trước rollout, source map/layout/Inspector/states/assets và P2–P5 nghiệm thu. [Native runbook](../../docs/testing/slider-editor-ui-1.3.21.md) giữ exact cases; contrast/flicker vẫn theo các section repair bên dưới. Chưa coding/start/current transition; native visibility/context là hypothesis cần proof, không suy Handbook latest hoặc HTML demo đã PASS.

**Artifact reference lock2026-11-09:** human đã xem Concept01, nói “Good” và yêu cầu bám artifact khi thực hiện. [062](062_VER_1_3_21_SLIDER_EDITOR_ARTIFACT_IMPLEMENTATION_CONTRACT.md) bổ sung canonical HTML/hash, AF01–10 source mapping, deviation register và paired artifact/actual editor screenshot gate bắt buộc. Các câu§10 “chưa chốt layout” là checkpoint trước reference; Concept01 là baseline để triển khai, không được tự redesign/đổi frame/labels. Inspector/native feasibility/variation mapping chưa thể suy PASS từ demo. Chưa coding/start; current1.3.20 giữ.

**Amendment2026-11-09 — scope hiện hành:** **1.3.21 — Hero Slider Contrast Repair + Slider Editor UI Redesign**, human bổ sung redesign Editor UI, xem§10. Current thực tế1.3.20; các current1.3.18/“file sửa duy nhất”/planning-only dưới đây là checkpoint của repair slice. Contrast source có/runtime pending; redesign PLANNED/Chưa làm, chưa start. Không bump/current transition; SOURCE IMPLEMENTED không áp toàn milestone mở rộng.

Ngày: 2026-10-19. Status: **SOURCE IMPLEMENTED — chờ human build + kiểm chứng runtime**. Không có runtime PASS.

Current là **V1 / 1.3.18 — Product/Post Carousel Editor UX & Technical**. Slider thuộc stack M5; **2026-11-04 human dời Hero contrast 1.3.19 → 1.3.21**, Sidebar từ 1.3.21 → 1.3.19. Giữ source/acceptance/hotfix ngoài current; không bump/archive.

Version triển khai hiện hành: **V1 / 1.3.21 — Hero Slider Contrast Repair** (human đổi mapping 2026-11-04; approval gốc 2026-10-19 là 1.3.19). PATCH sửa default/cascade Slider hiện có, không thêm block/attribute/dependency. Current 1.3.18; hotfix ngoài current, không bump metadata. Bảng dưới là baseline audit 19/10 được ghi chú version mới, không phải current ledger.

| Version | Trạng thái | Ghi chú |
|---|---|---|
| 1.3.13 | Đã code (loading screen), mapping chưa xác nhận | Không dùng lại |
| 1.3.14 | Đã code (post heading numbering), mapping chưa xác nhận | Không dùng lại |
| 1.3.15 | Chỉ **đề xuất** trong tension T-DEMO-1 (parallax), chưa dùng | Không dùng để tránh tranh chấp |
| 1.3.16 | Milestone PENDING | Không dùng lại |
| 1.3.17 | Current milestone, IN PROGRESS | Không gán thêm scope |
| 1.3.18 | PLANNED, chưa bắt đầu (Collection Editor UX & Technical) | Không dùng lại |
| **1.3.21** | **Mapping cập nhật 2026-11-04, từ 1.3.19** | Hero contrast stack M5; source và acceptance giữ nguyên |

Mapping M5 → 1.3.21 đã ghi ở roadmap 039 và section milestone không-current trong MILESTONES.md. Quyết định đầy đủ (kèm các phương án bị loại) nằm ở tension đã resolve trong `.context/TENSIONS_ACTIVE.md` ngày 2026-10-19.

## 1. Vấn đề và giới hạn bằng chứng

Đầu vào là `C:/Users/VPF-Champion/Downloads/bug-report-hero-slider-flicker (3).md`. Các option trong báo cáo là đề xuất điều tra, không phải chỉ thị triển khai của human.

Báo cáo mô tả chữ hero tối trên gradient tối ở các trạng thái đã chụp; chưa tái hiện trắng ↔ tối. Phiên đó không đo được computed styles theo frame. Link ảnh `sandbox://...` thuộc phiên khác, chưa kiểm chứng trực tiếp được từ chat này. Giá trị màu cụ thể trong báo cáo phần lớn là suy luận cascade, không coi là số đo runtime.

Đối chiếu source local ngày 2026-10-19 xác nhận các điều kiện có thể gây thiếu tương phản vẫn tồn tại:

| Nguồn | Điều đã xác nhận từ source | Ý nghĩa |
|---|---|---|
| `src/slider/style.css:114–117` | Rule trắng phụ thuộc `.skvn-slide--has-background` | Không cung cấp default trắng cho hero chỉ có gradient |
| `modules/slider-render/slider-render.php:526–532` | Class chỉ thêm khi preset hỗ trợ background và có URL ảnh | Thiếu class trên hero không ảnh là đúng điều kiện renderer hiện tại |
| `src/slide/edit.tsx:142–157` | Preview cũng dựa vào ảnh để thêm class | Không sửa riêng frontend rồi để editor khác cơ chế |
| `src/slider/style.css:644–648` | Hero có gradient tối ngay cả khi không có ảnh | Default tương phản phải xét preset, không chỉ ảnh |
| `src/slider/style.css:699–713` | Typography hero không khai báo màu | Có thể nhận màu heading/body từ theme |
| Theme `style.css:98–115` | Theme gán màu trực tiếp cho heading và `.wp-block-heading`, cả frontend/editor | Gán màu trên wrapper đơn thuần không giải quyết rule trực tiếp trên heading |
| `src/slider/style.css:720–739` | CTA có background mặc định và hover, không có text color mặc định; custom hover có marker riêng | Cần xử lý theo từng kênh màu và từng state |
| `src/slider/variations.ts` | Hero template không set text/background color cho từng core block | Sửa template mới đơn thuần không sửa nội dung cũ |
| `src/slider/view.ts:613–622` | Fade dùng `crossFade: true`, speed lấy từ config | Không có bằng chứng ở đây rằng engine gây đổi màu |

Bug report (2026-10-16) bổ sung hai dữ kiện runtime quan trọng mà bản plan đầu ghi là "chưa kiểm chứng":

| Bằng chứng | Nguồn | Ý nghĩa |
|---|---|---|
| Không slide nào có `skvn-slide--has-background`; cả hai `.skvn-slide__media` rỗng (server HTML qua REST + live DOM, 2 phiên) | Bug report §4.2 R1, §5.1 | Hero trên URL báo cáo chạy bằng gradient vô điều kiện, nên nhánh `--has-background` **luôn không khớp** |
| GeneratePress inline `a.wp-block-button__link:not(.has-background){color:#fff;background-color:#55555e}` — suy luận cascade, chưa đo DevTools | Bug report §4.2 R7 | Giải thích CTA render nền xám `#55555e` chữ trắng thay vì white-pill; GP rule (0,2,1) thắng plugin (0,2,0) |
| Theme gán màu trực tiếp lên `body:not(.wp-admin) .wp-block-heading` | Bug report §4.2 R2 | Báo cáo tính nhầm selector cuối của list là (0,1,2); xem §1.1 |

### 1.1. Specificity thật của các nhánh (đã kiểm lại từ source, không dùng con số trong bug report)

`src/slider/style.css:114–117`:

| Selector | Specificity |
|---|---|
| `.skvn-slide--has-background` | (0,1,0) |
| `.skvn-slide--has-background :where(h1..h6, p)` | (0,1,0) — `:where()` không cộng |

Theme `wp-content/themes/skvn-marine/style.css:98–115` — list gồm 12 selector, mỗi branch tính riêng:

| Selector | Specificity |
|---|---|
| `body:not(.wp-admin) h1`…`h6` | (0,1,2) |
| `body:not(.wp-admin) .wp-block-heading` | **(0,2,1)** |
| `.editor-styles-wrapper h1`…`h6` | (0,1,1) |
| `.editor-styles-wrapper .wp-block-heading` | **(0,2,0)** |

Kết luận: kể cả khi `skvn-slide--has-background` có mặt, nhánh `.wp-block-heading` của theme vẫn thắng. Đây là nhánh quan trọng nhất vì `core/heading` luôn render kèm class `wp-block-heading` — nên Option A/B trong bug report (chỉ (0,2,0) hoặc thêm class) **không đủ** để sửa heading. Plan sửa lại nhánh này.

### 1.2. WordPress đã bảo vệ màu explicit bằng `!important` — không cần `:not()` guard phức tạp

Đọc trực tiếp runtime core `wp-includes/class-wp-theme-json.php:2623–2663`: preset classes được sinh bằng `compute_preset_classes()` với `var(...) !important`, bao gồm:

- `.has-<slug>-color` → `color`
- `.has-<slug>-background-color` → `background-color`
- `.has-<slug>-gradient-background` → `background`

Hệ quả trực tiếp cho thiết kế (thay đổi hướng so với bản plan đầu):

1. **Palette color** và **gradient/solid background** do editor chọn đều `!important` → thắng mọi rule không-`!important` của plugin. Không cần viết `:not([class*="-color"])` để loại trừ.
2. **Custom color** (color picker) sinh `has-text-color` + inline `style="color:…"` → inline thắng stylesheet.
3. Vì vậy có thể dùng rule default đơn giản, scoped Hero, **không** `!important` đại trà, và vẫn giữ được mọi lựa chọn màu của editor.
4. Hệ quả phụ có lợi: `.skvn-slider--hero … .wp-block-button__link:not(.has-background){background:#fff}` **không** phá gradient, vì gradient preset là `!important`.

### 1.3. Asset entry — CSS Slider dùng chung cho cả hai surface

| Bước | Bằng chứng |
|---|---|
| `src/slider/view.ts:26` | `import './style.css'` → bundler xuất ra `build/style-view.ts.css` |
| `skvn-marine-blocks.php:128–139` | Handle `skvn-marine-slider-view` → `build/style-view.ts.css`, phụ thuộc `skvn-marine-slider-core` |
| `skvn-marine-blocks.php:233–238` | Handle này được thêm vào `editor_style_handles` của `slider` và `slide` |
| `skvn-marine-blocks.php:254–259` | Handle này là `style_handles` (frontend) của `slider` và `slide` |

Kết luận: **một file CSS duy nhất phục vụ cả editor và frontend**. Selector dùng ở đây phải đúng với DOM hai surface; DOM đã xác minh là giống nhau về class: wrapper `skvn-slider skvn-slider--editor … skvn-slider--hero` (`src/slider/edit.tsx:122`) và slide `skvn-slide skvn-slide--editor [skvn-slide--has-background]` (`src/slide/edit.tsx:154–158`) với `div.skvn-slide__content` giống hệt renderer (`slider-render.php:554`). Nhờ đó có thể dùng một bộ selector không cần nhánh riêng cho editor, và chỉ cần specificity cao hơn cả hai biến thể theme ở §1.1.

Các số dòng là mốc local tại lúc viết; tìm lại selector/symbol nếu source thay đổi. Không suy ra asset onsite giống local: công cụ web trong phiên này không truy cập được trang/asset. Không có runtime PASS.

## 2. Kết quả muốn đạt

1. Hero không có màu custom phải có heading/body sáng trên nền gradient tối, có và không có ảnh.
2. Màu do editor chủ động chọn tiếp tục có hiệu lực; reset màu trả về default hero.
3. CTA mặc định: white-pill + chữ navy `#073b5a`, hover/focus `#eaf7ff`. **Yêu cầu phải thắng GP inline rule** (bug report R7) — hiện tại GP thắng nên CTA là nền xám `#55555e`. Đây là đề xuất hoàn thiện ý đồ white-pill đang có trong CSS, chưa phải human visual approval. Xem §4.3 về xung đột với quyết định 1.3.7 ngày 2026-06-23.
4. CTA custom giữ text/background/gradient và custom hover theo từng kênh; sửa màu không làm mất focus indicator.
5. Nội dung cũ nhận default hợp lý sau cập nhật asset, không cần mở và save lại hàng loạt.
6. Chỉ đóng lỗi tương phản sau kiểm chứng. Hiện tượng chớp có trạng thái và bằng chứng riêng, không tự đóng theo lỗi màu.

## 3. Phạm vi và boundary

### Trong repair slice

- Default text/CTA của preset Hero; xung đột CSS với theme hiện tại và GeneratePress runtime đã báo cáo.
- Editor preview parity và saved/reopened values cho các màu liên quan.
- Regression nhỏ trên Product Showcase, Card Carousel và consumer dùng CSS chung.
- Đo lại fade trên cùng fixture sau khi default contrast đúng.

### Ngoài repair slice

- Không đổi Swiper, effect, duration, autoplay/pause, loop, parallax, Ken Burns hoặc entrance animation để chữa một nguyên nhân chưa chứng minh.
- Không rút thời lượng 800ms, xóa text-shadow hoặc thêm `translateZ`/`will-change` như bước hardening mặc định.
- Không đổi slide schema, save markup, block namespace hoặc thêm migration.
- Không mở rộng settings UI, điều khiển tone mới, global typography hoặc framework token mới.
- Không sửa GeneratePress parent, các carousel collection hoặc layout width/overflow để giải quyết lỗi màu.
- Autoplay không chạy và arrow ngừng hoạt động trong báo cáo là observation riêng; nếu tái hiện thì ghi issue, không tự kéo vào repair này.

Plugin giữ default presentation đã có của component. Theme giữ design tokens và global typography. Chỉ thêm scoped theme adapter nếu xác minh được theme đang chặn màu explicit; không chuyển toàn bộ visual system sang plugin và không thay màu heading toàn site.

## 4. Thiết kế sửa dự kiến

### 4.1. Không đổi nghĩa của `has-background`

Giữ nguyên điều kiện renderer/editor: class biểu thị slide đang dùng background image theo cơ chế hiện tại. Không thêm class giả cho hero không ảnh. Rule class còn tác động media/content layering, không nên tái sử dụng để đánh dấu riêng contrast.

Default contrast của Hero sẽ scope bằng `.skvn-slider--hero`, độc lập điều kiện ảnh. Không đổi rule trắng chung một cách làm ảnh hưởng preset khác.

### 4.2. Màu heading, paragraph và link — dùng "carrier + inherit", không tô trắng trực tiếp

Bản plan đầu dự tính gán `color: #fff` trực tiếp lên heading/paragraph trong Hero. Đối chiếu với §1.2 và với yêu cầu "giữ màu từ container" cho thấy hướng đó **sai ở case Group**: nếu gán trắng trực tiếp lên heading, màu `color` của Group sẽ không bao giờ tới được heading (bất kỳ khai báo trực tiếp nào cũng thắng kế thừa, bất kể specificity).

Hướng sửa lại — hai bước, đúng thứ tự ý định ở §4.2:

```css
/* 1. Carrier: Hero đặt default sáng tại content wrapper, không tại từng element. */
.skvn-slider--hero .skvn-slide__content {
	color: #fff;
}

/* 2. Vô hiệu hóa rule màu trực tiếp của theme bên trong Hero, để element
      kế thừa từ carrier (hoặc từ Group có màu). */
.skvn-slider--hero .skvn-slide__content :where(h1, h2, h3, h4, h5, h6),
.skvn-slider--hero .skvn-slide__content .wp-block-heading,
.skvn-slider--hero .skvn-slide__content :where(p, .wp-block-paragraph),
.skvn-slider--hero .skvn-slide__content a {
	color: inherit;
}
```

Vì sao hướng này đúng với thứ tự ưu tiên:

| Tầng | Cách thể hiện | Cơ chế |
|---|---|---|
| 1. Explicit trên chính block / rich-text span | `.has-<slug>-color` hoặc inline `style` | `!important` preset (core) hoặc inline → thắng `inherit` |
| 2. Explicit từ container (Group có text color) | Group kế thừa xuống, heading `inherit` | Không có khai báo trực tiếp nào trên heading → kế thừa hoạt động |
| 3. Default sáng của Hero | kế thừa từ `.skvn-slide__content` | `color: #fff` trên carrier |
| 4. Theme typography fallback | ngoài Hero | không có rule nào của patch chạm tới |

Specificity của hai rule mới:

| Selector | Specificity | Đối chiếu |
|---|---|---|
| `.skvn-slider--hero .skvn-slide__content` | (0,2,0) | chỉ đặt carrier, không cạnh tranh |
| `… .skvn-slide__content :where(h1..h6)` | (0,2,0) | thắng `body:not(.wp-admin) h2` (0,1,2) |
| `… .skvn-slide__content :where(p, .wp-block-paragraph)` | (0,2,0) | thắng `body:not(.wp-admin)` (0,0,1) và rule `p` của GP nếu có |
| `… .skvn-slide__content .wp-block-heading` | **(0,3,0)** | thắng `body:not(.wp-admin) .wp-block-heading` (0,2,1) **và** `.editor-styles-wrapper .wp-block-heading` (0,2,0) |
| `… .skvn-slide__content a` | (0,2,0) | thắn rule link của theme/GP; link có màu riêng vẫn thắng theo tầng 1 |

Vì `.skvn-slide__content` tồn tại giống nhau ở editor lẫn frontend (§1.3), **không cần nhánh selector riêng cho `.editor-styles-wrapper`**.

Lưu ý về tương tác với rule sẵn có ở `src/slider/style.css:114–117`: `.skvn-slide--has-background :where(h1..h6,p){color:#fff}` (0,1,0) thấp hơn rule `inherit` (0,2,0) nên bị thay thế trong Hero. Kết quả mong đợi vẫn là chữ trắng (qua kế thừa từ carrier), và preset Product Showcase / Card Carousel không bị ảnh hưởng vì không nằm trong `.skvn-slider--hero`. Giữ nguyên rule cũ — nó vẫn đúng nghĩa cho preset sáng.

Reset color: WP gỡ class `has-<slug>-color` và inline style → element rơi về `inherit` → trở lại default Hero. Không cần và không được lưu thêm giá trị trắng vào attributes.

Không cần adapter theme: không có bằng chứng nào cho thấy theme chặn màu **explicit**; theme chỉ đặt màu khi **không** có explicit. Vấn đề là "default của Hero bị theme lấn", xử lý bằng specificity trong chính plugin đúng boundary A2. **Kết luận: không sửa theme.**

Hạng mục cố ý **không** xử lý trong patch này (ghi để tránh hiểu nhầm là đã bao phủ): list, quote, table, và các block lồng sâu khác trong Hero vẫn nhận màu theme nếu theme có rule trực tiếp cho chúng. Mở rộng thêm chỉ khi có evidence runtime.

### 4.3. CTA: default có guard theo từng thuộc tính

**Xung đột quyết định phải nêu trước.** `docs/testing/onsite-button-hover-1.3.7.md:243` ghi rõ ngày 2026-06-23 đã **gỡ** `color: #073b5a` khỏi `.skvn-slider--hero .wp-block-button__link` để "không tự dưng gán màu vào". Bản plan này đề xuất gán lại navy — nhưng có điều kiện khác: chỉ gán **mặc định có guard**, và chỉ khi sửa nền để thắng GP. Nếu chỉ đổi nền mà không khai báo màu chữ, GP đang đặt `color:#fff` (bug report R7) sẽ tạo **chữ trắng trên nền trắng**. Vì vậy hai kênh phải đi cùng nhau và phải thắng GP ở cả hai.

Tách background và text thành hai kênh:

| Explicit editor value | Default dự kiến |
|---|---|
| Không text, không background | White-pill + navy text |
| Có text, không background | Giữ text explicit (inline / preset `!important`), nền trắng |
| Không text, có background/gradient | Giữ background explicit; **không** ép navy lên nền có thể tối — để core/theme behavior hiện tại |
| Có cả hai | Giữ cả hai |
| Có custom hover text hoặc background | State hover/focus dùng giá trị custom theo kênh đã chọn |

Selector đề xuất:

```css
.skvn-slider--hero .skvn-slide__content .wp-block-button__link:not(.has-background) {
	background: #fff;
	color: #073b5a;
}

.skvn-slider--hero .skvn-slide__content .wp-block-button__link:not(.has-background):hover,
.skvn-slider--hero .skvn-slide__content .wp-block-button__link:not(.has-background):focus-visible {
	background: #eaf7ff;
	color: #073b5a;
}
```

Cơ sở từng dòng:

- `:not(.has-background)` là guard duy nhất cần. WP chỉ gắn `has-background` khi editor đặt **background color hoặc gradient** (`src/slide/edit.tsx` không liên quan; đây là core block supports). Nhờ vậy mọi CTA có background/gradient chọn tay đều không bị rule default đụng tới — kể cả khi GP đang đặt nền riêng.
- Gradient/solid preset là `!important` (§1.2) nên ngay cả khi class lọt, preset vẫn thắng; guard ở đây chủ yếu để giữ **custom (inline) background** và tránh hover fallback phủ màu phẳng lên gradient.
- Specificity (0,4,0) — thắng GP `a.wp-block-button__link:not(.has-background)` (0,2,1) và thắng các rule hover gated sẵn có của preset khi xung đột (0,4,0, hover đặt sau base trong file).
- Các rule custom hover gated của Hero giữ nguyên và vẫn thắng vì đặt sau: `has-skvn-btn-hover-bg` / `has-skvn-btn-hover-text` (`src/slider/style.css:732–740`). Không tạo handler hover mới; vẫn dùng cơ chế `modules/core-control/features/button-hover.php`.
- Focus: giữ `:focus-visible` trong cùng nhánh `:hover` để không mất focus indicator.

### 4.4. Editor và nội dung cũ

- CSS Slider là một handle duy nhất cho cả hai surface (§1.3) → không cần nhánh editor-only, không cần thêm bundle hay handle mới.
- Editor DOM đã đối chiếu khớp renderer cho các class cần dùng (`skvn-slider--hero`, `skvn-slide__content`) nên selector dùng cho mày chung được; khác biệt `skvn-slide--editor` không ảnh hưởng các rule mới.
- Không chạy Swiper/autoplay trong editor, giữ stacked preview.
- Không thay variation attributes để buộc mọi core block lưu màu trắng. Cách đó bỏ sót content cũ và biến default thành explicit value khó reset.
- Save/reopen fixture cũ phải không báo invalid block và giữ nguyên custom color data.

## 5. Trình tự triển khai khi scope/version được xác nhận

### P0 — Khóa baseline và fixture

1. Ghi commit, working diff liên quan, build identity và URL asset thực tế; bảo toàn mọi thay đổi đang có của human.
2. Chụp frontend/editor trước sửa cho fixture default và custom. Lưu đúng cặp ảnh và DOM, không dùng ảnh từ session khác không truy cập được.
3. DevTools xác nhận winning declaration cho heading/body/CTA; kiểm cả branch `.wp-block-heading`.
4. Xác nhận hoặc bác bỏ giả định GP của bug report R7 (`a.wp-block-button__link:not(.has-background)`), vì nó quyết định có cần đổi nền CTA hay không.
5. Lập map màu explicit → marker/style/ancestor cho palette, inline, Group và button.

### P1 — Sửa contrast mặc định và explicit-color precedence

1. Sửa `src/slider/style.css` cho fallback text theo §4.2 (carrier + inherit). Không sửa renderer.
2. Sửa CTA normal/hover/focus có guard theo hai kênh theo §4.3.
3. Không thêm adapter theme: §4.2 đã kết luận theme không chặn màu explicit.
4. Kiểm selector matrix trước build: default thắng typography fallback, explicit thắng default, custom hover thắng hover fallback, preset khác không đổi.
5. Source check trên preset khác; không chỉnh generated bundle thủ công.

### P2 — Human build và visual/runtime verify

Human chạy build/lint theo AGENTS, báo output. Sau đó kiểm đúng build đã đưa lên môi trường được human cho phép. Test theo `docs/testing/hero-slider-contrast-and-flicker-repair.md`.

Nếu contrast FAIL: sửa cascade trên cùng fixture, không đổi engine. Nếu contrast PASS: ghi bằng chứng và chuyển P3. Không tự deploy production khi chưa được yêu cầu.

### P3 — Kiểm chứng chớp độc lập

1. Giữ nguyên settings trước/sau để so được cùng transition.
2. Quan sát tối thiểu ba transition bằng arrows/keyboard/pagination; kiểm autoplay riêng nếu môi trường cho phép.
3. Nếu còn chớp: đo cả outgoing/incoming bằng identity ổn định; sample computed color/opacity theo frame, ancestor opacity, class/inline changes, background và thời điểm transition. Buffer JSON, không log từng frame làm nhiễu.
4. Nếu computed color đổi: truy rule/style mutation thắng tại đúng frame đó, sửa nguyên nhân cụ thể.
5. Nếu computed color không đổi nhưng visual artifact còn: lưu clip/frames và trace phù hợp trước khi đề xuất sửa rendering/compositing. Không mặc định coi text-shadow hoặc backface là nguyên nhân.
6. Nếu không tái hiện: ghi environment + thao tác + kết quả “không tái hiện trong phiên”; chưa tuyên bố xác định root cause hoặc runtime PASS toàn bộ thiết bị.

Nếu phát hiện cần đổi motion contract hoặc phạm vi lớn hơn, ghi follow-up và trình evidence trước khi mở rộng repair.

## 6. Files dự kiến

| File | Vai trò |
|---|---|
| `wp-content/plugins/skvn-marine-blocks/src/slider/style.css` | **File sửa duy nhất**: default carrier/inherit + CTA guard/state cascade |
| `docs/testing/hero-slider-contrast-and-flicker-repair.md` | Fixture, thao tác, pass/fail và evidence |
| `docs/testing/onsite-button-hover-1.3.7.md` | Đọc phần quyết định màu CTA trước khi sửa; cập nhật nếu repair thay premise đã ghi |
| `build/style-view.ts*.css` | Do human build sinh; kiểm actual output, không chỉnh tay |
| Tài liệu quyết định liên quan | Update cùng đợt nếu implementation thay premise; giữ truy vết |

**Không** sửa `wp-content/themes/skvn-marine/style.css`: §4.2 đã kết luận không cần adapter theme. Không dự kiến sửa `view.ts`, `slide/edit.tsx`, PHP renderer, save/deprecated, `variations.ts`, `block.json` hoặc schema. Nếu P0 chứng minh phải sửa một trong các file này, nêu lý do cụ thể và ảnh hưởng compatibility trước khi mở scope.

## 7. Acceptance & Evidence

| ID | Nhóm | Hành vi mong đợi | Hiện trạng | Việc cần sửa | Cách kiểm | Evidence cần lưu |
|---|---|---|---|---|---|---|
| HERO-UI-01 | Block UI | Default text đọc được trên gradient, có/không ảnh | **FAIL source — đã xác định cơ chế**: theme `body:not(.wp-admin) .wp-block-heading` (0,2,1) và `body:not(.wp-admin)` (0,0,1) thắng mọi rule Hero hiện có; bug report R1/R2/R3 + §1.1 | Carrier `color` trên `.skvn-slide__content` + `color: inherit` ở (0,3,0) trên `.wp-block-heading` | Rest và midfade cả hai slide, có và không có ảnh | Before/after + winning styles |
| HERO-UI-02 | Block UI | Màu explicit trên block/Group/rich text giữ đúng | Chờ kiểm chứng | Không cần `:not()` guard vì preset là `!important` (§1.2); `inherit` bảo toàn màu container | Palette, inline, Group; reset | Attributes/DOM/computed + ảnh |
| HERO-UI-03 | Block UI | CTA default đủ tương phản và custom states được giữ | **FAIL source — suy luận**: GP (0,2,1) thắng plugin (0,2,0) nên CTA là pill xám; chưa đo DevTools | Guard `:not(.has-background)` ở (0,4,0), white-pill + navy, hover/focus có guard | Mouse + keyboard focus + gradient/custom hover | State screenshots + winning declarations |
| HERO-UX-01 | Editor UX | Preview phản ánh màu và reset/save-reopen đúng | Chờ kiểm chứng | Dùng chung selector, không cần adapter (§1.3, §4.4) | Stacked editor; cũ/mới | Editor trước/sau + save/reopen |
| HERO-TECH-01 | Technical | Class image semantics và saved compatibility giữ nguyên | Đã có source nền; chưa kiểm repair | Không đời renderer/schema | Diff review + reopen old content | Source diff + no-invalid-block evidence |
| HERO-TECH-02 | Technical | Build đúng, không tác động preset khác | Chưa làm | Build human + bounded regression | Showcase/Card; collection/core button ngoài hero | Build log + smoke screenshots |
| HERO-TECH-03 | Technical | Chớp được đánh giá bằng state delta | Chờ kiểm chứng, chưa tái hiện đáng tin | P3, chỉ fix nếu có nguyên nhân | Clip/JSON khi tái hiện | Environment + samples hoặc giới hạn |

Responsive/a11y áp vào từng surface liên quan. Không có source repair hay runtime PASS tại lúc viết. Không biến report của agent khác thành nghiệm thu trực tiếp.

## 8. Rủi ro, rollback và điều kiện hoàn thành

- Rủi ro chính đã được xử lý bằng cơ chế, không bằng hy vọng: preset color/gradient là `!important` và custom color là inline nên không bị patch ghi đè (§1.2). Vẫn phải kiểm fixture có màu explicit, không chỉ hero default.
- Rủi ro còn lại: rule `a { color: inherit }` trong Hero sẽ kéo link về trắng. Đây là chủ ý (link trên nền tối), nhưng phải xác nhận bằng ảnh — nếu human muốn giữ màu link như brand thì đó là thay đổi thiết kế, cần quyết riêng.
- Nội dung không có màu explicit hiện đang dựa vào theme dark sẽ đổi sang default sáng trong Hero; đây là thay đổi visual có chủ ý, cần kiểm old content. Không đổi text trên preset khác.
- Ảnh nền quá sáng/overlay thấp có thể cần editor chọn màu hoặc tăng overlay; patch không tự phân tích độ sáng ảnh.
- Rollback chỉ diff repair + build outputs tương ứng, không reset cả workspace đang có nhiều thay đổi khác. Không có DB migration nên không cần rollback dữ liệu.
- Contrast chỉ PASS khi có evidence cả default/custom ở frontend/editor và smoke liên quan. Chớp ghi outcome riêng; không cần bịa root cause để nghiệm thu phần contrast.
- Human visual approval và milestone/release transition vẫn là bước riêng. Chưa có timeline triển khai được xác nhận.

## 9. Lệnh handoff khi có implementation

Theo AGENTS, human chạy, agent không chạy build/lint:

```bash
source /home/shinkuro/.nvm/nvm.sh && nvm use 20 && cd /mnt/d/Github/skvn-marine/wp-content/plugins/skvn-marine-blocks && npm run build && find modules/ -name "*.php" -exec php -l {} \;
```

Planning-only hiện tại không chạy command này. Không cần packaging/PHP runtime artifact changes nếu repair thực tế chỉ đổi CSS.

## 10. Slider Editor UI Redesign — scope bổ sung2026-11-09

Human: “Thế thêm 1 cái vào phần này là làm redesign phần slider editor UI”. Approval scope trong1.3.21, chưa chốt layout/palette hoặc giao coding. Không hỏi lại có đưa vào1.3.21. Bước tiếp theo: audit và đề xuất thiết kế cho human xem.

### 10.1. Phạm vi và boundary

- Canvas/preview/chrome: bố cục làm việc, khung ngoài/label/palette/spacing, phân biệt Slider với từng Slide, editable content, thông tin/trạng thái/preview controls. Tận dụng chiều rộng canvas và editor hẹp.
- Inspector/settings: inventory và nhóm/nhãn/help/conditional visibility, Slider-level vs Slide-level; chưa tự thêm feature hoặc di chuyển controls trước proposal.
- Audit Hero, Product Showcase, Card Carousel và default Slider. Slider không phải Product Collection Carousel; không áp nguyên sample-card/query overview052 lên InnerBlocks thật.
- Nối053 P3/EF-SLIDER và phần Slider của EF-06. Palette cần đề xuất/chốt; giữ contract khung/spacing, không tự bỏ frame/background. Step Slider giữ1.3.24, EF-STEP và Step acceptance không chuyển sang1.3.21. Visual Sidebar054 chưa tự start.

### 10.2. Invariants

Native InnerBlocks/List View/core rich content vẫn là source of truth; không custom slide array/store song song, không serialize editor frame/session state, không chạy Swiper/autoplay frontend trên canvas. Nếu đề xuất thay stacked editing hiện hành, phải chứng minh nội dung vẫn editable/keyboard reachable trước khi human chốt; chưa tự chọn tabs/single-slide preview.

Giữ Add/select/reorder/remove/duplicate, focus, RichText/IME, Undo/Redo, Save/reopen và giới hạn5slide Hero/Showcase hiện hành. Controls phải đúng target clientId, không sửa parent khi chọn child. Không tự đổi limits hoặc motion/Advanced semantics.

Redesign đổi editor presentation/organization; frontend render/schema/save/runtime/motion giữ baseline. Contrast repair CSS dùng chung kiểm riêng. Nếu cần thay schema/feature frontend, nêu evidence/scope delta trước coding, không mở rộng ngầm.

### 10.3. Trình tự và acceptance

1. Audit src/slider/edit.tsx, src/slide/edit.tsx, variations, editor styles/registration và controls. Ghi URL/build/ảnh baseline, states/limits/hidden/disabled, control owners.
2. Vẽ text/mockup canvas rộng/hẹp, Inspector/Sidebar, palette/frame, parent/child selection, empty/one/many/limit/missing image/long text; thể hiện effect của từng control và giới hạn static preview. Human chốt trước coding.
3. Implementation khi được giao: editor/controls/styles/enqueue tương ứng, preserve native data và frontend. Files cụ thể chốt sau audit; giới hạn một CSS file của repair gốc không áp editor redesign.
4. Bổ sung runbook exact labels/steps theo approved design; human build/lint/onsite. Source/mock tests không thay browser/WordPress geometry/typing evidence.

SED-ED01 (audit/mockup approved), SED-ED02 (canvas/controls rộng-hẹp và parent-child), SED-ED03 (native lifecycle/limits), SED-ED04 (frame/states/static preview), SED-TECH01 (loaded assets/no leak/schema/store/invalid-block) và SED-UI01 (frontend regression/contrast) đều **Chưa làm**. Full checklist trong MILESTONES.md §1.3.21; format ID→nhóm→hành vi→hiện trạng→việc sửa→cách kiểm/evidence theo review contract. Evidence cần mockup/decision trace, paired shots/rect, video keyboard/IME/save-reopen, saved content/DOM/network/console trên đúng build.

HERO-* và SED-* nghiệm thu riêng; chớp có outcome riêng. Completion mở rộng cần đủ evidence/approval hoặc human defer có truy vết; không đóng chỉ vì contrast có source. Current vẫn1.3.20.
