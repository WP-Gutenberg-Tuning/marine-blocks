# Prompt — ink code Step Slider giai đoạn 1

Dùng sau khi plan 079 §8a đã khóa (2026-11-16). Copy từ dòng `Bạn làm việc` đến hết.

```text
Bạn làm việc trong D:\Github\skvn-marine.

Nhiệm vụ: code giai đoạn 1 của Fullscreen Step Slider. Làm đúng thứ tự §9 trong plan. Không làm giai đoạn 2. Không chạy build, lint, deploy. Không commit. Không kết luận runtime PASS.

Plan duy nhất: `.context/planning/079_VER_1_3_24_FULLSCREEN_STEP_SLIDER_EXECUTION_PLAN.md`

Đọc theo thứ tự, rồi code:

1. Mở đầu plan đến hết §2.
2. §3, §7, §8, §8a, §9. Dừng trước §10.
3. Đúng 13 file trong §7, đúng phạm vi ghi cạnh mỗi file.

Không đọc plan018 từ §5 trở đi, prototype HTML, technical report, demo-prep, và bốn file draft trong `docs/ideations/step-slider-phase1/`. Không đọc `src/slider/view.ts`. Không tìm block khác để tham khảo.

## Đã khóa, không chọn lại

§8a là quyết định cuối cho F1–F7. Không đề xuất hướng đã loại. Không đổi số 800 ms, cascade 0/100/200/300 ms, duration 400 ms, `translateY(0.75rem)`.

Giữ cả fade của Swiper và opacity của cascade. Hai lớp nhân nhau. `autoHeight: true` cùng `min-height: 100svh`. Một `editor.css`. `renderAppender={ false }` từ 8 child, không xóa child cũ. Chưa có `.is-ready` thì ẩn tab và mũi tên. PHP vẫn đặt `aria-current` trên tab 0.

Không Inspector cho focal, `overlayPreset`, `textSurface`, `textPosition`.

## File được sửa hoặc tạo

- `wp-content/plugins/skvn-marine-blocks/src/step-slider/block.json`
- `wp-content/plugins/skvn-marine-blocks/src/step-slider/save.tsx`
- `wp-content/plugins/skvn-marine-blocks/src/step-slider/edit.tsx`
- `wp-content/plugins/skvn-marine-blocks/src/step-slider/editor.css`
- `wp-content/plugins/skvn-marine-blocks/src/step-slider/frontend.ts`
- `wp-content/plugins/skvn-marine-blocks/src/step-slider/style.css`
- `wp-content/plugins/skvn-marine-blocks/src/step-slide/block.json`
- `wp-content/plugins/skvn-marine-blocks/src/step-slide/save.tsx`
- `wp-content/plugins/skvn-marine-blocks/src/step-slide/edit.tsx`
- `wp-content/plugins/skvn-marine-blocks/modules/step-slider-render/step-slider-render.php`
- `wp-content/plugins/skvn-marine-blocks/src/index.ts`
- `wp-content/plugins/skvn-marine-blocks/skvn-marine-blocks.php`
- `wp-content/plugins/skvn-marine-blocks/package.json` — chỉ thêm `src/step-slider/frontend.ts` vào `build` và `start`

Không sửa file Slider/Slide hiện có, `src/shared/motion.ts`, theme, GeneratePress, plan 079, decision, MILESTONES.

## Dừng và hỏi human khi

- Export trong `src/shared/motion.ts` không phải `prefersReducedMotion`.
- `src/slide/edit.tsx` không lưu ảnh bằng `backgroundImageId`, `backgroundImageUrl`, `backgroundImageAlt`.
- Cần một hành vi không có trong §2, §8, §8a, §9.
- Sắp sửa file ngoài danh sách trên.

Không dừng để hỏi lại F1–F7, template 3/4/5, tên `style.css`, hai handle CSS, hay `style_handles`.

## Xong lượt thì báo

- File đã tạo và file đã sửa.
- Chỗ bám §9 bước nào.
- Lệnh build để human tự chạy, nguyên văn trong §9.
- Không ghi PASS, không ghi đã nghiệm thu.
```
