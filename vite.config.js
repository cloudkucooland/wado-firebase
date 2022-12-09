import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import replace from "@rollup/plugin-replace";

export default defineConfig({
  base: "/wado/",
  plugins: [
    svelte({
      onwarn(warning, defaultHandler) {
        if (warning.code == "a11y-click-events-have-key-events") return;
        // handle all other warnings normally
        defaultHandler(warning);
      },
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
