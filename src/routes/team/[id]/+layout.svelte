<script lang="ts">
	import type { FileReferenceJSON, TeamJSON } from "$lib/contest-types";
	import Logo from "$lib/Logo.svelte";

    export let data: {
		name: string;
		team: TeamJSON;
		logo: FileReferenceJSON[];
	};
</script>

<h1>ICPC Team View</h1>

<Logo ref={data.logo} size={32} />

<p>{data.team.id} - {data.team.display_name || data.team.name}</p>

<div class="flex flex-row gap-4">
    <div><a href="/team/{data.team.id}/webcam">Webcam</a></div>
    <div><a href="/team/{data.team.id}/desktop">Desktop</a></div>
    <div><a href="/team/{data.team.id}/pip">Picture in Picture</a></div>
    <div><a href="/team/{data.team.id}/details">Details</a></div>
</div>
<slot />