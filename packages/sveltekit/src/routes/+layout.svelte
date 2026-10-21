<script lang="ts">
	import favicon from '#lib/assets/favicon.svg';
	import '#lib/theme.css';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

<style>
	:global(:root) {
		color-scheme: light dark;
	}
	:global(:root[data-theme-preference='light']) {
		color-scheme: light;
	}
	:global(:root[data-theme-preference='dark']) {
		color-scheme: dark;
	}
</style>
