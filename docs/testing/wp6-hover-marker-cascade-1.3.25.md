# Runbook — WP6 Hover marker cascade (1.3.25)

**Ngày tạo:** 2026-11-23 (plan [090](../../.context/planning/090_VER_1_3_25_WP6_HOVER_MARKER_CASCADE_EXECUTION_PLAN.md) §5.6, hướng A plan 089).
**Status:** Chưa làm — chờ human build + chạy T0–T8. Không case nào PASS trước khi có evidence.
**Scope:** HMGP-009 / 009-FE / 010 / 011 / STEP / REST + WP6-ACC-01. Không đụng WP1–WP5, không sửa file Step Slider.

---

## 1. Target

- **Local:** `http://localhost:8080` — trang fixture có đủ nút: `skvn-button--primary` (hoặc `is-style-skvn-primary`), `skvn-button--white`, `skvn-button--text`, một nút trong `.skvn-newsletter-band` **không** `is-style-skvn-primary`, và một Step Slider có CTA `skvn-cta`. Human điền URL trang fixture: `__________`
- **Onsite:** trang có các nút tương ứng (human điền URL): `__________`
- Editor: trang đó trong wp-admin (block editor, iframe canvas).

## 2. Setup / preconditions

1. Human chạy build + PHP lint (lệnh trong plan 090 §9); ghi lại build hash / thời điểm: `__________`
2. Feature `button_hover` **bật** trong Core Control (admin SKVN Marine).
3. Theme `skvn-marine` active (theme `style.css` vào iframe qua `add_editor_style`).
4. Nút test đã **Update** trang sau khi đặt Hover Colors (frontend đọc saved attrs).
5. Mỗi nút test hai lần: **chưa** đặt Hover Colors (T6), rồi đặt **Text và Background** trong Styles → Hover Colors (T1–T5). Chọn màu dễ phân biệt với preset (ví dụ chữ vàng, nền đỏ).
6. DevTools: biết cách force `:hover`/`:focus-visible` (Elements → chọn link → `:hov` panel).

## 3. Cases

### T0 — Gate DOM + rule mới trong iframe (WP6-TECH-01)

- **Steps:** Mở editor trang fixture, chọn nút đã đặt Hover Colors. DevTools trong iframe canvas: tìm wrapper của block button; tab Styles của `.wp-block-button__link`, force `:hover`.
- **Expected:** Wrapper có class `wp-block` + `has-skvn-button-hover` + `has-skvn-btn-hover-text` và/hoặc `has-skvn-btn-hover-bg`. Rule thắng `color`/`background` là `.wp-block.has-skvn-button-hover.has-skvn-btn-hover-* … :hover` với `!important`, specificity `(0,6,0)`.
- **Pass:** đúng cả hai. **Fail:** wrapper thiếu `.wp-block` hoặc rule cũ `(0,4,0)` còn thắng → DỪNG, gửi screenshot DOM + Styles; không tự sửa selector (contingency plan 090 §10 cần human quyết).
- **Evidence:** screenshot DOM wrapper + Styles panel showing winning rule.

### T1 — Primary / is-style-skvn-primary (HMGP-009, HMGP-009-FE)

- **Steps:** Nút `skvn-button--primary` hoặc `is-style-skvn-primary` đã đặt Text+Background. (a) Editor: force `:hover` trên link. (b) Update trang, mở frontend, hover thật.
- **Expected:** Cả hai surface: hover đổi **chữ và nền** đúng màu panel; lúc nghỉ giữ preset xanh/trắng.
- **Pass:** màu hover khớp panel ở cả editor lẫn frontend. **Fail:** một surface còn màu preset → ghi surface nào + rule thắng trong DevTools.
- **Evidence:** screenshot hover editor + frontend; DevTools rule thắng `color`/`background`.

### T2 — White (HMGP-010)

- **Steps:** Nút `skvn-button--white` đã đặt Text+Background. So lúc nghỉ và hover, editor + frontend.
- **Expected:** Nghỉ: nền trắng, chữ xanh preset (`!important` theme giữ). Hover: nền + chữ theo panel — kể cả hai kênh bị theme khóa `!important`.
- **Pass:** nghỉ giữ preset, hover theo panel cả hai surface. **Fail:** hover còn trắng/xanh preset → ghi kênh nào thua + rule.
- **Evidence:** screenshot nghỉ/hover × editor/frontend (4 ảnh) hoặc DevTools.

### T3 — Text (HMGP-010)

