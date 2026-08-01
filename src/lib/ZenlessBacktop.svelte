<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	export interface ZenlessBacktopProps extends HTMLButtonAttributes {
		children?: Snippet;
		target?: HTMLElement;
		visibleHeight?: number;
		right?: number;
		bottom?: number;
	}
	let {
		children,
		target,
		visibleHeight = 200,
		right = 60,
		bottom = 40,
		class: className,
		...rest
	}: ZenlessBacktopProps = $props();
	let visible = $state(false);
	const monitorTarget: Attachment<Window> = () => {
		const element = target;
		if (!element) {
			visible = false;
			return;
		}
		const update = () => {
			visible = element.scrollTop >= visibleHeight;
		};
		update();
		element.addEventListener('scroll', update);
		return () => element.removeEventListener('scroll', update);
	};
</script>

<svelte:window {@attach monitorTarget} />

{#if visible}<button
		class={['z-backtop', 'z-button', className].filter(Boolean).join(' ')}
		type="button"
		aria-label="Back to top"
		style:right={`${right}px`}
		style:bottom={`${bottom}px`}
		onclick={() => target?.scrollTo({ top: 0, behavior: 'smooth' })}
		{...rest}
		>{#if children}{@render children()}{:else}↑{/if}</button
	>{/if}
