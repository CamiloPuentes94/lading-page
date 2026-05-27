# Tasks: Rediseño Landing Page (investor-grade)

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 2 500 – 3 500 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 → PR 2 → PR 3 → PR 4 → PR 5 → PR 6 |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Foundation: tokens + fonts + keyframes + Layout + Nav + Footer | PR 1 | Base for all pages; no page rewrites yet |
| 2 | Shared components: Logo, Button, Eyebrow, SectionHeader, ClosingCTA | PR 2 | Depends on PR 1; consumed by all pages |
| 3 | Home page: index.astro + all home-specific section components | PR 3 | Depends on PR 2 |
| 4 | Servicios page + ServiceBlock + EngagementModel | PR 4 | Depends on PR 2 |
| 5 | Portafolio page + PortfolioCard + PortfolioFilter (vanilla JS) | PR 5 | Depends on PR 2 |
| 6 | Nosotros page + OriginTimeline + Team + Locations + Hiring | PR 6 | Depends on PR 2 |

---

## Phase 1 — Foundation (PR 1)

- [x] 1.1 Install `@fontsource/geist-sans` (400, 500, 600) and `@fontsource/jetbrains-mono` (400, 500) via yarn; update `package.json`
- [x] 1.2 Rewrite `src/styles/global.css`: define all `--cf-*` tokens on `:root` (light) and `:root[data-cf-theme="dark"]` (dark) per spec Domain 1 color table (13 tokens)
- [x] 1.3 Add `@theme inline` block in `global.css` mapping `--cf-*` vars to Tailwind v4 utilities (`bg-brand`, `text-fg`, etc.)
- [x] 1.4 Add `@fontsource` imports, `font-display: swap`, and `font-family: 'Geist', system-ui, sans-serif` on `body` in `global.css`
- [x] 1.5 Define `@keyframes` in `global.css`: `cfRise` (stagger children), `cfType` (editor lines), `cfMarquee` (leftward scroll 38s), `cfBlink` (cursor 1s steps), `cfPulse` (expanding ring 1.8s)
- [x] 1.6 Add CSS animation classes: `.cf-reveal` (opacity 0 + translateY 14px → visible on `[data-cf-in="1"]`), `.cf-stagger > *` (nth-child delays 0.05/0.15/0.28/0.42/0.55/0.68s), `.cf-editor-line`, `.cf-marquee`, `.cf-caret`, `.cf-pulse::before`, `.cf-btn` (hover translateY -1px), `.cf-card` (hover translateY -4px), `.cf-navlink::after` (underline grow)
- [x] 1.7 Add `@media (prefers-reduced-motion: reduce)` block disabling all `cf-*` transitions and animations
- [x] 1.8 Modify `src/layouts/Layout.astro`: add `<link rel="preload">` for Geist woff2 400; add inline blocking `<script>` in `<head>` that reads `localStorage('cf-theme')` and sets `data-cf-theme` on `<html>` before first paint
- [x] 1.9 Add global `IntersectionObserver` script in `Layout.astro` observing `[data-cf-reveal]`, setting `data-cf-in="1"` on intersection (threshold 5%, rootMargin `-10% 0px`)
- [x] 1.10 Create `src/components/shared/ThemeToggle.astro`: 36×36 button, sun/moon icon, inline `<script>` toggling `.dark` + `localStorage('cf-theme')` + cross-tab `storage` event; aria-label reflects current action
- [x] 1.11 Create `src/components/shared/LangSwitcher.astro`: static ES/EN pill UI (no routing)
- [x] 1.12 Create `src/components/nav/Nav.astro`: `position:sticky; top:0; z-index:40`, `var(--cf-nav-bg)` + `backdrop-filter:blur(14px)`, Logo slot, links Servicios/Portafolio/Nosotros with `data-active` prop + `.cf-navlink`, ThemeToggle + LangSwitcher + Button "Conversemos"
- [x] 1.13 Create `src/components/footer/Footer.astro`: `var(--cf-navy-deep)` bg, Logo (dark prop), tagline, `.cf-pulse` pill "Aceptamos 2 proyectos · Q3 2026", 3 link columns (Servicios 4 links, Camandre 4 links, Contacto: email + phone + Bogotá address + "Madrid · CDMX · Remoto"), bottom bar copyright + secondary links
- [x] 1.14 Update `src/layouts/Layout.astro` slot wrapper to import and render Nav + Footer; delete `src/components/Navbar.astro` and `src/components/Footer.astro`
- [x] 1.15 Delete `src/assets/logo-*.png` (replaced by SVG inline in Phase 2)
- [x] 1.16 Manual check: `yarn build` exits 0; hard reload with `cf-theme=dark` in localStorage shows no white flash

---

## Phase 2 — Shared components (PR 2)

