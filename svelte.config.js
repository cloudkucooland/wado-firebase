import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
	// Use vitePreprocess to handle TS and CSS within Svelte components
	preprocess: vitePreprocess()
};
