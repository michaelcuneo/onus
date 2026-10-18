<script lang="ts">
	import Brand from '#lib/components/Brand.svelte';
</script>

<svelte:head>
	<title>ONUS RFI | Less chasing. More clarity.</title>
	<meta
		name="description"
		content="Construction workflow and accountability for property developers and client-side project managers. Discover the ONUS vision and create your workspace."
	/>
</svelte:head>

<div class="landing">
	<div class="hero-wrap">
		<header class="site-header container">
			<Brand />
			<nav aria-label="Main navigation">
				<a class="product-link" href="#approach">The ONUS approach</a>
				<a href="/login">Log in</a>
				<a class="nav-cta" href="/signup">Get started <span aria-hidden="true">&rarr;</span></a>
			</nav>
		</header>
		<main id="main-content">
			<section class="hero container" aria-labelledby="hero-title">
				<div class="hero-copy">
					<p class="eyebrow"><span class="line"></span> Built for the client-side perspective</p>
					<h1 id="hero-title">Your projects.<br />A clearer<br /><span>way forward.</span></h1>
					<p class="hero-description">
						Less time chasing information. More time making the decisions that move a project
						forward.
					</p>
					<div class="hero-actions">
						<a class="button" href="/signup"
							>Create your workspace <span aria-hidden="true">&rarr;</span></a
						>
						<a class="text-link" href="#approach"
							>Explore the approach <span aria-hidden="true">&darr;</span></a
						>
					</div>
					<p class="release-note">
						Early development &middot; Account setup and project records are available.<br />RFI
						workflows and integrations are coming next.
					</p>
				</div>
				<div
					class="preview"
					aria-label="Illustrative daily WIP preview using fictional project data"
				>
					<div class="preview-top">
						<span class="preview-brand">ONUS / WORKSPACE</span><span class="example-label"
							>Illustrative preview</span
						>
					</div>
					<div class="preview-content">
						<div class="preview-heading">
							<div>
								<p class="small-label">Riverside development</p>
								<h2>Your daily WIP.</h2>
							</div>
							<span class="date-label">Today</span>
						</div>
						<p class="preview-intro">The next decisions. With the context behind them.</p>
						<div class="summary-row">
							<div><strong>03</strong><span>For review</span></div>
							<div><strong>02</strong><span>Outstanding</span></div>
							<div><strong>01</strong><span>Completed</span></div>
						</div>
						<div class="section-label"><span>Ready for your review</span><span>01 / 03</span></div>
						<article class="decision">
							<div class="decision-meta">
								<span class="status">Approval needed</span><span>RFI-024</span>
							</div>
							<h3>Facade detail clarification</h3>
							<p>
								The architect's response is ready. Review the revised detail before the next
								coordination meeting.
							</p>
							<div class="person">
								<span class="avatar" aria-hidden="true">AM</span>
								<div>
									<strong>Alex Morgan</strong><span>Project manager &middot; Next action owner</span
									>
								</div>
							</div>
							<div class="evidence">
								<span aria-hidden="true">&#10003;</span> Response linked to source evidence
							</div>
						</article>
						<div class="next-item">
							<span class="amber-dot"></span>
							<div>
								<strong>Structural sign-off outstanding</strong><span
									>Consultant response required</span
								>
							</div>
							<span class="item-arrow" aria-hidden="true">&nearr;</span>
						</div>
					</div>
					<div class="preview-bottom">
						<span class="green-dot"></span> Prepared for review. You stay in control.
					</div>
				</div>
			</section>
			<div class="audience container">
				<span>Construction workflow &amp; accountability</span><span
					>For property developers &amp; client-side PMs</span
				>
			</div>
			<section class="approach" id="approach" aria-labelledby="approach-title">
				<div class="container">
					<div class="section-intro">
						<p class="eyebrow">The ONUS approach</p>
						<h2 id="approach-title">Keep the big picture.<br />Without losing the detail.</h2>
						<p>
							Construction projects don't happen in one application. ONUS is being built to bring
							the next actions into focus, across the systems your team already uses.
						</p>
					</div>
					<div class="principle-grid">
						<article>
							<span class="number">01 / CONNECT</span>
							<h3>Connect the software.</h3>
							<p>
								The goal: bring relevant RFIs, correspondence and approvals together without asking
								every consultant to change how they work.
							</p>
						</article>
						<article>
							<span class="number">02 / COORDINATE</span>
							<h3>Coordinate the work.</h3>
							<p>
								Understand what needs attention, who owns the next action, and which outstanding
								decisions are holding up other work.
							</p>
						</article>
						<article>
							<span class="number">03 / DECIDE</span>
							<h3>Prepare the decisions.</h3>
							<p>
								A daily WIP with context and supporting evidence. Review proposed actions, make the
								call, and keep a record of what happened.
							</p>
						</article>
					</div>
					<div class="closing">
						<div>
							<p class="eyebrow">A foundation for better oversight</p>
							<h2>Clarity starts with accountability.</h2>
							<p>Create your account and organisation while we build the workflows ahead.</p>
						</div>
						<a class="button" href="/signup"
							>Get started with ONUS <span aria-hidden="true">&rarr;</span></a
						>
					</div>
				</div>
			</section>
		</main>
		<footer class="container">
			<Brand />
			<p>Project accountability. From the ground up.</p>
			<a href="/login">Log in <span aria-hidden="true">&nearr;</span></a>
		</footer>
	</div>
