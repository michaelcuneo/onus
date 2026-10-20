<script lang="ts">
  import type { PageData, ActionData } from './$types';
  let { data, form }: { data: PageData; form: ActionData } = $props();
  const label = (value: unknown) => String(value ?? '');
  const titleFor = (id: unknown) => data.workItems.find((item) => item.id === id)?.title ?? id;
  let busy = $state(false);
</script>

<svelte:head><title>Daily WIP | ONUS</title></svelte:head>

<main class="wip">
  <header>
    <div>
      <p class="eyebrow">PROJECT COMMAND CENTRE</p>
      <h1>Daily WIP</h1>
      <p class="muted">{data.project.name} · Issues, dependencies and decisions requiring attention</p>
    </div>
    {#if data.canManage && !data.workItems.length}
      <form method="POST" action="?/seed" onsubmit={() => busy = true}>
        <button disabled={busy} type="submit">Load demonstration scenario</button>
      </form>
    {/if}
  </header>

  {#if form?.error}<p class="notice error" role="alert">{form.error}</p>{/if}
  {#if form?.message}<p class="notice" role="status">{form.message}</p>{/if}

  <div class="metrics">
    <article><span>Outstanding work</span><strong>{data.workItems.length}</strong></article>
    <article><span>Overdue</span><strong>{data.workItems.filter((item) => item.status === 'OVERDUE').length}</strong></article>
    <article><span>Blocked</span><strong>{data.workItems.filter((item) => item.status === 'BLOCKED').length}</strong></article>
    <article><span>Awaiting decision</span><strong>{data.proposedActions.filter((item) => item.status === 'PROPOSED').length}</strong></article>
  </div>

  <section>
    <h2>Dependency chain</h2>
    {#if data.workItems.length}
      <div class="chain">
        {#each data.workItems as item (item.sk)}
          <article class="work">
            <div class="top"><span class="kind">{label(item.kind)}</span><span class="status">{label(item.status)}</span></div>
            <h3>{label(item.title ?? item.id)}</h3>
            {#if item.dependsOn}<p class="muted">Depends on: {label(titleFor(item.dependsOn))}</p>{/if}
            {#if item.dueAt}<p class="muted">Due: {new Date(label(item.dueAt)).toLocaleDateString('en-AU')}</p>{/if}
            <small>{label(item.source)}</small>
          </article>
        {/each}
      </div>
    {:else}
      <p class="muted">No workflow records yet. {data.canManage ? 'Load the demo scenario to see the connected risks.' : 'Ask a project manager to load the demonstration.'}</p>
    {/if}
  </section>

  <section>
    <h2>Recommended actions</h2>
    {#each data.proposedActions as action (action.sk)}
      <article class="recommendation">
        <div><span class="kind">{label(action.kind)}</span><h3>{label(action.title ?? action.id)}</h3><p class="muted">Related issue: {label(titleFor(action.relatedWorkId))}</p><p>Status: <strong>{label(action.status)}</strong></p></div>
        {#if action.status === 'PROPOSED' && data.canManage}
          <form method="POST" action="?/approve" onsubmit={() => busy = true}>
            <input type="hidden" name="actionId" value={label(action.id)} />
            <button type="submit" disabled={busy}>Approve follow-up</button>
          </form>
        {/if}
      </article>
    {:else}
      <p class="muted">No recommendations pending.</p>
    {/each}
    <p class="muted disclaimer">Approval records a decision only. No external message is sent by this demonstration.</p>
  </section>

  <section>
    <h2>Audit &amp; activity</h2>
    <ul class="events">
      {#each [...data.events].reverse() as event (event.sk)}
        <li><strong>{label(event.title ?? event.id)}</strong><span class="muted">{label(event.createdAt ?? event.updatedAt ?? event.status)}</span></li>
      {:else}
        <li class="muted">No activity recorded.</li>
      {/each}
    </ul>
  </section>
</main>

<style>
  .wip{max-width:1200px;margin:0 auto;padding:2rem 1rem 5rem;display:grid;gap:2rem}
  header,.recommendation{display:flex;align-items:center;justify-content:space-between;gap:1.5rem;flex-wrap:wrap}
  h1{font-size:clamp(2rem,4vw,3rem);margin:.15rem 0}h2{margin:0 0 1rem}h3{margin:.65rem 0}
  .eyebrow,.kind{font-size:.75rem;letter-spacing:.1em;font-weight:700;text-transform:uppercase}
  .eyebrow{color:#83ddba}.muted{opacity:.7}.metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1rem}
  .metrics article,.work,.recommendation,.events{border:1px solid #77889955;border-radius:12px;padding:1.2rem;background:#7788990d}
  .metrics article{display:grid;gap:.5rem}.metrics strong{font-size:2rem}.metrics span{font-size:.85rem;opacity:.8}
  .chain{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem}
  .top{display:flex;justify-content:space-between;gap:1rem}.status{font-size:.75rem;font-weight:800}
  button{border:0;border-radius:8px;background:#83ddba;color:#11271f;padding:.8rem 1rem;font-weight:700;cursor:pointer}
  button:disabled{opacity:.5;cursor:wait}.notice{padding:1rem;border:1px solid #83ddba;border-radius:8px}.error{border-color:#d77}
  .events{list-style:none;margin:0;display:grid;gap:1rem}.events li{display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap}
  .disclaimer{font-size:.85rem;margin-top:1rem}
  @media(max-width:800px){.metrics{grid-template-columns:repeat(2,minmax(0,1fr))}.chain{grid-template-columns:1fr}}
</style>
