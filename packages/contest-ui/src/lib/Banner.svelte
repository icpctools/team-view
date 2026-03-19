<script lang="ts">
	import type { FileReference } from '@icpctools/contest-api';
	import Image from './Image.svelte';

	interface Props {
		ref?: FileReference[];
		size?: 16 | 24 | 32 | 64;
		tag?: string;
	}

	let { ref, size = 16, tag }: Props = $props();

	const sizeClasses: Record<number, string> = {
		/* eslint-disable @typescript-eslint/naming-convention */
		16: 'max-h-16 h-16',
		24: 'max-h-24 h-24',
		32: 'max-h-32 h-32',
		64: 'max-h-64 h-64'
		/* eslint-enable @typescript-eslint/naming-convention */
	};
</script>

<div class="{sizeClasses[size] ?? ''} flex items-center justify-center">
	<Image {ref} {size} {tag} />
</div>
