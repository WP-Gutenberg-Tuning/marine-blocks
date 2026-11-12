# Island Group — prototype class cho WindPress (1.3.20)

> Trạng thái: **Prototype — chưa nạp vào site, chưa quyết tên class**. Human chạy prototype
> trên site bằng WindPress, gửi lại output console. Không code runtime, không sửa theme,
> không sửa `inc/windpress.php` (theo decision).
> Decision: [`docs/decisions/group-island-windpress-stopgap-1.3.20.md`](../decisions/group-island-windpress-stopgap-1.3.20.md).
> Ledger recipe/đo width: [`docs/testing/group-island-width-1.3.20.md`](group-island-width-1.3.20.md).

---

## 0. Mục tiêu và giới hạn của đợt này

Luật UX đã chốt: Category Grid nằm trong Group là **một box** — con lấy width của Group,
nền Group phủ hết con. Đợt này chỉ trả lời hai câu:

1. Một class + một rule CSS có kéo được con đang rộng hơn Group vào không?
2. Nếu không, 80px đó thuộc về ai (Group, block grid, hay bên trong grid)?

Không làm: island pattern, thay control content width, sửa Category Grid, CSS theme.

---

## 1. Đo lại ảnh bằng pixel (2026-11-12) — số cứng

Phương pháp: đọc pixel bằng `System.Drawing` (không dùng mắt/thumbnail), quét toàn ảnh
1903x927, RLE theo từng hàng. `#00C950` = màu nền Group; card = trắng `#FFFFFF` với
padding 20px (khớp `cardPadding: md` = 1.25rem); gap giữa card = 12px.

| | Ảnh (1) | Ảnh (2) |
|---|---|---|
| Nền Group (`#00C950`) | x **572..1331** = **760px** | x **352..1551** = **1200px** |
| Canh giữa? | (1903−760)/2 = 571.5 ✓ | (1903−1200)/2 = 351.5 ✓ |
| Suy ra align | Group **không align** (theme clamp 760) | Group **align Wide** (1200) |
| Card 1 | 572..985 (**414**) | 352..662 (**311**) |
| Card 2 | 998..1411 (**414**) | 675..985 (**311**) |
| Card 3 | — (2 cột) | 998..1308 (**311**) |
| Card 4 | — | 1321..1631 (**311**) |
| **Vùng card (grid)** | **572..1411 = 840** | **352..1631 = 1280** |
| **Delta so với Group** | **+80px (chỉ bên phải)** | **+80px (chỉ bên phải)** |
| Cột chia đều? | (760−12)/2 = 374 mỗi cột | (1200−36)/4 = 291 mỗi cột |
| Cột thực tế | 414 = 374 **+40** | 311 = 291 **+20** |

Kết luận từ số đo (không phải suy luận từ ảnh):

- **Grid bắt đầu đúng mép trái của Group** (572 / 352) và **vượt mép phải đúng 80px**
  trong cả hai ảnh. Nền trang bên phải card là `#F2F5F6`, nên mép phải card đọc được
  chính xác: 1411 và 1631.
- Delta **hằng số 80px ở cả 760 và 1200**, không phải delta theo align, không phải theo
  số cột (2 cột: +40/cột; 4 cột: +20/cột). Vì vậy đây là **width delta của chính block
  grid** (`100% + 80px` hoặc `margin-right: −80px`), **không phải** lỗi container query,
  **không phải** hệ quả của align Wide.
- Đây đúng là ca decision mô tả: *"Class kéo card vào nếu chính block grid đang rộng hơn
  Group"* — nên một rule clamp trên con trực tiếp **có** khả năng chữa.
- Ảnh (2) cho thấy align Wide **không** gây tràn: nền 1200 đúng, grid 1280 mới tràn.
  Align Wide chỉ làm nền dừng ở 1200 (đã phản biện ở ledger §4).

> **Scale ảnh = 1:1 — đã xác nhận 2026-11-12** bằng snippet §4 trên frontend:
> `clientWidth 1903`, `dpr 1`, `zoom 1`. Nên 760/1200/80 trong bảng trên là CSS px thật.
>
> **Chưa biết:** rule nào sinh ra 80px. Ba ứng viên CSS cùng cho kết quả "trái khít,
> phải +80": (a) `width: calc(100% + 80px)`, (b) `margin-right: -80px; margin-left: 0`,
> (c) `min-width`/flex `min-width: auto`. Ứng viên (d) — delta nằm trên `<ul>` bên trong
> block — thì rule trên Group **không** chữa được. §4 phân biệt bốn ứng viên này.

---

## 2. Prototype — một class, một rule

