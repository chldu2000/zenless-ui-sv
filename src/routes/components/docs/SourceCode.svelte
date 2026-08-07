<script lang="ts">
	import Prism from 'prismjs';
	import 'prismjs/components/prism-markup.js';
	import 'prismjs/components/prism-javascript.js';
	import 'prismjs/components/prism-css.js';
	import 'prism-svelte';
	import { ZenlessScrollbar } from '$lib/index.js';

	let { code, collapse = false }: { code: string; collapse?: boolean } = $props();
	let open = $state(false);
	let copied = $state(false);
	let copyTimer: ReturnType<typeof setTimeout> | undefined;
	const highlighted = $derived(Prism.highlight(code, Prism.languages.svelte, 'svelte'));

	async function copyCode() {
		if (copyTimer) clearTimeout(copyTimer);
		try {
			await navigator.clipboard.writeText(code);
		} catch {
			// 非安全上下文等场景的兜底：临时文本框 + execCommand
			const textarea = document.createElement('textarea');
			textarea.value = code;
			textarea.style.position = 'fixed';
			textarea.style.opacity = '0';
			document.body.appendChild(textarea);
			textarea.select();
			document.execCommand('copy');
			textarea.remove();
		}
		copied = true;
		copyTimer = setTimeout(() => {
			copied = false;
			copyTimer = undefined;
		}, 1600);
	}
</script>

<div class="source-code">
	<ZenlessScrollbar fixed={false} class="source-code-scroll">
		<div class:is-visible={!collapse || open} class="source-code-content">
			<!-- code 来源于仓库源码提取，且 Prism.highlight 会对文本转义，仅生成 token 包裹标签 -->
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			<pre class="language-svelte"><code>{@html highlighted}</code></pre>
		</div>
	</ZenlessScrollbar>
	{#if !collapse || open}
		<button
			type="button"
			class:is-copied={copied}
			class="source-code-copy"
			title="粘贴"
			aria-label="粘贴"
			onclick={copyCode}
		>
			{#if copied}
				<svg viewBox="0 0 24 24" aria-hidden="true"
					><polyline points="20 6 9 17 4 12"></polyline></svg
				>
			{:else}
				<svg viewBox="0 0 24 24" aria-hidden="true"
					><rect x="9" y="9" width="12" height="12" rx="2"></rect><path
						d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
					></path></svg
				>
			{/if}
		</button>
	{/if}
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
		position: relative;
		width: 100%;
		margin-top: 30px;
	}

	.source-code-copy {
		position: absolute;
		top: 6px;
		right: 30px;
		z-index: 2;
		display: flex;
		width: 28px;
		height: 28px;
		align-items: center;
		justify-content: center;
		padding: 0;
		border: 1px solid #323232;
		border-radius: 9999px;
		color: #808080;
		background: #1c1c1c;
		cursor: pointer;
	}

	.source-code-copy:hover,
	.source-code-copy:focus-visible {
		border-color: #4a4a4a;
		color: #fff;
	}

	.source-code-copy.is-copied {
		border-color: #00cc0d;
		color: #00cc0d;
	}

	.source-code-copy svg {
		width: 16px;
		height: 16px;
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
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

	.source-code :global(.token.comment),
	.source-code :global(.token.prolog),
	.source-code :global(.token.doctype),
	.source-code :global(.token.cdata) {
		color: #7d8590;
	}

	.source-code :global(.token.punctuation) {
		color: #8b949e;
	}

	.source-code :global(.token.tag),
	.source-code :global(.token.selector) {
		color: #7ee787;
	}

	.source-code :global(.token.attr-name),
	.source-code :global(.token.property),
	.source-code :global(.token.boolean),
	.source-code :global(.token.number),
	.source-code :global(.token.constant),
	.source-code :global(.token.symbol) {
		color: #79c0ff;
	}

	.source-code :global(.token.attr-value),
	.source-code :global(.token.string),
	.source-code :global(.token.char),
	.source-code :global(.token.regex) {
		color: #a5d6ff;
	}

	.source-code :global(.token.operator),
	.source-code :global(.token.entity),
	.source-code :global(.token.url),
	.source-code :global(.token.variable) {
		color: #ff7b72;
	}

	.source-code :global(.token.keyword) {
		color: #ff7b72;
	}

	.source-code :global(.token.function),
	.source-code :global(.token.class-name),
	.source-code :global(.token.maybe-class-name) {
		color: #d2a8ff;
	}

	.source-code :global(.token.important),
	.source-code :global(.token.bold) {
		font-weight: 700;
	}

	.source-code :global(.token.italic) {
		font-style: italic;
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
