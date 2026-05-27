# Design: Rediseño Landing Page (investor-grade)

## Technical Approach

Astro estático compuesto por componentes `.astro` agrupados por sección (screaming architecture). Tokens de marca como CSS variables consumidas por Tailwind v4 vía `@theme inline`. Interactividad mínima en `<script>` vanilla inline (sin frameworks JS). Dark mode mediante clase `.dark` en `<html>` con script anti-FOUC en `<head>`. Fuentes self-hosted con `@fontsource`. Animaciones CSS puras con `prefers-reduced-motion`; un único `IntersectionObserver` global para `cf-reveal`.

## Architecture Decisions

### Decision 1: Estructura de componentes por sección (screaming)
**Choice**: `src/components/{nav,hero,services,case,process,testimonial,whyus,cta,footer,portfolio,about,shared}/Component.astro`.
**Alternatives**: por tipo (`atoms/molecules/organisms`); todo inline en páginas.
**Rationale**: el JSX de referencia está organizado por sección; facilita ubicar el bloque visual. Atomic puro fragmenta demasiado para 4 páginas. `shared/` para Button, Eyebrow, Logo, ClosingCTA.

### Decision 2: Tokens — CSS variables + `@theme inline`
**Choice**: definir `:root` y `.dark` con variables (`--brand`, `--bg`, `--fg`, `--muted`, `--border`, `--accent`) en `global.css`; mapearlas en `@theme inline { --color-brand: var(--brand); ... }` para que Tailwind v4 las exponga como utilidades (`bg-brand`, `text-fg`).
**Alternatives**: solo `@theme` estático (rompe dark mode dinámico); solo CSS vars sin Tailwind (pierde utilidades).
**Rationale**: `@theme inline` es la forma idiomática Tailwind v4 para tokens reactivos a clase `.dark`.

### Decision 3: Dark mode — clase `.dark` + localStorage + script anti-FOUC
**Choice**: script síncrono inline en `<head>` que lee `localStorage.theme` o `prefers-color-scheme` y aplica `document.documentElement.classList`. `ThemeToggle.astro` muta clase + persiste. Tailwind v4 configurado con `@custom-variant dark (&:where(.dark, .dark *))`.
**Alternatives**: `data-theme` attribute (requiere selectores custom en cada utilidad); cookies (necesita SSR roundtrip).
**Rationale**: clase es el patrón estándar Tailwind; script bloqueante en `<head>` elimina flash; sin estado compartido entre componentes Astro (cada toggle muta DOM directamente).

### Decision 4: Animaciones — CSS puro + un IO global
**Choice**:
- `cf-marquee`, `cf-stagger`, `cf-pulse`, `cf-caret`, `cf-btn` → `@keyframes` puros en `global.css` con `nth-child` delays para stagger.
- `cf-reveal` → un único `IntersectionObserver` en script inline en `Layout.astro` que observa `[data-cf-reveal]` y añade `.is-visible`.
- `cf-editor-line` → CSS animation con delays escalonados (sin JS), envuelta en `@media (prefers-reduced-motion: no-preference)`.
**Alternatives**: IO por componente (N observers, peor perf); GSAP/Framer (overhead innecesario).
**Rationale**: un observer global escala mejor y centraliza el `prefers-reduced-motion` check.

### Decision 5: Logo SVG inline en `shared/Logo.astro`
**Choice**: SVG inline (no `<img>`) con `currentColor` en stroke/fill críticos; recibe `class` por prop.
**Alternatives**: importar `.svg` como asset (no permite recolorear vía CSS); React component.
**Rationale**: `currentColor` permite que el logo herede `text-fg` y respete dark mode sin lógica adicional.

### Decision 6: Portafolio filter — vanilla JS client-side
**Choice**: Pre-renderizar los 8 casos en el HTML; script inline aplica `data-category` y filtra mostrando/ocultando vía `hidden` class al click de botones de categoría.
**Alternatives**: rutas dinámicas por categoría (overkill, SEO no requerido); Astro Islands con React (no justifica framework).
**Rationale**: 8 cards estáticas, filtro instantáneo sin roundtrip, SEO conserva todo el contenido.

### Decision 7: Fuentes — `@fontsource` self-hosted
**Choice**: `@fontsource/geist-sans` (400, 500, 600) y `@fontsource/jetbrains-mono` (400, 500). Import en `global.css`. `font-display: swap`. Preload de woff2 400 de Geist en `<head>`.
**Alternatives**: Google Fonts CDN (third-party request, peor LCP, privacy); Fontsource CDN.
**Rationale**: self-host elimina request externo, control de versión, mejor LCP.

### Decision 8: ThemeToggle / LangSwitcher — Astro + `<script>` inline
**Choice**: componentes `.astro` con `<script>` que registra listeners por `id`/`data-attr`. Sin estado compartido — cada componente es autónomo y muta DOM/localStorage directamente.
**Alternatives**: nanostores; Astro signals.
**Rationale**: interactividad trivial; añadir store es overhead para un toggle.

### Decision 9: Migración de archivos previos
**Choice**:
- Modificar: `Layout.astro`, `global.css`, `index.astro`, `servicios.astro`, `portafolio.astro`, `nosotros.astro`.
- Eliminar: `src/components/Navbar.astro`, `src/components/Footer.astro` (reemplazados por `nav/Nav.astro`, `footer/Footer.astro`), `src/assets/logo-*.png` (logo ahora SVG inline).
- Crear: árbol completo de `src/components/{section}/`.
**Rationale**: limpieza explícita evita componentes huérfanos.

