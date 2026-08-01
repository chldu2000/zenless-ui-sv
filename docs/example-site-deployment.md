# 示例站点部署

示例站点使用 SvelteKit 的 `adapter-static` 生成静态文件，并通过 GitHub Actions 部署到 GitHub Pages。

## 首次配置

1. 在仓库 `Settings → Pages → Build and deployment` 中将 `Source` 设置为 `GitHub Actions`。
2. 将默认分支设为 `main`，或在 Actions 页面手动运行 `Deploy example site` 并选择要部署的分支。
3. 合并到 `main` 后，工作流会自动执行检查、构建并部署。

工作流会将仓库名作为站点基础路径。例如 `ChrisChan13/zenless-ui` 的地址为：

`https://chrischan13.github.io/zenless-ui/`

基础路径通过 `BASE_PATH` 传给 SvelteKit；站内链接使用 `$app/paths` 的 `resolve` 生成，因此本地开发和 Pages 部署可以共用同一套页面代码。

## 本地验证

```bash
BASE_PATH=/zenless-ui pnpm run build:docs
BASE_PATH=/zenless-ui pnpm run preview -- --host 127.0.0.1
```

如果仓库改名，需要同步确认工作流中的 `BASE_PATH` 和 Pages 地址。npm 包发布仍由独立流程负责，本工作流不会发布 npm 包。
