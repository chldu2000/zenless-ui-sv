# Zenless UI：框架无关改造路径

> 状态：实施中（阶段 0–1）
> 更新日期：2026-09-15
> 当前基线：`zenless-ui-svelte@0.1.0-next.0`，Svelte 5

## 1. 目标与范围

让原生 HTML、Svelte、Vue 和 React 应用共享同一套 Zenless UI 视觉与交互实现。最终产物以 Custom Elements 为公共入口，状态逻辑与 DOM 行为使用 TypeScript，框架适配包提供符合各框架习惯的类型、事件与绑定体验。

实施采用增量替换：先完成代表性组件的纵向验证，再按依赖关系迁移。现有 Svelte 包在对应组件通过验收后切换到适配实现。文档站继续使用 SvelteKit。

本计划不代表已实现或已发布。包名暂用 `@zenless-ui/core`、`@zenless-ui/elements`、`@zenless-ui/svelte` 表达职责，正式发布前检查命名可用性及旧包升级策略。React/Vue 首先作为消费端验证，是否发布专用适配包由验证结果决定。

## 2. 当前基线与复用范围

以 [组件契约清单](./component-contracts.md) 中的 40 个组件为范围，另包含 Provider、OverlayHost、MessageHost 和公开导出的 Placeholder。

| 现有代码                                 | 迁移方式                                                                 |
| ---------------------------------------- | ------------------------------------------------------------------------ |
| `src/lib/styles/`、`theme.ts`、`locale/` | 复用 token、视觉规则、字体、动画和语言数据；按 Shadow DOM 样式作用域调整 |
| `src/lib/actions/`                       | 抽取安装、更新和清理 DOM 行为的函数；移除核心层的 Svelte Action 类型依赖 |
| `src/lib/internal/`                      | 审核后复用 scroll lock、RAF 和浏览器能力封装                             |
| `context.ts`、各类 `*-context.ts`        | 将 Svelte Context 改为元素注册、配置订阅和独立状态模块                   |
| `.svelte` 文件                           | 提取业务状态和交互，再实现 Custom Element 渲染与生命周期                 |
| `types.ts`、`table-types.ts`             | 分离通用值类型与 Svelte Component/Snippet 类型                           |
| `message.ts`                             | 替换 Svelte mount/unmount，复用消息队列与关闭语义                        |
| `tests/`、消费端脚本、视觉基线           | 保留行为预期，增加真实浏览器元素测试和多框架消费验证                     |

现有 CSS 可复用设计规则，但不能假设全局 `.z-*` 选择器能够穿透 Shadow DOM。现有焦点查询、click-outside 和 portal 同样需要重新验证。

## 3. 目标模块结构

```text
packages/
  core/                  # 值类型、状态模块、DOM 行为、主题和语言数据
  elements/              # Custom Elements、组件样式、注册入口
  svelte/                # Svelte props、绑定、Snippet 适配
src/routes/              # 现有 SvelteKit 文档站
tests/
  elements/              # 浏览器中的元素契约测试
  consumers/             # HTML、Svelte、Vue、React 消费样例
```

目录为目标布局；先增加新包，现有 `src/lib` 随迁移逐步收缩，避免初期整体搬迁。

遵循 codebase-design 的模块设计原则：将 Select 的选择与导航、Overlay 的栈与焦点管理等复杂行为收在小接口后面。真正需要共享的 seam 是状态/DOM 行为与渲染之间；Svelte 和 Custom Elements 是使用这些接口的 adapter。只抽取已有实际用途的行为，不预先建立通用渲染框架。

`core` 区分无 DOM 的状态模块和显式安装到 DOM 的行为模块。安装函数返回更新/清理能力，导入模块时不注册监听器、不访问浏览器全局。Custom Element 负责接线，适配层负责框架使用体验。

## 4. 实现技术与内容模型

默认最终方向是原生 TypeScript Custom Elements。Svelte 的 custom-element 编译可用于短期验证，但它仍包含 Svelte 运行时，Context 和 Snippet 也不会自动成为跨框架契约，因此不作为默认长期实现。若原生实现的重复代码明显增加，可在首阶段记录渲染工具选型结果，再冻结实现方案。

### Shadow DOM 策略

默认验证 open Shadow DOM，以原生默认 slot 和 named slot 承接调用方内容。原生 slot 的内容分发依赖 Shadow DOM，不能同时承诺纯 Light DOM 渲染和原生 slot。参见 [MDN：模板与插槽](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_templates_and_slots)。

