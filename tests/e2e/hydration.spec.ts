import { expect, test } from '@playwright/test';

test('renders on the server and hydrates into an interactive page', async ({ page, request }) => {
	const response = await request.get('/components/switch');
	expect(response.ok()).toBe(true);
	expect(await response.text()).toContain('ZenlessSwitch');

	const runtimeErrors: Error[] = [];
	page.on('pageerror', (error) => runtimeErrors.push(error));
	await page.goto('/components/switch');

	const control = page.locator('input[role="switch"]:not([disabled])').first();
	await expect(control).toHaveAccessibleName('ON');
	await expect(control).toBeChecked();
	await control.locator('..').click();
	await expect(control).not.toBeChecked();
	await expect(control).toHaveAccessibleName('OFF');
	expect(runtimeErrors).toEqual([]);
});
