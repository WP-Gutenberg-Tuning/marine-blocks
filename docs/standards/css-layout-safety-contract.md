# CSS Layout Safety Contract

> Mandatory guardrail for agents changing layout CSS in SKVN Marine.

## Core Principle

Layout width must have one owner.

Before writing width, margin, overflow, positioning, or alignment CSS, identify:

1. The element that owns the page canvas.
2. The element that owns content width.
3. The element that owns component layout.

Do not make a component escape its container until the owning canvas has been
inspected.

## Gutenberg Width Contract

```text
Top-level block without alignment -> --skvn-content-width
Top-level .alignwide             -> --skvn-wide-width
Top-level .alignfull             -> 100% of the SKVN page canvas
Inner component/grid             -> constrained inside its outer surface
```

When the SKVN canvas is already full width, use:

```css
.skvn-canvas .entry-content > .alignfull {
	box-sizing: border-box;
	margin-inline: 0;
	max-width: none;
	width: 100%;
}
```

## Container Nesting — Two-Step Width

The width contract above applies to the direct children of the content wrapper
only. When a block is nested inside a container (core Group, column, pattern
surface), ownership changes:

- A plain container becomes the direct child and is clamped to
  `--skvn-content-width` (760px); everything inside follows.
- Gutenberg constrained layout re-applies the contract to container children
  that carry alignment classes (`> .alignwide`, `> .alignfull`).
- Blocks without alignment support stay at content width inside any container.
- Container queries flip layout silently at their breakpoints (collection
  grids at `max-width: 760px`, category grid at `min-width: 880px`), so a
  nested block can drop to tablet layout with no warning when an ancestor
  loses width.

Required recipe for an island surface (a container with background holding
wide blocks):

1. Align the container itself to **Full**, not Wide. A background paints the
   block's own box, so a Wide container stops the background at
   `--skvn-wide-width` and leaves white gutters; Full is what makes the
   background bleed to both page edges. Wide is only correct when the surface
   is supposed to be a floating card.
2. Constrain the content inside — Gutenberg constrained layout gives
   unaligned children `contentSize` (760px); align the nested block Wide for
   `wideSize` (1200px) — Content width control for Product/Post Collection,
   toolbar align for Category Grid, Slider, Feature Showcase.
3. The page must own a full-width canvas. Without it, `alignfull` only reaches
   the GeneratePress content box and the background still looks boxed.

This two-step recipe is the mechanical equivalent of Elementor's **Boxed**
content width (outer box stretches to the available width, inner content is
boxed). Elementor does not give the background superpowers either: its
`Full Width` + Width 1200 stops the background at 1200px, exactly like an
`alignwide` block here. A "background only wraps its own width" report is
therefore usually an alignment/default mismatch, not a paint bug — compare
with Elementor before treating it as one. SKVN's `contentSize` is a reading
measure (760px) while Elementor's Site Settings content width is a layout
measure (~1140–1200px), so an island holding grids needs the Wide measure, not
760. Elementor-reference rebuttal:
`docs/testing/group-island-width-1.3.20.md` §4.

Do not re-implement width propagation for grandchildren in theme CSS to force a
measure on a band. Gutenberg's constrained layout already owns inside-container
layout; duplicating it breaks the one-owner rule. Productize the band as a
pattern or style variation instead (island pattern deferred to 1.4.x — see
PITFALLS DP-07, recipe/verification: `docs/testing/group-island-width-1.3.20.md`).

Human 2026-11-12: until that island group exists, site WindPress may carry a
scoped class on the Groups used as temporary islands. Direct children take the
Group width and the Group background covers them. Do not clip with
`overflow`. Remove the class when the island group owns the box. Decision:
`docs/decisions/group-island-windpress-stopgap-1.3.20.md`.

## Viewport Unit Rule

Do not use the following as a default full-width technique:

```css
width: 100vw;
max-width: 100vw;
margin-left: calc(50% - 50vw);
margin-right: calc(50% - 50vw);
```

On browsers with a classic vertical scrollbar, `100vw` can be wider than
`document.documentElement.clientWidth`. This creates horizontal overflow,
negative geometry, clipped edges, or footer drift.

Viewport width units are allowed only when all conditions are met:

- The element intentionally tracks the viewport rather than its page canvas.
- Its ancestors and GeneratePress/Gutenberg alignment rules were inspected.
- The implementation is tested with a visible vertical scrollbar.
- Geometry proves `left >= 0` and `right <= clientWidth`.
- The reason is documented beside the rule or in the related decision doc.

Prefer `width: 100%`, `max-width`, container queries, grid, or flex sizing for
normal sections and components.

## Alignment Ownership

Before changing `.alignfull` or `.alignwide`, search all layout owners:

```bash
rg -n "alignfull|alignwide|100vw|50vw|overflow-x" \
  wp-content/themes/skvn-marine
```

If the task depends on GeneratePress runtime behavior, inspect its loaded CSS
or runtime copy separately. GeneratePress parent files are read-only. Override
them narrowly from the SKVN child theme using a selector scoped to the SKVN
canvas or footer state.

Do not let Gutenberg, GeneratePress, an SKVN page template, and a component
class independently calculate the same width.

## Overflow Rule

`overflow-x: hidden` or `overflow-x: clip` is not a width fix.

It may be used for intentional visual clipping after geometry is correct. It
must not be used to hide a block whose bounding box exceeds the page canvas.

## Required Geometry Check

For layout CSS that affects width, alignment, footer, header, grids, absolute
positioning, or viewport units, verify:

```javascript
const selectors = [
	'.entry-content',
	'.entry-content > .alignfull',
	'.entry-content > .alignwide',
	'.site-footer',
	'.skvn-footer-page',
];

({
	clientWidth: document.documentElement.clientWidth,
	scrollWidth: document.documentElement.scrollWidth,
	boxes: selectors.map((selector) => {
		const element = document.querySelector(selector);
		return [selector, element && element.getBoundingClientRect()];
	}),
});
```

Pass criteria:

- `scrollWidth <= clientWidth`.
- Full-width surfaces have no negative left edge.
- Their right edge does not exceed `clientWidth`.
- Normal, wide, and full blocks remain visibly distinct.
- The result passes at desktop, tablet, and mobile widths.
- At least one desktop check has enough page height to show a vertical
  scrollbar.

## Agent Decision Tree

```text
Need a full-width section?
|
+- Is the current SKVN canvas already full width?
|  +- Yes -> use width: 100%; reset inherited alignfull margins if needed.
|  +- No  -> inspect the owning wrapper and existing GP/Gutenberg rules.
|
+- Is the component itself responsible for page width?
|  +- No -> fix the canvas/adapter layer, not the component.
|
+- Are viewport units still necessary?
   +- No  -> do not use them.
   +- Yes -> document rationale and prove geometry with a scrollbar present.
```

## Pre-Submit Audit

Run:

```bash
rg -n "100vw|50vw|100dvw|100svw|100lvw|overflow-x" \
  wp-content/themes/skvn-marine \
  wp-content/plugins/skvn-marine-blocks
```

Every new match must be explained by the task. Existing matches in the affected
layout path must be inspected rather than assumed safe.
