# 066 — Group Island Block: nền tảng kỹ thuật & đánh giá

> **Trạng thái: FOUNDATION / PLANNING ONLY.**
> Không phải approval, không phải start, không SemVer, không scope addition.
>
> - **Milestone:** `none` — island defer **1.4.x** theo quyết định human 2026-11-11; chưa gán version.
> - **Ngày:** 2026-11-12.
> - **Current milestone:** V1 / **1.3.20** — giữ nguyên, tài liệu này không bump/transition.
> - **Bối cảnh:** human 2026-11-12 tuyên bố *"tạm thời không sử dụng Group"* → bản chữa cháy
>   WindPress **dormant**; human yêu cầu gom toàn bộ kết luận/đánh giá thành nền cho **block
>   group island** sau này.
> - **Không có source delta** trong đợt này (theme/plugin/runtime). Không build/lint/deploy/commit.
>
> Đọc kèm: [`group-island-width-1.3.20.md`](../../docs/testing/group-island-width-1.3.20.md) (recipe +
> phản biện Elementor), [`group-island-windpress-class-1.3.20.md`](../../docs/testing/group-island-windpress-class-1.3.20.md)
> (đo onsite + probe + root cause), [`group-island-windpress-stopgap-1.3.20.md`](../../docs/decisions/group-island-windpress-stopgap-1.3.20.md)
> (decision stopgap), `.context/PITFALLS.md` DP-07 / DP-07.1,
> `docs/standards/css-layout-safety-contract.md` (Gutenberg Width Contract, Container Nesting,
> Alignment Ownership, Overflow Rule).

---

## 0. Cách đọc tài liệu này

| Phần | Trả lời câu hỏi | Mức chốt |
|---|---|---|
| §1 | Island là gì, gồm những lớp nào | **Đã chốt** (luật UX human 2026-11-12) |
| §2 | Sự thật đo được / root cause | **Đã chốt** (evidence onsite + probe) |
| §3 | Ràng buộc bắt buộc khi làm block | **Đã chốt** (kế thừa standards + decision) |
| §4 | Mô hình measure | **Đề xuất**, human chưa chọn |
| §5 | Kiến trúc A1/A2/B/C | **Đề xuất**, human chưa chọn |
| §6 | Hợp đồng kỹ thuật | **Đề xuất**, phần lớn suy ra từ §2–§3 |
| §7 | Acceptance IDs | **Đề xuất**, chưa duyệt ID |
| §8 | Bảng chẩn đoán lỗi | **Đã chốt** (từ 2 lần debug thật) |
| §9–§11 | Rủi ro, gate, việc không lặp lại | **Đề xuất** |

Không có mục nào trong tài liệu này là "PASS", "DONE", hay "đã duyệt để code".

---

## 1. Island là gì

### 1.1 Luật một box (human chốt 2026-11-12)

> Category Grid nằm trong Group thì đó là **một box**.
> Node trong lấy bề rộng của node ngoài. Node ngoài **phủ hết** node trong.

Phát biểu này có hai vế và **cả hai đều phải đúng cùng lúc**:

1. **Con theo cha** — không có phần tử nào bên trong rộng hơn box chứa nó.
2. **Cha phủ hết con** — nền của box phải bao trọn con, không hở, không cắt.

Mọi lỗi đã gặp trong 1.3.20 là vi phạm một trong hai vế, không phải lỗi "màu nền".

### 1.2 Ba lớp tách biệt — không được gộp

Island là **ba thứ khác nhau**, mỗi thứ có một chủ:

| Lớp | Là gì | Chủ | Ghi chú |
|---|---|---|---|
| **Band** | Box có nền/màu, quyết định vùng paint | Island block | Nền luôn = border box của band. Không renderer nào cho nền vượt box của chính nó. |
| **Measure** | Bề rộng tối đa của nội dung bên trong band | Island block (một owner) | 760 là measure đọc chữ; 1200 là measure layout. Xem §4. |
| **Gutter** | Padding-inline để nội dung không dính mép trên mobile | Island block (token) | Nằm **trong** band → nền vẫn tràn. Không dùng margin âm để "bù". |

Hệ quả trực tiếp: **"nền tràn 2 viền + chữ 760" không thể là một box phẳng**. Nó bắt buộc là
band (full) + một tầng measure bên trong. Đây là kết luận từ phản biện Elementor — Elementor
cũng làm đúng như vậy (`.e-con` = box 100%, `.e-con-inner` = measure), không có phép thuật nào
cho background vượt box.

### 1.3 Island KHÔNG phải là gì

- **Không** phải section builder / page builder. Không có column system, không có style presets
  cho từng loại nội dung.
- **Không** phải query owner. Product/Post Collection vẫn sở hữu query của chúng.
- **Không** phải layout engine thứ hai. Không được tái triển khai constrained layout của
  Gutenberg cho cháu (xem §3 I-04).
- **Không** phải nơi chứa CSS override theo tên block con (`.skvn-section` hiện tại là ví dụ
  phản diện — xem §5.4).

---

## 2. Sự thật đã khóa (evidence)

### 2.1 Token, scale, số đo

