<script lang="ts">
	import type { Problem } from '@icpctools/contest-api';
	import { ProblemUI } from '@icpctools/contest-ui';

	interface Props {
		object: Problem;
		onclick?: () => void;
	}
	let { object, onclick }: Props = $props();
</script>

<div class="w-12">
	{#if object}
		<ProblemUI problem={object} {onclick} />
	{/if}
</div>
