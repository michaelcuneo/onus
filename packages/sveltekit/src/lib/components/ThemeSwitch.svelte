<script lang="ts">
	import { onMount } from 'svelte';

	type Preference = 'system' | 'light' | 'dark';
	let preference = $state<Preference>('system');
	let error = $state('');
	const valid = (value: string | null | undefined): value is Preference =>
		value === 'system' || value === 'light' || value === 'dark';

	function apply(value: Preference) {
		preference = value;
		document.documentElement.dataset.themePreference = value;
		document.documentElement.dataset.theme =
			value === 'system'
				? matchMedia('(prefers-color-scheme: dark)').matches
					? 'dark'
					: 'light'
				: value;
		document.documentElement.style.colorScheme = value === 'system' ? 'light dark' : value;
	}

	function change() {
		apply(preference);
		try {
			localStorage.setItem('onus-theme', preference);
			error = '';
		} catch (cause) {
			console.warn('Unable to save ONUS theme preference', cause);
			error = 'Theme changed, but this browser could not save your preference.';
		}
	}

	onMount(() => {
		const initial = document.documentElement.dataset.themePreference;
		apply(valid(initial) ? initial : 'system');
		const sync = (event: StorageEvent) => {
			if (event.key === 'onus-theme' || event.key === null) {
				apply(valid(event.newValue) ? event.newValue : 'system');
			}
		};
		window.addEventListener('storage', sync);
		const media = matchMedia('(prefers-color-scheme: dark)');
		const followSystem = () => {
			if (preference === 'system') apply('system');
		};
		media.addEventListener('change', followSystem);
		return () => {
			window.removeEventListener('storage', sync);
			media.removeEventListener('change', followSystem);
		};
	});
</script>

<div class="theme-switch">
	<label>
		<span>Theme</span>
		<select aria-label="Colour theme" bind:value={preference} onchange={change}>
			<option value="system">System</option>
			<option value="light">Light</option>
			<option value="dark">Dark</option>
		</select>
	</label>
	{#if error}<span class="theme-error" role="status">{error}</span>{/if}
</div>

<style>
	.theme-switch {
		font:
			500 0.75rem/1.5 system-ui,
			sans-serif;
	}
	label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	select {
		font: inherit;
		color: inherit;
		background: transparent;
		border: 1px solid currentColor;
		border-radius: 0.4rem;
		padding: 0.45rem 0.5rem;
		cursor: pointer;
		max-width: 100%;
	}
	option {
		color: CanvasText;
		background: Canvas;
	}
	select:focus-visible {
		outline: 2px solid #46a780;
		outline-offset: 3px;
	}
	.theme-error {
		display: block;
		max-width: 18rem;
		margin-top: 0.5rem;
	}
	@media (max-width: 600px) {
		label > span {
			display: none;
		}
	}
</style>
