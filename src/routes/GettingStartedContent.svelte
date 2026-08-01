<script lang="ts">
	import { resolve } from '$app/paths';

	const installCode = 'pnpm add zenless-ui-svelte';
	const importCode = `import { ZenlessButton } from 'zenless-ui-svelte';
import 'zenless-ui-svelte/styles.css';`;
	const scriptClose = '</' + 'script>';
	const providerCode = `<script lang="ts">
  import {
    ZenlessMessageHost,
    ZenlessOverlayHost,
    ZenlessProvider
  } from 'zenless-ui-svelte';
${scriptClose}

<ZenlessProvider>
  <ZenlessOverlayHost>
    <ZenlessMessageHost>
      <slot />
    </ZenlessMessageHost>
  </ZenlessOverlayHost>
</ZenlessProvider>`;
	const usageCode = `<script lang="ts">
  import { ZenlessButton } from 'zenless-ui-svelte';
${scriptClose}

<ZenlessButton type="primary" icon="check">
  确认
</ZenlessButton>`;
</script>

<main class="component docs-getting-started">
	<h1 class="component-title">快速上手</h1>
	<p class="component-content">
		Zenless UI Svelte 是基于 Svelte 5 的绝区零风格桌面端组件库，延续原 Vue
		版本的视觉语言，并提供类型化 Props、Snippets、SSR 与无障碍交互。
	</p>

	<h2 class="component-header">安装</h2>
	<pre class="component-codeblock"><code>{installCode}</code></pre>

	<h2 class="component-header">引入 Zenless UI</h2>
	<p class="component-content">按需导入组件，并在应用入口引入完整主题样式。</p>
	<pre class="component-codeblock"><code>{importCode}</code></pre>

	<h2 class="component-header">配置全局能力</h2>
	<p class="component-content">
		在根布局组合 Provider、OverlayHost 和 MessageHost，为主题、浮层和消息队列提供上下文。
	</p>
	<pre class="component-codeblock"><code>{providerCode}</code></pre>

	<h2 class="component-header">开始使用</h2>
	<pre class="component-codeblock"><code>{usageCode}</code></pre>

	<h2 class="component-header">继续探索</h2>
	<p class="component-content">
		当前文档覆盖 40 个公开组件及组合 API。前往<a href={resolve('/components')}>组件总览</a
		>，或直接从左侧导航选择组件。
	</p>
</main>
