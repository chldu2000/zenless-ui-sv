<script lang="ts">
	import { onDestroy, type Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { getMenu, setSubMenu } from './navigation-context.js';

	export interface ZenlessSubMenuProps extends HTMLAttributes<HTMLDivElement> {
		children?: Snippet;
		title?: string;
		titleContent?: Snippet;
		open?: boolean;
		disabled?: boolean;
		onopenchange?: (open: boolean) => void;
	}

	const uid = $props.id();
	let {
		children,
		title = '',
		titleContent,
		open = $bindable(false),
		disabled = false,
		onopenchange,
		class: className,
		...rest
	}: ZenlessSubMenuProps = $props();
	const menu = getMenu();
	const token = Symbol('submenu');
	const contentId = `${uid}-submenu`;
	setSubMenu({
		get open() {
			return open;
		}
	});
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

<div class={['z-menu__submenu', className].filter(Boolean).join(' ')} {...rest}>
	<button
		class={['z-menu__item', disabled && 'is-disabled'].filter(Boolean).join(' ')}
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
		{#if titleContent}{@render titleContent()}{:else}{title}{/if}
		<i class="z-icon-caret-bottom" aria-hidden="true"></i>
	</button>
	<div id={contentId} class:is-open={open} class="z-menu__sub" role="menu" hidden={!open}>
		{@render children?.()}
	</div>
</div>
