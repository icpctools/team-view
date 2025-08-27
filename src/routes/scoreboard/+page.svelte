<script lang="ts">
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import { ContestUtil } from '$lib/contest-util';
	import Logo from '$lib/ui/Logo.svelte';
	import { flip } from 'svelte/animate';
	import { parseHexColor, darker, rgbToHex } from '$lib/color-util.js';

	let { data } = $props();

	let cols: string[] = ['40px'];
	if (data.hasLogos) {
		cols.push('40px');
	}
	cols.push('425px');

	cols.push('60px');
	cols.push('60px');

	data.problems.forEach((_p) => cols.push('1fr'));

	let col = cols.join(' ');

	const util = new ContestUtil();

	let pStyle: string[] = [];
	data.problems.forEach((p) => {
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

	onMount(() => {
		const interval = setInterval(() => {
			invalidateAll();
		}, 3000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<div class="w-full text-sm p-2" role="table" aria-label="scoreboard">
	<!-- Table header -->
	<div role="rowgroup" class="sticky top-0 bg-white/90 font-semibold">
		<div
			role="row"
			class="grid grid-table gap-x-0.5 min-h-7 py-2"
			style="grid-template-columns: {col}">
			<div role="cell">Rank</div>
			{#if data.hasLogos}
				<div role="cell"></div>
			{/if}
			<div role="cell">Team</div>
			<div role="cell" class="justify-self-center">Solved</div>
			<div role="cell" class="justify-self-center">Penalty</div>
			{#each data.problems as problem, ind}
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

	<!-- Table rows -->
	<div role="rowgroup">
		{#each data.scoreboard.rows as row, i (row.team_id)}
			<div
				role="row"
				class="grid grid-table items-center min-h-7 even:bg-white odd:bg-gray-100 my-0.5 gap-x-0.5"
				style="grid-template-columns: {col}"
				animate:flip>
				<div role="cell" class="justify-self-center pr-1">{row.rank}</div>
				{#if data.hasLogos}
					<div role="cell" class="w-4 justify-self-center"><Logo ref={data.logos[i]} /></div>
				{/if}
				<div role="cell" class="text-nowrap overflow-hidden text-ellipsis">
					<a href="/team/{data.teams[i]?.id}"
						>{data.teams[i]?.display_name || data.teams[i]?.name}</a>
				</div>

				<div role="cell" class="justify-self-center text-xl">
					{row.score.num_solved && row.score.num_solved > 0 ? row.score.num_solved : ''}
				</div>
				<div role="cell" class="justify-self-center">
					{row.score.total_time
						? util.formatTimeInMin(util.parseRelTime(row.score.total_time))
						: ''}
					{row.score.score ? row.score.score : ''}
				</div>

				{#each data.problems as problem}
					{@const rp = row.problems?.find((p) => p.problem_id == problem.id)}
					{#if rp}
						{#if rp.num_judged > 0}
							<div
								role="cell"
								class="flex flex-row justify-center items-center w-full h-full rounded-md"
								class:bg-green-500={rp.solved || (rp.score && rp.score > 0)}
								class:bg-yellow-500={rp.num_pending > 0 &&
									!rp.solved &&
									(!rp.score || rp.score == 0)}
								class:bg-red-500={!rp.solved && rp.num_judged > 0 && rp.num_pending == 0}>
								<div>
									{rp.num_judged + rp.num_pending}
									<span class="text-xs text-black/50"
										>{rp.time ? util.formatTimeInMin(util.parseRelTime(rp.time)) : ''}</span
									>
								</div>
							</div>
						{:else}
							<div role="cell"></div>
						{/if}
					{:else}
						<div role="cell" class="text-center"></div>
					{/if}
				{/each}
			</div>
		{/each}
	</div>
</div>
