import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import ProviderFixture from '../fixtures/ProviderFixture.svelte';
import { enUs, zhCn } from '../../src/lib/locale/index.js';

describe('ZenlessProvider SSR', () => {
	it('keeps independently rendered provider configurations isolated', async () => {
		const [english, chinese] = await Promise.all([
			Promise.resolve(
				render(ProviderFixture, { props: { locale: enUs, theme: { name: 'light' } } })
			),
			Promise.resolve(render(ProviderFixture, { props: { locale: zhCn, theme: { name: 'dark' } } }))
		]);

		expect(english.body).toContain('data-locale="en-US"');
		expect(english.body).toContain('data-theme="light"');
		expect(chinese.body).toContain('data-locale="zh-CN"');
		expect(chinese.body).toContain('data-theme="dark"');
	});
});
