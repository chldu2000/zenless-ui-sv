<script lang="ts">
	import {
		ZenlessModal,
		ZenlessScrollbar,
		ZenlessSlider,
		ZenlessTable,
		ZenlessTableColumn,
		ZenlessTooltip
	} from '../../src/lib/index.js';
	let open = $state(false);
	let value = $state(20);
	let showRole = $state(true);
	const rows: Record<string, unknown>[] = [
		{ name: 'Anby', role: 'Stun' },
		{ name: 'Nicole', role: 'Support' }
	];
</script>

<button type="button" onclick={() => (open = true)}>Open dialog</button>
<ZenlessModal bind:open title="Agent" onconfirm={() => (open = false)}
	><button type="button">Inside</button></ZenlessModal
>
<ZenlessTooltip content="Helpful"><button type="button">Hover target</button></ZenlessTooltip>
<ZenlessSlider bind:value min={0} max={100} step={10} tooltip />
<output data-testid="slider-value">{value}</output>
<div style="width: 100px; height: 100px">
	<ZenlessScrollbar fixed
		><div style="width: 1000px; height: 1000px">Scrollable</div></ZenlessScrollbar
	>
</div>
<button type="button" onclick={() => (showRole = !showRole)}>Toggle column</button>
<ZenlessTable data={rows}>
	<ZenlessTableColumn prop="name" label="Name" />
	{#if showRole}<ZenlessTableColumn prop="role" label="Role" />{/if}
</ZenlessTable>