- **Steps:** Nút `skvn-button--text` đã đặt Text+Background. So nghỉ/hover, editor + frontend.
- **Expected:** Nghỉ: nền trong suốt, chữ preset. Hover: **nền theo panel** (kênh `background: transparent !important` của theme bị marker thắng) và chữ theo panel.
- **Pass:** cả hai kênh đổi khi hover, nghỉ trong suốt. **Fail:** nền vẫn trong suốt khi hover → ghi rule thắng.
- **Evidence:** screenshot nghỉ/hover × editor/frontend.

### T4 — Newsletter band không is-style-skvn-primary (HMGP-011)

- **Steps:** Nút trong `.skvn-newsletter-band` **không** mang `is-style-skvn-primary`, đã đặt Hover Colors. Force `:hover` trong editor. (Frontend optional: base band không phải hover rule.)
- **Expected:** Hover editor theo panel, không còn nền accent của band.
- **Pass:** màu hover khớp panel. **Fail:** còn nền band → ghi thứ tự rule trong Styles.
- **Evidence:** screenshot editor hover.

### T5 — Step CTA skvn-cta (HMGP-STEP, regression)

- **Steps:** Step Slider có CTA `skvn-cta`, đặt Hover Colors trên nút đó. Hover trong editor (focused stage) và frontend trang đã Update.
- **Expected:** Màu chữ/nền theo panel; **viền trong suốt** khi hover (rule Step giữ `border-color`). Không sửa file Step.
- **Pass:** màu theo panel + viền trong suốt cả hai surface. **Fail:** viền còn màu hoặc màu không đổi → screenshot + rule.
- **Evidence:** screenshot hover editor + frontend.

### T6 — Nút chưa bật Hover Colors (HMGP-REST)

- **Steps:** Nút primary/white/text **chưa** đặt Hover Colors (panel trống). Nghỉ + hover, editor + frontend. DevTools Styles của link khi hover.
- **Expected:** Giữ nguyên preset ở cả nghỉ lẫn hover; **không** rule marker `.has-skvn-button-hover…` nào khớp (không có marker trên DOM).
- **Pass:** preset nguyên vẹn, không rule marker. **Fail:** màu đổi hoặc rule marker khớp → ghi lại.
- **Evidence:** screenshot hover + DevTools (không marker).

### T7 — Focus-visible parity (WP6-ACC-01)

- **Steps:** Nút đã đặt Hover Colors. Tab keyboard tới link (không click), quan sát màu.
- **Expected:** `:focus-visible` cho cùng màu chữ/nền như `:hover`, cả editor lẫn frontend.
- **Pass:** màu focus = màu hover = panel. **Fail:** focus giữ preset → ghi rule.
- **Evidence:** screenshot focus.

### T8 — Reduced motion (WP6-ACC-01)

- **Steps:** Bật `prefers-reduced-motion: reduce` (OS hoặc DevTools rendering emulation). Hover nút có Hover Colors.
- **Expected:** `transition: none` (computed), màu hover vẫn đúng panel; không animation.
- **Pass:** computed transition none + màu đúng. **Fail:** còn transition hoặc sai màu.
- **Evidence:** DevTools computed `transition` + screenshot.

## 4. Pass/fail tổng hợp

- Mỗi case ghi PASS/FAIL + evidence vào bảng dưới. Thiếu evidence → “Chờ kiểm chứng”, không PASS chung.
- T0 fail → dừng các case sau, báo agent kèm screenshot DOM (contingency `.wp-block` cần human quyết).
- Không case nào là runtime PASS của cả milestone; transition 1.3.25 vẫn theo Transition Rule.

| Case | ID | Status | Evidence (link/ảnh/ngày) |
|---|---|---|---|
| T0 | WP6-TECH-01 | Chưa làm | |
| T1 | HMGP-009/009-FE | Chưa làm | |
| T2 | HMGP-010 | Chưa làm | |
| T3 | HMGP-010 | Chưa làm | |
| T4 | HMGP-011 | Chưa làm | |
| T5 | HMGP-STEP | Chưa làm | |
| T6 | HMGP-REST | Chưa làm | |
| T7 | WP6-ACC-01 | Chưa làm | |
| T8 | WP6-ACC-01 | Chưa làm | |

## 5. Evidence human gửi lại

- Build hash/thời điểm + output PHP lint (không lỗi).
- Screenshot hoặc DevTools rule thắng cho từng case (đặc biệt T0, T2, T3, T6).
- Console notes nếu có warning/error.
- URL trang fixture local + onsite đã dùng.

Agent tiếp tục sau evidence: cập nhật bảng này + inventory HMGP-009/010/011 (chỉ PASS từng case khi evidence đạt), phân tích FAIL nếu có. Không kết luận onsite PASS thay human.
