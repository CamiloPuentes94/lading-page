# Spec: rediseno-landing-page

Change: investor-grade redesign of the Camandre Factory public site.
All domains below are NEW (no prior stable specs to delta against).

---

## Domain 1: landing-design-system

### Requirement: Color tokens

The system MUST expose all brand colors as CSS custom properties on `:root` (light) and `:root[data-cf-theme="dark"]` (dark). No hex value SHALL be hardcoded inside component files.

| Token | Light | Dark |
|---|---|---|
| `--cf-ink` | `#0B132B` | `#F1F4FB` |
| `--cf-navy` | `#0F2557` | `#1E3A8A` |
| `--cf-navy-deep` | `#091A3D` | `#040814` |
| `--cf-brand` | `#0EA472` | `#22C58E` |
| `--cf-brand-sel` | `rgba(14,164,114,0.10)` | `rgba(34,197,142,0.12)` |
| `--cf-bg` | `#FAF8F3` | `#0A0F1F` |
| `--cf-bg2` | `#F2EFE7` | `#0F1528` |
| `--cf-paper` | `#FFFFFF` | `#141A2E` |
| `--cf-rule` | `#E5E2D7` | `#1F2747` |
| `--cf-text` | `#1A2236` | `#C7CDE0` |
| `--cf-dim` | `#5C657A` | `#7C849C` |
| `--cf-faded-navy` | `#E4E7F0` | `#2A3050` |
| `--cf-nav-bg` | `rgba(250,248,243,0.85)` | `rgba(10,15,31,0.82)` |

#### Scenario: Tokens present at first paint (light)
- GIVEN the page loads with no prior `cf-theme` in localStorage
- WHEN the browser parses `global.css`
- THEN `--cf-bg` resolves to `#FAF8F3` and `--cf-brand` to `#0EA472`

#### Scenario: Tokens switch on dark mode
- GIVEN `data-cf-theme="dark"` is set on `<html>`
- WHEN any element references `var(--cf-bg)`
- THEN the resolved value is `#0A0F1F`

### Requirement: Typography scale

The system MUST load Geist (display + body) and JetBrains Mono (eyebrows, code, labels) via `@fontsource` packages. `font-family: 'Geist', system-ui, sans-serif` MUST be set on `body`. No Google Fonts remote requests SHALL occur.

| Use | Font | Weight | Letter-spacing |
|---|---|---|---|
| H1 hero | Geist | 600 | `-0.04em` |
| H2 section | Geist | 600 | `-0.03em` to `-0.035em` |
| Body | Geist | 400–500 | default |
| Eyebrow | JetBrains Mono | 500 | `0.18em` |
| Code editor | JetBrains Mono | 400 | default |
| Stats label | JetBrains Mono | 400–600 | `0.06em–0.12em` |

#### Scenario: Font loads without FOIT
- GIVEN the fonts are self-hosted via `@fontsource`
- WHEN the page renders
- THEN `font-display: swap` is active and body text shows immediately in system-ui fallback while Geist loads

### Requirement: Animation classes

The system MUST define the following CSS animation classes in `global.css`:

| Class | Behavior |
|---|---|
| `.cf-reveal` | `opacity:0; transform:translateY(14px)` → animated to visible when `[data-cf-in="1"]` is set |
| `.cf-stagger > *` | children animate in sequence (delays: 0.05s, 0.15s, 0.28s, 0.42s, 0.55s, 0.68s) via `cfRise` keyframe |
| `.cf-editor-line` | `opacity:0; transform:translateX(-6px)` → `cfType` keyframe, delay per line index |
| `.cf-marquee` | `animation: cfMarquee 38s linear infinite` — scrolls content leftward |
| `.cf-caret` | `cfBlink 1s steps(1) infinite` — blinking cursor block |
| `.cf-pulse::before` | `cfPulse 1.8s ease-out infinite` — expanding ring around live dot |
| `.cf-btn` | `transition: transform .2s, box-shadow .2s` — `translateY(-1px)` on hover |
| `.cf-card` | `transition: transform .3s, box-shadow .3s, border-color .3s` — `translateY(-4px)` on hover |
| `.cf-navlink::after` | underline grows from 0 to 100% width on hover / `[data-active="1"]` |

