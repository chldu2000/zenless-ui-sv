import type { Action } from 'svelte/action';

const focusableSelector = [
	'a[href]',
	'button:not([disabled])',
	'input:not([disabled])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'[tabindex]:not([tabindex="-1"])'
].join(',');

export interface FocusTrapOptions {
	restoreFocus?: boolean;
	initialFocus?: HTMLElement | (() => HTMLElement | null);
}

export const focusTrap: Action<HTMLElement, FocusTrapOptions | undefined> = (
	node,
	options = {}
) => {
	const previousFocus =
		document.activeElement instanceof HTMLElement ? document.activeElement : null;
	const focusInitial = () => {
		const target =
			typeof options.initialFocus === 'function' ? options.initialFocus() : options.initialFocus;
		(target ?? getFocusable()[0] ?? node).focus();
	};
	const getFocusable = () => [...node.querySelectorAll<HTMLElement>(focusableSelector)];

	const onFocusIn = (event: FocusEvent) => {
		if (event.target instanceof Node && !node.contains(event.target)) {
			focusInitial();
		}
	};

	const onKeyDown = (event: KeyboardEvent) => {
		if (event.key !== 'Tab') return;
		const focusable = getFocusable();
		if (focusable.length === 0) {
			event.preventDefault();
			node.focus();
			return;
		}

		const current = document.activeElement;
		const index = focusable.indexOf(current as HTMLElement);
		if ((!event.shiftKey && index === focusable.length - 1) || (event.shiftKey && index <= 0)) {
			event.preventDefault();
			const nextFocus = event.shiftKey ? focusable[focusable.length - 1] : focusable[0];
			nextFocus?.focus();
		}
	};

	const hadTabIndex = node.hasAttribute('tabindex');
	const previousTabIndex = node.getAttribute('tabindex');
	if (!hadTabIndex) node.tabIndex = -1;
	document.addEventListener('focusin', onFocusIn);
	document.addEventListener('keydown', onKeyDown);
	queueMicrotask(focusInitial);

	return {
		destroy() {
			document.removeEventListener('focusin', onFocusIn);
			document.removeEventListener('keydown', onKeyDown);
			if (!hadTabIndex) node.removeAttribute('tabindex');
			else if (previousTabIndex !== null) node.setAttribute('tabindex', previousTabIndex);
			if (options.restoreFocus !== false && previousFocus?.isConnected) {
				previousFocus.focus();
			}
		}
	};
};
