import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],
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
