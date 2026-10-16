<script lang="ts">
 import { enhance } from '$app/forms'; import type { ActionData } from './$types';
 let { form }: { form: ActionData } = $props();
</script>
<svelte:head><title>Reset password | ONUS</title></svelte:head>
<form method="POST" action="?/request" use:enhance class="panel"><h1>Reset password</h1>
<label>Account email <input name="email" type="email" autocomplete="email" value={form?.email ?? ''} required/></label><button type="submit">Send reset code</button></form>
<form method="POST" action="?/confirm" use:enhance class="panel"><h2>Enter reset code</h2>
<label>Email <input name="email" type="email" autocomplete="email" value={form?.email ?? ''} required/></label>
<label>8-digit code <input name="code" inputmode="numeric" pattern="[0-9]{8}" required/></label>
<label>New password <input name="password" type="password" minlength="12" autocomplete="new-password" required/></label>
<button type="submit">Set new password</button>{#if form?.error}<p role="alert" class="error">{form.error}</p>{/if}
{#if form?.message}<p role="status">{form.message}</p>{/if}<p><a href="/login">Back to login</a></p></form>
