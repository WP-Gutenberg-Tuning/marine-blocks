# Slider Completion Spec — V1 / 1.3.0

Status: ACTIVE
Milestone: V1 / 1.3.0
Lifecycle: active
Notes: source of truth cho Slider layer contract; giữ ACTIVE vì các milestone sau vẫn tham chiếu.
Approved: 2026-06-11
Source of truth: this document

## Current Onsite Failure Note

The V1 / 1.3.0 development build is not currently approved.

Human-reported evidence from 2026-06-11:

- One Hero Slide visibly renders its selected image while another appears to
  show only the fallback background/gradient.
- The Slider renders inside a narrow content-width box instead of the intended
  full-width SKVN page/canvas surface.
- Pagination appears below/outside the visible Slide frame.
- RAM usage was reported to increase while the Slider/editor was otherwise
  idle.

These are observations, not proven root causes. Do not assume that the missing
image is only an overlay issue or that memory growth comes from a specific
React, subscription, observer, or Swiper loop until runtime evidence identifies
the state delta.

V1 / 1.3.0 remains open until the render contract and memory behavior are
corrected and a targeted human smoke check no longer reproduces the four
reported failures. Expanded navigation and pagination UX belongs to V1 /
1.3.1, with combined regression QA under V1 / 1.3.2.

## 1. Goal

Complete the current `skvn-marine/slider` and `skvn-marine/slide` foundation
before adding broader carousel/showcase features.

V1 / 1.3.0 owns:

- Dynamic PHP rendering for Slider and Slide frontend markup.
- Compatibility with existing saved Slider content.
- Stable media, overlay, and content layers.
- The existing Hero, Product Showcase, and Card Carousel presets.
- Baseline responsive geometry, accessibility, reduced motion, and no-JavaScript
  readability.

V1 / 1.3.0 does not own:

- The carousel/showcase 5x2 editor grid.
- Marquee or Centered Carousel modes.
- Card-level LinkControl, visual presets, or responsive spacing controls.
- Fullscreen Step Slider.
- Zoom, blob, parallax, stagger, arbitrary speed, or another movement runtime.

## 2. Approved Scope Decisions

1. V1 / 1.3.0 fixes the rendering foundation. The expanded carousel/showcase UX
   is a later milestone with a version assigned only after human approval.
2. Hero supports a maximum of five Slides, one Slide per view, and `fade` or
   `slide`. Zoom, blobs, and parallax are deferred.
3. Product Showcase supports a maximum of five Slides, one Slide per view, and
   one content Image block per Slide. It does not expose or render the Hero
   background-image treatment.
4. Card Carousel retains the current 3/2/1 desktop/tablet/mobile behavior. The
   ten-card limit belongs to the later editor-grid milestone.
5. V1 / 1.3.0 keeps the current editor controls and adds validation,
   accessibility, and runtime hardening. It does not add marquee, centered
   mode, or new progress variants.
6. Existing content must open and render without invalid-block recovery or a
   bulk resave.
7. Fullscreen Step Slider remains a separate V1 / 1.5.0 block family.

## 3. Stable Block Boundary

```text
skvn-marine/slider
└── skvn-marine/slide
```

- Keep both block names and the `skvn-marine` namespace.
- Keep Gutenberg InnerBlocks and native List View.
- Keep one Swiper runtime.
- Do not replace child blocks with a `slides` array or proprietary slide
  manager.
- Keep block behavior portable without requiring the SKVN theme.

## 4. Render Ownership

PHP owns current frontend HTML:

```html
<div class="wp-block-skvn-marine-slider skvn-slider swiper"
     data-skvn-slider="...">
  <div class="skvn-slider__wrapper swiper-wrapper">
    <!-- rendered Slide children -->
  </div>
  <!-- optional arrows and pagination -->
</div>
```

```html
<div class="wp-block-skvn-marine-slide skvn-slide swiper-slide">
  <div class="skvn-slide__media">
    <!-- optional Hero image and overlay -->
  </div>
  <div class="skvn-slide__content">
    <!-- rendered InnerBlocks -->
  </div>
</div>
```

Ownership:

| Layer | Owner |
|---|---|
| Slider shell, config, arrows, pagination | Slider PHP renderer |
| Slide frame, Hero media, overlay, content wrapper | Slide PHP renderer |
| Editable content and block order | Gutenberg InnerBlocks |
| Swipe, fade, loop, autoplay, keyboard, breakpoints | Swiper runtime |
| Structural fallback styling | Plugin CSS |

All PHP output must use WordPress escaping. Attribute values must be normalized
to approved booleans, number ranges, and enum values before rendering.

## 5. Preset Contracts

### Hero

- Maximum five Slides.
- One Slide per view.
- `fade` or `slide`.
- Background image belongs to the Slide media layer.
- Overlay and content render above the image.
- Images with different intrinsic dimensions fill one stable frame.