- [ ] 2.1 Create `src/components/shared/Logo.astro`: inline SVG, navy open-ring "C", emerald "A" + cursor-arrow; wordmark "CAMANDRE" (Geist 700, 15px, 0.04em) + "FACTORY" (JetBrains Mono 500, 9.5px, 0.32em, brand); `dark` prop sets ring/wordmark to white; `aria-label="Camandre Factory"`, `currentColor` pattern
- [ ] 2.2 Create `src/components/shared/Button.astro`: `variant: 'primary' | 'ghost'`, `href?`, `class?` props; `.cf-btn`; renders `<a>` when `href` provided, `<button>` otherwise
- [ ] 2.3 Create `src/components/shared/Eyebrow.astro`: `<span>` wrapper, JetBrains Mono 500, `letter-spacing:0.18em`, slot content
- [ ] 2.4 Create `src/components/shared/SectionHeader.astro`: optional Eyebrow + H2 slot composition
- [ ] 2.5 Create `src/components/shared/ClosingCTA.astro`: `section#contacto`, `var(--cf-navy-deep)` + radial gradient, H2 "Hablemos del sistema que tu equipo está esperando.", Button primary "Agendar consulta de 30 min", Button ghost `mailto:hola@camandre.factory`; all children carry `data-cf-reveal`
- [ ] 2.6 Swap Logo import in `Nav.astro` and `Footer.astro` to use new `Logo.astro`; confirm dark prop on Footer
- [ ] 2.7 Manual check: Logo light/dark correct; Button variants; ClosingCTA standalone section renders

---

## Phase 3 — Home page (PR 3)

- [ ] 3.1 Create `src/components/hero/Hero.astro`: 2-col grid (1.25fr/1fr, 72px gap), `.cf-pulse` brand pill "EST. 2019 · BOGOTÁ · MADRID · CDMX", H1 with `<span>` accent "para empresas" in `var(--cf-brand)`, subhead, CTA pair (Button primary lg "Conversemos" + ghost lg "Ver casos de éxito →"), 3 stats (40+/proyectos entregados, 99.98%/uptime promedio, 12/países en operación), `.cf-stagger` on left column
- [ ] 3.2 Create `src/components/hero/HeroEditor.astro`: macOS titlebar (3 dots + "projects/helio-health · main"), 11 `.cf-editor-line` divs (delay: 0.45s + 0.09s × line index), status bar, floating chip "−71% tiempo" (`position:absolute; left:-32px; bottom:-32px`)
- [ ] 3.3 Create `src/components/services/LogoStrip.astro`: `overflow:hidden` strip, `.cf-marquee`, 8 client names duplicated, Eyebrow "Confían en nosotros" + caption "40+ empresas en 12 países"
- [ ] 3.4 Create `src/components/services/ServiceCard.astro`: `eyebrow` (01–04), `title`, `description`, `bullets[]`, `href?` props; `.cf-card` + `data-cf-reveal`; stack tags rendered as pills
- [ ] 3.5 Create `src/components/case/FeaturedCase.astro`: H2 Helio Health headline, mock dark-navy dashboard (patient table aria-hidden), 4 metric blocks, ghost Button "Leer el caso completo"
- [ ] 3.6 Create `src/components/process/ProcessStep.astro`: single-row `display:grid; grid-template-columns:repeat(4,1fr)` with `border-right` separators, JetBrains Mono index + brand dot, H4, body; 4 steps
- [ ] 3.7 Create `src/components/testimonial/Testimonial.astro`: left panel with 3 selector `<button>` elements (María Paz Quintero active by default), right `<blockquote>` Geist 30px; inline `<script>` swaps active testimonial on click
- [ ] 3.8 Create `src/components/whyus/WhyUsCard.astro`: brand-tinted icon, H4, body, `data-cf-reveal`; sticky-left sidebar pattern rendered inline in page
- [ ] 3.9 Rewrite `src/pages/index.astro`: `<main>` containing Hero → LogoStrip → `<section>` Services grid `repeat(4,1fr)` → FeaturedCase → Process → Testimonial → WhyUs sticky layout → ClosingCTA; correct `<section>` landmarks throughout
- [ ] 3.10 Manual check: all 10 sections visible Chrome; H1 accent green; editor lines animate sequentially; stats show correct copy

---

## Phase 4 — Servicios page (PR 4)

- [ ] 4.1 Create `src/components/hero/PageHero.astro`: Eyebrow + H1 (96px Geist 600) + dim second line, `aria-hidden` grid pattern `<div>`, `.cf-stagger` on children
- [ ] 4.2 Create `src/components/services/ServiceBlock.astro`: alternating odd/even layout, tag badge, "OFICIO N / 04" label, H2, lede, "Incluye" 2-col checklist (6 items), deliverables text, stack tags; `id` prop for anchor navigation
- [ ] 4.3 Create decorative mock panels as aria-hidden sub-components (one per block): `MockProducto.astro`, `MockSistemas.astro`, `MockInfra.astro`, `MockConsultoria.astro` in `src/components/services/mocks/`
- [ ] 4.4 Create `src/components/services/EngagementModel.astro`: 3 model cards; Equipo dedicado card has "MÁS POPULAR" badge + brand-green border highlight; investment range + "Ideal para" text per card
- [ ] 4.5 Rewrite `src/pages/servicios.astro`: PageHero → ServiceBlock#producto → ServiceBlock#sistemas → ServiceBlock#infra → ServiceBlock#consultoria → EngagementModels → ClosingCTA
- [ ] 4.6 Manual check: `/servicios#sistemas` anchor scrolls correctly; `yarn build` clean

