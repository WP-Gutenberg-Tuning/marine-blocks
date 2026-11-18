# Milestone 1.3.24 — Fullscreen Step Slider: Issues to Fix

**Current Milestone:** V1 / 1.3.24 — Fullscreen Step Slider  
**Status:** PLANNED — pointer only; chưa start, chưa có runtime evidence  
**Source:** `.context/MILESTONES.md` line 11

---

## 1. Viewport tính sai, tràn vượt qua viewport chính xác

**Issue:** Viewport trên Step Slider bị tính sai, làm nội dung tràn ra ngoài viewport cao hơn nên không hiển thị đúng.

**Root Cause & References:**
- TENSIONS_OPEN.md `[2026-11-17 15:43] | slider, theme`: Đo chiều cao header để trừ viewport hiện chỉ Slider thường có (`syncViewportHeight`, preset Viewport below header). Step Slider hiện chỉ dùng `min-height: 100svh` mà chưa đo header/admin bar như Slider thường.
- PITFALLS.md Pitfall 2: `Viewport below header + ảnh không full height` — chỉ set `min-height` trên `.skvn-slide` nhưng Swiper dùng `height: 100%` mà `.skvn-slider` không có height explicit.
- PITFALLS.md Pitfall 10: Slider đổi size nhẹ sau fade load đầu — offset CSS `5rem` → đo header+admin bar; scrollbar ~17px. Human xác nhận load đầu vẫn đổi nhẹ và tạm bỏ qua.

**What needs fixing:**
- Step Slider cần tính viewport giống Slider: đo `#masthead, .site-header` + `#wpadminbar` → ghi `--skvn-slider-viewport-offset` → gọi `swiper.updateSize()`.
- CSS `.skvn-step-slider--height-viewport-below-header` cần được định nghĩa (similar to `.skvn-slider--height-viewport-below-header`).
- Không nên chỉ dùng `100svh` mà bỏ qua header/admin bar offset như Slide thường.
- **Constraint:** O02-H: đồng bộ header với Step làm sau khi theme tách khỏi GeneratePress. Không sửa `themes/generatepress/`.

**Files to review:**
- `wp-content/plugins/skvn-marine-blocks/src/step-slider/frontend.ts` — cần add viewport offset logic
- `wp-content/plugins/skvn-marine-blocks/src/step-slider/style.css` — cần add `.skvn-step-slider--height-viewport-below-header`
- `wp-content/plugins/skvn-marine-blocks/build/view.ts.js` — check Swiper asset graph

---

## 2. Progress bar color: cần color picker thay vì chỉ hex

**Issue:** Hiện progress bar color đưa ra hex input, nhưng người dùng cần color picker thay vì phải tự gõ hex.

**Current Implementation:**
- `block.json`: `progressColor` attribute là string (hex default: `#7ec8e3`)
- `edit.tsx`: Sử dụng `TextControl` với validation `sanitizeProgressHex` — cho phép nhập hex thôi thôi
- `frontend.ts`: Ghi `span.style.width` theo phần trăm dwell, màu từ `var(--skvn-step-slider-progress-color)`

**What needs fixing:**
- Thay `TextControl` bằng `ColorControl` từ `@wordpress/components` để cho người dùng chọn màu trực quan.
- Cập nhật `sanitizeProgressHex` hoặc tạo hàm sanitize cho color format.
- Cập nhật block.json attribute type nếu cần.
- Tuy nhiên, cần cân nhắc: AGENTS.md SKVN Editor Controls: **không bắt người dùng nhập raw hex/rgb/hsl**. Plan 081 từng ghi không thêm màu raw. Hẹn giờ màu chỉ được 2 màu progress/nền không ảnh của Step Slider thôi.

**Decision from TENSIONS_ACTIVE.md `[2026-11-18 13:36] | slider, editor-governance`:**
- Human cho hex tùy chọn trên màu progress và màu nền không ảnh của Step Slider.
- Bốn palette cố định vẫn dùng được khi không nhập hex.
- Hex phải sanitize.
- Không mở raw hex cho màu khác.
- **Default: DỪNG nếu task mở hex cho màu khác hai màu này.**

**Files to change:**
- `wp-content/plugins/skvn-marine-blocks/src/step-slider/block.json` — có thể thêm attribute cho color picker
- `wp-content/plugins/skvn-marine-blocks/src/step-slider/edit.tsx` — thay TextControl bằng ColorControl
- `wp-content/plugins/skvn-marine-blocks/src/step-slider/style.css` — keep var `--skvn-step-slider-progress-color`

---

## 3. Chiều cao của Step rất thấp - đó là chiều cao của mobile, web view phải sửa lại

**Issue:** Chiều cao của Step (bước) rất thấp, tương đương chiều cao mobile, web view thì phải sửa lại.

**Current Implementation:**
- `block.json`: `heightMode` attribute có hai giá trị: `viewport` (mặc định) và `content`.
- `edit.tsx`: Có `HEIGHT_MODE_OPTIONS` select: Viewport (min-height 100svh) vs Content (height follows content).
- `frontend.ts`: Khi `heightMode === 'content'` → add class `skvn-step-slider--height-content` → `.swiper, .swiper-slide` có `min-height: 0`.
- `style.css`: `.skvn-step-slider .swiper { min-height: 100svh }`, `.skvn-step-slide__content { min-height: 100svh }`.

**What needs fixing:**
- Với `heightMode: viewport` (mặc định): Cần đảm bảo chiều cao phù hợp cho web view, không chỉ dừng lại ở mobile `100svh`. Có thể cần thêm `height: 100vh` hoặc tính toán theo viewport thực tế.
- Với `heightMode: content`: Chiều cao Follow content nên hoạt động tốt, nhưng cần verify trên web view.
- Cần test cả hai mode (viewport/content) trên desktop/web view để đảm bảo chiều cao không bị "quá thấp" như mobile.

**Related tension:**
- TENSIONS_OPEN.md `[2026-11-17 15:43] | slider, theme`: Human chốt O02-H: Step Slider giữ `100svh` (cả khung nhìn, không trừ header). Không thêm option Viewport below header của Slider thường. Đồng bộ header với bước (trừ chiều cao header và admin bar) làm sau khi theme tách khỏi GeneratePress.

**Files to review/test:**
- Test heightMode viewport trên desktop/web view kèm header/admin bar
- Test heightMode content trên web view
- DevTools `getBoundingClientRect` cho `.skvn-step-slide__content` và `.skvn-step-slide`

---

## Summary of Actions

1. **Viewport fix:** Cập frontend.ts để đo header/admin bar offset và gọi `swiper.updateSize()`, similar to Slider implementation. Cập CSS `.skvn-step-slider--height-viewport-below-header`.

2. **Color picker:** Thay TextControl bằng ColorControl cho progressColor trong edit.tsx, kèm sanitize hàm. Giữ lại 4 palette cố định là mặc định khi không chọn màu.

3. **Step height:** Test heightMode viewport/content trên web view (không chỉ mobile). Cân chỉnh CSS `min-height` cho phù hợp desktop. Có thể thêm option `viewport-below-header` sau khi theme tách khỏi GeneratePress.

**Note:** All changes must respect the constraint: **O02-H: đồng bộ header với Step làm sau khi theme tách khỏi GeneratePress. Không sửa `themes/generatepress/`**. Tensions HIGH severity nên chờ human quyết định trước khi code sửa rộng.