# V1 / 1.3.21 — Parallax không zoom ảnh lúc đứng yên

2026-11-13. Human test focal: bật parallax thì ảnh phóng to trước khi slide chuyển, điểm neo editor lệch frontend. Pitfall [DP-08](../PITFALLS.md). **Planning only** — chưa sửa tới lệnh **Tiến hành**.

## 1. Vấn đề

Intensity medium (mặc định) gắn `--skvn-parallax-inset:-35%` ngay frame đầu. `.skvn-slide__bg` thành khung 170%. `object-fit: cover` phủ khung đó, `.skvn-slide__media` cắt lại. Ảnh đang xem đã gần 1,7 lần trước khi có chuyển động.

`data-swiper-parallax-scale` medium `1.12` không gây zoom này. Swiper **11.2.10** (`node_modules/swiper/modules/parallax.mjs`):

```text
currentScale = scale - (scale - 1) * (1 - abs(progress))
```

Slide đang xem có `progress` 0 nên `scale(1)`.

Editor không gắn inset. FocalPointPicker canh crop khung 100%. Frontend parallax dùng khung 170%. Cùng `object-position`, cửa sổ khác. HSF-TECH-01 fail vì chỗ này.

Inset là edge-guard của `docs/decisions/slider-parallax-both-1.3.8.md`: translate là `%` của chính `.skvn-slide__bg`. Khung 170% làm `-30%` thành khoảng 51% bề rộng slide, trong khi phần dư mỗi bên chỉ 35% bề rộng slide. Guard vừa zoom ảnh đứng yên vừa vẫn hụt mép ở cuối nhịp.

## 2. Mục tiêu

- Bật parallax: khung ảnh lúc đứng yên bằng lúc tắt. Focal editor khớp frontend trước khi kéo slide.
- Trong lúc chuyển slide, mép không lộ màu fill.
- Không đổi attr focal, overlay, fill, hay contrast 044.

## 3. Phương án

| Phương án | Việc làm | Trade-off |
|---|---|---|
| **A — Editor copy inset** | Preview editor gắn cùng `--skvn-parallax-inset` | Focal khớp, ảnh vẫn zoom lúc đứng yên. Không đúng lỗi human thấy. |
| **B — Bỏ inset đứng yên; scale che translate (khuyến nghị)** | Inset runtime = 0. Scale lúc `|progress| = 1` đủ che quãng dịch. `transform-origin` = focal. | Ảnh đứng yên không zoom. Nhịp chuyển zoom mạnh hơn 1.12 vì chính scale đó che mép. |
| **C — Giữ scale 1.12, giảm translate** | Translate tối đa khoảng 6% để `(1.12 - 1) / 2` che hết | Ảnh đứng yên không zoom, nhưng parallax gần như không thấy. |

### Vì sao B

`translate` là `%` của element đang transform. Inset 0 thì element = khung slide. Ở progress `p`, Swiper đặt:

```text
translate = p * T
scale     = 1 + (S - 1) * abs(p)
```

Phần scale dư mỗi bên là `(S - 1) / 2`. Muốn không hở mép ở mọi `p`:

```text
S >= 1 + 2 * (T / 100)
```

Preset giữ nguyên quãng dịch, đổi scale và bỏ inset:

| Preset | Translate (giữ) | Scale mới | Inset |
|---|---|---|---|
| subtle | 15% | 1.30 | 0 |
| medium | 30% | 1.60 | 0 |
| strong | 50% | 2.00 | 0 |

Scale hiện bị kẹp tối đa **1.50** ở `view.ts`, `slider-render.php` và RangeControl Advanced. Strong cần 2.00, nên trần nâng lên **2.00**.

`transform-origin` của `.skvn-slide__bg` lấy `--skvn-slide-bg-pos-x/y` (focal, fallback 50% 50%). Swiper ghi `transform` inline, không ghi `transform-origin`. Lúc đứng yên scale là 1 nên origin không đổi crop.

## 4. Advanced

