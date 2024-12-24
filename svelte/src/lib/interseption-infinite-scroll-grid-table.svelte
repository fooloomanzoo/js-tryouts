<script lang="ts">
	import { onMount, tick } from 'svelte';

	let container: HTMLElement;
	let before: HTMLElement;
	let middle: HTMLElement;
	let after: HTMLElement;
	let offset = $state(0);
	let rowCount = $state(6);
	let columnCount = $state(7);
	let columnStartOffset = $state(-2);
	let beforeCount = $state(3);
	let afterCount = $state(3);

	onMount(() => {
		const startCell = middle.querySelector("[role='gridcell']:first-child");

		if (!startCell) return;

		startCell.scrollIntoView({ block: 'start' });
	});

	$effect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;

				const beforeCell = before.querySelector<HTMLElement>(
					"[role='gridcell']:first-child",
				);
				const middleCell = middle.querySelector<HTMLElement>(
					"[role='gridcell']:first-child",
				);

				if (!middleCell || !beforeCell) return;

				const scrollTo =
					middleCell.offsetTop -
					beforeCell.offsetTop +
					container.scrollTop;

				offset -= beforeCount;

				// Maintain scroll position after adding the new item
				tick().then(() => {
					container.scrollTop = scrollTo;
				});
			},
			{ root: container, threshold: 0.5 },
		);

		const firstCell = before.querySelector("[role='gridcell']:first-child");

		if (firstCell) {
			observer.observe(firstCell);
		}
		return () => observer.disconnect();
	});

	$effect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;

				const middleCell = middle.querySelector<HTMLElement>(
					"[role='gridcell']:first-child",
				);
				const afterCell = before.querySelector<HTMLElement>(
					"[role='gridcell']:first-child",
				);
				if (!middleCell || !afterCell) return;

				const scrollTo =
					middleCell.offsetTop -
					afterCell.offsetTop +
					container.scrollTop +
					container.clientHeight -
					container.scrollHeight;

				offset += afterCount;

				// Maintain scroll position after adding the new item
				tick().then(() => {
					container.scrollTop = scrollTo;
				});
			},
			{ root: container, threshold: 0.5 },
		);

		const lastCell = after.querySelector(
			`[role='row']:nth-child(${afterCount}) > [role='gridcell']:nth-child(${columnCount})`,
		);

		if (lastCell) {
			observer.observe(lastCell);
		}

		return () => observer.disconnect();
	});
</script>

<div class="controls">
	<label>
		<input type="range" min="1" max="10" bind:value={rowCount} />
		Row Count: {rowCount}
	</label>

	<label>
		<input type="range" min="1" max="10" bind:value={columnCount} />
		Column Count: {columnCount}
	</label>
</div>

<div class="controls">
	<label>
		<input
			type="range"
			min={-columnCount}
			max={columnCount}
			bind:value={columnStartOffset}
		/>
		Start Index: {columnStartOffset}
	</label>

	<label>
		<input type="range" min="1" max="50" bind:value={beforeCount} />
		Before Offset: {beforeCount}
	</label>

	<label>
		<input type="range" min="1" max="50" bind:value={afterCount} />
		After Offset: {afterCount}
	</label>
</div>

<!-- svelte-ignore a11y_role_supports_aria_props -->
<div
	bind:this={container}
	role="grid"
	style={`--row-count: ${rowCount};--column-count: ${columnCount};`}
>
	{#key 'before'}
		<div role="rowgroup" bind:this={before}>
			{#each { length: beforeCount }, i}
				<div role="row">
					{#each { length: columnCount }, j}
						<div role="gridcell">
							{(offset + i - beforeCount) * columnCount +
								j +
								columnStartOffset +
								1}
						</div>
					{/each}
				</div>
			{/each}
		</div>
	{/key}

	{#key 'middle'}
		<div role="rowgroup" class="middle" bind:this={middle}>
			{#each { length: rowCount }, i}
				<div role="row">
					{#each { length: columnCount }, j}
						<div role="gridcell">
							{(offset + i) * columnCount +
								j +
								columnStartOffset +
								1}
						</div>
					{/each}
				</div>
			{/each}
		</div>
	{/key}

	{#key 'after'}
		<div role="rowgroup" bind:this={after}>
			{#each { length: afterCount }, i}
				<div role="row">
					{#each { length: columnCount }, j}
						<div role="gridcell">
							{(offset + rowCount + i) * columnCount +
								j +
								columnStartOffset +
								1}
						</div>
					{/each}
				</div>
			{/each}
		</div>
	{/key}
</div>

<style>
	.controls {
		display: flex;
		flex-flow: row wrap;
		gap: 3rem;
		justify-content: start;

		box-sizing: border-box;
		padding: 1rem;
		width: 100%;
	}

	[role='grid'] {
		--item-size: 6rem;
		--gap: 1rem;

		display: grid;
		grid-auto-flow: row;
		grid-template-rows: unset;
		grid-template-columns: repeat(auto-fill, var(--item-size));
		grid-auto-rows: var(--item-size);
		grid-auto-columns: var(--item-size);
		width: max-content;
		gap: var(--gap);

		overflow-y: auto;
		height: calc(
			(var(--item-size) + var(--gap)) * var(--row-count) - var(--gap)
		);
		width: calc(
			(var(--item-size) + var(--gap)) * var(--column-count) - var(--gap)
		);
		margin: 2rem auto;
	}

	[role='rowgroup'],
	[role='row'] {
		display: contents;
	}

	.middle > [role='row']:first-child > [role='gridcell']:first-child {
		background: hsla(0, 50%, 50%, 0.1);
	}
	.middle > [role='row']:last-child > [role='gridcell']:last-child {
		background: hsla(180, 50%, 50%, 0.1);
	}

	[role='gridcell'] {
		box-sizing: border-box;
		width: var(--item-size);
		aspect-ratio: 1 / 1;
		padding: 0.75rem;

		background-color: hsla(0, 0%, 50%, 0.1);

		font-size: 1.5rem;
	}
</style>
