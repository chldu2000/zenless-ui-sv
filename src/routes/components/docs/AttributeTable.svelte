<script lang="ts">
	export interface AttributeRow {
		name: string;
		description: string;
	}
	let { rows = [] }: { rows?: AttributeRow[] } = $props();
</script>

{#if rows.length}<table>
		<caption>Props 与绑定</caption><thead><tr><th>名称</th><th>说明</th></tr></thead><tbody
			>{#each rows as row (row.name)}<tr
					><td><code>{row.name}</code></td><td>{row.description}</td></tr
				>{/each}</tbody
		>
	</table>{/if}
