<script lang="ts">
	import { type ScoreboardScore } from '@icpctools/contest-api';

	interface Props {
		score: ScoreboardScore;
	}
	let { score }: Props = $props();
</script>

<div class="text-xl">
	{score.num_solved && score.num_solved > 0 ? score.num_solved : ''}
</div>
