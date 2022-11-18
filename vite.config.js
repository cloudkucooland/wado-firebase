import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { dependencies } from "./package.json";
import { chunkSplitPlugin } from "vite-plugin-chunk-split";

export default defineConfig({
  base: "/wado/",
  plugins: [
    svelte({
      /* plugin options */
    }),
    chunkSplitPlugin({
      strategy: "single-vendor",
      customSplitting: {
        ckeditor: ["ckeditor5-svelte"],
      },
    }),
  ],
  build: {
    sourcemap: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 2048,
    rollupOptions: {
      output: {
        manualChunks: {},
      },
    },
  },
});
