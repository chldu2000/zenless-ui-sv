# `0.1.0-next.0` 发布检查

## 已完成的本地验证

- `publint` 校验 package exports、types 与 Svelte condition。
- tarball 白名单包含根入口、全部 `.svelte` 源文件与对应 `.d.ts`、CSS、字体、locale；拒绝 `.vue`、`packages/` 与 `examples/` 泄漏。
- Svelte 组件源码直接随包发布，便于消费端编译和定位，因此组件不依赖生成后的 JavaScript source map；TypeScript declaration 逐组件检查。
- SvelteKit 消费项目从 tarball 安装并完成 SSR/SSG production build，覆盖泛型 Table types、根入口、样式与 locale 子路径。
- Vite Svelte 消费项目从 tarball 安装并完成 CSR production build；产物断言未保留未导入的 Modal JavaScript，验证根入口 tree-shaking。
- SSR import/render 单测、SvelteKit hydration 交互测试和 60 个视觉快照均纳入 `pnpm verify`。

## 发布前人工步骤

1. 明确授权删除旧 Vue 源码并完成独立清理提交。
2. 确认 npm 登录身份及 `zenless-ui-svelte` 包名权限。
3. 检查 `pnpm pack --dry-run` 输出与 Git 状态。
4. 发布：`pnpm publish --tag next --no-git-checks`。
5. 在一个仓库外的真实 Svelte 应用安装 `zenless-ui-svelte@next`，复验 SSR/CSR 与样式。
6. 记录包版本、消费项目和阻断修复；验证完成前不发布 stable。

发布会改变外部 npm 状态，必须由仓库维护者明确授权并提供有效凭据。当前自动化的两个隔离消费项目验证的是实际 tarball，但不冒充已发布的 registry 包。
