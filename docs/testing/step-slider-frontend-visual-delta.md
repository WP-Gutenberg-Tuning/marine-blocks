# Delta — Step Slider frontend visual

**Opened:** 2026-11-17  
**Status:** ANALYSIS — chưa sửa source.  
**Human:** artifact là trung tâm khi soi mặt trang web.  
**Không thuộc file này:** editor UI (plan 082), lag editor, WindPress. Không code từ file này cho đến khi human giao sơn.

Lượt sau thêm một mục `## [YYYY-MM-DD HH:MM] | <agent>` ở cuối. Không viết đè các mục đã khóa. Không đánh dấu PASS.

## Cách đọc

Ba state. State A là mặt cần soi. State B là source đang chạy. State C là khóa sản phẩm: chỗ A và C khác nhau thì không sửa B cho giống A.

| | |
|---|---|
| **State A — đúng để soi** | `docs/ideations/sliders/from-soil-to-harvest/artifacts/step-slider-prototype.html`. Bản manual cùng thư mục dùng cùng CSS chrome. |
| **State B — đang chạy** | `wp-content/plugins/skvn-marine-blocks/src/step-slider/style.css`, `modules/step-slider-render/step-slider-render.php`, `src/step-slider/frontend.ts` (progress). |
| **State C — khóa, không lật bằng artifact** | Plan 018 contract O09, O10. Plan 079 §8 (số 800 / 400 / 0 / 100 / 200 / 300), §9a (tab absolute đáy khối, `width: 100%`, không `100vw`, không margin âm). Plan 081: chưa có ảnh Slider làm mẫu màu. |

Chưa có ảnh chụp computed style trên trang live. Mọi dòng dưới là delta source. Agent sau phải đo trên trang trước khi đổi CSS.

## Năm trục

**Môi trường.** A là một file HTML + Tailwind CDN, không qua theme, không qua WindPress. B là block trong theme SKVN, CSS frontend enqueue cả editor lẫn trang web. Chênh heading/paragraph/nút trên live có thể là theme hoặc WindPress, chưa đo.

**Thời điểm.** A vẽ chrome ngay. B ẩn tab và mũi tên khi chưa có `.is-ready` (079 F7). Sau `.is-ready` Swiper fade + wipe 800 ms + cascade. Số motion thuộc C, không phải lỗi sơn.

**Lớp.** Lệch nằm ở HTML chrome và CSS paint. `frontend.ts` chỉ ghi `style.width` của progress. Không có lớp PHP nào vẽ số bước, gradient từng bước, hay icon Play.

**Phạm vi.** Lệch là chrome của một block Step Slider: nền, overlay, cột chữ, thanh bước, progress, Play, mũi tên. Không phải toàn trang.

**Dữ liệu.** B có attribute `overlayPreset`, `textPosition`, `textSurface`, `tabLabel`. A không có các attribute đó. Sơn lại không được xóa attribute. Nội dung mẫu trong A (kicker, heading cỡ lớn, CTA pill) là copy của prototype, không phải chrome bắt buộc.

## DOM — A và B không cùng cây

Artifact, mỗi bước:

```html
<div class="step-slide__media"><div class="ph ph-1"></div></div>
<div class="step-slide__overlay"></div>
<div class="step-slide__content">…kicker, h2, p, a.cta…</div>
```

Overlay là anh em của media, luôn có, không phụ thuộc ảnh.

Production (`step-slider-render.php` khoảng dòng 107–123):

```html
<div class="skvn-step-slide__media">
  <!-- chỉ khi có ảnh: img + span.skvn-step-slide__overlay -->
</div>
<div class="skvn-step-slide__content">…InnerBlocks…</div>
```

Không ảnh thì không có overlay. Nền phẳng nằm trên `.skvn-step-slide` (`style.css` dòng 48–52, `#101f30`).

Thanh bước. Artifact: một `<nav>` liền, mỗi nút có ba con — số `01`, nhãn, progress bọc `<i>`. Production (`step-slider-render.php` dòng 179–188): một `<div>`, mỗi `<button>` chỉ có text `tabLabel` và một `<span class="skvn-step-slider__tab-progress">`. Không có số bước.

Play. Artifact: pill, SVG pause/play, nhãn chữ `Tạm dừng`, hiện khi slider đã init. Production (dòng 192): `<button class="skvn-step-slider__play" hidden>Play</button>`. Không icon.

Mũi tên. Artifact không có. Production (dòng 190–191) có hai button, ký tự `‹` `›` (`&#8249;` `&#8250;`).

## Paint — chỗ B lệch A

### 1. Nền khi không có ảnh

A: bốn radial-gradient khác nhau (`.ph-1` … `.ph-4`, prototype dòng 54–61) cộng lớp noise `::after` opacity 0.35. B: một màu `#101f30` cho mọi bước. A không có attribute cho màu từng bước. Bốn gradient là sơn cứng trong file mẫu, chưa có chỗ lưu trên block.

### 2. Overlay

A (dòng 67–72): luôn vẽ hai gradient — đáy `rgba(4,12,20,.60)` tắt ở 26% chiều cao, và trái `rgba(4,12,20,.84)` tắt ở 70% chiều ngang. B: một lớp `rgba(8,18,30, …)` phủ kín (`style.css` dòng 73–83), alpha 0.22 / 0.45 / 0.65 theo `overlayPreset`, và chỉ khi có ảnh. Vùng chữ và đáy tab trên ảnh thật không có dải tối riêng.

