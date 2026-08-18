/**
 * Facts about the company that appear in more than one place.
 *
 * They used to be typed by hand per page, which is how / came to claim two
 * years in the trade while /portafolio claimed one, and how the footer went on
 * advertising 2025 into 2026. Anything here is computed at build time, so a
 * deploy is enough to keep it honest.
 */
export const FOUNDED = 2024;

/** Year of the build. Every deploy refreshes it. */
export const CURRENT_YEAR = new Date().getFullYear();

/** Full years in operation, never negative. */
export const YEARS_ACTIVE = Math.max(1, CURRENT_YEAR - FOUNDED);

/** "1 año" / "2 años" — the label has to agree with the number. */
export const YEARS_ACTIVE_LABEL =
  YEARS_ACTIVE === 1 ? '1 año' : `${YEARS_ACTIVE} años`;

/** Copyright span: collapses to a single year while the site is new. */
export const COPYRIGHT_RANGE =
  CURRENT_YEAR > FOUNDED ? `${FOUNDED}–${CURRENT_YEAR}` : `${FOUNDED}`;
