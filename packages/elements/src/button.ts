import type {
	ZenlessButtonColor,
	ZenlessButtonNativeType,
	ZenlessButtonSize
} from '../../core/src/index.js';
import { zenlessButtonColors, zenlessButtonSizes } from '../../core/src/index.js';
import { buttonStyles } from './button.styles.js';

const colors: Record<ZenlessButtonColor, string> = {
	default: '#000',
	primary: '#008bff',
	success: '#00cc0d',
	info: '#ccc',
	warning: '#ffc300',
	danger: '#c01c00',
	ether: '#fe427e',
	fire: '#ff5522',
	electric: '#2eb6ff',
	ice: '#98eff0',
	physical: '#f0d12a'
};

const booleanAttributes = [
	'loading',
	'disabled',
	'plain',
	'round',
	'circle',
	'hollow',
	'highlight'
] as const;

export class ZenlessButtonElement extends HTMLElement {
	static readonly formAssociated = true;
	static readonly observedAttributes = ['type', 'size', 'native-type', ...booleanAttributes];

	readonly #internals: ElementInternals;
	readonly #button: HTMLButtonElement;

	constructor() {
		super();
		this.#internals = this.attachInternals();
		const root = this.attachShadow({ mode: 'open', delegatesFocus: true });
		const style = document.createElement('style');
		style.textContent = buttonStyles;
		this.#button = document.createElement('button');
		this.#button.type = 'button';
		this.#button.part.add('button');
		this.#button.append(document.createElement('slot'));
		this.#button.addEventListener('click', this.#activate);
		root.append(style, this.#button);
		this.#upgradeProperties();
	}

	connectedCallback() {
		this.#render();
	}
	attributeChangedCallback() {
		this.#render();
	}

	get type(): ZenlessButtonColor {
		return this.#enumAttribute('type', zenlessButtonColors, 'default');
	}
	set type(value: ZenlessButtonColor) {
		this.#setStringAttribute('type', value, 'default');
	}
	get size(): ZenlessButtonSize | undefined {
		return this.#enumAttribute('size', zenlessButtonSizes, undefined);
	}
	set size(value: ZenlessButtonSize | undefined) {
		this.#setStringAttribute('size', value);
	}
	get nativeType(): ZenlessButtonNativeType {
		return this.#enumAttribute('native-type', ['button', 'submit', 'reset'] as const, 'button');
	}
	set nativeType(value: ZenlessButtonNativeType) {
		this.#setStringAttribute('native-type', value, 'button');
	}

	get loading() {
		return this.hasAttribute('loading');
	}
	set loading(value: boolean) {
		this.toggleAttribute('loading', value);
	}
	get disabled() {
		return this.hasAttribute('disabled');
	}
	set disabled(value: boolean) {
		this.toggleAttribute('disabled', value);
	}
	get plain() {
		return this.hasAttribute('plain');
	}
	set plain(value: boolean) {
		this.toggleAttribute('plain', value);
	}
	get round() {
		return !this.hasAttribute('round') || this.getAttribute('round') !== 'false';
	}
	set round(value: boolean) {
		this.setAttribute('round', String(value));
	}
	get circle() {
		return this.hasAttribute('circle');
	}
	set circle(value: boolean) {
		this.toggleAttribute('circle', value);
	}
	get hollow() {
		return this.hasAttribute('hollow');
	}
	set hollow(value: boolean) {
		this.toggleAttribute('hollow', value);
	}
	get highlight() {
		return this.hasAttribute('highlight');
	}
	set highlight(value: boolean) {
		this.toggleAttribute('highlight', value);
	}

	get form() {
		return this.#internals.form;
	}
	get labels() {
		return this.#internals.labels;
	}
	get name() {
		return this.getAttribute('name') ?? '';
	}
	set name(value: string) {
		this.#setStringAttribute('name', value);
	}
	get value() {
		return this.getAttribute('value') ?? '';
	}
	set value(value: string) {
		this.#setStringAttribute('value', value);
	}

	override click() {
		this.#button.click();
	}
	override focus(options?: FocusOptions) {
		this.#button.focus(options);
	}
	override blur() {
		this.#button.blur();
	}
	formDisabledCallback(disabled: boolean) {
		this.#render(disabled);
	}

	readonly #activate = (event: MouseEvent) => {
		if (this.disabled || this.loading) {
			event.preventDefault();
			event.stopImmediatePropagation();
			return;
		}
		if (event.defaultPrevented) return;
		if (this.nativeType === 'submit') this.form?.requestSubmit();
		if (this.nativeType === 'reset') this.form?.reset();
	};

	#render(formDisabled = false) {
		if (!this.#button) return;
		const disabled = this.disabled || this.loading || formDisabled;
		this.#button.disabled = disabled;
		this.#button.setAttribute('aria-busy', String(this.loading));
		this.#button.className = [
			this.size,
			this.plain && 'plain',
			this.round && 'round',
			this.circle && 'circle',
			this.hollow && 'hollow',
			this.highlight && 'highlight'
		]
			.filter(Boolean)
			.join(' ');
		this.#button.style.setProperty('--z-button-color', colors[this.type]);
		this.#internals.ariaDisabled = String(disabled);
	}

	#upgradeProperties() {
		for (const property of [...booleanAttributes, 'type', 'size', 'nativeType', 'name', 'value']) {
			if (!Object.prototype.hasOwnProperty.call(this, property)) continue;
			const value = (this as unknown as Record<string, unknown>)[property];
			delete (this as unknown as Record<string, unknown>)[property];
			(this as unknown as Record<string, unknown>)[property] = value;
		}
	}

	#enumAttribute<T extends string>(name: string, values: readonly T[], fallback: T): T;
	#enumAttribute<T extends string>(
		name: string,
		values: readonly T[],
		fallback: undefined
	): T | undefined;
	#enumAttribute<T extends string>(name: string, values: readonly T[], fallback: T | undefined) {
		const value = this.getAttribute(name) as T | null;
		return value && values.includes(value) ? value : fallback;
	}
	#setStringAttribute(name: string, value: string | undefined, defaultValue?: string) {
		if (value === undefined || value === defaultValue) this.removeAttribute(name);
		else this.setAttribute(name, value);
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'z-button': ZenlessButtonElement;
	}
}
