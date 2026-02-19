<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { PersonUI, Photo } from '@icpctools/contest-ui';
	import { onMount } from 'svelte';
	import { Column } from '$lib/ui/table/table';
	import SimpleColumn from '$lib/ui/table/SimpleColumn.svelte';
	import Table from '$lib/ui/table/Table.svelte';
	import { timeToMin, parseRelTime } from '@icpctools/contest-api';
	import JudgementTypeColumn from '$lib/ui/table/JudgementTypeColumn.svelte';
	import ProblemColumn from '$lib/ui/table/ProblemColumn.svelte';
	import ReactionColumn from '$lib/ui/table/ReactionColumn.svelte';
	import ReactionModal from '$lib/ui/ReactionModal.svelte';
	import type { SubmissionData } from '$lib/submissionData.js';

	let { data } = $props();

	let modal = $state<ReactionModal>();

	let timeColumn = new Column<SubmissionData>('Time', {
		renderer: SimpleColumn,
		rendererProps: (object: SubmissionData) => ({ object: timeToMin(object.time) }),
		comparator: (a, b): number => (parseRelTime(a.time) ?? 0) - (parseRelTime(b.time) ?? 0)
	});

	let problemColumn = new Column<SubmissionData>('Problem', {
		renderer: ProblemColumn,
		rendererProps: (object: SubmissionData) => ({
			problem: object.problem,
			onclick: () => goto(`/problem/${object.problem.id}`)
		}),
		comparator: (a, b): number => a.problem.ordinal - b.problem.ordinal
	});

	let languageColumn = new Column<SubmissionData>('Language', {
		renderer: SimpleColumn,
		rendererProps: (object: SubmissionData) => ({ object: object.language.name }),
		comparator: (a, b): number => a.language.name.localeCompare(b.language.name)
	});

	let judgementTypeColumn = new Column<SubmissionData>('Judgement', {
		renderer: JudgementTypeColumn,
		rendererProps: (object: SubmissionData) => ({ judgementType: object.judgementType }),
		comparator: (a, b): number => (a.judgementType?.name ?? 'a').localeCompare(b.judgementType?.name ?? 'a')
	});

	let reactionColumn = new Column<SubmissionData>('Reaction Video', {
		renderer: ReactionColumn,
		rendererProps: (object: SubmissionData) => ({
			reaction: object.reaction,
			onclick: () =>
				modal?.openReaction(object.reaction, data.team?.display_name || data.team?.name + ' reaction video')
		})
	});

	const columns = [timeColumn, problemColumn, languageColumn, judgementTypeColumn];

	// svelte-ignore state_referenced_locally
	if (data.hasReactions) {
		columns.push(reactionColumn);
	}

	onMount(() => {
		const interval = setInterval(() => {
			invalidate('data:team');
		}, 3000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<div class="flex flex-col p-2 gap-1 h-full overflow-auto">
	<div class="flex flex-col">
		<div class="text-xl">Name</div>
		<div>{data.team.name}</div>
	</div>

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
			<div class="flex flex-row gap-2">
				<Photo ref={data.team.photo} size={48} />
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

<ReactionModal bind:this={modal} />
