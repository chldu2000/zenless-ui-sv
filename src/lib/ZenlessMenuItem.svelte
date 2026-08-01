<script lang="ts">
	import { onDestroy, type Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { getMenu, type NavigationValue } from './navigation-context.js';

	export interface ZenlessMenuItemProps extends Omit<
		HTMLButtonAttributes,
		'value' | 'name' | 'onselect'
	> {
		children?: Snippet;
		name: NavigationValue;
		title?: string;
		disabled?: boolean;
		onselect?: (value: NavigationValue) => void;
	}

	let {
		children,
		name,
		title = '',
		disabled = false,
		onselect,
		class: className,
		...rest
	}: ZenlessMenuItemProps = $props();
	const menu = getMenu();
	const token = Symbol('menu-item');
	const active = $derived(menu?.value === name);
	const tabStop = $derived(menu?.isTabStop(token, name) ?? true);
	menu?.registerItem(token, () => disabled);
	onDestroy(() => menu?.unregisterItem(token));

	function select() {
		if (disabled) return;
		menu?.select(name);
		onselect?.(name);
	}
</script>

<button
	class={['z-menu__item', active && 'is-active', disabled && 'is-disabled', className]
		.filter(Boolean)
		.join(' ')}
	type="button"
	role="menuitem"
	tabindex={tabStop ? 0 : -1}
	aria-current={active ? 'page' : undefined}
	aria-disabled={disabled || undefined}
	{disabled}
	onclick={select}
	{...rest}
>
	{#if children}{@render children()}{:else}{title}{/if}
</button>
