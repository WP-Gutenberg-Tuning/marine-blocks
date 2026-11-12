# Group / Island width — container recipe và verification (1.3.20)

> Trạng thái: **Recipe doc — human verify onsite**. Hiện tượng đã human xác nhận 2026-11-11
> (grid 4→2 cột trong Group). Không có code delta trong đợt này — pipeline width đã tồn tại;
> product hóa (island pattern) **deferred 1.4.x** theo quyết định human 2026-11-11.
> Update 2026-11-12: human đã xác định được vị trí Align (Wide/Full) trên toolbar Group qua
> phiên editor local (post=71); `alignWide=true` xác nhận settings theme đúng — troubleshooting
> §3.2 khép lại.
> Update 2026-11-12 (2): human chỉ ra yêu cầu thật của island — **content max-width nhưng
> background tràn 2 viền**. Nguyên nhân là chọn align **Wide**: background tô đúng box của
> block, nên box 1200px → nền dừng ở 1200px (trông "bao sát khung"). Island đúng = **Group
> align Full** (nền tràn) + content bên trong giới hạn bởi constrained layout/align Wide.
> Recipe §3 viết lại theo kết luận này; vẫn **không code delta**.
> Update 2026-11-12 (3): human yêu cầu lấy **chuẩn UX của Elementor** làm tham chiếu và
> phản biện lại hiện tượng "nền chỉ bao đúng width". Đối chiếu tài liệu Elementor: kỳ vọng
> của human đúng với **default Boxed** của Elementor, nhưng "nền luôn tràn" không phải quy
> luật của Elementor — Full Width + Width cũng dừng nền tại box. Khác biệt là **default và
> số bước thao tác**, không phải lỗi paint. Phản biện đầy đủ ở **§4**.
> Update 2026-11-12 (4): human chốt luật một box (con theo cha, cha phủ hết con) và dùng
> WindPress chữa cháy có hạn đến khi có island group. Decision
> `docs/decisions/group-island-windpress-stopgap-1.3.20.md`, ghi ở §7.2. Chưa viết utility.
> Update 2026-11-12 (5): prototype class + diagnostic + test cases T-ISLAND-05..09 tại
> [`group-island-windpress-class-1.3.20.md`](group-island-windpress-class-1.3.20.md);
> chưa nạp vào site, tên class mới là đề xuất.

## 1. Bối cảnh

Human muốn dựng "island" — một surface có background riêng (đổi màu từ palette theme.json),
bên trong đặt core blocks (heading, paragraph) lẫn block plugin (Product Collection Grid,
Category Grid, carousel). Thử core **Group** → grid bên trong co hẹp: **4 cột desktop về
2 cột tablet** (preset 4-2-1).

Đo screenshot human gửi 2026-11-12 (group tô màu xanh `#00C950` để nhìn rõ vùng paint):

| Ảnh | Vùng xanh (group paint) | Nội dung |
|---|---|---|
| (1) | x 572..1331 = **760px**, canh giữa | grid 2 cột (gap 12px giữa 2 card) |
| (2) | x 352..1551 = **1200px**, canh giữa | grid 4 cột (3 gap 12px) |

Hai con số đúng bằng `--skvn-content-width` và `--skvn-wide-width` → chứng minh: **group
đang ăn theo width layer, không phải background tự co**; và vì clamp 760 chỉ tồn tại dưới
`.skvn-full-width-canvas`, trang test **đã bật full-width canvas**. Ngoài vùng xanh là nền
trang (trắng) — group không paint ở đó.

