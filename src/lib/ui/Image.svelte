<script lang="ts">
	import type { FileReference } from 'contest-api';
	import { ContestUtil } from 'contest-api';
	import { mode } from 'mode-watcher';

	interface Props {
		ref?: FileReference[];
		size: number;
		tag?: string;
	}

	let { ref, size, tag }: Props = $props();

	let tagg: string = $derived(tag ?? mode.current ?? '');

	const util = new ContestUtil();
	let imgSrc = $derived(util.bestLogo(ref, size * 20, size * 20, tagg)?.href);

	function onError(): void {
		imgSrc = '/images/icpc-logo.png';
	}
</script>

{#if imgSrc}
	<img src={imgSrc} alt="logo" class="w-full h-full object-scale-down rounded-md" onerror={onError} />
{/if}
