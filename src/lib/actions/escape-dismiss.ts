import type { Action } from 'svelte/action';

export type EscapeDismissHandler = (event: KeyboardEvent) => void;

export const escapeDismiss: Action<HTMLElement, EscapeDismissHandler> = (_node, handler) => {
	const onKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			handler(event);
		}
	};

	document.addEventListener('keydown', onKeyDown);

	return {
		destroy() {
			document.removeEventListener('keydown', onKeyDown);
		}
	};
};
