import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	base: '/wado/',
	plugins: [
		tailwindcss(),
		svelte({
			onwarn(warning, defaultHandler) {
				// Prevent a11y noise from cluttering logs if desired
				if (warning.code === 'a11y-click-events-have-key-events') return;
				defaultHandler(warning);
			}
			// Note: We no longer need to pass 'preprocess' here; 
			// it automatically picks up svelte.config.js
		})
	],
	// Vite's native way to inject variables
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
				manualChunks: {
					// Keeps the editor and heavy libs out of the initial load
					tiptap: ['@flowbite-svelte-plugins/texteditor', '@tiptap/core'],
					meili: ['meilisearch'],
					icons: ['flowbite-svelte-icons']
				}
			}
		}
	},
	esbuild: { 
		legalComments: 'none' 
	}
});
