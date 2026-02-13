import { join } from 'path';
import { defineConfig } from 'vite';

const PACKAGE_ROOT = __dirname;

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
	mode: process.env.MODE,
	root: PACKAGE_ROOT,
	resolve: {
		alias: {
			'/@/': join(PACKAGE_ROOT, 'src') + '/'
		}
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

		emptyOutDir: true,
		reportCompressedSize: false
	},
	test: {
		environment: 'node',
		include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
		passWithNoTests: true
	}
});
