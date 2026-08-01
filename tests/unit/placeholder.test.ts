import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import ZenlessPlaceholder from '../../src/lib/ZenlessPlaceholder.svelte';

describe('ZenlessPlaceholder', () => {
	it('marks its library root', () => {
		const { container } = render(ZenlessPlaceholder);

		expect(container.firstElementChild).toHaveAttribute('data-library', 'zenless-ui-svelte');
	});
});
