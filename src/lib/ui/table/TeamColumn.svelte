<script lang="ts">
	import type { Team } from '@icpctools/contest-api';

	interface Props {
		object: Team;
		onclick?: () => void;
	}
	let { object, onclick }: Props = $props();
</script>

<div class="w-full">
	{#if object}
		<button
			{onclick}
			class="
			text-blue-600
			dark:text-blue-400
			hover:bg-hover
			p-0.5 rounded
			cursor-pointer">
			{object?.label}: {object?.display_name || object?.name}
		</button>
	{/if}
</div>