- 全局保留 token、字体资源等公共样式；组件内部引入所需规则与动画。
- 内部继续沿用适合的 `z-*` 类名，但外部定制接口改为 CSS custom properties、明确列出的 `part` 和 slots。
- 跨组件后代选择器、`:root` 默认值、字体加载和 slotted 内容样式逐项审计；不能把整份全局 CSS 直接视为可用的 shadow 样式。
- 消费者提供的节点由消费者框架维护；元素更新自身 shadow tree，避免重建或任意移动调用方子节点。
- 若个别组件采用 Light DOM，必须单独定义子节点所有权、更新规则和内容扩展方式，不伪装成原生 slot。

首阶段以 Button、Input、Select 和 Modal 验证内容组合、主题、焦点与浮层。验证通过后冻结样式接口，避免后续从 Light DOM 切换 Shadow DOM 带来第二轮破坏性变更。

## 5. 公共接口约定

以下为计划契约，尚未提供对应包或标签。

| 当前机制                                        | 目标接口                                                    |
| ----------------------------------------------- | ----------------------------------------------------------- |
| 简单 props                                      | JavaScript property；适合 HTML 表达的标量同时支持 attribute |
| `bind:value` / `bind:checked` / `bind:open`     | 可读写 property + 类型化状态事件                            |
| `children`                                      | 默认 slot                                                   |
| `prefix` / `suffix` / `titleContent` / `footer` | 对应 named slot，命名统一为 kebab-case                      |
| 普通 callback                                   | DOM 事件；业务事件使用 `z-` 前缀                            |
| 实例方法                                        | 元素方法，如 `focus()`、`scrollTo()`、`getScrollTarget()`   |
| Svelte Context                                  | 可注销的父子注册与配置订阅                                  |
| action / attachment                             | 连接时安装 DOM 行为，断开时清理                             |
| `tick()`                                        | 由实际渲染机制提供完成通知，不能机械替换为微任务            |

### 属性与事件

- HTML attribute 使用 kebab-case，property 使用 camelCase。为数字转换、无效输入、默认值和反射规则建立逐组件表格。
- 布尔 attribute 遵循 HTML 存在即真的规则，`disabled="false"` 仍为真；关闭使用移除 attribute 或设置 `disabled = false`。
- 对象、数组和渲染函数仅通过 property 传入；不要求在 attribute 中解析 JSON。Select 的 HTML value 默认为字符串，数字/布尔值通过 property 保留类型。
- 用户操作先更新 property，再派发业务事件；外部 property 赋值更新视图但不重复派发用户变更事件，避免适配层回环。
- 使用 `z-input` 表示连续输入，`z-change` 表示提交变化，`z-open-change` 表示用户引起的打开状态变化。分别在 `detail` 中传递 `value`、`checked` 或 `open`。
- 对外业务事件使用 `bubbles: true`、`composed: true`；内部注册事件由所属父元素处理，不作为公共变更事件传播。
- 为关闭前拦截等需求单独定义可取消事件；cancel、confirm 是否关闭必须按现有契约逐项记录，不能在改造时悄悄改变。
- 原生 click 等事件不重复派发。明确 host 的 `aria-*`、`name`、`tabindex` 等属性如何作用于内部控件，不能照搬原有根元素 rest-props 转发。
- 处理元素升级前 property 赋值，并保证重复连接不重复创建内部 DOM 或监听器。

预期使用形式：

```html
<z-select name="agent" placeholder="Select an agent" clearable>
	<z-option value="anby">Anby</z-option>
	<z-option value="nicole">Nicole</z-option>
	<span slot="empty">No agents found</span>
</z-select>
```

```js
// 计划接口示例，待实现后用于消费端测试。
const select = document.querySelector('z-select');
select.value = 'anby';
select.addEventListener('z-change', (event) => {
	console.log(event.detail.value);
});
```

### 父子关系与配置

Select/Option、Tabs/TabPanel、Menu/SubMenu/MenuItem、Collapse/CollapseItem、选择组和 Form 必须明确所属父元素。可使用 composed 注册事件寻找最近的合法宿主，由宿主返回注销与订阅能力；不能只依赖无法跨 shadow root 的 `closest()`。

必须覆盖子项延迟升级、增删、改值、排序、重新挂载、嵌套组隔离和 DOM 移动。注册完成不等于列表永远不变；必要时结合 `slotchange` 或属性变更通知维护顺序。

