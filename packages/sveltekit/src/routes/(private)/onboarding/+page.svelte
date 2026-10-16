<script lang="ts">import { enhance } from '$app/forms'; import type { ActionData } from './$types'; let { form }: { form: ActionData } = $props();</script>
<main style="max-width:32rem;margin:5rem auto;font-family:system-ui"><h1>Create your organisation</h1><p>Set up the company workspace you will manage in ONUS.</p>
<form method="POST" use:enhance><label>Organisation name <input name="name" minlength="2" maxlength="120" required/></label>
<button>Create workspace</button>{#if form?.error}<p role="alert">{form.error}</p>{/if}</form></main>
