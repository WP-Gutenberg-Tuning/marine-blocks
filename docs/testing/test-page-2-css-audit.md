# Kiểm tra CSS trang test-page-2 — vạch trắng, hình nền lệch, slide + step ngoài viewport

- Trang: `https://minhhaifishery.com/test-page-2/` (block `skvn/step-slider`, plugin `skvn-marine-blocks`)
- Thời gian kiểm tra: 19/11/2026, 15:09–15:50 (+07). Đo trực tiếp trên trình duyệt desktop 1920×959 và đọc file thật của trang (HTML, `build/style-frontend.ts.css`, `build/frontend.ts.css`, `build/frontend.ts.js`, `themes/skvn-marine/style.css`).
- Quy ước nhãn: **OBSERVED** = đo/thấy trực tiếp; **INFERRED** = suy ra từ code; **UNKNOWN** = chưa xác minh được, ghi rõ cách kiểm tra.

## Trạng thái trang đã đổi trong lúc kiểm tra

Lúc 15:36 trang có **3 block slider** xếp chồng (tab cao 120px / 54px / 54px) và 2 section mẫu "Seven Agency". Lúc 15:50 trang chỉ còn **1 block slider** (tab cao 120px), các section mẫu đã bị xóa, nhãn tab 01 và 04 đổi thành "STEP". File CSS/JS của plugin tải về lúc 15:36 và 15:50 **giống hệt nhau** (đã diff, không đổi). Toàn bộ số đo trong file này lấy theo trạng thái lúc 15:50, trừ chỗ ghi rõ là lúc 15:09.

Đính chính: trang này là của bạn, không phải agent làm. Các nhận xét về nội dung (chữ test, section mẫu) trong lần kiểm tra trước không thuộc phạm vi file này; file này chỉ xử lý CSS.

## Tóm tắt kết quả

| # | Vấn đề | Kết luận |
|---|--------|----------|
| 1 | 2 vạch trắng dọc ở thanh step | Mép trái/phải của **tab đang active** — bậc nền giữa tab active và tab kề bên. Đã chứng minh bằng cách bấm đổi tab: vạch chạy theo tab active. |
| 2 | 1 vạch trắng ngang trên mép thanh step | 2 `border-top` xếp chồng: của thanh tab (1px) + của mỗi tab con (2px). |
| 3 | Vệt trắng mờ ở 2 đầu thanh step | `mask-image` làm mờ 12px ở 2 đầu thanh tab, lộ nền trắng của trang. |
| 4 | Hình nền các slide lệch nhau | Ảnh 16:9 bị `object-fit: cover` cắt khác nhau ở mỗi viewport; 2 slide không có ảnh mà dùng gradient với tâm sáng đặt ở 2 góc đối nhau; điểm nhấn của mỗi ảnh nằm ở cao độ khác nhau. |
| 5 | Slide + step không cùng trong một viewport | **Mâu thuẫn cần đọc kỹ (§3.2):** lúc 15:47–15:50 đo trực tiếp thì tab ĐANG nằm trong viewport (490–610 trong viewport 959). Nhưng CSS trên file quy định `min-height: 100svh`, theo đó tab phải rơi xuống 927–1047, tức ngoài viewport — đúng như bạn mô tả, và đúng như lần đo lúc 15:09. Chiều cao slider đang không ổn định giữa các lần tải. |

---

## 1. Vạch trắng ở thanh step — đã tìm ra nguyên nhân

### 1.1 Hai vạch trắng dọc = mép của tab đang active (OBSERVED)

- Vị trí đo được lúc tab 03 active: vạch 1 ở x ≈ 960, vạch 2 ở x ≈ 1440, dày 1–2px, dài suốt chiều cao thanh tab (120px). Đó đúng là mép trái và mép phải của tab 03.
- Bằng chứng quyết định: bấm sang tab 02 thì vạch chạy theo sang x ≈ 480 và 960, vạch ở 1440 biến mất. Bấm về tab 03 thì vạch trở lại 960 và 1440. Ở ranh giới 2 tab inactive (01/02) không có vạch nào.
- Nguyên nhân trong `build/style-frontend.ts.css`:

```css
.skvn-step-slider__tabs { background: rgba(4,12,20,.62); }
.skvn-step-slider__tab { background: transparent; }
.skvn-step-slider__tab.is-active,
.skvn-step-slider__tab[aria-current="true"] { background: hsla(0,0%,100%,.09); }
```

