<script lang="ts">
	import { ZenlessScrollbar } from '$lib/index.js';

	let { code, collapse = false }: { code: string; collapse?: boolean } = $props();
	let open = $state(false);
</script>

<div class="source-code">
	<ZenlessScrollbar fixed={false} class="source-code-scroll">
		<div class:is-visible={!collapse || open} class="source-code-content">
			<pre class="language-svelte"><code>{code}</code></pre>
		</div>
	</ZenlessScrollbar>
	{#if collapse}
		<button
			type="button"
			class:is-sticky={open}
			class="source-code-expand"
			onclick={() => (open = !open)}
			aria-expanded={open}
		>
			<i class={open ? 'z-icon-caret-top' : 'z-icon-caret-bottom'} aria-hidden="true"></i>
			<span>{open ? '隐藏代码' : '显示代码'}</span>
		</button>
	{/if}
</div>

<style>
	.source-code {
		width: 100%;
		margin-top: 30px;
	}

	.source-code :global(.source-code-scroll) {
		height: auto;
		max-height: 30rem;
	}

	.source-code-content {
		width: 100%;
		height: 0;
		overflow: hidden;
	}

	.source-code-content.is-visible {
		height: auto;
		border-top: 1px solid #323232;
		border-bottom: 1px solid #323232;
	}

	pre,
	code {
		margin: 0;
		color: #ccc;
		background: transparent;
		font-family: 'Lucida Console', Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
		font-size: 14px;
		line-height: 1.6;
	}

	pre {
		box-sizing: border-box;
		min-width: max-content;
		padding: 18px 24px;
	}

	.source-code-expand {
		display: flex;
		width: 100%;
		height: 40px;
		align-items: center;
		justify-content: center;
		border: 0;
		border-top: 1px solid #323232;
		color: #808080;
		background: transparent;
		cursor: pointer;
		font: inherit;
		font-size: 14px;
	}

	.source-code-expand:hover,
	.source-code-expand:focus-visible {
		color: #fff;
	}

	.source-code-expand.is-sticky {
		position: sticky;
		z-index: 1;
		bottom: 0;
		background: #222;
	}

	.source-code-expand i {
		margin-right: 5px;
		font-size: 24px;
	}
</style>