**Tên đề xuất: `.skvn-island-group`** (chưa chốt — decision để mở).
Lý do: `.skvn-island` đã bị theme dùng cho card sidebar single post (`style.css:3247` +
`archive.php`), nên không dùng lại. Hậu tố `-group` nói rõ đây là core/group, không
phải một primitive mới; đổi tên chỉ là `find & replace` một chỗ.

Dán vào **stylesheet của WindPress** (không phải theme, không phải plugin):

```css
/* ---------------------------------------------------------------------------
 * SKVN island Group (stopgap, site-only).
 * Decision: docs/decisions/group-island-windpress-stopgap-1.3.20.md
 *
 * Contract: core/group có class .skvn-island-group là MỘT box.
 *   - con trực tiếp resolve theo content box của Group
 *   - nền Group (border box của chính nó) vì vậy phủ hết con
 *   - không dùng overflow để cắt
 * Gỡ class + block CSS này khi island group primitive có mặt (1.4.x).
 * ------------------------------------------------------------------------ */

.skvn-island-group.is-layout-constrained
	> *:not(.alignleft):not(.alignright):not(.aligncenter) {
	box-sizing: border-box;
	margin-left: 0 !important;
	margin-right: 0 !important;
	max-width: 100% !important;
	min-width: 0;
}
```

Sáu declaration, không có `overflow`, không viewport unit, không negative margin.

> Nếu stylesheet WindPress dùng `@layer` (Tailwind), dán rule ở **ngoài layer**.
> Rule không nằm trong layer luôn thắng rule cùng specificity nằm trong layer; nếu dán
> vào trong layer, thứ tự layer có thể làm rule yếu đi và kết quả sẽ khác giữa các lần
> compile.

### 2.1 Vì sao từng dòng

| Dòng | Chữa gì |
|---|---|
| `.skvn-island-group` | Chỉ Group được gắn class. Core Group khác giữ nguyên FSE (decision). |
| `.is-layout-constrained` | Group mặc định là constrained layout; rule chỉ có nghĩa ở layout đó. Group chuyển sang flex/grid row sẽ không bị rule này. |
| `> *` | Đúng phạm vi "con trực tiếp" của decision. Không đi xuyên vào block con. |
| `:not(.alignleft):not(.alignright):not(.aligncenter)` | Không phá float/centering của ảnh, button group, block có align riêng. |
| `max-width: 100% !important` | Clamp con về content box. `!important` cần vì core phát `max-width: var(--wp--style--global--wide-size)` cho `.alignwide` (selector `(0,1,0)`), và block có thể tự set `max-width`. |
| `margin-left/right: 0 !important` | Core phát `margin-left: auto !important; margin-right: auto !important` cho con không align (`layout.php:353-360`). Rule này là `(0,1,0)`; rule của ta là `(0,5,0)` nên thắng **bất kể thứ tự stylesheet** — không phụ thuộc WindPress load trước hay sau global styles. Đồng thời xoá delta kiểu `margin-right: −80px`. |
| `min-width: 0` | Chặn `min-width: auto` của flex/grid item — nguyên nhân overflow "vô hình" phổ biến nhất. |
| `box-sizing: border-box` | Đảm bảo padding của con không cộng thêm vào width khi bị clamp. |

### 2.2 Cái rule này KHÔNG làm

- **Không** làm nền tràn 2 viền. Nền vẫn = box của Group (760/1200/100% tuỳ align).
  Full-bleed vẫn là recipe §3 của ledger hoặc island pattern §7.1 B.
- **Không** chữa con tràn vì nội dung bên trong (chữ không break, ảnh wide cố định,
  grid cột fix cứng). Lúc đó block phải tự lo.
- **Không** chữa delta nằm trên `<ul>`/card (con của block). Xem §4/§5.
- **Không** cắt shadow. Card ở mép vẫn đổ bóng ra ngoài nền Group (đúng: cấm overflow).
  Muốn shadow nằm trong nền thì thêm padding cho Group, không dùng `overflow: hidden`.
- **Không** đổi thứ tự ưu tiên width: Group vẫn là chủ width duy nhất; class chỉ buộc
  con tôn trọng chủ đó.

### 2.3 Cảnh báo typography (phải đọc trước khi bật)

Với island **Full**, con trực tiếp = 100% viewport → heading/paragraph kéo hết ngang,
measure đọc rất xấu. Vì vậy:

- Island chứa grid/carousel: dùng Group **Wide (1200)** + class → grid 4 cột vẫn đủ
  (container ≥ 880), nền đúng 1200, không tràn. Đây là setup khuyến nghị cho 1.3.20.
- Cần **vừa tràn 2 viền vừa measure 760**: bắt buộc có tầng thứ hai (inner Group
  constrained hoặc island pattern). Xem §6 — không phải việc của một class.

