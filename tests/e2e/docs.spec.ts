import { expect, test } from '@playwright/test';
import { componentApiDocs } from '../../src/routes/components/component-api.js';
import { componentDocs } from '../../src/routes/components/component-meta.js';

test('renders the Vue-inspired Svelte documentation shell', async ({ page }) => {
	await page.goto('/');

	await expect(page.getByRole('heading', { level: 1 })).toHaveText('快速上手');
	await expect(page.getByRole('link', { name: 'Zenless UI Svelte 首页' })).toBeVisible();
	await expect(page.getByRole('navigation', { name: '文档导航' })).toBeVisible();
	await expect(page.getByRole('menuitem', { name: '快速上手' })).toHaveClass(/is-active/);
	await expect(page.locator('.container > .z-scrollbar.container-wrap')).toBeVisible();
	await expect(page.locator('.z-menu.side-nav')).toBeVisible();
	await expect(page.locator('.header .z-tooltip')).toHaveCount(1);
	await expect(page.locator('.header .z-button')).toHaveCount(3);
	await expect(page.locator('.header .z-link .z-button')).toHaveCount(1);
	await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(0, 0, 0)');
	await expect(page.locator('body')).toHaveCSS('color', 'rgb(255, 255, 255)');
	await expect(page.getByText('pnpm add zenless-ui-svelte')).toBeVisible();
});

test('opens and closes the responsive documentation menu', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/components/button');

	const menuButton = page.getByRole('button', { name: '菜单', exact: true });
	const navigation = page.getByRole('navigation', { name: '文档导航' });
	await expect(navigation).not.toBeInViewport();
	await menuButton.click();
	await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
	await expect(navigation).toBeInViewport();
	await expect(page.getByRole('menuitem', { name: /^Button/ })).toHaveClass(/is-active/);
	await page.keyboard.press('Escape');
	await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
});

test('renders low-risk presentation component examples', async ({ page }) => {
	await page.goto('/components');

	await expect(page.getByRole('heading', { name: '组件总览' })).toBeVisible();
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

test('publishes all component routes with concrete API metadata', async ({ page }) => {
	const documented = new Set<string>();

	for (const meta of componentDocs) {
		await page.goto(`/components/${meta.slug}`);
		await expect(page.getByRole('heading', { level: 1 })).toHaveText(meta.title);
		for (const component of meta.components) {
			const api = componentApiDocs[component];
			expect(api, `Missing API metadata for ${component}`).toBeTruthy();
			expect(
				(api.attributes?.length ?? 0) +
					(api.events?.length ?? 0) +
					(api.methods?.length ?? 0) +
					(api.snippets?.length ?? 0),
				`${component} API metadata is empty`
			).toBeGreaterThan(0);
			documented.add(component);

			if (api.attributes?.length) {
				const section = page.locator(
					`.component-api-section[data-component="${component}"][data-kind="attributes"]`
				);
				await expect(section).toBeVisible();
				await expect(section.getByRole('columnheader')).toHaveText([
					'参数',
					'说明',
					'类型',
					'可选值',
					'默认值'
				]);
				for (const attribute of api.attributes) {
					await expect(
						section.getByRole('cell', { name: attribute.name, exact: true })
					).toBeVisible();
					expect(attribute.description).not.toBe('');
					expect(attribute.type).not.toBe('');
					expect(attribute.values).not.toBe('');
					expect(attribute.default).not.toBe('');
				}
			}
		}
	}

	expect([...documented].sort()).toEqual(Object.keys(componentApiDocs).sort());
});

test('pairs every component preview with collapsible Svelte source', async ({ page }) => {
	for (const meta of componentDocs) {
		await page.goto(`/components/${meta.slug}`);
		const previews = page.locator('.component-preview');
		const toggles = page.getByRole('button', { name: '显示代码' });
		const count = await previews.count();
		expect(count, `${meta.slug} has no component previews`).toBeGreaterThan(0);
		await expect(toggles).toHaveCount(count);
		for (let index = 0; index < count; index += 1) {
			const preview = previews.nth(index);
			const toggle = preview.getByRole('button', { name: '显示代码' });
			await toggle.click();
			const closeToggle = preview.getByRole('button', { name: '隐藏代码' });
			await expect(closeToggle).toHaveAttribute('aria-expanded', 'true');
			await expect(preview.locator('.source-code-content')).toHaveClass(/is-visible/);
			await expect(preview.locator('pre code')).not.toBeEmpty();
			await closeToggle.click();
			await expect(preview.getByRole('button', { name: '显示代码' })).toHaveAttribute(
				'aria-expanded',
				'false'
			);
		}
	}
});
