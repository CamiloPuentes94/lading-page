# Spec: landing-pages-nosotros

Change: investor-grade redesign of the Camandre Factory public site.

## Domain: landing-pages-nosotros

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
