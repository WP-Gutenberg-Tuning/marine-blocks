# PDP Related — Card Profile & Chip Display

Status: ACTIVE
Milestone: V1 / 1.3.22 (scope addition 2026-11-14)
Lifecycle: active
Notes: Human chốt 2026-11-14 sau phản biện kiến trúc; gộp **1.3.22** qua Q&A 9 điểm. **2026-11-14 (amend):** owner `useCustomRelatedCard` (default off) — inactive = Woo native kể cả option đã save; active khi bool true sau resolve. Args: `posts_per_page = relatedCount`, `columns = clamp(relatedCount, 1, 4)`. Còn lại: site default Theme Design `related`; per-product panel + classic meta; grouped specs gate 060; chip hai lớp + `displayTagLimit`; copy một lần (first block only notice). Defer: upsells, intersection, token typography. Planning: `.context/planning/076_VER_1_3_22_PDP_RELATED_CARD_PROFILE_PLAN.md`.

## Problem

Single product **Related products** dùng Woo loop + theme `ul.products`, không dùng shared `skvn-collection-card`. Cần đồng bộ card với Product Collection **không** phá query related, **không** phụ thuộc block instance trên một trang.

## Decision

### D1 — Profile owner (hướng A)

| Layer | Storage | Capability pattern |
|---|---|---|
| Site default | Option `skvn_pdp_related` | `manage_options` (Theme Design group `related`) |
| Per-product override | Post meta `_skvn_pdp_related` | `edit_post` (panel product, giống 1.3.22) |

Render: `skvn_marine_blocks_render_product_card( $product, $attrs, 'related' )` (context **`related`** tách khỏi `archive` / `grid` / `carousel`).

### D1b — Activation owner

- Schema key **`useCustomRelatedCard`** (bool, default **`false`**).
- Runtime active iff `skvn_marine_blocks_pdp_related_is_active( $resolved )` → `useCustomRelatedCard === true` (sau sanitize). Không dùng “diff so với default”.
- Inactive: không template swap, không args filter, không enqueue card CSS — Woo native nguyên vẹn.

### D2 — Style attrs (whitelist, không query attrs)

- Lưu **subset attrs card** presentation-only (15 keys site / 15 + `override` meta).
- **Không** lưu query attrs block (`categories`, `tags`, `itemsToShow`, …).
- **Copy một lần:** “Copy card settings” từ page → sanitize vào option; set `useCustomRelatedCard` **true**; **first Product Collection block on page only**; not linked.

### D3 — Query (Woo only)

- Related IDs/order: Woo native.
- Khi active: `posts_per_page = relatedCount` (1–10); **`columns = min( max( relatedCount, 1 ), 4 )`** — không control columns riêng v1.
- Không map taxonomy/query từ Collection block.

### D4 — Chip / taxonomy display (v1)

- Hai lớp: `show*` + allowlist `chipAllow*`; render iff `showX && chipAllowX`.
- Editor: allowlist **disabled** khi `show*` off.
- Cap `displayTagLimit`; intersection highlight defer.

### D5 — Boundary & regression

- Template swap scoped related loop only; plugin inactive → no swap.
- Archive/grid/carousel contexts không đổi.

## Rejected

- Live runtime bind tới Product Collection block.
- Inferred “profile active” khi save Theme Design toàn default (không có owner bool).
- UI `columns` tách khỏi `relatedCount` v1.
- Picklist term ID; intersection strict.

## Implementation pointers

- Plan: `.context/planning/076_VER_1_3_22_PDP_RELATED_CARD_PROFILE_PLAN.md` (P0 gate specs + Woo hooks trước P4).
- Plugin: `modules/pdp-related-settings/`, presenter `related` in `cards.php`, Theme Design group.
- Theme: `inc/pdp-related.php`, related template-part; hooks gated by `is_active`.

## Related

- `.context/planning/060_VER_1_3_20_ARCHIVE_PRODUCT_CARD_REUSE_PLAN.md`
- `docs/decisions/skvn-dynamic-collections-1.3.3.md`
- `.context/planning/067_VER_1_3_22_PRODUCT_PAGE_DESIGN_CONTROLS_EXECUTION_PLAN.md`
