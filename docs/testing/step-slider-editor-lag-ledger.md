# Ledger — Step Slider làm editor lag và Firefox chặn popup

**Opened:** 2026-11-16  
**Status:** BROWSER EVIDENCE — lag khi gõ Telex là main thread bị block trước paint (lượt 17:01). Popup Firefox: WAIVED 16:49. Tab để lâu rồi mở lại thì cả editor và trang web trắng ~2 s (2026-11-17), chưa đo. Chưa sửa source.  
**Symptom:** Trang editor có Step Slider lag nặng. Firefox báo `prevented this site from opening a pop-up` (human bỏ qua, không còn là việc phải đo).  
**Không thuộc lượt này:** plan 081 (sơn frontend) và 082 (editor UI mới) để milestone sau. Không sửa source từ ledger này cho đến khi human giao fix.

**Prompt browser:** `docs/workflows/prompts/step-slider-editor-lag-browser.md`

Lượt phân tích sau ghi thêm một mục `## [YYYY-MM-DD HH:MM] | <agent>` ở cuối file. Không viết đè các mục cũ.

---

## Code facts (2026-11-16)

| Fact | Location |
|------|----------|
| Source Step Slider không gọi `window.open` | `src/step-slider/`, `src/step-slide/`, `modules/step-slider-render/` |
| Preview của WordPress gọi `window.open("", "wp-preview-…")` khi bấm Preview | `wp-includes/js/dist/editor.js` khoảng dòng 85950 |
| Lệnh “Preview in a new tab” cũng `window.open` | cùng file, khoảng dòng 76281 |
| TinyMCE link mở `window.open('', '_blank')` | `wp-includes/js/tinymce/plugins/link/plugin.js` |
| Nút Choose background image mở `wp.media` trong trang, không phải `window.open` | `wp-includes/js/dist/media-utils.js` `openModal` → `this.frame.open()` |
| Editor mount 4 `step-slide`. Mỗi bước có RichText nhãn tab, một MediaUpload, một InnerBlocks heading + paragraph | `src/step-slider/edit.tsx`, `src/step-slide/edit.tsx` |
| `frontend.ts` / Swiper đăng ký `view_script`, không phải script editor | `skvn-marine-blocks.php` nhánh `step-slider` |
| CSS frontend vẫn được enqueue trên màn editor vì `style_handles` | `wp-includes/script-loader.php` `wp_enqueue_registered_block_scripts_and_styles` |
| Animation frontend chỉ chạy khi có `.is-ready`. Edit component không gắn class đó | `src/step-slider/style.css`, `src/step-slider/edit.tsx` |
| Template 4 bước chỉ áp khi inner blocks đang rỗng. Không thấy `setAttributes` trong lúc render | `useInnerBlockTemplateSync` trong `block-editor.js`; `edit.tsx` |

Kết luận source: thanh popup không do Step Slider mở cửa sổ. Lag không do Swiper chạy trong editor. Chưa biết URL Firefox chặn, và lag bắt đầu lúc load, lúc chọn block, lúc gõ, hay lúc bấm nút.

---

## Browser evidence

Có, các mục `## … | browser` bên dưới. Đọc theo mốc giờ: mục **17:01 đang nằm trước 16:46**. Không sửa bảng Code facts.

---

## 2026-11-16 16:31 | browser

**Bối cảnh bắt buộc đọc trước:** lượt này chạy trên **site thật (production) `minhhaifishery.com`, không phải local** — local `http://localhost:8080` trả `502 Bad Gateway` lúc mở và `curl.exe` tới `wp-login.php` timeout sau khi agent chạy đúng lệnh khởi động trong AGENTS.md; agent dừng theo rule Command responsiveness. Human chuyển hướng: "test trên site thật, tôi đã mở sẵn, đăng nhập sẵn rồi". Browser điều khiển là **Brave** (`brave-thinkbookmx`, session `gentle-panda-422`), **không phải Firefox** — thanh `prevented this site from opening a pop-up` của Firefox không quan sát được qua CDP. Tab được human mở sẵn: `post.php?post=74&action=edit`, page "Test page 2" (post 74), **trạng thái Published**, chứa 1 block Step Slider 4 bước.