Tab inactive trong suốt nên chỉ hiện nền tối của thanh tab. Tab active được phủ thêm một lớp trắng 9% nên sáng hơn hẳn tab kề bên. Chỗ giáp nhau là một bậc sáng/tối sắc nét, mắt người và khử răng cưa biến nó thành một vạch nhạt 1–2px. Trong HTML render và trong CSS đều **không có** `border-left`, `border-right`, `outline`, `box-shadow` hay element divider nào ở đó.

### 1.2 Vạch trắng ngang trên mép thanh tab = 2 border-top xếp chồng (OBSERVED + INFERRED từ code)

Vạch ngang chạy suốt chiều rộng thanh tab, dày 2–3px, ngay trên mép thanh tab. Nó là hai luật cộng lại:

```css
.skvn-step-slider__tabs { border-top: 1px solid hsla(0,0%,100%,.1); }
.skvn-step-slider__tab { border-top: 2px solid hsla(0,0%,100%,.14); }
```

Border 1px của thanh tab nằm ngay trên border 2px của mỗi tab con, cách nhau 1px, nên nhìn thành một dải nhạt 2–3px. Đoạn xanh dương ngắn ở trên tab active là một thứ khác, có chủ đích: `span.skvn-step-slider__tab-progress` màu `#7ec8e3`, cao 2px, nằm đè lên đúng vị trí border-top đó, rộng dần theo thời gian autoplay (8 giây).

### 1.3 Vệt trắng mờ ở 2 đầu thanh tab = mask-image (OBSERVED + INFERRED từ code)

Ở x 0–12px và ~1908–1920px có vệt trắng mờ dần vào trong, không phải vạch sắc nét. Đó là luật này trên thanh tab:

```css
.skvn-step-slider__tabs {
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 .75rem, #000 calc(100% - .75rem), transparent);
  mask-image: linear-gradient(90deg, transparent, #000 .75rem, #000 calc(100% - .75rem), transparent);
}
```

Mask làm mờ 12px ở hai đầu thanh tab, nền tối bị mờ đi và nền trắng của trang lộ ra. Ở desktop 4 tab không tràn nên mask không có tác dụng gì ngoài việc tạo ra hai vệt này.

### 1.4 Vì sao DevTools không thấy được (INFERRED, khớp với trải nghiệm của bạn)

- Vạch dọc không có rule nào vẽ nó. Soi tab active chỉ thấy `background` sáng hơn, soi tab bên cạnh chỉ thấy `background: transparent`. Không có border để tìm, vì cái gây ra vạch là **sự chênh lệch giữa hai nền kề nhau**, không phải một thuộc tính của riêng element nào.
- Vạch ngang bị chia đôi trên hai element khác nhau (thanh tab và tab con), soi riêng từng cái chỉ thấy 1px hoặc 2px, không thấy cả dải 3px.
- Mask không hiện trong box model của DevTools, nên element trông vẫn nguyên vẹn trong panel Styles dù hai đầu đã bị mờ.

### 1.5 Cách sửa

Sửa ở **source của plugin**, không sửa file build `build/style-frontend.ts.css` vì build lại sẽ ghi đè. Để thử nhanh trước khi sửa source, dán đoạn dưới vào Additional CSS hoặc child theme (style của theme load sau CSS plugin nên cùng specificity vẫn thắng):

```css
/* 1. Bỏ vạch dọc: tab active không dùng nền sáng nữa,
      chỉ giữ thanh progress xanh + chữ trắng để nhận biết */
.skvn-step-slider__tab.is-active,
.skvn-step-slider__tab[aria-current="true"] {
  background: transparent;
}

/* 2. Bỏ vạch ngang: chỉ giữ một border-top, bỏ cái của thanh tab */
.skvn-step-slider__tabs {
  border-top: 0;
}

/* 3. Bỏ vệt trắng hai đầu thanh tab */
.skvn-step-slider__tabs {
  -webkit-mask-image: none;
  mask-image: none;
}
```

Lưu ý ở bước 1: bỏ nền active thì tab active vẫn nhận biết được qua chữ trắng (`color: #fff`) và thanh progress xanh chạy ở mép trên. Nếu bạn vẫn muốn tab active nổi bật bằng nền, thì không còn cách nào ngoài chấp nhận vạch ở mép — bất kỳ bậc nền sắc nét nào giữa hai tab kề nhau cũng tạo ra vạch đó. Một lựa chọn khác là biến vạch thành chủ đích: thêm divider 1px giống nhau ở **mọi** ranh giới tab, lúc đó mép tab active không còn trông như lỗi nữa.

