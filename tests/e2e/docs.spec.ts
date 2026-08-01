import { expect, test } from '@playwright/test';

test('renders the Svelte documentation skeleton', async ({ page }) => {
	await page.goto('/');

	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Zenless UI Svelte');
	await expect(
		page.getByText('Package, type-check, test, SSR, and consumer smoke checks are enabled.')
	).toBeVisible();
});
