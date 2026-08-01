import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import AdvancedFixture from '../fixtures/AdvancedFixture.svelte';
import { useMessage } from '../../src/lib/message.js';

describe('advanced components SSR', () => {
	it('renders table registration and keeps imperative messages server safe', () => {
		const result = render(AdvancedFixture);
		expect(result.body).toContain('Name');
		expect(result.body).toContain('Nicole');
		expect(() => useMessage().success('saved')()).not.toThrow();
	});
});
