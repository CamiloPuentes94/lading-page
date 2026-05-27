# Spec: landing-pages-portafolio

Change: investor-grade redesign of the Camandre Factory public site.

## Domain: landing-pages-portafolio

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
