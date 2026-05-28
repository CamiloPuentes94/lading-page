# Spec: responsive-mobile-tablet

**Change ID**: responsive-mobile-tablet
**Artifact store**: hybrid
**PR chain**: PR1 (nav + critical type) → PR2 (grids + spacing)

---

## Domain 1: Responsive Typography

### Requirement: ClosingCTA Heading Scale

The ClosingCTA H2 MUST use `clamp(36px, 7vw, 88px)` instead of the fixed `88px` value. This applies on every page that renders ClosingCTA (index, servicios, portafolio, nosotros).

#### Scenario: Mobile 375px — heading fits viewport

- GIVEN a viewport of 375px width
- WHEN the ClosingCTA section is rendered
- THEN the H2 font-size resolves to ≤ 40px and does not overflow the container

#### Scenario: Desktop 1280px — heading matches design

- GIVEN a viewport of 1280px width
- WHEN the ClosingCTA section is rendered
- THEN the H2 font-size resolves to 88px (clamp maximum)

#### Scenario: Tablet 768px — heading is intermediate

- GIVEN a viewport of 768px width
- WHEN the ClosingCTA section is rendered
- THEN the H2 font-size resolves between 36px and 88px (clamp preferred value applies)

---

### Requirement: SectionHeader Shared Heading Scale

The shared SectionHeader H2 MUST use `clamp(28px, 4.5vw, 56px)` instead of the fixed `56px` value.

#### Scenario: Mobile 375px — no horizontal overflow

- GIVEN a viewport of 375px
- WHEN any page with a SectionHeader is rendered
- THEN the H2 text wraps without triggering horizontal scroll

#### Scenario: Desktop 1280px — matches original size

- GIVEN a viewport of 1280px
- WHEN a SectionHeader is rendered
- THEN the H2 font-size resolves to 56px

---

### Requirement: Page H1 Scale (servicios, nosotros)

The H1 on servicios.astro and nosotros.astro MUST use `clamp(40px, 8vw, 96px)` instead of the fixed `96px` value.

#### Scenario: Mobile 375px — H1 does not overflow

- GIVEN a viewport of 375px
- WHEN /servicios or /nosotros is loaded
- THEN the H1 font-size is ≤ 48px and no horizontal scrollbar appears

#### Scenario: Desktop 1280px — H1 at full size

- GIVEN a viewport of 1280px
- WHEN /servicios or /nosotros is loaded
- THEN the H1 font-size resolves to 96px

---

### Requirement: Index H2 Scales (hero section)

The index.astro hero H2 elements at 60px and 56px MUST use `clamp()` values that keep text within viewport on mobile.

#### Scenario: Mobile 375px — index hero H2s contained

- GIVEN a viewport of 375px
- WHEN the index page is loaded
- THEN all H2 elements in the hero have font-size ≤ 40px and do not cause overflow-x

---

## Domain 2: Navigation Responsive (PR1)

### Requirement: Hamburger Menu Toggle

The Nav MUST display a hamburger toggle button on viewports narrower than 768px (`< md`). The button MUST be hidden on viewports ≥ 768px. Nav links MUST be hidden on mobile and visible on ≥ 768px.

#### Scenario: Mobile — hamburger visible, links hidden

- GIVEN a viewport of 375px
- WHEN the Nav is rendered
- THEN the hamburger button is visible and the nav link list is not visible

#### Scenario: Desktop — hamburger hidden, links visible

- GIVEN a viewport of 1280px
- WHEN the Nav is rendered
- THEN the hamburger button is not rendered or hidden and all nav links are visible

---

### Requirement: Mobile Drawer / Overlay

Activating the hamburger MUST open a drawer or overlay containing: all nav links, the ThemeToggle, and the primary CTA. The drawer MUST close when the user taps/clicks outside it, presses Escape, or activates a nav link.

#### Scenario: Open drawer

- GIVEN a mobile viewport and the hamburger is visible
- WHEN the user clicks the hamburger button
- THEN the drawer opens and all nav links, ThemeToggle, and CTA are visible

#### Scenario: Close via Escape

- GIVEN the drawer is open
- WHEN the user presses the Escape key
- THEN the drawer closes and focus returns to the hamburger button

#### Scenario: Close via overlay click

- GIVEN the drawer is open
- WHEN the user clicks outside the drawer
- THEN the drawer closes

#### Scenario: Close via nav link activation

- GIVEN the drawer is open
- WHEN the user clicks a nav link
- THEN the drawer closes and navigation proceeds

---

### Requirement: Hamburger Accessibility

The hamburger button MUST have `aria-expanded` set to `"false"` when closed and `"true"` when open. It MUST have an accessible label (`aria-label` or visible text).

#### Scenario: aria-expanded reflects state

- GIVEN the hamburger button is rendered
- WHEN the drawer is closed
- THEN `aria-expanded="false"` on the button

- GIVEN the drawer is open
- WHEN the state is toggled
- THEN `aria-expanded="true"` on the button

---

### Requirement: Vanilla JS Implementation

The hamburger toggle logic MUST use vanilla JavaScript with no framework dependency. Event listeners MUST NOT be duplicated on re-render.

#### Scenario: No duplicate listeners

- GIVEN the page loads
- WHEN the hamburger is clicked multiple times
- THEN open/close alternates correctly without accumulating listeners

---

## Domain 3: Grid Collapses (PR2)

### Requirement: Single-Column on Mobile for All Multi-Column Grids

Every multi-column grid on all four pages MUST collapse to 1 column on viewports < 640px. Grids with 3–4 columns MUST use 2 columns on 640px–1023px (tablet). Grids with 2 columns MAY stack on tablet or remain 2 columns depending on content width.

