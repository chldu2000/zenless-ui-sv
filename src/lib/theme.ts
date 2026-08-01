export type ZenlessThemeName = 'dark' | 'light';

export interface ZenlessThemeTokens {
	black: string;
	white: string;
	primary: string;
	success: string;
	danger: string;
	warning: string;
	info: string;
	ether: string;
	fire: string;
	electric: string;
	ice: string;
	physical: string;
	gradientGreen: string;
	gradientYellow: string;
	borderRadiusRound: string;
	motionColorDuration: string;
	motionSizeDuration: string;
	motionFlashDuration: string;
	fontFamily: string;
	background: string;
	foreground: string;
	mutedForeground: string;
	border: string;
	panel: string;
}

export interface ZenlessTheme {
	name?: ZenlessThemeName;
	tokens?: Partial<ZenlessThemeTokens>;
}

export const darkThemeTokens: ZenlessThemeTokens = {
	black: '#000',
	white: '#fff',
	primary: '#008bff',
	success: '#00cc0d',
	danger: '#c01c00',
	warning: '#ffc300',
	info: '#ccc',
	ether: '#fe427e',
	fire: '#ff5522',
	electric: '#2eb6ff',
	ice: '#98eff0',
	physical: '#f0d12a',
	gradientGreen: '#91bc00',
	gradientYellow: '#ffea00',
	borderRadiusRound: '9999px',
	motionColorDuration: '1s',
	motionSizeDuration: '0.33s',
	motionFlashDuration: '0.07s',
	fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
	background: '#181818',
	foreground: '#f5f5f5',
	mutedForeground: '#808080',
	border: '#333',
	panel: '#1c1c1c'
};

export const lightThemeTokens: ZenlessThemeTokens = {
	...darkThemeTokens,
	background: '#f6f6f6',
	foreground: '#181818',
	mutedForeground: '#666',
	border: '#d6d6d6',
	panel: '#fff'
};

export function resolveTheme(theme: ZenlessTheme = {}): Required<ZenlessTheme> {
	const name = theme.name ?? 'dark';
	const base = name === 'light' ? lightThemeTokens : darkThemeTokens;

	return { name, tokens: { ...base, ...theme.tokens } };
}

export function themeStyle(theme: ZenlessTheme = {}): string {
	const resolved = resolveTheme(theme);
	return Object.entries(resolved.tokens)
		.map(
			([token, value]) =>
				`--zenless-${token.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}: ${value}`
		)
		.join('; ');
}
