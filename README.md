# Zenless UI Svelte

Zenless UI 的 Svelte 5 组件库。40 个具名组件、Provider、主题、国际化和可复用 DOM 基础设施均已完成迁移，并具备文档站、SSR/CSR 打包和消费端质量门禁。

当前候选版本为 `0.1.0-next.0`。运行开发站后可在 `/components` 查看 28 组示例；Vue 到 Svelte 的完整差异见 `docs/migration-guide.md`。

## 使用基础设施

在应用入口引入样式，并使用 Provider 提供局部主题和语言配置：

```svelte
<script lang="ts">
	import { ZenlessButton, ZenlessProvider, zhCn } from 'zenless-ui-svelte';
	import 'zenless-ui-svelte/styles.css';
</script>

<ZenlessProvider locale={zhCn} theme={{ name: 'light' }}>
	<ZenlessButton type="primary">开始</ZenlessButton>
</ZenlessProvider>
```

## 开发

```sh
corepack pnpm install
corepack pnpm dev
```

## 校验

```sh
corepack pnpm lint
corepack pnpm check
corepack pnpm test:unit
corepack pnpm build
corepack pnpm verify
```

完整迁移路径见 [SVELTE_MIGRATION_PLAN.md](./SVELTE_MIGRATION_PLAN.md)。

## License

[MIT](./LICENSE)
