export interface LocaleMessages {
	common: {
		cancel: string;
		confirm: string;
		close: string;
	};
	select: {
		empty: string;
	};
	table: {
		empty: string;
	};
	pagination: {
		prev: string;
		next: string;
	};
}

export interface ZenlessLocale {
	code: string;
	name: string;
	messages: LocaleMessages;
}

export const zhCn: ZenlessLocale = {
	code: 'zh-CN',
	name: '简体中文',
	messages: {
		common: { cancel: '取消', confirm: '确认', close: '关闭' },
		select: { empty: '暂无数据' },
		table: { empty: '暂无数据' },
		pagination: { prev: '上一页', next: '下一页' }
	}
};

export const enUs: ZenlessLocale = {
	code: 'en-US',
	name: 'English',
	messages: {
		common: { cancel: 'Cancel', confirm: 'Confirm', close: 'Close' },
		select: { empty: 'No data' },
		table: { empty: 'No data' },
		pagination: { prev: 'Previous', next: 'Next' }
	}
};

export const defaultLocale = zhCn;
