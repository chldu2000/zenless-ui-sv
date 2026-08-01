<script lang="ts">
	import { ZenlessButton, ZenlessPlaceholder, ZenlessProgress } from 'zenless-ui-svelte';
	import 'zenless-ui-svelte/styles.css';
</script>

<svelte:head>
	<title>SvelteKit consumer</title>
</svelte:head>

<ZenlessPlaceholder>SvelteKit SSR consumer</ZenlessPlaceholder>
<ZenlessButton type="primary">SSR Button</ZenlessButton>
<ZenlessProgress percent={50} color="success" />
