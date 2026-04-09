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
		modulePreload: false,
		sourcemap: true,
		reportCompressedSize: false,
		chunkSizeWarningLimit: 2048,
		rollupOptions: {
			output: {
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