#### Scenario: Reduced motion respected
- GIVEN `prefers-reduced-motion: reduce` is active in the OS
- WHEN any `.cf-reveal`, `.cf-stagger`, or `.cf-marquee` element is rendered
- THEN the animation is disabled or replaced with an instant show (no transform/opacity transition)

#### Scenario: Reveal triggers on scroll
- GIVEN a `.cf-reveal` element is in the DOM below the fold
- WHEN the element enters the viewport (threshold 5%, rootMargin "-10% 0px")
- THEN `data-cf-in="1"` is set and the element becomes visible via CSS transition

---

## Domain 2: landing-shared-ui

### Requirement: Logo SVG component

The system MUST render the Camandre Factory logo as an inline SVG with: navy open-ring "C", emerald "A" letterform, and emerald cursor-arrow overlapping bottom-right. Wordmark reads "CAMANDRE" (Geist 700, 15px, `0.04em`) + "FACTORY" (JetBrains Mono 500, 9.5px, `0.32em`, brand color). The `dark` prop MUST invert ring and wordmark to white.

#### Scenario: Logo in light mode
- GIVEN no `dark` prop and `data-cf-theme="light"`
- WHEN the Logo renders
- THEN ring stroke and "CAMANDRE" text use `var(--cf-navy)`; "A" and "FACTORY" use `var(--cf-brand)`

#### Scenario: Logo in dark mode (dark prop forced)
- GIVEN `dark` prop is passed (e.g. inside Footer)
- WHEN the Logo renders
- THEN ring and "CAMANDRE" are white (`#FFFFFF`); "A" and "FACTORY" remain brand green

### Requirement: Nav component

The system MUST render a sticky header with: Logo (left), nav links Servicios / Portafolio / Nosotros (center), ThemeToggle + LangSwitcher (ES/EN) + primary Button "Conversemos" (right). Background: `var(--cf-nav-bg)` with `backdrop-filter: blur(14px)`. Active link MUST show the brand underline via `data-active="1"`.

#### Scenario: Active link highlighted
- GIVEN the user is on `/servicios`
- WHEN Nav renders with `active="servicios"`
- THEN the Servicios link has `data-active="1"` and shows the brand underline

#### Scenario: Nav stays on top during scroll
- GIVEN any page
- WHEN the user scrolls down past the hero
- THEN the Nav remains visible at the top (position: sticky, top: 0, z-index: 40)

### Requirement: ThemeToggle

The system MUST render a 36×36 circular button with sun icon (dark mode) or moon icon (light mode). Clicking it MUST flip `data-cf-theme` on `<html>`, persist to `localStorage('cf-theme')`, and trigger a cross-tab sync via `storage` event. aria-label MUST describe the action ("Cambiar a modo claro" / "Cambiar a modo oscuro").

#### Scenario: Toggle persists across page reloads
- GIVEN the user clicks ThemeToggle setting dark mode
- WHEN the user navigates to a different page
- THEN the page loads in dark mode without flash (anti-flash script ran first)

### Requirement: Anti-flash dark mode script

The system MUST include an inline `<script>` in `<head>` (before any CSS or content) that reads `localStorage('cf-theme')` synchronously and sets `data-cf-theme` on `<html>` before first paint.

#### Scenario: No flash on dark-mode page load
- GIVEN `cf-theme = "dark"` in localStorage
- WHEN the page loads
- THEN the background is dark from the first rendered frame (no white flash)

### Requirement: Footer component

