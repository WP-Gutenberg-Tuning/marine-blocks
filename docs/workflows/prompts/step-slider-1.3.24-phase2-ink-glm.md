# Prompt — ink và GLM thi draft giai đoạn 2

Dùng sau source giai đoạn 1 và §9a (2026-11-16). Hai agent không sửa plugin. Mỗi agent một file. Không đọc file của agent kia.

`docs/ideations/` bị gitignore. Không commit file draft.

- Ink: copy khối **Ink** bên dưới.
- GLM: copy khối **GLM** bên dưới.

Hai khối cùng nhiệm vụ. Chỉ khác `DRAFT_PATH`.

## Ink

```text
Bạn làm việc trong D:\Github\skvn-marine.

Nhiệm vụ duy nhất: đọc plan giai đoạn 2 và source giai đoạn 1, rồi ghi một file markdown. Không sửa source plugin, theme, plan 079, plan 018, decision, MILESTONES, package.json. Không chạy build. Không tạo block. Không implement §10. Không mở prototype HTML, technical report, demo-prep, plan018 từ §5 trở đi, và không mở docs/ideations/step-slider-phase1/ hay docs/ideations/step-slider-phase2/glm.md.

DRAFT_PATH: docs/ideations/step-slider-phase2/ink.md

## Đọc, rồi dừng

1. `.context/planning/079_VER_1_3_24_FULLSCREEN_STEP_SLIDER_EXECUTION_PLAN.md` — toàn file. §8, §8a, §9a giữ nguyên. §10 là việc giai đoạn 2 sẽ code sau, không phải lệnh code của lượt này.
2. `wp-content/plugins/skvn-marine-blocks/src/step-slider/block.json`
3. `wp-content/plugins/skvn-marine-blocks/src/step-slider/edit.tsx`
4. `wp-content/plugins/skvn-marine-blocks/src/step-slider/frontend.ts`
5. `wp-content/plugins/skvn-marine-blocks/src/step-slider/style.css`
6. `wp-content/plugins/skvn-marine-blocks/modules/step-slider-render/step-slider-render.php`
7. `wp-content/plugins/skvn-marine-blocks/skvn-marine-blocks.php` — chỉ đoạn đăng ký style/script step-slider và nhánh `step-slider` / `step-slide` trong vòng foreach.
8. Swiper đã cài: `wp-content/plugins/skvn-marine-blocks/node_modules/swiper/package.json` để lấy version, và `node_modules/swiper/types/modules/autoplay.d.ts`. Rồi tìm file implementation Autoplay mà chính package đó ship. Không dùng bản Swiper khác. Không dùng trí nhớ về Swiper nếu không trích được file trong package này.

Không đọc `src/slider/view.ts`, `src/slider/edit.tsx`, hay block khác để “tham khảo”.

Giai đoạn 1 cấm chữ Autoplay trong `frontend.ts`. §10 bước 4 gỡ lệnh cấm đó: giai đoạn 2 được import module Autoplay. Không lấy lệnh cấm giai đoạn 1 làm lý do dừng.

## Fork

Mỗi fork chỉ một hướng. Hướng còn lại ghi vào “Đã loại”, một câu vì sao trái §10 hoặc trái source giai đoạn 1. Không đổi số 800 / 400 / 0 / 100 / 200 / 300. Không đổi hình tab §9a. Không thêm Ken Burns, O08-E, Content Actions, deep-link.

F1. Progress bắt đầu sau transition. §4 và §10 bước 5: progress là dwell sau khi fade 800 ms kết thúc. Không dùng `autoplayTimeLeft` cho khoảng đang fade. Không `setInterval`. Chọn một: (A) một sự kiện Swiper 11 trong package đã cài, trích file và tên symbol, chứng minh nó bắn sau khi transition kết thúc, rồi progress chỉ chạy từ lúc đó; (B) STOP — package không có sự kiện như vậy. Bắt buộc chọn B nếu không trích được implementation. Không bịa tên event.

F2. Phần tử progress. §10 bảo một phần tử trong tab đang active. Chọn một: (A) PHP render sẵn một span trong mỗi `<button class="skvn-step-slider__tab">`, JS chỉ đổi width của span thuộc tab active; (B) JS tạo và xóa phần tử đó. Không thêm click handler thứ hai. Tab vẫn `slideTo(index)` như `frontend.ts` hiện tại. Span không được nhận click riêng.

F3. Nút Play. §10 bước 6: focus thì dừng autoplay, hiện Play, không tự chạy lại. Chọn một: (A) PHP render button, ẩn đến khi focus-stop, JS chỉ đổi trạng thái; (B) JS tạo button lúc focus-stop. Nhãn tiếng Anh `Play`, text domain `skvn-marine-blocks`. Không đưa Play vào Inspector.

F4. Tương tác và pause. `autoplay.d.ts` của package này có `disableOnInteraction` default true và `pauseOnMouseEnter`. §10 khóa `pauseOnMouseEnter: false`. Tab và mũi tên vẫn đổi bước khi autoplay đang bật. Focus: `stop`, không resume cho đến Play. Hover, `document.hidden`, và root ra khỏi viewport: `pause`, rồi `resume` khi hết điều kiện, trừ khi đang dừng vì focus. Chọn `disableOnInteraction` true hoặc false. Nếu chọn true, nói rõ click tab sẽ làm gì với autoplay theo file implementation đã trích. Nếu không trích được, ghi “không đủ bằng chứng” và không chọn true.

F5. Loop và mũi tên. `frontend.ts` đang disable prev khi `isBeginning`, next khi `isEnd`. §10 bước 7: loop off thì dừng ở hai đầu và next disabled ở bước cuối; loop on thì next từ bước cuối về bước đầu. Một bước thì tắt loop dù `data-loop` là 1. Nói rõ hàm `syncControls` phải đổi thế nào. Không gắn click `slidePrev` / `slideNext` riêng.

F6. Focus và viewport. §10 không định nghĩa focus là đúng cái root hay bất kỳ focus bên trong root, và không cho ngưỡng giao viewport. Chọn một cho focus: (A) `focusin` trong root, gồm tab và mũi tên; (B) chỉ đúng element root. Với viewport, đề xuất một ngưỡng IntersectionObserver. Ngưỡng đó ghi vào “Xin human”, chưa phải số khóa.

## Định dạng DRAFT_PATH

Viết tiếng Việt. Định danh code giữ nguyên tiếng Anh. Đúng thứ tự:

# Step Slider giai đoạn 2 — draft

## Tóm tắt
Tối đa 12 dòng. Hướng F1–F6. Ghi version Swiper đã đọc.

## Mâu thuẫn
Bảng: chỗ trích | câu A | câu B | hệ quả nếu làm cả hai.
Chỉ mâu thuẫn đọc thấy trong plan hoặc source. Không bịa cho đủ bảng.

## Fork
F1 đến F6: Đã chọn / Đã loại / Evidence (path + symbol) / Vì sao không trái §10 và §9a.

## File sẽ sửa khi được lệnh code
Chỉ path. Không dán nội dung source.

## Bước §10
Bước 1–7: một đoạn ngắn. Bước nào plan đã đủ rõ thì ghi “làm đúng §10 bước n”.

## Dừng
Việc không code trong lượt này. Gồm fork chọn STOP hoặc chưa đủ bằng chứng.

## Xin human
Số hoặc hành vi chưa có trong §10. Nếu không có, ghi “không”.

Không kết luận runtime PASS. Không ghi “đã implement”. Không ghi giai đoạn 1 đã nghiệm thu.
```

