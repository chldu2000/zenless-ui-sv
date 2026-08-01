import type { Action } from 'svelte/action';

export type PortalTarget =
	HTMLElement | string | (() => HTMLElement | null | undefined) | null | undefined;

function resolveTarget(target: PortalTarget): HTMLElement | null {
	if (typeof target === 'function') return target() ?? null;
	if (typeof target === 'string') return document.querySelector<HTMLElement>(target);
	return target ?? document.body;
}

export const portal: Action<HTMLElement, PortalTarget> = (node, target) => {
	const originParent = node.parentNode;
	const placeholder = document.createComment('zenless-portal');
	originParent?.insertBefore(placeholder, node);
	resolveTarget(target)?.appendChild(node);

	return {
		destroy() {
			if (placeholder.parentNode) {
				placeholder.parentNode.insertBefore(node, placeholder);
				placeholder.remove();
			}
		}
	};
};
