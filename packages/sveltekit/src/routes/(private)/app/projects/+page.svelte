<script lang="ts">
	import { projectStatusLabels } from '#lib/projects.ts';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	let search = $state('');
	let filter = $state('current');
	const filtered = $derived(
		data.projects.filter(
			(project) =>
				(filter === 'all' ||
					(filter === 'archived' ? Boolean(project.archivedAt) : !project.archivedAt)) &&
				`${project.name} ${project.reference} ${project.client} ${project.location}`
					.toLowerCase()
					.includes(search.trim().toLowerCase())
		)
	);
</script>

<svelte:head><title>Projects | {data.organisation.organisationName} | ONUS</title></svelte:head>
<div class="page-heading">
	<div>
		<p class="eyebrow">Your project portfolio</p>
		<h1>Projects.</h1>
		<p class="intro">The projects you have been assigned to, all in one place.</p>
	</div>
	{#if data.canCreate}<a class="button" href="/app/projects/new">Create project &rarr;</a>{/if}
</div>
<div class="filters card">
	<label class="field"
		>Search projects <input
			type="search"
			bind:value={search}
			placeholder="Name, reference, client or location"
		/></label
	>
	<label class="field"
		>Show <select bind:value={filter}
			><option value="current">Current projects</option><option value="archived"
				>Archived projects</option
			><option value="all">All projects</option></select
		></label
	>
</div>
<p class="results" role="status">
	{filtered.length}
	{filtered.length === 1 ? 'project' : 'projects'} shown
</p>
{#if filtered.length}
	<div class="project-grid">
		{#each filtered as project (project.id)}
			<a class="project-card card" href={'/app/projects/' + project.id}>
				<div class="card-top">
					<span class="reference">{project.reference || 'No reference'}</span><span
						class="badge"
						class:archived={Boolean(project.archivedAt)}
						>{project.archivedAt ? 'Archived' : projectStatusLabels[project.status]}</span
					>
				</div>
				<h2>{project.name}</h2>
				<p>
					{project.client || 'Client not set'} &middot; {project.location || 'Location not set'}
				</p>
				<div class="card-bottom">
					<span>{project.targetDate ? `Target: ${project.targetDate}` : 'Target date not set'}</span
					><span aria-hidden="true">&nearr;</span>
				</div>
			</a>
		{/each}
	</div>
{:else}
	<div class="card empty-state">
		<h2>
			{data.projects.length ? 'No projects match this view.' : 'Your next project starts here.'}
		</h2>
		<p>
			{data.projects.length
				? 'Try another search or switch between current and archived projects.'
				: 'No projects are assigned to you yet. Projects are private to their members, including organisation administrators.'}
		</p>
		{#if data.canCreate && !data.projects.length}<a class="button" href="/app/projects/new"
				>Create your first project</a
			>{/if}
	</div>
{/if}

<style>
	.filters {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 14rem;
		gap: 1rem;
	}
	.results {
		color: #61746f;
		font-size: 0.75rem;
		margin: 1.2rem 0;
	}
	.project-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
	}
	.project-card {
		display: flex;
		flex-direction: column;
		text-decoration: none;
		color: inherit;
		transition:
			border-color 0.15s,
			box-shadow 0.15s;
	}
	.project-card:hover {
		border-color: #86b59a;
		box-shadow: 0 4px 18px #163a2210;
	}
	.card-top {
		display: flex;
		gap: 0.8rem;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1.5rem;
	}
	.reference {
		color: #61746f;
		font-size: 0.65rem;
		overflow-wrap: anywhere;
	}
	.project-card h2 {
		overflow-wrap: anywhere;
	}
	.project-card p {
		font-size: 0.8rem;
		color: #61746f;
		line-height: 1.8;
		overflow-wrap: anywhere;
		margin-bottom: 1.5rem;
	}
	.card-bottom {
		display: flex;
		justify-content: space-between;
		gap: 0.5rem;
		border-top: 1px solid #e3ebe5;
		padding-top: 1rem;
		margin-top: auto;
		color: #386b4a;
		font-size: 0.7rem;
	}
	@media (max-width: 1000px) {
		.project-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 600px) {
		.filters,
		.project-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