> **Giới hạn của số đo:** ảnh là 1903x927 px và phép đo trên giả định **scale 1:1**
> (pixel ảnh = CSS px). Nếu ảnh được chụp ở DPR/zoom ≠ 1 thì 760/1200 phải chia cho scale;
> kết luận "khớp đúng token" chỉ giữ nguyên khi scale = 1. Agent research có khả năng đọc ảnh
> chịu trách nhiệm xác minh (xem §8/handoff).
>
> **Đo lại 2026-11-12 (pixel scan, RLE):** card trắng trong ảnh cho số chính xác hơn vùng
> nền. Ảnh (1): card 1 = 572..985, card 2 = 998..1411 → **grid 572..1411 = 840** (2 cột × 414
> + gap 12). Ảnh (2): 4 card 311 + 3 gap 12 → **grid 352..1631 = 1280**. Cả hai: grid bám
> **mép trái** Group và vượt **mép phải đúng 80px**; delta hằng số 80px, không theo align,
> không theo số cột (2 cột +40/cột, 4 cột +20/cột). Vậy đây là **width delta của block grid**,
> không phải lỗi align Wide hay container query. Chủ của delta (rule CSS nào) vẫn chưa biết.
> Phân tích + prototype class chữa cháy: [`group-island-windpress-class-1.3.20.md`](group-island-windpress-class-1.3.20.md).

## 2. Root cause — width contract chỉ áp con trực tiếp

Theme clamp mọi block theo con trực tiếp của content wrapper
(`wp-content/themes/skvn-marine/style.css:994-1004`):

```css
.skvn-full-width-canvas .entry-content > * {
	max-width: var(--skvn-content-width);  /* 760px */
}
.skvn-full-width-canvas .entry-content > .alignwide {
	max-width: var(--skvn-wide-width);     /* 1200px */
}
```

Khi bọc block trong Group thường (không align):

1. **Group** trở thành con trực tiếp → bị clamp 760px.
2. Block plugin bên trong là `width: 100%` → theo parent → 760px.
3. **Container query lật layout im lặng**: collection `@container (max-width: 760px)`
   và category-grid `@container (min-width: 880px)` → rơi về preset tablet (2 cột).

Gutenberg constrained layout (default của Group) truyền width contract xuống con,
nhưng chỉ cho con **có align** (`> .alignwide` / `> .alignfull`). Vì vậy block bên trong
cũng phải tự opt-in Wide/Full. **Thiếu một trong hai bước → kẹp 760px.**

Pipeline đã có sẵn (không cần code mới):

| Thành phần | Vị trí |
|---|---|
| Attr `contentWidth` (normal/wide/full) + control Layout panel | `src/collection/controls.tsx:410-424` |
| Editor preview thêm class align | `src/collection/controls.tsx:140-141` |
| Frontend class mapper | `modules/collection-render/cards.php:900-909` |
| Category Grid / Slider / Feature Showcase core align toolbar | `block.json` `supports.align: ["wide","full"]` |

## 3. Recipe — island: background tràn 2 viền, content có max-width

Nguyên tắc gốc: **background tô đúng box của block**. Vì vậy:

```text
Group align Wide  -> box tối đa 1200px -> background dừng ở 1200px (hở 2 bên)
Group align Full  -> box 100% canvas   -> background tràn 2 viền
Content max-width -> do constrained layout của Group (760px) hoặc align Wide của từng block (1200px)
```

Muốn "nền tràn + chữ không kéo hết ngang" thì **hai việc tách rời**: Full align cho cái
hộp (nền), max-width cho nội dung bên trong. Không có cách nào để một box 1200px vừa giữ
nền vừa cho nền tràn ra ngoài box — nền luôn bằng box.

### 3.1 Precheck — trang phải là Full Width Canvas

`alignfull` chỉ tràn tới biên của **content wrapper**. Nếu trang không bật canvas:

- `.entry-content` vẫn là container GeneratePress (max-width + padding) →
  `alignfull` = đúng bằng container đó → nền vẫn "bao sát khung", không tới 2 viền màn hình.

Kiểm 1 dòng trong console frontend:

```javascript
({
	canvas: document.body.classList.contains('skvn-full-width-canvas') ? 'ON' : 'OFF',
	viewport: document.documentElement.clientWidth,
	content: document.querySelector('.entry-content')?.getBoundingClientRect(),
});
```

- `canvas: ON` và `content.width === viewport` → đủ điều kiện nền tràn.
- `canvas: OFF` (hoặc `content.width < viewport`) → bật **Page display → Full width canvas**
  (meta `_skvn_full_width_canvas`, hoặc preset `skvn_landing_canvas`) rồi lưu trang.

