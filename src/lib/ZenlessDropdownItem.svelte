<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { getDropdown } from './navigation-context.js';

	export interface ZenlessDropdownItemProps extends Omit<HTMLButtonAttributes, 'value'> {
		children?: Snippet;
		value?: unknown;
		disabled?: boolean;
		oncommand?: (value: unknown) => void;
	}

	let {
		children,
		value,
		disabled = false,
		oncommand,
		class: className,
		...rest
	}: ZenlessDropdownItemProps = $props();
	const dropdown = getDropdown();

	function command() {
		if (disabled) return;
		oncommand?.(value);
		dropdown?.command(value);
	}
</script>

<button
	class={['z-dropdown-item', disabled && 'is-disabled', className].filter(Boolean).join(' ')}
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
