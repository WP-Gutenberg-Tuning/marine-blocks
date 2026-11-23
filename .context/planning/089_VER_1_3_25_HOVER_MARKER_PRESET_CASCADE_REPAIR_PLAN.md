# Hover Colors — marker thắng preset theme (HMGP-009 / 010 / 011)

Created: **2026-11-23**.  
Status: **SOURCE DONE 2026-11-23 (commit `08085b2`, hướng A) — chưa build, chưa runtime PASS.**  
Current: **V1 / 1.3.25 — Plugin convention gap**. Không bump metadata trong lượt gán scope.  
Human **2026-11-23:** gộp plan này vào **1.3.25**, cùng convention gap (DP-12 / A9 / A5.11). Gồm hai việc: sửa cascade HMGP-009/010/011 theo hướng A, và đưa năm luật AP-16 vào contract CSS extension khi code. Không phải acceptance Step Slider.

Nguồn: audit Pattern A pass 2 cùng ngày, inventory `docs/audits/hover-marker-gradient-panel-pattern-inventory.md`. Pitfall DP-18, AP-16. Contract CSS: `docs/standards/gutenberg-block-extension-css-contract.md` Quy tắc 1–2.

Human 2026-11-23: lập plan, lưu plan, rồi gán vào 1.3.25. Hướng A vẫn là khuyến nghị. Hướng B còn mở cho đến lệnh code.

Prompt rà lại, chưa code: `docs/workflows/prompts/agent-handoff-1.3.25-wp6-hover-marker-reaudit.md`.

Plan thực thi chi tiết (human yêu cầu lưu trước khi làm, **2026-11-23**, chưa code): [090](090_VER_1_3_25_WP6_HOVER_MARKER_CASCADE_EXECUTION_PLAN.md) — edit chính xác từng file, thứ tự atomic, runbook T0–T8, acceptance. Reaudit 2026-11-23 xác nhận 009/010/011 còn đúng với hướng A. Human “tiến hành” 2026-11-23 → đã code theo 090, commit `08085b2`; chưa build/runtime PASS.

---

## Context

`core/button` Hover Colors gắn biến `--skvn-btn-hover-text` / `--skvn-btn-hover-bg` và class marker.

| Surface | Chỗ gắn marker |
|---|---|
| Frontend | `render_block_core/button` đặt class trên `.wp-block-button` (`modules/core-control/features/button-hover.php`) |
| Editor | `editor.BlockListBlock` đặt class trên wrapper ngoài, cùng node với `.wp-block`, không trên `.wp-block-button` (`src/core-controls/button-hover/index.tsx`) |

CSS editor nằm trong `build/style-index.ts.css`, handle `skvn-marine-blocks-editor`, `editor_style_handles`. Theme `style.css` cũng vào iframe vì `inc/setup.php` gọi `add_editor_style( 'style.css' )`.

Câu trong contract Quy tắc 2 — “Editor CSS không cần specificity cao, không có theme rules trong iframe” — và comment đầu `button-hover/style.css` nói specificity `(0,2,1)` — cả hai sai với source hiện tại. Rule editor thực tế là `(0,4,0)`.

Step CTA và Hero đã có dual-selector riêng (HMGP-001, 005, 007, 008 FIXED). Pattern B (panel solid/gradient) đã guard `undefined` (HMGP-002, 003, 004, 006, 017). Plan này không mở lại các hàng đó.

## Goal

Ba hàng OPEN trên inventory: preset theme không còn thắng Hover Colors trong editor, và không còn thắng bằng `!important` trên frontend. Nút chưa bật Hover Colors giữ nguyên preset.

## Decision Memo — Marker Hover Colors thắng preset theme

