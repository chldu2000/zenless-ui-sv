import { createContext } from 'svelte';
import type { ZenlessSize } from './types.js';

export type ChoiceValue = string | number | boolean;

export interface ChoiceGroupContext {
	readonly mode: 'radio' | 'checkbox';
	readonly disabled: boolean;
	readonly size?: ZenlessSize;
	readonly min?: number;
	readonly max?: number;
	readonly value: ChoiceValue | ChoiceValue[] | undefined;
	change: (value: ChoiceValue | ChoiceValue[]) => void;
}

export interface FormContextValue {
	readonly inline: boolean;
	readonly labelWidth?: string | number;
	readonly labelPosition?: 'left' | 'right' | 'top';
}

export const [getProvidedChoiceGroup, setChoiceGroup] = createContext<ChoiceGroupContext>();
export const [getProvidedForm, setFormContext] = createContext<FormContextValue>();

export function getChoiceGroup(): ChoiceGroupContext | undefined {
	try {
		return getProvidedChoiceGroup();
	} catch {
		return undefined;
	}
}

export function getFormContext(): FormContextValue | undefined {
	try {
		return getProvidedForm();
	} catch {
		return undefined;
	}
}
