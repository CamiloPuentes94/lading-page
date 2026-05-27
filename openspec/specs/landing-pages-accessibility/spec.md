# Spec: landing-pages-accessibility

Change: investor-grade redesign of the Camandre Factory public site.

## Domain: landing-pages-accessibility

### Requirement: Semantic HTML and ARIA

The system MUST: use `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<article>`, `<blockquote>` in correct semantic roles. All decorative elements MUST carry `aria-hidden="true"`. The Logo SVG MUST carry `aria-label="Camandre Factory"`. ThemeToggle MUST have a descriptive `aria-label` that reflects the current action.

#### Scenario: Nav is keyboard navigable
- GIVEN the user is navigating with Tab key
- WHEN focus reaches the Nav
- THEN all links and buttons are reachable in DOM order, with visible focus rings

#### Scenario: Decorative grid not announced
- GIVEN the hero background grid pattern
- WHEN a screen reader reads the page
- THEN the grid `<div>` is skipped (aria-hidden="true")

### Requirement: Performance thresholds

The system MUST achieve Lighthouse Performance >= 90 and Accessibility >= 95 on the home page measured in Chrome desktop. `yarn build` MUST complete with 0 warnings.

#### Scenario: Build passes clean
- GIVEN all components are implemented
- WHEN `yarn build` is executed
- THEN exit code is 0 and no TypeScript or Astro warnings are printed

## Global acceptance criteria

| # | Criterion |
|---|---|
| 1 | All 4 routes (`/`, `/servicios`, `/portafolio`, `/nosotros`) render without browser console errors |
| 2 | Light/dark toggle works, persists in localStorage, zero flash on load |
| 3 | Lighthouse Performance ≥ 90, Accessibility ≥ 95 on home |
| 4 | No hex values hardcoded in component files — only `var(--cf-*)` references |
| 5 | All animations respect `prefers-reduced-motion` |
| 6 | `yarn build` exits 0 with no warnings |
| 7 | Portfolio filter updates grid without page reload |
| 8 | Footer present on all 4 pages with correct content |
