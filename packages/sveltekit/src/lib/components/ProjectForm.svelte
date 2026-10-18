<script lang="ts">
	import { enhance } from '$app/forms';
	import { projectStatuses, projectStatusLabels, type ProjectInput } from '#lib/projects.ts';

	let {
		initial,
		version,
		error,
		cancelHref,
		submitLabel
	}: {
		initial?: ProjectInput;
		version?: number;
		error?: string;
		cancelHref: string;
		submitLabel: string;
	} = $props();
	let saving = $state(false);
</script>

<form
	method="POST"
	use:enhance={() => {
		saving = true;
		return async ({ update }) => {
			try {
				await update({ reset: false });
			} finally {
				saving = false;
			}
		};
	}}
	class="card project-form"
	aria-busy={saving}
>
	{#if error}<p class="error" role="alert">{error}</p>{/if}
	{#if version !== undefined}<input type="hidden" name="version" value={version} />{/if}
	<div class="form-heading">
		<h2>Project details</h2>
		<p>Only the name and status are required. You can add more detail later.</p>
	</div>
	<label class="field"
		>Project name <input
			name="name"
			value={initial?.name ?? ''}
			required
			minlength="2"
			maxlength="120"
			placeholder="e.g. Riverside development"
		/></label
	>
	<div class="field-grid">
		<label class="field"
			>Project reference <input
				name="reference"
				value={initial?.reference ?? ''}
				maxlength="40"
				placeholder="e.g. RIV-001"
			/></label
		>
		<label class="field"
			>Status <select name="status" value={initial?.status ?? 'PLANNING'}
				>{#each projectStatuses as status (status)}<option value={status}
						>{projectStatusLabels[status]}</option
					>{/each}</select
			></label
		>
		<label class="field"
			>Client <input name="client" value={initial?.client ?? ''} maxlength="120" /></label
		>
		<label class="field"
			>Location <input name="location" value={initial?.location ?? ''} maxlength="240" /></label
		>
		<label class="field"
			>Start date <input
				name="startDate"
				type="date"
				min="0001-01-01"
				max="9999-12-31"
				value={initial?.startDate ?? ''}
			/></label
		>
		<label class="field"
			>Target completion <input
				name="targetDate"
				type="date"
				min="0001-01-01"
				max="9999-12-31"
				value={initial?.targetDate ?? ''}
			/></label
		>
	</div>
	<label class="field"
		>Description <textarea
			name="description"
			rows="5"
			maxlength="4000"
			value={initial?.description ?? ''}></textarea></label
	>
	<p class="field-hint">
		Access is restricted to explicitly assigned project members. Creating a project assigns you as
		its manager; it does not share it with your whole organisation.
	</p>
	<div class="actions">
		<button class="button" type="submit" disabled={saving}
			>{saving ? 'Saving…' : submitLabel}</button
		><a class="button secondary" href={cancelHref}>Cancel</a>
	</div>
</form>

<style>
	.project-form {
		max-width: 52rem;
		display: grid;
		gap: 1.3rem;
	}
	.form-heading p {
		color: #61746f;
		font-size: 0.8rem;
		margin: 0.5rem 0 0;
	}
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1.2rem;
	}
	@media (max-width: 600px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
