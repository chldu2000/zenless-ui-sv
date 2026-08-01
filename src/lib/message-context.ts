import { createContext } from 'svelte';
import type { ZenlessMessageOptions } from './message.js';

export interface ZenlessMessageHostApi {
	show: (options: ZenlessMessageOptions) => () => void;
}

export const [getMessageHost, setMessageHost] = createContext<ZenlessMessageHostApi>();
