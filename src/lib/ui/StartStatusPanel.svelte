<script lang="ts">
	import { type StartStatus } from '@icpctools/contest-api';
	import StartStatusUI from './StartStatusUI.svelte';

	interface Props {
		status?: StartStatus[];
	}
	let { status }: Props = $props();
</script>

{#if status}
	<div class="grid grid-cols-3 px-4">
		{#each status as stat (stat.id)}
			<StartStatusUI status={stat} />
		{/each}
	</div>
{/if}
