<script lang="ts">
	import { ZenlessTable, ZenlessTableColumn } from '$lib/index.js';
	import { componentApiDocs } from '../component-api.js';

	let { components = [] }: { components?: string[] } = $props();
	const groups = $derived(
		components
			.map((component) => ({ component, rows: componentApiDocs[component]?.attributes ?? [] }))
			.filter((group) => group.rows.length)
	);
</script>

{#each groups as group, index (group.component)}
	<section class="component-api-section" data-component={group.component} data-kind="attributes">
		<h2 class="component-header">{index === 0 ? 'Attributes' : `${group.component} Attributes`}</h2>
		<div class="component-table-wrap">
			<ZenlessTable data={group.rows} rowKey="name" class="component-api-table">
				<ZenlessTableColumn prop="name" label="参数" width="18%" />
				<ZenlessTableColumn prop="description" label="说明" width="30%" />
				<ZenlessTableColumn prop="type" label="类型" width="20%" />
				<ZenlessTableColumn prop="values" label="可选值" width="20%" />
				<ZenlessTableColumn prop="default" label="默认值" width="12%" />
			</ZenlessTable>
		</div>
	</section>
{/each}
