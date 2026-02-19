<script lang="ts">
	import type { JudgementType } from '@icpctools/contest-api';
	import { JudgementTypeUI } from '@icpctools/contest-ui';

	interface Props {
		judgementType?: JudgementType;
	}
	let { judgementType }: Props = $props();
</script>

<div class="max-w-full">
	{#if judgementType}
		<JudgementTypeUI {judgementType} />
	{/if}
</div>