`textSurface` của B là một tấm `rgba(10,20,33,.72)` blur trên cả cột chữ (`style.css` dòng 114–117). A không có tấm đó. Attribute vẫn phải sống.

### 3. Cột chữ

A (dòng 75–79): `max-width: 46rem`, `margin-right: auto`, padding đáy `clamp(6.5rem, 17vh, 9.5rem)`. B (`style.css` dòng 85–97): cột full ngang, `justify-content: center`, padding đáy chỉ cộng thêm `4.5rem`. Class `is-position-left|center|right` đổi `text-align` cả cột. A luôn là cột trái, không có center/right.

Heading, đoạn, nút trong A là class Tailwind trên copy mẫu (heading tới ~3.9rem, weight 800, đoạn `text-white/75`, CTA pill viền). B chỉ đặt màu `#f5f7fa` cho cột. Cỡ chữ trên live là style của core block, theme, hoặc WindPress — chưa đo. Đừng gắn scale của copy mẫu lên mọi heading người dùng gõ.

### 4. Thanh bước

A (dòng 96–119): một thanh `rgba(4,12,20,.62)` blur 8px, dính mép trái–phải–đáy, `border-top` 1px. Mỗi bước `flex: 1`, cao tối thiểu 54px, trong suốt, viền trên 2px. Hai dòng: số `0.72rem` tracking `0.18em`, nhãn uppercase `0.82rem` tracking `0.08em`. Bước mở: chữ trắng, nền `rgba(255,255,255,.09)`.

B (`style.css` dòng 136–191): các pill rời, `gap: 0.5rem`, `padding` của thanh `0.75rem`, `border-radius: 999px`, nền kính từng pill. Một dòng nhãn. Bước mở đảo thành nền `#f5f7fa`, chữ `#10233a`.

### 5. Progress

A (dòng 120–123): gạch cao 2px nằm `top: -2px` của nút, full ngang nút, màu `#3ddc84`, fill bằng `scaleX`. B (`style.css` dòng 169–180): gạch cao 2px, `bottom: 0.3rem`, thụt hai bên `0.55rem`, `background: currentColor`. Bước mở chữ thành navy nên gạch cũng navy trên pill trắng.

Cơ chế B đã khóa trong JS: `frontend.ts` dòng 150 ghi `span.style.width` theo phần trăm dwell, chỉ tab đang mở, không chạy khi autoplay paused. Đổi sang `scaleX` là đổi JS. Đổi vị trí và màu của chính span đó thì CSS đủ, vì width đã là phần trăm của containing block. Màu `#3ddc84` là sơn của artifact, chưa có token và chưa có ảnh Slider mẫu (081).

### 6. Play

A: pill `border-radius: 999px`, padding ngang, icon 14px, chữ `0.8rem` weight 700, đọc được. B (`style.css` dòng 229–249): vòng `2.75rem`, chữ `0.8rem` (mobile `0.7rem`) trong vòng. Chữ `Play` đã có trong HTML. Vòng tròn làm chữ không nằm gọn. Việc nút `hidden` đến khi focus dừng autoplay là O09, không phải lỗi hình.

### 7. Mũi tên — vị trí, không chỉ hình

Có hai file artifact. Bản autoplay không có nút mũi tên. Bản manual có, và vị trí khác trang đang chạy. So sánh mũi tên phải dùng `step-slider-prototype-manual.html` dòng 142–161 và 264–269.

| | Artifact manual, desktop | Artifact manual, ≤640px | Trang đang chạy, desktop | Trang đang chạy, ≤640px |
|---|---|---|---|---|
| Chỗ đặt | `top: 50%`, `translateY(-50%)`. Prev `left: 1rem`. Next `right: 1rem`. Giữa hai cạnh | Cả cặp lên góc trên trái. `top: 1rem`, bỏ translate. Prev `left: 0.5rem`. Next `left: 2.85rem`, `right: auto` | Giống desktop artifact: giữa hai cạnh, `left`/`right: 1rem` | Vẫn giữa hai cạnh. Prev `left: 0.5rem`, next `right: 0.5rem`. Không gom lên góc |
| Kích thước | 46×46 px | 36×36 px | 2.75rem | 2.25rem |
| Nét | SVG stroke, 20×20 | cùng SVG | ký tự `‹` `›` trong nút | ký tự, `font-size: 1.25rem` |

Desktop trùng cạnh. Lệch vị trí nằm ở mobile: artifact nhấc cả hai nút lên góc trên trái, trang để chúng giữa mép trái và mép phải. Góc trên phải của bản manual là counter `01/04` (`top: 1rem; right: 1rem`), không phải nút Play.

Slider cùng plugin (`src/slider/style.css` dòng 4–5 và 204–234) dùng vòng `2.75rem` và glyph font `swiper-icons` (`content: "prev"` / `"next"`). Đó là ngôn ngữ nét, không phải vị trí của artifact manual.

## Chỗ đã trùng — không sửa khi sơn

