<script lang="ts">
	import { tick, type Snippet } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import type { HTMLAttributes } from 'svelte/elements';
	import { clickOutside, escapeDismiss } from './actions/index.js';
	import { getZenlessContext } from './context.js';
	import { setSelect, type OptionRegistration, type SelectValue } from './navigation-context.js';
	import type { ZenlessSize } from './types.js';
	import ZenlessInput from './ZenlessInput.svelte';
	import ZenlessScrollbar from './ZenlessScrollbar.svelte';

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
		onclear?: () => void;
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
		onclear,
		onopenchange,
		class: className,
		...rest
	}: ZenlessSelectProps = $props();
	const zenless = getZenlessContext();
	let options: OptionRegistration[] = $state([]);
	let open = $state(false);
	let rootElement: HTMLDivElement | undefined;
	let listboxElement: HTMLDivElement | undefined;
	const captureRoot: Attachment<HTMLDivElement> = (node) => {
		rootElement = node;
		return () => {
			if (rootElement === node) rootElement = undefined;
		};
	};
	const captureListbox: Attachment<HTMLDivElement> = (node) => {
		listboxElement = node;
		return () => {
			if (listboxElement === node) listboxElement = undefined;
		};
	};
	const selected = $derived(options.find((option) => Object.is(option.value, value)));
	const selectedLabel = $derived(selected?.label ?? (value === undefined ? '' : String(value)));
	const emptyLabel = $derived(emptyText ?? zenless.locale.messages.select.empty);
	function focusTrigger() {
		rootElement?.querySelector<HTMLInputElement>('.z-select__input > .z-input__inner')?.focus();
	}

	function setOpen(next: boolean, restoreFocus = false) {
		if (disabled || open === next) return;
		open = next;
		onopenchange?.(next);
		if (next) {
			void tick().then(() => (selected ?? options.find((option) => !option.disabled))?.focus());
		} else if (restoreFocus) {
			void tick().then(focusTrigger);
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
	{@attach captureRoot}
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
	<div
		class={['z-dropdown', 'z-select__wrap', size && `z-dropdown--${size}`, open && 'is-visible']
			.filter(Boolean)
			.join(' ')}
	>
		<ZenlessInput
			class="z-select__input"
			value={selectedLabel}
			{size}
			{name}
			{disabled}
			{clearable}
			clearAriaLabel="Clear selection"
			readonly
			{placeholder}
			role="combobox"
			aria-haspopup="listbox"
			aria-expanded={open}
			aria-controls={`${uid}-listbox`}
			onclick={() => setOpen(true)}
			onclear={() => {
				value = undefined;
				onchange?.(undefined);
				onclear?.();
			}}
			onkeydown={(event) => {
				if (event.key === 'Enter' || event.key === ' ') {
					event.preventDefault();
					setOpen(true);
				} else if (event.key === 'Escape') {
					setOpen(false);
				} else move(event);
			}}
		>
			{#snippet suffix()}<i class="z-icon-caret-bottom z-select__arrow" aria-hidden="true"
				></i>{/snippet}
		</ZenlessInput>
		<div
			class="z-dropdown__content"
			aria-hidden={!open}
			style:visibility={open ? 'visible' : 'hidden'}
		>
			<ZenlessScrollbar
				class="z-select__options"
				hideScroll
				resizable={false}
				id={`${uid}-listbox`}
				role="listbox"
				tabindex={-1}
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
				<div {@attach captureListbox}>
					{@render children?.()}
					{#if options.length === 0}
						<div class="z-select__empty">
							{#if empty}{@render empty()}{:else}{emptyLabel}{/if}
						</div>
					{/if}
				</div>
			</ZenlessScrollbar>
		</div>
	</div>
</div>
