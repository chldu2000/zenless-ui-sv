<script lang="ts">
	import ZenlessPlaceholder from '$lib/ZenlessPlaceholder.svelte';
	import '$lib/styles.css';
</script>

<svelte:head>
	<title>Zenless UI Svelte</title>
	<meta name="description" content="Zenless UI 的 Svelte 5 组件库迁移开发站。" />
</svelte:head>

<main>
	<h1>Zenless UI Svelte</h1>
	<p>组件库骨架已就绪；组件迁移将按计划分阶段完成。</p>
	<ZenlessPlaceholder
		>Package, type-check, test, SSR, and consumer smoke checks are enabled.</ZenlessPlaceholder
	>
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
