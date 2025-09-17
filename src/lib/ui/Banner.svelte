<script lang="ts">
	import type { FileReference } from '$lib/contest-types';
	import Image from './Image.svelte';

	interface Props {
		ref?: FileReference[];
		size?: 16 | 24 | 32 | 64;
		tag?: string;
	}

	let { ref, size = 16, tag }: Props = $props();
</script>

<div class="max-h-{size} h-{size} flex place-content-center">
	<Image {ref} {size} {tag} />
</div>
