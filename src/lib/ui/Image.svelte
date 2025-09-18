<script lang="ts">
	import type { FileReference } from '$lib/contest-types';
	import { ContestUtil } from '../contest-util';

	interface Props {
		ref?: FileReference[];
		size: number;
		tag?: string;
	}

	let { ref, size, tag }: Props = $props();

	const util = new ContestUtil();
	const bestRef = util.bestLogo(ref, size * 20, size * 20, tag);
	let imgSrc = $state(bestRef?.href);
	
	function onError(event: any): void {
		imgSrc = '/images/icpc-logo.png';
	}
</script>

{#if bestRef}
	<img src={imgSrc} alt="logo" class="w-full h-full object-scale-down rounded-md" onerror={onError} />
{/if}
