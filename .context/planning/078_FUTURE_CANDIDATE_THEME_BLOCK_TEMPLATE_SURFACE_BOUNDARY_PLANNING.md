# Theme vs Block — Template Surface Boundary (Planning)

Created: **2026-11-16**. Status: **OPEN — planning; chưa start implementation**.  
Human **2026-11-16**: không triển khai **1.3.23 — Post Page Basic Design Controls** theo shortcut Theme Design (pattern plan067) cho đến khi plan này được chốt. Scope **1.3.23** chuyển **stockpile 1.4.x** (SemVer cụ thể TBD sau planning + đối chiếu roadmap 039 / 047).

Đọc trước: [`theme-template-editor-fse-transition-research-2026-11-03.md`](../../docs/research/theme-template-editor-fse-transition-research-2026-11-03.md), decision [`template-surface-theme-block-boundary.md`](../../docs/decisions/template-surface-theme-block-boundary.md), plan [077](077_VER_1_3_22_PDP_RELATED_GLOBAL_PROMOTE_AND_ADMIN_PLAN.md) (related global → admin, không dual Theme Design).

Không bump metadata, không chuyển current, không code trong lượt mở plan này trừ khi human lệnh riêng.

---

## 1. Vấn đề

Quyết định dự án: **tách rõ theme builder / template surfaces** khỏi **block canvas** (Marine Blocks = block chuyên dụng + patterns, không full-FSE supercharger; Design Sidebar ≠ Template Editor — research 2026-11-03 §3).

Thực tế 1.3.22:

- **Per-entity** PDP controls trên màn edit product (meta box / document panel) — phù hợp phạm vi entity.
- **Site-wide** PDP layout trong **Theme Design → group `product`** (sidebar Marine Blocks khi edit page/post block editor) — **lệch** ranh giới trên: điều khiển template-ish trong shell block editor.

1.3.23 được map ban đầu **copy pattern 067** (POST thay PDP) — human xác nhận **không ổn**; cần planning sâu trước khi có execution plan POST-*.

---

## 2. Bốn lớp (giữ từ research)

| Lớp | Câu hỏi | Owner dự kiến |
|---|---|---|
| Dữ liệu | Nội dung entity? | WP/Woo native; plugin logic B2B bổ sung |
| Template | Cấu trúc trang dùng chung? | Theme (PHP → 2.0 block templates dần) |
| Thiết kế / token | Font, palette, spacing system? | Theme visual system; token edits khi sửa block có thể ở Theme Design |
| Hành vi | RFQ, collection query, slider… | Plugin |

**Template preset** (cột, ẩn khối, sidebar on/off, content width) = lớp **Template**, không phải block attribute trên page canvas.

---

## 3. Phân loại surface (draft registry)

| Surface | Ví dụ | Global default UI (đích) | Per-entity UI | Render owner |
|---|---|---|---|---|
| Token | palette, heading, fonts | Theme Design sidebar (đã chốt 048) | N/A (hoặc block attrs) | Theme |
| Block instance | Collection, Category Grid | N/A | Selected block tab | Plugin attrs + theme CSS |
| Template preset — product | columns, showQuote… | **TBD** — ưu tiên admin Marine hub (như 077 Related) | Product edit screen | Theme read option/meta |
| Template preset — post | sidebar, featured image… | **TBD** — cùng hub pattern | Post edit screen | Theme |
| Template preset — related cards | 19 key `skvn_pdp_related` | Admin SKVN Marine → Related (077) | Product panel + Promote | Theme presenter |

**Nguyên tắc đề xuất (cần human chốt):**

1. Không thêm **group template mới** vào Theme Design sau khi plan chốt (ngoại lệ chỉ bằng lệnh human).
2. Global template-ish settings → **một hub admin** (submenu Marine Blocks / SKVN Marine), một form canonical mỗi option.
3. Per-entity override → **luôn** màn edit CPT (product, post).
4. Frontend single product/post → **không** canvas; chỉ preview qua link / staging.

