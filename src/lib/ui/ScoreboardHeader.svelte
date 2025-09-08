<script lang="ts">
	import { parseHexColor, darker, rgbToHex } from '$lib/color-util.js';
	import type { ProblemJSON } from '$lib/contest-types.js';
	import { getColumns } from './scoreboard-util';

	interface Props {
		showLogo?: boolean;
		scoreboard_type?: 'pass-fail' | 'score';
		problems: ProblemJSON[];
	}

	let { scoreboard_type = 'pass-fail', problems, showLogo = true }: Props = $props();

	let col = getColumns(scoreboard_type, problems?.length, showLogo);

	let pStyle: string[] = [];
	problems.forEach((p) => {
		if (p.rgb) {
			let col = parseHexColor(p.rgb);
			let fg = '#fff';
			if (col && col[0] + col[1] + col[2] > 450) {
				fg = '#000';
			}
			let border = p.rgb;
			if (col) {
				border = rgbToHex(darker(col));
			}

			pStyle.push('background-color:' + p.rgb + ';color:' + fg + ';border-color:' + border + ';');
		} else {
			pStyle.push('background-color:#fff;color:#000;border:#000;');
		}
	});
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
		{#each problems as problem, ind}
			<a class="justify-self-center" href="/problem/{problem.id}">
				<div
					role="cell"
					class="text-center uppercase border-[1px] rounded-md w-12 h-6"
					style={pStyle[ind]}>
					{problem.label}
				</div>
			</a>
		{/each}
	</div>
</div>
