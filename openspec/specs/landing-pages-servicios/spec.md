# Spec: landing-pages-servicios

Change: investor-grade redesign of the Camandre Factory public site.

## Domain: landing-pages-servicios

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
