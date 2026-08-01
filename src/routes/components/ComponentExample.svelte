<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import {
		ZenlessBacktop,
		ZenlessBadge,
		ZenlessButton,
		ZenlessCard,
		ZenlessCheckbox,
		ZenlessCheckboxButton,
		ZenlessCheckboxGroup,
		ZenlessCollapse,
		ZenlessCollapseItem,
		ZenlessDrawer,
		ZenlessDropdown,
		ZenlessDropdownItem,
		ZenlessForm,
		ZenlessFormItem,
		ZenlessIcon,
		ZenlessInput,
		ZenlessLink,
		ZenlessMenu,
		ZenlessMenuItem,
		ZenlessMessage,
		ZenlessMessageHost,
		ZenlessModal,
		ZenlessOption,
		ZenlessPagination,
		ZenlessPattern,
		ZenlessProgress,
		ZenlessRadio,
		ZenlessRadioButton,
		ZenlessRadioGroup,
		ZenlessScrollbar,
		ZenlessSelect,
		ZenlessSlider,
		ZenlessSubMenu,
		ZenlessSwitch,
		ZenlessTable,
		ZenlessTableColumn,
		ZenlessTabPanel,
		ZenlessTabs,
		ZenlessTag,
		ZenlessTextarea,
		ZenlessTooltip
	} from '$lib/index.js';
	import DemoMessageButton from './DemoMessageButton.svelte';
	let { slug }: { slug: string } = $props();
	let text = $state('New Eridu');
	let checked = $state(true);
	let checks = $state<(string | number | boolean)[]>(['anby']);
	let choice = $state<string | number | boolean>('anby');
	let page = $state(1);
	let collapse = $state<string | number | (string | number)[]>('one');
	let tab = $state<string | number>('one');
	let menu = $state<string | number>('home');
	let selected = $state<string | number | boolean>('anby');
	let slider = $state(40);
	let modal = $state(false);
	let drawer = $state(false);
	let scroller: HTMLDivElement | undefined = $state();
	const captureScroller: Attachment<HTMLDivElement> = (node) => {
		scroller = node;
		return () => {
			if (scroller === node) scroller = undefined;
		};
	};
	const rows = [
		{ name: '安比', role: '击破' },
		{ name: '妮可', role: '支援' }
	];
</script>

