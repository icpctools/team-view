<script lang="ts">
	import type { Problem as ProblemObj } from '$lib/contest-types.js';
	import Problem from './Problem.svelte';
	import { getColumns } from './scoreboard-util';

	interface Props {
		showLogo?: boolean;
		scoreboard_type?: 'pass-fail' | 'score';
		problems: ProblemObj[];
	}

	let { scoreboard_type = 'pass-fail', problems, showLogo = true }: Props = $props();

	let col = getColumns(scoreboard_type, problems?.length, showLogo, 'full');
</script>

<div role="rowgroup" class="sticky top-0 bg-white/90 font-semibold">
	<div
		role="row"
		class="grid grid-table gap-x-0.5 min-h-7 py-2"
		style="grid-template-columns: {col}">
		<div role="cell">Rank</div>
		{#if showLogo}
			<div role="cell"></div>
		{/if}
		<div role="cell">Team</div>
		{#if scoreboard_type === 'pass-fail'}
			<div role="cell" class="justify-self-center">Solved</div>
			<div role="cell" class="justify-self-center">Penalty</div>
		{:else if scoreboard_type === 'score'}
			<div role="cell" class="justify-self-center">Score</div>
		{/if}
		{#each problems as problem}
		    <div role="cell" class="justify-self-center w-12">
				<a href="/problem/{problem.id}">
					<Problem problem={problem}/>
				</a>
			</div>
		{/each}
	</div>
</div>
