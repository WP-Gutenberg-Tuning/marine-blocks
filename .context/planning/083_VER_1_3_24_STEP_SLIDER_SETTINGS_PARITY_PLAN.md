# V1 / 1.3.24 — Step Slider: đối chiếu setting với SKVN Slider & artifact

Ngày: **2026-11-18**. **Sửa chiều cao 2026-11-19** (human): `content` san đều giữa tab — 081 §9; `autoHeight` per-slide không phải spec. Source: `autoHeight: false` + `equalizeContentHeights` (chưa runtime PASS).  
Status: **PLANNING** — human chốt §**Human decisions 2026-11-18** và **SS-DS-01** (2026-11-18, muộn; spec tại §13). **Phase A đã có source** 2026-11-18 (inspector + PHP reader). Chưa build, chưa PASS. Không còn blocker “chờ §13”. Bổ sung cho [079](079_VER_1_3_24_FULLSCREEN_STEP_SLIDER_EXECUTION_PLAN.md), [081](081_VER_1_3_24_STEP_SLIDER_FRONTEND_VISUAL_PLAN.md), [082](082_VER_1_3_24_STEP_SLIDER_EDITOR_UI_PLAN.md).  
Contract: [018](018_VERSION_1_3_10_FULLSCREEN_STEP_SLIDER_PLANNING.md). Delta sơn: `docs/testing/step-slider-frontend-visual-delta.md`.

### Human decisions 2026-11-18

Human đồng ý các hàng dưới, trừ Progress color: hàng đó được human sửa lại muộn cùng ngày (SS-DS-01, §13). Không dùng gợi ý slug-only của agent. Agent implement theo bảng này khi có lệnh code; không đổi O02-H, không copy Slider `syncViewportHeight`.

| Chủ đề | Chốt | ID |
|---|---|---|
| Tràn ngang / viewport | **(a)** Chỉ sửa geometry width (alignfull / Swiper / `width: 100%`); **không** đo header, **không** `viewport-below-header` | SS-ISS-GEO-01 |
| Màu nền không ảnh | **(B)** Chỉ per-step: default 4 gradient + custom fill; **không** thêm hex parent toàn slider trong 1.3.24 | SS-ISS-COL-02 |
| Text position | **(C)** Default `left`; `center` / `right` giữ trong inspector (advanced); paint artifact = left | SS-SET-01 |
| `overlayPreset` legacy | **(B)** Giữ attribute, không UI; chỉ `overlayOpacity` + overlay gradient 081 | SS-SET-02 |
| Progress color | Giữ attribute `progressColor`. Giá trị là **slug palette hoặc hex**. UI là palette + color picker, không ô gõ hex. Picker custom của riêng control này **bỏ qua** `theme.json` `color.custom: false`. Default giữ `#7ec8e3`. Không migrate, không đổi tên attribute, không cấm hex progress. Spec §13 | SS-SET-03 / SS-DS-01 |
| Focal | **(B)** Ưu tiên stage 082; sidebar chỉ khi cần a11y | SS-SET-04 |
| Thứ tự lượt code | **1 → 081** (frontend visual) **→ 2 → Phase A** (inspector) **→ 3 → 082** (editor stage). Human 2026-11-20: dải step dưới khung 16:9, không rail trái | SS-SEQ-01 |
| Chiều cao `content` giữa các tab | **San đều** = bước cao nhất. Đổi tab không đổi height hộp. `autoHeight` per-slide **không** phải spec. Source: `autoHeight: false` + `equalizeContentHeights` (chưa runtime PASS). Tab height 54px là control riêng. Spec 081 §9. | SS-ISS-HGT-01 |

Geo (a) **không** đóng tension OPEN 15:43; vẫn DỪNG nếu task khác đòi đo header cho Step.

**2026-11-19 — SS-SET-07** (human): COL-02 (B) vẫn cấm hex nền phẳng trên slider cha. Thư viện fill preset là việc khác: Deep Marine 4 màu, preset khách là danh sách 1–8 slot, slide `index` lấy slot `index % L`, ô trống lấy Deep Marine tại `index % 4`. Slider chỉ lưu slug `fillPreset`. Contract: `docs/decisions/sliders/step-slider/step-slider-fill-preset-1.3.24.md`. Chưa implement.

**Mục tiêu:** Chọn setting nào **mượn ý từ Slider**, setting nào **giữ riêng Step Slider**, và tách **thiếu control trong editor** khỏi **lệch chrome so artifact** (không phải thiếu attribute Slider).

---

## 1. Nguyên tắc chọn setting

| Quy tắc | Nguồn |
|---|---|
| Step Slider **không** copy panel Navigation / Pagination / Presentation / Motion của Slider | 082 § đầu; 079 §3 |
| Transition fade + wipe + text cascade **khóa số**, không thành control | 079 §8; 018 O08 |
| Không `heightPreset` Medium/Tall/viewport-below-header; chỉ `heightMode` viewport \| content | 018 O02-H, O02-C |
| Không parallax / `slidesPerView` / carousel breakpoint | 018 O03; 079 §3 |
| UI plugin **tiếng Anh**. Progress là palette slug hoặc hex custom trên một control; không `TextControl` | 083 §13; AGENTS Product language |
| Artifact chỉ soi **paint/chrome**; không kéo B về A khi trái khóa C (O09, O10, số 800ms…) | Delta § A khác C |

**Kết luận ngắn:** Parity với Slider là **cùng pattern kỹ thuật** (focal, fill, governed dwell, autoplay coordinator), **không** là cùng bộ Inspector.

---

## 2. Ma trận Slider → Step Slider

Chú thích: **Adopt** = cùng semantics hoặc shared helper; **Step-only** = attribute riêng; **Locked** = hằng số/implement cố định; **Reject** = không đưa vào Step Slider; **Deferred** = sau 1.3.24 hoặc cần human.

### 2.1 Parent (`skvn-marine/slider` → `step-slider`)

