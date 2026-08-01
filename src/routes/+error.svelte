<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { ZenlessButton } from '$lib/index.js';
</script>

<svelte:head><title>{page.status} | Zenless UI Svelte</title></svelte:head>

<main class="component error-page">
	<h1>{page.status}</h1>
	<h2>页面似乎找不到了 ╲[ o_x ]╱</h2>
	<p>{page.error?.message ?? 'Page not found'}</p>
	<a href={resolve('/')}><ZenlessButton>回到首页</ZenlessButton></a>
</main>

<style>
	main {
		display: grid;
		min-height: calc(100vh - 10rem);
		align-content: center;
		justify-items: center;
		text-align: center;
	}
	h1 {
		margin: 0;
		font-size: clamp(4rem, 11vw, 7rem);
		font-style: italic;
		line-height: 1;
	}
	h2 {
		margin: 1.5rem 0 0.25rem;
		font-size: clamp(1.4rem, 4vw, 2rem);
	}
	p {
		margin: 0 0 2rem;
		color: #d0d0d0;
	}
	a {
		text-decoration: none;
	}
</style>
