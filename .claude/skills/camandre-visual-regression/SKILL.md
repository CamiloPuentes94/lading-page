---
name: camandre-visual-regression
description: "Trigger: refactor, token migration, component extraction, or any claim that a change is pixel-neutral. Prove it with a computed-style A/B snapshot."
license: Apache-2.0
metadata:
  author: "camandrefactory"
  version: "1.0"
---

## Activation Contract

Load before claiming a change did not alter the rendered page — refactors, token swaps, component extractions, markup moves. Skip only when the change is intentionally visual and unverified output is acceptable.

## Hard Rules

- A green build proves nothing. `astro build` printed `Complete!` for months while the site rendered in system-ui because the font family name was wrong.
- Snapshot the baseline **before the first edit**. Copy `dist/` to the scratchpad; without it there is nothing to compare against.
- Pin the theme inside each iframe before measuring. `Layout.astro` runs an anti-FOUC script that reads `localStorage` and `prefers-color-scheme`, so two builds can render in different themes and produce hundreds of phantom differences.
- Compare **both** themes. A pass in one theme does not cover tokens that invert.
- Serve both builds from one origin. Different ports are different origins and `contentDocument` is blocked.
- Computed style does not prove an `id`, an anchor, or an attribute survived. Verify those separately against the built HTML.

## Decision Gates

| Risk in the change | Add these fields to the snapshot |
|---|---|
| Colour or token swap | `color`, `backgroundColor`, `borderColor` |
| Markup rewritten as classes | `padding`, `margin`, `borderRadius`, `fontWeight`, `letterSpacing` |
| Elements moved between parents | `opacity`, `animationName`, `animationDelay` |
| Layout or container change | bounding box `width`, `height`, `top`, `left` |

## Execution Steps

1. Before editing: `node_modules/.bin/astro build`, then copy `dist/` into the scratchpad as the baseline.
2. After editing, rebuild and assemble the comparison tree with `assets/build-compare.sh`: one root holding `before/`, `after/` and a **merged** `_astro/`. Astro's content hashes differ between builds, so both asset sets coexist without collision.
3. Serve that root on a single port with `python3 -m http.server`.
4. Open the served page in Chrome and run `assets/snapshot.js`, which walks every element of all five pages in both themes and buckets the differences by signature.
5. Classify every bucket. An unexplained bucket is a regression until proven otherwise.

## Output Contract

Report the total difference count, the element count compared, and one line per bucket stating whether it is intended and why. State the theme coverage explicitly. Never report a pass without the numbers.

## References

- `assets/build-compare.sh` — assembles the same-origin before/after tree.
- `assets/snapshot.js` — the in-page snapshot and diff classifier.