1. **Vấn đề:** Hover Colors đã gắn biến và class, nhưng preset theme vẫn thắng trong editor (hòa `(0,4,0)`) và thắng cả hai surface khi preset dùng `!important`.
2. **Phương án:**
   - **A:** Nâng selector marker và thêm `!important` chỉ trên `color` / `background` của rule marker. Trade-off: lệch câu “tránh `!important`” trong contract Quy tắc 1; preset không có marker không đổi.
   - **B:** Gỡ `!important` ở `.skvn-button--text` / `.skvn-button--white`, rồi chỉ nâng specificity editor. Trade-off: sát contract hơn; preset text/white có thể mất nền hoặc chữ nếu `!important` đang thắng global styles.
3. **Khuyến nghị:** **A.** Ba OPEN cùng một cascade. `!important` của theme không thua specificity. Gỡ `!important` đụng nút chưa bật Hover Colors.
4. **Bằng chứng:** `wp-content/themes/skvn-marine/style.css` 189–214 `(0,4,0)`; dòng 1436 `(0,4,0)`; 2363 và 2399–2408 có `!important`. Editor marker `src/core-controls/button-hover/style.css` 12–19 `(0,4,0)`. Frontend `button-hover.php` 50–56 là `(0,5,0)` và đã thắng preset không `!important`.
5. **Tự kiểm chứng:** DevTools, nút `skvn-button--primary` và `skvn-button--white`, bật Hover Colors, force `:hover`. So rule theme với `.has-skvn-btn-hover-bg .wp-block-button .wp-block-button__link:hover`.
6. **Đảo ngược:** 2 chiều. Bỏ `!important` trên rule marker và trả selector cũ là hết.
7. **Default:** Human bảo implement mà không chọn lại thì làm A. Chưa có lệnh implement thì không sửa source.

**Proposal còn mở:** B. Chưa bị human bác. Không làm B song song với A.

**Proposal không làm:** dual-selector thêm ở theme (`.has-marker .A` và `.A.marker`) cho primary/white/newsletter. Dual-selector không phá hòa `(0,4,0)` và không phá `!important`. Sửa DOM editor để nhét marker vào `.wp-block-button` — `BlockListBlock` chỉ có `wrapperProps` trên wrapper ngoài (contract Quy tắc 4).

## Hướng A — source sẽ sửa khi có lệnh

Marker editor đã có đủ class trên một node: wrapper `.wp-block` nhận cả `has-skvn-button-hover` và `has-skvn-btn-hover-bg` hoặc `has-skvn-btn-hover-text` (`button-hover/index.tsx`). Frontend đặt cả hai class trên `.wp-block-button`.

### 1. `src/core-controls/button-hover/style.css`

Thay rule hover. Giữ rule `transition`. Sửa comment đầu file: iframe có theme `style.css`; specificity cũ `(0,2,1)` không còn đúng.

```css
.wp-block.has-skvn-button-hover.has-skvn-btn-hover-text .wp-block-button .wp-block-button__link:hover,
.wp-block.has-skvn-button-hover.has-skvn-btn-hover-text .wp-block-button .wp-block-button__link:focus-visible {
	color: var( --skvn-btn-hover-text ) !important;
}

.wp-block.has-skvn-button-hover.has-skvn-btn-hover-bg .wp-block-button .wp-block-button__link:hover,
.wp-block.has-skvn-button-hover.has-skvn-btn-hover-bg .wp-block-button .wp-block-button__link:focus-visible {
	background: var( --skvn-btn-hover-bg ) !important;
}
```

Đếm: `.wp-block` + `.has-skvn-button-hover` + `.has-skvn-btn-hover-*` + `.wp-block-button` + `.wp-block-button__link` + `:hover` = `(0,6,0)` và `!important`.

### 2. `modules/core-control/features/button-hover.php`

Inline CSS frontend. Thêm class `has-skvn-button-hover` (PHP đã gắn class này). `!important` chỉ trên `color` và `background`. Rule `transition` giữ, không `!important`.

