# Self-check trước commit 

## Theme vs Plugin independence

- Block plugin phải đúng khi **chỉ** cài plugin (không cần `skvn-marine` `style.css`).
- Hai lớp width hợp lệ: theme = canvas SKVN cho **mọi** `.alignfull`; plugin = hộp **chính block** đó.
- Chrome block (tab, mũi tên, overlay, heading, runtime) đi cùng zip plugin.
- Đối chiếu: GLOBAL A13, `docs/standards/css-layout-safety-contract.md`, DP-12.

## Width / deploy check (DP-12):
- [ ] `npm run build` + zip plugin ≠ upload theme `style.css`. `?ver=` theme là `filemtime` trên server đang chạy — chưa giả định đã deploy
- [ ] Local có selector mà live CSS bytes / computed style không có → ghi **chưa deploy**, không ghi "CSS sai"
- [ ] Block dùng Gutenberg `alignfull`: reset GP bleed nằm CSS plugin (`width: 100%; margin: 0`; specificity ≥ `body:not(.no-sidebar) .entry-content .alignfull` `(0,3,1)`). Không đòi `body.skvn-full-width-canvas`
- [ ] Theme adapter canvas cho mọi `.alignfull` trên SKVN: không xóa; không coi là đủ cho độc lập plugin
- [ ] Đo `getComputedStyle` / matched styles trước khi kết luận — GP inline có thể thắng theme `(0,3,0)`
- [ ] Không `overflow-x: hidden/clip`, `100vw`, `-50vw`, hay trừ header để che overflow
- [ ] Chrome plugin (tab / mũi tên / heading) và width canvas là hai owner khác nhau — chrome lên không chứng minh width đã đúng

Rút ra sau Pitfall DP06

> Note 2026-11-10: DP-06 bản đầu quy nhầm root cause (attribute `undefined`). Cause đúng: tên component không tồn tại trong runtime `wp.components` (core dist WP 7.1 chỉ có `__experimental*`) — xem DP-06 [CORRECTED] trong `.context/PITFALLS.md`. Checklist dưới giữ nguyên như hygiene chung; đặc biệt áp cho các attr optional không default (P2: `actionGapPx`, `actionWidthPercent`, …).

## Atomic check cho attributes undefined:
- [ ] Kiểm tra tất cả `attributes.X` có `default` trong block.json không
- [ ] Test case: block load với saved content bị mất attribute (undefined)
- [ ] Test case: block load với saved content có attribute value
- [ ] Test case: block load với saved content có attribute là giá trị không mong đợi

## Pattern check:
- [ ] Ternary operator có `else` explicit cho undefined/kông trường hợp không mong đợi không?
- [ ] Boolean toggle có check `!== false`/`=== true` không?
- [ ] SelectControl có value fallback không?