| Hạng mục | Giá trị | Nguồn |
|---|---|---|
| `contentSize` | **760px** | `wp-content/themes/skvn-marine/theme.json:5` |
| `wideSize` | **1200px** | `theme.json:6` |
| Viewport đo | `clientWidth 1903`, `innerWidth 1920` (scrollbar 17px), `scrollWidth 1903`, `dpr 1`, `zoom 1` | onsite post=71, 2026-11-12 |
| Scale ảnh | **1:1 đã xác nhận** — 760/1200/80 trong ảnh là CSS px thật | như trên |
| Island Wide | `351.5 … 1551.5` = **1200** | `getBoundingClientRect` |
| Grid trong island | `351.5 … 1631.5` = **1280** | như trên |
| Delta | **+80px, chỉ bên phải**; mép trái khít 0 | như trên |
| Card | 311 (4 cột) / 414 (2 cột), gap 12 | pixel scan RLE 2 ảnh |
| Scroll ngang | **không có** (`scrollWidth 1903 = clientWidth`) | onsite |

Delta 80 là **hằng số**, không phụ thuộc align (760 hay 1200) và không phụ thuộc số cột
(2 cột +40/cột, 4 cột +20/cột). Đây là dấu hiệu của **sai width ở container**, không phải
sai chia cột.

### 2.2 Ba thất bại riêng biệt của core Group — đừng gộp thành một "lỗi Group"

Đây là phần quan trọng nhất để không lặp lại sai lầm debug: ba hiện tượng, ba nguyên nhân,
ba cách chữa khác nhau.

| # | Hiện tượng | Nguyên nhân thật | Chữa đúng |
|---|---|---|---|
| **F1** | Grid 4 cột → 2 cột khi bọc trong Group | Group không align trở thành con trực tiếp `.entry-content` → bị clamp **760** (`style.css:994-1000`); block con `width:100%` theo parent; container query lật tablet **im lặng** (collection `max-width:760`, category-grid `min-width:880`) | 2 bước: container align Wide/Full + block con opt-in Wide (DP-07) |
| **F2** | Nền dừng ở 1200, hở 2 bên | Background **luôn** bằng box của block. Group Wide → box 1200 → nền 1200 | Chọn box = **Full** cho band, measure cho nội dung (recipe §3 ledger) |
| **F3** | Grid 1280 trong Group 1200, **chỉ tràn phải 80px** | GeneratePress dynamic inline CSS — xem §2.3 | Neutralize math `.alignwide` của GP (T1) **hoặc** correction scoped trong island |

F1 và F3 **cùng tồn tại độc lập**: F1 làm mất cột, F3 làm tràn phải. Sửa F1 (align Wide) vẫn
còn F3 — đó chính là ảnh (2). Vì vậy island phải xử lý cả hai, không được coi "đã align Wide
là xong".

### 2.3 Root cause F3 — GP `.alignwide` math

GeneratePress phát CSS **dynamic lúc runtime** (`<style id="generate-style-inline-css">`), sinh
từ setting *Content padding* của nó:

```css
.entry-content .alignwide,
body:not(.no-sidebar) .entry-content .alignfull {
	margin-left: -40px;
	width: calc(100% + 80px);
	max-width: calc(100% + 80px);
}
```

(desktop 40px; media query ≤768px phát biến thể `-30px / +60px`.)

Cơ chế gây tràn **một phía**:

1. GP giả định `.entry-content` có **content padding 40px**. Muốn wide block tràn ra ngoài
   padding đó, nó bù `margin-left:-40px` và cộng `width +80px` (40 mỗi bên).
2. Canvas SKVN đã **zero padding** (`.skvn-full-width-canvas .entry-content { padding: 0 }`,
   `style.css:963-968`) → không còn padding để bù.
3. Core constrained layout ép `margin-left/right: auto !important` cho con không align
   (`.is-layout-constrained > :where(...)`, `!important`) → **mất luôn phần bù trái `-40px`**.
4. Còn lại đúng cặp `width/max-width: 100% + 80px` + margin auto → **rộng hơn parent 80px,
   canh trái, tràn phải**.

Vì sao **chỉ lộ khi nested**:

| Ngữ cảnh | Rule thắng `max-width` | Specificity | Kết quả |
|---|---|---|---|
| Page level (con trực tiếp `.entry-content`) | theme `.skvn-full-width-canvas .entry-content > .alignwide { max-width: 1200 }` (`style.css:1002-1004`), load **sau** GP | `(0,3,0)` > GP `(0,2,0)` | đúng 1200 |
| Nested trong Group | GP `.entry-content .alignwide` — descendant selector vẫn khớp; theme clamp là `>` nên **không** khớp | GP `(0,2,0)` thắng core `.is-layout-constrained > .alignwide` `(0,2,0)` **nhờ thứ tự load** (core ở head sớm, GP inline sau) | `calc(100% + 80px)` |

Điểm cần nhớ: **core một mình thì đúng**. `.is-layout-constrained > .alignwide { max-width:
var(--wp--style--global--wide-size) }` = 1200, và `width` không bị set → `auto` = 100% parent.
Chỉ GP phá. Nên "neutralize GP trong scope island" là **sửa một xung đột**, không phải viết lại
layout engine.

