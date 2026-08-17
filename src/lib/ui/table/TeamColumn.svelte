<script lang="ts">
	import type { FileReference, Team } from '@icpctools/contest-api';
	import { Logo } from '@icpctools/contest-ui';

	interface Props {
		team: Team;
		logo?: FileReference[];
		noGap?: boolean;
		onclick?: () => void;
	}
	let { team, logo, noGap = false, onclick }: Props = $props();
</script>

{#if team}
	<button
		{onclick}
		class={{
			'flex flex-row items-center text-black dark:text-white p-0.5 gap-x-2 rounded max-w-full': true,
			'cursor-pointer hover:bg-hover': onclick
		}}>
		<div class="flex flex-row items-center gap-x-2 max-w-full">
			{#if logo || noGap}
				<div class="w-6"><Logo ref={logo} /></div>
			{/if}
			<span class="overflow-hidden text-ellipsis">{team.display_name || team.name}</span>
		</div>
	</button>
{/if}
