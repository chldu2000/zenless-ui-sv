<script lang="ts">
	export interface AttributeRow {
		name: string;
		description: string;
	}
	let { rows = [] }: { rows?: AttributeRow[] } = $props();
</script>

{#if rows.length}<table>
		<caption>Props、类型与默认值</caption><thead><tr><th>组件</th><th>公共 Props</th></tr></thead
		><tbody
			>{#each rows as row (row.name)}<tr
					><td><code>{row.name}</code></td><td>{row.description}</td></tr
				>{/each}</tbody
		>
	</table>{/if}
