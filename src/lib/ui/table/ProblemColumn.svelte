<script lang="ts">
	import type { Problem } from '@icpctools/contest-api';
	import { ProblemUI } from '@icpctools/contest-ui';

	interface Props {
		problem: Problem;
		onclick?: () => void;
	}
	let { problem, onclick }: Props = $props();
</script>

<div class="w-12">
	{#if problem}
		<ProblemUI {problem} {onclick} />
	{/if}
</div>
