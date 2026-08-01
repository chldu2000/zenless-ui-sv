<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import ZenlessRadio from './ZenlessRadio.svelte';
	let { checked = $bindable(false), ...props }: ComponentProps<typeof ZenlessRadio> = $props();
</script>

<ZenlessRadio bind:checked {...props} mode="checkbox" shape="button" />
