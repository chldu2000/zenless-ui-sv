<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { getZenlessContext } from './context.js';
	import type { ZenlessColor } from './types.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		children?: Snippet;
		type?: ZenlessColor;
		isDot?: boolean;
		value?: string | number;
	}

	let { children, type, isDot = false, value, class: className, ...restProps }: Props = $props();
	const zenless = getZenlessContext();
</script>

<div
	class={[
		'z-badge',
		zenless.isBold && 'is-bold',
		`z-badge--${type ?? 'default'}`,
		isDot && 'z-badge--dot',
		className
	]
		.filter(Boolean)
		.join(' ')}
	{...restProps}
>
	{@render children?.()}
	<sup class="z-badge__content">{isDot ? '' : value}</sup>
</div>
