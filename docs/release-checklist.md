# `0.1.0-next.0` 发布检查

## 已完成的本地验证

- `publint` 校验 package exports、types 与 Svelte condition。
- tarball 白名单包含根入口、全部 `.svelte` 源文件与对应 `.d.ts`、CSS、字体、locale；拒绝 `.vue`、`packages/` 与 `examples/` 泄漏。
- Svelte 组件源码直接随包发布，便于消费端编译和定位，因此组件不依赖生成后的 JavaScript source map；TypeScript declaration 逐组件检查。
- SvelteKit 消费项目从 tarball 安装并完成 SSR/SSG production build，覆盖泛型 Table types、根入口、样式与 locale 子路径。
- Vite Svelte 消费项目从 tarball 安装并完成 CSR production build；产物断言未保留未导入的 Modal JavaScript，验证根入口 tree-shaking。
- SSR import/render 单测、SvelteKit hydration 交互测试和 60 个视觉快照均纳入 `pnpm verify`。

## 发布前人工步骤

1. 已获得授权并通过独立提交删除旧 Vue 源码。
2. 恢复发布工作后，确认 npm 登录身份及 `zenless-ui-svelte` 包名权限。
3. 检查 `pnpm pack --dry-run` 输出与 Git 状态。
4. 发布：`pnpm publish --tag next --no-git-checks`。
5. 在一个仓库外的真实 Svelte 应用安装 `zenless-ui-svelte@next`，复验 SSR/CSR 与样式。
6. 记录包版本、消费项目和阻断修复；验证完成前不发布 stable。

## 通过 GitHub Actions 发布

工作流位于 `.github/workflows/publish-npm.yml`，只会在 GitHub Release 发布或手动运行时发布，不会由普通分支 push 触发。

推荐使用 npm Trusted Publishing（OIDC），无需保存长期 `NPM_TOKEN`：

1. 在 npm 包设置的 **Trusted Publisher** 中选择 **GitHub Actions**。
2. 填写仓库所有者 `chldu2000`、仓库 `zenless-ui-sv`、工作流文件名 `publish-npm.yml`；Environment 留空，除非同时在工作流中配置同名 GitHub Environment。
3. 确认 GitHub 仓库允许 Actions 使用 `id-token: write`（工作流已声明）。
4. 创建版本匹配的 GitHub Release，例如 `package.json` 为 `0.1.0-next.0` 时创建标签 `v0.1.0-next.0`。
5. 发布预发行 Release 会使用 npm `next` 标签，正式 Release 会使用 `latest`；也可以从 Actions 手动运行并选择 dist-tag。

Trusted Publishing 会通过 OIDC 完成短期认证，并由 npm 自动生成 provenance。首次启用前仍应按上面的检查清单验证 tarball 和真实消费端；在维护者确认前不要创建会触发发布的 Release。

发布会改变外部 npm 状态，维护者已明确要求暂不执行。当前工作流只是完成自动化配置，不代表已经发布了 registry 包。