### 2.4 Biến thể đã cân nhắc và loại

| Biến thể | Vì sao loại |
|---|---|
| `overflow: hidden` / `clip` trên Group | Cắt card và shadow — decision cấm thẳng. Che geometry tràn bằng overflow cũng vi phạm CSS layout contract. |
| `display: flow-root` / `contain` trên Group | Không đổi width của con; chỉ tạo BFC, nhiều khả năng không chạm tới 80px. |
| Chỉ `min-width: 0` | Đủ cho ca `min-width: auto`, **không** đủ khi width là `calc(100% + 80px)`. |
| Ép `width: 100%` cho mọi con | Phá block `inline-block`/float/button; `width: auto` + `max-width: 100%` an toàn hơn và cho cùng kết quả với block-level. |
| Bù trừ bằng padding/negative margin của Group (`calc(-1 * …)`) | Đổi hình học của box để che delta → hai chủ width, sai contract một owner. |
| `:where(.skvn-island-group) …` cho specificity thấp | Thua `!important` của core (0,1,0) → rule vô hiệu. |
| Rule không kèm `.is-layout-constrained` (áp cho mọi layout) | Group đổi sang flex/grid row sẽ bị kéo 100% ngoài ý muốn; chỉ constrained mới có khái niệm "con theo content box". |

Mỗi dòng trên đều là một cách "trông đúng" trong DevTools nhưng sai ở owner hoặc phá
surface khác — nên prototype giữ đúng 6 declaration ở §2.

---

## 3. Cách gắn class (site, không cần deploy)

1. Chọn **Group** trên page (List View → đúng hàng Group, tránh chọn block con).
2. Sidebar → **Advanced → Additional CSS class(es)** → thêm `skvn-island-group`.
3. WindPress → **compile lại cache** (CSS chỉ có hiệu lực sau khi compile).
4. Kiểm editor iframe **và** frontend (hai surface, cache riêng).
5. Nếu rule không thấy hiệu lực ở editor nhưng có ở frontend → WindPress không nạp
   stylesheet vào iframe: báo lại, đây là cấu hình WindPress, không phải sai class.

---

## 4. Diagnostic — xác định chủ của 80px (chạy trước, đừng đoán)

Dán vào console **frontend** của page test (post=71). Chạy khi Group đã có class.

```js
(() => {
	const island =
		document.querySelector('.skvn-island-group') ||
		document.querySelector('.entry-content > .wp-block-group');
	if (!island) return 'No island Group found';

	const vv = window.visualViewport;
	console.log('VIEWPORT', {
		clientWidth: document.documentElement.clientWidth,
		innerWidth: window.innerWidth,
		scrollWidth: document.documentElement.scrollWidth,
		dpr: window.devicePixelRatio,
		zoom: vv ? vv.scale : null,
		fullWidthCanvas: document.body.classList.contains('skvn-full-width-canvas'),
		islandClass: island.className,
	});

	const describe = (el) => {
		const r = el.getBoundingClientRect();
		const cs = getComputedStyle(el);
		return {
			tag: el.tagName.toLowerCase(),
			cls: (typeof el.className === 'string' ? el.className : '').slice(0, 80),
			left: +r.left.toFixed(1),
			right: +r.right.toFixed(1),
			width: +r.width.toFixed(1),
			css_width: cs.width,
			maxWidth: cs.maxWidth,
			minWidth: cs.minWidth,
			margins: cs.marginLeft + ' / ' + cs.marginRight,
			padding: cs.paddingLeft + ' / ' + cs.paddingRight,
			boxSizing: cs.boxSizing,
			display: cs.display,
			position: cs.position,
			transform: cs.transform === 'none' ? 'none' : cs.transform,
		};
	};

	// Chuỗi từ block grid lên tới Group.
	const chain = [];
	const grid =
		island.querySelector('.skvn-category-grid') ||
		island.querySelector('.skvn-collection');
	let node = grid;
	while (node && node !== island.parentElement) {
		chain.push(describe(node));
		node = node.parentElement;
	}
	console.table(chain);

	// Ai là người đầu tiên vượt mép phải của cha?
	const owners = [];
	for (let i = 0; i < chain.length - 1; i += 1) {
		owners.push({
			child: chain[i].cls.slice(0, 50),
			parent: chain[i + 1].cls.slice(0, 50),
			overflowRight: +(chain[i].right - chain[i + 1].right).toFixed(1),
		});
	}
	console.table(owners);

	const islandRect = island.getBoundingClientRect();
	console.log('GRID vs ISLAND', {
		islandRight: +islandRect.right.toFixed(1),
		gridRight: grid ? +grid.getBoundingClientRect().right.toFixed(1) : null,
		delta: grid
			? +(grid.getBoundingClientRect().right - islandRect.right).toFixed(1)
			: null,
	});
})();
```

