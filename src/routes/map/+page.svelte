<script lang="ts">
	import FloorMap from '$lib/ui/FloorMap.svelte';

	let { data } = $props();

	let selected = $state<string>();

	let team = $derived(data.teams.find((t) => t.id === selected));
</script>

<div class="flex flex-col w-full h-full">
	<div class="gap-2 w-full grow overflow-hidden">
		<FloorMap mapInfo={data.mapInfo} teams={data.teams} bind:selected />
	</div>

	<div class="text-center">Selected team: {team?.display_name || team?.name}</div>
</div>
