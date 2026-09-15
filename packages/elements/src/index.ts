export type { ZenlessButtonElement } from './button.js';

export async function defineButton(registry: CustomElementRegistry = customElements) {
	const existing = registry.get('z-button');
	const { ZenlessButtonElement } = await import('./button.js');
	if (existing) {
		if (existing !== ZenlessButtonElement)
			throw new Error(
				'Cannot define <z-button>: the tag is already owned by another implementation.'
			);
		return existing;
	}
	registry.define('z-button', ZenlessButtonElement);
	return ZenlessButtonElement;
}

export async function defineAll(registry?: CustomElementRegistry) {
	await defineButton(registry);
}
