<script lang="ts">
	import Logo from '$lib/ui/Logo.svelte';
	import ScoreboardRow from '$lib/ui/ScoreboardRow.svelte';

	let { data, children } = $props();
</script>

<div class="w-full h-full overflow-hidden flex flex-col">
<div class="flex flex-row gap-4 bg-gray-700 text-white px-4 py-2 items-center">
	{#if data.logo}
	<div class="w-16 h-16">
	  <Logo ref={data.logo} size={16} />
	</div>
	{/if}

	<div>{data.team.id}</div>
	<div class="grow"><a href="/team/{data.team.id}">{data.team.display_name || data.team.name}</a></div>

	<div class="flex flex-row gap-8">
		{#if data.team.webcam}
		<div><a href="/team/{data.team.id}/webcam">Webcam</a></div>
		{/if}
		{#if data.team.desktop}
		<div><a href="/team/{data.team.id}/desktop">Desktop</a></div>
		{/if}
		{#if data.team.desktop && data.team.webcam}
		<div><a href="/team/{data.team.id}/pip">Picture in Picture</a></div>
		{/if}
		{#if data.team.desktop && data.team.webcam}
		<div><a href="/team/{data.team.id}/rpip">Reverse PiP</a></div>
		{/if}
		{#if data.team.desktop && data.team.webcam}
		<div><a href="/team/{data.team.id}/side-side">Both</a></div>
		{/if}
	</div>
</div>

<div class="w-full align-center border-b-[1px] border-gray-500">
	<ScoreboardRow
					scoreboard_type={data.scoreboard_type}
					problems={data.problems}
					row={data.row}
					team={data.team}
					logo={data.logo}
					mode='summary'/>
</div>

<div class="overflow-auto w-full h-full">
	{@render children()}
</div>
</div>