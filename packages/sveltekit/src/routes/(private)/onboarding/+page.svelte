<script lang="ts">
	import { enhance } from '$app/forms';
	import AuthShell from '#lib/components/AuthShell.svelte';
	import type { ActionData } from './$types';
	let { form }: { form: ActionData } = $props();
</script>

<svelte:head><title>Create your workspace | ONUS</title></svelte:head>

<AuthShell>
	<form method="POST" use:enhance class="panel">
		<header class="form-heading">
			<p class="form-kicker">Your organisation</p>
			<h1>A place for your team.</h1>
			<p class="form-description">
				Set up the company workspace you will manage in ONUS. You will be its owner.
			</p>
		</header>
		<label
			>Organisation name
			<input
				name="name"
				autocomplete="organization"
				placeholder="e.g. Riverside Developments"
				minlength="2"
				maxlength="120"
				required
			/>
		</label>
		{#if form?.error}<p class="error" role="alert">{form.error}</p>{/if}
		<button type="submit">Create workspace <span aria-hidden="true">&rarr;</span></button>
	</form>
</AuthShell>
