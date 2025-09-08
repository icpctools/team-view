<script lang="ts">
	import type { JudgementTypeJSON } from '$lib/contest-types';

	interface Props {
		judgement_type?: JudgementTypeJSON;
	}

	let { judgement_type }: Props = $props();
</script>

{#if judgement_type}
	<div
		class="justify-self-center text-center text-sm text-white rounded-sm w-10"
		class:bg-green-600={judgement_type.solved}
		class:bg-red-600={judgement_type.penalty}
		class:bg-cyan-600={!judgement_type.solved && !judgement_type.penalty}>
		{judgement_type.id}
	</div>
{/if}
