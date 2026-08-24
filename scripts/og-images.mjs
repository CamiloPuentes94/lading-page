#!/usr/bin/env node
// Generates the Open Graph share cards in public/.
//
//   node scripts/og-images.mjs
//
// The cards were previously a single orphan PNG with no way to regenerate it,
// so every page shared one image and nothing could be changed without opening
// a design tool.
//
// Typography note: sharp rasterises through librsvg, which resolves fonts from
// the system and ignores @font-face — including a base64-embedded one, verified.
// Geist and JetBrains Mono are not installed system-wide, so these cards render
// in the default sans. That matches the card already in production; do not
// promise brand type here without switching to a renderer that can load fonts.

import sharp from 'sharp';

const W = 1200;
const H = 630;

// Sampled from the card already live in public/og-default.png.
const BRAND = '#22C58E';
const GRADIENT_FROM = '#0D3549';
const GRADIENT_TO = '#091A3D';
const DIM = '#9BA3BC';

/** Rough advance width per character for the default bold sans, in em. */
const EM_RATIO = 0.56;
const MAX_TEXT_WIDTH = W - 180;

/** Shrink the headline until its longest line fits the safe area. */
function headlineSize(lines) {
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

function card({ lines, footer }) {
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

const CARDS = {
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

for (const [name, spec] of Object.entries(CARDS)) {
  const svg = card(spec);
  const out = `public/${name}.png`;
  const info = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(out);
  console.log(`  ${out.padEnd(28)} ${info.width}x${info.height}  ${Math.round(info.size / 1024)}KB`);
}
