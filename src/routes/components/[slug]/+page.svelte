<script lang="ts">
	import { resolve } from '$app/paths';
	import ComponentExample from '../ComponentExample.svelte';
	import AttributeTable from '../docs/AttributeTable.svelte';
	import EventTable from '../docs/EventTable.svelte';
	import MethodTable from '../docs/MethodTable.svelte';
	import SlotTable from '../docs/SlotTable.svelte';
	import SourceCode from '../docs/SourceCode.svelte';
	let { data } = $props();
</script>

<svelte:head><title>{data.meta.title} | Zenless UI Svelte</title></svelte:head>
<main>
	<a href={resolve('/components')}>← 全部组件</a>
	<h1>{data.meta.title}</h1>
	<p>{data.meta.summary}</p>
	<ComponentExample slug={data.meta.slug} />
	<SourceCode code={`<${data.meta.components[0]} />`} />
	<h2>API</h2>
	<AttributeTable
		rows={[{ name: data.meta.bindable ?? 'props', description: data.meta.summary }]}
	/>
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
	main {
		max-width: 52rem;
		margin: 0 auto;
		padding: 3rem 1.5rem;
		color: var(--zenless-foreground);
	}
	dl {
		display: grid;
		grid-template-columns: 7rem 1fr;
		gap: 0.75rem;
		padding: 1rem;
		border: 1px solid var(--zenless-border);
		border-radius: 0.75rem;
	}
	dt {
		font-weight: 700;
	}
	dd {
		margin: 0;
	}
</style>
