<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { getZenlessContext } from './context.js';
	import { getDropdown } from './navigation-context.js';

	export interface ZenlessDropdownItemProps extends Omit<
		HTMLButtonAttributes,
		'value' | 'command'
	> {
		children?: Snippet;
		value?: unknown;
		command?: unknown;
		disabled?: boolean;
		oncommand?: (value: unknown) => void;
	}

	const uid = $props.id();
	let {
		children,
		value,
		command: commandProp,
		disabled = false,
		oncommand,
		class: className,
		...rest
	}: ZenlessDropdownItemProps = $props();
	const dropdown = getDropdown();
	const zenless = getZenlessContext();
	const commandValue = $derived(commandProp ?? value ?? uid);

	function command() {
		if (disabled) return;
		oncommand?.(commandValue);
		dropdown?.command(commandValue);
	}
</script>

<button
	class={['z-dropdown-item', disabled && 'is-disabled', zenless.isBold && 'is-bold', className]
		.filter(Boolean)
		.join(' ')}
	type="button"
	role="menuitem"
	tabindex="-1"
	aria-disabled={disabled || undefined}
	{disabled}
	onclick={command}
	{...rest}
>
	{@render children?.()}
</button>
