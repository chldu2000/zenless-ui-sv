<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { getZenlessContext } from './context.js';
	import type { ZenlessColor, ZenlessSize } from './types.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onclose'> {
		children?: Snippet;
		size?: ZenlessSize;
		type?: ZenlessColor;
		plain?: boolean;
		hollow?: boolean;
		round?: boolean;
		closable?: boolean;
		onclose?: (event: MouseEvent) => void;
	}

	let {
		children,
		size,
		type,
		plain = false,
		hollow = false,
		round = true,
		closable = false,
		onclose,
		class: className,
		...restProps
	}: Props = $props();

	const zenless = getZenlessContext();
	let isCloseHovered = $state(false);
</script>

<div
	class={[
		'z-tag',
		zenless.isBold && 'is-bold',
		size && `z-tag--${size}`,
		`z-tag--${type ?? 'default'}`,
		plain && !hollow && 'z-tag--plain',
		hollow && 'z-tag--hollow',
		round && 'z-tag--round',
		className
	]
		.filter(Boolean)
		.join(' ')}
	{...restProps}
>
	<span class="z-tag__content">{@render children?.()}</span>
	{#if closable}
		<button
			class={['z-tag__close', isCloseHovered ? 'z-icon-error' : 'z-icon-close'].join(' ')}
			type="button"
			aria-label="Close"
			onmouseenter={() => (isCloseHovered = true)}
			onmouseleave={() => (isCloseHovered = false)}
			onclick={onclose}
		></button>
	{/if}
</div>
