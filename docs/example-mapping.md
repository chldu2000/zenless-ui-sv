# Vue 示例迁移映射

迁移前共有 37 个 `.vue` 示例文件。28 个组件页面、Getting Started 与 404 映射为独立 SvelteKit 路由；其余 7 个应用壳与文档辅助组件映射为对应 Svelte 文件。

| Vue 文件 | Svelte 目标 |
| --- | --- |
| `examples/App.vue` | `src/routes/+page.svelte` |
| `examples/layouts/default.vue` | `src/routes/+layout.svelte` |
| `examples/views/getting-started.vue` | `src/routes/getting-started/+page.svelte` |
| `examples/views/404.vue` | `src/routes/+error.svelte` |
| `examples/components/attribute-table.vue` | `src/routes/components/docs/AttributeTable.svelte` |
| `examples/components/event-table.vue` | `src/routes/components/docs/EventTable.svelte` |
| `examples/components/method-table.vue` | `src/routes/components/docs/MethodTable.svelte` |
| `examples/components/slot-table.vue` | `src/routes/components/docs/SlotTable.svelte` |
| `examples/components/source-code.vue` | `src/routes/components/docs/SourceCode.svelte` |
| `examples/views/component/{slug}.vue`（28 个） | `src/routes/components/{slug}`，由 `[slug]/+page.svelte` 与 `ComponentExample.svelte` 渲染 |

28 个组件 slug：`backtop`、`badge`、`button`、`card`、`checkbox`、`collapse`、`drawer`、`dropdown`、`form`、`icon`、`input`、`link`、`menu`、`message`、`modal`、`pagination`、`pattern`、`progress`、`radio`、`scrollbar`、`select`、`slider`、`switch`、`table`、`tabs`、`tag`、`textarea`、`tooltip`。

组件元数据位于 `src/routes/components/component-meta.ts`，包含 28 个文档组和全部 40 个具名组件。Playwright 会访问所有 28 个组件路由；动态路由通过 prerender entries 生成静态页面。
