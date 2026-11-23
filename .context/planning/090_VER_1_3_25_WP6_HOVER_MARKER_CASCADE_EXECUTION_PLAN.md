# V1 / 1.3.25 — WP6 Hover marker cascade — Plan thực thi chi tiết (hướng A)

Created: **2026-11-23**.
Status: **SOURCE DONE 2026-11-23 (feature commit `08085b2`) — chưa build, chưa runtime PASS; T0–T8 chờ human.**
Current: **V1 / 1.3.25 — Plugin convention gap** (PLANNED, chưa bump metadata).

Human **2026-11-23:** “Lập plan implement chi tiết theo contract, lưu lại trước khi làm” → file này.
Plan cha: [089](089_VER_1_3_25_HOVER_MARKER_PRESET_CASCADE_REPAIR_PLAN.md) (Decision Memo, hướng A, khóa 5 file sửa). Audit: [084](084_VER_1_3_25_PLUGIN_CONVENTION_GAP_AUDIT.md) WP6. Inventory: `docs/audits/hover-marker-gradient-panel-pattern-inventory.md`.

Reaudit **2026-11-23** (prompt `docs/workflows/prompts/agent-handoff-1.3.25-wp6-hover-marker-reaudit.md`): HMGP-009/010/011 **còn đúng** với premise 089; đếm lại specificity trên source, không chép số cũ. Hướng A là default theo memo 089 §7; hướng B vẫn mở, không làm song song. File này không xin lại approval đã có và không tự là lệnh start code.

---

## 1. Mục tiêu và authority

Ba hàng OPEN (HMGP-009/010/011): preset theme không còn thắng Hover Colors trong editor (hòa `(0,4,0)`) và không còn thắng bằng `!important` trên frontend. Nút chưa bật Hover Colors giữ nguyên preset (HMGP-REST). Năm luật AP-16 vào contract CSS extension; câu sai của contract Quy tắc 1–2 và comment editor được sửa **trong cùng lượt code** (không âm thầm thêm `!important` rồi để contract cũ).

Authority đã có: human gán WP6 vào 1.3.25 (2026-11-23), memo 089 chốt khuyến nghị A + default A. Chưa có: lệnh implement, lệnh bump, lệnh build/commit/push của agent.

## 2. Đọc bắt buộc trước khi code (implementer)

1. `AGENTS.md` mục current + routing; `.context/GLOBAL.md` (A2, A13); `.context/MILESTONES.md` §1.3.25; `.context/TENSIONS_OPEN.md` (scan); `.context/modules/PLUGIN_SKVN_MARINE_BLOCKS.md` [manual] (mục Core Control).
2. Plan 089 (memo + hướng A + khóa file), plan 084 WP6, file này, inventory (hàng HMGP + header reaudit 2026-11-23).
3. `.context/PITFALLS.md` **đúng entry** DP-18 + AP-16 (không đọc hết file); AP-06/AP-07 nếu đụng build parity.
4. Contract: `docs/standards/gutenberg-block-extension-css-contract.md` (Quy tắc 1–6), `docs/standards/block-ui-editor-ux-technical-review-contract.md`, `docs/standards/security-guidelines.md` (output path PHP). `docs/standards/css-layout-safety-contract.md`: **N/A có lý do** — WP6 không đổi width/alignment/overflow/viewport unit.
5. `docs/decisions/core-control-core-button-hover.md` (decision nguồn của feature).
6. Source baseline: `src/core-controls/button-hover/style.css`, `modules/core-control/features/button-hover.php`, `src/core-controls/button-hover/index.tsx`, theme `style.css` 189–214 / 1436–1439 / 2361–2410, `inc/setup.php:27–29`, `skvn-marine-blocks.php:92–101` (handle editor), `src/step-slider/style.css` 257–338 + `editor.css` 266–341 (read-only), `src/slider/style.css` 676–715 (read-only).
7. Convention: **L0** (Chỉ mục + 0.1–0.5) + hàng định tuyến gần nhất (kiểm tra độc lập theme–plugin A9/A3 + CSS frontend A1–A3); không đọc hết `CONVENTION.md`; không digest PITFALL (chưa có lệnh).

Khối “Đã đọc” mẫu khi giao code:

```text
Đã đọc: L0 (Chỉ mục + 0.1–0.5), A9, A3, A1–A2 (nếu đọc), A5.2/A5.10 (xác nhận không đổi save/attr)
Phân loại task: sửa block extension đã phát hành (core/button Hover Colors) — CSS cascade + docs contract
Tín hiệu mở rộng: không (không attribute mới, không output path mới, không width)
Recipe: không (patch CSS/PHP + docs, không block mới)
Gate đã chạy: Phụ lục 1 — Giao diện (self-check); build/lint human chạy
```

## 3. Phạm vi và boundary

