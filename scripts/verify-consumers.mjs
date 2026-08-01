import { execFileSync } from 'node:child_process';
import {
	cpSync,
	existsSync,
	mkdtempSync,
	mkdirSync,
	readdirSync,
	readFileSync,
	rmSync,
	writeFileSync
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const projectRoot = resolve(import.meta.dirname, '..');
const fixtureRoot = join(projectRoot, 'tests', 'consumers');
const temporaryRoot = mkdtempSync(join(tmpdir(), 'zenless-ui-svelte-consumers-'));
const tarballDirectory = join(temporaryRoot, 'tarballs');

function run(args, cwd = projectRoot) {
	execFileSync('corepack', ['pnpm', ...args], { cwd, stdio: 'inherit' });
}

function addTarballDependency(directory, tarball) {
	const manifestPath = join(directory, 'package.json');
	const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
	manifest.dependencies['zenless-ui-svelte'] = `file:${tarball}`;
	writeFileSync(manifestPath, `${JSON.stringify(manifest, null, '\t')}\n`);
}

function verifyTarball(tarball) {
	const entries = execFileSync('tar', ['-tzf', tarball], { encoding: 'utf8' }).trim().split('\n');
	const required = [
		'package/dist/index.js',
		'package/dist/index.d.ts',
		'package/dist/styles.css',
		'package/dist/styles/icons.woff2',
		'package/dist/locale/index.js',
		'package/dist/locale/index.d.ts',
		'package/dist/ZenlessButton.svelte'
	];

	for (const entry of required) {
		if (!entries.includes(entry)) {
			throw new Error(`Missing required package entry: ${entry}`);
		}
	}

	const forbidden = entries.filter(
		(entry) =>
			entry.endsWith('.vue') || entry.includes('/examples/') || entry.includes('/packages/')
	);
	if (forbidden.length > 0) {
		throw new Error(`Legacy Vue files leaked into package: ${forbidden.join(', ')}`);
	}

	const components = entries.filter((entry) => entry.endsWith('.svelte'));
	const missingDeclarations = components.filter((entry) => !entries.includes(`${entry}.d.ts`));
	if (missingDeclarations.length > 0) {
		throw new Error(`Missing component declarations: ${missingDeclarations.join(', ')}`);
	}
}

function verifyTreeShaking(directory) {
	const assetDirectory = join(directory, 'dist', 'assets');
	const javascript = readdirSync(assetDirectory)
		.filter((file) => file.endsWith('.js'))
		.map((file) => readFileSync(join(assetDirectory, file), 'utf8'))
		.join('\n');

	if (javascript.includes('z-modal')) {
		throw new Error('Unused ZenlessModal code was retained in the Vite consumer bundle.');
	}
}

try {
	mkdirSync(tarballDirectory);
	run(['pack', '--pack-destination', tarballDirectory]);

	const tarballs = readdirSync(tarballDirectory).filter((file) => file.endsWith('.tgz'));
	if (tarballs.length !== 1) {
		throw new Error(`Expected exactly one package tarball, found ${tarballs.length}.`);
	}

	const tarball = join(tarballDirectory, tarballs[0]);
	verifyTarball(tarball);
	for (const consumer of ['sveltekit', 'vite']) {
		const source = join(fixtureRoot, consumer);
		const destination = join(temporaryRoot, consumer);
		cpSync(source, destination, { recursive: true });
		addTarballDependency(destination, tarball);
		run(['install', '--no-frozen-lockfile'], destination);
		run(['run', 'build'], destination);
		if (consumer === 'vite') verifyTreeShaking(destination);
	}
} finally {
	if (existsSync(temporaryRoot)) {
		rmSync(temporaryRoot, { recursive: true, force: true });
	}
}
