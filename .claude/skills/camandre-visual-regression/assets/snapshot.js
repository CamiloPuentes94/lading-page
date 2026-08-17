// Paste into the Chrome console on http://localhost:<port>/after/ once
// build-compare.sh is serving. Walks every element of all five pages in both
// themes and buckets the before/after differences by signature.
//
// Both sides load as same-origin iframes, which is the only reason
// contentDocument is reachable. The theme is pinned after load because
// Layout.astro's anti-FOUC script would otherwise let the two builds render
// in different themes and report hundreds of phantom differences.
(async () => {
  const PAGES = ['', 'servicios/', 'portafolio/', 'nosotros/', 'gracias/'];

  const FIELDS = [
    'tag', 'id', 'font', 'size', 'weight', 'tracking', 'leading', 'transform',
    'align', 'color', 'bg', 'bgimg', 'bcolor', 'bwidth', 'bstyle', 'pad', 'mar',
    'radius', 'opacity', 'anim', 'delay', 'pevents', 'display', 'position',
    'w', 'h', 'top', 'left',
  ];

  async function snap(url, dark) {
    const f = document.createElement('iframe');
    f.style.cssText = 'position:fixed;left:-9999px;width:1280px;height:900px';
    f.src = url;
    document.body.appendChild(f);
    await new Promise((r) => (f.onload = r));
    const d = f.contentDocument;
    const w = f.contentWindow;
    d.documentElement.classList.toggle('dark', dark);
    await new Promise((r) => setTimeout(r, 300));
    const out = [];
    d.body.querySelectorAll('*').forEach((el) => {
      const c = w.getComputedStyle(el);
      const r = el.getBoundingClientRect();
      out.push([
        el.tagName, el.id, c.fontFamily, c.fontSize, c.fontWeight,
        c.letterSpacing, c.lineHeight, c.textTransform, c.textAlign, c.color,
        c.backgroundColor, c.backgroundImage.slice(0, 100), c.borderColor,
        c.borderWidth, c.borderStyle, c.padding, c.margin, c.borderRadius,
        c.opacity, c.animationName, c.animationDelay, c.pointerEvents,
        c.display, c.position,
        Math.round(r.width), Math.round(r.height),
        Math.round(r.top), Math.round(r.left),
      ].join('|'));
    });
    f.remove();
    return out;
  }

  const report = [];
  for (const dark of [false, true]) {
    const buckets = {};
    let total = 0;
    const mismatched = [];
    for (const p of PAGES) {
      const a = await snap('/before/' + p, dark);
      const b = await snap('/after/' + p, dark);
      if (a.length !== b.length) {
        mismatched.push(`${p || '/'} ${a.length}!=${b.length}`);
        continue;
      }
      for (let i = 0; i < a.length; i++) {
        if (a[i] === b[i]) continue;
        total++;
        const pa = a[i].split('|');
        const pb = b[i].split('|');
        const sig = FIELDS
          .map((f, k) => (pa[k] !== pb[k] ? `${f}: ${pa[k]} -> ${pb[k]}` : null))
          .filter(Boolean)
          .join(' , ');
        buckets[sig] = (buckets[sig] || 0) + 1;
      }
    }
    report.push(
      `===== ${dark ? 'DARK' : 'LIGHT'} =====\n` +
      `element-count mismatches: ${mismatched.length ? mismatched.join(', ') : 'none'}\n` +
      `TOTAL DIFFERENCES: ${total}\n` +
      Object.entries(buckets)
        .sort((x, y) => y[1] - x[1])
        .map(([k, v]) => `${String(v).padStart(4)}x  ${k.slice(0, 240)}`)
        .join('\n')
    );
  }
  return report.join('\n\n');
})();
