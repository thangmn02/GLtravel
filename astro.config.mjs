import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify";

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: "https://example.netlify.app",
  adapter: netlify(),
  output: "static",
});