### 3.2 Các bước

1. Thêm block **Group** → toolbar → alignment **Full** (không phải Wide). Bước này lo
   **background tràn 2 viền**; Group thường bị clamp 760px còn Group Wide bị giới hạn
   1200px → nền hở 2 bên.
2. **Color settings của Group** → Background (palette theme.json) + Text color nếu nền tối.
3. Nội dung bên trong — Group mặc định `layout: constrained`, con không align nhận
   `contentSize` của theme.json (**760px**, canh giữa):
   - Text (heading/paragraph): để mặc định 760px — measure đọc tốt.
   - **Product/Post Collection** → sidebar **Layout → Content width: Wide**.
   - **Category Grid / Slider / Feature Showcase** → nút align **Wide** trên toolbar.
   - Muốn text cũng 1200px: set Wide cho từng block text đó.
4. Padding của Group: block padding trên/dưới theo design; **padding inline** để chừa
   gutter trên mobile (background vẫn tràn vì padding nằm trong box).

### 3.3 Giới hạn hiện tại của theme (evidence cho island pattern 1.4.x)

`.skvn-section` island có sẵn trong theme (`style.css:130-157`) đi theo hướng **override
từng class con** lên 1200px — chỉ `skvn-section__eyebrow/heading/lead` và `.wp-block-buttons`:

```css
.skvn-section.alignfull > .skvn-section__heading { max-width: var(--skvn-wide-width); }
```

Block không nằm trong danh sách đó (grid/carousel/ảnh/columns) rơi về constrained
**760px** của core → container query lật tablet. Đây chính là lý do "island" hiện không
dùng chung được cho mọi nội dung, và là phạm vi của island primitive ở 1.4.x (thay override
theo class bằng một measure duy nhất do band sở hữu).

Hướng native cho 1.4.x (không CSS): core nhận `layout.contentSize` theo từng instance
(`wp-includes/block-supports/layout.php:353-366`), nên một **pattern** alignfull với
`"layout":{"type":"constrained","contentSize":"1200px"}` cho toàn bộ nội dung 1200px mà
không phải set Wide từng block. UI hiện tại không có ô nhập contentSize, nên đây là việc
của pattern/style variation, không phải thao tác editor.

### 3.4 Troubleshooting — Align (Wide/Full) không hiện trên toolbar Group

Behavior documented của Gutenberg khi theme dùng `theme.json`. Kiểm theo thứ tự:

1. **Chọn đúng Group** — click vào nội dung bên trong sẽ chọn block con (Paragraph/
   Heading), không phải Group. Mở **List View** (☰) → click đúng hàng Group.
2. **Toolbar overflow** — với toolbar nhiều nút, Align có thể bị gom vào menu
   **"⋯"** cuối toolbar (mục Align → Wide width / Full width).
3. **Parent chặn width** — Group nằm bên trong container/pattern khác → parent
   điều khiển width → Align của Group bị ẩn hoặc xám kèm nhãn **"Not available"**.
   Chọn container ngoài cùng qua List View, hoặc đưa island ra top level của page.
4. **Chẩn đoán editor setting** — console trong editor:
   `wp.data.select('core/block-editor').getSettings().alignWide` → kỳ vọng `true`
   (theme đã khai báo `add_theme_support('align-wide')` + `theme.json` `wideSize`).
   Nếu `false` → báo agent (vấn đề settings thật, không phải UI).
5. **Editor ≠ frontend** — theme có rule editor-only
   `body.block-editor-iframe__body.editor-styles-wrapper.post-type-page { padding-left: 64px }`
   (`style.css:117-121`). Trong iframe editor, mọi block bị đẩy lệch trái **64px** nên
   alignfull trông không chạm mép trái. Đánh giá "nền tràn 2 viền" phải xem **Preview /
   frontend**, không kết luận từ khung editor.

## 4. Phản biện — chuẩn UX Elementor làm tham chiếu

### 4.1 Phát biểu cần phản biện

> "Trong cái hình có 1 cái là nền đó không bao hoàn toàn content mà chỉ bao đúng phần width
> của nó."

