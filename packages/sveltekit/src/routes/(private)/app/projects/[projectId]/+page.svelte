<script lang="ts">
	import { enhance } from '$app/forms';
	import { projectStatusLabels } from '#lib/projects.ts';
	import type { PageData, ActionData } from './$types';
	let { data, form }: { data: PageData; form: ActionData } = $props();
	let confirmingArchive = $state(false);
	let saving = $state(false);
	const date = (value: string) => (value ? value.slice(0, 10) : 'Not set');
</script>

<svelte:head><title>{data.project.name} | ONUS</title></svelte:head>
<a class="back-link" href="/app/projects">&larr; All projects</a>
<div class="page-heading">
	<div>
		<p class="eyebrow">{data.project.reference || 'Project overview'}</p>
		<h1>{data.project.name}</h1>
		<p class="intro">
			{data.project.client || 'Client not set'} &middot; {data.project.location ||
				'Location not set'}
		</p>
	</div>
	<div class="actions">
		<span class="badge" class:archived={Boolean(data.project.archivedAt)}
			>{data.project.archivedAt ? 'Archived' : projectStatusLabels[data.project.status]}</span
		>{#if data.canManage && !data.project.archivedAt}<a
				class="button"
				href={'/app/projects/' + data.project.id + '/edit'}>Edit project</a
			>{/if}
	</div>
</div>
{#if form?.error}<p class="error" role="alert">{form.error}</p>{/if}
{#if form && 'message' in form}<p class="notice" role="status">{form.message}</p>{/if}
{#if data.project.archivedAt}<p class="notice">
		This project was archived on {date(data.project.archivedAt)}. Details and membership are
		retained. Restore it to make changes.
	</p>{/if}
<div class="detail-grid">
	<section class="card" aria-labelledby="details-heading">
		<h2 id="details-heading">Project details</h2>
		<dl>
			<div>
				<dt>Reference</dt>
				<dd>{data.project.reference || 'Not set'}</dd>
			</div>
			<div>
				<dt>Status</dt>
				<dd>{projectStatusLabels[data.project.status]}</dd>
			</div>
			<div>
				<dt>Client</dt>
				<dd>{data.project.client || 'Not set'}</dd>
			</div>
			<div>
				<dt>Location</dt>
				<dd>{data.project.location || 'Not set'}</dd>
			</div>
			<div>
				<dt>Start date</dt>
				<dd>{date(data.project.startDate)}</dd>
			</div>
			<div>
				<dt>Target completion</dt>
				<dd>{date(data.project.targetDate)}</dd>
			</div>
		</dl>
		<h2 class="description-heading">About this project</h2>
		<p class="description">{data.project.description || 'No description added yet.'}</p>
	</section>
	<aside class="card" aria-label="Project access">
		<h2>Private to project members.</h2>
		<p>
			Only explicitly assigned members of this organisation can access this project. Organisation
			ownership alone does not grant access.
		</p>
		<span class="badge">{data.canManage ? 'You can manage this project' : 'Read-only access'}</span>
		<p>Member assignment tools are not available yet. The creator is assigned automatically.</p>
		<dl>
			<div>
				<dt>Created</dt>
				<dd>{date(data.project.createdAt)}</dd>
			</div>
			<div>
				<dt>Updated</dt>
				<dd>{date(data.project.updatedAt)}</dd>
			</div>
		</dl>
	</aside>
</div>
<section class="card next-section">
	<h2>The foundation is ready.</h2>
	<p>
		Project details and access are live. RFI workflows, tasks and connected applications will be
		added next.
	</p>
</section>
{#if data.canManage}
	<section class="card archive-section" aria-labelledby="archive-heading">
		<div>
			<h2 id="archive-heading">
				{data.project.archivedAt ? 'Restore project' : 'Archive project'}
			</h2>
			<p>
				{data.project.archivedAt
					? 'Return this project to your current project list.'
					: 'Remove it from the current project list without deleting its details or membership.'}
			</p>
		</div>
		<form
			method="POST"
			action={data.project.archivedAt ? '?/restore' : '?/archive'}
			use:enhance={() => {
				saving = true;
				return async ({ update }) => {
					try {
						await update();
						confirmingArchive = false;
					} finally {
						saving = false;
					}
				};
			}}
		>
			<input type="hidden" name="version" value={data.project.version} />
			{#if data.project.archivedAt}
				<button class="button secondary" type="submit" disabled={saving}
					>{saving ? 'Restoring…' : 'Restore project'}</button
				>
			{:else if confirmingArchive}
				<p class="confirm-copy">Archive this project?</p>
				<div class="actions">
					<button class="button danger" type="submit" disabled={saving}
						>{saving ? 'Archiving…' : 'Confirm archive'}</button
					><button
						class="button secondary"
						type="button"
						onclick={() => (confirmingArchive = false)}
						disabled={saving}>Cancel</button
					>
				</div>
			{:else}
				<button class="button danger" type="button" onclick={() => (confirmingArchive = true)}
					>Archive project</button
				>
			{/if}
		</form>
	</section>
{/if}

<style>
	.detail-grid {
		display: grid;
		grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
		gap: 1.3rem;
	}
	dl {
		margin: 1rem 0 0;
	}
	dl div {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 1rem;
		border-bottom: 1px solid #e5ece7;
		padding: 0.8rem 0;
		font-size: 0.8rem;
	}
	dt {
		color: #61746f;
		flex-shrink: 0;
	}
	dd {
		text-align: right;
		margin: 0;
		overflow-wrap: anywhere;
		min-width: 0;
	}
	.description-heading {
		margin-top: 1.8rem;
	}
	.description {
		white-space: pre-wrap;
		overflow-wrap: anywhere;
	}
	.card p {
		color: #61746f;
		font-size: 0.8rem;
		line-height: 1.9;
	}
	.next-section {
		margin-top: 1.3rem;
		background: #edf5ef;
	}
	.archive-section {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 2rem;
		margin-top: 1.3rem;
	}
	.archive-section p {
		margin-bottom: 0;
	}
	.archive-section form {
		flex-shrink: 0;
	}
	.confirm-copy {
		margin: 0 0 0.6rem !important;
	}
	@media (max-width: 760px) {
		.detail-grid {
			grid-template-columns: 1fr;
		}
		.archive-section {
			flex-direction: column;
			align-items: flex-start;
			gap: 1rem;
		}
	}
</style>
