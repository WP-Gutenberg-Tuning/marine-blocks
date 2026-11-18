# Prompt — Marine Blocks panel / Theme Design không hiện (multi-agent diagnosis)

**Mục đích:** Nhiều agent/model cùng chẩn đoán **một** sự cố; mỗi agent ghi kết quả vào ledger, ký tên model. **Không** implement fix trừ khi human nói `fix` / `CODE_NOW`.

Copy khối `text` bên dưới sang agent mới. Đổi dòng **MODEL** theo model human đang dùng.

```text
Bạn làm việc trong D:\Github\skvn-marine (source repo). Task: CHẨN ĐOÁN ONLY.

MODEL (bắt buộc ghi đúng slug vào ledger): <human điền, vd. composer-2.5, gpt-5.6-sol-medium>

## Vấn đề

Trên production https://minhhaifishery.com — editor page Home:
/wp-admin/post.php?post=22&action=edit

Không có sidebar tab **Marine Blocks** (⋮ → Preferences → Panels không liệt kê Marine Blocks; chỉ WindPress + core).

Human đã build plugin và upload; cần tìm **lỗi runtime/load/điều kiện code**, không giả định “chưa deploy”.

## Ledger (bắt buộc)

1. Đọc TRƯỚC: docs/testing/marine-blocks-theme-design-panel-diagnosis-ledger.md (toàn bộ agent entries đã có).
2. Sau khi chẩn đoán xong: APPEND một section mới theo template trong ledger.
3. Tiêu đề entry: `### [YYYY-MM-DD HH:MM] | Model: <slug>`
4. Không sửa/xóa entry agent khác; không ghi đè “Code facts”.

## Source đọc (bắt buộc, grep/read cụ thể)

- wp-content/plugins/skvn-marine-blocks/src/design-sidebar/index.tsx
- wp-content/plugins/skvn-marine-blocks/src/design-sidebar/navigation.tsx
- wp-content/plugins/skvn-marine-blocks/modules/typography-settings/typography-settings.php (design_bootstrap, design_theme_supported)
- wp-content/plugins/skvn-marine-blocks/skvn-marine-blocks.php (editor script register)
- wp-content/plugins/skvn-marine-blocks/src/index.ts (import design-sidebar, pdp-related panel)
- wp-content/themes/skvn-marine/inc/customizer.php (design_sidebar_contract capabilities)

## Không làm

- Không build/lint/deploy/git push (AGENTS.md).
- Không sửa source trừ khi human yêu cầu fix trong cùng thread.
- Không đọc toàn repo; không load ai-rules.md tự động.
- Không claim onsite PASS nếu không có evidence human.

## Agent được làm

- Đọc code → liệt kê chuỗi điều kiện render panel (AND chain).
- Map vào checklist H1–H9 trong ledger; đánh dấu CONFIRMED / LIKELY / RULED OUT từng H với lý do.
- Nếu human đã paste console/network/theme version → dùng làm evidence; nếu chưa có → **đưa checklist ngắn** human chạy trên production (copy-paste console snippets).
- So sánh với entry agent trước: tránh lặp; nếu đồng ý/khác → nói rõ “agrees with Model X” hoặc “disagrees because …”.

## Human evidence requests (nếu thiếu data)

Yêu cầu human (trên post 22 edit, F12):

1. Console: `skvnMarineDesign`
2. Console: `typeof wp?.plugins?.getPlugin?.('skvn-marine-design')`
3. Network filter: `index.ts.js` — URL, status, size
4. View page source: có chuỗi `skvnMarineDesign` trong HTML không
5. Active theme name + Plugins → SKVN Marine Blocks version
6. ⋮ → Preferences → Panels — screenshot full list sau hard refresh

## Output trong chat (ngắn)

- 1 câu verdict
- Link file ledger đã append
- 3 bullet next step cho human

## Acceptance entry ledger

- Có **Model:** slug
- Có ít nhất 2 hypothesis H# với evidence hoặc “blocked: cần human step N”
- Có **Confidence** và **Recommended fix owner**
```

## Gợi ý human — chạy song song nhiều model

1. Mở ledger trong editor; mỗi agent một chat/thread.
2. Paste prompt; đổi `MODEL:` từng lần.
3. Sau 2–3 entry: human đọc verdict trùng/khác → chọn một hướng fix hoặc gom evidence thiếu.
4. Khi đã chốt root cause → chat mới `CODE_NOW` với file allowed list hẹp (hoặc ops deploy).