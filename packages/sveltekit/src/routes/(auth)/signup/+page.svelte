<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	let { form }: { form: ActionData } = $props();
</script>

<svelte:head><title>Sign up | ONUS</title></svelte:head>

<form method="POST" use:enhance class="panel">
	<header class="form-heading">
		<p class="form-kicker">Get started with ONUS</p>
		<h1>Make room for clarity.</h1>
		<p class="form-description">
			Create your account. Then set up a workspace for your organisation.
		</p>
	</header>
	<label
		>Your name
		<input
			name="name"
			autocomplete="name"
			placeholder="Alex Morgan"
			minlength="2"
			maxlength="120"
			required
			value={form?.name ?? ''}
		/>
	</label>
	<label
		>Work email
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
		<label
			>Password
			<input
				type="password"
				name="password"
				autocomplete="new-password"
				minlength="12"
				maxlength="256"
				aria-describedby="password-hint"
				required
			/>
		</label>
		<p class="field-hint" id="password-hint">
			Use at least 12 characters. A longer passphrase works well.
		</p>
	</div>
	{#if form?.error}<p class="error" role="alert">{form.error}</p>{/if}
	<button type="submit">Create account <span aria-hidden="true">&rarr;</span></button>
	<p class="form-links">Already have an account? <a href="/login">Log in</a></p>
	<p class="form-links">
		<a href={'/verify?email=' + encodeURIComponent(form?.email ?? '')}
			>Already signed up? Verify your email</a
		>
	</p>
</form>
