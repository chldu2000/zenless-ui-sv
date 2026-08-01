# Zenless UI：Vue → Svelte 5 分阶段迁移计划

> 状态：待执行
> 工作分支：`feat/svelte-migration`
> 计划版本：1.0.0
> 更新日期：2026-07-31

## 1. 目标

将当前 Vue 3 组件库迁移为独立的 Svelte 5 组件库，在尽量保持现有视觉、主题、组件能力和使用习惯的前提下，提供：

- 符合 Svelte 5 习惯的类型安全 API；
- 可在 SvelteKit SSR、静态构建和纯客户端 Svelte 应用中使用的包；
- 可按组件导入、可 tree-shaking 的发布产物；
- 完整的类型声明、组件文档、交互示例和迁移指南；
- 可自动执行的类型、单元、组件、端到端和发布包验证。

迁移不是逐文件语法翻译。Vue 的插件安装、VNode 反射、`provide/inject`、`v-model`、命名/作用域插槽和命令式挂载需要先定义对应的 Svelte 公共契约。

## 2. 当前基线

| 项目         | 当前情况                                                     |
| ------------ | ------------------------------------------------------------ |
| 组件源码     | `packages/` 下 40 个 `.vue` 文件                             |
| 示例/文档    | `examples/` 下 37 个 `.vue` 文件                             |
| 样式         | 27 个组件 SCSS，以及全局主题、reset、字体和动画              |
| 构建         | Vite library mode，Vue 作为 external                         |
| 公共入口     | Vue `install(app)`、全局组件注册和 named exports             |
| 状态共享     | 全局 Zenless context，以及 8 组左右的父子组件 context        |
| 测试         | 未发现单元、组件或端到端测试                                 |
| 类型         | JavaScript，无公开 TypeScript 类型声明                       |
| 当前本地基线 | 尚未安装 `node_modules`，环境中未提供 `pnpm`，现有构建未验证 |

主要高风险实现：

- `packages/table/` 通过 Vue VNode 类型和插槽反射发现 `TableColumn`；
- `packages/message/index.js` 使用 Vue `createVNode`/`render` 命令式挂载；
- `src/utils/animate-sync.js` 在模块加载阶段直接访问 `document` 和 `requestAnimationFrame`；
- Scrollbar、Slider、Dropdown、Button 等组件注册 document/window 级事件；
- Select、Menu、Tabs、Collapse、Form、Radio、Scrollbar 等依赖 `provide/inject`；
- Vue scoped CSS、Vite SCSS `additionalData` 和字体资源路径与当前构建链路耦合。

## 3. 已选技术方向

以下作为默认方案执行；如需调整，最迟在阶段 1 开始前确认。

| 决策项    | 默认方案                                                                      |
| --------- | ----------------------------------------------------------------------------- |
| 框架      | Svelte 5，使用 runes 模式                                                     |
| 语言      | TypeScript                                                                    |
| 项目模板  | Svelte library template                                                       |
| 打包      | `@sveltejs/package`，发布 `src/lib`                                           |
| 文档/演示 | 同仓库 `src/routes`，使用 SvelteKit                                           |
| 包名      | 优先使用独立包名 `zenless-ui-svelte`，避免覆盖 Vue 包                         |
| 框架依赖  | `svelte` 作为 peer dependency 和 dev dependency                               |
| SSR       | 所有公开入口必须可在无 DOM 的服务端环境安全导入                               |
| 库边界    | `src/lib` 不依赖 `$app/*` 等 SvelteKit 专属运行时模块                         |
| 样式策略  | 第一阶段保留现有 `z-*` 类名和视觉；逐步将主题参数归一为 CSS custom properties |
| 兼容策略  | 保持功能与视觉语义，不强求逐字复刻 Vue API                                    |
| 发布策略  | 先发布 prerelease/next，完成消费端验证后再发布 stable                         |

建议的新目录结构：

```text
src/
├── lib/
│   ├── components/
│   ├── actions/
│   ├── internal/
│   ├── locale/
│   ├── styles/
│   ├── types/
│   └── index.ts
├── routes/                 # 文档、示例和开发沙箱
└── app.html
tests/
├── e2e/
└── visual/
legacy/
└── README.md               # 最终清理阶段再决定是否移动旧源码
```