### 4.1 Đọc kết quả

| `delta` (grid vs island right) | `owners` chỉ ra | Kết luận |
|---|---|---|
| ≈ 0 | owner đầu tiên là `.skvn-category-grid` nhưng đã bị clamp | **Class chữa được**. Ghi PASS §5. |
| ≈ 80 | `.skvn-category-grid` overflow so với Group | Class **chưa** ăn (specificity/`!important` bị đè, hoặc delta là `position/transform`). Gửi `chain` để biết rule nào. |
| ≈ 80 | `.skvn-category-grid__grid` (ul) overflow so với `.skvn-category-grid` | Delta nằm **bên trong block** → rule trên Group không với tới. **Bệnh thuộc Category Grid** (decision §Giới hạn). |
| ≈ 80 | `.skvn-category-grid__item`/`__card` | Card tự rộng hơn cột → `min-width`/nội dung card, cũng thuộc Category Grid. |

`owners` in ra toàn bộ chain, nên nếu `overflowRight` dương ở dòng nào thì **dòng đó**
là chủ. Cộng thêm `css_width`/`maxWidth`/`margins` để biết là `calc(100% + 80px)`,
`margin-right: -80px` hay `min-width: auto`.

Nếu `clientWidth !== 1903`: dừng, gửi số đó — mọi kết luận 760/1200 phải tính lại.

### 4.2 Kết quả đo onsite 2026-11-12 (frontend, post=71) — chủ của 80px đã xác định

`VIEWPORT`: `clientWidth 1903`, `innerWidth 1920` (scrollbar 17px), `scrollWidth 1903`
(**không** scrollbar ngang), `dpr 1`, `zoom 1`, `fullWidthCanvas true`. Scale 1:1 **đã
xác nhận** → 760/1200/80 là CSS px thật.

`islandClass`: `wp-block-group alignwide skvn-island-group has-windpress-teal-50-background-color
has-background is-layout-constrained wp-block-group-is-layout-constrained` → class đã gắn
đúng Group, đúng layout constrained, align Wide.

| # | Element | left | right | width | css `max-width` | margins | owner? |
|---|---|---|---|---|---|---|---|
| 0 | `.skvn-category-grid` (direct child) | 351.5 | **1631.5** | **1280** | **`calc(100% + 80px)`** | 0 / 0 | **CÓ — +80** |
| 1 | Group `.skvn-island-group` | 351.5 | 1551.5 | 1200 | `1200px` | 351.5 / 351.5 | — |

`GRID vs ISLAND`: `islandRight 1551.5`, `gridRight 1631.5`, **`delta 80`**.

Kết luận (theo §4.1, dòng 2):

1. **Owner là chính wrapper `.skvn-category-grid`** — không phải `<ul>`, không phải card,
   không phải align Wide, không phải container query. Đây là **bug/khai báo của block**,
   đúng ca "class kéo được nếu chính block grid đang rộng hơn Group".
2. Delta là **`max-width`**, không phải `margin` (0/0), không phải `position/transform`
   (`static`, `none`), không phải padding (0/0). Cơ chế là (a) trong danh sách ứng viên §1.
3. `width` 1280 với `display: block`, `width: auto` **không thể** lớn hơn containing block
   1200 → block phải có `width` khai báo (thực tế resolved 1280 = 100% × 1200 + 80).
   Nên khai báo gần như chắc chắn là cặp `width` + `max-width` cùng dạng `calc(100% + 80px)`.
4. **Rule prototype §2 đã KHÔNG thắng.** `max-width: 100% !important` của mình có
   specificity `(0,5,0)` + `!important`, phải đè mọi declaration author không-important
   bất kể thứ tự stylesheet. Delta còn nguyên 80 ⇒ một trong hai:
   - **(A)** rule không có mặt trên trang (WindPress chưa compile / chưa attach / dán nhầm
     project / cache) — khả năng cao nhất;
   - **(B)** declaration đối thủ nằm ở **inline style có `!important`** (inline `!important`
     thắng author `!important`), hoặc do JS ghi vào `style` sau load.
5. `max-width: calc(100% + 80px)` **không tồn tại trong repo**: đã grep
   `wp-content/plugins/skvn-marine-blocks/**`, `wp-content/themes/skvn-marine/**`,
   bản runtime `D:\Github\minhhaifish\wp-content\{themes,plugins,mu-plugins,uploads}` với
   `calc(100% + 80`, `calc(100%+80`, `+ 80px`, `max-width` — **không match**. Vậy khai báo
   này sống ở CSS phía site (WindPress stylesheet / Additional CSS / DB), không phải source
   theme/plugin. Đây là dữ kiện quan trọng: nếu nó là tàn dư thí nghiệm trên site thì phải
   gỡ, không được "chữa" bằng class chồng lên.

