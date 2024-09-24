<script lang="ts">
	import type { ProblemJSON, ScoreboardJSON, TeamJSON } from "$lib/contest-types";
	
	export let data: { name:string,
		scoreboard:ScoreboardJSON,
		teams: TeamJSON[],
		logos: string[],
		problems: ProblemJSON[]
	};
	console.log('here');
</script>

<h1>ICPC Team View Scoreboard</h1>

<p>{data.name}</p>

<!-- Header -->
{#each data.problems as problem, j}
<div>{problem.label}</div>
{/each}

<!-- Rows -->
{#each data.scoreboard.rows as row, i}
<div>
	<div>{row.rank}</div>
	<div><img src="{data.logos[i]}" alt="logo"/></div>
	<div>{data.teams[i].display_name || data.teams[i].name}</div>

	{#each row.problems || [] as rp}
		<div>{rp.solved}</div>
	{/each}

	<div>{row.score.num_solved}</div>
	<div>{row.score.total_time}</div>
</div>
{/each}