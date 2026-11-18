# Template Surface vs Block — Boundary & 1.3.23 Deferral

Status: **ACTIVE**  
Recorded: **2026-11-16**

## Context

Human xác nhận sau review plan067 pattern: single product/post **không** là block canvas; quyết định dự án **tách theme/template surfaces** khỏi **Marine Blocks** block editor (research 2026-11-03; Marine Blocks positioning 2026-11-04). Đặt global PDP defaults trong Theme Design sidebar (067 P3) là shortcut triển khai, **không** đồng nghĩa đã chốt boundary lâu dài. Plan 077 đã chuyển global Related ra admin — precedent cho template-ish global settings.

## Decision

1. **Defer** milestone **V1 / 1.3.23 — Post Page Basic Design Controls** — không implementation cho đến khi planning boundary hoàn tất.
2. **Stockpile** scope 1.3.23 trong **1.4.x** (SemVer cụ thể TBD); acceptance POST-* giữ tại MILESTONES, status Chưa làm.
3. Mở planning [**078**](../../.context/planning/078_FUTURE_CANDIDATE_THEME_BLOCK_TEMPLATE_SURFACE_BOUNDARY_PLANNING.md) làm source of truth cho registry surface, global UI owner, và gate trước execution plan.
4. **Không rollback** source 1.3.22 (PDP controls, Related admin); optional rework global PDP UI (067 P3) xếp stockpile 1.4.x cùng boundary plan.
5. **Current milestone pointer** chuyển sang **1.3.24 — Fullscreen Step Slider** (PLANNED only) — **không** auto-start; mọi implementation cần lệnh human.

## Invariants (until superseded)

- Design Sidebar Theme Design: **tokens** (palette, fonts, heading) — không mở thêm group template mới sau boundary chốt trừ lệnh human.
- Template presets site-wide: **hub admin** (pattern 077), không dual-edit.
- Per-product / per-post layout overrides: **entity edit screen** only.
- Theme owns render (PHP/CSS/body class); plugin owns editor persistence where agreed in execution plan.

## Supersedes

Không hủy mapping human 2026-11-03 (1.3.22 Product / 1.3.23 Post) về **thứ tự nghiệp vụ** — chỉ **đổi timeline**: Post không còn 1.3.23 current.

## Evidence

- Chat review 2026-11-16 (Theme Design ≠ template editor; 067 UX critique).
- [`template-surface`](../../.context/planning/078_FUTURE_CANDIDATE_THEME_BLOCK_TEMPLATE_SURFACE_BOUNDARY_PLANNING.md), MILESTONES transition 2026-11-16.

## Next

Human trả lời open questions plan 078 §9 → chốt SURFACE-01/02 → gán SemVer 1.4.x → execution plan Post (và optional PDP global UI).