<script lang="ts">
	import { resolve } from '$app/paths';
	import { ZenlessPlaceholder } from '$lib/index.js';
</script>

<svelte:head>
	<title>Zenless UI Svelte</title>
	<meta name="description" content="Zenless UI 的 Svelte 5 组件库迁移开发站。" />
</svelte:head>

<main>
	<h1>Zenless UI Svelte</h1>
	<p>40 个 Svelte 5 组件、主题与国际化基础设施已经完成迁移。</p>
	<ZenlessPlaceholder
		>Provider, theme tokens, locale, actions, SSR, and consumer smoke checks are enabled.</ZenlessPlaceholder
	>
	<p>
		<a href={resolve('/getting-started')}>快速开始</a> ·
		<a href={resolve('/components')}>组件示例</a>
	</p>
</main>

<style>
	main {
		max-width: 48rem;
		margin: 0 auto;
		padding: 4rem 1.5rem;
	}

	:global(.zenless-ui-placeholder) {
		margin-top: 1.5rem;
		padding: 1rem;
		border: 1px solid currentColor;
		border-radius: 0.5rem;
	}
</style>