**Chống tái diễn:** rule GP **không tồn tại trong file nào** — grep repo/runtime luôn ra 0.
Khi một block nested rộng hơn parent đúng một hằng số: đọc `getComputedStyle().maxWidth`
**trước**, rồi quét `document.styleSheets`. Ghi ở PITFALLS **DP-07.1**.

### 2.4 Vì sao stopgap WindPress chưa từng chạy (và đang dormant)

- Prototype `.skvn-island-group` **thắng được**: probe inject rule cho `1280 → 1200`,
  `delta 80 → 0`, `maxWidth: 100%`. Cơ chế một-box là đúng và đủ.
- Nhưng rule **không có mặt trong CSS serve**: vắng trong `windpress-cached-inline-css`, và
  vắng trong `windpress:vfs` (virtual filesystem base64 của WindPress, decode 9.477 byte,
  **0 match** `island-group`). Tức lần paste chưa được lưu/compile vào project WindPress đang
  phục vụ trang.
- Human 2026-11-12 **tạm không dùng Group** → stopgap **dormant**, không cần thao tác site.
  **T2 (tiếp tục stopgap class) không còn được theo đuổi.** Class `.skvn-island-group` là
  **tên lịch sử của prototype**, không phải tên block tương lai.
- Bài học cho island block: **"CSS đã đúng" ≠ "CSS đã được nạp"**. Mọi acceptance của block
  phải verify trên **CSS serve**, không chỉ trên source/probe.

### 2.5 Đã loại khỏi danh sách nghi phạm (đừng điều tra lại)

| Nghi phạm | Kết luận | Bằng chứng |
|---|---|---|
| Category Grid / Collection bug | **Không** — plugin build không khai báo `width/max-width` cho wrapper | `build/style-index.ts.css` chỉ có `width:100%`/`max-width:100%` cho ảnh/CTA/input |
| Container query | **Không** — delta là width của container, không phải chia cột | 80px hằng số ở 2 và 4 cột |
| Site CSS experiment / Additional CSS | **Không** | `wp-custom-css: false`, không có rule trong theme/plugin/runtime files |
| `<ul>` / card / `position` / `transform` | **Không** | computed: `position: static`, `transform: none`, margin 0/0 |
| Align Wide | **Không** — align chỉ làm nền dừng ở 1200 | ảnh (2) |
| WindPress class | **Không** — chưa từng có mặt trong CSS serve | §2.4 |
| Theme `.skvn-section` | **Không** liên quan island — nhưng là **anti-pattern** cần thay (§5.4) | `style.css:130-157` |

---

## 3. Ràng buộc bắt buộc (invariants)

Mỗi invariant phải kiểm được, không phải khẩu hiệu.

| ID | Invariant | Cách kiểm |
|---|---|---|
| **I-01** | **Một owner width cho mỗi surface.** Island sở hữu band + measure; con không khai báo width của box. | Audit CSS: không rule nào set `width`/`max-width` cho `.skvn-category-grid`, `.skvn-collection`, `.skvn-slider` khi nằm trong island. |
| **I-02** | **Con theo cha, không ngoại lệ.** Mọi con trực tiếp có `right ≤ band.right + 1`. | Geometry check §7 GI-B03. |
| **I-03** | **Cha phủ hết con.** Nền band bao trọn con; không hở, không cắt. | Screenshot + `overflow: visible` trên band và wrapper con. |
| **I-04** | **Không tái triển khai layout engine.** Không viết CSS "propagate" width xuống cháu ngoài scope một island instance. | Review CSS: rule island chỉ nhắm con trực tiếp + correction xung đột GP; không copy logic constrained. |
| **I-05** | **Cấm `overflow: hidden/clip`** để che geometry tràn. | `getComputedStyle().overflow` = `visible`; grep `overflow.*(hidden|clip)` trong CSS island. |
| **I-06** | **Cấm `100vw` / `50vw` / negative-margin full-bleed.** | grep audit. |
| **I-07** | **Nền = box của band.** Không pseudo-element full-bleed trừ khi human duyệt riêng. | computed `backgroundColor` khác `rgba(0,0,0,0)`; `band.width === viewport` khi Full. |
| **I-08** | **Màu lấy từ palette slug**, không hardcode hex trong attribute/pattern. | Audit `block.json` + pattern + saved markup. |
| **I-09** | **Editor không được "giả lập" đúng.** Không clamp bằng CSS editor-only để che lỗi frontend; 64px offset của editor chrome (`style.css:117-121`) là **hành vi đúng**, không phải bug. | So preview vs frontend; không thêm rule `body.block-editor-iframe__body ... max-width`. |
| **I-10** | **Không phụ thuộc CSS site.** Island phải đúng khi site không có WindPress rule nào. | Test với WindPress tắt/không có rule. |
| **I-11** | **Không đổi hành vi core Group ngoài island.** Group thường giữ FSE. | T-ISLAND-07 kiểu test: Group không class/không phải island không đổi. |
| **I-12** | **Animation/transition (nếu có) phải có `prefers-reduced-motion`.** | Review + test media query. |

---

## 4. Mô hình measure — đánh giá (đề xuất, chưa chọn)

