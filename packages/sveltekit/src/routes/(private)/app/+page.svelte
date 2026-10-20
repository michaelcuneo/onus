<script lang="ts">
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	const work = $derived(data.workflows.flatMap((w) => w.workItems.map((item) => ({ ...item, projectId: w.projectId, projectName: w.projectName }))));
	const actions = $derived(data.workflows.flatMap((w) => w.proposedActions.map((item) => ({ ...item, projectId: w.projectId, projectName: w.projectName, canManage: w.canManage }))));
	const label = (value: unknown) => String(value ?? '');
	const categories = [
		{
			id: 'approvals',
			label: 'For approval',
			title: 'A clear place for your next decision.',
			description:
				'Proposed actions will appear here for you to approve, amend, reject or escalate, with the evidence behind each one.'
		},
		{
			id: 'blockers',
			label: 'Outstanding',
			title: 'See what needs to move forward.',
			description:
				'Outstanding responses, missing approvals and dependencies will appear here once project workflows are available.'
		},
		{
			id: 'risks',
			label: 'Delivery risks',
			title: 'Keep the bigger picture in view.',
			description:
				'Programme and delivery risks will be linked to their source records, so you can investigate the impact rather than rely on assumptions.'
		},
		{
			id: 'escalations',
			label: 'Escalations',
			title: 'Make space for the difficult calls.',
			description:
				'Conflicting information and decisions requiring your judgement will appear here with the context you need.'
		},
		{
			id: 'completed',
			label: 'Completed',
			title: 'Know what actually happened.',
			description:
				'Completed actions and their verified outcomes will appear here. A proposed or queued action will not be treated as a completed result.'
		}
	];
	let selectedCategory = $state(categories[0].id);
	const records = $derived(selectedCategory === 'approvals' ? actions.filter((item) => item.status === 'PROPOSED') : selectedCategory === 'completed' ? actions.filter((item) => item.status === 'APPROVED') : selectedCategory === 'blockers' ? work.filter((item) => item.status === 'OVERDUE' || item.status === 'PENDING') : selectedCategory === 'risks' ? work.filter((item) => item.status === 'BLOCKED') : []);
	const currentCategory = $derived(
		categories.find((category) => category.id === selectedCategory)!
	);
	const firstName = $derived(data.user.name.trim().split(/\s+/)[0]);
	const role = $derived(data.organisation.role.toLowerCase().replaceAll('_', ' '));
</script>

<svelte:head>
	<title>Daily WIP | {data.organisation.organisationName} | ONUS</title>
</svelte:head>

