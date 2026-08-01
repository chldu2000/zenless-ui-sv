import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import ZenlessContextProbe from '../fixtures/ZenlessContextProbe.svelte';
import ProviderFixture from '../fixtures/ProviderFixture.svelte';
import { enUs } from '../../src/lib/locale/index.js';
import { themeStyle } from '../../src/lib/theme.js';

describe('ZenlessProvider', () => {
	it('provides locale, typography and theme configuration to descendants', () => {
		render(ProviderFixture, {
			locale: enUs,
			isBold: true,
			isItalic: false,
			theme: { name: 'light', tokens: { primary: '#123456' } }
		});

		const probe = screen.getByText('Confirm');
		expect(probe).toHaveAttribute('data-locale', 'en-US');
		expect(probe).toHaveAttribute('data-bold', 'true');
		expect(probe).toHaveAttribute('data-italic', 'false');
		expect(probe).toHaveAttribute('data-theme', 'light');
	});

	it('uses immutable defaults without a provider', () => {
		render(ZenlessContextProbe);

		expect(screen.getByText('确认')).toHaveAttribute('data-locale', 'zh-CN');
	});

	it('maps theme overrides to CSS custom properties', () => {
		expect(themeStyle({ tokens: { primary: '#123456' } })).toContain('--zenless-primary: #123456');
	});
});
