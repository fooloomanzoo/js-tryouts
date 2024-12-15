<script lang="ts">
  import { onMount, tick } from "svelte";

  let container: HTMLElement;
  let before: HTMLElement;
  let middle: HTMLElement;
  let after: HTMLElement;
  let rowIndex = $state(0);
  let dayOffset = -2;
  let beforeRowCount = 3;
  let afterRowCount = 3;

  onMount(() => {
    middle.querySelector("td")?.scrollIntoView({ block: "start" });
  });

  $effect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const startCell = middle.querySelector("td");
        if (!startCell) return;

        const { scrollTop } = container;
        const offsetTop = startCell.offsetTop;
        rowIndex -= beforeRowCount;

        // Maintain scroll position after adding the new item
        tick().then(() => {
          container.scrollTop = scrollTop + offsetTop;
        });
      },
      { root: container, threshold: 0.5 }
    );

    const firstCell = before.querySelector("td");

    if (firstCell) {
      observer.observe(firstCell);
    }

    return () => observer.disconnect();
  });

  $effect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const startCell = middle.querySelector("td");
        if (!startCell) return;

        const { scrollTop, clientHeight, scrollHeight } = container;
        const offsetTop = startCell.offsetTop;

        rowIndex += afterRowCount;

        // Maintain scroll position after adding the new item
        tick().then(() => {
          container.scrollTop =
            scrollTop + offsetTop + clientHeight - scrollHeight;
        });
      },
      { root: container, threshold: 0.5 }
    );

    const lastCell = Array.from(after.querySelectorAll("td"))?.reverse()?.[0];

    if (lastCell) {
      observer.observe(lastCell);
    }

    return () => observer.disconnect();
  });
</script>

<table bind:this={container}>
  {#key "before"}
    <tbody bind:this={before}>
      {#each { length: beforeRowCount }, i}
        <tr>
          {#each { length: 7 }, j}
            <td>{(rowIndex + i - beforeRowCount) * 7 + j + dayOffset + 1}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  {/key}

  {#key "current"}
    <tbody bind:this={middle}>
      {#each { length: 6 }, i}
        <tr>
          {#each { length: 7 }, j}
            <td>{(rowIndex + i) * 7 + j + dayOffset + 1}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  {/key}

  {#key "after"}
    <tbody bind:this={after}>
      {#each { length: afterRowCount }, i}
        <tr>
          {#each { length: 7 }, j}
            <td>{(rowIndex + 6 + i) * 7 + j + dayOffset + 1}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  {/key}
</table>

<style>
  table {
    --item-size: 6rem;
    --gap: 1rem;

    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-auto-rows: 1fr;
    width: max-content;
    gap: var(--gap);

    overflow-y: auto;
    max-height: calc(var(--item-size) * 6 + var(--gap) * 5);
    margin: 4rem auto;
  }

  tbody,
  tr {
    display: contents;
  }

  td {
    display: grid;

    box-sizing: border-box;
    width: var(--item-size);
    aspect-ratio: 1 / 1;
    padding: 0.75rem;

    background-color: hsla(0, 0%, 50%, 0.1);

    font-size: 1.5rem;
  }
</style>
