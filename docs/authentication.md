# ONUS first-party authentication (initial implementation)

Identity is ONUS-owned. **No Cognito, OpenAuth server, hosted identity provider or SSO dependency.** Inspired by the earlier Rescue Hub auth implementation, not the older SvelteKit-SST-Auth in-memory sessions.

## Initial routes

- `/signup`: email/password account; verification code sent by SES.
- `/verify`: activate account with a time-limited, single-use 8-digit code.
- `/login`, `/logout`: credential login and server-side session revocation.
- `/reset`: time-limited password reset codes; prior sessions invalidated with auth epoch.
- `/onboarding`: create first organisation; `/app`: protected application shell.

## Data and security

- DynamoDB: email lookup, credentials, challenges, sessions, organisations and membership.
- Passwords: Node.js scrypt with independent random salts.
- Session tokens: 256 random bits in HTTP-only SameSite=Lax secure host-only cookies; only hashes stored in DynamoDB.
- Code hashes: SHA-256 HMAC using `OnusAuthPepper` secret, TTL and attempt limits.
- Every privileged API and AppSync resolver must check **user + active organisation membership + requested action**; a browser route guard alone is insufficient.
- For production: enable perimeter rate limits/WAF (especially on signup and password verification), account-enumeration protections, abuse monitoring, transactional recovery, SES verified identity, and authentication end-to-end tests before release. The current limiter is per-email and is not adequate by itself for internet exposure.
- Billing provider, invitation workflow, organisation switching and API bearer-token issuance remain future work.

## Setup

Run `pnpm install` at root to regenerate the shared lockfile, then `pnpm --filter sveltekit check`. Before running the site through SST, set a 32+ character random secret using `pnpm exec sst secret set OnusAuthPepper <generated-secret> --stage <stage>` and configure `OnusMailFrom` to a verified SES sender. Configure SES production sending rights if required. For local-only development, `ONUS_AUTH_DEV_EMAIL=stdout` logs verification/reset codes to the local console (never enable this in production).

Do not deploy or merge this branch without lockfile regeneration and verification, and do not treat the first-pass route scaffolding as security-audited.
