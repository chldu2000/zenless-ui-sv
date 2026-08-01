<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { getZenlessContext } from './context.js';
	import { getCollapse, type NavigationValue } from './navigation-context.js';

	export interface ZenlessCollapseItemProps extends HTMLAttributes<HTMLDivElement> {
		children?: Snippet;
		title?: string;
		titleContent?: Snippet;
		name?: NavigationValue;
		disabled?: boolean;
	}

	const uid = $props.id();
	let {
		children,
		title = '',
		titleContent,
		name = uid,
		disabled = false,
		class: className,
		...rest
	}: ZenlessCollapseItemProps = $props();
	const collapse = getCollapse();
	const zenless = getZenlessContext();
	const active = $derived(collapse?.active.includes(name) ?? false);
	const contentId = `${uid}-content`;

	function toggle() {
		if (!disabled) collapse?.toggle(name);
	}
</script>

<div
	class={[
		'z-collapse-item',
		zenless.isBold && 'is-bold',
		collapse?.plain && 'z-collapse-item--plain',
		active && 'z-collapse-item--active',
		disabled && 'z-collapse-item--disabled',
		className
	]
		.filter(Boolean)
		.join(' ')}
	{...rest}
>
	<button
		class="z-collapse-item__header"
		type="button"
		aria-expanded={active}
		aria-controls={contentId}
		{disabled}
		onclick={toggle}
	>
		<span class="z-collapse-item__title">
			{#if titleContent}{@render titleContent()}{:else}{title}{/if}
		</span>
		<i class="z-icon-caret-bottom" aria-hidden="true"></i>
	</button>
	{#if active}
		<div class="z-collapse-item__content" id={contentId}>{@render children?.()}</div>
	{/if}
</div>
