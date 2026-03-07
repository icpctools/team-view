<script lang="ts">
	import { getContestTime, formatContestTime, getRemainingContestTime } from '@icpctools/contest-api';
	import type { Contest, ContestState } from '@icpctools/contest-api';
	import { onMount } from 'svelte';

	interface Props {
		contest?: Contest;
		contestState?: ContestState;
		mode?: 'contest-time' | 'remaining-time' | 'wall-clock';
	}

	let { contest, contestState, mode = 'contest-time' }: Props = $props();
	let clockTime: string = $state('?');

	let clock = $derived.by(() => {
		return clockTime;
	});

	// store props in a reactive wrapper so the interval can access current values
	let propsRef = $derived({ contest, contestState });

	onMount(() => {
		// set initial value, then schedule updates
		updateTime();

		const clockInt = setInterval(() => updateTime(), propsRef.contest?.time_multiplier ? 50 : 350);

		return () => {
			clearInterval(clockInt);
		};
	});

	function updateTime(): void {
		if (mode === 'contest-time') {
			clockTime = formatContestTime(getContestTime(propsRef.contest, propsRef.contestState)) ?? 'Not scheduled';
		} else if (mode === 'remaining-time') {
			clockTime = formatContestTime(getRemainingContestTime(propsRef.contest, propsRef.contestState), true) ?? '';
		} else if (mode === 'wall-clock') {
			const now = new Date(Date.now());
			let hours = now.getHours();
			const systemSettings = new Intl.DateTimeFormat(undefined, { hour: 'numeric' }).resolvedOptions();
			if (systemSettings.hour12) {
				hours %= 12;
			}
			clockTime = formatContestTime((hours * 3600 + now.getMinutes() * 60 + now.getSeconds()) * 1000) ?? '';
		}
	}
</script>

<span
	aria-label="contest clock"
	class={{
		'whitespace-nowrap': true,
		'text-gray-400': !contest || !contest.start_time,
		'text-green-300': contest?.start_time && !contestState?.started,
		'text-blue-200': contestState?.frozen,
		'text-red-700': contestState?.ended,
		'text-yellow-500': contest?.countdown_pause_time
	}}>
	{clock}
</span>
