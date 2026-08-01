<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import type { HTMLAttributes } from 'svelte/elements';
	import { focusTrap, portal } from './actions/index.js';
	import ZenlessButton from './ZenlessButton.svelte';
	import ZenlessScrollbar from './ZenlessScrollbar.svelte';
	import { getZenlessContext } from './context.js';
	import { lockBodyScroll } from './internal/scroll-lock.js';
	import { getOverlayHost, type ZenlessOverlayHostValue } from './overlay/context.js';

	export interface ZenlessModalProps extends Omit<
		HTMLAttributes<HTMLDivElement>,
		'onopen' | 'onclose' | 'oncancel'
	> {
		children?: Snippet;
		titleContent?: Snippet;
		footer?: Snippet;
		open?: boolean;
		title?: string;
		mode?: 'modal' | 'drawer';
		width?: string | number;
		mask?: boolean;
		maskClosable?: boolean;
		closable?: boolean;
		fullscreen?: boolean;
		showFooter?: boolean;
		showCancel?: boolean;
		cancelText?: string;
		confirmText?: string;
		onopen?: () => void;
		onclose?: () => void;
		oncancel?: () => void;
		onconfirm?: () => void;
	}
	let {
		children,
		titleContent,
		footer,
		open = $bindable(false),
		title = '',
		mode = 'modal',
		width = 450,
		mask = true,
		maskClosable = true,
		closable = true,
		fullscreen = false,
		showFooter = true,
		showCancel = true,
		cancelText,
		confirmText,
		onopen,
		onclose,
		oncancel,
		onconfirm,
		class: className,
		...rest
	}: ZenlessModalProps = $props();
	const zenless = getZenlessContext();
	let overlayHost: ZenlessOverlayHostValue | undefined;
	try {
		overlayHost = getOverlayHost();
	} catch {
		overlayHost = undefined;
	}
	const activateModal: Attachment<HTMLDivElement> = () => {
		onopen?.();
		return lockBodyScroll();
	};
	function close() {
		if (!open) return;
		open = false;
		onclose?.();
	}
	function cancel() {
		oncancel?.();
	}
</script>

<svelte:document
	onkeydown={(event) => {
		if (open && event.key === 'Escape') close();
	}}
/>

{#if open}
	<div
		class={[
			'z-modal',
			mode === 'drawer' && 'is-drawer',
			'is-visible',
			mask && 'is-mask',
			fullscreen && 'is-fullscreen',
			zenless.isBold && 'is-bold',
			className
		]
			.filter(Boolean)
			.join(' ')}
		role="presentation"
		{@attach activateModal}
		use:portal={() => overlayHost?.element ?? document.body}
		onclick={(event) => {
			if (event.currentTarget === event.target && maskClosable) close();
		}}
		{...rest}
	>
		<div
			class="z-modal__wrap"
			role="dialog"
			aria-modal="true"
			aria-label={title || 'Dialog'}
			use:focusTrap={{ restoreFocus: true }}
			style:width={typeof width === 'number' ? `${width}px` : width}
		>
			{#if !fullscreen || title || titleContent}
				<div class="z-modal__header">
					<div class="z-modal__title">
						{#if titleContent}{@render titleContent()}{:else}{title}{/if}
					</div>
					{#if (mode === 'drawer' || !fullscreen) && closable}<ZenlessButton
							class="z-modal__close"
							type="danger"
							size="small"
							circle
							icon="close"
							aria-label={zenless.locale.messages.common.close}
							onclick={close}
						/>{/if}
				</div>
			{/if}
			<ZenlessScrollbar class="z-modal__body" fixed={false}>
				<div class="z-modal__content">{@render children?.()}</div>
			</ZenlessScrollbar>
			{#if showFooter}
				<div class="z-modal__footer">
					{#if footer}{@render footer()}{:else}
						{#if showCancel}<ZenlessButton
								class="z-modal__cancel"
								icon={{ error: 'danger' }}
								onclick={cancel}
								>{cancelText ?? zenless.locale.messages.common.cancel}</ZenlessButton
							>{/if}
						<ZenlessButton
							class="z-modal__confirm"
							icon={{ success: 'success' }}
							onclick={() => onconfirm?.()}
							>{confirmText ?? zenless.locale.messages.common.confirm}</ZenlessButton
						>
					{/if}
				</div>
			{/if}
		</div>
	</div>
{/if}
