# Explore: Responsive Mobile/Tablet — Camandre Factory Landing Page

## Status
done

## Executive Summary
The landing page has zero responsive design — no media queries, no Tailwind breakpoints, hardcoded font sizes up to 96px, and multi-column grids that do not collapse. 29 violations documented across 9 files. Root structural blocker: all layout uses inline `style` attributes which defeat class-based media query overrides. Hybrid Tailwind refactor (Option C) is the recommended approach.

## Problem Count
- **Critical**: 8 violations
- **High**: 17 violations
- **Medium**: 4 violations
- **Total**: 29 violations across 9 files

## Affected Files

| File | Primary Problem |
|------|----------------|
| `src/components/nav/Nav.astro` | No hamburger menu; 40px padding on all widths |
| `src/components/footer/Footer.astro` | 4-column grid, no collapse |
| `src/components/shared/ClosingCTA.astro` | `font-size: 88px` H2, appears on every page |
| `src/components/shared/SectionHeader.astro` | `font-size: 56px` H2, shared across all pages |
| `src/pages/index.astro` | 2-col hero, 4-col services, 4-col process, 2-col why-us |
| `src/pages/servicios.astro` | `96px` H1, 4 separate 2-col blocks, 3-col pricing |
| `src/pages/portafolio.astro` | 3-col project cards, 4-col stats bar |
| `src/pages/nosotros.astro` | `96px` H1, multiple 2-col grids |
| `src/components/shared/Button.astro` | `white-space: nowrap` — buttons can overflow |

## Exhaustive Problem List

### CRITICAL

- `Nav.astro:19-87` — Zero hamburger/drawer menu. All nav items render inline at all widths. On 375px overflows or crushes.
- `Nav.astro:36` — `padding: 18px 40px`. 80px horizontal padding consumed before any content on 375px screen.
- `ClosingCTA.astro:47` — `font-size: 88px` H2. No `clamp()`. ~3-4 chars per line on mobile. Appears on EVERY page.
- `ClosingCTA.astro:6+29` — `padding: 140px 40px` + `padding: 0 40px`. Double padding, no mobile reduction.
- `servicios.astro:37` — `font-size: 96px` H1. Hardcoded.
- `nosotros.astro:72` — `font-size: 96px` H1. Hardcoded.
- `index.astro:31` — `grid-template-columns: 1.25fr 1fr; gap: 72px`. 2-col hero does not collapse.
- `index.astro:364` — `grid-template-columns: repeat(4, 1fr)`. 4-col service cards — unreadable on mobile.
- `index.astro:595` — `grid-template-columns: repeat(4, 1fr)`. 4-col process steps.

### HIGH

- `index.astro:30` — `padding: 110px 40px 100px`. No mobile reduction.
- `index.astro:88` — Stats bar: `grid-template-columns: repeat(3, auto); gap: 56px`. No collapse.
- `index.astro:483` — Featured Case: `grid-template-columns: 1.05fr 1fr; gap: 64px`. No collapse.
- `index.astro:342, 464` — `font-size: 60px` H2, hardcoded.
- `index.astro:644` — Why Us: `grid-template-columns: 1fr 1.4fr; gap: 80px`. No collapse.
- `index.astro:672` — Why Us feature grid: `grid-template-columns: 1fr 1fr`. No mobile collapse.
- `index.astro:649` — `font-size: 56px` H2, hardcoded.
- `index.astro:287` — Logo strip: `grid-template-columns: 220px 1fr`. Fixed 220px on 375px screen.
- `index.astro:234` — Floating metric chip: `position: absolute; left: -32px; bottom: -32px`. Overflows on mobile.
- `servicios.astro:73,232,360,495` — All 4 service blocks: `grid-template-columns: 1.1fr 1fr; gap: 80px`. None collapse.
- `servicios.astro:173,255,440,521` — `font-size: 56px` H2 on all 4 blocks. Hardcoded.
- `servicios.astro:628` — Engagement models: `grid-template-columns: repeat(3, 1fr)`. 3 pricing cards, no collapse.
- `portafolio.astro:184` — `grid-template-columns: repeat(3, 1fr)`. Project cards, no collapse.
- `portafolio.astro:100` — Stats bar: `grid-template-columns: repeat(4, 1fr)`. No collapse.
- `nosotros.astro:98` — Origin section: `grid-template-columns: 1fr 1.4fr; gap: 80px`. No collapse.
- `nosotros.astro:160` — Values: `grid-template-columns: repeat(2, 1fr)`. No mobile collapse.
- `nosotros.astro:222` — Locations: `grid-template-columns: 1fr 1.6fr; gap: 80px`. No collapse.
- `Footer.astro:14` — `grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: 48px`. 4-column, no collapse.
- `SectionHeader.astro:30` — `font-size: 56px` H2. Shared component — high leverage fix.

### MEDIUM

- `nosotros.astro:190` — Team grid: `repeat(2, 1fr)`. Cramped on 375px.
- `servicios.astro:189,270,455,535` — "Incluye" lists: `grid-template-columns: 1fr 1fr`. Tight on small phones.
- `index.astro:...` — Floating absolute chip negative offsets.
- `Button.astro` — `white-space: nowrap` can overflow small screens.

## Breakpoints Missing

Zero media queries or Tailwind responsive prefixes exist. All needed:

| Breakpoint | Width | Critical for |
|---|---|---|
| `sm` (640px) | Small phones | Font scale reductions |
| `md` (768px) | Tablet portrait | Grid collapses, hamburger nav |
| `lg` (1024px) | Tablet landscape | Full desktop layout begins |

## Recurring Anti-patterns

1. **No `clamp()` on font sizes** — Only hero H1 and portafolio H1 are correct. Everything else hardcoded.
2. **Inline style-only layout** — Makes class-based @media overrides impossible without refactor.
3. **Fixed large padding** — 120px, 140px, 110px section padding, no mobile reduction.
4. **Multi-column grids without collapse** — `repeat(4,1fr)`, `repeat(3,1fr)`, `2fr 1fr 1fr 1.5fr`.
5. **No hamburger/drawer navigation**.
6. **Absolute-positioned elements with negative offsets**.

## Recommended Approach

**Option C — Hybrid**: Convert layout-sensitive properties to Tailwind responsive classes. Keep `--cf-*` token-based inline styles for colors, shadows, design tokens.

**Delivery**: Two chained PRs (>1000 line diff total).
- PR1: Nav hamburger + all Critical typography (ClosingCTA, hero H1s) — ~400 lines
- PR2: All grid collapses + padding reductions + shared SectionHeader — ~800 lines

## Scope Estimate

| Dimension | Estimate |
|---|---|
| Files affected | 9 |
| Lines changed | ~700–900 |
| New lines | ~200–300 |
| Total diff | ~1000–1200 lines |
| Review Workload | HIGH |

## Risks

1. Inline style specificity is the fundamental structural blocker — no responsive class can override inline styles
2. No automated visual tests — regression risk is manual-only
3. Floating absolute elements require logic changes beyond styling
4. ~1000-1200 line diff requires two-PR delivery
