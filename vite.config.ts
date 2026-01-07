import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import tailwindcss from '@tailwindcss/vite';
import type { Plugin } from 'vite';

// Plugin to prevent bundling Node.js-only packages for client
function excludeNodeModules(): Plugin {
	return {
		name: 'exclude-node-modules',
		enforce: 'pre',
		resolveId(id, importer) {
			// Don't resolve Node.js-only packages for client builds
			if (
				id === 'got' ||
				id.startsWith('got/') ||
				['events', 'stream', 'tls', 'url', 'assert', 'util', 'http', 'https', 'net'].includes(id) ||
				id.startsWith('node:')
			) {
				// For client builds, return a virtual empty module
				return { id: '\0virtual:got-empty', external: false };
			}
		},
		load(id) {
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
			if (id.includes('/packages/contest-api/src/') && !id.includes('node_modules')) {
				return null; // Let Vite handle it as a module
			}
		}
	};
}

export default defineConfig({
	plugins: [excludeNodeModules(), tailwindcss(), sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	ssr: {
		noExternal: ['contest-api']
	},
	optimizeDeps: {
		exclude: ['got']
	},
	server: {
		fs: {
			// Allow serving files from packages directory for module resolution
			allow: ['..']
		}
	}
});