迁移期间暂时保留现有 `packages/` 和 `examples/`，直到新库通过完整验收。不要在早期阶段批量移动或删除 Vue 源码。

## 4. 公共 API 迁移原则

阶段 0 需要把每个组件的具体 API 固化成契约。总体映射如下：

| Vue 当前模式             | Svelte 目标模式                                     |
| ------------------------ | --------------------------------------------------- |
| `defineProps`            | 带显式接口的 `$props()`                             |
| `ref` / `reactive`       | `$state`                                            |
| `computed`               | `$derived`                                          |
| `watch` / `watchEffect`  | 优先改为派生状态；确需副作用时使用 `$effect`        |
| `v-model` / `modelValue` | `$bindable` + `bind:value`，或明确的 value/callback |
| `emit(...)`              | 类型化 callback props                               |
| 默认/命名插槽            | `children` 和命名 Snippet props                     |
| 作用域插槽               | 带参数的 Snippet                                    |
| `provide/inject`         | 类型化 Svelte Context                               |
| `onMounted/onUnmounted`  | `onMount`，并从回调返回清理函数                     |
| `defineExpose`           | 明确导出的实例方法；仅在确有命令式需求时使用        |
| `app.use/install`        | named exports + 可选 `ZenlessProvider`              |
| 动态 Vue component       | Svelte 动态组件或普通组件组合                       |
| `createVNode/render`     | Message Host，或 `mount`/`unmount` 封装             |

API 约束：

- 组件根节点应尽可能转发适用的原生 HTML attributes 和事件；
- 表单值、change/input 回调的触发时机必须在全部表单组件中保持一致；
- callback 命名规范在阶段 0 一次确定，避免迁移中混用 `onChange`、`onchange`、`change`；
- Snippet 参数必须有类型，特别是 Table cell/header、空状态和表单 label；
- 不把内部 context、actions、overlay 管理器意外暴露为稳定公共 API；
- 所有 breaking change 记录到迁移指南，不通过隐式行为掩盖。

## 5. 阶段总览

| 阶段 | 主题                              | 预计工作量 | 前置条件  |
| ---- | --------------------------------- | ---------: | --------- |
| 0    | 冻结 Vue 基线和公共契约           |   2–4 人日 | 无        |
| 1    | Svelte 库骨架和质量门禁           |   2–4 人日 | 阶段 0    |
| 2    | 主题、类型、Context、DOM 基础设施 |   4–7 人日 | 阶段 1    |
| 3    | 低风险展示组件                    |   3–5 人日 | 阶段 2    |
| 4    | 表单控件和分组组件                |   5–8 人日 | 阶段 2、3 |
| 5    | 组合/导航/数据选择组件            |   5–9 人日 | 阶段 4    |
| 6    | Overlay、拖拽、滚动和 Table       |  8–14 人日 | 阶段 2、5 |
| 7    | 文档迁移、消费端验证和发布        |   5–8 人日 | 阶段 3–6  |

单人顺序执行的初步估算为 34–59 人日。该估算不包含视觉重设计或大规模新增功能；实际时间以阶段 0 的 API 和视觉基线结果为准。

## 6. 阶段 0：冻结 Vue 基线和公共契约

### 工作内容

1. 恢复当前项目可重复构建：

   - 准备与 `pnpm-lock.yaml` 匹配的 pnpm；
   - 执行 frozen-lockfile 安装；
   - 验证 `build` 和 `build:site`；
   - 记录 Node/pnpm 版本和构建输出。

2. 生成 40 个组件的契约清单：

   - props、类型、默认值和 validator；
   - `v-model` 字段及更新时机；
   - emits 名称、参数和触发条件；
   - 默认、命名、作用域插槽；
   - 对外实例方法；
   - DOM 结构中承诺保留的 class；
   - Context 父子关系；
   - 浏览器 API、timer、observer 和全局监听。

3. 固化视觉和交互基线：

   - 以现有 37 个示例页面为入口；
   - 覆盖 normal、hover、focus、active、disabled、loading、empty、error；
   - 至少记录桌面和移动两种 viewport；
   - 记录 Modal、Drawer、Dropdown、Tooltip、Message 的动画与焦点行为。

