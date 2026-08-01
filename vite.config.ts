import { defineConfig } from 'vitest/config';
import adapter from '@sveltejs/adapter-auto';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter()
		})
	],
	preview: { host: '127.0.0.1' },
	test: {
		environment: 'jsdom',
		include: ['tests/unit/**/*.{test,spec}.ts'],
		setupFiles: ['./tests/setup.ts'],
		clearMocks: true,
		restoreMocks: true
	},
	resolve: process.env.VITEST ? { conditions: ['browser'] } : undefined
});
