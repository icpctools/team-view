<script lang="ts">
	import type { FileReference } from '@icpctools/contest-api';

	interface Props {
		reaction?: FileReference[];
		onclick?: () => void;
	}
	let { reaction, onclick }: Props = $props();
</script>

<div class="w-full">
	{#if reaction && reaction?.length > 0}
		<button
			{onclick}
			class="
			text-blue-600
			dark:text-blue-400
			hover:bg-hover
			p-0.5 rounded
			cursor-pointer">
			Video
		</button>
	{:else}
		-
	{/if}
</div>