---

## 2. Hình nền các slide lệch nhau

### 2.1 Hiện trạng đo được (OBSERVED)

- Slide 2 và 3 dùng ảnh thật, cùng kích thước gốc **3840×2160 (16:9)**, hiển thị bằng:

```css
.skvn-step-slide__image {
  height: 100%; width: 100%;
  object-fit: cover;
  object-position: var(--skvn-slide-bg-pos-x, 50%) var(--skvn-slide-bg-pos-y, 50%);
}
```

  Trong HTML, cả 2 slide đều để mặc định `--skvn-slide-bg-pos-x: 50%; --skvn-slide-bg-pos-y: 50%` (căn giữa).
- Slide 1 và 4 **không có ảnh**, chỉ có gradient đặt inline trên chính div slide:
  - Slide 1: `radial-gradient(110% 80% at 18% 8%, #2a7f9e 0%, #0f4266 42%, #071c33 100%)` — điểm sáng ở **góc trên-trái**, tông teal.
  - Slide 4: `radial-gradient(110% 80% at 80% 88%, #5b5bd6 0%, #2c2c6e 48%, #101024 100%)` — điểm sáng ở **góc dưới-phải**, tông tím.
- Lớp phủ tối trên mọi slide là giống nhau (`.skvn-step-slide__overlay`: gradient tối dần từ trái sang phải, đậm ở phía chữ), nên đó là điểm thống nhất duy nhất giữa các nền.
- Hiệu ứng chuyển slide làm lệch rõ hơn: Swiper đang chạy `effect: "fade", fadeEffect: { crossFade: true }`, tốc độ 800ms, đồng thời media của slide mới có animation wipe `clip-path: inset(0 100% 0 0)` → `inset(0 0 0 0)` trong 0.8s. Trong lúc crossfade, cả 2 slide đều bán trong suốt và phía sau chúng là nền trắng của trang (slider không đặt `background`), nên có một chớp trắng giữa 2 slide.

### 2.2 Vì sao nó lệch: `object-fit: cover` cắt khác nhau ở mỗi khung hình

`cover` luôn lấp đầy khung bằng cách phóng ảnh theo chiều hẹp hơn rồi cắt phần thừa ở chiều còn lại. Khung slide ở đây không cố định tỉ lệ mà ăn theo viewport (rộng 100%, cao = viewport − 120px tab), nên cùng một bức ảnh 16:9 sẽ bị cắt rất khác nhau:

| Viewport | Khung slide (rộng × cao) | Tỉ lệ khung | Ảnh 16:9 bị cắt |
|---|---|---|---|
| Desktop 1920×959 | 1920 × 839 | ~2.29:1 | Cắt ~11% chiều cao ở **trên** và ~11% ở **dưới** (tổng ~241px trên ảnh đã scale) |
| Desktop 1920×903 | 1920 × 783 | ~2.45:1 | Cắt ~14% trên và ~14% dưới |
| Mobile 390×844 | 390 × 724 | ~0.54:1 | Cắt ~35% chiều rộng ở **trái** và ~35% ở **phải** — chỉ còn ~30% chiều rộng ảnh ở giữa |

Hệ quả:

1. **Điểm nhấn nhảy cao độ giữa các slide.** Slide 2 (công nhân chế biến) và slide 3 (băng chuyền IQF) có chủ thể nằm ở vị trí khác nhau trong ảnh gốc, nhưng cả hai đều đang căn giữa 50%/50%. Khi chuyển slide, đường chân trời / mặt người / mặt bàn nhảy lên xuống — đó là cái "lệch quá trời".
2. **Slide gradient lệch hẳn với slide ảnh.** Điểm sáng của slide 1 ở góc trên-trái, slide 4 ở góc dưới-phải, tông màu cũng khác (teal so với tím), trong khi slide 2–3 là ảnh thật. Bốn nền không có chung một "phía sáng".
3. **Ở mobile, chủ thể có thể bị cắt mất.** Với khung 0.54:1, ảnh chỉ còn dải giữa 30% chiều rộng; công nhân ở rìa trái/phải của ảnh slide 2 sẽ biến mất, trong khi ở desktop họ vẫn thấy.

