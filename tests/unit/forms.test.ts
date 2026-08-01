import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import FormFixture from '../fixtures/FormFixture.svelte';
afterEach(cleanup);
describe('form controls', () => {
	it('binds values, respects group limits and pages', async () => {
		render(FormFixture);
		const input = screen.getAllByDisplayValue('hello')[0];
		await fireEvent.input(input, { target: { value: 'world' } });
		expect(screen.getByTestId('text')).toHaveTextContent('world');
		await fireEvent.click(screen.getAllByRole('checkbox')[0]);
		expect(screen.getByTestId('toggle')).toHaveTextContent('true');
		await fireEvent.click(screen.getByLabelText('B'));
		expect(screen.getByTestId('radio')).toHaveTextContent('b');
		await fireEvent.click(screen.getByLabelText('Two'));
		expect(screen.getByTestId('checks')).toHaveTextContent('one,two');
		await fireEvent.click(screen.getByRole('button', { name: '下一页' }));
		expect(screen.getByTestId('page')).toHaveTextContent('2');
	});
});
