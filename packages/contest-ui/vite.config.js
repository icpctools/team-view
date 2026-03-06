import { join } from 'path';
import * as path from 'path';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { svelteTesting } from '@testing-library/svelte/vite';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import tailwindcss from '@tailwindcss/vite';

let filename = fileURLToPath(import.meta.url);
const PACKAGE_ROOT = path.dirname(filename);

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
	mode: process.env.MODE,
	root: PACKAGE_ROOT,
	resolve: {
		alias: {
			'/@/': join(PACKAGE_ROOT, 'src') + '/',
			...(process.env.VITEST && {
				'mode-watcher': join(PACKAGE_ROOT, 'src/lib/__mocks__/mode-watcher.ts')
			})
		}
	},
	plugins: [tailwindcss(), svelte({ configFile: '../../svelte.config.js', hot: !process.env.VITEST }), svelteTesting()],
	test: {
		include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		globals: true,
		environment: 'jsdom',
		alias: [{ find: '@testing-library/svelte', replacement: '@testing-library/svelte/svelte5' }]
	},
	base: '',
	server: {
		fs: {
			strict: true
		}
	},
	build: {
		sourcemap: true,
		outDir: 'dist',
		assetsDir: '.',
		lib: {
			entry: 'src/lib/index.ts',
			formats: ['es']
		},

		emptyOutDir: true,
		reportCompressedSize: false
	}
});