<section class="demo" aria-label={`${slug} example`}>
	{#if slug === 'backtop'}
		<div class="scroll-demo" {@attach captureScroller}>
			<div class="tall">向下滚动查看返回顶部</div>
		</div>
		<ZenlessBacktop target={scroller} visibleHeight={40} />
	{:else if slug === 'badge'}
		<ZenlessBadge value={8}><ZenlessButton>消息</ZenlessButton></ZenlessBadge>
	{:else if slug === 'button'}
		<ZenlessButton type="primary" icon="check">确认</ZenlessButton>
		<ZenlessButton disabled>禁用</ZenlessButton>
	{:else if slug === 'card'}
		<ZenlessCard title="代理人档案" content="欢迎来到新艾利都。" />
	{:else if slug === 'checkbox'}
		<ZenlessCheckbox bind:checked>单项</ZenlessCheckbox><ZenlessCheckboxGroup bind:value={checks}
			><ZenlessCheckboxButton value="anby">安比</ZenlessCheckboxButton><ZenlessCheckbox
				value="nicole">妮可</ZenlessCheckbox
			></ZenlessCheckboxGroup
		>
	{:else if slug === 'collapse'}
		<ZenlessCollapse bind:value={collapse} accordion
			><ZenlessCollapseItem name="one" title="第一项">内容</ZenlessCollapseItem><ZenlessCollapseItem
				name="off"
				title="禁用"
				disabled
			/></ZenlessCollapse
		>
	{:else if slug === 'drawer'}
		<ZenlessButton onclick={() => (drawer = true)}>打开抽屉</ZenlessButton><ZenlessDrawer
			bind:open={drawer}
			title="抽屉">抽屉内容</ZenlessDrawer
		>
	{:else if slug === 'dropdown'}
		<ZenlessDropdown trigger="click"
			>操作{#snippet content()}<ZenlessDropdownItem value="edit">编辑</ZenlessDropdownItem
				><ZenlessDropdownItem value="remove" disabled>删除</ZenlessDropdownItem
				>{/snippet}</ZenlessDropdown
		>
	{:else if slug === 'form'}
		<ZenlessForm
			><ZenlessFormItem label="名称" required><ZenlessInput bind:value={text} /></ZenlessFormItem
			></ZenlessForm
		>
	{:else if slug === 'icon'}
		<ZenlessIcon name="home" size={28} color="warning" aria-label="首页" />
	{:else if slug === 'input'}
		<ZenlessInput bind:value={text} clearable />
	{:else if slug === 'link'}
		<ZenlessLink href="/components" type="primary" underline>组件列表</ZenlessLink>
	{:else if slug === 'menu'}
		<ZenlessMenu bind:value={menu} accordion
			><ZenlessMenuItem name="home">首页</ZenlessMenuItem><ZenlessSubMenu title="代理人"
				><ZenlessMenuItem name="agents">列表</ZenlessMenuItem></ZenlessSubMenu
			></ZenlessMenu
		>
	{:else if slug === 'message'}
		<ZenlessMessageHost><DemoMessageButton /></ZenlessMessageHost><ZenlessMessage
			type="warning"
			message="静态消息"
		/>
	{:else if slug === 'modal'}
		<ZenlessButton onclick={() => (modal = true)}>打开 Modal</ZenlessButton><ZenlessModal
			bind:open={modal}
			title="确认操作">Modal 内容</ZenlessModal
		>
	{:else if slug === 'pagination'}
		<ZenlessPagination bind:value={page} total={80} pageSize={10} />
	{:else if slug === 'pattern'}
		<ZenlessPattern type="rhombus" class="pattern-demo">Pattern</ZenlessPattern>
	{:else if slug === 'progress'}
		<ZenlessProgress percent={65} color="electric" />
	{:else if slug === 'radio'}
		<ZenlessRadioGroup bind:value={choice}
			><ZenlessRadio value="anby">安比</ZenlessRadio><ZenlessRadioButton value="nicole"
				>妮可</ZenlessRadioButton
			></ZenlessRadioGroup
		>
	{:else if slug === 'scrollbar'}
		<div class="scrollbar-demo">
			<ZenlessScrollbar fixed><div class="wide">可滚动内容</div></ZenlessScrollbar>
		</div>
	{:else if slug === 'select'}
		<ZenlessSelect bind:value={selected} clearable
			><ZenlessOption value="anby" label="安比" /><ZenlessOption
				value="nicole"
				label="妮可"
			/><ZenlessOption value="off" label="禁用" disabled /></ZenlessSelect
		>
	{:else if slug === 'slider'}
		<ZenlessSlider bind:value={slider} step={10} tooltip /><output>{slider}</output>
	{:else if slug === 'switch'}
		<ZenlessSwitch bind:checked />
	{:else if slug === 'table'}
		<ZenlessTable data={rows} rowKey="name"
			><ZenlessTableColumn prop="name" label="代理人" /><ZenlessTableColumn
				prop="role"
				label="定位"
			/></ZenlessTable
		>
	{:else if slug === 'tabs'}
		<ZenlessTabs bind:value={tab}
			><ZenlessTabPanel name="one" label="概览">第一面板</ZenlessTabPanel><ZenlessTabPanel
				name="two"
				label="详情"
				lazy>第二面板</ZenlessTabPanel
			></ZenlessTabs
		>
	{:else if slug === 'tag'}
		<ZenlessTag type="ether" closable>Ether</ZenlessTag>
	{:else if slug === 'textarea'}
		<ZenlessTextarea bind:value={text} autoSize />
	{:else if slug === 'tooltip'}
		<ZenlessTooltip content="提示内容" placement="top"
			><ZenlessButton>悬停</ZenlessButton></ZenlessTooltip
		>
	{/if}
</section>

<style>
	.demo {
		margin: 2rem 0;
		padding: 1.25rem;
		border: 1px solid var(--zenless-border);
		border-radius: 0.75rem;
	}
	.scroll-demo {
		width: 100%;
		height: 120px;
		overflow: auto;
	}
	.tall {
		height: 400px;
	}
	.scrollbar-demo {
		width: 280px;
		height: 120px;
	}
	.wide {
		width: 600px;
		height: 240px;
		padding: 1rem;
	}
	:global(.pattern-demo) {
		padding: 2rem;
	}
	:global(.z-card) {
		max-width: 22rem;
	}
</style>
