<script lang="ts">
	import JudgeQueue from '$lib/ui/JudgeQueue.svelte';

	let { data } = $props();
</script>

<div class="flex flex-col p-2 gap-1 h-full overflow-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
	<JudgeQueue submissions={data.submissions} scoreboardType={data.scoreboardType} />
</div>
