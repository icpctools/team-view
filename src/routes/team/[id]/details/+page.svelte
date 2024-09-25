<script lang="ts">
	import type { PersonJSON, TeamJSON } from '$lib/contest-types';
	import Photo from '$lib/Photo.svelte';

	export let data: {
		team: TeamJSON;
		coaches: PersonJSON[];
		contestants: PersonJSON[];
	};
</script>

{#if data.coaches}
	<h2>Coaches</h2>
	<div class="flex flex-row">
	{#each data.coaches as person}
		<div class="flex flex-col items-center">
			<div><Photo ref={person.photo} /></div>
			<div>{person.name}</div>
		</div>
	{/each}
	</div>
{/if}

{#if data.contestants}
	<h2>Contestants</h2>
	<div class="flex flex-row">
	{#each data.contestants as person}
		<div class="flex flex-col items-center">
			<div><Photo ref={person.photo} /></div>
			<div>{person.name}</div>
		</div>
	{/each}
</div>
{/if}
