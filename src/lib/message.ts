import { mount, unmount } from 'svelte';
import ZenlessMessage, { type ZenlessMessageType } from './ZenlessMessage.svelte';
import { isBrowser } from './internal/browser.js';
import { getMessageHost, type ZenlessMessageHostApi } from './message-context.js';

export interface ZenlessMessageOptions {
	message: string;
	type?: ZenlessMessageType;
	duration?: number;
}
export type ZenlessMessagePayload = string | ZenlessMessageOptions;
export interface ZenlessMessageApi {
	(payload: ZenlessMessagePayload): () => void;
	success: (message: ZenlessMessagePayload) => () => void;
	warning: (message: ZenlessMessagePayload) => () => void;
	error: (message: ZenlessMessagePayload) => () => void;
}

function show(payload: ZenlessMessagePayload, forcedType?: ZenlessMessageType): () => void {
	if (!isBrowser) return () => {};
	const options = typeof payload === 'string' ? { message: payload } : payload;
	const target = document.createElement('div');
	document.body.appendChild(target);
	const component = mount(ZenlessMessage, {
		target,
		props: { message: options.message, type: forcedType ?? options.type ?? 'info' }
	});
	let closed = false;
	const close = () => {
		if (closed) return;
		closed = true;
		const element = target.querySelector<HTMLElement>('.z-message');
		element?.classList.add('hidden');
		let removed = false;
		const remove = () => {
			if (removed) return;
			removed = true;
			void unmount(component, { outro: true }).finally(() => target.remove());
		};
		const animations = element?.getAnimations() ?? [];
		if (animations.length)
			void Promise.allSettled(animations.map((animation) => animation.finished)).then(remove);
		window.setTimeout(remove, 500);
	};
	const timer = window.setTimeout(close, options.duration ?? 3000);
	return () => {
		window.clearTimeout(timer);
		close();
	};
}

export function useMessage(): ZenlessMessageApi {
	let host: ZenlessMessageHostApi | undefined;
	try {
		host = getMessageHost();
	} catch {
		host = undefined;
	}
	const display = (payload: ZenlessMessagePayload, type?: ZenlessMessageType) => {
		const options =
			typeof payload === 'string'
				? { message: payload, type }
				: { ...payload, type: type ?? payload.type };
		return host && isBrowser ? host.show(options) : show(options);
	};
	const api = ((payload: ZenlessMessagePayload) => display(payload)) as ZenlessMessageApi;
	api.success = (payload) => display(payload, 'success');
	api.warning = (payload) => display(payload, 'warning');
	api.error = (payload) => display(payload, 'error');
	return api;
}
