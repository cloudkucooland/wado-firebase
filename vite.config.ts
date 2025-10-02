import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import replace from '@rollup/plugin-replace';
import sveltePreprocess from 'svelte-preprocess';

export default defineConfig({
	base: '/wado/',
	plugins: [
		tailwindcss(),
		svelte({
			onwarn(warning, defaultHandler) {
				// if (warning.code == "a11y-click-events-have-key-events") return;
				// handle all other warnings normally
				defaultHandler(warning);
			},
			preprocess: sveltePreprocess({
				// scss: {},
				typescript: {}
			})
		}),
		replace({
			__buildDate__: () => JSON.stringify(new Date()),
			preventAssignment: true,
			'process.browser': true
		})
	],
	build: {
		sourcemap: true,
		reportCompressedSize: false,
		chunkSizeWarningLimit: 2048,
		rollupOptions: {
			output: {
				manualChunks: {
					// manualChunks -- texteditor and core are probably enough, and meilisearch
					// things which are not used by the normal end-user
					tiptap: [
						'@flowbite-svelte-plugins/texteditor',
						'@tiptap/core',
						'@tiptap/extension-blockquote',
						'@tiptap/extension-bold',
						'@tiptap/extension-bullet-list',
						'@tiptap/extension-character-count',
						'@tiptap/extension-code',
						'@tiptap/extension-code-block',
						'@tiptap/extension-code-block-lowlight',
						'@tiptap/extension-color',
						'@tiptap/extension-details',
						'@tiptap/extension-document',
						'@tiptap/extension-dropcursor',
						'@tiptap/extension-emoji',
						'@tiptap/extension-file-handler',
						'@tiptap/extension-focus',
						'@tiptap/extension-font-family',
						'@tiptap/extension-gapcursor',
						'@tiptap/extension-hard-break',
						'@tiptap/extension-heading',
						'@tiptap/extension-highlight',
						'@tiptap/extension-history',
						'@tiptap/extension-horizontal-rule',
						'@tiptap/extension-image',
						'@tiptap/extension-invisible-characters',
						'@tiptap/extension-italic',
						'@tiptap/extension-link',
						'@tiptap/extension-list',
						'@tiptap/extension-list-item',
						'@tiptap/extension-list-keymap',
						'@tiptap/extension-mathematics',
						'@tiptap/extension-mention',
						'@tiptap/extension-node-range',
						'@tiptap/extension-ordered-list',
						'@tiptap/extension-paragraph',
						'@tiptap/extension-placeholder',
						'@tiptap/extension-strike',
						'@tiptap/extension-subscript',
						'@tiptap/extension-superscript',
						'@tiptap/extension-table',
						'@tiptap/extension-table-cell',
						'@tiptap/extension-table-header',
						'@tiptap/extension-table-of-contents',
						'@tiptap/extension-table-row',
						'@tiptap/extension-task-item',
						'@tiptap/extension-task-list',
						'@tiptap/extension-text',
						'@tiptap/extension-text-align',
						'@tiptap/extension-text-style',
						'@tiptap/extension-typography',
						'@tiptap/extension-underline',
						'@tiptap/extension-youtube',
						'@tiptap/extensions',
						// '@tiptap/pm',
						'@tiptap/starter-kit',
						'@tiptap/suggestion',
						'meilisearch'
					]
				}
			}
		}
	},
	rollupdedupe: ['svelte']
});

function manualChunks(id) {
	if (id.includes('tiptap')) {
		return 'tiptap';
	}

	return null;
}
