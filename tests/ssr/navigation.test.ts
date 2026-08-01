import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import NavigationFixture from '../fixtures/NavigationFixture.svelte';

describe('navigation components SSR', () => {
	it('renders registered tabs and options without browser globals', () => {
		const result = render(NavigationFixture);
		expect(result.body).toContain('role="tab"');
		expect(result.body).toContain('One');
		expect(result.body).toContain('role="option"');
		expect(result.body).toContain('Anby');
	});
});
