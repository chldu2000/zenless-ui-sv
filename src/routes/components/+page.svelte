<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		ZenlessBadge,
		ZenlessButton,
		ZenlessCard,
		ZenlessCollapse,
		ZenlessCollapseItem,
		ZenlessDropdown,
		ZenlessDropdownItem,
		ZenlessIcon,
		ZenlessLink,
		ZenlessMenu,
		ZenlessMenuItem,
		ZenlessModal,
		ZenlessOption,
		ZenlessPattern,
		ZenlessProgress,
		ZenlessSelect,
		ZenlessSlider,
		ZenlessSubMenu,
		ZenlessTabPanel,
		ZenlessTabs,
		ZenlessTable,
		ZenlessTableColumn,
		ZenlessTag
	} from '$lib/index.js';
	import '$lib/styles.css';
	import { componentDocs } from './component-meta.js';
	let tab = $state<string | number>('overview');
	let menu = $state<string | number>('home');
	let agent = $state<string | number | boolean>();
	let modalOpen = $state(false);
	let sliderValue = $state(30);
	const agents = [
		{ name: '安比', role: '击破' },
		{ name: '妮可', role: '支援' }
	];
</script>

<svelte:head>
	<title>展示组件 | Zenless UI Svelte</title>
	<meta name="description" content="Zenless UI Svelte 展示组件示例。" />
</svelte:head>

<main class="component docs-overview">
	<h1 class="component-title">组件总览</h1>
	<p class="component-content">按功能浏览全部 Svelte 组件，或从左侧导航进入完整 API 页面。</p>
	<nav class="component-index" aria-label="组件示例">
		{#each componentDocs as doc (doc.slug)}<a
				href={resolve('/components/[slug]', { slug: doc.slug })}>{doc.title}</a
			>{/each}
	</nav>
	<section aria-labelledby="button-heading">
		<h2 id="button-heading">Button / Link / Icon</h2>
		<ZenlessButton type="primary" icon="check">确认</ZenlessButton>
		<ZenlessButton type="fire" hollow>Fire</ZenlessButton>
		<ZenlessLink type="electric" underline href={resolve('/components')}>组件文档</ZenlessLink>
		<ZenlessIcon name="home" color="warning" size={22} aria-label="首页" />
	</section>
	<section aria-labelledby="advanced-heading">
		<h2 id="advanced-heading">Modal / Slider / Table</h2>
		<ZenlessButton onclick={() => (modalOpen = true)}>打开 Modal</ZenlessButton>
		<ZenlessModal bind:open={modalOpen} title="代理人详情"
			><button type="button">对话框内容</button></ZenlessModal
		>
		<ZenlessSlider bind:value={sliderValue} step={10} tooltip />
		<output>Slider: {sliderValue}</output>
		<ZenlessTable data={agents} rowKey="name">
			<ZenlessTableColumn prop="name" label="代理人" />
			<ZenlessTableColumn prop="role" label="定位" />
		</ZenlessTable>
	</section>
	<section aria-labelledby="feedback-heading">
		<h2 id="feedback-heading">Tag / Badge / Progress</h2>
		<ZenlessTag type="ether" closable>Ether</ZenlessTag>
		<ZenlessBadge value={8} type="primary"><ZenlessTag>消息</ZenlessTag></ZenlessBadge>
		<ZenlessProgress percent={65} color="electric" />
		<ZenlessProgress type="circle" percent={75} color="fire">75%</ZenlessProgress>
	</section>
	<section aria-labelledby="surface-heading">
		<h2 id="surface-heading">Card / Pattern</h2>
		<ZenlessPattern type="stripes" class="pattern"
			><ZenlessCard title="代理人档案" content="欢迎来到新艾利都。" /></ZenlessPattern
		>
	</section>
	<section aria-labelledby="navigation-heading">
		<h2 id="navigation-heading">Collapse / Tabs / Menu</h2>
		<ZenlessCollapse value="intro" accordion>
			<ZenlessCollapseItem name="intro" title="迁移说明"
				>Svelte 5 runes 组件 API</ZenlessCollapseItem
			>
			<ZenlessCollapseItem name="disabled" title="禁用项" disabled />
		</ZenlessCollapse>
		<ZenlessTabs bind:value={tab}>
			<ZenlessTabPanel name="overview" label="概览">组合组件支持动态注册。</ZenlessTabPanel>
			<ZenlessTabPanel name="api" label="API" lazy>通过 bind:value 双向绑定。</ZenlessTabPanel>
		</ZenlessTabs>
		<div class="navigation-grid">
			<ZenlessMenu bind:value={menu} accordion>
				<ZenlessMenuItem name="home">首页</ZenlessMenuItem>
				<ZenlessSubMenu title="代理人">
					<ZenlessMenuItem name="anby">安比</ZenlessMenuItem>
				</ZenlessSubMenu>
			</ZenlessMenu>
			<div class="selection">
				<ZenlessSelect bind:value={agent} clearable placeholder="选择代理人">
					<ZenlessOption value="anby" label="安比" />
					<ZenlessOption value="nicole" label="妮可" />
				</ZenlessSelect>
				<ZenlessDropdown trigger="click">
					更多操作
					{#snippet content()}
						<ZenlessDropdownItem value="edit">编辑</ZenlessDropdownItem>
						<ZenlessDropdownItem value="delete" disabled>删除</ZenlessDropdownItem>
					{/snippet}
				</ZenlessDropdown>
			</div>
		</div>
	</section>
</main>

<style>
	section {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 1rem;
		margin-top: 2rem;
		padding: 1.9rem;
		border-radius: 1rem;
		background: #222;
		box-shadow: inset 0 1px 3px #333;
	}
	.component-index {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: 1.5rem 0;
	}
	.component-index a {
		padding: 0.4rem 0.75rem;
		border: 1px solid var(--zenless-border);
		border-radius: 999px;
	}
	h2 {
		width: 100%;
		margin: 0;
		font-size: 1.2rem;
	}
	:global(.z-progress) {
		max-width: 20rem;
	}
	:global(.pattern) {
		padding: 1rem;
	}
	:global(.z-card) {
		max-width: 20rem;
	}
	.navigation-grid {
		display: grid;
		width: 100%;
		grid-template-columns: minmax(14rem, 1fr) minmax(14rem, 1fr);
		gap: 1rem;
	}
	.selection {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
	}
	@media (width < 40rem) {
		.navigation-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
