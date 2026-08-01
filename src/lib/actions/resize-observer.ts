import type { Action } from 'svelte/action';

export type ResizeHandler = (entries: ResizeObserverEntry[]) => void;

export const resizeObserver: Action<HTMLElement, ResizeHandler> = (node, handler) => {
	const ResizeObserverConstructor = globalThis.ResizeObserver as typeof ResizeObserver | undefined;
	if (ResizeObserverConstructor) {
		const observer = new ResizeObserverConstructor((entries) => handler(entries));
		observer.observe(node);

		return { destroy: () => observer.disconnect() };
	}

	const onResize = () => handler([]);
	const currentWindow: Window = window;
	currentWindow.addEventListener('resize', onResize);
	return { destroy: () => currentWindow.removeEventListener('resize', onResize) };
};
