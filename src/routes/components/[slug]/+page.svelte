<script lang="ts">
	import { resolve } from '$app/paths';
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
	<a class="component-breadcrumb" href={resolve('/components')}>组件总览 / Components</a>
	<h1 class="component-title">{data.meta.title}</h1>
	<p class="component-content">{data.meta.summary}</p>
	<ComponentExample slug={data.meta.slug} />
	<SourceCode code={source} />
	<h2 class="component-header">API</h2>
	<AttributeTable rows={propRows} />
	<EventTable value={data.meta.callbacks} />
	<MethodTable
		value={data.meta.slug === 'scrollbar' ? 'getScrollTarget() / scrollTo()' : undefined}
	/>
	<SlotTable value={data.meta.snippets} />
	<dl>
		<dt>组件</dt>
		<dd>{data.meta.components.join('、')}</dd>
		{#if data.meta.bindable}<dt>绑定</dt>
			<dd>{data.meta.bindable}</dd>{/if}
		{#if data.meta.callbacks}<dt>回调</dt>
			<dd>{data.meta.callbacks}</dd>{/if}
		{#if data.meta.snippets}<dt>Snippets</dt>
			<dd>{data.meta.snippets}</dd>{/if}
		{#if data.meta.keyboard}<dt>键盘</dt>
			<dd>{data.meta.keyboard}</dd>{/if}
		<dt>主题</dt>
		<dd>使用全局 <code>--zenless-*</code> tokens，并保留对应 <code>z-*</code> 类名。</dd>
	</dl>
</main>

<style>
	.component-breadcrumb {
		display: inline-block;
		margin-bottom: 1rem;
		font-size: 0.82rem;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}
	dl {
		display: grid;
		grid-template-columns: 7rem 1fr;
		gap: 0.75rem;
		padding: 1rem;
		border: 1px solid var(--zenless-border);
		border-radius: 1rem;
		background: rgb(20 20 20 / 82%);
	}
	dt {
		font-weight: 700;
	}
	dd {
		margin: 0;
	}
</style>