Đọc kỹ thuật: ảnh (1) — group paint 760px — bị đọc là "nền không phủ hết content, nền bằng
đúng width của chính nó", và kỳ vọng chuẩn là **Elementor: band có nền tràn, chỉ content bị
giới hạn max-width**. Yêu cầu kèm theo: lấy Elementor làm tham chiếu và phản biện lại kết
luận "không code delta".

### 4.2 Elementor thực sự định nghĩa gì

Nguồn: Elementor Help — *Define container layout* (Layout tab) và *Section Overview*, đọc
2026-11-12. Container (bản hiện hành):

| Content Width | Elementor mô tả (nguyên văn rút gọn) | Box = nền | Measure |
|---|---|---|---|
| **Boxed** (default) | "adjust the width of the content inside the container but not the container's width" | available width; nếu là parent → "occupy the full viewport width" | Width control |
| **Full Width** | "adjust the container's width but not the container's content width" | đúng width đặt trên container | container (padding) |
| **Full Width** + width + padding | "adjust the container's width and the container's content width" | đúng width đặt | padding |

Nguyên văn bổ sung: "By default, 'Boxed' & 'Full width' containers will stretch on the
available space according to their placement in the layout — if the container is a parent it
will then occupy the full viewport width."

Section (legacy) cùng mô hình, khác cách triển khai: `Content Width: Boxed | Full Width`
(Boxed kèm slider width, measure nằm ở `.elementor-container` bên trong) + `Stretch Section:
Force the Section to stretch to the full width of the page`. Background thuộc Section; measure
thuộc container con.

**Điểm quyết định:** nền của Elementor cũng là nền của **box**, không phải của viewport.
Elementor chỉ làm background "tràn" được vì ở chế độ Boxed box ngoài = available width (parent
= full viewport). Ở Full Width + Width 1200, nền Elementor dừng đúng 1200px.

Xác nhận ở mức source (Elementor `assets/dev/scss/frontend/_container.scss`, nhánh `main`,
đọc 2026-11-12):

```scss
.e-con {
	--content-width: min(100%, var(--container-max-width, 1140px)); // Site Settings
	--width: 100%;
	width: var(--width);                       // box ngoài = available width
}
.e-con > .e-con-inner {
	width: 100%;
	max-width: var(--content-width);           // measure nằm ở element con
	margin: 0 auto;
}
```

Tức Boxed của Elementor = **box ngoài 100% (giữ background) + element con giữ measure** — cùng
cấu trúc hai tầng với `alignfull` + `layout.constrained` của Gutenberg. Full Width chỉ đổi
`--width` của box ngoài, nên background co theo.

### 4.3 Đối chiếu sang Gutenberg / SKVN

| Elementor | Gutenberg / SKVN | Nền dừng ở |
|---|---|---|
| Boxed (default) | Group **Full** + con constrained 760 / Wide 1200 | 2 viền màn hình |
| Full Width + Width 1200 | Group **Wide** | 1200px |
| Full Width + Width 760 | Group **không align** | 760px — chính là ảnh (1) |

Ảnh (1) = "Full Width + Width 760"; ảnh (2) = "Full Width + Width 1200". Cả hai **không phải**
Boxed. Boxed chỉ đạt khi Full cho box + measure cho content — đúng recipe §3.2.

### 4.4 Phản biện

1. **Kỳ vọng của human đúng, nhưng đúng với `default`, không phải với mọi setting.** Người
   dùng quen "nền tràn" vì Elementor mặc định Boxed. Gutenberg mặc định ngược lại: box = 760
   → nền = 760. Đây là **khác biệt default**, không phải lỗi paint của theme.
2. **Premise "nền phải tràn bất kể width" là sai — kể cả ở Elementor.** Full Width + Width
   1200 vẫn dừng nền ở 1200. Không renderer nào cho background vượt box của chính nó, trừ khi
   thêm một box khác (pseudo-element full-bleed). Vì vậy sửa đúng là **chọn box = full**,
   không phải "kéo nền ra ngoài box".
