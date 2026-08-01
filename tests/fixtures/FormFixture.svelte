<script lang="ts">
	import {
		ZenlessCheckbox,
		ZenlessCheckboxGroup,
		ZenlessForm,
		ZenlessFormItem,
		ZenlessInput,
		ZenlessPagination,
		ZenlessRadio,
		ZenlessRadioGroup,
		ZenlessSwitch,
		ZenlessTextarea
	} from '../../src/lib/index.js';
	let text = $state('hello');
	let toggle = $state(false);
	let radio = $state<string | number | boolean>('a');
	let checks = $state<(string | number | boolean)[]>(['one']);
	let page = $state(1);
</script>

<ZenlessForm labelPosition="left" labelWidth={80}
	><ZenlessFormItem label="Name" required
		><ZenlessInput bind:value={text} clearable /></ZenlessFormItem
	><ZenlessFormItem label="Note"><ZenlessTextarea bind:value={text} autoSize /></ZenlessFormItem
	></ZenlessForm
>
<output data-testid="text">{text}</output><ZenlessSwitch bind:checked={toggle} /><output
	data-testid="toggle">{toggle}</output
>
<ZenlessRadioGroup bind:value={radio}
	><ZenlessRadio value="a">A</ZenlessRadio><ZenlessRadio value="b">B</ZenlessRadio
	></ZenlessRadioGroup
><output data-testid="radio">{radio}</output>
<ZenlessCheckboxGroup bind:value={checks} min={1} max={2}
	><ZenlessCheckbox value="one">One</ZenlessCheckbox><ZenlessCheckbox value="two"
		>Two</ZenlessCheckbox
	></ZenlessCheckboxGroup
><output data-testid="checks">{checks.join(',')}</output>
<ZenlessPagination bind:value={page} total={30} pageSize={10} /><output data-testid="page"
	>{page}</output
>
