# Review 1.3.24 — Step Slider plan 085 (convention repair) — findings ledger

Ngày ghi: **2026-11-19**. Tác giả: agent (source review). **Chưa runtime PASS.** Không file nào bị sửa trong lượt review này.

Phạm vi review: source của plan 085 (`.context/planning/085_VER_1_3_24_STEP_SLIDER_CONVENTION_REPAIR_PLAN.md`) theo thứ tự A → F → B → C → D → E. Working tree `M` mới chưa commit so với HEAD `e1e160b` (mọi file dưới là dirty, không phải trạng thái deploy). Không review file out-of-scope (xem §6).

Anchora thiết kế để tránh drift khi sửa:

| Mốc | Vai trò | Nguồn |
|---|---|---|
| Artifact HTML | visual anchor cho bố cục (viewport, overlay trái đen, tab strip dưới, mũi tên, progress) | `.local/test-artifacts/Full screen step slider/Tạo-fullscreen-step-slider.html` và `.local/test-artifacts/Full screen step slider/gemini-code-1780920011530.html` (hai bản của cùng một artifact; **không** coi bản nào là bản duyệt nếu human chưa chốt) |
| Decision text animation | spec số preset slide / rise — **thắng** artifact khi xung đột | `docs/decisions/sliders/step-slider/step-slider-text-animation-1.3.24.md` (nguồn gốc file Downloads của human 2026-11-19) |
| 081 / 083 | chrome/runtime (viewport, autoHeight false, content height) + settings parity (textPosition/textSurface…) | `.context/planning/081_VER_1_3_24_STEP_SLIDER_FRONTEND_VISUAL_PLAN.md`, `083_VER_1_3_24_STEP_SLIDER_SETTINGS_PARITY_PLAN.md`, `docs/testing/step-slider-frontend-visual-delta.md` |

WP đích đối chiếu API/runtime component: **WP 7.1** (local `D:\Github\minhhaifish`, path WSL `/mnt/d/Github/minhhaifish`; plugin copy local cũ — chưa deploy 085).

**Đã đọc (convention, AGENTS 2026-11-19):** L0 (Chỉ mục + 0.1–0.5), A1, A2, A3, A5.2, A5.3, A5.6, A5.10, A5.11, A6, A7.3, A7.4, A9, Phụ lục 1 (Giao diện). Phân loại: sửa block đã phát hành + CSS frontend/responsive + Editor UI. Gate đã chạy: **không** (không build/lint/Editor).

Quy ước trạng thái: **Chưa làm / Đã có source / Chờ kiểm chứng / PASS / FAIL / Deferred / Blocker**. Không dùng DONE chung cho triển khai và nghiệm thu.

---

## 1. Blocker — phải sửa trước khi gọi là “source xong”

### R085-01 — `FocalPointPicker` không tồn tại trên `@wordpress/block-editor` (tường ranh A5.11 / DP-06)

- **File:** `src/step-slide/edit.tsx:2` (import), `:407` (sử dụng)
- **Bằng chứng runtime WP 7.1:**
  - `wp-includes/js/dist/block-editor.js`: `FocalPointPicker: () =>` → count **0** (kể cả min build `block-editor.min.js`)
  - `wp-includes/js/dist/components.js`: `FocalPointPicker: () =>` → count **1** (`focal_point_picker_default`)
  - `block-editor.js` dùng nội bộ `import_components.FocalPointPicker` nhưng **không re-export**.
- **Tác động:** branch `hasImage` (step có ảnh — phần lớn demo) render `undefined` → React “element type is invalid”; block không dùng được trong Editor. Import cũ đã ship ở HEAD; 085 chạm đúng file này (gói B, mở rộng import) nhưng bước A5.11 “đặt tên component từ runtime đích” không chạy cho **toàn bộ** import block.
- **Sửa đề xuất:** import `FocalPointPicker` từ `@wordpress/components`.
- **Kiểm chứng:** sau fix, mở Editor chọn ảnh trong một step-slide → focal picker hiển thị; console không lỗi element type.
- **Status:** source defect, đã đối chiếu runtime. Chưa ghi nhận runtime trên onsite nhưng theo source là fail chắc chắn.

### R085-02 — `select('core').getMedia(id)` — selector không tồn tại (A5.11)