The system MUST render a footer on `var(--cf-navy-deep)` background with: Logo (dark prop), tagline, "Aceptamos 2 proyectos · Q3 2026" pill with `.cf-pulse` dot, and 3 link columns (Servicios, Camandre, Contacto). Bottom bar shows copyright and secondary links (Privacidad, Términos, LinkedIn, GitHub).

#### Scenario: Footer columns present
- GIVEN any page
- WHEN the Footer renders
- THEN the Servicios column has 4 links, Camandre column has 4 links, Contacto column has hola@camandre.factory + phone + Bogotá address + "Madrid · CDMX · Remoto"

### Requirement: ClosingCTA component

The system MUST render a `section#contacto` on `var(--cf-navy-deep)` with radial gradient background, headline "Hablemos del sistema que tu equipo está esperando.", two CTAs: primary "Agendar consulta de 30 min" and ghost "hola@camandre.factory" (mailto link). All child elements MUST use `.cf-reveal`.

#### Scenario: ClosingCTA renders on every page
- GIVEN any of the 4 pages (home, servicios, portafolio, nosotros)
- WHEN the page loads
- THEN a `section#contacto` with both CTA buttons is present above the Footer

---

## Domain 3: landing-pages — Home

### Requirement: Hero section

The system MUST render a 2-column grid (1.25fr / 1fr, 72px gap). Left column: brand pill with `.cf-pulse` dot and copy "EST. 2019 · BOGOTÁ · MADRID · CDMX"; H1 "Software a medida **para empresas** que toman decisiones serias."; subhead; two CTAs ("Conversemos" primary lg + "Ver casos de éxito →" ghost lg); 3 stats (40+ proyectos, 99.98% uptime, 12 países). Left column MUST be wrapped in `.cf-stagger`. Right column: HeroEditor component with `.cf-editor-line` animations.

#### Scenario: H1 renders with accent span
- GIVEN the home page loads
- WHEN Hero renders
- THEN the phrase "para empresas" appears in `var(--cf-brand)` color inside the H1

#### Scenario: Stats row present
- GIVEN the home page loads
- WHEN Hero renders
- THEN three stat blocks are visible: "40+" / "proyectos entregados", "99.98%" / "uptime promedio", "12" / "países en operación"

### Requirement: HeroEditor component

The system MUST render a mock code editor with: macOS-style titlebar (3 colored dots + "projects/helio-health · main"), 11 code lines with `.cf-editor-line` staggered animation (delay starting at 0.45s + 0.09s per line), status bar, and a floating metric chip ("−71% tiempo") positioned `left:-32px, bottom:-32px`.

#### Scenario: Code lines animate on load
- GIVEN the home page loads
- WHEN Hero renders
- THEN each `.cf-editor-line` fades in sequentially (line 1 at 0.45s, line 11 at ~1.35s)

### Requirement: LogoStrip section

The system MUST render an `overflow:hidden` marquee strip with 8 client names duplicated to create infinite scroll: ACME INDUSTRIES, BANCO NORTE, TREVIA LOGISTICS, HELIO HEALTH, NORTHWIND, QUANTA ENERGY, ESTUDIO PLOMO, LUMEN FOODS. Eyebrow "Confían en nosotros" + "40+ empresas en 12 países" caption left-aligned.

### Requirement: Services section (home)

The system MUST render 4 ServiceCard components in a `repeat(4,1fr)` grid. Each card shows: index (01–04), title, body, stack tags. Cards MUST use `.cf-card` and `.cf-reveal`.

| # | Title | Stack |
|---|---|---|
| 01 | Producto web a medida | Astro, React, Tailwind, shadcn/ui |
| 02 | Sistemas a medida | Django, PostgreSQL, Redis, Docker |
| 03 | Infraestructura & Cloud | GCP, AWS, Terraform, Kubernetes |
| 04 | Consultoría TI | Audit, Strategy, Hiring, Training |

### Requirement: FeaturedCase section

