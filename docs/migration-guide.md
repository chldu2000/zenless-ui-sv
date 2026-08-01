# Vue → Svelte 迁移指南

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

如需声明式组合，可继续使用 `<ZenlessTableColumn>`；它通过类型化 Context 注册并支持动态增删和 SSR，不依赖组件名反射。`cell` 和 `header` 改为类型化 Snippet props。

## Message

应用根部推荐放置 `<ZenlessMessageHost>`，后代组件在初始化期间调用 `useMessage()` 获取队列 API。Host 支持并发消息和定时器清理；无 Host 时浏览器端使用独立挂载作为兼容回退，服务端调用安全 no-op。

## Modal / Drawer

`v-model` 改为 `bind:open`，事件改为 `onopen`、`onclose`、`oncancel` 和 `onconfirm` callback props。Modal 和 Drawer 使用统一 portal、Escape、focus trap/restore 与 body scroll lock 协议。