- **File:** `src/step-slide/edit.tsx:152–157`
- **Bằng chứng runtime WP 7.1:** `core-data.js` / `core-data.min.js`: `getMedia` → count **0**; store selectors gồm `getEntityRecord`, `getEntitiesByKind`, `getRawEntityRecord`… nhưng **không** có `getMedia`. (`root/media` deprecated since 6.9, thay thế bằng `postType/attachment`.) REST attachment schema có `alt_text` (`wp-includes/rest-api/endpoints/class-wp-rest-attachments-controller.php:1455`, `:1725`).
- **Tác động:** `media` = `undefined` → `getMedia` undefined → TypeError trong `useSelect`; Editor crash trên mọi step có ảnh — cùng nhánh với R085-01. Type cast `as { getMedia:… }` làm TS im lặng.
- **Sửa đề xuất (một trong hai, ưu tiên (a)):**
  - (a) `select( 'core' ).getEntityRecord( 'postType', 'attachment', imageId )` rồi đọc `media?.alt_text`
  - (b) giữ typing đầy đủ: `select( 'core' ).getEntityRecord( … )` + `type MediaRecord = { alt_text?: string | null } | null`
- **Kiểm chứng:** sau fix, step có ảnh → placeholder ALT hiển thị alt attachment; thay ảnh → ALT flow giữ đúng một lần.
- **Status:** source defect, đã đối chiếu runtime. Cùng họ DP-06 (API bịa tên qua type cast).

**Điểm cần nói rõ cho human:** plan 085 ghi rõ “Trước commit: đối chiếu `wp.blockEditor` trên WP 7.1 (A5.11)” và handoff ghi “Nếu Editor báo export đó không có, dừng và gửi đúng danh sách key — không đổi sang `ColorGradientSettingsDropdown`.” Hai blocker chính là bằng chứng câu đó áp cho cả file (không chỉ component mới đổi import). Không được đánh `[x]` cho gate A5.11 đến khi chạy xong trên runtime có plugin deploy.

---

## 2. Minor / risk — không chặn merge nhưng phải ghi nợ

### R085-03 — JS palette walker không tôn trọng `color.defaultPalette` (lệch với PHP)
- **File:** `src/step-slider/edit.tsx` (`progressPaletteFromSetting`) vs `modules/step-slider-render/step-slider-render.php` (`skvn_marine_blocks_step_slider_palette_slugs`)
- **Vấn đề:** PHP chỉ thêm nhóm `default` khi `color.defaultPalette` không tắt; JS merge **cả ba** nhóm `theme + default + custom` vô điều kiện → editor hiện swatch default, PHP allowlist từ chối slug đó → lưu được slug nhưng frontend rơi về `#7ec8e3`, tức **editor nói một đằng, frontend render một nẻo**.
- **Luật:** AP-15, A6.2/A6.5, plan 083 §13.1.
- **Sửa đề xuất:** mirror `useSetting( 'color.defaultPalette' )` hoặc ẩn nhóm default tương tự.
- **Status:** source inconsistency — chưa kiểm chứng trên theme tắt default palette.

### R085-04 — `selectImage` ghi đè ALT custom cấp block vô điều kiện
- **File:** `src/step-slide/edit.tsx:163–173`
- **Vấn đề:** chọn lại ảnh (kể cả cùng ảnh) → `backgroundImageAlt` bị ghi đè bằng alt attachment; riêng A7.3 ưu tiên alt cấp block.
- **Sửa đề xuất:** chỉ ghi khi `attributes.backgroundImageAlt` rỗng **hoặc** bằng alt của attachment trước đó.

### R085-05 — Reduced-motion: progress tab chưa được dừng
- **File:** `src/step-slider/style.css:527–530`; `frontend.ts`
- **Vấn đề:** chua `transition: none` khi reduced-motion, `frontend.ts` vẫn có thể ghi `width`/CSS transition → “progress tab không chạy” chưa đạt.
- **Sửa/kiểm:** gating trong JS (không autoplay/tween) hoặc ghi chú miễn trừ nếu human chấp nhận.
- **Luật:** Decision 1.3.24 (Reduced motion tắt preset + progress tab); A3/079.

### R085-06 — Specificity của F presets
- **File:** `src/step-slider/style.css` (F block)
- **Vấn đề:** chuỗi selector 4–5 class (`is-ready:not([rise]) .swiper-slide-active ...`), vượt A3 “tối đa một class + một pseudo-class”. Cấu trúc này cần để thắng rule base `.is-ready … > *`; tương tự alignfull reset (A9.3) cần comment giải thích phiếu tầm vực.
- **Đề xuất:** comment ghi rationale tại selector (giữ nguyên số, không đổi kích thước/geometry), hoặc gộp `:is()` để giảm specificity nối.