> **ĐỌC TIẾP §4.2.1 trước khi kết luận.** Hai suy luận ở mục 1 và mục 5 trên đây được **sửa
> lại** bởi probe + quét stylesheet: owner không phải "khai báo của block", và `calc(100% + 80px)`
> **không** phải tàn dư site — nó là **GeneratePress dynamic inline CSS**. Giữ nguyên câu chữ
> tại chỗ để thấy đường điều tra; kết luận đúng nằm ở §4.2.1.

#### 4.2.1 Kết quả §4.3 (2026-11-12) — nguyên nhân đã đóng

**A. Probe (inject rule §2 bằng `<style>` rồi đo lại):**

```text
before: gridWidth 1280, delta 80, maxWidth calc(100% + 80px)
after : gridWidth 1200, delta  0, maxWidth 100%
```

⇒ **Rule prototype thắng được, và đúng là đủ để chữa** (grid về đúng 1200, không cần
`overflow`, không cần đổi align). Cơ chế không phải `position/transform`, không phải `<ul>`.

**B. Quét stylesheet:**

| # | kind | src | selector | giá trị |
|---|---|---|---|---|
| 11 | `value-80` | **`inline-sheet#27`** | `.entry-content .alignwide, body:not(.no-sidebar) .entry-content .align…` | `margin-left:-40px; width:calc(100% + 80px); max-width:calc(100% + 80px)` |
| 12 | `island-rule` | `inline-sheet#39` | `.skvn-island-group.is-layout-constrained > :not(…)` | chính là rule **probe vừa inject ở A** |

- `inline-sheet#39` là `<style id="skvn-island-probe">` do snippet A thêm vào `head` — chạy
  B ngay sau A trong cùng page mà không reload thì sheet cuối chính là probe.
- `inline-sheet#27` = `<style id="generate-style-inline-css">` của **GeneratePress**
  (dynamic CSS sinh từ GP settings, không nằm trong file nào).
- `wp-custom-css: false` → không có Additional CSS. Không có rule `.skvn-category-grid`
  nào khai báo `width/max-width` trong plugin build (`build/style-index.ts.css`: chỉ
  `width:100%` và `max-width:100%` cho ảnh/CTA/input).

**Kết luận cuối cùng về 80px:** GeneratePress phát
`.entry-content .alignwide { margin-left:-40px; width:calc(100% + 80px); max-width:calc(100% + 80px) }`
(specificity `(0,2,0)`), giả định content padding 40px của GP. Canvas SKVN đã zero padding
(`style.css:959-968`), còn core layout ép `margin-left/right: auto !important` cho con
constrained → mất phần bù trái `-40px`, chỉ còn `+80px` sang phải. Ở page level theme clamp
`style.css:994-1013` thắng GP vì load sau; block **nested trong Group** không phải con trực
tiếp `.entry-content` nên clamp không áp → GP thắng `max-width`.

⇒ **Không phải lỗi Category Grid, không phải container query, không phải tàn dư thí nghiệm.**
Ghi thành `.context/PITFALLS.md` **DP-07.1**.

**Vì sao rule §2 vẫn chưa có tác dụng trên site:** nó **không có mặt** trong CSS của trang —
không thấy trong `windpress-cached-inline-css`, không thấy trong `windpress:vfs` (base64
virtual filesystem của WindPress, decode ra 9.477 byte, 0 match `island-group`). Tức là lần
paste chưa được lưu/compile vào project WindPress đang serve. Việc cần làm là thao tác site
(§3), không phải sửa CSS.

#### 4.2.2 Hệ quả vượt ra ngoài island

Vì selector của GP là **descendant** (`.entry-content .alignwide`), mọi block `alignwide`
nằm trong một container có width trên canvas full-width đều bị +80px phải: slider
(`alignwide`), các Product Collection carousel (`alignwide`), grid trong Group. Đây là bug
cấp canvas, không phải cấp một block — nên nếu chọn sửa gốc thì sửa **một lần cho cả canvas**,
và phải có ảnh trước/sau cho slider + collection + grid.

Hai hướng sửa gốc (đều cần human quyết, xem decision doc):

