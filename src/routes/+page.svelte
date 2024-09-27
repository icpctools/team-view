<script lang="ts">
	import Banner from '$lib/ui/Banner.svelte';
	import type { FileReferenceJSON, TeamJSON } from '$lib/contest-types';
	import Logo from '$lib/ui/Logo.svelte';

	export let data: {
		name: string;
		teams: TeamJSON[];
		logos: FileReferenceJSON[][];
		banner: FileReferenceJSON[];
		logo: FileReferenceJSON[];
	};
</script>

<div class="flex flex-row gap-8">
	<h1>ICPC Team View</h1>

	<p>{data.name}</p>

	<a href="/scoreboard">Scoreboard</a>

	<div class="w-24">
		<Logo ref={data.logo} />
	</div>
</div>

<div class="grid grid-cols-4 w-full gap-2">
	{#each data.teams as team, i}
		<div class="bg-gray-200 rounded-md">
			<a href="/team/{team.id}">
				<div class="flex flex-row gap-2 items-center">
					<div class="bg-gray-400 rounded-md max-w-12 w-full p-1"><Logo ref={data.logos[i]} /></div>
					<div>{team.id} - {team.display_name || team.name}</div>
				</div>
			</a>
		</div>
	{/each}
</div>

<Banner ref={data.banner} />
