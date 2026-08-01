<script lang="ts">
	import type { Snippet } from 'svelte';
	import { ZenlessMessageHost, ZenlessOverlayHost, ZenlessProvider } from '$lib/index.js';
	import SiteShell from './SiteShell.svelte';
	import '$lib/styles.css';
	import './site.css';
	let { children }: { children: Snippet } = $props();
	let isBold = $state(false);
	let isItalic = $state(true);
</script>

<ZenlessProvider {isBold} {isItalic}>
	<ZenlessOverlayHost>
		<ZenlessMessageHost
			><SiteShell bind:isBold bind:isItalic>{@render children()}</SiteShell></ZenlessMessageHost
		>
	</ZenlessOverlayHost>
</ZenlessProvider>
