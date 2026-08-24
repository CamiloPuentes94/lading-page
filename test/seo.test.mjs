// Smoke assertions over the built HTML.
//
// `astro check` resolves props and imports but knows nothing about what the
// rendered <head> ends up containing, so until this file existed the metadata
// contract was held up entirely by someone measuring it by hand. These run
// against dist/, which means `yarn build` has to come first.
//
// Deliberately narrow: presence, uniqueness and length. The strings themselves
// are editorial and change often; asserting them here would turn every copy
// edit into a test edit and the suite would be deleted within a month.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

// Budget from the Voz y Posicionamiento section of CLAUDE.md. The upper bounds
// are what search results truncate at; the lower bound on titles catches a page
// shipped with a bare brand name and nothing else.
const TITLE_MAX = 60;
const TITLE_MIN = 20;
const DESCRIPTION_MAX = 160;
const DESCRIPTION_MIN = 50;

// `/gracias` is a noindex dead end. It still has to emit both tags — a missing
// title renders as a URL in a browser tab — but it is exempt from the length
// budget, which exists to protect search results it never appears in.
const PAGES = [
  { route: "/", file: "dist/index.html", indexable: true },
  { route: "/servicios/", file: "dist/servicios/index.html", indexable: true },
  { route: "/portafolio/", file: "dist/portafolio/index.html", indexable: true },
  { route: "/nosotros/", file: "dist/nosotros/index.html", indexable: true },
  { route: "/gracias/", file: "dist/gracias/index.html", indexable: false },
];

const TITLE = /<title>([\s\S]*?)<\/title>/g;
const DESCRIPTION = /<meta\s+name="description"\s+content="([\s\S]*?)"/g;

function html(page) {
  assert.ok(
    existsSync(page.file),
    `${page.file} is missing — run \`yarn build\` before \`yarn test\``,
  );
  return readFileSync(page.file, "utf8");
}

// Returns every match, not the first, so a page that somehow emits two titles
// fails loudly instead of silently passing on the one that happens to be first.
function matchAll(source, pattern) {
  return [...source.matchAll(pattern)].map((m) => m[1].trim());
}

test("every page emits exactly one non-empty title", () => {
  for (const page of PAGES) {
    const titles = matchAll(html(page), TITLE);
    assert.equal(titles.length, 1, `${page.route} emitted ${titles.length} titles`);
    assert.notEqual(titles[0], "", `${page.route} has an empty title`);
  }
});

test("every page emits exactly one non-empty meta description", () => {
  for (const page of PAGES) {
    const descriptions = matchAll(html(page), DESCRIPTION);
    assert.equal(
      descriptions.length,
      1,
      `${page.route} emitted ${descriptions.length} meta descriptions`,
    );
    assert.notEqual(descriptions[0], "", `${page.route} has an empty description`);
  }
});

// Layout.astro carries a fallback description. Four pages once shipped sharing
// it, which is the failure this guards: a page that forgets its own prop
// inherits the default and reads as a duplicate to a crawler.
test("titles and descriptions are unique across pages", () => {
  for (const [label, pattern] of [
    ["title", TITLE],
    ["description", DESCRIPTION],
  ]) {
    const seen = new Map();
    for (const page of PAGES) {
      const value = matchAll(html(page), pattern)[0];
      const previous = seen.get(value);
      assert.equal(
        previous,
        undefined,
        `${page.route} and ${previous} share the same ${label}: ${value}`,
      );
      seen.set(value, page.route);
    }
  }
});

test("indexable pages stay inside the length budget", () => {
  for (const page of PAGES.filter((p) => p.indexable)) {
    const source = html(page);
    const title = matchAll(source, TITLE)[0];
    const description = matchAll(source, DESCRIPTION)[0];

    assert.ok(
      title.length >= TITLE_MIN && title.length <= TITLE_MAX,
      `${page.route} title is ${title.length} chars, outside ${TITLE_MIN}-${TITLE_MAX}: ${title}`,
    );
    assert.ok(
      description.length >= DESCRIPTION_MIN && description.length <= DESCRIPTION_MAX,
      `${page.route} description is ${description.length} chars, outside ${DESCRIPTION_MIN}-${DESCRIPTION_MAX}`,
    );
  }
});

// Layout derives the breadcrumb leaf as `title.split("—")[0]`, so a secondary
// page whose title loses the em dash silently gets the whole title as its
// breadcrumb name. The home page emits no BreadcrumbList at all.
test("secondary pages keep a breadcrumb-safe title separator", () => {
  for (const page of PAGES.filter((p) => p.indexable && p.route !== "/")) {
    const title = matchAll(html(page), TITLE)[0];
    assert.ok(title.includes("—"), `${page.route} title has no em dash: ${title}`);

    const leaf = title.split("—")[0].trim();
    assert.ok(leaf.length > 0, `${page.route} title starts with the em dash`);
    assert.ok(
      html(page).includes(`"position":2,"name":"${leaf}"`),
      `${page.route} breadcrumb leaf is not "${leaf}"`,
    );
  }
});
