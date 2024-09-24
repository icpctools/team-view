<script lang="ts">
	import type { TeamJSON } from "$lib/contest-types";
	
	export let data: { name:string,
		team: TeamJSON,
		logo: string
	};
	console.log('team here');
</script>

<h1>ICPC Team View</h1>

<img src="{data.logo}" alt="logo"/>

<p>{data.team.id} - {data.team.display_name || data.team.name}</p>
