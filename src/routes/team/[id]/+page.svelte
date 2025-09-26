<script lang="ts">
	import { invalidate } from '$app/navigation';
	import JudgementType from '$lib/ui/JudgementType.svelte';
	import Person from '$lib/ui/Person.svelte';
	import Photo from '$lib/ui/Photo.svelte';
	import Problem from '$lib/ui/Problem.svelte';
	import { onMount } from 'svelte';

	let { data } = $props();

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
			<div class="grid grid-table" style="grid-template-columns: 1fr 1fr 1fr 1fr" role="row">
				<div role="cell" class="">Time</div>
				<div role="cell" class="">Problem</div>
				<div role="cell" class="">Language</div>
				<div role="cell" class="">Judgement</div>
			</div>
			{#each data.submissions as submission}
				<div class="grid grid-table" style="grid-template-columns: 1fr 1fr 1fr 1fr" role="row">
					<div role="cell" class="">{submission.time}</div>
					<div role="cell" class="w-16">
						<a href="/problem/{submission.problem?.id}"><Problem problem={submission.problem} /></a>
					</div>
					<div role="cell" class="">{submission.language}</div>
					<div role="cell" class="">
						<JudgementType judgement_type={submission.judgement_type} />{submission.judgement}
					</div>
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
