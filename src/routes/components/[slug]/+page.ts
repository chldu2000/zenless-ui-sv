import { error } from '@sveltejs/kit';
import { componentDocs, componentSlugs } from '../component-meta.js';

export const prerender = true;
export const entries = () => componentSlugs.map((slug) => ({ slug }));

export function load({ params }) {
	const meta = componentDocs.find((item) => item.slug === params.slug);
	if (!meta) error(404, 'Component example not found');
	return { meta };
}
