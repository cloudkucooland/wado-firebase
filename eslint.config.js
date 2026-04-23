import js from '@eslint/js';
import sveltePlugin from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
	js.configs.recommended,
	...sveltePlugin.configs['flat/recommended'],
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: tsParser
			},
			globals: {
				...globals.browser,
				...globals.node,
				firebase: 'readonly',
				chrome: 'readonly'
			}
		},
		rules: {
			'indent': ['error', 2],
			'linebreak-style': ['error', 'unix'],
			'quotes': ['error', 'single'],
			'semi': ['error', 'always'],
			'curly': ['error', 'all'],
			'no-console': 'off',
			'no-unused-vars': 'off'
		}
	},
	{
		files: ['**/*.ts', '**/*.js'],
		languageOptions: {
			parser: tsParser,
			globals: {
				...globals.browser,
				...globals.node,
				firebase: 'readonly'
			}
		},
		rules: {
			'indent': ['error', 2],
			'linebreak-style': ['error', 'unix'],
			'quotes': ['error', 'single'],
			'semi': ['error', 'always'],
			'no-unused-vars': 'off'
		}
	}
];
