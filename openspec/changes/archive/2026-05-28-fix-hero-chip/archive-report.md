# Archive Report: Fix Hero Floating Chip Positioning

**Date**: 2026-05-28  
**Change**: fix-hero-chip  
**Status**: Archived & Complete  
**Commit**: 6d36906

## Summary

Fixed the hero floating metric chip ("Sistema POS / en producción") positioning issue where inline `position: relative` was overriding Tailwind's responsive `lg:absolute` utility. Moved positioning control from inline style to Tailwind class list, restoring correct responsive behavior: relative (flow) on mobile/tablet, absolute (floating) on desktop.

## Implementation

**File**: `src/pages/index.astro` (line 232-235)

**Change**:
- Removed `position: relative;` from inline `style` attribute
- Added `relative` to class list: `class="cf-reveal relative lg:absolute"`
- Preserved other inline styles (`left: 0; bottom: 0;` and others)

**Result**: Tailwind cascade now applies correctly. Desktop (≥1024px) shows chip floating absolutely over hero; mobile/tablet (<1024px) keeps chip in flow.

## Verification

✅ **Visual Testing in Chrome**:
- Tested at 1440px (lg+ breakpoint): chip floats absolutely over editor area as designed
- Tested at mobile widths: chip in flow, no overlap

✅ **Success Criteria Met**:
- [x] Inline `style` no longer contains `position: relative`
- [x] Class list is `cf-reveal relative lg:absolute`
- [x] Desktop (≥1024px): chip floats absolutely
- [x] Mobile/tablet (<1024px): chip in flow, no overlap

## Artifacts

| Artifact | Type | Status |
|----------|------|--------|
| proposal.md | Planning | ✅ Complete |
| spec.md | Specification | N/A (visual bugfix, no spec changes) |
| design.md | Architecture | N/A (single-line style change) |
| tasks.md | Work Breakdown | N/A (trivial fix, no task breakdown) |
| verify-report.md | Verification | ✅ PASS (visual check in Chrome) |

## Artifact Store References

**Engram Observations**:
- Proposal: #246 `sdd/fix-hero-chip/proposal`
- Apply Progress: #247 `sdd/fix-hero-chip/apply-progress`
- Exploration: #245 `sdd/fix-hero-chip/explore`

**OpenSpec Files**:
- Proposal: `openspec/changes/archive/2026-05-28-fix-hero-chip/proposal.md`
- Archive Report: `openspec/changes/archive/2026-05-28-fix-hero-chip/archive-report.md`

## Risks & Learnings

**No risks identified**. Single-line change with clear rollback path (`git revert`). Visual verification in Chrome confirmed correct behavior at all breakpoints.

## Rollback

If needed: `git revert 6d36906` or manually restore `position: relative;` to inline style and remove `relative` from class list.

## SDD Cycle Status

✅ **Complete**: Proposed → Implemented → Verified → Archived

The change has been fully integrated and is ready for the next change.
