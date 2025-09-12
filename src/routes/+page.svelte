<script lang="ts">
	import Logo from '$lib/ui/Logo.svelte';

	let { data } = $props();
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 w-full h-full gap-2 p-2 overflow-auto">
	{#each data.teams as team, i}
		<div class="flex flex-row items-center bg-gray-200 rounded-md">
			<a href="/team/{team.id}">
				<div class="flex flex-row gap-2 items-center">
					{#if data.logos[i]}
						<div
							class="bg-gray-400 rounded-md max-w-12 min-w-12 max-h-12 min-h-12 w-12 h-12 p-1 flex place-content-center">
							<Logo ref={data.logos[i]} />
						</div>
					{/if}

					<div class="p-1 min-w-6">{team.id}</div>

					<div>{team.display_name || team.name}</div>
				</div>
			</a>
		</div>
	{/each}
</div>
