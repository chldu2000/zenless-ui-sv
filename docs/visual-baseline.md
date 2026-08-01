# 视觉回归基线

## Vue 基线

`docs/visual/vue-baseline` 保存提交 `4066875` 的隔离构建截图：30 个可路由页面 × desktop/mobile，共 60 张。37 个 Vue 文件中的另外 7 个是应用壳、布局与文档辅助组件，没有独立 URL；完整映射见 `example-mapping.md`。

基线可在旧站运行于 `http://127.0.0.1:4174` 时通过下列命令重建：

```sh
node scripts/capture-vue-baseline.mjs
```

## Svelte 自动化基线

`tests/e2e/visual.spec.ts` 覆盖 28 个组件页面的 desktop/mobile 状态，并额外覆盖 Modal、Drawer、Dropdown、Message 的打开状态，共 60 张跨平台命名快照。`playwright.config.ts` 不包含操作系统后缀，因此 CI 与本地使用同一基线。

视觉测试与交互/无障碍断言一起由 `pnpm verify` 执行。Vue 截图作为迁移审查参考，Svelte 快照作为后续提交的自动像素回归门禁；两套截图不做盲目逐像素相等，因为框架迁移同时修正了结构、ARIA 与响应式布局。