3. **Gap thật của Gutenberg là control, không phải geometry.** Elementor có một control
   (Content Width) quyết định box hay measure; Gutenberg chỉ có alignment, nên cần **2 bước**:
   Full cho band + Wide/constrained cho con. Recipe §3.2 là bản dịch chính xác của Boxed,
   không phải workaround tạm.
4. **760 là mismatch thứ hai, độc lập với align.** Boxed của Elementor lấy Site Settings →
   Content Width làm measure layout (thường 1140–1200px); `theme.json` SKVN dùng
   `contentSize` 760px làm measure đọc chữ. Nên khi đã "Boxed" đúng, text vẫn 760 trong band
   1200 — vẫn trông như "content không được bao". Với island chứa grid/carousel, measure phải
   là `wideSize` 1200 (Content width Wide / toolbar Wide), không phải 760.
5. **Không được "sửa" bằng CSS theme.** Muốn một-control như Elementor thì phải thêm một box
   khác (pattern/style variation), không override width của con trong theme CSS — làm vậy là
   nhân bản layout engine và phá one-owner (contract Container Nesting).

### 4.5 Kết luận

- Hiện tượng "nền chỉ bao đúng width" là **đúng theo model Gutenberg**, sai theo **default
  quen thuộc của Elementor**; cả hai đều không phải bug theme, và cũng không phải bằng chứng
  recipe 2 bước sai.
- **1.3.20 giữ recipe 2 bước** (§3.2) — tương đương Boxed của Elementor, dùng control có sẵn,
  không CSS mới.
- Parity "một control" (đúng cảm giác Boxed) chỉ đạt khi có **island pattern**: `alignfull` +
  `layout: constrained` + `contentSize` riêng (§3.3), zero CSS. Đưa vào 1.3.20 hay giữ 1.4.x
  là quyết định human — chưa tự start.

## 5. Verification — human chạy onsite

### T-ISLAND-01 — Collection Grid trong island Full (nền tràn)

- **Setup:** trang test local (Full Width Canvas ON); Product Collection Grid preset 4-2-1
  đặt trong Group align **Full**, bg `skvn-sky-50`, có heading + paragraph core phía trên.
- **Bước:** set recipe §3.2; xem desktop (≥1200 viewport), tablet, mobile.
- **Pass:** nền Group chạm 2 viền màn hình (không có dải trắng 2 bên); desktop 4 cột;
  tablet 2; mobile 1; chữ core đồng màu với Text color của Group; không horizontal overflow.
- **Fail:** nền vẫn hở 2 bên → Group chưa Full (hoặc trang chưa bật canvas — chạy §3.1);
  desktop vẫn 2 cột → grid chưa Wide (DevTools: `.skvn-collection` phải có class `alignwide`).

### T-ISLAND-02 — Category Grid trong island Full

- **Setup:** Category Grid trong Group align Full, bg `skvn-blue-950`, text trắng.
- **Pass:** columns đúng settings (desktop/tablet/mobile); card không tràn; không
  horizontal overflow.
- **Fail:** card text khó đọc → Text color Group chưa set; grid kẹt hẹp → toolbar align
  chưa set trên block.

### T-ISLAND-03 — Geometry (theo css-layout-safety-contract)

```javascript
({
	clientWidth: document.documentElement.clientWidth,
	scrollWidth: document.documentElement.scrollWidth,
	island: document.querySelector('.entry-content > .wp-block-group')?.getBoundingClientRect(),
	grid: document.querySelector('.skvn-collection, .skvn-category-grid')?.getBoundingClientRect(),
});
```

- **Pass:** `scrollWidth <= clientWidth`; island `[left >= 0, right <= clientWidth]`;
  grid nằm trong island bounds. Desktop có scrollbar dọc.

### T-ISLAND-04 — Background tràn 2 viền (yêu cầu chính của island)

```javascript
({
	viewport: document.documentElement.clientWidth,
	island: document.querySelector('.entry-content > .wp-block-group')?.getBoundingClientRect(),
	content: document.querySelector('.entry-content > .wp-block-group > *')?.getBoundingClientRect(),
	bg: getComputedStyle(document.querySelector('.entry-content > .wp-block-group')).backgroundColor,
});
```