**Trong (đúng khóa 5 file của 089):**

| # | File | Thay đổi |
|---|---|---|
| 1 | `wp-content/plugins/skvn-marine-blocks/src/core-controls/button-hover/style.css` | Comment đầu + 2 rule hover; giữ transition/reduced-motion |
| 2 | `wp-content/plugins/skvn-marine-blocks/modules/core-control/features/button-hover.php` | Comment + chuỗi `$css` hover; giữ transition/reduced-motion; **không** đổi render filter/sanitize/enqueue |
| 3 | `docs/standards/gutenberg-block-extension-css-contract.md` | Sửa Quy tắc 1–2, thêm Quy tắc 7 (năm luật AP-16), checklist |
| 4 | `.context/PITFALLS.md` | **Chỉ** thêm 1 bullet DP-18; không xóa/sửa entry cũ |
| 5 | `docs/audits/hover-marker-gradient-panel-pattern-inventory.md` | 009/010/011 → FIXED source + session line; không xóa hàng |

**Thêm theo AGENTS onsite-first + review contract §4.6 (commit docs riêng, xem §11):** `docs/testing/wp6-hover-marker-cascade-1.3.25.md` (runbook, nội dung §5.6).

**Ngoài / cấm:**

- `themes/generatepress/**`; theme `style.css` (hướng A không sửa preset); `inc/setup.php`.
- `src/step-slider/**`, `src/step-slide/**`, `src/slider/**`, `src/slide/**` (read-only evidence).
- `src/core-controls/button-hover/index.tsx` + `attributes.ts`: marker đã gắn đúng (`has-skvn-button-hover` + kênh, index.tsx 169–187; PHP 124–146) — **không sửa**.
- Attribute/save: không đổi. Marker là class **runtime** (PHP render filter + `wrapperProps`), không nằm trong saved content → **không cần `deprecated`/migration A5.10**; xác nhận lại khi code bằng grep `save`/`deprecated` không đụng.
- WP1–WP5, PCA-01–21 (kể cả phần hex migration PCA-20), hướng B, digest `CONVENTION.md`, bump metadata, agent build/lint/commit-push.
- Không thêm PHP `require`/`include` → không cần audit deploy artifact; packaging zip không đổi.

## 4. Cơ chế và số đếm (đã reaudit 2026-11-23)

Cách đếm: pseudo-class (`:hover`, `:focus-visible`, `:not(.x)`) cộng vào **ô class**; `:not(.x)` mang specificity của `.x`; `!important` không tăng specificity, nó thắng declaration không `!important` cùng property.

| Rule | Selector hiện tại | Số hiện tại | Sau hướng A |
|---|---|---|---|
| Editor marker (style.css 12–20) | `.has-skvn-btn-hover-text/-bg .wp-block-button .wp-block-button__link:hover/:focus-visible` | `(0,4,0)`, không `!important` | `(0,6,0)` + `!important` chỉ `color`/`background` |
| Frontend marker (button-hover.php 50–57) | `.wp-block-button.has-skvn-btn-hover-text/-bg .wp-block-button__link.wp-element-button:hover/:focus-visible` | `(0,5,0)`, không `!important` | `(0,6,0)` + `!important` chỉ `color`/`background` |
| Theme primary/secondary/is-style hover (189–214) | `.wp-block-button.skvn-button--primary > .wp-block-button__link:hover` … | `(0,4,0)`, không `!important` | không đổi |
| Theme newsletter base (1436–1439) | `.skvn-newsletter-band .wp-block-button:not(.is-style-skvn-primary) .wp-block-button__link` | `(0,4,0)`, không `:hover` | không đổi |
| Theme `--text` (2361–2375) | base `.skvn-button--text .wp-block-button__link` bg `transparent !important`; hover color không `!important` | `(0,2,0)` / `(0,3,0)` | không đổi |
| Theme `--white` (2398–2410) | base bg+color `!important`; hover bg `!important` | `(0,2,0)` / `(0,3,0)` | không đổi |
| Step CTA dual (step-slider style.css 291–332, editor.css 300–341) | ancestor + self, `var(--skvn-btn-hover-*)`, `border-color: transparent` riêng | `(0,7,0)`, không `!important` | không đổi (read-only) |
| Hero CTA dual (slider/style.css 694–715) | ancestor + self, cùng var | `(0,5,0)`, không `!important` | không đổi (read-only) |

Vì sao A đủ:

