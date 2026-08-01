import { expect, test } from '@playwright/test';

test('renders on the server and hydrates into an interactive page', async ({ page, request }) => {
	const response = await request.get('/components/switch');
	expect(response.ok()).toBe(true);
	expect(await response.text()).toContain('ZenlessSwitch');

	const runtimeErrors: Error[] = [];
	page.on('pageerror', (error) => runtimeErrors.push(error));
	await page.goto('/components/switch');

	const control = page.getByRole('switch', { name: 'ON' });
	await expect(control).toBeChecked();
	await page.getByText('ON', { exact: true }).click();
	await expect(page.getByRole('switch', { name: 'OFF' })).not.toBeChecked();
	expect(runtimeErrors).toEqual([]);
});
