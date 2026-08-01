# Zenless UI Svelte

The Svelte 5 migration of Zenless UI. This branch currently includes library packaging, a documentation site, quality gates, consumer verification, plus Provider, theme, locale, and reusable DOM infrastructure. Components will be migrated in subsequent phases.

The migrated presentation components are `ZenlessIcon`, `ZenlessButton`, `ZenlessLink`, `ZenlessTag`, `ZenlessBadge`, `ZenlessCard`, `ZenlessProgress`, and `ZenlessPattern`. Run the development site and visit `/components` for examples.

## Using the infrastructure

Import the stylesheet at your app entry point and use the Provider for local theme and locale configuration:

```svelte
<script lang="ts">
	import { ZenlessProvider, zhCn } from 'zenless-ui-svelte';
	import 'zenless-ui-svelte/styles.css';
</script>

<ZenlessProvider locale={zhCn} theme={{ name: 'light' }}>
	<!-- Components will arrive in later migration phases. -->
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
