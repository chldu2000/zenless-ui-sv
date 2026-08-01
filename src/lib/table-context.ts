import { createContext, type Snippet } from 'svelte';
export interface TableColumnRegistration {
	token: symbol;
	readonly prop: string;
	readonly label: string;
	readonly width?: string | number;
	readonly cell?: Snippet<
		[row: Record<string, unknown>, column: TableColumnRegistration, index: number]
	>;
	readonly header?: Snippet<[column: TableColumnRegistration]>;
}
export interface TableContext {
	readonly columns: TableColumnRegistration[];
	register: (column: TableColumnRegistration) => void;
	unregister: (token: symbol) => void;
}
export const [getTable, setTable] = createContext<TableContext>();
