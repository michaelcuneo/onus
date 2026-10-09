# ONUS RFI

SvelteKit/SST starter for a planned multi-tenant construction RFI SaaS platform. The current site is still the starter application; GraphQL, DynamoDB and authentication are **not** yet wired up.

## Repository layout

```text
packages/
  infra/       SST resource definitions
  sveltekit/   Customer-facing SvelteKit application (starter)
  shared/      Framework-neutral shared types
docs/
  architecture.md
```

## Local development

Requirements: Node.js compatible with the installed SvelteKit/Vite versions, pnpm 10 and AWS credentials configured separately for SST operations.

Run at the repository root:

```sh
pnpm install
pnpm --filter sveltekit dev
pnpm --filter sveltekit check
pnpm --filter @onus/shared check
```

Use `pnpm exec sst dev` only when AWS credentials/stage are ready; don't deploy without confirming the AWS account and region.

**One workspace and one lockfile:** keep `pnpm-workspace.yaml` and `pnpm-lock.yaml` at the root. Do not generate nested workspace lockfiles. Changes to dependency versions should be made with pnpm and committed together with the regenerated root lockfile.

## Proposed platform architecture

See [docs/architecture.md](docs/architecture.md). Existing Svelte components/auth contracts, AppSync schema, DynamoDB access patterns, AWS region and billing decisions must be confirmed before implementation.
