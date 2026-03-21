<script lang="ts" generics="T extends { id?: string }">
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import type { Column } from './table';

	interface Props {
		kind: string;
		columns: Column<T>[];
		data: T[];
		defaultSortColumn: string | undefined;
	}
	let { kind, columns, data, defaultSortColumn = undefined }: Props = $props();

	let sortCol = $state<Column<T>>();
	let sortAscending = $state<boolean>();

	let data2 = $derived.by(() => {
		if (!data || !sortCol) {
			return data;
		} else {
			return sortImpl();
		}
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

	onMount(async () => {
		const column: Column<T> | undefined = columns.find((column) => column.title === defaultSortColumn);
		if (column?.comparator) {
			sortCol = column;
			sortAscending = column.initialOrder ? column.initialOrder !== 'descending' : true;
		}
	});

	let gridTemplateColumns = $derived.by(() => {
		let columnWidths: string[] = ['5px'];

		columns.map((c) => c.width ?? '1fr').forEach((w) => columnWidths.push(w));

		columnWidths.push('5px');

		return columnWidths.join(' ');
	});
</script>

<div
	style="--table-grid-table-columns: {gridTemplateColumns}"
	class="w-full"
	class:hidden={data2.length === 0}
	role="table"
	aria-label={kind}>
	<!-- Table header -->
	<div role="rowgroup" class="relative">
		<div class="grid grid-table gap-x-0.5 h-7 sticky top-0 text-gray-600 dark:text-gray-300 uppercase z-2" role="row">
			<div class="whitespace-nowrap justify-self-start" role="columnheader"></div>

			{#each columns as column, index (index)}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_interactive_supports_focus -->
				<div
					class="max-w-full overflow-hidden flex flex-row text-sm font-semibold items-center whitespace-nowrap {column.align ===
					'right'
						? 'justify-self-end'
						: column.align === 'center'
							? 'justify-self-center'
							: 'justify-self-start'} self-center select-none"
					class:cursor-pointer={column.comparator}
					class:hover:text-black={sortCol !== column}
					class:hover:dark:text-white={sortCol !== column}
					onclick={sort.bind(undefined, column)}
					role="columnheader">
					<div class="overflow-hidden text-ellipsis">
						{column.title}
					</div>
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
	<!-- Table body -->
	<div role="rowgroup">
		{#each data2 as object (object.id ?? object)}
			<div
				class="min-h-10 h-fit rounded-lg even:bg-white dark:even:bg-gray-900/50 odd:bg-gray-100 dark:odd:bg-gray-800/50"
				animate:flip={{ duration: 500 }}>
				<div class="grid grid-table gap-x-0.5 min-h-10 hover:bg-gray-300 dark:hover:bg-gray-800 rounded-lg" role="row">
					<div class="whitespace-nowrap place-self-center" role="cell"></div>

					{#each columns as column, index (index)}
						<div
							class="whitespace-nowrap {column.align === 'right'
								? 'justify-self-end'
								: column.align === 'center'
									? 'justify-self-center'
									: 'justify-self-start'} self-center {column.overflow === true
								? ''
								: 'overflow-hidden'} max-w-full py-1.5"
							role="cell">
							<column.renderer {...column.rendererProps?.(object)} />
						</div>
					{/each}
				</div>
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
