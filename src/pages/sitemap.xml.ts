import type { APIRoute } from 'astro';

export const prerender = true;

/**
 * Hand-rolled sitemap instead of @astrojs/sitemap: the site has four indexable
 * routes, all known at build time, and this avoids adding a dependency.
 * `/gracias` is excluded on purpose — it is noindex.
 *
 * Add new public routes here when they ship.
 */
/* Trailing slashes are required: Astro emits `/servicios/index.html`, so the
 * canonical tag resolves to `/servicios/`. A sitemap entry without the slash
 * would advertise a second, different URL for the same page. */
const ROUTES = ['/', '/servicios/', '/portafolio/', '/nosotros/'];

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    throw new Error('`site` must be set in astro.config.mjs to build the sitemap.');
  }

  const urls = ROUTES.map(
    (route) => `  <url><loc>${new URL(route, site).href}</loc></url>`
  ).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
