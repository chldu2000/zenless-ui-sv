<script module lang="ts">
	export const zenlessPatternTypes = ['stripes', 'squares', 'rhombus'] as const;
	export type ZenlessPatternType = (typeof zenlessPatternTypes)[number];
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { getZenlessContext } from './context.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		children?: Snippet;
		type?: ZenlessPatternType;
	}

	let { children, type, class: className, ...restProps }: Props = $props();
	const zenless = getZenlessContext();
</script>

<div
	class={['z-pattern', type && `z-pattern--${type}`, zenless.isBold && 'is-bold', className]
		.filter(Boolean)
		.join(' ')}
	{...restProps}
>
	{@render children?.()}
</div>
