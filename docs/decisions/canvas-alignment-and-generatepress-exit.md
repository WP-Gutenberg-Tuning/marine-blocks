# Canvas Alignment And GeneratePress Exit

Status: ACTIVE
Milestone: none
Lifecycle: active
Date: 2026-06-11  
Owners: `skvn-marine` theme layout and GeneratePress compatibility adapter

## Problem

GeneratePress applies its full-bleed calculation to every `.alignfull`
descendant inside `.no-sidebar .entry-content`:

```css
.no-sidebar .entry-content .alignfull {
	margin-left: calc(-100vw / 2 + 100% / 2);
	margin-right: calc(-100vw / 2 + 100% / 2);
	max-width: 100vw;
	width: auto;
}
```

This is useful when content is inside a narrow GeneratePress container. It is
incorrect after SKVN has already opened a full-width page canvas. Nested
`.alignfull` blocks then receive negative viewport margins and become wider
than the browser client area by approximately the scrollbar width.

DevTools proof:

- Affected blocks share `.alignfull`.
- Disabling the GeneratePress `margin-left` and `margin-right` declarations
  removes the overflow.
- Component classes, Gutenberg `flow`/`constrained` layout, and inner grids are
  not the common cause.

## Width Ownership

SKVN uses three explicit owners:

```text
Page canvas       -> owns available page width
Alignment wrapper -> chooses content / wide / full inside that canvas
Component         -> lays out only its own children
```

A component must not calculate viewport escape margins.

### Amendment 2026-11-19 — plugin block vs SKVN canvas

Human: plugin Marine Blocks phải độc lập theme. GeneratePress `.alignfull` bleed
is still a canvas problem on SKVN sites, and still a **plugin-ship** problem
when the block uses core `alignfull` on a non-SKVN theme (or when only the
plugin zip is uploaded).

Two layers, same geometry (`width: 100%`, `margin: 0`, no `100vw`):

| Layer | Owner | Selector scope | Job |
|---|---|---|---|
| Canvas | Theme `skvn-marine` | `body.skvn-full-width-canvas … .alignfull` | Every `.alignfull` on SKVN canvas (Cover, Group, Hero, plugin blocks) |
| Block box | Plugin `skvn-marine-blocks` | plugin block + `.alignfull`, specificity ≥ GP `(0,3,1)` | This block does not exceed its parent even if SKVN theme CSS is absent |

Theme adapter remains the owner of **page** width on SKVN. Plugin reset is not
a second viewport-escape calculator; it refuses GP's `calc(100% + 80px)` /
`margin-left: -40px` on **that block**. Do not delete the theme adapter. Do
not make the theme adapter the only neutralize for plugin blocks.

Evidence 2026-11-19: onsite `style.css?ver=1794791780` still old selector;
plugin CSS `?ver=1795023969` already live; GP inline won; Step Slider
`x=-40`, width `1985`. Pitfall DP-12. GLOBAL A13.

## V1 Compatibility Decision

While GeneratePress remains active:

- Keep GeneratePress parent files untouched.
- Treat GeneratePress full-bleed CSS as an external compatibility concern.
- Neutralize its negative margins inside an explicit SKVN full-width
  canvas or SKVN-rendered footer (theme canvas layer). Plugin blocks that
  opt into `alignfull` also ship their own reset (amendment 2026-11-19).
- The adapter must cover nested `.alignfull`, because GeneratePress itself uses
  a descendant selector.
- Use normal document geometry: `margin-inline: 0`, `max-width: none`, and
  `width: 100%`.
- Do not add component-specific fixes for Hero, Trust Strip, KPI, Section, or
  Footer when the shared cause is the canvas adapter.
- Do not use `overflow-x` as the fix. Clipping remains allowed only for
  intentional decoration after geometry is correct.

Compatibility selector shape:

```css
.skvn-full-width-canvas .entry-content .alignfull,
.skvn-full-width-template .skvn-full-width-content .alignfull {
	box-sizing: border-box;
	margin-left: 0;
	margin-right: 0;
	max-width: none;
	width: 100%;
}
```

This selector is deliberately an adapter. It is not the standalone theme's
future alignment engine.

## Gutenberg Markup Direction

Preferred pattern structure:

```text
Page content
└── outer section.alignfull
    └── named inner grid/container
```

Avoid adding `alignfull` to both a page-sized wrapper and every child section.
When legacy or translated markup contains nested `.alignfull`, V1 must remain
readable through the compatibility adapter, but new patterns should keep one
alignment owner per layout level.

`layout.type` has a separate responsibility:

- `default`/`flow`: child flow.
- `constrained`: child content constraint.
- `flex`: child flex layout.
- `alignfull`: width alignment relative to the owning canvas.

Do not use layout type to compensate for a broken alignment calculation.

## Standalone Theme Contract

The standalone SKVN theme must own alignment without GeneratePress selectors:

```text
Theme shell
└── SKVN page canvas
    ├── normal block -> content width
    ├── alignwide    -> wide width
    └── alignfull    -> 100% of canvas
```

Requirements:

- Define content and wide sizes in `theme.json`.
- Make the theme template canvas full width before applying block alignment.
- Use container-relative sizing for normal layout.
- Do not implement core full-width alignment with `100vw` or negative `50vw`
  margins.
- Do not copy GeneratePress `.no-sidebar .entry-content .alignfull` behavior
  into the standalone theme.
- Keep compatibility CSS in an identifiable adapter section/file so it can be
  deleted when GeneratePress support ends.
- Test normal, wide, full, and nested legacy alignment as separate fixtures.

## Migration Phases

### V1.x

- Ship the scoped GeneratePress canvas adapter.
- Audit patterns for nested `.alignfull`.
- Keep existing content compatible.
- Prefer one alignment owner in all new patterns.

### 2.x Compatibility Window

- Move GeneratePress-specific selectors into an explicit compatibility layer.
- Build SKVN-owned templates and canvas classes.
- Run the same alignment fixture with and without the compatibility layer.
- Do not add new layout behavior that depends on GeneratePress DOM classes.

### 3.0.0 Standalone Completion

- Remove the GeneratePress alignment adapter.
- Confirm no active CSS references `.no-sidebar`, `.inside-article`,
  `.grid-container`, or other GeneratePress layout classes.
- Confirm `theme.json` and SKVN templates provide normal/wide/full semantics.
- Confirm no horizontal overflow with a visible vertical scrollbar.

## Acceptance

- Full-width SKVN pages have `scrollWidth <= clientWidth`.
- Nested legacy `.alignfull` blocks do not receive negative viewport margins.
- Normal, wide, and full blocks remain visually distinct.
- Component CSS does not own page-width escape behavior (`100vw`, `-50vw`).
- Plugin `alignfull` blocks ship a parent-relative reset (`width: 100%`,
  `margin: 0`) so zip plugin does not depend on theme `style.css`.
- GeneratePress parent remains unchanged.
- The standalone theme does not inherit the GeneratePress negative-margin
  algorithm.

