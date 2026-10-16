<script lang="ts">
 import { enhance } from '$app/forms';
 import type { ActionData } from './$types';
 let { form }: { form: ActionData } = $props();
</script>
<svelte:head><title>Sign up | ONUS</title></svelte:head>
<form method="POST" use:enhance class="panel"><h1>Create an account</h1><p>Start managing construction work with ONUS.</p>
<label>Name <input name="name" autocomplete="name" required value={form?.name ?? ''}/></label>
<label>Work email <input type="email" name="email" autocomplete="email" required value={form?.email ?? ''}/></label>
<label>Password <input type="password" name="password" autocomplete="new-password" minlength="12" required/></label>
{#if form?.error}<p class="error" role="alert">{form.error}</p>{/if}
<button type="submit">Create account</button><p>Already registered? <a href="/login">Log in</a></p></form>
