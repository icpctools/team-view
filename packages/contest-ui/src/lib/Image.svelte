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

	let computedSrc = $derived(bestLogo(ref, size * 10, size * 10, tagg)?.href);

	let hasError = $state(false);
	let isLoading = $state(true);

	let displaySrc = $derived(hasError ? '/images/icpc-logo.png' : (computedSrc ?? '/images/icpc-logo.png'));

	function onError(): void {
		hasError = true;
		isLoading = false;
	}

	function onLoad(): void {
		isLoading = false;
	}

	// Reset error state when source changes
	$effect(() => {
		if (computedSrc) {
			hasError = false;
			isLoading = true;
		}
	});
</script>

<img
	src={displaySrc}
	alt="logo"
	class={{
		'max-w-full max-h-full object-scale-down rounded-md': true,
		'opacity-0': isLoading,
		'opacity-100': !isLoading
	}}
	onerror={onError}
	onload={onLoad} />
