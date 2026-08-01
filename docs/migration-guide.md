# Vue → Svelte 迁移指南

Svelte 包名是 `zenless-ui-svelte`，不会覆盖 Vue 包 `zenless-ui`。迁移时请安装 Svelte 5，并在应用入口显式引入 `zenless-ui-svelte/styles.css`；组件无需 `app.use()` 注册。

## 公共语法变化

| Vue | Svelte 5 | 说明 |
| --- | --- | --- |
| `v-model` / `v-model:open` | `bind:value` / `bind:checked` / `bind:open` | 字段按组件语义命名 |
| `@change="handler"` | `onchange={handler}` | 事件改为类型化 callback prop |
| 默认 slot | `children` Snippet | 组件标签内的内容仍可直接书写 |
| 命名/作用域 slot | 类型化 Snippet prop | 如 `header`、`cell`、`empty` |
| `provide` / `inject` | Svelte Context | 仅父子组合组件内部使用 |
| `ref` 实例方法 | `bind:this` + 导出实例类型 | 当前公开实例能力见组件契约 |
| Vue plugin / 全局组件 | ESM 具名导入 | 支持 tree-shaking |

Callback 统一采用小写 DOM 风格名称，例如 `onchange`、`onclose`、`onconfirm`、`onopenchange`。原生元素 attributes 和适用事件从组件根元素转发；不要再监听 Vue 的 `update:modelValue`。

## Provider、主题和 locale

应用可在根部放置 `ZenlessProvider`，通过 `locale`、`theme`、`isBold`、`isItalic` 配置后代。主题值改为 `--zenless-*` CSS custom properties，公共 `z-*` class 继续保留。locale 可从根入口或 `zenless-ui-svelte/locale` 导入。

## Form controls

- Input、Textarea、Select、Slider 与 group 组件使用 `bind:value`。
- Switch 使用 `bind:checked`；Radio、Checkbox 及 Button 变体同时支持独立 `bind:checked` 和 group Context。
- Form 不再执行 Vue 表单模型反射；原生 `submit` 事件与 Snippet 组合保持显式。
- Select/Dropdown 的展开状态和变化分别使用 bindable 值与 `onopenchange`。

## Table / TableColumn

Vue 版本通过扫描默认 slot 的 VNode 和 `type.name` 发现 `TableColumn`。Svelte 版本不再反射组件树，推荐使用显式、泛型安全的 `columns` 数据 API：

```svelte
<script lang="ts">
	import { ZenlessTable, type ZenlessTableColumnDefinition } from 'zenless-ui-svelte';
	type Agent = { name: string; level: number };
	const rows: Agent[] = [{ name: 'Anby', level: 40 }];
	const columns = [
		{ prop: 'name', label: 'Name' },
		{ prop: 'level', label: 'Level' }
	] satisfies ZenlessTableColumnDefinition<Agent>[];
</script>

<ZenlessTable data={rows} {columns} rowKey="name" />
```

声明式 `<ZenlessTableColumn>` 通过类型化 Context 注册，支持动态增删和 SSR。`cell` 与 `header` 改为类型化 Snippet props。

## Message

应用根部推荐放置 `<ZenlessMessageHost>`，后代组件在初始化期间调用 `useMessage()` 获取队列 API。Host 支持并发消息和定时器清理；无 Host 时浏览器端使用独立挂载作为兼容回退，SSR 调用为安全 no-op。该 API 不再使用 Vue plugin 或 `app.config.globalProperties`。

## Modal / Drawer / Tooltip

Modal 与 Drawer 的 `v-model` 改为 `bind:open`，事件改为 `onopen`、`onclose`、`oncancel`、`onconfirm` callback props。两者共享 portal、Escape、focus trap/restore 与 body scroll lock；SSR 时不会在模块导入阶段读取 DOM。Tooltip 内容使用 `content` 或 `contentSnippet`。

## 导航与键盘交互

Tabs、Menu、Collapse、Pagination 的当前值使用 `bind:value`。Menu/Tabs 提供键盘移动和 ARIA 状态；Dropdown/Select 支持 Escape 与 outside dismissal。旧版若依赖内部 DOM 层级，请改用文档列出的公共 class 和 ARIA 语义。

## Breaking changes 清单

- 包名、安装入口及框架 peer dependency 改变；不提供 Vue 兼容层。
- 删除 Vue plugin、VNode 扫描、directives、emits 和 slot 对象 API。
- 所有双向值改为 Svelte bindable props，事件改为 callback props。
- 所有 slot 改为 Snippet；作用域参数现在由 TypeScript 校验。
- TableColumn、Message、overlay 与实例方法采用上述新协议。
- 样式需显式引入；主题定制使用 CSS variables。
- 浏览器能力延迟到挂载后执行，SSR import/render/hydration 受支持。
- 旧 Vue 源码不随 Svelte 包发布；Vue 1.x 由原仓库历史版本维护。
