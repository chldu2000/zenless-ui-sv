import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import AdvancedFixture from '../fixtures/AdvancedFixture.svelte';
import MessageFixture from '../fixtures/MessageFixture.svelte';
import ZenlessBacktop from '../../src/lib/ZenlessBacktop.svelte';

function pointerEvent(type: string, values: Partial<PointerEvent> = {}): PointerEvent {
	return Object.assign(new Event(type, { bubbles: true }), {
		button: 0,
		pointerId: 1,
		clientX: 0,
		clientY: 0,
		...values
	}) as PointerEvent;
}

afterEach(cleanup);
describe('advanced components', () => {
	it('traps and restores modal focus and closes with Escape', async () => {
		render(AdvancedFixture);
		const opener = screen.getByRole('button', { name: 'Open dialog' });
		opener.focus();
		await fireEvent.click(opener);
		expect(screen.getByRole('dialog', { name: 'Agent' })).toBeVisible();
		expect(document.body.style.overflow).toBe('hidden');
		await fireEvent.keyDown(document, { key: 'Escape' });
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		expect(opener).toHaveFocus();
		expect(document.body.style.overflow).toBe('');
	});

	it('supports slider keyboard values', async () => {
		render(AdvancedFixture);
		const slider = screen.getByRole('slider');
		await fireEvent.keyDown(slider, { key: 'ArrowRight' });
		expect(screen.getByTestId('slider-value')).toHaveTextContent('30');
		await fireEvent.keyDown(slider, { key: 'End' });
		expect(screen.getByTestId('slider-value')).toHaveTextContent('100');
	});

	it('uses pointer events for slider and scrollbar dragging', async () => {
		const { container } = render(AdvancedFixture);
		const rail = container.querySelector<HTMLElement>('.z-slider__rail')!;
		vi.spyOn(rail, 'getBoundingClientRect').mockReturnValue({
			left: 0,
			top: 0,
			width: 100,
			height: 6,
			right: 100,
			bottom: 6,
			x: 0,
			y: 0,
			toJSON: () => ({})
		});
		const slider = screen.getByRole('slider');
		slider.dispatchEvent(pointerEvent('pointerdown', { clientX: 20 }));
		window.dispatchEvent(pointerEvent('pointermove', { clientX: 60 }));
		window.dispatchEvent(pointerEvent('pointerup', { clientX: 60 }));
		await waitFor(() => expect(screen.getByTestId('slider-value')).toHaveTextContent('60'));

		const wrap = container.querySelector<HTMLElement>('.z-scrollbar__wrap')!;
		Object.defineProperties(wrap, { clientWidth: { value: 100 }, scrollWidth: { value: 1000 } });
		vi.spyOn(wrap, 'getBoundingClientRect').mockReturnValue({
			left: 0,
			top: 0,
			width: 100,
			height: 100,
			right: 100,
			bottom: 100,
			x: 0,
			y: 0,
			toJSON: () => ({})
		});
		screen
			.getByRole('button', { name: 'Horizontal scrollbar' })
			.dispatchEvent(pointerEvent('pointerdown', { clientX: 50 }));
		expect(wrap.scrollLeft).toBe(500);
	});

	it('observes a custom Backtop target and scrolls it to zero', async () => {
		const target = document.body.appendChild(document.createElement('div'));
		const scrollTo = vi.fn();
		target.scrollTo = scrollTo;
		render(ZenlessBacktop, { props: { target, visibleHeight: 10 } });
		target.scrollTop = 20;
		await fireEvent.scroll(target);
		await fireEvent.click(screen.getByRole('button', { name: 'Back to top' }));
		expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
	});

	it('registers and unregisters table columns dynamically', async () => {
		render(AdvancedFixture);
		expect(screen.getByRole('columnheader', { name: 'Role' })).toBeVisible();
		expect(screen.getByRole('cell', { name: 'Support' })).toBeVisible();
		await fireEvent.click(screen.getByRole('button', { name: 'Toggle column' }));
		expect(screen.queryByRole('columnheader', { name: 'Role' })).not.toBeInTheDocument();
		expect(screen.queryByRole('cell', { name: 'Support' })).not.toBeInTheDocument();
	});

	it('queues concurrent messages through MessageHost', async () => {
		render(MessageFixture);
		await fireEvent.click(screen.getByRole('button', { name: 'Notify saved' }));
		await fireEvent.click(screen.getByRole('button', { name: 'Notify warning' }));
		expect(screen.getAllByRole('status')).toHaveLength(2);
		expect(screen.getByText('Saved')).toBeVisible();
		expect(screen.getByText('Careful')).toBeVisible();
	});
});
