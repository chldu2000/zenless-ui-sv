<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import { getZenlessContext } from './context.js';
	import type { ZenlessSize } from './types.js';

	interface Props extends Omit<HTMLTextareaAttributes, 'value' | 'oninput' | 'onchange'> {
		value?: string;
		size?: ZenlessSize;
		autoSize?: boolean;
		textAlign?: 'left' | 'center' | 'right';
		oninput?: (value: string) => void;
		onchange?: (value: string) => void;
	}

	let {
		value = $bindable(''),
		size,
		autoSize = false,
		textAlign,
		disabled = false,
		readonly = false,
		oninput,
		onchange,
		class: className,
		...restProps
	}: Props = $props();
	const zenless = getZenlessContext();
	let focused = $state(false);
	let textarea: HTMLTextAreaElement | undefined;
	function attachTextarea(node: HTMLTextAreaElement) {
		textarea = node;
		resize();
		return () => {
			textarea = undefined;
		};
	}
	function resize() {
		if (autoSize && textarea) {
			textarea.style.height = 'auto';
			textarea.style.height = `${textarea.scrollHeight}px`;
		}
	}
	function updateValue(next: string) {
		value = next;
		oninput?.(next);
		queueMicrotask(resize);
	}
</script>

<div
	class={[
		'z-input',
		'z-textarea',
		size && `z-input--${size}`,
		zenless.isBold && 'is-bold',
		focused && 'is-focused',
		disabled && 'is-disabled',
		readonly && 'is-readonly',
		className
	]
		.filter(Boolean)
		.join(' ')}
>
	<textarea
		{@attach attachTextarea}
		class="z-textarea__inner"
		{value}
		style={textAlign && `text-align: ${textAlign}`}
		{disabled}
		{readonly}
		onfocus={() => (focused = true)}
		onblur={(event) => {
			focused = false;
			onchange?.(event.currentTarget.value);
		}}
		oninput={(event) => updateValue(event.currentTarget.value)}
		{...restProps}></textarea>
</div>