### 2.3 Cách làm cho các hình nền "cùng một phía" — 3 trục phải căn cùng lúc

**Trục 1 — Cùng tỉ lệ khung hình.** Cố định tỉ lệ của khung slide thay vì để nó ăn theo viewport một cách tự do. Khuyến nghị: chuẩn hoá ảnh nguồn về cùng tỉ lệ với khung slide thực tế ở desktop, khoảng **21:9** (ví dụ 2560×1080 hoặc 2400×1050), thay vì 16:9. Nếu giữ 16:9 thì chấp nhận ảnh luôn bị cắt 11–14% chiều cao ở desktop — và phải kiểm tra điểm nhấn sau khi cắt (xem trục 2). Ảnh nguồn nên xuất cùng một kích thước cho mọi slide, đừng để mỗi ảnh một tỉ lệ.

**Trục 2 — Cùng một đường nhấn (focal line), đặt riêng cho từng ảnh.** Plugin đã có sẵn biến `--skvn-slide-bg-pos-x` / `--skvn-slide-bg-pos-y` cho từng slide — dùng nó thay vì để mặc định 50%/50%. Cách đặt:

- Chọn **một cao độ chung** cho điểm nhấn chính của mọi ảnh, ví dụ mặt người / mặt bàn / mặt băng chuyền đều nằm ở khoảng **40% chiều cao khung** sau khi cắt. Với mỗi ảnh, tính ngược ra `--skvn-slide-bg-pos-y` cần thiết rồi đặt vào HTML của slide đó.
- Đẩy chủ thể sang phải để tránh cột chữ: cột chữ rộng tối đa 46rem ở phía trái, trên đó đã có lớp overlay tối. Đặt `--skvn-slide-bg-pos-x` khoảng **65–70%** cho ảnh có chủ thể lệch trái, để mặt người / chi tiết chính không chui xuống dưới khối chữ.
- Kiểm tra ở cả 3 viewport (1920×959, 1366×768, 390×844) vì `cover` cắt khác nhau ở mỗi tỉ lệ — một focal point đúng ở desktop có thể sai ở mobile.

**Trục 3 — Cùng cách xử lý nền cho cả 4 slide.** Slide 1 và 4 đang là gradient "trần", slide 2–3 là ảnh. Chọn một trong hai:

- (a) Cho slide 1 và 4 dùng ảnh thật với cùng cách xử lý như slide 2–3 (cùng overlay tối, cùng focal line); hoặc
- (b) Giữ gradient nhưng thống nhất với ảnh: cùng đặt điểm sáng ở **một góc** (ví dụ góc trên-trái cho cả 4 slide), cùng tông màu biên tối `#071c33` (màu biên của slide 1, cũng là màu tối nhất trong overlay). Hiện slide 4 dùng tông tím `#5b5bd6`/`#101024` là lạc hẳn.

Và một việc nhỏ nhưng hiệu quả: đặt nền tối cho chính slider để crossfade không chớp trắng:

```css
.skvn-step-slider { background: #071c33; }
```

---

## 3. Slide + step cùng nằm trong một viewport

### 3.1 Số đo thực tế (OBSERVED, 15:47–15:50, viewport 1920×959, trang 1 slider)

| Mốc | Vị trí y (px, từ mép trên viewport) |
|---|---|
| Thanh admin WordPress (khi đăng nhập) | 0–32 |
| Site header (logo + nav, sticky) | 32–88 (cao ~56) |
| Tiêu đề trang "Test page 2" | **0px — không chiếm chỗ** (theme ẩn bằng `.entry-title { display: none; }`) |
| Đỉnh slider | ≈ 88, ngay dưới header |
| Đáy mặt tối của slide 1 | ≈ 365–375 |
| Khoảng trắng | ≈ 115px |
| Thanh step (tab 01–04) | **490–610 (cao 120px)** |
| Đáy trang | ≈ 981 (trang chỉ cao hơn viewport ~22px, cuộn tối đa ~22px) |

Kết luận ở viewport này: **thanh step ĐANG nằm trong viewport**, còn thừa ~349px phía dưới. Phàn nàn "viewport hiện chỉ có mỗi slide, step ở dưới không có trong phần viewport" **không tái hiện được** ở trạng thái hiện tại trên desktop 1920×959. Nó có thể đúng ở một trạng thái khác: trang 3-slider lúc trước, viewport nhỏ hơn, hoặc lúc luật `100svh` có hiệu lực (xem §3.2).

