<script lang="ts" generics="T">
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
	import type { Column } from './table';

	interface Props {
		kind: string;
		columns: Column<T>[];
		data: T[];
		defaultSortColumn?: string;
		showHeader?: boolean;
		keyProperty?: keyof T;
		fitToScreen?: boolean;
		visibleRowCount?: number;
	}
	let {
		kind,
		columns,
		data,
		defaultSortColumn = undefined,
		showHeader = true,
		keyProperty = 'id' as keyof T,
		fitToScreen = false,
		visibleRowCount = $bindable(Infinity)
	}: Props = $props();

	let sortCol = $state<Column<T>>();
	let sortAscending = $state<boolean>();

	let containerHeight = $state(0);
	let rowHeight = $state(0);
	let headerHeight = $state(0);
	let containerElement = $state<HTMLDivElement>();

	// calculate visible row count when fitToScreen is enabled
	$effect(() => {
		if (fitToScreen && containerHeight && rowHeight) {
			const availableHeight = containerHeight - (showHeader ? headerHeight : 0);
			const calculatedRows = Math.floor(availableHeight / rowHeight);
			visibleRowCount = Math.max(1, calculatedRows);
		} else if (fitToScreen) {
			visibleRowCount = Infinity;
		}
	});

	let data2 = $derived.by(() => {
		let sorted = data;
		if (data && sortCol) {
			sorted = sortImpl();
		}
		if (fitToScreen && sorted.length > visibleRowCount) {
			return sorted.slice(0, visibleRowCount);
		}
		return sorted;
	});

	function sort(column: Column<T>): void {
		if (!column) {
			return;
		}

		let comparator = column.comparator;
		if (!comparator) {
			// column is not sortable
			return;
		}

		if (sortCol === column) {
			sortAscending = !sortAscending;
		} else {
			sortCol = column;
			sortAscending = column.initialOrder ? column.initialOrder !== 'descending' : true;
		}
		sortImpl();
	}

	function sortImpl(): T[] {
		// confirm we're sorting
		if (!sortCol) {
			return data;
		}

		let comparator = sortCol.comparator;
		if (!comparator) {
			// column is not sortable
			return data;
		}

		if (!sortAscending) {
			// we're already sorted, switch to reverse order
			let comparatorTemp = comparator;
			comparator = (a, b): number => -comparatorTemp(a, b);
		}

		return data.toSorted(comparator);
	}

	onMount(() => {
		const column: Column<T> | undefined = columns.find((column) => column.title === defaultSortColumn);
		if (column?.comparator) {
			sortCol = column;
			sortAscending = column.initialOrder ? column.initialOrder !== 'descending' : true;
		}

		if (fitToScreen && containerElement) {
			// measure heights after DOM is fully rendered
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					// measure header height
					const headerEl = containerElement?.querySelector('[role="rowgroup"]:first-child');
					if (headerEl) {
						headerHeight = (headerEl as HTMLElement).offsetHeight;
					}

					// measure just 2-3 rows to get accurate height
					const rowGroupEl = containerElement?.querySelector('[role="rowgroup"]:last-child');
					if (rowGroupEl) {
						const rows = rowGroupEl.querySelectorAll('[role="row"]');
						if (rows.length >= 2) {
							// measure the first two rows to get accurate spacing
							const firstRow = rows[0] as HTMLElement;
							const secondRow = rows[1] as HTMLElement;
							const firstTop = firstRow.getBoundingClientRect().top;
							const secondTop = secondRow.getBoundingClientRect().top;
							rowHeight = secondTop - firstTop;
						}
					}

					// measure parent container's actual height
					if (containerElement?.parentElement) {
						containerHeight = containerElement.parentElement.clientHeight;
					}
				});
			});

			// set up resize observer for parent container
			const resizeObserver = new ResizeObserver(() => {
				if (containerElement?.parentElement) {
					containerHeight = containerElement.parentElement.clientHeight;
				}
			});

			if (containerElement?.parentElement) {
				resizeObserver.observe(containerElement.parentElement);
			}

			return () => {
				resizeObserver.disconnect();
			};
		}
	});

	let gridTemplateColumns = $derived.by(() => {
		let columnWidths: string[] = [];

		columns.map((c) => c.width ?? '1fr').forEach((w) => columnWidths.push(w));

		columnWidths.push('5px');

		return columnWidths.join(' ');
	});
</script>

<div
	bind:this={containerElement}
	style="--table-grid-table-columns: {gridTemplateColumns}"
	class="w-full relative"
	class:h-full={fitToScreen}
	class:hidden={data2.length === 0}
	role="table"
	aria-label={kind}>
	<!-- Table header -->
	{#if showHeader}
		<div role="rowgroup" class="sticky top-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded z-10">
			<div class="grid grid-table mx-1 gap-x-0.5 h-7 text-gray-600 dark:text-gray-300 uppercase" role="row">
				{#each columns as column, colIndex (colIndex)}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_interactive_supports_focus -->
					<div
						class={{
							'flex items-center max-w-full overflow-hidden text-sm font-semibold whitespace-nowrap select-none': true,
							'justify-self-start': (column.titleAlign ?? column.align) === 'left',
							'justify-self-center': (column.titleAlign ?? column.align) === 'center',
							'justify-self-end': (column.titleAlign ?? column.align) === 'right',
							'justify-self-stretch': (column.titleAlign ?? column.align) === 'stretch',
							'cursor-pointer': column.comparator,
							'hover:text-black': sortCol !== column,
							'hover:dark:text-white': sortCol !== column
						}}
						onclick={sort.bind(undefined, column)}
						role="columnheader">
						{#if typeof column.title === 'string'}
							<div class="overflow-hidden text-ellipsis">
								{column.title}
							</div>
						{:else}
							<column.title {...column.titleProps} />
						{/if}

						{#if column.comparator}<i
								class="fas pl-0.5"
								class:fa-sort={sortCol !== column}
								class:fa-sort-up={sortCol === column && sortAscending}
								class:fa-sort-down={sortCol === column && !sortAscending}
								class:text-gray-500={sortCol !== column}
								aria-hidden="true"></i
							>{/if}
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Fixed alternating row backgrounds -->
	<div class={{ 'absolute inset-0 pointer-events-none': true, 'mt-7': showHeader }}>
		{#each data2 as object (object?.[keyProperty])}
			<div
				class="min-h-10 h-fit rounded-lg even:bg-white/50 dark:even:bg-gray-900/50 odd:bg-gray-300/50 dark:odd:bg-gray-700/50">
			</div>
		{/each}
	</div>

	<!-- Rows -->
	<div role="rowgroup" class="relative">
		{#each data2 as object, rowIndex (object?.[keyProperty])}
			<div
				class="grid grid-table gap-x-0.5 min-h-10 ml-1 hover:bg-gray-300/80 dark:hover:bg-gray-800/80 rounded-lg relative"
				in:fade={{ duration: 1000 }}
				animate:flip={{ duration: 1500 }}
				role="row">
				{#each columns as column, colIndex (colIndex)}
					<div
						class={{
							'flex items-center max-w-full py-px whitespace-nowrap': true,
							'justify-self-start': column.align === 'left',
							'justify-self-center': column.align === 'center',
							'justify-self-end': column.align === 'right',
							'justify-self-stretch': column.align === 'stretch',
							'overflow-hidden': column.overflow !== true
						}}
						role="cell">
						<column.renderer {...column.rendererProps?.(object, rowIndex)} />
					</div>
				{/each}
			</div>
		{/each}
	</div>
</div>

<style>
	.grid-table {
		display: grid;
		grid-template-columns: var(--table-grid-table-columns);
	}
</style>