| SKVN Slider | Step Slider hiện tại | Quyết định | Ghi chú |
|---|---|---|---|
| `autoplay` | `autoplay` | **Adopt** | Mặc định On (giai đoạn 2). 1 bước: runtime tắt autoplay/loop/nav tương tự Slider 1 slide |
| `autoplayDelay` (5/7/9/12s) | `dwellPreset` (5/8/10s) | **Step-only** | Không gộp một control; dwell = dwell bước sau transition, không đổi sang 7s Slider |
| — | `pauseOnHover` | **Step-only** | Slider dùng pause chung Swiper; Step có toggle riêng (018 O09) |
| `loop` | `loop` | **Adopt** | Cùng semantics O07 |
| `showArrows`, `arrowStyle`, `arrowPosition` | Hai nút cố định (PHP + CSS) | **Reject** (control) | Chrome theo 081 + artifact manual; **không** minimal/circle/pill/side-center |
| `showPagination`, `paginationStyle`, `paginationPosition` | Thanh tab (`tabLabel`) | **Reject** (control) | Điều hướng = tab + mũi tên, không dots/fraction/timed-* |
| `transitionStyle`, `transitionDuration` | — | **Locked** | 800ms; không attribute (079 §8) |
| `contentMotion` | Cascade cố định | **Locked** | stagger/fade cố định theo thứ tự heading→…→buttons |
| `effect` (legacy) | — | **Reject** | Step không lưu legacy effect |
| `heightPreset` (5 giá trị) | `heightMode` viewport \| content | **Step-only** | Không import default/medium/tall/viewport-below-header |
| `slidesPerView`, `responsiveSlides` | Luôn 1 bước visible | **Reject** | |
| `preset` (hero/card…) | Không variation preset | **Reject** | Một block Fullscreen Step. Khác `fillPreset` (SS-SET-07): thư viện nền, không phải biến thể hero/card |
| `enableParallax` + nhóm parallax | Không | **Reject** | 018 O03 |
| `align` wide/full | `align` default full | **Adopt** (support) | Toolbar Gutenberg, không panel riêng |
| — | `progressColor` | **Step-only** | Một màu toàn slider. Cùng attribute lưu slug palette **hoặc** hex. Không attribute thứ hai. Spec §13 |

### 2.2 Child (`skvn-marine/slide` → `step-slide`)

| SKVN Slide | Step Slide hiện tại | Quyết định | Ghi chú |
|---|---|---|---|
| `backgroundImage*` | Có | **Adopt** | Shared pattern MediaUpload |
| `backgroundImageFocalPoint` | Có + picker trên canvas khi có ảnh | **Adopt** | `src/slide/focal.ts`; 081/018 O03 |
| `overlayOpacity` (0–80, bước 5) | `overlayOpacity` (0–100) + gradient cố định editor | **Partial** | 081: overlay hai gradient artifact; **không** rgba phẳng theo preset cũ |
| — | `overlayPreset` light/medium/strong | **Deprecate UI** | Còn schema; PHP chỉ opacity; 081 bỏ preset khi sơn — cần chốt migration |
| `backgroundFillMode` / color / gradient | Có (default 4 gradient theo index) | **Adopt** | Dùng `src/slide/fill.ts`; Hero navy ≠ step defaults |
| — | `textPosition` left/center/right | **Adopt** (cần UI) | Runtime có; **chưa Inspector** — xung đột artifact (cột trái) §5 |
| — | `textSurface` | **Adopt** (cần UI) | Runtime có; **chưa Inspector** |
| — | `tabLabel` | **Step-only** | Inline RichText (018 O04); 082 đưa lên stage |
| InnerBlocks (heading, paragraph, buttons) | + list, allowlist hẹp | **Step-only** | Không copy full slide template |

### 2.3 Slider có, Step chưa cần trong lượt settings

| Nhóm Slider | Lý do không port |
|---|---|
| Governed transition duration UI | Khóa 079 §8 |
| Arrow/pagination coupling (flank cluster) | DOM tab khác hẳn |
| `contentMotion` user choice | Cascade là signature Step, không toggle |
| Parallax edge blur / advanced depth | Không product scope Step |
| Content Actions trên slider attrs | `SLIDER_FIELDS` rỗng; Step tương tự style/behavior |

---

## 3. Hiện trạng attribute vs Inspector

### 3.1 Parent `step-slider` — đã có UI

| Attribute | Panel (hiện tại) |
|---|---|
| `heightMode` | Layout |
| `progressColor` | Progress bar (TextControl hex) |
| `autoplay`, `pauseOnHover`, `dwellPreset`, `loop` | Autoplay |

**Thiếu so 082:** Header badge trên canvas (`Autoplay on · 8s · Loop on`) — UX editor, không attribute mới.

### 3.2 Parent — không cần thêm từ Slider

Không mở panel Navigation / Pagination / Presentation / Motion. Không `transitionStyle`, không `slidesPerView`.

### 3.3 Child `step-slide` — attribute có, UI thiếu hoặc lệch

| Attribute | block.json | Inspector | Frontend PHP/CSS |
|---|---|---|---|
| `backgroundImage*` | ✓ | Background (upload) | ✓ |
| `backgroundFillMode` + custom | ✓ | Background | ✓ (editor); PHP fill TBD sơn 081 |
| `backgroundImageFocalPoint` | ✓ | Canvas khi có ảnh (không sidebar) | ✓ vars `--skvn-slide-bg-pos-*` |
| `overlayOpacity` | ✓ | Background | ✓ (lớp đơn); 081 đổi sang gradient artifact |
| `overlayPreset` | ✓ | **Không** | **Không dùng** (legacy normalize) |
| `textPosition` | ✓ | **Không** | ✓ class `is-position-*` |
| `textSurface` | ✓ | **Không** | ✓ `--surface` |
| `tabLabel` | ✓ | Inline header | ✓ tab button text |

**Việc settings rõ ràng thiếu (editor), không phải “copy Slider”:**

1. **Layout (per step):** `textPosition`, `textSurface` — ToggleControl + Radio/Select (tiếng Anh).
2. **Overlay:** chỉ `overlayOpacity` (0–100); bỏ expose `overlayPreset` hoặc ghi deprecated trong plan migration.
3. **Focal:** giữ trên stage (082) hoặc thêm subsection Background — không bắt buộc trùng vị trí Slider Inspector.

### 3.4 Child — đã có UI, khác Slider

