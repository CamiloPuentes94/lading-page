// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  // Absolute base for canonical URLs, Open Graph tags and the sitemap.
  site: "https://camandrefactory.com",

  // Every route is prerendered, so the build is a folder of files and the
  // container serves them directly. No adapter, no Node process in production.
  output: "static",

  // Emit `/servicios/index.html` so the served URL keeps its trailing slash and
  // matches what the canonical tag and the sitemap already advertise.
  build: {
    format: "directory",
  },

  server: {
    host: true,
    port: 4321,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
