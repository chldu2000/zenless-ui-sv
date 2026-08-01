import { getContext, setContext } from 'svelte';

interface DemoSourceContext {
	next: () => string;
}

const demoSourceContextKey = Symbol('zenless-demo-source');

function normalizeSource(source: string) {
	const lines = source.replace(/^\s*\n|\n\s*$/g, '').split('\n');
	const indentation = Math.min(
		...lines.filter((line) => line.trim()).map((line) => line.match(/^\s*/)?.[0].length ?? 0)
	);
	return lines
		.map((line) => line.slice(indentation))
		.join('\n')
		.trim();
}

export function extractDemoSources(source: string, slug: string) {
	const branchPattern = /\{(?:#if|:else if) slug === '([^']+)'\}/g;
	const branches = [...source.matchAll(branchPattern)];
	const branchIndex = branches.findIndex((match) => match[1] === slug);
	if (branchIndex === -1) return [];

	const branch = branches[branchIndex];
	const start = (branch.index ?? 0) + branch[0].length;
	const end = branches[branchIndex + 1]?.index ?? source.lastIndexOf('{/if}');
	const content = source.slice(start, end);
	const openingPattern = /<DemoSection\b[^>]*>/g;
	const results: string[] = [];

	for (const opening of content.matchAll(openingPattern)) {
		const innerStart = (opening.index ?? 0) + opening[0].length;
		const innerEnd = content.indexOf('</DemoSection>', innerStart);
		if (innerEnd === -1) continue;
		results.push(normalizeSource(content.slice(innerStart, innerEnd)));
	}

	return results;
}

export function provideDemoSources(source: string, getSlug: () => string) {
	let sources: string[] | undefined;
	let index = 0;
	setContext<DemoSourceContext>(demoSourceContextKey, {
		next: () => (sources ??= extractDemoSources(source, getSlug()))[index++] ?? ''
	});
}

export function consumeDemoSource() {
	return getContext<DemoSourceContext | undefined>(demoSourceContextKey)?.next() ?? '';
}
