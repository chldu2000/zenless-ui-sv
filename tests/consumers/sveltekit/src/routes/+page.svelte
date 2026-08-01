<script lang="ts">
	import {
		ZenlessButton,
		ZenlessPlaceholder,
		ZenlessProgress,
		ZenlessTable,
		type ZenlessTableColumnDefinition
	} from 'zenless-ui-svelte';
	import { enUs } from 'zenless-ui-svelte/locale';
	import 'zenless-ui-svelte/styles.css';
	type Agent = { name: string; level: number };
	const agents: Agent[] = [{ name: 'Anby', level: 40 }];
	const columns = [
		{ prop: 'name', label: 'Name' },
		{ prop: 'level', label: 'Level' }
	] satisfies ZenlessTableColumnDefinition<Agent>[];
</script>

<svelte:head>
	<title>SvelteKit consumer</title>
</svelte:head>

<ZenlessPlaceholder>SvelteKit SSR consumer</ZenlessPlaceholder>
<ZenlessButton type="primary">SSR Button</ZenlessButton>
<ZenlessProgress percent={50} color="success" />
<ZenlessTable data={agents} {columns} rowKey="name" />
<p lang={enUs.code}>{enUs.messages.common.confirm}</p>
