<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { afterNavigate, goto } from '$app/navigation';
	import { asset, resolve } from '$app/paths';
	import { page } from '$app/state';
	import {
		ZenlessBacktop,
		ZenlessButton,
		ZenlessLink,
		ZenlessMenu,
		ZenlessMenuItem,
		ZenlessScrollbar,
		ZenlessSubMenu,
		ZenlessTooltip,
		type ZenlessScrollbarInstance
	} from '$lib/index.js';
	import { componentDocs, type ComponentDocMeta } from './components/component-meta.js';

	interface Props {
		children: Snippet;
		isBold?: boolean;
		isItalic?: boolean;
		translated?: boolean;
	}

	interface NavGroup {
		name: string;
		label: string;
		slugs: string[];
	}

	let {
		children,
		isBold = $bindable(false),
		isItalic = $bindable(true),
		translated = $bindable(false)
	}: Props = $props();
	let menuVisible = $state(false);
	let scrollBar: ZenlessScrollbarInstance | undefined = $state();
	let scrollTarget: HTMLElement | undefined = $state();

	const groups: NavGroup[] = [
		{ name: 'component-general', label: '通用组件', slugs: ['icon', 'button', 'link'] },
		{
			name: 'component-navigation',
			label: '导航组件',
			slugs: ['menu', 'tabs', 'dropdown', 'pagination']
		},
		{
			name: 'component-data-entry',
			label: '数据录入',
			slugs: ['radio', 'checkbox', 'input', 'textarea', 'select', 'switch', 'slider', 'form']
		},
		{
			name: 'component-data-display',
			label: '数据展示',
			slugs: ['table', 'tag', 'progress', 'badge', 'card', 'collapse']
		},
		{
			name: 'component-feedback',
			label: '交互反馈',
			slugs: ['tooltip', 'message', 'modal', 'drawer']
		},
		{
			name: 'component-other',
			label: '其他组件',
			slugs: ['scrollbar', 'backtop', 'pattern']
		}
	];
	const defaultOpen = groups.map((group) => group.name);
	const docsBySlug = new Map(componentDocs.map((doc) => [doc.slug, doc]));
	const routeName = $derived(
		page.params.slug
			? `component-${page.params.slug}`
			: page.route.id === '/' || page.route.id === '/getting-started'
				? 'getting-started'
				: 'components'
	);

	function docFor(slug: string): ComponentDocMeta {
		const doc = docsBySlug.get(slug);
		if (!doc) throw new Error(`Missing component documentation for ${slug}`);
		return doc;
	}

	function closeMenu() {
		menuVisible = false;
	}

	function onMenuChange(name: string | number) {
		const route = String(name);
		if (route === 'getting-started') {
			void goto(resolve('/getting-started'));
		} else if (route.startsWith('component-')) {
			void goto(resolve('/components/[slug]', { slug: route.slice('component-'.length) }));
		}
		closeMenu();
	}

	function toggleItalic() {
		isItalic = !isItalic;
		localStorage.setItem('component_is_italic', String(isItalic));
	}

	function toggleBold() {
		isBold = !isBold;
		localStorage.setItem('component_is_bold', String(isBold));
	}

	function toggleLanguage() {
		translated = !translated;
		localStorage.setItem('page_translated', String(translated));
	}

	onMount(() => {
		const storedItalic = localStorage.getItem('component_is_italic');
		isItalic = storedItalic === null || storedItalic === 'true';
		isBold = localStorage.getItem('component_is_bold') === 'true';
		translated = localStorage.getItem('page_translated') === 'true';
		scrollTarget = scrollBar?.getScrollTarget();
	});

	afterNavigate(() => {
		closeMenu();
		scrollBar?.scrollTo({ top: 0, left: 0 });
	});
</script>

<svelte:window onkeydown={(event) => event.key === 'Escape' && closeMenu()} />

