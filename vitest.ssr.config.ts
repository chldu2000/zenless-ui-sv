import { defineConfig } from 'vitest/config';
import adapter from '@sveltejs/adapter-auto';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit({ compilerOptions: { runes: true }, adapter: adapter() })],
	test: {
		environment: 'node',
		include: ['tests/ssr/**/*.{test,spec}.ts']
	}
});