### R085-07 — `mask-image: linear-gradient(to right, …)` — cạnh fade cạnh theo hướng vật lý, không RTL
- **File:** `src/step-slider/style.css` (tabs)
- **Ghi nợ:** RTL pass (ngoài 085). Không sửa `mask` (chỉ là fade); ghi trong ledger.

### R085-08 — Ledger “[x]” của gói chỉ là source verification
- **Vấn đề:** handoff 085 đánh `[x]` cho B/C/F… trong khi chưa build/lint/Editor. Nếu ghi vào evidence ledger step-slider-content-1.3.24.md, ghi rõ “source only”, tránh đọc thành PASS.

---

## 3. Đã kiểm và ĐÚNG — giữ nguyên, không “sửa dọn” thêm

| Hạng | Bằng chứng |
|---|---|
| DP-06 fix của gói | `__experimentalPanelColorGradientSettings` là **tên duy nhất** tồn tại trong `block-editor.js` (`PanelColorGradientSettings: () =>` count 0, kể cả min build). Fill import đúng tên đã chạy precedent `slide/edit.tsx` |
| Gói A — progress panel | `group="color"`, `disableCustomColors={false}` chỉ control này, clear → `#7ec8e3`, `useSetting( 'color.palette' )` một hook, `dwellPreset` fallback `'8'`, `pauseOnHover !== false`, `tabHeight` RangeControl + `allowReset` → 54 |
| Gói F — spec | Attribute `textAnimation` `enum slide|rise`, default `slide`; PHP `normalize_step_text_animation()` + `data-text-animation`; preset A `translateX(56px) 600ms 0/90/180`, preset B `translateY(24px) 550ms 0/100/200`; easing `cubic-bezier(0.22, 1, 0.36, 1)`; kicker `.wp-block-paragraph:first-child`; chỉ transform+opacity; inactive slide `opacity: 0` (text ra cắt ngay); copy mất khi JS không nạp vẫn đọc được (`.is-ready` chỉ do JS gắn, `frontend.ts`); đây là cách đúng |
| Gói F — alignment PHP | `skvn_marine_blocks_normalize_step_text_animation()` nhận `'rise'` hoặc `'slide'`, còn lại → `slide`; wrapper in đúng `data-text-animation="slide|rise"` |
| Gói C — ảnh | `wp_get_attachment_image('full')` (srcset/sizes/`width`/`height` do WP); index 0: `fetchpriority="high"`, **không** `loading="lazy"`; slide sau `loading="lazy"`; alt block thắng > alt attachment > **không** lấy title; legacy URL vẫn giữ `esc_url` + width/height nếu có metadata |
| Gói C — i18n | Tab `__( 'Step', 'skvn-marine-blocks' )` |
| Gói D — mobile-first | Base `top: 1rem`, cặp trái `2.25rem`; `@media (min-width: 641px)` → giữa stage `2.875rem`, `calc((100% - var(--skvn-step-slider-tab-height, 54px)) / 2)`; không `100vw` (duy nhất là comment); không `overflow-x` trên tổ tiên |
| Gói D — tab strip | `flex-wrap: nowrap; overflow-x: auto; mask-image` fade; PHP `tabindex="0"` + `aria-label="Steps"` (A2.4) |
| Gói E — DRY | Một bản radial editor (`default-fills.ts`) + PHP `skvn_marine_blocks_get_step_default_fill_gradient()` — đúng 2 bản; overlay chỉ ở `style.css`; `save.tsx` không sơn fill `[0]`; `src/index.ts` đăng ký `deprecated: stepSlideDeprecated` |
| Gói E — deprecated | `deprecated.tsx` copy nguyên save cũ (`background: LEGACY_DEFAULT_FILL` + overlay gradient inline) — A5.10 đúng thứ tự; markup cũ sẽ được nhận dạng bởi deprecated (cần verify sau build) |
| Slug→CSS var | JS `progressColorCss()` và PHP `skvn_marine_blocks_step_slider_progress_color_css()` cùng cho `var(--wp--preset--color--{slug},#7ec8e3)`; slug qua regex `[a-z0-9-]+` + allowlist palette; hex fallback `#7ec8e3` |
| Fallback currencies | `tabHeight` (number default 54, clamp 40–120), `dwellPreset`, `pauseOnHover`, `textAnimation` đều có fallback tường minh cho nội dung cũ (A5.11/A5.2) |
| 064 limit nội bộ | `:first-child` của kicker cụ thể hơn paragraph thường; thuộc spec (`slide`/`rise`), không phải hack |
| A1 progressive enhancement | No-JS: stack vertical, `copy` hiện đủ (`opacity` chỉ ẩn dưới `.is-ready`) |
| AP-15 | Không có hex palette riêng trong plugin; swatch lấy từ theme; panel `group="color"` giống core |
| Text ra/fade | fade Swiper 800ms + wipe 800ms **giữ nguyên** (không đụng) |
| Security | Không REST mới, không `$_POST`/`$_GET`; PHP sanitize/escape đầy đủ (`esc_url`, `esc_attr`, `esc_url_raw`, `absint`, `is_numeric`, `$wpdb->prepare` cho GET_LOCK/IS_USED_LOCK/RELEASE_LOCK) |