## GLM

```text
Bạn làm việc trong D:\Github\skvn-marine.

Nhiệm vụ duy nhất: đọc plan giai đoạn 2 và source giai đoạn 1, rồi ghi một file markdown. Không sửa source plugin, theme, plan 079, plan 018, decision, MILESTONES, package.json. Không chạy build. Không tạo block. Không implement §10. Không mở prototype HTML, technical report, demo-prep, plan018 từ §5 trở đi, và không mở docs/ideations/step-slider-phase1/ hay docs/ideations/step-slider-phase2/ink.md.

DRAFT_PATH: docs/ideations/step-slider-phase2/glm.md

## Đọc, rồi dừng

1. `.context/planning/079_VER_1_3_24_FULLSCREEN_STEP_SLIDER_EXECUTION_PLAN.md` — toàn file. §8, §8a, §9a giữ nguyên. §10 là việc giai đoạn 2 sẽ code sau, không phải lệnh code của lượt này.
2. `wp-content/plugins/skvn-marine-blocks/src/step-slider/block.json`
3. `wp-content/plugins/skvn-marine-blocks/src/step-slider/edit.tsx`
4. `wp-content/plugins/skvn-marine-blocks/src/step-slider/frontend.ts`
5. `wp-content/plugins/skvn-marine-blocks/src/step-slider/style.css`
6. `wp-content/plugins/skvn-marine-blocks/modules/step-slider-render/step-slider-render.php`
7. `wp-content/plugins/skvn-marine-blocks/skvn-marine-blocks.php` — chỉ đoạn đăng ký style/script step-slider và nhánh `step-slider` / `step-slide` trong vòng foreach.
8. Swiper đã cài: `wp-content/plugins/skvn-marine-blocks/node_modules/swiper/package.json` để lấy version, và `node_modules/swiper/types/modules/autoplay.d.ts`. Rồi tìm file implementation Autoplay mà chính package đó ship. Không dùng bản Swiper khác. Không dùng trí nhớ về Swiper nếu không trích được file trong package này.

Không đọc `src/slider/view.ts`, `src/slider/edit.tsx`, hay block khác để “tham khảo”.

Giai đoạn 1 cấm chữ Autoplay trong `frontend.ts`. §10 bước 4 gỡ lệnh cấm đó: giai đoạn 2 được import module Autoplay. Không lấy lệnh cấm giai đoạn 1 làm lý do dừng.

## Fork

Mỗi fork chỉ một hướng. Hướng còn lại ghi vào “Đã loại”, một câu vì sao trái §10 hoặc trái source giai đoạn 1. Không đổi số 800 / 400 / 0 / 100 / 200 / 300. Không đổi hình tab §9a. Không thêm Ken Burns, O08-E, Content Actions, deep-link.

F1. Progress bắt đầu sau transition. §4 và §10 bước 5: progress là dwell sau khi fade 800 ms kết thúc. Không dùng `autoplayTimeLeft` cho khoảng đang fade. Không `setInterval`. Chọn một: (A) một sự kiện Swiper 11 trong package đã cài, trích file và tên symbol, chứng minh nó bắn sau khi transition kết thúc, rồi progress chỉ chạy từ lúc đó; (B) STOP — package không có sự kiện như vậy. Bắt buộc chọn B nếu không trích được implementation. Không bịa tên event.

F2. Phần tử progress. §10 bảo một phần tử trong tab đang active. Chọn một: (A) PHP render sẵn một span trong mỗi `<button class="skvn-step-slider__tab">`, JS chỉ đổi width của span thuộc tab active; (B) JS tạo và xóa phần tử đó. Không thêm click handler thứ hai. Tab vẫn `slideTo(index)` như `frontend.ts` hiện tại. Span không được nhận click riêng.

F3. Nút Play. §10 bước 6: focus thì dừng autoplay, hiện Play, không tự chạy lại. Chọn một: (A) PHP render button, ẩn đến khi focus-stop, JS chỉ đổi trạng thái; (B) JS tạo button lúc focus-stop. Nhãn tiếng Anh `Play`, text domain `skvn-marine-blocks`. Không đưa Play vào Inspector.

F4. Tương tác và pause. `autoplay.d.ts` của package này có `disableOnInteraction` default true và `pauseOnMouseEnter`. §10 khóa `pauseOnMouseEnter: false`. Tab và mũi tên vẫn đổi bước khi autoplay đang bật. Focus: `stop`, không resume cho đến Play. Hover, `document.hidden`, và root ra khỏi viewport: `pause`, rồi `resume` khi hết điều kiện, trừ khi đang dừng vì focus. Chọn `disableOnInteraction` true hoặc false. Nếu chọn true, nói rõ click tab sẽ làm gì với autoplay theo file implementation đã trích. Nếu không trích được, ghi “không đủ bằng chứng” và không chọn true.

F5. Loop và mũi tên. `frontend.ts` đang disable prev khi `isBeginning`, next khi `isEnd`. §10 bước 7: loop off thì dừng ở hai đầu và next disabled ở bước cuối; loop on thì next từ bước cuối về bước đầu. Một bước thì tắt loop dù `data-loop` là 1. Nói rõ hàm `syncControls` phải đổi thế nào. Không gắn click `slidePrev` / `slideNext` riêng.

F6. Focus và viewport. §10 không định nghĩa focus là đúng cái root hay bất kỳ focus bên trong root, và không cho ngưỡng giao viewport. Chọn một cho focus: (A) `focusin` trong root, gồm tab và mũi tên; (B) chỉ đúng element root. Với viewport, đề xuất một ngưỡng IntersectionObserver. Ngưỡng đó ghi vào “Xin human”, chưa phải số khóa.

## Định dạng DRAFT_PATH

Viết tiếng Việt. Định danh code giữ nguyên tiếng Anh. Đúng thứ tự:

# Step Slider giai đoạn 2 — draft

## Tóm tắt
Tối đa 12 dòng. Hướng F1–F6. Ghi version Swiper đã đọc.

## Mâu thuẫn
Bảng: chỗ trích | câu A | câu B | hệ quả nếu làm cả hai.
Chỉ mâu thuẫn đọc thấy trong plan hoặc source. Không bịa cho đủ bảng.

## Fork
F1 đến F6: Đã chọn / Đã loại / Evidence (path + symbol) / Vì sao không trái §10 và §9a.

## File sẽ sửa khi được lệnh code
Chỉ path. Không dán nội dung source.

## Bước §10
Bước 1–7: một đoạn ngắn. Bước nào plan đã đủ rõ thì ghi “làm đúng §10 bước n”.

## Dừng
Việc không code trong lượt này. Gồm fork chọn STOP hoặc chưa đủ bằng chứng.

## Xin human
Số hoặc hành vi chưa có trong §10. Nếu không có, ghi “không”.

Không kết luận runtime PASS. Không ghi “đã implement”. Không ghi giai đoạn 1 đã nghiệm thu.
```
