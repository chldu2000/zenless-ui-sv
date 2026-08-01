export interface AttributeDoc extends Record<string, unknown> {
	name: string;
	description: string;
	type: string;
	values: string;
	default: string;
}

export interface EventDoc extends Record<string, unknown> {
	name: string;
	description: string;
	parameters: string;
}

export interface MethodDoc extends Record<string, unknown> {
	name: string;
	description: string;
}

export interface SnippetDoc extends Record<string, unknown> {
	name: string;
	description: string;
}

export interface ComponentApiDoc {
	attributes?: AttributeDoc[];
	events?: EventDoc[];
	methods?: MethodDoc[];
	snippets?: SnippetDoc[];
}

const sizes = 'extra / large / small / mini';
const colors =
	'default / primary / success / danger / warning / info / ether / fire / electric / ice / physical';
const placements =
	'top / top-left / top-right / right / right-top / right-bottom / bottom / bottom-left / bottom-right / left / left-top / left-bottom';
const choiceValue = 'string | number | boolean';
const navigationValue = 'string | number';

function attr(
	name: string,
	description: string,
	type: string,
	values = '—',
	defaultValue = '—'
): AttributeDoc {
	return { name, description, type, values, default: defaultValue };
}

function event(name: string, description: string, parameters = '—'): EventDoc {
	return { name, description, parameters };
}

function snippet(name: string, description: string): SnippetDoc {
	return { name, description };
}

const nativeButton = attr('...rest', '其余属性会转发给原生 button 元素。', 'HTMLButtonAttributes');
const nativeDiv = attr(
	'...rest',
	'其余属性会转发给根 div 元素。',
	'HTMLAttributes<HTMLDivElement>'
);
const nativeInput = attr(
	'...rest',
	'其余属性会转发给原生 input 元素，例如 name、placeholder、autocomplete。',
	'HTMLInputAttributes'
);
const nativeTextarea = attr(
	'...rest',
	'其余属性会转发给原生 textarea 元素，例如 rows、maxlength、placeholder。',
	'HTMLTextareaAttributes'
);

const radioAttributes = [
	attr(
		'checked / bind:checked',
		'当前是否选中，支持双向绑定。',
		'boolean',
		'true / false',
		'false'
	),
	attr('value', '控件在分组中代表的值。', 'ChoiceValue', choiceValue, 'true'),
	attr('disabled', '是否禁用控件。', 'boolean', 'true / false', 'false'),
	attr('size', '控件尺寸。', 'ZenlessSize', sizes),
	attr('indeterminate', '是否显示半选状态。', 'boolean', 'true / false', 'false'),
	nativeInput
];

const radioEvents = [
	event('onchange', '选中状态或分组值改变时触发。', 'checked: boolean | value: ChoiceValue')
];
const radioSnippets = [snippet('children', '控件标签内容。')];

const groupAttributes = [
	attr('value / bind:value', '当前选中的值或值数组，支持双向绑定。', 'ChoiceValue | ChoiceValue[]'),
	attr('disabled', '是否禁用整个分组。', 'boolean', 'true / false', 'false'),
	attr('size', '分组内控件的统一尺寸。', 'ZenlessSize', sizes),
	attr('min', '复选模式允许选择的最小数量。', 'number'),
	attr('max', '复选模式允许选择的最大数量。', 'number'),
	nativeDiv
];

const modalAttributes = [
	attr('open / bind:open', '是否显示对话框，支持双向绑定。', 'boolean', 'true / false', 'false'),
	attr('title', '标题文本；提供 titleContent 时由自定义标题替代。', 'string', '—', "''"),
	attr('width', '非全屏模式下的内容宽度，number 按 px 处理。', 'string | number', '—', '450'),
	attr('mask', '是否显示背景遮罩。', 'boolean', 'true / false', 'true'),
	attr('maskClosable', '点击遮罩时是否关闭。', 'boolean', 'true / false', 'true'),
	attr('closable', '是否显示右上角关闭按钮。', 'boolean', 'true / false', 'true'),
	attr('fullscreen', '是否使用全屏模式。', 'boolean', 'true / false', 'false'),
	attr('showFooter', '是否显示底部操作区。', 'boolean', 'true / false', 'true'),
	attr('showCancel', '默认操作区是否显示取消按钮。', 'boolean', 'true / false', 'true'),
	attr('cancelText', '取消按钮文字；未提供时使用当前语言包。', 'string'),
	attr('confirmText', '确认按钮文字；未提供时使用当前语言包。', 'string'),
	nativeDiv
];

