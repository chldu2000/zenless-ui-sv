import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import NavigationFixture from '../fixtures/NavigationFixture.svelte';

afterEach(cleanup);

describe('navigation and selection components', () => {
	it('supports collapse accordion and disabled behavior', async () => {
		render(NavigationFixture);
		expect(screen.getByText('First content')).toBeVisible();
		await fireEvent.click(screen.getByRole('button', { name: 'Second' }));
		expect(screen.queryByText('First content')).not.toBeInTheDocument();
		expect(screen.getByText('Second content')).toBeVisible();
		expect(screen.getByTestId('collapse-value')).toHaveTextContent('second');
		await fireEvent.click(screen.getByRole('button', { name: 'Disabled' }));
		expect(screen.getByTestId('collapse-value')).toHaveTextContent('second');
	});

	it('navigates tabs with the keyboard and unregisters dynamic panels', async () => {
		render(NavigationFixture);
		const first = screen.getByRole('tab', { name: 'One' });
		first.focus();
		await fireEvent.keyDown(first, { key: 'ArrowRight' });
		expect(screen.getByRole('tab', { name: 'Two' })).toHaveFocus();
		expect(screen.getByText('Panel two')).toBeVisible();
		expect(screen.getByTestId('tab-value')).toHaveTextContent('two');
		await fireEvent.click(screen.getByRole('button', { name: 'Toggle dynamic' }));
		expect(screen.queryByRole('tab', { name: 'Two' })).not.toBeInTheDocument();
		expect(screen.getByTestId('tab-value')).toHaveTextContent('one');
	});

	it('navigates menu items and selects enabled entries', async () => {
		render(NavigationFixture);
		const dashboard = screen.getByRole('menuitem', { name: 'Dashboard' });
		dashboard.focus();
		await fireEvent.keyDown(dashboard, { key: 'ArrowDown' });
		expect(screen.getByRole('menuitem', { name: 'Agents' })).toHaveFocus();
		await fireEvent.click(screen.getByRole('menuitem', { name: 'Agents' }));
		await fireEvent.click(screen.getByRole('menuitem', { name: 'Anby' }));
		expect(screen.getByTestId('menu-value')).toHaveTextContent('anby');
	});

	it('closes dropdown on command, outside click and Escape with focus return', async () => {
		render(NavigationFixture);
		const trigger = screen.getByRole('button', { name: 'Actions' });
		await fireEvent.click(trigger);
		expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
		await fireEvent.click(screen.getByRole('menuitem', { name: 'Edit' }));
		expect(screen.getByTestId('command')).toHaveTextContent('edit');
		expect(trigger).toHaveFocus();
		await fireEvent.click(trigger);
		await fireEvent.pointerDown(screen.getByTestId('outside'));
		expect(screen.getByRole('menuitem', { name: 'Edit', hidden: true })).not.toBeVisible();
		await fireEvent.click(trigger);
		await fireEvent.keyDown(document, { key: 'Escape' });
		expect(trigger).toHaveFocus();
	});

	it('maps option values to labels and supports keyboard, clear and dynamic removal', async () => {
		render(NavigationFixture);
		const select = screen.getByRole('combobox');
		select.focus();
		await fireEvent.keyDown(select, { key: 'ArrowDown' });
		await waitFor(() => expect(screen.getByRole('option', { name: 'Anby' })).toHaveFocus());
		await fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowDown' });
		expect(screen.getByRole('option', { name: 'Seven' })).toHaveFocus();
		await fireEvent.keyDown(document.activeElement as Element, { key: 'Enter' });
		expect(select).toHaveTextContent('Seven');
		expect(screen.getByTestId('select-value')).toHaveTextContent('7');
		expect(select).toHaveFocus();
		await fireEvent.click(screen.getByRole('button', { name: 'Clear selection' }));
		expect(select).toHaveTextContent('Choose agent');
		await fireEvent.click(screen.getByRole('button', { name: 'Toggle dynamic' }));
		await fireEvent.click(select);
		expect(screen.queryByRole('option', { name: 'Seven' })).not.toBeInTheDocument();
	});
});
