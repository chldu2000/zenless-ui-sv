import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const baseUrl = process.env.ZENLESS_VUE_BASE_URL ?? 'http://127.0.0.1:4174';
const outputDirectory = resolve('docs/visual/vue-baseline');
const routes = [
	['getting-started', '/getting-started'],
	['404', '/404'],
	...[
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
	].map((slug) => [slug, `/component/${slug}`])
];
const viewports = [
	['desktop', { width: 1440, height: 900 }],
	['mobile', { width: 390, height: 844 }]
];

await mkdir(outputDirectory, { recursive: true });
const browser = await chromium.launch();

try {
	for (const [viewportName, viewport] of viewports) {
		const page = await browser.newPage({ viewport });
		for (const [name, route] of routes) {
			await page.goto(`${baseUrl}/#${route}`, { waitUntil: 'networkidle' });
			await page.evaluate(() => document.fonts.ready);
			await page.screenshot({
				path: resolve(outputDirectory, `${name}-${viewportName}.png`),
				animations: 'disabled'
			});
		}
		await page.close();
	}
} finally {
	await browser.close();
}
