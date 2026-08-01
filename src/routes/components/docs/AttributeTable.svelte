<script lang="ts">
	import { ZenlessTable, ZenlessTableColumn } from '$lib/index.js';

	export type AttributeRow = {
		name: string;
		description: string;
	} & Record<string, unknown>;
	let { rows = [] }: { rows?: AttributeRow[] } = $props();
</script>

{#if rows.length}
	<ZenlessTable data={rows} rowKey="name" class="component-api-table">
		<ZenlessTableColumn prop="name" label="组件" width="32%" />
		<ZenlessTableColumn prop="description" label="Props、类型与默认值" />
	</ZenlessTable>
{/if}
