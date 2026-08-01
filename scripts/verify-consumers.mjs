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

try {
	mkdirSync(tarballDirectory);
	run(['pack', '--pack-destination', tarballDirectory]);

	const tarballs = readdirSync(tarballDirectory).filter((file) => file.endsWith('.tgz'));
	if (tarballs.length !== 1) {
		throw new Error(`Expected exactly one package tarball, found ${tarballs.length}.`);
	}

	const tarball = join(tarballDirectory, tarballs[0]);
	for (const consumer of ['sveltekit', 'vite']) {
		const source = join(fixtureRoot, consumer);
		const destination = join(temporaryRoot, consumer);
		cpSync(source, destination, { recursive: true });
		addTarballDependency(destination, tarball);
		run(['install', '--no-frozen-lockfile'], destination);
		run(['run', 'build'], destination);
	}
} finally {
	if (existsSync(temporaryRoot)) {
		rmSync(temporaryRoot, { recursive: true, force: true });
	}
}
