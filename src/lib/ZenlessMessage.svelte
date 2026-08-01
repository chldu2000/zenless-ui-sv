<script lang="ts">
	import type { Snippet } from 'svelte';
	export type ZenlessMessageType = 'success' | 'error' | 'warning' | 'info';
	export interface ZenlessMessageProps {
		children?: Snippet;
		message?: string;
		type?: ZenlessMessageType;
		closing?: boolean;
	}
	let { children, message = '', type = 'info', closing = false }: ZenlessMessageProps = $props();
</script>

<div class={['z-message', `z-message--${type}`, closing && 'hidden'].join(' ')} role="status">
	<div class="z-message__content">
		{#if children}{@render children()}{:else}{message}{/if}
	</div>
</div>