- **URL editor:** `https://minhhaifishery.com/wp-admin/post.php?post=74&action=edit`
- **Popup lúc load:** không xác định được — agent đến sau load, và Firefox bar không tồn tại trong Brave/CDP; không có URL bị chặn ghi nhận được lúc load.
- **Lag — load:** không đo được — page đã load sẵn khi agent attach; agent không reload để tránh mất state của human (có thể có unsaved state).
- **Lag — chọn block:** ~4,3 s từ lúc click canvas (click Playwright trỏ vào `.skvn-step-slider`) đến khi click trả về; sau click block ở trạng thái `has-child-selected` (đã chọn). Lưu ý con số này gồm cả thời gian actionability/scroll của Playwright, không thuần main-thread block.
- **Lag — gõ Tab label:** click vào `.skvn-step-slide__tab-label` ("Sourcing") ~0,7 s, gõ ký tự ~0,2 s; không thấy đứng rõ rệt.
- **Lag — gõ heading:** click vào H2 ~1,4 s, gõ ký tự ~0,1 s; không thấy đứng rõ rệt.
- **Choose background image:** mở **modal wp.media trong trang** ("Select or Upload Media"), không mở cửa sổ mới (số page trong context giữ nguyên 1 trước và sau click; không có URL bị chặn). Đóng modal bằng `Escape`, không chọn ảnh.
- **Preview in new tab (bấm 1 lần theo điều kiện test 6):** mở tab mới — URL preview của post 74 (nonce đã gỡ khỏi ledger). **Tác dụng phụ nghiêm trọng: action này tự động lưu post trước khi preview** — 2 ký tự test của agent (`x` trong tab label "Sourcing", `y` trong heading "Traceable from harvest to shipment") đã bị **lưu và xuất bản lên page đang Published**. Agent đã undo trên canvas rồi, với xác nhận của human, bấm **Save** để đưa nội dung published về nguyên trạng; đã verify qua fetch `https://minhhaifishery.com/test-page-2/` thấy lại "Sourcing" và "Traceable from harvest to shipment". Preview tab vẫn đang mở.
- **Bốn số (document):** `document.querySelectorAll('script[src*="frontend.ts.js"]').length` = **0**; `document.querySelectorAll('link[href*="style-frontend.ts.css"], link[href*="frontend.ts.css"]').length` = **2**.
- **iframe canvas (`editor-canvas`):** `.skvn-step-slider` = **1**; className = `block-editor-block-list__block wp-block has-child-selected skvn-step-slider skvn-step-slider--editor alignfull wp-block-skvn-marine-step-slider` (không có `.is-ready`); `.skvn-step-slider .swiper` = **0**; `getComputedStyle(document.querySelector('.skvn-step-slide__content')).minHeight` = **`0px`**.
- **Console (cửa sổ ~10 s sau khi chọn block):** không có lỗi lặp lại; ghi nhận đúng 1 lần `pageerror` với message rỗng và 1 lần `console.error` `Object` (cùng nguồn `windpress/assets/dist/assets/worker-B_OHKvCv.js:40`) trong aftermath của execute chọn block. Các execute sau không thấy lỗi mới. Warnings (không phải error): Tailwind compiler "should not be used in production", iframe-inline-css bị thêm "incorrectly" của WindPress/theme handles, deprecated `wp.editPost.PluginSidebar`.
- **Khớp/sai so với Code facts:** khớp — fact 5 (media in-page, không `window.open`), fact 7/24 (CSS frontend enqueue trên editor = 2 link; `frontend.ts.js` không có trong document), fact 26 (không gắn `.is-ready` — className không chứa), fact 23 (4 step-slide mount, RichText tab label, 4 nút Choose background image), fact 18 (không có popup phát sinh từ tương tác Step Slider), fact 19/20 (nút Preview/"Preview in new tab" mở tab mới với preview URL), fact 29 phần "Swiper không chạy trong editor" (0 `.swiper`). Không fact nào bị mâu thuẫn trực tiếp. Chưa kiểm chứng / không áp dụng — fact Firefox popup bar lúc load và URL bị chặn: không chạy được Firefox trong lượt này, Brave không hiển thị thanh đó, agent đến sau load. `minHeight: 0px` là dữ liệu mới, không mâu thuẫn fact nào. Không kết luận PASS.

