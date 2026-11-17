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
