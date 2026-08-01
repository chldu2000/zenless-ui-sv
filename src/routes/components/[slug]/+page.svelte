<script lang="ts">
	import ComponentExample from '../ComponentExample.svelte';
	import AttributeTable from '../docs/AttributeTable.svelte';
	import EventTable from '../docs/EventTable.svelte';
	import MethodTable from '../docs/MethodTable.svelte';
	import SlotTable from '../docs/SlotTable.svelte';
	let { data } = $props();
</script>

<svelte:head><title>{data.meta.title} | Zenless UI Svelte</title></svelte:head>
<main class="component docs-component-page">
	<h1 class="component-title">{data.meta.title}</h1>
	<ComponentExample slug={data.meta.slug} />
	<AttributeTable components={data.meta.components} />
	<EventTable components={data.meta.components} />
	<MethodTable components={data.meta.components} />
	<SlotTable components={data.meta.components} />
</main>