- Rộng `width: 100%`. Không `100vw`, không margin âm. Tab `overflow-x: auto`.
- Tab và mũi tên là anh em của `.swiper`, `position: absolute`, tab `bottom: 0`.
- `min-height: 100svh` trên viewport và bước. Bước cao hơn viewport thì tab ở cuối bước, không `fixed`.
- Progress chỉ cập nhật tab đang mở, sau transition, bằng dwell.
- Print ẩn tab, mũi tên, Play.
- Chưa `.is-ready`: ẩn tab và mũi tên, các bước xếp dọc đọc được (079 F7).
- Số fade/wipe/cascade 800 / 400 / 0 / 100 / 200 / 300.

## A khác C — cấm kéo B về A

| Việc artifact làm | Khóa |
|---|---|
| Mobile ép 4 tab một hàng, nhãn ellipsis | O10: giữ nhãn, thanh cuộn ngang, cuộn không đổi bước |
| Nút tạm dừng hiện suốt, nhãn tiếng Việt | O09: Play chỉ sau focus dừng autoplay. UI plugin tiếng Anh. Nhãn hiện tại `Play` |
| Bản autoplay không có mũi tên | O10 và 081: có mũi tên. Vị trí lấy từ bản manual: desktop giữa hai cạnh; ≤640px cả cặp góc trên trái |
| `speed` và delay cascade của file mẫu | 079 §8. Không lấy số trong prototype |

## Việc agent sau đo, chưa kết luận

1. Trên trang có Step Slider, chọn một bước có ảnh và một bước không ảnh. Ghi `getComputedStyle` của `.skvn-step-slide`, `.skvn-step-slide__overlay`, `.skvn-step-slide__content`, `.skvn-step-slider__tab[aria-current="true"]`, `.skvn-step-slider__tab-progress`. So với mục Paint ở trên. Theme hoặc WindPress có thể đè màu và cỡ heading.
2. Cột `max-width: 46rem` có còn tôn `textPosition` center/right không. Chưa chọn.
3. Gradient nền không ảnh lấy từ đâu. Artifact hard-code bốn màu. Block không có attribute màu bước.
4. Overlay hai hướng thay lớp `rgba` phẳng thì `overlayPreset` light/medium/strong còn nghĩa gì. Chưa chọn.
5. Số `01` thêm bằng markup PHP hay `counter()` CSS. Cả hai đều chưa làm. Không bịa số vào `tabLabel`.
6. Màu progress và nền. Chưa có ảnh Slider mẫu. Không chép `#3ddc84` thành màu sản phẩm trong lượt phân tích.

## 2026-11-17 06:49 | review

Human chọn artifact làm trung tâm soi trang web. Đối chiếu source A/B/C ở trên. Chưa mở trang live, chưa sửa CSS, PHP, JS.

## Vị trí — human 2026-11-17

Human: mũi tên lệch vị trí so với artifact, và còn nhiều lệch vị trí khác. Lượt 06:49 chỉ đọc bản autoplay nên ghi “artifact không có mũi tên”. Câu đó sai khi soi bản manual. Bảng vị trí mũi tên nằm ở mục 7. Các lệch vị trí còn lại, đo từ CSS, chưa đo live:

| Mảnh | Artifact | Trang đang chạy |
|---|---|---|
| Thanh bước | Dính `left: 0; right: 0; bottom: 0`. Không padding ngoài. Mỗi bước một cột `flex: 1` | Cùng `bottom: 0`, nhưng thanh có `padding: 0.75rem` nên pill thụt vào trong và cách đáy |
| Progress | `top: -2px` của nút, full ngang nút, nằm trên mép trên thanh | `bottom: 0.3rem` bên trong pill, thụt `inset-inline: 0.55rem` |
| Cột chữ | `max-width: 46rem`, đẩy trái (`margin-right: auto`). Padding đáy `clamp(6.5rem, 17vh, 9.5rem)` để khỏi đè thanh | Full ngang khối. Padding đáy chỉ cộng `4.5rem`. `text-align` theo `textPosition` |
| Góc trên phải | Autoplay: pill Tạm dừng `top: 1rem; right: 1rem`. Manual: counter `01/04` cùng chỗ | Vòng Play `top: 1rem; right: 1rem`. Không counter |
| Overlay | Anh em của media, luôn phủ. Tối từ trái và từ đáy | Nằm trong media, chỉ khi có ảnh, một lớp phủ kín |
| Mũi tên mobile | Cả cặp góc trên trái, cạnh counter góc phải | Vẫn hai nút giữa hai cạnh |

Chưa có `getBoundingClientRect` trên trang live. Agent browser phải đo hộp mũi tên, thanh tab, progress và cột chữ ở desktop và ở 390px, rồi ghi số vào mục mới. Không kết luận PASS.

## 2026-11-17 11:11 | review

Sửa sót vị trí mũi tên. Không sửa CSS, PHP, JS.

## 2026-11-17 11:34 | review

Human chốt O02-H. Step Slider giữ `min-height: 100svh`, cả khung nhìn, không trừ header. Không thêm option Viewport below header của Slider thường. Đồng bộ header với bước (trừ chiều cao header và admin bar) làm sau khi theme tách khỏi GeneratePress. Không sửa `themes/generatepress/` trong lượt sơn. Thanh tab bị đẩy dưới mép màn vì header chiếm chỗ là hệ quả đã chấp nhận, không phải lỗi paint để sửa ngay.

## 2026-11-17 15:43 | review

