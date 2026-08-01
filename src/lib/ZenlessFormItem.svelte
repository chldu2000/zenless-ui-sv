<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { getZenlessContext } from './context.js';
	import { getFormContext } from './form-context.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		children?: Snippet;
		label?: string;
		required?: boolean;
		labelWidth?: string | number;
		labelSnippet?: Snippet;
	}
	let {
		children,
		label,
		required = false,
		labelWidth,
		labelSnippet,
		class: className,
		...restProps
	}: Props = $props();
	const zenless = getZenlessContext();
	const form = getFormContext();
	const isInline = $derived(Boolean(form && form.labelPosition !== 'top'));
	const width = $derived(form?.labelWidth ?? labelWidth);
	const labelStyle = $derived(
		[
			width !== undefined && `width: ${typeof width === 'number' ? `${width}px` : width}`,
			form?.labelPosition && `text-align: ${isInline ? form.labelPosition : 'left'}`
		]
			.filter(Boolean)
			.join('; ')
	);
</script>

<div
	class={[
		'z-form-item',
		isInline && 'is-inline',
		required && 'is-required',
		zenless.isBold && 'is-bold',
		className
	]
		.filter(Boolean)
		.join(' ')}
	{...restProps}
>
	{#if labelSnippet || label || (form && !form.inline)}<label
			class="z-form-item__label"
			style={labelStyle}
			>{#if labelSnippet}{@render labelSnippet()}{:else}{label}{/if}</label
		>{/if}
	<div class="z-form-item__content">{@render children?.()}</div>
</div>