- **009 editor:** hòa `(0,4,0)` → thứ tự source trong iframe quyết định; thứ tự **không** được pin bằng dependency (handle `skvn-marine-blocks-editor` chỉ dep `skvn-marine-product-card`, `skvn-marine-blocks.php:68/98`; theme vào iframe bằng `add_editor_style( 'style.css' )`, `setup.php:29`). `(0,6,0)` + `!important` xóa phụ thuộc thứ tự.
- **009 frontend:** `(0,5,0)` đã thắng preset không `!important`; bản mới giữ lợi thế, không phụ thuộc thứ tự.
- **010:** `!important` theme không thua specificity thường; marker `!important` `(0,6,0)` > `(0,2,0)`/`(0,3,0)` cùng `!important` → thắng kênh khóa. Kênh chữ `--text` (không `!important`) vẫn theo marker như cũ.
- **011:** base `(0,4,0)` thua marker editor mới; pattern `patterns/newsletter-band.php:24–25` dùng `is-style-skvn-primary` → ngoài selector, không ảnh hưởng.
- **HMGP-REST:** marker chỉ gắn khi có giá trị (index.tsx 164–166 early return; PHP 119–121 early return). Rule mới chỉ khớp `:hover`/`:focus-visible` → lúc nghỉ preset giữ nguyên; nút không bật Hover Colors không marker → không khớp.
- **Step/Hero:** rule global `!important` thắng color/bg của Step `(0,7,0)`/Hero `(0,5,0)` nhưng **cùng `var(--skvn-btn-hover-*)`** → giá trị computed không đổi. `border-color: transparent` của Step không nằm trong rule global → vẫn của Step. Transition Step/Hero không bị đụng (rule transition giữ, không `!important`).
- **`.wp-block` trên wrapper editor:** DOM evidence trong repo `docs/testing/step-slider-editor-lag-ledger.md:52` (className wrapper có `wp-block`). Gate DevTools đầu tiên sau build xác nhận lại trên `core/button` (§9 T0).

## 5. Edit chính xác từng file

### 5.1 `src/core-controls/button-hover/style.css` — thay toàn bộ nội dung

```css
/*
 * Editor-only: frontend hover rules are emitted via PHP wp_add_inline_style.
 *
 * In the editor, BlockListBlock injects has-skvn-button-hover and the channel
 * markers (has-skvn-btn-hover-text / -bg) on the OUTER wrapper div (.wp-block),
 * not on .wp-block-button itself. Selector must traverse down:
 *   .wp-block.has-skvn-button-hover.has-skvn-btn-hover-* (BlockListBlock wrapper)
 *     └─ .wp-block-button (block content)
 *          └─ .wp-block-button__link
 *
 * The editor iframe DOES contain theme rules: the SKVN theme loads style.css
 * via add_editor_style( 'style.css' ) (inc/setup.php). Theme preset hovers are
 * (0,4,0) and some lock channels with !important, so the marker rule uses
 * (0,6,0) + !important on color/background only (HMGP-009/010/011, plans 089/090).
 * The old "0,2,1 is safe — no theme rules conflict inside editor iframe" claim
 * was wrong. Transition stays without !important.
 */
.wp-block.has-skvn-button-hover.has-skvn-btn-hover-text .wp-block-button .wp-block-button__link:hover,
.wp-block.has-skvn-button-hover.has-skvn-btn-hover-text .wp-block-button .wp-block-button__link:focus-visible {
	color: var( --skvn-btn-hover-text ) !important;
}

.wp-block.has-skvn-button-hover.has-skvn-btn-hover-bg .wp-block-button .wp-block-button__link:hover,
.wp-block.has-skvn-button-hover.has-skvn-btn-hover-bg .wp-block-button .wp-block-button__link:focus-visible {
	background: var( --skvn-btn-hover-bg ) !important;
}

.has-skvn-button-hover .wp-block-button .wp-block-button__link {
	transition: color 0.15s ease, background 0.15s ease;
}

@media ( prefers-reduced-motion: reduce ) {
	.has-skvn-button-hover .wp-block-button .wp-block-button__link {
		transition: none;
	}
}
```

Đếm: 5 class + 1 pseudo-class = `(0,6,0)`. Cặp `:hover`/`:focus-visible` cùng property (accessibility parity). Giữ indent tab như source hiện tại.

### 5.2 `modules/core-control/features/button-hover.php` — thay comment + `$css` (khoảng dòng 44–65)

Thay khối comment `// Gated rules: …` và chuỗi `$css = '…';` bằng:

