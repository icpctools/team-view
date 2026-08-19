<script lang="ts">
	import { Image, JudgementUI, PersonUI } from '@icpctools/contest-ui';
	import type { Column } from '$lib/ui/table/table';
	import SimpleColumn from '$lib/ui/table/SimpleColumn.svelte';
	import Table from '$lib/ui/table/Table.svelte';
	import { timeToMin, parseRelTime } from '@icpctools/contest-api';
	import ProblemColumn from '$lib/ui/table/ProblemColumn.svelte';
	import ReactionColumn from '$lib/ui/table/ReactionColumn.svelte';
	import ReactionModal from '$lib/ui/ReactionModal.svelte';
	import type { SubmissionData } from '$lib/submissionData.js';
	import SourceColumn from '$lib/ui/table/SourceColumn.svelte';
	import SourceModal from '$lib/ui/SourceModal.svelte';
	import { gotoProblem } from '$lib/navigation.js';

	let { data } = $props();

	let sourceModal = $state<SourceModal>();
	let reactionModal = $state<ReactionModal>();

	const scoreboard_type = () => data.scoreboard_type;
	const hasLanguage = () => data.hasLanguage;
	const hasFiles = () => data.hasFiles;
	const hasReactions = () => data.hasReactions;
	const columns: Column<SubmissionData>[] = [
		{
			title: 'Time',
			renderer: SimpleColumn,
			rendererProps: (object: SubmissionData) => ({ object: timeToMin(object.time) }),
			comparator: (a, b): number => (parseRelTime(a.time) ?? 0) - (parseRelTime(b.time) ?? 0)
		},
		{
			title: 'Problem',
			renderer: ProblemColumn,
			rendererProps: (object: SubmissionData) => ({
				problem: object.problem,
				onclick: () => gotoProblem(object.problem)
			}),
			comparator: (a, b): number => a.problem?.ordinal - b.problem?.ordinal
		},
		{
			title: 'Language',
			hidden: !hasLanguage(),
			renderer: SimpleColumn,
			rendererProps: (object: SubmissionData) => ({ object: object.language?.name }),
			comparator: (a, b): number => a.language?.name.localeCompare(b.language?.name)
		},
		{
			title: 'Judgement',
			renderer: JudgementUI,
			rendererProps: (object: SubmissionData) => ({ judgement: object.judgement, judgementType: object.judgementType }),
			comparator: (a, b): number => (a.judgementType?.name ?? 'a').localeCompare(b.judgementType?.name ?? 'a')
		},
		{
			title: 'Score',
			hidden: scoreboard_type() !== 'score',
			renderer: SimpleColumn,
			rendererProps: (object: SubmissionData) => ({
				object: object.judgement?.score
			}),
			align: 'center',
			comparator: (a, b): number => (a.judgement?.score ?? 0) - (b.judgement?.score ?? 0),
			initialOrder: 'descending'
		},
		{
			title: 'Source Code',
			hidden: !hasFiles(),
			renderer: SourceColumn,
			rendererProps: (object: SubmissionData) => ({
				source: object.files,
				onclick: () => sourceModal?.openSource(object)
			})
		},
		{
			title: 'Reaction Video',
			hidden: !hasReactions(),
			renderer: ReactionColumn,
			rendererProps: (object: SubmissionData) => ({
				reaction: object.reaction,
				onclick: () => reactionModal?.openReaction(object)
			})
		}
	];
</script>

<div class="flex flex-col p-2 gap-1 h-full overflow-auto">
	{#if data.organization}
		<div class="flex flex-col">
			<div class="text-xl">Organization</div>
			<div>{data.organization.formal_name || data.organization.name}</div>
		</div>
	{/if}

	{#if data.organization?.country}
		<div class="flex flex-col">
			<div class="text-xl">Country</div>
			<div>{data.country}</div>
		</div>
	{/if}

	{#if data.organization?.url}
		<div class="flex flex-col">
			<div class="text-xl">Website</div>
			<div>{data.organization.url}</div>
		</div>
	{/if}

	{#if data.organization?.twitter_hashtag}
		<div class="flex flex-col">
			<div class="text-xl">Hashtag</div>
			<div>{data.organization.twitter_hashtag}</div>
		</div>
	{/if}

	{#if data.groups && data.groups.length > 0}
		<div class="flex flex-col">
			<div class="text-xl">Groups</div>
			<div class="flex flex-row gap-2">
				{#each data.groups as group (group.id)}
					<div>{group.name}</div>
				{/each}
			</div>
		</div>
	{/if}

	{#if data.submissions && data.submissions.length > 0}
		<div class="flex flex-col">
			<div class="text-xl">Submissions</div>

			<Table kind="submissions" data={data.submissions} {columns} defaultSortColumn="Time"></Table>
		</div>
	{/if}

	{#if data.team.photo}
		<div class="flex flex-col">
			<div class="text-xl">Photo</div>
			<div class="flex flex-row gap-2 max-h-64 h-64">
				<Image ref={data.team.photo} size={96} />
			</div>
		</div>
	{/if}

	{#if data.coaches && data.coaches.length > 0}
		<div class="flex flex-col">
			<div class="text-xl">Coaches</div>
			<div class="flex flex-row gap-2">
				{#each data.coaches as person (person.id)}
					<PersonUI {person} />
				{/each}
			</div>
		</div>
	{/if}

	{#if data.contestants && data.contestants.length > 0}
		<div class="flex flex-col">
			<div class="text-xl">Contestants</div>
			<div class="flex flex-row gap-2">
				{#each data.contestants as person (person.id)}
					<PersonUI {person} />
				{/each}
			</div>
		</div>
	{/if}
</div>

<SourceModal bind:this={sourceModal} />

<ReactionModal bind:this={reactionModal} />