### Product Showcase

- Maximum five Slides.
- One Slide per view.
- Flow-based Image block and content layout.
- Saved legacy background-image attributes may remain stored for compatibility
  but are not rendered.

### Card Carousel

- Responsive Slides per view: 3 desktop, 2 tablet, 1 mobile.
- Flow-based card content.
- Saved legacy background-image attributes may remain stored but are not
  rendered.
- Equal-height and CTA alignment are CSS/runtime QA requirements, not new
  arbitrary editor controls.

## 6. Editor Contract

- Do not run Swiper or autoplay in Gutenberg.
- Hero remains vertically readable.
- Product Showcase and Card Carousel remain directly editable with native
  InnerBlocks for this milestone.
- Native List View/actions remain the structural management interface.
- Enforce the approved five-Slide maximum for Hero and Product Showcase without
  invalidating existing content that already exceeds it.
- Do not expose duplicate background-image controls for Product Showcase or
  Card Carousel.

The later carousel/showcase milestone may replace the carousel editor surface
with the approved non-moving 5x2 grid and ten-card limit.

## 7. Compatibility Plan

Before changing registration or save behavior:

1. Inventory the saved Slider/Slide shapes from initial blocks, image-enabled
   Slides, and preset-enabled Sliders.
2. Create compatibility fixtures for each shape.
3. Decide the minimum `save()` and `deprecated` definitions required for
   Gutenberg validation.
4. Register PHP render callbacks without changing block names or attributes.
5. Prove old content opens, renders, edits, saves, and reloads without recovery.

Transitional static definitions exist only for editor parsing compatibility.
There must be one active frontend render engine: PHP.

## 8. Runtime And Accessibility

- Add Swiper A11y support and meaningful labels for navigation controls.
- Keep keyboard navigation enabled.
- Pause autoplay on pointer hover and keyboard focus within the Slider.
- Disable autoplay under `prefers-reduced-motion`.
- Guard malformed JSON/config values.
- Prevent duplicate initialization.
- Leave all Slide content readable when JavaScript is unavailable.
- Do not hide editor or frontend content by default while waiting for runtime.

## 9. CSS Geometry

- Slider viewport, Slide width, Slide internal layout, arrow hit areas, and
  pagination each have one owner.
- Hero media uses `object-fit: cover` inside a stable frame.
- Arrows and pagination must not overlap content or the page footer.
- Card Carousel must not create horizontal page overflow.
- Replace the current Hero `100vw` content-padding calculation unless a
  documented geometry test proves that viewport ownership is intentional.
- Do not use `overflow-x: hidden` or `clip` to conceal incorrect geometry.
- Test desktop with a visible vertical scrollbar, tablet, and mobile.

## 10. Delivery Plan

### Phase A — Contract And Fixtures

- Freeze the attribute/schema matrix.
- Capture legacy saved-markup fixtures.
- Define registration and compatibility behavior.

### Phase B — Dynamic Renderer

- Add the plugin-owned Slider render module.
- Register Slider and Slide render callbacks.
- Implement escaping and preset-specific media behavior.

### Phase C — Runtime And CSS

- Harden Swiper initialization and accessibility.
- Implement stable Hero layers and responsive preset geometry.
- Remove or prove unsafe viewport-width calculations.

### Phase D — Verification And Packaging

- Build plugin assets.
- Run PHP syntax checks.
- Verify compatibility fixtures.
- Build the deploy artifact and plugin zip.
- Confirm the Slider render module exists in the zip.
- Complete a targeted human smoke check for the reported image, width,
  pagination, and idle-memory failures.
- Complete combined regression QA later under V1 / 1.3.9.

## 11. V1 / 1.3.2 Shared Autoplay Follow-Up Boundary

V1 / 1.3.2 adds Feature Showcase autoplay and panel links after V1 / 1.3.0
implementation and human approval of V1 / 1.3.1 controls UX. Broader combined
Slider regression QA remains scheduled under V1 / 1.3.9.

Planning:

```text
.context/planning/archives/020_VERSION_1_3_2_FEATURE_SHOWCASE_AUTOPLAY_AND_LINKS_PLANNING.md
```

Agents changing Slider in V1 / 1.3.0 must keep the following behavior
separable so V1 / 1.3.2 can share real invariants without rewriting the Slider
controller:

- reduced-motion detection
- delay normalization and editor delay options
- pointer-hover pause/resume policy
- keyboard-focus-within pause/resume policy
- document visibility pause/resume policy

During V1 / 1.3.0:

- Prefer the existing `src/shared/motion.ts` reduced-motion helper instead of
  creating another Slider-only detector.
- Keep Swiper-specific calls behind small Slider-local callbacks so a later
  shared pause/resume event binder can call `pause` and `resume` without owning
  Swiper.
