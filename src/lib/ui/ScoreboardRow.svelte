<script lang="ts">
	import Logo from './Logo.svelte';
	import { parseHexColor, rgbToHex, FAILED, SOLVED, PENDING, SCORING_MID } from '$lib/color-util.js';
	import { timeToMin } from '$lib/contest-time-util.js';
	import type { FileReference, Problem, ScoreboardProblem, ScoreboardRow, Team } from '$lib/contest-types.js';
	import { getColumns } from './scoreboard-util';

	interface Props {
		showLogo?: boolean;
		scoreboard_type?: 'pass-fail' | 'score';
		row: ScoreboardRow;
		problems: Problem[];
		team?: Team;
		logo?: FileReference[];
		mode: 'full' | 'summary';
	}

	let { scoreboard_type = 'pass-fail', problems, row, team, logo, showLogo = true, mode = 'full' }: Props = $props();

	let col = getColumns(scoreboard_type, problems?.length, showLogo, mode);

	function scoreBg(rp: ScoreboardProblem, problem: Problem):string {
		if (rp.num_pending > 0) {
			return PENDING;
		}
		if (scoreboard_type === 'pass-fail') {
			if (rp.solved)
				return SOLVED;
		} else if (scoreboard_type === 'score') {
			if (rp.score) {
				if (problem.max_score) {
					const percent = (rp.score ?? 0) / problem.max_score;

					const c1 = parseHexColor(FAILED);
					const c2 = parseHexColor(SCORING_MID);
					const c3 = parseHexColor(SOLVED);
					let cr = [0,0,0];
					for (let i = 0; i < 3; i++) {
						if (percent <= 0.5) {
							cr[i] = c1[i] * (1 - percent * 2) + c2[i] * percent * 2;
						} else {
							cr[i] = c2[i] * (1 - (percent - 0.5) * 2) + c3[i] * (percent - 0.5) * 2;
						}
					}
					return rgbToHex(cr);
				} else {
					return SOLVED;
				}
			}
		}
		if (rp.num_judged > 0 && rp.num_pending === 0)
			return FAILED;
		return '#333';
	}
</script>

<div
	role="row"
	class="grid grid-table items-center min-h-7 even:bg-white odd:bg-gray-100 my-0.5 gap-x-0.5"
	style="grid-template-columns: {col}">
	<div role="cell" class="justify-self-center pr-1">{row.rank}</div>
	{#if showLogo && mode === 'full'}
		<div role="cell" class="w-4 justify-self-center"><Logo ref={logo} /></div>
	{/if}
	{#if mode != 'summary'}
	<div role="cell" class="text-nowrap overflow-hidden text-ellipsis">
		<a href="/team/{team?.id}"
			>{team?.display_name || team?.name}</a>
	</div>
	{/if}

	{#if scoreboard_type === 'pass-fail'}
		<div role="cell" class="justify-self-center text-xl">
			{row.score.num_solved && row.score.num_solved > 0 ? row.score.num_solved : ''}
		</div>
		<div role="cell" class="justify-self-center">
			{timeToMin(row.score.total_time)}
		</div>
	{:else if scoreboard_type === 'score'}
		<div role="cell" class="justify-self-center">
			{row.score.score ? row.score.score : ''}
		</div>
	{/if}

	{#each problems as problem}
		{@const rp = row.problems?.find((p) => p.problem_id == problem.id)}
		{#if rp}
			{#if rp.num_judged > 0 || rp.num_pending > 0}
				<div
					role="cell"
					class="flex flex-row justify-center items-center w-full h-full rounded-md"
					style="background-color:{scoreBg(rp, problem)}">
					{#if scoreboard_type === 'pass-fail'}
						<div>
							{timeToMin(rp.time)}
							<span class="text-xs text-black/50"
								>{rp.num_judged + rp.num_pending}</span>
						</div>
					{:else if scoreboard_type === 'score'}
						<div>
							{rp.score}
							<span class="text-xs text-black/50"
								>{rp.num_judged + rp.num_pending}</span>
						</div>
					{/if}
				</div>
			{:else}
				<div role="cell"></div>
			{/if}
		{:else}
			<div role="cell" class="text-center text-sm text-gray-300">{#if mode === 'summary'}{problem.label}{/if}</div>
		{/if}
	{/each}
</div>