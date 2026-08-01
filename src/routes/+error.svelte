<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
</script>

<main>
	<h1>{page.status}</h1>
	<p>{page.error?.message ?? '页面不存在'}</p>
	<a href={resolve('/')}>返回首页</a>
</main>

<style>
	main {
		max-width: 40rem;
		margin: 0 auto;
		padding: 5rem 1.5rem;
		text-align: center;
	}
</style>
