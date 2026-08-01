<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import ZenlessRadio from './ZenlessRadio.svelte';
	let props: ComponentProps<typeof ZenlessRadio> = $props();
</script>

<ZenlessRadio {...props} mode="checkbox" />
