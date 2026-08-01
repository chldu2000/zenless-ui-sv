<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { ZenlessPlacement } from './types.js';
	import { getZenlessContext } from './context.js';

	export interface ZenlessTooltipProps extends HTMLAttributes<HTMLDivElement> {
		children?: Snippet;
		content?: string;
		contentSnippet?: Snippet;
		placement?: ZenlessPlacement;
		visible?: boolean;
		disabled?: boolean;
	}
	let {
		children,
		content = '',
		contentSnippet,
		placement = 'top',
		visible = false,
		disabled = false,
		class: className,
		...rest
	}: ZenlessTooltipProps = $props();
	const zenless = getZenlessContext();
</script>

<div
	class={[
		'z-tooltip',
		`at-${placement}`,
		visible && 'is-visible',
		disabled && 'is-disabled',
		className
	]
		.filter(Boolean)
		.join(' ')}
	{...rest}
>
	{@render children?.()}
	<div class="z-tooltip__arrow"></div>
	<div class:is-bold={zenless.isBold} class="z-tooltip__popper" role="tooltip">
		{#if contentSnippet}{@render contentSnippet()}{:else}{content}{/if}
	</div>
</div>
