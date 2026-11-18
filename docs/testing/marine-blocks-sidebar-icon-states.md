# Marine Blocks Sidebar Icon States — Onsite Test Runbook

Plan: [080_FUTURE_CANDIDATE_MARINE_BLOCKS_SIDEBAR_ICON_STATES_PLANNING.md](../../.context/planning/080_FUTURE_CANDIDATE_MARINE_BLOCKS_SIDEBAR_ICON_STATES_PLANNING.md) · Milestone hiện tại: **V1 / 1.3.24 (scope addition)** · Ngày tạo: 2026-11-16

**Trạng thái: chưa chạy — chờ human build + onsite verify.** Source đã có, runtime CHƯA PASS.

## Target

- Surface: **post/page editor** (block editor) — nút toggle "Marine Blocks" trên toolbar, mở Design sidebar.
- Local: `http://localhost:8080/wp-admin/post.php?post=<id>&action=edit` (môi trường `D:\Github\minhhaifish`).
- Không áp dụng cho frontend site.

## Setup / Preconditions

1. Human đã chạy build (xem lệnh cuối file) → `window.skvnMarineDesign` gồm `iconUrl`, `iconHoverUrl`, `iconSelectedUrl`.
2. **Hard refresh** editor (Ctrl+Shift+R) sau mỗi lần đổi asset/CSS (handle `skvn-marine-blocks-design-sidebar` dùng `filemtime`, WP components cache riêng).
3. Đảm bảo Design sidebar khả dụng trên post đang edit (nút hiện trên toolbar, không phải site editor).

## Test steps

| # | Bước | Expected |
|---|---|---|
| S01 | Mở post editor, nhìn nút Marine Blocks trên toolbar | Hiện **base logo** (navy/vàng, kích thước ~24px); không console error |
| S02 | Đưa chuột vào nút | Chuyển sang **Hover logo** (bản sáng); không giật layout |
| S03 | Đưa chuột ra khỏi nút | Về **base logo** |
| S04 | Bấm nút để mở Design sidebar | Chuyển sang **Selected logo** (bản vàng chủ đạo) |
| S05 | Giữ sidebar mở + hover lên nút | Vẫn **Selected logo** (priority: selected > hover) |
| S06 | Bấm nút lần nữa để đóng sidebar | Về **base logo**; hover lại hoạt động như S02 |
| S07 | Tab focus vào nút (bàn phím) | Hiện **Hover logo** (qua `:focus-visible`); focus ring native của button còn nguyên |
| S08 | Prefs → bật "Show icon labels" (nếu có) → xem nút | **Core sẽ thay icon bằng checkmark + text "Marine Blocks"** — hành vi core, KHÔNG phải lỗi; tắt pref để quay lại test S01–S07 |
| S09 | (Fallback test) Đổi tên tạm `assets/icons/marine-blocks-hover.svg` → build lại → reload | Nút vẫn hiển thị base (hover không hiệu lực), không lỗi JS; restore file sau test |

## Pass/Fail criteria

- PASS: S01–S07 đúng expected; S08 đúng core behavior; console sạch (không error từ `skvnMarineDesign` / icon component).
- FAIL: bất kỳ state nào vắng/không đổi, layout icon tràn nút, console error, hoặc mất focus ring.

## Evidence human cần report

- Screenshot ×3: default / hover / selected (+ 1 shot khi sidebar mở + hover).
- Console log nếu có error (copy text).
- Xác nhận đã hard refresh; mô tả trình duyệt + WP version.
- Kết quả prefers-reduced-motion không cần (không dùng animation).

## Build/lint — human chạy (agent không tự chạy)

```bash
source /home/shinkuro/.nvm/nvm.sh && nvm use 20 && cd /mnt/d/Github/skvn-marine/wp-content/plugins/skvn-marine-blocks && npm run build && find modules/ -name "*.php" -exec php -l {} \;
```

## Notes

- Icon URL đi qua `plugins_url()` (browser cache); source-of-truth file SVGs giữ tại `docs/ideations/icon logo/` (bản full metadata/c2pa).
- `assets/` được `tools/build-deploy-artifact.mjs` copy nguyên vào deploy zip → 2 SVG tự theo vào artifact.
