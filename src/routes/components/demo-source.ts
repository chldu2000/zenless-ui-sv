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

function escapeRegExp(value: string) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

interface ScriptDeclarations {
	order: string[];
	statements: Map<string, string>;
}

function splitScriptStatements(script: string) {
	const statements: string[] = [];
	let start = 0;
	let depth = 0;
	let quote: '"' | "'" | '`' | undefined;
	let lineComment = false;
	let blockComment = false;
	for (let i = 0; i < script.length; i++) {
		const char = script[i];
		const next = script[i + 1];
		if (lineComment) {
			if (char === '\n') lineComment = false;
			continue;
		}
		if (blockComment) {
			if (char === '*' && next === '/') blockComment = false;
			continue;
		}
		if (quote) {
			if (char === '\\') i++;
			else if (char === quote) quote = undefined;
			continue;
		}
		if (char === '/' && next === '/') {
			lineComment = true;
			i++;
			continue;
		}
		if (char === '/' && next === '*') {
			blockComment = true;
			i++;
			continue;
		}
		if (char === '"' || char === "'" || char === '`') {
			quote = char;
			continue;
		}
		if (char === '(' || char === '[' || char === '{') {
			depth++;
			continue;
		}
		if (char === ')' || char === ']' || char === '}') {
			depth--;
			continue;
		}
		if (char === ';' && depth === 0) {
			const statement = script.slice(start, i + 1).trim();
			if (statement) statements.push(statement);
			start = i + 1;
		}
	}
	const tail = script.slice(start).trim();
	if (tail) statements.push(tail);
	return statements;
}

function extractScriptDeclarations(source: string): ScriptDeclarations {
	const declarations: ScriptDeclarations = { order: [], statements: new Map() };
	const scriptMatch = source.match(/<script\b[^>]*>([\s\S]*?)<\/script>/);
	if (!scriptMatch) return declarations;
	for (const statement of splitScriptStatements(scriptMatch[1])) {
		const match = statement.match(/^(?:export\s+)?(?:let|const)\s+([A-Za-z_$][\w$]*)/);
		if (!match) continue;
		const name = match[1];
		if (declarations.statements.has(name)) continue;
		declarations.order.push(name);
		declarations.statements.set(name, statement);
	}
	return declarations;
}

function referencesIdentifier(text: string, name: string, inMarkup: boolean) {
	const escaped = escapeRegExp(name);
	if (!inMarkup) return new RegExp(`\\b${escaped}\\b`).test(text);
	return (
		// 表达式花括号内，如 {checks}、data={rows}、{#each [...colors, ...factions]}
		new RegExp(`\\{[^{}]*\\b${escaped}\\b`).test(text) ||
		// bind:name 隐式引用同名变量，如 bind:checked
		new RegExp(`\\bbind:\\s*${escaped}\\b`).test(text) ||
		// 块指令直接引用，如 {#each sizes as size}、{@attach captureScroller}
		new RegExp(`\\{#(?:each|await|key)\\s+\\b${escaped}\\b`).test(text) ||
		new RegExp(`\\{@(?:attach|render|const)\\s+\\b${escaped}\\b`).test(text)
	);
}

function collectUsedDeclarations(content: string, declarations: ScriptDeclarations) {
	const used = new Set<string>();
	let jsText = '';
	let changed = true;
	while (changed) {
		changed = false;
		for (const name of declarations.order) {
			if (used.has(name)) continue;
			if (
				referencesIdentifier(content, name, true) ||
				(jsText && referencesIdentifier(jsText, name, false))
			) {
				used.add(name);
				jsText += `\n${declarations.statements.get(name)}`;
				changed = true;
			}
		}
	}
	return declarations.order.filter((name) => used.has(name));
}

function withDeclarations(content: string, declarations: ScriptDeclarations) {
	const used = collectUsedDeclarations(content, declarations);
	if (!used.length) return content;
	const script = used.map((name) => declarations.statements.get(name)).join('\n');
	return `<script lang="ts">\n${script}\n</script>\n\n${content}`;
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
	const declarations = extractScriptDeclarations(source);

	for (const opening of content.matchAll(openingPattern)) {
		const innerStart = (opening.index ?? 0) + opening[0].length;
		const innerEnd = content.indexOf('</DemoSection>', innerStart);
		if (innerEnd === -1) continue;
		results.push(
			withDeclarations(normalizeSource(content.slice(innerStart, innerEnd)), declarations)
		);
	}

	return results;
}

export function provideDemoSources(source: string, getSlug: () => string) {
	let activeSlug: string | undefined;
	let sources: string[] = [];
	let index = 0;
	setContext<DemoSourceContext>(demoSourceContextKey, {
		next: () => {
			const slug = getSlug();
			if (slug !== activeSlug) {
				activeSlug = slug;
				sources = extractDemoSources(source, slug);
				index = 0;
			}
			return sources[index++] ?? '';
		}
	});
}

export function consumeDemoSource() {
	return getContext<DemoSourceContext | undefined>(demoSourceContextKey)?.next() ?? '';
}