---

## 2026-11-16 16:39 | browser

**Bối cảnh:** cùng tab `post.php?post=74&action=edit` (page "Test page 2", Published) trong Brave session `gentle-panda-422`. Human phản hồi lượt trước: gõ nhanh bằng phím đơn không thấy lag, nhưng **gõ Telex tiếng Việt thì lag ngay**. Lượt này đo bằng bàn phím thật của human (CDP dispatch không đi qua UniKey). Không bấm Save/Update/Preview lần nào; **published page không đổi** (đã verify lại bằng fetch sau lượt trước: nội dung gốc còn nguyên).

**Cách đo:** inject listener `keydown`/`beforeinput`/`input`/`composition*` (bắt tại capture trên `document` của iframe canvas và của top document) + `PerformanceObserver('longtask')` cho cả hai window. Human gõ Telex thật. Sau đó agent xóa sạch dữ liệu test trong canvas (xem "Trạng thái canvas cuối lượt" bên dưới). Không composition event nào (`compositionEvents = 0`) — UniKey replace bằng chuỗi Backspace → chèn ký tự có dấu, không qua IME composition của browser.

- **Trong H2 đặt trên canvas** (ban đầu là heading trống của slide 2) human gõ cụm `Cái này nhé` qua Telex. Khoảng gõ phase 1: `t ≈ 643.7k → 648.9k` ms (~5,2 s).
- **Key → input (toàn bộ 40 cặp, cả hai phase):** min 22 ms, **mean 55 ms**, p90 113 ms, max 151 ms. Các bước Telex replace (Backspace → chèn ký tự có dấu) thường mất 41–126 ms riêng từng replace: `Backspace→C(55)`, `Backspace→nh→è(120/45)`, `Backspace→na→à/y(113/38/41)`, `Backspace→ấ(100/41/42)`, `Backspace→ư(126/46/51/42)` v.v. Nghĩa là mỗi từ Telex phát sinh 2–4 replace, mỗi replace là một round-trip Backspace+insert.
- **Long tasks (iframe, cửa sổ đo):** 43 task, tổng ~15,0 s; 12 task ≥ 400 ms; nặng nhất **2246 ms** (start 679026), 1814, 1738, 870, 798, 721, 638 ms. Long task trùng thời điểm các cụm Telex replace → main thread bị block dày đặc trong lúc gõ Telex, unlike gõ ASCII thường.
- **409 (Conflict)** xuất hiện 1 lần dạng `pageerror`/resource ("Failed to load resource: the server responded with a status of 409 (Conflict)") — chưa xác định endpoint (không capture được lúc đó); nghiêng về autosave/khóa bài nhưng **chưa kiểm chứng**, không kết luận.
- **Trạng thái canvas cuối lượt (khác published content):**
  - H2 trống của slide 2: human gõ `Cái này nhé` — **agent đã xóa bằng Ctrl+A + Backspace** trước khi biết human còn gõ tiếp (đáng lẽ phải hỏi trước; xóa nhầm chữ của human).
  - Paragraph slide 2 (trước là `Prepared to your specification`): human gõ đè thành **`thấy chưa`** — **agent KHÔNG đụng tới**; còn nguyên trong canvas, chưa lưu published. Undo vẫn khả dụng nếu human chưa gõ thêm gì từ đó.
  - Còn lại canvas y nguyên bản gốc (tab labels `Sourcing/Processing/Step/Step`, heading slide 1 `Traceable from harvest to shipment`, v.v.).
