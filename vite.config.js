import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import replace from "@rollup/plugin-replace";
import sveltePreprocess from "svelte-preprocess";

export default defineConfig({
  base: "/wado/",
  plugins: [
    svelte({
      onwarn(warning, defaultHandler) {
        if (warning.code == "a11y-click-events-have-key-events") return;
        // handle all other warnings normally
        defaultHandler(warning);
      },
      preprocess: sveltePreprocess({
        scss: {},
      }),
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
