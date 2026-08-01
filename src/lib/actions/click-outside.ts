import type { Action } from 'svelte/action';

export type ClickOutsideHandler = (event: PointerEvent) => void;

export const clickOutside: Action<HTMLElement, ClickOutsideHandler> = (node, handler) => {
	const onPointerDown = (event: PointerEvent) => {
		if (event.target instanceof Node && !node.contains(event.target)) {
			handler(event);
		}
	};

	document.addEventListener('pointerdown', onPointerDown, true);

	return {
		destroy() {
			document.removeEventListener('pointerdown', onPointerDown, true);
		}
	};
};