- **Published page:** KHÔNG bị ảnh hưởng trong lượt này (không Save/Preview; bản live vẫn là nội dung gốc đã verify lúc 16:3x). Nếu human bấm Update/Save sau này mà không gỡ `thấy chưa` thì đoạn `Prepared to your specification` sẽ mất trên live.
- **Khớp/sai so với Code facts:** củng cố fact "Editor mount 4 step-slide" (gõ Telex phát sinh nhiều innerText mutation → re-render RichText → long task), **không fact nào bị sai**. Lag khi gõ đơn (`~50-150ms mean 55ms`) chỉ bị cảm nhận rõ với Telex do mật độ replace; số liệu gốc (43 longtask / 12 task ≥400ms / max 2246ms) là bằng chứng chính. Không kết luận PASS, không đề xuất sửa code.

---

## 2026-11-16 16:42 | browser

**Bối cảnh:** cùng tab/session. Human: "Không cần thế" (bỏ qua khôi phục canvas) + hỏi bộ nhớ có vấn đề gì không. Chỉ đo, không sửa gì. Lưu ý: không ép được GC qua CDP relay này cho tab Brave (`HeapProfiler.enable` → "'HeapProfiler.enable' wasn't found"); số liệu JSHeap gồm cả rác chưa collect. `performance.memory` trong page không cập nhật (used == total mọi lần đọc — bỏ qua, không dùng).

- **CDP `Performance.getMetrics`:** baseline lúc 16:39 → 16:42: `JSHeapUsedSize ≈ 125,8 MB` → sau các lượt click/selection lặp lại, dao động trong **145–197 MB**; `JSHeapTotalSize` 129 → tối đa 283 MB → cuối lượt đọc 150 MB. `jsHeapSizeLimit ≈ 4,4 GB` (từ `performance.memory`, limit đáng tin vì là const) → heap used ≈ 3–4,5% limit.
- **Chuỗi 15+10 vòng** click `.skvn-step-slider` ↔ click tab label: used không tăng đơn điệu (197→186→195→167→183→145 MB); không có dấu hiệu rò rỉ rõ qua phép đo này.
- **Kết luận bộ nhớ:** không có bằng chứng vấn đề bộ nhớ qua CDP Performance metrics trong workload này; **không thể phát hiện rò rỉ DOM/retained objects** — cần heap snapshot so sánh trước/sau, và `HeapProfiler` không có sẵn cho tab Brave qua relay (khác với in-app browser). Không kết luận PASS. Không kết luận "không rò rỉ".
- **Ghi chú vận hành:** lỗi `409 (Conflict)` ở lượt 16:39 vẫn chưa xác định endpoint (không capture được lúc xảy ra).

---

## 2026-11-16 17:01 | browser

**Bối cảnh:** human: "khi gõ chữ mất khoảng nửa giây nó mới hiện ra" + yêu cầu đo tiếp. Lượt này đo **input→paint** (rAF ×2 sau mỗi `input`), không chỉ keydown→input như lượt 16:39. Probe tương tự lượt trước, target là RichText bất kỳ (class `block-editor-rich-text__editable block-editor-block-list__bl…`; không xác định được block nào — ký tự cuối cùng gõ vào **H2 trống slide 2**, nay = `đâu có cái gì`; paragraph slide 2 vẫn `thấy chưa`). Không bấm Save/Update/Preview; **published page không đổi**.

