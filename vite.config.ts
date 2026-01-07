import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig(({ ssrBuild }) => ({
	plugins: [
		tailwindcss(),
		sveltekit(),
		// Stub got for client builds only - it's a Node.js-only package
		// and should never be bundled for the browser
		!ssrBuild && {
			name: 'stub-got-client',
			enforce: 'pre',
			resolveId(id) {
				if (id === 'got') return resolve(__dirname, 'src/lib/got-stub.ts');
			}
		}
	].filter(Boolean),
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	ssr: {
		noExternal: ['contest-api']
	}
}));
