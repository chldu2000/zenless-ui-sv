<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import ZenlessTag from './ZenlessTag.svelte';
	import { getZenlessContext } from './context.js';
	import { getChoiceGroup, type ChoiceValue } from './form-context.js';
	import type { ZenlessSize } from './types.js';

	export interface ZenlessRadioProps extends Omit<
		HTMLInputAttributes,
		'type' | 'checked' | 'value' | 'size' | 'onchange'
	> {
		children?: Snippet;
		value?: ChoiceValue;
		checked?: boolean;
		disabled?: boolean;
		size?: ZenlessSize;
		mode?: 'radio' | 'checkbox';
		shape?: 'label' | 'button';
		indeterminate?: boolean;
		onchange?: (checked: boolean | ChoiceValue) => void;
	}
	let {
		children,
		value: optionValue = true,
		checked = $bindable(false),
		disabled = false,
		size,
		mode = 'radio',
		shape = 'label',
		indeterminate = false,
		onchange,
		class: className,
		...restProps
	}: ZenlessRadioProps = $props();
	const zenless = getZenlessContext();
	const group = getChoiceGroup();
	const actualMode = $derived(group?.mode ?? mode);
	const isCheckbox = $derived(actualMode === 'checkbox');
	const isChecked = $derived(
		group
			? isCheckbox
				? Array.isArray(group.value) && group.value.includes(optionValue)
				: group.value === optionValue
			: checked
	);
	const count = $derived(group && Array.isArray(group.value) ? group.value.length : 0);
	const isLimited = $derived(
		Boolean(
			group &&
			isCheckbox &&
			((group.min !== undefined && count <= group.min && isChecked) ||
				(group.max !== undefined && count >= group.max && !isChecked))
		)
	);
	const isDisabled = $derived(disabled || group?.disabled || isLimited);
	const actualSize = $derived(size ?? group?.size);
	function change() {
		if (isDisabled) return;
		if (group) {
			if (isCheckbox) {
				const current = Array.isArray(group.value) ? group.value : [];
				group.change(
					isChecked ? current.filter((item) => item !== optionValue) : [...current, optionValue]
				);
			} else group.change(optionValue);
		} else {
			checked = !isChecked;
			onchange?.(isCheckbox ? checked : optionValue);
		}
	}
</script>

<label
	class={[
		'z-radio',
		isCheckbox && 'is-checkbox',
		shape === 'button' && 'is-button',
		actualSize && `z-radio--${actualSize}`,
		isChecked && 'is-checked',
		isDisabled && 'is-disabled',
		zenless.isBold && 'is-bold',
		className
	]
		.filter(Boolean)
		.join(' ')}
>
	{#if shape !== 'button'}<span class="z-radio__input"
			>{#if isChecked}<i class="z-icon-check"></i>{:else if indeterminate}<i class="z-icon-minus"
				></i>{/if}</span
		>{/if}
	{#if shape === 'button'}
		<ZenlessTag class="z-radio__label" size={actualSize} type={isChecked ? 'primary' : 'default'}>
			{#if children}{@render children()}{:else}{optionValue}{/if}
		</ZenlessTag>
	{:else}
		<span class="z-radio__label"
			>{#if children}{@render children()}{:else}{optionValue}{/if}</span
		>
	{/if}
	<input
		class="z-radio__original"
		type={isCheckbox ? 'checkbox' : 'radio'}
		value={String(optionValue)}
		checked={isChecked}
		disabled={isDisabled}
		onchange={change}
		{...restProps}
	/>
</label>
