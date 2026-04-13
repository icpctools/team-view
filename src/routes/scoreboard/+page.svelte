<script lang="ts">
	import { goto } from '$app/navigation';
	import { flip } from 'svelte/animate';
	import { ScoreboardHeader, ScoreboardRowUI } from '@icpctools/contest-ui';
	import type { Problem } from '@icpctools/contest-api';

	let { data } = $props();
</script>

<div class="w-full h-full overflow-auto text-sm p-2 bg-white dark:bg-gray-900" role="table" aria-label="scoreboard">
	<ScoreboardHeader
		showLogo={data.hasLogos}
		scoreboard_type={data.scoreboard_type}
		problems={data.problems}
		onselectproblem={(p: Problem) => goto('/problem/' + p.id)} />

	<div role="rowgroup">
		{#each data.scoreboard.rows as row, i (row.team_id)}
			<div animate:flip class="even:bg-white/50 dark:even:bg-gray-900/50 odd:bg-gray-300/50 dark:odd:bg-gray-700/50">
				<ScoreboardRowUI
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
