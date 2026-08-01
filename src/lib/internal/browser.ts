export const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

export function getDocument(): Document | undefined {
	return isBrowser ? document : undefined;
}

export function getWindow(): Window | undefined {
	return isBrowser ? window : undefined;
}
