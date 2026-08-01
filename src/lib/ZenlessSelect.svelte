<script lang="ts">
	import { tick, type Snippet } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import type { HTMLAttributes } from 'svelte/elements';
	import { clickOutside, escapeDismiss } from './actions/index.js';
	import { getZenlessContext } from './context.js';
	import { setSelect, type OptionRegistration, type SelectValue } from './navigation-context.js';
	import type { ZenlessSize } from './types.js';

	export interface ZenlessSelectProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onchange'> {
		children?: Snippet;
		empty?: Snippet;
		value?: SelectValue;
		size?: ZenlessSize;
		placeholder?: string;
		clearable?: boolean;
		emptyText?: string;
		disabled?: boolean;
		name?: string;
		onchange?: (value: SelectValue | undefined) => void;
		onopenchange?: (open: boolean) => void;
	}

	const uid = $props.id();
	let {
		children,
		empty,
		value = $bindable<SelectValue | undefined>(undefined),
		size,
		placeholder = 'Select',
		clearable = false,
		emptyText,
		disabled = false,
		name,
		onchange,
		onopenchange,
		class: className,
		...rest
	}: ZenlessSelectProps = $props();
	const zenless = getZenlessContext();
	let options: OptionRegistration[] = $state([]);
	let open = $state(false);
	let triggerElement: HTMLButtonElement | undefined;
	let listboxElement: HTMLDivElement | undefined;
	const captureTrigger: Attachment<HTMLButtonElement> = (node) => {
		triggerElement = node;
		return () => {
			if (triggerElement === node) triggerElement = undefined;
		};
	};
	const captureListbox: Attachment<HTMLDivElement> = (node) => {
		listboxElement = node;
		return () => {
			if (listboxElement === node) listboxElement = undefined;
		};
	};
	const selected = $derived(options.find((option) => Object.is(option.value, value)));
	const emptyLabel = $derived(emptyText ?? zenless.locale.messages.select.empty);

	function setOpen(next: boolean, restoreFocus = false) {
		if (disabled || open === next) return;
		open = next;
		onopenchange?.(next);
		if (next) {
			void tick().then(() => (selected ?? options.find((option) => !option.disabled))?.focus());
		} else if (restoreFocus) {
			void tick().then(() => triggerElement?.focus());
		}
	}

	function select(next: SelectValue) {
		const option = options.find((item) => Object.is(item.value, next));
		if (!option || option.disabled) return;
		value = next;
		onchange?.(next);
		setOpen(false, true);
	}

	function move(event: KeyboardEvent) {
		const enabled = [
			...(listboxElement?.querySelectorAll<HTMLButtonElement>('[role=option]:not(:disabled)') ?? [])
		];
		if (!enabled.length) return;
		const current = enabled.indexOf(document.activeElement as HTMLButtonElement);
		const next =
			event.key === 'Home'
				? 0
				: event.key === 'End'
					? enabled.length - 1
					: event.key === 'ArrowDown'
						? current < 0
							? 0
							: (current + 1) % enabled.length
						: event.key === 'ArrowUp'
							? current < 0
								? enabled.length - 1
								: (current - 1 + enabled.length) % enabled.length
							: undefined;
		if (next === undefined) return;
		event.preventDefault();
		if (!open) setOpen(true);
		void tick().then(() => enabled[next]?.focus());
	}

	setSelect({
		get value() {
			return value;
		},
		get options() {
			return options;
		},
		register(option) {
			if (!options.some((item) => item.token === option.token)) options.push(option);
		},
		unregister(token) {
			const index = options.findIndex((option) => option.token === token);
			if (index !== -1) options.splice(index, 1);
		},
		select
	});
</script>

<div
	class={[
		'z-select',
		size && `z-select--${size}`,
		open && 'is-focused',
		disabled && 'is-disabled',
		className
	]
		.filter(Boolean)
		.join(' ')}
	use:clickOutside={() => open && setOpen(false)}
	use:escapeDismiss={() => open && setOpen(false, true)}
	{...rest}
>
	{#if name}<input type="hidden" {name} value={value === undefined ? '' : String(value)} />{/if}
	<div class="z-select__control">
		<button
			{@attach captureTrigger}
			class="z-select__input"
			type="button"
			role="combobox"
			aria-haspopup="listbox"
			aria-expanded={open}
			aria-controls={`${uid}-listbox`}
			{disabled}
			onclick={() => setOpen(!open)}
			onkeydown={(event) => {
				if (event.key === 'Enter' || event.key === ' ') {
					event.preventDefault();
					setOpen(!open);
				} else move(event);
			}}
		>
			<span class:placeholder={!selected}>{selected?.label ?? placeholder}</span>
			<i class="z-select__arrow z-icon-caret-bottom" aria-hidden="true"></i>
		</button>
		{#if clearable && value !== undefined && !disabled}
			<button
				class="z-select__clear"
				type="button"
				aria-label="Clear selection"
				onclick={() => {
					value = undefined;
					onchange?.(undefined);
					triggerElement?.focus();
				}}>×</button
			>
		{/if}
	</div>
	<div
		{@attach captureListbox}
		id={`${uid}-listbox`}
		class="z-select__options"
		role="listbox"
		tabindex="-1"
		hidden={!open}
		onkeydown={(event) => {
			if (event.key === 'Enter' || event.key === ' ') {
				if (
					document.activeElement instanceof HTMLButtonElement &&
					document.activeElement.getAttribute('role') === 'option'
				) {
					event.preventDefault();
					document.activeElement.click();
				}
			} else move(event);
		}}
	>
		{@render children?.()}
		{#if options.length === 0}
			<div class="z-select__empty">
				{#if empty}{@render empty()}{:else}{emptyLabel}{/if}
			</div>
		{/if}
	</div>
</div>