---

## Phase 5 — Portafolio page (PR 5)

- [ ] 5.1 Create `src/components/portfolio/PortfolioCard.astro`: `category`, `client`, `title`, `summary`, `metrics[]`, `year` props; `data-category` attr; category+year badge, client in `var(--cf-brand)`, 2 metric blocks, "Caso →" link; `.cf-card` + `data-cf-reveal`
- [ ] 5.2 Create `src/components/portfolio/PortfolioFilter.astro`: 5 pill `<button>` (Todos active default, Producto, Sistemas, Infraestructura, Consultoría); inline `<script>` adds/removes `hidden` on `.portfolio-card[data-category]` on click; active pill: navy bg + white text
- [ ] 5.3 Rewrite `src/pages/portafolio.astro`: PageHero (H1 "Sistemas en producción. Métricas reales.", 4 stats bordered row) → PortfolioFilter → CSS grid with all 8 PortfolioCards (helio/Producto/2025, northwind/Sistemas/2025, trevia/Producto/2024, banconorte/Consultoría/2024, lumen/Sistemas/2024, quanta/Infraestructura/2025, estudio/Producto/2024, acme/Infraestructura/2023) → footer row ("Mostrando N de 8 casos · archivo completo bajo NDA" + mailto) → ClosingCTA
- [ ] 5.4 Manual check: "Sistemas" filter → only northwind + lumen visible; "Todos" → 8 visible; no page reload; `data-category` values match filter button labels

---

## Phase 6 — Nosotros page (PR 6)

- [ ] 6.1 Create `src/components/about/OriginTimeline.astro`: 2-col layout, left: Eyebrow "Origen" + H2 "Cómo empezó esto." + 5-entry vertical timeline (2019 Chapinero, 2021 Banco Norte, 2023 Madrid 8p, 2025 CDMX 14p, 2026 40+ proyectos), right: 3 narrative paragraphs
- [ ] 6.2 Rewrite `src/pages/nosotros.astro`: PageHero (Eyebrow "Nosotros · Camandre Factory", H1 "Una fábrica pequeña. Decisiones grandes.", lede 14 personas distribuidas, `.cf-stagger`) → OriginTimeline → Values 2×2 grid (4 values per spec) → Team `repeat(3,1fr)` grid 6 cards → Locations 3 cards → Hiring 2×2 grid 4 jobs → ClosingCTA
- [ ] 6.3 Team cards inline: colored header + large initials + city badge, name, role (JetBrains Mono brand color), bio; footnote "+ 8 ingenieros…" + "Ver perfiles completos →" link
- [ ] 6.4 Locations cards inline: Bogotá (navy bg, "HQ" badge brand green), Madrid, CDMX
- [ ] 6.5 Hiring cards inline: open cards (Staff Engineer Bogotá/Remoto, Product Designer Madrid/Remoto) full opacity; closed cards (SRE Senior, Engineering Manager) `opacity:0.6`; Button "Enviar CV abierto"
- [ ] 6.6 Manual check: all sections render; team 3-col grid; HQ badge visible; closed job opacity 0.6

---

## Phase 7 — Cross-cutting verification

- [ ] 7.1 Run `yarn build` — confirm exit 0, zero TypeScript/Astro warnings on all 4 routes
- [ ] 7.2 Grep component files for hardcoded hex (`#[0-9A-Fa-f]{3,6}`) — confirm 0 matches in `src/components/` and `src/pages/`
- [ ] 7.3 Verify all 4 routes in Chrome, light + dark, hard reload — zero console errors
- [ ] 7.4 Confirm `section#contacto` with both CTA buttons present on all 4 pages
- [ ] 7.5 Confirm Footer 3-column + bottom bar present on all 4 pages
- [ ] 7.6 Test `prefers-reduced-motion: reduce` via Chrome DevTools Rendering panel — no cf-* transitions fire
- [ ] 7.7 Run Lighthouse on `/` (Chrome desktop): Performance ≥ 90, Accessibility ≥ 95
- [ ] 7.8 ThemeToggle: toggle → navigate → reload → dark mode persists; cross-tab sync via `storage` event
- [ ] 7.9 Tab through Nav — all links + buttons reachable in DOM order with visible focus rings; Logo SVG has `aria-label`; decorative elements carry `aria-hidden="true"`
