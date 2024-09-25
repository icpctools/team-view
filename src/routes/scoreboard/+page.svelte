<script lang="ts">
	import type { FileReferenceJSON, ProblemJSON, ScoreboardJSON, TeamJSON } from "$lib/contest-types";
	import Logo from "$lib/Logo.svelte";
	
	export let data: { name:string,
		scoreboard:ScoreboardJSON,
		teams: TeamJSON[],
		logos: FileReferenceJSON[][],
		problems: ProblemJSON[]
	};
	let cols:string[] = ['40px','60px','300px'];

	data.problems.forEach(p => cols.push('1fr'));

	cols.push('80px');
	cols.push('80px');
	let col = cols.join(' ');
</script>

<h1>ICPC Team View Scoreboard</h1>

<p>{data.name}</p>

<div class="w-full" role="table" aria-label="scoreboard">
	<!-- Table header -->
	<div role="rowgroup">
	  <div role="row"
		class="grid grid-table gap-x-0.5 h-7 sticky top-0 uppercase"
		style="grid-template-columns: {col}">
		{#each data.problems as problem}
			<div role="cell">{problem.label}</div>
		{/each}
	  </div>
	</div>

	<!-- Table rows -->
	<div role="rowgroup">
		{#each data.scoreboard.rows as row, i}
			<div role="row"
			class="grid grid-table gap-x-0.5 h-7"
			style="grid-template-columns: {col}">
			<div role="cell">{row.rank}</div>
			<div role="cell"><Logo ref={data.logos[i]}/></div>
			<div role="cell">{data.teams[i].display_name || data.teams[i].name}</div>

			{#each row.problems || [] as rp}
				<div role="cell"
				class:bg-green-500={rp.solved}>{rp.solved}</div>
			{/each}

			<div role="cell">{row.score.num_solved}</div>
			<div role="cell">{row.score.total_time}</div>
		</div>
	{/each}
  </div>
</div>
