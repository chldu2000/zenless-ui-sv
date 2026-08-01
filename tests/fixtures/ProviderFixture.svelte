<script lang="ts">
	import ZenlessProvider from '../../src/lib/ZenlessProvider.svelte';
	import type { ZenlessLocale } from '../../src/lib/locale/index.js';
	import type { ZenlessTheme } from '../../src/lib/theme.js';
	import ZenlessContextProbe from './ZenlessContextProbe.svelte';

	interface Props {
		locale?: ZenlessLocale;
		isBold?: boolean;
		isItalic?: boolean;
		theme?: ZenlessTheme;
	}

	let { locale, isBold, isItalic, theme }: Props = $props();
</script>

<ZenlessProvider {locale} {isBold} {isItalic} {theme}>
	<ZenlessContextProbe />
</ZenlessProvider>
