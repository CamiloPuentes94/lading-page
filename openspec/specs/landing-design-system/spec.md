# Spec: landing-design-system

Change: investor-grade redesign of the Camandre Factory public site.
All domains below are NEW (no prior stable specs to delta against).

## Domain: landing-design-system

### Requirement: Color tokens

The system MUST expose all brand colors as CSS custom properties on `:root` (light) and `:root[data-cf-theme="dark"]` (dark). No hex value SHALL be hardcoded inside component files.

| Token | Light | Dark |
|---|---|---|
| `--cf-ink` | `#0B132B` | `#F1F4FB` |
| `--cf-navy` | `#0F2557` | `#1E3A8A` |
| `--cf-navy-deep` | `#091A3D` | `#040814` |
| `--cf-brand` | `#0EA472` | `#22C58E` |
| `--cf-brand-sel` | `rgba(14,164,114,0.10)` | `rgba(34,197,142,0.12)` |
| `--cf-bg` | `#FAF8F3` | `#0A0F1F` |
| `--cf-bg2` | `#F2EFE7` | `#0F1528` |
| `--cf-paper` | `#FFFFFF` | `#141A2E` |
| `--cf-rule` | `#E5E2D7` | `#1F2747` |
| `--cf-text` | `#1A2236` | `#C7CDE0` |
| `--cf-dim` | `#5C657A` | `#7C849C` |
| `--cf-faded-navy` | `#E4E7F0` | `#2A3050` |
| `--cf-nav-bg` | `rgba(250,248,243,0.85)` | `rgba(10,15,31,0.82)` |

#### Scenario: Tokens present at first paint (light)
- GIVEN the page loads with no prior `cf-theme` in localStorage
- WHEN the browser parses `global.css`
- THEN `--cf-bg` resolves to `#FAF8F3` and `--cf-brand` to `#0EA472`

#### Scenario: Tokens switch on dark mode
- GIVEN `data-cf-theme="dark"` is set on `<html>`
- WHEN any element references `var(--cf-bg)`
- THEN the resolved value is `#0A0F1F`

### Requirement: Typography scale

The system MUST load Geist (display + body) and JetBrains Mono (eyebrows, code, labels) via `@fontsource` packages. `font-family: 'Geist', system-ui, sans-serif` MUST be set on `body`. No Google Fonts remote requests SHALL occur.

| Use | Font | Weight | Letter-spacing |
|---|---|---|---|
| H1 hero | Geist | 600 | `-0.04em` |
| H2 section | Geist | 600 | `-0.03em` to `-0.035em` |
| Body | Geist | 400–500 | default |
| Eyebrow | JetBrains Mono | 500 | `0.18em` |
| Code editor | JetBrains Mono | 400 | default |
| Stats label | JetBrains Mono | 400–600 | `0.06em–0.12em` |

#### Scenario: Font loads without FOIT
- GIVEN the fonts are self-hosted via `@fontsource`
- WHEN the page renders
- THEN `font-display: swap` is active and body text shows immediately in system-ui fallback while Geist loads

### Requirement: Animation classes

The system MUST define the following CSS animation classes in `global.css`:

| Class | Behavior |
|---|---|
| `.cf-reveal` | `opacity:0; transform:translateY(14px)` → animated to visible when `[data-cf-in="1"]` is set |
| `.cf-stagger > *` | children animate in sequence (delays: 0.05s, 0.15s, 0.28s, 0.42s, 0.55s, 0.68s) via `cfRise` keyframe |
| `.cf-editor-line` | `opacity:0; transform:translateX(-6px)` → `cfType` keyframe, delay per line index |
| `.cf-marquee` | `animation: cfMarquee 38s linear infinite` — scrolls content leftward |
| `.cf-caret` | `cfBlink 1s steps(1) infinite` — blinking cursor block |
| `.cf-pulse::before` | `cfPulse 1.8s ease-out infinite` — expanding ring around live dot |
| `.cf-btn` | `transition: transform .2s, box-shadow .2s` — `translateY(-1px)` on hover |
| `.cf-card` | `transition: transform .3s, box-shadow .3s, border-color .3s` — `translateY(-4px)` on hover |
| `.cf-navlink::after` | underline grows from 0 to 100% width on hover / `[data-active="1"]` |

#### Scenario: Reduced motion respected
- GIVEN `prefers-reduced-motion: reduce` is active in the OS
- WHEN any `.cf-reveal`, `.cf-stagger`, or `.cf-marquee` element is rendered
- THEN the animation is disabled or replaced with an instant show (no transform/opacity transition)

#### Scenario: Reveal triggers on scroll
- GIVEN a `.cf-reveal` element is in the DOM below the fold
- WHEN the element enters the viewport (threshold 5%, rootMargin "-10% 0px")
- THEN `data-cf-in="1"` is set and the element becomes visible via CSS transition
