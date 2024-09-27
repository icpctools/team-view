<script lang="ts">
	import type { GroupJSON, OrganizationJSON, PersonJSON, TeamJSON } from '$lib/contest-types';
	import Person from '$lib/Person.svelte';

	export let data: {
		team: TeamJSON;
		organization: OrganizationJSON;
		groups: GroupJSON[];
		coaches: PersonJSON[];
		contestants: PersonJSON[];
	};
</script>

{#if data.organization}
	<h2>Organization</h2>
	{data.organization.formal_name || data.organization.name}
{/if}

{#if data.groups && data.groups.length > 0}
	<h2>Groups</h2>
	<div class="flex flex-row gap-2">
	{#each data.groups as group}
		<div>{group.name}</div>
	{/each}
	</div>
{/if}

{#if data.coaches}
	<h2>Coaches</h2>
	<div class="flex flex-row gap-2">
	{#each data.coaches as person}
		<Person person={person} />
	{/each}
	</div>
{/if}

{#if data.contestants}
	<h2>Contestants</h2>
	<div class="flex flex-row gap-2">
	{#each data.contestants as person}
		<Person person={person} />
	{/each}
</div>
{/if}
