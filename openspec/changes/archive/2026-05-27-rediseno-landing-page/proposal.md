# Proposal: Rediseño Landing Page Camandre Factory (investor-grade)

## Intent

La implementación actual de la landing corresponde a un diseño anterior (incluye una versión previa basada en Montserrat + cards genéricas). El nuevo Claude Design — investor-grade, con posicionamiento "software a medida para empresas que toman decisiones serias" — no está implementado. Queremos alinear la web pública con la identidad de marca actualizada (tipografía Geist + JetBrains Mono, paleta brand custom, narrativa Bogotá/Madrid/CDMX, caso Helio Health, modelo de engagement) para sostener el pitch comercial vigente y dar coherencia entre lo que vendemos y lo que mostramos.

## Scope

### In Scope
- Reescritura completa de `src/pages/index.astro` con las 10 secciones del nuevo home (Nav, Hero, LogoStrip, Services, FeaturedCase, Process, Testimonial, WhyUs, ClosingCTA, Footer).
- Reescritura completa de `src/pages/servicios.astro`, `src/pages/portafolio.astro` y `src/pages/nosotros.astro` siguiendo los JSX de referencia.
- Tokens de diseño en `src/styles/global.css`: paleta brand (light/dark) y tipografías Geist + JetBrains Mono vía CSS variables y `@theme` de Tailwind v4.
- Animaciones CSS reutilizables: `cf-stagger`, `cf-editor-line`, `cf-marquee`, `cf-reveal`, `cf-pulse`, `cf-caret`, `cf-btn`, `cf-card`, `cf-navlink`.
- Componentes Astro en `src/components/` (atomic + screaming, agrupados por sección): Nav, ThemeToggle, LangSwitcher, Hero, LogoStrip, ServiceCard, FeaturedCase, ProcessStep, Testimonial, WhyUsCard, ClosingCTA, Footer.
- Actualización de `src/layouts/Layout.astro`: carga de fuentes correctas y script inline anti-flash para dark/light persistido en localStorage.

### Out of Scope
- i18n real (ES/EN): el switcher se renderiza como UI, el contenido se entrega en español. Traducción real queda para un cambio posterior.
- Backend / formularios de contacto (CTA "Conversemos" apunta a mailto o ancla; integración con CRM diferida).
- Animaciones JS complejas más allá de IntersectionObserver para `cf-reveal`.
- Optimización de imágenes reales del portafolio (se usan placeholders/mocks tal como en el JSX de referencia).
- SEO técnico avanzado (sitemap, OG dinámico, schema.org) — solo metadatos básicos.

## Capabilities

### New Capabilities
- `landing-design-system`: tokens de marca (color brand, tipografías Geist/JetBrains Mono, animaciones cf-*) expuestos vía CSS variables y `@theme` de Tailwind v4.
- `landing-pages`: contenido y estructura de las 4 páginas públicas (home, servicios, portafolio, nosotros) según el nuevo diseño investor-grade.
- `landing-shared-ui`: componentes Astro compartidos (Nav, Footer, ClosingCTA, ThemeToggle, LangSwitcher).

### Modified Capabilities
- None (la implementación previa se sustituye por completo; no hay specs estables anteriores que evolucionar).

## Approach

1. **Tokens primero**: traducir `shared.jsx` a `global.css` (variables CSS + `@theme inline` Tailwind v4 + keyframes). Una sola fuente de verdad para color, tipografía y animación.
2. **Componentes Astro estáticos**: traducir cada bloque JSX a `.astro` sin React runtime; interactividad mínima vía `<script>` inline (theme toggle, IntersectionObserver para reveal, animación del code editor del hero).
3. **Páginas como composición**: cada `*.astro` importa componentes y pasa props/slots; sin lógica.
4. **Dark mode**: clase `dark` en `<html>`, toggle persistente en localStorage, respeta `prefers-color-scheme` la primera vez, script anti-flash en `<head>`.
5. **Organización**: `src/components/{nav,hero,services,...}/` agrupado por sección (screaming), no por tipo.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/styles/global.css` | Modified | Tokens brand, fuentes, animaciones cf-* |
| `src/layouts/Layout.astro` | Modified | Fuentes Geist/JetBrains, theme init anti-flash |
| `src/pages/index.astro` | Modified | Reescritura completa home (10 secciones) |
| `src/pages/servicios.astro` | Modified | Reescritura (Hero + 4 ServiceBlocks + EngagementModels + ClosingCTA) |
| `src/pages/portafolio.astro` | Modified | Reescritura (Hero + grid filtrable 8 casos + ClosingCTA) |
| `src/pages/nosotros.astro` | Modified | Reescritura (Hero + Origin timeline + ClosingCTA) |
| `src/components/` | New | Componentes por sección |
| `package.json` | Modified | Agregar `@fontsource/geist-sans`, `@fontsource/jetbrains-mono` |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Tailwind v4 `@theme` mal configurado rompe estilos | Med | Validar con `astro dev` tras cada bloque de tokens; usar `@theme inline` |
| Fuentes Geist/JetBrains agregan peso (FOIT/FOUT) | Med | Self-host vía `@fontsource`, `font-display: swap`, preload de woff2 críticos |
| Dark mode con SSR provoca flash | High | Script inline en `<head>` que setea clase antes de pintar |
| Animaciones afectan accesibilidad | Low | Respetar `prefers-reduced-motion` en keyframes y reveal |
| Mocks (code editor hero, dashboard Helio) difíciles de portar fiel | Med | Componentes dedicados con DOM estático + clases Tailwind; iterar visual contra el JSX |
| Existe proposal/design/tasks previo en el directorio | High | Sobrescribir artefactos del rediseño anterior; commits atómicos por sección para revert simple |

## Rollback Plan

Cada página y `global.css` se modifican en commits atómicos por sección. Revertir = `git revert` de los commits del rediseño; la versión anterior queda intacta en `main` previo al merge. No hay migraciones de datos ni cambios de infra. El proposal/design/tasks previos quedan reemplazados por los nuevos en el mismo directorio.

## Dependencies

- `@fontsource/geist-sans`, `@fontsource/jetbrains-mono` instalados vía yarn.
- Archivos de referencia disponibles en `/tmp/design-camandre/pagina-principal/project/*.jsx` (shared, home, servicios, portafolio, nosotros).

## Success Criteria

- [ ] Las 4 páginas (`/`, `/servicios`, `/portafolio`, `/nosotros`) renderizan el nuevo diseño en Chrome sin errores de consola.
- [ ] Light/dark toggle funciona, persiste en localStorage, y no hay flash al cargar.
- [ ] Lighthouse Performance >= 90 y Accessibility >= 95 en home.
- [ ] Tokens (color, fuente) se usan vía variables CSS — ningún hex hardcoded en componentes.
- [ ] Animaciones respetan `prefers-reduced-motion`.
- [ ] `yarn build` pasa sin warnings.