| Grid | Mobile < 640 | Tablet 640–1023 | Desktop ≥ 1024 |
|------|-------------|-----------------|----------------|
| index hero (1.25fr 1fr) | 1 col, stacked | 1 col stacked | original 2-col |
| index service cards (repeat(4,1fr)) | 1 col | 2 cols | 4 cols |
| index process steps (repeat(4,1fr)) | 1 col | 2 cols | 4 cols |
| index featured case (1.05fr 1fr) | 1 col | 1 col | original |
| index why-us main (1fr 1.4fr) | 1 col | 1 col | original |
| index why-us features (1fr 1fr) | 1 col | 2 cols | 2 cols |
| index stats bar (repeat(3,auto)) | 1 col | 2 cols | 3 cols |
| servicios 4 service blocks (1.1fr 1fr each) | 1 col | 1 col | original |
| servicios engagement models (repeat(3,1fr)) | 1 col | 2 cols | 3 cols |
| portafolio project cards (repeat(3,1fr)) | 1 col | 2 cols | 3 cols |
| portafolio stats (repeat(4,1fr)) | 1 col | 2×2 | 4 cols |
| nosotros origin (1fr 1.4fr) | 1 col | 1 col | original |
| nosotros values (repeat(2,1fr)) | 1 col | 2 cols | 2 cols |
| nosotros locations (1fr 1.6fr) | 1 col | 1 col | original |
| footer (2fr 1fr 1fr 1.5fr) | 1 col | 2 cols | 4 cols |

#### Scenario: Index service cards — mobile

- GIVEN a viewport of 375px
- WHEN the index page is loaded
- THEN the service cards render in a single column with no horizontal overflow

#### Scenario: Index service cards — tablet

- GIVEN a viewport of 768px
- WHEN the index page is loaded
- THEN the service cards render in 2 columns

#### Scenario: Desktop — original grid preserved

- GIVEN a viewport of 1280px
- WHEN any page with a multi-column grid is loaded
- THEN the grid matches the original desktop layout (no regressions)

---

### Requirement: No Horizontal Overflow on Any Page

Every page MUST have zero `overflow-x` at viewports 375px, 640px, 768px, and 1024px. The Layout.astro wrapper MUST enforce `overflow-x: hidden` or equivalent guard.

#### Scenario: 375px — no scrollbar

- GIVEN a viewport of 375px
- WHEN any of the four pages is loaded
- THEN `document.body.scrollWidth === window.innerWidth` (no horizontal overflow)

---

## Domain 4: Padding and Spacing (PR2)

### Requirement: Section Vertical Padding Responsive Reduction

Sections with vertical padding ≥ 100px MUST reduce to approximately 60px on tablet (640px–1023px) and approximately 40px on mobile (< 640px). Horizontal section padding MUST reduce from 40px to 20px on mobile.

#### Scenario: Mobile section padding

- GIVEN a viewport of 375px
- WHEN a section with original padding ≥ 100px is rendered
- THEN computed padding-top and padding-bottom are ≤ 48px

#### Scenario: Tablet section padding

- GIVEN a viewport of 768px
- WHEN a section with original padding ≥ 100px is rendered
- THEN computed padding-top and padding-bottom are ≤ 68px

#### Scenario: Desktop section padding unchanged

- GIVEN a viewport of 1280px
- WHEN any section is rendered
- THEN padding values match the original design values

---

### Requirement: Grid Gap Proportional Reduction

Grid and flex gaps MUST scale proportionally with viewport: gaps ≥ 32px on desktop SHOULD be ≤ 16px on mobile.

#### Scenario: Mobile grid gap reduced

- GIVEN a viewport of 375px
- WHEN a grid with desktop gap ≥ 32px is rendered
- THEN the computed gap is ≤ 16px

---

## Domain 5: Special Elements (PR2)

### Requirement: Logo Strip Flex Wrap

The logo strip MUST NOT use a fixed-column grid (e.g., a fixed 220px column template). It MUST use `flex-wrap` or a fluid grid so logos wrap on mobile without overflow.

#### Scenario: Mobile logo strip wraps

- GIVEN a viewport of 375px
- WHEN the logo strip is rendered
- THEN logos wrap to multiple rows without horizontal overflow

---

### Requirement: Floating Metric Chip Repositioning

The floating metric chip in the hero section MUST be repositioned or converted to a static inline element on mobile (< 640px) so it does not overlap content or cause overflow.

#### Scenario: Mobile — chip does not cause overflow

- GIVEN a viewport of 375px
- WHEN the hero section is rendered
- THEN the metric chip is visible, does not overlap other content, and does not trigger horizontal scroll

---

### Requirement: Marquee Overflow Containment

The marquee container MUST have `overflow-x: hidden` (or equivalent) on its parent so the animated strip does not cause page-level horizontal scroll.

#### Scenario: Marquee does not trigger page scroll

- GIVEN any viewport width
- WHEN the marquee animation is running
- THEN no horizontal scrollbar appears on the page body

---

### Requirement: Button Text Wrap on Mobile

Buttons with `white-space: nowrap` MUST allow wrapping or reduce font-size on mobile so button text does not overflow its container or the viewport.

#### Scenario: Mobile button text contained

- GIVEN a viewport of 375px
- WHEN a CTA button is rendered
- THEN the button text does not overflow its container and no horizontal scroll appears

---

## Out-of-Scope Assertions

The following MUST NOT change as part of this spec:

- CSS custom property values (`--cf-*` tokens)
- Color, shadow, border-radius, and visual design decisions
- Business logic, forms, integrations, analytics
- Copy or accessibility beyond hamburger minimum
- Lighthouse / SEO / performance metrics
- Dark mode behavior
