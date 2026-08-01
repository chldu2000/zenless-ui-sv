<script lang="ts">
	import { onDestroy, type Snippet } from 'svelte';
	import { getTable, type TableColumnRegistration } from './table-context.js';
	export interface ZenlessTableColumnProps {
		prop: string;
		label?: string;
		width?: string | number;
		cell?: Snippet<[row: Record<string, unknown>, column: TableColumnRegistration, index: number]>;
		header?: Snippet<[column: TableColumnRegistration]>;
	}
	let { prop, label = '', width, cell, header }: ZenlessTableColumnProps = $props();
	const table = getTable();
	const token = Symbol('table-column');
	table.register({
		token,
		get prop() {
			return prop;
		},
		get label() {
			return label;
		},
		get width() {
			return width;
		},
		get cell() {
			return cell;
		},
		get header() {
			return header;
		}
	});
	onDestroy(() => table.unregister(token));
</script>
