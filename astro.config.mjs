import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: "https://example.netlify.app",
  adapter: netlify(),
  output: "static",
  integrations: [react(), tailwind()],
});
