export interface ComponentDocMeta {
	slug: string;
	title: string;
	components: string[];
	summary: string;
	bindable?: string;
	callbacks?: string;
	snippets?: string;
	keyboard?: string;
}

export const componentDocs: ComponentDocMeta[] = [
	{
		slug: 'backtop',
		title: 'Backtop',
		components: ['ZenlessBacktop'],
		summary: '自定义滚动容器的返回顶部按钮。',
		callbacks: 'onclick（原生）',
		keyboard: 'Enter / Space'
	},
	{
		slug: 'badge',
		title: 'Badge',
		components: ['ZenlessBadge'],
		summary: '数字或文本角标。',
		snippets: 'children'
	},
	{
		slug: 'button',
		title: 'Button',
		components: ['ZenlessButton'],
		summary: '主题按钮、图标、加载与禁用状态。',
		callbacks: 'onclick',
		snippets: 'children',
		keyboard: 'Enter / Space'
	},
	{
		slug: 'card',
		title: 'Card',
		components: ['ZenlessCard'],
		summary: '标题、内容和操作区域容器。',
		snippets: 'children / header / footer'
	},
	{
		slug: 'checkbox',
		title: 'Checkbox',
		components: ['ZenlessCheckbox', 'ZenlessCheckboxGroup', 'ZenlessCheckboxButton'],
		summary: '复选框及约束分组。',
		bindable: 'bind:checked / bind:value',
		callbacks: 'onchange',
		keyboard: 'Space'
	},
	{
		slug: 'collapse',
		title: 'Collapse',
		components: ['ZenlessCollapse', 'ZenlessCollapseItem'],
		summary: '支持手风琴和动态面板的折叠容器。',
		bindable: 'bind:value',
		callbacks: 'onchange',
		snippets: 'children / titleContent',
		keyboard: 'Enter / Space'
	},
	{
		slug: 'drawer',
		title: 'Drawer',
		components: ['ZenlessDrawer'],
		summary: '共享 Modal 焦点和关闭协议的侧边抽屉。',
		bindable: 'bind:open',
		callbacks: 'onopen / onclose / oncancel / onconfirm',
		snippets: 'children / titleContent / footer',
		keyboard: 'Escape / Tab'
	},
	{
		slug: 'dropdown',
		title: 'Dropdown',
		components: ['ZenlessDropdown', 'ZenlessDropdownItem'],
		summary: '点击或悬停触发的命令菜单。',
		bindable: 'bind:open',
		callbacks: 'oncommand / onopenchange',
		snippets: 'children / content',
		keyboard: 'Arrow keys / Home / End / Escape'
	},
	{
		slug: 'form',
		title: 'Form',
		components: ['ZenlessForm', 'ZenlessFormItem'],
		summary: '标签布局和原生表单语义。',
		snippets: 'children / labelContent'
	},
	{
		slug: 'icon',
		title: 'Icon',
		components: ['ZenlessIcon'],
		summary: '图标字体封装与可访问名称。'
	},
	{
		slug: 'input',
		title: 'Input',
		components: ['ZenlessInput'],
		summary: '可清空、密码切换和原生属性转发。',
		bindable: 'bind:value',
		callbacks: 'oninput / onchange',
		snippets: 'prefix / suffix'
	},
	{
		slug: 'link',
		title: 'Link',
		components: ['ZenlessLink'],
		summary: '主题链接和禁用状态。',
		snippets: 'children',
		keyboard: 'Enter'
	},
	{
		slug: 'menu',
		title: 'Menu',
		components: ['ZenlessMenu', 'ZenlessMenuItem', 'ZenlessSubMenu'],
		summary: '支持嵌套、手风琴和动态项的导航菜单。',
		bindable: 'bind:value / bind:open',
		callbacks: 'onchange / onselect / onopenchange',
		keyboard: 'Arrow keys / Home / End / Enter / Space'
	},
	{
		slug: 'message',
		title: 'Message',
		components: ['ZenlessMessage', 'ZenlessMessageHost', 'useMessage'],
		summary: 'Host 队列和 SSR 安全的命令式消息。',
		callbacks: 'useMessage().success/warning/error',
		snippets: 'children'
	},
	{
		slug: 'modal',
		title: 'Modal',
		components: ['ZenlessModal'],
		summary: 'Portal、焦点陷阱、滚动锁与焦点回归。',
		bindable: 'bind:open',
		callbacks: 'onopen / onclose / oncancel / onconfirm',
		snippets: 'children / titleContent / footer',
		keyboard: 'Escape / Tab / Shift+Tab'
	},
	{
		slug: 'pagination',
		title: 'Pagination',
		components: ['ZenlessPagination'],
		summary: '分页值、总数和禁用边界。',
		bindable: 'bind:value',
		callbacks: 'onchange',
		keyboard: 'Enter / Space'
	},
	{
		slug: 'pattern',
		title: 'Pattern',
		components: ['ZenlessPattern'],
		summary: '可复用背景纹理容器。',
		snippets: 'children'
	},
	{
		slug: 'progress',
		title: 'Progress',
		components: ['ZenlessProgress'],
		summary: '线性与环形进度。',
		snippets: 'children'
	},
	{
		slug: 'radio',
		title: 'Radio',
		components: ['ZenlessRadio', 'ZenlessRadioGroup', 'ZenlessRadioButton'],
		summary: '单选框及按钮样式分组。',
		bindable: 'bind:checked / bind:value',
		callbacks: 'onchange',
		keyboard: 'Arrow keys / Space'
	},
	{
		slug: 'scrollbar',
		title: 'Scrollbar',
		components: ['ZenlessScrollbar'],
		summary: 'ResizeObserver、自定义轨道与明确实例方法。',
		callbacks: 'onscroll',
		snippets: 'children',
		keyboard: '原生滚动键'
	},
	{
		slug: 'select',
		title: 'Select',
		components: ['ZenlessSelect', 'ZenlessOption'],
		summary: '值到标签映射、动态选项与空状态。',
		bindable: 'bind:value',
		callbacks: 'onchange / onopenchange',
		snippets: 'children / empty',
		keyboard: 'Arrow keys / Home / End / Enter / Escape'
	},
	{
		slug: 'slider',
		title: 'Slider',
		components: ['ZenlessSlider'],
		summary: 'Pointer Events 与键盘可调滑块。',
		bindable: 'bind:value',
		callbacks: 'onchange',
		keyboard: 'Arrow keys / Home / End'
	},
	{
		slug: 'switch',
		title: 'Switch',
		components: ['ZenlessSwitch'],
		summary: '布尔切换控件。',
		bindable: 'bind:checked',
		callbacks: 'onchange',
		keyboard: 'Space'
	},
	{
		slug: 'table',
		title: 'Table',
		components: ['ZenlessTable', 'ZenlessTableColumn'],
		summary: '泛型 columns API 或 Context 声明式列。',
		snippets: 'cell / header / empty'
	},
	{
		slug: 'tabs',
		title: 'Tabs',
		components: ['ZenlessTabs', 'ZenlessTabPanel'],
		summary: '动态注册、懒加载和 roving tabindex。',
		bindable: 'bind:value',
		callbacks: 'onchange',
		snippets: 'children / labelContent',
		keyboard: 'Arrow keys / Home / End'
	},
	{
		slug: 'tag',
		title: 'Tag',
		components: ['ZenlessTag'],
		summary: '主题标签和关闭按钮。',
		callbacks: 'onclose',
		snippets: 'children',
		keyboard: 'Enter / Space（关闭）'
	},
	{
		slug: 'textarea',
		title: 'Textarea',
		components: ['ZenlessTextarea'],
		summary: '自动高度与原生 textarea 属性。',
		bindable: 'bind:value',
		callbacks: 'oninput / onchange'
	},
	{
		slug: 'tooltip',
		title: 'Tooltip',
		components: ['ZenlessTooltip'],
		summary: '十二方向提示内容。',
		snippets: 'children / contentSnippet'
	}
];

export const componentSlugs = componentDocs.map((item) => item.slug);
