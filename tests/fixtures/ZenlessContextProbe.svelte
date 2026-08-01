<script lang="ts">
	import { getZenlessContext } from '../../src/lib/context.js';

	const zenless = getZenlessContext();
</script>

<output
	data-bold={zenless.isBold}
	data-italic={zenless.isItalic}
	data-locale={zenless.locale.code}
	data-theme={zenless.theme.name}>{zenless.locale.messages.common.confirm}</output
>