Vấn đề: island chứa **cả text lẫn grid**. Text cần measure đọc (~760), grid cần measure layout
(1200). Đây là lý do island không thể là "một box một width" nếu muốn cả hai đúng.

### 4.1 Ba mô hình

| Mô hình | Band | Nội dung | Ưu | Nhược | Kết luận |
|---|---|---|---|---|---|
| **M1 — single 760** | full | tất cả 760 | Đơn giản nhất, typography tốt | Grid 760 → container query lật **tablet** (đã chứng minh: DP-07). **FAIL mặc định.** | Loại |
| **M2 — single 1200** | full | tất cả 1200 | Grid/carousel đúng ngay, 1 owner, 0 bước phụ | Paragraph/heading kéo 1200 → measure đọc xấu (I-typography) | Chấp nhận được cho island "layout-heavy" |
| **M3 — hai measure** | full | *content* 760 (text) + *wide* 1200 (media/grid) | Đúng cả hai | Cần cơ chế opt-in cho con → xem 4.2 | **Khuyến nghị** |

### 4.2 Nếu chọn M3 — ba cách cho con opt-in 1200

| Cách | Cơ chế | Ưu | Nhược |
|---|---|---|---|
| **M3-a native** | Island dùng layout constrained `contentSize: 760`, `wideSize: 1200`; block con có align (`alignwide`) mới lên 1200 | 0 CSS, đúng core, one-owner | Vẫn là **2 bước** cho editor (đúng vấn đề ban đầu) |
| **M3-b allowlist** | Island thêm một rule **trong scope island** cho các block "layout-heavy" đã biết (`category-grid`, `collection`, `slider`) → `max-width: var(--island-wide)` | 1 bước, grid tự đúng | Coupling theo tên block; mỗi block mới phải thêm vào list; dễ thành "layout engine mini" nếu không kỷ luật |
| **M3-c hai variation** | Hai biến thể island: **"Island — reading"** (760) và **"Island — layout"** (1200); editor chọn theo nội dung | Không coupling, không CSS, rõ nghĩa | Editor phải hiểu chọn cái nào; island "hỗn hợp" vẫn cần inner group |

**Khuyến nghị:** **M3-a làm mặc định** (native, không nợ kỹ thuật), **M3-c cho entry point**
(hai variation đặt tên rõ), **M3-b chỉ mở nếu human chấp nhận coupling** và phải ghi owner
tường minh. Không chọn M2 làm default vì nó âm thầm phá typography — đúng loại lỗi "im lặng"
mà PITFALLS DP-07 đã cảnh báo.

### 4.3 Câu hỏi chưa quyết

- Default measure khi insert island mới: 760 (reading) hay 1200 (layout)? Đề xuất: **hỏi trong
  Inserter** (hai variation) thay vì đoán.
- Nested island (island trong island): cho phép hay chặn? Đề xuất **cho phép nhưng không
  khuyến khích**, và định nghĩa: island con là một box bình thường trong measure của island cha,
  band của nó = measure đó (không tràn lại viewport).

---

## 5. Kiến trúc — bốn phương án

Tất cả đều **giả định** T1 hoặc một correction tương đương, vì §2.3: không có island nào đúng
nếu con `alignwide` vẫn ăn GP math. Đây là **dependency cứng**, không phải lựa chọn thẩm mỹ.

### 5.1 A1 — Block *style variation* của `core/group` (theme.json)

Thêm vào `theme.json`:

```json
"styles": { "blocks": { "core/group": { "variations": { "is-style-skvn-island": { ... } } } } }
```

- **Được:** zero code PHP/JS, zero CSS, đổi visual bằng palette/radius/padding token.
- **Không được:** style variation chỉ mang **styles** — **không** set được `layout.contentSize`
  (layout là block attribute, không phải style). Nên A1 **không sở hữu measure**; nó chỉ là
  "Group có nền đẹp".
- **Kết luận:** không đủ làm island. Có thể là **một phần** của A2/B.

### 5.2 A2 — *Block variation* của `core/group` (JS `registerBlockVariation`)

Một entry trong Inserter, prefill attributes:

```js
registerBlockVariation('core/group', {
  name: 'skvn-island',
  title: 'Island',
  attributes: {
    align: 'full',
    className: 'skvn-island-band',       // TÊN TẠM — chốt cùng Q-02, KHÔNG dùng .skvn-island
    layout: { type: 'constrained', contentSize: '1200px' }
  },
  scope: ['inserter', 'transform']
});
```

- **Được:** một click; markup vẫn là **core/group** → nội dung cũ/mới tương thích; `scope:
  transform` cho phép chuyển Group thường → island; không thêm block mới; kế thừa toàn bộ
  support của Group (color, spacing, border, typography).
- **Không được:** variation chỉ là **default lúc insert** — editor đổi align/attributes sau đó
  vẫn phá được; vẫn cần CSS correction cho GP (nhưng có thể scoped bằng class); không có
  control riêng cho "measure" (phải sửa attribute layout bằng tay hoặc thêm panel nhỏ).
- **Điểm mạnh bị đánh giá thấp:** đây là **con đường migration duy nhất không tạo invalid
  block** cho các trang đã dùng Group + class.

