<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { zenlessColors, type ZenlessColor } from './types.js';

	interface Props extends HTMLAttributes<HTMLElement> {
		name?: string;
		size?: number | string;
		color?: ZenlessColor | string;
	}

	let { name, size, color, class: className, style, ...restProps }: Props = $props();
	const namedColor = $derived(zenlessColors.includes(color as ZenlessColor));
	const iconStyle = $derived(
		[
			size !== undefined ? `font-size: ${typeof size === 'number' ? `${size}px` : size}` : '',
			color && !namedColor ? `color: ${color}` : '',
			style
		]
			.filter(Boolean)
			.join('; ')
	);
</script>

<i
	class={['z-icon', name && `z-icon-${name}`, namedColor && color && `z-icon--${color}`, className]
		.filter(Boolean)
		.join(' ')}
	style={iconStyle}
	{...restProps}
></i>