主题优先使用可继承的 CSS custom properties；locale、粗体/斜体等配置保留有作用域的 Provider 语义，并支持动态更新。浮层脱离原 DOM 位置后仍需保留配置来源及订阅清理。

## 6. 高风险模块

### 表单与无障碍

Input、Textarea、Select、Switch、Checkbox、Radio 等需要验证 form-associated custom elements。`ElementInternals` 可提供表单值、有效性和无障碍相关能力，但不会自动补齐原生输入控件的全部行为。参见 [MDN：ElementInternals](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals)。

验收必须包括 name/value 提交、禁用 fieldset、required、有效性反馈、表单 reset、状态恢复、label 点击聚焦，以及 Radio 互斥。Select 提交选中值而非显示标签。Button 单独验证 submit/reset 与所属 form 的关系。

为浏览器支持范围建立明确矩阵；焦点、键盘、可访问名称及跨 shadow root 的 ARIA 关联在真实浏览器中验证，不能只依赖 jsdom 或设置一个 role。

### Overlay 与消息

Modal/Drawer 共享 overlay 栈、最顶层 Escape、滚动锁计数、焦点限制与恢复；Dropdown/Tooltip 可共享定位能力，但不继承模态行为。现有 `document.activeElement`、`querySelectorAll` 和 outside-click 判断需支持 shadow root 与事件重定向。

优先验证原生 dialog/top layer 能否保持内容所属关系、视觉和焦点语义；如继续使用 portal，明确移动节点的生命周期影响、主题传递和调用方框架的 DOM 所有权。多层浮层必须测试。

Message 以原生 Host 管理队列、定时器、关闭动画与清理，替换 `mount/unmount`。保留作用域 Host 和服务端无 DOM 行为的明确契约。

### Table 与有参数的 Snippet

默认 slot 能承接内容，但不能直接替代 `Snippet<[row, column, index]>`。Table 优先保留 data/columns 的 property 接口，将无框架的单元格渲染协议与 Svelte Snippet adapter 分开。

Table 阶段必须先确定返回内容的类型、更新/销毁责任、行 key 与排序后的复用行为，并验证框架适配层如何挂载和销毁单元格内容。不要将渲染函数序列化到 attribute，也不要默认接受任意 HTML 字符串。保留声明式 TableColumn 的需求须与此协议一起验收。

## 7. 构建、SSR 与适配

- Elements 发布 ESM、类型声明、逐组件入口、`defineAll()` 和样式入口；Svelte 适配优先独立包，使 Elements 不需要 Svelte peer dependency。
- 普通导入不自动注册。注册入口按需加载元素类；同一实现重复注册可安全返回，遇到已被不同实现占用的标签给出明确错误。
- 约定服务端安全入口，避免在无 DOM 时执行 `class extends HTMLElement`。元素实现子路径若仅限浏览器，必须明确标注；服务端安全入口不得静态拉入它们。
- SSR 输出自定义标签与 light DOM 内容，不代表内部 UI 已服务端渲染。首版明确客户端升级的范围，测量升级前布局、首屏内容与可交互时间。
- Svelte 适配不能默认保持原有组件完整 SSR。需要 SSR 的组件在切换前验证服务端渲染方案，或记录明确的兼容性变更；不能用“可安全导入”替代 SSR 验收。
- Svelte adapter 保留 bind、callback 和可映射的 Snippet，使用实际编译与消费测试验证。不要将 legacy `<slot>` 示例视为 Svelte 5 runes 适配方案。
- Vue/React 验证复杂 property、布尔值、自定义事件、类型声明和 SSR；记录实际测试版本。优先使用原生事件监听作为互操作基线。
- 显式注册调用及可选自动注册入口应正确声明副作用，避免打包器移除；字体路径、样式导出和按需产物需从打包后的包验证。

