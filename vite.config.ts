import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { svelteTesting } from '@testing-library/svelte/vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			// Consult https://kit.svelte.dev/docs/integrations#preprocessors
			// for more information about preprocessors
			preprocess: vitePreprocess(),
			adapter: adapter()
		}),
		svelteTesting()
	],
	ssr: {
		noExternal: ['@icpctools/contest-api', '@icpctools/contest-ui']
	},
	optimizeDeps: {
		include: ['monaco-editor']
	},
	worker: {
		format: 'es'
	},
	server: {
		fs: {
			// Allow serving files from packages directory for module resolution
			allow: ['..']
		}
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		globals: true,
		environment: 'jsdom',
		alias: [{ find: '@testing-library/svelte', replacement: '@testing-library/svelte/svelte5' }]
	}
});
