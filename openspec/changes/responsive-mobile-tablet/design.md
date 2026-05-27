# Design: Responsive Mobile/Tablet — Camandre Factory

## Technical Approach

Mobile-first responsive sin reescribir todo. Tres palancas: (1) `clamp()` dentro del inline `style` para tipografías grandes — evita guerra de specificity sin tocar Tailwind; (2) migración de propiedades de layout (grid-template, gap, padding, flex-direction) del inline a clases Tailwind v4 con prefijos responsive; (3) Nav hamburger vanilla JS aislado en `<lg`. Tokens `--cf-*`, colores, sombras y radios permanecen inline. Dos PRs encadenados (feature-branch-chain) sobre `feat/responsive-mobile-tablet`.

## Architecture Decisions

### D1 — Nav hamburger: vanilla JS + drawer derecho

**Choice**: Drawer lateral derecho controlado por script `<script>` inline al final de `Nav.astro`. Botón hamburger con `aria-expanded`, `aria-controls`. Drawer es `<div>` con `transform: translateX(100%)` y clase `.is-open` que lo lleva a `0`. Overlay oscuro detrás. Cierre con Esc, click en overlay, click en link.

**Alternatives**:
- A) `<details>/<summary>` CSS-only — no controla overlay, transición pobre, sin focus trap.
- B) `<dialog>` nativo — buena semántica pero animaciones inconsistentes Safari iOS, complica overlay personalizado.
- D) Drawer desde top — más impactante visualmente pero rompe sticky header en iOS Safari (toolbar dinámica) y empuja contenido.

**Rationale**: C+derecha es el patrón B2B estándar (Stripe, Linear, Vercel). Predecible para usuarios, no compite con sticky header, transform GPU-accelerated, vanilla JS <30 líneas, sin dependencias.

### D2 — Estrategia inline vs Tailwind por propiedad

**Choice**: Tabla de migración por tipo de propiedad. Layout-sensitivas salen del inline (specificity blocker eliminado). Tokens y fine-tuning quedan inline.

| Propiedad | Destino | Razón |
|-----------|---------|-------|
| `grid-template-columns`, `grid-template-rows`, `gap` | Tailwind (`grid-cols-*`, `gap-*`) | Necesitan breakpoints |
| `padding`, `margin` de sección | Tailwind (`py-*`, `px-*`) | Necesitan breakpoints |
| `flex-direction` que rota | Tailwind (`flex-col lg:flex-row`) | Necesitan breakpoints |
| `font-size` ≥48px | Inline con `clamp()` | Evita specificity war, escala continua |
| `font-size` <48px | Tailwind (`text-sm md:text-base`) | Saltos discretos OK |
| `width`, `max-width` que cambia | Tailwind (`w-full lg:max-w-[1240px]`) | Necesitan breakpoints |
| `color`, `background`, `box-shadow`, `border-radius` | Inline | Tokens `--cf-*`, no responsive |
| `transform`, `letter-spacing` fine | Inline | Fine-tuning estable |

**Alternatives**: Tailwind `!` modifier (frágil, ensucia HTML); `<style>` block por componente (paralelo a Tailwind, duplica sistema).

**Rationale**: Ataca el bloqueador (specificity) solo donde necesita romperse. Conserva tokens centralizados. Mínima superficie de cambio.

### D3 — Tipografía: clamp() inline para ≥48px

**Choice**: Reemplazar `font-size: 88px` por `font-size: clamp(MIN, PREFERRED, MAX)`. Caso por caso, no global.

| Elemento | Original | clamp |
|----------|---------|-------|
| ClosingCTA H2 | `88px` | `clamp(36px, 7vw, 88px)` |
| servicios H1 | `96px` | `clamp(40px, 8vw, 96px)` |
| nosotros H1 | `96px` | `clamp(40px, 8vw, 96px)` |
| portafolio H1 | `60px` | `clamp(32px, 6vw, 60px)` |
| SectionHeader | `56px` | `clamp(28px, 5vw, 56px)` |

**Alternatives**: Prefijos Tailwind discretos (claros pero requieren eliminar inline → más superficie); `clamp()` global por tier en `global.css` (acopla todos los H1).

**Rationale**: `clamp()` inline es una línea por elemento, gana al Tailwind por specificity (lo cual aquí JUEGA a favor), escala suave sin saltos. Caso por caso porque cada H1 tiene su propio máximo de diseño.

### D4 — Grid collapse pattern (Tailwind v4)

**Choice**: Simplificar a columnas enteras en breakpoints, fracciones exactas solo en `lg+` via arbitrary syntax cuando son críticas.

| Original inline | Tailwind responsive |
|-----------------|---------------------|
| `repeat(4, 1fr)` | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` |
| `repeat(3, 1fr)` | `grid grid-cols-1 md:grid-cols-3` |
| `1.25fr 1fr` | `grid grid-cols-1 lg:grid-cols-[1.25fr_1fr]` |
| `2fr 1fr 1fr 1.5fr` | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.5fr]` |

