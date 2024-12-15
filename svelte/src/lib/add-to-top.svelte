<script lang="ts">
  import { tick } from "svelte";

  let elements = $state<HTMLElement[]>([]);
  let items = $state([
    "Item 1",
    "Item 2",
    "Item 3",
    "Item 4",
    "Item 5",
    "Item 6",
    "Item 7",
  ]);
  let counter = 0;
  let list: HTMLElement;

  function addItem(e: MouseEvent, newItem: string) {
    const { scrollTop, scrollHeight } = list;
    items = [newItem, ...items];
    counter--;

    // Maintain scroll position after adding the new item
    tick().then(() => {
      list.scrollTop = scrollTop + (list.scrollHeight - scrollHeight);
    });
  }
</script>

<ul bind:this={list} class="list">
  {#each items as item, index (item)}
    <li bind:this={elements[index]}>
      <button class="item" onclick={(e) => addItem(e, `Item ${counter}`)}>
        {item}
      </button>
    </li>
  {/each}
</ul>

<style>
  .list {
    max-height: 200px;
    overflow-y: auto;
  }

  .item {
    font-size: 2rem;
    padding: 0.75rem 1rem;
    margin: 0.125rem 0;
  }
</style>