| Hướng | Delta | Phạm vi | Ghi chú |
|---|---|---|---|
| **T1 — theme neutralizes GP alignwide trên canvas** | ~4 declaration trong `style.css` hoặc `inc/` inline, scope `body.skvn-full-width-canvas .entry-content .alignwide` (specificity `(0,3,1)` > GP `(0,2,0)`) | Tất cả wide block trong container trên canvas | Trả width về đúng một owner (core/theme), khớp luật "con theo cha". Ảnh hưởng slider/collection → cần human duyệt trước |
| **T2 — WindPress stopgap class** (đang làm) | 0 source delta, 1 class + 1 rule site | Chỉ Group có class | Đúng decision hiện hành; không chữa slider/collection; phải lưu + compile được vào project đang serve |

`alignfull` **không** nằm trong phạm vi đợt này: rule GP cho alignfull chỉ áp khi
`body:not(.no-sidebar)`, và canvas của theme đã có reset riêng — cần đo riêng nếu muốn đụng.


### 4.3 Bước tiếp — hai snippet, chạy theo thứ tự

**A. Chứng minh class có thắng được không (đọc kết quả ngay, không phụ thuộc WindPress).**
Dán vào console frontend; snippet tự inject rule §2 rồi đo lại.

```js
(() => {
	const island = document.querySelector('.skvn-island-group');
	const grid = island && island.querySelector('.skvn-category-grid');
	if (!grid) return 'No grid in island';
	const before = {
		gridWidth: +grid.getBoundingClientRect().width.toFixed(1),
		delta: +(grid.getBoundingClientRect().right - island.getBoundingClientRect().right).toFixed(1),
		maxWidth: getComputedStyle(grid).maxWidth,
	};
	const s = document.createElement('style');
	s.id = 'skvn-island-probe';
	s.textContent =
		'.skvn-island-group.is-layout-constrained > *:not(.alignleft):not(.alignright):not(.aligncenter)' +
		'{box-sizing:border-box;margin-left:0 !important;margin-right:0 !important;' +
		'max-width:100% !important;min-width:0}';
	document.head.appendChild(s);
	const after = {
		gridWidth: +grid.getBoundingClientRect().width.toFixed(1),
		delta: +(grid.getBoundingClientRect().right - island.getBoundingClientRect().right).toFixed(1),
		maxWidth: getComputedStyle(grid).maxWidth,
		inlineStyle: grid.getAttribute('style'),
	};
	console.log('PROBE', { before, after });
})();
```

- `after.delta ≈ 0` → **class thắng được**. Vấn đề chỉ là WindPress không nạp rule (A).
  Gỡ probe, quay lại §3 (compile lại / kiểm project style / editor iframe riêng).
- `after.delta ≈ 80` và `after.maxWidth` vẫn `calc(100% + 80px)` → declaration đối thủ là
  **inline `!important`** hoặc do JS ghi; chạy snippet B để chỉ đúng nguồn.

**B. Chỉ đúng stylesheet/rule đang khai báo `max-width` đó.**

```js
(() => {
	const grid = document.querySelector('.skvn-category-grid');
	console.log('INLINE grid:', grid && grid.getAttribute('style'));

	const hits = [];
	const walk = (rules, src) => {
		for (const r of rules) {
			try {
				if (r.selectorText) {
					const mw = r.style && r.style.maxWidth;
					const w = r.style && r.style.width;
					if (r.selectorText.includes('skvn-island-group')) {
						hits.push({ kind: 'island-rule', src, sel: r.selectorText.slice(0, 70), css: r.style.cssText.slice(0, 150) });
					}
					if (r.selectorText.includes('skvn-category-grid') && (mw || w)) {
						hits.push({ kind: 'grid-width', src, sel: r.selectorText.slice(0, 70), css: 'width:' + w + '; max-width:' + mw + '; important:' + r.style.getPropertyPriority('max-width') });
					}
					if ((mw && mw.includes('80')) || (w && w.includes('80'))) {
						hits.push({ kind: 'value-80', src, sel: r.selectorText.slice(0, 70), css: r.style.cssText.slice(0, 150) });
					}
				} else if (r.cssRules) {
					walk(r.cssRules, src + ' > ' + (r.cssText || '').split('{')[0].slice(0, 40));
				}
			} catch (e) {}
		}
	};
	[...document.styleSheets].forEach((s, i) => {
		const src = s.href || 'inline-sheet#' + i;
		let rules;
		try { rules = s.cssRules; } catch (e) { hits.push({ kind: 'BLOCKED', src, sel: 'cross-origin' }); return; }
		walk(rules, src);
	});
	console.table(hits);
	console.log('sheets:', [...document.styleSheets].map((s, i) => s.href || 'inline#' + i));
	const cc = document.getElementById('wp-custom-css');
	console.log('wp-custom-css:', !!cc, cc ? cc.textContent.slice(0, 500) : '');
})();
```

Đọc: dòng `grid-width` có `có mặt sheet = ?` + `important = ?`:

