# 组件契约清单

下表覆盖迁移前 40 个具名 Vue 组件。公共值类型均为 TypeScript；父子关系通过类型化 Context；适用的原生 attributes 从组件根元素转发。

| # | Svelte 组件 | 核心值/Props | Callbacks | Snippets / Context | DOM / 浏览器能力 |
| -: | --- | --- | --- | --- | --- |
| 1 | ZenlessBacktop | target, visibleHeight, right, bottom | onclick | children | target scroll listener（清理） |
| 2 | ZenlessBadge | value, max, hidden, type | — | children | `.z-badge` |
| 3 | ZenlessButton | type, size, icon, loading, disabled | onclick | children | 原生 button |
| 4 | ZenlessCard | title, content | — | children/header/footer | `.z-card` |
| 5 | ZenlessCheckbox | bind:checked, value, disabled | onchange | children / ChoiceGroup | 原生 checkbox |
| 6 | ZenlessCheckboxButton | bind:checked, value | onchange | children / ChoiceGroup | 原生 checkbox |
| 7 | ZenlessCheckboxGroup | bind:value, min, max, disabled | onchange | children / provider | 动态子项 |
| 8 | ZenlessCollapse | bind:value, accordion, plain | onchange | children / provider | — |
| 9 | ZenlessCollapseItem | name, title, disabled | — | children/titleContent / consumer | ARIA expanded |
| 10 | ZenlessDrawer | bind:open, width, mask | open/close/cancel/confirm | children/titleContent/footer | portal/focus/scroll lock |
| 11 | ZenlessDropdown | bind:open, trigger, hideOnCommand | oncommand/onopenchange | children/content / provider | outside/Escape/focus |
| 12 | ZenlessDropdownItem | value, disabled | oncommand | children / consumer | menuitem |
| 13 | ZenlessForm | inline, labelPosition, labelWidth | submit 等原生事件 | children / provider | 原生 form |
| 14 | ZenlessFormItem | label, required, inline, labelWidth | — | children/labelContent / consumer | label 关联 |
| 15 | ZenlessIcon | name, size, color | — | — | icon font / aria-label |
| 16 | ZenlessInput | bind:value, clearable, password | oninput/onchange | prefix/suffix | 原生 input/focus |
| 17 | ZenlessLink | href, type, disabled, underline | onclick | children | 原生 anchor |
| 18 | ZenlessMenu | bind:value, accordion | onchange | children / provider | roving focus |
| 19 | ZenlessMenuItem | name, disabled | onselect | children / consumer | menuitem |
| 20 | ZenlessMessage | message, type | — | children | status |
| 21 | ZenlessModal | bind:open, mask, fullscreen, width | open/close/cancel/confirm | children/titleContent/footer | portal/focus/scroll lock |
| 22 | ZenlessPagination | bind:value, total, pageSize | onchange | — | buttons/locale |
| 23 | ZenlessPattern | type | — | children | `.z-pattern` |
| 24 | ZenlessProgress | percent, type, color | — | children | progressbar |
| 25 | ZenlessRadio | bind:checked, value, disabled | onchange | children / ChoiceGroup | 原生 radio |
| 26 | ZenlessRadioButton | bind:checked, value | onchange | children / ChoiceGroup | 原生 radio |
| 27 | ZenlessRadioGroup | bind:value, disabled, size | onchange | children / provider | 动态子项 |
| 28 | ZenlessScrollbar | fixed, hideScroll, resizable | onscroll | children | ResizeObserver/pointer drag；scrollTo |
| 29 | ZenlessSelect | bind:value, clearable, disabled | onchange/onopenchange | children/empty / provider | listbox/outside/Escape |
| 30 | ZenlessOption | value, label, disabled | — | children / consumer | option/动态注销 |
| 31 | ZenlessSlider | bind:value, min, max, step | onchange | — | pointer drag/slider ARIA |
| 32 | ZenlessSubMenu | bind:open, title, disabled | onopenchange | children/titleContent / Menu | nested menu |
| 33 | ZenlessSwitch | bind:checked, disabled | onchange | — | switch |
| 34 | ZenlessTable | data, generic columns, rowKey | 原生容器事件 | children/empty / provider | table SSR |
| 35 | ZenlessTableColumn | prop, label, width | — | cell/header / consumer | 动态注册注销 |
| 36 | ZenlessTabPanel | name, label, lazy, disabled | — | children/labelContent / consumer | tabpanel |
| 37 | ZenlessTabs | bind:value, placement | onchange | children / provider | tablist/roving focus |
| 38 | ZenlessTag | type, size, closable | onclose | children | close button |
| 39 | ZenlessTextarea | bind:value, autoSize | oninput/onchange | — | textarea/resize |
| 40 | ZenlessTooltip | content, placement, visible | — | children/contentSnippet | tooltip |

额外基础组件：`ZenlessProvider`、`ZenlessOverlayHost`、`ZenlessMessageHost`。实例方法类型 `ZenlessScrollbarInstance` 明确包含 `getScrollTarget()` 与 `scrollTo()`。
