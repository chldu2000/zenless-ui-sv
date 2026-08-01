<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title?: string;
		children?: Snippet;
		dark?: boolean;
		class?: string;
	}

	let { title, children, dark = false, class: className }: Props = $props();
</script>

<div class="demo-section">
	{#if title}<h3 class="demo-section__title">{title}</h3>{/if}
	<section
		class={['demo', dark && 'is-dark', className].filter(Boolean).join(' ')}
		aria-label={title ?? '组件示例'}
	>
		{@render children?.()}
	</section>
</div>

<style>
	.demo-section {
		margin-top: 2.4rem;
	}

	.demo-section__title {
		margin: 0 0 1rem;
		color: #fff;
		font-size: 1.1rem;
	}

	.demo {
		display: flex;
		box-sizing: border-box;
		width: 100%;
		min-height: 3.5rem;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.75rem;
		padding: 1.9rem;
		border-radius: 1rem;
		background: #222;
		box-shadow: inset 0 1px 3px #333;
	}

	.demo.is-dark {
		background: #000;
	}

	@media (max-width: 40rem) {
		.demo {
			padding: 1.35rem;
		}
	}
</style>
