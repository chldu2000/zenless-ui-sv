import { createContext, type Snippet } from 'svelte';

export type NavigationValue = string | number;
export type SelectValue = string | number | boolean;

export interface CollapseContext {
	readonly active: NavigationValue[];
	readonly plain: boolean;
	toggle: (name: NavigationValue) => void;
}

export interface TabRegistration {
	token: symbol;
	readonly name: NavigationValue;
	readonly label: string;
	readonly labelContent?: Snippet;
	readonly disabled: boolean;
}

export interface TabsContext {
	readonly idBase: string;
	readonly value: NavigationValue | undefined;
	readonly panels: TabRegistration[];
	register: (panel: TabRegistration) => void;
	unregister: (token: symbol) => void;
	select: (name: NavigationValue) => void;
}

export interface MenuContext {
	readonly value: NavigationValue | undefined;
	readonly accordion: boolean;
	registerItem: (token: symbol, disabled: () => boolean) => void;
	unregisterItem: (token: symbol) => void;
	isTabStop: (token: symbol, name: NavigationValue) => boolean;
	select: (name: NavigationValue) => void;
	registerSubmenu: (token: symbol, close: () => void) => void;
	unregisterSubmenu: (token: symbol) => void;
	requestSubmenuOpen: (token: symbol) => void;
}

export interface SubMenuContext {
	readonly open: boolean;
}

export interface DropdownContext {
	command: (value: unknown) => void;
}

export interface OptionRegistration {
	token: symbol;
	readonly value: SelectValue;
	readonly label: string;
	readonly disabled: boolean;
	focus: () => void;
}

export interface SelectContext {
	readonly value: SelectValue | undefined;
	readonly options: OptionRegistration[];
	register: (option: OptionRegistration) => void;
	unregister: (token: symbol) => void;
	select: (value: SelectValue) => void;
}

export const [getProvidedCollapse, setCollapse] = createContext<CollapseContext>();
export const [getProvidedTabs, setTabs] = createContext<TabsContext>();
export const [getProvidedMenu, setMenu] = createContext<MenuContext>();
export const [getProvidedSubMenu, setSubMenu] = createContext<SubMenuContext>();
export const [getProvidedDropdown, setDropdown] = createContext<DropdownContext>();
export const [getProvidedSelect, setSelect] = createContext<SelectContext>();

function optionalContext<T>(read: () => T): T | undefined {
	try {
		return read();
	} catch {
		return undefined;
	}
}

export const getCollapse = () => optionalContext(getProvidedCollapse);
export const getTabs = () => optionalContext(getProvidedTabs);
export const getMenu = () => optionalContext(getProvidedMenu);
export const getSubMenu = () => optionalContext(getProvidedSubMenu);
export const getDropdown = () => optionalContext(getProvidedDropdown);
export const getSelect = () => optionalContext(getProvidedSelect);
