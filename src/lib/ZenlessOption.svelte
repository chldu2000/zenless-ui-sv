<script lang="ts">
	import { onDestroy, type Snippet } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { getSelect, type SelectValue } from './navigation-context.js';

	export interface ZenlessOptionProps extends Omit<HTMLButtonAttributes, 'value'> {
		children?: Snippet;
		label?: string;
		value: SelectValue;
		disabled?: boolean;
	}

	const uid = $props.id();
	let {
		value,
		children,
		label = String(value),
		disabled = false,
		class: className,
		...rest
	}: ZenlessOptionProps = $props();
	const select = getSelect();
	const token = Symbol('select-option');
	let element: HTMLButtonElement | undefined;
	const captureElement: Attachment<HTMLButtonElement> = (node) => {
		element = node;
		return () => {
			if (element === node) element = undefined;
		};
	};
	const selected = $derived(Object.is(select?.value, value));

	if (select) {
		select.register({
			token,
			get value() {
				return value;
			},
			get label() {
				return label;
			},
			get disabled() {
				return disabled;
			},
			focus() {
				element?.focus();
			}
		});
		onDestroy(() => select.unregister(token));
	}
</script>

<button
	{@attach captureElement}
	id={`${uid}-option`}
	class={['z-dropdown-item', selected && 'selected', disabled && 'is-disabled', className]
		.filter(Boolean)
		.join(' ')}
	type="button"
	role="option"
	tabindex="-1"
	aria-selected={selected}
	aria-disabled={disabled || undefined}
	{disabled}
	onclick={() => select?.select(value)}
	{...rest}
>
	{#if children}{@render children()}{:else}{label}{/if}
</button>