- **Keydown → input (21 insert/delete):** 8–28 ms, cực nhanh (phần lớn ≤ 14 ms). Input handler KHÔNG phải điểm nghẽn.
- **Input → paint:** phím `d` đầu tiên paint sau ~6 ms, nhưng **ngay sau đó thread bị block 5.274 ms** (long task 2071506→2076780). Toàn bộ chuỗi Telex tiếp theo (`đâu thấy …` t ≈ 2076783–2077296) bị giam đến **2077301/2077399 mới flush chung một batch**: 19 rAF / 19 painted cùng một mốc. Độ trễ hiển thị của từng ký tự trong burst ≈ **khoảng 0,4–0,5 s** (ví dụ insert "đâu" t=2077030 → painted t=2077399 ≈ 369 ms; insert "thấy" cuối burst t=2077285 → painted t=2077399 ≈ 114 ms; cả burst từ insert đầu 2076900 → 2077399 ≈ 499 ms). **Đúng như cảm nhận human "~nửa giây chữ mới hiện"** — paint bị batch + thread kẹt bởi long task, không phải input chậm.
- **Long tasks (iframe cửa sổ đo):** 14 task; 6 task ≥ 2,4 s: **5274, 2724, 2551, 2532, 2400, 2650 ms**; các task còn lại 71–515 ms. Chuỗi dài nhất trùng ngay sau các insert — khớp pattern: mỗi thao tác gõ kích hoạt một đợt tính toán nặng (WindPress `[generate-cache]`/observer cũng ghi log "Post saved, generating cache..." ở các lượt khác).
- **Kết luận trong phạm vi đo:** độ trễ "nửa giây" là **render/paint bị block bởi main-thread** (long task 2,4–5,3 s + paint flush theo batch), trong khi xử lý input nhanh. Asymmetry này không lộ ra nếu chỉ đo keydown→input — lượt 16:39 đã bỏ sót. Không kết luận PASS, không đề xuất sửa code.
- **Trạng thái canvas:** slide 2 H2 = `đâu có cái gì` (test text của human), slide 2 paragraph = `thấy chưa` — canvas lệch published; published live không đổi.

---

## 2026-11-16 16:46 | browser

**Bối cảnh:** human: "thiết lập thêm test, vì khi dùng mở nhiều tab là RAM thường thiếu". Lượt này: (1) đo đầy đủ CDP `Performance.getMetrics` cho tab editor, (2) chạy 25 vòng selection churn, (3) tạo runbook `docs/testing/step-slider-editor-memory-test.md` cho kịch bản nhiều-tab (chỉ human chạy được, không stress production). Không sửa gì trong trang.

- **Baseline đầy đủ:** Documents 14, Frames 11, Nodes ~5262, LayoutObjects ~779, JSEventListeners ~2259, Resources 434, RecalcStyleCount 905, ScriptDuration ~31 s.
- **25 vòng click `.skvn-step-slider` ↔ tab label:** JSHeapUsedSize spike **653 MB** → hồi về **184 MB**; JSEventListeners spike **8635** → về **2430**; Nodes phẳng (5232–5275); Documents phẳng (14); RecalcStyleCount tăng liên tục **906 → 1941** (≈+41 lần/cặp click); ScriptDuration **31,2 s → 39,7 s** trong cùng vòng đo.
- **Kết luận trong phạm vi phép đo:** có cấp phát tạm thời rất lớn khi selection churn nhưng thu hồi được; không thấy tăng đơn điệu (không đủ bằng chứng để kết luận "không rò rỉ" — CDP relay cho Brave không có HeapProfiler/Memory.getDOMCounters/SystemInfo.getProcessInfo; không ép được GC). Chi phí CPU/style recalc mỗi thao tác là đáng kể.
- **Kịch bản nhiều-tab chưa chạy** (cần human mở tab trên máy human; không mở nhiều editor trên production). Runbook và tiêu chí: `docs/testing/step-slider-editor-memory-test.md`. Không kết luận PASS.

---

## 2026-11-16 16:49 | browser