- **Pass:** `island.width === viewport` (sai số ≤ 1px, kể cả khi có scrollbar dọc) và
  `island.left === 0`; `content.width` ≈ 760 (text) hoặc ≤ 1200 (block Wide) và nằm giữa;
  `bg` khác `rgba(0, 0, 0, 0)`.
- **Fail:** `island.width ≈ 1200` → Group đang Wide, đổi sang Full; `island.width < viewport`
  nhưng Group đã Full → trang chưa bật Full Width Canvas (§3.1).

## 6. Evidence cần trả

Screenshot desktop/tablet/mobile mỗi case — đặc biệt ảnh **chụp full màn hình** để thấy nền
có chạm 2 viền hay không; DevTools class list của Group + block (`alignfull`/`alignwide`
hiện diện); output geometry T-ISLAND-03 + T-ISLAND-04. Redact dữ liệu cá nhân.

## 7. Phạm vi

- **1.3.20:** recipe doc này + PITFALLS DP-07. **Không code delta** — yêu cầu "nền tràn +
  content max-width" đạt được bằng Group align Full, không cần CSS mới. Ngoại lệ duy nhất nếu
  human chọn phương án B ở §7.1 (island pattern zero-CSS).
- **1.4.x (human defer 2026-11-11):** island pattern/style variation — một band tự sở hữu
  measure (thay vì override từng class con như `.skvn-section` hiện tại), nền tràn 2 viền,
  ăn palette slug không hardcode hex (nối hướng 064 Brand Kit); kèm quyết định default
  Content width cho grid mới.
- Nếu muốn đổi default (vd. new grids start Wide như carousel đã làm) → product decision
  riêng, không gộp đợt này.

### 7.1 Decision gate mở (Elementor-parity)

Theo §4, 1.3.20 hiện chỉ thiếu **UX một-control**, không thiếu geometry. Hai lựa chọn, human
quyết:

| Phương án | Delta | Ưu | Nhược |
|---|---|---|---|
| A. Giữ recipe 2 bước (default hiện tại) | 0 code | Đúng model Gutenberg, one-owner, không CSS | Editor phải nhớ 2 bước; không giống cảm giác Boxed |
| B. Thêm island pattern zero-CSS vào 1.3.20 (`alignfull` + constrained `contentSize` 1200 + palette slug) | 1 pattern file (theme layer), 0 CSS | Chọn 1 lần trong Inserter, đúng parity Boxed | Cần chốt measure mặc định (1200) và tên pattern; mở scope giữa milestone |

Không chọn C (CSS override width của con trong theme): vi phạm Container Nesting / one-owner.

**Handoff research (2026-11-12):** human giao agent có khả năng đọc ảnh phản biện độc lập §4
và xác minh lại số đo ảnh (scale/DPR, ảnh 1903x927) trước khi chốt A/B. Prompt chuyển giao:
`docs/workflows/prompts/group-island-elementor-rebuttal-agent-handoff.md`. Số đo §1 hiện dựa
trên giả định scale 1:1, **chưa** được chứng minh.

### 7.2 Đã quyết — WindPress chữa cháy (2026-11-12)

Human chốt trong chat. Bản đầy đủ: `docs/decisions/group-island-windpress-stopgap-1.3.20.md`.

Luật UX: Category Grid nằm trong Group là một box. Node trong lấy width của node ngoài. Node ngoài phủ hết node trong. Ảnh đo được nền đúng 760px hoặc 1200px, grid nhô phải 80px. Đó không phải lỗi thao tác align.

WindPress trên site là bản có thời hạn, chỉ những Group đang làm island tạm, một class riêng chưa đặt tên. Core Group khác giữ FSE. Utility: con trực tiếp theo width Group, nền Group phủ hết con. Cấm `overflow` để cắt card. Không đưa vào runtime plugin hay CSS theme. Gỡ class khi island group thành chủ box. §7.1 A/B chưa được chọn. 80px chưa có chủ: class này không chữa card tràn từ bên trong một grid đã đúng 100%.

