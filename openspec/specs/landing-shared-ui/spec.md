# Spec: landing-shared-ui

Change: investor-grade redesign of the Camandre Factory public site.

## Domain: landing-shared-ui

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
