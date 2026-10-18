<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	let { form }: { form: ActionData } = $props();
</script>

<svelte:head><title>Log in | ONUS</title></svelte:head>

<form method="POST" use:enhance class="panel">
	<header class="form-heading">
		<p class="form-kicker">Your project workspace</p>
		<h1>Welcome back.</h1>
		<p class="form-description">Log in to your ONUS account to pick up where you left off.</p>
	</header>
	<label
		>Email address
		<input
			type="email"
			name="email"
			autocomplete="email"
			placeholder="you@company.com"
			required
			value={form?.email ?? ''}
		/>
	</label>
	<div>
		<div class="label-row">
			<label for="password">Password</label>
			<a href="/reset">Forgot password?</a>
		</div>
		<input id="password" type="password" name="password" autocomplete="current-password" required />
	</div>
	{#if form?.error}<p class="error" role="alert">{form.error}</p>{/if}
	<button type="submit">Log in to ONUS <span aria-hidden="true">&rarr;</span></button>
	<p class="form-links">New to ONUS? <a href="/signup">Create an account</a></p>
	<p class="form-links">
		<a href={'/verify?email=' + encodeURIComponent(form?.email ?? '')}>Verify your email address</a>
	</p>
</form>
