<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head><title>Verify email | ONUS</title></svelte:head>

<form method="POST" action="?/verify" use:enhance class="panel">
	<header class="form-heading">
		<p class="form-kicker">One quick check</p>
		<h1>Check your inbox.</h1>
		<p class="form-description">
			Enter the 8-digit verification code sent to your email to activate your account.
		</p>
	</header>
	<label
		>Email address
		<input
			type="email"
			name="email"
			autocomplete="email"
			value={form?.email ?? data.email}
			required
		/>
	</label>
	<div>
		<label
			>Verification code
			<input
				class="code-input"
				name="code"
				autocomplete="one-time-code"
				inputmode="numeric"
				pattern={'[0-9]{8}'}
				required
				minlength="8"
				maxlength="8"
				aria-describedby="code-hint"
			/>
		</label>
		<p class="field-hint" id="code-hint">Codes expire after 15 minutes.</p>
	</div>
	{#if form?.error}<p class="error" role="alert">{form.error}</p>{/if}
	{#if form?.message}<p class="notice" role="status">{form.message}</p>{/if}
	<button type="submit">Verify account <span aria-hidden="true">&rarr;</span></button>
	<button class="secondary" type="submit" formaction="?/resend" formnovalidate
		>Send a new code</button
	>
	<p class="form-links"><a href="/login">Back to log in</a></p>
</form>
