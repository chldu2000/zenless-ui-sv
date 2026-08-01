import { createContext } from 'svelte';

export interface ZenlessOverlayHostValue {
	element: HTMLElement | null;
}

export const [getOverlayHost, setOverlayHost] = createContext<ZenlessOverlayHostValue>();
