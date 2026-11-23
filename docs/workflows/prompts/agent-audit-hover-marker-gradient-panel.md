# Prompt — Rà soát Pattern A (hover marker DOM) + Pattern B (gradient panel)

Ngày mẫu: **2026-11-23**. Human giao prompt = **audit + ghi inventory**; sửa code chỉ khi finding rõ và trong scope file (hoặc human nói `fix`).

Copy toàn bộ khối `text` bên dưới cho agent khác.

```text
Bạn làm việc trong D:\Github\skvn-marine (repo source theme/plugin — không phải WP runtime root).

## Mục tiêu

Rà toàn bộ codebase (ưu tiên wp-content/plugins/skvn-marine-blocks/, sau đó wp-content/themes/skvn-marine/) tìm chỗ **tương tự** hai pattern đã xảy ra với Step Slider CTA + core/button Hover Colors — không cần y chang selector hay file.

**Bắt buộc cập nhật register:** mọi finding (kể cả “đã OK” / false positive có lý do) phải ghi vào:

  docs/audits/hover-marker-gradient-panel-pattern-inventory.md

- Thêm row mới ID HMGP-00N hoặc cập nhật Status/notes row có sẵn.
- Không tạo file audit song song khác cho cùng chủ đề.

Đọc trước (ngắn):

1. docs/audits/hover-marker-gradient-panel-pattern-inventory.md — Pattern A + B + bảng inventory
2. .context/PITFALLS.md — DP-18 (case đã fix), AP-16 (quy trình agent)
3. src/core-controls/button-hover/style.css — comment DOM editor (marker trên ancestor)
4. modules/core-control/features/button-hover.php — marker trên .wp-block-button frontend

Đọc AGENTS.md L0; không đọc hết CONVENTION.md. Không sửa themes/generatepress/**.

## Pattern A — Marker editor ≠ marker frontend

Định nghĩa “tương tự”:

- Feature dùng class marker + CSS variables trên block (hover, tone, extension SKVN).
- Frontend PHP/render đặt marker trên **element A**; editor BlockListBlock đặt marker trên **ancestor** của A.
- CSS block/theme đặt marker trên **cùng element A** (`A.marker`, `A:not(.marker)`) với specificity cao hơn rule global `.marker A` → preview editor sai hoặc preset luôn thắng.

Việc cần làm:

- Grep: has-skvn-btn-hover, has-skvn-button-hover, editor.BlockListBlock, wrapperProps, :not(.has-skvn, kết hợp .wp-block-button, skvn-cta, skvn-slide, scoped preset CSS.
- Với mỗi hit: ghi file:line, mô tả DOM editor vs frontend, Status OPEN/FIXED/N/A.
- Nếu OPEN và human đã bảo fix: áp repair dual selector (.marker .A và .A.marker) như inventory; tối đa 3–5 file.

## Pattern B — PanelColorGradientSettings clobber attribute

Định nghĩa “tương tự”:

- Hai attribute (solid + gradient) hoặc color + gradient dùng chung panel.
- onColorChange / onGradientChange gọi setAttributes với value || '' VÀ xóa kênh kia kể cả khi value === undefined.

Việc cần làm:

- Grep: PanelColorGradientSettings, onGradientChange, onColorChange, setAttributes trong src/**/*.tsx.
- Đọc từng handler; phân loại SAFE (guard undefined / chỉ clear sibling khi truthy) vs UNSAFE.
- Ghi inventory; fix UNSAFE giống button-hover/index.tsx (return sớm nếu undefined).

## Deliverable (trả human)

1. Bảng tóm tắt: ID | Pattern | File | Status | 1 câu
2. Link/path file inventory đã cập nhật
3. Nếu đã sửa code: list file + lệnh build (agent không tự chạy build trừ human lệnh):

   source /home/shinkuro/.nvm/nvm.sh && nvm use 20 && cd /mnt/d/Github/skvn-marine/wp-content/plugins/skvn-marine-blocks && npm run build

## Không làm

- Không bump milestone/metadata
- Không git commit/push
- Không kết luận runtime PASS onsite
- Không mở scope Marine Blocks migration / rename prefix
```

## Human one-liner

> Audit Pattern A+B theo `docs/workflows/prompts/agent-audit-hover-marker-gradient-panel.md`; cập nhật `docs/audits/hover-marker-gradient-panel-pattern-inventory.md`.