<script lang="ts">
	import type { Snippet } from 'svelte';
	import {
		enUs,
		ZenlessMessageHost,
		ZenlessOverlayHost,
		ZenlessProvider,
		zhCn
	} from '$lib/index.js';
	import SiteShell from './SiteShell.svelte';
	import '$lib/styles.css';
	import './site.css';
	let { children }: { children: Snippet } = $props();
	let isBold = $state(false);
	let isItalic = $state(true);
	let translated = $state(false);
	const locale = $derived(translated ? enUs : zhCn);
</script>

<ZenlessProvider {isBold} {isItalic} {locale}>
	<ZenlessOverlayHost>
		<ZenlessMessageHost
			><SiteShell bind:isBold bind:isItalic bind:translated>{@render children()}</SiteShell
			></ZenlessMessageHost
		>
	</ZenlessOverlayHost>
</ZenlessProvider>
