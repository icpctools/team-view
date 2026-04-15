<script lang="ts">
	import ClarificationUI from '$lib/ui/ClarificationUI.svelte';

	let { data } = $props();
</script>

<div class="flex flex-col p-2 gap-1 h-full overflow-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
	<div class="flex flex-col">
		{#if data.clarifications.length === 0}
			<div>No clarifications</div>
		{/if}

		{#each data.clarifications as clar (clar.id)}
			<ClarificationUI {clar} logos={data.logos} />
		{/each}
	</div>
</div>
