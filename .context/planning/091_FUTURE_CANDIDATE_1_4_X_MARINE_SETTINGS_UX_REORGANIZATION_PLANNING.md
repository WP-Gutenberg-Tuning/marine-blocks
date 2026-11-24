# Marine Blocks / SKVN Marine — Settings UX reorganization (Future Candidate 1.4.x)

**Status:** `FUTURE_CANDIDATE` — discussion only; **no implementation**, no SemVer assignment, no bump metadata.  
**Recorded:** 2026-11-24 (human: hay quên cách dùng plugin tự dev; cần dọn cài đặt trước khi làm 1.4.x).  
**Related milestone pointer:** [1.4.1 — SKVN Theme Init Setup UI](../MILESTONES.md) (setup cards); may merge partly into 1.4.1 or follow as separate 1.4.x item after human picks SemVer.

---

## 1. Problem statement

Marketing/dev forget **where** a capability lives because settings are split across:

- **wp-admin** submenu `SKVN Marine` (many flat items),
- **Gutenberg** Marine Blocks sidebar (Selected block vs Plugin tab),
- **Core Control** opt-in flags (defaults **off**),
- **Theme** surfaces (e.g. Page Display on pages only),
- **Woo product** document panels.

Trigger example (2026-11-24): Step/Hero slider default CTA hover — control is **not** on the slider block; it is **Core Button Hover Colors** (Core Control) + **Styles → Hover Colors** on the inner `core/button`.

---

## 2. Current map (source of truth at record date)

| Task | Where today | Why easy to forget |
|------|-------------|-------------------|
| Button hover (text/bg, incl. slider CTA) | Admin → **SKVN Marine → Core Control** → enable *Core Button Hover Colors*; editor: select `core/button` → **Styles → Hover Colors** | Feature **off by default**; unrelated to “Slider” block name |
| Site colors / fonts (Theme Design) | Editor → Marine sidebar → **Plugin** tab; also overlaps **Admin → Typography** | Two surfaces, different save semantics |
| Step fill presets | Editor → Marine sidebar → **Plugin** tab (library) | No obvious admin mirror |
| Footer / header / preloader / blog sidebar | Admin → **SKVN Marine** submenus | Long flat menu; mixed “SKVN” vs “Marine” naming |
| Product page / Related products | Product editor document panels + **Related products** admin | Woo-only |
| Page layout (hide header, full width) | Theme: **SKVN Page Display** panel on **page** in editor | Not under plugin admin menu |

**Admin submenu inventory (plugin):** `skvn-marine` (top: Footer), Footer, Header, Typography, Related products, Core Control, Loading screen, Blog sidebar.

**Mental model (target for docs/UI copy):**

- **Admin** = site-wide, saved in options.
- **Editor Marine sidebar** = per-page/block design + plugin-wide drafts (Theme Design) where applicable.
- **Core Control** = editor feature toggles (not block settings).

---

## 3. Design goals (for 1.4.x discussion)

1. **One place to start** — admin or editor “hub” that answers “I want to change X” with a link or short path.
2. **Less hidden opt-in** for production sites — either sensible defaults or a one-click “Marketing site” preset (human-approved).
3. **Grouped navigation** — fewer mysterious submenu siblings.
4. **Do not** merge unrelated options into one mega-form (footer + typography + core flags share different lifecycles and capabilities).
5. **English-first** product UI strings in plugin; internal planning may stay bilingual.

---

## 4. Candidate directions (pick at 1.4.x kickoff)

### A — Getting started / Setup hub (aligns with 1.4.1 wireframe)

- First card or section under **SKVN Theme init setup** (or rename when Marine Blocks identity lands in 1.4.0).
- Checklist: enable Core Control features needed on this site, links to Footer/Typography, link to editor doc for Theme Design + block design.
- Include **task → path** rows (table below) as static copy until deep links exist.

### B — Regroup wp-admin submenu (label/order only; low risk)

Suggested groups (labels TBD):

1. **Editor & blocks** — Core Control (with plain-language blurbs per feature).
2. **Site layout** — Header, Footer, Loading screen, Blog sidebar.
3. **Catalog / Woo** — Typography (if still site-default fonts), Related products.

Optional: rename top-level **SKVN Marine** → **Marine Blocks** after migration 1.4.0 (identity decision; not automatic).

### C — Core Control presets (policy decision)

- Preset **Marketing / Production**: enable `button_hover` (+ optionally `block_clipboard`) on new installs or via Setup hub one-click.
- Keep **Developer minimal**: all off (current default).
- Must remain reversible; no silent overwrite without admin action.

### D — Editor sidebar copy + deep links

- Plugin tab intro: “Site-wide settings live in admin” with buttons opening `admin.php?page=…` where user has capability.
- Cross-link Core Control: “Hover on buttons requires Core Control → …” when `button_hover` is false (`window.skvnCoreControls`).

### E — Lightweight reference doc (fast win, can ship before hub UI)

- `docs/workflows/marine-settings-map.md` — same table as §2, maintained with code.
- Linked from Setup hub when implemented.

**Not recommended:** single monolithic options page for all modules; duplicates Theme Design; harder capability/nonce boundaries.

---

## 5. Open questions (human at 1.4.x)

| ID | Question |
|----|----------|
| Q1 | Primary audience for hub: **internal dev** vs **client marketing** (presets differ)? |
| Q2 | Merge into **1.4.1 Setup UI** only, or separate version after 1.4.2? |
| Q3 | Default `button_hover` on new sites — change global default in registry vs preset only? |
| Q4 | Typography admin vs Theme Design sidebar — document “two owners” or converge UI? |
| Q5 | Post **1.4.0** rename: menu slug `skvn-marine` vs `marine-blocks` (compatibility)? |

---

## 6. Acceptance sketch (when implemented — not binding now)

- [ ] Human-approved settings map published (workflow doc or in-app hub).
- [ ] Admin menu grouping or hub reduces “where is hover?” to ≤2 clicks from hub.
- [ ] Core Control preset (if chosen) documented + reversible.
- [ ] No regression: existing option keys, capabilities, nonces unchanged unless migration plan says otherwise.
- [ ] Product language English in new UI strings.

---

## 7. Tension / boundary

- **Marine Blocks migration 1.4.0** owns public naming; this UX work should follow identity decision (`docs/decisions`, plan 047).
- **Theme** Page Display stays theme unless human explicitly moves to plugin.
- **No new dependencies** without rationale (AGENTS.md).

---

## 8. Handoff prompt (when reopening in 1.4.x)

```text
Load: .context/planning/091_FUTURE_CANDIDATE_1_4_X_MARINE_SETTINGS_UX_REORGANIZATION_PLANNING.md
Load: MILESTONES §1.4.1 and §1.4.x stockpile (Settings UX)
Human chọn: A–E (or combo), Q1–Q5, SemVer slot.
Routing: ASK_ARCHITECTURE until approval → CODE_NOW.
```