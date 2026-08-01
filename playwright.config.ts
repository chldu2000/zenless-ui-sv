import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: './tests/e2e',
	snapshotPathTemplate: '{testDir}/{testFilePath}-snapshots/{arg}{ext}',
	webServer: {
		command: 'corepack pnpm run build:docs && corepack pnpm run preview -- --host 127.0.0.1',
		port: 4173,
		reuseExistingServer: !process.env.CI
	},
	use: { baseURL: 'http://127.0.0.1:4173' }
});
