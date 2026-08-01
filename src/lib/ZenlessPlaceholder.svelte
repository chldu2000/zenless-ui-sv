<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="zenless-ui-placeholder" data-library="zenless-ui-svelte">
	{@render children?.()}
</div>
