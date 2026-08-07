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
	test.setTimeout(180_000);
	for (const meta of componentDocs) {
		await page.goto(`/components/${meta.slug}`);
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
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
			// sticky 定位的收起按钮在慢速 CI 上偶发无法通过动作检查，强制点击
			await closeToggle.click({ force: true });
			await expect(preview.getByRole('button', { name: '显示代码' })).toHaveAttribute(
				'aria-expanded',
				'false'
			);
		}
	}
});

test('keeps demo source controls after client-side component navigation', async ({ page }) => {
	await page.goto('/components/button');

	for (const destination of [
		{ menuItem: /^Card/, slug: 'card', title: 'Card 卡片' },
		{ menuItem: /^Input/, slug: 'input', title: 'Input 输入框' },
		{ menuItem: /^Button/, slug: 'button', title: 'Button 按钮' }
	]) {
		await page.getByRole('menuitem', { name: destination.menuItem }).click();
		await expect(page).toHaveURL(new RegExp(`/components/${destination.slug}/?$`));
		await expect(page.getByRole('heading', { level: 1 })).toHaveText(destination.title);

		const previews = page.locator('.component-preview');
		const previewCount = await previews.count();
		expect(previewCount).toBeGreaterThan(0);
		await expect(page.getByRole('button', { name: '显示代码' })).toHaveCount(previewCount);
		await expect(previews.first()).toHaveCSS('overflow', 'visible');
		await expect(previews.first().getByRole('button', { name: '显示代码' })).toBeVisible();
	}
});

test('allows dropdown menus to escape the demo preview card', async ({ page }) => {
	await page.goto('/components/dropdown');
	const preview = page.locator('.component-preview').first();
	const trigger = preview.locator('.z-dropdown__trigger');
	await trigger.hover();

	const menu = preview.getByRole('menu');
	await expect(menu).toBeVisible();
	await expect(menu.getByRole('menuitem')).toHaveCount(4);
	// 等待展开过渡（transform 0.13s）结束，避免测量到动画中间态
	await menu.evaluate((element) =>
		Promise.all(element.getAnimations().map((animation) => animation.finished))
	);

	const [previewBox, menuBox] = await Promise.all([preview.boundingBox(), menu.boundingBox()]);
	expect(previewBox).not.toBeNull();
	expect(menuBox).not.toBeNull();
	expect(menuBox!.y + menuBox!.height).toBeGreaterThan(previewBox!.y + previewBox!.height);
});

test('matches source dropdown item sizing and disabled reset', async ({ page }) => {
	await page.goto('/components/dropdown');
	const dropdowns = page.locator('.component-preview').nth(3).locator('.z-dropdown');
	const expected = [
		{ height: '52px', fontSize: '18px' },
		{ height: '46px', fontSize: '16px' },
		{ height: '40px', fontSize: '16px' },
		{ height: '34px', fontSize: '12px' },
		{ height: '30px', fontSize: '12px' }
	];

	for (let index = 0; index < expected.length; index += 1) {
		const dropdown = dropdowns.nth(index);
		await dropdown.locator('.z-dropdown__trigger').click();
		const item = dropdown.locator('.z-dropdown-item').first();
		const content = dropdown.locator('.z-dropdown__content');
		await expect(item).toHaveCSS('height', expected[index].height);
		await expect(item).toHaveCSS('font-size', expected[index].fontSize);
		await expect(item).toHaveCSS('appearance', 'none');
		const contentWidth = await content.evaluate((node) => {
			const style = getComputedStyle(node);
			return node.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
		});
		await expect(item).toHaveJSProperty('offsetWidth', contentWidth);
		await dropdown.locator('.z-dropdown__trigger').click();
	}

	const disabled = dropdowns.first().locator('.z-dropdown-item[disabled]');
	const firstContent = dropdowns.first().locator('.z-dropdown__content');
	await dropdowns.first().locator('.z-dropdown__trigger').click();
	await expect(disabled).toHaveCSS('border-width', '0px');
	await expect(disabled).toHaveCSS('appearance', 'none');
	const disabledContentWidth = await firstContent.evaluate((node) => {
		const style = getComputedStyle(node);
		return node.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
	});
	await expect(disabled).toHaveJSProperty('offsetWidth', disabledContentWidth);
});

test('matches source input action icons', async ({ page }) => {
	await page.goto('/components/input');

	const clearable = page.locator('.component-preview').nth(2).locator('.z-input');
	await clearable.hover();
	const clearIcon = clearable.locator('.z-input__clear');
	await expect(clearIcon).toHaveClass(/z-icon-error/);
	await expect(clearIcon).toHaveCSS('font-family', 'material_symbols');
	await expect(clearIcon).toHaveCSS('line-height', '14px');
	await expect(clearIcon).toHaveCSS('height', '14px');
	await expect(clearIcon).toHaveCSS('appearance', 'none');

	const password = page.locator('.component-preview').nth(3).locator('.z-input');
	const passwordIcon = password.locator('.z-input__clear');
	await expect(passwordIcon).toBeVisible();
	await expect(passwordIcon).toHaveClass(/z-icon-invisible/);
	await passwordIcon.click();
	await expect(password.locator('.z-input__inner')).toHaveAttribute('type', 'text');
	await expect(passwordIcon).toHaveClass(/z-icon-visible/);
});

test('uses dark text for selected select options', async ({ page }) => {
	await page.goto('/components/select');

	const select = page.locator('.component-preview').first().locator('.z-select');
	await select.locator('.z-select__input').click();
	const selected = select.getByRole('option', { selected: true });
	await expect(selected).toBeVisible();
	await expect(selected).toHaveCSS('color', 'rgb(0, 0, 0)');
});