- Keep delay parsing separate from Swiper initialization.
- Preserve current saved delay values and frontend behavior.
- Do not restrict the Slider editor to `3/5/7/9s` during this milestone.
- Do not add Feature Showcase autoplay or LinkControl to the V1 / 1.3.0 scope.

During V1 / 1.3.2, shared code may be extracted only
where there are two real consumers or a project invariant:

- `prefersReducedMotion()` from `src/shared/motion.ts`
- governed delay constants and editor marks for `3000`, `5000`, `7000`, and
  `9000`
- delay normalization
- pointer/focus pause-resume event binding
- document visibility pause-resume binding

Compatibility rule:

- Existing Slider content may contain delay values outside `3/5/7/9s`.
- V1 / 1.3.2 must not silently change those saved values or their frontend
  timing.
- If the Slider editor adopts the governed presets, define how legacy values
  display and persist before restricting the control.

Do not share:

- Swiper instances or modules
- navigation, pagination, loop, effects, or breakpoint logic
- Slider config parsing that is unrelated to autoplay invariants
- Feature Showcase sibling-`details` synchronization or panel activation
- a generic carousel controller

Swiper remains the Slider's only movement controller. Feature Showcase keeps a
block-local timer and must not initialize Swiper.

## 12. Acceptance

- Existing Slider content opens without invalid-block recovery.
- Existing Slider content renders through PHP without requiring bulk resave.
- Hero media, overlay, and content remain in one stable frame.
- Product Showcase and Card Carousel do not render accidental Hero backgrounds.
- Card Carousel remains 3/2/1 responsive.
- Arrows, dots, keyboard, loop, autoplay, hover/focus pause, and reduced motion
  work as approved.
- No-JavaScript output remains readable.
- No horizontal page overflow is introduced.
- PHP escaping and attribute validation pass review.
- Runtime PHP files are present in deploy artifacts and plugin zip.
- Plugin build, PHP lint, compatibility checks, and onsite QA pass.
- Human explicitly approves milestone completion.

## 13. Archived Evidence

Archived files are historical evidence, not active instructions.

| Current section | Archived source |
|---|---|
| Original Slider ownership, Swiper choice, editor safety, and control ideas | [`/archives/slider-block.md`](archives/slider-block.md) |
| Three preset names, templates, and add-and-see insertion model | [`/archives/slider-presets-and-inserter-1.2.1.md`](archives/slider-presets-and-inserter-1.2.1.md) |
| Static markup failure analysis and the first compatibility proposal | [`/archives/slider-static-markup-migration-1.2.1.md`](archives/slider-static-markup-migration-1.2.1.md) |
| Later carousel grid, card management, links, marquee, and centered UX | [`/archives/slider-carousel-showcase-ux.md`](archives/slider-carousel-showcase-ux.md) |
| Implemented stacked editor and portable motion boundary | [`/archives/011_VERSION_1_2_0_SLIDER_EDITOR_AND_MOTION_PLANNING.md`](../../.context/planning/archives/011_VERSION_1_2_0_SLIDER_EDITOR_AND_MOTION_PLANNING.md) |
| Preset delivery planning | [`/archives/015_VERSION_1_2_1_SKVN_SLIDER_PRESETS_AND_INSERTER_PLANNING.md`](../../.context/planning/archives/015_VERSION_1_2_1_SKVN_SLIDER_PRESETS_AND_INSERTER_PLANNING.md) |
| Dynamic PHP rendering rationale and migration questions | [`/archives/017_VERSION_1_3_0_SLIDER_DYNAMIC_RENDERING_ARCHITECTURE_PLANNING.md`](../../.context/planning/archives/017_VERSION_1_3_0_SLIDER_DYNAMIC_RENDERING_ARCHITECTURE_PLANNING.md) |
| Expanded carousel/showcase delivery phases | [`/archives/019_FUTURE_CANDIDATE_SLIDER_CAROUSEL_SHOWCASE_UX_PLANNING.md`](../../.context/planning/archives/019_FUTURE_CANDIDATE_SLIDER_CAROUSEL_SHOWCASE_UX_PLANNING.md) |
| Reproduced frontend media/content layering bug | [`/archives/slider-frontend-media-content-layer-bug-1.2.1.md`](../testing/archives/slider-frontend-media-content-layer-bug-1.2.1.md) |
| Competitive editor/runtime research | [`/archives/slider-competitive-research-1.2.0.md`](../explain/archives/slider-competitive-research-1.2.0.md) |

Active related documents:

- `docs/testing/onsite-slider-motion-1.3.2.md`
- `.context/planning/archives/020_VERSION_1_3_2_FEATURE_SHOWCASE_AUTOPLAY_AND_LINKS_PLANNING.md`
- `docs/decisions/sliders/step-slider/fullscreen-step-slider-1.3.10.md`
- `.context/planning/018_VERSION_1_5_0_FULLSCREEN_STEP_SLIDER_PLANNING.md`
