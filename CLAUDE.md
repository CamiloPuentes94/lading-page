# Contexto del Proyecto — Camandre Factory Landing Page

## Stack Técnico

> Verificado contra `package.json`, `astro.config.mjs`, el `Dockerfile` y
> `.github/workflows/docker-ci-cd.yml` el 2026-08-24.
> Si algo de acá no coincide con el repo, el repo tiene razón — corregí esta tabla.
> La fila de Verificación es la más frágil: nombra un archivo, un job y dos ramas
> que pueden cambiar sin que nadie toque este documento. Comprobala antes de confiar.

| Capa | Tecnología |
|------|-----------|
| Framework | Astro 6.3.x — `output: "static"`, **sin adapter**. Las 5 páginas se prerenderizan |
| Estilos | Tailwind CSS 4.3 vía @tailwindcss/vite — **sin tailwind.config.js**, todo en global.css |
| Tipografías | @fontsource/geist-sans (400/500/600) + @fontsource/jetbrains-mono (400/500). **Importar siempre `latin-<peso>.css`, nunca `<peso>.css`** |
| Gestor | **yarn** (`yarn.lock`, formato v1) es la fuente de verdad: CI y el `Dockerfile` corren `yarn install --frozen-lockfile`. `yarn` no está en la máquina del dev. Para **correr** scripts alcanza con `bun run <script>` — lee `package.json`, usa el `node_modules` existente y no escribe ningún lockfile — o con `node_modules/.bin/astro`. Para **instalar**, `npx --yes yarn@1.22.22 install --frozen-lockfile`. Nunca un instalador que re-resuelva el árbol (`npm install`, y por el mismo motivo `bun install` o `pnpm install` sin importar el lock) — ver Deuda Técnica |
| Verificación | `yarn typecheck` (`astro check`), `yarn build` y `yarn test`. CI los corre en ese orden en cada PR a `main`/`development`: `.github/workflows/docker-ci-cd.yml`, job `verify`. `yarn test` es `node --test` sobre `test/*.test.mjs`, sin dependencias, y afirma sobre `dist/` — necesita el build hecho |
| Build | Docker multistage: `node:22-alpine` compila → `caddy:2-alpine` sirve `dist/` en :80 |
| Proxy | Caddy al borde (`deploy/Caddyfile.edge`) — TLS, dominios, HSTS. Reemplazó a Traefik |

**Variables de entorno requeridas**: ninguna. El sitio es estático y no habla con ningún servicio externo.

## Páginas

| Ruta | Archivo | Propósito |
|------|---------|-----------|
| `/` | `src/pages/index.astro` | Home — Hero + Servicios + Portafolio featured + Proceso + Testimonial + WhyUs |
| `/servicios` | `src/pages/servicios.astro` | 4 bloques: Producto / Sistemas / Infra / Consultoría + Modelos de engagement |
| `/portafolio` | `src/pages/portafolio.astro` | 3 casos reales, filtro JS por categoría |
| `/nosotros` | `src/pages/nosotros.astro` | Origen + Timeline + Valores + Equipo (JC + YA) + Ubicaciones |
| `/gracias` | `src/pages/gracias.astro` | Usa `--cf-*` correctamente. Lleva `noindex`. Nada la enlaza |

## Componentes Shared

| Componente | Props clave | Notas |
|-----------|-------------|-------|
| `Button.astro` | `variant: primary\|ghost`, `size: md\|lg`, `href`, `icon: bool` | Siempre renderiza `<a>`, nunca `<button>` |
| `Eyebrow.astro` | `color?: string` | JetBrains Mono 11.5px, letter-spacing 0.18em, uppercase |
| `SectionHeader.astro` | `title`, `eyebrow?`, `lede?`, `align?: left\|center` | H2 `clamp(28px, 4.5vw, 56px)`, tiene `.cf-reveal` |
| `ClosingCTA.astro` | — | `id="contacto"`, bg navy-deep, WhatsApp + email CTAs |
| `Logo.astro` | `dark?: bool`, `size?: number` | SVG inline con ring "C" + wordmark |
| `ThemeToggle.astro` | — | Toggle `.dark` + localStorage `cf-theme` |
| `Nav.astro` | `activePage?: string` | Sticky blur, drawer mobile hamburger, Esc/overlay/focus management |
| `Section.astro` | `surface?: bg\|paper`, `rule?: none\|bottom\|both`, `id?`, `maxWidth?` | Banda de contenido con el ritmo estándar + container centrado |
| `PageHero.astro` | `eyebrow`, `contentWidth`, `maxWidth?`, slot `below` | Banda de apertura de páginas secundarias. El h1 y el lede van por slot |
| `MetricCard.astro` | `label`, `value`, `delta`, `spark: rise\|wave` | Tile del mockup de dashboard |

