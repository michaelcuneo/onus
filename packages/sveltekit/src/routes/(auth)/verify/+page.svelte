<script lang="ts">
 import { enhance } from '$app/forms'; import type { PageData, ActionData } from './$types';
 let { data, form }: { data: PageData; form: ActionData } = $props();
</script>
<svelte:head><title>Verify email | ONUS</title></svelte:head>
<form method="POST" use:enhance class="panel"><h1>Verify your email</h1><p>Enter the 8-digit code sent to your email.</p>
<label>Email <input type="email" name="email" value={form?.email ?? data.email} required/></label>
<label>Verification code <input name="code" inputmode="numeric" pattern="[0-9]{8}" required maxlength="8"/></label>
{#if form?.error}<p class="error" role="alert">{form.error}</p>{/if}
{#if form?.message}<p role="status">{form.message}</p>{/if}
<button type="submit">Verify account</button><button type="submit" formaction="?/resend" formnovalidate>Resend code</button>
<p><a href="/login">Back to login</a></p></form>
