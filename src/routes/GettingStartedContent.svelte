<script lang="ts">
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
	const updateGlobalsCode = `<script lang="ts">
  let isBold = $state(false);
  let isItalic = $state(true);
${scriptClose}

<ZenlessProvider {isBold} {isItalic}>
  <button onclick={() => (isBold = !isBold)}>切换粗体</button>
</ZenlessProvider>`;
	const localeCode = `<script lang="ts">
  import { enUs, ZenlessProvider, zhCn } from 'zenless-ui-svelte';
  let locale = $state(zhCn);
${scriptClose}

<ZenlessProvider {locale}>
  <button onclick={() => (locale = locale === zhCn ? enUs : zhCn)}>
    Switch language
  </button>
</ZenlessProvider>`;
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

	<h2 class="component-header">全局配置</h2>
	<p class="component-content">
		在根布局组合 Provider、OverlayHost 和 MessageHost；Provider 支持 isBold 与 isItalic 全局配置。
	</p>
	<pre class="component-codeblock"><code>{providerCode}</code></pre>
	<p class="component-content">isBold 和 isItalic 同样支持在运行过程中修改。</p>
	<pre class="component-codeblock"><code>{updateGlobalsCode}</code></pre>

	<h2 class="component-header">国际化</h2>
	<p class="component-content">组件默认使用中文，也可以通过 Provider 切换内置语言对象。</p>
	<pre class="component-codeblock"><code>{localeCode}</code></pre>

	<h2 class="component-header">开始使用</h2>
	<p class="component-content">现在可以开始编写组件，各组件用法请参阅左侧对应文档。</p>
	<pre class="component-codeblock"><code>{usageCode}</code></pre>

	<h2 class="component-header">最后 [ o_x ]/</h2>
	<p class="component-content">
		该迁移版本延续 Vue 版的视觉表现，同时使用 Svelte 5 Props、Snippets、SSR 与类型化 API。
	</p>
	<p class="component-content">请结合实际业务场景评估后使用。</p>
</main>
