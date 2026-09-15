<script lang="ts">
	import { onMount } from 'svelte';
	import { defineButton } from '../../../packages/elements/src/index.js';

	let submitted = $state(0);
	let reset = $state(0);

	onMount(() => {
		void defineButton();
	});
</script>

<svelte:head><title>Elements test fixture</title></svelte:head>

<main>
	<z-button data-testid="default">Default</z-button>
	<z-button data-testid="primary" type="primary" size="large" plain>Primary</z-button>
	<z-button data-testid="disabled" disabled>Disabled</z-button>
	<form
		onsubmit={(event) => {
			event.preventDefault();
			submitted += 1;
		}}
		onreset={() => {
			reset += 1;
		}}
	>
		<z-button data-testid="submit" native-type="submit">Submit</z-button>
		<z-button data-testid="reset" native-type="reset">Reset</z-button>
	</form>
	<output data-testid="counts">{submitted}:{reset}</output>
</main>