### 3.2 Mâu thuẫn phải nói rõ: CSS trên file và render thực tế đang vênh nhau

CSS của plugin quy định (trong `build/style-frontend.ts.css`):

```css
.skvn-step-slider:not(.skvn-step-slider--height-content) { min-height: 100svh; }
.skvn-step-slider:not(.skvn-step-slider--height-content).is-ready .swiper {
  min-height: calc(100svh - var(--skvn-step-slider-tab-height, 54px));
}
```

Với viewport 959 và tab cao 120px, theo luật này slider phải cao 959px: slide 839px + tab 120px, đỉnh ở y=88, đáy ở y=1047, tab nằm ở **927–1047 — ngoài viewport 88px**, đúng như bạn mô tả. Và lần đo lúc **15:09** khớp với luật này: mặt slide cao ~780px (ở viewport 903: 903−120=783), tab nằm dưới nếp gấp.

Nhưng lần đo lúc **15:47–15:50** thì slider chỉ cao ~522px (88–610). File CSS tải về lúc 15:36 và 15:50 **giống hệt nhau**, HTML của slider 1 cũng giữ nguyên `data-height-mode="viewport"`. Tức chiều cao slider đang **không ổn định giữa các lần tải** trong khi code không đổi.

Nghi phạm (INFERRED — chưa xác minh, cần kiểm tra theo hướng dẫn dưới):

1. **Class `is-ready` không được gắn.** Luật `min-height: calc(100svh − 120px)` của `.swiper` chỉ có hiệu lực khi slider có class `is-ready`. Class này do JS gắn ở cuối hàm khởi tạo, và toàn bộ hàm khởi tạo bọc trong `try { ... } catch {}` **rỗng** — nếu bất cứ bước nào trong đó lỗi, class không được gắn mà cũng không có thông báo lỗi nào. Khi đó slider rơi về CSS dự phòng không-JS (`.swiper { height: auto; overflow: visible }`, slide xếp theo nội dung), chiều cao thành chiều cao nội dung (~400–500px) và xuất hiện khoảng trắng 115px cùng hiện tượng chữ bị header che (xem §3.5).
2. **Trình duyệt giữ bản CSS cũ trong cache.** Tham số `?ver=1795074897` không đổi giữa các lần tải, nên một bản build cũ (trước khi có luật `100svh`) có thể vẫn nằm trong cache của trình duyệt đo.

**Kiểm tra trong 30 giây bằng DevTools của bạn** (trình duyệt kiểm tra của tôi không mở được DevTools nên chưa làm được bước này):

1. Mở trang, inspect div `.skvn-step-slider` — nó có class `is-ready` không? Nếu không có, JS khởi tạo đã lỗi im lặng.
2. Xem computed `height` của `.swiper` và rule nào đặt nó (panel Computed → trace rule).
3. Hard reload `Ctrl+Shift+R` rồi đo lại chiều cao slider: nếu sau hard reload slider cao đúng ~959px thì là cache; nếu vẫn ~522px và vẫn thiếu `is-ready` thì là lỗi JS khởi tạo — lúc đó cần thêm `console.error` tạm vào khối `catch` trong `frontend.ts.js` để bắt lỗi thật.

### 3.3 Vì sao 100svh vẫn đẩy tab ra ngoài, khi luật có hiệu lực (INFERRED từ số đo + code)

`100svh` tính từ mép trên của **viewport**, nhưng slider không bắt đầu ở mép trên viewport. Phía trên nó còn:

- Thanh admin 32px (chỉ khi đăng nhập),
- Site header sticky cao ~56px,
- `.inside-article` có `padding: 30px` (luật của GeneratePress).

Đỉnh slider ở y≈88, đáy slider = 88 + 959 = 1047 > 959. Tab (120px cuối của slider) nằm ở 927–1047, tức ngoài viewport 88px khi đăng nhập, 56px khi đăng xuất. Header sticky làm tệ hơn: kể cả khi bạn cuộn xuống, header vẫn chiếm 56px đầu viewport, nên "slide + step trong một viewport" không bao giờ đạt được nếu slider cứ cao đúng 100svh trong khi nó bắt đầu thấp hơn viewport 88px.

