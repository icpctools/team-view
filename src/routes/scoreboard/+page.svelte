<script lang="ts">
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import { flip } from 'svelte/animate';
	import ScoreboardHeader from '$lib/ui/ScoreboardHeader.svelte';
	import ScoreboardRow from '$lib/ui/ScoreboardRow.svelte';

	let { data } = $props();

	onMount(() => {
		const interval = setInterval(() => {
			invalidateAll();
		}, 3000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<div class="w-full text-sm p-2" role="table" aria-label="scoreboard">
	<ScoreboardHeader
		hasLogos={data.hasLogos}
		scoreboard_type={data.scoreboard_type}
		problems={data.problems} />

	<div role="rowgroup">
		{#each data.scoreboard.rows as row, i (row.team_id)}
			<div animate:flip>
				<ScoreboardRow
					hasLogos={data.hasLogos}
					scoreboard_type={data.scoreboard_type}
					problems={data.problems}
					{row}
					team={data.teams[i]}
					logo={data.logos[i]} />
			</div>
		{/each}
	</div>
</div>