- **Edge guard (inset)** bỏ khỏi Inspector. Attr `parallaxInset` giữ trong saved content, runtime không dùng. Tránh slider cũ mất block.
- Depth **both**: scale runtime = `max(scale đang chọn, 1 + 2 * translate / 100)`.
- Depth **translate**: plan [072](072_VER_1_3_21_PARALLAX_TRANSLATE_ONLY_PLAN.md) thay câu dưới. Không gắn scale. Mé có thể lộ fill. Không trả inset.
- Depth **scale**: không dịch, không cần sàn. Dùng đúng scale user chọn.
- Help của Scale nói rõ: giá trị dưới sàn bị nâng để mép không hở. Help Intensity: ảnh đứng yên không phóng; zoom chỉ trong lúc chuyển slide.

## 5. Ngoài phạm vi

- Không đổi overlay, fill, focal attr.
- Không đụng zoom-out của `.skvn-slide__media` (`scale(1.08)` trên slide không active). Đó là transform khác, đã tách trong quyết định 1.3.8.
- `prefers-reduced-motion` và `slidesPerView > 1` vẫn tắt parallax như hiện tại.
- Editor vẫn không chạy Swiper. Vì inset đứng yên là 0, preview editor khớp ảnh đứng yên mà không cần mô phỏng parallax.

## 6. Việc sửa khi được lệnh

1. `modules/slider-render/slider-render.php` — không phát `--skvn-parallax-inset` âm.
2. `src/slider/view.ts` — preset scale mới; sàn scale theo translate; không ghi inset fallback; trần 2.00.
3. `src/slider/style.css` — `transform-origin` trên `.skvn-slide__bg` từ biến focal.
4. `src/slider/edit.tsx` — bỏ control Edge guard; trần Scale 2.00; help Intensity và Scale.
5. `docs/decisions/slider-parallax-both-1.3.8.md` — revision: inset không còn là edge-guard. Cùng đợt sửa, không để decision cũ dẫn agent sau.
6. DP-08 ghi `Fixed` chỉ sau khi human xác nhận ảnh đứng yên không zoom.

Runbook: `docs/testing/slider-parallax-rest-crop-1.3.21.md`.

## 7. Acceptance

| ID | Mong đợi |
|---|---|
| PRC-01 | Parallax tắt và bật, cùng slide, chưa kéo: rect `.skvn-slide__bg` khớp `.skvn-slide__media`. Không có inset âm. |
| PRC-02 | Focal chỉnh ở editor trùng vùng nhìn frontend lúc đứng yên, parallax medium bật. |
| PRC-03 | Kéo sang slide kế, medium: không thấy dải fill ở mép ảnh. |
| PRC-04 | Subtle / strong cùng quy tắc. Strong scale tới 2.00, không bị kẹp 1.50. |
| PRC-05 | Advanced translate 30%, scale 1.12: runtime nâng scale lên 1.60. Scale-only không bị nâng. |
| PRC-06 | `prefers-reduced-motion` và slider nhiều slide/view: không parallax, không inset. |

## 8. Quyết định

1. Vấn đề: bật parallax phóng ảnh lúc đứng yên và làm focal editor lệch frontend.
2. Phương án: A editor copy inset; B bỏ inset, scale che translate; C giữ scale cũ và rút translate.
3. Khuyến nghị: **B**. A không hết zoom. C làm parallax gần mất.
4. Bằng chứng: DP-08; `slider-render.php` inset medium `-35%`; Swiper 11.2.10 `parallax.mjs` progress 0 ra scale 1; công thức sàn `S >= 1 + 2T/100`.
5. Tự kiểm: bật parallax medium, đo `getBoundingClientRect()` của `.skvn-slide__bg` và `.skvn-slide__media` trước khi kéo slide. Hôm nay bg lớn hơn media.
6. Đảo ngược: trả inset preset là một commit CSS/PHP. Slider đã lưu không cần migration attr.
7. Chưa lệnh **Tiến hành** thì không sửa runtime.

**Status:** SOURCE 2026-11-13 — chờ human PRC-01–06. Chưa đánh Fixed ở DP-08.
