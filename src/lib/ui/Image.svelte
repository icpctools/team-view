<script lang="ts">
	import type { FileReference } from '$lib/contest-types';
	import { ContestUtil } from '../contest-util';

	interface Props {
		ref?: FileReference[];
		size: number;
	}

	let { ref, size }: Props = $props();

	const util = new ContestUtil();
	const bestRef = util.bestSquareLogo(ref, size * 20);
	const imgSrc = bestRef?.href;
</script>

{#if bestRef}
  <img src={imgSrc} alt="logo" class="w-full h-full object-scale-down rounded-md" />
{/if}
