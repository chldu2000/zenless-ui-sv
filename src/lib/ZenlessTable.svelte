<script lang="ts" generics="Row extends Record<string, unknown>">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { getZenlessContext } from './context.js';
	import { setTable, type TableColumnRegistration } from './table-context.js';
	import type { ZenlessTableColumnDefinition } from './table-types.js';

	export interface ZenlessTableProps<
		Row extends Record<string, unknown>
	> extends HTMLAttributes<HTMLDivElement> {
		children?: Snippet;
		empty?: Snippet;
		data?: Row[];
		columns?: ZenlessTableColumnDefinition<Row>[];
		border?: boolean;
		emptyText?: string;
		rowKey?: Extract<keyof Row, string> | ((row: Row) => string | number);
	}
	let {
		children,
		empty,
		data = [],
		columns: definitions,
		border = true,
		emptyText,
		rowKey,
		class: className,
		...rest
	}: ZenlessTableProps<Row> = $props();
	const zenless = getZenlessContext();
	let registered: TableColumnRegistration[] = $state([]);
	const columns = $derived((definitions ?? registered) as TableColumnRegistration[]);
	setTable({
		get columns() {
			return registered;
		},
		register(column) {
			if (!registered.some((item) => item.token === column.token)) registered.push(column);
		},
		unregister(token) {
			const index = registered.findIndex((column) => column.token === token);
			if (index !== -1) registered.splice(index, 1);
		}
	});
	function key(row: Row, index: number) {
		return typeof rowKey === 'function' ? rowKey(row) : rowKey ? String(row[rowKey]) : index;
	}
</script>

<div class="z-table__columns" hidden>{@render children?.()}</div>
<div
	class={['z-table', border && 'z-table--border', zenless.isBold && 'is-bold', className]
		.filter(Boolean)
		.join(' ')}
	{...rest}
>
	<table class="z-table__body">
		<colgroup
			>{#each columns as column, i (column.token ?? i)}<col
					style:width={typeof column.width === 'number' ? `${column.width}px` : column.width}
				/>{/each}</colgroup
		>
		<thead
			><tr class="z-table__row z-table__header"
				>{#each columns as column, i (column.token ?? i)}<th class="z-table__cell" scope="col"
						><div class="cell">
							{#if column.header}{@render column.header(column)}{:else}{column.label}{/if}
						</div></th
					>{/each}</tr
			></thead
		>
		<tbody>
			{#each data as row, index (key(row, index))}<tr class="z-table__row"
					>{#each columns as column, i (column.token ?? i)}<td class="z-table__cell"
							><div class="cell">
								{#if column.cell}{@render column.cell(row, column, index)}{:else}{String(
										row[column.prop] ?? ''
									)}{/if}
							</div></td
						>{/each}</tr
				>{:else}<tr class="z-table__row"
					><td class="z-table__cell" colspan={Math.max(1, columns.length)}
						>{#if empty}{@render empty()}{:else}<div class="empty">
								{emptyText ?? zenless.locale.messages.table.empty}
							</div>{/if}</td
					></tr
				>{/each}
		</tbody>
	</table>
</div>
