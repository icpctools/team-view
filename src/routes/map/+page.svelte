<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Team } from '$lib/contest-types.js';
	import FloorMap from '$lib/ui/FloorMap.svelte';

	let { data } = $props();

	let selected = $state<Team>();

	function onClick(team: Team): void {
		goto('/team/' + team.id);
	}
</script>

<div class="flex flex-col w-full h-full">
	<div class="gap-2 w-full grow overflow-hidden">
		<FloorMap mapInfo={data.mapInfo} teams={data.teams} bind:selected onclick={(team) => onClick(team)} />
	</div>

	<div class="text-center">Team: {selected?.display_name || selected?.name}</div>
</div>