</div>

<style>
	:global(body:has(.landing)) {
		margin: 0;
		background: #102a33;
	}
	.landing {
		font-family:
			Inter,
			ui-sans-serif,
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			sans-serif;
		color: #f3f8f6;
		line-height: 1.5;
	}
	.landing :global(*) {
		box-sizing: border-box;
	}
	.landing :global(a:focus-visible) {
		outline: 2px solid #83ddba;
		outline-offset: 6px;
	}
	.container {
		width: min(100% - 6rem, 1240px);
		margin-inline: auto;
	}
	.hero-wrap {
		background: radial-gradient(ellipse at 85% 22%, #204b45 0, transparent 48%), #102a33;
	}
	.site-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.5rem;
		padding-block: 2rem;
		border-bottom: 1px solid #ffffff1a;
	}
	nav {
		display: flex;
		align-items: center;
		gap: 2rem;
		font-size: 0.8rem;
		font-weight: 600;
	}
	a {
		color: inherit;
		text-decoration: none;
	}
	nav a:hover,
	footer a:hover {
		color: #83ddba;
	}
	nav .nav-cta {
		padding: 0.7rem 1rem;
		border: 1px solid #83ddba66;
		border-radius: 0.4rem;
	}
	.hero {
		display: grid;
		grid-template-columns: 1.05fr 1fr;
		gap: clamp(2rem, 6vw, 6rem);
		align-items: center;
		padding-block: 5.5rem 5rem;
	}
	.eyebrow {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		margin: 0 0 1.5rem;
		color: #9dd4bd;
		font-size: 0.66rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.14em;
	}
	.line {
		width: 1.8rem;
		height: 1px;
		background: #83ddba;
		flex-shrink: 0;
	}
	h1 {
		font-size: clamp(3rem, 5.5vw, 5.3rem);
		font-weight: 550;
		letter-spacing: -0.065em;
		line-height: 1.04;
		margin: 0;
	}
	h1 span {
		color: #9be0be;
	}
	.hero-description {
		max-width: 25rem;
		margin: 1.8rem 0;
		color: #bfd0ce;
		font-size: 1.05rem;
		line-height: 1.8;
	}
	.hero-actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1.5rem;
	}
	.button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 1.3rem;
		padding: 1rem 1.25rem;
		border-radius: 0.4rem;
		background: #9be0be;
		color: #102f29;
		font-size: 0.8rem;
		font-weight: 750;
		transition: background 0.15s;
	}
	.button:hover {
		background: #c0f0d6;
	}
	.text-link {
		font-size: 0.8rem;
		border-bottom: 1px solid #779e93;
		padding-block: 0.35rem;
	}
	.release-note {
		margin: 1.3rem 0 0;
		font-size: 0.7rem;
		line-height: 1.7;
		color: #9fb8b4;
	}
	.preview {
		min-width: 0;
		background: #f6f8f7;
		color: #172d35;
		border: 1px solid #ffffff33;
		border-radius: 0.8rem;
		box-shadow: 0 30px 70px #06191f55;
		overflow: hidden;
	}
	.preview-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		padding: 1rem 1.4rem;
		border-bottom: 1px solid #dce5e0;
	}
	.preview-brand {
		font-size: 0.6rem;
		font-weight: 750;
		letter-spacing: 0.12em;
	}
	.example-label {
		color: #536960;
		font-size: 0.6rem;
		padding: 0.25rem 0.5rem;
		background: #e6eee9;
		border-radius: 0.3rem;
	}
	.preview-content {
		padding: 1.5rem;
	}
	.preview-heading {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}
	.small-label {
		margin: 0 0 0.35rem;
		font-size: 0.65rem;
		color: #60726c;
	}
	.preview h2 {
		margin: 0;
		font-size: 1.6rem;
		font-weight: 650;
		letter-spacing: -0.04em;
	}
	.date-label {
		padding: 0.35rem 0.65rem;
		border: 1px solid #d3dfd8;
		border-radius: 0.3rem;
		font-size: 0.65rem;
	}
	.preview-intro {
		color: #657770;
		font-size: 0.72rem;
		margin: 0.7rem 0 1.4rem;
	}
	.summary-row {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
		padding-bottom: 1.3rem;
		border-bottom: 1px solid #dce5e0;
	}
	.summary-row div {
		display: grid;
		gap: 0.15rem;
	}
	.summary-row strong {
		font-size: 1.4rem;
		font-weight: 550;
		letter-spacing: -0.04em;
	}
	.summary-row span {
		color: #60726c;
		font-size: 0.65rem;
	}
	.section-label {
		display: flex;
		justify-content: space-between;
		margin: 1.2rem 0 0.75rem;
		font-size: 0.65rem;
		font-weight: 600;
		color: #60726c;
	}
	.decision {
		padding: 1rem;
		background: #fff;
		border: 1px solid #d5e3d9;
		border-radius: 0.5rem;
	}
	.decision-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.6rem;
		color: #667d72;
	}
	.status {
		color: #1d6749;
		background: #e8f4ec;
		border-radius: 0.25rem;
		padding: 0.25rem 0.45rem;
	}
	.decision h3 {
		font-size: 0.9rem;
		font-weight: 650;
		margin: 0.8rem 0 0.4rem;
	}
	.decision > p {
		color: #61756e;
		font-size: 0.7rem;
		line-height: 1.75;
		margin: 0;
	}
	.person {
		display: flex;
		gap: 0.65rem;
		align-items: center;
		margin: 1rem 0;
	}
	.avatar {
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		background: #e6eee9;
		color: #38614e;
		font-size: 0.65rem;
		font-weight: 650;
	}
	.person div {
		display: grid;
		gap: 0.1rem;
	}
	.person strong {
		font-size: 0.65rem;
		font-weight: 650;
	}
	.person div span {
		color: #697c74;
		font-size: 0.6rem;
	}
	.evidence {
		border-top: 1px solid #e8eeea;
		padding-top: 0.7rem;
		color: #38614e;
		font-size: 0.6rem;
	}
	.evidence > span {
		margin-right: 0.35rem;
	}
	.next-item {
		display: flex;
		gap: 0.7rem;
		align-items: center;
		padding-top: 1.1rem;
	}
	.amber-dot,
	.green-dot {
		width: 0.4rem;
		height: 0.4rem;
		border-radius: 50%;
		background: #a46d23;
		flex-shrink: 0;
	}
	.next-item div {
		display: grid;
		gap: 0.25rem;
	}
	.next-item strong {
		font-size: 0.7rem;
		font-weight: 650;
	}
	.next-item div span {
		color: #697c74;
		font-size: 0.6rem;
	}
	.item-arrow {
		margin-left: auto;
		color: #697c74;
	}
	.preview-bottom {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		padding: 0.8rem 1.5rem;
		background: #eaf0ec;
		font-size: 0.6rem;
		color: #536960;
	}
	.green-dot {
		background: #398463;
	}
	.audience {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding-block: 1.5rem;
		border-top: 1px solid #ffffff1a;
		color: #a4bdb6;
		font-size: 0.7rem;
	}
	.approach {
		padding: 5rem 0;
		background: #f6f8f7;
		color: #172d35;
	}
	.approach .eyebrow {
		color: #176b53;
	}
	.section-intro {
		display: grid;
		grid-template-columns: 1.2fr 1fr;
		gap: 1rem 4rem;
		align-items: end;
	}
	.section-intro .eyebrow {
		grid-column: 1 / -1;
		margin-bottom: 0.5rem;
	}
	.approach h2 {
		font-size: clamp(1.8rem, 3vw, 2.7rem);
		line-height: 1.2;
		letter-spacing: -0.045em;
		font-weight: 600;
		margin: 0;
	}
	.section-intro > p:last-child {
		color: #5b6d72;
		line-height: 1.8;
		font-size: 0.9rem;
		margin: 0;
	}
	.principle-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		margin-top: 3.5rem;
		gap: 2.5rem;
	}
	.principle-grid article {
		border-top: 1px solid #bccfc3;
		padding-top: 1.5rem;
	}
	.number {
		color: #176b53;
		font-size: 0.65rem;
		letter-spacing: 0.08em;
		font-weight: 650;
	}
	.principle-grid h3 {
		font-size: 1.1rem;
		font-weight: 650;
		letter-spacing: -0.025em;
		margin: 1rem 0 0.7rem;
	}
	.principle-grid p {
		font-size: 0.85rem;
		color: #5b6d72;
		line-height: 1.8;
		margin: 0;
	}
	.closing {
		margin-top: 4rem;
		padding-top: 3rem;
		border-top: 1px solid #d4dfd8;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 2rem;
	}
	.closing h2 {
		font-size: 1.7rem;
	}
	.closing p:last-child {
		font-size: 0.85rem;
		color: #5b6d72;
	}
	.closing .button {
		flex-shrink: 0;
		background: #176b53;
		color: white;
	}
	.closing .button:hover {
		background: #10543f;
	}
	footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 2rem;
		padding-block: 2rem;
	}
	footer p,
	footer > a {
		color: #a4bdb6;
		font-size: 0.7rem;
	}
	@media (max-width: 1000px) {
		.container {
			width: calc(100% - 3rem);
		}
		.hero {
			gap: 2.5rem;
		}
		.hero-actions {
			gap: 1rem;
		}
		nav {
			gap: 1.2rem;
		}
	}
	@media (max-width: 760px) {
		.site-header {
			padding-block: 1.3rem;
		}
		.product-link {
			display: none;
		}
		nav {
			gap: 1rem;
			font-size: 0.75rem;
		}
		.hero {
			grid-template-columns: minmax(0, 1fr);
			padding-block: 3rem;
		}
		h1 {
			font-size: clamp(3rem, 10vw, 4.5rem);
		}
		.hero-copy {
			max-width: 32rem;
		}
		.hero-description {
			font-size: 1rem;
		}
		.preview {
			width: 100%;
			max-width: 32rem;
			justify-self: center;
		}
		.audience {
			flex-direction: column;
			gap: 0.4rem;
		}
		.approach {
			padding-block: 3rem;
		}
		.section-intro,
		.principle-grid {
			grid-template-columns: 1fr;
		}
		.section-intro {
			gap: 1rem;
		}
		.principle-grid {
			gap: 2rem;
			margin-top: 2.5rem;
		}
		.closing {
			flex-direction: column;
			align-items: flex-start;
			margin-top: 3rem;
			gap: 1rem;
		}
		footer {
			flex-wrap: wrap;
			gap: 1rem;
		}
		footer p {
			flex-basis: 100%;
			order: 1;
			margin: 0;
		}
	}
</style>