**Rationale**: Columnas enteras cubren 90% de casos. Arbitrary syntax `[1.25fr_1fr]` solo cuando el diseño desktop lo exige. Mobile siempre `grid-cols-1` para evitar overflow.

### D5 — Orden de PRs por riesgo

**Choice**: PR1 = changes aislados de bajo riesgo (Nav nuevo + 4 clamps de una línea). PR2 = superficie ancha (grids + paddings en 4 páginas).

**PR1** (~400-500 líneas):
1. `Nav.astro`: hamburger drawer + script + a11y mínimo
2. `Layout.astro`: `<meta name="viewport">` confirmar + `overflow-x: hidden` guard en `<body>`
3. `ClosingCTA.astro`: `88px` → `clamp(36px, 7vw, 88px)`
4. `servicios.astro` H1: `96px` → `clamp(40px, 8vw, 96px)`
5. `nosotros.astro` H1: `96px` → `clamp(40px, 8vw, 96px)`
6. `portafolio.astro` H1: `60px` → `clamp(32px, 6vw, 60px)`
7. `SectionHeader.astro`: `56px` → `clamp(28px, 5vw, 56px)`

**PR2** (~600-700 líneas):
1. `index.astro`: grids + paddings + hero
2. `servicios.astro`: 4 service blocks + engagement models
3. `portafolio.astro`: project cards + stats
4. `nosotros.astro`: grids + paddings
5. `Footer.astro`: colapso a stack
6. Auditoría `grep "style=\".*grid-template-columns\""` → 0 hits

**Rationale**: PR1 es mergeable y reviewable independiente. Cada clamp es trivial. PR2 toca mucha superficie pero el bloqueador (Nav) ya está fuera del camino.

## Data Flow — Nav Hamburger

    Usuario click hamburger button
         │
         ▼
    JS toggle .is-open en drawer + overlay
         │
         ├─→ aria-expanded="true"
         ├─→ body.style.overflow = "hidden" (lock scroll)
         └─→ focus al primer link del drawer
              │
              ▼
         Cierre: Esc | click overlay | click link
              │
              ▼
         Reverso: quitar .is-open, restaurar focus al botón

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/components/nav/Nav.astro` | Modify | Hamburger button + drawer + overlay + `<script>` vanilla; mantiene desktop horizontal con `hidden lg:flex` |
| `src/layouts/Layout.astro` | Modify | Confirmar viewport meta; `overflow-x: clip` en `<html>` o `<body>` |
| `src/components/shared/ClosingCTA.astro` | Modify | H2 font-size → clamp |
| `src/components/shared/SectionHeader.astro` | Modify | H font-size → clamp |
| `src/components/footer/Footer.astro` | Modify | Grid → `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` |
| `src/pages/index.astro` | Modify | Grids, paddings, hero clamp |
| `src/pages/servicios.astro` | Modify | H1 clamp, 4 service blocks responsive, engagement models grid |
| `src/pages/portafolio.astro` | Modify | H1 clamp, project cards grid, stats stack |
| `src/pages/nosotros.astro` | Modify | H1 clamp, grids, paddings |
| `src/styles/global.css` | Modify (mínimo) | Solo si hace falta utility responsive; no tocar tokens `--cf-*` |

## Interfaces / Contracts

**Nav hamburger DOM contract**:

```html
<button id="cf-nav-toggle" aria-expanded="false" aria-controls="cf-nav-drawer" class="lg:hidden">
<div id="cf-nav-drawer" data-open="false" aria-hidden="true">
<div id="cf-nav-overlay" data-open="false">
```

Script lee `data-open` para CSS transitions. Sin librerías, sin frameworks.

**Tailwind v4 breakpoints en uso**: `sm:640`, `md:768`, `lg:1024`. No usar `xl` en este change.

## Testing Strategy

| Layer | What | How |
|-------|------|-----|
| Manual visual | 4 páginas en 375/768/1024/1440 | Chrome DevTools device toolbar, screenshots pre/post |
| Manual a11y Nav | Esc cierra, focus trap, aria-expanded | Teclado + VoiceOver/NVDA quick check |
| Regresión desktop | 1440px pixel-parity | Snapshots pre-cambio, comparar post-PR |
| Overflow guard | Cero scroll horizontal mobile | DevTools 375 con `document.documentElement.scrollWidth` |
| Specificity audit | Cero `style="...grid-template-columns..."` post-PR2 | `rg 'style="[^"]*grid-template-columns'` debe dar 0 |

No hay tests automatizados en el proyecto (Astro estático sin Vitest/Playwright). Verificación por Law tras cada componente.

## Migration / Rollout

No migration. Cambios CSS/markup puros. Feature branch chain: `main` ← `feat/responsive-mobile-tablet` (tracker) ← PR1 ← PR2. Rollback = revert PR. Sin feature flags.

## Open Questions

- [ ] ¿Drawer width fijo (320px) o porcentaje (80vw)? — Decisión en sdd-tasks; recomendado `min(320px, 85vw)`.
- [ ] ¿`overflow-x: clip` o `hidden` en `<html>`? — `clip` es mejor (no rompe sticky) pero menor soporte; verificar caniuse en sdd-apply.
