# Prompt — GLM code Step Slider giai đoạn 2

Dùng sau khi plan 079 §10a đã khóa (2026-11-16). Copy từ dòng `Bạn làm việc` đến hết.

```text
Bạn làm việc trong D:\Github\skvn-marine.

Nhiệm vụ: code giai đoạn 2 của Fullscreen Step Slider theo §10 và §10a. Không chạy build, lint, deploy. Không commit. Không kết luận runtime PASS. Không ghi giai đoạn 1 đã nghiệm thu.

Plan duy nhất: `.context/planning/079_VER_1_3_24_FULLSCREEN_STEP_SLIDER_EXECUTION_PLAN.md`

Đọc theo thứ tự, rồi code:

1. Mở đầu plan đến hết §3.
2. §8, §8a, §9a, §10, §10a.
3. Năm file được sửa, đúng phạm vi bên dưới.
4. `wp-content/plugins/skvn-marine-blocks/node_modules/swiper/modules/autoplay.mjs` — chỉ để bám các dòng §10a đã trích. Không chọn lại event.

Không đọc `docs/ideations/step-slider-phase2/glm.md`, `ink.md`, plan018 từ §5 trở đi, prototype HTML, technical report, demo-prep. Không đọc `src/slider/view.ts` hay `src/slider/edit.tsx`. Không tìm block khác để tham khảo.

§10a thắng draft của bạn. Hai chỗ draft đó đã bị loại: ngưỡng IntersectionObserver `0.5`, và để Swiper một mình lo `document.hidden`.

## Đã khóa, không chọn lại

Không đổi số 800 / 400 / 0 / 100 / 200 / 300, không đổi `translateY(0.75rem)`. Không đổi tab §9a: absolute, `inset-inline: 0`, `bottom: 0`, `overflow-x: auto`, `max-width: 100%`. Không `100vw`, không margin âm, không `overflow-x` trên shell.

Không thêm `rewind`. Không Ken Burns, O08-E, Content Actions, deep-link. Không Inspector cho focal, `overlayPreset`, `textSurface`, `textPosition`, Play.

Loop là một cờ. Bật: mũi tên và autoplay từ bước cuối về bước đầu. Tắt: mũi tên dừng ở hai đầu, autoplay không `slideTo(0)`.

Đồng hồ progress: dwell đầu ở `autoplayStart`. Dwell sau ở `autoplayResume`. Width chỉ khi `autoplay.running && !autoplay.paused`, công thức `(1 - timeLeft / delayTotal)`, clamp 0–100%. Không `setInterval`. Không CSS `transition: width` làm đồng hồ. Không dùng `autoplayTimeLeft` khi `paused`.

`stopOnLastSlide` là `!loop`. Không gọi `autoplay.stop()` khi vừa tới bước cuối. Dwell bước cuối chạy hết. Hết dwell thì progress kẹp 100%. Play trên bước cuối chạy lại dwell đó rồi không sang bước khác.

`disableOnInteraction: false` viết tường minh. `pauseOnMouseEnter: false`. `waitForTransition: true`. Không gắn click `slidePrev` / `slideNext` riêng. Navigation vẫn dùng `prevEl` / `nextEl`.

Pause tạm là một chồng của mình: hover chuột, `document.hidden`, `intersectionRatio === 0`. Resume chỉ khi cả ba hết và không đang focus-stop. Trên `autoplayResume`, nếu một điều kiện tạm vẫn còn thì `pause()` lại ngay. Ngưỡng không phải `0.5`.

`focusin` trong root thì `autoplay.stop()` và hiện Play. `focusin` từ chính nút Play không gọi `stop()`. Click Play thì `autoplay.start()` và ẩn nút. Rời focus không tự chạy lại.

Reduced motion: không autoplay, không progress, không hiện Play. `speed: 0` của giai đoạn 1 giữ nguyên.

## File được sửa

- `wp-content/plugins/skvn-marine-blocks/src/step-slider/block.json` — thêm `autoplay` boolean default true, `dwellPreset` string enum `5`|`8`|`10` default `8`, `loop` boolean default true. Giữ `align` default `full`.
- `wp-content/plugins/skvn-marine-blocks/src/step-slider/edit.tsx` — Inspector tiếng Anh: Autoplay, Dwell (5/8/10 seconds), Loop. Hết.
- `wp-content/plugins/skvn-marine-blocks/modules/step-slider-render/step-slider-render.php` — `data-autoplay`, `data-dwell`, `data-loop` trên root, escape. Ngoài enum thì dwell là `8`. Span `skvn-step-slider__tab-progress` trong mỗi tab, `aria-hidden="true"`. Nút Play `hidden`, nhãn qua `esc_html__( 'Play', 'skvn-marine-blocks' )`, là anh em của `.swiper`.
- `wp-content/plugins/skvn-marine-blocks/src/step-slider/frontend.ts` — import `Autoplay`. Autoplay chỉ khi `data-autoplay` là `1` và không reduced motion. Delay 5000 / 8000 / 10000, giá trị khác thì 8000. `loop` theo `data-loop`, tắt khi chỉ một bước. `syncControls`: `prev.disabled = !loop && isBeginning`, `next.disabled = !loop && isEnd`.
- `wp-content/plugins/skvn-marine-blocks/src/step-slider/style.css` — span progress trong pill, `pointer-events: none`. Nút Play ẩn đến khi focus-stop. Print ẩn Play. Reduced motion không animate progress. Không đổi khung tab §9a.

Không sửa `package.json`, `src/index.ts`, `skvn-marine-blocks.php`, `editor.css`, file Slider/Slide, theme, plan 079.

## Dừng và hỏi human khi

- `autoplay.mjs` đã cài không còn `onTransitionEnd` gọi `resume()`, hoặc `proceed()` không còn nhánh `stopOnLastSlide` / `slideTo(0)`.
- Sắp sửa file ngoài năm file trên.
- Cần một hành vi không có trong §10 và §10a.

Không dừng để hỏi lại event progress, ngưỡng viewport, `disableOnInteraction`, `stopOnLastSlide`, hay vị trí nút Play.

## Xong lượt thì báo

- File đã sửa và chỗ bám §10 bước nào.
- Lệnh build để human tự chạy, nguyên văn:

```bash
source /home/shinkuro/.nvm/nvm.sh && nvm use 20 && cd /mnt/d/Github/skvn-marine/wp-content/plugins/skvn-marine-blocks && npm run build && find modules/ -name "*.php" -exec php -l {} \;
```

- Không ghi PASS, không ghi đã nghiệm thu.
```
