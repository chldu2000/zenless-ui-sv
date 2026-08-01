import type { Snippet } from 'svelte';

export interface ZenlessTableColumnDefinition<Row extends Record<string, unknown>> {
	prop: Extract<keyof Row, string>;
	label?: string;
	width?: string | number;
	cell?: Snippet<[row: Row, column: ZenlessTableColumnDefinition<Row>, index: number]>;
	header?: Snippet<[column: ZenlessTableColumnDefinition<Row>]>;
}
