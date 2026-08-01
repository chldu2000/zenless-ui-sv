<script lang="ts">
	import ZenlessModal, { type ZenlessModalProps } from './ZenlessModal.svelte';
	let { children, titleContent, footer, ...rest }: ZenlessModalProps = $props();
</script>

<ZenlessModal mode="drawer" {children} {titleContent} {footer} {...rest} />