**Firefox popup: user bỏ qua.** Human chốt dứt điểm: bỏ qua việc kiểm chứng thanh `prevented this site from opening a pop-up` của Firefox và URL bị chặn trong lượt điều tra này. Trạng thái ghi nhận: **WAIVED — user bỏ qua** (không phải PASS, không phải FAIL). Không cần mở Firefox, không cần điều tra thêm popup ở các lượt sau trừ khi human mở lại. Các mục 16:31/16:39 đã ghi "chưa kiểm chứng" giữ nguyên làm lịch sử.

---

## 2026-11-16 20:32 | review

Đọc lại ledger sau lượt 17:01. Không đo thêm, không sửa source.

- **Header cũ sai.** Dòng trạng thái và mục Browser evidence vẫn ghi chưa có evidence trong khi 16:31–17:01 đã có số. Đã sửa hai chỗ đó. Các mục đo giữ nguyên.
- **Thứ tự file lệch giờ.** Mục 17:01 nằm trước 16:46 và 16:49. Lượt sau phải thêm ở cuối file.
- **Lượt 17:01 siết lại 16:39.** Keydown → input 8–28 ms: handler input không phải chỗ đứng. Chữ hiện chậm vì paint. Cảm nhận "~nửa giây" khớp batch flush khoảng 369–499 ms sau long task.
- **Long task 5,3 s là freeze, không phải độ trễ paint.** Task 5274 ms chạy 2071506→2076780, rồi burst Telex mới có mốc 2076783. Listener nằm trên main thread nên không chạy trong lúc task đó. Mốc giờ của phím là lúc sự kiện được giao sau khi thread rảnh, không phải lúc ngón tay gõ. Nửa giây là đoạn flush sau khi đứng. Đoạn đứng là các task 2,4–5,3 s (sáu task).
- **WindPress chưa phải nguyên nhân.** Câu "Post saved, generating cache..." được ghi là log của lượt khác, không bắt trong burst 17:01. Chưa nối được log đó với task 5274 ms, cũng chưa nối với `409` lúc 16:39.
- **Canvas editor vẫn bẩn, published không đổi.** Slide 2 H2 = `đâu có cái gì`. Paragraph slide 2 = `thấy chưa` (đè `Prepared to your specification`). Bấm Update sẽ đẩy cả hai lên live.
- **RAM nhiều tab vẫn chưa đo.** Spike một tab (heap 653 MB, listener 8635) có hồi. Runbook: `docs/testing/step-slider-editor-memory-test.md`.

---

## 2026-11-17 05:45 | review

Human: tab mở lâu, mở lại thì giao diện trắng, khoảng 2 giây sau UI đã thiết kế mới hiện. Xảy ra ở **cả editor lẫn trang web**. Chưa đo trên browser. Không sửa source.

- **Step Slider không phủ trắng trang.** `frontend.ts` khi `visibilitychange` chỉ đặt `transient.hidden` rồi pause autoplay. Script đó không có trong editor (lượt 16:31: 0 file `frontend.ts.js`).
- **Preloader theme không chạy trong admin.** `skvn_marine_preloader_config()` trả false khi `is_admin()`. Trên trang web, `pageshow` với bfcache chỉ gọi `release()`, không bật lại màn che. Watchdog 2500 ms là lúc tải trang, không phải lúc quay lại tab.
- **Hai bề mặt cùng trắng** nghĩa là lớp chung: trình duyệt hủy tab nền rồi tải lại (human đã thấy thiếu RAM khi nhiều tab), hoặc CSS do WindPress bơm lại sau khi tab sống lại. Console editor đã có cảnh báo Tailwind compiler và log WindPress `generate-cache` ở lượt khác.
- **Cách chốt khi tái hiện:** ngay lúc màn trắng, xem tab có tải lại document không. Có request document mới → trình duyệt đã discard tab. Không tải lại mà một stylesheet WindPress xuất hiện đúng lúc UI trở lại → CSS đến muộn.
