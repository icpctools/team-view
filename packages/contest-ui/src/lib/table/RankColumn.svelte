<script lang="ts">
	interface Props {
		rank: number;
	}
	let { rank }: Props = $props();

	// When the rank changes, temporarily replace the number with a coloured arrow:
	// green up for increasing and red down for decreasing
	let direction = $state<'up' | 'down' | undefined>(undefined);
	let prevRank: number | undefined;
	let timer: ReturnType<typeof setTimeout> | undefined;

	const SHOW_MS = 5000;

	$effect(() => {
		const current = rank;
		if (prevRank !== undefined && current !== prevRank) {
			direction = current < prevRank ? 'up' : 'down';
			clearTimeout(timer);
			timer = setTimeout(() => (direction = undefined), SHOW_MS);
		}
		prevRank = current;
	});

	$effect(() => () => clearTimeout(timer));
</script>

{#if direction === 'up'}
	<i class="fas fa-caret-up text-green-500 text-lg" aria-label="moving up"></i>
{:else if direction === 'down'}
	<i class="fas fa-caret-down text-red-500 text-lg" aria-label="moving down"></i>
{:else}
	<div class="text-black dark:text-white max-w-full overflow-hidden text-ellipsis">
		{rank}
	</div>
{/if}
