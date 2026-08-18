#!/usr/bin/env bash
# Assemble a same-origin before/after tree and serve it.
#
# Usage:  build-compare.sh <baseline-dist-client> [port]
#
# The built pages reference their assets from the site root, so the two builds
# cannot simply be nested under before/ and after/ — their /_astro/ links would
# not resolve. Astro fingerprints those filenames, and the hashes differ between
# builds, so a single merged _astro/ at the root serves both sets at once.
set -euo pipefail

BASE="${1:?path to the baseline dist}"
PORT="${2:-4403}"
OUT="$(mktemp -d)/compare"
CUR="dist"

[ -d "$CUR" ] || { echo "run astro build first: $CUR is missing" >&2; exit 1; }

mkdir -p "$OUT/_astro"
cp "$BASE/_astro/"* "$OUT/_astro/"
cp "$CUR/_astro/"*  "$OUT/_astro/"
cp "$BASE"/*.svg "$BASE"/*.png "$OUT/" 2>/dev/null || true

for side in before after; do
  src=$([ "$side" = before ] && echo "$BASE" || echo "$CUR")
  mkdir -p "$OUT/$side"
  for page in index gracias nosotros portafolio servicios; do
    if [ "$page" = index ]; then
      cp "$src/index.html" "$OUT/$side/index.html"
    else
      mkdir -p "$OUT/$side/$page"
      cp "$src/$page/index.html" "$OUT/$side/$page/index.html"
    fi
  done
done

pkill -f "http.server $PORT" 2>/dev/null || true
(python3 -m http.server "$PORT" --directory "$OUT" >/dev/null 2>&1 &)
sleep 1
echo "serving $OUT on http://localhost:$PORT"
echo "  before -> http://localhost:$PORT/before/"
echo "  after  -> http://localhost:$PORT/after/"
