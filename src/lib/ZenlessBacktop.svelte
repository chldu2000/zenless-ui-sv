<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	export interface ZenlessBacktopProps extends Omit<
		HTMLButtonAttributes,
		'children' | 'onclick' | 'type'
	> {
		children?: Snippet;
		target?: HTMLElement;
		visibleHeight?: number;
		right?: number;
		bottom?: number;
		onclick?: (event: MouseEvent) => void;
	}
	let {
		children,
		target,
		visibleHeight = 200,
		right = 60,
		bottom = 40,
		onclick,
		disabled = false,
		class: className,
		style,
		...rest
	}: ZenlessBacktopProps = $props();
	let visible = $state(false);
	const backtopStyle = $derived(
		[`right: ${right}px`, `bottom: ${bottom}px`, style].filter(Boolean).join('; ')
	);
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

{#if visible}
	<button
		class={[
			'z-backtop',
			'z-button',
			'z-button--default',
			'z-button--extra',
			'z-button--round',
			'z-button--circle',
			disabled && 'z-button--disabled',
			className
		]
			.filter(Boolean)
			.join(' ')}
		type="button"
		{disabled}
		aria-label="Back to top"
		style={backtopStyle}
		onclick={(event) => {
			if (disabled) return;
			target?.scrollTo({ top: 0, behavior: 'smooth' });
			onclick?.(event);
		}}
		{...rest}
	>
		{#if children}<span class="z-button__content">{@render children()}</span>{:else}<i
				class="z-button__icon z-icon-caret-top"
				aria-hidden="true"
			></i>{/if}
	</button>
{/if}
