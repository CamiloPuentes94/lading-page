---
name: camandre-page-seo
description: "Trigger: new page, route, meta description, canonical, Open Graph, sitemap, or robots change. Wire a page into this site's SEO contract."
license: Apache-2.0
metadata:
  author: "camandrefactory"
  version: "1.0"
---

## Activation Contract

Load before adding a route under `src/pages/`, changing any page's `<Layout>` props, or touching `sitemap.xml.ts`, `robots.txt` or `astro.config.mjs`.

## Hard Rules

- Every page MUST pass its own `description` to `Layout`. The default exists as a fallback, not a value to inherit — four pages once shipped sharing one description.
- Never hand-write `<title>`, canonical, Open Graph, Twitter or JSON-LD tags in a page. `Layout.astro` owns all of them; a page that adds its own produces duplicates.
- `src/pages/sitemap.xml.ts` lists routes by hand. A new route that is not added there is invisible to crawlers.
- Sitemap entries carry trailing slashes, matching what canonical resolves to. A mismatch splits the URL into two competing addresses.
- Dead ends and thank-you pages pass `noindex`.
- `site` in `astro.config.mjs` is what makes canonical and Open Graph absolute. Do not remove it.

## Decision Gates

| Page kind | Layout props |
|---|---|
| Indexable content page | `title`, `description`, `activePage` |
| Page with its own share image | add `ogImage` (site-root relative, 1200x630) |
| Thank-you page, dead end | add `noindex` |

| Adding | Also update |
|---|---|
| A new route | `src/pages/sitemap.xml.ts` |
| A route that must stay private | `sitemap.xml.ts` and `noindex` |

## Execution Steps

1. Write a `description` specific to the page: what it offers, not what the company is.
2. Set `activePage` so `Nav` marks the right link.
3. Register the route in `sitemap.xml.ts` with a trailing slash, or deliberately leave it out and say so.
4. Build, then confirm against `dist/`, not the build log: canonical, `og:image` and the description must be present and unique.

## Output Contract

Report the `description` written, the `Layout` props set, whether the route was added to the sitemap, and the canonical URL as it appears in the built HTML.

## References

- `src/layouts/Layout.astro` — props, canonical, Open Graph, Twitter, JSON-LD.
- `src/pages/sitemap.xml.ts` — the hand-maintained route list.
- `astro.config.mjs` — `site`, the base for every absolute URL.
