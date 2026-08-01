<script lang="ts">
	import { ZenlessTable, ZenlessTableColumn } from '$lib/index.js';

	let { value }: { value?: string } = $props();
	const rows = $derived(value ? [{ name: '回调', description: value }] : []);
</script>

{#if rows.length}
	<h2 class="component-header">Callbacks</h2>
	<ZenlessTable data={rows} rowKey="name" class="component-api-table">
		<ZenlessTableColumn prop="name" label="事件名" width="32%" />
		<ZenlessTableColumn prop="description" label="回调参数" />
	</ZenlessTable>
{/if}
