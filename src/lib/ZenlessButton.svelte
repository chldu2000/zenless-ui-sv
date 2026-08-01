<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import ZenlessIcon from './ZenlessIcon.svelte';
	import { getZenlessContext } from './context.js';
	import type { ZenlessColor, ZenlessSize } from './types.js';

	type ButtonIcon = string | Record<string, string>;

	interface Props extends Omit<HTMLButtonAttributes, 'type' | 'onclick'> {
		children?: Snippet;
		size?: ZenlessSize;
		type?: ZenlessColor;
		icon?: ButtonIcon;
		loading?: boolean;
		disabled?: boolean;
		plain?: boolean;
		round?: boolean;
		circle?: boolean;
		hollow?: boolean;
		nativeType?: 'button' | 'submit' | 'reset';
		highlight?: boolean;
		onclick?: (event: MouseEvent) => void;
	}

	let {
		children,
		size,
		type,
		icon,
		loading = false,
		disabled = false,
		plain = false,
		round = true,
		circle = false,
		hollow = false,
		nativeType = 'button',
		highlight = false,
		onclick,
		class: className,
		...restProps
	}: Props = $props();

	const zenless = getZenlessContext();
	const buttonIcon = $derived(
		typeof icon === 'string'
			? { name: icon }
			: icon
				? { name: Object.keys(icon)[0], color: Object.values(icon)[0] }
				: undefined
	);
</script>

<button
	class={[
		'z-button',
		zenless.isBold && 'is-bold',
		size && `z-button--${size}`,
		`z-button--${type ?? 'default'}`,
		highlight && 'z-button--highlight',
		plain && !hollow && 'z-button--plain',
		hollow && 'z-button--hollow',
		round && 'z-button--round',
		circle && 'z-button--circle',
		(disabled || loading) && 'z-button--disabled',
		className
	]
		.filter(Boolean)
		.join(' ')}
	disabled={disabled || loading}
	type={nativeType}
	{onclick}
	{...restProps}
>
	{#if loading}
		<i class="z-button__icon is-loading z-icon-loading" aria-label="Loading"></i>
	{:else if buttonIcon?.name}
		<ZenlessIcon class="z-button__icon" name={buttonIcon.name} color={buttonIcon.color} />
	{/if}
	{#if children}
		<span class="z-button__content">{@render children()}</span>
	{/if}
</button>
