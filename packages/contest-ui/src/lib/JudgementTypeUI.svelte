<script lang="ts">
	import type { JudgementType } from '@icpctools/contest-api';

	interface Props {
		judgementType?: JudgementType;
	}

	let { judgementType }: Props = $props();
</script>

<div
	class={{
		'flex items-center justify-center text-sm text-white rounded-sm w-10 cursor-default': true,
		'bg-green-600': judgementType?.solved,
		'bg-red-600': judgementType?.penalty,
		'bg-cyan-600': judgementType && !judgementType?.solved && !judgementType?.penalty
	}}>
	{judgementType?.id || '...'}
</div>
