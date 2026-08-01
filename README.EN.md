# Zenless UI Svelte

Zenless UI for Svelte 5. All 40 named components plus Provider, theme, locale, and reusable DOM infrastructure have been migrated, with documentation, SSR/CSR packaging, and consumer quality gates.

The current release candidate is `0.1.0-next.0`. Run the development site and visit `/components` for 28 example groups. See `docs/migration-guide.md` for the complete Vue-to-Svelte API differences.

## Using the infrastructure

Import the stylesheet at your app entry point and use the Provider for local theme and locale configuration:

```svelte
<script lang="ts">
	import { ZenlessButton, ZenlessProvider, zhCn } from 'zenless-ui-svelte';
	import 'zenless-ui-svelte/styles.css';
</script>

<ZenlessProvider locale={zhCn} theme={{ name: 'light' }}>
	<ZenlessButton type="primary">Start</ZenlessButton>
</ZenlessProvider>
```

## Development

```sh
corepack pnpm install
corepack pnpm dev
```

## Verification

```sh
corepack pnpm lint
corepack pnpm check
corepack pnpm test:unit
corepack pnpm build
corepack pnpm verify
```

See [SVELTE_MIGRATION_PLAN.md](./SVELTE_MIGRATION_PLAN.md) for the migration roadmap.

## License

[MIT](./LICENSE)
