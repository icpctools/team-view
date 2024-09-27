<script lang="ts">
	import type {
		FileReferenceJSON,
		ProblemJSON,
		ScoreboardJSON,
		TeamJSON
	} from '$lib/contest-types';
	import Logo from '$lib/ui/Logo.svelte';

	export let data: {
		name: string;
		scoreboard: ScoreboardJSON;
		teams: TeamJSON[];
		logos: FileReferenceJSON[][];
		problems: ProblemJSON[];
	};
	let cols: string[] = ['40px', '40px', '600px'];

	data.problems.forEach((p) => cols.push('1fr'));

	cols.push('80px');
	cols.push('80px');
	let col = cols.join(' ');
</script>

<div class="flex flex-row gap-8">
	<a href="/"><h1>ICPC Team View</h1></a>

	<h1>Scoreboard</h1>

	<p>{data.name}</p>
</div>

<div class="w-full text-sm" role="table" aria-label="scoreboard">
	<!-- Table header -->
	<div role="rowgroup">
		<div
			role="row"
			class="grid grid-table gap-x-0.5 h-7 sticky top-0"
			style="grid-template-columns: {col}"
		>
			<div role="cell"></div>
			<div role="cell"></div>
			<div role="cell"></div>
			{#each data.problems as problem}
				<div role="cell uppercase">{problem.label}</div>
			{/each}
			<div role="cell" class="justify-self-center">Solved</div>
			<div role="cell" class="justify-self-center">Penalty</div>
		</div>
	</div>

	<!-- Table rows -->
	<div role="rowgroup">
		{#each data.scoreboard.rows as row, i}
			<div role="row" class="grid grid-table gap-x-0.5 h-6" style="grid-template-columns: {col}">
				<div role="cell" class="justify-self-end">{row.rank}</div>
				<div role="cell" class="w-4 h-4 justify-self-center"><Logo ref={data.logos[i]} /></div>
				<div role="cell">{data.teams[i].display_name || data.teams[i].name}</div>

				{#each row.problems || [] as rp}
					<div role="cell" class:bg-green-500={rp.solved}>{rp.solved}</div>
				{/each}

				<div role="cell" class="justify-self-center">
					{row.score.num_solved > 0 ? row.score.num_solved : ''}
				</div>
				<div role="cell" class="justify-self-center">
					{row.score.total_time > 0 ? row.score.total_time : ''}
				</div>
			</div>
		{/each}
	</div>
</div>
