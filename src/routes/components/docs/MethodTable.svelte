<script lang="ts">
	let { value }: { value?: string } = $props();
</script>

{#if value}<table>
		<caption>实例方法</caption><tbody><tr><th>方法</th><td><code>{value}</code></td></tr></tbody>
	</table>{/if}