---

## 4. Tension với source hiện tại (không rollback trong plan này)

| Item | Hiện trạng | Hướng stockpile 1.4.x |
|---|---|---|
| `skvn_product_design` global save | Theme Design group `product` (067 P3) | Đánh giá migrate UI sang admin; giữ option key + theme read path |
| `skvn_pdp_related` global | Admin Related products (077) | Giữ; precedent cho hub |
| Post page design | Chưa code (1.3.23 deferred) | Execution chỉ sau §7 gate |

Source 1.3.22 **giữ chạy**; rework UI global PDP có thể gộp milestone 1.4.x sau khi boundary chốt — không tự gỡ group `product` trong lượt planning.

---

## 5. Deliverables planning (trước execution POST/PDP global)

- [ ] **SURFACE-01** — Bảng registry đầy đủ (product, post, archive defer, archives TBD) + owner UI/render.
- [ ] **SURFACE-02** — Decision memo: global PDP UI (sidebar vs admin vs hybrid) và timeline so với 1.4.0 Marine Blocks migration.
- [ ] **SURFACE-03** — POST-TRACE-01 + PDP follow-up: map 1.3.5 acceptance; delta only.
- [ ] **SURFACE-04** — SemVer: gán slot 1.4.x cho Post Page Basic Design Controls + optional PDP global UI rework (không tự 1.4.4 nếu đã dùng).
- [ ] **SURFACE-05** — Migration ledger 2.0: option/meta key → future template part / theme.json (ghi defer, không implement).
- [ ] **SURFACE-06** — Execution plan riêng (tương tự 067) **sau** SURFACE-01/02 approved — không copy P3 Theme Design mù quáng.

---

## 6. Stockpile 1.4.x — hạng mục liên quan boundary

Ghi tại `MILESTONES.md` §1.4.x stockpile. Thứ tự **chưa chốt**; phụ thuộc 1.4.0 Migration gate:

| Hạng mục | Nguồn SemVer cũ | Trạng thái |
|---|---|---|
| Post Page Basic Design Controls | 1.3.23 | Stockpile; chờ plan 078 + execution |
| PDP global UI alignment (optional) | carry từ 067 P3 | Stockpile; cùng boundary decision |
| PDP Related independence B/C | tension OPEN 2026-11-15 | Đã ghi 1.4.x; plan riêng khi start |

---

## 7. Gate start implementation

**Không** lập execution plan POST / không mở coding 1.4.x slot Post Page cho đến khi:

- Human chốt SURFACE-01/02 (ít nhất product + post global UI owner), **và**
- SemVer 1.4.x slot được xác nhận theo AGENTS Version Naming Rule.

Lệnh “implement” riêng cho từng slot sau gate.

---

## 8. Tài liệu tham chiếu

- Plan [067](067_VER_1_3_22_PRODUCT_PAGE_DESIGN_CONTROLS_EXECUTION_PLAN.md) — P3/P4 technical contract; UI global P3 là điểm tension.
- Ideation sidebar §4.1 — Theme Design = typography/fonts/brand.
- [`docs/workflows/ideation-plugin-design-sidebar.md`](../../docs/workflows/ideation-plugin-design-sidebar.md)
- Roadmap [039](039_ROADMAP_C_B2B_TOOLKIT_CAROUSEL_FIRST_PLANNING.md) — cập nhật mapping 1.3.23 → stockpile khi human duyệt commit docs.

---

## 9. Open questions (human)

1. Post Page stockpile: **trước hay sau** 1.4.0 Migration trong queue 1.4.x?
2. Có **một** submenu “Template surfaces” gom Product page + Post page + (sau này) archives, hay tách submenu như Related?
3. Có migrate global `product` group khỏi Theme Design **cùng đợt** với Post, hay giữ sidebar tạm đến hết 1.3.x maintenance?

Default conservative: **chờ 1.4.0 identity/menu** rồi làm admin hub thống nhất; không thêm surface vào Theme Design.