```css
.wp-block-button.has-skvn-button-hover.has-skvn-btn-hover-text .wp-block-button__link.wp-element-button:hover,
.wp-block-button.has-skvn-button-hover.has-skvn-btn-hover-text .wp-block-button__link.wp-element-button:focus-visible {
	color: var(--skvn-btn-hover-text) !important;
}
.wp-block-button.has-skvn-button-hover.has-skvn-btn-hover-bg .wp-block-button__link.wp-element-button:hover,
.wp-block-button.has-skvn-button-hover.has-skvn-btn-hover-bg .wp-block-button__link.wp-element-button:focus-visible {
	background: var(--skvn-btn-hover-bg) !important;
}
```

Đếm: `(0,6,0)` và `!important`.

### Vì sao A đủ cho từng hàng

| ID | Cơ chế |
|---|---|
| HMGP-009 | Editor `(0,6,0) !important` thắng preset primary / secondary / `is-style-skvn-primary` `(0,4,0)` tại `style.css` 189–214. Frontend hiện `(0,5,0)` đã thắng các hover không `!important`; bản mới giữ lợi thế. |
| HMGP-010 | `(0,6,0) !important` thắng `.skvn-button--text` `background: transparent !important` `(0,2,0)` và `.skvn-button--white` background/color `!important` `(0,2,0)`–`(0,3,0)` tại `style.css` 2361–2409. Lúc chưa hover, preset không có marker nên rule marker không khớp. |
| HMGP-011 | Base `.skvn-newsletter-band .wp-block-button:not(.is-style-skvn-primary) .wp-block-button__link` `(0,4,0)` tại `style.css:1436` thua hover marker trong editor. Frontend đã thắng từ trước. Pattern `patterns/newsletter-band.php` dùng `is-style-skvn-primary`, nằm ngoài selector này. |

Step CTA (`step-slider/style.css`, `editor.css`) và Hero (`slider/style.css`) đã set cùng `var(--skvn-btn-hover-*)` ở specificity cao hơn hoặc bằng, không `!important`. Rule global có `!important` chỉ tranh `color` và `background`. `border-color: transparent` của Step CTA vẫn do rule Step.

### 3. Docs trong cùng lượt code

- `docs/standards/gutenberg-block-extension-css-contract.md` Quy tắc 2: iframe editor có theme `style.css`. Rule marker phải ≥ rule theme mạnh nhất trên element đó. `!important` chỉ khi preset theme đã `!important` trên đúng property, và chỉ trên property đó.
- `.context/PITFALLS.md` DP-18: một bullet trỏ plan này và hai file CSS/PHP ở trên.
- Inventory: HMGP-009, 010, 011 đổi `FIXED` kèm “source, chưa runtime PASS”. Không ghi onsite PASS.

Chưa có test assert chuỗi CSS hover. Không thêm harness mới trong lượt này.

## Files allowed (khi lệnh code)

- `wp-content/plugins/skvn-marine-blocks/src/core-controls/button-hover/style.css`
- `wp-content/plugins/skvn-marine-blocks/modules/core-control/features/button-hover.php`
- `docs/standards/gutenberg-block-extension-css-contract.md`
- `.context/PITFALLS.md` (chỉ bullet DP-18)
- `docs/audits/hover-marker-gradient-panel-pattern-inventory.md` (status 009–011)

Năm file. Không file thứ sáu.

## Files forbidden

- `themes/generatepress/**`
- `wp-content/themes/skvn-marine/style.css` (hướng A không sửa preset)
- `src/step-slider/**`, `src/slider/**`, `src/slide/**`, `src/step-slide/**`
- Handler `PanelColorGradientSettings`
- Milestone, `AGENTS.md`, bump version, commit, build do agent tự chạy

## Requirement record

