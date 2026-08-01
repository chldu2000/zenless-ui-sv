# Vue 构建基线

- 基线提交：`4066875`
- 包：`zenless-ui@1.0.7`
- 验证日期：2026-08-01
- 环境：Node `v24.18.0`、pnpm `10.32.1`
- 安装：`pnpm install --frozen-lockfile` 成功（锁文件版本 9.0）

## 库构建

`pnpm run build` 成功，Vite 5.4.0 转换 150 个模块：

- `dist/index.css`：77.15 kB（gzip 12.68 kB）
- `dist/index.js`：78.13 kB（gzip 17.91 kB，source map 134.15 kB）

## 示例站构建

`pnpm run build:site` 成功，转换 231 个模块：

- `docs/index.html`：0.71 kB
- `docs/assets/index-*.css`：85.04 kB（gzip 14.40 kB）
- `docs/assets/index-*.js`：332.33 kB（gzip 84.37 kB）

验证在从 Git 导出的隔离临时目录进行，未复用当前 Svelte 工作树源码。
