---
name: camandre-design-tokens
description: "Trigger: colour, background, font, spacing, style attribute, dark mode, or any CSS edit under src/. Apply this landing page's token contract."
license: Apache-2.0
metadata:
  author: "camandrefactory"
  version: "1.0"
---

## Activation Contract

Load before writing or editing any colour, typography, or spacing value in `src/` — including a one-line tweak to an existing `style` attribute.

## Hard Rules

- Never write a hex literal in `src/`. Every colour resolves to a `--cf-*` token declared in `src/styles/global.css`.
- Never add `font-family: 'Geist Sans'`. `body` sets it; every element inherits it.
- Never redeclare a `--cf-dark-*` token under `.dark`. Those surfaces stay navy in both themes, so inverting their contents puts dark text on a dark background.
- Prefer a bridge utility over an inline `style` carrying `var()`. `@theme inline` already exposes every token as `text-cf-*`, `bg-cf-*`, `border-cf-*`, `font-mono`, `font-sans`.
- A new token goes in `global.css` **and** the `@theme inline` block. One without the other is a token nobody can reach.

## Decision Gates

| The element sits on | Use | Example |
|---|---|---|
| A theme-reactive surface (page, card, paper) | `--cf-*` | `text-cf-dim`, `bg-cf-paper` |
| A permanently dark panel (footer, ClosingCTA, product mockups) | `--cf-dark-*` | `bg-cf-dark-surface`, `text-cf-dark-faint` |
| The brand green surface | `--cf-on-brand` | fixed in both themes |

| Label shape | Use |
|---|---|
| Section label, 11.5px, leading 16px rule | `<Eyebrow>` |
| Micro-label / caption / metric title, 9.5–11px, no rule | `font-mono uppercase text-[Npx] tracking-[Nem] text-cf-*` |

`Eyebrow` is not a generic label: it renders a leading rule. Do not reach for it to style small caption text.

## Execution Steps

1. Identify the surface the element sits on, then pick the scale from the table above.
2. Reach for an existing bridge utility. Add a token only when none fits.
3. If a value needs a contrast decision, compute the ratio before choosing — do not eyeball it.
4. Run `node_modules/.bin/astro build`. `yarn` is not installed on this machine.
5. Verify with `camandre-visual-regression` whenever the edit is meant to be pixel-neutral.

## Output Contract

Report the tokens used, any token added to both `global.css` and `@theme inline`, and every intentional pixel change with its contrast ratio before and after.

## References

- `src/styles/global.css` — token declarations and the `@theme inline` bridge.
- `.claude/skills/camandre-components/SKILL.md` — which component owns which pattern.
- `.claude/skills/camandre-visual-regression/SKILL.md` — how to prove an edit changed nothing.
