<script lang="ts">
	let { value }: { value?: string } = $props();
</script>

{#if value}<table>
		<caption>Snippets</caption><tbody><tr><th>Snippet</th><td><code>{value}</code></td></tr></tbody>
	</table>{/if}
