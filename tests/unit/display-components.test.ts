import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import DisplayComponentsFixture from '../fixtures/DisplayComponentsFixture.svelte';

afterEach(cleanup);

describe('display components', () => {
	it('renders the Vue-compatible presentation props and state classes', () => {
		const { container } = render(DisplayComponentsFixture);

		expect(screen.getByRole('button', { name: 'Save' })).toHaveClass(
			'z-button--primary',
			'z-button--small'
		);
		expect(container.querySelector('.z-button__icon')).toHaveClass('z-icon-check');
		expect(screen.getByRole('link', { name: 'Guide' })).toHaveAttribute('href', '/guide');
		expect(screen.getByText('Disabled link')).toHaveAttribute('aria-disabled', 'true');
		expect(container.querySelector('.z-badge--dot .z-badge__content')).toBeInTheDocument();
		expect(container.querySelector('.z-icon-home')).toHaveStyle('font-size: 24px');
		expect(container.querySelector('.z-progress__track')).toHaveStyle('width: 40%');
		expect(screen.getByRole('progressbar', { value: { now: 75 } })).toBeInTheDocument();
		expect(screen.getByTestId('card-child')).toBeInTheDocument();
		expect(screen.getByTestId('pattern')).toHaveClass('z-pattern--stripes');
	});

	it('keeps Button, Link and Tag interactions accessible', async () => {
		render(DisplayComponentsFixture);

		await fireEvent.click(screen.getByRole('button', { name: 'Save' }));
		expect(screen.getByTestId('button-clicks')).toHaveTextContent('1');

		await fireEvent.click(screen.getByText('Disabled link'));
		expect(screen.getByTestId('link-clicks')).toHaveTextContent('0');

		await fireEvent.click(screen.getByRole('button', { name: 'Close' }));
		expect(screen.getByTestId('tag-closed')).toHaveTextContent('true');
	});
});
