# Prompt — Rà lại WP6 Hover marker (1.3.25)

Ngày: **2026-11-23**. Human giao prompt này = **rà lại source**, không code.

Các lỗi đã bàn và đã gán vào milestone hiện tại **V1 / 1.3.25 — Plugin convention gap**, gói **WP6**. Không mở WP1–WP5.

Copy toàn bộ khối `text` bên dưới cho agent khác.

```text
Bạn làm việc trong D:\Github\skvn-marine (repo source theme/plugin — không phải WP runtime root).

Current: V1 / 1.3.25 — Plugin convention gap. PLANNED, chưa start code ở lượt này.
Milestone này làm WP6 sau khi rà. Lượt prompt này chỉ rà. Không sửa CSS, PHP, contract, pitfall. Không bump, không commit, không build, không kết luận runtime PASS.

## Việc cần làm

Rà lại các lỗi đã bàn cho WP6, đối chiếu source hiện tại với inventory và plan. Ghi kết quả vào đúng inventory. Không tạo file audit song song.

Đọc trước, theo thứ tự:

1. .context/planning/089_VER_1_3_25_HOVER_MARKER_PRESET_CASCADE_REPAIR_PLAN.md — hướng A, memo, file được phép
2. .context/planning/084_VER_1_3_25_PLUGIN_CONVENTION_GAP_AUDIT.md — chỉ mục WP6
3. docs/audits/hover-marker-gradient-panel-pattern-inventory.md — Pattern A + B và bảng HMGP
4. .context/PITFALLS.md — DP-18 và AP-16 (năm luật, phần quan sát / suy luận)
5. docs/standards/gutenberg-block-extension-css-contract.md — Quy tắc 1 và 2
6. src/core-controls/button-hover/style.css
7. modules/core-control/features/button-hover.php
8. src/core-controls/button-hover/index.tsx — chỗ gắn marker lên wrapper
9. wp-content/themes/skvn-marine/style.css — dòng 189–214, 1436, 2361–2409
10. wp-content/themes/skvn-marine/inc/setup.php — add_editor_style

Đọc AGENTS.md mục current. Convention: L0 (Chỉ mục + 0.1–0.5). Không đọc hết CONVENTION.md. Không sửa themes/generatepress/**.

## Phạm vi rà

Chỉ các hàng đã bàn:

- HMGP-001 đến HMGP-008, HMGP-012 đến HMGP-017: xác nhận FIXED hoặc N/A còn đúng. Lệch thì sửa Status/notes, không recycle ID.
- HMGP-009, HMGP-010, HMGP-011: đây là việc WP6. Đếm lại specificity trên source, không chép số từ plan nếu selector đã đổi.
- Năm luật AP-16: còn khớp source hay không. Luật 5 (câu contract “iframe không có theme rule”, specificity (0,2,1)) kiểm bằng cách đọc contract và setup.php.

Ngoài phạm vi: PCA-01–21, WP1–WP5, file Step Slider, đổi hướng A sang B, digest CONVENTION.md.

## Cách đếm

Pseudo-class và class cộng vào một ô. :hover tính một. :not(.x) tính specificity của .x. !important không tăng specificity; nó thắng declaration không !important.

Ghi lại selector đang có, số (0,a,b), và có !important hay không, cho:

- Editor marker trong button-hover/style.css
- Frontend marker trong button-hover.php
- Theme primary / secondary / is-style-skvn-primary :hover
- Theme .skvn-button--text và .skvn-button--white (base và :hover)
- Theme newsletter band, dòng style.css:1436
- Step CTA custom trong step-slider/style.css và editor.css (chỉ đọc, không sửa): còn cao hơn rule global và còn set border-color riêng hay không

## Kết luận từng hàng OPEN

Với 009, 010, 011 chọn một:

- Còn đúng: premise plan 089 vẫn đúng, hướng A vẫn là việc code khi có lệnh implement.
- Lệch: ghi selector và số mới. Nếu lệch làm hướng A sai hoặc thừa, DỪNG, không đề xuất code trong cùng lượt. Ghi delta vào notes inventory và một mục ngắn cuối plan 089.
- Đã hết: source đã có selector (0,6,0) và !important đúng hướng A. Đổi hàng đó sang FIXED source, chưa runtime PASS.

Hướng B (gỡ !important theme) vẫn mở. Rà không được chọn B thay A.

## Ghi inventory

File duy nhất: docs/audits/hover-marker-gradient-panel-pattern-inventory.md

- Cập nhật notes hàng đã rà. Thêm hàng HMGP-00N chỉ khi có finding mới cùng Pattern A hoặc B.
- Dòng đầu file: một câu ngày rà và kết quả 009/010/011 (còn đúng / lệch / đã hết).
- Không xóa hàng FIXED.

## Trả human

Bảng: ID | Còn đúng với plan 089? | Selector và specificity thấy trong source | Việc còn lại

Rồi một câu: WP6 còn chờ lệnh implement, hoặc đã lệch và dừng ở đâu.

Không đưa lệnh build. Không sửa source trong lượt này.
```

## Human one-liner

> Rà lại WP6 theo `docs/workflows/prompts/agent-handoff-1.3.25-wp6-hover-marker-reaudit.md`. Chỉ rà, chưa code.