The system MUST render the Helio Health case study: headline "Reescribimos un EMR de 14 años en nueve meses, sin un solo downtime.", mock dashboard (dark navy panel with live patient table), 4 metrics (96% adopción, 0 incidentes, 1.2M historias, −42% tiempo de consulta), and "Leer el caso completo" ghost button.

### Requirement: Process section

The system MUST render 4 process steps in a single-row bordered grid (no gaps between cells, `border-right` separators). Steps: 01 Discovery, 02 Arquitectura, 03 Construcción, 04 Operación. Each cell has JetBrains Mono index + brand dot, H4 title, body paragraph.

### Requirement: Testimonial section

The system MUST render a 2-column layout: left panel with 3 person selectors (María Paz Quintero / CTO Northwind, Juan Restrepo / CEO Trevia, Ana Suárez / VP Tech Helio); right blockquote showing the active testimonial in Geist 30px. Default active: María Paz Quintero.

### Requirement: WhyUs section

The system MUST render a sticky-left sidebar ("No somos los más baratos. Pero somos los más responsables.") and a 2×2 grid of feature cards (Equipo dedicado, Decisiones técnicas defendibles, Compromiso con lo aburrido, Modelo de retainer transparente). Each card has brand-tinted icon, H4, and body. Cards MUST use `.cf-reveal`.

---

## Domain 4: landing-pages — Servicios

### Requirement: Servicios hero

The system MUST render an H1 "Diseño, ingeniería e infraestructura, bajo el mismo techo." at 96px Geist 600 with dim-colored second line. Eyebrow "Oficios · 4 disciplinas". Background grid pattern (aria-hidden). `.cf-stagger` on hero children.

### Requirement: Service blocks (4)

The system MUST render 4 ServiceBlock sections alternating layout (odd: mock left/body right; even: body left/mock right). Each block has: tag badge, "OFICIO N / 04" label, H2 title, lede paragraph, "Incluye" checklist (2-column grid), deliverables text, stack tags.

| ID | Tag | Title | Includes count | Stack |
|---|---|---|---|---|
| `#producto` | PRODUCTO | Producto web a medida. | 6 items | Astro, React, TypeScript, Tailwind, shadcn/ui, Go, Postgres |
| `#sistemas` | SISTEMAS | Sistemas a medida. | 6 items | Django, PostgreSQL, Redis, Celery, Docker, Grafana |
| `#infra` | INFRAESTRUCTURA | Infraestructura & Cloud. | 6 items | GCP, AWS, Terraform, Kubernetes, Grafana, Datadog |
| `#consultoria` | CONSULTORÍA | Consultoría TI. | 6 items | Audit, Strategy, Roadmap, Hiring, Training |

#### Scenario: Anchor navigation works
- GIVEN a user follows a link to `/servicios#sistemas`
- WHEN the page loads
- THEN the browser scrolls to the `#sistemas` section

### Requirement: Engagement models section

The system MUST render 3 engagement model cards: Proyecto cerrado, Equipo dedicado (marked "MÁS POPULAR" with brand-green badge, highlighted border), Retainer + on-call. Each shows investment range and "Ideal para" context.

---

## Domain 5: landing-pages — Portafolio

### Requirement: Portfolio hero

The system MUST render an H1 "Sistemas en producción. Métricas reales." at 96px with `.cf-stagger`. Below the headline: 4 stats in a bordered row (40+ proyectos, 12 países, 8 años, 99.98% uptime).

### Requirement: Portfolio filter grid

The system MUST render a pill-style filter bar with 5 categories: Todos, Producto, Sistemas, Infraestructura, Consultoría. Active filter MUST visually highlight (navy background, white text). Clicking a category MUST update the grid to show only matching cases without a page reload.

#### Scenario: Filter to "Sistemas" shows 2 cases
- GIVEN the portfolio page is loaded
- WHEN user clicks the "Sistemas" filter button
- THEN only Northwind Co. and Lumen Foods case cards are visible

