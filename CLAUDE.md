# Contexto del Proyecto — Camandre Factory Landing Page

## Stack Técnico

| Capa | Tecnología |
|------|-----------|
| Framework | Astro 5.17.1 + adapter @astrojs/node 9.5.2 (standalone SSR) |
| Estilos | Tailwind CSS 4.1.18 vía @tailwindcss/vite — **sin tailwind.config.js**, todo en global.css |
| Tipografías | @fontsource/geist-sans (400/500/600) + @fontsource/jetbrains-mono (400/500) |
| Email | resend 6.9.2 |
| Validación | zod 4.3.6 |
| Deploy | Docker multistage node:20-alpine, usuario astro:nodejs, puerto 4321 |

**Variables de entorno requeridas**: `RESEND_API_KEY`, `RESEND_AUDIENCE_ID`

## Páginas

| Ruta | Archivo | Propósito |
|------|---------|-----------|
| `/` | `src/pages/index.astro` | Home — Hero + Servicios + Portafolio featured + Proceso + Testimonial + WhyUs |
| `/servicios` | `src/pages/servicios.astro` | 4 bloques: Producto / Sistemas / Infra / Consultoría + Modelos de engagement |
| `/portafolio` | `src/pages/portafolio.astro` | 3 casos reales, filtro JS por categoría |
| `/nosotros` | `src/pages/nosotros.astro` | Origen + Timeline + Valores + Equipo (JC + YA) + Ubicaciones |
| `/gracias` | `src/pages/gracias.astro` | ⚠️ USA TOKENS VIEJOS (text-primary etc.) — no integrada con --cf-* |
| `/api/contact` | `src/pages/api/contact.ts` | POST — envía email vía Resend |
| `/api/subscribe` | `src/pages/api/subscribe.ts` | POST — agrega contacto a audiencia Resend |

## Componentes Shared

| Componente | Props clave | Notas |
|-----------|-------------|-------|
| `Button.astro` | `variant: primary\|ghost`, `size: md\|lg`, `href`, `icon: bool` | Siempre renderiza `<a>`, nunca `<button>` |
| `Eyebrow.astro` | `color?: string` | JetBrains Mono 11.5px, letter-spacing 0.18em, uppercase |
| `SectionHeader.astro` | `title`, `eyebrow?`, `lede?`, `align?: left\|center` | H2 `clamp(28px, 4.5vw, 56px)`, tiene `.cf-reveal` |
| `ClosingCTA.astro` | — | `id="contacto"`, bg navy-deep, WhatsApp + email CTAs |
| `Logo.astro` | `dark?: bool`, `size?: number` | SVG inline con ring "C" + wordmark |
| `ThemeToggle.astro` | — | Toggle `.dark` + localStorage `cf-theme` |
| `LangSwitcher.astro` | — | UI estático — ES/EN sin i18n real |
| `Nav.astro` | `activePage?: string` | Sticky blur, drawer mobile hamburger, Esc/overlay/focus management |

## Design System

**Tokens light** (`:root`): `--cf-ink` #0B132B · `--cf-navy` #0F2557 · `--cf-navy-deep` #091A3D · `--cf-brand` #0EA472 · `--cf-bg` #FAF8F3 · `--cf-paper` #FFFFFF · `--cf-rule` #E5E2D7 · `--cf-dim` #5C657A

**Dark** (`.dark`): `--cf-brand` #22C58E · `--cf-bg` #0A0F1F · `--cf-paper` #141A2E

**Tipografía**:
- H1 hero: `clamp(40-56px, 6.5-8vw, 96px)`, weight 700, letter-spacing -0.04em
- H2 secciones: `clamp(28px, 4.5vw, 56px)`, -0.03em
- ClosingCTA H2: `clamp(36px, 7vw, 88px)`, -0.04em

**Clases custom**: `.cf-reveal` (scroll fade) · `.cf-stagger` (hijos con delay) · `.cf-editor-line` (typing anim) · `.cf-marquee` · `.cf-pulse` · `.cf-btn` · `.cf-card` · `.cf-navlink`

**Dark mode**: clase `.dark` en `<html>` · script anti-FOUC en `<head>` · localStorage `cf-theme` · cross-tab sync via `storage` event

## Estado OpenSpec

| Change | Estado real | Acción pendiente |
|--------|-------------|-----------------|
| `archive/2026-05-27-rediseno-landing-page` | CLOSED ✅ | — |
| `responsive-mobile-tablet` | Implementado en commits `97239ec` + `6c2be13`, pero yaml dice `proposed` | **Archivar** |
| `rediseno-landing-page` (activo) | Spec de referencia — no es change pendiente | Revisar si archivar |

## Deuda Técnica Conocida

- `gracias.astro` usa tokens CSS del design viejo (`text-primary`, `text-muted-foreground`) — fuera del sistema `--cf-*`
- `LangSwitcher.astro` es UI decorativo — no hay i18n real
- Footer links Privacidad/Términos apuntan a `href="#"` (sin páginas reales)
- Resend `from` usa `onboarding@resend.dev` (dominio temporal) — en producción debería ser dominio verificado
- `responsive-mobile-tablet` sin archivar en OpenSpec

## Datos de Contacto en Producción

- WhatsApp CTA: `+573134212476`
- Email: `camandrefactory@gmail.com`
- Ubicación: Chía, Cundinamarca, Colombia (fundada 2024)
- Clientes en producción: Sinerlly (Sistema POS), Falcon Precision (2 apps)
