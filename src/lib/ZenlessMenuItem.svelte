<script lang="ts">
	import { onDestroy, type Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { getZenlessContext } from './context.js';
	import { getMenu, getSubMenu, type NavigationValue } from './navigation-context.js';

	export interface ZenlessMenuItemProps extends Omit<
		HTMLButtonAttributes,
		'value' | 'name' | 'onselect'
	> {
		children?: Snippet;
		name?: NavigationValue;
		icon?: string;
		title?: string;
		disabled?: boolean;
		onselect?: (value: NavigationValue) => void;
	}

	const uid = $props.id();
	let {
		children,
		name = uid,
		icon,
		title = '',
		disabled = false,
		onselect,
		class: className,
		...rest
	}: ZenlessMenuItemProps = $props();
	const menu = getMenu();
	const submenu = getSubMenu();
	const zenless = getZenlessContext();
	const token = Symbol('menu-item');
	const active = $derived(menu?.isActive(name) ?? false);
	const tabStop = $derived(menu?.isTabStop(token, name) ?? true);
	menu?.registerItem(
		token,
		() => name,
		() => submenu?.name,
		() => disabled
	);
	onDestroy(() => menu?.unregisterItem(token));

	function select() {
		if (disabled) return;
		menu?.select(name);
		onselect?.(name);
	}
</script>

<button
	class={[
		'z-menu__item',
		zenless.isBold && 'is-bold',
		active && 'is-active',
		disabled && 'is-disabled',
		className
	]
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
	{#if icon}<i class={`z-menu__icon z-icon-${icon}`} aria-hidden="true"></i>{/if}
	{#if title}<span>{title}</span>{/if}
	{@render children?.()}
</button>
