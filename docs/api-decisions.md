# Svelte 公共 API 决策

| 决策项 | 结论 |
| --- | --- |
| 包名 | `zenless-ui-svelte`，不覆盖 Vue 包 `zenless-ui` |
| 框架与最低版本 | Svelte 5，peer dependency `^5.0.0` |
| 值绑定 | 统一使用 `bind:value`、`bind:checked` 或 `bind:open` |
| Callback 命名 | 使用小写 DOM 风格：`onchange`、`onclose`、`onconfirm` 等 |
| 内容扩展 | 默认内容使用 `children`，命名内容使用类型化 Snippet props |
| Table | 推荐泛型 `columns` 数据 API；声明式 TableColumn 使用 Context 注册，不扫描 VNode |
| Message | `ZenlessMessageHost` 管理队列；`useMessage()` 无 Host 时浏览器兼容挂载、SSR no-op |
| Overlay | Modal/Drawer 共享 portal、Escape、focus trap/restore 和 body scroll lock |
| Actions | 保留公开低层 actions；其类型、更新和清理属于公共契约 |
| CSS | 保留 `z-*` 类名；主题值迁移到 `--zenless-*` custom properties |
| 旧 Vue 包 | 阶段 0–6 保留 `packages/` 和 `examples/` 对照；阶段 7 通过独立提交删除，历史版本由 Git tag/commit 维护 |
| 发布策略 | `0.1.0-next.0` prerelease 候选，真实项目验证后再发布 stable |