---

## 4. Artifact drift — vùng cần kiểm khi sửa sau này

Mỗi lần đụng `style.css` / `edit.tsx` / PHP render, so lại với artifact, **không sửa artifact theo code nhưng cũng không nương code theo số artifact mù**. Quy tắc khi xung đột:

1. Artifact là **visual anchor** (bố cục, trật tự tầng, tỉ trọng chữ, anchored dưới); **không** phải spec số (font Inter thay đổi theo attachment, `#111111` background, `#4ade80` progress, 5000ms dwell, wipe clip-path, enterRight `0.5s` không phải spec sản phẩm).
2. Số đo của spec/plan đã duyệt (079/081/083/085, decision text-anim) **thắng** artifact khi xung đột.
3. Mọi đổi layout ảnh hưởng khối `.skvn-step-slider`, `.skvn-step-slide__content`, `__tabs`, `__arrow`, overlay → kiểm lại tỷ lệ artifact bằng Brave/DevTools.

| Hạng | Artifact (visual anchor) | Source current (085) | Ghi chú |
|---|---|---|---|
| Khung | `height: 100vh/100dvh`, full-bleed, `overflow: hidden`, nền đen #111 | `min-height: 100svh`, `display:flex` cột, tab strip dưới (`081` spec, không phải 085) | 085 không đụng; acceptance phải kiểm **cùng hình** 390px vs 1440px |
| Overlay | `linear-gradient(to right, rgba(0,0,0,.65) 45%, transparent)` | Overlay SKVN: hai lớp gradient `rgba(4,12,20,…)` (081) | cú pháp artifact ≠ spec; **không** bắt chước lại artifat |
| Tab strip | fixed đáy, 72px, 4 cột, backdrop blur, has count | flex nowrap, `min-height` var `--skvn-step-slider-tab-height` (default 54), mask fade, `tabindex` | 085 chỉnh font-size số để vừa artifact xem; giữ min-height artifact không bắt buộc |
| Mũi tên | (artifact dùng swipe/loop, không thấy rõ arrows) | Artifact anchor cho hành vi; 085 chỉ đảo cascade mobile-first `top:1rem`/`2.25rem` → 641px giữa stage `2.875rem` | 081 đã khóa hình |
| Progress | `2px`, `#4ade80`, fill `linear forwards` | `--skvn-step-slider-progress-color` (default `#7ec8e3`), width giữa Tab | spec `transition: none` reduced-motion; xem R085-05 |
| Chữ vào | `enterRight` 0.5s ease, stagger 0/.1/.2 | `translateX(56px)` 600ms `cubic-bezier(0.22,1,0.36,1)`, delay 0/90/180; preset `rise` 550ms Y | spec decision thắng artifact |
| Text ra | exitLeft 0.45s | cắt ngay (`opacity:0`) khi mất `.swiper-slide-active` | spec decision thắng |
| Tab label | không animate | không animate | §1.4 decision cạnh |
| Fonts | Inter | SKVN font tokens auto-init (`--skvn-font-body` …) | không bắt chước font artifact |

---

## 5. Evidence còn thiếu (runtime) — không được cải PASS cho đến khi có

Commands (human chạy; agent không tự chạy):

