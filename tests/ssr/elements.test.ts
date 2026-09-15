import { describe, expect, it } from 'vitest';
import { defineAll, defineButton } from '../../packages/elements/src/index.js';

describe('elements server entry', () => {
	it('can be imported without browser globals', () => {
		expect(typeof defineButton).toBe('function');
		expect(typeof defineAll).toBe('function');
		expect('HTMLElement' in globalThis).toBe(false);
	});
});
