---
name: camandre-components
description: "Trigger: new section, hero, card, page, or any markup added under src/pages. Compose this landing page from its shared components."
license: Apache-2.0
metadata:
  author: "camandrefactory"
  version: "1.0"
---

## Activation Contract

Load before adding a `<section>`, a page hero, a card, a button, or a new page under `src/pages/`.

## Hard Rules

- Check `src/components/shared/` before writing markup. A hand-rolled band that duplicates `Section` is the failure mode this codebase already paid for.
- Never place non-opening content as a direct child of `.cf-stagger`. Those children inherit `animation: cfRise` and an `nth-child` delay meant for the opening sequence. Use `PageHero`'s `below` slot.
- Never fade in or delay an `h1`. It is the LCP element on every page; `global.css` exempts it from the stagger on purpose.
- `Button` always renders an `<a>`, never a `<button>`. Do not use it for form submission.
- Keep heading typography at the call site. The pages deliberately disagree on their `h1` clamp; folding that into a component is a typographic decision, not a refactor.

## Decision Gates

| Building | Use | Key props |
|---|---|---|
| Content band with the standard rhythm | `Section` | `surface`, `rule`, `id`, `maxWidth` |
| Opening band of a secondary page | `PageHero` | `eyebrow`, `contentWidth`, `maxWidth`, slot `below` |
| Eyebrow + h2 + lede group | `SectionHeader` | `title`, `eyebrow`, `lede`, `align` |
| Dashboard mockup tile | `MetricCard` | `label`, `value`, `delta`, `spark` |
| Section label with leading rule | `Eyebrow` | `color` |
| Closing contact band | `ClosingCTA` | none; owns `id="contacto"` |

Hand-write a band only when its rhythm genuinely differs — the home hero, the marquee strip and `/gracias` already do, and each says why.

## Execution Steps

1. Match the need against the table. Compose before creating.
2. If a component needs a new variant, confirm at least two real call sites want it. One caller is a prop nobody asked for.
3. Preserve existing `id` attributes — `#producto`, `#sistemas`, `#infra`, `#consultoria` are live anchor targets.
4. Build with `node_modules/.bin/astro build`, then verify per `camandre-visual-regression`.

## Output Contract

Report which shared components were composed, any new component with the duplication count that justified it, and confirmation that anchor ids and stagger membership are unchanged.

## References

- `src/components/shared/` — the component set.
- `src/styles/global.css` — `.cf-stagger`, `.cf-reveal` and the `h1` LCP exemption.
- `.claude/skills/camandre-design-tokens/SKILL.md` — colour and typography contract.
