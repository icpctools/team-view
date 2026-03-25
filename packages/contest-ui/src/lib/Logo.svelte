<script lang="ts">
	import type { FileReference } from '@icpctools/contest-api';
	import Image from './Image.svelte';

	interface Props {
		ref?: FileReference[];
		size?: 6 | 8 | 12 | 16;
		tag?: string;
	}

	let { ref, size = 6, tag }: Props = $props();
</script>

<div
	class={{
		'flex items-center justify-center': true,
		'max-h-6 max-w-6 h-6 w-6': size === 6,
		'max-h-8 max-w-8 h-8 w-8': size === 8,
		'max-h-12 max-w-12 h-12 w-12': size === 12,
		'max-h-16 max-w-16 h-16 w-16': size === 16
	}}>
	<Image {ref} {size} {tag} />
</div>