const modalEvents = [
	event('onopen', '对话框打开后触发。'),
	event('onclose', '关闭按钮、遮罩或 Escape 触发关闭时调用。'),
	event('oncancel', '点击取消按钮时调用。'),
	event('onconfirm', '点击确认按钮时调用。')
];

const modalSnippets = [
	snippet('children', '对话框主体内容。'),
	snippet('titleContent', '自定义标题区内容。'),
	snippet('footer', '自定义底部操作区内容。')
];

export const componentApiDocs: Record<string, ComponentApiDoc> = {
	ZenlessBacktop: {
		attributes: [
			attr('target', '触发滚动并被监听的滚动容器。', 'HTMLElement'),
			attr('visibleHeight', '滚动超过该高度后显示返回顶部按钮。', 'number', '≥ 0', '200'),
			attr('right', '按钮距离视口右侧的像素值。', 'number', '—', '60'),
			attr('bottom', '按钮距离视口底部的像素值。', 'number', '—', '40'),
			nativeButton
		],
		events: [event('onclick', '点击按钮并执行返回顶部后触发。', 'event: MouseEvent')],
		snippets: [snippet('children', '自定义按钮内容；未提供时显示向上箭头。')]
	},
	ZenlessBadge: {
		attributes: [
			attr('value', '徽标中显示的数字或文本。', 'string | number'),
			attr('type', '徽标主题颜色。', 'ZenlessColor', colors, 'default'),
			attr('isDot', '是否只显示小圆点。', 'boolean', 'true / false', 'false'),
			nativeDiv
		],
		snippets: [snippet('children', '被徽标标记的内容。')]
	},
	ZenlessButton: {
		attributes: [
			attr('size', '按钮尺寸。', 'ZenlessSize', sizes),
			attr('type', '按钮主题。', 'ZenlessColor', colors, 'default'),
			attr('icon', '按钮图标名称，或图标名称到颜色的映射。', 'string | Record<string, string>'),
			attr('loading', '是否显示加载状态并禁用交互。', 'boolean', 'true / false', 'false'),
			attr('disabled', '是否禁用按钮。', 'boolean', 'true / false', 'false'),
			attr('plain', '是否使用朴素样式。', 'boolean', 'true / false', 'false'),
			attr('round', '是否使用圆角外观。', 'boolean', 'true / false', 'true'),
			attr('circle', '是否使用圆形按钮外观。', 'boolean', 'true / false', 'false'),
			attr('hollow', '是否使用镂空样式。', 'boolean', 'true / false', 'false'),
			attr('highlight', '是否启用醒目闪烁主题。', 'boolean', 'true / false', 'false'),
			attr(
				'nativeType',
				'原生 button 的 type 属性。',
				'string',
				'button / submit / reset',
				'button'
			),
			nativeButton
		],
		events: [event('onclick', '按钮点击时触发。', 'event: MouseEvent')],
		snippets: [snippet('children', '按钮文字或自定义内容。')]
	},
	ZenlessCard: {
		attributes: [
			attr('image', '卡片顶部图片地址。', 'string'),
			attr('imageAlt', '顶部图片的替代文本。', 'string', '—', "''"),
			attr('avatar', '头像图片地址。', 'string'),
			attr('avatarAlt', '头像图片的替代文本。', 'string', '—', "''"),
			attr('nickname', '用户昵称。', 'string'),
			attr('title', '卡片标题。', 'string'),
			attr('content', '卡片描述。', 'string'),
			attr('...rest', '其余属性会转发给根 article 元素。', 'HTMLAttributes<HTMLElement>')
		],
		snippets: [snippet('children', '追加在预设卡片内容之后的自定义内容。')]
	},
	ZenlessCheckbox: { attributes: radioAttributes, events: radioEvents, snippets: radioSnippets },
	ZenlessCheckboxButton: {
		attributes: radioAttributes,
		events: radioEvents,
		snippets: radioSnippets
	},
	ZenlessCheckboxGroup: {
		attributes: groupAttributes,
		events: [event('onchange', '选中值数组改变时触发。', 'value: ChoiceValue[]')],
		snippets: [snippet('children', 'Checkbox 或 CheckboxButton 列表。')]
	},
	ZenlessCollapse: {
		attributes: [
			attr(
				'value / bind:value',
				'当前展开面板的标识，支持双向绑定。',
				'NavigationValue | NavigationValue[]'
			),
			attr('accordion', '是否一次只允许展开一个面板。', 'boolean', 'true / false', 'false'),
			attr('plain', '是否使用朴素面板样式。', 'boolean', 'true / false', 'false'),
			nativeDiv
		],
		events: [event('onchange', '展开面板发生变化时触发。', 'value: NavigationValue[]')],
		snippets: [snippet('children', 'CollapseItem 列表。')]
	},
	ZenlessCollapseItem: {
		attributes: [
			attr('name', '面板唯一标识。', 'NavigationValue', navigationValue, '自动生成的唯一 ID'),
			attr('title', '面板标题文本。', 'string', '—', "''"),
			attr('disabled', '是否禁止展开或收起。', 'boolean', 'true / false', 'false'),
			nativeDiv
		],
		snippets: [snippet('children', '面板内容。'), snippet('titleContent', '自定义面板标题。')]
	},
	ZenlessDrawer: {
		attributes: modalAttributes,
		events: modalEvents.map((item) => ({
			...item,
			description: item.description.replace('对话框', '抽屉')
		})),
		snippets: modalSnippets.map((item) => ({
			...item,
			description: item.description.replace('对话框', '抽屉')
		}))
	},
	ZenlessDropdown: {
		attributes: [
			attr(
				'open / bind:open',
				'下拉列表是否展开，支持双向绑定。',
				'boolean',
				'true / false',
				'false'
			),
			attr('trigger', '打开下拉列表的触发方式。', 'string', 'hover / click', 'hover'),
			attr('disabled', '是否禁用下拉菜单。', 'boolean', 'true / false', 'false'),
			attr('size', '触发器与菜单项尺寸。', 'ZenlessSize', sizes),
			attr('hideOnCommand', '点击菜单项后是否自动关闭。', 'boolean', 'true / false', 'true'),
			nativeDiv
		],
		events: [
			event('oncommand', '点击可用菜单项时触发。', 'command: unknown'),
			event('ontrigger', '下拉列表显示状态切换时触发。', 'open: boolean'),
			event('onopenchange', 'open 值改变时触发。', 'open: boolean')
		],
		snippets: [
			snippet('children', '触发下拉菜单的内容。'),
			snippet('content', 'DropdownItem 列表。')
		]
	},
	ZenlessDropdownItem: {
		attributes: [
			attr('command', '点击后传给 oncommand 的命令值。', 'unknown', '—', '自动生成的唯一 ID'),
			attr('value', 'command 的 Svelte 友好别名；command 优先。', 'unknown'),
			attr('disabled', '是否禁用菜单项。', 'boolean', 'true / false', 'false'),
			nativeButton
		],
		events: [event('oncommand', '点击当前菜单项时触发。', 'command: unknown')],
		snippets: [snippet('children', '菜单项内容。')]
	},
	ZenlessForm: {
		attributes: [
			attr('inline', '是否使用行内表单布局。', 'boolean', 'true / false', 'false'),
			attr('labelWidth', '所有表单项标签的统一宽度，number 按 px 处理。', 'string | number'),
			attr('labelPosition', '标签位置与对齐方式。', 'string', 'left / right / top'),
			attr('...rest', '其余属性会转发给原生 form 元素。', 'HTMLAttributes<HTMLFormElement>')
		],
		snippets: [snippet('children', 'FormItem 列表。')]
	},
	ZenlessFormItem: {
		attributes: [
			attr('label', '表单项标签文本。', 'string'),
			attr('required', '是否显示必填标记。', 'boolean', 'true / false', 'false'),
			attr('labelWidth', '当前表单项标签宽度；Form 的 labelWidth 优先。', 'string | number'),
			nativeDiv
		],
		snippets: [snippet('children', '表单控件内容。'), snippet('labelContent', '自定义标签内容。')]
	},
	ZenlessIcon: {
		attributes: [
			attr('name', '图标名称，不含 z-icon- 前缀。', 'string'),
			attr('size', '图标尺寸，number 按 px 处理。', 'number | string'),
			attr('color', '主题色名称或任意 CSS 颜色。', 'ZenlessColor | string', colors),
			attr('...rest', '其余属性会转发给根 i 元素。', 'HTMLAttributes<HTMLElement>')
		]
	},
	ZenlessInput: {
		attributes: [
			attr('value / bind:value', '输入值，支持双向绑定。', 'string | number', '—', "''"),
			attr(
				'type',
				'原生输入类型；password 会提供显隐按钮。',
				'string',
				'text / password / email / number / search / tel / url',
				'text'
			),
			attr('size', '输入框尺寸。', 'ZenlessSize', sizes),
			attr('clearable', '有值且聚焦或悬停时是否显示清空按钮。', 'boolean', 'true / false', 'false'),
			attr('prefixIcon', '输入框内部前缀图标名称。', 'string'),
			attr('suffixIcon', '输入框内部后缀图标名称。', 'string'),
			attr('textAlign', '输入文字对齐方式。', 'string', 'left / center / right'),
			attr('clearAriaLabel', '清空按钮的无障碍名称。', 'string', '—', 'Clear'),
			attr('disabled', '是否禁用输入框。', 'boolean', 'true / false', 'false'),
			attr('readonly', '是否只读。', 'boolean', 'true / false', 'false'),
			nativeInput
		],
		events: [
			event('oninput', '输入内容实时变化时触发。', 'value: string'),
			event('onchange', '失焦或清空后触发。', 'value: string'),
			event('onclear', '点击清空按钮时触发。')
		],
		snippets: [
			snippet('prepend', '输入框外部前置内容。'),
			snippet('prefix', '输入框内部前缀内容。'),
			snippet('suffix', '输入框内部后缀内容。'),
			snippet('append', '输入框外部后置内容。')
		]
	},
	ZenlessLink: {
		attributes: [
			attr('href', '原生链接地址。', 'string'),
			attr('type', '链接主题。', 'ZenlessColor', colors, 'default'),
			attr('icon', '兼容 Vue API 的图标名称；当前不会自动渲染。', 'string'),
			attr('highlight', '是否启用醒目闪烁主题。', 'boolean', 'true / false', 'false'),
			attr('underline', '是否显示下划线。', 'boolean', 'true / false', 'false'),
			attr('disabled', '是否禁用跳转与键盘聚焦。', 'boolean', 'true / false', 'false'),
			attr('...rest', '其余属性会转发给原生 a 元素。', 'HTMLAnchorAttributes')
		],
		events: [event('onclick', '链接点击时触发；禁用时不会调用。', 'event: MouseEvent')],
		snippets: [snippet('children', '链接内容。')]
	},
	ZenlessMenu: {
		attributes: [
			attr(
				'value / bind:value',
				'当前激活 MenuItem 的 name，支持双向绑定。',
				'NavigationValue',
				navigationValue
			),
			attr('accordion', '是否只允许展开一个 SubMenu。', 'boolean', 'true / false', 'false'),
			attr('defaultOpen', '初始展开的 SubMenu 标识。', 'NavigationValue | NavigationValue[]'),
			attr('...rest', '其余属性会转发给根 nav 元素。', 'HTMLAttributes<HTMLElement>')
		],
		events: [event('onchange', '菜单激活项改变时触发。', 'name: NavigationValue')],
		snippets: [snippet('children', 'MenuItem 与 SubMenu 列表。')]
	},
	ZenlessMenuItem: {
		attributes: [
			attr('name', '菜单项唯一标识。', 'NavigationValue', navigationValue, '自动生成的唯一 ID'),
			attr('icon', '菜单项图标名称。', 'string'),
			attr('title', '未提供 children 时显示的标题。', 'string', '—', "''"),
			attr('disabled', '是否禁用菜单项。', 'boolean', 'true / false', 'false'),
			nativeButton
		],
		events: [event('onselect', '选择当前菜单项时触发。', 'name: NavigationValue')],
		snippets: [snippet('children', '菜单项自定义内容。')]
	},
	ZenlessSubMenu: {
		attributes: [
			attr('name', '子菜单唯一标识。', 'NavigationValue', navigationValue, '自动生成的唯一 ID'),
			attr('title', '子菜单标题文本。', 'string', '—', "''"),
			attr('icon', '子菜单标题图标名称。', 'string'),
			attr(
				'open / bind:open',
				'是否展开子菜单，支持双向绑定。',
				'boolean',
				'true / false',
				'false'
			),
			attr('disabled', '是否禁用子菜单。', 'boolean', 'true / false', 'false'),
			nativeDiv
		],
		events: [event('onopenchange', '展开状态改变时触发。', 'open: boolean')],
		snippets: [snippet('children', '子菜单内容。'), snippet('titleContent', '自定义标题内容。')]
	},
	ZenlessMessage: {
		attributes: [
			attr('message', '消息文字。', 'string', '—', "''"),
			attr('type', '消息主题。', 'ZenlessMessageType', 'success / error / warning / info', 'info'),
			attr('closing', '是否播放关闭动画。', 'boolean', 'true / false', 'false')
		],
		snippets: [snippet('children', '替代 message 的自定义消息内容。')]
	},
	ZenlessMessageHost: {
		snippets: [snippet('children', '需要访问 useMessage 上下文的应用内容。')]
	},
	useMessage: {
		attributes: [
			attr('message', '消息文字。', 'string', '—', '必填'),
			attr(
				'type',
				'消息主题。',
				'success | error | warning | info',
				'success / error / warning / info',
				'info'
			),
			attr('duration', '消息显示时长，单位毫秒。', 'number', '≥ 0', '3000')
		],
		methods: [
			{ name: 'show(options)', description: '按 options 显示消息，并返回关闭函数。' },
			{ name: 'success(options)', description: '显示 success 主题消息。' },
			{ name: 'warning(options)', description: '显示 warning 主题消息。' },
			{ name: 'error(options)', description: '显示 error 主题消息。' }
		]
	},
	ZenlessModal: {
		attributes: [
			...modalAttributes,
			attr(
				'mode',
				'内部布局模式；通常应使用 ZenlessDrawer 而不是手动设置。',
				'string',
				'modal / drawer',
				'modal'
			)
		],
		events: modalEvents,
		snippets: modalSnippets
	},
	ZenlessPagination: {
		attributes: [
			attr('value / bind:value', '当前页码，支持双向绑定。', 'number', '≥ 1', '1'),
			attr('pageSize', '每页条目数量。', 'number', '> 0', '10'),
			attr('total', '总条目数量。', 'number', '≥ 0', '0'),
			attr('prevText', '上一页按钮文字；未提供时使用语言包。', 'string'),
			attr('nextText', '下一页按钮文字；未提供时使用语言包。', 'string'),
			attr('minimal', '是否仅显示当前页和箭头。', 'boolean', 'true / false', 'false'),
			attr('...rest', '其余属性会转发给根 nav 元素。', 'HTMLAttributes<HTMLElement>')
		],
		events: [event('onchange', '当前页改变时触发。', 'page: number')]
	},
	ZenlessPattern: {
		attributes: [
			attr('type', '背景图案类型。', 'ZenlessPatternType', 'stripes / squares / rhombus'),
			nativeDiv
		],
		snippets: [snippet('children', '图案容器内容。')]
	},
	ZenlessProgress: {
		attributes: [
			attr('type', '进度条形态。', 'string', 'line / circle', 'line'),
			attr('size', '环形进度条尺寸，number 按 px 处理。', 'number | string'),
			attr('percent', '完成百分比，渲染时限制在 0–100。', 'number', '0–100', '0'),
			attr('color', '主题色名称或任意 CSS 颜色。', 'ZenlessColor | string', colors, '#4664ff'),
			nativeDiv
		],
		snippets: [snippet('children', '环形进度条中心内容。')]
	},
	ZenlessRadio: { attributes: radioAttributes, events: radioEvents, snippets: radioSnippets },
	ZenlessRadioButton: { attributes: radioAttributes, events: radioEvents, snippets: radioSnippets },
	ZenlessRadioGroup: {
		attributes: groupAttributes,
		events: [event('onchange', '选中值改变时触发。', 'value: ChoiceValue')],
		snippets: [snippet('children', 'Radio 或 RadioButton 列表。')]
	},
	ZenlessScrollbar: {
		attributes: [
			attr(
				'fixed',
				'内容未溢出时是否仍显示滚动条，可分别控制 x/y。',
				'boolean | { x?: boolean; y?: boolean }',
				'true / false / object',
				'{ y: true }'
			),
			attr('hideScroll', '是否隐藏自定义滚动条。', 'boolean', 'true / false', 'false'),
			attr(
				'resizable',
				'是否使用 ResizeObserver 跟踪尺寸变化。',
				'boolean',
				'true / false',
				'true'
			),
			nativeDiv
		],
		events: [event('onscroll', '内部滚动容器滚动时触发。', 'event: Event')],
		methods: [
			{ name: 'getScrollTarget()', description: '返回内部原生滚动容器。' },
			{ name: 'scrollTo(options)', description: '使用 ScrollToOptions 滚动内部容器。' }
		],
		snippets: [snippet('children', '可滚动内容。')]
	},
	ZenlessSelect: {
		attributes: [
			attr('value / bind:value', '当前选中值，支持双向绑定。', 'SelectValue'),
			attr('size', '选择器尺寸。', 'ZenlessSize', sizes),
			attr('placeholder', '未选择时显示的占位文本。', 'string', '—', 'Select'),
			attr('clearable', '是否允许清空当前选择。', 'boolean', 'true / false', 'false'),
			attr('emptyText', '没有可用选项时显示的文字；未提供时使用语言包。', 'string'),
			attr('disabled', '是否禁用选择器。', 'boolean', 'true / false', 'false'),
			attr('name', '随隐藏 input 提交的字段名。', 'string'),
			nativeDiv
		],
		events: [
			event('onchange', '选中值改变时触发。', 'value: SelectValue | undefined'),
			event('onclear', '点击清空按钮时触发。'),
			event('onopenchange', '下拉列表展开状态改变时触发。', 'open: boolean')
		],
		snippets: [snippet('children', 'Option 列表。'), snippet('empty', '自定义空状态内容。')]
	},
	ZenlessOption: {
		attributes: [
			attr('value', '选项值。', 'SelectValue', 'string / number / boolean', '自动生成的唯一 ID'),
			attr(
				'label',
				'选中后显示的标签。',
				'SelectValue',
				'string / number / boolean',
				'String(value)'
			),
			attr('disabled', '是否禁用选项。', 'boolean', 'true / false', 'false'),
			nativeButton
		],
		snippets: [snippet('children', '下拉列表中的自定义选项内容。')]
	},
	ZenlessSlider: {
		attributes: [
			attr('value / bind:value', '当前数值，支持双向绑定。', 'number', 'min–max', '0'),
			attr('min', '最小值。', 'number', '—', '0'),
			attr('max', '最大值。', 'number', '—', '100'),
			attr('step', '键盘和指针调整的步长。', 'number', '> 0', '1'),
			attr('disabled', '是否禁用滑块。', 'boolean', 'true / false', 'false'),
			attr(
				'tooltip',
				'是否显示数值提示，或提供格式化函数。',
				'boolean | ((value: number) => string)',
				'true / false / formatter',
				'false'
			),
			nativeDiv
		],
		events: [event('onchange', '数值改变时触发。', 'value: number')]
	},
	ZenlessSwitch: {
		attributes: [
			attr(
				'checked / bind:checked',
				'开关状态，支持双向绑定。',
				'boolean',
				'true / false',
				'false'
			),
			attr('disabled', '是否禁用开关。', 'boolean', 'true / false', 'false'),
			nativeInput
		],
		events: [event('onchange', '开关状态改变时触发。', 'checked: boolean')]
	},
	ZenlessTable: {
		attributes: [
			attr('data', '表格行数据。', 'Row[]', '—', '[]'),
			attr(
				'columns',
				'通过对象数组声明列；可替代 TableColumn 子组件。',
				'ZenlessTableColumnDefinition<Row>[]'
			),
			attr('border', '是否显示纵向边框。', 'boolean', 'true / false', 'true'),
			attr('emptyText', '空数据时显示的文字；未提供时使用语言包。', 'string'),
			attr(
				'rowKey',
				'行唯一键字段或返回唯一键的函数。',
				'keyof Row | ((row: Row) => string | number)'
			),
			nativeDiv
		],
		snippets: [
			snippet('children', 'TableColumn 声明列表。'),
			snippet('empty', '自定义空数据内容。')
		]
	},
	ZenlessTableColumn: {
		attributes: [
			attr('prop', '对应行数据的字段名。', 'string', '—', '必填'),
			attr('label', '列标题。', 'string', '—', "''"),
			attr('width', '列宽，number 按 px 处理。', 'string | number')
		],
		snippets: [
			snippet('cell', '自定义单元格，参数为 row、column、index。'),
			snippet('header', '自定义表头，参数为 column。')
		]
	},
	ZenlessTabs: {
		attributes: [
			attr(
				'value / bind:value',
				'当前激活 TabPanel 的 name，支持双向绑定。',
				'NavigationValue',
				navigationValue
			),
			attr(
				'placement',
				'标签栏位置与对齐方式。',
				'ZenlessTabsPlacement',
				'top-left / top / top-right / bottom-left / bottom / bottom-right',
				'top-right'
			),
			nativeDiv
		],
		events: [event('onchange', '激活标签改变时触发。', 'name: NavigationValue')],
		snippets: [snippet('children', 'TabPanel 列表。')]
	},
	ZenlessTabPanel: {
		attributes: [
			attr('name', '标签页唯一标识。', 'NavigationValue', navigationValue, '自动生成的唯一 ID'),
			attr('label', '标签标题文本。', 'string', '—', "''"),
			attr('disabled', '是否禁用标签。', 'boolean', 'true / false', 'false'),
			attr('lazy', '是否在首次激活后才渲染内容。', 'boolean', 'true / false', 'false'),
			nativeDiv
		],
		snippets: [snippet('children', '标签页面板内容。'), snippet('labelContent', '自定义标签标题。')]
	},
	ZenlessTag: {
		attributes: [
			attr('size', '标签尺寸。', 'ZenlessSize', sizes),
			attr('type', '标签主题。', 'ZenlessColor', colors, 'default'),
			attr('plain', '是否使用朴素样式。', 'boolean', 'true / false', 'false'),
			attr('hollow', '是否使用镂空样式。', 'boolean', 'true / false', 'false'),
			attr('round', '是否使用圆角外观。', 'boolean', 'true / false', 'true'),
			attr('closable', '是否显示关闭按钮。', 'boolean', 'true / false', 'false'),
			nativeDiv
		],
		events: [event('onclose', '点击关闭按钮时触发。', 'event: MouseEvent')],
		snippets: [snippet('children', '标签内容。')]
	},
	ZenlessTextarea: {
		attributes: [
			attr('value / bind:value', '文本内容，支持双向绑定。', 'string', '—', "''"),
			attr('size', '文本域尺寸。', 'ZenlessSize', sizes),
			attr('autoSize', '是否根据内容自动调整高度。', 'boolean', 'true / false', 'false'),
			attr('textAlign', '文字对齐方式。', 'string', 'left / center / right'),
			attr('disabled', '是否禁用文本域。', 'boolean', 'true / false', 'false'),
			attr('readonly', '是否只读。', 'boolean', 'true / false', 'false'),
			nativeTextarea
		],
		events: [
			event('oninput', '内容实时变化时触发。', 'value: string'),
			event('onchange', '文本域失焦时触发。', 'value: string')
		]
	},
	ZenlessTooltip: {
		attributes: [
			attr('content', '提示文字；提供 contentSnippet 时由自定义内容替代。', 'string', '—', "''"),
			attr('placement', '提示出现的位置。', 'ZenlessPlacement', placements, 'top'),
			attr('visible', '是否强制保持提示可见。', 'boolean', 'true / false', 'false'),
			attr('disabled', '是否禁用提示。', 'boolean', 'true / false', 'false'),
			nativeDiv
		],
		snippets: [
			snippet('children', '触发提示的内容。'),
			snippet('contentSnippet', '自定义提示内容。')
		]
	}
};
