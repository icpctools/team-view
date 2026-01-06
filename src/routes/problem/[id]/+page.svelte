<script lang="ts">
	import { invalidate } from '$app/navigation';
	import JudgementType from '$lib/ui/JudgementType.svelte';
	import Problem from '$lib/ui/Problem.svelte';
	import { onMount } from 'svelte';

	let { data } = $props();

	onMount(() => {
		const interval = setInterval(() => {
			invalidate('data:problem');
		}, 3000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<div class="flex flex-col p-2 gap-1 h-full overflow-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
	<div class="flex flex-col">
		<div class="text-xl">Problem</div>
		<div class="flex flex-row gap-x-2">
			<Problem problem={data.problem} />
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

			<div class="grid grid-table bg-gray-100 dark:bg-gray-800" style="grid-template-columns: 1fr 1fr 1fr 1fr" role="row">
				<div role="cell" class="p-2 font-semibold">Time</div>
				<div role="cell" class="p-2 font-semibold">Team</div>
				<div role="cell" class="p-2 font-semibold">Language</div>
				<div role="cell" class="p-2 font-semibold">Judgement</div>
			</div>
			{#each data.submissions as submission}
				<div class="grid grid-table even:bg-white dark:even:bg-gray-900 odd:bg-gray-50 dark:odd:bg-gray-800" style="grid-template-columns: 1fr 1fr 1fr 1fr" role="row">
					<div role="cell" class="p-2">{submission.time}</div>
					<div role="cell" class="p-2">
						<a href="/team/{submission.team?.id}" class="text-blue-600 dark:text-blue-400 hover:underline"
							>{submission.team?.label}: {submission.team?.display_name || submission.team?.name}</a>
					</div>
					<div role="cell" class="p-2">{submission.language}</div>
					<div role="cell" class="p-2">
						<JudgementType judgement_type={submission.judgement_type} />{submission.judgement}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
