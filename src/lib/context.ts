import { createContext } from 'svelte';
import { defaultLocale, type ZenlessLocale } from './locale/index.js';
import { resolveTheme, type ZenlessTheme } from './theme.js';

export interface ZenlessContextValue {
	readonly locale: ZenlessLocale;
	readonly isBold: boolean;
	readonly isItalic: boolean;
	readonly theme: Required<ZenlessTheme>;
}

const defaultContext: ZenlessContextValue = Object.freeze({
	locale: defaultLocale,
	isBold: false,
	isItalic: true,
	theme: resolveTheme()
});

export const [getProvidedZenlessContext, setZenlessContext] = createContext<ZenlessContextValue>();

export function getZenlessContext(): ZenlessContextValue {
	try {
		return getProvidedZenlessContext() ?? defaultContext;
	} catch {
		return defaultContext;
	}
}
