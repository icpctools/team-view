<script lang="ts">
	import { Logo } from '@icpctools/contest-ui';

	let { data } = $props();
</script>

<div
	class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 max-h-full w-full gap-2 p-2 overflow-auto bg-white dark:bg-gray-900">
	{#each data.teams as team, i (team.id)}
		<div
			class="flex flex-row items-center bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-hover hover:text-link transition-colors">
			<a href="/team/{team.id}" class="w-full">
				<div class="flex flex-row gap-2 items-center">
					{#if data.logos[i]}
						<div
							class="bg-gray-400 dark:bg-gray-600 rounded-md max-w-12 min-w-12 max-h-12 min-h-12 w-12 h-12 p-1 flex items-center justify-center">
							<Logo ref={data.logos[i]} size={8} />
						</div>
					{/if}

					<div class="p-1 min-w-6">{team.label ?? team.id}</div>

					<div>{team.display_name || team.name}</div>
				</div>
			</a>
		</div>
	{/each}
</div>
