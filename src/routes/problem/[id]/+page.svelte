<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { ProblemUI } from '@icpctools/contest-ui';
	import { onMount } from 'svelte';
	import ReactionModal from '$lib/ui/ReactionModal.svelte';
	import { Column } from '$lib/ui/table/table.js';
	import type { SubmissionData } from '../../../lib/submissionData.js';
	import { parseRelTime, timeToMin, type FileReference, type JudgementType, type Team } from '@icpctools/contest-api';
	import SimpleColumn from '$lib/ui/table/SimpleColumn.svelte';
	import JudgementTypeColumn from '$lib/ui/table/JudgementTypeColumn.svelte';
	import ReactionColumn from '$lib/ui/table/ReactionColumn.svelte';
	import Table from '$lib/ui/table/Table.svelte';
	import TeamColumn from '$lib/ui/table/TeamColumn.svelte';

	let { data } = $props();

	let modal = $state<ReactionModal>();

	onMount(() => {
		const interval = setInterval(() => {
			invalidate('data:problem');
		}, 3000);

		return () => {
			clearInterval(interval);
		};
	});

	let timeColumn = new Column<SubmissionData, string>('Time', {
		renderMapping: (object: SubmissionData) => timeToMin(object.time),
		renderer: SimpleColumn,
		comparator: (a, b): number => (parseRelTime(a.time) ?? 0) - (parseRelTime(b.time) ?? 0)
	});

	let teamColumn = new Column<SubmissionData, Team>('Team', {
		width: '3fr',
		renderMapping: (object: SubmissionData) => object.team,
		renderer: TeamColumn,
		onclick: (object: SubmissionData) => goto(`/team/${object.team?.id}`),
		comparator: (a, b): number =>
			(a.team.display_name ?? a.team.name ?? 'a').localeCompare(b.team.display_name ?? b.team.name ?? 'a')
	});

	let languageColumn = new Column<SubmissionData, string>('Language', {
		renderMapping: (object: SubmissionData) => object.language?.name,
		renderer: SimpleColumn,
		comparator: (a, b): number => a.language.name.localeCompare(b.language.name)
	});

	let judgementTypeColumn = new Column<SubmissionData, JudgementType | undefined>('Judgement', {
		renderMapping: (object: SubmissionData) => object.judgementType,
		renderer: JudgementTypeColumn,
		comparator: (a, b): number => (a.judgementType?.name ?? 'a').localeCompare(b.judgementType?.name ?? 'a')
	});

	let reactionColumn = new Column<SubmissionData, FileReference[]>('Reaction Video', {
		renderMapping: (object: SubmissionData) => object.reaction,
		renderer: ReactionColumn,
		onclick: (object: SubmissionData) =>
			modal?.openReaction(object.reaction, object.team?.display_name || object.team?.name + ' reaction video')
	});

	const columns = [timeColumn, teamColumn, languageColumn, judgementTypeColumn];

	// svelte-ignore state_referenced_locally
	if (data.hasReactions) {
		columns.push(reactionColumn);
	}
</script>

<div class="flex flex-col p-2 gap-1 h-full overflow-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
	<div class="flex flex-col">
		<div class="text-xl">Problem</div>
		<div class="flex flex-row gap-x-2">
			<ProblemUI problem={data.problem} />
			{data.problem.name}
		</div>
	</div>

	{#if data.problem.color}
		<div class="flex flex-col">
			<div class="text-xl">Color</div>
			<div>{data.problem.color}</div>
		</div>
	{/if}

	{#if data.submissions && data.submissions.length > 0}
		<div class="flex flex-col">
			<div class="text-xl">Submissions ({data.submissions.length})</div>

			<Table kind="submissions" data={data.submissions} {columns} defaultSortColumn="Time"></Table>
		</div>
	{/if}
</div>

<ReactionModal bind:this={modal} />
