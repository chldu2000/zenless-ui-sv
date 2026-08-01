# Zenless UI Svelte

The Svelte 5 migration of Zenless UI. This branch currently contains the library packaging, documentation site, quality gates, and consumer-verification foundation. Components will be migrated in subsequent phases.

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
```

See [SVELTE_MIGRATION_PLAN.md](./SVELTE_MIGRATION_PLAN.md) for the migration roadmap.

## License

[MIT](./LICENSE)
