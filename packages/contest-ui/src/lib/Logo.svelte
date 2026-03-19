<script lang="ts">
	import type { FileReference } from '@icpctools/contest-api';
	import Image from './Image.svelte';

	interface Props {
		ref?: FileReference[];
		size?: number;
		tag?: string;
	}

	let { ref, size = 8, tag }: Props = $props();
</script>

<div class="max-h-{size} max-w-{size} h-{size} w-{size} flex min-w-0 min-h-0 place-content-center">
	<Image {ref} {size} {tag} />
</div>
