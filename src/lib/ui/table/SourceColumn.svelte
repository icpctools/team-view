<script lang="ts">
	import type { FileReference } from '@icpctools/contest-api';

	interface Props {
		source?: FileReference[];
		onclick?: () => void;
	}
	let { source, onclick }: Props = $props();
</script>

<div class="w-full">
	{#if source && source?.length > 0}
		<button
			{onclick}
			class="
			text-blue-600
			dark:text-blue-400
			hover:bg-hover
			p-0.5 rounded
			cursor-pointer">
			Source
		</button>
	{:else}
		-
	{/if}
</div>
