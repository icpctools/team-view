<script lang="ts">
	import type { Judgement, JudgementType } from '@icpctools/contest-api';
	import { JudgementTypeUI } from '@icpctools/contest-ui';

	interface Props {
		judgement?: Judgement;
		judgementType?: JudgementType;
	}
	let { judgement, judgementType }: Props = $props();
</script>

{#if judgement}
	<JudgementTypeUI {judgementType} />
{/if}
