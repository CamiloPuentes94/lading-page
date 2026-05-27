# Proposal: Responsive Mobile/Tablet — Camandre Factory Landing Page

**Change ID**: `responsive-mobile-tablet`
**Status**: proposed
**Date**: 2026-05-27
**Artifact store**: hybrid (engram + openspec)

---

## 1. Intent

### Problem
La landing page de Camandre Factory **no tiene responsive design**. Cero `@media` queries, cero prefijos Tailwind (`sm:`, `md:`, `lg:`), font-sizes hardcoded hasta 96px y grids multi-columna que no colapsan. La exploración documentó **29 violaciones** repartidas entre `/`, `/servicios`, `/portafolio` y `/nosotros`.

En dispositivos mobile (<768px) y tablet (768–1024px) el sitio se desborda horizontalmente, las tipografías rompen el viewport, los grids quedan ilegibles y el Nav no tiene hamburger menu — la navegación es inaccesible.

### Why now
- La landing es la cara pública de la marca; el tráfico mobile suele ser >60% en sitios B2B/agencia.
- Sin responsive básico, cada nueva sección que se agregue hereda el problema y multiplica la deuda.
- Hay un **bloqueador estructural** (inline styles) que solo crece con cada commit; conviene cortarlo ahora antes de que más componentes lo perpetúen.

### Success looks like
- Las 4 páginas (`/`, `/servicios`, `/portafolio`, `/nosotros`) se ven correctamente en breakpoints `<640px`, `640–1024px` y `>1024px`.
- Cero overflow horizontal en mobile.
- Nav con hamburger funcional en `<lg`.
- Tipografías escalan con `clamp()` o prefijos responsive — sin valores fijos >48px en mobile.
- Grids colapsan a 1 o 2 columnas en mobile según contenido.
- Desktop conserva el diseño actual **pixel-perfect** (no regresiones visuales).

---

## 2. Scope

### In scope
**Páginas**:
- `src/pages/index.astro`
- `src/pages/servicios.astro`
- `src/pages/portafolio.astro`
- `src/pages/nosotros.astro`

**Componentes compartidos**:
- `src/components/nav/Nav.astro` — agregar hamburger menu + drawer mobile
- `src/components/footer/Footer.astro` — grid responsive
- `src/components/shared/ClosingCTA.astro` — tipografía 88px → clamp
- `src/components/shared/SectionHeader.astro` — verificar/ajustar escala

**Layout**:
- `src/layouts/Layout.astro` — meta viewport, overflow-x guards si hace falta

**Estilos globales**:
- `src/styles/global.css` — agregar utilidades responsive si son necesarias, sin tocar tokens `--cf-*`

### Out of scope
- **Dark mode / nuevos tokens de color** — los `--cf-*` quedan intactos.
- **Lógica de negocio** — formularios, integraciones, analytics no se tocan.
- **Copy** — ningún texto cambia (Brook no entra en este cambio).
- **Rediseño visual** — no se cambian colores, sombras, shadows ni decisiones de diseño; solo se hace que el diseño existente responda al viewport.
- **Refactor total a Tailwind** — se conservan inline styles para tokens y design details; solo se migran propiedades layout-sensitivas.
- **Performance / Lighthouse / SEO** — fuera de scope (otro change).
- **Accesibilidad full WCAG** — solo lo mínimo que el hamburger menu exige (aria-expanded, focus trap).

---

## 3. Approach — Option C: Hybrid (inline tokens + Tailwind responsive)

### Por qué Hybrid y no las alternativas
- **Option A (todo a Tailwind)**: refactor masivo, ~2500+ líneas, alto riesgo de regresión visual desktop.
- **Option B (CSS modules / media queries puras)**: agrega un sistema paralelo a Tailwind v4 que ya está en el proyecto — duplica complejidad.
- **Option C (Hybrid)**: ataca el bloqueador estructural sin reescribir todo. Migra **solo lo layout-sensitivo** a clases Tailwind responsive y conserva inline styles para todo lo demás.

### Regla operativa
Para cada elemento con `style="..."`:

**Mover a clases Tailwind responsive** (porque cambian por viewport):
- `grid-template-columns`, `grid-template-rows`, `gap`
- `padding`, `margin` (cuando son layout, no fine-tuning)
- `font-size`, `line-height` (cuando son >24px o críticas)
- `flex-direction`, `align-items`, `justify-content` (si rotan en mobile)
- `width`, `max-width`, `min-height` (si responden al viewport)

**Mantener inline** (porque son design tokens fijos):
- `color`, `background`, `background: var(--cf-*)`
- `box-shadow`, `border-radius`, `border` (decisiones visuales)
- `transform`, `transition`, `animation`
- Valores de fine-tuning específicos por elemento (e.g. `letter-spacing: -0.02em`)

### Tipografía
Usar `clamp(min, preferred, max)` para los font-sizes grandes (>48px) y prefijos Tailwind (`text-3xl md:text-5xl lg:text-7xl`) para escalas estándar. No mezclar ambos en el mismo elemento.

### Breakpoints (Tailwind v4 defaults)
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

Diseño **mobile-first**: la clase base es mobile, los prefijos son progresión hacia desktop.

