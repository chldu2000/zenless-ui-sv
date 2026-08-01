import type { Action } from 'svelte/action';

export interface PointerDragEvent {
	x: number;
	y: number;
	deltaX: number;
	deltaY: number;
	originalEvent: PointerEvent;
}

export interface PointerDragOptions {
	disabled?: boolean;
	onStart?: (event: PointerDragEvent) => void;
	onMove: (event: PointerDragEvent) => void;
	onEnd?: (event: PointerDragEvent) => void;
}

export const pointerDrag: Action<HTMLElement, PointerDragOptions> = (node, options) => {
	let currentOptions = options;
	let activePointerId: number | undefined;
	let previousX = 0;
	let previousY = 0;

	const toDragEvent = (event: PointerEvent): PointerDragEvent => {
		const nextX = event.clientX;
		const nextY = event.clientY;
		const dragEvent = {
			x: nextX,
			y: nextY,
			deltaX: nextX - previousX,
			deltaY: nextY - previousY,
			originalEvent: event
		};
		previousX = nextX;
		previousY = nextY;
		return dragEvent;
	};

	const removeWindowListeners = () => {
		window.removeEventListener('pointermove', onPointerMove);
		window.removeEventListener('pointerup', onPointerEnd);
		window.removeEventListener('pointercancel', onPointerEnd);
	};

	const onPointerMove = (event: PointerEvent) => {
		if (event.pointerId !== activePointerId) return;
		currentOptions.onMove(toDragEvent(event));
	};

	const onPointerEnd = (event: PointerEvent) => {
		if (event.pointerId !== activePointerId) return;
		currentOptions.onEnd?.(toDragEvent(event));
		activePointerId = undefined;
		removeWindowListeners();
	};

	const onPointerDown = (event: PointerEvent) => {
		if (currentOptions.disabled || event.button !== 0 || activePointerId !== undefined) return;
		activePointerId = event.pointerId;
		previousX = event.clientX;
		previousY = event.clientY;
		node.setPointerCapture?.(event.pointerId);
		currentOptions.onStart?.(toDragEvent(event));
		window.addEventListener('pointermove', onPointerMove);
		window.addEventListener('pointerup', onPointerEnd);
		window.addEventListener('pointercancel', onPointerEnd);
	};

	node.addEventListener('pointerdown', onPointerDown);

	return {
		update(nextOptions) {
			currentOptions = nextOptions;
		},
		destroy() {
			node.removeEventListener('pointerdown', onPointerDown);
			removeWindowListeners();
		}
	};
};