4. 建立 API 差异决策记录：

   - 包名和版本线；
   - callback 命名；
   - `bind:value` 覆盖范围；
   - TableColumn 的目标 API；
   - Message 命令式 API；
   - 是否公开低层 actions；
   - 组件 class 和 CSS variable 的兼容级别。

### 交付物

- `docs/component-contracts.md`
- `docs/api-decisions.md`
- 基线截图或视觉测试工程
- 可复现的 Vue 构建记录

### 退出门槛

- 40 个组件均有契约条目；
- 所有无法直接映射的 Vue API 均有明确决策；
- 当前 Vue 包和示例站能够在干净环境构建；
- 高风险组件至少有手工或自动化行为基线。

## 7. 阶段 1：Svelte 库骨架和质量门禁

> 状态：已完成（2026-08-01）

### 工作内容

1. 使用 Svelte library template 建立 `src/lib` 和 `src/routes`；
2. 配置 TypeScript、Sass、ESLint、Prettier；
3. 配置 `@sveltejs/package`、`svelte-check`、Vitest 和 Playwright；
4. 配置精确的 package exports：

   - 根组件入口；
   - 样式入口；
   - locale 入口；
   - `types` 和 `svelte` export conditions；
   - CSS `sideEffects`；
   - 不继续使用无限制的 `"./*": "./*"`。

5. 建立最小消费端：

   - 一个 SvelteKit SSR 应用；
   - 一个纯 Vite Svelte 应用；
   - 两者均从打包后的 tarball 安装，不直接引用源码。

6. 建立 CI 门禁脚本：

```text
format/lint
  → svelte-check
  → unit/component tests
  → package
  → SvelteKit build
  → Playwright smoke
  → package tarball consumer tests
```

### 交付物

- 可构建的空 Svelte 组件库；
- 开发文档站骨架；
- package exports 和类型声明；
- CI 配置；
- 两类消费端 smoke tests。

### 退出门槛

- `svelte-check` 零 error；
- library package 和文档站均能构建；
- tarball 可被两个消费端安装；
- 在 Node/SSR 环境 import 根入口不会访问 DOM；
- 包内无 Vue 运行时依赖。

## 8. 阶段 2：公共基础设施

> 状态：已完成（2026-08-01）

### 工作内容

1. 类型与常量：

   - size、color、status、placement 等 union types；
   - 公共 callback、Snippet 和组件实例类型；
   - locale schema。

2. 主题与资源：

   - reset、animation、icon font；
   - 现有 SCSS variables 到 CSS custom properties 的映射；
   - 字体 URL 和子路径发布验证；
   - reduced-motion 处理。

3. `ZenlessProvider`：

   - locale；
   - isBold/isItalic；
   - 主题配置；
   - 无 Provider 时的默认配置；
   - SSR 请求之间不得共享可变全局状态。

4. 可复用 DOM 能力：

   - resize observer；
   - click outside；
   - pointer drag；
   - focus trap/focus restore；
   - scroll lock；
   - portal/overlay host；
   - escape-key dismiss；
   - browser/SSR guard。

5. 生命周期规范：

   - 全局监听必须有对称清理；
   - observer、RAF、timeout 必须可取消；
   - import 时不得启动 RAF 或访问 `window/document`；
   - 浏览器逻辑仅在挂载后执行。

### 退出门槛

- Provider、主题、locale 和主要 actions 有单元测试；
- SSR 并发渲染不会串用 locale/theme 状态；
- DOM 基础设施通过挂载/卸载泄漏测试；
- CSS 和字体通过 tarball 消费端验证。

## 9. 阶段 3：低风险展示组件

> 状态：已完成（2026-08-01）

### 组件范围

- Icon
- Button
- Link
- Tag
- Badge
- Card
- Progress
- Pattern

### 迁移重点

- 原生属性和事件转发；
- `children` Snippet；
- loading/disabled/closable 状态；
- 颜色、size 和 shape 类型；
- 保持 `z-*` class 和视觉效果；
- Button/Link 的语义元素和键盘可访问性。

### 退出门槛

- 每个组件拥有 props、交互和 a11y 测试；
- 与 Vue 基线的关键视觉状态一致；
- 按需导入不会携带未使用组件；
- 文档站已有对应示例页。

## 10. 阶段 4：表单控件和分组组件

> 状态：已完成（2026-08-01）

### 组件范围

