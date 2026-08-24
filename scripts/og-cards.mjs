// The Open Graph card definitions and the SVG template they render through.
//
// Split out of og-images.mjs so this half can be imported without pulling in
// sharp. sharp is not a dependency of this project — it arrives as an optional
// dependency of astro — and a test that has to import a rasteriser to read a
// string of copy would be one astro release away from failing for a reason
// that has nothing to do with the cards.
//
// Everything here is deterministic and platform-independent: it produces SVG
// source, not pixels. The rasterisation, which is neither of those things,
// stays in og-images.mjs.

import { createHash } from 'node:crypto';

export const W = 1200;
export const H = 630;

// Sampled from the card already live in public/og-default.png.
const BRAND = '#22C58E';
const GRADIENT_FROM = '#0D3549';
const GRADIENT_TO = '#091A3D';
const DIM = '#9BA3BC';

/** Rough advance width per character for the default bold sans, in em. */
const EM_RATIO = 0.56;
const MAX_TEXT_WIDTH = W - 180;

/** Shrink the headline until its longest line fits the safe area. */
export function headlineSize(lines) {
  const longest = Math.max(...lines.map((l) => l.length));
  for (const size of [76, 70, 64, 58, 52]) {
    if (longest * size * EM_RATIO <= MAX_TEXT_WIDTH) return size;
  }
  return 52;
}

const MARK = `
  <g transform="translate(90 88) scale(1.5)">
    <path d="M 32 11 A 14 14 0 1 0 32 29" fill="none" stroke="#FFFFFF" stroke-width="3.8" stroke-linecap="round"/>
    <path d="M14.5 27 L20 13 L25.5 27 M16.6 22.5 L23.4 22.5" stroke="${BRAND}" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M22.5 22.5 L31 30.6 L27.8 31.1 L29.6 34.3 L27.6 35.4 L25.8 32.2 L23.4 33.6 Z" fill="${BRAND}" stroke="#FFFFFF" stroke-width="0.8" stroke-linejoin="round"/>
  </g>`;

const escape = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function card({ lines, footer }) {
  const size = headlineSize(lines);
  const lead = Math.round(size * 1.18);
  const firstBaseline = 330;

  const headline = lines
    .map(
      (text, i) =>
        `<text x="90" y="${firstBaseline + i * lead}" font-size="${size}" font-weight="700" fill="${
          i === 0 ? '#FFFFFF' : BRAND
        }" letter-spacing="-2">${escape(text)}</text>`
    )
    .join('\n    ');

  // librsvg falls back to serif when no family is named, so pin it explicitly.
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" font-family="Helvetica Neue, Helvetica, Arial, sans-serif">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${GRADIENT_FROM}"/>
        <stop offset="1" stop-color="${GRADIENT_TO}"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <rect width="${W}" height="6" fill="${BRAND}"/>
    ${MARK}
    <text x="186" y="127" font-size="30" font-weight="700" fill="#FFFFFF" letter-spacing="1.2">CAMANDRE</text>
    <text x="188" y="158" font-size="15" font-weight="500" fill="${BRAND}" letter-spacing="6">FACTORY</text>
    ${headline}
    <rect x="90" y="486" width="68" height="3" fill="${BRAND}"/>
    <text x="90" y="545" font-size="19" font-weight="500" fill="${DIM}" letter-spacing="3.4">${escape(footer)}</text>
  </svg>`;
}

export const MANIFEST_PATH = 'scripts/og-images.manifest.json';

/**
 * Digest of a card's complete rendering input — the SVG source, before any
 * rasteriser touches it. Machine-independent by construction, which the pixels
 * are not, so this is what the committed manifest records.
 */
export const inputDigest = (spec) =>
  `sha256:${createHash('sha256').update(card(spec), 'utf8').digest('hex')}`;

// The card for `/` is the one a referred visitor sees before the page itself,
// so its headline is the home H1 verbatim. og-cards.test.mjs holds that to the
// rendered <h1> in dist/, because the previous drift here shipped a card whose
// copy had been deleted from the site months earlier.
export const CARDS = {
  'og-default': {
    lines: ['Tu operación ya creció.', 'Tu software, no.'],
    footer: 'EST. 2024 · CHÍA · COLOMBIA',
  },
  'og-servicios': {
    lines: ['Diseño, ingeniería', 'e infraestructura.'],
    footer: 'SERVICIOS · 4 DISCIPLINAS',
  },
  'og-portafolio': {
    lines: ['Sistemas en producción.', 'Métricas reales.'],
    footer: 'PORTAFOLIO · 3 PROYECTOS EN PRODUCCIÓN',
  },
  'og-nosotros': {
    lines: ['Una fábrica pequeña.', 'Decisiones grandes.'],
    footer: 'NOSOTROS · CHÍA, COLOMBIA',
  },
};
