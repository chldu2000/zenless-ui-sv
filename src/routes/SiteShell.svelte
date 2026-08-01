<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { ZenlessButton } from '$lib/index.js';
	import { componentDocs, type ComponentDocMeta } from './components/component-meta.js';

	interface Props {
		children: Snippet;
		isBold?: boolean;
		isItalic?: boolean;
	}

	interface NavGroup {
		label: string;
		slugs: string[];
	}

	let { children, isBold = $bindable(false), isItalic = $bindable(true) }: Props = $props();
	let menuOpen = $state(false);

	const groups: NavGroup[] = [
		{ label: '通用组件', slugs: ['icon', 'button', 'link'] },
		{ label: '导航组件', slugs: ['menu', 'tabs', 'dropdown', 'pagination'] },
		{
			label: '数据录入',
			slugs: ['radio', 'checkbox', 'input', 'textarea', 'select', 'switch', 'slider', 'form']
		},
		{
			label: '数据展示',
			slugs: ['table', 'tag', 'progress', 'badge', 'card', 'collapse']
		},
		{ label: '反馈组件', slugs: ['tooltip', 'message', 'modal', 'drawer'] },
		{ label: '其他', slugs: ['scrollbar', 'backtop', 'pattern'] }
	];
	const docsBySlug = new Map(componentDocs.map((doc) => [doc.slug, doc]));

	function docFor(slug: string): ComponentDocMeta {
		const doc = docsBySlug.get(slug);
		if (!doc) throw new Error(`Missing component documentation for ${slug}`);
		return doc;
	}

	function isActive(pathname: string): boolean {
		const currentPath = page.url.pathname.length > 1 ? page.url.pathname.replace(/\/+$/, '') : '/';
		return currentPath.endsWith(pathname);
	}

	function closeMenu() {
		menuOpen = false;
	}

	function toggleItalic() {
		isItalic = !isItalic;
		localStorage.setItem('component_is_italic', String(isItalic));
	}

	function toggleBold() {
		isBold = !isBold;
		localStorage.setItem('component_is_bold', String(isBold));
	}

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	onMount(() => {
		const storedItalic = localStorage.getItem('component_is_italic');
		const storedBold = localStorage.getItem('component_is_bold');
		isItalic = storedItalic === null || storedItalic === 'true';
		isBold = storedBold === 'true';
	});

	afterNavigate(closeMenu);
</script>

<svelte:window onkeydown={(event) => event.key === 'Escape' && closeMenu()} />

<div class="site-shell">
	<div class="site-backdrop" aria-hidden="true">
		<span class="site-backdrop__shape site-backdrop__shape--blue"></span>
		<span class="site-backdrop__shape site-backdrop__shape--amber"></span>
		<span class="site-backdrop__shape site-backdrop__shape--red"></span>
	</div>

	<header class="site-header">
		<div class="site-header__content">
			<a class="site-logo" href={resolve('/')} aria-label="Zenless UI Svelte 首页">
				<svg aria-hidden="true" viewBox="0 0 48 48">
					<path d="M7 7h34L26 21h14L17 41H6l15-15H7L31 12H7z" />
				</svg>
				<span>Zenless</span>
			</a>
			<nav class="site-actions" aria-label="站点操作">
				<a
					class="site-action site-action--language"
					href="https://github.com/ChrisChan13/zenless-ui/blob/main/README.EN.md"
					target="_blank"
					rel="noreferrer"
					aria-label="View English README"
				>
					<svg aria-hidden="true" viewBox="0 0 24 24">
						<path
							d="M12.9 15.1 10.3 12.6A17 17 0 0 0 14 6h3V4h-7V2H8v2H1v2h11.2A15 15 0 0 1 9 11.4 15 15 0 0 1 6.7 8h-2a18 18 0 0 0 3 4.6L2.6 17.6 4 19l5-5 3.1 3.1.8-2ZM18.5 10h-2L12 22h2l1.1-3h4.8l1.1 3h2l-4.5-12Zm-2.6 7 1.6-4.3 1.6 4.3h-3.2Z"
						/>
					</svg>
				</a>
				<a
					class="site-action site-action--github"
					href="https://github.com/ChrisChan13/zenless-ui"
					target="_blank"
					rel="noreferrer"
				>
					<svg aria-hidden="true" viewBox="0 0 24 24">
						<path
							d="M12.5.8A11.5 11.5 0 0 0 8.9 23c.6.1.8-.2.8-.5v-2.1c-2.9.5-3.6-.7-3.9-1.4-.1-.3-.7-1.3-1.2-1.6-.4-.2-1-.8 0-.8.9 0 1.5.8 1.8 1.2 1 1.7 2.7 1.2 3.3.9.1-.7.4-1.2.7-1.5-2.5-.3-5.2-1.3-5.2-5.7 0-1.2.4-2.3 1.2-3.1-.1-.3-.5-1.5.1-3 0 0 1-.3 3.2 1.2a10 10 0 0 1 5.8 0c2.2-1.5 3.1-1.2 3.1-1.2.7 1.6.3 2.7.2 3 .7.8 1.2 1.9 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.1v3.2c0 .3.2.6.8.5A11.5 11.5 0 0 0 12.5.8Z"
						/>
					</svg>
					<span>Github</span>
				</a>
				<button
					class="site-action site-action--menu"
					type="button"
					onclick={() => (menuOpen = !menuOpen)}
					aria-expanded={menuOpen}
					aria-controls="site-sidebar">菜单</button
				>
			</nav>
		</div>
	</header>

	{#if menuOpen}
		<button class="site-mask" type="button" aria-label="关闭菜单" onclick={closeMenu}></button>
	{/if}

	<div class="site-layout">
		<aside id="site-sidebar" class:site-sidebar--open={menuOpen} class="site-sidebar">
			<div class="site-sidebar__cap" aria-hidden="true"><span></span></div>
			<nav class="site-sidebar__nav" aria-label="文档导航">
				<a
					class:active={isActive('/getting-started') || page.route.id === '/'}
					href={resolve('/getting-started')}
					onclick={closeMenu}>快速上手</a
				>
				<a class:active={isActive('/components')} href={resolve('/components')} onclick={closeMenu}
					>组件总览</a
				>
				{#each groups as group (group.label)}
					<section>
						<h2>{group.label}</h2>
						{#each group.slugs as slug (slug)}
							{@const doc = docFor(slug)}
							<a
								class:active={page.params.slug === slug}
								href={resolve('/components/[slug]', { slug })}
								onclick={closeMenu}>{doc.title} <span>{doc.summary.split('。')[0]}</span></a
							>
						{/each}
					</section>
				{/each}
			</nav>
			<div class="site-sidebar__cap site-sidebar__cap--bottom" aria-hidden="true">
				<span></span>
			</div>
		</aside>

		<div class="site-page">{@render children()}</div>
	</div>

	<div class="site-font-controls" aria-label="字体样式">
		<ZenlessButton
			circle
			size="extra"
			icon="italic"
			highlight={isItalic}
			onclick={toggleItalic}
			aria-label="切换斜体"
			aria-pressed={isItalic}
		/>
		<ZenlessButton
			circle
			size="extra"
			icon="bold"
			highlight={isBold}
			onclick={toggleBold}
			aria-label="切换粗体"
			aria-pressed={isBold}
		/>
	</div>

	<button class="site-backtop" type="button" onclick={scrollToTop} aria-label="返回顶部">
		<span aria-hidden="true">↑</span>
	</button>
</div>