- Input
- Textarea
- Switch
- Radio
- RadioButton
- RadioGroup
- Checkbox
- CheckboxButton
- CheckboxGroup
- Form
- FormItem
- Pagination

### 迁移重点

- 明确 `bind:value`、默认值和 callback 触发顺序；
- Input/Textarea 转发适用的原生 attributes；
- 处理 number、boolean、array 等值类型；
- Radio/Checkbox Group 使用类型化 Context；
- FormItem 的 label、required、inline 和宽度继承；
- 保留原生表单提交、name、disabled 和焦点语义；
- 不依赖组件内部 state 修改未声明为 bindable 的外部状态。

### 退出门槛

- 所有表单组件通过受控、绑定、禁用和重置测试；
- Group 动态增加/删除子项不会残留注册；
- 键盘操作和 label 关联通过测试；
- API 命名在整组组件中一致。

## 11. 阶段 5：组合、导航和数据选择组件

> 状态：已完成（2026-08-01）

### 组件范围

- Collapse
- CollapseItem
- Tabs
- TabPanel
- Menu
- MenuItem
- SubMenu
- Dropdown
- DropdownItem
- Select
- Option

### 迁移重点

- 父子注册与注销；
- controlled/uncontrolled 状态边界；
- 动态增删子组件；
- snippets 与 context 的初始化顺序；
- Menu/Tabs/Select 的键盘导航；
- Dropdown/Select 的 click-outside、escape 和焦点回归；
- Option value 到展示 label 的映射；
- 空状态和自定义内容 Snippet。

### 退出门槛

- 动态父子结构通过测试；
- Select/Menu/Tabs 支持完整键盘路径；
- overlay 打开和关闭时焦点位置正确；
- 外部点击、escape、disabled 行为有自动化覆盖。

## 12. 阶段 6：Overlay、拖拽、滚动和 Table

### 6A. Overlay 与命令式组件

组件：

- Tooltip
- Modal
- Drawer
- Message

工作内容：

- 建立统一 overlay 层级、portal 和关闭协议；
- Modal/Drawer 支持 focus trap、focus restore、escape 和 body scroll lock；
- Message 使用 Host + 队列管理生命周期；
- 如保留 `useMessage()`，其服务端调用必须安全失败或明确 no-op；
- 动画完成和卸载不得依赖 `getAnimations()[0]` 一定存在；
- 处理多个 overlay 的 z-index、嵌套和并发关闭。

### 6B. 滚动和拖拽组件

组件：

- Scrollbar
- Backtop
- Slider

工作内容：

- 优先使用 pointer events，统一 mouse/touch 行为；
- observer、document/window listeners、RAF 全部可清理；
- Slider 支持键盘调节和 ARIA value；
- Scrollbar 暴露的方法需有明确实例类型；
- Backtop 支持自定义滚动容器。

### 6C. Table

组件：

- Table
- TableColumn

默认设计方向：

- 不复制“扫描 Vue VNode 并按 `type.name` 识别列”的实现；
- 优先采用显式 `columns` 数据 API；
- cell/header customization 使用带类型参数的 Snippet；
- 如必须保留声明式 `<TableColumn>`，通过 Context 注册实现，并为动态列、顺序和 SSR 编写专项测试；
- Table 行数据和 column prop 使用泛型关联；
- 空状态、列宽、边框和现有 class 保持兼容。

### 退出门槛

- overlay 嵌套、焦点和清理通过 E2E；
- 连续 mount/unmount 无全局监听泄漏；
- Slider/Scrollbar 的 mouse、touch/pointer 和 keyboard 路径通过测试；
- Table 泛型类型可在消费端正确推导；
- TableColumn 最终 API 已写入 breaking-change 文档；
- 所有组件可在 SSR 中渲染或安全降级。

## 13. 阶段 7：文档、消费端验证和发布

### 工作内容

1. 将现有 37 个 Vue 示例迁移到 Svelte；
2. 为每个组件提供：

   - 安装和 import；
   - Props；
   - bindable values；
   - callbacks；
   - Snippets；
   - 实例方法；
   - 键盘交互；
   - 主题变量。

3. 编写 Vue → Svelte 使用迁移指南；
4. 执行完整视觉回归；
5. 验证发布 tarball：

   - package 文件清单；
   - source map/type declaration；
   - 字体、CSS、locale；
   - 根入口和所有公开子路径；
   - tree-shaking；
   - SvelteKit SSR/SSG；
   - Vite Svelte CSR。