Human lưu tín hiệu, không tách code. Đo header để trừ viewport hiện chỉ Slider thường có. Lần thứ hai một task cần tính năng tương tự, agent DỪNG và báo human trước khi copy `syncViewportHeight` hoặc tách `src/shared/`. Tension OPEN: `.context/TENSIONS_OPEN.md` mục 2026-11-17 15:43. Severity high.

---

## 2026-11-17 08:24 | browser

**Trang:** `https://minhhaifishery.com/test-page-2/` (Brave session `mcp-00d913c2`, tab human mở sẵn; trang công khai, admin bar hiện vì human đã login). Không vào wp-admin, không Save/Update/Preview, không gõ nội dung. Trang live đã **đổi nội dung từ lần trước** — giờ slide 2 hiển thị heading tối `Phản hồi khá chậm đôi lúc` + `thấy chưa` (human tự sửa/lưu giữa các phiên).

Lưu ý hiển thị: lúc đầu phiên (desktop) `innerWidth = 1920`; **sau phần mobile human đã resize cửa sổ Brave còn ~780 CSS px** — artifact ở bước 6 được mở ở chiều ngang đó, không phải 1920.

**Block:** 1 slider. Root class: `skvn-step-slider alignfull wp-block-skvn-marine-step-slider is-ready` → **có `.is-ready`**. 4 slide, 4 nút tab, 2 mũi tên, Play 1, progress 4.

**Bước có ảnh:** **không có** — cả 4 bước đều `has-background` vắng, `.skvn-step-slide__media img` vắng, `backgroundImage: none` (ghi điều này thay vì đo "một bước có ảnh"). Object computed đo trên bước 1 (`swiper-slide-prev`):

```
slideBg: rgb(16, 31, 48)   /* = #101f30, đúng B */
slideW: 1985               /* > innerWidth 1920 → tràn ngang; docScrollWidth 1945 */
contentMax: none
contentPad: 81.27px 112px 153.27px
contentAlign: left
overlay: none              /* B không có overlay khi không ảnh — đúng */
headingSize: 35px
headingColor: rgb(8, 47, 73)   /* navy đậm trên nền #101f30 → gần vô hình; rule đè chưa xác định được (theme/WindPress?) — chưa kiểm chứng */
paraColor: rgb(245, 247, 250)  /* #f5f7fa, đúng B */
```

