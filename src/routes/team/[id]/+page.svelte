<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import JudgementType from '$lib/ui/JudgementType.svelte';
	import Person from '$lib/ui/Person.svelte';
	import Photo from '$lib/ui/Photo.svelte';
	import Problem from '$lib/ui/Problem.svelte';
	import ReactionModal from '$lib/ui/ReactionModal.svelte';
	import { onMount } from 'svelte';

	let { data } = $props();

	let modal = $state<ReactionModal>();

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
				{#each data.groups as group}
					<div>{group.name}</div>
				{/each}
			</div>
		</div>
	{/if}

	{#if data.submissions && data.submissions.length > 0}
		<div class="flex flex-col">
			<div class="text-xl">Submissions</div>
			<div class="grid grid-table" style="grid-template-columns: 1fr 1fr 1fr 1fr 1fr" role="row">
				<div role="cell" class="">Time</div>
				<div role="cell" class="">Problem</div>
				<div role="cell" class="">Language</div>
				<div role="cell" class="">Judgement</div>
				{#if data.hasReactions}
					<div role="cell" class="">Reaction Video</div>
				{/if}
			</div>
			{#each data.submissions as submission}
				<div class="grid grid-table" style="grid-template-columns: 1fr 1fr 1fr 1fr 1fr" role="row">
					<div role="cell" class="">{submission.time}</div>
					<div role="cell" class="">
						<Problem problem={submission.problem} onclick={() => goto('/problem/' + submission.problem?.id)} />
					</div>
					<div role="cell" class="">{submission.language}</div>
					<div role="cell" class="">
						<JudgementType judgement_type={submission.judgement_type} />{submission.judgement}
					</div>
					{#if data.hasReactions}
						<div role="cell" class="p-2">
							{#if submission.reaction && submission?.reaction.length > 0}
								<button
									onclick={() =>
										modal?.openReaction(
											submission.reaction,
											data.team?.display_name || data.team?.name + ' reaction video'
										)}
									class="
									text-blue-600
									dark:text-blue-400
									hover:bg-hover
									p-1 rounded
									cursor-pointer">
									Video
								</button>
							{:else}
								-
							{/if}
						</div>
					{/if}
				</div>
			{/each}
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
				{#each data.coaches as person}
					<Person {person} />
				{/each}
			</div>
		</div>
	{/if}

	{#if data.contestants && data.contestants.length > 0}
		<div class="flex flex-col">
			<div class="text-xl">Contestants</div>
			<div class="flex flex-row gap-2">
				{#each data.contestants as person}
					<Person {person} />
				{/each}
			</div>
		</div>
	{/if}
</div>

<ReactionModal bind:this={modal} />
