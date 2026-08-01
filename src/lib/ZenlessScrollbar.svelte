<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Attachment } from 'svelte/attachments';
	import { pointerDrag, resizeObserver } from './actions/index.js';

	export interface ZenlessScrollbarProps extends HTMLAttributes<HTMLDivElement> {
		children?: Snippet;
		fixed?: boolean | { x?: boolean; y?: boolean };
		hideScroll?: boolean;
		resizable?: boolean;
		onscroll?: (event: Event) => void;
	}
	export interface ZenlessScrollbarInstance {
		getScrollTarget: () => HTMLDivElement | undefined;
		scrollTo: (options: ScrollToOptions) => void;
	}
	let {
		children,
		fixed = { y: true },
		hideScroll = false,
		resizable = true,
		onscroll,
		class: className,
		...rest
	}: ZenlessScrollbarProps = $props();
	let wrap: HTMLDivElement | undefined;
	let view: HTMLDivElement | undefined;
	const captureWrap: Attachment<HTMLDivElement> = (node) => {
		wrap = node;
		return () => {
			if (wrap === node) wrap = undefined;
		};
	};
	const captureView: Attachment<HTMLDivElement> = (node) => {
		view = node;
		update();
		return () => {
			if (view === node) view = undefined;
		};
	};
	let overflowX = $state(false);
	let overflowY = $state(false);
	let moveX = $state(0);
	let moveY = $state(0);
	let sizeX = $state(100);
	let sizeY = $state(100);
	const fixedX = $derived(typeof fixed === 'boolean' ? fixed : Boolean(fixed.x));
	const fixedY = $derived(typeof fixed === 'boolean' ? fixed : (fixed.y ?? true));
	function update() {
		if (!wrap || !view) return;
		overflowX = wrap.clientWidth < view.scrollWidth;
		overflowY = wrap.clientHeight < view.scrollHeight;
		sizeX = wrap.scrollWidth ? (wrap.clientWidth / wrap.scrollWidth) * 100 : 100;
		sizeY = wrap.scrollHeight ? (wrap.clientHeight / wrap.scrollHeight) * 100 : 100;
	}
	function dragHorizontal(x: number) {
		if (!wrap) return;
		const rect = wrap.getBoundingClientRect();
		wrap.scrollLeft = Math.max(
			0,
			Math.min(
				wrap.scrollWidth - wrap.clientWidth,
				((x - rect.left) / rect.width) * wrap.scrollWidth
			)
		);
	}
	function dragVertical(y: number) {
		if (!wrap) return;
		const rect = wrap.getBoundingClientRect();
		wrap.scrollTop = Math.max(
			0,
			Math.min(
				wrap.scrollHeight - wrap.clientHeight,
				((y - rect.top) / rect.height) * wrap.scrollHeight
			)
		);
	}
	export function getScrollTarget() {
		return wrap;
	}
	export function scrollTo(options: ScrollToOptions) {
		wrap?.scrollTo(options);
	}
</script>

<div class={['z-scrollbar', className].filter(Boolean).join(' ')} {...rest}>
	<div
		{@attach captureWrap}
		class="z-scrollbar__wrap"
		onscroll={(event) => {
			if (wrap) {
				moveX = wrap.scrollWidth ? (wrap.scrollLeft / wrap.scrollWidth) * 100 : 0;
				moveY = wrap.scrollHeight ? (wrap.scrollTop / wrap.scrollHeight) * 100 : 0;
			}
			onscroll?.(event);
		}}
	>
		<div
			{@attach captureView}
			class="z-scrollbar__view"
			use:resizeObserver={() => resizable && update()}
		>
			{@render children?.()}
		</div>
	</div>
	{#if !hideScroll && (fixedX || overflowX)}<div class="z-scrollbar__bar z-scrollbar__horizontal">
			<button
				type="button"
				aria-label="Horizontal scrollbar"
				class="z-scrollbar__track"
				style:width={`${sizeX}%`}
				style:transform={`translateX(${moveX}%)`}
				use:pointerDrag={{
					onStart: (event) => dragHorizontal(event.x),
					onMove: (event) => dragHorizontal(event.x)
				}}
			></button>
		</div>{/if}
	{#if !hideScroll && (fixedY || overflowY)}<div class="z-scrollbar__bar z-scrollbar__vertical">
			<button
				type="button"
				aria-label="Vertical scrollbar"
				class="z-scrollbar__track"
				style:height={`${sizeY}%`}
				style:transform={`translateY(${moveY}%)`}
				use:pointerDrag={{
					onStart: (event) => dragVertical(event.y),
					onMove: (event) => dragVertical(event.y)
				}}
			></button>
		</div>{/if}
</div>
