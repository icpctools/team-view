<script lang="ts">
	import type { FileReferenceJSON, PersonJSON, TeamJSON } from '$lib/contest-types';
	import Logo from '$lib/Logo.svelte';

	export let data: {
		name: string;
		team: TeamJSON;
	};
</script>

<h1>ICPC Team View</h1>

<p>Main page for team</p>

<div>Webcam</div>
<div>Desktop</div>
<div>Both</div>
<div>PIP</div>
<div>Activity</div>
<div>Details</div>

