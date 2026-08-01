<script lang="ts">
	import { ZenlessTable, ZenlessTableColumn } from '$lib/index.js';

	let { value }: { value?: string } = $props();
	const rows = $derived(value ? [{ name: '实例', description: value }] : []);
</script>

{#if rows.length}
	<h2 class="component-header">Methods</h2>
	<ZenlessTable data={rows} rowKey="name" class="component-api-table">
		<ZenlessTableColumn prop="name" label="方法" width="32%" />
		<ZenlessTableColumn prop="description" label="说明" />
	</ZenlessTable>
{/if}