<div class="container" id="container">
	<video
		poster="https://act-webstatic.mihoyo.com/puzzle/zzz/pz_F0oxrgZ9U_/resource/puzzle/2025/07/08/31770edda70a8d9208f29487bff37f6f_1763533793121640543.png?x-oss-process=image/format,webp/quality,Q_90"
		src="https://act-webstatic.mihoyo.com/puzzle/zzz/pz_F0oxrgZ9U_/resource/puzzle/2025/07/08/38b8c41c1f28f924081f894b84251896_401722559154469106.mp4"
		autoplay
		loop
		muted
		playsinline
		crossorigin="anonymous"
		preload="metadata"
		controlslist="nodownload"
		class="container-event"
		aria-hidden="true"
	></video>
	<div class="container-background" aria-hidden="true"></div>

	<ZenlessScrollbar bind:this={scrollBar} class="container-wrap">
		<div class="header">
			<div class="header-wrap">
				<div class="header-content">
					<ZenlessLink class="logo" href={resolve('/')} aria-label="Zenless UI Svelte 首页">
						<img src={asset('/zenless.png')} alt="Zenless UI" />
						<span>Zenless</span>
					</ZenlessLink>

					<nav class="nav" aria-label="站点操作">
						<div class="nav-item">
							<ZenlessTooltip
								content={translated ? '切换到中文' : 'Switch to English'}
								placement="bottom"
							>
								<ZenlessButton
									class="lang"
									circle
									highlight={translated}
									onclick={toggleLanguage}
									aria-label={translated ? '切换到中文' : 'Switch to English'}
								>
									<svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
										<path
											d="M12.87 15.07 10.33 12.56l.03-.03A17.7 17.7 0 0 0 14.07 6H17V4h-7V2H8v2H1v1.99h11.17A15.7 15.7 0 0 1 9 11.35 15.5 15.5 0 0 1 6.69 8h-2a18.4 18.4 0 0 0 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04ZM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12Zm-2.62 7 1.62-4.33L19.12 17h-3.24Z"
										/>
									</svg>
								</ZenlessButton>
							</ZenlessTooltip>
						</div>

						<ZenlessLink
							class="nav-item"
							target="_blank"
							rel="noreferrer"
							href="https://github.com/chldu2000/zenless-ui-sv"
						>
							<ZenlessButton class="github">
								<svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
									<path
										d="M12.5.75C6.146.75 1 5.896 1 12.25c0 5.089 3.292 9.387 7.863 10.91.575.101.79-.244.79-.546 0-.273-.014-1.178-.014-2.142-2.889.532-3.636-.704-3.866-1.35-.13-.331-.69-1.352-1.18-1.625-.402-.216-.977-.748-.014-.762.906-.014 1.553.834 1.769 1.179 1.035 1.74 2.688 1.25 3.349.948.1-.747.402-1.25.733-1.538-2.559-.287-5.232-1.279-5.232-5.678 0-1.25.445-2.285 1.178-3.09-.115-.288-.517-1.467.115-3.048 0 0 .963-.302 3.163 1.179a11.2 11.2 0 0 1 5.75 0c2.2-1.495 3.162-1.179 3.162-1.179.633 1.581.23 2.76.115 3.048.733.805 1.179 1.825 1.179 3.09 0 4.413-2.688 5.39-5.247 5.678.417.36.776 1.05.776 2.128v3.162c0 .302.216.662.79.547A11.5 11.5 0 0 0 12.5.75Z"
									/>
								</svg>
								<span>Github</span>
							</ZenlessButton>
						</ZenlessLink>

						<div class="nav-item nav-item--menu">
							<ZenlessButton
								class="menu"
								onclick={() => (menuVisible = !menuVisible)}
								aria-expanded={menuVisible}
								aria-controls="site-menu"
							>
								菜单
							</ZenlessButton>
						</div>
					</nav>
				</div>
			</div>
		</div>

		<div class="content">
			<div
				class:show={menuVisible}
				class="side-mask"
				aria-hidden={!menuVisible}
				onclick={closeMenu}
				onkeydown={(event) => event.key === 'Escape' && closeMenu()}
				role="presentation"
			>
				<ZenlessLink
					class="github"
					target="_blank"
					rel="noreferrer"
					href="https://github.com/chldu2000/zenless-ui-sv"
					onclick={(event) => event.stopPropagation()}
				>
					<ZenlessButton>
						<svg class="github-icon" viewBox="0 0 24 24" aria-hidden="true">
							<path
								d="M12.5.75C6.146.75 1 5.896 1 12.25c0 5.089 3.292 9.387 7.863 10.91.575.101.79-.244.79-.546 0-.273-.014-1.178-.014-2.142-2.889.532-3.636-.704-3.866-1.35-.13-.331-.69-1.352-1.18-1.625-.402-.216-.977-.748-.014-.762.906-.014 1.553.834 1.769 1.179 1.035 1.74 2.688 1.25 3.349.948.1-.747.402-1.25.733-1.538-2.559-.287-5.232-1.279-5.232-5.678 0-1.25.445-2.285 1.178-3.09-.115-.288-.517-1.467.115-3.048 0 0 .963-.302 3.163 1.179a11.2 11.2 0 0 1 5.75 0c2.2-1.495 3.162-1.179 3.162-1.179.633 1.581.23 2.76.115 3.048.733.805 1.179 1.825 1.179 3.09 0 4.413-2.688 5.39-5.247 5.678.417.36.776 1.05.776 2.128v3.162c0 .302.216.662.79.547A11.5 11.5 0 0 0 12.5.75Z"
							/>
						</svg>
						<span>Github</span>
					</ZenlessButton>
				</ZenlessLink>
			</div>

			<ZenlessMenu
				id="site-menu"
				value={routeName}
				{defaultOpen}
				class={menuVisible ? 'side-nav show' : 'side-nav'}
				aria-label="文档导航"
				onchange={onMenuChange}
			>
				<ZenlessMenuItem name="getting-started">快速上手</ZenlessMenuItem>
				{#each groups as group (group.name)}
					<ZenlessSubMenu name={group.name} title={group.label}>
						{#each group.slugs as slug (slug)}
							<ZenlessMenuItem name={`component-${slug}`}>{docFor(slug).title}</ZenlessMenuItem>
						{/each}
					</ZenlessSubMenu>
				{/each}
			</ZenlessMenu>

			<div class="site-page">{@render children()}</div>
		</div>
	</ZenlessScrollbar>

	<div class="float-btn" aria-label="字体样式">
		<ZenlessTooltip content="全局斜体" placement="left">
			<ZenlessButton
				circle
				icon="italic"
				size="extra"
				highlight={isItalic}
				onclick={toggleItalic}
				aria-label="切换斜体"
				aria-pressed={isItalic}
			/>
		</ZenlessTooltip>
		<ZenlessTooltip content="全局粗体" placement="left">
			<ZenlessButton
				circle
				icon="bold"
				size="extra"
				highlight={isBold}
				onclick={toggleBold}
				aria-label="切换粗体"
				aria-pressed={isBold}
			/>
		</ZenlessTooltip>
	</div>

	{#if scrollTarget}
		<ZenlessBacktop
			class="backtop"
			target={scrollTarget}
			right={120}
			bottom={80}
			aria-label="返回顶部"
		/>
	{/if}
</div>