### 3.4 Cách sửa — 2 phương án, chọn 1

**Phương án A (khuyến nghị — đúng cách làm của mẫu Slider Revolution mà bạn đang tham chiếu): header phủ lên hero.**

- Cho site header phủ lên trên slider thay vì chiếm chỗ trong luồng: `position: absolute` (hoặc `fixed`) với nền trong suốt, đặt trên cùng của slider.
- Bỏ padding phía trên slider (padding-top 30px của `.inside-article` và mọi margin trên slider) để slider bắt đầu đúng ở y=0.
- Khi đó slider cao đúng `100svh`, slide chiếm 100svh − 120px, tab chiếm 120px cuối — slide + step vừa đúng một viewport, không thừa không thiếu.
- Lưu ý: chữ trong slide phải tránh vùng header — padding trên của nội dung slide hiện là `clamp(4.5rem, 11vh, 7.5rem)` (tới 120px), đã đủ chỗ cho header cao ~56px. Chỉ cần kiểm tra lại ở mobile, nơi header có thể cao hơn.

**Phương án B (giữ header trong luồng): trừ đúng chiều cao phần trên khỏi 100svh.**

- Đặt chiều cao slider = `calc(100svh − <chiều cao phần trên slider>)`, trong đó chiều cao phần trên **phải đo bằng JS lúc load/resize** (vì admin bar chỉ có khi đăng nhập, header cao khác nhau theo breakpoint — hard-code số px sẽ sai ở một trong các trường hợp):

```js
// Trong JS khởi tạo slider (frontend.ts):
const setOffset = () => {
  const top = slider.getBoundingClientRect().top + window.scrollY;
  slider.style.setProperty('--skvn-slider-offset', top + 'px');
};
setOffset();
window.addEventListener('resize', setOffset);
```

```css
.skvn-step-slider:not(.skvn-step-slider--height-content) {
  min-height: calc(100svh - var(--skvn-slider-offset, 0px));
}
.skvn-step-slider:not(.skvn-step-slider--height-content).is-ready .swiper {
  min-height: calc(100svh - var(--skvn-slider-offset, 0px) - var(--skvn-step-slider-tab-height, 54px));
}
```

- Phương án B giữ nguyên bố cục trang (header vẫn đẩy nội dung xuống như mọi trang khác), nhưng phải duy trì đoạn JS đo offset và kiểm tra ở cả 2 trạng thái đăng nhập / đăng xuất.

**Dù chọn phương án nào, cần thêm 2 việc:**

- Luật hiện tại dùng `min-height` nên nếu nội dung slide cao hơn khung, slider vẫn dài ra và đẩy tab xuống dưới. Sau khi chiều cao đã đúng, nên dùng `height` (kèm `overflow: hidden` trên `.swiper`, đã có) thay vì `min-height`, hoặc chuyển sang chế độ `height-content` có giới hạn tối đa — và kiểm tra ở viewport thấp (ví dụ 1366×768, 390×844) vì padding chữ `clamp(4.5rem, 11vh, 7.5rem)` có thể làm nội dung tràn khung.
- Kiểm tra ở cả trạng thái **đăng xuất** (không có admin bar 32px): mọi công thức trừ offset đều thay đổi 32px giữa 2 trạng thái.

### 3.5 Hai dấu hiệu kèm theo: khoảng trắng 115px và chữ bị header che (OBSERVED, nguyên nhân UNKNOWN)

Lúc 15:47–15:50 đo được thêm 2 dấu hiệu, chưa rõ nguyên nhân:

- Mặt tối của slide 1 hết ở y≈370, sau đó là **~115px khoảng trắng** rồi mới tới thanh tab ở 490. Trong bố cục flex-column (swiper rồi tới tabs, không có `gap`), không nên có khoảng trắng này.
- Dòng đầu của H2 trong slide **bắt đầu phía trên y=88, chui xuống dưới header sticky** nên bị che mất một phần lúc mới load.

Cả hai dấu hiệu đều khớp với giả thuyết slider đang render ở trạng thái dự phòng không-JS (thiếu `is-ready`, §3.2). Chưa kết luận được cho tới khi kiểm tra class `is-ready` và computed height theo hướng dẫn ở §3.2. Không nên sửa gì thêm cho 2 dấu hiệu này trước khi có kết quả kiểm tra đó.

---

