<script lang="ts">
 import { enhance } from '$app/forms'; import type { ActionData } from './$types';
 let { form }: { form: ActionData } = $props();
</script>
<svelte:head><title>Log in | ONUS</title></svelte:head>
<form method="POST" use:enhance class="panel"><h1>Welcome back</h1>
<label>Email <input type="email" name="email" autocomplete="email" required value={form?.email ?? ''}/></label>
<label>Password <input type="password" name="password" autocomplete="current-password" required/></label>
{#if form?.error}<p class="error" role="alert">{form.error}</p>{/if}<button type="submit">Log in</button>
<p><a href="/reset">Forgot password?</a> · <a href="/signup">Create account</a></p></form>
