<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		ZenlessBadge,
		ZenlessButton,
		ZenlessCard,
		ZenlessIcon,
		ZenlessLink,
		ZenlessPattern,
		ZenlessProgress,
		ZenlessTag
	} from '$lib/index.js';
	import '$lib/styles.css';
</script>

<svelte:head>
	<title>展示组件 | Zenless UI Svelte</title>
	<meta name="description" content="Zenless UI Svelte 展示组件示例。" />
</svelte:head>

<main>
	<a href={resolve('/')}>← 返回首页</a>
	<h1>展示组件</h1>
	<section aria-labelledby="button-heading">
		<h2 id="button-heading">Button / Link / Icon</h2>
		<ZenlessButton type="primary" icon="check">确认</ZenlessButton>
		<ZenlessButton type="fire" hollow>Fire</ZenlessButton>
		<ZenlessLink type="electric" underline href="/components">组件文档</ZenlessLink>
		<ZenlessIcon name="home" color="warning" size={22} aria-label="首页" />
	</section>
	<section aria-labelledby="feedback-heading">
		<h2 id="feedback-heading">Tag / Badge / Progress</h2>
		<ZenlessTag type="ether" closable>Ether</ZenlessTag>
		<ZenlessBadge value={8} type="primary"><ZenlessTag>消息</ZenlessTag></ZenlessBadge>
		<ZenlessProgress percent={65} color="electric" />
		<ZenlessProgress type="circle" percent={75} color="fire">75%</ZenlessProgress>
	</section>
	<section aria-labelledby="surface-heading">
		<h2 id="surface-heading">Card / Pattern</h2>
		<ZenlessPattern type="stripes" class="pattern"
			><ZenlessCard title="代理人档案" content="欢迎来到新艾利都。" /></ZenlessPattern
		>
	</section>
</main>

<style>
	main {
		max-width: 48rem;
		margin: 0 auto;
		padding: 3rem 1.5rem;
		color: var(--zenless-foreground);
	}
	section {
		display: grid;
		gap: 1rem;
		margin-top: 2rem;
		padding: 1.25rem;
		border: 1px solid var(--zenless-border);
		border-radius: 0.75rem;
	}
	h2 {
		margin: 0;
		font-size: 1.15rem;
	}
	:global(.z-progress) {
		max-width: 20rem;
	}
	:global(.pattern) {
		padding: 1rem;
	}
	:global(.z-card) {
		max-width: 20rem;
	}
</style>
