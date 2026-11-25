<script lang="ts">
	import {
		formatContestTime,
		getContestTime,
		getRemainingContestTime,
		parseRelTime,
		type Contest,
		type ContestState
	} from '@icpctools/contest-api';
	import { onMount } from 'svelte';
	import Arcs from './Arcs.svelte';

	interface Props {
		contest?: Contest;
		state?: ContestState;
		mode?: 'contest-time' | 'strict-contest-time' | 'remaining-contest-time';
	}
	let { contest, state, mode = 'contest-time' }: Props = $props();

	let clock: string | undefined = $derived('?');

	let maxH = $derived(5);

	let arcH = $derived(0);
	let arcM = $derived(0);
	let arcS = $derived(0);

	onMount(() => {
		// set initial value, then schedule updates
		setupClock();

		const clockInt = setInterval(() => setupClock(), contest && contest.time_multiplier ? 50 : 350);

		return () => {
			clearInterval(clockInt);
		};
	});

	function mod(n: number, m: number): number {
		return (n * 100) / m;
	}

	function setupClock(): void {
		const duration = parseRelTime(contest?.duration);
		maxH = duration ? Math.floor(duration / 3600000) : 5;
		let time: number | undefined;

		if (mode === 'contest-time') {
			// counts up from -time through 0 to duration to +time
			time = getContestTime(contest, state);
			clock = formatContestTime(time);

			if (!time) {
				arcS = 0;
				arcM = 0;
				arcH = 0;
				return;
			}
			const ss = Math.floor(time / 1000.0);
			arcS = mod(Math.floor(ss + 60), 120);
			arcM = mod(Math.floor(ss / 60 + 60), 120);
			arcH = mod(Math.floor(ss / 3600), maxH);
		} else if (mode === 'strict-contest-time') {
			// counts up, but only from 0 to duration
			const time = Math.min(Math.max(0, getContestTime(contest, state) ?? 0), duration ?? 0);
			clock = formatContestTime(time);

			if (!time) {
				arcS = 0;
				arcM = 0;
				arcH = 0;
				return;
			}
			const ss = Math.floor(time / 1000.0);
			arcS = mod(Math.floor(ss + 60), 120);
			arcM = mod(Math.floor(ss / 60 + 60), 120);
			arcH = mod(Math.floor(ss / 3600), maxH);
		} else if (mode === 'remaining-contest-time') {
			// counts down from duration to 0
			time = getRemainingContestTime(contest, state);
			clock = formatContestTime(time);
			time = (duration ?? 0) - (time ?? 0);
			maxH = duration ? Math.floor(duration / 7200000) : 5;

			if (!time) {
				arcS = 0;
				arcM = 0;
				arcH = 0;
				return;
			}
			const ss = Math.floor(time / 1000.0);
			arcS = mod(Math.floor(ss + 60), 120);
			arcM = mod(Math.floor(ss / 60 + 60), 120);
			arcH = mod(Math.floor(ss / 3600), maxH);
		}
	}
</script>

<div class="w-28 h-28 relative">
	<Arcs a={arcH} b={arcM} c={arcS} class="absolute inset-0" />
	<div class="flex absolute inset-0 items-center justify-center text-xl text-black dark:text-white font-mono">
		{clock}
	</div>
</div>
