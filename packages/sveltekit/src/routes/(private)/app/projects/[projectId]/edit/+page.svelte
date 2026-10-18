<script lang="ts">
	import ProjectForm from '#lib/components/ProjectForm.svelte';
	import type { PageData, ActionData } from './$types';
	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head><title>Edit {data.project.name} | ONUS</title></svelte:head>
<a class="back-link" href={'/app/projects/' + data.project.id}>&larr; Back to project</a>
<div class="page-heading">
	<div>
		<p class="eyebrow">Keep the details current</p>
		<h1>Edit project.</h1>
		<p class="intro">{data.project.name}</p>
	</div>
</div>
<ProjectForm
	initial={form?.values ?? data.project}
	version={form?.version ?? data.project.version}
	error={form?.error}
	cancelHref={'/app/projects/' + data.project.id}
	submitLabel="Save changes"
/>
