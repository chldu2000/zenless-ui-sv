import { expect, test } from '@playwright/test';

async function prepareVisualPage(page: import('@playwright/test').Page, path: string) {
	await page.goto(path);
	await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
	await page.locator('.container-event').evaluate((video: HTMLVideoElement) => {
		video.pause();
		video.currentTime = 0;
	});
	await page.addStyleTag({
		content: `
			.z-tabs__item.is-active::before,
			.z-message,
			.z-message__content {
				animation: none !important;
			}
		`
	});
	await page.waitForTimeout(1000);
}

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
		await page.setViewportSize({ width: 1440, height: 900 });
		await prepareVisualPage(page, `/components/${slug}`);
		await expect(page).toHaveScreenshot(`${slug}-desktop.png`, { animations: 'allow' });
	});
	test(`mobile visual baseline: ${slug}`, async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await prepareVisualPage(page, `/components/${slug}`);
		await expect(page).toHaveScreenshot(`${slug}-mobile.png`, { animations: 'allow' });
	});
}

for (const slug of ['modal', 'drawer', 'dropdown', 'message']) {
	test(`open overlay visual baseline: ${slug}`, async ({ page }) => {
		await prepareVisualPage(page, `/components/${slug}`);
		const label =
			slug === 'modal'
				? '打开 Modal'
				: slug === 'drawer'
					? '打开抽屉'
					: slug === 'dropdown'
						? '操作'
						: '显示消息';
		await page.getByRole('button', { name: label }).click();
		await expect(page).toHaveScreenshot(`${slug}-open.png`, { animations: 'allow' });
	});
}
