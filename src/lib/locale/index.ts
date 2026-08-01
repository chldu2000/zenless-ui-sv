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
		table: { empty: '暂无数据' }
	}
};

export const enUs: ZenlessLocale = {
	code: 'en-US',
	name: 'English',
	messages: {
		common: { cancel: 'Cancel', confirm: 'Confirm', close: 'Close' },
		select: { empty: 'No data' },
		table: { empty: 'No data' }
	}
};

export const defaultLocale = zhCn;
