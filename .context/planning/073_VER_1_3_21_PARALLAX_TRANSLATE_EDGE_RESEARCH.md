# V1 / 1.3.21 — Research: Translate only nhìn đỡ gắt hơn

2026-11-13. Human hỏi có cách chuyển đẹp hơn sau plan 072 (Translate only không zoom, mép lộ fill). **Chỉ research. Chưa sửa runtime.**

## 1. Vì sao dải fill xuất hiện

`.skvn-slide` và `.skvn-slide__media` đều `overflow: hidden`. Ảnh cover đúng khung slide. Swiper 11.2.10 (`node_modules/swiper/modules/parallax.mjs`) dịch `.skvn-slide__bg` bằng `%` của chính element đó:

```text
translate = (data-swiper-parallax-x) * progress
```

Translate only không ghi `data-swiper-parallax-scale`, nên scale giữ 1. Ảnh trượt ra khỏi khung, phần trống là fill của slide (và overlay nếu opacity > 0). Fade làm dải này nằm trên cả khung, dễ thấy hơn slide effect.

Không có pixel dư trên trục dịch thì chỉ còn ba lối: zoom ảnh đang xem, lộ fill, hoặc che chỗ trống bằng lớp khác.

## 2. Artifact không phải lối thoát

`docs/artifacts/slider-parallax-swiper-poc.html` làm hai việc production chưa làm:

- Nền `data-swiper-parallax="-30%"`, chữ khoảng `-10%` / `-8%`. Depth là hai lớp khác tốc độ.
- CSS `.skvn-slide__bg { inset: 0 -15%; }` cộng `object-fit: cover`.

Inset đó phóng ảnh lúc đứng yên. Khung nền rộng 130% slide, cover tính trên khung lớn, cửa sổ giữa đã crop chặt hơn focal editor. Đó là DP-08.

Bleed cũng không đủ cho `-30%`. Mỗi bên chỉ dư 15% bề rộng slide. `-30%` là 30% của element rộng 130%, tức khoảng 39% bề rộng slide. Ở giữa nhịp, quãng dịch đã lớn hơn bleed. POC đỡ gắt vì overlay tối, không phải vì mép được che hết.

`docs/decisions/slider-parallax-both-1.3.8.md` đã chốt parallax chỉ trên `.skvn-slide__bg`, không trên content. Artifact khác quyết định đó.

## 3. Phương án

| | Việc làm | Ảnh đứng yên | Lúc chuyển | Giá |
|---|---|---|---|---|
| **A — Giữ 072** | Translate only, không scale | Khớp focal | Dải fill cứng | Đúng control. Nhìn gắt khi fill khác ảnh. |
| **B — Both / preset** | Sàn `S >= 1 + 2T/100` đã có | Khớp focal | Zoom rồi về 1, không dải | Đẹp hơn nếu chấp nhận zoom. Translate 30% = scale 1.60. Translate 10% chỉ còn scale 1.20. |
| **C — Pan trong phần cover đã cắt** | Đo phần ảnh bị `object-fit: cover` cắt bỏ trên trục dịch. `object-position` chỉ chạy trong phần đó. | Khớp focal | Không zoom, không dải, quãng dịch bị trần bởi ảnh | Ảnh cùng tỉ lệ khung thì phần dư ~ 0, gần như không trượt. |
| **D — Lớp mờ phía sau** | Giữ ảnh nét scale 1 và translate. Thêm cùng URL, phóng và `blur`, nằm dưới, không nhận parallax. | Ảnh nét che hết lớp mờ, focal không đổi | Chỗ trống là tiếp màu của chính ảnh, bị mờ | Thêm một node ảnh trong render editor + PHP. `filter: blur` trên hero tốn paint. WebP trong suốt vẫn lộ fill ở pixel trong suốt. |
| **E — Inset như POC** | Trả `--skvn-parallax-inset` âm | Zoom sẵn, lệch focal | Có thể vẫn hở nếu bleed < quãng dịch | Đụng DP-08. Không khuyến nghị. |
| **F — Mask mép** | Gradient trong suốt ở biên ảnh | Khớp focal | Dải fill thành fade, không phải nét cắt | Vẫn thấy màu fill. Không thêm depth. |

### Khuyến nghị

Muốn **không zoom và không dải màu phẳng**: **D**. Ảnh đang xem không đổi kích thước; chỗ hở không còn là `#073b5a` đặc.

Muốn **không thêm DOM**: hạ Translate xuống khoảng 10% và dùng **Both** (scale sàn 1.20). Zoom nhẹ, không dải. Preset medium 1.60 là mức đang thấy quá mạnh.

**C** chỉ đẹp khi ảnh dư pixel trên trục ngang hoặc dọc. Không làm mặc định cho Hero 16:9.

**E** loại. **F** chỉ là làm dịu A, không đáng một plan riêng nếu đã làm D.

Depth hai lớp của artifact (chữ chậm hơn nền) là việc khác. Nó không bịt mép. Chưa nằm trong khuyến nghị này; decision 1.3.8 đang cấm parallax trên content.

## 4. Nếu sau này làm D

- Chỉ khi parallax bật và depth có translate. Reduced motion và `slidesPerView > 1` không render lớp mờ.
- Lớp mờ: cùng `src`, `alt=""`, `aria-hidden`, `object-fit: cover`, scale cố định đủ che translate tối đa của preset (strong 50% → khoảng 2), `filter: blur(...)`. Không animate.
- Lớp nét: giữ plan 072 khi Translate only (không scale). Both vẫn có thể giữ sàn zoom; khi đó lớp mờ ít khi lộ.
- Editor không chạy Swiper. Không cần mô phỏng. Ảnh nét vẫn là preview focal.
- Không đọc inset âm trở lại.

Artifact so A và D: `docs/artifacts/slider-parallax-translate-blur-plate.html`. Swiper 11.2.10, fade mặc định, translate 30%. Ảnh nét không scale. Lớp mờ scale `1 + 2T/100 + 0.12`, blur khởi điểm 24px, không gắn parallax. Mở file và bấm Next. Số blur/scale trên ảnh Hero thật vẫn chưa chốt.

## 5. Quyết định

1. Vấn đề: Translate only không zoom nhưng lộ dải fill.
2. Phương án: A giữ; B zoom sàn nhỏ hơn; C pan phần dư; D lớp mờ sau; E inset; F mask.
3. Khuyến nghị khi được lệnh làm: **D**. B là lối không thêm markup nếu human chấp nhận zoom nhẹ.
4. Bằng chứng: `parallax.mjs` dòng 36–53 (Swiper 11.2.10); `style.css` `.skvn-slide__bg` inset 0 và `object-fit: cover`; POC `inset: 0 -15%` với attr `-30%`; plan 070/072; DP-08.
5. Tự kiểm: Translate only 30%, fade, nhìn mép trong lúc chuyển. Đo không cần: dải là fill vì ảnh đã trượt khỏi khung cắt.
6. Đảo ngược: D thêm một thẻ ảnh, gỡ được. E làm hỏng focal đã chỉnh.
7. Chưa lệnh làm thì không sửa `view.ts`, PHP, CSS.

**Status:** RESEARCH 2026-11-13. Human 2026-11-13 lệnh thêm thông số blur. Source: attr `parallaxBlur` 0–48, mặc định 0 (tắt). Lớp mờ do `view.ts` gắn khi có translate. Chưa đo blur trên ảnh Hero thật.
