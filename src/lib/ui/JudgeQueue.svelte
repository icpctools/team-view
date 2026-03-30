<script lang="ts">
	import { JudgementUI } from '@icpctools/contest-ui';
	import type { SubmissionData } from '$lib/submissionData';
	import SimpleColumn from './table/SimpleColumn.svelte';
	import TeamColumn from './table/TeamColumn.svelte';
	import type { Column } from './table/table';
	import Table from './table/Table.svelte';
	import ProblemColumn from './table/ProblemColumn.svelte';
	import { gotoProblem, gotoTeam } from '$lib/navigation';

	interface Props {
		submissions: SubmissionData[];
		scoreboardType?: string;
		mode?: 'standard' | 'solved-top';
		reservedForSolved?: number; // reserved rows at top for solved problems, defaults to 5
	}
	let { submissions, scoreboardType, mode = 'standard', reservedForSolved = 5 }: Props = $props();

	let visibleRowCount = $state<number>(Infinity);

	let standard = $derived(submissions.slice(-visibleRowCount));

	let solved = $derived(submissions.filter((s) => s.judgementType?.solved === true).slice(-reservedForSolved));
	let unjudged = $derived(
		submissions.filter((s) => !s.judgementType?.solved).slice(-(visibleRowCount - reservedForSolved))
	);
	let solvedTop = $derived([...solved, ...unjudged]);

	const columns: Column<SubmissionData>[] = [
		{
			title: 'Team',
			width: '3fr',
			renderer: TeamColumn,
			rendererProps: (object: SubmissionData) => ({
				team: object.team,
				logo: object.logo,
				onclick: () => gotoTeam(object.team)
			}),
			comparator: (a, b): number =>
				(a.team.display_name ?? a.team.name ?? 'a').localeCompare(b.team.display_name ?? b.team.name ?? 'a')
		},
		{
			title: 'Problem',
			renderer: ProblemColumn,
			rendererProps: (object: SubmissionData) => ({
				problem: object.problem,
				onclick: () => gotoProblem(object.problem)
			}),
			comparator: (a, b): number => a.problem.ordinal - b.problem.ordinal
		},
		{
			title: 'Judgement',
			renderer: JudgementUI,
			rendererProps: (object: SubmissionData) => ({ judgement: object.judgement, judgementType: object.judgementType }),
			comparator: (a, b): number => (a.judgementType?.name ?? 'a').localeCompare(b.judgementType?.name ?? 'a')
		}
	];

	const scoreboard_type = () => scoreboardType;
	if (scoreboard_type() === 'score') {
		columns.push({
			title: 'Score',
			renderer: SimpleColumn,
			rendererProps: (object: SubmissionData) => ({
				object: object.judgement?.score
			}),
			align: 'center'
		});
	}
</script>

<div class="grow min-h-0 overflow-hidden">
	<Table
		kind="submissions"
		data={mode === 'standard' ? standard : solvedTop}
		{columns}
		fitToScreen={true}
		bind:visibleRowCount></Table>
</div>
