<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { setChoiceGroup, type ChoiceValue } from './form-context.js';
	import type { ZenlessSize } from './types.js';

	export interface ZenlessRadioGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onchange'> {
		children?: Snippet;
		value?: ChoiceValue | ChoiceValue[];
		disabled?: boolean;
		size?: ZenlessSize;
		min?: number;
		max?: number;
		mode?: 'radio' | 'checkbox';
		onchange?: (value: ChoiceValue | ChoiceValue[]) => void;
	}
	let {
		children,
		value = $bindable<ChoiceValue | ChoiceValue[]>(),
		disabled = false,
		size,
		min,
		max,
		mode = 'radio',
		onchange,
		class: className,
		...restProps
	}: ZenlessRadioGroupProps = $props();
	setChoiceGroup({
		get mode() {
			return mode;
		},
		get disabled() {
			return disabled;
		},
		get size() {
			return size;
		},
		get min() {
			return min;
		},
		get max() {
			return max;
		},
		get value() {
			return value;
		},
		change(next) {
			value = next;
			onchange?.(next);
		}
	});
</script>

<div class={['z-radio-group', className].filter(Boolean).join(' ')} {...restProps}>
	{@render children?.()}
</div>
