import { afterEach, describe, expect, it, vi } from 'vitest';
import { clickOutside } from '../../src/lib/actions/click-outside.js';
import { escapeDismiss } from '../../src/lib/actions/escape-dismiss.js';
import { focusTrap } from '../../src/lib/actions/focus-trap.js';
import { pointerDrag } from '../../src/lib/actions/pointer-drag.js';
import { portal } from '../../src/lib/actions/portal.js';
import { resizeObserver } from '../../src/lib/actions/resize-observer.js';
import { lockBodyScroll } from '../../src/lib/internal/scroll-lock.js';

function pointerEvent(type: string, values: Partial<PointerEvent> = {}): PointerEvent {
	return Object.assign(new Event(type, { bubbles: true }), {
		button: 0,
		pointerId: 1,
		clientX: 0,
		clientY: 0,
		...values
	}) as PointerEvent;
}

afterEach(() => {
	document.body.replaceChildren();
	document.body.style.cssText = '';
});

describe('DOM actions', () => {
	it('calls clickOutside only for events outside the node and removes its listener', () => {
		const node = document.body.appendChild(document.createElement('div'));
		const inside = node.appendChild(document.createElement('button'));
		const handler = vi.fn();
		const action = clickOutside(node, handler);

		inside.dispatchEvent(pointerEvent('pointerdown'));
		document.body.dispatchEvent(pointerEvent('pointerdown'));
		expect(handler).toHaveBeenCalledTimes(1);

		if (action) action.destroy?.();
		document.body.dispatchEvent(pointerEvent('pointerdown'));
		expect(handler).toHaveBeenCalledTimes(1);
	});

	it('removes escape dismiss listeners when destroyed', () => {
		const handler = vi.fn();
		const action = escapeDismiss(document.body, handler);

		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
		expect(handler).toHaveBeenCalledTimes(1);
		if (action) action.destroy?.();
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
		expect(handler).toHaveBeenCalledTimes(1);
	});

	it('disconnects the ResizeObserver when destroyed', () => {
		const disconnect = vi.fn();
		const observe = vi.fn();
		const OriginalResizeObserver = window.ResizeObserver;
		window.ResizeObserver = class {
			observe = observe;
			disconnect = disconnect;
			unobserve = vi.fn();
			takeRecords = vi.fn(() => []);
		} as unknown as typeof ResizeObserver;

		const action = resizeObserver(document.body, vi.fn());
		expect(observe).toHaveBeenCalledWith(document.body);
		if (action) action.destroy?.();
		expect(disconnect).toHaveBeenCalledOnce();
		window.ResizeObserver = OriginalResizeObserver;
	});

	it('cleans pointer drag window listeners after an interaction', () => {
		const node = document.body.appendChild(document.createElement('div'));
		const onMove = vi.fn();
		const onEnd = vi.fn();
		const action = pointerDrag(node, { onMove, onEnd });

		node.dispatchEvent(pointerEvent('pointerdown', { clientX: 10, clientY: 20 }));
		window.dispatchEvent(pointerEvent('pointermove', { clientX: 15, clientY: 25 }));
		window.dispatchEvent(pointerEvent('pointerup', { clientX: 20, clientY: 30 }));
		window.dispatchEvent(pointerEvent('pointermove', { clientX: 25, clientY: 35 }));

		expect(onMove).toHaveBeenCalledTimes(1);
		expect(onEnd).toHaveBeenCalledOnce();
		if (action) action.destroy?.();
	});

	it('traps tab focus and restores the prior focus on teardown', async () => {
		const trigger = document.body.appendChild(document.createElement('button'));
		trigger.focus();
		const node = document.body.appendChild(document.createElement('div'));
		const first = node.appendChild(document.createElement('button'));
		const last = node.appendChild(document.createElement('button'));
		const action = focusTrap(node);

		await Promise.resolve();
		last.focus();
		last.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
		expect(document.activeElement).toBe(first);

		if (action) action.destroy?.();
		expect(document.activeElement).toBe(trigger);
	});

	it('moves portalled content and restores it on teardown', () => {
		const origin = document.body.appendChild(document.createElement('div'));
		const target = document.body.appendChild(document.createElement('div'));
		const node = origin.appendChild(document.createElement('div'));
		const action = portal(node, target);

		expect(target).toContainElement(node);
		if (action) action.destroy?.();
		expect(origin).toContainElement(node);
	});

	it('reference-counts body scroll locks', () => {
		const firstRelease = lockBodyScroll();
		const secondRelease = lockBodyScroll();
		expect(document.body.style.overflow).toBe('hidden');
		firstRelease();
		expect(document.body.style.overflow).toBe('hidden');
		secondRelease();
		expect(document.body.style.overflow).toBe('');
	});
});
