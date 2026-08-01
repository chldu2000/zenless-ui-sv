<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { getZenlessContext } from './context.js';

	interface Props extends Omit<HTMLInputAttributes, 'type' | 'checked' | 'onchange'> {
		checked?: boolean;
		onchange?: (checked: boolean) => void;
	}
	let {
		checked = $bindable(false),
		disabled = false,
		onchange,
		class: className,
		...restProps
	}: Props = $props();
	const zenless = getZenlessContext();
	function change(event: Event) {
		checked = (event.currentTarget as HTMLInputElement).checked;
		onchange?.(checked);
	}
</script>

<label
	class={[
		'z-switch',
		zenless.isBold && 'is-bold',
		checked && 'is-checked',
		disabled && 'is-disabled',
		className
	]
		.filter(Boolean)
		.join(' ')}
>
	<span class="z-switch__label">{checked ? 'ON' : 'OFF'}</span><span class="z-switch__handle"
	></span>
	<input
		class="z-switch__input"
		type="checkbox"
		role="switch"
		aria-checked={checked}
		{checked}
		{disabled}
		onchange={change}
		{...restProps}
	/>
</label>
