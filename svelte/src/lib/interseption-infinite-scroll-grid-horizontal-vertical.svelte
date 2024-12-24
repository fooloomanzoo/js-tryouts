<script lang="ts">
	import { tick } from 'svelte';

	let container: HTMLElement;
	let nodes = $state<
		Partial<Record<'before' | 'middle' | 'after', HTMLElement>>
	>({});
	let offset = $state(0);
	let rowCount = $state(6);
	let columnCount = $state(7);
	let columnStartOffset = $state(-2);
	let beforeCount = $state(3);
	let afterCount = $state(3);
	let threshold = $state(0.5);

	let orientation = $state<'vertical' | 'horizontal'>('vertical');

	$effect(() => {
		nodes.middle?.scrollIntoView(
			orientation === 'vertical'
				? { block: 'start' }
				: { inline: 'start' },
		);
	});

	$effect(() => {
		$inspect(orientation);

		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;

				if (!nodes.middle || !nodes.before) return;

				let scrollTo: number;

				if (orientation === 'vertical') {
					scrollTo =
						container.scrollTop +
						nodes.middle.offsetTop -
						nodes.before.offsetTop;
				} else {
					scrollTo =
						container.scrollLeft +
						nodes.middle.offsetLeft -
						nodes.before.offsetLeft;
				}

				offset -= beforeCount;

				// Maintain scroll position after adding the new item
				tick().then(() => {
					if (orientation === 'vertical') {
						container.scrollTop = scrollTo;
					} else {
						container.scrollLeft = scrollTo;
					}
				});
			},
			{ root: container, threshold },
		);

		if (nodes.before) {
			observer.observe(nodes.before);
		}

		return () => observer.disconnect();
	});

	$effect(() => {
		$inspect(orientation);

		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;

				if (!nodes.middle || !nodes.after) return;

				let scrollTo: number;

				if (orientation === 'vertical') {
					scrollTo =
						container.scrollTop +
						nodes.middle.offsetTop +
						container.clientHeight -
						(nodes.after.offsetTop + nodes.after.offsetHeight);
				} else {
					scrollTo =
						container.scrollLeft +
						nodes.middle.offsetLeft +
						container.clientWidth -
						(nodes.after.offsetLeft + nodes.after.offsetWidth);
				}

				offset += afterCount;

				// Maintain scroll position after adding the new item
				tick().then(() => {
					if (orientation === 'vertical') {
						container.scrollTop = scrollTo;
					} else {
						container.scrollLeft = scrollTo;
					}
				});
			},
			{ root: container, threshold },
		);

		if (nodes.after) {
			observer.observe(nodes.after);
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

	<select bind:value={orientation}>
		<option value="vertical">Vertical</option>
		<option value="horizontal">Horizontal</option>
	</select>
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

{#snippet line(rowIndex: number, bind?: 'before' | 'middle' | 'after')}
	<div role="row">
		{#each { length: columnCount }, columnIndex}
			{@const index =
				rowIndex * columnCount + (columnIndex + columnStartOffset + 1)}
			{#if bind && columnIndex === 0}
				<div role="gridcell" bind:this={nodes[bind]}>
					{index}
				</div>
			{:else}
				<div role="gridcell">
					{index}
				</div>
			{/if}
		{/each}
	</div>
{/snippet}

<!-- svelte-ignore a11y_role_supports_aria_props -->
<div
	bind:this={container}
	aria-orientation={orientation}
	role="grid"
	style={`--row-count: ${rowCount};--column-count: ${columnCount};`}
>
	{#key 'before'}
		<div role="rowgroup">
			{#each { length: beforeCount }, i}
				{@render line(
					offset - beforeCount + i,
					i === 0 ? 'before' : undefined,
				)}
			{/each}
		</div>
	{/key}

	{#key 'middle'}
		<div role="rowgroup">
			{#each { length: rowCount }, i}
				{@render line(offset + i, i === 0 ? 'middle' : undefined)}
			{/each}
		</div>
	{/key}

	{#key 'after'}
		<div role="rowgroup">
			{#each { length: afterCount }, i}
				{@render line(
					offset + rowCount + i,
					i === afterCount - 1 ? 'after' : undefined,
				)}
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
		grid-template-columns: repeat(var(--column-count), var(--item-size));
		gap: var(--gap);

		height: calc(
			(var(--item-size) + var(--gap)) * var(--row-count) - var(--gap)
		);
		width: fit-content;

		box-sizing: border-box;
		margin: 2rem auto;

		overflow-y: auto;
		overflow-x: hidden;
		scroll-snap-type: y proximity;
		scrollbar-gutter: stable;
	}

	[role='grid'][aria-orientation='horizontal'] {
		grid-auto-flow: column;
		grid-template-columns: unset;
		grid-template-rows: repeat(var(--column-count), var(--item-size));

		width: calc(
			(var(--item-size) + var(--gap)) * var(--row-count) - var(--gap)
		);
		height: fit-content;

		overflow-y: hidden;
		overflow-x: auto;

		scroll-snap-type: x proximity;
	}

	[role='grid']:before,
	[role='grid']:after {
		content: '';
		grid-column: 1 / -1;
		height: calc(
			(var(--item-size) + var(--gap)) * var(--row-count) - var(--gap)
		);
	}

	[role='grid'][aria-orientation='horizontal']:before,
	[role='grid'][aria-orientation='horizontal']:after {
		grid-row: 1 / -1;
		grid-column: unset;
		width: calc(
			(var(--item-size) + var(--gap)) * var(--column-count) - var(--gap)
		);
		height: auto;
	}

	[role='rowgroup'],
	[role='row'] {
		display: contents;
	}

	[role='rowgroup']
		> [role='row']:first-child
		> [role='gridcell']:first-child {
		background-color: hsla(0, 50%, 50%, 0.1);
	}
	[role='rowgroup'] > [role='row']:last-child > [role='gridcell']:last-child {
		background-color: hsla(180, 50%, 50%, 0.1);
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
