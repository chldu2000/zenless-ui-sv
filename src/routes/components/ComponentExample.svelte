<script lang="ts">
	import { base, resolve } from '$app/paths';
	import type { Attachment } from 'svelte/attachments';
	import componentExampleSource from './ComponentExample.svelte?raw';
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
	import DemoSection from './DemoSection.svelte';
	import { provideDemoSources } from './demo-source.js';

	let { slug }: { slug: string } = $props();
	provideDemoSources(componentExampleSource, () => slug);

	const colors = [
		{ value: 'default', label: '默认' },
		{ value: 'primary', label: '主要' },
		{ value: 'success', label: '成功' },
		{ value: 'info', label: '信息' },
		{ value: 'warning', label: '警告' },
		{ value: 'danger', label: '危险' }
	] as const;
	const factions = [
		{ value: 'ether', label: '以太' },
		{ value: 'fire', label: '火' },
		{ value: 'electric', label: '电' },
		{ value: 'ice', label: '冰' },
		{ value: 'physical', label: '物理' }
	] as const;
	const sizes = [
		{ value: 'extra', label: '超大' },
		{ value: 'large', label: '大号' },
		{ value: undefined, label: '默认' },
		{ value: 'small', label: '小号' },
		{ value: 'mini', label: '迷你' }
	] as const;
	const iconNames = [
		'success',
		'error',
		'caret-left',
		'caret-top',
		'caret-right',
		'caret-bottom',
		'loading',
		'info',
		'arrow-left',
		'arrow-top',
		'arrow-right',
		'arrow-bottom',
		'bold',
		'italic',
		'close',
		'check',
		'plus',
		'minus'
	];
	let formPosition = $state<string | number | boolean>('right');
	const labelPosition = $derived(formPosition as 'left' | 'right' | 'top');

	let text = $state('新艾利都');
	let password = $state('proxy-password');
	let checked = $state(true);
	let checks = $state<(string | number | boolean)[]>(['anby']);
	let checksWithLimit = $state<(string | number | boolean)[]>(['anby']);
	let choice = $state<string | number | boolean>('anby');
	let page = $state(1);
	let collapse = $state<string | number | (string | number)[]>(['one']);
	let accordion = $state<string | number | (string | number)[]>('one');
	let tab = $state<string | number>('basic');
	let menu = $state<string | number>('home');
	let selected = $state<string | number | boolean | undefined>(40);
	let slider = $state(40);
	let modal = $state(false);
	let modalFullscreen = $state(false);
	let drawer = $state(false);
	let drawerFullscreen = $state(false);
	let tags = $state(['狡兔屋', '白祇重工', '维多利亚家政']);
	let scroller: HTMLDivElement | undefined = $state();
	const captureScroller: Attachment<HTMLDivElement> = (node) => {
		scroller = node;
		return () => {
			if (scroller === node) scroller = undefined;
		};
	};
	const rows = [
		{ name: '安比', role: '击破', attribute: '电' },
		{ name: '妮可', role: '支援', attribute: '以太' },
		{ name: '比利', role: '强攻', attribute: '物理' }
	];
	const imageUrl = `${base}/zenless.png`;
</script>

