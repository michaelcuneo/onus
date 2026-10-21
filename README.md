# ONUS RFI

Early SvelteKit/SST application for a multi-tenant construction workflow SaaS platform. First-party authentication, organisation onboarding and private project records are implemented with DynamoDB. RFI workflows, AppSync and external integrations are not yet implemented.

## Repository layout

```text
packages/
  infra/       SST resource definitions
  sveltekit/   Customer-facing SvelteKit application
  shared/      Framework-neutral shared types
docs/
  architecture.md
```

## Local development

Requirements: Node.js compatible with the installed SvelteKit/Vite versions, pnpm 10 and AWS credentials configured separately for SST operations.

Run at the repository root:

```sh
pnpm install
ONUS_AUTH_DEV_EMAIL=stdout npx sst dev
pnpm --filter sveltekit check
```

Start through SST so the tables, secrets and AWS permissions are linked; standalone Vite is not sufficient. Confirm the AWS account, region and stage before provisioning resources. See [authentication setup](docs/authentication.md#setup) for required secrets and development email configuration. Append `--mode mono` if the terminal cannot run SST's multiplexer.

**One workspace and one lockfile:** keep `pnpm-workspace.yaml` and `pnpm-lock.yaml` at the root. Do not generate nested workspace lockfiles. Changes to dependency versions should be made with pnpm and committed together with the regenerated root lockfile.

## Product workflow and architecture

- **[Editable product & workflow document](docs/workflow.md)** — plain-English business processes, example scenarios and decisions for Scott and the team. Edit in GitHub and propose changes for review.
- **[First-party authentication](docs/authentication.md)** — implemented signup, verification, login, password reset, sessions and initial organisation onboarding.
- **[Technical architecture](docs/architecture.md)** — platform infrastructure, event-driven integrations, GraphQL, DynamoDB and MCP guidance.

## Project tools

Open `/app/projects` to create, search, view, edit, archive and restore project records. Each record includes a name, reference, status, client, location, description and optional start/target dates. The workspace shows the real count of non-archived projects assigned to the current user.

Projects are private to explicitly assigned members. The creator is automatically assigned as a project manager; organisation ownership or administration alone does not grant access. Creation requires an organisation `OWNER`, `ADMIN` or `PROJECT_MANAGER` role; changes also require an active project `MANAGER` membership. Member assignment UI, invitations and organisation switching are not implemented yet.

Project writes use DynamoDB transactions and version checks to prevent stale updates. Archiving retains current details and membership; this is not a full revision/audit history.

Run validation with configured SST development resources:

```sh
pnpm --filter sveltekit check
pnpm exec sst shell -- pnpm --filter sveltekit test:projects
pnpm exec sst shell -- pnpm --filter sveltekit build
```

Project tests use real development tables, create isolated fictional fixtures and remove their exact records afterward. Do not run them against production resources. Review the authentication document's production-readiness requirements before release.

## Appearance

The homepage, account screens and workspace include a **Theme** selector with **System**, **Light** and **Dark** options. System is the default and follows OS appearance changes automatically. An explicit preference is saved in this browser and shared across tabs on the same site. Theme selection is applied before rendering to avoid a flash of the wrong appearance. If browser storage is blocked, the current page still changes theme and reports that the preference could not be saved.

Run the theme startup tests with `pnpm --filter sveltekit test:theme` (no AWS resources required).
