# Vue 版本维护边界

本分支只维护 Svelte 5 包 `zenless-ui-svelte`。原 Vue 3 包 `zenless-ui@1.0.7` 的源码、示例和构建入口已在阶段 7 的独立清理提交中删除。

需要维护、比对或恢复 Vue 版本时，请使用 Git 提交 `4066875`；Vue 源码位于该提交的 `packages/`，示例站位于 `examples/`。Svelte 包不提供 Vue runtime、VNode、plugin API 或兼容层，也不会复用相同 npm 包名覆盖 Vue 版本。

Vue → Svelte 的使用差异见 [`docs/migration-guide.md`](../docs/migration-guide.md)，迁移前构建记录见 [`docs/vue-build-baseline.md`](../docs/vue-build-baseline.md)。
