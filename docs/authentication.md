# ONUS first-party authentication (initial implementation)

Identity is ONUS-owned. **No Cognito, OpenAuth server, hosted identity provider or SSO dependency.** Inspired by the earlier Rescue Hub auth implementation, not the older SvelteKit-SST-Auth in-memory sessions.

## Initial routes

- `/signup`: email/password account; verification code sent by SES.
- `/verify`: activate account with a time-limited, single-use 8-digit code.
- `/login`, `/logout`: credential login and server-side session revocation.
- `/reset`: time-limited password reset codes; prior sessions invalidated with auth epoch.
- `/onboarding`: create first organisation; `/app`: protected application shell.

The public landing page and authentication/onboarding screens share the ONUS navy-and-mint branding and responsive layouts. The landing page's daily WIP preview is illustrative, not a live project dashboard.

The protected workspace displays the signed-in user's organisation, role and email, plus the real count of non-archived projects assigned to them. Its five Daily WIP categories have explanatory empty states. Project records are live at `/app/projects`; RFIs and connected applications remain upcoming features.

Project loads and actions independently verify the session, active organisation membership and explicit project membership. Creating a project assigns its creator as manager; other organisation owners and administrators receive no automatic project access. Creation requires an organisation owner/admin/project-manager role, and mutations additionally require a project manager assignment. Assigned viewers are read-only. Member assignment UI is not implemented yet.

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

Start the application through SST so the DynamoDB table, secrets and AWS permissions are linked:

```sh
ONUS_AUTH_DEV_EMAIL=stdout npx sst dev
```

If the terminal cannot run SST's multiplexer, append `--mode mono`. For this local-only email mode, `OnusMailFrom` must still be set as an SST secret, but emails are printed rather than sent.

For a smoke test, use a fictional development account: sign up, enter an incorrect then correct verification code, create an organisation, log out, try an incorrect then correct password, and reset the password. Confirm that the previous session and password no longer grant access. Use the verification page's resend action to recover an account left pending by an earlier failed signup.

Verification uses named actions for both verification and resend. Code inputs must retain the literal `[0-9]{8}` HTML pattern (use a Svelte string expression so braces are not interpolated). DynamoDB update expressions alias the reserved `ttl` attribute in both code issuance and failed-login tracking; ordinary item attributes do not need aliases.

Do not deploy or merge this branch without lockfile regeneration and verification, and do not treat the first-pass route scaffolding as security-audited.