Svelte 编译 Custom Elements 的能力和限制参见 [Svelte 官方文档](https://svelte.dev/docs/svelte/custom-elements)。

## 8. 分阶段实施与验收

| 阶段                | 工作与交付物                                                                                                       | 进入下一阶段的条件                                                                         |
| ------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| 0：契约与基线       | 扩展 40 个组件及基础设施清单；记录现有事件、方法、视觉、SSR、表单行为；定义浏览器矩阵和兼容范围                    | 每个组件有待实现契约及风险项，旧版验证结果可追溯                                           |
| 1：纵向验证         | 建立最小 Elements 构建与注册；Button 完整试点，Input/Select/Modal 验证表单、组合和浮层；确定 Shadow DOM 与样式策略 | 原生 HTML 和 Svelte 消费通过；动态内容、焦点、主题、SSR 导入及按需包验证通过；关键方案冻结 |
| 2：基础展示         | 完成 Icon、Button、Badge、Tag、Card、Link、Pattern、Progress、Placeholder                                          | 视觉与公开事件通过；Svelte 对应 adapter 验证；样式和字体资源从包加载正常                   |
| 3：控件与浏览器行为 | Input、Textarea、Switch、Slider、Checkbox、Radio 及 Button 变体、Pagination、Scrollbar、Backtop                    | 表单、键盘、拖动、resize、反复连接和监听器清理通过；供后续组合组件使用的依赖就绪           |
| 4：组合组件         | 选择组、Form/FormItem、Collapse、Tabs、Select、Dropdown、Menu 及子组件                                             | 动态注册注销、顺序变化、嵌套隔离、禁用项、焦点和配置更新通过                               |
| 5：浮层与消息       | 完成 Tooltip、Modal、Drawer、OverlayHost、Message、MessageHost；完善 Provider                                      | 多浮层、最顶层 Escape、焦点恢复、滚动锁、作用域主题/语言和卸载清理通过                     |
| 6：Table 与适配收口 | Table/TableColumn 渲染协议、复杂 Snippet 适配；补齐所有旧导出映射                                                  | 40 个组件及额外导出均有实现、兼容映射或明确的破坏性变更说明                                |
| 7：发布准备         | 文档站切换、迁移指南、消费端矩阵、包检查和 prerelease 清单                                                         | 安装真实打包产物后全部必要检查通过；发布操作另行执行                                       |

阶段顺序以真实依赖图调整：被依赖的 Icon、Scrollbar、Input、Provider 等优先完成。阶段 1 的复杂组件验证用于降低技术风险，不计为完整组件交付。

## 9. 验证与切换规则

每个迁移批次验证以下相关项：

1. 状态模块测试通过公共接口覆盖状态转换，不绑定内部字段。
2. 真实浏览器元素测试覆盖 attribute/property、事件次数和 detail、slot 更新、连接/断开与资源释放。
3. 表单、键盘、焦点和无障碍语义按组件风险验证；支持矩阵包含 Chromium、Firefox、WebKit 的实际版本。
4. 复用现有视觉基线检查桌面/移动端、主题、动画和打开状态，调整选择器以适配 Shadow DOM，不用更新截图掩盖回归。
5. 从打包产物运行原生 HTML 和框架消费测试，包含 SSR 导入、客户端升级、类型与重复注册。
6. 保留现有 Svelte 检查和回归测试；新的包检查纳入仓库验证脚本后再切换对应导出。

组件以完整行为为单位切换，迁移期间短暂并存两种实现。验收失败时撤回该组件的入口切换，保留原实现；通过后删除重复交互逻辑。记录每批提交与验证结果，最终收口前不删除整套旧实现。

首个可执行批次为阶段 0–1：契约清单、最小构建、Button 纵向实现和三个高风险验证样例。完成后根据实际 CSS 改动、适配成本与浏览器结果细化后续工作量，不预先承诺重写工期。

## 10. 实施记录

### 2026-09-15：阶段 0–1 / Batch 1

- 建立 `packages/core` 与 `packages/elements` 源码边界；普通入口不静态求值浏览器元素实现。
- 完成 `<z-button>` 首个原生 Custom Element：open Shadow DOM、默认 slot、`part="button"`、属性/property 同步、焦点方法和 form submit/reset 行为。
- 增加幂等 `defineButton()` / `defineAll()` 注册入口，并对标签冲突给出明确错误。
- 在组件契约清单冻结 Button 第一版 attribute/property/slot/method/style 接口。
- 增加 Svelte 消费夹具和真实浏览器契约测试。当前受执行环境禁止监听本地端口（`listen EPERM 127.0.0.1:4173`）影响，Playwright 用例已建立但需在允许启动预览服务的环境复跑。

本批次只标志迁移开始，不代表阶段 1 完成。下一批需要补齐可发布构建产物与原生 HTML 消费夹具，然后依次进行 Input、Select、Modal 风险验证。
