<a class="brand" href="/" aria-label="ONUS home">
	<svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
		<path d="M5 25V7h8v18H5Zm14 0V7h8v18h-8Z" stroke="currentColor" stroke-width="2" />
		<path d="m13 7 6 18M13 25l6-18" stroke="currentColor" stroke-width="2" />
	</svg>
	ONUS<span>RFI</span>
</a>

<style>
	.brand {
		display: inline-flex;
		align-items: center;
		align-self: flex-start;
		gap: 0.65rem;
		color: inherit;
		text-decoration: none;
		font-size: 1.5rem;
		font-weight: 800;
		letter-spacing: 0.13em;
	}
	svg {
		width: 2.1rem;
		height: 2.1rem;
		color: #83ddba;
	}
	span {
		font-size: 0.65rem;
		font-weight: 600;
		color: #83ddba;
		letter-spacing: 0.16em;
	}
	.brand:focus-visible {
		outline: 2px solid #83ddba;
		outline-offset: 6px;
	}
	@media (max-width: 800px) {
		.brand {
			font-size: 1.15rem;
		}
		svg {
			width: 1.8rem;
			height: 1.8rem;
		}
	}
</style>
