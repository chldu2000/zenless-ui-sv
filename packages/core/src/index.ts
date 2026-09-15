export const zenlessButtonColors = [
	'default',
	'primary',
	'success',
	'info',
	'warning',
	'danger',
	'ether',
	'fire',
	'electric',
	'ice',
	'physical'
] as const;

export const zenlessButtonSizes = ['extra', 'large', 'small', 'mini'] as const;

export type ZenlessButtonColor = (typeof zenlessButtonColors)[number];
export type ZenlessButtonSize = (typeof zenlessButtonSizes)[number];
export type ZenlessButtonNativeType = 'button' | 'submit' | 'reset';
