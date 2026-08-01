import type { Component, ComponentProps, Snippet } from 'svelte';

export const zenlessSizes = ['extra', 'large', 'small', 'mini'] as const;
export const zenlessColors = [
	'default',
	'primary',
	'success',
	'danger',
	'warning',
	'info',
	'ether',
	'fire',
	'electric',
	'ice',
	'physical'
] as const;
export const zenlessPlacements = [
	'top',
	'top-start',
	'top-end',
	'right',
	'right-start',
	'right-end',
	'bottom',
	'bottom-start',
	'bottom-end',
	'left',
	'left-start',
	'left-end'
] as const;

export type ZenlessSize = (typeof zenlessSizes)[number];
export type ZenlessColor = (typeof zenlessColors)[number];
export type ZenlessPlacement = (typeof zenlessPlacements)[number];
export type ZenlessStatus = Exclude<
	ZenlessColor,
	'default' | 'ether' | 'fire' | 'electric' | 'ice' | 'physical'
>;
export type ZenlessCallback<Args extends readonly unknown[] = []> = (...args: Args) => void;
export type ZenlessSnippet<Args extends unknown[] = []> = Snippet<Args>;
export type ZenlessComponent<TProps extends Record<string, unknown> = Record<string, never>> =
	Component<TProps>;
export type ZenlessComponentProps<TComponent extends ZenlessComponent> = ComponentProps<TComponent>;
