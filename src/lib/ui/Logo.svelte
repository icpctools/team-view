<script lang="ts">
	import type { FileReference } from '$lib/contest-types';
	import Image from './Image.svelte';

	interface Props {
		ref?: FileReference[];
		size?: number;
	}

	let { ref, size = 8 }: Props = $props();
</script>

<div class="max-h-{size} max-w-{size} h-{size} w-{size} flex place-content-center">
  <Image {ref} {size} />
</div>
