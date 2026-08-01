<script lang="ts">
	import ZenlessModal, { type ZenlessModalProps } from './ZenlessModal.svelte';
	let {
		children,
		titleContent,
		footer,
		open = $bindable(false),
		...rest
	}: ZenlessModalProps = $props();
</script>

<ZenlessModal mode="drawer" {children} {titleContent} {footer} bind:open {...rest} />
