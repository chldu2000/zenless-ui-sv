<script lang="ts">
	import {
		ZenlessCollapse,
		ZenlessCollapseItem,
		ZenlessDropdown,
		ZenlessDropdownItem,
		ZenlessMenu,
		ZenlessMenuItem,
		ZenlessOption,
		ZenlessSelect,
		ZenlessSubMenu,
		ZenlessTabPanel,
		ZenlessTabs
	} from '../../src/lib/index.js';

	let collapseValue = $state<(string | number)[]>(['first']);
	let tabValue = $state<string | number>('one');
	let menuValue = $state<string | number>();
	let selectValue = $state<string | number | boolean>();
	let showDynamic = $state(true);
	let command = $state('');
</script>

<ZenlessCollapse bind:value={collapseValue} accordion>
	<ZenlessCollapseItem name="first" title="First">First content</ZenlessCollapseItem>
	<ZenlessCollapseItem name="second" title="Second">Second content</ZenlessCollapseItem>
	<ZenlessCollapseItem name="disabled" title="Disabled" disabled>Never</ZenlessCollapseItem>
</ZenlessCollapse>
<output data-testid="collapse-value">{collapseValue.join(',')}</output>

<button type="button" onclick={() => (showDynamic = !showDynamic)}>Toggle dynamic</button>
<ZenlessTabs bind:value={tabValue}>
	<ZenlessTabPanel name="one" label="One">Panel one</ZenlessTabPanel>
	{#if showDynamic}<ZenlessTabPanel name="two" label="Two" lazy>Panel two</ZenlessTabPanel>{/if}
	<ZenlessTabPanel name="off" label="Off" disabled>Disabled panel</ZenlessTabPanel>
</ZenlessTabs>
<output data-testid="tab-value">{tabValue}</output>

<ZenlessMenu bind:value={menuValue} accordion>
	<ZenlessMenuItem name="dashboard">Dashboard</ZenlessMenuItem>
	<ZenlessMenuItem name="disabled" disabled>Disabled menu</ZenlessMenuItem>
	<ZenlessSubMenu title="Agents">
		<ZenlessMenuItem name="anby">Anby</ZenlessMenuItem>
	</ZenlessSubMenu>
</ZenlessMenu>
<output data-testid="menu-value">{menuValue ?? ''}</output>

<ZenlessDropdown trigger="click" oncommand={(value) => (command = String(value))}>
	Actions
	{#snippet content()}
		<ZenlessDropdownItem value="edit">Edit</ZenlessDropdownItem>
		<ZenlessDropdownItem value="delete" disabled>Delete</ZenlessDropdownItem>
	{/snippet}
</ZenlessDropdown>
<output data-testid="command">{command}</output>

<ZenlessSelect bind:value={selectValue} clearable placeholder="Choose agent">
	<ZenlessOption value="anby" label="Anby" />
	{#if showDynamic}<ZenlessOption value={7} label="Seven" />{/if}
	<ZenlessOption value="off" label="Unavailable" disabled />
</ZenlessSelect>
<output data-testid="select-value">{selectValue ?? ''}</output>

<div data-testid="outside">Outside</div>
