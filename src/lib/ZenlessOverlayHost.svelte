<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setOverlayHost, type ZenlessOverlayHostValue } from './overlay/context.js';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();
	const host: ZenlessOverlayHostValue = { element: null };
	setOverlayHost(host);

	function attachHost(element: HTMLDivElement) {
		host.element = element;
		return () => {
			if (host.element === element) host.element = null;
		};
	}
</script>

<div class="zenless-overlay-host" data-zenless-overlay-host {@attach attachHost}>
	{@render children?.()}
</div>
