import type { Action } from 'svelte/action';

export type PortalTarget =
	HTMLElement | string | (() => HTMLElement | null | undefined) | null | undefined;

function resolveTarget(target: PortalTarget): HTMLElement | null {
	if (typeof target === 'function') return target() ?? null;
	if (typeof target === 'string') return document.querySelector<HTMLElement>(target);
	return target ?? document.body;
}

export const portal: Action<HTMLElement, PortalTarget> = (node, target) => {
	const placeholder = document.createComment('zenless-portal');
	node.parentNode?.insertBefore(placeholder, node);
	resolveTarget(target)?.appendChild(node);

	return {
		update(nextTarget) {
			resolveTarget(nextTarget)?.appendChild(node);
		},
		destroy() {
			node.remove();
			placeholder.remove();
		}
	};
};
