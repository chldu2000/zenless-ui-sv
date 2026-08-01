<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { SvelteMap } from 'svelte/reactivity';
	import { setMenu, type NavigationValue } from './navigation-context.js';
	import ZenlessScrollbar from './ZenlessScrollbar.svelte';

	export interface ZenlessMenuProps extends Omit<HTMLAttributes<HTMLElement>, 'onchange'> {
		children?: Snippet;
		value?: NavigationValue;
		accordion?: boolean;
		defaultOpen?: NavigationValue | NavigationValue[];
		onchange?: (value: NavigationValue) => void;
	}

	let {
		children,
		value = $bindable<NavigationValue>(),
		accordion = false,
		defaultOpen,
		onchange,
		class: className,
		...rest
	}: ZenlessMenuProps = $props();
	const submenus = new SvelteMap<symbol, () => void>();
	let items: {
		token: symbol;
		name: () => NavigationValue;
		parent: () => NavigationValue | undefined;
		disabled: () => boolean;
	}[] = $state([]);

	setMenu({
		get value() {
			return value;
		},
		get accordion() {
			return accordion;
		},
		registerItem(token, name, parent, disabled) {
			if (!items.some((item) => item.token === token))
				items.push({ token, name, parent, disabled });
		},
		unregisterItem(token) {
			const index = items.findIndex((item) => item.token === token);
			if (index !== -1) items.splice(index, 1);
		},
		isTabStop(token, name) {
			if (value !== undefined) return value === name;
			return items.find((item) => !item.disabled())?.token === token;
		},
		isActive(name) {
			if (value === name) return true;
			return items.some((item) => item.name() === value && item.parent() === name);
		},
		isSubmenuInitiallyOpen(name) {
			const names =
				defaultOpen === undefined ? [] : Array.isArray(defaultOpen) ? defaultOpen : [defaultOpen];
			return names.includes(name);
		},
		select(name) {
			if (value === name) return;
			value = name;
			onchange?.(name);
		},
		registerSubmenu(token, close) {
			submenus.set(token, close);
		},
		unregisterSubmenu(token) {
			submenus.delete(token);
		},
		requestSubmenuOpen(token) {
			if (accordion) for (const [other, close] of submenus) if (other !== token) close();
		}
	});

	function keydown(event: KeyboardEvent) {
		const menu = event.currentTarget as HTMLElement;
		const focusableItems = [
			...menu.querySelectorAll<HTMLElement>('[role=menuitem]:not([aria-disabled=true])')
		].filter((item) => !item.closest('[hidden]'));
		if (!focusableItems.length) return;
		const current = focusableItems.indexOf(document.activeElement as HTMLElement);
		let next = current < 0 ? 0 : current;
		if (event.key === 'Home') next = 0;
		else if (event.key === 'End') next = focusableItems.length - 1;
		else if (event.key === 'ArrowDown') next = (next + 1) % focusableItems.length;
		else if (event.key === 'ArrowUp')
			next = (next - 1 + focusableItems.length) % focusableItems.length;
		else return;
		event.preventDefault();
		focusableItems[next].focus();
	}
</script>

<nav
	class={['z-menu', 'z-menu--vertical', className].filter(Boolean).join(' ')}
	aria-label="Menu"
	onkeydown={keydown}
	{...rest}
>
	<div class="z-menu__prefix" aria-hidden="true"><i class="z-icon-caret-top"></i></div>
	<ZenlessScrollbar class="z-menu__scrollbar" hideScroll fixed={false}>
		<div class="z-menu__content" role="menu">{@render children?.()}</div>
	</ZenlessScrollbar>
	<div class="z-menu__suffix" aria-hidden="true"><i class="z-icon-caret-bottom"></i></div>
</nav>
