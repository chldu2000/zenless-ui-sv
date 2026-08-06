<script lang="ts">
	import { tick, type Snippet } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import type { HTMLAttributes } from 'svelte/elements';
	import { clickOutside, escapeDismiss } from './actions/index.js';
	import { getZenlessContext } from './context.js';
	import { setDropdown } from './navigation-context.js';
	import type { ZenlessSize } from './types.js';

	export interface ZenlessDropdownProps extends Omit<HTMLAttributes<HTMLDivElement>, 'oncommand'> {
		children?: Snippet;
		content?: Snippet;
		open?: boolean;
		trigger?: 'hover' | 'click';
		disabled?: boolean;
		size?: ZenlessSize;
		hideOnCommand?: boolean;
		oncommand?: (value: unknown) => void;
		ontrigger?: (open: boolean) => void;
		onopenchange?: (open: boolean) => void;
	}

	let {
		children,
		content,
		open = $bindable(false),
		trigger = 'hover',
		disabled = false,
		size,
		hideOnCommand = true,
		oncommand,
		ontrigger,
		onopenchange,
		class: className,
		...rest
	}: ZenlessDropdownProps = $props();
	let triggerElement: HTMLElement | undefined;
	let menuElement: HTMLDivElement | undefined;
	const zenless = getZenlessContext();
	const captureTrigger: Attachment<HTMLElement> = (node) => {
		triggerElement = node;
		return () => {
			if (triggerElement === node) triggerElement = undefined;
		};
	};
	const captureMenu: Attachment<HTMLDivElement> = (node) => {
		menuElement = node;
		return () => {
			if (menuElement === node) menuElement = undefined;
		};
	};

	function setOpen(next: boolean, restoreFocus = false) {
		if (disabled || open === next) return;
		open = next;
		ontrigger?.(next);
		onopenchange?.(next);
		if (next) {
			void tick().then(() =>
				menuElement
					?.querySelector<HTMLElement>('[role=menuitem]:not([aria-disabled=true])')
					?.focus()
			);
		} else if (restoreFocus) {
			void tick().then(() => triggerElement?.focus());
		}
	}

	setDropdown({
		command(value) {
			oncommand?.(value);
			if (hideOnCommand) setOpen(false, true);
		}
	});

	function menuKeydown(event: KeyboardEvent) {
		const items = [
			...(menuElement?.querySelectorAll<HTMLElement>('[role=menuitem]:not([aria-disabled=true])') ??
				[])
		];
		const current = items.indexOf(document.activeElement as HTMLElement);
		const next =
			event.key === 'Home'
				? 0
				: event.key === 'End'
					? items.length - 1
					: event.key === 'ArrowDown'
						? (current + 1) % items.length
						: event.key === 'ArrowUp'
							? (current - 1 + items.length) % items.length
							: undefined;
		if (next === undefined) return;
		event.preventDefault();
		items[next]?.focus();
	}
</script>

<div
	class={[
		'z-dropdown',
		size && `z-dropdown--${size}`,
		open && 'is-visible',
		disabled && 'is-disabled',
		zenless.isBold && 'is-bold',
		className
	]
		.filter(Boolean)
		.join(' ')}
	use:clickOutside={() => open && setOpen(false)}
	use:escapeDismiss={() => open && setOpen(false, true)}
	onmouseenter={() => trigger === 'hover' && !disabled && setOpen(true)}
	onmouseleave={() => trigger === 'hover' && setOpen(false)}
	{...rest}
>
	<span
		{@attach captureTrigger}
		class="z-dropdown__trigger"
		role="button"
		tabindex={disabled ? -1 : 0}
		aria-haspopup="menu"
		aria-expanded={open}
		aria-disabled={disabled || undefined}
		onclick={() => trigger === 'click' && setOpen(!open)}
		onkeydown={(event) => {
			if (
				(event.key === 'Enter' || event.key === ' ') &&
				event.target === event.currentTarget &&
				trigger === 'click'
			) {
				event.preventDefault();
				setOpen(!open);
				return;
			}
			if (event.key === 'ArrowDown' && !open) {
				event.preventDefault();
				setOpen(true);
			}
		}}
	>
		{@render children?.()}
	</span>
	<div
		{@attach captureMenu}
		class="z-dropdown__content"
		role="menu"
		tabindex="-1"
		aria-hidden={!open}
		style:visibility={open ? 'visible' : 'hidden'}
		onkeydown={menuKeydown}
	>
		{@render content?.()}
	</div>
</div>