## Component Tree

```
src/
├── layouts/
│   └── Layout.astro                  [modify: fonts, anti-FOUC, IO global]
├── pages/
│   ├── index.astro                   [rewrite: 10 secciones]
│   ├── servicios.astro               [rewrite]
│   ├── portafolio.astro              [rewrite + filter script]
│   └── nosotros.astro                [rewrite]
├── styles/
│   └── global.css                    [rewrite: tokens + @theme + cf-* keyframes]
└── components/
    ├── shared/
    │   ├── Logo.astro                [SVG inline, currentColor]
    │   ├── Button.astro              [variants: primary, ghost]
    │   ├── Eyebrow.astro             [JetBrains Mono caption]
    │   ├── ThemeToggle.astro         [localStorage + .dark]
    │   ├── LangSwitcher.astro        [UI only ES/EN]
    │   └── ClosingCTA.astro
    ├── nav/Nav.astro
    ├── footer/Footer.astro
    ├── hero/
    │   ├── Hero.astro                [home hero + cf-editor mock]
    │   └── PageHero.astro            [hero genérico páginas internas]
    ├── services/
    │   ├── LogoStrip.astro           [cf-marquee]
    │   ├── ServiceCard.astro
    │   └── EngagementModel.astro     [servicios.astro]
    ├── case/FeaturedCase.astro       [mock dashboard Helio]
    ├── process/ProcessStep.astro
    ├── testimonial/Testimonial.astro
    ├── whyus/WhyUsCard.astro
    ├── portfolio/
    │   ├── PortfolioCard.astro
    │   └── PortfolioFilter.astro     [vanilla JS filter]
    └── about/OriginTimeline.astro
```

## Data Flow

```
Layout.astro (head: fonts + anti-FOUC script + IO global)
   │
   ├─► Nav.astro ──► ThemeToggle (muta .dark + localStorage)
   │              └► LangSwitcher (UI only)
   │
   ├─► <slot/> = página (composición de componentes)
   │      │
   │      └─► componentes con data-cf-reveal → IO global añade .is-visible
   │
   └─► Footer.astro
```

CSS tokens flow: `:root` / `.dark` vars → `@theme inline` → Tailwind utilities → componentes.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/styles/global.css` | Rewrite | Tokens, @theme inline, fuentes, keyframes cf-* |
| `src/layouts/Layout.astro` | Modify | Preload fuentes, anti-FOUC script, IO global reveal |
| `src/pages/index.astro` | Rewrite | 10 secciones del nuevo home |
| `src/pages/servicios.astro` | Rewrite | Hero + 4 servicios + engagement + CTA |
| `src/pages/portafolio.astro` | Rewrite | Hero + grid 8 casos + filtro + CTA |
| `src/pages/nosotros.astro` | Rewrite | Hero + origin timeline + CTA |
| `src/components/{section}/*.astro` | Create | Árbol completo (ver tree) |
| `src/components/Navbar.astro` | Delete | Reemplazado por `nav/Nav.astro` |
| `src/components/Footer.astro` | Delete | Reemplazado por `footer/Footer.astro` |
| `src/assets/logo-*.png` | Delete | Logo ahora SVG inline |
| `package.json` | Modify | `@fontsource/geist-sans`, `@fontsource/jetbrains-mono` |

## Interfaces / Contracts

```astro
// shared/Button.astro
---
interface Props {
  variant?: 'primary' | 'ghost';
  href?: string;
  class?: string;
}
---

// services/ServiceCard.astro
---
interface Props {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  href?: string;
}
---

// portfolio/PortfolioCard.astro
---
interface Props {
  category: 'web' | 'mobile' | 'data' | 'platform';
  client: string;
  title: string;
  summary: string;
  metrics: { label: string; value: string }[];
}
---
```

Token contract (CSS vars):
```css
:root { --brand, --bg, --fg, --muted, --border, --accent, --surface }
.dark { /* overrides */ }
```

## Testing Strategy

| Layer | What | Approach |
|-------|------|----------|
| Build | `yarn build` sin warnings | manual + CI |
| Visual | 4 páginas en Chrome (light/dark) | manual contra JSX de referencia |
| A11y | Lighthouse ≥ 95 home | Chrome DevTools |
| Perf | Lighthouse Perf ≥ 90 | Chrome DevTools |
| Motion | `prefers-reduced-motion` honored | DevTools rendering panel |
| Dark | No FOUC al refresh con theme=dark | manual hard reload |

No hay tests unitarios — proyecto sin suite configurada y cambios 100% visuales.

## Migration / Rollout

Commits atómicos por sección (tokens → layout → componentes shared → home → internas). Sin migración de datos. Rollback = `git revert` del rango.

## Open Questions

- [ ] ¿Mantener `astro.config.mjs` con adapter `@astrojs/node` para SSR o cambiar a `output: 'static'`? Recomendado: mantener (deploy actual lo usa).
- [ ] ¿`LangSwitcher` debe ocultarse si solo hay ES, o mostrarse disabled? Recomendación: mostrar como UI estática (decisión de proposal).
