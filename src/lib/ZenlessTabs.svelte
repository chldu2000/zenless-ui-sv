<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { getZenlessContext } from './context.js';
	import { setTabs, type NavigationValue, type TabRegistration } from './navigation-context.js';

	export type ZenlessTabsPlacement =
		'top-left' | 'top' | 'top-right' | 'bottom-left' | 'bottom' | 'bottom-right';
	export interface ZenlessTabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onchange'> {
		children?: Snippet;
		value?: NavigationValue;
		placement?: ZenlessTabsPlacement;
		onchange?: (value: NavigationValue) => void;
	}

	const uid = $props.id();
	let {
		children,
		value = $bindable<NavigationValue | undefined>(undefined),
		placement = 'top-right',
		onchange,
		class: className,
		...rest
	}: ZenlessTabsProps = $props();
	let panels: TabRegistration[] = $state([]);
	const zenless = getZenlessContext();

	function select(name: NavigationValue) {
		const panel = panels.find((item) => item.name === name);
		if (!panel || panel.disabled || value === name) return;
		value = name;
		onchange?.(name);
	}

	function moveFocus(event: KeyboardEvent) {
		const enabled = panels.filter((panel) => !panel.disabled);
		if (!enabled.length) return;
		const current = enabled.findIndex((panel) => panel.name === value);
		let next = current < 0 ? 0 : current;
		if (event.key === 'Home') next = 0;
		else if (event.key === 'End') next = enabled.length - 1;
		else if (event.key === 'ArrowRight' || event.key === 'ArrowDown')
			next = (next + 1) % enabled.length;
		else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp')
			next = (next - 1 + enabled.length) % enabled.length;
		else return;
		event.preventDefault();
		select(enabled[next].name);
		(
			document.getElementById(`${uid}-tab-${String(enabled[next].name)}`) as HTMLElement | null
		)?.focus();
	}

	setTabs({
		idBase: uid,
		get value() {
			return value;
		},
		get panels() {
			return panels;
		},
		register(panel) {
			if (!panels.some((item) => item.token === panel.token)) panels.push(panel);
			if (value === undefined && !panel.disabled) value = panel.name;
		},
		unregister(token) {
			const index = panels.findIndex((panel) => panel.token === token);
			if (index !== -1) panels.splice(index, 1);
			if (!panels.some((panel) => panel.name === value))
				value = panels.find((panel) => !panel.disabled)?.name;
		},
		select
	});
</script>

<div class={['z-tabs', `at-${placement}`, className].filter(Boolean).join(' ')} {...rest}>
	<div
		class="z-tabs__header"
		role="tablist"
		aria-orientation="horizontal"
		tabindex="-1"
		onkeydown={moveFocus}
	>
		{#each panels as panel (panel.token)}
			<button
				id={`${uid}-tab-${String(panel.name)}`}
				class:is-bold={zenless.isBold}
				class:is-active={value === panel.name}
				class:is-disabled={panel.disabled}
				class="z-tabs__item"
				type="button"
				role="tab"
				aria-selected={value === panel.name}
				tabindex={value === panel.name ? 0 : -1}
				disabled={panel.disabled}
				onclick={() => select(panel.name)}
			>
				<span class="z-tab-item">
					{#if panel.labelContent}{@render panel.labelContent()}{:else}{panel.label}{/if}
				</span>
			</button>
		{/each}
	</div>
	<div class="z-tabs__content">{@render children?.()}</div>
</div>
