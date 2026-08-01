<script lang="ts">
	import { onDestroy, type Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { getTabs, type NavigationValue } from './navigation-context.js';

	export interface ZenlessTabPanelProps extends HTMLAttributes<HTMLDivElement> {
		children?: Snippet;
		label?: string;
		labelContent?: Snippet;
		name?: NavigationValue;
		disabled?: boolean;
		lazy?: boolean;
	}

	const uid = $props.id();
	let {
		children,
		label = '',
		labelContent,
		name = uid,
		disabled = false,
		lazy = false,
		class: className,
		...rest
	}: ZenlessTabPanelProps = $props();
	const tabs = getTabs();
	const token = Symbol('tab-panel');
	const active = $derived(tabs?.value === name);

	if (tabs) {
		tabs.register({
			token,
			get name() {
				return name;
			},
			get label() {
				return label;
			},
			get labelContent() {
				return labelContent;
			},
			get disabled() {
				return disabled;
			}
		});
		onDestroy(() => tabs.unregister(token));
	}
</script>

{#if !lazy || active}
	<div
		class={['z-tab-panel', className].filter(Boolean).join(' ')}
		role="tabpanel"
		hidden={!active}
		aria-labelledby={`${tabs?.idBase}-tab-${String(name)}`}
		{...rest}
	>
		{@render children?.()}
	</div>
{/if}
