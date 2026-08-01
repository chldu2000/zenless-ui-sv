# Zenless UI Svelte

Zenless UI 的 Svelte 5 组件库迁移版本。目前已具备库打包、文档站、质量门禁、消费端验证，以及 Provider、主题、国际化和可复用 DOM 基础设施。

已迁移的展示组件：`ZenlessIcon`、`ZenlessButton`、`ZenlessLink`、`ZenlessTag`、`ZenlessBadge`、`ZenlessCard`、`ZenlessProgress` 与 `ZenlessPattern`。运行开发站后可在 `/components` 查看示例。

已迁移的表单与导航组件包括 Input、Textarea、Switch、Radio、Checkbox、Form、Pagination、Collapse、Tabs、Menu、Dropdown 和 Select 及其配套子组件。

已迁移的高级组件包括 Tooltip、Modal、Drawer、Message、Scrollbar、Backtop、Slider、Table 与 TableColumn；Vue 到 Svelte 的 API 差异见 `docs/migration-guide.md`。

## 使用基础设施

在应用入口引入样式，并使用 Provider 提供局部主题和语言配置：

```svelte
<script lang="ts">
	import { ZenlessProvider, zhCn } from 'zenless-ui-svelte';
	import 'zenless-ui-svelte/styles.css';
</script>

<ZenlessProvider locale={zhCn} theme={{ name: 'light' }}>
	<!-- 迁移完成后的组件 -->
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
