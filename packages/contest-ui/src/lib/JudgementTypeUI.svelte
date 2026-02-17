<script lang="ts">
	import type { JudgementType } from '@icpctools/contest-api';

	interface Props {
		judgementType?: JudgementType;
	}

	let { judgementType }: Props = $props();
</script>

{#if judgementType}
	<div
		class="justify-self-center text-center text-sm text-white rounded-sm w-10 cursor-default"
		class:bg-green-600={judgementType.solved}
		class:bg-red-600={judgementType.penalty}
		class:bg-cyan-600={!judgementType.solved && !judgementType.penalty}>
		{judgementType.id}
	</div>
{:else}
	<div class="justify-self-center text-center text-sm w-10">...</div>
{/if}
