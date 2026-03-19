<script lang="ts">
	import type { FileReference } from '@icpctools/contest-api';
	import Image from './Image.svelte';

	interface Props {
		ref?: FileReference[];
		size?: number;
		tag?: string;
	}

	let { ref, size = 8, tag }: Props = $props();

	// Tailwind v4 can't detect dynamically constructed class names,
	// so we map size values to static strings it can scan.
	const sizeClasses: Record<number, string> = {
		/* eslint-disable @typescript-eslint/naming-convention */
		4: 'max-h-4 max-w-4 h-4 w-4',
		8: 'max-h-8 max-w-8 h-8 w-8',
		16: 'max-h-16 max-w-16 h-16 w-16',
		24: 'max-h-24 max-w-24 h-24 w-24'
		/* eslint-enable @typescript-eslint/naming-convention */
	};
</script>

<div class="{sizeClasses[size] ?? ''} flex items-center justify-center">
	<Image {ref} {size} {tag} />
</div>
