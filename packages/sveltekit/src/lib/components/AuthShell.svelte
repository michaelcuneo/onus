<script lang="ts">
	import type { Snippet } from 'svelte';
	import Brand from './Brand.svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="auth-shell">
	<aside class="story" aria-label="About ONUS">
		<Brand />
		<div class="story-content">
			<p class="eyebrow">Built for the client-side perspective</p>
			<h2>Less chasing.<br />More clarity.</h2>
			<p class="story-description">
				A clearer view of your projects, the people responsible, and what needs to happen next.
			</p>
			<div class="principles">
				<div>
					<span>01</span>
					<p>Connect the software.</p>
				</div>
				<div>
					<span>02</span>
					<p>Coordinate the work.</p>
				</div>
				<div>
					<span>03</span>
					<p>Prepare the decisions.</p>
				</div>
			</div>
		</div>
		<p class="story-footer">Project accountability. From the ground up.</p>
	</aside>
	<main class="auth-main">
		<div class="form-container">
			{@render children()}
		</div>
		<p class="form-footer">ONUS / Construction workflow &amp; accountability</p>
	</main>
</div>

<style>
	:global(body:has(.auth-shell)) {
		margin: 0;
		background: #f6f8f7;
	}
	.auth-shell {
		--ink: #172d35;
		--muted: #5b6d72;
		--green: #176b53;
		min-height: 100svh;
		display: grid;
		grid-template-columns: minmax(320px, 44%) minmax(0, 1fr);
		font-family:
			Inter,
			ui-sans-serif,
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			sans-serif;
		color: var(--ink);
		line-height: 1.5;
	}
	.auth-shell :global(*) {
		box-sizing: border-box;
	}
	.story {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: clamp(2rem, 5vw, 5rem);
		background: radial-gradient(ellipse at 0 100%, #1a5147 0, transparent 65%), #102a33;
		color: #f3f8f6;
	}
	.story-content {
		padding: 4rem 0;
		max-width: 28rem;
	}
	.eyebrow {
		font-size: 0.68rem;
		font-weight: 650;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: #95c5b6;
	}
	h2 {
		margin: 1.3rem 0;
		font-size: clamp(2.6rem, 4.2vw, 4.2rem);
		line-height: 1.08;
		letter-spacing: -0.055em;
		font-weight: 600;
	}
	.story-description {
		max-width: 23rem;
		color: #c1d3d2;
		font-size: 1rem;
		line-height: 1.8;
	}
	.principles {
		margin-top: 2.5rem;
	}
	.principles div {
		display: flex;
		align-items: baseline;
		gap: 1rem;
		border-top: 1px solid #ffffff1a;
		padding: 0.85rem 0;
	}
	.principles span {
		color: #83ddba;
		font-size: 0.7rem;
		font-variant-numeric: tabular-nums;
	}
	.principles p {
		margin: 0;
		font-size: 0.9rem;
	}
	.story-footer {
		margin: 0;
		color: #95b4b2;
		font-size: 0.73rem;
	}
	.auth-main {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 3rem 2rem 1.5rem;
	}
	.form-container {
		width: 100%;
		max-width: 27rem;
		margin: auto 0;
		padding: 2rem 0;
	}
	.form-footer {
		margin: 2rem 0 0;
		color: #697b7f;
		font-size: 0.7rem;
		text-align: center;
	}
	.auth-shell :global(.panel) {
		display: grid;
		gap: 1.3rem;
		width: 100%;
		margin: 0;
	}
	.auth-shell :global(.form-heading) {
		margin-bottom: 0.5rem;
	}
	.auth-shell :global(.form-kicker) {
		margin: 0 0 0.6rem;
		color: var(--green);
		text-transform: uppercase;
		font-size: 0.68rem;
		font-weight: 750;
		letter-spacing: 0.13em;
	}
	.auth-shell :global(h1) {
		margin: 0;
		font-size: clamp(1.8rem, 3vw, 2.25rem);
		line-height: 1.2;
		letter-spacing: -0.045em;
		font-weight: 650;
	}
	.auth-shell :global(.form-description) {
		margin: 0.8rem 0 0;
		color: var(--muted);
		font-size: 0.9rem;
		line-height: 1.7;
	}
	.auth-shell :global(label) {
		display: grid;
		gap: 0.5rem;
		font-size: 0.8rem;
		font-weight: 650;
	}
	.auth-shell :global(input) {
		width: 100%;
		min-width: 0;
		min-height: 3.1rem;
		border: 1px solid #bac9c6;
		border-radius: 0.5rem;
		padding: 0.8rem 0.95rem;
		background: #fff;
		color: var(--ink);
		font: inherit;
		font-weight: 400;
		transition:
			border-color 0.15s,
			box-shadow 0.15s;
	}
	.auth-shell :global(input::placeholder) {
		color: #73868a;
	}
	.auth-shell :global(input:focus-visible) {
		outline: 2px solid var(--green);
		outline-offset: 2px;
		border-color: var(--green);
	}
	.auth-shell :global(button) {
		min-height: 3rem;
		border: 1px solid transparent;
		border-radius: 0.5rem;
		padding: 0.8rem 1rem;
		background: var(--green);
		color: #fff;
		font: inherit;
		font-size: 0.85rem;
		font-weight: 650;
		cursor: pointer;
		transition: background 0.15s;
	}
	.auth-shell :global(button:hover) {
		background: #10543f;
	}
	.auth-shell :global(button.secondary) {
		background: transparent;
		border-color: #bac9c6;
		color: var(--ink);
	}
	.auth-shell :global(button.secondary:hover) {
		background: #e7eeeb;
	}
	.auth-shell :global(a:focus-visible),
	.auth-shell :global(button:focus-visible) {
		outline: 2px solid #278565;
		outline-offset: 4px;
	}
	.auth-shell :global(.panel a) {
		color: var(--green);
		text-underline-offset: 3px;
		font-weight: 600;
	}
	.auth-shell :global(.label-row) {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		align-items: baseline;
		margin-bottom: 0.5rem;
		font-size: 0.8rem;
	}
	.auth-shell :global(.label-row label) {
		display: block;
	}
	.auth-shell :global(.label-row a) {
		font-size: 0.75rem;
	}
	.auth-shell :global(.field-hint) {
		margin: 0.45rem 0 0;
		color: var(--muted);
		font-size: 0.75rem;
	}
	.auth-shell :global(.form-links) {
		text-align: center;
		margin: 0.35rem 0 0;
		color: var(--muted);
		font-size: 0.8rem;
	}
	.auth-shell :global(.error),
	.auth-shell :global(.notice) {
		margin: 0;
		border: 1px solid #efc2bb;
		border-radius: 0.5rem;
		padding: 0.8rem 1rem;
		color: #923e32;
		background: #fff0ec;
		font-size: 0.8rem;
		line-height: 1.6;
		overflow-wrap: anywhere;
	}
	.auth-shell :global(.notice) {
		color: #205d48;
		background: #eaf5ef;
		border-color: #b9d8c8;
	}
	.auth-shell :global(.code-input) {
		letter-spacing: 0.3em;
		font-variant-numeric: tabular-nums;
	}
	.auth-shell :global(.form-divider) {
		border: 0;
		border-top: 1px solid #d4dfdb;
		width: 100%;
		margin: 1.8rem 0;
	}
	.auth-shell :global(.section-heading) {
		margin: 0;
		font-size: 1.05rem;
		letter-spacing: -0.02em;
	}
	@media (max-width: 800px) {
		.auth-shell {
			grid-template-columns: minmax(0, 1fr);
			grid-template-rows: auto 1fr;
		}
		.story {
			padding: 1.3rem 1.5rem;
		}
		.story-content,
		.story-footer {
			display: none;
		}
		.auth-main {
			padding: 1.5rem;
		}
		.form-container {
			padding: 1.8rem 0;
		}
	}
</style>