### 5.3 B — Custom block `skvn-marine/island` (plugin, InnerBlocks)

Cấu trúc theo chuẩn plugin hiện tại (`modules/<name>/` + `src/<name>/block.json`):

- Attributes: `measure` (token enum: `reading|layout`), `contentWidth` (kế thừa pattern
  Collection), `paddingBlock`/`paddingInline` (token scale), `tone` (palette slug), `align`.
- `supports`: `align: ["wide","full"]`, `color` (palette only), `spacing`, `layout` (để core lo
  constrained layout), `anchor`.
- Save: markup thuần + class + `style` chỉ chứa `--island-*` vars. Không snapshot nội dung.
- Render: ưu tiên **static save** (không cần PHP); chỉ dùng `render_callback` nếu cần giá trị
  runtime (không có lý do ở đây).
- Transform: `core/group` ⇄ island (giữ InnerBlocks), để migrate nội dung cũ.

**P0 proof bắt buộc trước khi cam kết B** (xem §10 G-03):

1. `supports.layout` có hoạt động cho **custom block** ở WP version đang pin không? (core phát
   `.is-layout-constrained` + per-instance `--wp--style--global--content-size/wide-size`?)
2. Per-instance `contentSize`/`wideSize` có emit đúng khi là attribute của custom block?
3. `alignfull` của custom block có tràn đúng trên canvas zero-padding?
4. Editor: `useInnerBlocksProps` + layout support có giữ selection/undo/IME như Group?
5. Saved markup có ổn định qua 2 lần save (không "invalid block")?

### 5.4 C — Pattern thuần (theme)

`alignfull` + `"layout":{"type":"constrained","contentSize":"1200px"}` + className, zero CSS,
zero JS. Đây là hướng đã ghi ở ledger §3.3 và là thứ `.skvn-section` đang cố làm bằng CSS.

- **Được:** nhanh nhất, không nợ kỹ thuật, không cần P0 API.
- **Không được:** one-shot insert — sửa pattern **không** lan tới instance đã có; editor đổi
  align là mất cấu hình; không có control; không có transform; không cảnh báo khi canvas OFF.
- **Kết luận:** dùng làm **prototype/acceptance harness**, không phải sản phẩm.

### 5.5 Bảng so sánh

| Tiêu chí | A1 style var | A2 block var | B custom block | C pattern |
|---|---|---|---|---|
| Sở hữu measure | ✗ | ✓ (qua attribute layout) | ✓ | ✓ |
| Sở hữu band/nền | ✓ | ✓ | ✓ | ✓ |
| Control trong Inspector | ✗ | hạn chế | ✓ | ✗ |
| Một click trong Inserter | ✓ | ✓ | ✓ | ✓ (pattern) |
| Migrate nội dung Group cũ | — | ✓ transform | ✓ transform | ✗ |
| Saved markup tương thích Group | ✓ | ✓ | ✗ (block mới) | ✗ |
| Rủi ro API Gutenberg | thấp | thấp | **cao** (P0) | thấp |
| Nợ kỹ thuật dài hạn | thấp | **thấp** | trung bình | cao |
| Đúng boundary theme/plugin | theme | theme/plugin | plugin | theme |
| Rename khi migrate 1.4.0 | 1 chỗ | 1 chỗ | **nhiều chỗ** (namespace, CSS, block.json) | 1 chỗ |

### 5.6 Khuyến nghị theo giai đoạn

1. **Trước tiên (dependency):** chốt **T1** — theme neutralize GP math `.alignwide` trên canvas
   (`body.skvn-full-width-canvas .entry-content .alignwide { margin-inline:auto; width:auto;
   max-width:var(--skvn-wide-width) }`, `(0,3,0)` > GP `(0,2,0)`), kèm ảnh trước/sau cho
   **slider + collection + grid**. Không có T1 thì island nào cũng phải mang correction riêng,
   và mỗi correction là một chỗ nữa để sai.
2. **Bước 1 sản phẩm:** **A2** (block variation) + hai variation theo §4.2 M3-c. Đạt 90% nhu cầu,
   zero CSS, có transform, không invalid block, rẻ để sửa.
3. **Bước 2 (chỉ khi có nhu cầu đã chứng minh):** **B** custom block để có control measure/
   padding/tone và một chỗ duy nhất sở hữu contract. Chỉ làm **sau** khi 1.4.0 migration ổn định
   identity, hoặc dùng naming migration-ready ngay từ đầu.
4. **C** chỉ dùng làm harness/acceptance, không ship.

Lý do không chọn B ngay: B có **rủi ro API cao nhất** (P0 5 mục), **nợ migration lớn nhất**, và
giải quyết một nhu cầu (control) chưa được chứng minh là cần. Lý do không chọn A1/C: thiếu owner
cho measure.

---

## 6. Hợp đồng kỹ thuật cho block (đề xuất)

### 6.1 Width ownership

```text
band (island)        -> width theo align: full = 100% canvas, wide = --skvn-wide-width
measure (bên trong)  -> contentSize (760) / wideSize (1200), do island sở hữu
child block          -> width: 100% của measure; KHÔNG tự khai báo width/max-width của box
```

