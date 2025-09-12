<script lang="ts">
	import { getContestTime, getContestState } from '$lib/contest-time-util';
	import type { Contest } from '$lib/contest-types';
	import { onMount } from 'svelte';

	interface Props {
		contest?: Contest;
	}

	let { contest }: Props = $props();
	let clock: string | undefined = $derived('?');

	let state = $derived(getContestState(contest));

	onMount(() => {
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
	class:text-gray-400={state === 'unscheduled'}
	class:text-green-300={state === 'countdown'}
	class:text-blue-200={state === 'frozen'}
	class:text-gray-300={state === 'finished'}
	class:text-yellow-500={state === 'paused'}>
	{clock}
</span>
