<script lang="ts">
	import { goto } from '$app/navigation';
	import { JudgementUI, ProblemUI } from '@icpctools/contest-ui';
	import ReactionModal from '$lib/ui/ReactionModal.svelte';
	import type { Column } from '$lib/ui/table/table.js';
	import type { SubmissionData } from '../../../lib/submissionData.js';
	import { parseRelTime, timeToMin } from '@icpctools/contest-api';
	import SimpleColumn from '$lib/ui/table/SimpleColumn.svelte';
	import ReactionColumn from '$lib/ui/table/ReactionColumn.svelte';
	import Table from '$lib/ui/table/Table.svelte';
	import TeamColumn from '$lib/ui/table/TeamColumn.svelte';
	import SourceModal from '$lib/ui/SourceModal.svelte';
	import SourceColumn from '$lib/ui/table/SourceColumn.svelte';

	let { data } = $props();

	let sourceModal = $state<SourceModal>();
	let reactionModal = $state<ReactionModal>();

	const columns: Column<SubmissionData>[] = [
		{
			title: 'Time',
			renderer: SimpleColumn,
			rendererProps: (object: SubmissionData) => ({ object: timeToMin(object.time) }),
			comparator: (a, b): number => (parseRelTime(a.time) ?? 0) - (parseRelTime(b.time) ?? 0)
		},
		{
			title: 'Team',
			width: '3fr',
			renderer: TeamColumn,
			rendererProps: (object: SubmissionData) => ({
				team: object.team,
				logo: object.logo,
				onclick: () => goto(`/team/${object.team?.id}`)
			}),
			comparator: (a, b): number =>
				(a.team.display_name ?? a.team.name ?? 'a').localeCompare(b.team.display_name ?? b.team.name ?? 'a')
		},
		{
			title: 'Language',
			renderer: SimpleColumn,
			rendererProps: (object: SubmissionData) => ({ object: object.language?.name }),
			comparator: (a, b): number => a.language.name.localeCompare(b.language.name)
		},
		{
			title: 'Judgement',
			renderer: JudgementUI,
			rendererProps: (object: SubmissionData) => ({ judgement: object.judgement, judgementType: object.judgementType }),
			comparator: (a, b): number => (a.judgementType?.name ?? 'a').localeCompare(b.judgementType?.name ?? 'a')
		},
		{
			title: 'Source Code',
			renderer: SourceColumn,
			rendererProps: (object: SubmissionData) => ({
				source: object.files,
				onclick: () => sourceModal?.openSource(object)
			})
		}
	];

	// svelte-ignore state_referenced_locally
	if (data.hasReactions) {
		columns.push({
			title: 'Reaction Video',
			renderer: ReactionColumn,
			rendererProps: (object: SubmissionData) => ({
				reaction: object.reaction,
				onclick: () => reactionModal?.openReaction(object)
			})
		});
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

<SourceModal bind:this={sourceModal} />

<ReactionModal bind:this={reactionModal} />
