<script lang="ts">
	import ScoreboardProblem from '$lib/ui/table/ScoreboardProblem.svelte';
	import ScoreboardSolved from '$lib/ui/table/ScoreboardSolved.svelte';
	import SimpleColumn from '$lib/ui/table/SimpleColumn.svelte';
	import type { Column } from '$lib/ui/table/table.js';
	import Table from '$lib/ui/table/Table.svelte';
	import { timeToMin, type ScoreboardRow } from '@icpctools/contest-api';
	import { Logo } from '@icpctools/contest-ui';

	let { data, children } = $props();

	const scoreboard_type = () => data.scoreboard_type;
	const columns: Column<ScoreboardRow>[] = [
		{
			title: 'Rank',
			width: '50px',
			renderer: SimpleColumn,
			rendererProps: (row: ScoreboardRow) => ({ object: row.rank }),
			align: 'center'
		},
		{
			title: 'Solved',
			hidden: scoreboard_type() !== 'pass-fail',
			renderer: ScoreboardSolved,
			rendererProps: (row: ScoreboardRow) => ({
				score: row.score
			}),
			align: 'center'
		},
		{
			title: 'Penalty',
			hidden: scoreboard_type() !== 'pass-fail',
			renderer: SimpleColumn,
			rendererProps: (row: ScoreboardRow) => ({
				object: timeToMin(row.score.total_time)
			}),
			align: 'center'
		},
		{
			title: 'Score',
			hidden: scoreboard_type() !== 'score',
			renderer: SimpleColumn,
			rendererProps: (row: ScoreboardRow) => ({
				object: row.score.score ? row.score.score : ''
			}),
			align: 'center'
		}
	];

	let probs = () => data.problems;
	for (let i = 0; i < probs().length; i++) {
		columns.push({
			title: 'Problem',
			renderer: ScoreboardProblem,
			rendererProps: (row: ScoreboardRow) => ({
				scoreboard_type: data.scoreboard_type,
				rp: row.problems?.find((p) => p.problem_id == data.problems[i].id),
				problem: data.problems[i],
				mode: 'summary'
			}),
			align: 'stretch'
		});
	}
</script>

<div class="w-full h-full max-w-full max-h-full overflow-hidden flex flex-col bg-white dark:bg-gray-900">
	<div class="flex flex-row gap-4 bg-gray-700 dark:bg-gray-800 text-white px-4 py-2 items-center">
		{#if data.logo}
			<div class="w-16 h-16">
				<Logo ref={data.logo} size={16} />
			</div>
		{/if}

		<div>{data.team.id}</div>
		<div class="grow">
			<a href="/team/{data.team.id}">{data.team.display_name || data.team.name}</a>
		</div>

		<div class="flex flex-row gap-8">
			{#if data.team.webcam}
				<div><a href="/team/{data.team.id}/webcam">Webcam</a></div>
			{/if}
			{#if data.team.desktop}
				<div><a href="/team/{data.team.id}/desktop">Desktop</a></div>
			{/if}
			{#if data.team.desktop && data.team.webcam}
				<div><a href="/team/{data.team.id}/pip">Picture in Picture</a></div>
			{/if}
			{#if data.team.desktop && data.team.webcam}
				<div><a href="/team/{data.team.id}/rpip">Reverse PiP</a></div>
			{/if}
			{#if data.team.desktop && data.team.webcam}
				<div><a href="/team/{data.team.id}/side-side">Both</a></div>
			{/if}
		</div>
	</div>

	{#if data.problems && data.row}
		<Table kind="scoreboard" data={[data.row]} {columns} showHeader={false}></Table>
	{/if}

	<div class="gap-2 w-full grow overflow-hidden bg-white dark:bg-gray-900">
		{@render children()}
	</div>
</div>
