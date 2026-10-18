<script lang="ts">
	import type { LayoutProps } from './$types';
	let { children }: LayoutProps = $props();
</script>

<div class="project-tools">{@render children()}</div>

<style>
	.project-tools :global(a:focus-visible),
	.project-tools :global(button:focus-visible) {
		outline: 2px solid #46a780;
		outline-offset: 4px;
	}
	.project-tools :global(.page-heading) {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1.5rem;
		margin-bottom: 2rem;
	}
	.project-tools :global(.eyebrow) {
		color: var(--green);
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		margin: 0 0 0.5rem;
	}
	.project-tools :global(h1) {
		font-size: clamp(1.8rem, 4vw, 2.7rem);
		font-weight: 600;
		letter-spacing: -0.045em;
		line-height: 1.2;
		margin: 0;
		overflow-wrap: anywhere;
	}
	.project-tools :global(h2) {
		font-size: 1.1rem;
		font-weight: 650;
		letter-spacing: -0.02em;
		margin: 0;
	}
	.project-tools :global(.intro) {
		color: var(--muted);
		font-size: 0.85rem;
		margin: 0.7rem 0 0;
	}
	.project-tools :global(.button) {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		text-decoration: none;
		background: var(--green);
		color: #fff;
		border: 1px solid var(--green);
		border-radius: 0.45rem;
		padding: 0.75rem 1.1rem;
		font: inherit;
		font-size: 0.8rem;
		font-weight: 600;
		cursor: pointer;
	}
	.project-tools :global(.button:hover) {
		background: #10543f;
	}
	.project-tools :global(.button.secondary) {
		color: var(--green);
		background: #fff;
		border-color: #bacdc0;
	}
	.project-tools :global(.button.danger) {
		color: #943e32;
		border-color: #dcb6ad;
		background: #fff;
	}
	.project-tools :global(button:disabled) {
		opacity: 0.6;
		cursor: wait;
	}
	.project-tools :global(.card) {
		background: #fff;
		border: 1px solid #dce5df;
		border-radius: 0.7rem;
		padding: 1.5rem;
		min-width: 0;
	}
	.project-tools :global(.error),
	.project-tools :global(.notice) {
		background: #fff0ec;
		border: 1px solid #efc2bb;
		color: #923e32;
		border-radius: 0.5rem;
		padding: 0.9rem 1rem;
		font-size: 0.8rem;
		margin: 0 0 1.5rem;
	}
	.project-tools :global(.notice) {
		background: #eaf5ef;
		border-color: #b9d8c8;
		color: #205d48;
	}
	.project-tools :global(.back-link) {
		display: inline-block;
		font-size: 0.75rem;
		color: var(--green);
		text-underline-offset: 3px;
		margin-bottom: 1.3rem;
	}
	.project-tools :global(.badge) {
		display: inline-block;
		border-radius: 1rem;
		padding: 0.25rem 0.7rem;
		color: #346b4b;
		background: #edf5ef;
		font-size: 0.65rem;
		font-weight: 600;
	}
	.project-tools :global(.badge.archived) {
		color: #6b665a;
		background: #f2efe9;
	}
	.project-tools :global(.actions) {
		display: flex;
		flex-wrap: wrap;
		gap: 0.7rem;
		align-items: center;
	}
	.project-tools :global(.empty-state) {
		padding: 4rem 1.5rem;
		text-align: center;
	}
	.project-tools :global(.empty-state p) {
		color: var(--muted);
		max-width: 32rem;
		font-size: 0.85rem;
		margin: 0.8rem auto 1.5rem;
	}
	.project-tools :global(.field) {
		display: grid;
		gap: 0.45rem;
		font-size: 0.8rem;
		font-weight: 600;
	}
	.project-tools :global(input),
	.project-tools :global(textarea),
	.project-tools :global(select) {
		width: 100%;
		min-width: 0;
		border: 1px solid #bac9c0;
		border-radius: 0.4rem;
		padding: 0.75rem;
		font: inherit;
		font-size: 0.85rem;
		color: var(--ink);
		background: #fff;
	}
	.project-tools :global(input:focus-visible),
	.project-tools :global(textarea:focus-visible),
	.project-tools :global(select:focus-visible) {
		outline: 2px solid #176b53;
		outline-offset: 2px;
	}
	.project-tools :global(textarea) {
		resize: vertical;
	}
	.project-tools :global(.field-hint) {
		margin: 0.4rem 0 0;
		color: var(--muted);
		font-size: 0.7rem;
		font-weight: 400;
	}
	@media (max-width: 600px) {
		.project-tools :global(.page-heading) {
			flex-direction: column;
			align-items: flex-start;
		}
		.project-tools :global(.card) {
			padding: 1.1rem;
		}
	}
</style>
