<script lang="ts">
	import type { JudgementType } from '@icpctools/contest-api';
	import { JudgementTypeUI } from '@icpctools/contest-ui';

	interface Props {
		object?: JudgementType;
	}
	let { object }: Props = $props();
</script>

<div class="max-w-full">
	{#if object}
		<JudgementTypeUI judgementType={object} />
	{/if}
</div>