**Componentes eliminados**: `components/Footer.astro` y `components/Navbar.astro` — no los importaba nadie. Los vigentes son `footer/Footer.astro` y `nav/Nav.astro`.

## Skills del Proyecto

| Skill | Cuándo se carga |
|-------|-----------------|
| `camandre-design-tokens` | Cualquier edición de color, tipografía o espaciado en `src/` |
| `camandre-components` | Antes de agregar una sección, hero, card o página nueva |
| `camandre-visual-regression` | Antes de afirmar que un cambio no alteró la página |
| `camandre-page-seo` | Rutas nuevas, props de `Layout`, sitemap o robots |

Viven en `.claude/skills/`. Las 11 skills de OpenSpec que las acompañan son de proceso; estas cuatro son del oficio.

## Design System

**Tokens light** (`:root`): `--cf-ink` #0B132B · `--cf-navy` #0F2557 · `--cf-navy-deep` #091A3D · `--cf-brand` #0EA472 · `--cf-bg` #FAF8F3 · `--cf-paper` #FFFFFF · `--cf-rule` #E5E2D7 · `--cf-dim` #5C657A

**Dark** (`.dark`): `--cf-brand` #22C58E · `--cf-bg` #0A0F1F · `--cf-paper` #141A2E

**Tipografía**:
- H1 hero: `clamp(40-56px, 6.5-8vw, 96px)`, weight 600, letter-spacing -0.04em
- H2 secciones: `clamp(28px, 4.5vw, 56px)`, -0.03em
- ClosingCTA H2: `clamp(36px, 7vw, 88px)`, -0.04em

**Clases custom**: `.cf-reveal` (scroll fade) · `.cf-stagger` (hijos con delay) · `.cf-editor-line` (typing anim) · `.cf-marquee` · `.cf-pulse` · `.cf-btn` · `.cf-card` · `.cf-navlink`

**Dark mode**: clase `.dark` en `<html>` · script anti-FOUC en `<head>` · localStorage `cf-theme` · cross-tab sync via `storage` event

## Voz y Posicionamiento

Establecido en PR #14. Aplica a todo texto visible, `title` y `description`.

**Público: pymes.** El H1 del home es "Tu pyme **ya creció**. Tu software, no."
Los clientes reales son de ese tamaño — Sinerlly es una distribuidora de
alimentos con un POS.

**Registro del sitio: tuteo.** `tu`, `tienes`, `contratas`. Cero `usted`, cero
voseo. "Contratás" o "tenés" dentro de `src/` son defectos, no variantes.

Ojo con el alcance: **la regla gobierna `src/`, no este archivo.** El `CLAUDE.md`
está escrito en voseo a propósito porque le habla al equipo, no al visitante.
Si ves "borralo" acá y "borra eso" en un `.astro`, las dos están bien.

**Nunca califiques al lector.** El sitio decía "para empresas que toman
decisiones serias", "con ambiciones técnicas reales", "que toman su tecnología
en serio". Ese movimiento juzga antes de vender y no filtra a nadie: ninguna
empresa se auto-describe como poco seria. Aparecía cinco veces y costó una
reescritura completa. Si escribís un adjetivo que separa clientes dignos de
indignos, borralo.

**Presupuesto SEO**: títulos **57-59** caracteres, descriptions **147-159**.
Es el patrón que el sitio ya sostiene, y una página nueva fuera de esa banda
se nota. `Layout.astro` recorta el breadcrumb con `title.split("—")[0]`, así
que el formato `"Página — extra | Camandre Factory"` es seguro.

