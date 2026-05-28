# Tasks: responsive-mobile-tablet

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | PR1: ~400-500 / PR2: ~700-900 |
| 400-line budget risk | PR1: Medium / PR2: High |
| Chained PRs recommended | Yes |
| Suggested split | PR1 (Nav + Layout + Clamps) → PR2 (Grids + Paddings + Footer) |
| Delivery strategy | auto-chain |
| Chain strategy | stacked-to-main |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Nav hamburger + Layout overflow guard + 5 typography clamps | PR1 → main | Independent; lower risk; mergeable alone |
| 2 | All grid collapses + padding reductions + Footer + SectionHeader | PR2 → main | Depends on PR1 merged; wider surface |

---

## Phase 1: Foundation — Layout Guard + Shared Infrastructure (PR1)

- [ ] 1.1 `src/layouts/Layout.astro` — Add `overflow-x: clip` (fallback: `hidden`) to `<html>` or `<body>` to prevent page-level horizontal scroll on all pages
- [ ] 1.2 `src/layouts/Layout.astro` — Verify viewport `<meta>` tag has `width=device-width, initial-scale=1` (add if missing)
- [ ] 1.3 `src/styles/global.css` — Add minimal overflow guard rule for marquee container parent (`overflow-x: hidden`) without touching `--cf-*` tokens

## Phase 2: Navigation Hamburger (PR1)

- [ ] 2.1 `src/components/nav/Nav.astro` — Add hamburger `<button id="cf-nav-toggle" aria-expanded="false" aria-controls="cf-nav-drawer">` visible on `<md` (`lg:hidden`), hidden on ≥lg (`hidden lg:block`)
- [ ] 2.2 `src/components/nav/Nav.astro` — Create drawer `<div id="cf-nav-drawer" aria-hidden="true">` (right-side, `transform: translateX(100%)` → `.is-open` → `0`); width `min(320px, 85vw)`; contains all nav links + ThemeToggle + primary CTA
- [ ] 2.3 `src/components/nav/Nav.astro` — Create overlay `<div id="cf-nav-overlay">` behind drawer; click closes drawer
- [ ] 2.4 `src/components/nav/Nav.astro` — Desktop nav links: add `hidden md:flex` to hide on mobile; nav padding reduced to 16px horizontal on `<md`
- [ ] 2.5 `src/components/nav/Nav.astro` — Inline `<script>`: toggle `.is-open` on drawer + overlay on button click; set `aria-expanded`; toggle `overflow:hidden` on `body`; close on Esc (return focus to button); close on overlay click; close on nav link click — all idempotent (no duplicate listeners)

## Phase 3: Critical Typography Clamps (PR1)

- [ ] 3.1 `src/components/shared/ClosingCTA.astro` — H2: replace `font-size: 88px` → `font-size: clamp(36px, 7vw, 88px)` inline
- [ ] 3.2 `src/components/shared/ClosingCTA.astro` — Section padding: migrate `140px 40px` → Tailwind `py-16 sm:py-24 lg:py-[140px] px-5 sm:px-10` (remove inline padding); inner div horizontal padding: `0 40px` → `px-5 lg:px-10`
- [ ] 3.3 `src/components/shared/ClosingCTA.astro` — CTA buttons row: add `flex-wrap` so buttons stack vertically on mobile
- [ ] 3.4 `src/pages/servicios.astro` — Hero H1: replace `font-size: 96px` → `font-size: clamp(40px, 8vw, 96px)` inline
- [ ] 3.5 `src/pages/nosotros.astro` — Hero H1: replace `font-size: 96px` → `font-size: clamp(40px, 8vw, 96px)` inline
- [ ] 3.6 `src/pages/portafolio.astro` — Hero H1: replace `font-size: 60px` → `font-size: clamp(32px, 6vw, 60px)` inline
- [ ] 3.7 `src/pages/index.astro` — Hero H2 (if hardcoded ≥48px): apply matching `clamp()` inline; audit any other hardcoded `font-size` ≥48px in hero section

## Phase 4: PR1 Verification Gate

- [ ] 4.1 Run `yarn build` — exit code must be 0; fix any Astro/Tailwind compile errors before proceeding
- [ ] 4.2 Manual check at 375px: hamburger visible, nav links hidden; drawer opens/closes; Esc closes and returns focus to button; overlay click closes; nav link click closes
- [ ] 4.3 Manual check at 1280px: hamburger hidden, all nav links visible; ClosingCTA H2 at 88px; H1 pages at 96px/60px; no horizontal overflow on any page
- [ ] 4.4 Manual check at 768px: typography clamps resolve to intermediate values; no horizontal scroll; drawer hidden

---

## Phase 5: SectionHeader Shared Clamp (PR2 — Foundation)

- [ ] 5.1 `src/components/shared/SectionHeader.astro` — H2: replace `font-size: 56px` → `font-size: clamp(28px, 5vw, 56px)` inline (affects all pages that use this component)

## Phase 6: Index Page — Grid Collapses + Paddings (PR2)

