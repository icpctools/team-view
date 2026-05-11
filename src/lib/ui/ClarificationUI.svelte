<script lang="ts">
	import { timeToMin, type FileReference } from '@icpctools/contest-api';
	import type { ClarificationData } from '../../routes/clarifications/clarificationData';
	import ClarificationUI from './ClarificationUI.svelte';
	import TeamColumn from './table/TeamColumn.svelte';
	import { gotoTeam } from '$lib/navigation';

	interface Props {
		clar: ClarificationData;
		logos?: Map<string, FileReference[]>;
	}
	let { clar, logos }: Props = $props();
</script>

<div class="w-full py-2">
	<div class="flex flex-row space-x-5">
		<div class="flex flex-row gap-x-1">
			From:
			{#if clar.from_team}
				<TeamColumn
					team={clar.from_team}
					logo={logos?.get(clar.from_team.id)}
					noGap
					onclick={() => gotoTeam(clar.from_team)} />
			{:else}
				Jury
			{/if}
		</div>

		{#if !clar.from_team}
			<div class="flex flex-row gap-x-1">
				To:
				{#if clar.to_teams && clar.to_teams?.length > 0}
					{#each clar.to_teams as team (team.id)}
						<TeamColumn {team} logo={logos?.get(team.id)} noGap onclick={() => gotoTeam(team)} />
					{/each}
				{/if}
				{#if clar.to_groups && clar.to_groups?.length > 0}
					{#each clar.to_groups as group (group.id)}
						<div>{group.name}</div>
					{/each}
				{/if}
				{#if !clar.from_team && !clar.to_teams && !clar.to_groups}
					All
				{/if}
			</div>
		{/if}
	</div>

	<div class="flex flex-row w-full">
		<div
			class="rounded-xl bg-slate-200 dark:bg-slate-700 px-4 py-3 shadow-sm grow"
			class:rounded-bl-xs={clar.from_team}
			class:rounded-br-xs={!clar.from_team}>
			{clar.text}
		</div>
		<div class="text-xs w-16 shrink-0 text-right">{timeToMin(clar.time)} min</div>
	</div>

	{#if clar.replies}
		<div class="pl-20">
			{#each clar.replies as reply (reply.id)}
				<ClarificationUI clar={reply} {logos} />
			{/each}
		</div>
	{/if}
</div>
