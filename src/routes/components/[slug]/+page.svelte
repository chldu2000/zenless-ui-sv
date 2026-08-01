<script lang="ts">
	import ComponentExample from '../ComponentExample.svelte';
	import AttributeTable from '../docs/AttributeTable.svelte';
	import EventTable from '../docs/EventTable.svelte';
	import MethodTable from '../docs/MethodTable.svelte';
	import SlotTable from '../docs/SlotTable.svelte';
	import SourceCode from '../docs/SourceCode.svelte';
	import { componentProps } from '../component-meta.js';
	let { data } = $props();
	const propRows = $derived(
		data.meta.components
			.filter((component: string) => componentProps[component])
			.map((component: string) => ({ name: component, description: componentProps[component] }))
	);
	const source = $derived(
		`import { ${data.meta.components.join(', ')} } from 'zenless-ui-svelte';\nimport 'zenless-ui-svelte/styles.css';\n\n<${data.meta.components[0]} />`
	);
</script>

<svelte:head><title>{data.meta.title} | Zenless UI Svelte</title></svelte:head>
<main class="component docs-component-page">
	<h1 class="component-title">{data.meta.title}</h1>
	<ComponentExample slug={data.meta.slug} />
	<SourceCode code={source} />
	<h2 class="component-header">API</h2>
	<AttributeTable rows={propRows} />
	<EventTable value={data.meta.callbacks} />
	<MethodTable
		value={data.meta.slug === 'scrollbar' ? 'getScrollTarget() / scrollTo()' : undefined}
	/>
	<SlotTable value={data.meta.snippets} />
</main>
