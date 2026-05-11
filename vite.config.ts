import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { svelteTesting } from '@testing-library/svelte/vite';
import tailwindcss from '@tailwindcss/vite';
import type { Plugin } from 'vite';

// Plugin to prevent bundling Node.js-only packages for client
function excludeNodeModules(): Plugin {
	return {
		name: 'exclude-node-modules',
		enforce: 'pre',
		resolveId(id, importer, options) {
			// Only apply to client builds (not SSR)
			if (options?.ssr) {
				return null;
			}

			// Stub got for client builds - it's Node-only and contest-api's got usage
			// is server-only (loadContest is only called from +page.server.ts)
			if (id === 'got' || id.startsWith('got/')) {
				return { id: '\0virtual:got-empty', external: false };
			}
		},
		load(id, options) {
			// Only apply to client builds (not SSR)
			if (options?.ssr) {
				return null;
			}

			// Return empty module for got and Node.js built-ins in client builds
			if (id === '\0virtual:got-empty') {
				// Export the named exports that contest-api uses
				return `
					export class HTTPError extends Error {}
					export class RequestError extends Error {}
					export default function got() { throw new Error('got is not available in browser'); }
				`;
			}
			// Prevent serving source files from packages directory as static assets
			if (
				(id.includes('/packages/contest-api/src/') || id.includes('/packages/contest-ui/src/')) &&
				!id.includes('node_modules')
			) {
				return null; // Let Vite handle it as a module
			}
		}
	};
}

export default defineConfig({
	plugins: [excludeNodeModules(), tailwindcss(), sveltekit(), svelteTesting()],
	ssr: {
		noExternal: ['@icpctools/contest-api', '@icpctools/contest-ui']
	},
	optimizeDeps: {
		exclude: ['got'],
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
