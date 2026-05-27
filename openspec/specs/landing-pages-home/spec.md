# Spec: landing-pages-home

Change: investor-grade redesign of the Camandre Factory public site.

## Domain: landing-pages-home

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
