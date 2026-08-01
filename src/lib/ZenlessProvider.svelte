<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setZenlessContext, type ZenlessContextValue } from './context.js';
	import { defaultLocale, type ZenlessLocale } from './locale/index.js';
	import { resolveTheme, themeStyle, type ZenlessTheme } from './theme.js';

	interface Props {
		children?: Snippet;
		locale?: ZenlessLocale;
		isBold?: boolean;
		isItalic?: boolean;
		theme?: ZenlessTheme;
	}

	let {
		children,
		locale = defaultLocale,
		isBold = false,
		isItalic = true,
		theme = {}
	}: Props = $props();

	const context: ZenlessContextValue = {
		get locale() {
			return locale;
		},
		get isBold() {
			return isBold;
		},
		get isItalic() {
			return isItalic;
		},
		get theme() {
			return resolveTheme(theme);
		}
	};

	setZenlessContext(context);
	const style = $derived(themeStyle(theme));
</script>

<div
	class:zenless-bold={isBold}
	class:zenless-italic={isItalic}
	data-zenless-theme={resolveTheme(theme).name}
	{style}
>
	{@render children?.()}
</div>
