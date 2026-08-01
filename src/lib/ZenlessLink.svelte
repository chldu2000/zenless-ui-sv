<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import { getZenlessContext } from './context.js';
	import type { ZenlessColor } from './types.js';

	interface Props extends Omit<HTMLAnchorAttributes, 'onclick'> {
		children?: Snippet;
		type?: ZenlessColor;
		highlight?: boolean;
		underline?: boolean;
		disabled?: boolean;
		onclick?: (event: MouseEvent) => void;
	}

	let {
		children,
		type = 'default',
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
