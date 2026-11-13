# V1 / 1.3.21 — Translate only không zoom lúc chuyển slide

2026-11-13. Human: bật **Translate only** rồi chuyển slide, ảnh vẫn zoom. Phân tích cùng ngày: nhánh `translate` vẫn ghi `data-swiper-parallax-scale` bằng sàn che mép của plan 070. Lệnh: lập plan rồi sửa.

## 1. Vấn đề

Plan 070 bỏ inset âm để ảnh đứng yên không phóng. Sàn `S >= 1 + 2 × (T / 100)` che mép trong lúc chuyển. `view.ts` áp sàn cho mọi depth có translate, kể cả **Translate only**.

Translate 30% → scale **1.60**. Swiper 11 để `progress` 0 ở scale 1, rồi nâng scale theo `|progress|`. Control Scale bị ẩn ở Translate only, nên không tắt được lớp này.

Preset Intensity không đi qua depth `translate`. Advanced tắt thì depth là `both`. Lỗi nằm ở Advanced → Translate only.

## 2. Mục tiêu

- **Translate only:** chỉ `data-swiper-parallax-x` hoặc `y`. Không gắn `data-swiper-parallax-scale`. Ảnh không phóng trong lúc chuyển.
- **Both** và preset Intensity: giữ sàn scale của plan 070. Mé không lộ fill.
- **Scale only:** giữ scale user chọn, không sàn, không dịch.
- Ảnh đứng yên vẫn inset 0. Không đụng focal, fill, overlay.

## 3. Phương án

| Phương án | Việc làm | Trade-off |
|---|---|---|
| **A — Bỏ scale ở Translate only (khuyến nghị)** | Không ghi attr scale khi depth là `translate`. Help nói mép có thể lộ fill. | Đúng nhãn control. Translate lớn sẽ lộ dải fill trong nhịp chuyển. |
| **B — Giữ sàn, đổi nhãn** | Giữ zoom, help nói Translate only vẫn zoom để che mép. | Không còn zoom bất ngờ, nhưng control vẫn zoom. Không đúng câu human hỏi. |
| **C — Inset chỉ khi Translate only** | Khung lớn hơn slide để dịch không hở, không animate scale. | Trở lại DP-08: ảnh đứng yên bị crop. |

### Vì sao A

Human chọn Translate only vì không muốn zoom lúc chuyển. Che mép mà không zoom lúc đứng yên và không zoom lúc chuyển thì không đủ pixel. A nhận dải fill. B và C không hết việc human thấy.

Plan 070 §4 (“translate-only cần sàn scale”) bị mục này thay. Both và preset không đổi.

## 4. Việc sửa

1. `src/slider/view.ts` — `includeScale = depth !== 'translate'`. Chỉ ghi `data-swiper-parallax-scale` khi `includeScale`. Sàn `max(chosenScale, coverScale)` chỉ khi depth là `both`.
2. `src/slider/edit.tsx` — help Translate only: không zoom, mép có thể lộ fill. Help Both/Translate khi depth là `both`: vẫn nâng scale để che mép. Help Scale only: không nói sàn translate.
3. Runbook `docs/testing/slider-parallax-translate-only-1.3.21.md`.

Không sửa PHP inset, CSS focal, attr đã lưu.

## 5. Acceptance

| ID | Mong đợi |
|---|---|
| PTO-01 | Advanced, Translate only, translate 30%: `.skvn-slide__bg` không có `data-swiper-parallax-scale`. Có `data-swiper-parallax-x="-30%"` (hoặc `y` nếu Vertical). |
| PTO-02 | Cùng cấu hình, chuyển slide: ảnh trượt, không phóng. Dải fill ở mép là đúng. |
| PTO-03 | Depth Both, translate 30%, scale 1.12: vẫn có `data-swiper-parallax-scale="1.60"`. |
| PTO-04 | Advanced tắt, Intensity medium: vẫn scale 1.60 và translate 30%. |
| PTO-05 | Scale only: không attr translate; scale đúng số trên control. |

## 6. Quyết định

1. Vấn đề: Translate only vẫn zoom lúc chuyển slide.
2. Phương án: A bỏ scale ở nhánh đó; B giữ zoom và đổi chữ; C inset lại.
3. Khuyến nghị: **A**. Human đã chọn control không zoom. C kéo lại DP-08.
4. Bằng chứng: `view.ts` `includeTranslate` rồi luôn `setAttribute('data-swiper-parallax-scale', scaleVal)`; translate 30% ra `coverScale` 1.60.
5. Tự kiểm: Advanced → Translate only, xem attr trên `.skvn-slide__bg` trước khi kéo. Hôm nay attr scale là `1.60`.
6. Đảo ngược: trả dòng ghi scale cho depth `translate` là một sửa trong `view.ts`. Không migration.
7. Human đã lệnh tiến hành trong cùng yêu cầu lập plan.

**Status:** SOURCE cùng ngày lập plan. Cách che dải fill mà không zoom: research [073](073_VER_1_3_21_PARALLAX_TRANSLATE_EDGE_RESEARCH.md), chưa code.
