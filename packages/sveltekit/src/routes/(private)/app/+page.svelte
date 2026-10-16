<script lang="ts">import type { PageData } from './$types'; let { data }: { data: PageData } = $props();</script>
<svelte:head><title>Workspace | ONUS</title></svelte:head>
<main style="max-width:72rem;margin:3rem auto;padding:1rem;font-family:system-ui"><header><strong>ONUS RFI</strong> <form method="POST" action="/logout" style="float:right"><button>Sign out</button></form></header>
<h1>{data.organisation.organisationName}</h1><p>Role: {data.organisation.role}</p>
<h2>Daily WIP</h2><p>Your workspace is ready. Project, RFI and integration modules will connect here.</p></main>
