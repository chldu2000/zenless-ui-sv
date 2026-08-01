<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<svelte:head><title>快速开始 | Zenless UI Svelte</title></svelte:head>
<main>
	<a href={resolve('/')}>← 首页</a>
	<h1>快速开始</h1>
	<h2>安装</h2>
	<pre><code>pnpm add zenless-ui-svelte</code></pre>
	<h2>引入</h2>
	<pre><code
			>{`import { ZenlessButton } from 'zenless-ui-svelte';
import 'zenless-ui-svelte/styles.css';`}</code
		></pre>
	<p>
		应用根部可组合 ZenlessProvider、ZenlessOverlayHost 和 ZenlessMessageHost；所有组件支持 SvelteKit
		SSR。
	</p>
	<a href={resolve('/components')}>查看组件示例</a>
</main>

<style>
	main {
		max-width: 48rem;
		margin: 0 auto;
		padding: 3rem 1.5rem;
	}
	pre {
		overflow: auto;
		padding: 1rem;
		border-radius: 0.5rem;
		background: #111;
		color: #fff;
	}
</style>
