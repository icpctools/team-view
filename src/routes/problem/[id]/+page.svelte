<script lang="ts">
	import JudgementType from '$lib/ui/JudgementType.svelte';
import Problem from '$lib/ui/Problem.svelte';

	let { data } = $props();
</script>

<div class="flex flex-col p-2 gap-1">
	<div class="flex flex-col">
	<div class="text-xl">Problem</div>
	<div class="flex flex-row gap-x-2">
		<div class="w-12 h-6"><Problem problem={data.problem} /></div>
		{data.problem.name}</div>
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

	<div class="grid grid-table" style="grid-template-columns: 1fr 1fr 1fr 1fr" role="row">
	<div role="cell" class="">Time</div>
	<div role="cell" class="">Team</div>
	<div role="cell" class="">Language</div>
	<div role="cell" class="">Judgement</div>
	</div>
	{#each data.submissions as submission}
	<div class="grid grid-table" style="grid-template-columns: 1fr 1fr 1fr 1fr" role="row">
	<div role="cell" class="">{submission.time}</div>
	<div role="cell" class=""><a href="/team/{submission.team?.id}">{submission.team?.label}: {submission.team?.display_name || submission.team?.name}</a></div>
	<div role="cell" class="">{submission.language}</div>
	<div role="cell" class=""><JudgementType judgement_type={submission.judgement_type}/>{submission.judgement}</div>
	</div>
	{/each}
</div>
{/if}
</div>