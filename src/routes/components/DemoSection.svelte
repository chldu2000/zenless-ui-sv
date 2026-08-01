<script lang="ts">
	import type { Snippet } from 'svelte';
	import SourceCode from './docs/SourceCode.svelte';
	import { consumeDemoSource } from './demo-source.js';

	interface Props {
		title?: string;
		children?: Snippet;
		code?: string;
		dark?: boolean;
		class?: string;
	}

	let { title, children, code, dark = false, class: className }: Props = $props();
	const extractedCode = consumeDemoSource();
	const source = $derived(code ?? extractedCode);
</script>

<div class="demo-section">
	{#if title}<h2 class="component-header">{title}</h2>{/if}
	<section
		class={['component-preview', 'demo', dark && 'is-dark'].filter(Boolean).join(' ')}
		aria-label={title ?? '组件示例'}
	>
		<div class={['component-preview-line', 'demo-content', className].filter(Boolean).join(' ')}>
			{@render children?.()}
		</div>
		{#if source}<SourceCode code={source} collapse />{/if}
	</section>
</div>

<style>
	.demo-section {
		display: contents;
	}

	.demo {
		box-sizing: border-box;
		width: 100%;
		min-height: 3.5rem;
		padding: 30px 0 0;
		overflow: hidden;
		border-radius: 16px;
		background: #222;
		box-shadow: inset 0 1px 3px #333;
	}

	.demo-content {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin: 0 30px;
	}

	.demo.is-dark {
		background: #000;
	}

	.demo.is-dark :global(.source-code-expand.is-sticky) {
		background: #000;
	}

	@media (max-width: 40rem) {
		.demo-content {
			margin: 0 20px;
		}
	}
</style>
