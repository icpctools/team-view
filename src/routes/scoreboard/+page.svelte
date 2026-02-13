<script lang="ts">
	import { onMount } from 'svelte';
	import { goto, invalidate } from '$app/navigation';
	import { flip } from 'svelte/animate';
	import ScoreboardHeader from '$lib/ui/ScoreboardHeader.svelte';
	import ScoreboardRow from '$lib/ui/ScoreboardRow.svelte';
	import type { Problem } from 'contest-api';

	let { data } = $props();

	onMount(() => {
		const interval = setInterval(() => {
			invalidate('data:scoreboard');
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<div class="w-full h-full overflow-auto text-sm p-2 bg-white dark:bg-gray-900" role="table" aria-label="scoreboard">
	<ScoreboardHeader
		showLogo={data.hasLogos}
		scoreboard_type={data.scoreboard_type}
		problems={data.problems}
		onselectproblem={(p: Problem) => goto('/problem/' + p.id)} />

	<div role="rowgroup">
		{#each data.scoreboard.rows as row, i (row.team_id)}
			<div animate:flip class="even:bg-white dark:even:bg-gray-900 odd:bg-gray-100 dark:odd:bg-gray-800">
				<ScoreboardRow
					showLogo={data.hasLogos}
					scoreboard_type={data.scoreboard_type}
					problems={data.problems}
					{row}
					team={data.teams[i]}
					logo={data.logos[i]} />
			</div>
		{/each}
	</div>
</div>