**Thanh tab** (`.skvn-step-slider__tabs`): `display: flex`, `position: absolute`, `bottom: 0`, `backgroundColor: rgba(0,0,0,0)` (trong suốt), `width: 1985` (= slider), `left/right: 0`, `overflowX: auto`, `padding: 12px`, `gap: 8px`, `borderRadius: 0`.
Active tab `[aria-current="true"]` (`Processing`): `borderRadius: 999px`, `backgroundColor: rgb(245,247,250)` (#f5f7fa), `color: rgb(16,35,58)` (#10233a), `fontSize: 17px`, `padding: 7.2px 15.2px`.
Text 4 nút: `["Sourcing","Processing","Step","Step"]` — **chỉ nhãn, không có số `01`**.
Progress tab đang mở (`.skvn-step-slider__tab-progress`): `height: 2px`, `top: 27.97px`, `bottom: 4.8px`, `width: 59.75px` lúc đầu → sau ~2 s (autoplay) `width: 60.125px` (delta ≈ 0.37 px — gần như đứng yên; không kéo thanh; autoplay có thể đang paused hoặc dwell gần hết — chưa kết luận). `backgroundColor: rgb(16,35,58)` (navy trên pill trắng, = `currentColor`).

**Play / mũi tên:** Play `hidden = true`, `display: none`, chữ nhìn thấy không có (0×0, radius 50%, fontSize 12.8px), text nội bộ `Play`. Mũi tên prev/next: text `‹` và `›`, **44×44 px**, `borderRadius: 50%`, `fontSize: 24px`.

**Mobile 390px** (CDP `Emulation.setDeviceMetricsOverride`, DSF 2): 4 nhãn không bị cắt nội bộ (`scrollWidth == clientWidth`: Sourcing 97, Processing 111, Step 64, Step 64) nhưng **thanh tab rộng 435px > viewport 390** → phần trái (`Sourcing`) bị mép viewport che một phần trên ảnh chụp; `overflowX: auto` nhưng **không cuộn được** (0 overflow nội bộ, `scrollLeft` không đổi); `docScrollWidth: 405` (>390, vẫn tràn ngang). Cuộn nhẹ thanh `scrollLeft +40` → bước KHÔNG đổi (active vẫn `Processing`), trả về 0. Trang tự nó cao hơn viewport do admin bar.

**Artifact** (mở local qua static server `http://localhost:8899/step-slider-prototype.html` — đã tắt server và đóng tab sau khi chụp; CDN Tailwind load được, Swiper không confirm loaded lúc check (`window.Swiper` undefined) nhưng chrome vẫn render): nền **gradient teal/navy đậm** (radial, không phải #101f30 phẳng); kicker `BƯỚC 01 — THU MUA`; heading trắng ~3,9rem nặng; paragraph trắng mờ; CTA pill viền; **Play pill hiện suốt** (`Tạm dừng`) góc trên phải; thanh bước **liền một khối đáy**, hai dòng (`01 THU MUA` … `02 SƠ CHẾ` … `03 KIỂM ĐỊNH` … `04 PHÂN PHỐI`), tab mở chữ trắng, progress **xanh lá #3ddc84** (scaleX); **không có mũi tên**.

**Một câu so khớp A/B (theo Paint 1–7):** live khớp các khóa B đã ghi (nền `#101f30`, full-width, tab pill không số, progress navy bottom, Play ẩn, mũi tên ‹ › 44px, không Swiper ảnh) nhưng **lệch A ở toàn bộ 7 mục Paint** — nền phẳng vs gradient, không overlay/gradient hai hướng, không cột `46rem`, thanh pill rời vs liền khối + không số bước, progress navy thay #3ddc84 và nằm bottom thay top, Play ẩn thay "Tạm dừng" suốt, artifact không mũi tên còn live có — đồng thời **phát hiện ngoài premise**: heading live render màu `rgb(8,47,73)` trên nền navy (gần vô hình, có thể là theme/WindPress đè — chưa kiểm chứng rule nào), và **slider/thanh tab tràn ngang viewport** (desktop 1985 > 1920; mobile 435 > 390). Không kết luận PASS, không chọn màu, không đề xuất sửa.

**Ảnh đã chụp** (đều nằm ngoài repo, không nhúng): `step-slider-desktop-live.png` (desktop live 1920), `step-slider-desktop-after-clear.png` (sau khi human resize còn ~780), `step-slider-mobile-tabs.png` (cuộn đáy trang), `step-slider-mobile-tabbar.png` (thanh tab @390), `step-slider-artifact.png` (artifact @ ~780).

---

## 2026-11-17 16:26 | slider

**Yêu cầu human:** ảnh Step Slide nên có một bao ngoài như Slider, và người dùng chọn được focus point. Chỉ đọc source + ghi nhận; không sửa gì. Plan 079 (cũ) cấm Inspector cho focal — **khóa cũ**, giữ nguyên, human 2026-11-17 chỉ muốn điều tra hướng bao ngoài + focus point, chưa lệnh code.

**Cây Slider (frontend — save.tsx + CSS):**

```
.skvn-slide.swiper-slide.skvn-slide--has-background  ← wrapper, style inline: --skvn-slide-bg-pos-x/y (+ fill styles)
  .skvn-slide__media                                 ← absolute inset 0, overflow hidden
    .skvn-slide__bg                                  ← absolute inset var(--skvn-parallax-inset, 0%); transform-origin: var(--skvn-slide-bg-pos-x/y, 50%); z-index 1; parallax: will-change khi .skvn-slider--parallax
      img.skvn-slide__background-image               ← cover, object-position: var(--skvn-slide-bg-pos-x/y, 50%)
    span.skvn-slide__overlay                         ← absolute inset 0, SAU bg → đè ảnh
  .skvn-slide__content
```

(Ngoài ra còn biến thể `.skvn-slide__plate` — lớp blur `filter: blur(var(--skvn-parallax-blur))` + `transform: scale(var(--skvn-parallax-plate-scale))` cho parallax/plate, cùng đọc biến focal.)

- **Focal lưu ở attribute `backgroundImageFocalPoint`** (object `{x,y}` 0–1), default `{x:0.5,y:0.5}` ở cả `slide/block.json` và `step-slide/block.json`. Save/edit đều ghi `--skvn-slide-bg-pos-x` / `--skvn-slide-bg-pos-y` inline trên **wrapper** qua `focalPointToWrapperStyle()` (`src/slide/focal.ts`); PHP render của step cũng normalize và ghi đúng hai biến đó lên wrapper (`step-slider-render.php` dòng 85–91).
- **Biến CSS ăn `object-position`:** `--skvn-slide-bg-pos-x`, `--skvn-slide-bg-pos-y` — đọc bởi `.skvn-slide__background-image`, `.skvn-slide__bg img`, `.skvn-slide__plate img`, `transform-origin` của `.skvn-slide__bg`, và `.skvn-step-slide__image`. Fallback `50%/50%` nếu thiếu.
- Inspector Slider có `FocalPointPicker` + nút Reset to center + nhãn `Position: %s` (`slide/edit.tsx` dòng 367–410), kèm `DEFAULT_FOCAL_POINT = {0.5, 0.5}`, `normalizeFocalPoint` clamp/làm tròn.

**Cây Step (save.tsx + PHP render + CSS):**

```
.skvn-step-slide.swiper-slide.skvn-step-slide--has-background  ← wrapper; PHP ghi style inline --skvn-slide-bg-pos-x/y khi có ảnh
  .skvn-step-slide__media                                      ← absolute inset 0, overflow hidden
    img.skvn-step-slide__image                                 ← cover, object-position: var(--skvn-slide-bg-pos-x/y, 50%)   ← img là CON TRỰC TIẾP của media
    span.skvn-step-slide__overlay.is-overlay-{light|medium|strong}  ← absolute inset 0, SAU img → đè ảnh
  .skvn-step-slide__content
```

- **Step thiếu đúng một lớp bao ảnh** so với Slider: không có `.skvn-step-slide__bg` (tương đương `.skvn-slide__bg`). Ảnh là con trực tiếp của `.skvn-step-slide__media` — xác nhận cả ba đường: `step-slide/save.tsx`, `step-slider-render.php` dòng 107–124 (PHP render trên frontend), `step-slide/edit.tsx`.
- **Overlay không bị kẹp trong ảnh**: ảnh và overlay là anh em trong `.skvn-step-slide__media`; overlay `inset: 0` phủ kín kể cả khi ảnh "bleed" ngoài crop. Nền phẳng `#101f30` nằm trên `.skvn-step-slide` — không phụ thuộc ảnh.
- Frontend frontend.ts chỉ set width progress — không tham gia cây ảnh.

**Focal của Step — đã nối đến đâu:**

| Mắt xích | Trạng thái |
|---|---|
| Attribute `backgroundImageFocalPoint` (block.json) | Có, default `{0.5, 0.5}` |
| Editor canvas — `edit.tsx` áp `focalStyle` lên wrapper | Có (nhưng không có UI chọn) |
| Static markup — `save.tsx` áp `focalStyle` lên wrapper | Có |
| PHP render frontend — normalize + ghi `--skvn-slide-bg-pos-x/y` lên wrapper | Có |
| CSS `.skvn-step-slide__image` `object-position: var(...)` | Có |
| `FocalPointPicker` trong editor Step | **KHÔNG có** (không Control/Inspector nào cho focal trong `step-slide/edit.tsx`; `FocalPointPicker` chỉ xuất hiện ở `slide/edit.tsx` + `apply-background-modal.tsx`) |
| Mặc định khi user chưa chọn | `{0.5, 0.5}` (center) — cả block.json default lẫn `normalizeFocalPoint` fallback |

**Bao ngoài có việc gì mà ảnh trần không làm:** trong source này, bao `.skvn-slide__bg` tồn tại để (a) **chịu transform riêng cho ảnh** — parallax inset + `transform-origin: var(--skvn-slide-bg-pos-*)` + `will-change`, tách zoom/scale khỏi overlay và content; (b) **plate blur** + counter-scale (`--skvn-parallax-*`); (c) giữ `overflow: hidden` của media làm clip cho lớp đó. Còn `cover` + `object-position` + focal: **ảnh trần làm được** — CSS `.skvn-step-slide__image` đã `object-fit: cover; object-position: var(--skvn-slide-bg-pos-*)` và biến đọc từ wrapper (PHP ghi khi có ảnh). Overlay không cần bao.

**Một câu:** dựa trên source, bao ngoài **không bắt buộc cho cover/focus point/overlay** (Step đã nối đủ attribute → wrapper var → object-position, chỉ thiếu UI chọn); bao chỉ cần nếu human muốn Step có **parallax/scale-riêng-ảnh như Slider** — đó là quyết định thiết kế cho human, chưa lệnh code, không đề xuất patch.

**Không đụng:** `100svh`, header, GeneratePress, autoplay, tab, mũi tên — không đọc, không sửa.

## 2026-11-17 23:29 | brave

**Yêu cầu human:** xác nhận 5 câu dưới đây chỉ bằng artifact (không phải trang live), ghi mục mới; không sửa các mục cũ; không kết luận PASS; không đề xuất human nên chọn phương án nào.

**URL đã mở** (browse chặn `file://` — báo lỗi "agents can't open browser-internal pages, other extensions, DevTools or local files"; artifact được phục vụ qua static server node tạm `C:\Users\VPF-Champion\AppData\Local\Temp\opencode\serve-artifacts.js`, port `8899`; server đã tắt và script đã xoá sau khi chụp xong; repo không bị sửa):

- Bản tự chạy (autoplay): `http://127.0.0.1:8899/step-slider-prototype.html`
- Bản manual: `http://127.0.0.1:8899/step-slider-prototype-manual.html`

CDN: Tailwind và Swiper 11.2.10 tải được ở cả hai bản (`window.tailwind` = object, `window.Swiper` = function, `#stepSlider` có class `is-initialized`). Không có lỗi CDN. Bản tự chạy tự đổi slide trong lúc chụp (ảnh desktop cho thấy bước 02 nền teal; ảnh 390 cho thấy bước 03 nền amber).

**Chiều ngang đã dùng:** desktop emulate 1280×800 — bề ngang layout thực ~1265px (thanh cuộn dọc chiếm ~15px; ảnh chụp rộng 1265px; `innerWidth` vẫn báo 1280). Hẹp emulate 390×844 — layout thực ~375px (ảnh chụp rộng 375px; `innerWidth` vẫn báo 390; rect của section/bar `left=0, width=375`).

**Năm câu xác nhận:**

1. **Thanh bước (cả hai bản) — Khớp.** Một dải liền sát đáy (desktop: rect `top=730.5 → bottom=800`, cao ~69.5px; 390: rect `top≈784 → bottom=844`, cao ~60px), 4 cột bằng nhau (desktop 316.3px ×4; 390: 93.8px ×4), hai dòng (số `01`–`04` ở trên, nhãn viết hoa ở dưới: THU MUA / SƠ CHẾ / KIỂM ĐỊNH / PHÂN PHỐI) — dải flex liền, không phải các pill rời; nền tối bán trong suốt + blur, viền trên 1px.
2. **Mũi tên @390, bản manual — Khớp; desktop bản manual — Khớp.** @390: prev rect `left=8, top=16, 36×36`; next rect `left=45.6, top=16` — cả hai lên góc trên-trái, nằm cạnh counter `01 / 04` bên phải (counter rect `left=274`); không còn một nút giữa mép trái và một nút giữa mép phải. Desktop: prev `left=16 → right=62`, next `left=1203 → right=1249`, cả hai `top=377 → bottom=423`, tâm dọc `400 = vh/2` — hai nút giữa hai cạnh (trái/phải) đúng như mô tả.
3. **Nét mũi tên, bản manual — Khớp.** `prev.innerHTML` = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M15 5l-7 7 7 7"></path></svg>` (chevron trái); `next` = path `M9 5l7 7-7 7` (chevron phải); `textContent` của hai nút rỗng — không phải ký tự ‹ › và không dùng class `.swiper-button-prev/next` hay font swiper-icons (query `.swiper-button-prev, .swiper-button-next` trả về null).
4. **Cột chữ, cả hai bản — Khớp.** `.step-slide__content` `max-width: 736px` (46rem); desktop: rect `right=736` trên bề ngang ~1265 — cột hẹp bên trái, không trải hết chiều ngang khối; không có nút chuyển trái/giữa/phải ở bất kỳ bản nào (buttons: bản autoplay = 4 tab `01..04` + `Tạm dừng`; bản manual = 4 tab + 2 nút SVG rỗng). Ở 390 cột rộng theo padding (375px) và CTA chuyển full-width theo media query ≤640px (thấy ở cả hai ảnh 390: CTA giãn ngang, chữ căn giữa) — đặc điểm của bản hẹp, không phải cột chữ trải hết ở desktop.
5. **Nền khi không ảnh + lớp phủ — Khớp, kèm lưu ý noise.** Nền là 4 radial-gradient khác nhau từng bước (computed: ph-1 teal `rgb(42,127,158)→rgb(15,66,102)→rgb(7,28,51)`, ph-2 green-teal `rgb(47,143,131)…`, ph-3 amber `rgb(185,122,42)…`, ph-4 indigo `rgb(91,91,214)…`). Lớp phủ = 2 linear-gradient chồng (trục dọc 0deg: tối từ đáy 60%→0 ở 26%; trục ngang 90deg: `rgba(4,12,20,.84) → .42 → 0` ở 70%) — tối từ trái và từ đáy, không phải một màu rgba phủ kín. `::after` mang data-URI SVG `feTurbulence` (`baseFrequency 0.9`, `numOctaves 2`, opacity .35, blend `overlay`) — lớp noise có mặt trong computed style nhưng ở ảnh chụp 1x gần như không phân biệt được vân (nền trông mịn); không khẳng định "nhìn thấy vân rõ" trên màn. **Màu progress ghi nhận (theo yêu cầu, không đề xuất lấy làm màu sản phẩm):** `--ss-progress: #3ddc84`; ở bản autoplay @390 thấy vạch xanh lá trên tab active `03` (`scaleX(0.533)` lúc chụp). Bản manual không có thanh progress (0 phần tử `.step-tab__progress` — vị trí đó là counter `01 / 04` góc trên-phải).

**Ảnh đã chụp** (lưu ngoài repo tại `C:\Users\VPF-Champion\AppData\Local\Temp\opencode\`, không nhúng):

- `step-slider-autoplay-desktop-1280.png` (1265×800, bước 02)
- `step-slider-manual-desktop-1280.png` (1265×800)
- `step-slider-autoplay-390.png` (375×844, bước 03)
- `step-slider-manual-390.png` (375×844)
- `step-slider-autoplay-noise-zoom.png`, `step-slider-manual-noise-zoom.png` (clip 520×340, vùng nền trống)
- `step-slider-autoplay-noise-zoom2x.png` (clip 260×170 chụp lúc slider tự chuyển sang nền bước 03 rất tối; deviceScaleFactor = 1 nên không phóng to thật)

**Ràng buộc tuân thủ:** không sửa CSS/JS/PHP; không sửa các mục cũ trong file này; không mở wp-admin; không kết luận PASS cho artifact nào; không khuyến nghị lựa chọn phương án.

## 2026-11-18 07:49 | review

Human: chọn artifact cho năm chỗ sơn. Brave 23:29 đã xác nhận mặt mẫu. Đây là lệnh chọn, chưa phải lệnh code.

Sơn: thanh liền sát đáy với số và nhãn; mũi tên desktop giữa hai cạnh, ≤640px cả cặp góc trên trái; nét là chevron SVG; cột chữ `46rem` đẩy trái; không ảnh thì gradient riêng từng bước và phủ tối từ trái, từ đáy.

Giữ ngoài lựa chọn này: O02-H `100svh`; O09 Play tiếng Anh và ẩn đến khi focus; O10 cuộn ngang khi nhãn không vừa, cuộn không đổi bước; không counter `01/04`. `textPosition` và `overlayPreset` còn trong schema, mặt vẽ lượt này không dùng chúng.

## 2026-11-18 15:03 | review

Human: trích gradient artifact làm nền gradient gốc của plugin. Thêm overlay và không có màu nền, theo Slider. Ghi vào pattern đang dùng lại.

Bốn nền gốc, từ `step-slider-prototype.html` dòng 54–61:

- `radial-gradient(110% 80% at 18% 8%, #2a7f9e 0%, #0f4266 42%, #071c33 100%)`
- `radial-gradient(110% 80% at 82% 12%, #2f8f83 0%, #14524b 46%, #0a2422 100%)`
- `radial-gradient(110% 80% at 20% 85%, #b97a2a 0%, #5c3a17 45%, #1d130a 100%)`
- `radial-gradient(110% 80% at 80% 88%, #5b5bd6 0%, #2c2c6e 48%, #101024 100%)`

Overlay gốc, cùng file dòng 68–71: tối từ đáy `linear-gradient(0deg, rgba(4,12,20,.60) 0%, rgba(4,12,20,0) 26%)` và tối từ trái `linear-gradient(90deg, rgba(4,12,20,.84) 0%, rgba(4,12,20,.42) 44%, rgba(4,12,20,0) 70%)`.

Slider đã có `backgroundFillMode`: `default`, `custom`, `transparent`. `transparent` là không có lớp nền. Step dùng lại ba mức đó. `default` trỏ vào bốn gradient trên, không phải navy một màu. `overlayOpacity` dùng lại để chỉnh độ phủ. Chi tiết nằm ở tension 2026-11-18 14:48 và plan 081.

Chưa code.

## 2026-11-18 14:48 | review

Human: những gì Step Slider dùng lại từ Slider thì ghi lại. Lần dùng lại tiếp theo phải tách, không copy thêm.

Đang dùng chung, chưa tách khỏi nhà Slider:

- `src/slide/focal.ts` — Slide và Step Slide cùng import.
- `skvn_marine_blocks_normalize_slide_background_focal_point()` — định nghĩa trong slider-render, Step gọi.
- Biến `--skvn-slide-bg-pos-x` / `--skvn-slide-bg-pos-y` — rule lặp ở `slider/style.css` và `step-slider/style.css`.
- `FocalPointPicker` — UI đang ở Slide. Step Slide sẽ là bản thứ hai khi làm O03.

Block thứ ba cần một trong các mảnh trên: tách mảnh đó vào `src/shared/` hoặc một hàm PHP một chỗ, trong cùng task. Tension OPEN `.context/TENSIONS_OPEN.md` 2026-11-18 14:48.

## 2026-11-18 14:47 | review

Human bảo quyết chiều cao và focus point. Khuyến nghị đã ghi thành O02-C và O03.

Chiều cao: hai mức. `viewport` mặc định, `min-height: 100svh`. `content` cao theo nội dung, vẫn nở khi chữ dài, không cuộn trong khối. Không Medium, Tall, pixel, hay Viewport below header.

Focus: thêm `FocalPointPicker`, dùng attribute và `src/slide/focal.ts` sẵn có, mặc định `{ x: 0.5, y: 0.5 }`. Không thêm `.skvn-step-slide__bg`. Bao cover là `.skvn-step-slide__media`. Lớp `__bg` của Slider chỉ phục vụ parallax, Step Slider không có parallax.

Chưa code.

## 2026-11-18 13:36 | review

Human chốt màu. Bốn palette cố định lấy từ bốn nền artifact. Màu progress và màu nền không ảnh chỉnh bằng hex, vì mỗi trang một palette. Palette đủ để dùng, hex không bắt buộc. Bước 5–8 dùng palette hoặc hex đã chọn, không thêm palette thứ năm. `#3ddc84` không phải màu progress duy nhất. Ngoại lệ cho quy tắc cấm hex thô, chỉ hai màu này của Step Slider. Chưa code.

## 2026-11-19 00:10 | đo live sau 081

Trang: `https://minhhaifishery.com/test-page-2/`. Viewport 1920, `clientWidth` 1905. Hai block `.skvn-step-slider.alignfull.is-ready`. Không PASS.

Những câu trong các mục 2026-11-17 về mặt đang chạy **đã cũ**, không dùng làm việc sửa:

- Nền không còn `#101f30` phẳng. Slider không ảnh đang mở đúng radial đầu của artifact (`18% 8%`, `#2a7f9e` → `#0f4266` → `#071c33`).
- Overlay hai lớp đúng công thức artifact, phủ cả slide.
- Cột chữ `736px` (`46rem`). Đoạn văn `rgb(245, 247, 250)`.
- Tab có `01` và nhãn (`Sourcing`, `Processing`, `IQF freezing`, `Export & QC`). Progress cao 2px, dính `top: 0`, màu `rgb(126, 200, 227)` tức `#7ec8e3`.
- Mũi tên desktop là vòng 46px, `top: 50%`, lệch 1rem khỏi hai cạnh của **khối slider**.

Việc còn sai:

1. Slider rộng 1985px, `x = -40`, `margin-left -40px`, `margin-right 0`, `scrollWidth` 1945. Rule thắng là inline GeneratePress `body:not(.no-sidebar) .entry-content .alignfull` (`width: calc(100% + 80px)`). Theme `.skvn-full-width-canvas .entry-content .alignfull` (`width: 100%`, margin 0) thua specificity. Prev arrow `x = -24`. Next chỉ còn khoảng 22px trong viewport. Tab đầu bị cắt. Đây là GEO-01, không phải thiếu trừ header.
2. Heading `h2.wp-block-heading` màu `rgb(8, 47, 73)`, 35px, weight 400, trên cả bốn bước. Ảnh “Frozen piece by piece” gần không đọc được tiêu đề, đoạn dưới vẫn trắng. Rule thắng: `body:not(.wp-admin) h2` → `var(--skvn-heading-color)`.

Không phải lỗi so với khóa hiện tại: Play đang `hidden` và ghi `Play`. `#3ddc84` không phải màu progress phải trả lại. Chiều cao `100svh` vẫn theo O02-H.

Cách sửa nằm ở plan 083 §14. Chưa code.