- Island **không** được set `width` cho con cụ thể (trừ correction GP ở §6.3, phạm vi hẹp).
- Block con **không** được nhận biết island bằng class khác — không có "island mode" cho từng
  block.

### 6.2 CSS được phép / bị cấm

| Được | Bị cấm |
|---|---|
| `max-width` theo token | `100vw`, `50vw`, `margin-left: calc(50% - 50vw)` |
| `margin-inline: auto` | `margin-right: -80px` / bất kỳ negative margin để bù |
| `padding-inline` theo token | `overflow: hidden/clip` để che tràn |
| `box-sizing: border-box` | `transform: scale()` để "vừa khung" |
| Container query **theo measure**, breakpoint ghi rõ | Breakpoint trùng với 760/880 mà không ghi lý do |
| `!important` **chỉ** để thắng `!important` của core/GP, có comment nguồn | `!important` lan rộng để "cho chắc" |

### 6.3 Correction GP — hai lựa chọn, phải chọn một

| | **T1** (khuyến nghị) | **Scoped** (nếu T1 chưa làm) |
|---|---|---|
| Vị trí | `wp-content/themes/skvn-marine/style.css` (canvas layer) | CSS của island (theme hoặc plugin asset) |
| Selector | `body.skvn-full-width-canvas .entry-content .alignwide` | `.island .alignwide` (scoped) |
| Delta | ~4 declaration | ~4 declaration |
| Phạm vi | Toàn canvas — sửa cả slider/collection | Chỉ trong island |
| Rủi ro | Đổi geometry slider/collection → cần ảnh trước/sau + human duyệt | Bỏ sót `.alignwide` ngoài island |
| Trạng thái | **Chưa chọn** (decision §Chưa quyết) | **Chưa chọn** |

Cả hai **không được** dùng `!important` trừ khi cần thắng `auto !important` của core; nếu dùng
phải ghi comment "core layout.php margin auto !important".

### 6.4 Container query — hệ quả phải ghi trong doc block

- Category Grid: `@container (min-width: 480px)` / `(min-width: 880px)`.
- Collection: `@container (max-width: 760px)`.
- Island **phải** test ở 3 mốc: **759 / 760 / 880 / 1200** — không chỉ "desktop/tablet/mobile",
  vì breakpoint lật layout **im lặng**.
- Nếu island measure = 760 và có grid 4 cột: **sai theo thiết kế** (đã chứng minh). Đây là lý
  do §4 tồn tại.

### 6.5 Editor surface

- Editor iframe có 64px offset (`style.css:117-121`) — **đúng**, không sửa.
- CSS island phải nạp trong **cả** editor iframe và frontend. Nếu dùng asset riêng → handle
  riêng có dependency theme stylesheet + `add_editor_style`/`enqueue_block_assets`, không
  enqueue bundle chung (theo `docs/standards/gutenberg-block-extension-css-contract.md`).
- Không dùng `editor.BlockEdit` để inject wrapper style — dùng `editor.BlockListBlock` nếu cần.
- Editor không được set `opacity:0`/`visibility:hidden` cho nội dung.

### 6.6 Saved markup, compatibility, migration

- Nếu **A2** (block variation): markup vẫn `core/group` → **không migration**; chỉ thêm class.
  Đây là lý do A2 rẻ.
- Nếu **B**: bắt buộc có **transform hai chiều** `core/group ⇄ island` giữ InnerBlocks, và
  test "save 2 lần không invalid".
- Deprecated/rename: nếu identity đổi ở 1.4.0, phải có `deprecated` entry hoặc transform —
  không đổi tên block đã lưu mà không có đường migrate.
- Không lưu snapshot nội dung; chỉ lưu layout/tone/measure.

### 6.7 Attributes & validation guards (kế thừa rule đã dùng ở Collection/Spacer)

- Số (padding, measure px nếu có): kiểm **finite + integer + range**, `0` là **hợp lệ**,
  invalid → fallback. **Không** dùng `absint`. **Không** dùng `value || default`.
- Enum (measure, tone, align): whitelist, invalid → default.
- `descriptionText`-kiểu attribute: **presentation-only**, không lưu vào block attributes.
- Boolean: `=== true`, không truthy.

### 6.8 PHP / render security

- Nếu có `render_callback`: `esc_attr`/`esc_html`/`wp_kses_post`, sanitize-at-read cho mọi
  attribute đi vào style/class/URL.
- Inline style chỉ chứa `--island-*` vars; giá trị phải qua whitelist token, không nối chuỗi
  tự do.
- Không dùng `$_SERVER['HTTP_HOST']`, không `@` suppress.

---

## 7. Acceptance đề xuất

> ID là **đề xuất**, human chưa duyệt. Theo `docs/standards/block-ui-editor-ux-technical-review-contract.md`
> (ba nhóm Block UI / Editor UX / Technical; mỗi yêu cầu có Content & States + Acceptance & Evidence).

### 7.1 Block UI (frontend)

