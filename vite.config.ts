import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	base: '/wado/',
	plugins: [
		tailwindcss(),
		svelte({
			onwarn(warning, defaultHandler) {
				if (warning.code === 'a11y-click-events-have-key-events') return;
				defaultHandler(warning);
			}
		})
	],
	define: {
		__buildDate__: JSON.stringify(new Date().toISOString()),
		'process.browser': true
	},
	build: {
		sourcemap: true,
		reportCompressedSize: false,
		chunkSizeWarningLimit: 2048,
		rollupOptions: {
			output: {
				// Vite 6 / Rolldown expects a function here when doing custom splitting
				manualChunks(id) {
					if (id.includes('@tiptap') || id.includes('texteditor')) {
						return 'tiptap';
					}
					if (id.includes('meilisearch')) {
						return 'meili';
					}
					if (id.includes('flowbite-svelte-icons')) {
						return 'icons';
					}
				}
			}
		}
	},
	esbuild: {
		legalComments: 'none'
	}
});