| Kết quả | Nghĩa | Việc |
|---|---|---|
| không có `island-rule` nào | WindPress chưa nạp rule | Compile lại / đúng project style / kiểm `skvn-island-group` có trong file CSS đã compile |
| có `island-rule`, `grid-width` `important=''` | Rule có mặt mà vẫn thua ⇒ declaration đến từ chỗ khác (ưu tiên dòng `value-80` / inline) | Gửi `src` của dòng `value-80` |
| `value-80` trỏ về sheet WindPress/site | Tàn dư thí nghiệm phía site (`max-width: calc(100% + 80px)`) | **Gỡ tận gốc** thay vì chồng class — báo human quyết |
| `INLINE grid` có `max-width` | Khai báo nằm trong `style` attribute | Gửi nguyên chuỗi; nếu có `!important` thì đó là lý do class không thắng |

> Chạy A trước: nếu A đã cho `delta ≈ 0` thì B chỉ còn để dọn dẹp, không còn là điều kiện
> để kết luận.

---

## 5. Test cases (human chạy onsite)

### T-ISLAND-05 — Class kéo con đang rộng hơn Group về box

- **Setup:** page test full-width canvas; Group **Wide (1200)** + `skvn-island-group`;
  bên trong: Category Grid 4-2-1 (desktop 4).
- **Bước:** chạy snippet §4; đo bằng DevTools.
- **Pass:** `grid.right − island.right` ∈ [−1, 1]; grid width = island content width;
  desktop 4 cột; không scrollbar ngang (`scrollWidth <= clientWidth`).
  Với viewport 1903 + Group Wide: kỳ vọng `island = 352..1551`, card = **291px**,
  gap 12, `grid.right = 1551` (thay vì 1631 như ảnh (2)).
- **Fail:** delta vẫn ≈ 80 → xem §4.1, gửi `chain` + `owners`.
- **Kết quả lần 1 (2026-11-12, frontend):** delta 80, grid 1280 vs island 1200 → nhưng
  **không phải class sai**: rule prototype không có mặt trong CSS serve (§4.2.1).
  Probe inject rule (§4.3-A) cho 1280 → 1200, delta 80 → 0 ⇒ **PASS kỹ thuật**.
  Onsite PASS vẫn chờ rule được lưu + compile thật vào project WindPress đang serve.

### T-ISLAND-06 — Không cắt (cấm overflow)

- **Bước:** hover card ở mép phải/đáy của island; kiểm `getComputedStyle(island).overflow`
  và `overflowX`.
- **Pass:** `overflow` = `visible` trên island và trên grid wrapper; shadow card vẫn đổ
  ra ngoài nền (không bị cắt); không scrollbar ngang.
- **Fail:** có `hidden`/`clip` ở bất kỳ đâu trong chain → gỡ, sai decision.

### T-ISLAND-07 — Group không gắn class không đổi

- **Setup:** thêm một core Group thường (không class) cùng page, có paragraph + grid.
- **Pass:** Group đó giữ hành vi FSE cũ (con 760 canh giữa, grid theo container query);
  không bị rule mới chạm vào.
- **Fail:** Group thường cũng bị kéo 100% → selector quá rộng, sửa lại.

### T-ISLAND-08 — Editor iframe = frontend (trừ 64px)

- **Bước:** mở editor, chạy lại snippet §4 trong console của **iframe** editor.
- **Pass:** delta grid/island ∈ [−1, 1] như frontend; class còn nguyên trong
  `islandClass`; CSS WindPress có mặt trong iframe.
- **Fail:** editor không có CSS → WindPress chưa nạp stylesheet cho iframe (cấu hình,
  không phải class). Editor lệch trái 64px là rule theme
  `style.css:117-121` — **không** phải lỗi, đừng kết luận từ khung editor.

### T-ISLAND-09 — Smoke nội dung island

- **Setup:** island Wide chứa: heading, paragraph, Buttons, Image, Columns, Category Grid.
- **Pass:** không block nào dính mép phải; Buttons không kéo full width; ảnh không méo;
  Columns chia đều trong 1200; text không bị cắt.
- **Fail:** block nào đó đổi hành vi lạ → gửi tên block, cân nhắc loại block đó khỏi
  `> *` bằng `:not()`.

---

## 6. Variant (chỉ mở nếu human chọn) — Full-bleed + measure

Chỉ cần khi human muốn **nền tràn 2 viền** *và* chữ vẫn 760 trong cùng một island.
Đây là điều một class không làm được (một box chỉ có một width), nên nó là **island
pattern §7.1 B**, không phải stopgap. Ba cách, xếp theo mức can thiệp:

