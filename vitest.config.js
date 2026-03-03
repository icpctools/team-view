import { configDefaults, defineConfig } from 'vitest/config';

/**
 * vitest projects configuration for unit tests
 */
export default defineConfig({
	test: {
		projects: ['packages/**/vite.config.{js,ts}'],
		// use GitHub action reporters when running in CI
		reporters: process.env.CI ? [['junit', { includeConsoleOutput: false }], 'default'] : ['default'],

		exclude: [...configDefaults.exclude, '**/dist/**', '**/.{cache,git,output,temp,cdix}/**', '**/*.cdix/**']
	}
});