| ID | Nhóm | Hành vi mong đợi | Hiện trạng | Việc cần sửa | Cách kiểm | Evidence |
|---|---|---|---|---|---|---|
| HMGP-009 | Editor UX | Nút primary / secondary / `is-style-skvn-primary`: Hover Colors đổi nền và chữ trong iframe | OPEN — hòa `(0,4,0)`, thứ tự enqueue quyết định | Selector editor `(0,6,0) !important` | Force `:hover` trong editor, so với màu panel | `style.css` 189–214; `button-hover/style.css` 12–19. Chưa screenshot |
| HMGP-009-FE | Block UI | Cùng nút trên trang đã Update theo Hover Colors | Frontend PHP `(0,5,0)` đã thắng preset không `!important` | Giữ lợi thế bằng selector `(0,6,0) !important` | Update trang, hover nút | `button-hover.php` 50–56. Chưa onsite |
| HMGP-010 | Block UI + Editor UX | `.skvn-button--white` và `.skvn-button--text`: lúc nghỉ giữ preset; lúc hover đổi theo panel, kể cả kênh bị `!important` | OPEN — `!important` theme thắng marker cả hai surface. Kênh chữ của `--text` (không `!important`) vẫn theo marker | `!important` trên property marker | Nghỉ vs hover, editor và frontend | `style.css` 2361–2409 |
| HMGP-011 | Editor UX | Nút trong `.skvn-newsletter-band` không có `is-style-skvn-primary`: hover editor theo panel | OPEN — base `(0,4,0)` hòa marker editor | Cùng rule editor của 009 | Force `:hover` trong editor | `style.css:1436`. Pattern newsletter dùng `is-style-skvn-primary`, ngoài selector |
| HMGP-STEP | Block UI + Editor UX | Step CTA `skvn-cta` vẫn đổi hover và viền trong suốt | Đã có dual-selector `(0,7,0)`, không `!important` | Không sửa file Step. `border-color` không nằm trong rule global | Hover một CTA step sau khi build | `step-slider/style.css` ~290–331 |
| HMGP-REST | Block UI | Nút white/text/primary chưa bật Hover Colors giữ màu preset | Preset theme đang thắng vì marker vắng | Rule mới chỉ khớp khi có marker | Hover nút không mở panel Hover Colors | Cùng file theme, không sửa |

Content & states: có marker nền, có marker chữ, có cả hai, không marker. Primary, white, text, newsletter không `is-style-skvn-primary`, Step `skvn-cta`. Accessibility: `:focus-visible` đi cùng `:hover` trên cùng property. Responsive / performance: N/A (không đổi layout, không thêm listener).

## Acceptance

- [ ] `style.css` plugin editor và inline PHP khớp selector ở mục Hướng A
- [ ] `transition` không có `!important`
- [ ] Theme `style.css` không đổi trong hướng A
- [ ] Comment editor và contract Quy tắc 2 không còn câu “iframe không có theme rule” / `(0,2,1)`
- [ ] Inventory 009–011 = FIXED source, chưa runtime PASS
- [ ] Chưa kết luận onsite PASS

## Kiểm sau build (human)

CSS editor chỉ vào iframe sau build. PHP inline không cần build; chạy cùng lệnh để bundle khỏi lệch:

```bash
source /home/shinkuro/.nvm/nvm.sh && nvm use 20 && cd /mnt/d/Github/skvn-marine/wp-content/plugins/skvn-marine-blocks && npm run build
```

Mỗi nút hai lần: chưa Hover Colors, rồi đặt Text và Background.

1. `skvn-button--primary` hoặc `is-style-skvn-primary` trong editor và trang đã Update.
2. `skvn-button--white` và `skvn-button--text`: lúc nghỉ giữ trắng / trong suốt; lúc hover theo panel.
3. Một nút trong `.skvn-newsletter-band` không có `is-style-skvn-primary`, xem editor.
4. Step CTA `skvn-cta`: hover đổi màu, viền vẫn trong suốt.

Evidence gửi lại: screenshot hover editor + frontend, hoặc DevTools rule nào thắng (`color` / `background`).

## Tensions

Không tension HIGH mới. Lệch contract “tránh `!important`” được ghi trong memo (hướng A) và sẽ sửa câu contract trong cùng lượt code, không âm thầm thêm `!important` rồi để contract cũ.

## Không làm trong lượt lưu plan này

Không sửa CSS/PHP, không build, không commit, không bump, không đổi status OPEN của 009–011 thành FIXED.
