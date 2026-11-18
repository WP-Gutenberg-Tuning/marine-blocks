# Self-check trước commit 

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