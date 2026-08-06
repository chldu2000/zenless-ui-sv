<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { getZenlessContext } from './context.js';
	import type { ZenlessSize } from './types.js';

	interface Props extends Omit<
		HTMLInputAttributes,
		'value' | 'size' | 'prefix' | 'oninput' | 'onchange'
	> {
		children?: Snippet;
		prepend?: Snippet;
		append?: Snippet;
		prefix?: Snippet;
		suffix?: Snippet;
		value?: string | number;
		type?: 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url';
		size?: ZenlessSize;
		clearable?: boolean;
		prefixIcon?: string;
		suffixIcon?: string;
		textAlign?: 'left' | 'center' | 'right';
		clearAriaLabel?: string;
		oninput?: (value: string) => void;
		onchange?: (value: string) => void;
		onclear?: () => void;
	}

	let {
		prepend,
		append,
		prefix,
		suffix,
		value = $bindable(''),
		type = 'text',
		size,
		clearable = false,
		prefixIcon,
		suffixIcon,
		textAlign,
		clearAriaLabel = 'Clear',
		disabled = false,
		readonly = false,
		oninput,
		onchange,
		onclear,
		class: className,
		...restProps
	}: Props = $props();
	const zenless = getZenlessContext();
	let focused = $state(false);
	let hovering = $state(false);
	let passwordVisible = $state(false);
	const stringValue = $derived(String(value ?? ''));
	const showClear = $derived(
		clearable && stringValue.length > 0 && !disabled && (focused || hovering)
	);
	const showPassword = $derived(
		type === 'password' &&
			(stringValue.length > 0 || (!disabled && !readonly && (focused || hovering)))
	);

	function updateValue(next: string) {
		value = next;
		oninput?.(next);
	}
	function clear() {
		updateValue('');
		onchange?.('');
		onclear?.();
	}
</script>

<div
	class={[
		'z-input',
		size && `z-input--${size}`,
		zenless.isBold && 'is-bold',
		focused && 'is-focused',
		disabled && 'is-disabled',
		readonly && 'is-readonly',
		className
	]
		.filter(Boolean)
		.join(' ')}
	role="presentation"
	onmouseenter={() => (hovering = true)}
	onmouseleave={() => (hovering = false)}
>
	{#if prepend}<span class="z-input__prepend">{@render prepend()}</span>{/if}
	{#if prefix || prefixIcon}<span class="z-input__prefix"
			>{@render prefix?.()}{#if !prefix && prefixIcon}<i class={`z-icon-${prefixIcon}`}
				></i>{/if}</span
		>{/if}
	<input
		class="z-input__inner"
		type={type === 'password' && passwordVisible ? 'text' : type}
		value={stringValue}
		style={textAlign && `text-align: ${textAlign}`}
		{disabled}
		{readonly}
		onfocus={() => (focused = true)}
		onblur={(event) => {
			focused = false;
			onchange?.(event.currentTarget.value);
		}}
		oninput={(event) => updateValue(event.currentTarget.value)}
		{...restProps}
	/>
	{#if showPassword || showClear || suffix || suffixIcon}
		<span class="z-input__suffix">
			{#if showPassword}<button
					class={`z-input__clear z-icon-${passwordVisible ? 'visible' : 'invisible'}`}
					type="button"
					aria-label="Toggle password visibility"
					onclick={() => (passwordVisible = !passwordVisible)}
				></button>
			{:else if showClear}<button
					class="z-input__clear z-icon-error"
					type="button"
					aria-label={clearAriaLabel}
					onclick={clear}
				></button>
			{:else if suffix}{@render suffix()}{:else if suffixIcon}<i class={`z-icon-${suffixIcon}`}
				></i>{/if}
		</span>
	{/if}
	{#if append}<span class="z-input__append">{@render append()}</span>{/if}
</div>