| | Slider slide | Step slide |
|---|---|---|
| Overlay UX | Đơn lớp + opacity | Dual gradient constant + opacity (081) |
| Fill default | Hero navy | 4 radial theo `stepIndex % 4` |
| Apply background to other slides | Hero only | Có thể defer (không có trong 081) |

---

## 4. Artifact vs setting — tách hai luồng

Nhiều lệch so `step-slider-prototype.html` **không** giải bằng cách thêm control Slider.

| Delta (visual) | Loại | Hướng xử lý trong planning |
|---|---|---|
| Thanh tab pill rời vs dải liền + số `01` | **Chrome / PHP markup** | 081 §1–4; không attribute Slider |
| Progress vị trí/màu (#3ddc84) | **Chrome + `progressColor`** | Màu đã có attribute; vị trí = CSS; không `paginationStyle` |
| Play pill vs vòng tròn | **Chrome + O09** | Không setting; giữ hidden until focus |
| Mũi tên glyph vs SVG, mobile góc trái | **Chrome** | Không `arrowStyle`; vị trí theo artifact manual, khóa 081 |
| Cột `max-width: 46rem` | **Layout token / CSS** | Không map `heightPreset`; có thể **không** expose nếu vẫn tôn `textPosition` center/right (delta § Việc agent sau đo #2) |
| Nền không ảnh 4 gradient | **Fill default** | `backgroundFillMode: default` giữ trên từng step. Palette và cách lặp: SS-SET-07, decision `docs/decisions/sliders/step-slider/step-slider-fill-preset-1.3.24.md`. Không phải variation `preset` của Slider |
| Overlay sibling luôn có | **DOM + CSS** | 081; `overlayOpacity` 0 = tắt |
| Heading màu theme/WindPress | **Theme surface** | Ngoài block settings; runbook đo computed |

**Rule:** Trước khi thêm setting mới, ghi rõ: (a) attribute mới, (b) chỉ sơn/CSS, (c) chỉ editor chrome 082.

---

## 5. Quyết định settings — đã chốt (2026-11-18)

| ID | Quyết định |
|---|---|
| SS-SET-01 | **C** — default left; center/right trong panel `Step layout` |
| SS-SET-02 | **B** — `overlayPreset` legacy, không UI |
| SS-SET-03 | **SS-DS-01 đã chốt.** `progressColor` giữ tên và default `#7ec8e3`. UI: palette theme + picker hex, picker này không đọc `color.custom`. Không `TextControl`. Không migrate. Chi tiết §13.1 và bảng cấm §13.4 |
| SS-SET-04 | **B** — focal trên stage; focal sidebar deferred |
| SS-SET-05 | Khi **082**: panel `Step layout` (text position + text surface); Background: fill + overlay opacity |
| SS-ISS-GEO-01 | **(a)** — geometry ngang only; xem block Human decisions ở đầu file |
| SS-ISS-COL-02 | **(B)** — không parent hex nền không ảnh trong 1.3.24 |
| SS-SEQ-01 | **081 → Phase A → 082** |
| SS-SET-06 | Step chưa ảnh: tab kế thừa nền của slide (gradient default hoặc custom fill). **Human 2026-11-20:** step có ảnh vẫn nhận màu đó trên tab. Ảnh chỉ ở slide. Thanh tối chỉ còn khi fill là transparent. |
| SS-SET-07 | **Human 2026-11-19.** Thư viện fill preset trong sidebar Marine Blocks. Deep Marine = 4 radial gốc, trong code, slug `deep-marine`, không xóa. Preset khách: option `skvn_marine_blocks_step_fill_presets`, danh sách 1–8 slot kể cả ô trống, slide `index` lấy slot `index % L`. Slot trống lấy Deep Marine tại `index % 4`, không lấy xám tab, không nén ô trống. Slider chỉ lưu `fillPreset`. Thiếu slug thì Deep Marine. **Human 2026-11-20:** step có ảnh vẫn nhận preset trên tab; ảnh ở trên slide. Custom fill trên step vẫn đè và đi theo step. Không cắt “N màu đầu”. Contract: `docs/decisions/sliders/step-slider/step-slider-fill-preset-1.3.24.md`. Source implement 2026-11-19 (chưa build/runtime PASS). |

Không thêm attribute parent cho màu nền flat toàn slider (COL-02 B). SS-SET-07 không mở hex đó: parent chỉ lưu slug preset. Custom fill vẫn trên từng `step-slide`.

---

## 6. Danh sách setting đề xuất bổ sung (chỉ editor/runtime đã có schema)

**Phase A — Inspector parity schema (ưu tiên cao).** Trần “≤3 file” không còn đủ cho progress: reader PHP hiện chỉ nhận hex, nên lượt progress phải sửa PHP cùng `edit.tsx`. Không thêm attribute.

| Block | Control mới / chỉnh | Attribute |
|---|---|---|
| `step-slide` | Radio: Text position (`left` / `center` / `right`), panel Step layout | `textPosition` |
| `step-slide` | Toggle: Text surface | `textSurface` |
| `step-slider` | Bỏ `TextControl`. Palette + color picker hex theo §13.1 | `progressColor` (không đổi tên, không đổi default) |

File khi có lệnh code Phase A:

- `src/step-slide/edit.tsx` — radio + toggle. Class frontend đã có.
- `src/step-slider/edit.tsx` — thay progress UI; preview trên wrapper dùng cùng quy tắc xuất màu §13.1.
- `modules/step-slider-render/step-slider-render.php` — sanitizer nhận slug **và** hex; inline style theo §13.1.
- `src/step-slider/block.json` — không đổi default `#7ec8e3`, không thêm key.
- `src/step-slider/style.css` — giữ fallback `#7ec8e3` trên `--skvn-step-slider-progress-color`. Không đổi fallback thành slug.

Không sửa `theme.json`. Không sửa `src/step-slide/edit.tsx` phần fill để bật custom. Không sửa `src/slide/fill.ts`.

**Phase B — Frontend visual (081, không mở thêm Slider attrs)**

- Overlay gradient + opacity; tab markup số bước; progress geometry; mũi tên SVG/mobile — **không** thêm setting Slider.

**Phase C — Editor chrome (082)**

- Playback panel gộp `pauseOnHover` (đã có); badge dwell; dải step dưới stage đọc `tabLabel`. Human 2026-11-20 bỏ rail và thumbnail.
- Không import Slider panels.

**Không đưa vào Step Slider (chốt trong plan này):**

`showArrows`, `arrowStyle`, `arrowPosition`, `showPagination`, `paginationStyle`, `paginationPosition`, `transitionStyle`, `transitionDuration`, `contentMotion`, `heightPreset` (slider), `slidesPerView`, `responsiveSlides`, `preset`, toàn bộ parallax, `effect`.

---

## 7. Đối chiếu nhanh: Slider Inspector panel → Step

| Panel Slider | Step tương đương |
|---|---|
| Playback | **Autoplay** (+ dwell thay autoplay duration, + pauseOnHover) |
| Navigation | **Tab bar** (label per step) + fixed arrows — **không panel** |
| Pagination | **Tab progress** dwell — **không panel** |
| Presentation | **heightMode** only; transition/cascade **locked** |
| Motion (parallax) | **Không** |
| (Slide) Background | **step-slide** Background + stage focal |
| (Slide) — | **step-slide** Step layout (đề xuất): text position, surface |

---

## 8. Phân tích tiếp theo (artifact + UI)

Checklist cho phiên sau **trước khi code settings/visual**:

1. **Đo live** (delta §2026-11-17 browser): rect tab bar, progress, arrows @390px và desktop; xác nhận tràn ngang — không gán thiếu setting Slider.
2. **Fixture editor:** 4 bước — có/không ảnh, `textPosition` × 3, `textSurface` on/off, `heightMode` content — screenshot Inspector sau Phase A.
3. **SS-SET-01:** human chọn A/B/C — ảnh hưởng có expose `textPosition` hay chỉ CSS artifact.
4. **082 + 083:** Khi implement rail, map sidebar: parent Playback vs child Background/Step layout; không duplicate focal ở hai panel (SS-SET-04).
5. **Onsite heading contrast** — theme/WindPress; ghi runbook riêng, không thêm color control block trừ khi human mở scope.

Evidence cập nhật: append mục vào `docs/testing/step-slider-frontend-visual-delta.md` hoặc runbook `docs/testing/step-slider-content-1.3.24.md` — **không** đánh PASS.

---

## 9. Liên kết milestone & tension

- Milestone pointer: **1.3.24** Fullscreen Step Slider (PLANNED).
- **O02-H:** không viewport-below-header từ Slider — plan này **không** đề xuất import.
- Tension OPEN 2026-11-17 15:43 (header offset): **không** giải bằng setting Slider; chờ theme tách GP.
- 082: editor UI độc lập; plan này **bổ sung** panel child thiếu. Khung canvas theo decision 2026-11-20: dải step dưới stage 16:9, không rail trái.

---

## 10. Acceptance plan (tài liệu)

- [x] Human chốt SS-SET-01–05, GEO-01 (a), COL-02 (B), SS-SEQ-01 (2026-11-18).
- [x] Human chốt SS-DS-01 (2026-11-18, muộn): progress = slug hoặc hex trong `progressColor`; default `#7ec8e3`; picker custom bỏ qua `color.custom` chỉ trên control này; không migrate. Spec §13.
- [ ] Ma trận §2 được agent load khi task “step slider settings” — không tự mở panel Slider.
- [ ] Mọi control mới nằm trong file allowlist §6 (Phase A gồm PHP reader progress).
- [ ] Không attribute mới ngoài schema đã có trong §6 trừ khi human sửa plan này.
- [x] Lệnh code Phase A — 2026-11-18 muộn. Source: `step-slide/edit.tsx`, `step-slider/edit.tsx`, `step-slider-render.php`. Chưa build, chưa PASS.

**Sổ lỗi 1.3.24:** **§12** (thay scratch `MILESTONE_1324_NOTES.md`, đã xóa). Implementation theo **O02-H + O02-C + tension**, không copy Slider viewport-below-header trừ khi human đóng tension 15:43.

---

## 11. Nguồn đã thay thế (scratch notes — retired)

Scratch `.context/MILESTONE_1324_NOTES.md` (2026-11-18) **không phải spec**. Nội dung hợp lệ nằm ở **§12** và **§13**. File scratch nếu còn trên đĩa chỉ là stub trỏ về plan này. Agent không implement theo scratch.

**Lỗi phân loại trong scratch (không dùng làm spec):**

| Scratch ghi | Vì sao sai / lệch |
|---|---|
| Copy `syncViewportHeight` + `.skvn-step-slider--height-viewport-below-header` ngay | Trái **O02-H** + **TENSIONS_OPEN 15:43** (HIGH, DỪNG). |
| Sửa `build/view.ts.js` | File là **Slider** (`src/slider/view.ts`), không phải Step (`build/frontend.ts.js`). |
| “Thêm `100vh` / viewport thực tế như Slider” | Không thay `100svh` đã chốt; không đồng nghĩa fix bug tràn ngang. |
| Summary vừa fix header ngay vừa “below-header sau GP” | Mâu thuẫn nội bộ trong cùng một file. |

Human chỉnh yêu cầu chi tiết trên **§12 → cột Human quyết**; agent code khi có lệnh và decision đã điền.

---

## 12. Đăng ký lỗi / nghi vấn — phân tích chi tiết (Step Slider 1.3.24)

Ngày: **2026-11-18**. Trạng thái tổng: **Chưa PASS runtime** — phần lớn **Chờ kiểm chứng onsite** hoặc **Chờ human quyết**.

Evidence chính: `docs/testing/step-slider-frontend-visual-delta.md` (đặc biệt § browser 2026-11-17), source dưới `wp-content/plugins/skvn-marine-blocks/src/step-slider/`, `step-slide/`, `modules/step-slider-render/`.

### 12.1 SS-ISS-GEO-01 — Tràn ngang / khối rộng hơn viewport

| Mục | Nội dung |
|---|---|
| **Triệu chứng (human/scratch)** | “Viewport tính sai”, nội dung tràn, không hiển thị đúng. |
| **Phân loại** | **Geometry width** — **không** chứng minh được chỉ do thiếu header offset. |
| **Hiện trạng source** | Plugin đặt `.skvn-step-slider { width: 100% }`. Theme đã có luật trung hòa alignfull trong canvas (`style.css` khoảng dòng 1007: `width: 100%`, margin 0) nhưng **thua** rule inline của GeneratePress. Không offset header (đúng O02-H). |
| **Evidence 2026-11-19** | `test-page-2`, viewport 1920, `clientWidth` 1905. Cả hai slider: rộng **1985px**, `x = -40`, `margin-left: -40px`, `margin-right: 0`. `scrollWidth` 1945. Rule thắng: `body:not(.no-sidebar) .entry-content .alignfull` → `width: calc(100% + 80px)`. Body có cả `skvn-full-width-canvas` và `right-sidebar`. Mũi tên prev `x = -24` (hầu hết ra ngoài), next chỉ lộ khoảng 22px. Tab đầu bị cắt mép trái. |
| **Nguyên nhân đã đo** | (1) **Đúng.** GP inline thắng theme. Width `calc(100% + 80px)` trên `.entry-content` vốn đã rộng 1905px, chỉ kéo `margin-left: -40px`, `margin-right` vẫn 0. (2) Scrollbar 15px không phải 80px thừa. (3) Không phải chuỗi `height: 100%`. |
| **Không làm (trừ human đổi O02-H)** | Copy `syncViewportHeight` từ `src/slider/view.ts`, class `viewport-below-header`, đo `#masthead` cho Step. |
| **Cách kiểm** | DevTools: `getBoundingClientRect()` trên `.skvn-step-slider`, `.swiper`, `.alignfull` parent; so `clientWidth` viewport vs `document.documentElement.clientWidth`; thử page không admin bar. |
| **Cách sửa** | Một owner chiều ngang. Nâng specificity luật theme đang có để thắng rule GP trên canvas này: `width: 100%`, `margin-left: 0`, `margin-right: 0`. Không `overflow-x`, không `100vw`, không đo header. Sau khi width về 1905, đo lại mũi tên và tab trước khi sửa CSS của chúng. `swiper.updateSize()` chỉ khi width đã đúng mà Swiper vẫn giữ 1985. |
| **Human quyết** | `[x]` **(a)** 2026-11-18 — chỉ geometry ngang. ~~(b)(c)~~ không chọn. |

**Retired misread:** Scratch coi đây là “thiếu viewport-below-header như Slider” — **rejected** theo O02-H.

---

### 12.2 SS-ISS-GEO-02 — Chiều cao khung vs header site (đã chấp nhận theo contract)

| Mục | Nội dung |
|---|---|
| **Triệu chứng** | Block cao full `100svh` trong khi header GP + admin bar chiếm thêm → tab nằm dưới mép màn, cảm giác “tràn dọc”. |
| **Phân loại** | **Expected behavior** theo O02-H, không bug nếu đúng spec. |
| **Hiện trạng** | `style.css`: `.swiper`, `.swiper-slide`, `.skvn-step-slide__content` đều `min-height: 100svh` (trừ `--height-content`). |
| **Khóa** | 018 O02-H; delta §2026-11-17 15:43. Đồng bộ header với bước → **sau** theme tách GeneratePress. |
| **Human quyết** | `[ ]` Giữ O02-H. `[ ]` Đổi contract (cần sửa plan 018 + đóng tension). |

---

### 12.3 SS-ISS-HGT-01 — “Chiều cao step rất thấp” (editor vs frontend)

| Mục | Nội dung |
|---|---|
| **Triệu chứng (human/scratch)** | Bước trông thấp như mobile; web view phải sửa. |
| **Phân loại** | Có thể **tách 3 mặt** — chưa merge một fix. |
| **A — Editor** | `editor.css`: media `min-height: 96px`, ảnh `max-height: 260px`, content `min-height: 0` — **không** preview `100svh`. Đúng 079 (không Swiper editor) nhưng **dễ hiểu nhầm** là lỗi frontend. Plan **082** rail/stage chưa implement. |
| **B — Frontend `heightMode: viewport`** | Đúng spec: tối thiểu một small viewport. Không tự thêm `100vh` song song `100svh` trừ khi human đổi spec. |
| **C — Frontend `heightMode: content`** | Spec 081 §9 (**sửa 2026-11-19**): không `100svh`; cao theo nội dung rồi **mọi tab cùng một chiều cao** = bước cao nhất. Đổi tab **không** đổi chiều cao hộp. Source: `equalizeContentHeights` + `autoHeight: false` (chưa runtime PASS). |
| **D — Swiper `autoHeight`** (079 §8) | Trước đây `autoHeight: true` resize theo slide active — **không** phải spec. Đã tắt; san đều `min-height` theo bước cao nhất. QA đổi bước ngắn ↔ dài **FAIL** nếu hộp vẫn đổi height. |
| **Cách kiểm** | Cùng URL: `data-height-mode`; đo chiều cao **hộp slider** khi đổi tab (phải giữ nguyên ở `content`); viewport vẫn `min-height: 100svh` không trừ header. |
| **Human quyết** | `[ ]` Mô tả surface (editor / frontend / URL / heightMode). `[ ]` Ưu tiên 082 editor chrome vs CSS frontend. |

**Retired misread:** Scratch đề xuất `100vh` + copy Slider viewport — **không** áp dụng trước khi phân biệt A/B/C/D.

---

### 12.4 SS-ISS-HGT-02 — Chuỗi min-height xếp chồng

| Mục | Nội dung |
|---|---|
| **Vấn đề kỹ thuật** | Cùng lúc: `.swiper` min 100svh, `.swiper-slide` min 100svh, `.skvn-step-slide__content` min 100svh + padding đáy lớn (`clamp(6.5rem, 17vh, 9.5rem)`) để chừa tab. |
| **Rủi ro** | Viewport: slide “ngắn” vẫn ép cao tối thiểu 3 lớp. Content: QA đổi tab phải giữ nguyên height hộp (source đã equalize, chưa runtime PASS). |
| **Liên quan Pitfall** | PITFALLS Slider #2 (100% height chain) — **khác surface** nhưng cùng loại “ai own chiều cao”. Step owner = min-height trên slide/content, không `height: 100%` trên root không explicit. |
| **Fix có thể** | Chỉ sau human spec: gom min-height về một layer (ví dụ chỉ `.swiper-slide`), giữ tab absolute `bottom: 0`. |
| **Human quyết** | `[ ]` Giữ triple min-height. `[ ]` Refactor ownership (mô tả layer mong muốn). |

---

### 12.5 SS-ISS-COL-01 — Progress color: TextControl thay vì picker

| Mục | Nội dung |
|---|---|
| **Triệu chứng** | Marketing phải gõ hex thủ công. |
| **Hiện trạng** | Source editor đã là palette + picker (§13.1), chưa build nên onsite chưa thấy picker. Live 2026-11-19 vẫn là default `#7ec8e3` (`rgb(126, 200, 227)`), vạch 2px dính mép trên tab. Đó là default đã chốt, không phải lỗi “còn ô hex”. |
| **Contract** | SS-DS-01 / §13.1. Tension 13:36 vẫn cho hex **progress**. Hex nền không ảnh parent đã đóng bởi COL-02 (B). |
| **Việc code (khi lệnh)** | Bỏ `TextControl`. Palette + picker hex theo §13.1. PHP nhận cả slug và hex trong cùng lượt. Không đổi default. |
| **Human quyết** | `[x]` SS-DS-01 — 2026-11-18 muộn. Source Phase A cùng ngày. Chưa PASS. |

---

### 12.6 SS-ISS-COL-02 — “Màu nền không ảnh” (decision thiếu schema)

| Mục | Nội dung |
|---|---|
| **Triệu chứng** | Human muốn chỉnh nhanh nền khi không có ảnh (scratch + tension 13:36). |
| **Hiện trạng** | **Không** attribute parent. Per-step: `backgroundFillMode` default → PHP `skvn_marine_blocks_get_step_default_fill_gradient( $index )` (4 radial, khớp editor `STEP_DEFAULT_FILLS`). Custom fill per step qua `PanelColorGradientSettings`. Delta cũ ghi flat `#101f30` — **source hiện tại dùng gradient**, không còn một màu flat CSS global. |
| **Lệch nghĩa** | “4 palette cố định” = **gradient theo index**, không phải 4 ô chọn trên parent. |
| **Phương án** | (A) Parent `noImageFallbackColor` hex override toàn slider. (B) Chỉ per-step custom fill. (C) Parent chọn “palette set” enum — **scope mới**. |
| **Human quyết** | `[x]` **(B)** 2026-11-18 — per-step fill only; không parent hex 1.3.24. |

---

### 12.7 SS-ISS-SET-01 — Attribute có, Inspector thiếu (không phải lỗi Slider)

| Attribute | block.json | Inspector | Frontend |
|---|---|---|---|
| `textPosition` | ✓ | source có (chưa build) | ✓ `is-position-*` |
| `textSurface` | ✓ | source có (chưa build) | ✓ `--surface` |
| `overlayPreset` | ✓ (legacy) | ✗ | ✗ (PHP normalize không dùng paint) |
| `overlayOpacity` | ✓ default **100** | ✓ | ✓ gradient overlay (081) |

Chi tiết settings: **§3.3, §5, §6 Phase A** plan này. Không nhầm với SS-ISS-GEO-01.

---

### 12.8 SS-ISS-VIS-01 — Lệch artifact, đo lại 2026-11-19

Các mục Paint cũ trong delta (nền phẳng `#101f30`, tab không số, progress navy ở đáy, không overlay, cột không `46rem`) **không còn đúng** trên `test-page-2`. Đừng sửa lại những chỗ đó.

Đã khớp artifact / khóa 081:

- Nền không ảnh: radial `index % 4` (bước đang mở của slider gradient = gradient 1 của artifact).
- Overlay hai lớp đúng công thức artifact, opacity 1.
- Cột chữ `max-width: 736px` (`46rem`), chữ thường `#f5f7fa`.
- Tab liền, hai dòng `01` + nhãn, progress 2px ở mép trên.
- Mũi tên desktop: vòng 46px, `top: 50%`, prev `left: 1rem`, next `right: 1rem`. Vị trí CSS khớp bản manual. Chúng bị cắt vì GEO-01, không vì sai `top`.
- Play `hidden`, nhãn `Play`. Khác pill “Tạm dừng” luôn hiện của artifact autoplay. **Giữ.** 081 khóa nút này ẩn đến khi dừng bằng focus.
- Màu progress `#7ec8e3`, không phải `#3ddc84`. **Giữ.** SS-DS-01.

Còn lệch, và là việc sửa giao diện:

1. **GEO-01** — khối 1985px, tab và mũi tên tràn khỏi viewport. Sửa trước.
2. **THEME-01** — heading `h2.wp-block-heading` màu `rgb(8, 47, 73)`, cỡ 35px, weight 400. Đoạn văn vẫn trắng. Heading gần như mất trên ảnh và trên gradient. Rule thắng: `body:not(.wp-admin) h2` → `var(--skvn-heading-color)` trong `wp-content/themes/skvn-marine/style.css`. Cột chữ chỉ đặt `color` trên chính nó, không thắng rule heading.
3. Thanh tab đậm hơn artifact (`rgba(8,16,28,.92)` so với `.62` + blur). Nhãn chưa uppercase, weight 500 so với 800. Làm **sau** khi GEO-01 hết, và chỉ nếu đo lại vẫn lệch. Không đụng cỡ heading 3.9rem của prototype.

---

### 12.9 SS-ISS-TAB-01 — Tab mobile overflow (O10)

| Mục | Nội dung |
|---|---|
| **Evidence** | @390px: nhãn không clip nội bộ nhưng thanh rộng hơn viewport; `scrollLeft` không đổi khi thử cuộn — **FAIL UX O10** nếu tái hiện. |
| **Khóa** | Không ép 4 tab một hàng (artifact autoplay); giữ scroll ngang. |
| **Cách kiểm** | Retest sau fix SS-ISS-GEO-01 (tràn có thể liên quan). |
| **Human quyết** | `[ ]` Chấp nhận scroll. `[ ]` Thu nhỏ typography tab. |

---

### 12.10 Bảng ưu tiên điều tra (agent / human)

| ID | Severity | Blocker human? | Ghi chú |
|---|---|---|---|
| SS-ISS-GEO-01 | High | Quyết §12.1 | Trước mọi “copy Slider viewport” |
| SS-ISS-COL-01 | Low | Đã chốt SS-DS-01 | Source §13.1. Chưa PASS |
| SS-ISS-COL-02 | Medium | Đã chốt (B) | Không parent hex |
| SS-ISS-HGT-01 | Medium | **Có** (mô tả surface) | |
| SS-ISS-SET-01 | Medium | SS-SET-01 plan §5 | |
| SS-ISS-VIS-01 | Medium | 081 visual approval | |
| SS-ISS-GEO-02 | Info | O02-H | Không fix trừ đổi contract |
| SS-ISS-THEME-01 | High | Đã đo 2026-11-19 | Heading navy trên nền tối. Sửa màu chữ trong block, không thêm color control |

---

### 12.11 Checklist human (thay scratch notes)

- [x] SS-SET / GEO-01 (a) / COL-02 (B) / SS-SEQ-01 — 2026-11-18.
- [x] **§13 / SS-DS-01** — human chốt pattern progress 2026-11-18 muộn. Phase A đã có source cùng ngày. Chưa build, chưa PASS.
- [ ] SS-ISS-HGT-01 / SS-ISS-HGT-02 / SS-ISS-TAB-01 — chờ mô tả QA hoặc lệnh sau 081.

---

## 13. Progress color — SS-DS-01 đã chốt (2026-11-18, muộn)

Human chốt sau khi phản biện bản đề xuất slug-only ở section này. Bản đó **đã rút**: không còn hiệu lực dù còn trong git history. Agent code theo §13.1. Không làm theo các câu sau, dù gặp ở tension cũ, AP-15 bản đầu, hoặc scratch:

- chỉ slug, tắt custom vì `theme.json` có `color.custom: false`
- thêm `progressColorSlug` hoặc đổi tên `progressColor`
- đổi default `#7ec8e3` sang `skvn-teal-600` hoặc slug khác
- migrate hex đã lưu sang slug
- supersede tension 13:36 thành “cấm hex progress”
- sửa `theme.json` để bật `color.custom` cho cả site

Pitfall: `.context/PITFALLS.md` **AP-15**. AP-15 vẫn cấm ô gõ “Hex only”. AP-15 không được dùng để gỡ color picker của progress.

### 13.1 Spec để code (khi có lệnh)

| Việc | Chốt |
|---|---|
| Attribute | Giữ `progressColor` (string). Không key mới. |
| Default | Giữ `#7ec8e3` trong `block.json` và `skvn_marine_blocks_step_slider_default_progress_color()`. |
| Hợp lệ | Slug palette `[a-z0-9-]+` có trong palette active lúc render, **hoặc** hex `#RGB` / `#RRGGBB` qua `sanitize_hex_color`. |
| Hỏng / rỗng | `#7ec8e3`. Không in chuỗi lạ ra CSS. |
| Migrate | Không. Không `deprecated`. Không viết lại post. Không map `#7ec8e3` → slug. |
| UI | Bỏ `TextControl`. Hàng màu palette theme + color picker cho màu đặc. |
| Cờ theme | Picker custom của **riêng control progress** luôn bật, kể cả khi `color.custom` là `false`. Dùng prop picker (`disableCustomColors={false}` trên `ColorPalette` / `PanelColorSettings`, hoặc tương đương đúng version Gutenberg trong repo). Không sửa `theme.json`. |
| Fill và màu khác | Fill bước giữ `PanelColorGradientSettings` và **không** ghi đè `color.custom` hay `customGradient`. Overlay, chữ, nền slider cha không thêm hex. |
| “Custom” nghĩa là | Màu đặc hex. Không gradient. Không `rgb()` / `hsl()` / `var()` gõ tay. Không chuỗi CSS tự do. |
| Frontend, giá trị hex | `--skvn-step-slider-progress-color:#rrggbb` (đã sanitize). |
| Frontend, giá trị slug | `--skvn-step-slider-progress-color:var(--wp--preset--color--{slug},#7ec8e3)`. Fallback sau dấu phẩy là default hex. |
| Slug không còn trong palette | Coi như hỏng → `#7ec8e3`. Không xuất `var()` của slug lạ. |
| PHP | `skvn_marine_blocks_sanitize_step_progress_color()` nhận cả hai dạng. Bản chỉ `sanitize_hex_color` sẽ biến slug thành `#7ec8e3` trên frontend — chưa đạt spec, phải sửa cùng lượt với UI. |
| Editor | Preview trên wrapper của `step-slider` dùng cùng quy tắc xuất màu. |
| Nhãn | Tiếng Anh, text domain `skvn-marine-blocks`. Help một câu, ví dụ: “A theme color follows the palette. A custom color stays as chosen.” |
| Tension | Giữ quyền hex progress trong tension 13:36. Thu hẹp câu hex nền không ảnh parent (COL-02 B). Amendment nằm trong `TENSIONS_ACTIVE.md`. |

Allowlist slug lấy lúc render từ `wp_get_global_settings()` palette đang active (theme marine). Editor lấy palette qua `useSetting( 'color.palette' )`. Không hard-code danh sách slug vào block, trừ fallback `#7ec8e3`.

### 13.2 Vì sao default không được đổi

Gutenberg không ghi attribute vào markup khi giá trị bằng default. Slider chưa từng sửa progress thì không có `progressColor` trong bài. PHP và editor lấy default từ `block.json`. Đổi default sang một slug sẽ đổi màu những block đó dù không có script migrate. “Không migrate” chỉ đúng khi default vẫn là `#7ec8e3`.

`#7ec8e3` không có trong palette `theme.json`. Vì vậy trạng thái mở đầu của control là **custom hex**, không phải ô `skvn-teal-600`. `skvn-teal-600` là `#0d9488`, màu khác. Chọn ô palette là việc của người dùng, không phải default mới.

### 13.3 Hai kiểu lưu trong một attribute

Slug và hex là hai hành vi cố ý:

- Slug xuất `var(--wp--preset--color--…)`. Đổi token trong theme thì vạch progress đổi theo. Phần này **có** phụ thuộc theme.
- Hex đứng yên khi palette đổi. Phần custom **không** phụ thuộc cờ `color.custom`.

“Không phụ thuộc theme” trong quyết định human chỉ nghĩa là picker custom của progress không đọc `color.custom: false`. Nó không nghĩa là slug bỏ theme, và không nghĩa là mọi control màu của Step Slider bỏ theme.

Fill bước đứng cạnh progress trong sidebar và vẫn theo cờ theme. Đó là lệch có chủ đích: ngoại lệ một control, không phải design system mới cho cả block.

### 13.4 Cấm hiểu nhầm

| Cách hiểu sai | Việc đúng |
|---|---|
| §13 chưa chốt, Phase A còn blocked | SS-DS-01 đã chốt. Phase A đã có source 2026-11-18. Chưa PASS. |
| Tắt custom picker vì `color.custom: false` | Picker progress luôn hiện. |
| Sửa `theme.json` bật `color.custom` | Không sửa `theme.json` cho việc này. |
| `progressColorSlug`, hoặc đổi tên `progressColor` | Giữ tên `progressColor`. |
| Migrate `#7ec8e3` → `skvn-teal-600` hoặc slug “gần nhất” | Không. Default giữ `#7ec8e3`. |
| Supersede tension 13:36 = cấm hex progress | Giữ hex progress. Chỉ thu hex nền parent. |
| Tension còn cho hex nền không ảnh trên slider cha | COL-02 (B) đã đóng. Không thêm attribute parent. |
| `ColorControl` cộng ô gõ hex là đủ | Palette + picker. Không `TextControl`. |
| `disableCustomColors={false}` cho cả fill | Chỉ control progress. |
| Custom progress = gradient | Chỉ màu đặc hex. |
| PHP giữ sanitizer hex-only cho xong UI | Slug phải sống trên frontend trong cùng lượt. |
| Copy `syncViewportHeight`, class `viewport-below-header`, sửa `build/view.ts.js` | Cấm. GEO-01 (a), O02-H. Scratch notes không phải spec. |

### 13.5 Step fill — không đổi bởi SS-DS-01

COL-02 (B) giữ nguyên phần hex phẳng trên slider cha: không thêm attribute đó. Nền không ảnh vẫn là per-step. Default hiện là bốn radial theo `index % 4`; từ SS-SET-07 (2026-11-19) bốn radial đó là preset Deep Marine, và preset khách thay bộ màu được lặp — slider chỉ lưu slug. Custom fill trên `step-slide` qua `PanelColorGradientSettings`, và control đó tiếp tục tuân `color.custom` / `customGradient` của theme. Ba gradient `theme.json` (`skvn-navy-deep`, `skvn-ocean`, `skvn-midnight`) không thay bốn radial và không nhập vào thư viện SS-SET-07. Map chúng sang preset theme là việc sau, không nằm trong Phase A.

Không mở hex nền cấp slider cha từ tension 13:36.

### 13.6 Cổng code

| Lô | Spec |
|---|---|
| **081** frontend chrome | Đã có source. Không phụ thuộc §13. |
| **Phase A** (`textPosition`, `textSurface`, progress §13.1) | **Đã có source** 2026-11-18. Chưa build, chưa PASS. |
| **082** editor rail | Sau Phase A theo SS-SEQ-01. Màu trong badge không bắt buộc dùng §13. |

- [x] Evidence đo 2026-11-19 nằm ở delta, mục cùng ngày. Không PASS.
- [ ] Lệnh code giao diện: §14. Không implement scratch §11.

---

## 14. Sửa giao diện — thứ tự sau đo 2026-11-19

Human lệnh code 2026-11-19: khớp artifact, kể cả responsive. Source đã sửa, chưa build, chưa đo lại, chưa PASS. Play vẫn ẩn. Progress vẫn `#7ec8e3`. Nhãn dài vẫn cuộn thanh, không ellipsis.

### 14.1 GEO-01 — width

File: `wp-content/themes/skvn-marine/style.css`, luật `.skvn-full-width-canvas .entry-content .alignfull` (dòng 1007). Không sửa `themes/generatepress/`.

Selector hiện tại là `(0, 3, 0)`. Rule đang thắng là `body:not(.no-sidebar) .entry-content .alignfull`, specificity `(0, 3, 1)`, và nằm inline nên hòa cũng thua. Selector mới phải cao hơn `(0, 3, 1)`.

Việc: `width: 100%`, `margin-left: 0`, `margin-right: 0`, `max-width: none` cho `.alignfull` trong `.skvn-full-width-canvas`. Một owner. Không bọc `overflow-x`. Không thêm `100vw`.

Kỳ vọng sau sửa: `.skvn-step-slider` rộng bằng `clientWidth` (lần này 1905), `x = 0` so với viewport của nội dung, `scrollWidth` không lớn hơn `clientWidth`. Mũi tên prev/next nằm trọn trong khung. Tab `01` không bị cắt mép trái.

Nếu width đã đúng mà Swiper vẫn báo 1985, lúc đó mới gọi `updateSize()` khi resize. Không làm bước đó trước.

### 14.2 THEME-01 — heading đọc được

File: `wp-content/plugins/skvn-marine-blocks/src/step-slider/style.css`.

Rule theme `body:not(.wp-admin) h2` đặt `color: var(--skvn-heading-color)` (`#082f49`). Cột chữ chỉ tô `color` lên chính `.skvn-step-slide__content`, nên heading không thừa kế.

Selector mới phải thắng `(0, 1, 2)`, ví dụ `body:not(.wp-admin) .skvn-step-slide__content :is(h1, h2, h3, h4, h5, h6, .wp-block-heading)`. Màu: `#f5f7fa`, cùng cột chữ. Không thêm control màu. Không nâng cỡ chữ lên `3.9rem` / weight 800 của prototype. Đoạn văn đã trắng, không đụng.

### 14.3 Không sửa trong lượt giao diện này

- Play vẫn ẩn, nhãn `Play`.
- Progress giữ `#7ec8e3` trừ khi người dùng chọn màu khác.
- Không copy `syncViewportHeight`, không class `viewport-below-header`.
- Blur và uppercase của thanh tab: chỉ mở nếu sau 14.1 tab vẫn lệch artifact. Không gộp vào cùng lượt với width.