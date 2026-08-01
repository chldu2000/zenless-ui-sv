<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Attachment } from 'svelte/attachments';
	import { pointerDrag } from './actions/index.js';
	import ZenlessTooltip from './ZenlessTooltip.svelte';

	export interface ZenlessSliderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onchange'> {
		value?: number;
		min?: number;
		max?: number;
		step?: number;
		disabled?: boolean;
		tooltip?: boolean | ((value: number) => string);
		onchange?: (value: number) => void;
	}
	let {
		value = $bindable(0),
		min = 0,
		max = 100,
		step = 1,
		disabled = false,
		tooltip = false,
		onchange,
		class: className,
		...rest
	}: ZenlessSliderProps = $props();
	let rail: HTMLDivElement | undefined;
	const captureRail: Attachment<HTMLDivElement> = (node) => {
		rail = node;
		return () => {
			if (rail === node) rail = undefined;
		};
	};
	let dragging = $state(false);
	const range = $derived(Math.max(0, max - min));
	const percent = $derived(
		range === 0 ? 0 : Math.min(100, Math.max(0, ((value - min) / range) * 100))
	);
	const precision = $derived(
		Math.max(...[min, max, step].map((item) => String(item).split('.')[1]?.length ?? 0))
	);
	function setFromX(x: number, commit = false) {
		if (!rail || disabled || range === 0) return;
		const rect = rail.getBoundingClientRect();
		const ratio = Math.min(1, Math.max(0, (x - rect.left) / rect.width));
		value = Number((min + Math.round((range * ratio) / step) * step).toFixed(precision));
		if (commit) onchange?.(value);
	}
	function adjust(delta: number) {
		if (disabled) return;
		value = Math.min(max, Math.max(min, Number((value + delta).toFixed(precision))));
		onchange?.(value);
	}
</script>

<div class={['z-slider', disabled && 'is-disabled', className].filter(Boolean).join(' ')} {...rest}>
	<div
		{@attach captureRail}
		class="z-slider__rail"
		role="presentation"
		onpointerdown={(event) => {
			if (event.target === event.currentTarget) setFromX(event.clientX, true);
		}}
	>
		<div class="z-slider__track" style:width={`${percent}%`}></div>
		<ZenlessTooltip
			class={['z-slider__handle', dragging && 'dragging'].filter(Boolean).join(' ')}
			content={typeof tooltip === 'function' ? tooltip(value) : String(value)}
			disabled={!tooltip}
			style={`left: ${percent}%`}
		>
			<button
				class="z-slider__handle-control"
				type="button"
				role="slider"
				aria-label="Slider"
				aria-valuemin={min}
				aria-valuemax={max}
				aria-valuenow={value}
				aria-valuetext={typeof tooltip === 'function' ? tooltip(value) : String(value)}
				{disabled}
				onkeydown={(event) => {
					if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
						event.preventDefault();
						adjust(step);
					} else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
						event.preventDefault();
						adjust(-step);
					} else if (event.key === 'Home') {
						event.preventDefault();
						value = min;
						onchange?.(value);
					} else if (event.key === 'End') {
						event.preventDefault();
						value = max;
						onchange?.(value);
					}
				}}
				use:pointerDrag={{
					disabled,
					onStart: (event) => {
						dragging = true;
						setFromX(event.x);
					},
					onMove: (event) => setFromX(event.x),
					onEnd: (event) => {
						setFromX(event.x, true);
						dragging = false;
					}
				}}
			></button>
		</ZenlessTooltip>
	</div>
</div>
