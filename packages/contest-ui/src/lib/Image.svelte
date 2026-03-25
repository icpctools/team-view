<script lang="ts">
	import type { FileReference } from '@icpctools/contest-api';
	import { bestLogo } from '@icpctools/contest-api';
	import { mode } from 'mode-watcher';

	interface Props {
		ref?: FileReference[];
		size: number;
		tag?: string;
	}

	let { ref, size, tag }: Props = $props();

	let tagg: string = $derived(tag ?? mode.current ?? '');

	let imgSrc = $derived(bestLogo(ref, size * 10, size * 10, tagg)?.href);

	function onError(): void {
		imgSrc = '/images/icpc-logo.png';
	}
</script>

{#if imgSrc}
	<img src={imgSrc} alt="logo" class="max-w-full max-h-full object-scale-down rounded-md" onerror={onError} />
{/if}
