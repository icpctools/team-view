<script lang="ts">
	import { getContestClock } from '@icpctools/contest-api';
	import type { Contest, ContestState } from '@icpctools/contest-api';
	import { onMount } from 'svelte';

	interface Props {
		contest?: Contest;
		contestState?: ContestState;
	}

	let { contest, contestState }: Props = $props();
	let clockTime: string = $state('?');

	let clock = $derived.by(() => {
		return clockTime;
	});

	// store props in a reactive wrapper so the interval can access current values
	let propsRef = $derived({ contest, contestState });

	onMount(() => {
		// set initial value, then schedule updates
		clockTime = getContestClock(propsRef.contest, propsRef.contestState) || 'Not scheduled';

		const clockInt = setInterval(
			() => {
				clockTime = getContestClock(propsRef.contest, propsRef.contestState) || 'Not scheduled';
			},
			propsRef.contest?.time_multiplier ? 50 : 350
		);

		return () => {
			clearInterval(clockInt);
		};
	});
</script>

<span
	aria-label="contest clock"
	class={{
		'whitespace-nowrap': true,
		'text-gray-400': !contest || !contest.start_time,
		'text-green-300': contest?.start_time && !contestState?.started,
		'text-blue-200': contestState?.frozen,
		'text-gray-300': contestState?.ended,
		'text-yellow-500': contest?.countdown_pause_time
	}}>
	{clock}
</span>
