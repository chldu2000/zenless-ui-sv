import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/elements-test');
	await page.waitForFunction(() => customElements.get('z-button'));
});

test('upgrades declarative buttons and exposes an open shadow root', async ({ page }) => {
	const primary = page.getByTestId('primary');
	await expect(primary).toHaveJSProperty('type', 'primary');
	await expect(primary).toHaveJSProperty('size', 'large');
	await expect(primary).toHaveJSProperty('plain', true);
	await expect(primary.locator('button')).toHaveAttribute('part', 'button');
	await expect(primary.locator('button')).toContainText('Primary');
});

test('boolean attributes follow HTML presence semantics and disabled blocks clicks', async ({
	page
}) => {
	const disabled = page.getByTestId('disabled');
	await disabled.evaluate((element) => element.setAttribute('disabled', 'false'));
	await expect(disabled).toHaveJSProperty('disabled', true);
	await expect(disabled.locator('button')).toBeDisabled();

	let clicks = 0;
	await page.exposeFunction('recordButtonClick', () => {
		clicks += 1;
	});
	await disabled.evaluate((element) =>
		element.addEventListener('click', () => void window.recordButtonClick())
	);
	await disabled.evaluate((element) => (element as HTMLElement).click());
	await expect.poll(() => clicks).toBe(0);
});

test('property changes update the internal control without emitting synthetic events', async ({
	page
}) => {
	const button = page.getByTestId('default');
	await button.evaluate((element) => {
		const target = element as HTMLElement & { type: string; loading: boolean };
		target.type = 'danger';
		target.loading = true;
	});
	await expect(button).toHaveJSProperty('type', 'danger');
	await expect(button).toHaveAttribute('loading', '');
	await expect(button.locator('button')).toBeDisabled();
});

test('submit and reset native types act on the associated form', async ({ page }) => {
	await page.getByTestId('submit').click();
	await expect(page.getByTestId('counts')).toHaveText('1:0');
	await page.getByTestId('reset').click();
	await expect(page.getByTestId('counts')).toHaveText('1:1');
});

declare global {
	interface Window {
		recordButtonClick(): void;
	}
}
