<script lang="ts">
	import { ZenlessTable, ZenlessTableColumn } from '$lib/index.js';
	import { componentApiDocs } from '../component-api.js';

	let { components = [] }: { components?: string[] } = $props();
	const groups = $derived(
		components
			.map((component) => ({ component, rows: componentApiDocs[component]?.events ?? [] }))
			.filter((group) => group.rows.length)
	);
</script>

{#each groups as group (group.component)}
	<section class="component-api-section" data-component={group.component} data-kind="events">
		<h2 class="component-header">{group.component} Events</h2>
		<div class="component-table-wrap">
			<ZenlessTable data={group.rows} rowKey="name" class="component-api-table">
				<ZenlessTableColumn prop="name" label="事件名" width="24%" />
				<ZenlessTableColumn prop="description" label="说明" width="46%" />
				<ZenlessTableColumn prop="parameters" label="回调参数" width="30%" />
			</ZenlessTable>
		</div>
	</section>
{/each}