## 4. Checklist sửa — theo thứ tự

1. **Chẩn đoán chiều cao (§3.2):** kiểm tra class `is-ready` + computed height của `.swiper`, hard reload rồi đo lại. Bước này quyết định mọi bước sau.
2. **Vạch trắng (§1.5):** bỏ nền tab active, bỏ 1 trong 2 `border-top`, bỏ `mask-image` — thử bằng Additional CSS trước, chốt rồi sửa vào source plugin.
3. **Viewport (§3.4):** chọn phương án A hoặc B, áp dụng, kiểm tra ở 1920×959, 1366×768, 390×844, cả đăng nhập và đăng xuất.
4. **Hình nền (§2.3):** chuẩn hoá ảnh nguồn cùng tỉ lệ (~21:9), đặt focal point từng slide, thống nhất slide gradient với slide ảnh, thêm nền tối `#071c33` cho slider.
5. **Kiểm tra lại toàn bộ:** chuyển qua cả 4 slide (nội dung dài nhất là slide 1, quyết định chiều cao), bấm tab nhanh (last-wins), để autoplay chạy hết một vòng 4→1, xem ở mobile.

## Phụ lục — file và rule tham chiếu

| Vị trí | Rule / giá trị |
|---|---|
| `plugins/skvn-marine-blocks/build/style-frontend.ts.css` | `.skvn-step-slider:not(.skvn-step-slider--height-content) { min-height: 100svh; }` |
| Cùng file | `.skvn-step-slider__tabs { background: rgba(4,12,20,.62); border-top: 1px solid hsla(0,0%,100%,.1); mask-image: linear-gradient(90deg, transparent, #000 .75rem, #000 calc(100% - .75rem), transparent); }` |
| Cùng file | `.skvn-step-slider__tab { border-top: 2px solid hsla(0,0%,100%,.14); }` |
| Cùng file | `.skvn-step-slider__tab.is-active { background: hsla(0,0%,100%,.09); }` |
| Cùng file | `.skvn-step-slider__tab-progress { height: 2px; top: -2px; background: var(--skvn-step-slider-progress-color); }` |
| Cùng file | `.skvn-step-slide__image { object-fit: cover; object-position: var(--skvn-slide-bg-pos-x, 50%) var(--skvn-slide-bg-pos-y, 50%); }` |
| Cùng file | `.skvn-step-slide__content { padding: clamp(4.5rem, 11vh, 7.5rem) clamp(1.25rem, 5vw, 4.5rem); max-width: 46rem; }` |
| `plugins/skvn-marine-blocks/build/frontend.ts.js` | Swiper: `effect: "fade", fadeEffect: { crossFade: true }`, `speed: 800`, `spaceBetween: 0`, `slidesPerView: 1`, `loop: true`; `is-ready` được gắn ở cuối `try { ... } catch {}` rỗng |
| `themes/skvn-marine/style.css` | `.site-header { position: sticky; top: 0; background: rgba(255,255,255,.96); }`; `.entry-title { display: none; }`; `.entry-content { margin: 0; padding: 0; }` |
| GeneratePress (inline CSS trong trang) | `.inside-article { padding: 30px; }`; `.site-header .header-image { width: 100px; }` |
| HTML trang (lúc 15:50) | Slider: `data-height-mode="viewport" data-autoplay="1" data-dwell="8" data-loop="1"`, inline `--skvn-step-slider-tab-height: 120px`; slide 2–3: ảnh 3840×2160, `--skvn-slide-bg-pos-x/y: 50%`; slide 1, 4: gradient radial inline, không có ảnh |

## Ghi chú về các lần đo trước

- Lần đo 15:09 (trang 3 slider, viewport 1920×903): slider 1 cao ~780px mặt slide + tab ở dưới nếp gấp; autoplay tắt lúc load (phải bấm Play); slide 4 có trong code nhưng hiển thị trắng; thanh progress 2px màu `#7ec8e3` ở mép trên tab active **có tồn tại** (lần đầu đã bỏ sót, xin đính chính).
- Lần đo 15:36–15:42 (trang 3 slider): 2 vạch dọc di chuyển theo tab active — bằng chứng cho §1.1.
- Lần đo 15:47–15:50 (trang 1 slider, viewport 1920×959): số đo ở §3.1 và §3.5.
- Mobile (~390px) và console errors chưa kiểm chứng được trong các lần đo này.
