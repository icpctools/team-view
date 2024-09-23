<script lang="ts">
	import type { TeamJSON } from "$lib/contest-types";

	export let data: { name:string,
		numTeams: number,
		teams: TeamJSON[]
	};
</script>

<h1>ICPC Coach View</h1>
<p>Visit <a href="https://tools.icpc.global">tools.icpc.global</a> to read the documentation</p>

<p>{data.name} with teams {data.numTeams}</p>

{#each data.teams as team}
<p>{team.name}</p>
{/each}