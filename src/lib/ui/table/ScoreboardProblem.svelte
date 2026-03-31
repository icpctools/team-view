<script lang="ts">
	import { timeToMin, type Problem, type ScoreboardProblem } from '@icpctools/contest-api';
	import { parseHexColor, rgbToHex, FAILED, SOLVED, PENDING, SCORING_MID } from './color-util.js';

	interface Props {
		scoreboard_type: 'pass-fail' | 'score';
		problem: Problem;
		rp: ScoreboardProblem;
		mode?: 'full' | 'summary';
	}
	let { scoreboard_type, rp, problem, mode = 'full' }: Props = $props();

	function scoreBg(rp: ScoreboardProblem, problem: Problem): string {
		if (rp.num_pending > 0) {
			return PENDING;
		}
		if (scoreboard_type === 'pass-fail') {
			if (rp.solved) return SOLVED;
		} else if (scoreboard_type === 'score') {
			if (rp.score) {
				if (problem.max_score) {
					const percent = (rp.score ?? 0) / problem.max_score;

					const c1 = parseHexColor(FAILED);
					const c2 = parseHexColor(SCORING_MID);
					const c3 = parseHexColor(SOLVED);
					let cr = [0, 0, 0];
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
		if (rp.num_judged > 0 && rp.num_pending === 0) {
			return FAILED;
		}
		// Return a color that works in both light and dark mode
		return 'transparent';
	}

	function attempts(rp: ScoreboardProblem): string {
		const num = rp.num_judged + rp.num_pending;
		if (num === 0) {
			return '';
		} else if (num === 1) {
			return '1 try';
		}
		return num + ' tries';
	}
</script>

{#if rp && (rp.num_judged > 0 || rp.num_pending > 0)}
	<div
		class="flex flex-col justify-center items-center self-stretch w-full rounded-md @container text-white dark:text-black"
		style="background-color:{scoreBg(rp, problem)}">
		{#if scoreboard_type === 'pass-fail'}
			<span class="@max-[30px]:hidden">{timeToMin(rp.time)}</span>
			<span class="text-xs text-gray-100 dark:text-gray-700 @max-[60px]:hidden">{attempts(rp)}</span>
		{:else if scoreboard_type === 'score'}
			<span class="@max-[30px]:hidden">{rp.score}</span>
			<span class="text-xs text-gray-100 dark:text-gray-700 @max-[60px]:hidden">{attempts(rp)}</span>
		{/if}
	</div>
{:else if mode === 'summary'}
	<div class="w-full text-center text-gray-300 dark:text-gray-600">
		{problem.label}
	</div>
{/if}
