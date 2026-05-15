<script lang="ts">
	import { getContestClock, getContestState } from '@icpctools/contest-api';
	import type { Contest } from '@icpctools/contest-api';
	import { onMount } from 'svelte';

	interface Props {
		contest?: Contest;
	}

	let { contest }: Props = $props();
	let clockTime: string = $state('?');

	let contestState = $derived(getContestState(contest));
	let clock = $derived(clockTime);

	onMount(() => {
		// set initial value, then schedule updates
		clockTime = getContestClock(contest) || 'Not scheduled';

		const clockInt = setInterval(
			() => {
				clockTime = getContestClock(contest) || 'Not scheduled';
			},
			contest && contest.time_multiplier ? 50 : 350
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
		'text-gray-400': contestState === 'unscheduled',
		'text-green-300': contestState === 'countdown',
		'text-blue-200': contestState === 'frozen',
		'text-gray-300': contestState === 'finished',
		'text-yellow-500': contestState === 'paused'
	}}>
	{clock}
</span>