```text
# Build + PHP lint
source /home/shinkuro/.nvm/nvm.sh && nvm use 20 && cd /mnt/d/Github/skvn-marine/wp-content/plugins/skvn-marine-blocks && npm run build && find modules/ -name "*.php" -exec php -l {} \;

# Sync sang runtime local (PowerShell, không /MIR)
robocopy "D:\Github\skvn-marine\wp-content\plugins\skvn-marine-blocks" "D:\Github\minhhaifish\wp-content\plugins\skvn-marine-blocks" /E /XD node_modules src

# Confirm block/step-slide registered (kỳ vọng ww bool(true))
wsl -d Debian -- wp --path=/mnt/d/Github/minhhaifish --allow-root eval "var_dump( WP_Block_Type_Registry::get_instance()->is_registered( 'skvn-marine/step-slide' ) ); var_dump( WP_Block_Type_Registry::get_instance()->is_registered( 'skvn-marine/step-slider' ) );"
```

Runtime cases bắt buộc:
- **B1/B2 fix xác nhận:** Editor mở từng step có ảnh → không lỗi, focal picker hoạt động, ALT placeholder hiện alt attachment.
- **Old content (E):** dán markup bài cũ (inline `background: radial-gradient(…fill[0])` + overlay gradient) vào Editor bản mới → không báo “invalid content” (kiểm `deprecated` trên **bundle build**, không chỉ source).
- **F:** `slide`/`rise` preset có số đo đúng (đo bằng DevTools Animation), spam tab last-wins, reduced-motion (chữ + progress đứng).
- **C:** HTML ảnh ID có srcset; ALT block thắng; index 0 không lazy.
- **D:** 390px vs 1440px (mũi tên cùng hình 081), tab dài cuộn ngang + mask fade, focus ring tab strip.
- **Deploy:** `build/` đang dirty/uncommitted — phải build mới deploy; **không deploy source chưa build** vì block type build cũ không có attribute `textAnimation`/`tabHeight` → giá trị bị drop khi validate, `deprecated` cũng không có.

---

## 6. Out-of-scope & ghi nợ (không chấm ở 085)

- 081 (viewport 100svh, `autoHeight:false`, `equalizeContentHeights`, `viewport.minHeight` JS, tab strip flex) — khác 085.
- 083 (`textPosition`/`textSurface` Inspector mới mở rộng trong cùng file) — dirty tree 1.3.24, không phải lỗi 085.
- RTL pass, caption/button `gap` pixel controls (plan 061 nếu có), full visual audit Brave — ngoài 085 review.
- `build/` artifacts, `wp-plugin.zip`, push.

---

## 7. Human decisions cần

1. **R085-03**: theme có được phép tắt default palette không? Nếu có, chốt hướng (ẩn nhóm default ở JS, hoặc cho phép lưu slug default bất chấp theme) — một quyết định dứt khoát để không lệch PHP.
2. **R085-02 hàm ý**: chọn `(a)` `postType/attachment` (modern suốt đời, ưu tiên) hay `root/media` (deprecated kể từ 6.9)?
3. **R085-05**: reduced-motion có cần dừng hẳn width progress trong JS, hay chấp nhận “nhảy tức thì” (hiện chưa dừng)?
4. **Artifact canonical**: `Tạo-fullscreen-step-slider.html` hay `gemini-code-….html` là bản artifact duyệt để đối chiếu visual?
5. **Deploy timing**: human có kế hoạch build + robocopy + kiểm onsite ngay không, trước khi gọi 085 source hoàn thành?

---

## 8. Cách dùng file này

- **Sửa theo thứ tự:** R085-02 → R085-01 (hai file cùng nhánh `hasImage`) → R085-03 → R085-04 → R085-05 → R085-06 → R085-07. Không gộp 083/081 vào lượt sửa 085.
- Sau mỗi nhóm sửa: ghi trạng thái mới (Chờ kiểm chứng → PASS) vào đây, **không** xoá lịch sử.
- R085-01/02 không giải quyết thì mọi acceptance 085 khác (F, B, C…) đều **không** được PASS — editor không tới được canvas để chạy.
- Trước khi đóng 085: build → robocopy → onsite check (Brave) với các case ở §5; cập nhật `docs/testing/step-slider-content-1.3.24.md` (hiện đang có [x] source-only).
- Mọi thay đổi bố cục có ảnh hưởng artifact (xem §4): cập nhật hàng tương ứng trong bảng drill, không sửa artifact.