```php
	// Gated rules: only override the property that was actually configured.
	// has-skvn-button-hover + has-skvn-btn-hover-text/-bg are added by the
	// render filter per-button, so a text-only button never has its background
	// forced (no inherit reset). Selector carries .wp-element-button to beat WP
	// global-styles (.wp-element-button:hover) and the slider hero base rule.
	// (0,6,0) + !important on color/background ONLY: theme presets lock those
	// channels with !important (HMGP-010) and tie the editor at (0,4,0)
	// (HMGP-009/011). Plans 089/090; contract Quy tắc 1–2. Transition stays
	// without !important.
	$css = '
.wp-block-button.has-skvn-button-hover.has-skvn-btn-hover-text .wp-block-button__link.wp-element-button:hover,
.wp-block-button.has-skvn-button-hover.has-skvn-btn-hover-text .wp-block-button__link.wp-element-button:focus-visible {
	color: var(--skvn-btn-hover-text) !important;
}
.wp-block-button.has-skvn-button-hover.has-skvn-btn-hover-bg .wp-block-button__link.wp-element-button:hover,
.wp-block-button.has-skvn-button-hover.has-skvn-btn-hover-bg .wp-block-button__link.wp-element-button:focus-visible {
	background: var(--skvn-btn-hover-bg) !important;
}
.wp-block-button.has-skvn-button-hover .wp-block-button__link {
	transition: color 0.15s ease, background 0.15s ease;
}
@media (prefers-reduced-motion: reduce) {
	.wp-block-button.has-skvn-button-hover .wp-block-button__link {
		transition: none;
	}
}';
```

**Không đổi:** `skvn_marine_blocks_enqueue_button_hover_frontend_style` (static guard, deps `skvn-marine-style`, `wp_add_inline_style`), `skvn_marine_blocks_sanitize_hover_bg`, `skvn_marine_blocks_render_button_hover` (regex, marker merge, `esc_attr`). Chuỗi CSS là static, không nhận input mới → không thêm sanitize/escape path. Đếm: `(0,6,0)`.

### 5.3 `docs/standards/gutenberg-block-extension-css-contract.md`

**(a) Đầu file** — sau đoạn case study gốc (dòng 6–8), thêm:

```markdown
**Case study thứ hai (2026-11-23):** WP6 — preset theme thắng Hover Colors trong editor
(hòa specificity) và bằng `!important` trên frontend; câu sai của Quy tắc 2 về iframe.
Xem `.context/PITFALLS.md` DP-18/AP-16, plan 089/090 và inventory
`docs/audits/hover-marker-gradient-panel-pattern-inventory.md`.
```

**(b) Quy tắc 1** — thay khối ví dụ (dòng 21–25):

```
Theme rule: .wp-block-button.skvn-button--primary .wp-block-button__link:hover → (0,4,0)
Plugin cần: ≥ (0,4,0)
Dùng:       .wp-block-button.has-skvn-button-hover .wp-block-button__link:hover → (0,4,0) ✅
```

Thêm ngay sau khối ví dụ:

```markdown
Cách đếm: pseudo-class (`:hover`, `:focus-visible`, `:not(.x)`) cộng vào ô class;
`:not(.x)` mang specificity của `.x`. `!important` không tăng specificity — nó thắng
declaration không `!important` trên cùng property.
```

Thêm subsection mới sau “Cách đạt specificity đủ mà không dùng `!important`”:

```markdown
### Khi nào được dùng `!important` trên rule marker

Specificity không thắng được declaration `!important` của theme/external trên cùng property.
Khi preset theme khóa đúng property đó bằng `!important` (bằng chứng file:line, ví dụ
`.skvn-button--white` trong theme SKVN), rule marker được phép `!important` **chỉ trên
property bị khóa**, với điều kiện:

- Không `!important` trên `transition` hay property không bị khóa.
- Comment tại chỗ cite bằng chứng (ID pitfall/inventory/plan).
- Sửa câu contract cấm tuyệt đối trong cùng lượt code — không âm thầm thêm `!important`.

Case: WP6 / HMGP-010 — plan 089/090, marker `(0,6,0) !important` chỉ trên `color`/`background`.
```

**(c) Quy tắc 2** — sửa dòng DOM editor (thêm `wp-block` vào class wrapper):

```html
<div class="block-editor-block-list__block wp-block has-skvn-button-hover" style="--skvn-btn-hover-text:#fff">
```

Thay bảng selector (dòng 82–85):

