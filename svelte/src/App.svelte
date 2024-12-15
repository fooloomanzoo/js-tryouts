<script lang="ts">
  import AddToTop from "./lib/add-to-top.svelte";
  import ScrollGrid from "./lib/infinite-scroll-grid.svelte";

  const routes = ["add-to-top", "infinite-scroll-grid"] as const;
  const labels = {
    "add-to-top": "Add to Top",
    "infinite-scroll-grid": "Infinite Scroll Grid",
  } as const;
  const pages = {
    "add-to-top": AddToTop,
    "infinite-scroll-grid": ScrollGrid,
  } as const;

  let selected = $state(
    (window.location.hash.slice(1) || routes[0]) as keyof typeof pages
  );
  const Page = $derived(pages[selected]);
</script>

<nav class="app-nav">
  {#each routes as route}
    <a
      href={`#${route}`}
      aria-current={selected === route ? "page" : undefined}
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
