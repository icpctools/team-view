<script lang="ts">
	import Banner from "$lib/Banner.svelte";
import type { FileReferenceJSON, TeamJSON } from "$lib/contest-types";
	import Logo from "$lib/Logo.svelte";
	
	export let data: { name:string,
		teams: TeamJSON[],
		logos: FileReferenceJSON[][],
		banner: FileReferenceJSON[],
		logo: FileReferenceJSON[]
	};
</script>

<h1>ICPC Team View</h1>

<p>{data.name}</p>

<a href="/scoreboard">Scoreboard</a>

<Logo ref={data.logo}/>

{#each data.teams as team, i}

<a href="/team/{team.id}">
<div class="flex flex-row"><Logo ref={data.logos[i]}/> {team.display_name || team.name}</div>
</a>

{/each}

<Banner ref={data.banner}/>