| Cách | Delta | Ghi chú |
|---|---|---|
| **C1 — hai tầng native** (khuyến nghị nếu cần ngay) | 0 CSS, chỉ thao tác editor | Group **Full** + class cho band; chữ bọc trong **inner Group** (constrained, không align) → inner Group nhận `max-width: 760` của core. Nhưng: rule `> *` kéo **mọi** con trực tiếp về 100%, gồm cả inner Group → cần thêm rule miễn trừ (C2). |
| **C2 — thêm rule miễn trừ** | +1 rule, +1 class phụ | Cho inner Group mang class (ví dụ `skvn-island-measure`) và thêm: `.skvn-island-group.is-layout-constrained > *.skvn-island-measure:not(.alignleft):not(.alignright):not(.aligncenter) { margin-left: auto !important; margin-right: auto !important; max-width: var(--skvn-content-width, 760px) !important; }` (specificity `(0,6,0)` > `(0,5,0)` của rule chính). |
| **C3 — island pattern** | 1 pattern file, 0 CSS | `alignfull` + `layout: constrained` + `contentSize` riêng (ledger §3.3). Chủ width là pattern, không phải class. Đúng hướng 1.4.x. |

**Chưa chọn cách nào.** Decision §7.1 (A/B) vẫn mở; đợt này chỉ ghi nhận C1/C2 tồn tại
và cái giá của chúng (thêm class + rule), để human không phải phát hiện lại sau.

---

## 7. Gỡ stopgap (khi island group primitive có mặt)

1. Bỏ `skvn-island-group` khỏi Additional CSS class của các Group đang dùng.
2. Xoá block CSS ở §2 khỏi stylesheet WindPress; compile lại cache.
3. Kiểm không còn sót trong DB:
   `wp post list --post_type=page --fields=ID,post_title --format=csv` rồi
   `wp db query "SELECT ID FROM wp_posts WHERE post_content LIKE '%skvn-island-group%'"`.
4. Đổi decision doc sang `SUPERSEDED`, ghi mốc gỡ vào `.context/MILESTONES.md`.
5. Nếu island primitive dùng tên class khác, đừng giữ hai class cùng tồn tại — một box
   chỉ một chủ width.

---

## 8. Evidence cần human trả

Đã có (2026-11-12): `VIEWPORT`, `chain`, `owners`, `GRID vs ISLAND` (§4.2) — đủ để xác định
chủ của 80px là wrapper block.

Còn cần:

- Output **§4.3-A** (`PROBE` before/after) — trả lời "class có thắng được không".
- Nếu A vẫn 80: output **§4.3-B** (`hits` + `sheets`) — chỉ đúng stylesheet khai báo
  `max-width: calc(100% + 80px)`.
- `getComputedStyle(island).overflow` + `overflowX` (T-ISLAND-06).
- Chạy lại §4 trong console **editor iframe** (T-ISLAND-08).
- Ảnh full màn hình trước/sau khi chốt cách sửa, cùng align (Wide).
- T-ISLAND-07 / 09 nếu human muốn đóng luôn trong cùng lượt.

---

## 9. Trạng thái

| Hạng mục | Trạng thái |
|---|---|
| Đo lại ảnh (760/1200 + card 414/311) | **Đã có evidence** (§1, pixel scan) |
| Scale ảnh = 1:1 | **Đã xác nhận** — `clientWidth 1903`, `dpr 1`, `zoom 1` (§4.2) |
| Chủ của 80px | **Đã xác định + đã chỉ đúng rule**: GP `inline-sheet#27` `.entry-content .alignwide` `(0,2,0)` (§4.2.1) |
| Nguồn khai báo `calc(100% + 80px)` | **Đã xác định**: GeneratePress dynamic inline CSS, không có trong file nào (§4.2.1) |
| Rule prototype thắng được? | **Có** — probe: 1280 → 1200, delta 80 → 0 (§4.2.1-A) |
| Rule prototype có mặt trên site? | **Không** — vắng trong `windpress-cached-inline-css` và `windpress:vfs` (§4.2.1) |
| Prototype CSS | **Đã có source**; **chưa lưu/compile được vào WindPress** |
| Tên class `.skvn-island-group` | **Đề xuất**, human chưa chốt |
| T-ISLAND-05 | **PASS kỹ thuật** (probe) — nhưng **chưa PASS onsite** vì rule chưa nằm trong CSS serve |
| T-ISLAND-06..09 | **Chưa kiểm chứng** |
| Hướng sửa gốc T1 (theme) vs T2 (stopgap) | **Chưa chọn** — cần human quyết (§4.2.2) |
| Variant Full-bleed + measure (§6) | **Chưa chọn** — gate §7.1 vẫn mở |
