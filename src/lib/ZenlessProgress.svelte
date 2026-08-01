<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { getZenlessContext } from './context.js';
	import { zenlessColors, type ZenlessColor } from './types.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		children?: Snippet;
		type?: 'line' | 'circle';
		size?: number | string;
		percent?: number;
		color?: ZenlessColor | string;
	}

	let {
		children,
		type = 'line',
		size,
		percent = 0,
		color,
		class: className,
		...restProps
	}: Props = $props();

	const zenless = getZenlessContext();
	const progressType = $derived(zenlessColors.includes(color as ZenlessColor) ? color : undefined);
	const clampedPercent = $derived(Math.min(100, Math.max(0, percent)));
	const resolvedColor = $derived(
		progressType ? `var(--zenless-${progressType})` : color || '#4664ff'
	);
	const dimension = $derived(
		size === undefined ? undefined : typeof size === 'number' ? `${size}px` : size
	);
	const circleStyle = $derived(
		[
			dimension && `width: ${dimension}`,
			dimension && `height: ${dimension}`,
			`color: ${resolvedColor}`,
			`background-image: conic-gradient(currentColor ${clampedPercent}%, var(--zenless-panel) ${clampedPercent}%)`
		]
			.filter(Boolean)
			.join('; ')
	);
	const trackStyle = $derived(
		`width: ${clampedPercent}%; background: ${resolvedColor}; background-image: linear-gradient(90deg, transparent, var(--zenless-white)), linear-gradient(90deg, transparent, ${resolvedColor}), linear-gradient(90deg, transparent, rgb(255 255 255 / 30%))`
	);
</script>

<div
	class={[
		'z-progress',
		type === 'circle' && 'z-progress--circle',
		progressType && `z-progress--${progressType}`,
		zenless.isBold && 'is-bold',
		className
	]
		.filter(Boolean)
		.join(' ')}
	role="progressbar"
	aria-valuemin="0"
	aria-valuemax="100"
	aria-valuenow={clampedPercent}
	{...restProps}
>
	{#if type === 'circle'}
		<div class="z-progress__circle" style={circleStyle}>
			<div class="z-progress__content" style={`background: ${resolvedColor}`}>
				{@render children?.()}
			</div>
		</div>
	{:else}
		<div class="z-progress__rail"><div class="z-progress__track" style={trackStyle}></div></div>
	{/if}
</div>