<div class="component-examples" data-component={slug}>
	{#if slug === 'backtop'}
		<DemoSection title="基础用法">
			<div class="scroll-demo" {@attach captureScroller}>
				<div class="tall">在此区域向下滚动，再点击右下角按钮返回顶部。</div>
			</div>
			<ZenlessBacktop target={scroller} visibleHeight={0} right={24} bottom={24} />
		</DemoSection>
	{:else if slug === 'badge'}
		<DemoSection title="基础用法" dark>
			{#each [...colors, ...factions] as color (color.value)}
				<ZenlessBadge value={42} type={color.value}
					><ZenlessTag>{color.label}</ZenlessTag></ZenlessBadge
				>
			{/each}
		</DemoSection>
		<DemoSection title="小圆点" dark>
			{#each colors.slice(0, 5) as color (color.value)}
				<ZenlessBadge isDot type={color.value}><ZenlessTag>{color.label}</ZenlessTag></ZenlessBadge>
			{/each}
		</DemoSection>
	{:else if slug === 'button'}
		<DemoSection title="使用方法">
			{#each [...colors, ...factions] as color (color.value)}
				<ZenlessButton type={color.value}>{color.label}</ZenlessButton>
			{/each}
			<ZenlessButton highlight>高亮</ZenlessButton>
			{#each colors as color (color.value)}
				<ZenlessButton type={color.value} plain>{color.label}</ZenlessButton>
			{/each}
			{#each colors as color (color.value)}
				<ZenlessButton type={color.value} hollow>{color.label}</ZenlessButton>
			{/each}
			{#each [...colors, ...factions] as color (color.value)}
				<ZenlessButton circle icon="success" type={color.value} aria-label={color.label} />
			{/each}
		</DemoSection>
		<DemoSection title="禁用状态">
			{#each colors as color (color.value)}
				<ZenlessButton type={color.value} disabled>{color.label}</ZenlessButton>
				<ZenlessButton type={color.value} plain disabled>{color.label}</ZenlessButton>
				<ZenlessButton type={color.value} hollow disabled>{color.label}</ZenlessButton>
			{/each}
		</DemoSection>
		<DemoSection title="图标按钮">
			{#each colors as color (color.value)}
				<ZenlessButton icon="success" type={color.value}>{color.label}</ZenlessButton>
			{/each}
		</DemoSection>
		<DemoSection title="加载中">
			<ZenlessButton loading>加载中</ZenlessButton>
			<ZenlessButton loading type="primary">加载中</ZenlessButton>
			<ZenlessButton loading disabled>加载中</ZenlessButton>
		</DemoSection>
		<DemoSection title="不同尺寸">
			{#each sizes as size (size.label)}
				<ZenlessButton size={size.value}>{size.label}</ZenlessButton>
			{/each}
		</DemoSection>
	{:else if slug === 'card'}
		<DemoSection title="基础用法">
			<ZenlessCard
				image={imageUrl}
				imageAlt="Zenless UI"
				avatar={imageUrl}
				avatarAlt="Zenless UI"
				nickname="ZenlessUI"
				title="欢迎来到新艾利都"
				content="绳匠，请选择需要查看的代理人档案。"
			/>
		</DemoSection>
		<DemoSection title="自定义内容">
			<ZenlessCard class="custom-card">
				<div>自定义内容 1</div>
				<div>自定义内容 2</div>
				<div>自定义内容 3</div>
			</ZenlessCard>
		</DemoSection>
	{:else if slug === 'checkbox'}
		<DemoSection title="基础用法">
			<ZenlessCheckbox bind:checked>单项选择</ZenlessCheckbox>
		</DemoSection>
		<DemoSection title="禁用状态">
			<ZenlessCheckbox checked disabled>已选禁用</ZenlessCheckbox>
			<ZenlessCheckbox disabled>未选禁用</ZenlessCheckbox>
		</DemoSection>
		<DemoSection title="多选框组">
			<ZenlessCheckboxGroup bind:value={checks}>
				<ZenlessCheckbox value="anby">安比</ZenlessCheckbox>
				<ZenlessCheckbox value="nicole">妮可</ZenlessCheckbox>
				<ZenlessCheckbox value="billy">比利</ZenlessCheckbox>
			</ZenlessCheckboxGroup>
		</DemoSection>
		<DemoSection title="可选项目数量限制">
			<ZenlessCheckboxGroup bind:value={checksWithLimit} min={1} max={2}>
				<ZenlessCheckbox value="anby">安比</ZenlessCheckbox>
				<ZenlessCheckbox value="nicole">妮可</ZenlessCheckbox>
				<ZenlessCheckbox value="billy">比利</ZenlessCheckbox>
			</ZenlessCheckboxGroup>
		</DemoSection>
		<DemoSection title="半选状态">
			<ZenlessCheckbox indeterminate>全选</ZenlessCheckbox>
		</DemoSection>
		<DemoSection title="不同尺寸">
			{#each sizes as size (size.label)}
				<ZenlessCheckbox size={size.value}>{size.label}选项</ZenlessCheckbox>
			{/each}
		</DemoSection>
		<DemoSection title="按钮样式">
			<ZenlessCheckboxGroup bind:value={checks}>
				<ZenlessCheckboxButton value="anby">安比</ZenlessCheckboxButton>
				<ZenlessCheckboxButton value="nicole">妮可</ZenlessCheckboxButton>
			</ZenlessCheckboxGroup>
		</DemoSection>
	{:else if slug === 'collapse'}
		<DemoSection title="基础用法">
			<ZenlessCollapse bind:value={collapse}>
				<ZenlessCollapseItem name="one" title="代理人档案"
					>安比是一位电属性击破代理人。</ZenlessCollapseItem
				>
				<ZenlessCollapseItem name="two" title="装备信息">音擎与驱动盘信息。</ZenlessCollapseItem>
				<ZenlessCollapseItem name="disabled" title="禁用面板" disabled />
			</ZenlessCollapse>
		</DemoSection>
		<DemoSection title="朴素面板" dark>
			<ZenlessCollapse bind:value={collapse} plain>
				<ZenlessCollapseItem name="one" title="第一项">朴素面板内容。</ZenlessCollapseItem>
				<ZenlessCollapseItem name="two" title="第二项">第二项内容。</ZenlessCollapseItem>
			</ZenlessCollapse>
		</DemoSection>
		<DemoSection title="手风琴效果">
			<ZenlessCollapse bind:value={accordion} accordion>
				<ZenlessCollapseItem name="one" title="第一项">仅允许展开一个面板。</ZenlessCollapseItem>
				<ZenlessCollapseItem name="two" title="第二项">手风琴内容。</ZenlessCollapseItem>
			</ZenlessCollapse>
		</DemoSection>
		<DemoSection title="自定义标题">
			<ZenlessCollapse value="custom">
				<ZenlessCollapseItem name="custom">
					{#snippet titleContent()}<i class="z-icon-info"></i>&nbsp;自定义标题{/snippet}
					自定义面板内容。
				</ZenlessCollapseItem>
			</ZenlessCollapse>
		</DemoSection>
		<DemoSection title="禁用状态">
			<ZenlessCollapse>
				<ZenlessCollapseItem name="disabled" title="禁用面板" disabled />
			</ZenlessCollapse>
		</DemoSection>
	{:else if slug === 'drawer'}
		<DemoSection title="基础用法">
			<ZenlessButton onclick={() => (drawer = true)}>打开抽屉</ZenlessButton>
			<ZenlessDrawer
				bind:open={drawer}
				title="代理人抽屉"
				oncancel={() => (drawer = false)}
				onconfirm={() => (drawer = false)}>抽屉内容</ZenlessDrawer
			>
		</DemoSection>
		<DemoSection title="全屏抽屉">
			<ZenlessButton onclick={() => (drawerFullscreen = true)}>打开全屏抽屉</ZenlessButton>
			<ZenlessDrawer
				bind:open={drawerFullscreen}
				title="全屏抽屉"
				fullscreen
				oncancel={() => (drawerFullscreen = false)}
				onconfirm={() => (drawerFullscreen = false)}>全屏抽屉内容</ZenlessDrawer
			>
		</DemoSection>
	{:else if slug === 'dropdown'}
		<DemoSection title="基础用法">
			<ZenlessDropdown>
				<ZenlessButton hollow icon="arrow-bottom">下拉菜单</ZenlessButton>
				{#snippet content()}
					<ZenlessDropdownItem value="30">等级 Lv.30</ZenlessDropdownItem>
					<ZenlessDropdownItem value="40">等级 Lv.40</ZenlessDropdownItem>
					<ZenlessDropdownItem value="50">等级 Lv.50</ZenlessDropdownItem>
					<ZenlessDropdownItem value="60" disabled>等级 Lv.60</ZenlessDropdownItem>
				{/snippet}
			</ZenlessDropdown>
		</DemoSection>
		<DemoSection title="点击触发">
			<ZenlessDropdown trigger="click">
				<ZenlessButton hollow icon="arrow-bottom">下拉菜单</ZenlessButton>
				{#snippet content()}
					<ZenlessDropdownItem value="30">等级 Lv.30</ZenlessDropdownItem>
					<ZenlessDropdownItem value="40">等级 Lv.40</ZenlessDropdownItem>
					<ZenlessDropdownItem value="50">等级 Lv.50</ZenlessDropdownItem>
					<ZenlessDropdownItem value="60" disabled>等级 Lv.60</ZenlessDropdownItem>
				{/snippet}
			</ZenlessDropdown>
		</DemoSection>
		<DemoSection title="菜单隐藏方式">
			<ZenlessDropdown trigger="click" hideOnCommand={false}>
				<ZenlessButton hollow icon="arrow-bottom">下拉菜单</ZenlessButton>
				{#snippet content()}
					<ZenlessDropdownItem value="30">等级 Lv.30</ZenlessDropdownItem>
					<ZenlessDropdownItem value="40">等级 Lv.40</ZenlessDropdownItem>
					<ZenlessDropdownItem value="50">等级 Lv.50</ZenlessDropdownItem>
					<ZenlessDropdownItem value="60" disabled>等级 Lv.60</ZenlessDropdownItem>
				{/snippet}
			</ZenlessDropdown>
		</DemoSection>
		<DemoSection title="不同尺寸">
			<div class="component-preview-line">
				{#each sizes.slice(0, 2) as size (size.label)}
					<ZenlessDropdown trigger="click" size={size.value}>
						<ZenlessButton size={size.value} hollow icon="arrow-bottom"
							>{size.label}菜单</ZenlessButton
						>
						{#snippet content()}
							<ZenlessDropdownItem value="30">等级 Lv.30</ZenlessDropdownItem>
							<ZenlessDropdownItem value="40">等级 Lv.40</ZenlessDropdownItem>
							<ZenlessDropdownItem value="50">等级 Lv.50</ZenlessDropdownItem>
							<ZenlessDropdownItem value="60" disabled>等级 Lv.60</ZenlessDropdownItem>
						{/snippet}
					</ZenlessDropdown>
				{/each}
			</div>
			<div class="component-preview-line">
				{#each sizes.slice(2) as size (size.label)}
					<ZenlessDropdown trigger="click" size={size.value}>
						<ZenlessButton size={size.value} hollow icon="arrow-bottom"
							>{size.label}菜单</ZenlessButton
						>
						{#snippet content()}
							<ZenlessDropdownItem value="30">等级 Lv.30</ZenlessDropdownItem>
							<ZenlessDropdownItem value="40">等级 Lv.40</ZenlessDropdownItem>
							<ZenlessDropdownItem value="50">等级 Lv.50</ZenlessDropdownItem>
							<ZenlessDropdownItem value="60" disabled>等级 Lv.60</ZenlessDropdownItem>
						{/snippet}
					</ZenlessDropdown>
				{/each}
			</div>
		</DemoSection>
	{:else if slug === 'form'}
		<DemoSection title="基础用法" class="demo--stack">
			<ZenlessForm labelWidth={100} style="width: min(500px, 100%)">
				<ZenlessFormItem label="Input"><ZenlessInput placeholder="请输入" /></ZenlessFormItem>
				<ZenlessFormItem label="Select" style="width: min(350px, 100%)"
					><ZenlessSelect placeholder="请选择">
						<ZenlessOption value={30} label="等级 Lv.30" />
						<ZenlessOption value={40} label="等级 Lv.40" />
						<ZenlessOption value={50} label="等级 Lv.50" />
						<ZenlessOption value={60} label="等级 Lv.60" disabled />
					</ZenlessSelect></ZenlessFormItem
				>
				<ZenlessFormItem label="Switch"><ZenlessSwitch /></ZenlessFormItem>
				<ZenlessFormItem label="Radio">
					<ZenlessRadioGroup>
						<ZenlessRadio value={1}>备选项</ZenlessRadio>
						<ZenlessRadio value={2}>备选项</ZenlessRadio>
					</ZenlessRadioGroup>
				</ZenlessFormItem>
				<ZenlessFormItem label="Checkbox">
					<ZenlessCheckboxGroup>
						<ZenlessCheckbox value={1}>备选项</ZenlessCheckbox>
						<ZenlessCheckbox value={2}>备选项</ZenlessCheckbox>
						<ZenlessCheckbox value={3}>备选项</ZenlessCheckbox>
					</ZenlessCheckboxGroup>
				</ZenlessFormItem>
				<ZenlessFormItem label="Slider"><ZenlessSlider /></ZenlessFormItem>
				<ZenlessFormItem label="Textarea"
					><ZenlessTextarea rows={4} placeholder="请输入" /></ZenlessFormItem
				>
				<ZenlessFormItem>
					<ZenlessButton icon={{ success: '#00cc0d' }}>Submit</ZenlessButton>
					<ZenlessButton icon={{ loading: '#ff5522' }}>Reset</ZenlessButton>
				</ZenlessFormItem>
			</ZenlessForm>
		</DemoSection>
		<DemoSection title="行内表单" class="demo--stack">
			<ZenlessForm inline style="width: fit-content">
				<ZenlessFormItem label="Input1"
					><ZenlessInput
						placeholder="请输入"
						class="demo-inline-input"
						style="width: 200px"
					/></ZenlessFormItem
				>
				<ZenlessFormItem label="Input2"
					><ZenlessInput
						placeholder="请输入"
						class="demo-inline-input"
						style="width: 200px"
					/></ZenlessFormItem
				>
				<ZenlessFormItem
					><ZenlessButton icon={{ success: '#00cc0d' }}>Submit</ZenlessButton></ZenlessFormItem
				>
			</ZenlessForm>
		</DemoSection>
		<DemoSection title="对齐方式" class="demo--stack" dark>
			<ZenlessRadioGroup bind:value={formPosition}>
				<ZenlessRadioButton value="left">左对齐</ZenlessRadioButton>
				<ZenlessRadioButton value="right">右对齐</ZenlessRadioButton>
				<ZenlessRadioButton value="top">顶部对齐</ZenlessRadioButton>
			</ZenlessRadioGroup>
			<ZenlessForm labelWidth={100} {labelPosition} style="width: min(400px, 100%)">
				<ZenlessFormItem label="Input1"><ZenlessInput placeholder="请输入" /></ZenlessFormItem>
				<ZenlessFormItem label="Input2"><ZenlessInput placeholder="请输入" /></ZenlessFormItem>
				<ZenlessFormItem label="Input3"><ZenlessInput placeholder="请输入" /></ZenlessFormItem>
			</ZenlessForm>
		</DemoSection>
	{:else if slug === 'icon'}
		<DemoSection title="基础用法">
			<ZenlessIcon name="success" size={28} color="success" aria-label="成功" />
			<ZenlessIcon name="error" size={40} color="danger" aria-label="错误" />
			<ZenlessIcon name="info" size={32} color="electric" aria-label="信息" />
		</DemoSection>
		<DemoSection title="Tips">
			<p class="component-content">可通过 <code>z-icon-*</code> 类名前缀扩展自定义图标字体。</p>
		</DemoSection>
		<DemoSection title="图标集合">
			{#each iconNames as name (name)}
				<div class="icon-wrap"><ZenlessIcon {name} size={32} /><span>z-icon-{name}</span></div>
			{/each}
		</DemoSection>
	{:else if slug === 'input'}
		<DemoSection title="基础用法" class="demo--stack">
			<ZenlessInput bind:value={text} placeholder="请输入内容" />
		</DemoSection>
		<DemoSection title="禁用状态" class="demo--stack">
			<ZenlessInput value="禁用内容" placeholder="请输入内容" disabled />
		</DemoSection>
		<DemoSection title="可清空" class="demo--stack">
			<ZenlessInput bind:value={text} placeholder="可清空" clearable />
		</DemoSection>
		<DemoSection title="密码框" class="demo--stack">
			<ZenlessInput bind:value={password} type="password" placeholder="请输入密码" />
		</DemoSection>
		<DemoSection title="前缀和后缀" class="demo--stack">
			<ZenlessInput placeholder="请输入内容" prefixIcon="info" />
			<ZenlessInput placeholder="请输入内容" suffixIcon="info" />
		</DemoSection>
		<DemoSection title="复合输入框" class="demo--stack">
			<ZenlessInput placeholder="请输入域名">
				{#snippet prefix()}http(s)://{/snippet}
				{#snippet suffix()}.com{/snippet}
			</ZenlessInput>
			<ZenlessInput placeholder="输入验证码">
				{#snippet append()}<ZenlessButton>发送</ZenlessButton>{/snippet}
			</ZenlessInput>
		</DemoSection>
		<DemoSection title="不同尺寸" class="demo--stack">
			{#each sizes as size (size.label)}
				<ZenlessInput size={size.value} placeholder={`${size.label}输入框`} suffixIcon="info" />
			{/each}
		</DemoSection>
	{:else if slug === 'link'}
		<DemoSection title="基础用法">
			{#each [...colors, ...factions] as color (color.value)}
				<ZenlessLink href={resolve('/components')} type={color.value}>{color.label}</ZenlessLink>
			{/each}
			<ZenlessLink highlight>高亮</ZenlessLink>
		</DemoSection>
		<DemoSection title="禁用状态">
			<ZenlessLink disabled>禁用</ZenlessLink>
		</DemoSection>
		<DemoSection title="下划线">
			<ZenlessLink underline href={resolve('/components')}>带下划线</ZenlessLink>
			<ZenlessLink href={resolve('/components')}>无下划线</ZenlessLink>
		</DemoSection>
		<DemoSection title="图标">
			<ZenlessLink type="success"><i class="z-icon-success"></i>&nbsp;确认</ZenlessLink>
			<ZenlessLink type="danger"><i class="z-icon-error"></i>&nbsp;取消</ZenlessLink>
		</DemoSection>
	{:else if slug === 'menu'}
		<DemoSection title="基础用法" class="demo--menu">
			<ZenlessMenu bind:value={menu} defaultOpen={['agents', 'settings']}>
				<ZenlessMenuItem name="home" icon="info">首页</ZenlessMenuItem>
				<ZenlessSubMenu name="agents" icon="success" title="代理人">
					<ZenlessMenuItem name="agent-list">代理人列表</ZenlessMenuItem>
					<ZenlessMenuItem name="agent-disabled" disabled>禁用项目</ZenlessMenuItem>
				</ZenlessSubMenu>
				<ZenlessSubMenu name="settings" title="设置">
					<ZenlessMenuItem name="general">通用设置</ZenlessMenuItem>
				</ZenlessSubMenu>
			</ZenlessMenu>
		</DemoSection>
		<DemoSection title="手风琴效果" class="demo--menu">
			<ZenlessMenu bind:value={menu} accordion defaultOpen="agents">
				<ZenlessSubMenu name="agents" title="代理人">
					<ZenlessMenuItem name="agent-list">代理人列表</ZenlessMenuItem>
				</ZenlessSubMenu>
				<ZenlessSubMenu name="settings" title="设置">
					<ZenlessMenuItem name="general">通用设置</ZenlessMenuItem>
				</ZenlessSubMenu>
			</ZenlessMenu>
		</DemoSection>
	{:else if slug === 'message'}
		<DemoSection title="基础用法">
			<ZenlessMessageHost><DemoMessageButton mode="basic" /></ZenlessMessageHost>
		</DemoSection>
		<DemoSection title="不同类型">
			<ZenlessMessageHost><DemoMessageButton mode="types" /></ZenlessMessageHost>
		</DemoSection>
		<DemoSection title="单独引入">
			<p class="component-content">通过 <code>message()</code> 命令式 API 调用消息提示。</p>
		</DemoSection>
	{:else if slug === 'modal'}
		<DemoSection title="基础用法">
			<ZenlessButton onclick={() => (modal = true)}>打开 Modal</ZenlessButton>
			<ZenlessModal
				bind:open={modal}
				title="确认操作"
				oncancel={() => (modal = false)}
				onconfirm={() => (modal = false)}>是否确认本次委托？</ZenlessModal
			>
		</DemoSection>
		<DemoSection title="全屏对话框">
			<ZenlessButton onclick={() => (modalFullscreen = true)}>打开全屏 Modal</ZenlessButton>
			<ZenlessModal
				bind:open={modalFullscreen}
				title="全屏提示"
				fullscreen
				oncancel={() => (modalFullscreen = false)}
				onconfirm={() => (modalFullscreen = false)}>全屏 Modal 内容</ZenlessModal
			>
		</DemoSection>
	{:else if slug === 'pagination'}
		<DemoSection title="基础用法">
			<ZenlessPagination bind:value={page} total={80} pageSize={10} />
		</DemoSection>
		<DemoSection title="极简模式">
			<ZenlessPagination bind:value={page} total={80} pageSize={10} minimal />
		</DemoSection>
	{:else if slug === 'pattern'}
		<DemoSection title="基础用法">
			<ZenlessPattern type="stripes" class="pattern-demo">Stripes</ZenlessPattern>
			<ZenlessPattern type="squares" class="pattern-demo">Squares</ZenlessPattern>
			<ZenlessPattern type="rhombus" class="pattern-demo">Rhombus</ZenlessPattern>
		</DemoSection>
	{:else if slug === 'progress'}
		<DemoSection title="基础用法" class="demo--stack">
			{#each [...colors.slice(1), ...factions] as color, index (color.value)}
				<ZenlessProgress percent={20 + index * 7} color={color.value} />
			{/each}
		</DemoSection>
		<DemoSection title="进度圈">
			<ZenlessProgress type="circle" percent={65} color="electric">65%</ZenlessProgress>
			<ZenlessProgress type="circle" percent={42} color="#ff66cc" size={120}>42%</ZenlessProgress>
		</DemoSection>
	{:else if slug === 'radio'}
		<DemoSection title="基础用法">
			<ZenlessRadio bind:checked>备选项</ZenlessRadio>
		</DemoSection>
		<DemoSection title="禁用状态">
			<ZenlessRadio checked disabled>已选禁用</ZenlessRadio>
			<ZenlessRadio disabled>未选禁用</ZenlessRadio>
		</DemoSection>
		<DemoSection title="单选框组">
			<ZenlessRadioGroup bind:value={choice}>
				<ZenlessRadio value="anby">安比</ZenlessRadio>
				<ZenlessRadio value="nicole">妮可</ZenlessRadio>
				<ZenlessRadio value="billy" disabled>比利</ZenlessRadio>
			</ZenlessRadioGroup>
		</DemoSection>
		<DemoSection title="不同尺寸">
			{#each sizes as size (size.label)}
				<ZenlessRadio size={size.value}>{size.label}选项</ZenlessRadio>
			{/each}
		</DemoSection>
		<DemoSection title="按钮样式">
			<ZenlessRadioGroup bind:value={choice} size="large">
				<ZenlessRadioButton value="anby">安比</ZenlessRadioButton>
				<ZenlessRadioButton value="nicole">妮可</ZenlessRadioButton>
			</ZenlessRadioGroup>
		</DemoSection>
	{:else if slug === 'scrollbar'}
		<DemoSection title="基础用法">
			<ZenlessScrollbar class="component-scrollbar" resizable={false}
				><div class="scrollbar-content"></div></ZenlessScrollbar
			>
		</DemoSection>
	{:else if slug === 'select'}
		<DemoSection title="基础用法" class="demo--stack">
			<ZenlessSelect bind:value={selected} placeholder="请选择等级">
				<ZenlessOption value={30} label="等级 30" />
				<ZenlessOption value={40} label="等级 40" />
				<ZenlessOption value={50} label="等级 50" />
				<ZenlessOption value={60} label="等级 60" disabled />
			</ZenlessSelect>
		</DemoSection>
		<DemoSection title="禁用状态" class="demo--stack">
			<ZenlessSelect value={40} disabled
				><ZenlessOption value={40} label="禁用选择器" /></ZenlessSelect
			>
		</DemoSection>
		<DemoSection title="可清空" class="demo--stack">
			<ZenlessSelect bind:value={selected} clearable>
				<ZenlessOption value={30} label="等级 30" />
				<ZenlessOption value={40} label="等级 40" />
			</ZenlessSelect>
		</DemoSection>
		<DemoSection title="自定义模板" class="demo--stack">
			<ZenlessSelect bind:value={selected}>
				<ZenlessOption value={30} label="等级 30"
					><i class="z-icon-info"></i>&nbsp;等级 30</ZenlessOption
				>
				<ZenlessOption value={40} label="等级 40" />
			</ZenlessSelect>
		</DemoSection>
		<DemoSection title="不同尺寸" class="demo--stack">
			{#each sizes as size (size.label)}
				<ZenlessSelect size={size.value} placeholder={`${size.label}选择器`}>
					<ZenlessOption value={size.label} label={size.label} />
				</ZenlessSelect>
			{/each}
		</DemoSection>
	{:else if slug === 'slider'}
		<DemoSection title="基础用法" class="demo--stack">
			<ZenlessSlider bind:value={slider} /><output>{slider}</output>
		</DemoSection>
		<DemoSection title="显示 Tooltip" class="demo--stack">
			<ZenlessSlider bind:value={slider} step={10} tooltip /><output>带提示：{slider}</output>
			<ZenlessSlider value={25} tooltip={(value) => `${value}% 能量`} />
		</DemoSection>
		<DemoSection title="禁用状态" class="demo--stack">
			<ZenlessSlider value={70} disabled /><output>禁用</output>
		</DemoSection>
	{:else if slug === 'switch'}
		<DemoSection title="基础用法">
			<ZenlessSwitch bind:checked />
			<ZenlessSwitch checked={false} />
		</DemoSection>
		<DemoSection title="禁用状态">
			<ZenlessSwitch checked disabled />
			<ZenlessSwitch checked={false} disabled />
		</DemoSection>
	{:else if slug === 'table'}
		<DemoSection title="基础用法" class="demo--stack">
			<ZenlessTable data={rows} rowKey="name">
				<ZenlessTableColumn prop="name" label="代理人" />
				<ZenlessTableColumn prop="role" label="定位" />
				<ZenlessTableColumn prop="attribute" label="属性" />
			</ZenlessTable>
			<ZenlessTable data={[]} emptyText="暂无代理人数据">
				<ZenlessTableColumn prop="name" label="代理人" />
			</ZenlessTable>
		</DemoSection>
	{:else if slug === 'tabs'}
		<DemoSection title="基础用法" class="demo--stack">
			<ZenlessTabs bind:value={tab}>
				<ZenlessTabPanel name="basic" label="基础信息">基础信息面板</ZenlessTabPanel>
				<ZenlessTabPanel name="skills" label="技能">技能面板</ZenlessTabPanel>
				<ZenlessTabPanel name="gears" label="装备">装备面板</ZenlessTabPanel>
			</ZenlessTabs>
		</DemoSection>
		<DemoSection title="自定义标签页" class="demo--stack">
			<ZenlessTabs value="custom" placement="bottom-left">
				<ZenlessTabPanel name="custom" label="自定义">
					{#snippet labelContent()}<span>自定义&nbsp;</span><i class="z-icon-success"></i>{/snippet}
					自定义页签内容
				</ZenlessTabPanel>
				<ZenlessTabPanel name="other" label="其他">其他内容</ZenlessTabPanel>
			</ZenlessTabs>
		</DemoSection>
		<DemoSection title="禁用标签页" class="demo--stack">
			<ZenlessTabs value="basic">
				<ZenlessTabPanel name="basic" label="基础">基础面板</ZenlessTabPanel>
				<ZenlessTabPanel name="disabled" label="禁用" disabled>禁用面板</ZenlessTabPanel>
			</ZenlessTabs>
		</DemoSection>
	{:else if slug === 'tag'}
		<DemoSection title="基础用法" dark>
			{#each [...colors, ...factions] as color (color.value)}
				<ZenlessTag type={color.value}>{color.label}</ZenlessTag>
			{/each}
		</DemoSection>
		<DemoSection title="可移除标签" dark>
			{#each tags as tag (tag)}
				<ZenlessTag closable onclose={() => (tags = tags.filter((item) => item !== tag))}
					>{tag}</ZenlessTag
				>
			{/each}
		</DemoSection>
		<DemoSection title="不同尺寸" dark>
			{#each sizes as size (size.label)}<ZenlessTag size={size.value}>{size.label}</ZenlessTag
				>{/each}
		</DemoSection>
	{:else if slug === 'textarea'}
		<DemoSection title="基础用法" class="demo--stack">
			<ZenlessTextarea bind:value={text} placeholder="请输入委托说明" />
		</DemoSection>
		<DemoSection title="禁用状态" class="demo--stack">
			<ZenlessTextarea value="禁用内容" disabled />
		</DemoSection>
		<DemoSection title="设置行数" class="demo--stack">
			<ZenlessTextarea bind:value={text} rows={5} />
		</DemoSection>
		<DemoSection title="自适应高度" class="demo--stack">
			<ZenlessTextarea bind:value={text} autoSize />
		</DemoSection>
	{:else if slug === 'tooltip'}
		<DemoSection title="基础用法">
			<div class="demo-tooltip-box">
				<div class="top">
					<ZenlessTooltip content="bottom-left 文字提示内容" placement="bottom-left"
						><ZenlessButton>下左</ZenlessButton></ZenlessTooltip
					>
					<ZenlessTooltip content="bottom 文字提示内容" placement="bottom"
						><ZenlessButton>下方</ZenlessButton></ZenlessTooltip
					>
					<ZenlessTooltip content="bottom-right 文字提示内容" placement="bottom-right"
						><ZenlessButton>下右</ZenlessButton></ZenlessTooltip
					>
				</div>
				<div class="left">
					<ZenlessTooltip content="right-top 文字提示内容" placement="right-top"
						><ZenlessButton>右上</ZenlessButton></ZenlessTooltip
					>
					<ZenlessTooltip content="right 文字提示内容" placement="right"
						><ZenlessButton>右方</ZenlessButton></ZenlessTooltip
					>
					<ZenlessTooltip content="right-bottom 文字提示内容" placement="right-bottom"
						><ZenlessButton>右下</ZenlessButton></ZenlessTooltip
					>
				</div>
				<div class="right">
					<ZenlessTooltip content="left-top 文字提示内容" placement="left-top"
						><ZenlessButton>左上</ZenlessButton></ZenlessTooltip
					>
					<ZenlessTooltip content="left 文字提示内容" placement="left"
						><ZenlessButton>左方</ZenlessButton></ZenlessTooltip
					>
					<ZenlessTooltip content="left-bottom 文字提示内容" placement="left-bottom"
						><ZenlessButton>左下</ZenlessButton></ZenlessTooltip
					>
				</div>
				<div class="bottom">
					<ZenlessTooltip content="top-left 文字提示内容" placement="top-left"
						><ZenlessButton>上左</ZenlessButton></ZenlessTooltip
					>
					<ZenlessTooltip content="top 文字提示内容" placement="top"
						><ZenlessButton>上方</ZenlessButton></ZenlessTooltip
					>
					<ZenlessTooltip content="top-right 文字提示内容" placement="top-right"
						><ZenlessButton>上右</ZenlessButton></ZenlessTooltip
					>
				</div>
			</div>
		</DemoSection>
		<DemoSection title="禁用状态">
			<ZenlessTooltip content="不会显示" disabled
				><ZenlessButton>禁用</ZenlessButton></ZenlessTooltip
			>
		</DemoSection>
		<DemoSection title="自定义内容">
			<ZenlessTooltip placement="top">
				<ZenlessButton>自定义</ZenlessButton>
				{#snippet contentSnippet()}<i class="z-icon-info"></i>&nbsp;自定义提示{/snippet}
			</ZenlessTooltip>
		</DemoSection>
	{/if}
</div>

<style>
	.component-examples {
		width: 100%;
	}

	.scroll-demo {
		width: 100%;
		height: 120px;
		overflow: auto;
	}

	.tall {
		height: 400px;
	}

	:global(.component-scrollbar) {
		width: 100%;
		height: 300px;
	}

	:global(.component-scrollbar .scrollbar-content) {
		width: 100%;
		height: 600px;
		background: linear-gradient(transparent, #000);
	}

	.icon-wrap {
		display: flex;
		width: calc(16.666% - 0.75rem);
		min-width: 7rem;
		height: 8rem;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		gap: 0.8rem;
		border-radius: 0.65rem;
		font-size: 0.75rem;
		text-align: center;
	}

	.icon-wrap:hover {
		background: #2e2e2e;
	}

	:global(.demo--stack) {
		align-items: stretch !important;
		flex-direction: column;
	}

	:global(.demo--menu) {
		align-items: stretch !important;
	}

	:global(.demo--menu .z-menu) {
		width: 220px;
	}

	:global(.demo-inline-input) {
		width: 200px;
	}

	.demo-tooltip-box {
		width: fit-content;
	}

	.demo-tooltip-box .left {
		float: left;
		align-items: flex-end;
	}

	.demo-tooltip-box .right {
		float: right;
	}

	.demo-tooltip-box .left,
	.demo-tooltip-box .right {
		display: flex;
		flex-direction: column;
		width: 90px;
	}

	.demo-tooltip-box .left :global(.z-tooltip),
	.demo-tooltip-box .right :global(.z-tooltip) {
		margin: 5px 0;
	}

	.demo-tooltip-box .top,
	.demo-tooltip-box .bottom {
		display: flex;
		justify-content: center;
		padding: 0 100px;
		clear: both;
	}

	:global(.pattern-demo) {
		display: grid;
		min-width: 9rem;
		min-height: 6rem;
		place-items: center;
		padding: 1rem;
		border: 1px solid #333;
	}

	:global(.z-card) {
		width: min(22rem, 100%);
	}

	:global(.custom-card) {
		box-sizing: border-box;
		padding: 1.1rem;
	}

	:global(.custom-card > div + div) {
		margin-top: 1rem;
	}

	@media (max-width: 40rem) {
		.icon-wrap {
			width: calc(50% - 0.75rem);
		}

		.demo-tooltip-box .top,
		.demo-tooltip-box .bottom {
			padding: 0 40px;
		}

		:global(.demo--menu .z-menu) {
			width: 100%;
		}
	}
</style>
