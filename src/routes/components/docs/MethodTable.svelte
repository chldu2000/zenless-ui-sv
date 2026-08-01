<script lang="ts">
	import { ZenlessTable, ZenlessTableColumn } from '$lib/index.js';
	import { componentApiDocs } from '../component-api.js';

	let { components = [] }: { components?: string[] } = $props();
	const groups = $derived(
		components
			.map((component) => ({ component, rows: componentApiDocs[component]?.methods ?? [] }))
			.filter((group) => group.rows.length)
	);
</script>

{#each groups as group (group.component)}
	<section class="component-api-section" data-component={group.component} data-kind="methods">
		<h2 class="component-header">{group.component} Methods</h2>
		<div class="component-table-wrap">
			<ZenlessTable data={group.rows} rowKey="name" class="component-api-table">
				<ZenlessTableColumn prop="name" label="方法名" width="32%" />
				<ZenlessTableColumn prop="description" label="说明" />
			</ZenlessTable>
		</div>
	</section>
{/each}
