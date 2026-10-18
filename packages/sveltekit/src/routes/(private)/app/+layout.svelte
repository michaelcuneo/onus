<script lang="ts">
	import { page } from '$app/state';
	import Brand from '#lib/components/Brand.svelte';
	import type { LayoutProps } from './$types';
	let { data, children }: LayoutProps = $props();
	const isProjects = $derived(
		page.url.pathname === '/app/projects' || page.url.pathname.startsWith('/app/projects/')
	);
	const isDetails = $derived(!isProjects && page.url.hash === '#workspace-details');
	const initials = $derived(
		data.user.name
			.trim()
			.split(/\s+/)
			.slice(0, 2)
			.map((part) => part[0])
			.join('')
			.toUpperCase()
	);
	const role = $derived(data.organisation.role.toLowerCase().replaceAll('_', ' '));
</script>

<div class="workspace">
	<a class="skip-link" href="#workspace-main">Skip to workspace</a>
	<aside class="sidebar" aria-label="Workspace navigation">
		<Brand />
		<div class="organisation">
			<div class="organisation-icon" aria-hidden="true">
				<svg viewBox="0 0 24 24" fill="none"
					><path d="M4 21V5h10v16M14 10h6v11M2 21h20M8 9h2m-2 4h2m-2 4h2m7-3h1m-1 3h1" /></svg
				>
			</div>
			<div>
				<span class="sidebar-caption">Your organisation</span><strong
					>{data.organisation.organisationName}</strong
				>
			</div>
		</div>
		<nav aria-label="Workspace">
			<p class="nav-heading">Workspace</p>
			<a
				class="nav-item"
				class:active={!isProjects && !isDetails}
				href="/app"
				aria-current={!isProjects && !isDetails ? 'page' : undefined}
			>
				<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"
					><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M8 9h8M8 13h5M8 17h3" /></svg
				>
				Daily WIP {#if !isProjects && !isDetails}<span class="active-mark"></span>{/if}
			</a>
			<a
				class="nav-item"
				class:active={isDetails}
				href="/app#workspace-details"
				aria-current={isDetails ? 'location' : undefined}
			>
				<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"
					><path d="M4 20V5h10v15M14 10h6v10M2 20h20M8 9h2m-2 4h2m-2 4h2" /></svg
				>
				Workspace details
			</a>
			<a
				class="nav-item"
				class:active={isProjects}
				href="/app/projects"
				aria-current={isProjects ? 'page' : undefined}
			>
				<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"
					><path d="M4 7h6l2 2h8v11H4V7Zm0 0V4h7l2 3" /></svg
				>
				Projects {#if isProjects}<span class="active-mark"></span>{/if}
			</a>
			<p class="nav-heading next-heading">Coming next</p>
			{#each ['RFIs & decisions', 'Connected apps'] as feature (feature)}
				<div class="nav-item unavailable">
					<span class="module-dot" aria-hidden="true"></span>{feature}<span class="soon">Soon</span>
				</div>
			{/each}
		</nav>
		<div class="sidebar-bottom">
			<div class="development-note">
				<span class="mint-dot"></span>
				<div>
					<strong>Building the foundations</strong>
					<p>Project tools are ready. RFI workflows and integrations are coming next.</p>
				</div>
			</div>
			<div class="account">
				<span class="avatar" aria-hidden="true">{initials}</span>
				<div><strong>{data.user.name}</strong><span class="role">{role}</span></div>
			</div>
			<form method="POST" action="/logout">
				<button class="sign-out" type="submit"
					>Sign out <span aria-hidden="true">&nearr;</span></button
				>
			</form>
		</div>
	</aside>

	<div class="workspace-body">
		<header class="topbar">
			<div class="breadcrumb">
				<span>Workspace</span><span aria-hidden="true">/</span><strong
					>{isProjects ? 'Projects' : isDetails ? 'Workspace details' : 'Daily WIP'}</strong
				>
			</div>
			<span class="stage-badge"><span class="mint-dot"></span> Early access</span>
		</header>
		<main id="workspace-main" class="content">
			{@render children()}
			<footer class="workspace-footer">
				<span>ONUS / Construction workflow &amp; accountability</span><span
					>Connect. Coordinate. Decide.</span
				>
			</footer>
		</main>
	</div>
</div>

<style>
	:global(body:has(.workspace)) {
		margin: 0;
		background: #f4f7f5;
	}
	.workspace {
		--ink: #19333a;
		--muted: #61746f;
		--green: #176b53;
		color: var(--ink);
		font-family:
			Inter,
			ui-sans-serif,
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			sans-serif;
		font-size: 0.875rem;
		line-height: 1.5;
		min-height: 100svh;
		display: grid;
		grid-template-columns: 252px minmax(0, 1fr);
	}
	.workspace :global(*) {
		box-sizing: border-box;
	}
	.workspace :global(svg) {
		stroke: currentColor;
		stroke-width: 1.5;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.workspace :global(a:focus-visible),
	button:focus-visible {
		outline: 2px solid #46a780;
		outline-offset: 4px;
	}
	.skip-link {
		position: fixed;
		top: -5rem;
		left: 1rem;
		z-index: 10;
		padding: 0.8rem;
		background: #fff;
		color: var(--green);
	}
	.skip-link:focus {
		top: 1rem;
	}
	a {
		text-decoration: none;
		color: inherit;
	}
	button {
		font: inherit;
		cursor: pointer;
	}
	.sidebar {
		position: sticky;
		top: 0;
		height: 100svh;
		padding: 2rem 1.2rem 1rem;
		display: flex;
		flex-direction: column;
		background: radial-gradient(ellipse at 0 100%, #1a443d 0, transparent 65%), #102a33;
		color: #f3f8f6;
	}
	.organisation {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		padding: 1.1rem 0.1rem 1.5rem;
		margin-top: 1.6rem;
		border-bottom: 1px solid #ffffff14;
	}
	.organisation-icon {
		display: grid;
		place-items: center;
		width: 2.2rem;
		height: 2.2rem;
		background: #ffffff0d;
		border: 1px solid #ffffff1a;
		border-radius: 0.5rem;
		color: #9dd4bd;
		flex-shrink: 0;
	}
	svg {
		width: 1.3rem;
		height: 1.3rem;
	}
	.organisation > div:last-child {
		min-width: 0;
	}
	.organisation strong {
		display: block;
		font-size: 0.8rem;
		font-weight: 600;
		overflow-wrap: anywhere;
	}
	.sidebar-caption {
		display: block;
		color: #9ab4b1;
		font-size: 0.65rem;
		margin-bottom: 0.2rem;
	}
	.nav-heading {
		margin: 1.7rem 0.65rem 0.7rem;
		color: #91aba8;
		text-transform: uppercase;
		letter-spacing: 0.13em;
		font-size: 0.6rem;
		font-weight: 650;
	}
	.nav-item {
		display: flex;
		gap: 0.8rem;
		align-items: center;
		min-height: 2.8rem;
		padding: 0.7rem 0.75rem;
		margin: 0.2rem 0;
		font-size: 0.78rem;
		border-radius: 0.4rem;
		color: #bfd1ce;
	}
	a.nav-item:hover {
		background: #ffffff09;
		color: #fff;
	}
	.nav-item.active {
		background: #9be0be17;
		color: #a7e4c8;
	}
	.active-mark {
		width: 0.3rem;
		height: 0.3rem;
		background: #9be0be;
		border-radius: 50%;
		margin-left: auto;
	}
	.unavailable {
		color: #98b0ad;
	}
	.module-dot {
		width: 1.3rem;
		height: 1.3rem;
		border: 1px solid #64867d;
		border-radius: 0.3rem;
		flex-shrink: 0;
	}
	.soon {
		margin-left: auto;
		font-size: 0.55rem;
		color: #a0b8b1;
		border: 1px solid #ffffff1a;
		border-radius: 0.25rem;
		padding: 0.1rem 0.3rem;
	}
	.sidebar-bottom {
		margin-top: auto;
		padding-top: 2rem;
	}
	.development-note {
		display: flex;
		gap: 0.6rem;
		align-items: baseline;
		border: 1px solid #ffffff14;
		padding: 0.8rem;
		border-radius: 0.5rem;
	}
	.development-note strong {
		font-size: 0.65rem;
		color: #b6d4c8;
		font-weight: 600;
	}
	.development-note p {
		color: #99b3ad;
		font-size: 0.65rem;
		line-height: 1.7;
		margin: 0.4rem 0 0;
	}
	.mint-dot {
		display: inline-block;
		width: 0.4rem;
		height: 0.4rem;
		border-radius: 50%;
		background: #75b99a;
		flex-shrink: 0;
	}
	.account {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		margin-top: 1.4rem;
		padding: 1rem 0.4rem 0.6rem;
		border-top: 1px solid #ffffff14;
	}
	.avatar {
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		display: grid;
		place-items: center;
		background: #cee8dc;
		color: #244e3e;
		font-size: 0.65rem;
		font-weight: 750;
		flex-shrink: 0;
	}
	.account div {
		min-width: 0;
	}
	.account strong {
		display: block;
		font-size: 0.75rem;
		overflow-wrap: anywhere;
		font-weight: 600;
	}
	.account div > span {
		display: block;
		color: #a0b8b1;
		font-size: 0.65rem;
	}
	.role {
		text-transform: capitalize;
	}
	.sign-out {
		display: flex;
		justify-content: space-between;
		width: 100%;
		border: 0;
		background: transparent;
		color: #abc3bb;
		padding: 0.5rem 0.4rem;
		font-size: 0.7rem;
		text-align: left;
	}
	.sign-out:hover {
		color: white;
	}
	.workspace-body {
		min-width: 0;
	}
	.topbar {
		min-height: 4.5rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem clamp(1.5rem, 3.5vw, 3.5rem);
		border-bottom: 1px solid #dee7e1;
		background: #fafcfb;
	}
	.breadcrumb {
		display: flex;
		gap: 0.8rem;
		align-items: center;
		font-size: 0.7rem;
		color: #73847e;
	}
	.breadcrumb strong {
		color: #344c43;
		font-weight: 600;
	}
	.stage-badge {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		font-size: 0.65rem;
		color: #526c60;
	}
	.content {
		max-width: 1440px;
		margin-inline: auto;
		padding: 2.8rem clamp(1.5rem, 3.5vw, 3.5rem) 1.3rem;
	}
	main[id] {
		scroll-margin-top: 1.5rem;
	}
	.workspace-footer {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		color: #7b8d82;
		font-size: 0.6rem;
		padding-top: 2rem;
	}
	@media (max-width: 1100px) {
		.workspace {
			grid-template-columns: 220px minmax(0, 1fr);
		}
	}
	@media (max-width: 760px) {
		.workspace {
			grid-template-columns: minmax(0, 1fr);
		}
		.sidebar {
			position: static;
			height: auto;
			padding: 1.2rem 1.5rem;
			display: grid;
			grid-template-columns: 1fr auto;
			gap: 1rem;
		}
		.organisation {
			margin: 0;
			padding: 0;
			border: 0;
			grid-column: 1 / -1;
			order: 1;
		}
		.sidebar nav {
			grid-column: 1 / -1;
			display: flex;
			gap: 0.4rem;
			flex-wrap: wrap;
			order: 2;
		}
		.nav-heading,
		.unavailable,
		.development-note,
		.account {
			display: none;
		}
		.sidebar-bottom {
			margin: 0;
			padding: 0;
			align-self: center;
		}
		.sign-out {
			gap: 1rem;
			padding: 0.5rem 0;
		}
		.nav-item {
			min-height: 2.5rem;
			margin: 0;
		}
		.topbar {
			min-height: 3.5rem;
		}
		.content {
			padding-top: 1.8rem;
		}
		.workspace-footer {
			flex-direction: column;
			gap: 0.4rem;
		}
	}
	@media (max-width: 420px) {
		.sidebar,
		.topbar,
		.content {
			padding-inline: 1rem;
		}
	}
</style>
