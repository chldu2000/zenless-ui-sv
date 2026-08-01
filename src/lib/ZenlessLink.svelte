<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import { getZenlessContext } from './context.js';
	import type { ZenlessColor } from './types.js';

	interface Props extends Omit<HTMLAnchorAttributes, 'onclick'> {
		children?: Snippet;
		type?: ZenlessColor;
		icon?: string;
		highlight?: boolean;
		underline?: boolean;
		disabled?: boolean;
		onclick?: (event: MouseEvent) => void;
	}

	let {
		children,
		type = 'default',
		icon: _icon,
		highlight = false,
		underline = false,
		disabled = false,
		href,
		onclick,
		class: className,
		...restProps
	}: Props = $props();

	const zenless = getZenlessContext();
	function handleClick(event: MouseEvent) {
		// Kept for API compatibility: the Vue component exposes but does not render `icon`.
		void _icon;
		if (disabled) {
			event.preventDefault();
			return;
		}
		onclick?.(event);
	}
</script>

<a
	class={[
		'z-link',
		zenless.isBold && 'is-bold',
		`z-link--${type}`,
		highlight && 'z-link--highlight',
		underline && 'z-link--underline',
		disabled && 'z-link--disabled',
		className
	]
		.filter(Boolean)
		.join(' ')}
	href={disabled ? undefined : href}
	aria-disabled={disabled || undefined}
	tabindex={disabled ? -1 : undefined}
	onclick={handleClick}
	{...restProps}
>
	{@render children?.()}
</a>
