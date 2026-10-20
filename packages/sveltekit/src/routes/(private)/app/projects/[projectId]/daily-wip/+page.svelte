<script lang="ts">
  let { data } = $props();
</script>

<svelte:head>
  <title>Daily WIP | ONUS</title>
</svelte:head>

<section>
  <h1>Daily WIP — {data.project.name}</h1>
  <p>Project work requiring review. Records are read from the project's workflow table.</p>

  <h2>Outstanding work ({data.workItems.length})</h2>
  {#if data.workItems.length}
    <ul>
      {#each data.workItems as item (item.sk)}
        <li><strong>{String(item.title ?? item.id ?? item.sk)}</strong> — {String(item.status ?? 'Unspecified')}</li>
      {/each}
    </ul>
  {:else}
    <p>No workflow work items recorded yet.</p>
  {/if}

  <h2>Proposed actions ({data.proposedActions.length})</h2>
  {#if data.proposedActions.length}
    <ul>
      {#each data.proposedActions as action (action.sk)}
        <li><strong>{String(action.title ?? action.id ?? action.sk)}</strong> — {String(action.status ?? 'Unspecified')}</li>
      {/each}
    </ul>
  {:else}
    <p>No actions proposed yet.</p>
  {/if}

  <h2>Recent events ({data.events.length})</h2>
  {#if data.events.length}
    <ul>
      {#each data.events as event (event.sk)}
        <li>{String(event.title ?? event.id ?? event.sk)}</li>
      {/each}
    </ul>
  {:else}
    <p>No events recorded yet.</p>
  {/if}
</section>
