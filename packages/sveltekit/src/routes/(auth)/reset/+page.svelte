<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	let { form }: { form: ActionData } = $props();
</script>

<svelte:head><title>Reset password | ONUS</title></svelte:head>

<div class="panel">
	<header class="form-heading">
		<p class="form-kicker">Account recovery</p>
		<h1>A fresh start.</h1>
		<p class="form-description">
			Request a reset code, then use it below to choose a new password.
		</p>
	</header>
	{#if form?.error}<p class="error" role="alert">{form.error}</p>{/if}
	{#if form?.message}<p class="notice" role="status">{form.message}</p>{/if}
	<form
		method="POST"
		action="?/request"
		use:enhance
		class="panel"
		aria-label="Request a reset code"
	>
		<label
			>Account email
			<input
				name="email"
				type="email"
				autocomplete="email"
				placeholder="you@company.com"
				value={form?.email ?? ''}
				required
			/>
		</label>
		<button class="secondary" type="submit">Send reset code</button>
	</form>
</div>
<hr class="form-divider" />
<form method="POST" action="?/confirm" use:enhance class="panel" aria-label="Set a new password">
	<h2 class="section-heading">Already have your code?</h2>
	<label
		>Email address
		<input name="email" type="email" autocomplete="email" value={form?.email ?? ''} required />
	</label>
	<label
		>8-digit reset code
		<input
			class="code-input"
			name="code"
			autocomplete="one-time-code"
			inputmode="numeric"
			pattern={'[0-9]{8}'}
			minlength="8"
			maxlength="8"
			required
		/>
	</label>
	<div>
		<label
			>New password
			<input
				name="password"
				type="password"
				minlength="12"
				maxlength="256"
				autocomplete="new-password"
				aria-describedby="password-hint"
				required
			/>
		</label>
		<p class="field-hint" id="password-hint">
			At least 12 characters. Your previous sessions will be signed out.
		</p>
	</div>
	<button type="submit">Set new password <span aria-hidden="true">&rarr;</span></button>
	<p class="form-links"><a href="/login">Back to log in</a></p>
</form>
