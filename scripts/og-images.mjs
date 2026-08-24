#!/usr/bin/env node
// Rasterises the Open Graph share cards into public/.
//
//   node scripts/og-images.mjs
//
// The cards were previously a single orphan PNG with no way to regenerate it,
// so every page shared one image and nothing could be changed without opening
// a design tool. The definitions and the SVG template live in og-cards.mjs;
// this file is only the part that turns them into pixels.
//
// Typography note: sharp rasterises through librsvg, which resolves fonts from
// the system and ignores @font-face — including a base64-embedded one, verified.
// Geist and JetBrains Mono are not installed system-wide, so these cards render
// in the default sans. That matches the card already in production; do not
// promise brand type here without switching to a renderer that can load fonts.
//
// That same system-font dependency is why nothing asserts the PNGs byte-for-byte.
// This script picks "Helvetica Neue, Helvetica, Arial, sans-serif", and a Linux
// CI runner resolves that differently from a macOS laptop, so identical input
// yields different pixels on different machines. The manifest written below is
// the portable half of that guarantee: it records what the cards were rendered
// FROM, which is machine-independent, and og-cards.test.mjs fails when the
// committed manifest no longer matches the current definitions — that is, when
// someone edited the copy and forgot to re-run this script.

import { writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

import sharp from 'sharp';

import { CARDS, MANIFEST_PATH, PUBLIC_DIR, REPO_ROOT, card, inputDigest } from './og-cards.mjs';

const label = (p) => relative(REPO_ROOT, p);

for (const [name, spec] of Object.entries(CARDS)) {
  const svg = card(spec);
  const out = join(PUBLIC_DIR, `${name}.png`);
  const info = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(out);
  console.log(`  ${label(out).padEnd(28)} ${info.width}x${info.height}  ${Math.round(info.size / 1024)}KB`);
}

const manifest = {
  comment: 'Written by scripts/og-images.mjs. Do not edit by hand — re-run the script.',
  cards: Object.fromEntries(
    Object.entries(CARDS).map(([name, spec]) => [name, inputDigest(spec)])
  ),
};

writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`  ${label(MANIFEST_PATH).padEnd(28)} ${Object.keys(manifest.cards).length} cards`);