6. 清理旧实现：

   - 仅在全部门禁通过后移除 Vue 依赖；
   - 旧源码移动或删除独立提交；
   - 不在同一提交混合迁移功能与大规模删除。

7. 发布：

   - 发布 prerelease；
   - 至少一个真实消费项目试用；
   - 修复阻断问题；
   - 发布 stable；
   - 保留 Vue 包维护说明和版本边界。

### 最终退出门槛

- 40 个组件均已迁移并记录 API；
- 37 个示例均可访问；
- 所有 CI 门禁通过；
- `svelte-check` 无 error，warning 已审计；
- SSR import、SSR render 和 hydration 均通过；
- npm tarball 可在两类独立消费端使用；
- 无 Vue runtime、Vue VNode 或 Vue plugin API 残留；
- 迁移指南列出全部 breaking changes；
- prerelease 已完成真实项目验证。

## 14. 每个组件的 Definition of Done

一个组件只有同时满足以下条件才视为迁移完成：

- [ ] 公共契约已经确认；
- [ ] 使用 TypeScript 声明 props、callbacks、Snippets 和实例方法；
- [ ] 不在模块 import 阶段访问浏览器 API；
- [ ] 所有 listener、observer、RAF 和 timer 均有清理；
- [ ] 正常、禁用、空、错误等适用状态已覆盖；
- [ ] 键盘、焦点和 ARIA 行为已验证；
- [ ] 关键视觉状态与基线一致；
- [ ] 单元/组件测试已通过；
- [ ] 文档与示例已完成；
- [ ] 可从打包 tarball 正常导入；
- [ ] SSR 和 hydration 无错误；
- [ ] breaking change 已记录。

## 15. PR 和提交策略

- 每个阶段独立 PR；阶段 6 可拆为 Overlay、DOM interaction、Table 三个 PR；
- 每个 PR 只包含一个可独立验收的迁移批次；
- 公共 API 变更先更新 decision/contract 文档，再提交实现；
- 样式机械迁移与行为重构尽量分开提交；
- 旧 Vue 源码在阶段 7 之前保留，便于对照和回滚；
- 不在未通过阶段门槛时开始依赖该阶段的大批后续组件；
- 重要组件采用“基础设施 → 组件 → 测试 → 文档”的提交顺序。

## 16. 风险和缓解措施

| 风险                     | 影响                         | 缓解                                              |
| ------------------------ | ---------------------------- | ------------------------------------------------- |
| 无测试基线               | 难以识别行为回归             | 阶段 0 先建立契约、截图和高风险交互基线           |
| Table VNode 反射不可移植 | 需要 breaking API            | 阶段 0 提前确认显式 columns 或 Context 注册方案   |
| 全局 Zenless 单例        | SSR 请求间状态污染           | Provider/context 按组件树隔离，不共享可变模块单例 |
| import 时访问 DOM        | SvelteKit SSR 构建或运行失败 | 建立 SSR import 门禁，浏览器逻辑放到挂载生命周期  |
| scoped CSS 结果不同      | 视觉偏差或选择器失效         | 保留 class、建立视觉快照、逐组件审计编译结果      |
| 字体/CSS 导出错误        | 打包后图标丢失               | tarball 消费端测试，不只在 monorepo 源码中测试    |
| overlay 焦点管理不足     | a11y 回归                    | 统一 overlay primitive，Playwright 键盘和焦点测试 |
| API 迁移中命名漂移       | 使用体验不一致               | 阶段 0 固定 callback/bindable/Snippet 命名规范    |
| 一次性删除 Vue 源码      | 难以对照和回滚               | 阶段 7 才执行独立清理提交                         |

## 17. 阶段开始前的待确认项

以下项目不会阻塞阶段 0，但会阻塞阶段 1 的发布配置：

- 最终 npm 包名和 scope；
- 是否承诺与 Vue 版本保持相同组件名；
- Svelte 最低支持版本；
- `Table` 选择显式 columns API 还是声明式 TableColumn；
- callback prop 的统一命名规则；
- 是否要求所有现有 CSS class 都属于兼容契约；
- Vue 包后续是继续维护、冻结还是归档；
- prerelease 的版本号和 npm dist-tag。
