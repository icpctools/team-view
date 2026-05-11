<script lang="ts">
	import { timeToMin, type ScoreboardRow } from '@icpctools/contest-api';
	import type { Column } from '$lib/ui/table/table.js';
	import Table from '$lib/ui/table/Table.svelte';
	import SimpleColumn from '$lib/ui/table/SimpleColumn.svelte';
	import ScoreboardProblem from '$lib/ui/table/ScoreboardProblem.svelte';
	import TeamColumn from '$lib/ui/table/TeamColumn.svelte';
	import ProblemColumn from '$lib/ui/table/ProblemColumn.svelte';
	import ScoreboardSolved from '$lib/ui/table/ScoreboardSolved.svelte';
	import { gotoProblem, gotoTeamId } from '$lib/navigation.js';

	let { data } = $props();

	const columns: Column<ScoreboardRow>[] = [
		{
			title: 'Rank',
			width: '50px',
			renderer: SimpleColumn,
			rendererProps: (row: ScoreboardRow) => ({ object: row.rank }),
			align: 'center'
		},
		{
			title: 'Team',
			width: '3fr',
			renderer: TeamColumn,
			rendererProps: (row: ScoreboardRow, index: number) => ({
				team: data.teams[index],
				logo: data.logos[index],
				onclick: () => gotoTeamId(row.team_id)
			})
		}
	];

	const scoreboard_type = () => data.scoreboard_type;
	if (scoreboard_type() === 'pass-fail') {
		columns.push(
			{
				title: 'Solved',
				renderer: ScoreboardSolved,
				rendererProps: (row: ScoreboardRow) => ({
					score: row.score
				}),
				align: 'center'
			},
			{
				title: 'Penalty',
				renderer: SimpleColumn,
				rendererProps: (row: ScoreboardRow) => ({
					object: timeToMin(row.score.total_time)
				}),
				align: 'center'
			}
		);
	} else if (scoreboard_type() === 'score') {
		columns.push({
			title: 'Score',
			renderer: SimpleColumn,
			rendererProps: (row: ScoreboardRow) => ({
				object: row.score.score ? row.score.score : ''
			}),
			align: 'center'
		});
	}

	let probs = () => data.problems;
	for (let i = 0; i < probs().length; i++) {
		columns.push({
			title: ProblemColumn,
			titleProps: {
				problem: probs()[i],
				onclick: () => gotoProblem(data.problems[i])
			},
			titleAlign: 'center',
			renderer: ScoreboardProblem,
			rendererProps: (row: ScoreboardRow) => ({
				scoreboard_type: data.scoreboard_type,
				rp: row.problems?.find((p) => p.problem_id == data.problems[i].id),
				problem: data.problems[i]
			}),
			align: 'stretch'
		});
	}
</script>

<div class="w-full h-full overflow-auto text-sm">
	<Table kind="scoreboard" data={data.scoreboard.rows} {columns} keyProperty="team_id"></Table>
</div>
