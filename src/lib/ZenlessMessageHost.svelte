<script lang="ts">
	import { onDestroy, type Snippet } from 'svelte';
	import ZenlessMessage, { type ZenlessMessageType } from './ZenlessMessage.svelte';
	import { setMessageHost } from './message-context.js';
	import type { ZenlessMessageOptions } from './message.js';

	interface Props {
		children?: Snippet;
	}
	interface Entry {
		id: symbol;
		message: string;
		type: ZenlessMessageType;
		timer: number | undefined;
	}
	let { children }: Props = $props();
	let entries: Entry[] = $state([]);

	function close(id: symbol) {
		const index = entries.findIndex((entry) => entry.id === id);
		if (index === -1) return;
		const [entry] = entries.splice(index, 1);
		if (entry.timer !== undefined) window.clearTimeout(entry.timer);
	}

	setMessageHost({
		show(options: ZenlessMessageOptions) {
			const entry: Entry = {
				id: Symbol('message'),
				message: options.message,
				type: options.type ?? 'info',
				timer: undefined
			};
			entries.push(entry);
			entry.timer = window.setTimeout(() => close(entry.id), options.duration ?? 3000);
			return () => close(entry.id);
		}
	});
	onDestroy(() => {
		for (const entry of entries) if (entry.timer !== undefined) window.clearTimeout(entry.timer);
	});
</script>

{@render children?.()}
<div class="z-message-host" aria-live="polite">
	{#each entries as entry, index (entry.id)}
		<div class="z-message-host__item" style:top={`${23 + index * 44}px`}>
			<ZenlessMessage message={entry.message} type={entry.type} />
		</div>
	{/each}
</div>
