<script lang="ts">
	import { getContestTime, getContestState } from '@icpctools/contest-api';
	import type { Contest } from '@icpctools/contest-api';
	import { onMount } from 'svelte';

	interface Props {
		contest?: Contest;
	}

	let { contest }: Props = $props();
	let clock: string | undefined = $derived('?');

	let state = $derived(getContestState(contest));

	onMount(() => {
		// set initial value, then schedule updates
		clock = getContestTime(contest, true);

		const clockInt = setInterval(
			() => {
				clock = getContestTime(contest, true);
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
		'text-gray-400': state === 'unscheduled',
	'text-green-300':state === 'countdown',
	'text-blue-200': state === 'frozen',
	'text-gray-300': state === 'finished',
	'text-yellow-500': state === 'paused'
	}}>
	{clock}
</span>