#### Scenario: "Todos" shows all 8 cases
- GIVEN filter is set to "Producto"
- WHEN user clicks "Todos"
- THEN all 8 case cards are visible

### Requirement: Case cards (8)

The system MUST render 8 CaseCard components. Each card MUST show: category+year badge, client name in brand color, title (Geist 21px), description, 2 metrics, and "Caso →" link. Cards MUST carry `.cf-card` and `.cf-reveal`. Featured cases (helio, northwind, trevia) MAY have wider layout treatment.

| ID | Client | Category | Year |
|---|---|---|---|
| helio | Helio Health | Producto | 2025 |
| northwind | Northwind Co. | Sistemas | 2025 |
| trevia | Trevia Logistics | Producto | 2024 |
| banconorte | Banco Norte | Consultoría | 2024 |
| lumen | Lumen Foods | Sistemas | 2024 |
| quanta | Quanta Energy | Infraestructura | 2025 |
| estudio | Estudio Plomo | Producto | 2024 |
| acme | ACME Industries | Infraestructura | 2023 |

### Requirement: Portfolio footer row

The system MUST render a bottom row: left side shows "Mostrando N de 8 casos · archivo completo bajo NDA"; right side shows "Solicitar acceso al archivo completo →" mailto link.

---

## Domain 6: landing-pages — Nosotros

### Requirement: Nosotros hero

The system MUST render an H1 "Una fábrica pequeña. Decisiones grandes." at 96px, Eyebrow "Nosotros · Camandre Factory", and lede "Somos 14 personas distribuidas entre Bogotá, Madrid y CDMX…" with `.cf-stagger`.

### Requirement: Origin section

The system MUST render a 2-column layout: left has Eyebrow "Origen", H2 "Cómo empezó esto.", and a 5-entry timeline (2019–2026); right has 3 paragraphs narrating the company history.

| Year | Milestone |
|---|---|
| 2019 | Dos ingenieros, un garaje en Chapinero |
| 2021 | Primer cliente enterprise · Banco Norte |
| 2023 | Apertura de Madrid · 8 personas |
| 2025 | Apertura de CDMX · 14 personas |
| 2026 | 40+ proyectos en producción · 12 países |

### Requirement: Values section

The system MUST render 4 values in a 2×2 grid: (01) Decir no es un acto de respeto; (02) El código que entregamos vive sin nosotros; (03) Lo aburrido sostiene lo brillante; (04) Honestidad técnica sobre cortesía social. Each card has JetBrains Mono index, brand dot, H3, and body paragraph.

### Requirement: Team section

The system MUST render 6 TeamMember cards in a `repeat(3,1fr)` grid. Each card has: colored header area with large initials and city badge, name, role (JetBrains Mono brand color), bio. Plus a footnote row "+ 8 ingenieros…" with "Ver perfiles completos →" link.

| Initials | Name | Role | City |
|---|---|---|---|
| AR | Alejandro Ruiz | CEO · Fundador | Bogotá |
| SM | Sofía Méndez | CTO · Cofundadora | Madrid |
| CV | Carlos Vega | Lead Engineer | Bogotá |
| AT | Ana Torres | Head of Design | CDMX |
| LM | Luis Marín | Staff Engineer | Madrid |
| PM | Paula Morales | Engineering Manager | Bogotá |

### Requirement: Locations section

The system MUST render 3 location cards: Bogotá (HQ, navy background), Madrid, CDMX. HQ card carries an "HQ" badge in brand green.

### Requirement: Hiring section

The system MUST render 4 job cards in a 2×2 grid: Staff Engineer (open, Bogotá/Remoto), Product Designer (open, Madrid/Remoto), SRE Senior (closed), Engineering Manager (closed). Open cards are full opacity; closed cards are `opacity:0.6`. Primary CTA button "Enviar CV abierto".

---

## Domain 7: Accessibility

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

---

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
