import { expect, test } from '@playwright/test';

test('renders the Svelte documentation skeleton', async ({ page }) => {
	await page.goto('/');

	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Zenless UI Svelte');
	await expect(
		page.getByText(
			'Provider, theme tokens, locale, actions, SSR, and consumer smoke checks are enabled.'
		)
	).toBeVisible();
});

test('renders low-risk presentation component examples', async ({ page }) => {
	await page.goto('/components');

	await expect(page.getByRole('heading', { name: '展示组件' })).toBeVisible();
	await expect(page.getByRole('button', { name: '确认' })).toBeVisible();
	await expect(page.getByRole('progressbar')).toHaveCount(2);
	await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
});

test('restores focus when the advanced modal closes with Escape', async ({ page }) => {
	await page.goto('/components');
	const trigger = page.getByRole('button', { name: '打开 Modal' });
	await trigger.click();
	await expect(page.getByRole('dialog', { name: '代理人详情' })).toBeVisible();
	await page.keyboard.press('Escape');
	await expect(page.getByRole('dialog')).toHaveCount(0);
	await expect(trigger).toBeFocused();
});
