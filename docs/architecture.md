# ONUS RFI — SaaS Architecture

**Status:** Initial foundation, 10 October 2026. Application schema, role permissions and integrations are proposed, not yet implemented.

## Product

ONUS RFI will be a multi-tenant SaaS product for tracking construction Requests for Information, their responsibilities, replies, evidence, and deadlines. A late RFI does not alone establish construction-programme impact or contractual entitlement to an extension of time; reports must distinguish measured elapsed time from substantiated project impact.

## Agreed technical direction

- SvelteKit + TypeScript, SST on AWS
- Existing developer-owned Svelte components and authentication, integrated once source and interfaces are available
- AWS AppSync GraphQL for queries, mutations and authorised real-time subscriptions
- DynamoDB for operational data, modelled around verified access patterns
- S3 for private attachments and generated documents
- Lambda for complex business logic, SES for email
- Billing provider, hosting region, domain configuration and application permissions are **not yet decided**

## Product surfaces

1. Public marketing website
2. Authenticated customer portal for projects and RFIs
3. Tenant-level administration for members, permissions and plans
4. Platform-only administration for tenancy, support and operational oversight

Domain splits and deployments remain provisional. Subdomain separation is not an authorisation boundary.

## Domain concepts

Organisations (tenants), users, organisation membership, project membership, projects, RFIs, assignments, responses, attachments, notifications, reports and append-only RFI events.

Suggested lifecycle for discussion only: Draft → Open → Assigned/Awaiting Response → Answered → Closed. Clarification, reassignment, reopening and overdue semantics must be agreed before establishing schema.

## GraphQL candidate operations

Queries: `myOrganisations`, `projects`, `project`, `rfis`, `rfi`, `rfiEvents`, `projectDashboard`.

Mutations: `createProject`, `createRfi`, `assignRfi`, `respondToRfi`, `closeRfi`, `reopenRfi`, `inviteProjectMember`, `requestAttachmentUpload`.

Subscriptions: `onProjectRfiChanged`, `onRfiEventAdded`.

Names are preliminary; none is a promise of an implemented endpoint.

## Critical design constraints

- Determine a user's allowed organisation and project from **trusted authentication and verified membership**, not a browser-supplied tenant identifier.
- Enforce authorisation on GraphQL resolvers, nested fields, mutations, subscriptions and private attachment access.
- Design DynamoDB partition/sort keys and GSIs from explicit queries. Include tenant scope in relevant partition keys and indexes; avoid unbounded scans.
- Record server-timestamped append-only RFI events. Use atomic writes/conditional updates to keep RFI state and history consistent.
- Retain response revisions and attachment provenance. Establish retention and disclosure requirements with the client.
- Use scoped short-lived S3 URLs, deployment-stage isolation, logging, monitoring, backups and integration tests.
- A GraphQL API key alone must never act as production tenant authentication.

## Implementation sequence

1. **Foundation:** one pnpm workspace and lockfile, SST starter retained, shared non-authorising types, documentation.
2. **Product specification:** obtain existing authentication/component-library source, confirm roles, lifecycle, billing/region, and review demo functionality.
3. **SaaS baseline:** implement tenant onboarding, server-side permissions, AppSync, DynamoDB and tenant-specific S3.
4. **RFI MVP:** creation, assignment, responses, evidence, timeline and dashboards.
5. **Operations and reporting:** notifications, audit exports, billing, platform admin, automated tests.
6. **Advanced programme features:** schedule imports, evidence-linked delay analysis and EOT support, only after validated requirements.

## Current repository

- `packages/sveltekit`: starter SvelteKit application, not yet themed or authenticated.
- `packages/infra`: SST website resource definition.
- `packages/shared`: small framework-neutral domain types; **not** authorisation logic.
- `sst.config.ts`: stage-aware infrastructure entry point.

See [README](../README.md) for development conventions. Keep architecture and implementation claims separate.
