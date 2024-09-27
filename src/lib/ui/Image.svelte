<script lang="ts">
	import type { FileReferenceJSON } from '$lib/contest-types';
	import { ContestUtil } from '../contest-util';

	export let url: string = 'https://localhost:8443/api/contests';
	export let ref: FileReferenceJSON[] | undefined;
	export let size: number;

	const util = new ContestUtil();
	const bestRef = util.bestSquareLogo(ref, size);
	const imgSrc = url.substring(0, 27) + bestRef?.href;
</script>

{#if bestRef}
	<div class="max-h-{size} max-w-{size}">
		<img src={imgSrc} alt="logo" class="object-scale-down h-{size} rounded-md" />
	</div>
{/if}
