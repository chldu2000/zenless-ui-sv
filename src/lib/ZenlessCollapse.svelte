<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { setCollapse, type NavigationValue } from './navigation-context.js';
	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onchange'> {
		children?: Snippet;
		value?: NavigationValue | NavigationValue[];
		accordion?: boolean;
		plain?: boolean;
		onchange?: (value: NavigationValue[]) => void;
	}
	let {
		children,
		value = $bindable<NavigationValue | NavigationValue[]>(),
		accordion = false,
		plain = false,
		onchange,
		class: className,
		...rest
	}: Props = $props();
	const active = $derived(Array.isArray(value) ? value : value === undefined ? [] : [value]);
	setCollapse({
		get active() {
			return active;
		},
		get plain() {
			return plain;
		},
		toggle(name) {
			const next = active.includes(name)
				? active.filter((item) => item !== name)
				: accordion
					? [name]
					: [...active, name];
			value = next;
			onchange?.(next);
		}
	});
</script>

<div class={['z-collapse', className].filter(Boolean).join(' ')} {...rest}>
	{@render children?.()}
</div>
