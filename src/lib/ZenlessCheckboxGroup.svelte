<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import ZenlessRadioGroup from './ZenlessRadioGroup.svelte';
	let { value = $bindable(), ...props }: ComponentProps<typeof ZenlessRadioGroup> = $props();
</script>

<ZenlessRadioGroup bind:value {...props} mode="checkbox" />
