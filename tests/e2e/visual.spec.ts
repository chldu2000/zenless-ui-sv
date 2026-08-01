import { expect, test } from '@playwright/test';

const slugs = [
	'backtop',
	'badge',
	'button',
	'card',
	'checkbox',
	'collapse',
	'drawer',
	'dropdown',
	'form',
	'icon',
	'input',
	'link',
	'menu',
	'message',
	'modal',
	'pagination',
	'pattern',
	'progress',
	'radio',
	'scrollbar',
	'select',
	'slider',
	'switch',
	'table',
	'tabs',
	'tag',
	'textarea',
	'tooltip'
];

for (const slug of slugs) {
	test(`desktop visual baseline: ${slug}`, async ({ page }) => {
		await page.setViewportSize({ width: 1280, height: 800 });
		await page.goto(`/components/${slug}`);
		await expect(page).toHaveScreenshot(`${slug}-desktop.png`, { fullPage: true });
	});
	test(`mobile visual baseline: ${slug}`, async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await page.goto(`/components/${slug}`);
		await expect(page).toHaveScreenshot(`${slug}-mobile.png`, { fullPage: true });
	});
}

for (const slug of ['modal', 'drawer', 'dropdown', 'message']) {
	test(`open overlay visual baseline: ${slug}`, async ({ page }) => {
		await page.goto(`/components/${slug}`);
		const label =
			slug === 'modal'
				? '打开 Modal'
				: slug === 'drawer'
					? '打开抽屉'
					: slug === 'dropdown'
						? '操作'
						: '显示消息';
		await page.getByRole('button', { name: label }).click();
		await expect(page).toHaveScreenshot(`${slug}-open.png`, { fullPage: true });
	});
}
