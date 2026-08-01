<script lang="ts">
	import type { Snippet } from 'svelte';
	import { ZenlessMessageHost, ZenlessOverlayHost, ZenlessProvider } from '$lib/index.js';
	import '$lib/styles.css';
	let { children }: { children: Snippet } = $props();
</script>

<ZenlessProvider>
	<ZenlessOverlayHost>
		<ZenlessMessageHost>{@render children()}</ZenlessMessageHost>
	</ZenlessOverlayHost>
</ZenlessProvider>
