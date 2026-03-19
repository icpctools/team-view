<script lang="ts">
	import type { FileReference } from '@icpctools/contest-api';
	import Image from './Image.svelte';

	interface Props {
		ref?: FileReference[];
		size?: number;
	}

	let { ref, size = 24 }: Props = $props();

	const sizeClasses: Record<number, string> = {
		/* eslint-disable @typescript-eslint/naming-convention */
		8: 'max-h-8 max-w-8 h-8 w-8',
		16: 'max-h-16 max-w-16 h-16 w-16',
		24: 'max-h-24 max-w-24 h-24 w-24'
		/* eslint-enable @typescript-eslint/naming-convention */
	};
</script>

<div class="{sizeClasses[size] ?? ''} flex items-center justify-center">
	<Image {ref} {size} />
</div>
