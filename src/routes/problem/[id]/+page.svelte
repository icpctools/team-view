<script lang="ts">
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
	<div class="text-xl">Submissions</div>
	<div>{data.submissions.length}</div>
</div>
{/if}
</div>