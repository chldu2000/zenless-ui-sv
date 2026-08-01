import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import NavigationFixture from '../fixtures/NavigationFixture.svelte';

describe('navigation components SSR', () => {
	it('renders navigation content without browser globals', () => {
		const result = render(NavigationFixture);
		// Tab headers mirror the Vue implementation and register after mount.
		// The panels still need to render useful, associated SSR content.
		expect(result.body).toContain('role="tabpanel"');
		expect(result.body).toContain('aria-labelledby=');
		expect(result.body).toContain('Panel one');
		expect(result.body).toContain('role="option"');
		expect(result.body).toContain('Anby');
	});
});
