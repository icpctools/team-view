<script lang="ts">
	import type { FileReference } from '@icpctools/contest-api';

	interface Props {
		object?: FileReference[];
		onclick?: () => void;
	}
	let { object, onclick }: Props = $props();
</script>

<div class="w-full">
	{#if object && object?.length > 0}
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
