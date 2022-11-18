import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { dependencies } from "./package.json";
import replace from "@rollup/plugin-replace";

export default defineConfig({
  base: "/wado/",
  plugins: [
    svelte({
      /* plugin options */
    }),
    replace({
      __buildDate__: () => JSON.stringify(new Date())
    }),
  ],
  build: {
    sourcemap: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 2048,
    rollupOptions: {
      output: {},
    },
  },
});
