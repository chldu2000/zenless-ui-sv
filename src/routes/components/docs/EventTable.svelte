<script lang="ts">
	let { value }: { value?: string } = $props();
</script>

{#if value}<table>
		<caption>Callbacks</caption><tbody><tr><th>回调</th><td><code>{value}</code></td></tr></tbody>
	</table>{/if}
