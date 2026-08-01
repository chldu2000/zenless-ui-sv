<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { getZenlessContext } from './context.js';

	interface Props extends HTMLAttributes<HTMLElement> {
		children?: Snippet;
		image?: string;
		imageAlt?: string;
		avatar?: string;
		avatarAlt?: string;
		nickname?: string;
		title?: string;
		content?: string;
	}

	let {
		children,
		image,
		imageAlt = '',
		avatar,
		avatarAlt = '',
		nickname,
		title,
		content,
		class: className,
		...restProps
	}: Props = $props();
	const zenless = getZenlessContext();
</script>

<article
	class={['z-card', zenless.isBold && 'is-bold', className].filter(Boolean).join(' ')}
	{...restProps}
>
	{#if image}<img class="z-card__image" src={image} alt={imageAlt} />{/if}
	{#if avatar || nickname}
		<div class="z-card__user">
			{#if avatar}<div class="z-card__avatar"><img src={avatar} alt={avatarAlt} /></div>{/if}
			{#if nickname}<div class="z-card__nickname">{nickname}</div>{/if}
		</div>
	{/if}
	{#if title}<div class="z-card__title">{title}</div>{/if}
	{#if content}<div class="z-card__content">{content}</div>{/if}
	{@render children?.()}
</article>
