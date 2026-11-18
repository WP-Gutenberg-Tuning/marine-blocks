# Prompt — 4 agent đọc plan 079, mỗi agent một file

Dùng sau phản biện 2026-11-16. Bốn agent không sửa plugin. Mỗi agent ghi một file. Human đổi `DRAFT_PATH` trước khi dán.

Slot gợi ý:

- `docs/ideations/step-slider-phase1/agent-1.md`
- `docs/ideations/step-slider-phase1/agent-2.md`
- `docs/ideations/step-slider-phase1/agent-3.md`
- `docs/ideations/step-slider-phase1/agent-4.md`

`docs/ideations/` bị gitignore. Không commit file draft.

Copy từ dòng `Bạn làm việc` đến hết.

```text
Bạn làm việc trong D:\Github\skvn-marine.

Nhiệm vụ duy nhất: đọc plan giai đoạn 1 và ghi một file markdown. Không sửa source plugin, theme, plan 079, plan 018, decision, MILESTONES, package.json. Không chạy build. Không tạo block. Không mở prototype HTML, technical report, demo-prep, plan018 từ §5 trở đi.

DRAFT_PATH: <human điền một path duy nhất>

Nếu DRAFT_PATH còn là placeholder, dừng và hỏi path. Không tự chọn path khác.

## Đọc, rồi dừng

1. `.context/planning/079_VER_1_3_24_FULLSCREEN_STEP_SLIDER_EXECUTION_PLAN.md` — toàn file.
2. Đúng 11 mục trong plan 079 §7. Không mở file Slider/Slide khác. Không tìm block khác để tham khảo.

Contract đã chốt, không được đề xuất mở lại: không swipe; không Ken Burns; không autoplay/loop ở giai đoạn 1; không xóa child khi quá 8; không timer thứ hai; không sửa file Slider/Slide hiện có; frontend phải là `src/step-slider/frontend.ts`, cấm `view.ts`; số 800 ms, cascade 0/100/200/300 ms và duration 400 ms giữ nguyên. Muốn đổi số, ghi vào mục “Xin human sửa §8”, không âm thầm đổi trong hướng làm.

## Việc phải làm

Plan 079 đủ khóa để code, nhưng có chỗ hai câu cùng hiệu lực mà không cùng cơ chế. Bạn chọn một cơ chế cho mỗi fork dưới đây. Mỗi fork chỉ một hướng được chọn. Hướng còn lại ghi vào “Đã loại”, kèm một câu vì sao nó trái plan hoặc khó làm đúng plan.

F1. Nút prev/next. §8 bắt import module Navigation. §9 bước 10 bảo `navigation.prevEl` và `navigation.nextEl`. Chọn một: (A) truyền prevEl/nextEl vào Navigation, không gắn click riêng; (B) không import Navigation, tự gọi `slidePrev`/`slideNext` từ click. Không được làm cả hai.

F2. Opacity. Swiper fade đổi opacity của cả `.swiper-slide`. §8 cascade cũng đổi opacity của heading, paragraph, list, buttons. Chọn một: (A) fade cả slide, cascade chỉ `translateY`, bỏ opacity của cascade và ghi đây là chỗ cần human sửa §8; (B) fade cả slide, cascade giữ opacity như §8, nói rõ hai lớp nhân với nhau; (C) CSS tắt fade opacity của `.skvn-step-slide__content` để chỉ media chịu fade+wipe, chữ chỉ chịu cascade. Không bịa thời lượng mới.

F3. Chiều cao. §2 bảo bước dài nở theo trang. §8 chỉ khóa `min-height: 100svh`. Chọn một: (A) `autoHeight: true`, slide `height: auto`, min-height 100svh; (B) chiều cao cố định 100svh, nội dung dài cuộn trong bước. B trái O02. Chỉ chọn B nếu bạn chứng minh A không dựng được bằng Swiper fade, và ghi đó là mâu thuẫn cần human.

F4. CSS editor. §9 bước 12 nói import từ `edit.tsx` nhưng có hai edit. Chọn một: (A) một `src/step-slider/editor.css` import từ cả hai edit; (B) hai file editor.css riêng. Không đưa CSS editor vào `frontend.ts`.

F5. Tên file build. §9 bước 9 đoán `build/frontend.ts.js` và `build/style-frontend.ts.css` theo mẫu `view.ts` → `build/view.ts.js` và `style-view.ts.css`. Đối chiếu đúng đoạn đăng ký `skvn-marine-slider-view` trong `skvn-marine-blocks.php`. Nếu mẫu đó không suy ra được tên frontend, dừng ở F5 và viết “không đủ bằng chứng”, đừng bịa tên file.

F6. Tối đa 8 bước. Appender tắt khi đã có 8 child. Block đã lưu nhiều hơn 8 phải còn nguyên. Nói rõ API Gutenberg bạn dùng (`renderAppender` hoặc tương đương trong file edit đã đọc). Nếu file được đọc không chứa API đó, nói “chưa thấy trong file đã đọc”, không bịa tên prop.

F7. Không JS. Các bước phải đọc được khi chưa có `.is-ready`. PHP lại đặt `aria-current` lên tab 0 trong khi mọi bước đều hiện. Chọn một: (A) không JS thì ẩn thanh tab và mũi tên, chỉ còn các bước xếp dọc; (B) hiện tab nhưng không dùng `aria-current` cho đến khi có `.is-ready`.

## Định dạng file DRAFT_PATH

Viết tiếng Việt. Định danh code giữ nguyên tiếng Anh. Đủ các mục sau, đúng thứ tự:

# Step Slider giai đoạn 1 — draft

## Tóm tắt
Tối đa 10 dòng. Hướng đã chọn cho F1–F7, không giải thích lại contract.

## Mâu thuẫn trong plan 079
Bảng: chỗ trích § nào | câu A | câu B | hệ quả nếu làm cả hai.

Chỉ ghi mâu thuẫn bạn thấy khi đọc. Không bịa mâu thuẫn cho đủ số.

## Fork
Với F1 đến F7: Đã chọn / Đã loại / Vì sao chọn không trái §2 và §8.

## Cây file sẽ tạo khi được lệnh code
Danh sách path. Không dán nội dung file source.

## Bước §9
Với mỗi bước 1–12: làm gì trong một đoạn ngắn, copy cơ chế từ hàm hoặc file nào trong danh sách đã đọc, việc không được làm. Bước nào plan đã đủ rõ thì ghi “làm đúng §9 bước n”, không viết lại.

## Dừng
Việc bạn sẽ không code nếu human chưa trả lời. Gồm các fork bạn không chọn được.

## Xin human sửa §8
Chỉ khi một fork buộc đổi số hoặc đổi câu trong §8. Nếu không có, ghi “không”.

Không kết luận runtime PASS. Không ghi “đã implement”.
```
