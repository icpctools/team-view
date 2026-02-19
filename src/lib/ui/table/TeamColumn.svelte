<script lang="ts">
	import type { Team } from '@icpctools/contest-api';

	interface Props {
		team: Team;
		onclick?: () => void;
	}
	let { team, onclick }: Props = $props();
</script>

<div class="w-full">
	{#if team}
		<button
			{onclick}
			class="
			text-blue-600
			dark:text-blue-400
			hover:bg-hover
			p-0.5 rounded
			cursor-pointer">
			{team.label}: {team.display_name || team.name}
		</button>
	{/if}
</div>
