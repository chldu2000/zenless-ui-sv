<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import ZenlessButton from './ZenlessButton.svelte';
	import { getZenlessContext } from './context.js';

	interface Props extends Omit<HTMLAttributes<HTMLElement>, 'onchange'> {
		value?: number;
		pageSize?: number;
		total?: number;
		prevText?: string;
		nextText?: string;
		minimal?: boolean;
		onchange?: (page: number) => void;
	}
	let {
		value = $bindable(1),
		pageSize = 10,
		total = 0,
		prevText,
		nextText,
		minimal = false,
		onchange,
		class: className,
		...restProps
	}: Props = $props();
	const zenless = getZenlessContext();
	const pageCount = $derived(Math.max(1, Math.ceil(total / pageSize)));
	const currentPage = $derived(Math.min(pageCount, Math.max(1, value)));
	function change(next: number) {
		value = Math.min(pageCount, Math.max(1, next));
		onchange?.(value);
	}
</script>

<nav
	aria-label="Pagination"
	class={['z-pagination', minimal && 'is-minimal', zenless.isBold && 'is-bold', className]
		.filter(Boolean)
		.join(' ')}
	{...restProps}
>
	<ZenlessButton
		class="z-pagination__prev"
		disabled={currentPage <= 1}
		onclick={() => change(currentPage - 1)}
		>{#if minimal}<i class="z-icon-arrow-left"></i>{:else}{prevText ??
				zenless.locale.messages.pagination.prev}{/if}</ZenlessButton
	>
	<div class="z-pagination__content">
		<span>{String(currentPage).padStart(2, '0')}</span>{#if !minimal}<span
				>/{String(pageCount).padStart(2, '0')}</span
			>{/if}
	</div>
	<ZenlessButton
		class="z-pagination__next"
		disabled={currentPage >= pageCount}
		onclick={() => change(currentPage + 1)}
		>{#if minimal}<i class="z-icon-arrow-right"></i>{:else}{nextText ??
				zenless.locale.messages.pagination.next}{/if}</ZenlessButton
	>
</nav>
