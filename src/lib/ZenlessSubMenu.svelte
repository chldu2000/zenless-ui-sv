<script lang="ts">
	import { onDestroy, untrack, type Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { getZenlessContext } from './context.js';
	import { getMenu, setSubMenu, type NavigationValue } from './navigation-context.js';

	export interface ZenlessSubMenuProps extends HTMLAttributes<HTMLDivElement> {
		children?: Snippet;
		title?: string;
		titleContent?: Snippet;
		name?: NavigationValue;
		icon?: string;
		open?: boolean;
		disabled?: boolean;
		onopenchange?: (open: boolean) => void;
	}

	const uid = $props.id();
	let {
		children,
		title = '',
		titleContent,
		name = uid,
		icon,
		open = $bindable(false),
		disabled = false,
		onopenchange,
		class: className,
		...rest
	}: ZenlessSubMenuProps = $props();
	const menu = getMenu();
	const zenless = getZenlessContext();
	const token = Symbol('submenu');
	const active = $derived(menu?.isActive(name) ?? false);
	const contentId = `${uid}-submenu`;
	setSubMenu({
		get open() {
			return open;
		},
		get name() {
			return name;
		}
	});
	if (menu?.isSubmenuInitiallyOpen(untrack(() => name))) open = true;
	menu?.registerSubmenu(token, () => {
		if (open) {
			open = false;
			onopenchange?.(false);
		}
	});
	onDestroy(() => menu?.unregisterSubmenu(token));

	function toggle() {
		if (disabled) return;
		open = !open;
		if (open) menu?.requestSubmenuOpen(token);
		onopenchange?.(open);
	}

	function keydown(event: KeyboardEvent) {
		if (event.key === 'ArrowRight' && !open) {
			event.preventDefault();
			toggle();
		} else if (event.key === 'ArrowLeft' && open) {
			event.preventDefault();
			toggle();
		}
	}
</script>

<div class={['z-menu__group', className].filter(Boolean).join(' ')} {...rest}>
	<button
		class={[
			'z-menu__item',
			zenless.isBold && 'is-bold',
			active && 'is-active',
			disabled && 'is-disabled'
		]
			.filter(Boolean)
			.join(' ')}
		type="button"
		role="menuitem"
		aria-expanded={open}
		aria-controls={contentId}
		aria-disabled={disabled || undefined}
		tabindex="-1"
		{disabled}
		onclick={toggle}
		onkeydown={keydown}
	>
		{#if icon}<i class={`z-menu__icon z-icon-${icon}`} aria-hidden="true"></i>{/if}
		{#if title}<span>{title}</span>{/if}
		{@render titleContent?.()}
	</button>
	<div id={contentId} class:is-open={open} class="z-menu__sub" role="menu" aria-hidden={!open}>
		{@render children?.()}
	</div>
</div>
