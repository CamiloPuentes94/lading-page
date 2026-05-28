# Proposal: Fix Hero Floating Chip Positioning

## Intent

The hero floating metric chip ("Sistema POS / en producción") in `src/pages/index.astro` no longer floats absolutely on desktop. Its inline style declares `position: relative`, which has specificity 1000 and permanently overrides the Tailwind utility `lg:absolute` (specificity 10). The chip stays in document flow at all breakpoints, breaking the intended overlapping desktop layout.

Root cause: commit `97239ec` (responsive-mobile-tablet) added `position: relative` to the inline style so the chip would sit in flow on mobile — correct intent, wrong implementation (inline style beats responsive class).

## Scope

### In Scope
- `src/pages/index.astro`, line ~235: remove `position: relative;` from the inline `style` attribute of the floating chip.
- Move base positioning to the class list: `class="cf-reveal relative lg:absolute"`.

### Out of Scope
- `left: 0; bottom: 0;` inline values (kept — they only take effect once positioned).
- Any other inline styles on the chip (background, border, shadow, layout).
- Other hero elements, the terminal card, or any other page.
- Refactoring inline styles to Tailwind classes broadly.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- None (visual bug fix; no spec-level requirement changes to `landing-pages-home`)

## Approach

Replace the hardcoded `position: relative` (inline) with the Tailwind `relative` utility in the class list. Both `relative` and `lg:absolute` then live at the same specificity tier, so Tailwind's responsive cascade applies correctly: `relative` (flow) on mobile/tablet, `absolute` (floating) at `lg` and above.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/pages/index.astro` (~L232-235) | Modified | Remove inline `position: relative`; add `relative` to class list |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Chip mispositioned on desktop after fix | Low | Visual check in Chrome at `lg+` (>=1024px): chip floats over hero as designed |
| Mobile regression (chip overlaps content) | Low | Visual check at <1024px: chip stays in flow, no overlap |

## Rollback Plan

Single-line change. Revert by restoring `position: relative;` in the inline style and removing `relative` from the class list, or `git revert` the commit.

## Dependencies

- None

## Success Criteria

- [ ] Inline `style` no longer contains `position: relative`
- [ ] Class list is `cf-reveal relative lg:absolute`
- [ ] Desktop (>=1024px): chip floats absolutely over the hero
- [ ] Mobile/tablet (<1024px): chip sits in flow, no overlap

## Estimated Effort

Trivial — 1 line.
