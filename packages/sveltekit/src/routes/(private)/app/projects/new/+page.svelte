<script lang="ts">
	import ProjectForm from '#lib/components/ProjectForm.svelte';
	import type { ActionData } from './$types';
	let { form }: { form: ActionData } = $props();
</script>

<svelte:head><title>Create project | ONUS</title></svelte:head>
<a class="back-link" href="/app/projects">&larr; All projects</a>
<div class="page-heading">
	<div>
		<p class="eyebrow">Start with the essentials</p>
		<h1>Create a project.</h1>
		<p class="intro">A home for the details, decisions and work ahead.</p>
	</div>
</div>
<ProjectForm
	initial={form?.values}
	error={form?.error}
	cancelHref="/app/projects"
	submitLabel="Create project"
/>