| ID | Hành vi mong đợi | Cách kiểm | Evidence |
|---|---|---|---|
| **GI-B01** | Nền band tràn 2 viền khi align Full trên canvas; không dải trắng | `band.width === clientWidth`, `left === 0` (sai số ≤1) khi có scrollbar dọc | số đo + ảnh full màn hình |
| **GI-B02** | Measure đúng: text ≈760 (reading) hoặc nội dung ≤1200 (layout), canh giữa | `getBoundingClientRect` của con trực tiếp | số đo |
| **GI-B03** | Con không vượt band: `right - band.right ∈ [-1, 1]`, tương tự trái | chain geometry | số đo |
| **GI-B04** | Không scroll ngang: `scrollWidth <= clientWidth` | geometry | số đo |
| **GI-B05** | Shadow/bo góc của card **không bị cắt** | `overflow` = `visible` trên band + wrapper con; ảnh hover | computed + ảnh |
| **GI-B06** | Grid không lật layout ngoài ý muốn | test 759/760/880/1200 | ảnh 4 mốc |
| **GI-B07** | Text trên nền tối đủ tương phản; tone không hardcode hex | audit + ảnh | audit palette |
| **GI-B08** | Mobile: gutter trong band, nền vẫn tràn | ảnh 390px | ảnh |

### 7.2 Editor UX

| ID | Hành vi mong đợi | Cách kiểm | Evidence |
|---|---|---|---|
| **GI-E01** | Có entry Inserter rõ nghĩa; insert 1 click ra đúng island | Inserter + List View | ảnh |
| **GI-E02** | Editor ≠ frontend chỉ ở 64px offset, không có clamp giả | so preview/frontend | ảnh cặp |
| **GI-E03** | Control chỉ token-based (measure/padding/tone), không raw px/hex | audit Inspector | ảnh Inspector |
| **GI-E04** | Không cần biết Group/2-bước; sai align không âm thầm thành 760 | thao tác thử | ảnh + số đo |
| **GI-E05** | Chuyển Group thường → island (nếu chọn A2/B) giữ nguyên InnerBlocks | transform test | ảnh trước/sau |
| **GI-E06** | Không invalid block sau save/reload 2 lần | editor console | log |

### 7.3 Technical

| ID | Hành vi mong đợi | Cách kiểm | Evidence |
|---|---|---|---|
| **GI-T01** | Một owner width; không rule nào set width cho con | audit CSS | file:line |
| **GI-T02** | GP math bị neutralize trong scope (T1 hoặc scoped), có comment nguồn | audit CSS + computed | rule + số đo |
| **GI-T03** | Không `overflow`/`100vw`/negative margin | grep + computed | kết quả grep |
| **GI-T04** | CSS nạp trong editor iframe **và** frontend, handle riêng | view-source 2 surface | danh sách handle |
| **GI-T05** | Attribute validation đúng guard (0 hợp lệ, invalid fallback) | unit/mock test | test output |
| **GI-T06** | Sanitize/escape đầy đủ ở render path | review + grep | file:line |
| **GI-T07** | Không thêm JS runtime nếu không cần; không layout thrash | review bundle | bundle size |
| **GI-T08** | Container query breakpoints có comment lý do | audit CSS | file:line |
| **GI-T09** | Đúng boundary theme/plugin (visual ở theme, block ở plugin) | review | quyết định boundary |
| **GI-T10** | Không phụ thuộc CSS site (WindPress tắt vẫn đúng) | test | ảnh/số đo |

---

## 8. Bảng chẩn đoán nhanh (dùng lại được)

| Triệu chứng | Chủ khả dĩ | Kiểm đầu tiên | Ghi chú |
|---|---|---|---|
| Grid 4→2 cột trong container | Clamp 760 của theme | `getComputedStyle(grid).maxWidth` + width container | DP-07; 2-bước hoặc island |
| Rộng hơn parent **đúng 80px, chỉ phải** | GP `.alignwide` math | `max-width` computed; tìm `calc(100% + 80px)` trong `document.styleSheets` | DP-07.1; **grep file = 0 không có nghĩa là không tồn tại** |
| Nền dừng ở 1200, hở 2 bên | Box đang Wide | `band.width` | đổi Full cho band |
| Nền tràn nhưng chữ quá dài | Measure = band | `con trực tiếp`.width | §4 M2 vs M3 |
| Editor lệch 64px | Editor chrome | so với Preview | **không phải bug** |
| Xuất hiện scroll ngang | `100vw`/overflow/negative margin mới thêm | `scrollWidth` vs `clientWidth` + grep | audit I-05/I-06 |
| CSS "đúng" nhưng site không đổi | CSS chưa được nạp | view-source tìm selector | bài học §2.4 |

---

## 9. Rủi ro & câu hỏi mở

