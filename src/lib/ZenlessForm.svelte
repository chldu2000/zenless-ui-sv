<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { getZenlessContext } from './context.js';
	import { setFormContext } from './form-context.js';

	interface Props extends HTMLAttributes<HTMLFormElement> {
		children?: Snippet;
		inline?: boolean;
		labelWidth?: string | number;
		labelPosition?: 'left' | 'right' | 'top';
	}
	let {
		children,
		inline = false,
		labelWidth,
		labelPosition,
		class: className,
		...restProps
	}: Props = $props();
	const zenless = getZenlessContext();
	setFormContext({
		get inline() {
			return inline;
		},
		get labelWidth() {
			return labelWidth;
		},
		get labelPosition() {
			return labelPosition;
		}
	});
</script>

<form
	class={['z-form', inline && 'is-inline', zenless.isBold && 'is-bold', className]
		.filter(Boolean)
		.join(' ')}
	{...restProps}
>
	{@render children?.()}
</form>
