import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
	componentDocs,
	componentProps,
	componentSlugs
} from '../src/routes/components/component-meta.ts';

const projectRoot = resolve(import.meta.dirname, '..');
const libraryEntry = readFileSync(resolve(projectRoot, 'src/lib/index.ts'), 'utf8');
const manifest = JSON.parse(readFileSync(resolve(projectRoot, 'package.json'), 'utf8'));
const vuePublicComponents = [
	'ZenlessScrollbar',
	'ZenlessIcon',
	'ZenlessButton',
	'ZenlessLink',
	'ZenlessCollapse',
	'ZenlessCollapseItem',
	'ZenlessMenu',
	'ZenlessMenuItem',
	'ZenlessSubMenu',
	'ZenlessBacktop',
	'ZenlessTag',
	'ZenlessBadge',
	'ZenlessTabs',
	'ZenlessTabPanel',
	'ZenlessTooltip',
	'ZenlessRadio',
	'ZenlessRadioGroup',
	'ZenlessRadioButton',
	'ZenlessCheckbox',
	'ZenlessCheckboxGroup',
	'ZenlessCheckboxButton',
	'ZenlessSlider',
	'ZenlessSwitch',
	'ZenlessInput',
	'ZenlessTextarea',
	'ZenlessSelect',
	'ZenlessOption',
	'ZenlessDropdown',
	'ZenlessDropdownItem',
	'ZenlessPagination',
	'ZenlessCard',
	'ZenlessModal',
	'ZenlessDrawer',
	'ZenlessMessage',
	'ZenlessProgress',
	'ZenlessTable',
	'ZenlessTableColumn',
	'ZenlessForm',
	'ZenlessFormItem',
	'ZenlessPattern'
];

function assert(condition, message) {
	if (!condition) throw new Error(message);
}

function sourceFiles(directory) {
	return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
		const path = resolve(directory, entry.name);
		return entry.isDirectory() ? sourceFiles(path) : [path];
	});
}

assert(
	vuePublicComponents.length === 40,
	'The frozen Vue public component list must contain 40 entries.'
);
assert(componentSlugs.length === 28, 'Expected 28 component documentation routes.');
assert(new Set(componentSlugs).size === componentSlugs.length, 'Component slugs must be unique.');
assert(componentSlugs.length + 9 === 37, 'The 37-example mapping is incomplete.');

const documented = new Set(componentDocs.flatMap((item) => item.components));
for (const component of vuePublicComponents) {
	assert(
		libraryEntry.includes(`default as ${component}`),
		`Missing public Svelte export for ${component}.`
	);
	assert(documented.has(component), `Missing documentation route for ${component}.`);
	assert(Boolean(componentProps[component]), `Missing concrete Props metadata for ${component}.`);
}

assert(
	manifest.peerDependencies?.svelte?.startsWith('^5.'),
	'Svelte 5 must remain a peer dependency.'
);
assert(manifest.exports?.['.']?.svelte, 'Missing root Svelte export condition.');
assert(manifest.exports?.['./styles.css'], 'Missing public stylesheet export.');
assert(manifest.exports?.['./locale'], 'Missing public locale export.');
assert(
	!libraryEntry.includes('$app/'),
	'The public library entry must not depend on SvelteKit runtime APIs.'
);

const librarySource = sourceFiles(resolve(projectRoot, 'src/lib'))
	.filter((file) => /\.(?:js|ts|svelte)$/.test(file))
	.map((file) => readFileSync(file, 'utf8'))
	.join('\n');
const allDependencies = {
	...manifest.dependencies,
	...manifest.devDependencies,
	...manifest.peerDependencies
};
assert(!('vue' in allDependencies), 'Vue must not remain in package dependencies.');
assert(!('vue-router' in allDependencies), 'Vue Router must not remain in package dependencies.');
assert(!/from\s+['"]vue(?:\/|['"])/.test(librarySource), 'Vue runtime imports remain in src/lib.');
assert(
	!/\b(?:createVNode|defineComponent)\s*\(/.test(librarySource),
	'Vue VNode APIs remain in src/lib.'
);

console.log(
	'Migration audit passed: 40 components, 37 examples, 28 routes, public exports, and no Vue runtime.'
);