```markdown
| Context | Selector | Specificity |
|---|---|---|
| Frontend CSS (PHP `wp_add_inline_style`) | `.wp-block-button.has-skvn-button-hover.has-skvn-btn-hover-text .wp-block-button__link.wp-element-button:hover` | (0,6,0) |
| Editor CSS (`src/*/style.css` import) | `.wp-block.has-skvn-button-hover.has-skvn-btn-hover-text .wp-block-button .wp-block-button__link:hover` | (0,6,0) |
```

Thay câu “Editor CSS không cần specificity cao — không có theme rules xung đột trong editor iframe.” (dòng 87) bằng:

```markdown
Editor iframe **có theme rules** khi theme gọi `add_editor_style()` (SKVN: `inc/setup.php` →
`add_editor_style( 'style.css' )`). Rule marker editor phải có specificity ≥ rule theme mạnh
nhất trên element đó, và `!important` đúng property khi preset theme khóa property đó bằng
`!important` (Quy tắc 1). Câu cũ “Editor CSS không cần specificity cao — không có theme rules
xung đột trong editor iframe” và số đếm `(0,2,1)` là sai; đã sửa trong WP6 (2026-11-23, plan 089/090).
```

Giữ đoạn “CSS vars vẫn inherit…” và Quy tắc 3–6 nguyên vẹn.

**(d) Quy tắc 7 mới** — đặt sau Quy tắc 6, trước Checklist:

```markdown
## Quy tắc 7 — Preset CTA/nút trong block plugin phải tích hợp Hover Colors (AP-16)

Nguồn: `.context/PITFALLS.md` AP-16 + DP-18; plan 089/090 (1.3.25 WP6). Áp dụng cho mọi task
thêm/thiết kế preset style cho `core/button` bên trong block plugin (template InnerBlocks,
class marketing như `skvn-cta`, slide content, collection card CTA).

1. `core/button` trong block plugin có hai owner hover: preset của block và extension
   `button-hover`. Hex trên artifact chỉ là fallback khi chưa có marker.
2. Marker editor và frontend không cùng element. Cấm gate chỉ bằng
   `:not(.has-skvn-btn-hover-*)` trên `.wp-block-button`. Rule custom phải có selector ancestor
   (editor) và selector self (frontend). Specificity của rule custom phải cao hơn preset và
   cao hơn rule theme đang vào iframe.
3. Panel Hover Colors hiện ra không phải nghiệm thu. Đổi màu, hover trong editor và trên trang
   đã Update, rồi xóa custom để preset hiện lại.
4. `onColorChange` / `onGradientChange`: `value === undefined` thì return. Chỉ xóa attribute
   kênh kia khi value mới là truthy.
5. Không dùng câu “iframe editor không có theme rule, specificity `(0,2,1)` là đủ”.
   So specificity với `style.css` của theme trước khi chốt selector.

Làm theo năm luật này và checklist DP-18 trước khi ship `:hover`, không chỉ sửa sau khi human phàn nàn.
```

**(e) Checklist cuối file** — thêm 4 dòng vào khối checklist:

```
[ ] Editor iframe: đã so specificity với theme style.css (add_editor_style), không giả định “không có theme rule”
[ ] !important chỉ trên property preset theme khóa !important, có comment bằng chứng
[ ] Preset core/button trong block: dual selector ancestor + self, marker-gated, hex artifact chỉ fallback (Quy tắc 7)
[ ] PanelColorGradientSettings: guard undefined, chỉ clear sibling khi truthy
```

### 5.4 `.context/PITFALLS.md` — chỉ bullet DP-18

Thêm **một bullet** ngay sau bullet “Phân tích (2026-11-23, chưa code)” của DP-18 (không xóa/sửa dòng cũ, không đụng AP-16):

```markdown
- **Fixed cascade preset theme (source <ngày code>, chưa build, chưa runtime PASS):** HMGP-009/010/011 — `src/core-controls/button-hover/style.css` và `modules/core-control/features/button-hover.php` nâng selector marker lên `(0,6,0)` (thêm `.wp-block` editor / `.has-skvn-button-hover` cả hai surface), `!important` chỉ trên `color`/`background`; `transition` giữ không `!important`. Contract Quy tắc 1–2 sửa cùng lượt + Quy tắc 7 (năm luật AP-16). Plan [089](.context/planning/089_VER_1_3_25_HOVER_MARKER_PRESET_CASCADE_REPAIR_PLAN.md) + [090](.context/planning/090_VER_1_3_25_WP6_HOVER_MARKER_CASCADE_EXECUTION_PLAN.md). Nút chưa marker giữ preset; `border-color` Step CTA vẫn của rule Step.
```

`<ngày code>` điền ngày thực thi; chỉ ghi “Fixed … source” khi source đã sửa, không ghi runtime PASS.

### 5.5 Inventory — cập nhật sau khi source sửa

- HMGP-009, HMGP-010, HMGP-011: `OPEN` → `FIXED`; notes thêm “source <ngày> (commit <hash>), chưa runtime PASS”; giữ toàn bộ notes reaudit.
- Thêm session line đầu file: ngày code + commit + “009/010/011 FIXED source, chưa runtime PASS; T1–T8 chờ human”.
- Không xóa hàng FIXED/N/A, không recycle ID, không thêm hàng mới nếu không có finding mới.

### 5.6 Runbook `docs/testing/wp6-hover-marker-cascade-1.3.25.md` (commit docs riêng)

Cấu trúc bắt buộc theo AGENTS onsite-first: target URL/page (human điền local `http://localhost:8080` + trang onsite có nút primary/white/text; trang fixture nếu chưa có), setup/preconditions (build hash, feature `button_hover` bật trong Core Control, theme SKVN active, nút đã Update), steps chính xác, expected, pass/fail, evidence human gửi lại. Cases:

| Case | ID mapping | Steps tóm tắt | Expected | Evidence |
|---|---|---|---|---|
| T0 | gate DOM | Sau build, mở editor, chọn nút có Hover Colors, DevTools tìm wrapper | Wrapper có `wp-block` + `has-skvn-button-hover` + marker kênh; rule `(0,6,0) !important` hiện trong Styles | Screenshot DOM + rule |
| T1 | HMGP-009 / 009-FE | Nút `skvn-button--primary` hoặc `is-style-skvn-primary`: đặt Text+Background, force `:hover` editor; Update trang, hover frontend | Hover đổi đúng màu panel cả hai surface; nghỉ giữ preset | Screenshot hover editor + frontend; DevTools rule thắng |
| T2 | HMGP-010 | Nút `skvn-button--white`: nghỉ → hover | Nghỉ trắng/chữ xanh preset; hover bg+text theo panel (kênh `!important`) | Screenshot nghỉ/hover cả hai surface |
| T3 | HMGP-010 | Nút `skvn-button--text`: nghỉ → hover | Nghỉ trong suốt; hover bg theo panel (kênh khóa) + text theo panel | Screenshot nghỉ/hover cả hai surface |
| T4 | HMGP-011 | Nút trong `.skvn-newsletter-band` **không** `is-style-skvn-primary`, force `:hover` editor | Hover theo panel, không còn nền accent band | Screenshot editor |
| T5 | HMGP-STEP | Step CTA `skvn-cta`: hover editor focused stage + frontend | Màu theo panel; **viền trong suốt** khi hover | Screenshot cả hai surface |
| T6 | HMGP-REST | Nút primary/white/text **chưa** bật Hover Colors: nghỉ + hover | Giữ nguyên preset, không rule marker nào khớp | DevTools không rule marker; screenshot |
| T7 | WP6-ACC-01 | Tab keyboard tới nút có Hover Colors | `:focus-visible` cùng màu hover | Screenshot focus |
| T8 | WP6-ACC-01 | Bật `prefers-reduced-motion: reduce` | `transition: none`, màu vẫn đúng | DevTools computed |

Pass/fail từng case ghi rõ; thiếu evidence → “Chờ kiểm chứng”, không PASS chung.

## 6. Thứ tự thực thi và atomicity

1. **Gate trước code:** xác nhận baseline khớp §4 (grep selector hiện tại; nếu theme/plugin đã đổi khác reaudit → DỪNG, ghi delta vào inventory + cuối 089, không code tiếp).
2. Sửa file 1 + 2 **cùng lúc** — pivot atomic: selector cũ mất và selector mới xuất hiện trong cùng commit (checklist contract “Pivot cơ chế specificity phải atomic”).
3. Sửa file 3 + 4 + 5 **cùng lượt** (089 §3 “Docs trong cùng lượt code”) — contract hết câu sai trước khi agent sau đọc lại.
4. Tạo runbook §5.6 — commit docs riêng (không trộn vào feature commit).
5. Commit feature đề xuất: `feature patch: WP6 hover marker cascade (0,6,0) + !important color/background (HMGP-009/010/011)` — đúng 5 file. Commit docs: `docs: WP6 runbook hover marker cascade 1.3.25`. **Không push** nếu chưa lệnh; không bump metadata.
6. Output lệnh build + PHP lint cho human (§9). Agent **không** tự chạy build/lint.
7. Human build → editor iframe nhận `build/style-index.ts.css` mới; PHP inline chạy ngay không cần build nhưng test sau build để hai surface cùng bản.
8. Human chạy T0–T8 → gửi evidence. Agent cập nhật inventory/runbook theo evidence; chỉ ghi PASS từng case khi có evidence; không kết luận onsite PASS thay human.

## 7. Requirement record (review contract)

Tất cả **Chưa làm** tại thời điểm lưu plan. Kế thừa ID của 089, không bỏ acceptance.

| ID | Nhóm | Hành vi mong đợi | Hiện trạng | Việc cần sửa | Cách kiểm | Evidence |
|---|---|---|---|---|---|---|
| HMGP-009 | Editor UX | Primary/secondary/`is-style-skvn-primary`: Hover Colors đổi nền/chữ trong iframe | Chưa làm — hòa `(0,4,0)`, thứ tự iframe quyết định | Selector editor `(0,6,0) !important` (§5.1) | T0/T1 | style.css 12–20; theme 189–214; chưa screenshot |
| HMGP-009-FE | Block UI | Cùng nút trên trang đã Update theo Hover Colors | Chưa làm — `(0,5,0)` đã thắng preset không `!important`, giữ lợi thế | Selector PHP `(0,6,0) !important` (§5.2) | T1 | button-hover.php 50–57; chưa onsite |
| HMGP-010 | Block UI + Editor UX | `--white`/`--text`: nghỉ giữ preset; hover theo panel kể cả kênh `!important` | Chưa làm — `!important` theme thắng marker | `!important` chỉ color/background (§5.1–5.2) | T2/T3 | theme 2361–2410 |
| HMGP-011 | Editor UX | Nút newsletter band không `is-style-skvn-primary`: hover editor theo panel | Chưa làm — base `(0,4,0)` hòa marker | Cùng rule editor 009 | T4 | theme 1436–1439; pattern 24–25 |
| HMGP-STEP | Block UI + Editor UX | Step CTA vẫn đổi hover, viền trong suốt | Chưa làm (không sửa file Step) | Không sửa; xác nhận không regression | T5 | step-slider style.css 291–332, editor.css 300–341 |
| HMGP-REST | Block UI | Nút chưa bật Hover Colors giữ preset | Chưa làm | Rule mới chỉ khớp khi đủ marker | T6 | index.tsx 164–166; PHP 119–121 |
| WP6-DOC-01 | Technical | Contract hết câu sai iframe/`(0,2,1)`; có ngoại lệ `!important` + Quy tắc 7 | Chưa làm | §5.3 | Đọc contract sau code; grep câu cũ = 0 hit | contract hiện tại dòng 21–25, 82–87 |
| WP6-DOC-02 | Technical | DP-18 có bullet trỏ plan + 2 file source | Chưa làm | §5.4 | Đọc DP-18 | PITFALLS DP-18 |
| WP6-DOC-03 | Technical | Inventory 009–011 FIXED source, chưa runtime PASS | Chưa làm | §5.5 | Đọc inventory | inventory hàng 009–011 |
| WP6-TECH-01 | Technical | Editor iframe nạp rule mới sau build; PHP lint sạch; không lệch build/source | Chưa làm | Human build + lint | Lệnh §9; DevTools T0 | build/style-index.ts.css hiện khớp source (reaudit) |
| WP6-ACC-01 | Editor UX + Block UI | `:focus-visible` cùng màu hover; reduced-motion tắt transition | Chưa làm | Cặp pseudo-class giữ nguyên; transition không `!important` | T7/T8 | style.css/PHP cặp selector |

**Content & States:** marker nền, marker chữ, cả hai, không marker; primary/white/text/newsletter/Step; nghỉ vs hover vs focus; gradient string trong `--skvn-btn-hover-bg` (shorthand `background` nhận gradient — hành vi giữ như cũ). **Accessibility:** focus-visible parity từng kênh. **Responsive/performance:** N/A — không đổi layout, không thêm listener/asset.

## 8. Acceptance checklist

- [ ] Selector editor + PHP khớp §5.1/§5.2 từng ký tự; `(0,6,0)`; `!important` chỉ trên `color`/`background`.
- [ ] `transition` + `prefers-reduced-motion` giữ nguyên, không `!important`.
- [ ] Theme `style.css`, GeneratePress, Step/Hero/slide, `index.tsx`/`attributes.ts` không đổi; không attribute/save mới (A5.10 N/A có xác nhận).
- [ ] Contract: grep “không có theme rules” / “0,2,1” = 0 hit; ví dụ đếm lại đúng; ngoại lệ `!important` + Quy tắc 7 (đủ 5 luật) + checklist mới.
- [ ] DP-18 thêm đúng 1 bullet; entry cũ giữ nguyên.
- [ ] Inventory 009–011 = FIXED source kèm ngày/commit, “chưa runtime PASS”; không xóa hàng.
- [ ] Runbook `docs/testing/wp6-hover-marker-cascade-1.3.25.md` tồn tại, đủ URL/setup/steps/expected/pass-fail/evidence.
- [ ] Feature commit đúng 5 file, pivot atomic; runbook commit riêng; không push/bump khi chưa lệnh.
- [ ] Human build + PHP lint có output; T0 xác nhận wrapper `.wp-block` + rule mới trong iframe.
- [ ] T1–T8 có evidence từng case; chỉ PASS khi evidence đạt; chưa kết luận onsite PASS trước đó.

## 9. Kiểm sau build (human)

CSS editor chỉ vào iframe sau build; PHP inline không cần build nhưng chạy cùng lệnh để bundle khỏi lệch:

```bash
source /home/shinkuro/.nvm/nvm.sh && nvm use 20 && cd /mnt/d/Github/skvn-marine/wp-content/plugins/skvn-marine-blocks && npm run build && find modules/ -name "*.php" -exec php -l {} \;
```

Không thêm runtime `require`/`include` → không cần `build-deploy-artifact`/zip audit cho WP6.

Chạy T0–T8 trong runbook (mỗi nút hai lần: chưa Hover Colors, rồi đặt Text và Background). Evidence gửi lại: screenshot hover editor + frontend (hoặc DevTools rule nào thắng `color`/`background`), build hash, console notes. Agent tiếp tục: cập nhật inventory/runbook theo evidence, phân tích case FAIL nếu có.

## 10. Rủi ro và rollback

| Rủi ro | Giảm thiểu |
|---|---|
| Wrapper editor thiếu `.wp-block` trên WP đích → rule không khớp | DOM evidence repo (lag ledger:52); gate T0 ngay sau build. Contingency **có ghi nhận, không tự sửa**: bỏ `.wp-block` → `(0,5,0)` vẫn thắng theme `(0,4,0)` và vẫn cần `!important` cho 010; quyết định lại với human nếu T0 fail |
| `!important` lan rộng | Chỉ 2 property; checklist + review grep `!important` trong 2 file = đúng 4 declaration (2 editor + 2 PHP) |
| Preset block sau này “đấu” `!important` | Quy tắc 7: preset phải dual-selector + var, không thêm `!important` đối kháng |
| Build lệch (editor CSS cũ trong iframe) | AP-06/AP-07: test sau build; T0 kiểm rule thật trong Styles, không chỉ grep source |
| `background` shorthand reset nền phụ | Hành vi giữ nguyên như rule cũ (cùng shorthand); gradient var vẫn hoạt động |

Rollback: revert commit feature → selector cũ `(0,4,0)`/`(0,5,0)` trở lại; hai chiều theo memo 089 §6. Contract/pitfall/inventory revert cùng nếu cần.

## 11. Tensions và điểm mở

- Không tension HIGH mới. Lệch contract “tránh `!important`” đã ghi trong memo 089 và được sửa câu contract cùng lượt code (§5.3b) — không âm thầm.
- **Diễn giải khóa file:** 089 ghi “Năm file. Không file thứ sáu.” cho phần repair. Runbook `docs/testing/` là testing artifact bắt buộc theo AGENTS onsite-first + review contract §4.6, nằm ngoài surface repair và đi **commit docs riêng**. Ghi rõ ở đây để human review; nếu human đọc khóa 089 nghiêm ngặt hơn, phương án thay thế là gộp nội dung runbook vào §9 plan này và bỏ file riêng — nhưng khi đó lệch AGENTS onsite-first, cần human quyết. Default: runbook riêng, commit riêng.
- Hướng B (gỡ `!important` theme) vẫn mở, chưa bị bác; không làm song song với A.
- Không digest `CONVENTION.md`; năm luật AP-16 chỉ vào contract CSS extension.

## 12. Không làm trong lượt lưu plan này

Không sửa CSS/PHP/contract/pitfall; không build/commit/bump; không đổi 009–011 sang FIXED; không chạy T0–T8. File này + pointer ở 089/MILESTONES/inventory là delta duy nhất của lượt lưu plan.

## 13. Execution record (2026-11-23)

- Human: “tiến hành” → CODE_NOW theo plan này, hướng A (default memo 089 §7).
- Gate baseline §6.1: **PASS** — source khớp reaudit trước khi sửa.
- Source: §5.1 + §5.2 applied atomic trong một commit. Verify: đúng 4 declaration `!important` (2 editor + 2 PHP) chỉ trên `color`/`background`; `transition`/reduced-motion không `!important`.
- Docs cùng lượt: §5.3 contract (7 vị trí edit), §5.4 bullet DP-18 — kèm marker đính chính “vẫn OPEN” trên bullet Phân tích (giữ nguyên dòng cũ theo convention pitfall), §5.5 inventory 009–011 FIXED source.
- Runbook §5.6 tạo mới, commit docs riêng.
- Feature commit: `08085b2` — đúng 5 file khóa của 089, nhánh `planning/1.3.25-wp6-hover-marker`. **Không push.**
- Diễn giải acceptance grep (§8): chuỗi “0,2,1” / “không có theme rule” còn xuất hiện trong ngữ cảnh **đính chính/cấm** (đoạn sửa Quy tắc 2, luật 5 Quy tắc 7, checklist mới) — không còn khẳng định sai nào giữ hiệu lực. Giữ quote có đánh dấu thay vì xóa theo convention đính chính của repo.
- `context-gen check-consistency`: tool không có trong `tools/` — không chạy được, ghi nhận.
- Chưa: build, PHP lint, T0–T8, runtime PASS, bump metadata. Human chạy lệnh §9 rồi gửi evidence; agent cập nhật inventory/runbook theo evidence.
- File prompt reaudit `docs/workflows/prompts/agent-handoff-1.3.25-wp6-hover-marker-reaudit.md` có edit sẵn của human (không phải lượt này) — giữ uncommitted, không trộn vào commit WP6.
