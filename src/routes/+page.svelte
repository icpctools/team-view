<script lang="ts">
	import type { TeamJSON } from "$lib/contest-types";
	
	export let data: { name:string,
		teams: TeamJSON[],
		logos: string[]
	};
	console.log('here');
</script>

<h1>ICPC Team View</h1>

<p>{data.name}</p>

<a href="/scoreboard">Scoreboard</a>

{#each data.teams as team, i}

<a href="/team/{team.id}">
<div><img src="{data.logos[i]}" alt="logo"/> {team.display_name || team.name}</div>
</a>

{/each}