### Nav hamburger
- `<lg`: icono hamburger → drawer (sheet desde la derecha o top).
- `lg+`: nav horizontal como hoy.
- Interactividad: Astro client directive (`client:load`) o `<script>` inline mínimo — sin agregar framework.
- A11y mínimo: `aria-expanded`, `aria-controls`, `Esc` cierra, focus al primer item al abrir.

---

## 4. Delivery plan — 2 PRs encadenados

Estrategia: `feature-branch-chain` recomendada (review más enfocado, rollback más limpio). Tracker branch: `feat/responsive-mobile-tablet`.

### PR1 — `feat/responsive-nav-and-critical-type` (~400–500 líneas)
**Objetivo**: desbloquear lo más visible y crítico — navegación mobile + tipografías que rompen viewport.

Contenido:
1. **Nav hamburger menu** (`src/components/nav/Nav.astro`)
   - Hamburger icon `<lg`, nav horizontal `lg+`
   - Drawer mobile con cierre por Esc/overlay click
   - A11y mínimo (aria-expanded, focus management)
2. **Layout viewport guard** (`src/layouts/Layout.astro`)
   - Verificar/agregar `<meta name="viewport" content="width=device-width, initial-scale=1">`
   - `overflow-x: hidden` en `<body>` si es necesario como safety net
3. **Tipografías críticas con `clamp()`**
   - `ClosingCTA.astro` 88px → `clamp(2.5rem, 8vw, 5.5rem)`
   - Hero H1 de `index.astro` (96px) → clamp + responsive
   - Hero H1s de `/servicios`, `/portafolio`, `/nosotros` (60px, 56px) → responsive

**Definition of done PR1**:
- Nav funcional en mobile (probado en Chrome DevTools 375px, 768px, 1280px)
- Hero text no se desborda en `<640px`
- ClosingCTA no rompe viewport
- Desktop sin regresiones

### PR2 — `feat/responsive-grids-and-spacing` (~600–700 líneas)
**Objetivo**: completar el responsive de grids, paddings y secciones internas.

Contenido:
1. **Grid collapses**
   - Grids `repeat(4, 1fr)` → `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
   - Grids `repeat(3, 1fr)` → `grid-cols-1 md:grid-cols-3`
   - Grid asimétrico `2fr 1fr 1fr 1.5fr` → stack en mobile, restaurar en `lg+`
2. **Paddings y spacing**
   - Paddings de sección 140px/120px/110px → `py-16 md:py-24 lg:py-32` o equivalente con clamp
   - Gaps grandes (>48px) → escalar por breakpoint
3. **Absolute elements**
   - Revisar offsets negativos que rompan en mobile (clipping, overflow)
   - Reposicionar o ocultar en mobile si son decorativos
4. **Footer**
   - Grid responsive
   - Columnas colapsadas en mobile
5. **SectionHeader compartido**
   - Verificar escala y aplicar misma estrategia

**Definition of done PR2**:
- Las 4 páginas se ven correctamente en 375px, 768px, 1024px, 1440px
- Cero overflow horizontal
- Desktop pixel-perfect vs. baseline pre-cambio

### Total estimado
~1000–1200 líneas de diff entre los 2 PRs.

---

## 5. Risks

### R1 — Regresión visual en desktop
**Causa**: al mover propiedades de inline `style` a clases Tailwind, cualquier diferencia de specificity o valor puede romper el render desktop existente.
**Mitigación**:
- Snapshots visuales (screenshots) de cada página en 1440px antes de empezar.
- Migrar elemento por elemento, no en batch.
- Verificación Chrome obligatoria por Law después de cada componente.

### R2 — Hamburger menu sin framework JS
**Causa**: Astro no trae state management; implementar drawer con `<script>` inline puede tener bugs sutiles (event listeners duplicados, leak de focus).
**Mitigación**:
- Script vanilla minimalista, scope limitado al Nav.
- Test manual: open/close, Esc, click overlay, navegación con teclado.
- Si crece en complejidad → considerar `client:load` con un componente liviano (no React/Vue, solo vanilla web component).

### R3 — Specificity wars entre Tailwind v4 y inline styles
**Causa**: inline `style` siempre gana sobre clases. Si se deja una propiedad layout en ambos lados, la inline gana y el responsive no aplica.
**Mitigación**:
- Auditoría: cuando se migra una propiedad a Tailwind, **eliminarla del inline style**.
- Code review explícito: buscar `style=".*grid-template-columns"` después de PR2 — debe dar cero matches en propiedades migradas.

### R4 — `clamp()` math que se siente raro en breakpoints intermedios
**Causa**: `clamp(min, vw-based, max)` puede dar valores incómodos entre 640–1024px.
**Mitigación**:
- Testear los 4 breakpoints clave (375, 768, 1024, 1440) en cada elemento con clamp.
- Si una página se ve mal en `~800px`, ajustar la fórmula o usar prefijos discretos en vez de clamp.

---

## 6. Open questions

Ninguna bloqueante. Decisiones a tomar en `sdd-design`:
- ¿Drawer del Nav desde la derecha (estándar) o top (más impactante)?
- ¿`clamp()` global por tier (h1, h2, h3) en `global.css` o caso por caso?

---

## 7. Next steps

- `sdd-spec` — definir los requirements verificables del responsive (breakpoints, criterios de aceptación por página).
- `sdd-design` — decidir patrón del hamburger, estrategia de clamp() y mapeo exacto inline→Tailwind.
- Pueden correr en paralelo.
