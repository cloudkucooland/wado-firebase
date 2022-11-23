import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import replace from "@rollup/plugin-replace";

export default defineConfig({
  base: "/wado/",
  plugins: [
    svelte({
      /* plugin options */
    }),
    replace({
      __buildDate__: () => JSON.stringify(new Date()),
      preventAssignment: true,
      "process.browser": true,
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