<section id="daily-wip" aria-labelledby="wip-title">
	<div class="page-heading">
		<div>
			<p class="eyebrow">Your project control centre</p>
			<h1 id="wip-title">A clearer day, {firstName}.</h1>
			<p class="intro">The next actions. The right context. All in one place.</p>
		</div>
		<div class="workspace-status"><span class="mint-dot"></span> Workspace created</div>
	</div>

	<div class="welcome-banner">
		<div class="banner-symbol" aria-hidden="true">
			<svg viewBox="0 0 24 24" fill="none"
				><path d="m7 12 3 3 7-7" /><circle cx="12" cy="12" r="9" /></svg
			>
		</div>
		<div>
			<h2>Your next project starts here.</h2>
			<p>
				Create and manage projects with access limited to assigned members. RFI decisions, blockers
				and integrations will follow.
			</p>
		</div>
		<a href="/app/projects">View projects <span aria-hidden="true">&rarr;</span></a>
	</div>

	<div class="overview" aria-label="Workspace overview">
		<div>
			<span class="metric-label">Your current projects</span><strong>{data.projectCount}</strong>
			<span class="metric-note">Assigned to you, excluding archived</span>
		</div>
		<div>
			<span class="metric-label">Decisions for review</span><strong
				aria-label="Decisions for review">{actions.filter((item) => item.status === 'PROPOSED').length}</strong
			><span class="metric-note">Your approval queue, in one place</span>
		</div>
		<div>
			<span class="metric-label">Connected applications</span><strong
				aria-label="Integrations not yet available">&mdash;</strong
			><span class="metric-note">Integrations in development</span>
		</div>
	</div>

	<section class="review-panel" aria-labelledby="review-title">
		<div class="panel-heading">
			<div>
				<h2 id="review-title">Your daily WIP</h2>
				<p>Prepared for review. You stay in control.</p>
			</div>
			<span class="subtle-badge">{data.workflows.some((w) => w.workItems.length) ? 'Workflow demo' : 'Ready for demo'}</span>
		</div>
		<div class="assessment-controls">
			{#each data.workflows.filter((w) => w.canManage && w.workItems.length) as workflow (workflow.projectId)}
				<form method="POST" action="?/evaluate">
					<input type="hidden" name="projectId" value={workflow.projectId} />
					<button class="wip-action" type="submit">Assess {workflow.projectName}</button>
				</form>
			{/each}
		</div>
		<div class="category-filters" role="group" aria-label="WIP categories">
			{#each categories as category (category.id)}
				<button
					type="button"
					class:selected={selectedCategory === category.id}
					aria-pressed={selectedCategory === category.id}
					onclick={() => (selectedCategory = category.id)}>{category.label}</button
				>
			{/each}
		</div>
		{#if form?.error}<p class="wip-notice" role="alert">{form.error}</p>{/if}
		{#if form?.message}<p class="wip-notice" role="status">{form.message}</p>{/if}
		{#if records.length}
			<div class="wip-records">
				{#each records as item (item.projectId + item.sk)}
					<article class="wip-record">
						<div><span class="empty-kicker">{item.projectName} · {label(item.kind)}</span><h3>{label(item.title ?? item.id)}</h3><p>{label(item.status)}{#if item.explanation} · {label(item.explanation)}{/if}</p></div>
						{#if 'canManage' in item && item.canManage && item.status === 'PROPOSED'}
							<form method="POST" action="?/approve"><input type="hidden" name="projectId" value={item.projectId} /><input type="hidden" name="actionId" value={label(item.id)} /><button class="wip-action" type="submit">Approve follow-up</button></form>
						{/if}
					</article>
				{/each}
			</div>
		{:else}
		<div class="empty-state" aria-live="polite" aria-atomic="true">
			<div class="empty-icon" aria-hidden="true">
				<svg viewBox="0 0 48 48" fill="none"
					><rect x="10" y="7" width="28" height="35" rx="5" /><path
						d="M19 7V5h10v2M17 18h14M17 25h9M17 32h6"
					/><circle cx="36" cy="35" r="9" /><path d="m32 35 3 3 5-6" /></svg
				>
			</div>
			<p class="empty-kicker">{currentCategory.label}</p>
			<h3>{currentCategory.title}</h3>
			<p>{currentCategory.description}</p>
			{#if data.workflows.some((w) => w.canManage && !w.workItems.length)}
				<div class="demo-actions">
					{#each data.workflows.filter((w) => w.canManage && !w.workItems.length) as workflow (workflow.projectId)}
						<form method="POST" action="?/seed"><input type="hidden" name="projectId" value={workflow.projectId} /><button class="wip-action" type="submit">Load demo for {workflow.projectName}</button></form>
					{/each}
				</div>
			{:else if !data.workflows.length}
				<a class="project-link" href="/app/projects">Create a project to start the demo &rarr;</a>
			{:else if data.workflows.some((w) => w.workItems.length)}
				<span class="empty-status">No items in this category</span>
			{:else}
				<span class="empty-status">Ask a project manager to load the demo</span>
			{/if}
		</div>
		{/if}
		<div class="panel-footer">
			<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"
				><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z" /><path d="m8 12 3 3 5-6" /></svg
			><span>Demo records are illustrative and are not a report of live project health.</span>
		</div>
	</section>
</section>

<section id="workspace-details" class="details-section" aria-labelledby="details-title">
	<div class="section-heading">
		<div>
			<p class="eyebrow">A solid starting point</p>
			<h2 id="details-title">Your workspace</h2>
		</div>
		<span class="details-label">Account &amp; organisation</span>
	</div>
	<div class="details-grid">
		<article class="detail-card">
			<div class="card-heading">
				<span class="card-icon" aria-hidden="true"
					><svg viewBox="0 0 24 24" fill="none"
						><path d="M4 21V4h11v17M15 10h5v11M2 21h20M8 8h3m-3 4h3m-3 4h3" /></svg
					></span
				><span class="ready-badge">Ready</span>
			</div>
			<h3>{data.organisation.organisationName}</h3>
			<p>Your organisation workspace is created and your membership is active.</p>
			<dl>
				<div>
					<dt>Your role</dt>
					<dd class="role">{role}</dd>
				</div>
				<div>
					<dt>Signed in as</dt>
					<dd>{data.user.email}</dd>
				</div>
			</dl>
		</article>
		<article class="detail-card next-card">
			<div class="card-heading">
				<span class="card-icon" aria-hidden="true"
					><svg viewBox="0 0 24 24" fill="none"
						><path d="M4 7h6l2 2h8v11H4V7Zm0 0V4h7l2 3M9 14h6m-3-3v6" /></svg
					></span
				><span class="ready-badge">Ready</span>
			</div>
			<h3>Your projects, in one place.</h3>
			<p>
				Create projects, keep their details current, and archive them without losing their details.
				Only assigned members can access them.
			</p>
			<a class="project-link" href="/app/projects">Open projects &rarr;</a>
		</article>
	</div>
</section>

<style>
	.assessment-controls{display:flex;gap:.6rem;flex-wrap:wrap;padding:0 1.5rem 1rem}

	.wip-notice{margin:0 1.5rem 1rem;padding:.8rem;border:1px solid #c8dfd1;border-radius:.4rem;font-size:.8rem}
	.wip-records{padding:1rem 1.5rem;display:grid;gap:.8rem}
	.wip-record{border:1px solid #dce5df;border-radius:.5rem;padding:1rem;display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap}
	.wip-record h3{font-size:.95rem;margin:.3rem 0}.wip-record p{font-size:.75rem;color:var(--muted);margin:0}
	.demo-actions{display:grid;gap:.5rem;margin-top:.5rem}
	button.wip-action{border:1px solid #c8dfd1;border-radius:.4rem;background:#eaf3ed;color:#176b53;font-weight:650;padding:.6rem .9rem;font-size:.75rem}

	a {
		text-decoration: none;
		color: inherit;
	}
	button {
		font: inherit;
		cursor: pointer;
	}
	svg {
		width: 1.3rem;
		height: 1.3rem;
	}
	button:focus-visible {
		outline: 2px solid #46a780;
		outline-offset: 4px;
	}
	section[id] {
		scroll-margin-top: 1.5rem;
	}
	.mint-dot {
		display: inline-block;
		width: 0.4rem;
		height: 0.4rem;
		border-radius: 50%;
		background: #75b99a;
		flex-shrink: 0;
	}
	.page-heading {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1.5rem;
		margin-bottom: 2rem;
	}
	.eyebrow {
		font-size: 0.6rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: var(--green);
		margin: 0 0 0.65rem;
	}
	h1 {
		margin: 0;
		font-size: clamp(1.8rem, 2.7vw, 2.6rem);
		font-weight: 600;
		line-height: 1.2;
		letter-spacing: -0.045em;
		overflow-wrap: anywhere;
	}
	.intro {
		color: var(--muted);
		margin: 0.65rem 0 0;
		font-size: 0.85rem;
	}
	.workspace-status {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: #60786b;
		font-size: 0.65rem;
		white-space: nowrap;
	}
	.welcome-banner {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1.25rem;
		border: 1px solid #c8dfd1;
		background: #eaf3ed;
		border-radius: 0.65rem;
	}
	.banner-symbol {
		display: grid;
		place-items: center;
		color: #39845e;
		width: 2.5rem;
		height: 2.5rem;
		flex-shrink: 0;
		background: #daebdf;
		border-radius: 0.6rem;
	}
	.banner-symbol svg {
		width: 1.5rem;
		height: 1.5rem;
	}
	.welcome-banner h2 {
		font-size: 0.85rem;
		margin: 0 0 0.3rem;
		font-weight: 650;
	}
	.welcome-banner p {
		font-size: 0.75rem;
		color: #526e5e;
		max-width: 40rem;
		margin: 0;
		line-height: 1.7;
	}
	.welcome-banner a {
		margin-left: auto;
		font-size: 0.7rem;
		color: var(--green);
		font-weight: 650;
		white-space: nowrap;
	}
	.welcome-banner a:hover {
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.overview {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
		margin: 1.5rem 0 2rem;
	}
	.overview > div {
		background: #fff;
		border: 1px solid #dce5df;
		padding: 1.25rem;
		border-radius: 0.6rem;
		display: grid;
	}
	.metric-label {
		color: #4e655a;
		font-size: 0.7rem;
		font-weight: 550;
	}
	.overview strong {
		font-size: 1.85rem;
		line-height: 1.4;
		font-weight: 450;
		color: #a2b5a8;
		margin: 0.4rem 0;
	}
	.metric-note {
		color: #708578;
		font-size: 0.65rem;
	}
	.review-panel {
		border: 1px solid #dce5df;
		border-radius: 0.65rem;
		background: #fff;
		overflow: hidden;
	}
	.panel-heading {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		padding: 1.4rem 1.5rem;
	}
	h2 {
		font-size: 1.1rem;
		font-weight: 650;
		letter-spacing: -0.025em;
		margin: 0;
	}
	.panel-heading p {
		color: var(--muted);
		font-size: 0.7rem;
		margin: 0.3rem 0 0;
	}
	.subtle-badge,
	.ready-badge {
		font-size: 0.6rem;
		color: #65776e;
		border: 1px solid #dfe7e1;
		border-radius: 0.3rem;
		padding: 0.25rem 0.5rem;
		white-space: nowrap;
	}
	.category-filters {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
		padding: 0 1.5rem 1rem;
		border-bottom: 1px solid #e8eee9;
	}
	.category-filters button {
		border: 1px solid transparent;
		background: transparent;
		color: #65776e;
		padding: 0.5rem 0.75rem;
		border-radius: 0.35rem;
		font-size: 0.7rem;
	}
	.category-filters button:hover {
		background: #f3f7f4;
		color: #176b53;
	}
	.category-filters button.selected {
		background: #edf5ef;
		color: #176b53;
		border-color: #d4e7da;
		font-weight: 650;
	}
	.empty-state {
		padding: 3rem 1.5rem;
		text-align: center;
		max-width: 34rem;
		margin-inline: auto;
		min-height: 21rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.empty-icon {
		display: grid;
		place-items: center;
		background: #f0f5f1;
		color: #6f9a7d;
		border: 1px solid #e2ece4;
		width: 4rem;
		height: 4rem;
		border-radius: 1.1rem;
		margin-bottom: 1rem;
	}
	.empty-icon svg {
		width: 2.5rem;
		height: 2.5rem;
	}
	.empty-kicker {
		font-size: 0.6rem;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: #6c8974;
		margin: 0 0 0.5rem;
		font-weight: 650;
	}
	.empty-state h3 {
		font-size: 1.2rem;
		letter-spacing: -0.03em;
		font-weight: 600;
		margin: 0;
	}
	.empty-state > p:not(.empty-kicker) {
		color: var(--muted);
		font-size: 0.78rem;
		line-height: 1.8;
		margin: 0.7rem 0 1.1rem;
	}
	.empty-status {
		font-size: 0.6rem;
		color: #6b7d72;
		background: #f4f7f4;
		border-radius: 1rem;
		padding: 0.35rem 0.7rem;
	}
	.panel-footer {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		border-top: 1px solid #e8eee9;
		padding: 0.9rem 1.5rem;
		color: #708578;
		background: #fafcfb;
		font-size: 0.6rem;
	}
	.panel-footer svg {
		width: 0.9rem;
		height: 0.9rem;
		flex-shrink: 0;
	}
	.details-section {
		margin-top: 2.5rem;
	}
	.section-heading {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		align-items: end;
		margin-bottom: 1.2rem;
	}
	.section-heading .eyebrow {
		margin-bottom: 0.4rem;
	}
	.details-label {
		font-size: 0.65rem;
		color: #73847e;
	}
	.details-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	.detail-card {
		min-width: 0;
		border: 1px solid #dce5df;
		border-radius: 0.65rem;
		background: #fff;
		padding: 1.5rem;
	}
	.card-heading {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}
	.card-icon {
		display: grid;
		place-items: center;
		width: 2.3rem;
		height: 2.3rem;
		background: #f0f5f1;
		color: #668c71;
		border-radius: 0.5rem;
	}
	.ready-badge {
		border-color: #d4e7da;
		color: #2f7651;
		background: #eff7f0;
	}
	.detail-card h3 {
		margin: 0;
		font-weight: 650;
		font-size: 0.9rem;
		letter-spacing: -0.02em;
		overflow-wrap: anywhere;
	}
	.detail-card > p {
		color: var(--muted);
		font-size: 0.75rem;
		line-height: 1.8;
		margin: 0.6rem 0 1.2rem;
	}
	dl {
		border-top: 1px solid #e8eee9;
		padding-top: 0.9rem;
		margin: 0;
	}
	dl div {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		font-size: 0.65rem;
		padding: 0.3rem 0;
	}
	dt {
		color: #73847e;
		flex-shrink: 0;
	}
	dd {
		margin: 0;
		text-align: right;
		overflow-wrap: anywhere;
		min-width: 0;
	}
	.next-card {
		background: #f9fbf9;
	}
	.project-link {
		color: var(--green);
		font-size: 0.8rem;
		font-weight: 600;
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	@media (max-width: 1100px) {
		.welcome-banner {
			flex-wrap: wrap;
		}
		.welcome-banner > div:nth-child(2) {
			flex: 1;
		}
		.welcome-banner a {
			margin-left: 3.5rem;
		}
		.page-heading {
			align-items: flex-start;
			flex-direction: column;
			gap: 0.8rem;
		}
		.metric-note {
			line-height: 1.7;
		}
	}
	@media (max-width: 760px) {
		.overview {
			gap: 0.6rem;
		}
		.overview > div {
			padding: 0.9rem;
		}
		.metric-label {
			font-size: 0.65rem;
		}
		.details-grid {
			grid-template-columns: 1fr;
		}
	}
	@media (max-width: 420px) {
		.overview {
			grid-template-columns: 1fr;
		}
		.overview > div {
			grid-template-columns: 1fr auto;
			align-items: center;
		}
		.overview strong {
			grid-column: 2;
			grid-row: 1 / 3;
			margin: 0;
		}
		.metric-note {
			grid-column: 1;
		}
		.panel-heading {
			padding: 1rem;
			flex-wrap: wrap;
		}
		.category-filters {
			padding-inline: 1rem;
		}
		.category-filters button {
			padding: 0.5rem;
		}
		.empty-state {
			padding: 2rem 1rem;
		}
		.details-label {
			display: none;
		}
	}
</style>