- [ ] 6.1 `src/pages/index.astro` — Hero grid: `grid-template-columns: 1.25fr 1fr` → `grid grid-cols-1 lg:grid-cols-[1.25fr_1fr]`; editor panel: `hidden lg:block` on mobile
- [ ] 6.2 `src/pages/index.astro` — Hero section padding: migrate `110px 40px 100px` → `pt-16 sm:pt-24 lg:pt-[110px] pb-12 sm:pb-20 lg:pb-[100px] px-5 lg:px-10`
- [ ] 6.3 `src/pages/index.astro` — Stats bar: `repeat(3,auto)` → `grid-cols-1 sm:grid-cols-3`
- [ ] 6.4 `src/pages/index.astro` — Logo strip: remove fixed `220px` column template; replace with `flex flex-wrap` so logos wrap on mobile
- [ ] 6.5 `src/pages/index.astro` — Floating metric chip: add `static lg:absolute` + remove `left: -32px` on `<lg`; ensure no overlap/overflow on mobile
- [ ] 6.6 `src/pages/index.astro` — Service cards: `repeat(4,1fr)` → `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- [ ] 6.7 `src/pages/index.astro` — Featured case grid: `1.05fr 1fr` → `grid-cols-1 lg:grid-cols-2`
- [ ] 6.8 `src/pages/index.astro` — Why Us main grid: `1fr 1.4fr` → `grid-cols-1 lg:grid-cols-[1fr_1.4fr]`
- [ ] 6.9 `src/pages/index.astro` — Why Us features: `1fr 1fr` → `grid-cols-1 sm:grid-cols-2`
- [ ] 6.10 `src/pages/index.astro` — Process steps: `repeat(4,1fr)` → `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- [ ] 6.11 `src/pages/index.astro` — H2s at 60px and 56px: apply `clamp(30px, 5.5vw, 60px)` and `clamp(28px, 5vw, 56px)` inline respectively
- [ ] 6.12 `src/pages/index.astro` — Section paddings ≥100px: migrate to responsive Tailwind (target ≤48px on mobile, ≤68px on tablet)

## Phase 7: Servicios Page — Grids + Paddings (PR2)

- [ ] 7.1 `src/pages/servicios.astro` — Each of 4 service blocks: `grid-template-columns: 1.1fr 1fr; gap: 80px` → `grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20`
- [ ] 7.2 `src/pages/servicios.astro` — Each service block H2 at 56px: replace → `font-size: clamp(28px, 5vw, 56px)` inline
- [ ] 7.3 `src/pages/servicios.astro` — "Incluye" sublists `1fr 1fr` → `grid-cols-1 sm:grid-cols-2`
- [ ] 7.4 `src/pages/servicios.astro` — Engagement models: `repeat(3,1fr)` → `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- [ ] 7.5 `src/pages/servicios.astro` — Section paddings ≥100px: reduce per spec targets (≤48px mobile, ≤68px tablet)

## Phase 8: Portafolio Page — Grids + Paddings (PR2)

- [ ] 8.1 `src/pages/portafolio.astro` — Project cards: `repeat(3,1fr)` → `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- [ ] 8.2 `src/pages/portafolio.astro` — Stats bar: `repeat(4,1fr)` → `grid-cols-2 sm:grid-cols-4`
- [ ] 8.3 `src/pages/portafolio.astro` — Section paddings: reduce on mobile/tablet per spec

## Phase 9: Nosotros Page — Grids + Paddings (PR2)

- [ ] 9.1 `src/pages/nosotros.astro` — Origin section: `1fr 1.4fr` → `grid-cols-1 lg:grid-cols-[1fr_1.4fr]`
- [ ] 9.2 `src/pages/nosotros.astro` — Values: `repeat(2,1fr)` → `grid-cols-1 sm:grid-cols-2`
- [ ] 9.3 `src/pages/nosotros.astro` — Team grid: verify it collapses to 1 col on mobile; add `grid-cols-1 sm:grid-cols-2 lg:grid-cols-N` as needed
- [ ] 9.4 `src/pages/nosotros.astro` — Locations: `1fr 1.6fr` → `grid-cols-1 lg:grid-cols-[1fr_1.6fr]`
- [ ] 9.5 `src/pages/nosotros.astro` — Timeline: verify mobile layout (vertical stack); no horizontal overflow
- [ ] 9.6 `src/pages/nosotros.astro` — Section paddings: reduce on mobile/tablet per spec

## Phase 10: Footer (PR2)

- [ ] 10.1 `src/components/footer/Footer.astro` — Grid: `2fr 1fr 1fr 1.5fr` → `grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.5fr]`

## Phase 11: PR2 Verification Gate

- [ ] 11.1 Run `yarn build` — exit code 0; fix all compile errors
- [ ] 11.2 Specificity audit: `rg 'style="[^"]*grid-template-columns'` in `src/` must return 0 matches
- [ ] 11.3 Manual check at 375px on all 4 pages: zero overflow-x (`scrollWidth === innerWidth`); all grids single-column; SectionHeader H2 fits viewport
- [ ] 11.4 Manual check at 768px on all 4 pages: 3-4 col grids show 2 cols; 2 col grids per spec table; no overflow
- [ ] 11.5 Manual check at 1280px on all 4 pages: desktop layout matches original design exactly (no regressions)
- [ ] 11.6 Manual a11y check Nav: Esc closes, `aria-expanded` toggles, focus returns to button, VoiceOver readable
