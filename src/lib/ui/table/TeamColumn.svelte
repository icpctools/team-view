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
			'flex flex-row items-center text-black dark:text-white p-0.5 gap-x-2 rounded': true,
			'cursor-pointer hover:bg-hover': onclick
		}}>
		{#if logo || !noGap}
			<Logo ref={logo} />
		{/if}
		{team.display_name || team.name}
	</button>
{/if}
