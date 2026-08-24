// Guards the Open Graph share cards against the two ways they have drifted.
//
// These cards are the first thing a referred visitor sees — WhatsApp and
// LinkedIn render them before the page loads — and they are the one place in
// this repository where copy hides from a text search. og-default.png shipped
// "Software a medida para empresas serias." for months after that exact line
// was deleted from every .astro file, because a search over src/ cannot read a
// raster. Both tests below exist to make that class of drift visible.
//
// Deliberately no rasterisation. sharp renders through librsvg, which resolves
// fonts from the system, so identical input produces different pixels on a
// Linux CI runner than on a macOS laptop — a byte-for-byte assertion on the
// PNGs would fail in CI for a reason that has nothing to do with the cards.
// What is portable is the rendering INPUT and the PNG header, so that is what
// gets asserted. Importing only og-cards.mjs also keeps this file free of
// sharp, which is not a dependency of this project — it arrives as an optional
// dependency of astro and could leave the same way.
//
// Know what the freshness test does and does not prove. It compares a committed
// digest of each card's SVG source against the current definitions, so it
// catches the copy edit that forgot to re-run the generator. It does not read a
// single pixel, so a PNG replaced by hand or left behind by a half-finished run
// still passes. Proving the definition-to-pixels chain needs a renderer, and a
// renderer is what portability rules out.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

import { CARDS, MANIFEST_PATH, REPO_ROOT, inputDigest } from '../scripts/og-cards.mjs';

const HOME = join(REPO_ROOT, 'dist', 'index.html');

// Reads width and height straight out of the PNG IHDR chunk: an 8-byte
// signature, then a 4-byte length, "IHDR", and two big-endian uint32s.
function pngSize(file) {
  const buf = readFileSync(file);
  assert.equal(
    buf.subarray(12, 16).toString('ascii'),
    'IHDR',
    `${file} does not start with a PNG IHDR chunk`
  );
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

// The rendered H1 is compared against plain source copy, so entities have to
// come back to characters first. Without this, an &amp; or an &nbsp; anywhere
// in the heading fails the comparison with a message blaming the share card,
// which is the wrong artifact and the fastest way to teach someone to ignore
// this test. &amp; is decoded last so &amp;lt; does not decode twice.
const decodeEntities = (s) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

// This is the drift guard the reliability review asked for. The manifest is
// written by og-images.mjs at the same moment it writes the PNGs, so a stale
// manifest means the PNGs are stale too: someone edited the copy and did not
// re-run the script.
test('the committed cards were rendered from the current definitions', () => {
  assert.ok(
    existsSync(MANIFEST_PATH),
    `${MANIFEST_PATH} is missing — run \`node scripts/og-images.mjs\``,
  );

  let manifest;
  try {
    manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));
  } catch (cause) {
    assert.fail(
      `${MANIFEST_PATH} is not valid JSON (${cause.message}) — run \`node scripts/og-images.mjs\``,
    );
  }
  // Checked before dereferencing so a truncated manifest reports itself instead
  // of throwing a bare TypeError out of Object.keys.
  assert.ok(
    manifest?.cards && typeof manifest.cards === 'object' && !Array.isArray(manifest.cards),
    `${MANIFEST_PATH} has no 'cards' object — run \`node scripts/og-images.mjs\``,
  );

  assert.deepEqual(
    Object.keys(manifest.cards).sort(),
    Object.keys(CARDS).sort(),
    `${MANIFEST_PATH} does not cover the same cards as CARDS — run \`node scripts/og-images.mjs\``,
  );

  for (const [name, spec] of Object.entries(CARDS)) {
    assert.equal(
      manifest.cards[name],
      inputDigest(spec),
      `public/${name}.png is stale: its copy changed since it was last rendered — run \`node scripts/og-images.mjs\``,
    );
  }
});

// The drift that actually shipped. The home card is the page's own H1, so if
// the H1 moves and the card does not, this fails rather than waiting for
// someone to notice it in a WhatsApp preview.
test('the home card headline matches the rendered home H1', () => {
  assert.ok(
    existsSync(HOME),
    `${HOME} is missing — run \`yarn build\` before \`yarn test\``,
  );
  const headings = [...readFileSync(HOME, 'utf8').matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)];
  assert.equal(headings.length, 1, `${HOME} emitted ${headings.length} h1 elements`);

  // Tags first, then entities, then whitespace: decoding before stripping would
  // turn an escaped &lt;b&gt; into something the tag regex then eats.
  const rendered = decodeEntities(headings[0][1].replace(/<[^>]*>/g, ''))
    .replace(/\s+/g, ' ')
    .trim();

  assert.equal(
    rendered,
    CARDS['og-default'].lines.join(' '),
    'og-default.png no longer says what the home page says',
  );
});

test('every card is a 1200x630 PNG', () => {
  for (const name of Object.keys(CARDS)) {
    const file = join(REPO_ROOT, 'public', `${name}.png`);
    assert.ok(existsSync(file), `${file} is missing — run \`node scripts/og-images.mjs\``);
    assert.deepEqual(pngSize(file), { width: 1200, height: 630 }, `${file} is not 1200x630`);
  }
});
