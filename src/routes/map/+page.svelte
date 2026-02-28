<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Team } from '@icpctools/contest-api';
	import { FloorMap } from '@icpctools/contest-ui';

	let { data } = $props();

	let selected = $state<Team>();

	function onClick(team: Team): void {
		goto('/team/' + team.id);
	}
</script>

<div class="flex flex-col w-full h-full bg-white dark:bg-gray-900">
	<div class="gap-2 w-full grow overflow-hidden">
		<FloorMap mapInfo={data.mapInfo} teams={data.teams} bind:selected onclick={(team: Team) => onClick(team)} />
	</div>

	<div class="text-center text-gray-900 dark:text-gray-100 p-2">Team: {selected?.display_name || selected?.name}</div>
</div>