**`/portafolio/` no dice "pyme".** Hasta el PR #16 la razón era que su array
`CASES` describía los proyectos de Falcon Precision como "entidad del estado".
Esa frase ya no está y no vuelve: el sitio dejó de identificar al cliente final
a propósito, en el copy y en los comentarios del código. La razón vigente es
más simple — ninguno de los tres casos se describe como pyme. Sinerlly es una
distribuidora de alimentos con un POS, y los dos de Falcon son sistemas
internos. Etiquetar la página como cartera de pymes le pondría un rótulo que
sus propios datos no sostienen.

## Estado OpenSpec

Sin changes activos. Los cuatro están en `openspec/changes/archive/`:
`rediseno-landing-page`, `fix-hero-chip`, `responsive-mobile-tablet` y
`cicd-mejora`. Las specs vigentes viven en `openspec/specs/` — siete
capacidades, y son la referencia, no las copias delta dentro de los changes.

## Deuda Técnica Conocida

Verificada el 2026-08-24. Antes de agregar algo acá, comprobalo contra el repo:
esta lista llegó a tener tres entradas que no existían y una tarde perdida
"arreglando" `gracias.astro`, que siempre estuvo bien.

- 50 literales hexadecimales fuera de `global.css`, no 46: ese número ya estaba desactualizado antes de que nadie lo mirara — en `eea6345` ya eran 50, y ni el PR #12 ni el #16 agregaron uno. La mayoría son `#FFFFFF` sobre paneles oscuros fijos y los semáforos del mockup de macOS, que son legítimos. El grueso vive en `servicios.astro` (15) e `index.astro` (14).
- El contenido sigue siendo el techo del SEO: 2237 palabras en las cuatro páginas indexables (/ 629, /servicios/ 675, /portafolio/ 386, /nosotros/ 547), contadas sobre `dist/` excluyendo `nav`, `footer`, `header`, `script`, `style` y `svg`, y sin `/gracias`, que lleva `noindex` y no compite por nada — ese es el método, reproducilo si vas a comparar. `/portafolio/` ganó 144 palabras con el caso Sinerlly (PR #12) y aun así **sigue siendo la página más flaca**: es el mejor material del sitio y el que menos texto tiene.
- **Cero lint.** Typecheck y tests sí hay: `yarn typecheck` desde `ff233c5`, y `yarn test` desde el commit que agregó `test/seo.test.mjs`. El test cubre solo el contrato de metadata (presencia, unicidad, longitud, separador de breadcrumb) sobre las cinco páginas. No hay ninguna prueba de comportamiento del sitio: nada verifica el drawer, el toggle de tema, el filtro del portafolio ni las animaciones de scroll.
- **`npm install` rompe el build.** Ignora el `yarn.lock` y resuelve versiones frescas, armando un combo incompatible de `@tailwindcss/vite` + `vite`/`rolldown` que muere con `Missing field 'tsconfigPaths'` en `global.css`. El lockfile es funcional, no decorativo.
- **`.atl/` ya no se versiona.** Esos dos archivos se regeneran solos al invocar skills y se derivan del layout local de la máquina, así que nunca fueron reproducibles desde el repo: una regeneración borró ~20 skills solo porque cuatro directorios no existían acá. Ahora están en `.gitignore` y cada máquina genera el suyo con `gentle-ai skill-registry refresh --force`. Si los volvés a versionar, vuelve el churn en cada `git status`.
- `/gracias` no la enlaza nada desde el repo. Lleva `noindex` y está fuera del sitemap a propósito, así que puede estar viva como destino de algún link externo — averiguarlo antes de borrarla.

**Resueltas** (no volver a listarlas): tipografía Geist, compresión, tokens del design system, `LangSwitcher`, años contradictorios, drawer translúcido, destinos táctiles, `:focus-visible`, `--cf-ink-08`, links muertos del footer (b8d6c6c), migración al servidor nuevo con Caddy (PR #7), subsets de fuente no usados (83b58e2), faux-bold del H1 (335f7d6), `tools/get-resend-id.js`, los SVG del starter, y el copy que calificaba al lector (PR #14).

## Datos de Contacto en Producción

- WhatsApp CTA: `+573134212476`
- Email: `camandrefactory@gmail.com`
- Ubicación: Chía, Cundinamarca, Colombia (fundada 2024)
- Clientes en producción: Sinerlly (Sistema POS), Falcon Precision (2 apps)