| ID | Nội dung | Default conservative nếu chưa quyết |
|---|---|---|
| **Q-01** | Island làm **trước** hay **sau** 1.4.0 migration (identity `skvn-marine` → `marine-blocks`)? | Sau 1.4.0, hoặc dùng naming migration-ready; không tạo block mới rồi rename hai lần |
| **Q-02** | Tên: `.skvn-island` **đã bị chiếm** (`style.css:3247`, sidebar card single/archive). Ứng viên: `skvn-island-band`, `skvn-surface`, `marine-island` | Không dùng `.skvn-island`; chốt cùng lúc với Q-01 |
| **Q-03** | T1 vs scoped correction (§6.3) | Không code island trước khi chốt; T1 là dependency sạch hơn |
| **Q-04** | Measure default (§4.3) | Hai variation (reading/layout), không đoán một default |
| **Q-05** | Có control padding/tone trong Inspector không, hay chỉ token mặc định? | Chỉ token mặc định ở bước 1; control khi có nhu cầu thật |
| **Q-06** | Nested island: cho phép hay chặn? | Cho phép, band con = measure cha; ghi rõ trong doc block |
| **Q-07** | Có cần full-bleed pseudo-element / breakout khỏi measure không? | **Không** ở bước 1 (I-06/I-07) |
| **Q-08** | `.skvn-section` cũ xử lý thế nào? | Không xoá; deprecate dần khi island thay được; ghi mapping |
| **R-01** | Rủi ro API: `supports.layout` cho custom block (nếu chọn B) | P0 proof bắt buộc (§5.3) |
| **R-02** | Rủi ro migration: block mới → invalid block ở nội dung cũ | A2 trước; B phải có transform + deprecated |
| **R-03** | Rủi ro "im lặng": container query lật layout không cảnh báo | Ghi breakpoint + test 4 mốc (GI-B06) |
| **R-04** | Rủi ro scope creep: island thành mini page builder | Giữ §1.3; mọi control mới cần nhu cầu đã chứng minh |

---

## 10. Điều kiện trước khi start (gates)

| Gate | Nội dung | Trạng thái |
|---|---|---|
| **G-01** | SemVer được human xác nhận + ghi mapping vào roadmap 039/AGENTS §9 | **Chưa** — island chưa gán version |
| **G-02** | Human chốt kiến trúc (§5) + measure model (§4) | **Chưa** |
| **G-03** | P0 proof (nếu chọn B): 5 mục §5.3 trên WP version pin | **Chưa** |
| **G-04** | T1 hoặc scoped correction được chốt + duyệt ảnh trước/sau slider/collection | **Chưa** (decision §Chưa quyết) |
| **G-05** | Deferred test 1.3.20 (AM1/AL/AR, CG/DS + carry DS/TD/S19/SR2/CP/EF/RS/CCP + Carousel) được chạy trước follow-up không liên quan | **Chưa** — phải nhắc human |
| **G-06** | Design tokens cho padding/tone/radius (nối 064 Brand Kit) | **Chưa** |
| **G-07** | Quyết định identity/naming (Q-01, Q-02) | **Chưa** |
| **G-08** | Mockup/artifact nếu island có hình thức cụ thể (theo 062/063 precedent) | **Chưa** — chưa có design |

---

## 11. Việc không làm / không lặp lại

1. **Không** dùng `overflow` để che tràn — đã cấm trong decision và CSS contract.
2. **Không** viết CSS theme "propagate" width xuống cháu để cứu một band — đã loại 2026-11-11.
3. **Không** dùng `100vw`/negative margin làm full-bleed.
4. **Không** dùng tên `.skvn-island` (đã thuộc sidebar card).
5. **Không** coi "CSS đã viết đúng" là "đã chạy" — verify trên CSS serve (§2.4).
6. **Không** coi grep 0 kết quả là "rule không tồn tại" (§2.3).
7. **Không** coi một thất bại của Group là một lỗi — có **ba** (F1/F2/F3) với ba cách chữa.
8. **Không** đánh dấu PASS/UX-confirmed khi chưa có human xác nhận — kể cả khi probe đúng.
9. **Không** thêm ratio/pixel control mới ngoài token nếu chưa có nhu cầu đã chứng minh.
10. **Không** đổi current milestone/bump metadata vì tài liệu này.

---

## 12. Evidence index

| Tài liệu | Nội dung |
|---|---|
| [`docs/testing/group-island-width-1.3.20.md`](../../docs/testing/group-island-width-1.3.20.md) | Recipe 2 bước, T-ISLAND-01–04, phản biện Elementor §4, gate §7.1 |
| [`docs/testing/group-island-windpress-class-1.3.20.md`](../../docs/testing/group-island-windpress-class-1.3.20.md) | Pixel scan §1, prototype §2, diagnostic §4, đo onsite §4.2, probe/root cause §4.2.1, T1/T2 §4.2.2, T-ISLAND-05–09 |
| [`docs/decisions/group-island-windpress-stopgap-1.3.20.md`](../../docs/decisions/group-island-windpress-stopgap-1.3.20.md) | Decision stopgap (dormant), luật một box, giới hạn |
| `.context/PITFALLS.md` DP-07 / DP-07.1 | Clamp 760 + container query; GP +80 math |
| `docs/standards/css-layout-safety-contract.md` | Width contract, Container Nesting, Alignment Ownership, Overflow Rule |
| `wp-content/themes/skvn-marine/theme.json` | `contentSize 760`, `wideSize 1200` |
| `wp-content/themes/skvn-marine/style.css` | 963-968 canvas zero padding; 994-1004 clamp; 1007-1013 alignfull reset; 117-121 editor 64px; 130-157 `.skvn-section` anti-pattern; 3247 `.skvn-island` name collision |
| `wp-content/plugins/skvn-marine-blocks/src/product-category-grid/block.json` + `style.css` | `align` default wide; container query 480/880 |
