<script lang="ts">
	import type { Problem } from '@icpctools/contest-api';
	import ProblemUI from './ProblemUI.svelte';
	import { getColumns } from './scoreboard-util.js';

	interface Props {
		showLogo?: boolean;
		scoreboard_type?: 'pass-fail' | 'score';
		problems: Problem[];
		onselectproblem?: (problem: Problem) => void;
	}

	let { scoreboard_type = 'pass-fail', problems, showLogo = true, onselectproblem }: Props = $props();

	let col = $derived(getColumns(scoreboard_type, problems?.length, showLogo, 'full'));

	function onSelectProblem(problem: Problem): void {
		if (!problem) {
			return;
		}
		onselectproblem?.(problem);
	}
</script>

<div role="rowgroup" class="sticky top-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm font-semibold">
	<div
		role="row"
		class="grid grid-table gap-x-0.5 min-h-7 py-2 text-gray-900 dark:text-gray-100"
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
		{#each problems as problem (problem.id)}
			<div role="cell" class="justify-self-center w-3/4">
				<ProblemUI {problem} onclick={() => onSelectProblem(problem)} />
			</div>
		{/each}
	</div>
</div>
