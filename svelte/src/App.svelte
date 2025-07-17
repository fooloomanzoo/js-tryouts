<script lang="ts">
	import AddToTop from './lib/add-to-top.svelte';
	import ScrollGrid1 from './lib/interseption-infinite-scroll-grid.svelte';
	import ScrollGrid2 from './lib/interseption-infinite-scroll-grid-horizontal-vertical.svelte';
	import ScrollGrid3 from './lib/infinite-scroll-grid.svelte';

	const routes = [
		'add-to-top',
		'interseption-infinite-scroll-grid',
		'interseption-infinite-scroll-grid-horizontal-vertical',
		'infinite-scroll-grid',
	] as const;
	const labels = {
		'add-to-top': 'Add to Top',
		'interseption-infinite-scroll-grid':
			'Interseption Infinite Scroll Grid',
		'interseption-infinite-scroll-grid-horizontal-vertical':
			'Interseption Infinite Scroll Grid (Horizontal/Vertical)',
		'infinite-scroll-grid': 'Infinite Scroll Grid',
	} as const;
	const pages = {
		'add-to-top': AddToTop,
		'interseption-infinite-scroll-grid': ScrollGrid1,
		'interseption-infinite-scroll-grid-horizontal-vertical': ScrollGrid2,
		'infinite-scroll-grid': ScrollGrid3,
	} as const;

	let selected = $state(
		(window.location.hash.slice(1) || routes[0]) as keyof typeof pages,
	);
	const Page = $derived(pages[selected]);
</script>

<nav class="app-nav">
	{#each routes as route}
		<a
			href={`#${route}`}
			aria-current={selected === route ? 'page' : undefined}
			onclick={() => (selected = route)}>{labels[route]}</a
		>
	{/each}
</nav>

<main class="app-main">
	<Page />
</main>

<style>
	.app-nav {
		display: grid;
		grid-auto-flow: column;
		justify-content: start;
		gap: 1.5rem;
		padding: 1rem 2rem;
	}

	.app-nav > a {
		font-family: inherit;
		font-weight: 600;
		text-decoration: none;
		width: max-content;
	}

	.app-nav > a[aria-current] {
		text-decoration: underline;
	}

	.app-main {
		padding: 1rem;
	}
</style>
