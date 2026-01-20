import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import tailwindcss from "@tailwindcss/vite";

import mdx from "@astrojs/mdx";

export default defineConfig({
  output: "server",
  adapter: node({ mode: "standalone" }),

  vite: {
    optimizeDeps: {
      exclude: ["@takumi-rs/image-response", "@takumi-rs/core"],
    },
    plugins: [tailwindcss()],
  },

  integrations: [mdx()],
});