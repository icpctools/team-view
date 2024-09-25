<script lang="ts">
	import type { FileReferenceJSON, PersonJSON, TeamJSON } from "$lib/contest-types";
	import Logo from "$lib/Logo.svelte";
	
	export let data: { name:string,
		team: TeamJSON,
		logo: FileReferenceJSON[],
		members: PersonJSON[]
	};
</script>

<h1>ICPC Team View</h1>

<Logo ref={data.logo} size={32}/>

<p>{data.team.id} - {data.team.display_name || data.team.name}</p>

<div>
Webcam
</div><div>
Desktop
</div><div>
Both
</div><div>
PIP
</div><div>
Activity
</div><div>
Details
</div>

Members:
{#each data.members as person}
<div>{person.name}</div>
{/each}